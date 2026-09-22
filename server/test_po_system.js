import pg from 'pg';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const { Pool } = pg;
const pool = new Pool({ connectionString: 'postgresql://postgres:postgres@db:5432/erp_db' });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
const salesToken = jwt.sign({ id: 27, username: 'sales', role: 'Sales' }, JWT_SECRET, { expiresIn: '1h' });
const designToken = jwt.sign({ id: 31, username: 'design', role: 'Design' }, JWT_SECRET, { expiresIn: '1h' });

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  }
  passedTests++;
  console.log(`  ✓ PASSED: ${message}`);
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('  STARTING TEST SUITE: PO HIERARCHY & OVERRIDES');
  console.log('====================================================\n');

  let testOrderId = null;
  let createdUnitIds = [];

  try {
    // 0. Setup: Ensure dummy PDF file exists
    const dummyPdfPath = '/tmp/test_po.pdf';
    fs.writeFileSync(dummyPdfPath, '%PDF-1.4 sample test pdf document content');

    // Fetch valid company location
    const locRes = await pool.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows[0]?.id || 1;

    // ----------------------------------------------------
    // TEST 1: Whole-Order PO Upload at Order Creation
    // ----------------------------------------------------
    console.log('[TEST 1] Creating Order with Whole-Order PO...');
    const formData = new FormData();
    formData.append('company_location_id', String(locId));
    formData.append('order_date', '2026-09-22');
    formData.append('po_number', 'TEST-WHOLE-PO-12345');
    formData.append('priority', 'Medium');
    formData.append('lineItems', JSON.stringify([
      { material_description: 'Panel Line 1', quantity: 2, unit: 'Nos', unit_price: 5000, total_price: 10000 },
      { material_description: 'Panel Line 2', quantity: 2, unit: 'Nos', unit_price: 6000, total_price: 12000 }
    ]));

    const fileBuffer = fs.readFileSync(dummyPdfPath);
    const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
    formData.append('po', fileBlob, 'global_client_po.pdf');

    const createRes = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: formData
    });

    const createData = await createRes.json();
    assert(createRes.status === 201, `Order creation returned HTTP 201 (got ${createRes.status})`);
    assert(createData.order && createData.order.id, 'Order object returned with ID');
    testOrderId = createData.order.id;

    // Verify DB state for Order
    const dbOrder = (await pool.query('SELECT * FROM orders WHERE id = $1', [testOrderId])).rows[0];
    assert(dbOrder.po_number === 'TEST-WHOLE-PO-12345', `orders.po_number is "${dbOrder.po_number}"`);

    // Verify Document entry
    const docRes = await pool.query("SELECT * FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO'", [testOrderId]);
    assert(docRes.rows.length === 1, 'Order-level PO document record exists in documents table');
    assert(docRes.rows[0].file_name === 'global_client_po.pdf', `Document filename is "${docRes.rows[0].file_name}"`);

    // Verify Upload PO step auto-completed
    const stepRes = await pool.query("SELECT status FROM order_steps WHERE order_id = $1 AND name = 'Upload PO'", [testOrderId]);
    assert(stepRes.rows.length > 0 && stepRes.rows[0].status === 'done', 'Order milestone "Upload PO" is status: done');

    // Verify 4 units were created
    const unitsRes = await pool.query('SELECT id, unit_id, po_number, po_doc_id FROM order_units WHERE order_id = $1 ORDER BY id ASC', [testOrderId]);
    createdUnitIds = unitsRes.rows.map(u => u.id);
    assert(unitsRes.rows.length === 4, `Created exactly 4 units (found ${unitsRes.rows.length})`);
    assert(unitsRes.rows.every(u => u.po_number === null && u.po_doc_id === null), 'All units have initial unit-level po_number and po_doc_id as NULL');

    // ----------------------------------------------------
    // TEST 2: Hierarchical PO Inheritance in Dept Worklist
    // ----------------------------------------------------
    console.log('\n[TEST 2] Verifying PO Inheritance in Table View (/api/dept-worklist/Sales)...');
    const worklistRes = await fetch(`${API_BASE}/api/dept-worklist/Sales`, {
      headers: { Authorization: `Bearer ${salesToken}` }
    });
    assert(worklistRes.ok, 'Dept worklist returned HTTP 200');
    const worklist = await worklistRes.json();
    const orderUnits = worklist.filter(u => u.order_id === testOrderId);
    assert(orderUnits.length === 4, `Found all 4 units in worklist`);

    orderUnits.forEach((u, i) => {
      assert(u.po_number === 'TEST-WHOLE-PO-12345', `Unit ${i+1} [${u.unit_id}] inherited po_number "${u.po_number}"`);
      assert(u.po_file_name === 'global_client_po.pdf', `Unit ${i+1} [${u.unit_id}] has po_file_name "${u.po_file_name}"`);
      assert(u.unit_po_number === null, `Unit ${i+1} [${u.unit_id}] has unit_po_number null (inherited from order)`);
    });

    // ----------------------------------------------------
    // TEST 3: Single-Unit PO Override via Batch-PO
    // ----------------------------------------------------
    console.log('\n[TEST 3] Uploading Custom PO for Single Panel (Unit #2)...');
    const unit2Id = createdUnitIds[1];
    const unit2Blob = new Blob([fileBuffer], { type: 'application/pdf' });
    const batchPoForm1 = new FormData();
    batchPoForm1.append('po_number', 'PO-SPECIAL-UNIT2');
    batchPoForm1.append('unit_ids', JSON.stringify([unit2Id]));
    batchPoForm1.append('file', unit2Blob, 'unit2_special_drawing.pdf');

    const batchRes1 = await fetch(`${API_BASE}/api/units/batch-po`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${salesToken}` },
      body: batchPoForm1
    });
    assert(batchRes1.status === 200, `Batch-PO for Unit #2 returned HTTP 200 (got ${batchRes1.status})`);

    // Check worklist after single override
    const worklistRes2 = await (await fetch(`${API_BASE}/api/dept-worklist/Sales`, {
      headers: { Authorization: `Bearer ${salesToken}` }
    })).json();
    const orderUnits2 = worklistRes2.filter(u => u.order_id === testOrderId);

    const unit1Check = orderUnits2.find(u => u.unit_id === createdUnitIds[0]);
    const unit2Check = orderUnits2.find(u => u.unit_id === createdUnitIds[1]);
    const unit3Check = orderUnits2.find(u => u.unit_id === createdUnitIds[2]);
    const unit4Check = orderUnits2.find(u => u.unit_id === createdUnitIds[3]);

    assert(unit2Check.po_number === 'PO-SPECIAL-UNIT2', `Unit #2 overridden po_number is "${unit2Check.po_number}"`);
    assert(unit2Check.po_file_name === 'unit2_special_drawing.pdf', `Unit #2 po_file_name is "${unit2Check.po_file_name}"`);
    assert(unit1Check.po_number === 'TEST-WHOLE-PO-12345', `Unit #1 STILL has whole-order PO "${unit1Check.po_number}"`);
    assert(unit3Check.po_number === 'TEST-WHOLE-PO-12345', `Unit #3 STILL has whole-order PO "${unit3Check.po_number}"`);
    assert(unit4Check.po_number === 'TEST-WHOLE-PO-12345', `Unit #4 STILL has whole-order PO "${unit4Check.po_number}"`);

    // Ensure order-level PO in orders table remained untouched
    const orderDbCheck1 = (await pool.query('SELECT po_number FROM orders WHERE id = $1', [testOrderId])).rows[0];
    assert(orderDbCheck1.po_number === 'TEST-WHOLE-PO-12345', `orders.po_number remained unchanged ("${orderDbCheck1.po_number}")`);

    // ----------------------------------------------------
    // TEST 4: Multiple-Panel (Batch) PO Override via Batch-PO
    // ----------------------------------------------------
    console.log('\n[TEST 4] Uploading Custom PO for Multiple Panels (Units #3 & #4 simultaneously)...');
    const batchUnitIds = [createdUnitIds[2], createdUnitIds[3]];
    const multiBlob = new Blob([fileBuffer], { type: 'application/pdf' });
    const batchPoForm2 = new FormData();
    batchPoForm2.append('po_number', 'PO-BATCH-3AND4');
    batchPoForm2.append('unit_ids', JSON.stringify(batchUnitIds));
    batchPoForm2.append('file', multiBlob, 'units_3_and_4_contract.pdf');

    const batchRes2 = await fetch(`${API_BASE}/api/units/batch-po`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${salesToken}` },
      body: batchPoForm2
    });
    assert(batchRes2.status === 200, `Batch-PO for Units #3 & #4 returned HTTP 200 (got ${batchRes2.status})`);

    // Check worklist after multi-override
    const worklistRes3 = await (await fetch(`${API_BASE}/api/dept-worklist/Sales`, {
      headers: { Authorization: `Bearer ${salesToken}` }
    })).json();
    const orderUnits3 = worklistRes3.filter(u => u.order_id === testOrderId);

    const u1After = orderUnits3.find(u => u.unit_id === createdUnitIds[0]);
    const u2After = orderUnits3.find(u => u.unit_id === createdUnitIds[1]);
    const u3After = orderUnits3.find(u => u.unit_id === createdUnitIds[2]);
    const u4After = orderUnits3.find(u => u.unit_id === createdUnitIds[3]);

    assert(u3After.po_number === 'PO-BATCH-3AND4', `Unit #3 has batch PO "${u3After.po_number}"`);
    assert(u3After.po_file_name === 'units_3_and_4_contract.pdf', `Unit #3 has batch PO file "${u3After.po_file_name}"`);
    assert(u4After.po_number === 'PO-BATCH-3AND4', `Unit #4 has batch PO "${u4After.po_number}"`);
    assert(u4After.po_file_name === 'units_3_and_4_contract.pdf', `Unit #4 has batch PO file "${u4After.po_file_name}"`);
    assert(u2After.po_number === 'PO-SPECIAL-UNIT2', `Unit #2 STILL has single override PO "${u2After.po_number}"`);
    assert(u1After.po_number === 'TEST-WHOLE-PO-12345', `Unit #1 STILL has whole-order PO "${u1After.po_number}"`);
    assert(u1After.po_file_name === 'global_client_po.pdf', `Unit #1 STILL has whole-order PO file "${u1After.po_file_name}"`);

    // Ensure order-level PO in orders table remained untouched
    const orderDbCheck2 = (await pool.query('SELECT po_number FROM orders WHERE id = $1', [testOrderId])).rows[0];
    assert(orderDbCheck2.po_number === 'TEST-WHOLE-PO-12345', `orders.po_number remained unchanged ("${orderDbCheck2.po_number}")`);

    // ----------------------------------------------------
    // TEST 5: Single Unit PO Reset / Fallback to Order PO
    // ----------------------------------------------------
    console.log('\n[TEST 5] Clearing Custom PO on Unit #2 (Testing Fallback)...');
    const resetRes = await fetch(`${API_BASE}/api/units/${unit2Id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({ po_number: '' })
    });
    assert(resetRes.ok, `PUT /api/units/${unit2Id} with empty po_number returned HTTP 200`);

    const worklistRes4 = await (await fetch(`${API_BASE}/api/dept-worklist/Sales`, {
      headers: { Authorization: `Bearer ${salesToken}` }
    })).json();
    const u2Reset = worklistRes4.find(u => u.unit_id === unit2Id);
    assert(u2Reset.po_number === 'TEST-WHOLE-PO-12345', `Unit #2 cleanly fell back to whole-order PO "${u2Reset.po_number}"`);
    assert(u2Reset.po_file_name === 'global_client_po.pdf', `Unit #2 cleanly fell back to whole-order PO file "${u2Reset.po_file_name}"`);

    // ----------------------------------------------------
    // TEST 6: Role-Based Access Control (RBAC) Enforcement
    // ----------------------------------------------------
    console.log('\n[TEST 6] Verifying Role-Based Access Control (RBAC)...');
    // Design attempting batch-po
    const designForm = new FormData();
    designForm.append('po_number', 'ILLEGAL-DESIGN-PO');
    designForm.append('unit_ids', JSON.stringify([createdUnitIds[0]]));
    designForm.append('file', multiBlob, 'illegal.pdf');

    const designBatchRes = await fetch(`${API_BASE}/api/units/batch-po`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${designToken}` },
      body: designForm
    });
    assert(designBatchRes.status === 403, `Design role blocked from /api/units/batch-po with HTTP 403 (got ${designBatchRes.status})`);

    // Design attempting document upload for PO
    const designDocForm = new FormData();
    designDocForm.append('entity_type', 'Order');
    designDocForm.append('entity_id', String(testOrderId));
    designDocForm.append('doc_type', 'PO');
    designDocForm.append('files', multiBlob, 'illegal_order_po.pdf');

    const designUploadRes = await fetch(`${API_BASE}/api/documents/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${designToken}` },
      body: designDocForm
    });
    assert(designUploadRes.status === 403, `Design role blocked from uploading PO doc with HTTP 403 (got ${designUploadRes.status})`);

    // Design fetching documents should not see PO
    const designDocsRes = await fetch(`${API_BASE}/api/documents/Order/${testOrderId}`, {
      headers: { Authorization: `Bearer ${designToken}` }
    });
    const designDocs = await designDocsRes.json();
    const hasPoDoc = designDocs.some(d => d.doc_type === 'PO');
    assert(!hasPoDoc, 'PO documents are strictly hidden from Design role in GET /api/documents/Order/:id');

  } catch (err) {
    console.error('\n❌ TEST SUITE FAILED WITH EXCEPTION:', err);
  } finally {
    // ----------------------------------------------------
    // TEST 7: Cleanup
    // ----------------------------------------------------
    console.log('\n[CLEANUP] Cleaning up test data...');
    if (testOrderId) {
      await pool.query("DELETE FROM documents WHERE (entity_type = 'Order' AND entity_id = $1) OR (entity_type = 'Unit' AND entity_id = ANY($2::int[]))", [testOrderId, createdUnitIds]);
      await pool.query('DELETE FROM unit_steps WHERE order_unit_id = ANY($1::int[])', [createdUnitIds]);
      await pool.query('DELETE FROM order_steps WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM order_units WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM order_line_items WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM activity_logs WHERE order_id = $1', [testOrderId]);
      await pool.query('DELETE FROM orders WHERE id = $1', [testOrderId]);
      console.log(`  ✓ Test order #${testOrderId} and all related test entities deleted cleanly.`);
    }
    await pool.end();

    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
    console.log('====================================================');

    if (passedTests === totalTests && totalTests > 0) {
      process.exit(0);
    } else {
      process.exit(1);
    }
  }
}

runTestSuite();
