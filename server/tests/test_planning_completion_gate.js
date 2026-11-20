// Setting a panel's Planning status to 'Completed' must not tick off upstream steps.
//
// - A Planning user gets HTTP 409 (and nothing is written, no event is broadcast) while Sales /
//   Design / Purchase / Stores steps are unfinished: unit, line-item and bulk saves.
// - Admin / Manager are exempt from the 409 but still never force-complete upstream steps.
// - Re-saving a row that is already Completed (the Planning screen resends the current status with
//   every date edit) is not refused when an upstream step was reopened later, e.g. a QC fail back
//   to Design.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db' });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const tokenFor = (id, username, role) => jwt.sign({ id, username, role }, JWT_SECRET, { expiresIn: '1h' });
const adminToken = tokenFor(1, 'admin', 'Admin');

const events = [];
const controller = new AbortController();
async function openStream() {
  const t = await (await fetch(`${API_BASE}/api/events/ticket`, {
    method: 'POST', headers: { Authorization: `Bearer ${adminToken}` }
  })).json();
  const res = await fetch(`${API_BASE}/api/events?ticket=${encodeURIComponent(t.ticket)}`, { signal: controller.signal });
  assert.strictEqual(res.status, 200, 'event stream should open');
  const decoder = new TextDecoder();
  let buffer = '';
  (async () => {
    try {
      for await (const chunk of res.body) {
        buffer += decoder.decode(chunk, { stream: true });
        let i;
        while ((i = buffer.indexOf('\n\n')) !== -1) {
          const line = buffer.slice(0, i).split('\n').find(l => l.startsWith('data: '));
          buffer = buffer.slice(i + 2);
          if (line) { try { events.push(JSON.parse(line.slice(6))); } catch (_) { /* ignore */ } }
        }
      }
    } catch (_) { /* aborted */ }
  })();
}

