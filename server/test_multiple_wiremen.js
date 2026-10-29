import assert from 'assert';
import pool from './db.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

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

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: MULTIPLE WIREMEN FOR SERIAL / UNIT');
  console.log('====================================================\n');

  const prodUser = await getOrCreateTestUser('Production', 'test_prod_operator');
  const prodToken = jwt.sign({ id: prodUser.id, username: prodUser.username, role: 'Production' }, JWT_SECRET);

  // Find an existing unit to test on
  const unitRes = await pool.query(`
    SELECT ou.id, ou.unit_id, ou.line_item_id, ou.wiremen
    FROM order_units ou
    LIMIT 1
  `);

  if (unitRes.rows.length === 0) {
    throw new Error('Please ensure at least one unit exists in DB.');
  }

  const testUnit = unitRes.rows[0];
  const unitId = testUnit.unit_id || testUnit.id;
  const originalWiremen = testUnit.wiremen;
  console.log(`Using test unit ID: ${unitId} (Line Item: ${testUnit.line_item_id})`);

  try {
    // ----------------------------------------------------
    // Test 1: Single wireman string
    // ----------------------------------------------------
    console.log('[TEST 1] Setting single wireman string...');
    const res1 = await fetch(`${API_BASE}/api/units/${unitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${prodToken}`
      },
      body: JSON.stringify({ wiremen: 'Ramesh Kumar' })
    });
    assert.strictEqual(res1.status, 200, `Expected 200 OK, got ${res1.status}`);

    const dbCheck1 = await pool.query('SELECT wiremen FROM order_units WHERE id = $1', [testUnit.id]);
    assert.strictEqual(dbCheck1.rows[0].wiremen, 'Ramesh Kumar');
    if (testUnit.line_item_id) {
      const liCheck1 = await pool.query('SELECT wiremen FROM order_line_items WHERE id = $1', [testUnit.line_item_id]);
      assert.strictEqual(liCheck1.rows[0].wiremen, 'Ramesh Kumar');
    }
    console.log('✓ Single wireman stored correctly.\n');

    // ----------------------------------------------------
    // Test 2: Multiple wiremen as an Array
    // ----------------------------------------------------
    console.log('[TEST 2] Setting multiple wiremen as Array: ["Ramesh Kumar", "Suresh Patel", "Dinesh Sharma"]...');
    const res2 = await fetch(`${API_BASE}/api/units/${unitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${prodToken}`
      },
      body: JSON.stringify({ wiremen: ['Ramesh Kumar', 'Suresh Patel', 'Dinesh Sharma'] })
    });
    assert.strictEqual(res2.status, 200, `Expected 200 OK, got ${res2.status}`);

    const dbCheck2 = await pool.query('SELECT wiremen FROM order_units WHERE id = $1', [testUnit.id]);
    assert.strictEqual(dbCheck2.rows[0].wiremen, 'Ramesh Kumar, Suresh Patel, Dinesh Sharma');
    if (testUnit.line_item_id) {
      const liCheck2 = await pool.query('SELECT wiremen FROM order_line_items WHERE id = $1', [testUnit.line_item_id]);
      assert.strictEqual(liCheck2.rows[0].wiremen, 'Ramesh Kumar, Suresh Patel, Dinesh Sharma');
    }
    console.log('✓ Array of multiple wiremen stored and normalized as comma-separated text.\n');

    // ----------------------------------------------------
    // Test 3: Comma-separated string with messy whitespace and duplicates
    // ----------------------------------------------------
    console.log('[TEST 3] Setting string with duplicates & messy whitespace: "Ramesh Kumar, Suresh Patel,  Ramesh Kumar , Mukesh "...');
    const res3 = await fetch(`${API_BASE}/api/units/${unitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${prodToken}`
      },
      body: JSON.stringify({ wiremen: 'Ramesh Kumar, Suresh Patel,  Ramesh Kumar , Mukesh ' })
    });
    assert.strictEqual(res3.status, 200, `Expected 200 OK, got ${res3.status}`);

    const dbCheck3 = await pool.query('SELECT wiremen FROM order_units WHERE id = $1', [testUnit.id]);
    assert.strictEqual(dbCheck3.rows[0].wiremen, 'Ramesh Kumar, Suresh Patel, Mukesh');
    console.log('✓ Messy duplicate wiremen string cleaned and deduplicated.\n');

    // ----------------------------------------------------
    // Test 4: Clear / Unassigned (empty array or empty string)
    // ----------------------------------------------------
    console.log('[TEST 4] Clearing wiremen with empty array []...');
    const res4 = await fetch(`${API_BASE}/api/units/${unitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${prodToken}`
      },
      body: JSON.stringify({ wiremen: [] })
    });
    assert.strictEqual(res4.status, 200, `Expected 200 OK, got ${res4.status}`);

    const dbCheck4 = await pool.query('SELECT wiremen FROM order_units WHERE id = $1', [testUnit.id]);
    assert.strictEqual(dbCheck4.rows[0].wiremen, null);
    console.log('✓ Empty array properly clears wiremen to NULL.\n');

    console.log('====================================================');
    console.log('  ALL MULTIPLE WIREMEN BACKEND TESTS PASSED!');
    console.log('====================================================');

  } finally {
    // Restore original wiremen value
    await pool.query('UPDATE order_units SET wiremen = $1 WHERE id = $2', [originalWiremen, testUnit.id]);
    if (testUnit.line_item_id) {
      await pool.query('UPDATE order_line_items SET wiremen = $1 WHERE id = $2', [originalWiremen, testUnit.line_item_id]);
    }
    await pool.end();
    process.exit(0);
  }
}

runTests().catch(err => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
