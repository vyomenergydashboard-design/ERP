import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function runTests() {
  console.log('========================================================================');
  console.log('  TEST SUITE: DISPATCH & ACCOUNTS COLUMNS AND MULTI-SELECT UPDATE       ');
  console.log('========================================================================\n');

  const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  };

  const client = await pool.connect();
  let createdOrderId = null;
  let createdUnitIds = [];

  try {
    // 1. Verify Database Schema
    console.log('[TEST 1] Verifying Dispatch & Accounts columns in DB...');
    const colCheck = await client.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('order_units', 'order_line_items')
        AND column_name IN ('dispatch_date', 'invoice_number', 'invoice_date')
      ORDER BY table_name, column_name;
    `);

    const foundCols = colCheck.rows.map(r => `${r.table_name}.${r.column_name}`);
    console.log('Found database columns:', foundCols);
    assert(foundCols.includes('order_units.dispatch_date'), 'order_units.dispatch_date missing');
    assert(foundCols.includes('order_units.invoice_number'), 'order_units.invoice_number missing');
    assert(foundCols.includes('order_units.invoice_date'), 'order_units.invoice_date missing');
    assert(foundCols.includes('order_line_items.dispatch_date'), 'order_line_items.dispatch_date missing');
    assert(foundCols.includes('order_line_items.invoice_number'), 'order_line_items.invoice_number missing');
    assert(foundCols.includes('order_line_items.invoice_date'), 'order_line_items.invoice_date missing');
    console.log('✓ All 3 columns exist with correct types in order_units and order_line_items.');

    // 2. Verify column_masters and department_column_visibility
    console.log('\n[TEST 2] Verifying column_masters and department column visibility...');
    const cmCheck = await client.query(`
      SELECT col_key, label, category, field_type 
      FROM column_masters 
      WHERE col_key IN ('dispatch_date', 'invoice_number', 'invoice_date');
    `);
    assert.strictEqual(cmCheck.rows.length, 3, 'Expected 3 records in column_masters');
    const dispCol = cmCheck.rows.find(c => c.col_key === 'dispatch_date');
    const invNumCol = cmCheck.rows.find(c => c.col_key === 'invoice_number');
    const invDateCol = cmCheck.rows.find(c => c.col_key === 'invoice_date');
    assert.strictEqual(dispCol.category, 'Dispatch');
    assert.strictEqual(dispCol.field_type, 'Date');
    assert.strictEqual(invNumCol.category, 'Accounts');
    assert.strictEqual(invNumCol.field_type, 'Text');
    assert.strictEqual(invDateCol.category, 'Accounts');
    assert.strictEqual(invDateCol.field_type, 'Date');

    const visCheck = await client.query(`
      SELECT dept, col_key, is_visible 
      FROM department_column_visibility 
      WHERE (dept = 'Dispatch' AND col_key = 'dispatch_date')
         OR (dept = 'Accounts' AND col_key IN ('invoice_number', 'invoice_date'));
    `);
    assert.strictEqual(visCheck.rows.length, 3, 'Expected 3 visibility entries');
    for (const v of visCheck.rows) {
      assert.strictEqual(v.is_visible, true, `Column ${v.col_key} must be visible in ${v.dept}`);
    }
    console.log('✓ column_masters and department_column_visibility properly established.');

    // 3. Set up test order with 2 units
    console.log('\n[TEST 3] Creating dummy test order and units for persistence test...');
    const ts = Date.now();
    const locRes = await client.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows.length > 0 ? locRes.rows[0].id : null;

    const ordRes = await client.query(`
      INSERT INTO orders (order_number, company_location_id, po_number, status, priority, classification, created_by)
      VALUES ($1, $2, 'PO-DISP-ACC-01', 'In Progress', 'High', 'Standard', 1)
      RETURNING id;
    `, [`TEST-DA-${ts}`, locId]);
    createdOrderId = ordRes.rows[0].id;

    const liRes = await client.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price, status)
      VALUES ($1, '01', 'Test Dispatch Unit', 2, 'Nos', 10000, 20000, 'In Progress')
      RETURNING id;
    `, [createdOrderId]);
    const lineItemId = liRes.rows[0].id;

    await client.query(`
      INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path)
      VALUES 
        ('Order', $1, 'Drawing', 'test_drawing.pdf', '/tmp/drawing.pdf'),
        ('Order', $1, 'BOM', 'test_bom.xlsx', '/tmp/bom.xlsx');
    `, [createdOrderId]);

    for (let i = 1; i <= 2; i++) {
      const uRes = await client.query(`
        INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, hold_status, sales_cleared, design_confirmed, tray_start_date, issued_date, handover_to_qc_date)
        VALUES ($1, $2, $3, $4, 'Dispatch', 'Ready for Dispatch', 'None', true, true, '2026-11-01', '2026-11-02', '2026-11-03')
        RETURNING id;
      `, [createdOrderId, lineItemId, `UDA-${ts}-${i}`, `SDA-${ts}-${i}`]);
      createdUnitIds.push(uRes.rows[0].id);

      await client.query(`
        INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
        VALUES 
          ($1, 'Dispatch', 'Ready for Dispatch', 'pending', 1),
          ($1, 'Accounts', 'Invoice & Dispatch Note', 'pending', 2);
      `, [uRes.rows[0].id]);
    }

    // 4. Test Dispatch Date persistence
    console.log('\n[TEST 4] Updating Dispatch Date via PUT /api/units/:id...');
    const targetUnit1 = createdUnitIds[0];
    const dispatchDateVal = '2026-11-04';
    const putDispRes = await fetch(`${API_BASE}/api/units/${targetUnit1}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ dispatch_date: dispatchDateVal })
    });
    assert(putDispRes.ok, `PUT dispatch_date returned ${putDispRes.status}`);

    const checkDisp = await client.query('SELECT dispatch_date, current_dept FROM order_units WHERE id = $1', [targetUnit1]);
    const savedDateStr = checkDisp.rows[0].dispatch_date instanceof Date ? checkDisp.rows[0].dispatch_date.toLocaleDateString('en-CA') : String(checkDisp.rows[0].dispatch_date).split('T')[0];
    assert.strictEqual(savedDateStr, dispatchDateVal, 'dispatch_date not saved accurately');
    console.log(`✓ dispatch_date successfully saved: ${savedDateStr}`);

    // 5. Test Invoice Number and Invoice Date persistence
    console.log('\n[TEST 5] Updating Invoice Number and Invoice Date via PUT /api/units/:id...');
    const invoiceNumVal = 'INV-2026-9901';
    const invoiceDateVal = '2026-11-05';
    const putInvRes = await fetch(`${API_BASE}/api/units/${targetUnit1}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        invoice_number: invoiceNumVal,
        invoice_date: invoiceDateVal
      })
    });
    assert(putInvRes.ok, `PUT invoice info returned ${putInvRes.status}`);

    const checkInv = await client.query('SELECT invoice_number, invoice_date FROM order_units WHERE id = $1', [targetUnit1]);
    assert.strictEqual(checkInv.rows[0].invoice_number, invoiceNumVal, 'invoice_number not saved accurately');
    const savedInvDateStr = checkInv.rows[0].invoice_date instanceof Date ? checkInv.rows[0].invoice_date.toLocaleDateString('en-CA') : String(checkInv.rows[0].invoice_date).split('T')[0];
    assert.strictEqual(savedInvDateStr, invoiceDateVal, 'invoice_date not saved accurately');
    console.log(`✓ invoice_number ("${invoiceNumVal}") and invoice_date (${savedInvDateStr}) successfully saved!`);

    // 6. Test Multi-Select Batch Updates
    console.log('\n[TEST 6] Simulating multi-select batch update across both units...');
    const batchInvoiceNum = 'INV-BATCH-7777';
    const batchDispatchDate = '2026-11-10';

    await Promise.all(createdUnitIds.map(uId => {
      return fetch(`${API_BASE}/api/units/${uId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          invoice_number: batchInvoiceNum,
          dispatch_date: batchDispatchDate
        })
      });
    }));

    const checkBatch = await client.query(
      'SELECT id, invoice_number, dispatch_date FROM order_units WHERE id = ANY($1::int[])',
      [createdUnitIds]
    );
    assert.strictEqual(checkBatch.rows.length, 2);
    for (const row of checkBatch.rows) {
      assert.strictEqual(row.invoice_number, batchInvoiceNum);
      const rowDispDate = row.dispatch_date instanceof Date ? row.dispatch_date.toLocaleDateString('en-CA') : String(row.dispatch_date).split('T')[0];
      assert.strictEqual(rowDispDate, batchDispatchDate);
    }
    console.log('✓ Multi-unit batch update applied identically across all selected units!');

    // 7. Verify GET /api/dept-worklist returns the new columns
    console.log('\n[TEST 7] Verifying GET /api/dept-worklist/Dispatch & Accounts returns columns...');
    const getDisp = await fetch(`${API_BASE}/api/dept-worklist/Dispatch`, { headers });
    assert(getDisp.ok);
    const dispList = await getDisp.json();
    console.log('Dispatch worklist count:', dispList.length, 'createdUnitIds:', createdUnitIds);
    const sampleDisp = dispList.find(u => createdUnitIds.includes(u.unit_id));
    console.log('Found in Dispatch worklist:', sampleDisp ? 'YES' : 'NO');
    const foundUnitInDisp = sampleDisp;
    assert(foundUnitInDisp, 'Unit should be in Dispatch worklist');
    assert(foundUnitInDisp.hasOwnProperty('dispatch_date'), 'Dispatch worklist response missing dispatch_date');

    const getAcc = await fetch(`${API_BASE}/api/dept-worklist/Accounts`, { headers });
    assert(getAcc.ok);
    const accList = await getAcc.json();
    const foundUnitInAcc = accList.find(u => createdUnitIds.includes(u.unit_id));
    assert(foundUnitInAcc, 'Unit should be in Accounts worklist');
    assert(foundUnitInAcc.hasOwnProperty('invoice_number'), 'Accounts worklist response missing invoice_number');
    assert(foundUnitInAcc.hasOwnProperty('invoice_date'), 'Accounts worklist response missing invoice_date');
    assert.strictEqual(foundUnitInAcc.invoice_number, batchInvoiceNum);
    console.log('✓ Both Dispatch and Accounts worklists return the new columns accurately!');

    console.log('\n========================================================================');
    console.log('  ALL DISPATCH & ACCOUNTS COLUMN TESTS COMPLETED SUCCESSFULLY!          ');
    console.log('========================================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    if (createdOrderId) {
      console.log('Cleaning up test dummy order and units...');
      await client.query('DELETE FROM unit_steps WHERE order_unit_id = ANY($1::int[])', [createdUnitIds]);
      await client.query('DELETE FROM order_units WHERE order_id = $1', [createdOrderId]);
      await client.query('DELETE FROM order_line_items WHERE order_id = $1', [createdOrderId]);
      await client.query('DELETE FROM orders WHERE id = $1', [createdOrderId]);
    }
    client.release();
    await pool.end();
  }
}

runTests();
