import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
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
  console.log('  TEST SUITE: WIREMAN MASTERS (CRUD, RBAC & ORDERING)');
  console.log('====================================================\n');

  try {
    // 0. Ensure migration has run so wireman_masters exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS wireman_masters (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        experience TEXT,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_wireman_masters_name ON wireman_masters(name);
    `);

    // Clean up test data if any left over
    await pool.query("DELETE FROM wireman_masters WHERE name LIKE 'TEST_WIREMAN_%'");

    // Setup test users & tokens
    const adminUser = await getOrCreateTestUser('Admin', 'test_admin_wireman');
    const prodUser = await getOrCreateTestUser('Production', 'test_prod_wireman');
    const planUser = await getOrCreateTestUser('Planning', 'test_plan_wireman');
    const salesUser = await getOrCreateTestUser('Sales', 'test_sales_wireman');

    const adminToken = jwt.sign({ id: adminUser.id, username: adminUser.username, role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
    const prodToken = jwt.sign({ id: prodUser.id, username: prodUser.username, role: 'Production' }, JWT_SECRET, { expiresIn: '1h' });
    const planToken = jwt.sign({ id: planUser.id, username: planUser.username, role: 'Planning' }, JWT_SECRET, { expiresIn: '1h' });
    const salesToken = jwt.sign({ id: salesUser.id, username: salesUser.username, role: 'Sales' }, JWT_SECRET, { expiresIn: '1h' });

    console.log('--- Test 1: RBAC on Creation (Only Admin can create) ---');
    // Non-admin (Production) trying to create
    const prodPostRes = await fetch(`${API_BASE}/api/wireman-masters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prodToken}` },
      body: JSON.stringify({ name: 'TEST_WIREMAN_FORBIDDEN', experience: '1 Year' })
    });
    assert.strictEqual(prodPostRes.status, 403, 'Production user must be forbidden from creating wiremen (403)');
    console.log('  Passed: Production role received 403 Forbidden on POST');

    // Admin without name
    const emptyPostRes = await fetch(`${API_BASE}/api/wireman-masters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ name: '   ', experience: '3 Years' })
    });
    assert.strictEqual(emptyPostRes.status, 400, 'Empty name must return 400 Bad Request');
    console.log('  Passed: Empty name rejected with 400 Bad Request');

    // Admin creates valid wiremen out of alphabetical order
    const createWireman = async (name, experience) => {
      const res = await fetch(`${API_BASE}/api/wireman-masters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ name, experience })
      });
      assert.strictEqual(res.status, 201, `Failed to create wireman ${name}`);
      return await res.json();
    };

    const wZara = await createWireman('TEST_WIREMAN_Zara', '5 Years');
    const wBob = await createWireman('TEST_WIREMAN_Bob', '2 Years');
    const wAlex = await createWireman('TEST_WIREMAN_Alex', '8 Years');
    console.log('  Passed: Admin created wiremen successfully (201)');

    console.log('\n--- Test 2: Ordering & Read Permissions ---');
    // Production user can read
    const prodGetRes = await fetch(`${API_BASE}/api/wireman-masters`, {
      headers: { 'Authorization': `Bearer ${prodToken}` }
    });
    assert.strictEqual(prodGetRes.status, 200, 'Production user must be able to view wiremen');
    const wiremenList = await prodGetRes.json();
    
    // Planning user can read
    const planGetRes = await fetch(`${API_BASE}/api/wireman-masters`, {
      headers: { 'Authorization': `Bearer ${planToken}` }
    });
    assert.strictEqual(planGetRes.status, 200, 'Planning user must be able to view wiremen');

    // Sales role cannot read (user restricted to Admin, Manager, Production, Planning)
    const salesGetRes = await fetch(`${API_BASE}/api/wireman-masters`, {
      headers: { 'Authorization': `Bearer ${salesToken}` }
    });
    assert.strictEqual(salesGetRes.status, 403, 'Sales role must be forbidden from reading wiremen (403)');
    console.log('  Passed: Read access restricted to Admin, Manager, Production, Planning');

    // Verify alphabetical ordering
    const testWiremen = wiremenList.filter(w => w.name.startsWith('TEST_WIREMAN_'));
    const testNames = testWiremen.map(w => w.name);
    console.log('  Test Wiremen in returned order:', testNames);
    assert.deepStrictEqual(
      testNames,
      ['TEST_WIREMAN_Alex', 'TEST_WIREMAN_Bob', 'TEST_WIREMAN_Zara'],
      'Wiremen must be returned alphabetically ordered by name'
    );
    console.log('  Passed: Alphabetical ordering confirmed');

    console.log('\n--- Test 3: Updating Wireman (PUT) ---');
    // Non-admin attempting update
    const prodPutRes = await fetch(`${API_BASE}/api/wireman-masters/${wBob.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${prodToken}` },
      body: JSON.stringify({ name: 'TEST_WIREMAN_Bob_Updated', experience: '3 Years' })
    });
    assert.strictEqual(prodPutRes.status, 403, 'Non-admin must be forbidden from updating wireman');

    // Admin updates
    const adminPutRes = await fetch(`${API_BASE}/api/wireman-masters/${wBob.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ name: 'TEST_WIREMAN_Bobby', experience: '3.5 Years' })
    });
    assert.strictEqual(adminPutRes.status, 200, 'Admin must be able to update wireman');
    const updatedBob = await adminPutRes.json();
    assert.strictEqual(updatedBob.name, 'TEST_WIREMAN_Bobby');
    assert.strictEqual(updatedBob.experience, '3.5 Years');
    console.log('  Passed: Admin updated wireman successfully');

    console.log('\n--- Test 4: Deleting Wireman (DELETE) ---');
    // Non-admin attempting delete
    const prodDelRes = await fetch(`${API_BASE}/api/wireman-masters/${wBob.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${prodToken}` }
    });
    assert.strictEqual(prodDelRes.status, 403, 'Non-admin must be forbidden from deleting wireman');

    // Admin deletes
    const adminDelRes = await fetch(`${API_BASE}/api/wireman-masters/${wBob.id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(adminDelRes.status, 200, 'Admin must be able to delete wireman');

    // Verify deleted from list
    const afterDelRes = await fetch(`${API_BASE}/api/wireman-masters`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const afterDelList = await afterDelRes.json();
    assert.ok(!afterDelList.some(w => w.id === wBob.id), 'Deleted wireman must no longer appear in list');
    console.log('  Passed: Wireman successfully deleted by Admin');

    // Clean up other test entries
    await pool.query("DELETE FROM wireman_masters WHERE name LIKE 'TEST_WIREMAN_%'");

    console.log('\n====================================================');
    console.log('  ALL WIREMAN MASTERS TESTS PASSED PERFECTLY!');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runTests();
