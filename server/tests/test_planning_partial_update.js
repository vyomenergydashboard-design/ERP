// Planning saves must only change the fields they were sent.
//
// The Planning screen saves a custom-column edit by sending just { custom_fields }. The planning
// endpoints used to write every date column from the request, so that edit emptied the row's
// planned dispatch, wiring, QC and mounting dates. Sending an empty value must still clear a date.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

const ROW_DATES = ['planned_dispatch_date', 'wiring_assigned_date', 'wiring_expected_date', 'expected_qc_date',
  'qc_date', 'mounting_start_date', 'mounting_complete_date'];
const ORDER_DATES = ['planned_dispatch_date', 'wiring_assigned_date', 'wiring_expected_date', 'expected_qc_date', 'qc_date'];

const ALL_DATES_BODY = {
  planned_dispatch_date: '2026-12-20',
  wiring_assigned_date: '2026-12-01',
  wiring_expected_date: '2026-12-05',
  expected_qc_date: '2026-12-10',
  qc_date: '2026-12-11',
  mounting_start_date: '2026-11-25',
  mounting_complete_date: '2026-11-28'
};

async function put(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  assert.strictEqual(res.status, 200, `PUT ${path} expected 200, got ${res.status}: ${text}`);
}

// Dates as text so the comparison does not depend on time zones.
async function snapshot(table, id, columns, extra = []) {
  const cols = [...columns.map(c => `${c}::text AS ${c}`), ...extra].join(', ');
  return (await pool.query(`SELECT ${cols} FROM ${table} WHERE id = $1`, [id])).rows[0];
}

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: PLANNING SAVES ONLY CHANGE SENT FIELDS');
  console.log('====================================================\n');

  let orderId = null;
  try {
    const ts = Date.now();
    const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
    orderId = (await pool.query(
      `INSERT INTO orders (order_number, company_location_id, priority, created_by, end_client_name)
       VALUES ($1, $2, 'Medium', 1, 'Original End Client') RETURNING id`,
      [`TEST-PLANPART-${ts}`, locId]
    )).rows[0].id;
    const lineItemId = (await pool.query(
      `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
       VALUES ($1, $2, 'Partial update panel', 1, 'Nos', 1000, 1000) RETURNING id`,
      [orderId, `TEST-PLANPART-${ts}-01`]
    )).rows[0].id;
    const unitRowId = (await pool.query(
      `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status)
       VALUES ($1, $2, $3, '9902', 'Planning', 'Pending') RETURNING id`,
      [orderId, lineItemId, `9998${ts % 10000}1`]
    )).rows[0].id;

    // --- Line item: PUT /api/planning/line-items/:id ---
    await put(`/api/planning/line-items/${lineItemId}`, ALL_DATES_BODY);
    const liBefore = await snapshot('order_line_items', lineItemId, ROW_DATES);
    ROW_DATES.forEach(c => assert.ok(liBefore[c], `line item ${c} should be set by the full save`));

    await put(`/api/planning/line-items/${lineItemId}`, { custom_fields: { remarks: 'line item note' } });
    const liAfter = await snapshot('order_line_items', lineItemId, ROW_DATES, ['custom_fields']);
    ROW_DATES.forEach(c => assert.strictEqual(liAfter[c], liBefore[c],
      `line item ${c} changed after a custom-field-only save: ${liBefore[c]} -> ${liAfter[c]}`));
    assert.strictEqual(liAfter.custom_fields.remarks, 'line item note');
    console.log('✓ line item: a custom-field-only save keeps all 7 planning dates');

    // --- Unit: PUT /api/planning/units/:unitId ---
    await put(`/api/planning/units/${unitRowId}`, ALL_DATES_BODY);
    const uBefore = await snapshot('order_units', unitRowId, ROW_DATES);
    ROW_DATES.forEach(c => assert.ok(uBefore[c], `unit ${c} should be set by the full save`));

    await put(`/api/planning/units/${unitRowId}`, { custom_fields: { remarks: 'unit note' } });
    const uAfter = await snapshot('order_units', unitRowId, ROW_DATES, ['custom_fields']);
    ROW_DATES.forEach(c => assert.strictEqual(uAfter[c], uBefore[c],
      `unit ${c} changed after a custom-field-only save: ${uBefore[c]} -> ${uAfter[c]}`));
    assert.strictEqual(uAfter.custom_fields.remarks, 'unit note');
    console.log('✓ unit: a custom-field-only save keeps all 7 planning dates');

    // Sending an empty value still clears that date, and only that date.
    await put(`/api/planning/units/${unitRowId}`, { qc_date: '' });
    const uCleared = await snapshot('order_units', unitRowId, ROW_DATES);
    assert.strictEqual(uCleared.qc_date, null, 'an empty qc_date should clear it');
    ROW_DATES.filter(c => c !== 'qc_date').forEach(c => assert.strictEqual(uCleared[c], uBefore[c],
      `unit ${c} changed when only qc_date was cleared`));
    console.log('✓ unit: sending an empty date clears just that date');

    // --- Order: PUT /api/orders/:id/planning ---
    await put(`/api/orders/${orderId}/planning`, { ...ALL_DATES_BODY, end_client_name: 'Planned End Client' });
    const oBefore = await snapshot('orders', orderId, ORDER_DATES, ['end_client_name', 'priority']);
    ORDER_DATES.forEach(c => assert.ok(oBefore[c], `order ${c} should be set by the full save`));

    await put(`/api/orders/${orderId}/planning`, { priority: 'High' });
    const oAfter = await snapshot('orders', orderId, ORDER_DATES, ['end_client_name', 'priority']);
    ORDER_DATES.forEach(c => assert.strictEqual(oAfter[c], oBefore[c],
      `order ${c} changed after a priority-only save: ${oBefore[c]} -> ${oAfter[c]}`));
    assert.strictEqual(oAfter.end_client_name, 'Planned End Client', 'end_client_name changed after a priority-only save');
    assert.strictEqual(oAfter.priority, 'High');
    console.log('✓ order: a priority-only save keeps the planning dates and end client');

    console.log('\n====================================================');
    console.log('  ALL PLANNING PARTIAL-UPDATE TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    if (orderId) {
      await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
      console.log('Cleaned up test order:', orderId);
    }
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
