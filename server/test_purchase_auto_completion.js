import pool from './db.js';
import jwt from 'jsonwebtoken';
import { checkUnitPurchaseCategoriesStatus, evaluatePurchaseAutoCompletion } from './services/purchaseAutoCompletion.js';

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: PURCHASE AUTO-COMPLETION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(cond, msg) {
    total++;
    if (cond) {
      console.log(`  ✓ PASSED: ${msg}`);
      passed++;
    } else {
      console.error(`  ✕ FAILED: ${msg}`);
      process.exit(1);
    }
  }

  // --- UNIT TEST 1: checkUnitPurchaseCategoriesStatus pure logic ---
  console.log('[TEST 1] Testing pure category evaluation logic...');
  
  // Case A: No POs and not N/A
  const unitA = { custom_fields: {} };
  const resA = checkUnitPurchaseCategoriesStatus(unitA, []);
  assert(!resA.allSatisfied, 'Unit with no POs and no N/A should NOT be satisfied');
  assert(!resA.statusByCategory['Panel'].satisfied, 'Panel should not be satisfied');

  // Case B: All 4 categories marked N/A
  const unitB = {
    custom_fields: {
      purchase_cat_panel: 'NA',
      purchase_cat_automation: 'NA',
      purchase_cat_low_voltage: 'NA',
      purchase_cat_wires: 'NA'
    }
  };
  const resB = checkUnitPurchaseCategoriesStatus(unitB, []);
  assert(resB.allSatisfied, 'Unit with all 4 categories marked N/A SHOULD be satisfied');
  assert(resB.statusByCategory['Panel'].reason === 'NA', 'Panel reason should be NA');

  // Case C: 2 categories N/A, 2 categories have POs (1 pending, 1 closed)
  const unitC = {
    custom_fields: {
      purchase_cat_panel: 'NA',
      purchase_cat_automation: 'NA'
    }
  };
  const posC = [
    {
      category: 'Low voltage',
      unit_serial: '26270001',
      status: 'Pending',
      pos: [{ poNumber: 'PO-101', date: '2026-10-01', status: 'Pending', dateReceived: null }]
    },
    {
      category: 'Wires & Accessories',
      unit_serial: '26270001',
      status: 'PO closed',
      pos: [{ poNumber: 'PO-102', date: '2026-10-02', status: 'PO closed', dateReceived: '2026-10-10' }]
    }
  ];
  const resC = checkUnitPurchaseCategoriesStatus(unitC, posC);
  assert(!resC.allSatisfied, 'Unit with Low Voltage pending should NOT be satisfied');
  assert(resC.statusByCategory['Wires & Accessories'].satisfied, 'Wires should be satisfied because PO is closed with dateReceived');
  assert(!resC.statusByCategory['Low voltage'].satisfied, 'Low voltage should NOT be satisfied because PO is pending without dateReceived');

  // Case D: Low Voltage PO is closed with dateReceived -> now all 4 are satisfied!
  posC[0].status = 'PO closed';
  posC[0].pos[0].status = 'PO closed';
  posC[0].pos[0].dateReceived = '2026-10-12';
  const resD = checkUnitPurchaseCategoriesStatus(unitC, posC);
  assert(resD.allSatisfied, 'Unit with 2 NA + 2 closed POs with order & received dates SHOULD be satisfied');

  // --- INTEGRATION TEST 2: Database evaluatePurchaseAutoCompletion ---
  console.log('\n[TEST 2] Testing database integration with evaluatePurchaseAutoCompletion...');

  // Create a temporary dummy order & unit
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const compRes = await client.query("INSERT INTO companies (name) VALUES ('Test Purchase Co') RETURNING id");
    const companyId = compRes.rows[0].id;

    const locRes = await client.query("INSERT INTO company_locations (company_id, city) VALUES ($1, 'Mumbai') RETURNING id", [companyId]);
    const locationId = locRes.rows[0].id;

    const ordRes = await client.query(`
      INSERT INTO orders (order_number, po_number, company_location_id, classification, status)
      VALUES ('99990099', 'PO-TEST-PURCHASE', $1, 'Standard', 'Pending')
      RETURNING id
    `, [locationId]);
    const testOrderId = ordRes.rows[0].id;

    const unitRes = await client.query(`
      INSERT INTO order_units (order_id, unit_id, short_serial, current_dept, status, custom_fields)
      VALUES ($1, '99990099', '0099', 'Purchase', 'Material Waiting', '{}'::jsonb)
      RETURNING id
    `, [testOrderId]);
    const testUnitId = unitRes.rows[0].id;

    // Insert unit steps: Procure Materials (Purchase)
    await client.query(`
      INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
      VALUES ($1, 'Purchase', 'Procure Materials', 'pending', 4)
    `, [testUnitId]);

    // Insert next unit step: Stock Check vs BOM (Stores)
    await client.query(`
      INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
      VALUES ($1, 'Stores', 'Stock Check vs BOM', 'pending', 5)
    `, [testUnitId]);

    // Initial check: unit step should be pending
    let stepCheck = await client.query(`SELECT status FROM unit_steps WHERE order_unit_id = $1 AND dept = 'Purchase'`, [testUnitId]);
    assert(stepCheck.rows[0].status === 'pending', 'Procure Materials initially pending');

    // Run evaluation: should do nothing because categories are not satisfied
    let updated = await evaluatePurchaseAutoCompletion([testUnitId], client);
    assert(updated.length === 0, 'No units updated when categories are not satisfied');

    // Update 3 categories to N/A
    await client.query(`
      UPDATE order_units 
      SET custom_fields = '{"purchase_cat_automation":"NA","purchase_cat_low_voltage":"NA","purchase_cat_wires":"NA"}'::jsonb
      WHERE id = $1
    `, [testUnitId]);

    // Still missing Panel -> should not update
    updated = await evaluatePurchaseAutoCompletion([testUnitId], client);
    assert(updated.length === 0, 'No update when Panel category is still pending');

    // Now insert a vendor PO for Panel with order date and received date
    const poRes = await client.query(`
      INSERT INTO vendor_purchase_orders (order_uid, category, pos, status, created_at, received_at)
      VALUES (
        'VPO-TEST-1',
        'Panel',
        '[{"poNumber":"PANEL-PO-1","date":"2026-10-01","status":"PO closed","dateReceived":"2026-10-05"}]'::json,
        'PO closed',
        NOW(),
        NOW()
      )
      RETURNING id
    `);
    const testPoId = poRes.rows[0].id;

    await client.query(`
      INSERT INTO vendor_purchase_order_units (vendor_purchase_order_id, unit_serial)
      VALUES ($1, '99990099')
    `, [testPoId]);

    // Now all 4 categories are satisfied! Run evaluation:
    updated = await evaluatePurchaseAutoCompletion([testUnitId], client);
    assert(updated.length === 1, 'Unit updated when all 4 categories are satisfied');

    stepCheck = await client.query(`SELECT status, notes FROM unit_steps WHERE order_unit_id = $1 AND dept = 'Purchase'`, [testUnitId]);
    assert(stepCheck.rows[0].status === 'done', 'Procure Materials is now automatically marked DONE!');
    assert(stepCheck.rows[0].notes.includes('Auto-completed'), 'Step has auto-completed notes');

    await client.query('ROLLBACK');
    console.log('  ✓ Test transaction rolled back cleanly (no test clutter in DB)');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  // --- INTEGRATION TEST 3: POST /api/units/batch-purchase-na endpoint ---
  console.log('\n[TEST 3] Testing POST /api/units/batch-purchase-na endpoint...');
  const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
  const token = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

  await pool.query("DELETE FROM orders WHERE order_number = '99990003' OR po_number = 'TEST-BATCH-NA-PO'");

  const tOrder = await pool.query(`
    INSERT INTO orders (order_number, po_number, order_date, priority, status)
    VALUES ('99990003', 'TEST-BATCH-NA-PO', NOW(), 'Medium', 'active')
    RETURNING id
  `);
  const tOrderId = tOrder.rows[0].id;

  const tu1 = await pool.query(`
    INSERT INTO order_units (order_id, unit_id, short_serial, current_dept, status, custom_fields)
    VALUES ($1, '99990031', '0031', 'Purchase', 'pending', '{"purchase_cat_panel":"NA","purchase_cat_automation":"NA","purchase_cat_low_voltage":"NA"}'::jsonb)
    RETURNING id
  `, [tOrderId]);
  const tuId1 = tu1.rows[0].id;

  const tu2 = await pool.query(`
    INSERT INTO order_units (order_id, unit_id, short_serial, current_dept, status, custom_fields)
    VALUES ($1, '99990032', '0032', 'Purchase', 'pending', '{"purchase_cat_panel":"NA","purchase_cat_automation":"NA","purchase_cat_low_voltage":"NA"}'::jsonb)
    RETURNING id
  `, [tOrderId]);
  const tuId2 = tu2.rows[0].id;

  await pool.query(`
    INSERT INTO unit_steps (order_unit_id, dept, name, status, step_order)
    VALUES ($1, 'Purchase', 'Procure Materials', 'pending', 1),
           ($2, 'Purchase', 'Procure Materials', 'pending', 1)
  `, [tuId1, tuId2]);

  try {
    const batchRes = await fetch('http://localhost:5000/api/units/batch-purchase-na', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        unit_ids: [tuId1, tuId2],
        colKey: 'purchase_cat_wires',
        value: 'NA'
      })
    });

    const batchData = await batchRes.json();
    assert(batchRes.status === 200, `Batch API returned HTTP 200 (got ${batchRes.status})`);
    assert(batchData.success === true, 'Batch API returned success: true');
    assert(batchData.count === 2, `Batch API updated 2 units (got ${batchData.count})`);

    const checkUnits = await pool.query('SELECT custom_fields FROM order_units WHERE id = ANY($1)', [[tuId1, tuId2]]);
    assert(checkUnits.rows.every(r => r.custom_fields.purchase_cat_wires === 'NA'), 'Both units have purchase_cat_wires set to NA');

    const checkSteps = await pool.query('SELECT status FROM unit_steps WHERE order_unit_id = ANY($1) AND dept = \'Purchase\'', [[tuId1, tuId2]]);
    assert(checkSteps.rows.every(r => r.status === 'done'), 'Procure Materials is automatically marked done for both units!');
  } finally {
    await pool.query('DELETE FROM unit_steps WHERE order_unit_id = ANY($1)', [[tuId1, tuId2]]);
    await pool.query('DELETE FROM order_units WHERE order_id = $1', [tOrderId]);
    await pool.query('DELETE FROM orders WHERE id = $1', [tOrderId]);
    console.log('  ✓ Test entities cleaned up cleanly');
  }

  console.log('\n====================================================');
  console.log(`  ALL TESTS PASSED: ${passed}/${total} assertions successful!`);
  console.log('====================================================\n');
  await pool.end();
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
