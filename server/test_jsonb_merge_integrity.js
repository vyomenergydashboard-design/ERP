import pool from './db.js';

async function runJsonbMergeIntegrityTest() {
  console.log('====================================================');
  console.log('  TEST SUITE: SLICE 2 - JSONB MERGE INTEGRITY');
  console.log('====================================================\n');

  const clientSetup = await pool.connect();
  let testOrderId = null;
  let testUnitId = null;

  try {
    const locRes = await clientSetup.query(`SELECT id FROM company_locations LIMIT 1`);
    const locId = locRes.rows.length > 0 ? locRes.rows[0].id : null;

    const ordRes = await clientSetup.query(
      `INSERT INTO orders (order_number, company_location_id, status)
       VALUES ('TEST-JSONB-9999', $1, 'Active')
       RETURNING id`,
      [locId]
    );
    testOrderId = ordRes.rows[0].id;

    // Insert unit with initial custom fields
    const initialCF = { field_a: 'Original_A', field_b: 'Original_B' };
    const uRes = await clientSetup.query(
      `INSERT INTO order_units (order_id, unit_id, short_serial, current_dept, status, custom_fields)
       VALUES ($1, 'TEST-JB-1', 'JB1', 'Sales', 'Pending', $2)
       RETURNING id`,
      [testOrderId, JSON.stringify(initialCF)]
    );
    testUnitId = uRes.rows[0].id;
    console.log(`[SETUP] Created test unit ${testUnitId} with initial custom_fields:`, initialCF);

    console.log('\n[TEST 1] Testing non-destructive JSONB update with new field_c...');
    // Simulate endpoint: updates.push(`custom_fields = (COALESCE(custom_fields, '{}'::jsonb) || $1::jsonb)`)
    const update1 = { field_c: 'Added_C' };
    await clientSetup.query(
      `UPDATE order_units 
       SET custom_fields = (COALESCE(custom_fields, '{}'::jsonb) || $1::jsonb) 
       WHERE id = $2`,
      [JSON.stringify(update1), testUnitId]
    );

    let check1 = (await clientSetup.query('SELECT custom_fields FROM order_units WHERE id = $1', [testUnitId])).rows[0].custom_fields;
    console.log('  After update 1:', check1);
    if (check1.field_a !== 'Original_A' || check1.field_b !== 'Original_B' || check1.field_c !== 'Added_C') {
      throw new Error(`Test 1 Failed: Expected field_a, field_b, and field_c to exist, got: ${JSON.stringify(check1)}`);
    }
    console.log('  ✓ PASSED: field_b was preserved while field_c was added!');

    console.log('\n[TEST 2] Testing partial overwrite of field_a without destroying field_b or field_c...');
    const update2 = { field_a: 'Updated_A' };
    await clientSetup.query(
      `UPDATE order_units 
       SET custom_fields = (COALESCE(custom_fields, '{}'::jsonb) || $1::jsonb) 
       WHERE id = $2`,
      [JSON.stringify(update2), testUnitId]
    );

    let check2 = (await clientSetup.query('SELECT custom_fields FROM order_units WHERE id = $1', [testUnitId])).rows[0].custom_fields;
    console.log('  After update 2:', check2);
    if (check2.field_a !== 'Updated_A' || check2.field_b !== 'Original_B' || check2.field_c !== 'Added_C') {
      throw new Error(`Test 2 Failed: Expected field_a='Updated_A', field_b='Original_B', field_c='Added_C', got: ${JSON.stringify(check2)}`);
    }
    console.log('  ✓ PASSED: field_a updated while field_b and field_c remained intact!');

    console.log('\n[TEST 3] Testing atomic deletion of issued_date key without affecting other custom fields...');
    // First set issued_date
    await clientSetup.query(
      `UPDATE order_units 
       SET custom_fields = (COALESCE(custom_fields, '{}'::jsonb) || '{"issued_date": "2026-10-28"}'::jsonb) 
       WHERE id = $1`,
      [testUnitId]
    );
    // Now delete issued_date using the - 'issued_date' pattern
    await clientSetup.query(
      `UPDATE order_units 
       SET custom_fields = (COALESCE(custom_fields, '{}'::jsonb) || '{"field_d": "Added_D"}'::jsonb) - 'issued_date' 
       WHERE id = $1`,
      [testUnitId]
    );

    let check3 = (await clientSetup.query('SELECT custom_fields FROM order_units WHERE id = $1', [testUnitId])).rows[0].custom_fields;
    console.log('  After update 3:', check3);
    if (check3.issued_date !== undefined || check3.field_d !== 'Added_D' || check3.field_b !== 'Original_B') {
      throw new Error(`Test 3 Failed: issued_date should be deleted, field_d added, field_b preserved. Got: ${JSON.stringify(check3)}`);
    }
    console.log('  ✓ PASSED: issued_date was cleanly deleted while all other fields were preserved!');

    console.log('\n[TEST 4] Testing batch purchase N/A atomic merge and delete...');
    const colKey = 'purchase_cat_wires';
    // Set NA
    await clientSetup.query(
      `UPDATE order_units 
       SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) || jsonb_build_object($1::text, 'NA')
       WHERE id = $2`,
      [colKey, testUnitId]
    );
    let check4 = (await clientSetup.query('SELECT custom_fields FROM order_units WHERE id = $1', [testUnitId])).rows[0].custom_fields;
    if (check4[colKey] !== 'NA' || check4.field_b !== 'Original_B') {
      throw new Error(`Test 4 (Set NA) Failed: Got ${JSON.stringify(check4)}`);
    }
    // Delete NA
    await clientSetup.query(
      `UPDATE order_units 
       SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) - $1::text
       WHERE id = $2`,
      [colKey, testUnitId]
    );
    let check4b = (await clientSetup.query('SELECT custom_fields FROM order_units WHERE id = $1', [testUnitId])).rows[0].custom_fields;
    if (check4b[colKey] !== undefined || check4b.field_b !== 'Original_B') {
      throw new Error(`Test 4 (Delete NA) Failed: Got ${JSON.stringify(check4b)}`);
    }
    console.log('  ✓ PASSED: Batch purchase N/A atomic merge and deletion verified!');

  } catch (err) {
    console.error('  ✕ FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (testOrderId) {
      await clientSetup.query('DELETE FROM order_units WHERE order_id = $1', [testOrderId]).catch(() => {});
      await clientSetup.query('DELETE FROM orders WHERE id = $1', [testOrderId]).catch(() => {});
      console.log(`\n[TEARDOWN] Cleaned up test order ${testOrderId}`);
    }
    clientSetup.release();
    await pool.end();
  }
}

runJsonbMergeIntegrityTest();

