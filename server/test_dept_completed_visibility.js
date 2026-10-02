import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

let adminToken, salesToken, designToken, purchaseToken;

async function run() {
  console.log('====================================================');
  console.log('  TEST SUITE: DEPARTMENT COMPLETED VISIBILITY');
  console.log('====================================================\n');

  let testOrderId = null;
  let testUnitId = null;

  try {
    const usersRes = await pool.query('SELECT id, username, role FROM users');
    const getUser = (role) => usersRes.rows.find(u => u.role === role) || usersRes.rows.find(u => u.role === 'Admin');
    const uAdmin = getUser('Admin');
    const uSales = getUser('Sales') || uAdmin;
    const uDesign = getUser('Design') || uAdmin;
    const uPurchase = getUser('Purchase') || uAdmin;

    adminToken = jwt.sign({ id: uAdmin.id, username: uAdmin.username, role: uAdmin.role }, JWT_SECRET, { expiresIn: '1h' });
    salesToken = jwt.sign({ id: uSales.id, username: uSales.username, role: uSales.role }, JWT_SECRET, { expiresIn: '1h' });
    designToken = jwt.sign({ id: uDesign.id, username: uDesign.username, role: uDesign.role }, JWT_SECRET, { expiresIn: '1h' });
    purchaseToken = jwt.sign({ id: uPurchase.id, username: uPurchase.username, role: uPurchase.role }, JWT_SECRET, { expiresIn: '1h' });
    await pool.query("DELETE FROM orders WHERE order_number LIKE 'TEST-COMPL-%'");
    await pool.query("DELETE FROM order_units WHERE unit_id LIKE '8888%'");

    const ts = Date.now();
    const locRes = await pool.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows[0]?.id || 1;
    const testSerial = `88${String(ts).slice(-6)}`;

    // 1. Create a test order with Sales PO pending
    const ordRes = await pool.query(`
      INSERT INTO orders (order_number, company_location_id, priority, created_by, status)
      VALUES ($1, $2, 'High', 1, 'Active')
      RETURNING id
    `, [`TEST-COMPL-${ts}`, locId]);
    testOrderId = ordRes.rows[0].id;

    const liRes = await pool.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
      VALUES ($1, $2, 'Test Lifecycle Panel', 1, 'Nos', 10000, 10000)
      RETURNING id
    `, [testOrderId, `TEST-COMPL-${ts}-01`]);
    const lineItemId = liRes.rows[0].id;

    const uRes = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, classification, design_confirmed, current_dept)
      VALUES ($1, $2, $3, '0001', 'Standard', FALSE, 'Sales')
      RETURNING id, unit_id
    `, [testOrderId, lineItemId, testSerial]);
    testUnitId = uRes.rows[0].id;

    // Insert order-level Sales task: Upload PO
    const osRes = await pool.query(`
      INSERT INTO order_steps (order_id, dept, name, sub, status, step_order)
      VALUES ($1, 'Sales', 'Upload PO', 'Customer PO', 'pending', 0)
      RETURNING id
    `, [testOrderId]);
    const salesOrderStepId = osRes.rows[0].id;

    // Insert unit steps for Design and Purchase
    await pool.query(`
      INSERT INTO unit_steps (order_unit_id, dept, name, sub, status, step_order)
      VALUES 
        ($1, 'Design', 'Review & Classify', '', 'pending', 1),
        ($1, 'Design', 'Release Documents', '', 'pending', 2),
        ($1, 'Purchase', 'Enclosure', '', 'pending', 3)
    `, [testUnitId]);

    console.log('[TEST 1] Verifying initial state: panel is in Sales...');
    const salesWorklistRes1 = await fetch(`${API_BASE}/api/dept-worklist/Sales`, {
      headers: { Authorization: `Bearer ${salesToken}` }
    });
    assert.strictEqual(salesWorklistRes1.status, 200, 'Sales worklist returned HTTP 200');
    const salesUnits1 = await salesWorklistRes1.json();
    const foundInSales1 = salesUnits1.find(u => u.unit_id === testUnitId);
    assert(foundInSales1, 'Test unit MUST be visible in Sales worklist initially');
    assert.strictEqual(foundInSales1.current_dept, 'Sales', 'Unit current_dept is Sales');
    console.log('  ✓ PASSED: Unit visible in Sales worklist with current_dept: Sales');

    // Design worklist should NOT contain this unit yet because it has not reached Design
    const designWorklistRes1 = await fetch(`${API_BASE}/api/dept-worklist/Design`, {
      headers: { Authorization: `Bearer ${designToken}` }
    });
    const designUnits1 = await designWorklistRes1.json();
    const foundInDesign1 = designUnits1.find(u => u.unit_id === testUnitId);
    assert(!foundInDesign1, 'Test unit must NOT be in Design worklist before Sales completes');
    console.log('  ✓ PASSED: Unit is not in Design worklist yet');

    // 2. Sales completes Upload PO
    console.log('\n[TEST 2] Sales completes Upload PO, advancing unit to Design...');
    await pool.query(`
      INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
      VALUES ('Order', $1, 'PO', 'test_po.pdf', 'uploads/test_po.pdf', 1)
    `, [testOrderId]);
    await pool.query(`
      UPDATE order_steps SET status = 'done' WHERE id = $1
    `, [salesOrderStepId]);

    // Trigger status re-evaluation via step update endpoint or API
    const updateStepRes = await fetch(`${API_BASE}/api/orders/${testOrderId}/steps/${salesOrderStepId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${salesToken}`
      },
      body: JSON.stringify({ status: 'done' })
    });
    assert.strictEqual(updateStepRes.status, 200, 'Updating Sales order step succeeded');

    const uStateAfterSales = (await pool.query('SELECT current_dept FROM order_units WHERE id = $1', [testUnitId])).rows[0];
    assert.strictEqual(uStateAfterSales.current_dept, 'Design', 'Unit must advance to Design after Sales is done');
    console.log('  ✓ PASSED: Unit current_dept advanced to "Design"');

    // CRUCIAL CHECK: Is the unit STILL visible in Sales worklist as Completed?
    console.log('\n[TEST 3] Verifying unit REMAINS visible in Sales worklist after moving to Design...');
    const salesWorklistRes2 = await fetch(`${API_BASE}/api/dept-worklist/Sales`, {
      headers: { Authorization: `Bearer ${salesToken}` }
    });
    const salesUnits2 = await salesWorklistRes2.json();
    const foundInSales2 = salesUnits2.find(u => u.unit_id === testUnitId);
    assert(foundInSales2, 'Test unit MUST STILL BE VISIBLE in Sales worklist after advancing to Design!');
    assert.strictEqual(foundInSales2.current_dept, 'Design', 'Unit downstream department is Design');
    assert.strictEqual(foundInSales2.is_downstream, true, 'foundInSales2.is_downstream must be true');
    assert.strictEqual(foundInSales2.is_dept_completed, true, 'foundInSales2.is_dept_completed must be true');
    assert(Array.isArray(foundInSales2.dept_steps), 'foundInSales2 must have dept_steps');
    const uploadPoStep = foundInSales2.dept_steps.find(s => s.name === 'Upload PO');
    assert(uploadPoStep, 'Sales dept_steps must contain Upload PO milestone');
    assert.strictEqual(uploadPoStep.status, 'done', 'Upload PO step in Sales must be done');
    console.log('  ✓ PASSED: Unit remains visible in Sales worklist with is_downstream=true, is_dept_completed=true, and Upload PO done');

    // Also verify it IS visible in Design worklist as active
    const designWorklistRes2 = await fetch(`${API_BASE}/api/dept-worklist/Design`, {
      headers: { Authorization: `Bearer ${designToken}` }
    });
    const designUnits2 = await designWorklistRes2.json();
    const foundInDesign2 = designUnits2.find(u => u.unit_id === testUnitId);
    assert(foundInDesign2, 'Test unit MUST BE VISIBLE in Design worklist as active');
    assert.strictEqual(foundInDesign2.is_downstream, false, 'In Design, is_downstream must be false');
    assert.strictEqual(foundInDesign2.is_dept_completed, false, 'In Design, is_dept_completed must be false initially');
    console.log('  ✓ PASSED: Unit is simultaneously active in Design worklist');

    // 3. Design completes Drawing & BOM and confirms
    console.log('\n[TEST 4] Design uploads Drawing & BOM and confirms, advancing unit to Purchase...');
    await pool.query(`
      INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
      VALUES 
        ('Unit', $1, 'Drawing', 'drw.pdf', 'uploads/drw.pdf', 1),
        ('Unit', $1, 'BOM', 'bom.xlsx', 'uploads/bom.xlsx', 1)
    `, [testUnitId]);

    const confirmRes = await fetch(`${API_BASE}/api/units/${testUnitId}/design-confirm`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${designToken}` }
    });
    assert.strictEqual(confirmRes.status, 200, 'Design confirmation returned HTTP 200');

    const uStateAfterDesign = (await pool.query('SELECT current_dept FROM order_units WHERE id = $1', [testUnitId])).rows[0];
    assert.strictEqual(uStateAfterDesign.current_dept, 'Purchase', 'Unit must advance to Purchase after Design confirmation');
    console.log('  ✓ PASSED: Unit current_dept advanced to "Purchase"');

    // CRUCIAL CHECK: Is the unit visible in BOTH Sales AND Design worklists?
    console.log('\n[TEST 5] Verifying unit is visible in BOTH Sales AND Design worklists as completed...');
    const salesWorklistRes3 = await (await fetch(`${API_BASE}/api/dept-worklist/Sales`, {
      headers: { Authorization: `Bearer ${salesToken}` }
    })).json();
    const foundInSales3 = salesWorklistRes3.find(u => u.unit_id === testUnitId);
    assert(foundInSales3, 'Unit must remain visible in Sales worklist');
    assert.strictEqual(foundInSales3.is_downstream, true, 'Sales view: is_downstream must be true');
    assert.strictEqual(foundInSales3.is_dept_completed, true, 'Sales view: is_dept_completed must be true');

    const designWorklistRes3 = await (await fetch(`${API_BASE}/api/dept-worklist/Design`, {
      headers: { Authorization: `Bearer ${designToken}` }
    })).json();
    const foundInDesign3 = designWorklistRes3.find(u => u.unit_id === testUnitId);
    assert(foundInDesign3, 'Unit must remain visible in Design worklist as completed!');
    assert.strictEqual(foundInDesign3.is_downstream, true, 'Design view: is_downstream must be true');
    assert.strictEqual(foundInDesign3.is_dept_completed, true, 'Design view: is_dept_completed must be true');
    assert(Array.isArray(foundInDesign3.dept_steps), 'Design dept_steps must exist');
    assert(foundInDesign3.dept_steps.every(s => s.status === 'done'), 'All Design steps must be done');

    const purchaseWorklistRes = await (await fetch(`${API_BASE}/api/dept-worklist/Purchase`, {
      headers: { Authorization: `Bearer ${purchaseToken}` }
    })).json();
    const foundInPurchase = purchaseWorklistRes.find(u => u.unit_id === testUnitId);
    assert(foundInPurchase, 'Unit must be active in Purchase worklist');
    assert.strictEqual(foundInPurchase.is_downstream, false, 'Purchase view: is_downstream must be false');

    console.log('  ✓ PASSED: Unit is visible in Sales, visible in Design, and active in Purchase!');

    console.log('\n====================================================');
    console.log('  ALL TESTS PASSED: DEPARTMENT COMPLETED VISIBILITY VERIFIED!');
    console.log('====================================================');
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  } finally {
    if (testOrderId) {
      await pool.query('DELETE FROM documents WHERE (entity_type = $1 AND entity_id = $2) OR (entity_type = $3 AND entity_id = $4)', ['Unit', testUnitId, 'Order', testOrderId]);
      await pool.query('DELETE FROM unit_steps WHERE order_unit_id = $1', [testUnitId]);
      await pool.query('DELETE FROM order_steps WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM order_units WHERE id = $1', [testUnitId]);
      await pool.query('DELETE FROM order_line_items WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM orders WHERE id = $1', [testOrderId]);
      await pool.end();
    }
  }
}

run();
