import assert from 'assert';
import jwt from 'jsonwebtoken';
import pg from 'pg';
import { generateDatabaseBackup } from '../services/databaseBackup.js';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function runTests() {
  console.log('========================================================================');
  console.log('  TEST SUITE: FACTORY RESET MAINTENANCE API & RBAC                      ');
  console.log('========================================================================\n');

  const client = await pool.connect();

  try {
    // 1. Get or create test users for Admin and Viewer
    const adminRes = await client.query(`
      SELECT id, username, role FROM users WHERE role = 'Admin' LIMIT 1
    `);
    assert(adminRes.rows.length > 0, 'Admin user should exist in database');
    const adminUser = adminRes.rows[0];
    const adminToken = jwt.sign(
      { id: adminUser.id, username: adminUser.username, role: 'Admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const viewerRes = await client.query(`
      SELECT id, username, role FROM users WHERE role = 'Viewer' LIMIT 1
    `);
    let viewerToken;
    if (viewerRes.rows.length > 0) {
      viewerToken = jwt.sign(
        { id: viewerRes.rows[0].id, username: viewerRes.rows[0].username, role: 'Viewer' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
    } else {
      const vRes = await client.query(`
        INSERT INTO users (username, email, password, role) 
        VALUES ('maintenance_test_viewer', 'viewer_maint@test.local', 'hash', 'Viewer')
        ON CONFLICT (username) DO UPDATE SET role = 'Viewer'
        RETURNING id, username, role
      `);
      viewerToken = jwt.sign(
        { id: vRes.rows[0].id, username: vRes.rows[0].username, role: 'Viewer' },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
    }

    // -------------------------------------------------------------------------
    // TEST 1: Unauthenticated request must return 401
    // -------------------------------------------------------------------------
    console.log('[TEST 1] Verifying unauthenticated request is rejected (401)...');
    const unauthRes = await fetch(`${API_BASE}/api/admin/maintenance/factory-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ confirmation: 'FACTORY RESET' })
    });
    assert.strictEqual(unauthRes.status, 401, `Expected 401, got ${unauthRes.status}`);
    console.log('  ✓ PASS: Unauthenticated access blocked with HTTP 401.\n');

    // -------------------------------------------------------------------------
    // TEST 2: Non-Admin role (Viewer) must return 403
    // -------------------------------------------------------------------------
    console.log('[TEST 2] Verifying non-Admin role is forbidden (403)...');
    const nonAdminRes = await fetch(`${API_BASE}/api/admin/maintenance/factory-reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${viewerToken}`
      },
      body: JSON.stringify({ confirmation: 'FACTORY RESET' })
    });
    assert.strictEqual(nonAdminRes.status, 403, `Expected 403, got ${nonAdminRes.status}`);
    console.log('  ✓ PASS: Non-Admin role blocked with HTTP 403.\n');

    // -------------------------------------------------------------------------
    // TEST 3: Admin with missing / incorrect confirmation phrase must return 400
    // -------------------------------------------------------------------------
    console.log('[TEST 3] Verifying invalid confirmation phrase returns HTTP 400...');
    const invalidPhrases = ['', 'reset', 'factory reset', 'FACTORY', undefined];
    for (const phrase of invalidPhrases) {
      const badPhraseRes = await fetch(`${API_BASE}/api/admin/maintenance/factory-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ confirmation: phrase })
      });
      assert.strictEqual(badPhraseRes.status, 400, `Expected 400 for phrase "${phrase}", got ${badPhraseRes.status}`);
      const body = await badPhraseRes.json();
      assert.strictEqual(
        body.error,
        'Confirmation phrase does not match. You must type "FACTORY RESET".',
        'Expected exact confirmation phrase error message'
      );
    }
    console.log('  ✓ PASS: Invalid confirmation phrase correctly rejected with HTTP 400.\n');

    // -------------------------------------------------------------------------
    // TEST 4: Verify generateDatabaseBackup functionality directly
    // -------------------------------------------------------------------------
    console.log('[TEST 4] Testing emergency database backup generator (read-only)...');
    const backupResult = await generateDatabaseBackup(client);
    assert(backupResult.filename.startsWith('vyom_erp_backup_'), 'Backup filename should have correct prefix');
    assert(backupResult.sql.includes('BEGIN;'), 'Backup SQL should contain transaction BEGIN');
    assert(backupResult.sql.includes('COMMIT;'), 'Backup SQL should contain transaction COMMIT');
    assert(backupResult.stats.tables > 0, 'Backup should export at least 1 table');
    assert(backupResult.stats.totalRows > 0, 'Backup should export rows');
    console.log(`  ✓ PASS: Database backup generated successfully: ${backupResult.stats.totalRows} rows across ${backupResult.stats.tables} tables.\n`);

    console.log('========================================================================');
    console.log('  ALL MAINTENANCE API TESTS PASSED SUCCESSFULLY!                        ');
    console.log('========================================================================');

  } finally {
    client.release();
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
