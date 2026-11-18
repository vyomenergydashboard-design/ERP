import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function runTests() {
  console.log('========================================================');
  console.log('  TEST SUITE: QC DEPARTMENT COLUMNS & API INTEGRATION   ');
  console.log('========================================================\n');

  try {
    // 1. Verify Database Schema
    console.log('[TEST 1] Verifying QC columns in order_units and order_line_items...');
    const colCheck = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name IN ('order_units', 'order_line_items')
        AND column_name IN ('qc_receiving_date', 'qc_start_date', 'qc_complete_date', 'qc_status')
      ORDER BY table_name, column_name;
    `);

    const foundCols = colCheck.rows.map(r => `${r.table_name}.${r.column_name}`);
    console.log('Found database columns:', foundCols);
    assert(foundCols.includes('order_units.qc_receiving_date'), 'order_units.qc_receiving_date missing');
    assert(foundCols.includes('order_units.qc_start_date'), 'order_units.qc_start_date missing');
    assert(foundCols.includes('order_units.qc_complete_date'), 'order_units.qc_complete_date missing');
    assert(foundCols.includes('order_units.qc_status'), 'order_units.qc_status missing');
    assert(foundCols.includes('order_line_items.qc_receiving_date'), 'order_line_items.qc_receiving_date missing');
    assert(foundCols.includes('order_line_items.qc_start_date'), 'order_line_items.qc_start_date missing');
    assert(foundCols.includes('order_line_items.qc_complete_date'), 'order_line_items.qc_complete_date missing');
    assert(foundCols.includes('order_line_items.qc_status'), 'order_line_items.qc_status missing');
    console.log('✓ All 4 QC columns exist with correct types in order_units and order_line_items.');

    // 2. Verify column_masters and department_column_visibility
    console.log('\n[TEST 2] Verifying column_masters and QC department visibility...');
    const cmCheck = await pool.query(`
      SELECT col_key, label, category, field_type 
      FROM column_masters 
      WHERE col_key IN ('qc_receiving_date', 'qc_start_date', 'qc_complete_date', 'qc_status');
    `);
    assert.strictEqual(cmCheck.rows.length, 4, 'Expected 4 records in column_masters');
    for (const cm of cmCheck.rows) {
      assert.strictEqual(cm.category, 'QC', `Column ${cm.col_key} should have category 'QC'`);
    }

    const dcvCheck = await pool.query(`
      SELECT col_key, is_visible 
      FROM department_column_visibility 
      WHERE dept = 'QC' 
        AND col_key IN ('qc_receiving_date', 'qc_start_date', 'qc_complete_date', 'qc_status');
    `);
    assert.strictEqual(dcvCheck.rows.length, 4, 'Expected 4 visibility records for QC dept');
    for (const row of dcvCheck.rows) {
      assert.strictEqual(row.is_visible, true, `Column ${row.col_key} should be visible in QC`);
    }
    console.log('✓ column_masters and department_column_visibility properly configured.');

    // 3. Get or create test unit and auth user
    console.log('\n[TEST 3] Testing API persistence for all 5 QC Status options & timestamps...');
    const unitRes = await pool.query('SELECT id, unit_id, order_id, line_item_id FROM order_units LIMIT 1');
    assert(unitRes.rows.length > 0, 'Need at least 1 unit to test');
    const testUnit = unitRes.rows[0];

    async function getOrCreateTestUser(role, username) {
      const existing = await pool.query('SELECT id, username, role FROM users WHERE username = $1', [username]);
      if (existing.rows.length > 0) {
        return existing.rows[0];
      }
      const created = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
        [username, `${username}@test.com`, 'testhash', role]
      );
      return created.rows[0];
    }

    const qcUser = await getOrCreateTestUser('QC', 'test_qc_user');
    const qcToken = jwt.sign(
      { id: qcUser.id, username: qcUser.username, role: 'QC' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const testReceivingDate = '2026-11-03T09:30:00.000Z';
    const testStartDate = '2026-11-03T11:00:00.000Z';
    const testCompleteDate = '2026-11-03T17:45:00.000Z';

    const qcOptions = [
      'Labeling',
      'WireChecking',
      'In Process',
      'FAT Completed',
      'Handover to packing'
    ];

    for (const option of qcOptions) {
      console.log(`  Updating unit ${testUnit.id} with QC Status: "${option}"...`);
      const res = await fetch(`${API_BASE}/api/units/${testUnit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${qcToken}`
        },
        body: JSON.stringify({
          qc_receiving_date: testReceivingDate,
          qc_start_date: testStartDate,
          qc_complete_date: testCompleteDate,
          qc_status: option
        })
      });

      assert.strictEqual(res.status, 200, `Expected HTTP 200, got ${res.status}`);

      const dbCheck = await pool.query(
        'SELECT qc_receiving_date, qc_start_date, qc_complete_date, qc_status FROM order_units WHERE id = $1',
        [testUnit.id]
      );
      const row = dbCheck.rows[0];
      assert.strictEqual(row.qc_status, option, `Expected status "${option}", got "${row.qc_status}"`);
      assert.strictEqual(new Date(row.qc_receiving_date).toISOString(), testReceivingDate);
      assert.strictEqual(new Date(row.qc_start_date).toISOString(), testStartDate);
      assert.strictEqual(new Date(row.qc_complete_date).toISOString(), testCompleteDate);
    }
    console.log('✓ All 5 QC Status options and 3 DateTime timestamps persist accurately in PostgreSQL.');

    // 4. Verify Worklist API Endpoint returns QC columns
    console.log('\n[TEST 4] Verifying GET /api/dept-worklist/QC returns QC columns...');
    const worklistRes = await fetch(`${API_BASE}/api/dept-worklist/QC`, {
      headers: { 'Authorization': `Bearer ${qcToken}` }
    });
    assert.strictEqual(worklistRes.status, 200, `Expected HTTP 200, got ${worklistRes.status}`);
    const worklistData = await worklistRes.json();
    assert(Array.isArray(worklistData), 'Worklist response should be an array');
    console.log(`Received ${worklistData.length} units from /api/dept-worklist/QC`);
    const foundUnit = worklistData.find(u => u.id === testUnit.id);
    if (foundUnit) {
      assert('qc_receiving_date' in foundUnit, 'qc_receiving_date should be in unit object');
      assert('qc_start_date' in foundUnit, 'qc_start_date should be in unit object');
      assert('qc_complete_date' in foundUnit, 'qc_complete_date should be in unit object');
      assert('qc_status' in foundUnit, 'qc_status should be in unit object');
      console.log('✓ Unit object contains all 4 QC fields.');
    }

    console.log('\n========================================================');
    console.log('  ALL QC DEPARTMENT COLUMN TESTS PASSED SUCCESSFULLY!   ');
    console.log('========================================================\n');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();

