import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function runTests() {
  console.log('================================================================');
  console.log('  TEST SUITE: PASSED PRODUCTION PANELS IN DOWNSTREAM DEPTS     ');
  console.log('================================================================\n');

  const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  };

  const client = await pool.connect();
  let createdOrderId = null;
  let createdUnitId = null;

  try {
    const locRes = await client.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows.length > 0 ? locRes.rows[0].id : null;

    // 1. Create a dummy test order with 1 unit
    console.log('[TEST 1] Setting up dummy order with unit in Stores/Production...');
    const ts = Date.now();
    const testOrderRes = await client.query(`
      INSERT INTO orders (order_number, company_location_id, po_number, status, priority, classification, created_by)
      VALUES ($1, $2, 'PO-DOWNSTREAM-01', 'In Progress', 'High', 'Standard', 1)
      RETURNING id, order_number;
    `, [`TEST-ORD-${ts}`, locId]);
    createdOrderId = testOrderRes.rows[0].id;

    const lineItemRes = await client.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price, status)
      VALUES ($1, '01', 'Downstream Test Panel', 1, 'Nos', 5000, 5000, 'In Progress')
      RETURNING id;
    `, [createdOrderId]);
    const lineItemId = lineItemRes.rows[0].id;

    const unitRes = await client.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, hold_status)
      VALUES ($1, $2, $3, $4, 'Production', 'Production', 'None')
      RETURNING id, unit_id;
    `, [createdOrderId, lineItemId, `U-${ts}`, `S-${ts}`]);
    createdUnitId = unitRes.rows[0].id;
    const testUnitSerial = `U-${ts}`;

    // Seed unit steps for Production, QC, Dispatch, Accounts
    await client.query(`
      INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
      VALUES 
        ($1, 'Production', 'Manufacture', 'pending', 1),
        ($1, 'QC', 'Receive Panel', 'pending', 2),
        ($1, 'QC', 'QC Decision', 'pending', 3),
        ($1, 'Dispatch', 'Ready for Dispatch', 'pending', 4),
        ($1, 'Accounts', 'Invoice & Dispatch Note', 'pending', 5);
    `, [createdUnitId]);

    console.log(`Created test order ${createdOrderId} with unit ${createdUnitId} (${testUnitSerial})`);

    // Verify initially: Unit is in Production with steps pending -> should NOT appear in QC, Dispatch, or Accounts
    console.log('\n[TEST 2] Verifying unit is NOT initially in downstream worklists...');
    for (const dept of ['QC', 'Dispatch', 'Accounts']) {
      const res = await fetch(`${API_BASE}/api/dept-worklist/${dept}`, { headers });
      assert(res.ok, `GET /api/dept-worklist/${dept} returned ${res.status}`);
      const list = await res.json();
      const found = list.some(u => u.unit_id === createdUnitId || u.unit_serial === testUnitSerial);
      assert.strictEqual(found, false, `Unit ${createdUnitId} should NOT appear in ${dept} before passing production`);
      console.log(`✓ Unit correctly not visible in ${dept} prior to passing production`);
    }

    // 2. Set handover_to_qc_date on the unit via PUT /api/units/:id
    console.log('\n[TEST 3] Updating unit with handover_to_qc_date (passing production)...');
    const updateRes = await fetch(`${API_BASE}/api/units/${createdUnitId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        handover_to_qc_date: '2026-11-03T15:30:00.000Z'
      })
    });
    assert(updateRes.ok, `PUT /api/units/${createdUnitId} returned ${updateRes.status}`);
    const updateData = await updateRes.json();
    console.log('Update result success:', updateData.success);

    // Verify unit steps in Production were marked done
    const prodStepsCheck = await client.query(
      `SELECT status, notes FROM unit_steps WHERE order_unit_id = $1 AND dept = 'Production'`,
      [createdUnitId]
    );
    console.log('Production steps status:', prodStepsCheck.rows);
    assert.strictEqual(prodStepsCheck.rows[0].status, 'done', 'Production step should be auto-completed');

    // 3. Verify unit now appears in QC, Dispatch, AND Accounts worklists!
    console.log('\n[TEST 4] Verifying unit appears in QC, Dispatch, and Accounts worklists...');
    for (const dept of ['QC', 'Dispatch', 'Accounts']) {
      const res = await fetch(`${API_BASE}/api/dept-worklist/${dept}`, { headers });
      assert(res.ok, `GET /api/dept-worklist/${dept} returned ${res.status}`);
      const list = await res.json();
      const found = list.some(u => u.unit_id === createdUnitId || u.unit_serial === testUnitSerial);
      assert.strictEqual(found, true, `Unit ${createdUnitId} MUST appear in ${dept} after passing production`);
      console.log(`✓ Confirmed: Unit is visible in ${dept}!`);
    }

    console.log('\n================================================================');
    console.log('  ALL PASSED PRODUCTION DOWNSTREAM TESTS PASSED SUCCESSFULLY!    ');
    console.log('================================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    if (createdOrderId) {
      console.log('Cleaning up test dummy order and unit...');
      await client.query(`DELETE FROM unit_steps WHERE order_unit_id = $1`, [createdUnitId]);
      await client.query(`DELETE FROM order_units WHERE order_id = $1`, [createdOrderId]);
      await client.query(`DELETE FROM order_line_items WHERE order_id = $1`, [createdOrderId]);
      await client.query(`DELETE FROM orders WHERE id = $1`, [createdOrderId]);
    }
    client.release();
    await pool.end();
  }
}

runTests();
