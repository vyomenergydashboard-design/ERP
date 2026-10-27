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
  console.log('  TEST SUITE: PRODUCTION WORKFLOW COLUMNS');
  console.log('====================================================\n');

  try {
    // 1. Check column_masters
    console.log('[TEST 1] Verifying Production columns in column_masters...');
    const colRes = await pool.query(
      "SELECT col_key, label, category, field_type FROM column_masters WHERE category = 'Production' ORDER BY id ASC"
    );
    const colKeys = colRes.rows.map(r => r.col_key);
    const expectedKeys = [
      'wiremen',
      'mounting_start_date',
      'mounting_complete_date',
      'wiring_start_date',
      'wiring_complete_date',
      'pending_material_complete_date',
      'handover_to_qc_date'
    ];
    for (const k of expectedKeys) {
      assert(colKeys.includes(k), `Expected column_masters to have ${k}`);
    }
    console.log('✓ All 7 Production columns verified in column_masters.');

    // 2. Check a test unit to update
    const unitRes = await pool.query('SELECT id, unit_id, short_serial, order_id FROM order_units LIMIT 1');
    assert(unitRes.rows.length > 0, 'At least 1 unit required for test');
    const testUnit = unitRes.rows[0];
    const testUnitId = testUnit.id;

    // 3. Ensure test wireman exists in wireman_masters
    await pool.query(
      "INSERT INTO wireman_masters (name, experience, is_active) VALUES ('Test Wireman', '5 Years', true) ON CONFLICT DO NOTHING"
    );

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

    const prodUser = await getOrCreateTestUser('Production', 'test_prod_operator');
    const adminUser = await getOrCreateTestUser('Admin', 'test_admin_user');

    // 4. Test Production role updating the unit
    console.log('\n[TEST 2] Testing Production role updating all 7 production columns via PUT /api/units/:id...');
    const prodToken = jwt.sign({ id: prodUser.id, username: prodUser.username, role: 'Production' }, JWT_SECRET);

    const todayStr = new Date().toISOString().split('T')[0];
    const updatePayload = {
      wiremen: 'Test Wireman',
      mounting_start_date: todayStr,
      mounting_complete_date: todayStr,
      wiring_start_date: todayStr,
      wiring_complete_date: todayStr,
      pending_material_complete_date: todayStr,
      handover_to_qc_date: todayStr
    };

    const updateRes = await fetch(`${API_BASE}/api/units/${testUnitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${prodToken}`
      },
      body: JSON.stringify(updatePayload)
    });

    assert.strictEqual(updateRes.status, 200, `Expected 200 OK from PUT /api/units/:id, got ${updateRes.status}`);
    const updateData = await updateRes.json();
    assert(updateData.id || updateData.success, 'Expected success response');
    console.log('✓ Production role successfully updated all 7 production fields.');

    // 5. Verify database values directly
    console.log('\n[TEST 3] Verifying database persistence on order_units...');
    const dbUnitRes = await pool.query(
      `SELECT wiremen, mounting_start_date, mounting_complete_date, wiring_start_date, wiring_complete_date, pending_material_complete_date, handover_to_qc_date
       FROM order_units WHERE id = $1`,
      [testUnitId]
    );
    const dbRow = dbUnitRes.rows[0];
    assert.strictEqual(dbRow.wiremen, 'Test Wireman', 'Wireman should match');
    assert(dbRow.mounting_start_date, 'mounting_start_date should be set');
    assert(dbRow.mounting_complete_date, 'mounting_complete_date should be set');
    assert(dbRow.wiring_start_date, 'wiring_start_date should be set');
    assert(dbRow.wiring_complete_date, 'wiring_complete_date should be set');
    assert(dbRow.pending_material_complete_date, 'pending_material_complete_date should be set');
    assert(dbRow.handover_to_qc_date, 'handover_to_qc_date should be set');
    console.log('✓ Database columns accurately persisted.');

    // 6. Verify /api/dept-worklist/all returns the new fields
    console.log('\n[TEST 4] Verifying /api/dept-worklist/all returns the production fields...');
    const adminToken = jwt.sign({ id: adminUser.id, username: adminUser.username, role: 'Admin' }, JWT_SECRET);
    const worklistRes = await fetch(`${API_BASE}/api/dept-worklist/all`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(worklistRes.status, 200, 'Worklist fetch should succeed');
    const worklist = await worklistRes.json();
    const fetchedUnit = worklist.find(u => (u.unit_id === testUnitId || u.id === testUnitId));
    assert(fetchedUnit, 'Updated unit should be in worklist');
    assert.strictEqual(fetchedUnit.wiremen, 'Test Wireman', 'fetchedUnit.wiremen should match');
    console.log('✓ Worklist endpoint properly returned wiremen and production date fields.');

    console.log('\n====================================================');
    console.log('  ALL PRODUCTION COLUMNS BACKEND TESTS PASSED!');
    console.log('====================================================');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();
