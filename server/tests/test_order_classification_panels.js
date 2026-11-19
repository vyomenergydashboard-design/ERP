// Changing an order's classification updates its existing panels that have not passed Design
// (owner decision 2026-11-19), and re-checks their Drawing / BOM requirement.
//
// Standard panels can take Drawing / BOM from the part-number master; Non-Standard panels only count
// documents uploaded to the panel or order. Panels already in Purchase or later keep the type they
// were built with, so switching to Non-Standard can never send them back to Design. Cancelled panels
// are left alone.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

async function setClassification(orderId, classification) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/classification`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({ classification })
  });
  const data = await res.json().catch(() => ({}));
  assert.strictEqual(res.status, 200, `set ${classification}: expected 200, got ${res.status} ${JSON.stringify(data)}`);
  return data;
}

const unitState = async (id) => (await pool.query(
  `SELECT ou.classification, ou.current_dept,
          (SELECT status FROM unit_steps WHERE order_unit_id = ou.id AND name = 'Release Documents') AS release_docs
   FROM order_units ou WHERE ou.id = $1`, [id])).rows[0];

async function run() {
  console.log('====================================================');
  console.log('  TEST SUITE: ORDER CLASSIFICATION UPDATES PANELS');
  console.log('====================================================\n');

  let orderId = null;
  let partId = null;
  try {
    const ts = Date.now();
    const partNumber = `TEST-PN-${ts}`;
    partId = (await pool.query(
      `INSERT INTO part_number_masters (part_number, description) VALUES ($1, 'Classification test part') RETURNING id`, [partNumber]
    )).rows[0].id;
    await pool.query(
      `INSERT INTO part_number_documents (part_number_id, doc_type, file_name, file_path)
       VALUES ($1, 'Drawing', 'pn_drawing.pdf', 'uploads/pn_drawing.pdf'), ($1, 'BOM', 'pn_bom.xlsx', 'uploads/pn_bom.xlsx')`,
      [partId]
    );

    const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
    orderId = (await pool.query(
      `INSERT INTO orders (order_number, company_location_id, priority, created_by, status, classification)
       VALUES ($1, $2, 'Medium', 1, 'Active', 'Standard') RETURNING id`,
      [`TEST-CLASS-${ts}`, locId]
    )).rows[0].id;
    // Sales is satisfied through an order PO document (no order-level Sales steps).
    await pool.query(
      `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
       VALUES ('Order', $1, 'PO', 'po.pdf', 'uploads/po.pdf', 1)`, [orderId]
    );
    const lineItemId = (await pool.query(
      `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number, quantity, unit, unit_price, total_price)
       VALUES ($1, $2, 'Class panel', $3, 3, 'Nos', 1000, 3000) RETURNING id`,
      [orderId, `TEST-CLASS-${ts}-01`, partNumber]
    )).rows[0].id;

    const addUnit = async (suffix, dept, confirmed, hold, steps) => {
      const id = (await pool.query(
        `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, classification, design_confirmed, current_dept, hold_status)
         VALUES ($1, $2, $3, $4, 'Standard', $5, $6, $7) RETURNING id`,
        [orderId, lineItemId, `9996${ts % 10000}${suffix}`, `99${suffix}`, confirmed, dept, hold]
      )).rows[0].id;
      for (const [i, [name, stepDept, status]] of steps.entries()) {
        await pool.query(
          `INSERT INTO unit_steps (order_unit_id, name, dept, status, step_order) VALUES ($1, $2, $3, $4, $5)`,
          [id, name, stepDept, status, i + 1]
        );
      }
      return id;
    };
    const inDesign = [['Review & Classify', 'Design', 'pending'], ['Release Documents', 'Design', 'pending'], ['Receive Shortfall', 'Purchase', 'pending']];
    const inPurchase = [['Review & Classify', 'Design', 'done'], ['Release Documents', 'Design', 'done'], ['Receive Shortfall', 'Purchase', 'pending']];
    const unitA = await addUnit('1', 'Design', false, 'None', inDesign);      // not past Design
    const unitB = await addUnit('2', 'Purchase', true, 'None', inPurchase);   // past Design, relies on part-number docs
    const unitC = await addUnit('3', 'Design', false, 'Cancelled', inDesign); // cancelled

    // 1. Standard -> Non-Standard
    await setClassification(orderId, 'Non-Standard');
    let a = await unitState(unitA);
    let b = await unitState(unitB);
    const c = await unitState(unitC);
    assert.strictEqual(a.classification, 'Non-Standard', `panel in Design must follow the order (got ${a.classification})`);
    assert.strictEqual(a.current_dept, 'Design');
    assert.notStrictEqual(a.release_docs, 'done', 'Non-Standard panel without uploaded documents cannot have Release Documents done');
    assert.strictEqual(b.classification, 'Standard', `panel past Design must keep its type (got ${b.classification})`);
    assert.strictEqual(b.current_dept, 'Purchase', `panel past Design must not move back (got ${b.current_dept})`);
    assert.strictEqual(c.classification, 'Standard', 'a cancelled panel must not change');
    console.log('✓ to Non-Standard: the Design panel follows; the Purchase panel keeps Standard and stays in Purchase; cancelled unchanged');

    // 2. Design confirms panel A, then the order goes back to Standard: A finds the part-number
    //    Drawing / BOM again and moves on to Purchase.
    await pool.query(`UPDATE order_units SET design_confirmed = true WHERE id = $1`, [unitA]);
    await pool.query(`UPDATE unit_steps SET status = 'done' WHERE order_unit_id = $1 AND name = 'Review & Classify'`, [unitA]);
    await setClassification(orderId, 'Standard');
    a = await unitState(unitA);
    b = await unitState(unitB);
    assert.strictEqual(a.classification, 'Standard');
    assert.strictEqual(a.release_docs, 'done', `Release Documents must be re-checked and done (got ${a.release_docs})`);
    assert.strictEqual(a.current_dept, 'Purchase', `confirmed Standard panel with part-number docs must move on (got ${a.current_dept})`);
    assert.strictEqual(b.current_dept, 'Purchase');
    console.log('✓ back to Standard: the confirmed panel is re-checked, finds the part-number Drawing/BOM and moves to Purchase');

    console.log('\n====================================================');
    console.log('  ALL ORDER CLASSIFICATION TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    if (orderId) {
      await pool.query(`DELETE FROM documents WHERE entity_type = 'Order' AND entity_id = $1`, [orderId]);
      await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
      console.log('Cleaned up test order:', orderId);
    }
    if (partId) await pool.query('DELETE FROM part_number_masters WHERE id = $1', [partId]);
    await pool.end();
  }
}

run().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
