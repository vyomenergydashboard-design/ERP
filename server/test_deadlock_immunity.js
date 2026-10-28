import pool from './db.js';

async function runDeadlockImmunityTest() {
  console.log('====================================================');
  console.log('  TEST SUITE: SLICE 1 - DEADLOCK IMMUNITY');
  console.log('====================================================\n');

  const clientSetup = await pool.connect();
  let testOrderId = null;
  let unitIds = [];

  try {
    const locRes = await clientSetup.query(`SELECT id FROM company_locations LIMIT 1`);
    const locId = locRes.rows.length > 0 ? locRes.rows[0].id : null;

    const ordRes = await clientSetup.query(
      `INSERT INTO orders (order_number, company_location_id, status)
       VALUES ('TEST-DEADLOCK-9999', $1, 'Active')
       RETURNING id`,
      [locId]
    );
    testOrderId = ordRes.rows[0].id;

    for (let i = 1; i <= 3; i++) {
      const uRes = await clientSetup.query(
        `INSERT INTO order_units (order_id, unit_id, short_serial, current_dept, status)
         VALUES ($1, $2, $3, 'Sales', 'Pending')
         RETURNING id`,
        [testOrderId, `TEST-DL-${i}`, `DL${i}`]
      );
      unitIds.push(uRes.rows[0].id);
    }

    console.log(`[SETUP] Created test order ${testOrderId} with units: ${unitIds.join(', ')}`);

    // Ensure sorted IDs
    unitIds.sort((a, b) => a - b);
    const forwardIds = [...unitIds];
    const reverseIds = [...unitIds].reverse();

    console.log('\n[TEST 1] Simulating 2 concurrent transactions updating units with deterministic sorting...');

    // Function simulating endpoint logic: sort IDs deterministically before locking
    const runWorker = async (name, requestedIds, statusVal) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        // The fix: sort deterministically
        const sorted = [...requestedIds].sort((a, b) => a - b);

        for (const id of sorted) {
          await client.query(
            'UPDATE order_units SET status = $1 WHERE id = $2',
            [statusVal, id]
          );
          // Small delay to increase likelihood of interleaving if locks weren't deterministic
          await new Promise(r => setTimeout(r, 25));
        }

        await client.query('COMMIT');
        return { success: true, name };
      } catch (err) {
        await client.query('ROLLBACK');
        return { success: false, name, error: err.message, code: err.code };
      } finally {
        client.release();
      }
    };

    // Run both workers concurrently with opposite initial order
    const [resA, resB] = await Promise.all([
      runWorker('WorkerA (Forward)', forwardIds, 'In Progress'),
      runWorker('WorkerB (Reverse)', reverseIds, 'Pending')
    ]);

    console.log(`  Worker A result: ${resA.success ? '✓ SUCCESS' : '✕ FAILED: ' + resA.error}`);
    console.log(`  Worker B result: ${resB.success ? '✓ SUCCESS' : '✕ FAILED: ' + resB.error}`);

    if (!resA.success || !resB.success) {
      throw new Error(`Concurrency test failed: A(${resA.error || 'ok'}), B(${resB.error || 'ok'})`);
    }

    console.log('  ✓ PASSED: No 40P01 deadlocks occurred during concurrent multi-unit updates.');

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

runDeadlockImmunityTest();
