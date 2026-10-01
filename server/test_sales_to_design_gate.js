import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const designToken = jwt.sign({ id: 31, username: 'design', role: 'Design' }, JWT_SECRET, { expiresIn: '1h' });
const salesToken = jwt.sign({ id: 27, username: 'sales', role: 'Sales' }, JWT_SECRET, { expiresIn: '1h' });

async function run() {
  console.log('====================================================');
  console.log('  TEST SUITE: SALES CLEARANCE TO DESIGN GATE');
  console.log('====================================================\n');

  let testOrderId = null;
  let testUnitId = null;

  try {
    await pool.query("DELETE FROM orders WHERE order_number LIKE 'TEST-SALES-%'");
    const ts = Date.now();
    const locRes = await pool.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows[0]?.id || 1;

    const ordRes = await pool.query(`
      INSERT INTO orders (order_number, company_location_id, priority, created_by, status)
      VALUES ($1, $2, 'Medium', 1, 'Active')
      RETURNING id
    `, [`TEST-SALES-${ts}`, locId]);
    testOrderId = ordRes.rows[0].id;

    const liRes = await pool.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
      VALUES ($1, $2, 'Test Standard Panel', 1, 'Nos', 5000, 5000)
      RETURNING id
    `, [testOrderId, `TEST-SALES-${ts}-01`]);
    const lineItemId = liRes.rows[0].id;

    const uRes = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, classification, design_confirmed, current_dept)
      VALUES ($1, $2, '99990001', '0001', 'Standard', FALSE, 'Sales')
      RETURNING id, unit_id, classification, design_confirmed
    `, [testOrderId, lineItemId]);
    testUnitId = uRes.rows[0].id;

    const sRes = await pool.query(`
      INSERT INTO unit_steps (order_unit_id, name, dept, status, step_order)
      VALUES 
        ($1, 'Sales Clearance', 'Sales', 'pending', 1),
        ($1, 'Review & Classify', 'Design', 'pending', 2),
        ($1, 'Release Documents', 'Design', 'pending', 3),
        ($1, 'Receive Shortfall', 'Purchase', 'pending', 4)
      RETURNING id, name
    `, [testUnitId]);
    const salesStepId = sRes.rows.find(r => r.name === 'Sales Clearance').id;

    // Attach dummy Drawing & BOM documents to the unit so it can advance once Design confirms, and PO to Order
    await pool.query(`
      INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
      VALUES 
        ('Unit', $1, 'Drawing', 'panel_drawing.pdf', 'uploads/panel_drawing.pdf', 1),
        ('Unit', $1, 'BOM', 'panel_bom.xlsx', 'uploads/panel_bom.xlsx', 1),
        ('Order', $2, 'PO', 'test_po.pdf', 'uploads/test_po.pdf', 1)
    `, [testUnitId, testOrderId]);

    console.log('[TEST 1] Verifying panel remains in Sales when Sales Clearance is pending...');
    const uState1 = (await pool.query(`SELECT current_dept, status FROM order_units WHERE id = $1`, [testUnitId])).rows[0];
    assert.strictEqual(uState1.current_dept, 'Sales', `Initial department must be Sales (got "${uState1.current_dept}")`);
    console.log('  ✓ PASSED: Panel is in department "Sales"');

    console.log('\n[TEST 2] Verifying Design confirmation is blocked before Sales has cleared the panel...');
    const blockedRes = await fetch(`${API_BASE}/api/units/${testUnitId}/design-confirm`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${designToken}` }
    });
    assert.strictEqual(blockedRes.status, 400, `Expected 400 Bad Request, got ${blockedRes.status}`);
    const blockedErr = await blockedRes.json();
    assert(blockedErr.error.includes('Awaiting Sales clearance'), `Error message mentions Awaiting Sales clearance (got "${blockedErr.error}")`);
    console.log('  ✓ PASSED: Design confirmation blocked with 400 ("' + blockedErr.error + '")');

    console.log('\n[TEST 3] Sales clears the panel (Sales Clearance step -> done)...');
    const updateStepRes = await fetch(`${API_BASE}/api/units/${testUnitId}/steps/${salesStepId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${salesToken}`
      },
      body: JSON.stringify({ status: 'done', notes: 'PO & Specs verified and cleared by Sales.' })
    });
    assert.strictEqual(updateStepRes.status, 200, `Expected 200 OK updating step, got ${updateStepRes.status}`);

    const uState2 = (await pool.query(`SELECT current_dept, status FROM order_units WHERE id = $1`, [testUnitId])).rows[0];
    assert.strictEqual(uState2.current_dept, 'Design', `Unit must transition to Design after Sales clearance (got "${uState2.current_dept}")`);
    console.log('  ✓ PASSED: Panel arrived in "Design" only after Sales cleared it');

    console.log('\n[TEST 4] Design confirms the panel now that it has cleared Sales...');
    const confirmRes = await fetch(`${API_BASE}/api/units/${testUnitId}/design-confirm`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${designToken}` }
    });
    assert.strictEqual(confirmRes.status, 200, `Expected 200 OK confirming design, got ${confirmRes.status}`);

    const uState3 = (await pool.query(`SELECT current_dept, status, design_confirmed FROM order_units WHERE id = $1`, [testUnitId])).rows[0];
    assert.strictEqual(uState3.design_confirmed, true, `design_confirmed must be true`);
    assert.strictEqual(uState3.current_dept, 'Purchase', `Unit must advance to Purchase after Design confirms with Drawing and BOM attached (got "${uState3.current_dept}")`);
    console.log('  ✓ PASSED: Design confirmed panel and it advanced directly to "Purchase"');

    console.log('\n====================================================');
    console.log('  ALL TESTS PASSED: SALES -> DESIGN -> PURCHASE GATE VERIFIED!');
    console.log('====================================================');

  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    if (testOrderId) {
      await pool.query('DELETE FROM documents WHERE entity_type = $1 AND entity_id = $2', ['Unit', testUnitId]);
      await pool.query('DELETE FROM unit_steps WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = $1)', [testOrderId]);
      await pool.query('DELETE FROM order_units WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM order_line_items WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM orders WHERE id = $1', [testOrderId]);
    }
    await pool.end();
  }
}

run();
