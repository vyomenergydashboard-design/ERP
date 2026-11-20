// Writes that change an order must tell the other open views through the live event stream (SSE).
//
// Opens /api/events with a ticket, makes a few writes against a TEST- order, and checks that an
// ORDER_UPDATED event with the right entity and order id arrives for each one.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` };

const events = [];
const controller = new AbortController();

async function openStream() {
  const ticketRes = await fetch(`${API_BASE}/api/events/ticket`, { method: 'POST', headers: authHeaders });
  assert.strictEqual(ticketRes.status, 200, 'ticket request should succeed');
  const { ticket } = await ticketRes.json();
  const res = await fetch(`${API_BASE}/api/events?ticket=${encodeURIComponent(ticket)}`, { signal: controller.signal });
  assert.strictEqual(res.status, 200, 'event stream should open');

  const decoder = new TextDecoder();
  let buffer = '';
  (async () => {
    try {
      for await (const chunk of res.body) {
        buffer += decoder.decode(chunk, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const frame = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const line = frame.split('\n').find(l => l.startsWith('data: '));
          if (!line) continue;
          try { events.push(JSON.parse(line.slice(6))); } catch (_) { /* heartbeat or non-JSON */ }
        }
      }
    } catch (_) { /* aborted at the end of the test */ }
  })();
}

async function waitForEvent(predicate, label) {
  for (let i = 0; i < 40; i++) {
    const found = events.find(predicate);
    if (found) return found;
    await new Promise(r => setTimeout(r, 100));
  }
  assert.fail(`no ORDER_UPDATED event arrived for: ${label}. Received: ${JSON.stringify(events)}`);
}

async function call(method, path, body) {
  const res = await fetch(`${API_BASE}${path}`, { method, headers: authHeaders, body: body ? JSON.stringify(body) : undefined });
  const text = await res.text();
  assert.strictEqual(res.status, 200, `${method} ${path} expected 200, got ${res.status}: ${text}`);
}

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: WRITES BROADCAST ORDER_UPDATED EVENTS');
  console.log('====================================================\n');

  let orderId = null;
  try {
    const ts = Date.now();
    const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
    orderId = (await pool.query(
      `INSERT INTO orders (order_number, company_location_id, priority, created_by, end_client_name)
       VALUES ($1, $2, 'Medium', 1, 'Event test') RETURNING id`,
      [`TEST-EVENTS-${ts}`, locId]
    )).rows[0].id;
    const lineItemId = (await pool.query(
      `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
       VALUES ($1, $2, 'Event panel', 1, 'Nos', 1000, 1000) RETURNING id`,
      [orderId, `TEST-EVENTS-${ts}-01`]
    )).rows[0].id;
    const unitRowId = (await pool.query(
      `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status)
       VALUES ($1, $2, $3, '9903', 'Planning', 'Pending') RETURNING id`,
      [orderId, lineItemId, `9997${ts % 10000}1`]
    )).rows[0].id;

    await openStream();

    const check = async (label, fn, entity) => {
      const before = events.length;
      await fn();
      const ev = await waitForEvent(
        (e, i) => events.indexOf(e) >= before && e.type === 'ORDER_UPDATED' && e.entity === entity && String(e.orderId) === String(orderId),
        label
      );
      assert.ok(ev.timestamp, `${label}: event should carry a timestamp`);
      console.log(`✓ ${label} -> ORDER_UPDATED (${entity})`);
    };

    await check('planning save for a line item',
      () => call('PUT', `/api/planning/line-items/${lineItemId}`, { custom_fields: { remarks: 'x' } }), 'planning');
    await check('planning save for a unit',
      () => call('PUT', `/api/planning/units/${unitRowId}`, { custom_fields: { remarks: 'y' } }), 'planning');
    await check('bulk planning save',
      () => call('PUT', '/api/planning/line-items/bulk', { lineItemIds: [lineItemId], fields: { custom_fields: { remarks: 'z' } } }), 'planning');
    await check('order planning save',
      () => call('PUT', `/api/orders/${orderId}/planning`, { priority: 'High' }), 'planning');
    await check('order amend',
      () => call('PUT', `/api/orders/${orderId}`, { end_client_name: 'Event test 2' }), 'order');

    console.log('\n====================================================');
    console.log('  ALL EVENT BROADCAST TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    controller.abort();
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
