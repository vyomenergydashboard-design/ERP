import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function runTests() {
  console.log('--- Starting Panel PO and Sales Flow Tests ---');

  try {
    // -------------------------------------------------------------
    // Test 1: Verify order_units schema columns exist
    // -------------------------------------------------------------
    console.log('Test 1: Checking required columns on order_units table...');
    const colRes = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'order_units' 
        AND column_name IN ('sales_cleared', 'sales_cleared_at', 'sales_cleared_by', 'po_override_unlinked')
    `);
    const foundCols = colRes.rows.map(r => r.column_name);
    console.log('Found columns:', foundCols);

    assert(foundCols.includes('sales_cleared'), 'Missing sales_cleared column on order_units');
    assert(foundCols.includes('sales_cleared_at'), 'Missing sales_cleared_at column on order_units');
    assert(foundCols.includes('sales_cleared_by'), 'Missing sales_cleared_by column on order_units');
    assert(foundCols.includes('po_override_unlinked'), 'Missing po_override_unlinked column on order_units');
    console.log('✓ Test 1 Passed: All required columns exist on order_units.');

    // -------------------------------------------------------------
    // Test 2: Panel PO Upload advances that panel to Design
    // -------------------------------------------------------------
    console.log('\nTest 2: Verifying panel PO upload advances only that panel to Design...');
    const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: 27, username: 'sales', role: 'Sales' }, JWT_SECRET, { expiresIn: '1h' });

    const locRes = await pool.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows[0]?.id || 1;

    // Create order with 2 units, NO PO initially
    const createForm = new FormData();
    createForm.append('company_location_id', String(locId));
    createForm.append('order_date', '2026-10-02');
    createForm.append('priority', 'Medium');
    createForm.append('lineItems', JSON.stringify([
      { material_description: 'Test Panel A', quantity: 1, unit: 'Nos', unit_price: 1000, total_price: 1000 },
      { material_description: 'Test Panel B', quantity: 1, unit: 'Nos', unit_price: 1000, total_price: 1000 }
    ]));

    const createRes = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: createForm
    });
    const createData = await createRes.json();
    assert(createRes.status === 201, `Order creation returned 201 (got ${createRes.status})`);
    const testOrderId = createData.order.id;

    // Fetch the 2 created units
    const unitsRes = await pool.query(
      'SELECT id, unit_id, current_dept, status FROM order_units WHERE order_id = $1 ORDER BY id ASC',
      [testOrderId]
    );
    assert(unitsRes.rows.length === 2, 'Two units created in test order');
    const unit1 = unitsRes.rows[0];
    const unit2 = unitsRes.rows[1];

    assert(unit1.current_dept === 'Sales', `Unit 1 initial dept is Sales (got ${unit1.current_dept})`);
    assert(unit2.current_dept === 'Sales', `Unit 2 initial dept is Sales (got ${unit2.current_dept})`);

    // Attach PO to Unit 1 ONLY via /api/units/batch-po
    const pdfBlob = new Blob(['%PDF-1.4 dummy PO content for unit 1'], { type: 'application/pdf' });
    const batchForm = new FormData();
    batchForm.append('po_number', 'PO-UNIT-1-ONLY');
    batchForm.append('unit_ids', JSON.stringify([unit1.id]));
    batchForm.append('file', pdfBlob, 'unit1_po.pdf');

    const batchRes = await fetch(`${API_BASE}/api/units/batch-po`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${salesToken}` },
      body: batchForm
    });
    const batchData = await batchRes.json();
    assert(batchRes.status === 200, `Batch PO upload returned 200 (got ${batchRes.status})`);

    // Check dept of Unit 1 and Unit 2
    const checkUnitsRes = await pool.query(
      'SELECT id, unit_id, current_dept, status, po_number, po_doc_id FROM order_units WHERE order_id = $1 ORDER BY id ASC',
      [testOrderId]
    );
    const u1After = checkUnitsRes.rows[0];
    const u2After = checkUnitsRes.rows[1];

    console.log(`Unit 1 dept after PO upload: ${u1After.current_dept}, status: ${u1After.status}`);
    console.log(`Unit 2 dept after PO upload: ${u2After.current_dept}, status: ${u2After.status}`);

    assert(u1After.current_dept === 'Design', `Unit 1 must advance to Design after PO upload (got ${u1After.current_dept})`);
    assert(u2After.current_dept === 'Sales', `Unit 2 without PO must remain in Sales (got ${u2After.current_dept})`);

    // Now re-derive status for Unit 2 (simulate order refresh or unit update)
    const rederiveRes = await fetch(`${API_BASE}/api/units/${unit2.id}/rederive`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    // Or if /rederive doesn't exist, update unit2 tag or test deriveUnitStatus directly:
    const u2DbCheck = (await pool.query('SELECT current_dept, status FROM order_units WHERE id = $1', [unit2.id])).rows[0];
    console.log(`Unit 2 dept: ${u2DbCheck.current_dept}, status: ${u2DbCheck.status}`);

    // Let's call deriveUnitStatus on unit2 by triggering an update on unit2
    const updateU2 = await fetch(`${API_BASE}/api/units/${unit2.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ tag: 'U2-TAG' })
    });
    const u2AfterUpdate = (await pool.query('SELECT current_dept, status FROM order_units WHERE id = $1', [unit2.id])).rows[0];
    console.log(`Unit 2 dept after tag update: ${u2AfterUpdate.current_dept}, status: ${u2AfterUpdate.status}`);
    assert(u2AfterUpdate.current_dept === 'Sales', `Unit 2 without PO MUST stay in Sales even after re-derivation (got ${u2AfterUpdate.current_dept})`);
    console.log('✓ Test 2 Passed: Panel PO upload advances only that panel to Design.');

    // -------------------------------------------------------------
    // Test 3: Safe Panel-Level PO Deletion
    // -------------------------------------------------------------
    console.log('\nTest 3: Verifying panel-level PO deletion unlinks only that panel and returns it to Sales...');
    
    // Case 3A: Unit 1 has a unit-level PO doc. Delete it.
    const delRes1 = await fetch(`${API_BASE}/api/units/${unit1.id}/po-document`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${salesToken}` }
    });
    const delData1 = await delRes1.json();
    assert(delRes1.status === 200, `DELETE /api/units/${unit1.id}/po-document returned 200 (got ${delRes1.status})`);

    const u1AfterDel = (await pool.query('SELECT current_dept, status, po_number, po_doc_id, po_override_unlinked FROM order_units WHERE id = $1', [unit1.id])).rows[0];
    console.log(`Unit 1 dept after PO deletion: ${u1AfterDel.current_dept}, status: ${u1AfterDel.status}, po_doc_id: ${u1AfterDel.po_doc_id}`);
    assert(u1AfterDel.po_doc_id === null, 'Unit 1 po_doc_id must be null after deletion');
    assert(u1AfterDel.po_number === null, 'Unit 1 po_number must be null after deletion');
    assert(u1AfterDel.current_dept === 'Sales', `Unit 1 must return to Sales after PO deletion (got ${u1AfterDel.current_dept})`);

    // Case 3B: Order with whole-order PO. Delete PO on Unit A only. Unit B must retain PO!
    console.log('\nTest 3B: Whole-order PO deletion at panel level must NOT affect sibling panels...');
    const orderForm2 = new FormData();
    orderForm2.append('company_location_id', String(locId));
    orderForm2.append('order_date', '2026-10-02');
    orderForm2.append('po_number', 'PO-SHARED-ORDER');
    orderForm2.append('priority', 'Medium');
    orderForm2.append('lineItems', JSON.stringify([
      { material_description: 'Panel Shared 1', quantity: 1, unit: 'Nos', unit_price: 2000, total_price: 2000 },
      { material_description: 'Panel Shared 2', quantity: 1, unit: 'Nos', unit_price: 2000, total_price: 2000 }
    ]));
    const sharedPdf = new Blob(['%PDF-1.4 shared order PO'], { type: 'application/pdf' });
    orderForm2.append('po', sharedPdf, 'shared_order_po.pdf');

    const createRes2 = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: orderForm2
    });
    const createData2 = await createRes2.json();
    const testOrderId2 = createData2.order.id;

    const unitsRes2 = await pool.query(
      'SELECT id, unit_id, current_dept, status FROM order_units WHERE order_id = $1 ORDER BY id ASC',
      [testOrderId2]
    );
    const sharedU1 = unitsRes2.rows[0];
    const sharedU2 = unitsRes2.rows[1];

    assert(sharedU1.current_dept === 'Design', `Shared Unit 1 starts in Design with whole-order PO (got ${sharedU1.current_dept})`);
    assert(sharedU2.current_dept === 'Design', `Shared Unit 2 starts in Design with whole-order PO (got ${sharedU2.current_dept})`);

    // Delete PO on sharedU1 only
    const delRes2 = await fetch(`${API_BASE}/api/units/${sharedU1.id}/po-document`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${salesToken}` }
    });
    assert(delRes2.status === 200, `DELETE /api/units/${sharedU1.id}/po-document returned 200`);

    const sharedU1After = (await pool.query('SELECT current_dept, status, po_number, po_doc_id, po_override_unlinked FROM order_units WHERE id = $1', [sharedU1.id])).rows[0];
    const sharedU2After = (await pool.query('SELECT current_dept, status, po_number, po_doc_id, po_override_unlinked FROM order_units WHERE id = $1', [sharedU2.id])).rows[0];

    console.log(`Shared Unit 1 after delete: dept=${sharedU1After.current_dept}, unlinked=${sharedU1After.po_override_unlinked}`);
    console.log(`Shared Unit 2 after delete: dept=${sharedU2After.current_dept}, unlinked=${sharedU2After.po_override_unlinked}`);

    // Verify order document STILL exists in documents table!
    const orderDocCheck = await pool.query("SELECT id FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO'", [testOrderId2]);
    assert(orderDocCheck.rows.length > 0, 'Order-level PO document MUST NOT be deleted when deleting from single panel!');

    assert(sharedU1After.current_dept === 'Sales', `Shared Unit 1 must drop to Sales (got ${sharedU1After.current_dept})`);
    assert(sharedU2After.current_dept === 'Design', `Shared Unit 2 MUST remain in Design (got ${sharedU2After.current_dept})`);
    console.log('✓ Test 3 Passed: Panel-level PO deletion unlinks only target panel and preserves siblings.');

    // -------------------------------------------------------------
    // Test 4: Manual Panel Sales Clear Endpoint (POST /api/units/:id/sales-clear)
    // -------------------------------------------------------------
    console.log('\nTest 4: Verifying manual panel sales clear without PO applies strictly to individual panel...');
    const nonSalesRes = await pool.query("SELECT id, username, role FROM users WHERE role NOT IN ('Sales', 'Admin', 'Manager') LIMIT 1");
    assert(nonSalesRes.rows.length > 0, 'Found non-sales user in DB');
    const nonSalesUser = nonSalesRes.rows[0];
    const nonSalesToken = jwt.sign({ id: nonSalesUser.id, username: nonSalesUser.username, role: nonSalesUser.role }, JWT_SECRET, { expiresIn: '1h' });

    // 4A: RBAC check - non-Sales/Admin role blocked from sales-clear
    const blockRes = await fetch(`${API_BASE}/api/units/${unit2.id}/sales-clear`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${nonSalesToken}` }
    });
    assert(blockRes.status === 403, `Non-sales role (${nonSalesUser.role}) blocked with 403 from sales-clear (got ${blockRes.status})`);

    // 4B: Sales role clears Unit 2 (which has NO PO document)
    // Before clear: verify Unit 2 is in Sales and Unit 1 is in Sales
    const u1Before = (await pool.query('SELECT current_dept FROM order_units WHERE id = $1', [unit1.id])).rows[0];
    const u2Before = (await pool.query('SELECT current_dept FROM order_units WHERE id = $1', [unit2.id])).rows[0];
    assert(u1Before.current_dept === 'Sales', 'Unit 1 is in Sales before clearing Unit 2');
    assert(u2Before.current_dept === 'Sales', 'Unit 2 is in Sales before clearing Unit 2');

    const salesClearRes = await fetch(`${API_BASE}/api/units/${unit2.id}/sales-clear`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${salesToken}` }
    });
    const salesClearData = await salesClearRes.json();
    assert(salesClearRes.status === 200, `POST /api/units/${unit2.id}/sales-clear returned 200 (got ${salesClearRes.status})`);

    // Verify DB state for Unit 2
    const u2AfterClear = (await pool.query(
      'SELECT current_dept, status, sales_cleared, sales_cleared_by, po_doc_id, po_number FROM order_units WHERE id = $1',
      [unit2.id]
    )).rows[0];
    console.log(`Unit 2 after sales clear: dept=${u2AfterClear.current_dept}, sales_cleared=${u2AfterClear.sales_cleared}, po_doc_id=${u2AfterClear.po_doc_id}`);

    assert(u2AfterClear.sales_cleared === true, 'Unit 2 has sales_cleared = true');
    assert(u2AfterClear.current_dept === 'Design', `Unit 2 advanced to Design without PO (got ${u2AfterClear.current_dept})`);
    assert(u2AfterClear.po_doc_id === null, 'Unit 2 has no PO doc required at this time');

    // Verify Unit 1 STILL remained in Sales!
    const u1AfterClear = (await pool.query('SELECT current_dept, status, sales_cleared FROM order_units WHERE id = $1', [unit1.id])).rows[0];
    console.log(`Unit 1 (sibling) after Unit 2 sales clear: dept=${u1AfterClear.current_dept}, sales_cleared=${u1AfterClear.sales_cleared}`);
    assert(u1AfterClear.current_dept === 'Sales', `Sibling Unit 1 MUST remain in Sales (got ${u1AfterClear.current_dept})`);
    assert(u1AfterClear.sales_cleared === false, 'Sibling Unit 1 sales_cleared must remain false');
    console.log('✓ Test 4 Passed: Manual panel sales clear without PO applies strictly to individual panel.');

    // -------------------------------------------------------------
    // Test 5: Verify BOTH PO document and PO number are strictly required
    // -------------------------------------------------------------
    console.log('\nTest 5: Verifying both PO document AND PO number are required for auto-advancement...');
    const createForm5 = new FormData();
    createForm5.append('company_location_id', String(locId));
    createForm5.append('order_date', '2026-10-02');
    createForm5.append('priority', 'Low');
    createForm5.append('lineItems', JSON.stringify([
      { material_description: 'Test Gating Panel', quantity: 1, unit: 'Nos', unit_price: 1500, total_price: 1500 }
    ]));
    const createRes5 = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: createForm5
    });
    const order5 = (await createRes5.json()).order;
    const unit5Res = await pool.query('SELECT id, current_dept FROM order_units WHERE order_id = $1', [order5.id]);
    const unit5 = unit5Res.rows[0];
    assert(unit5.current_dept === 'Sales', 'Unit 5 starts in Sales');

    // 5A: Set po_number only (no document)
    await fetch(`${API_BASE}/api/units/${unit5.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ po_number: 'PO-TEXT-ONLY-123' })
    });
    const u5AfterPoNum = (await pool.query('SELECT current_dept, po_number, po_doc_id FROM order_units WHERE id = $1', [unit5.id])).rows[0];
    console.log(`Unit 5 with po_number only: dept=${u5AfterPoNum.current_dept}`);
    assert(u5AfterPoNum.current_dept === 'Sales', `Unit with ONLY po_number must stay in Sales (got ${u5AfterPoNum.current_dept})`);

    // 5B: Now upload PO document for Unit 5
    const uploadForm5 = new FormData();
    uploadForm5.append('entity_type', 'Unit');
    uploadForm5.append('entity_id', String(unit5.id));
    uploadForm5.append('doc_type', 'PO');
    uploadForm5.append('files', new Blob(['%PDF-1.4 unit 5 po document'], { type: 'application/pdf' }), 'unit5_po.pdf');
    const uploadRes5 = await fetch(`${API_BASE}/api/documents/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${salesToken}` },
      body: uploadForm5
    });
    assert(uploadRes5.status === 200 || uploadRes5.status === 201, `Upload PO doc for Unit 5 returned 200/201 (got ${uploadRes5.status})`);

    const u5AfterDoc = (await pool.query('SELECT current_dept, po_number, po_doc_id FROM order_units WHERE id = $1', [unit5.id])).rows[0];
    console.log(`Unit 5 with BOTH doc and po_number: dept=${u5AfterDoc.current_dept}, po_number=${u5AfterDoc.po_number}, po_doc_id=${u5AfterDoc.po_doc_id}`);
    assert(u5AfterDoc.current_dept === 'Design', `Unit with BOTH PO doc and PO number must auto-advance to Design (got ${u5AfterDoc.current_dept})`);

    // 5C: Clear po_number on Unit 5 (PO doc remains)
    await fetch(`${API_BASE}/api/units/${unit5.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ po_number: '' })
    });
    const u5AfterClearPoNum = (await pool.query('SELECT current_dept, po_number FROM order_units WHERE id = $1', [unit5.id])).rows[0];
    console.log(`Unit 5 after clearing po_number: dept=${u5AfterClearPoNum.current_dept}`);
    assert(u5AfterClearPoNum.current_dept === 'Sales', `Unit without po_number must drop back to Sales (got ${u5AfterClearPoNum.current_dept})`);

    // 5D: Re-add po_number
    await fetch(`${API_BASE}/api/units/${unit5.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ po_number: 'PO-RESTORED-456' })
    });
    const u5AfterRestore = (await pool.query('SELECT current_dept, po_number FROM order_units WHERE id = $1', [unit5.id])).rows[0];
    console.log(`Unit 5 after restoring po_number: dept=${u5AfterRestore.current_dept}`);
    assert(u5AfterRestore.current_dept === 'Design', `Unit with PO restored must return to Design (got ${u5AfterRestore.current_dept})`);
    console.log('✓ Test 5 Passed: Strictly both PO document and PO number trigger auto-advancement.');

    console.log('\n--- All Panel PO and Sales Flow Tests in this run passed successfully! ---');
  } catch (err) {
    console.error('✗ Test failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
