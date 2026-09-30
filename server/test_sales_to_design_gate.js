import pool from './db.js';
import assert from 'assert';
import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function run() {
  console.log('====================================================');
  console.log('  TEST SUITE: SALES CLEARANCE TO DESIGN GATE');
  console.log('====================================================\n');

  let testOrderId, testUnitId;

  try {
    const salesUser = (await pool.query("SELECT id, role, username FROM users WHERE role = 'Sales' LIMIT 1")).rows[0];
    const designUser = (await pool.query("SELECT id, role, username FROM users WHERE role = 'Design' LIMIT 1")).rows[0];
    const designToken = jwt.sign({ id: designUser.id, username: designUser.username, role: designUser.role }, JWT_SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: salesUser.id, username: salesUser.username, role: salesUser.role }, JWT_SECRET, { expiresIn: '1h' });

    // 2. Create test company location, order, and unit
    await pool.query("DELETE FROM orders WHERE order_number LIKE 'TEST-GATE-%'");
    const locRes = await pool.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows[0].id;

    const ordRes = await pool.query(`
      INSERT INTO orders (order_number, company_location_id, priority, created_by, status)
      VALUES ('TEST-GATE-7777', $1, 'High', 1, 'Active')
      RETURNING id
    `, [locId]);
    testOrderId = ordRes.rows[0].id;

    const liRes = await pool.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
      VALUES ($1, 'TEST-GATE-7777-01', 'Gate Test Panel', 1, 'Nos', 5000, 5000)
      RETURNING id
    `, [testOrderId]);
    const lineItemId = liRes.rows[0].id;

    const uRes = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, classification, design_confirmed, current_dept)
      VALUES ($1, $2, '77770001', '0001', 'Standard', FALSE, 'Sales')
      RETURNING id
    `, [testOrderId, lineItemId]);
    testUnitId = uRes.rows[0].id;

    // Steps: Sales Clearance (Sales), Review & Classify (Design), Release Documents (Design), Receive Shortfall (Purchase)
    const s1Res = await pool.query(`
      INSERT INTO unit_steps (order_unit_id, name, dept, status, step_order)
      VALUES ($1, 'Sales Clearance', 'Sales', 'pending', 1)
      RETURNING id
    `, [testUnitId]);
    const salesStepId = s1Res.rows[0].id;

    await pool.query(`
      INSERT INTO unit_steps (order_unit_id, name, dept, status, step_order)
      VALUES 
        ($1, 'Review & Classify', 'Design', 'pending', 2),
        ($1, 'Release Documents', 'Design', 'pending', 3),
        ($1, 'Receive Shortfall', 'Purchase', 'pending', 4)
    `, [testUnitId]);

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
    assert.strictEqual(uState3.current_dept, 'Purchase', `Unit must advance to Purchase after Design confirms (got "${uState3.current_dept}")`);
    console.log('  ✓ PASSED: Design confirmed panel and it advanced directly to "Purchase"');

    console.log('\n====================================================');
    console.log('  ALL TESTS PASSED: SALES -> DESIGN -> PURCHASE GATE VERIFIED!');
    console.log('====================================================');

  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    if (testOrderId) {
      await pool.query('DELETE FROM unit_steps WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = $1)', [testOrderId]);
      await pool.query('DELETE FROM order_units WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM order_line_items WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM orders WHERE id = $1', [testOrderId]);
    }
    await pool.end();
  }
}

run();
