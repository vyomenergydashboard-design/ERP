// Line-item prices: 0 is a valid price; a missing or empty price is a clear 400, never a 500.
//
// order_line_items.unit_price and total_price are NOT NULL. Order create used to insert the raw
// request values (a missing price crashed the insert), and line-item edit turned a price of 0 or ''
// into NULL (and skipped the total for a price of 0), so both answered 500.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

async function createOrder(lineItems) {
  const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
  const form = new FormData();
  form.append('company_location_id', String(locId));
  form.append('order_date', '2026-11-19');
  form.append('priority', 'Medium');
  form.append('lineItems', JSON.stringify(lineItems));
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }, body: form
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function editLineItem(orderId, liId, body) {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}/line-items/${liId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify(body)
  });
  return { status: res.status, data: await res.json().catch(() => ({})) };
}

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: LINE-ITEM PRICE VALIDATION');
  console.log('====================================================\n');

  const createdOrderIds = [];
  try {
    // 1. Create without a price: clear 400, and no order is created.
    const ordersBefore = Number((await pool.query('SELECT count(*) FROM orders')).rows[0].count);
    const missing = await createOrder([{ material_description: 'No price panel', quantity: 1, unit: 'Nos' }]);
    if (missing.data?.order?.id) createdOrderIds.push(missing.data.order.id);
    assert.strictEqual(missing.status, 400, `create without a price: expected 400, got ${missing.status} ${JSON.stringify(missing.data)}`);
    assert.match(missing.data.error || '', /unit price is required/i, `unexpected error message: ${missing.data.error}`);
    const ordersAfter = Number((await pool.query('SELECT count(*) FROM orders')).rows[0].count);
    assert.strictEqual(ordersAfter, ordersBefore, 'a rejected order must not be created');
    console.log('✓ create: a missing price is a 400 "Unit price is required", and no order is created');

    // 2. Create with an empty price: same clear 400.
    const empty = await createOrder([{ material_description: 'Empty price panel', quantity: 1, unit: 'Nos', unit_price: '' }]);
    if (empty.data?.order?.id) createdOrderIds.push(empty.data.order.id);
    assert.strictEqual(empty.status, 400, `create with an empty price: expected 400, got ${empty.status}`);
    assert.match(empty.data.error || '', /unit price is required/i);
    console.log('✓ create: an empty price is a 400 "Unit price is required"');

    // 3. Create with a price of 0 (no total sent): accepted, stored as 0 with a total of 0.
    const free = await createOrder([{ material_description: 'Free panel', quantity: 2, unit: 'Nos', unit_price: 0 }]);
    assert.strictEqual(free.status, 201, `create with a price of 0: expected 201, got ${free.status} ${JSON.stringify(free.data)}`);
    const orderId = free.data.order.id;
    createdOrderIds.push(orderId);
    const li = (await pool.query(
      'SELECT id, unit_price::text AS unit_price, total_price::text AS total_price FROM order_line_items WHERE order_id = $1', [orderId]
    )).rows[0];
    assert.strictEqual(li.unit_price, '0.00');
    assert.strictEqual(li.total_price, '0.00');
    console.log('✓ create: a price of 0 is accepted and stored as 0 (total 0)');

    // 4. Edit: set a real price, then back to 0.
    let r = await editLineItem(orderId, li.id, { quantity: 2, unit_price: 500 });
    assert.strictEqual(r.status, 200, `edit to 500: expected 200, got ${r.status} ${JSON.stringify(r.data)}`);
    r = await editLineItem(orderId, li.id, { unit_price: 0 });
    assert.strictEqual(r.status, 200, `edit price to 0: expected 200, got ${r.status} ${JSON.stringify(r.data)}`);
    let row = (await pool.query('SELECT unit_price::text AS p FROM order_line_items WHERE id = $1', [li.id])).rows[0];
    assert.strictEqual(row.p, '0.00', `edit price to 0 stored ${row.p}`);
    console.log('✓ edit: setting the price to 0 works');

    // 5. Edit quantity and price 0 together: the total is recalculated to 0.
    r = await editLineItem(orderId, li.id, { quantity: 3, unit_price: 0 });
    assert.strictEqual(r.status, 200, `edit quantity + price 0: expected 200, got ${r.status} ${JSON.stringify(r.data)}`);
    row = (await pool.query('SELECT unit_price::text AS p, total_price::text AS t FROM order_line_items WHERE id = $1', [li.id])).rows[0];
    assert.strictEqual(row.p, '0.00');
    assert.strictEqual(row.t, '0.00', `total after quantity 3 x price 0 is ${row.t}`);
    console.log('✓ edit: quantity with a price of 0 gives a total of 0');

    // 6. Edit with an empty price: clear 400, price unchanged.
    r = await editLineItem(orderId, li.id, { unit_price: '' });
    assert.strictEqual(r.status, 400, `edit with an empty price: expected 400, got ${r.status}`);
    assert.match(r.data.error || '', /unit price is required/i, `unexpected error message: ${r.data.error}`);
    row = (await pool.query('SELECT unit_price::text AS p FROM order_line_items WHERE id = $1', [li.id])).rows[0];
    assert.strictEqual(row.p, '0.00', 'a rejected edit must not change the price');
    console.log('✓ edit: an empty price is a 400 "Unit price is required" and changes nothing');

    console.log('\n====================================================');
    console.log('  ALL LINE-ITEM PRICE TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    if (createdOrderIds.length) {
      await pool.query('DELETE FROM orders WHERE id = ANY($1::int[])', [createdOrderIds]);
      console.log('Cleaned up test orders:', createdOrderIds.join(', '));
    }
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
