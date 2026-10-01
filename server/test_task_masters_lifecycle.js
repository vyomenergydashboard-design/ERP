import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
const salesToken = jwt.sign({ id: 27, username: 'sales', role: 'Sales' }, JWT_SECRET, { expiresIn: '1h' });
const designToken = jwt.sign({ id: 31, username: 'design', role: 'Design' }, JWT_SECRET, { expiresIn: '1h' });

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: DYNAMIC TASK MASTERS LIFECYCLE');
  console.log('====================================================\n');

  let testOrderIdSales = null;
  let testUnitIdSales = null;
  let testOrderIdPurchase = null;
  let testUnitIdPurchase = null;
  let createdTaskId = null;

  try {
    // Pre-cleanup of any lingering test records
    await pool.query("DELETE FROM orders WHERE order_number LIKE 'TEST-TM-%'");
    await pool.query("DELETE FROM task_masters WHERE name = 'Thermal Simulation Check'");

    const locRes = await pool.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows[0]?.id || 1;
    const ts = Date.now();

    // 1. Create a test order in Sales
    const ordRes1 = await pool.query(`
      INSERT INTO orders (order_number, company_location_id, priority, created_by)
      VALUES ($1, $2, 'Medium', 1)
      RETURNING id
    `, [`TEST-TM-SALES-${ts}`, locId]);
    testOrderIdSales = ordRes1.rows[0].id;

    const liRes1 = await pool.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
      VALUES ($1, $2, 'Test Sales Panel', 1, 'Nos', 1000, 1000)
      RETURNING id
    `, [testOrderIdSales, `TEST-TM-SALES-${ts}-01`]);

    const uRes1 = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, design_confirmed)
      VALUES ($1, $2, $3, '8001', 'Sales', 'Pending', FALSE)
      RETURNING id
    `, [testOrderIdSales, liRes1.rows[0].id, `8888${ts % 10000}1`]);
    testUnitIdSales = uRes1.rows[0].id;

    // Insert order_steps for Sales
    await pool.query(`
      INSERT INTO order_steps (order_id, dept, name, status, step_order)
      VALUES ($1, 'Sales', 'Upload PO', 'pending', 0)
    `, [testOrderIdSales]);

    // Insert standard unit_steps for subsequent departments
    await pool.query(`
      INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
      VALUES 
        ($1, 'Design', 'Review & Classify', 'pending', 0),
        ($1, 'Design', 'Release Documents', 'pending', 1),
        ($1, 'Purchase', 'Receive Shortfall', 'pending', 2)
    `, [testUnitIdSales]);

    // 2. Create a test order in Purchase (downstream of Design)
    const ordRes2 = await pool.query(`
      INSERT INTO orders (order_number, company_location_id, priority, created_by)
      VALUES ($1, $2, 'High', 1)
      RETURNING id
    `, [`TEST-TM-PURCH-${ts}`, locId]);
    testOrderIdPurchase = ordRes2.rows[0].id;

    const liRes2 = await pool.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
      VALUES ($1, $2, 'Test Purchase Panel', 1, 'Nos', 2000, 2000)
      RETURNING id
    `, [testOrderIdPurchase, `TEST-TM-PURCH-${ts}-01`]);

    const uRes2 = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, design_confirmed)
      VALUES ($1, $2, $3, '8002', 'Purchase', 'Material Waiting', TRUE)
      RETURNING id
    `, [testOrderIdPurchase, liRes2.rows[0].id, `8888${ts % 10000}2`]);
    testUnitIdPurchase = uRes2.rows[0].id;

    // -----------------------------------------------------------
    // TEST 1: Selective Task Addition
    // -----------------------------------------------------------
    console.log('[TEST 1] Adding a new Design task template via POST /api/task_masters...');
    const postRes = await fetch(`${API_BASE}/api/task_masters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        dept: 'Design',
        name: 'Thermal Simulation Check',
        sub: 'Optional heat simulation report',
        is_mandatory: false,
        requires_upload: false,
        level: 'unit'
      })
    });
    assert.strictEqual(postRes.status, 201, `Expected 201 Created, got ${postRes.status}`);
    const newTask = await postRes.json();
    createdTaskId = newTask.id;
    console.log(`  ✓ Created task ID: ${createdTaskId} (Dept: Design, Level: unit)`);

    // Verify it was added to the Sales order unit (which is upstream of Design)
    const salesStepsRes = await pool.query(`
      SELECT * FROM unit_steps WHERE order_unit_id = $1 AND task_id = $2
    `, [testUnitIdSales, createdTaskId]);
    assert.strictEqual(salesStepsRes.rows.length, 1, 'New Design task MUST be applied to active units in Sales (upstream)');
    console.log('  ✓ PASSED: New Design task was populated into unit in Sales');

    // Verify it was NOT added to the Purchase order unit (which has already passed Design)
    const purchStepsRes = await pool.query(`
      SELECT * FROM unit_steps WHERE order_unit_id = $1 AND task_id = $2
    `, [testUnitIdPurchase, createdTaskId]);
    assert.strictEqual(purchStepsRes.rows.length, 0, 'New Design task must NEVER be applied to units downstream in Purchase');
    console.log('  ✓ PASSED: Downstream unit in Purchase was NOT affected');

    // -----------------------------------------------------------
    // TEST 2: Non-Advancing Task Deletion
    // -----------------------------------------------------------
    console.log('\n[TEST 2] Deleting the task template via DELETE /api/task_masters/:id...');
    const delRes = await fetch(`${API_BASE}/api/task_masters/${createdTaskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    assert.strictEqual(delRes.status, 200, `Expected 200 OK, got ${delRes.status}`);
    console.log('  ✓ Deleted task template');

    // Verify step instance was removed from unit_steps
    const stepAfterDel = await pool.query(`SELECT * FROM unit_steps WHERE task_id = $1`, [createdTaskId]);
    assert.strictEqual(stepAfterDel.rows.length, 0, 'Step instance must be removed when task master is deleted');
    console.log('  ✓ PASSED: Step instances linked to task were cleaned up');

    // CRITICAL INVARIANT: Verify that deleting the task did NOT advance the Sales unit to Design
    const unitAfterDel = (await pool.query(`SELECT current_dept, status FROM order_units WHERE id = $1`, [testUnitIdSales])).rows[0];
    assert.strictEqual(unitAfterDel.current_dept, 'Sales', `Deleting a task must NEVER push an order into the next department (got ${unitAfterDel.current_dept})`);
    console.log('  ✓ PASSED: Unit remained in "Sales" without premature advancement');

    // -----------------------------------------------------------
    // TEST 3: Sales Department Gating via Upload PO
    // -----------------------------------------------------------
    console.log('\n[TEST 3] Verifying Sales gating until Upload PO is completed...');
    // Currently Upload PO is pending in order_steps
    const uploadPoStep = (await pool.query(`
      SELECT id, status FROM order_steps WHERE order_id = $1 AND name = 'Upload PO'
    `, [testOrderIdSales])).rows[0];
    assert.strictEqual(uploadPoStep.status, 'pending', 'Upload PO should initially be pending');

    // Mark Upload PO as done
    const updatePoStepRes = await fetch(`${API_BASE}/api/orders/${testOrderIdSales}/steps/${uploadPoStep.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${salesToken}`
      },
      body: JSON.stringify({ status: 'done', notes: 'PO verified and uploaded' })
    });
    assert.strictEqual(updatePoStepRes.status, 200, `Expected 200 updating Upload PO step, got ${updatePoStepRes.status}`);

    // Check unit department after Upload PO is done
    const unitAfterPo = (await pool.query(`SELECT current_dept, status FROM order_units WHERE id = $1`, [testUnitIdSales])).rows[0];
    assert.strictEqual(unitAfterPo.current_dept, 'Design', `Unit should advance to Design once Sales tasks are done (got ${unitAfterPo.current_dept})`);
    console.log('  ✓ PASSED: Unit smoothly advanced to "Design" after Sales completed Upload PO');

    console.log('\n====================================================');
    console.log('  ALL INTEGRATION TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('====================================================\n');

  } catch (err) {
    console.error('\n❌ Test suite failed:', err);
    process.exit(1);
  } finally {
    // Cleanup test data
    if (createdTaskId) {
      await pool.query('DELETE FROM task_masters WHERE id = $1', [createdTaskId]);
      await pool.query('DELETE FROM unit_steps WHERE task_id = $1', [createdTaskId]);
      await pool.query('DELETE FROM order_steps WHERE task_id = $1', [createdTaskId]);
    }
    if (testOrderIdSales) {
      await pool.query('DELETE FROM orders WHERE id = $1', [testOrderIdSales]);
    }
    if (testOrderIdPurchase) {
      await pool.query('DELETE FROM orders WHERE id = $1', [testOrderIdPurchase]);
    }
    await pool.end();
  }
}

runTests();
