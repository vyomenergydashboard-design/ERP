// Design confirmation follows the full Sales gate (AGENTS.md §8; owner decision 2026-11-19).
//
// A panel can be held in Sales by order-level Sales work (the "Upload PO" step / no PO) even when it
// has no unit-level Sales steps. design-confirm used to check only unit-level Sales steps, so Design
// could pre-confirm such a panel (200). Now Design gets 400 while the panel is awaiting Sales;
// Admin and Manager keep their override.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const tokens = {
  Design: jwt.sign({ id: 31, username: 'design', role: 'Design' }, JWT_SECRET, { expiresIn: '1h' }),
  Admin: jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' }),
  Manager: jwt.sign({ id: 1, username: 'manager', role: 'Manager' }, JWT_SECRET, { expiresIn: '1h' })
};

async function confirm(unitId, role) {
  const res = await fetch(`${API_BASE}/api/units/${unitId}/design-confirm`, {
    method: 'POST', headers: { Authorization: `Bearer ${tokens[role]}` }
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

const confirmed = async (unitId) =>
  (await pool.query('SELECT design_confirmed FROM order_units WHERE id = $1', [unitId])).rows[0].design_confirmed;
const resetConfirmation = (unitId) =>
  pool.query('UPDATE order_units SET design_confirmed = false, design_confirmed_at = NULL, design_confirmed_by = NULL WHERE id = $1', [unitId]);

async function run() {
  console.log('====================================================');
  console.log('  TEST SUITE: DESIGN CONFIRM FOLLOWS THE SALES GATE');
  console.log('====================================================\n');

  let orderId = null;
  try {
    const ts = Date.now();
    const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
    orderId = (await pool.query(
      `INSERT INTO orders (order_number, company_location_id, priority, created_by, status)
       VALUES ($1, $2, 'Medium', 1, 'Active') RETURNING id`,
      [`TEST-DCSG-${ts}`, locId]
    )).rows[0].id;
    const lineItemId = (await pool.query(
      `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
       VALUES ($1, $2, 'Gate panel', 1, 'Nos', 1000, 1000) RETURNING id`,
      [orderId, `TEST-DCSG-${ts}-01`]
    )).rows[0].id;
    const unitId = (await pool.query(
      `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, classification, design_confirmed, current_dept)
       VALUES ($1, $2, $3, '9903', 'Standard', FALSE, 'Sales') RETURNING id`,
      [orderId, lineItemId, `9997${ts % 10000}1`]
    )).rows[0].id;
    // No unit-level Sales steps: only the order-level "Upload PO" step (pending, no PO) holds it in Sales.
    await pool.query(
      `INSERT INTO unit_steps (order_unit_id, name, dept, status, step_order)
       VALUES ($1, 'Review & Classify', 'Design', 'pending', 1), ($1, 'Release Documents', 'Design', 'pending', 2)`,
      [unitId]
    );
    const uploadPoStepId = (await pool.query(
      `INSERT INTO order_steps (order_id, dept, name, status, step_order) VALUES ($1, 'Sales', 'Upload PO', 'pending', 1) RETURNING id`,
      [orderId]
    )).rows[0].id;

    // 1. Design is refused while the order's Upload PO is pending, and nothing is saved.
    let r = await confirm(unitId, 'Design');
    assert.strictEqual(r.status, 400, `Design confirm while Upload PO is pending: expected 400, got ${r.status} ${JSON.stringify(r.data)}`);
    assert.match(r.data.error || '', /Awaiting Sales clearance/, `unexpected error: ${r.data.error}`);
    assert.strictEqual(await confirmed(unitId), false, 'a refused confirmation must not be saved');
    console.log('✓ Design: refused (400) while the order-level Upload PO is pending; nothing saved');

    // 2. Admin and Manager keep their override.
    r = await confirm(unitId, 'Admin');
    assert.strictEqual(r.status, 200, `Admin override: expected 200, got ${r.status} ${JSON.stringify(r.data)}`);
    assert.strictEqual(await confirmed(unitId), true);
    await resetConfirmation(unitId);
    r = await confirm(unitId, 'Manager');
    assert.strictEqual(r.status, 200, `Manager override: expected 200, got ${r.status} ${JSON.stringify(r.data)}`);
    assert.strictEqual(await confirmed(unitId), true);
    const dept = (await pool.query('SELECT current_dept FROM order_units WHERE id = $1', [unitId])).rows[0].current_dept;
    assert.strictEqual(dept, 'Sales', `an override must not move the panel out of Sales (got ${dept})`);
    console.log('✓ Admin and Manager: override still works (200), and the panel stays in Sales');

    // 3. Once Sales has done Upload PO, Design can confirm.
    await resetConfirmation(unitId);
    await pool.query(`UPDATE order_steps SET status = 'done' WHERE id = $1`, [uploadPoStepId]);
    r = await confirm(unitId, 'Design');
    assert.strictEqual(r.status, 200, `Design confirm after Upload PO is done: expected 200, got ${r.status} ${JSON.stringify(r.data)}`);
    assert.strictEqual(await confirmed(unitId), true);
    console.log('✓ Design: allowed (200) once the order-level Upload PO is done');

    console.log('\n====================================================');
    console.log('  ALL DESIGN-CONFIRM SALES-GATE TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    if (orderId) {
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
