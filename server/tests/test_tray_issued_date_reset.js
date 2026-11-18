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
  console.log('  TEST SUITE: TRAY STATUS ISSUED DATE RESET');
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
    `, [`TEST-TRAY-${ts}`, locId]);
    testOrderId = ordRes.rows[0].id;

    const liRes = await pool.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
      VALUES ($1, $2, 'Test Tray Panel', 1, 'Nos', 1000, 1000)
      RETURNING id
    `, [testOrderId, `TEST-TRAY-${ts}-01`]);

    const uRes = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, tray_status)
      VALUES ($1, $2, $3, '9901', 'Stores', 'Pending', 'Not Started')
      RETURNING id, unit_id
    `, [testOrderId, liRes.rows[0].id, `9999${ts % 10000}1`]);
    testUnitRealId = uRes.rows[0].id;
    testUnitId = uRes.rows[0].unit_id;

    console.log(`Created test order ${testOrderId} and unit ${testUnitId} (id: ${testUnitRealId})`);

    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    // Test 1: Start the tray -> tray_status: 'In Process'
    console.log('\n--- Test 1: Set tray_status to "In Process" ---');
    let res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ tray_status: 'In Process' })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    let row = (await pool.query('SELECT tray_status, tray_start_date, issued_date FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(row.tray_status, 'In Process');
    assert.ok(row.tray_start_date, 'tray_start_date should be set');
    assert.strictEqual(row.issued_date, null, 'issued_date should be null initially');
    console.log('✓ Tray started with start date:', row.tray_start_date);

    // Test 2: Transition to "Partial Issued" -> should get today's date
    console.log('\n--- Test 2: Transition to "Partial Issued" ---');
    res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ tray_status: 'Partial Issued' })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    row = (await pool.query('SELECT tray_status, tray_start_date, issued_date FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(row.tray_status, 'Partial Issued');
    assert.ok(row.issued_date, 'issued_date should be set when Partial Issued');
    const dObj = new Date(row.issued_date);
    const dbIssuedStr = `${dObj.getFullYear()}-${String(dObj.getMonth() + 1).padStart(2, '0')}-${String(dObj.getDate()).padStart(2, '0')}`;
    assert.strictEqual(dbIssuedStr, todayStr, `Expected issued_date to be today ${todayStr}, got ${dbIssuedStr}`);
    console.log('✓ Issued date set to today:', dbIssuedStr);

    // Test 3: Change tray_status to non-issued status ("Full Ready") WITHOUT passing issued_date -> should reset issued_date to null
    console.log('\n--- Test 3: Change tray_status to "Full Ready" (implicit reset) ---');
    res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ tray_status: 'Full Ready' })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    row = (await pool.query('SELECT tray_status, tray_start_date, issued_date FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(row.tray_status, 'Full Ready');
    assert.strictEqual(row.issued_date, null, `Expected issued_date to reset to null, but got ${row.issued_date}`);
    console.log('✓ Issued date reset to null when changing to Full Ready');

    // Test 4: Change tray_status to "All Issued" -> should get today's date again
    console.log('\n--- Test 4: Change tray_status to "All Issued" ---');
    res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ tray_status: 'All Issued' })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    row = (await pool.query('SELECT tray_status, tray_start_date, issued_date FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(row.tray_status, 'All Issued');
    assert.ok(row.issued_date, 'issued_date should be stamped again');
    console.log('✓ Issued date re-stamped when changed to All Issued');

    // Test 5: Change tray_status to "In Process" WITH explicit issued_date: null (as frontend sends) -> should reset
    console.log('\n--- Test 5: Change tray_status to "In Process" with explicit issued_date: null ---');
    res = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ tray_status: 'In Process', issued_date: null, custom_fields: { tray_status: 'In Process', issued_date: null } })
    });
    assert.strictEqual(res.status, 200, `Expected 200, got ${res.status}`);

    row = (await pool.query('SELECT tray_status, tray_start_date, issued_date, custom_fields FROM order_units WHERE id = $1', [testUnitRealId])).rows[0];
    assert.strictEqual(row.tray_status, 'In Process');
    assert.strictEqual(row.issued_date, null, 'issued_date should be null');
    assert.strictEqual(row.custom_fields?.issued_date ?? null, null, 'custom_fields.issued_date should be null');
    console.log('✓ Issued date and custom_fields.issued_date are null');

    // Test 6: Multi-unit batch scenario simulation
    console.log('\n--- Test 6: Multi-unit batch tray status update simulation ---');
    const uRes2 = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, tray_status, tray_start_date)
      VALUES ($1, $2, $3, '9902', 'Stores', 'Pending', 'In Process', CURRENT_DATE)
      RETURNING id, unit_id
    `, [testOrderId, liRes.rows[0].id, `9999${ts % 10000}2`]);
    const testUnitRealId2 = uRes2.rows[0].id;
    const testUnitId2 = uRes2.rows[0].unit_id;

    // Batch update both to "Partial Issued"
    const batchUnits = [testUnitId, testUnitId2];
    await Promise.all(batchUnits.map(uid =>
      fetch(`${API_BASE}/api/units/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ tray_status: 'Partial Issued', issued_date: todayStr })
      })
    ));

    let rows = (await pool.query('SELECT id, tray_status, issued_date FROM order_units WHERE id IN ($1, $2)', [testUnitRealId, testUnitRealId2])).rows;
    assert.strictEqual(rows.length, 2);
    rows.forEach(r => {
      assert.strictEqual(r.tray_status, 'Partial Issued');
      assert.ok(r.issued_date, 'Batch: issued_date should be set');
    });
    console.log('✓ Batch: both units stamped with issued_date when set to Partial Issued');

    // Batch update both back to "Full Ready" with issued_date: null
    await Promise.all(batchUnits.map(uid =>
      fetch(`${API_BASE}/api/units/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ tray_status: 'Full Ready', issued_date: null })
      })
    ));

    rows = (await pool.query('SELECT id, tray_status, issued_date FROM order_units WHERE id IN ($1, $2)', [testUnitRealId, testUnitRealId2])).rows;
    rows.forEach(r => {
      assert.strictEqual(r.tray_status, 'Full Ready');
      assert.strictEqual(r.issued_date, null, 'Batch: issued_date should reset to null when changing to Full Ready');
    });
    console.log('✓ Batch: both units reset issued_date to null when changed to Full Ready');

    console.log('\n====================================================');
    console.log('  ALL TRAY ISSUED DATE RESET TESTS PASSED!');
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
