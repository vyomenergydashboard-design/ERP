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
  console.log('  TEST SUITE: QC HANDOVER TO PACKING AUTO-COMPLETION                    ');
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
    const ts = Date.now();
    const locRes = await client.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows.length > 0 ? locRes.rows[0].id : null;

    console.log('[SETUP] Creating test order and units in QC...');
    const ordRes = await client.query(`
      INSERT INTO orders (order_number, company_location_id, po_number, status, priority, classification, created_by)
      VALUES ($1, $2, 'PO-QC-PACK-01', 'In Progress', 'High', 'Standard', 1)
      RETURNING id;
    `, [`TEST-QC-${ts}`, locId]);
    createdOrderId = ordRes.rows[0].id;

    const liRes = await client.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price, status)
      VALUES ($1, '01', 'Test QC Unit', 2, 'Nos', 15000, 30000, 'In Progress')
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
        VALUES ($1, $2, $3, $4, 'QC', 'QC Testing', 'None', true, true, '2026-11-01', '2026-11-02', '2026-11-03')
        RETURNING id;
      `, [createdOrderId, lineItemId, `UQC-${ts}-${i}`, `SQC-${ts}-${i}`]);
      createdUnitIds.push(uRes.rows[0].id);

      await client.query(`
        INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
        VALUES 
          ($1, 'Sales', 'Upload PO', 'done', 1),
          ($1, 'Design', 'Release Documents', 'done', 2),
          ($1, 'Stores', 'Stock Check vs BOM', 'done', 3),
          ($1, 'Production', 'Manufacture', 'done', 4),
          ($1, 'QC', 'Receive Panel', 'pending', 5),
          ($1, 'QC', 'QC Decision', 'pending', 6),
          ($1, 'Dispatch', 'Ready for Dispatch', 'pending', 7),
          ($1, 'Accounts', 'Invoice & Dispatch Note', 'pending', 8);
      `, [uRes.rows[0].id]);
    }

    const unitId1 = createdUnitIds[0];
    const unitId2 = createdUnitIds[1];

    // TEST 1: Updating qc_status to "Handover to packing" marks all QC steps done and advances to Dispatch
    console.log('\n[TEST 1] Setting qc_status = "Handover to packing" on Unit 1...');
    const putRes1 = await fetch(`${API_BASE}/api/units/${unitId1}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ qc_status: 'Handover to packing' })
    });
    assert.strictEqual(putRes1.ok, true, `PUT /api/units/${unitId1} failed: ${putRes1.status}`);

    const qcStepsRes1 = await client.query(
      `SELECT name, status, notes FROM unit_steps WHERE order_unit_id = $1 AND dept = 'QC' ORDER BY step_order ASC`,
      [unitId1]
    );
    console.log('Unit 1 QC steps after update:', qcStepsRes1.rows);
    assert.strictEqual(qcStepsRes1.rows.length, 2, 'Expected 2 QC steps');
    for (const step of qcStepsRes1.rows) {
      assert.strictEqual(step.status, 'done', `Step ${step.name} should be 'done'`);
      assert(step.notes && step.notes.includes('Handover to packing'), `Step ${step.name} notes should indicate Handover to packing`);
    }

    const unitRow1 = await client.query('SELECT current_dept, status, qc_status FROM order_units WHERE id = $1', [unitId1]);
    console.log('Unit 1 status after update:', unitRow1.rows[0]);
    assert.strictEqual(unitRow1.rows[0].current_dept, 'Dispatch', 'Unit 1 current_dept should advance to Dispatch');
    assert.strictEqual(unitRow1.rows[0].status, 'Ready for Dispatch', 'Unit 1 status should be Ready for Dispatch');
    assert.strictEqual(unitRow1.rows[0].qc_status, 'Handover to packing', 'Unit 1 qc_status should be Handover to packing');
    console.log('✓ TEST 1 PASSED: QC steps marked done and unit advanced to Dispatch.');

    // TEST 2: Line item and Order QC status synchronization
    console.log('\n[TEST 2] Setting qc_status = "Handover to packing" on Unit 2 to complete all units in order...');
    const putRes2 = await fetch(`${API_BASE}/api/units/${unitId2}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ qc_status: 'handover to packing' }) // case-insensitive check
    });
    assert.strictEqual(putRes2.ok, true, `PUT /api/units/${unitId2} failed: ${putRes2.status}`);

    const ordCheck = await client.query('SELECT qc_status, qc_date FROM orders WHERE id = $1', [createdOrderId]);
    console.log('Order QC status:', ordCheck.rows[0]);
    assert.strictEqual(ordCheck.rows[0].qc_status, 'Pass', 'Order qc_status should be Pass');
    assert(ordCheck.rows[0].qc_date, 'Order qc_date should be set');

    const liCheck = await client.query('SELECT qc_status, qc_date FROM order_line_items WHERE id = $1', [lineItemId]);
    console.log('Line item QC status:', liCheck.rows[0]);
    assert.strictEqual(liCheck.rows[0].qc_status, 'Pass', 'Line item qc_status should be Pass');
    console.log('✓ TEST 2 PASSED: Order and Line Item QC status synchronized to Pass.');

    // TEST 3: Revert behavior when changed away from "Handover to packing" before Dispatch started
    console.log('\n[TEST 3] Reverting qc_status from "Handover to packing" to "In Process" on Unit 1...');
    const putRevertRes = await fetch(`${API_BASE}/api/units/${unitId1}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ qc_status: 'In Process' })
    });
    assert.strictEqual(putRevertRes.ok, true, `PUT /api/units/${unitId1} failed: ${putRevertRes.status}`);

    const unitRow1Revert = await client.query('SELECT current_dept, status, qc_status FROM order_units WHERE id = $1', [unitId1]);
    console.log('Unit 1 status after revert:', unitRow1Revert.rows[0]);
    assert.strictEqual(unitRow1Revert.rows[0].current_dept, 'QC', 'Unit 1 current_dept should return to QC');
    assert.strictEqual(unitRow1Revert.rows[0].status, 'QC Testing', 'Unit 1 status should return to QC Testing');

    const qcStepsRevert = await client.query(
      `SELECT name, status, notes FROM unit_steps WHERE order_unit_id = $1 AND dept = 'QC' ORDER BY step_order ASC`,
      [unitId1]
    );
    console.log('Unit 1 QC steps after revert:', qcStepsRevert.rows);
    for (const step of qcStepsRevert.rows) {
      assert.strictEqual(step.status, 'pending', `Step ${step.name} should revert to pending`);
    }
    console.log('✓ TEST 3 PASSED: Safely reverted QC steps and unit back to QC.');

    console.log('\n========================================================================');
    console.log('  ALL TESTS PASSED SUCCESSFULLY!                                        ');
    console.log('========================================================================\n');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (createdOrderId) {
      console.log('[CLEANUP] Removing test order and related records...');
      await client.query('DELETE FROM unit_steps WHERE order_unit_id = ANY($1::int[])', [createdUnitIds]);
      await client.query('DELETE FROM order_units WHERE order_id = $1', [createdOrderId]);
      await client.query('DELETE FROM order_line_items WHERE order_id = $1', [createdOrderId]);
      await client.query("DELETE FROM documents WHERE entity_type = 'Order' AND entity_id = $1", [createdOrderId]);
      await client.query('DELETE FROM orders WHERE id = $1', [createdOrderId]);
    }
    client.release();
    await pool.end();
  }
}

runTests();