async function put(token, path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body)
  });
  return { status: res.status, text: await res.text() };
}

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: PLANNING "COMPLETED" GATE');
  console.log('====================================================\n');

  let orderId = null;
  let userId = null;
  try {
    const ts = Date.now();
    userId = (await pool.query(
      `INSERT INTO users (username, email, password, role)
       VALUES ('plan_gate_test_user', 'plan_gate@test.local', 'hash', 'Planning')
       ON CONFLICT (username) DO UPDATE SET role = 'Planning'
       RETURNING id`
    )).rows[0].id;
    const planningToken = tokenFor(userId, 'plan_gate_test_user', 'Planning');

    const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
    orderId = (await pool.query(
      `INSERT INTO orders (order_number, company_location_id, priority, created_by, end_client_name)
       VALUES ($1, $2, 'Medium', 1, 'Gate test') RETURNING id`,
      [`TEST-PLANGATE-${ts}`, locId]
    )).rows[0].id;
    const lineItemId = (await pool.query(
      `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
       VALUES ($1, $2, 'Gate panel', 1, 'Nos', 1000, 1000) RETURNING id`,
      [orderId, `TEST-PLANGATE-${ts}-01`]
    )).rows[0].id;
    const unitId = (await pool.query(
      `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status)
       VALUES ($1, $2, $3, '9904', 'Design', 'Pending') RETURNING id`,
      [orderId, lineItemId, `9996${ts % 10000}1`]
    )).rows[0].id;
    await pool.query(
      `INSERT INTO unit_steps (order_unit_id, name, dept, status, step_order)
       VALUES ($1, 'Review & Classify', 'Design', 'pending', 1), ($1, 'Plan Production', 'Planning', 'pending', 1)`,
      [unitId]
    );

    const stepStatus = async (dept) =>
      (await pool.query('SELECT status FROM unit_steps WHERE order_unit_id = $1 AND dept = $2', [unitId, dept])).rows[0].status;
    const unitState = async () =>
      (await pool.query('SELECT status, planned_dispatch_date::text AS d FROM order_units WHERE id = $1', [unitId])).rows[0];

    await openStream();

    // --- 1. Planning user: 409, nothing written, no event ---------------------------------------
    const before = await unitState();
    for (const [label, path, body] of [
      ['unit', `/api/planning/units/${unitId}`, { status: 'Completed' }],
      ['line item', `/api/planning/line-items/${lineItemId}`, { status: 'Completed' }],
      ['bulk', '/api/planning/line-items/bulk', { lineItemIds: [lineItemId], fields: { status: 'Completed' } }]
    ]) {
      const r = await put(planningToken, path, body);
      assert.strictEqual(r.status, 409, `${label}: expected 409, got ${r.status}: ${r.text}`);
      assert.match(r.text, /Design/, `${label}: the 409 should name the unfinished department`);
      assert.strictEqual(await stepStatus('Design'), 'pending', `${label}: Design step must stay pending`);
      assert.strictEqual(await stepStatus('Planning'), 'pending', `${label}: Planning step must stay pending`);
      assert.deepStrictEqual(await unitState(), before, `${label}: unit must be unchanged after the 409`);
    }
    await new Promise(r => setTimeout(r, 500));
    assert.strictEqual(events.filter(e => String(e.orderId) === String(orderId)).length, 0,
      'a refused (409) save must not broadcast an event');
    console.log('✓ Planning user: 409 on unit, line-item and bulk saves; nothing written, no event');

    // A save that does not set Completed is unaffected by the gate.
    const plain = await put(planningToken, `/api/planning/units/${unitId}`, { planned_dispatch_date: '2026-12-20' });
    assert.strictEqual(plain.status, 200, `a date-only save should work: ${plain.text}`);
    console.log('✓ a save without status Completed is not gated');

    // --- 2. Admin: exempt from the 409, but upstream steps are never forced done ----------------
    const adminRes = await put(adminToken, `/api/planning/units/${unitId}`, { status: 'Completed' });
    assert.strictEqual(adminRes.status, 200, `Admin should not get the 409: ${adminRes.text}`);
    assert.strictEqual(await stepStatus('Planning'), 'done', 'Planning step should be done');
    assert.strictEqual(await stepStatus('Design'), 'pending', 'Admin Completed must not force-complete Design');
    console.log('✓ Admin: allowed, Planning step done, upstream Design step untouched');

    // --- 3. Re-saving an already Completed row is not refused -----------------------------------
    await pool.query(`UPDATE order_units SET status = 'Completed' WHERE id = $1`, [unitId]);
    await pool.query(`UPDATE unit_steps SET status = 'inprogress' WHERE order_unit_id = $1 AND dept = 'Design'`, [unitId]);
    const resave = await put(planningToken, `/api/planning/units/${unitId}`, {
      status: 'Completed', planned_dispatch_date: '2026-12-31'
    });
    assert.strictEqual(resave.status, 200, `re-saving a Completed row with a reopened Design step should work: ${resave.text}`);
    assert.strictEqual((await unitState()).d, '2026-12-31', 'the date edit should be saved');
    // The unit save re-derived the unit, so put the fixture back to "Completed, Design reopened".
    await pool.query(`UPDATE order_units SET status = 'Completed' WHERE id = $1`, [unitId]);
    await pool.query(`UPDATE unit_steps SET status = 'inprogress' WHERE order_unit_id = $1 AND dept = 'Design'`, [unitId]);
    const resaveLi = await put(planningToken, `/api/planning/line-items/${lineItemId}`, {
      status: 'Completed', planned_dispatch_date: '2026-12-30'
    });
    assert.strictEqual(resaveLi.status, 200, `line-item re-save should work: ${resaveLi.text}`);
    console.log('✓ re-saving an already Completed row with a reopened upstream step is allowed');

    console.log('\n====================================================');
    console.log('  ALL PLANNING COMPLETION GATE TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    controller.abort();
    if (orderId) await pool.query('DELETE FROM orders WHERE id = $1', [orderId]);
    if (userId) await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
