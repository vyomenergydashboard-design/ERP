// The table (GET /api/dept-worklist/all) shows a panel's own line-item delivery date first and falls
// back to the order's. This keeps each panel's date when panels from several orders are regrouped
// under one order number.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db' });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

const day = (v) => (v ? String(v).slice(0, 10) : null);

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: WORKLIST DELIVERY DATE (LINE ITEM FIRST)');
  console.log('====================================================\n');

  let orderId = null;
  try {
    const ts = Date.now();
    const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
    orderId = (await pool.query(
      `INSERT INTO orders (order_number, company_location_id, priority, created_by, delivery_date)
       VALUES ($1, $2, 'Medium', 1, '2026-05-08') RETURNING id`,
      [`TEST-DELIVERY-${ts}`, locId]
    )).rows[0].id;
    const withOwnDate = (await pool.query(
      `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price, delivery_date)
       VALUES ($1, $2, 'Own date', 1, 'Nos', 1, 1, '2026-10-08') RETURNING id`, [orderId, `TEST-DELIVERY-${ts}-01`]
    )).rows[0].id;
    const withoutDate = (await pool.query(
      `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
       VALUES ($1, $2, 'No own date', 1, 'Nos', 1, 1) RETURNING id`, [orderId, `TEST-DELIVERY-${ts}-02`]
    )).rows[0].id;
    const serialA = `9995${ts % 10000}1`;
    const serialB = `9995${ts % 10000}2`;
    await pool.query(
      `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status)
       VALUES ($1, $2, $4, $4, 'Sales', 'Pending'), ($1, $3, $5, $5, 'Sales', 'Pending')`,
      [orderId, withOwnDate, withoutDate, serialA, serialB]
    );

    const res = await fetch(`${API_BASE}/api/dept-worklist/all`, { headers: { Authorization: `Bearer ${adminToken}` } });
    assert.strictEqual(res.status, 200);
    const rows = await res.json();
    const a = rows.find(r => String(r.short_serial) === serialA);
    const b = rows.find(r => String(r.short_serial) === serialB);
    assert.ok(a && b, 'both test panels should be in the worklist');
    assert.strictEqual(day(a.delivery_date), '2026-10-08', 'a panel with its own line-item date shows that date');
    assert.strictEqual(day(b.delivery_date), '2026-05-08', 'a panel without one falls back to the order date');
    console.log('✓ line-item delivery date first, order date as the fallback');

    console.log('\n====================================================');
    console.log('  ALL WORKLIST DELIVERY DATE TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    if (orderId) await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
