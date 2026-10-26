import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: STORES TRAY AUTO-COMPLETION & ADVANCE');
  console.log('====================================================\n');

  let testOrderId = null;
  let testUnitId = null;
  let testUnitRealId = null;

  try {
    const ts = Date.now();
    const locRes = await pool.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows[0]?.id || 1;

    // 1. Create a test order and unit
    const ordRes = await pool.query(`
      INSERT INTO orders (order_number, company_location_id, priority, created_by)
      VALUES ($1, $2, 'Medium', 1)
      RETURNING id
    `, [`TEST-STORES-AUTO-${ts}`, locId]);
    testOrderId = ordRes.rows[0].id;

    const liRes = await pool.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
      VALUES ($1, $2, 'Test Stores Auto Panel', 1, 'Nos', 1000, 1000)
      RETURNING id
    `, [testOrderId, `TEST-STORES-AUTO-${ts}-01`]);

    const uRes = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, tray_status, design_confirmed, sales_cleared)
      VALUES ($1, $2, $3, '9801', 'Stores', 'Pending', 'Not Started', TRUE, TRUE)
      RETURNING id, unit_id
    `, [testOrderId, liRes.rows[0].id, `9898${ts % 10000}1`]);
    testUnitRealId = uRes.rows[0].id;
    testUnitId = uRes.rows[0].unit_id;

    // Attach Drawing and BOM documents to satisfy Design hard gate
    await pool.query(`
      INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
      VALUES 
        ('Unit', $1, 'Drawing', 'test_drawing.pdf', 'test_drawing.pdf', 1),
        ('Unit', $1, 'BOM', 'test_bom.xlsx', 'test_bom.xlsx', 1)
    `, [testUnitRealId]);

    // Attach Steps: Purchase, Stores, Production
    await pool.query(`
      INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
      VALUES 
        ($1, 'Purchase', 'Procure Materials', 'done', 1),
        ($1, 'Stores', 'Stock Check vs BOM', 'pending', 2),
        ($1, 'Stores', 'Material Status', 'pending', 3),
        ($1, 'Stores', 'Inform Purchase', 'pending', 4),
        ($1, 'Production', 'Manufacture', 'pending', 5)
    `, [testUnitRealId]);

    console.log(`Created test order ${testOrderId} and unit ${testUnitId} (realId: ${testUnitRealId})`);

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Test 1: Start tray -> 'In Process'
    console.log('\n--- Test 1: Set tray_status to "In Process" ---');
    let res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ tray_status: 'In Process' })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    let unitRow = (await pool.query('SELECT tray_status, tray_start_date, issued_date, current_dept FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(unitRow.tray_status, 'In Process');
    assert.ok(unitRow.tray_start_date, 'tray_start_date should be set');
    assert.strictEqual(unitRow.issued_date, null, 'issued_date should be null');
    assert.strictEqual(unitRow.current_dept, 'Stores', 'Unit should stay in Stores');

    let steps = (await pool.query('SELECT name, status FROM unit_steps WHERE order_unit_id = $1 AND dept = \'Stores\'', [testUnitRealId])).rows;
    assert.ok(steps.some(s => s.status !== 'done'), 'Stores steps should still be pending');
    console.log('✓ Tray started; Stores tasks remain pending and unit stays in Stores.');

    // Test 2: Transition to "Partial Issued" -> both dates present -> auto-complete Stores tasks & advance to Production
    console.log('\n--- Test 2: Transition to "Partial Issued" ---');
    res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ tray_status: 'Partial Issued' })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    unitRow = (await pool.query('SELECT tray_status, tray_start_date, issued_date, current_dept FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(unitRow.tray_status, 'Partial Issued');
    assert.ok(unitRow.issued_date, 'issued_date should be stamped');
    const dObj = new Date(unitRow.issued_date);
    const dbIssuedStr = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;
    assert.strictEqual(dbIssuedStr, todayStr, 'issued_date must be today');

    // Verify all Stores steps are now done
    steps = (await pool.query('SELECT name, status FROM unit_steps WHERE order_unit_id = $1 AND dept = \'Stores\'', [testUnitRealId])).rows;
    assert.strictEqual(steps.length, 3);
    assert.ok(steps.every(s => s.status === 'done'), `All Stores tasks should be marked done, but got: ${JSON.stringify(steps)}`);
    console.log('✓ All Stores steps auto-completed as done');

    // Verify unit advanced to Production
    assert.strictEqual(unitRow.current_dept, 'Production', `Expected unit to advance to Production, but was ${unitRow.current_dept}`);
    console.log('✓ Unit automatically advanced to Production');

    // Test 3: Change tray_status back to "Full Ready" -> issued_date resets to null -> Stores tasks revert & unit regresses to Stores
    console.log('\n--- Test 3: Change tray_status back to "Full Ready" ---');
    res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ tray_status: 'Full Ready' })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    unitRow = (await pool.query('SELECT tray_status, tray_start_date, issued_date, current_dept FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(unitRow.tray_status, 'Full Ready');
    assert.strictEqual(unitRow.issued_date, null, 'issued_date must reset to null');

    // Stores steps must no longer be all done
    steps = (await pool.query('SELECT name, status FROM unit_steps WHERE order_unit_id = $1 AND dept = \'Stores\'', [testUnitRealId])).rows;
    assert.ok(steps.some(s => s.status !== 'done'), 'Stores steps should revert from done');

    // Unit must regress back to Stores
    assert.strictEqual(unitRow.current_dept, 'Stores', `Expected unit to regress back to Stores, but was ${unitRow.current_dept}`);
    console.log('✓ Unit regressed back to Stores and Stores tasks reverted.');

    // Test 4: Change tray_status to "All Issued" -> fresh date stamped -> auto-complete & advance to Production
    console.log('\n--- Test 4: Change tray_status to "All Issued" ---');
    res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ tray_status: 'All Issued' })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    unitRow = (await pool.query('SELECT tray_status, tray_start_date, issued_date, current_dept FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(unitRow.tray_status, 'All Issued');
    assert.ok(unitRow.issued_date, 'issued_date should be stamped again');

    steps = (await pool.query('SELECT name, status FROM unit_steps WHERE order_unit_id = $1 AND dept = \'Stores\'', [testUnitRealId])).rows;
    assert.ok(steps.every(s => s.status === 'done'), 'All Stores steps should be auto-completed again');
    assert.strictEqual(unitRow.current_dept, 'Production', 'Unit should advance to Production');
    console.log('✓ Re-stamped with fresh date, Stores steps completed, unit advanced to Production.');

    // Test 5: Attempting to manually mark a Stores task done without both dates -> HTTP 400
    console.log('\n--- Test 5: Attempt to complete Stores task manually without both dates ---');
    // Revert status to Full Ready to clear issued_date
    await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ tray_status: 'Full Ready' })
    });

    const pendingStoresStep = (await pool.query('SELECT id FROM unit_steps WHERE order_unit_id = $1 AND dept = \'Stores\' LIMIT 1', [testUnitRealId])).rows[0];
    const stepRes = await fetch(`${API_BASE}/api/units/${testUnitRealId}/steps/${pendingStoresStep.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'done' })
    });
    assert.strictEqual(stepRes.status, 400, `Expected 400, got ${stepRes.status}`);
    const errBody = await stepRes.json();
    assert.ok(errBody.error && errBody.error.includes('Both Tray Start Date and Issued Date'), `Expected error message about dates, got: ${errBody.error}`);
    console.log('✓ Manual Stores step completion correctly blocked with 400 when dates missing');

    // Test 6: Multi-unit batch update simulation
    console.log('\n--- Test 6: Multi-unit batch tray status updates ---');
    const uRes2 = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, tray_status, tray_start_date, design_confirmed, sales_cleared)
      VALUES ($1, $2, $3, '9802', 'Stores', 'Pending', 'In Process', CURRENT_DATE, TRUE, TRUE)
      RETURNING id, unit_id
    `, [testOrderId, liRes.rows[0].id, `9898${ts % 10000}2`]);
    const testUnitRealId2 = uRes2.rows[0].id;
    const testUnitId2 = uRes2.rows[0].unit_id;

    await pool.query(`
      INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
      VALUES 
        ('Unit', $1, 'Drawing', 'test_drawing2.pdf', 'test_drawing2.pdf', 1),
        ('Unit', $1, 'BOM', 'test_bom2.xlsx', 'test_bom2.xlsx', 1)
    `, [testUnitRealId2]);

    await pool.query(`
      INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
      VALUES 
        ($1, 'Purchase', 'Procure Materials', 'done', 1),
        ($1, 'Stores', 'Material Status', 'pending', 2),
        ($1, 'Production', 'Manufacture', 'pending', 3)
    `, [testUnitRealId2]);

    // Batch update both units to Partial Issued
    const batchUnits = [testUnitId, testUnitId2];
    await Promise.all(batchUnits.map(uid =>
      fetch(`${API_BASE}/api/units/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ tray_status: 'Partial Issued' })
      })
    ));

    const checkRows = (await pool.query('SELECT id, current_dept FROM order_units WHERE id IN ($1, $2)', [testUnitRealId, testUnitRealId2])).rows;
    checkRows.forEach(r => {
      assert.strictEqual(r.current_dept, 'Production', `Batch unit ${r.id} should have advanced to Production`);
    });
    console.log('✓ Batch: both units advanced to Production after setting to Partial Issued');

    // Batch revert both units to Full Ready
    await Promise.all(batchUnits.map(uid =>
      fetch(`${API_BASE}/api/units/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ tray_status: 'Full Ready' })
      })
    ));

    const checkRevertRows = (await pool.query('SELECT id, current_dept FROM order_units WHERE id IN ($1, $2)', [testUnitRealId, testUnitRealId2])).rows;
    checkRevertRows.forEach(r => {
      assert.strictEqual(r.current_dept, 'Stores', `Batch unit ${r.id} should have regressed back to Stores`);
    });
    console.log('✓ Batch: both units regressed back to Stores after setting to Full Ready');

    console.log('\n====================================================');
    console.log('  ALL STORES AUTO-COMPLETION TESTS PASSED!');
    console.log('====================================================\n');

  } finally {
    if (testOrderId) {
      await pool.query('DELETE FROM orders WHERE id = $1', [testOrderId]);
      console.log('Cleaned up test order:', testOrderId);
    }
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
