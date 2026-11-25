// The table's Order Date column: GET /api/dept-worklist/all returns each panel's order date as a plain
// 'YYYY-MM-DD' string (null when the order has none), and 'order_date' is a system column master that
// is visible in every department view by default.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db' });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
const auth = { Authorization: `Bearer ${adminToken}` };

const createdOrderIds = [];

async function seedPanel(ts, suffix, orderDate) {
  const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
  const orderId = (await pool.query(
    `INSERT INTO orders (order_number, company_location_id, priority, created_by, order_date)
     VALUES ($1, $2, 'Medium', 1, $3) RETURNING id`,
    [`TEST-ORDERDATE-${ts}-${suffix}`, locId, orderDate]
  )).rows[0].id;
  createdOrderIds.push(orderId);
  const lineItemId = (await pool.query(
    `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
     VALUES ($1, $2, 'Order date test', 1, 'Nos', 1, 1) RETURNING id`,
    [orderId, `TEST-ORDERDATE-${ts}-${suffix}-01`]
  )).rows[0].id;
  const serial = `9996${ts % 10000}${suffix}`;
  await pool.query(
    `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status)
     VALUES ($1, $2, $3, $3, 'Sales', 'Pending')`,
    [orderId, lineItemId, serial]
  );
  return serial;
}

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: WORKLIST ORDER DATE COLUMN');
  console.log('====================================================\n');

  try {
    const ts = Date.now();
    const dated = await seedPanel(ts, 1, '2026-04-03');
    const undated = await seedPanel(ts, 2, null);

    const res = await fetch(`${API_BASE}/api/dept-worklist/all`, { headers: auth });
    assert.strictEqual(res.status, 200);
    const rows = await res.json();
    const a = rows.find(r => String(r.short_serial) === dated);
    const b = rows.find(r => String(r.short_serial) === undated);
    assert.ok(a && b, 'both test panels should be in the worklist');
    assert.strictEqual(a.order_date, '2026-04-03', "a dated order comes back as a plain 'YYYY-MM-DD' string (no timezone shift)");
    assert.strictEqual(b.order_date, null, 'an order without a date comes back as null');
    console.log('✓ worklist returns order_date as YYYY-MM-DD, null when the order has none');

    const colRes = await fetch(`${API_BASE}/api/column-masters`, { headers: auth });
    assert.strictEqual(colRes.status, 200);
    const { columns, visibilityByDept } = await colRes.json();
    const master = columns.filter(c => c.col_key === 'order_date');
    assert.strictEqual(master.length, 1, 'exactly one order_date column master');
    assert.strictEqual(master[0].is_system, true, 'it is a system column');
    assert.strictEqual(master[0].label, 'Order Date');
    assert.strictEqual(master[0].field_type, 'Date');
    for (const dept of ['all', 'Sales', 'Design', 'Purchase', 'Stores', 'Planning', 'Production', 'QC', 'Dispatch', 'Accounts']) {
      assert.strictEqual(visibilityByDept[dept]?.order_date, true, `order_date is visible in the ${dept} view by default`);
    }
    console.log('✓ order_date is a system column, visible in every department view');

    console.log('\n====================================================');
    console.log('  ALL WORKLIST ORDER DATE TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    if (createdOrderIds.length) await pool.query('DELETE FROM orders WHERE id = ANY($1::int[])', [createdOrderIds]);
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
