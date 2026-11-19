// Reads must not write: Purchase auto-completion runs on the write paths and once at startup,
// never when someone opens the Purchase worklist or a unit's steps (owner decision 2026-11-19).
//
// GET /api/dept-worklist/Purchase (and /all) and GET /api/units/:unitId/steps used to run
// evaluatePurchaseAutoCompletion, so merely viewing could complete "Procure Materials" and move
// panels. The write paths (unit edits, batch "Purchase not applicable", vendor PO create / status)
// evaluate the units they change; sweepPurchaseAutoCompletion catches anything else at startup.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import { sweepPurchaseAutoCompletion } from '../services/purchaseAutoCompletion.js';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
const ALL_NA = {
  purchase_cat_panel: 'NA', purchase_cat_automation: 'NA', purchase_cat_low_voltage: 'NA', purchase_cat_wires: 'NA'
};

async function api(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  assert.ok(res.ok, `${method} ${path}: expected 2xx, got ${res.status} ${text.slice(0, 200)}`);
}

const procureStatus = async (unitRowId) => (await pool.query(
  `SELECT status FROM unit_steps WHERE order_unit_id = $1 AND name = 'Procure Materials'`, [unitRowId])).rows[0].status;
const dept = async (unitRowId) => (await pool.query(
  'SELECT current_dept FROM order_units WHERE id = $1', [unitRowId])).rows[0].current_dept;

async function run() {
  console.log('====================================================');
  console.log('  TEST SUITE: READS DO NOT RUN PURCHASE AUTO-COMPLETION');
  console.log('====================================================\n');

  let orderId = null;
  try {
    const ts = Date.now();
    const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
    orderId = (await pool.query(
      `INSERT INTO orders (order_number, company_location_id, priority, created_by, status)
       VALUES ($1, $2, 'Medium', 1, 'Active') RETURNING id`, [`TEST-RO-${ts}`, locId]
    )).rows[0].id;
    await pool.query(
      `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
       VALUES ('Order', $1, 'PO', 'po.pdf', 'uploads/po.pdf', 1)`, [orderId]
    );
    const lineItemId = (await pool.query(
      `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
       VALUES ($1, $2, 'Read-only panel', 1, 'Nos', 1000, 1000) RETURNING id`, [orderId, `TEST-RO-${ts}-01`]
    )).rows[0].id;
    const serial = `9995${ts % 10000}1`;
    // A panel in Purchase whose four categories are already all N/A (set directly, as legacy data
    // would be): the only thing missing is the auto-completion run.
    const unitRowId = (await pool.query(
      `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, classification, design_confirmed, current_dept, status, custom_fields)
       VALUES ($1, $2, $3, '9904', 'Non-Standard', TRUE, 'Purchase', 'Material Waiting', $4) RETURNING id`,
      [orderId, lineItemId, serial, JSON.stringify(ALL_NA)]
    )).rows[0].id;
    await pool.query(
      `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
       VALUES ('Unit', $1, 'Drawing', 'd.pdf', 'uploads/d.pdf', 1), ('Unit', $1, 'BOM', 'b.xlsx', 'uploads/b.xlsx', 1)`, [unitRowId]
    );
    const steps = [['Review & Classify', 'Design', 'done'], ['Release Documents', 'Design', 'done'],
      ['Procure Materials', 'Purchase', 'pending'], ['Issue Materials', 'Stores', 'pending']];
    for (const [i, [name, d, status]] of steps.entries()) {
      await pool.query(
        `INSERT INTO unit_steps (order_unit_id, name, dept, status, step_order) VALUES ($1, $2, $3, $4, $5)`,
        [unitRowId, name, d, status, i + 1]
      );
    }

    // 1. Reads change nothing.
    await api('GET', '/api/dept-worklist/Purchase');
    await api('GET', '/api/dept-worklist/all');
    await api('GET', `/api/units/${unitRowId}/steps`);
    assert.strictEqual(await procureStatus(unitRowId), 'pending', 'a read completed "Procure Materials"');
    assert.strictEqual(await dept(unitRowId), 'Purchase', 'a read moved the panel');
    console.log('✓ opening the Purchase / all worklist and the unit steps changes nothing');

    // 2. The startup sweep catches it.
    const derived = [];
    const updated = await sweepPurchaseAutoCompletion(pool, async (id) => { derived.push(Number(id)); });
    assert.ok(updated.some(u => Number(u.unitId) === Number(unitRowId)), 'the sweep should complete this unit');
    assert.strictEqual(await procureStatus(unitRowId), 'done');
    assert.ok(derived.includes(Number(unitRowId)), 'the sweep should re-derive the completed unit');
    console.log('✓ the startup sweep completes "Procure Materials" for panels in Purchase');

    // 3. A write still auto-completes: reset, drop one N/A, then set it again through a unit edit.
    await pool.query(`UPDATE unit_steps SET status = 'pending' WHERE order_unit_id = $1 AND name = 'Procure Materials'`, [unitRowId]);
    await pool.query(`UPDATE order_units SET current_dept = 'Purchase', custom_fields = custom_fields - 'purchase_cat_wires' WHERE id = $1`, [unitRowId]);
    await api('PUT', `/api/units/${serial}`, { custom_fields: { purchase_cat_wires: 'NA' } });
    assert.strictEqual(await procureStatus(unitRowId), 'done', 'a unit edit should still auto-complete');
    console.log('✓ editing the unit (setting the last category N/A) still auto-completes');

    console.log('\n====================================================');
    console.log('  ALL READ-ONLY WORKLIST TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    if (orderId) {
      await pool.query(`DELETE FROM documents WHERE (entity_type = 'Order' AND entity_id = $1)
                        OR (entity_type = 'Unit' AND entity_id IN (SELECT id FROM order_units WHERE order_id = $1))`, [orderId]);
      await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
      console.log('Cleaned up test order:', orderId);
    }
    await pool.end();
  }
}

run().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
