import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: PRODUCTION MULTI-SELECT & BATCH UPDATE');
  console.log('====================================================\n');

  try {
    // 1. Get 3 real units from order_units for testing
    const unitsRes = await pool.query(
      'SELECT id, unit_id, short_serial, order_id FROM order_units ORDER BY id ASC LIMIT 3'
    );
    assert(unitsRes.rows.length >= 3, 'Expected at least 3 order_units for batch test');
    const testUnits = unitsRes.rows;
    const testIds = testUnits.map(u => u.id);
    console.log(`[TEST SETUP] Selected 3 test units: IDs ${testIds.join(', ')}`);

    // 2. Setup user in database for Production role
    async function getOrCreateTestUser(role, username) {
      const existing = await pool.query('SELECT id, username, role FROM users WHERE username = $1', [username]);
      if (existing.rows.length > 0) {
        if (existing.rows[0].role !== role) {
          await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, existing.rows[0].id]);
        }
        return existing.rows[0];
      }
      const created = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
        [username, `${username}@test.com`, 'testhash', role]
      );
      return created.rows[0];
    }

    const prodUser = await getOrCreateTestUser('Production', 'test_prod_batch_user');
    const prodToken = jwt.sign(
      { id: prodUser.id, username: prodUser.username, role: 'Production' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3. Test Batch Update of a production date milestone across all 3 units
    console.log('\n[TEST 1] Updating mounting_start_date on all 3 selected units...');
    const testDateIso = '2026-10-30T10:15:00.000Z';

    const updatePromises = testIds.map(id => {
      return fetch(`${API_BASE}/api/units/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${prodToken}`
        },
        body: JSON.stringify({ mounting_start_date: testDateIso })
      });
    });

    const responses = await Promise.all(updatePromises);
    for (const res of responses) {
      assert.strictEqual(res.status, 200, `Expected HTTP 200, got ${res.status}`);
    }
    console.log('✓ All 3 units responded with HTTP 200 OK.');

    // 4. Verify in PostgreSQL that all 3 units have the exact same date & time saved
    console.log('\n[TEST 2] Verifying database persistence across all 3 units...');
    const dbCheck = await pool.query(
      'SELECT id, mounting_start_date FROM order_units WHERE id = ANY($1)',
      [testIds]
    );
    assert.strictEqual(dbCheck.rows.length, 3, 'Expected 3 records');

    for (const row of dbCheck.rows) {
      assert(row.mounting_start_date, `Unit ${row.id} mounting_start_date should not be null`);
      const rowDate = new Date(row.mounting_start_date);
      const expectedDate = new Date(testDateIso);
      assert.strictEqual(
        rowDate.getTime(),
        expectedDate.getTime(),
        `Unit ${row.id} date mismatch: expected ${expectedDate.toISOString()} but got ${rowDate.toISOString()}`
      );
    }
    console.log('✓ All 3 units have the EXACT identical timestamp stored in PostgreSQL.');

    // 5. Test Batch Update of another date milestone (wiring_complete_date)
    console.log('\n[TEST 3] Updating wiring_complete_date on all 3 selected units...');
    const wiringDateIso = '2026-10-30T16:45:00.000Z';

    await Promise.all(testIds.map(id => {
      return fetch(`${API_BASE}/api/units/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${prodToken}`
        },
        body: JSON.stringify({ wiring_complete_date: wiringDateIso })
      });
    }));

    const dbCheck2 = await pool.query(
      'SELECT id, wiring_complete_date FROM order_units WHERE id = ANY($1)',
      [testIds]
    );
    for (const row of dbCheck2.rows) {
      const rowDate = new Date(row.wiring_complete_date);
      const expectedDate = new Date(wiringDateIso);
      assert.strictEqual(rowDate.getTime(), expectedDate.getTime());
    }
    console.log('✓ wiring_complete_date verified identically across all 3 units.');

    // 6. Test Batch Clear (setting date to null)
    console.log('\n[TEST 4] Testing batch clear (setting date to null)...');
    await Promise.all(testIds.map(id => {
      return fetch(`${API_BASE}/api/units/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${prodToken}`
        },
        body: JSON.stringify({ mounting_start_date: null, wiring_complete_date: null })
      });
    }));

    const dbCheckClear = await pool.query(
      'SELECT id, mounting_start_date, wiring_complete_date FROM order_units WHERE id = ANY($1)',
      [testIds]
    );
    for (const row of dbCheckClear.rows) {
      assert.strictEqual(row.mounting_start_date, null, `Expected null mounting_start_date for unit ${row.id}`);
      assert.strictEqual(row.wiring_complete_date, null, `Expected null wiring_complete_date for unit ${row.id}`);
    }
    console.log('✓ Batch clear succeeded; all 3 units reset to null in database.');

    console.log('\n====================================================');
    console.log('  ALL PRODUCTION BATCH UPDATE TESTS PASSED!');
    console.log('====================================================');
  } catch (err) {
    console.error('Test suite failed:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
