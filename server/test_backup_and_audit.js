/**
 * test_backup_and_audit.js
 * 
 * Verifies:
 * 1. Database backup generation (SQL syntax, tables, sequences)
 * 2. User creation & deletion audit logging
 * 3. Log preservation (ON DELETE SET NULL, historical records survive user deletion)
 */

import pool from './db.js';
import { generateDatabaseBackup } from './services/databaseBackup.js';

async function runTests() {
  console.log('====================================================');
  console.log('  STARTING TEST SUITE: BACKUP & AUDIT TRAIL LOGGING');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, message) {
    total++;
    if (condition) {
      console.log(`  ✓ PASSED: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAILED: ${message}`);
      process.exitCode = 1;
    }
  }

  const client = await pool.connect();
  try {
    // ----------------------------------------------------
    // TEST 1: Database Backup Generator
    // ----------------------------------------------------
    console.log('[TEST 1] Testing Database Backup Generation...');
    const backupResult = await generateDatabaseBackup(client);

    assert(Boolean(backupResult.filename), `Backup filename generated: "${backupResult.filename}"`);
    assert(backupResult.filename.startsWith('vyom_erp_backup_') && backupResult.filename.endsWith('.sql'), 'Filename follows naming convention');
    assert(Boolean(backupResult.sql && backupResult.sql.length > 500), `SQL dump generated (${backupResult.sql.length} characters)`);
    assert(backupResult.sql.includes('BEGIN;') && backupResult.sql.includes('COMMIT;'), 'SQL dump is wrapped in a safe transaction');
    assert(backupResult.stats.tables > 5, `Dumping ${backupResult.stats.tables} tables with ${backupResult.stats.totalRows} total rows`);
    assert(backupResult.sql.includes('-- End of Backup Dump'), 'SQL dump contains valid footer');

    // ----------------------------------------------------
    // TEST 2: Schema Foreign Key Configuration
    // ----------------------------------------------------
    console.log('\n[TEST 2] Verifying activity_logs Foreign Key Constraint...');
    const fkQuery = await client.query(`
      SELECT rc.delete_rule, tc.constraint_name
      FROM information_schema.referential_constraints rc
      JOIN information_schema.table_constraints tc 
        ON rc.constraint_name = tc.constraint_name
      WHERE tc.table_name = 'activity_logs';
    `);

    const userFk = fkQuery.rows.find(r => r.constraint_name.includes('user_id'));
    assert(Boolean(userFk), 'Foreign key on activity_logs(user_id) exists');
    assert(userFk && userFk.delete_rule === 'SET NULL', `activity_logs delete rule is SET NULL (got: ${userFk?.delete_rule})`);

    // Check username_snapshot column
    const colQuery = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'activity_logs' AND column_name = 'username_snapshot';
    `);
    assert(colQuery.rows.length === 1, 'Column activity_logs.username_snapshot exists');

    // ----------------------------------------------------
    // TEST 3: User Creation & Activity Logging
    // ----------------------------------------------------
    console.log('\n[TEST 3] Testing User Lifecycle Audit Logging...');
    const adminUserRes = await client.query(`SELECT id, username FROM users WHERE role = 'Admin' LIMIT 1`);
    const adminUser = adminUserRes.rows[0];
    assert(Boolean(adminUser), `Admin user found for audit testing (ID: ${adminUser.id}, Name: ${adminUser.username})`);

    const testUsername = `test_audit_${Date.now()}`;
    const testEmail = `${testUsername}@example.com`;

    // 3a. Insert user
    const newUserRes = await client.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, 'dummyhash123', 'Stores')
      RETURNING id, username, email, role;
    `, [testUsername, testEmail]);
    const createdUser = newUserRes.rows[0];

    // Simulate audit log for creation
    await client.query(`
      INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot)
      VALUES ($1, 'Admin', $2, $3);
    `, [adminUser.id, `Created user "${createdUser.username}" (Role: ${createdUser.role}, Email: ${createdUser.email})`, adminUser.username]);

    // Verify creation log exists
    const createLogRes = await client.query(`
      SELECT * FROM activity_logs 
      WHERE action_text LIKE $1 
      ORDER BY timestamp DESC LIMIT 1;
    `, [`%Created user "${testUsername}"%`]);
    assert(createLogRes.rows.length === 1, 'Audit log for user creation was recorded');
    assert(createLogRes.rows[0].dept === 'Admin', 'Audit log dept is Admin');

    // 3b. Test action performed by the new user
    const userActionLogRes = await client.query(`
      INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot)
      VALUES ($1, 'Stores', $2, $3)
      RETURNING id;
    `, [createdUser.id, `User ${testUsername} performed test material inspection`, testUsername]);
    const userActionLogId = userActionLogRes.rows[0].id;
    assert(Boolean(userActionLogId), 'Action log created by the new user');

    // ----------------------------------------------------
    // TEST 4: User Deletion & Historical Log Preservation
    // ----------------------------------------------------
    console.log('\n[TEST 4] Testing User Deletion and Log Preservation...');
    // Delete the test user
    const deleteRes = await client.query(`
      DELETE FROM users WHERE id = $1 RETURNING id, username, email, role;
    `, [createdUser.id]);
    assert(deleteRes.rows.length === 1, `Deleted test user "${testUsername}"`);

    // Record deletion log
    await client.query(`
      INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot)
      VALUES ($1, 'Admin', $2, $3);
    `, [adminUser.id, `Deleted user "${testUsername}" (Role: Stores, Email: ${testEmail})`, adminUser.username]);

    // Verify deletion log exists
    const deleteLogRes = await client.query(`
      SELECT * FROM activity_logs 
      WHERE action_text LIKE $1 
      ORDER BY timestamp DESC LIMIT 1;
    `, [`%Deleted user "${testUsername}"%`]);
    assert(deleteLogRes.rows.length === 1, 'Audit log for user deletion was recorded');

    // CRUCIAL: Verify that the log authored by the now-deleted user was NOT cascaded/deleted!
    const preservedLogRes = await client.query(`
      SELECT l.*, COALESCE(u.username, l.username_snapshot, 'Deleted User') AS resolved_username
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id = u.id
      WHERE l.id = $1;
    `, [userActionLogId]);

    assert(preservedLogRes.rows.length === 1, 'CRITICAL: Historical log survived user deletion (NOT cascaded)');
    assert(preservedLogRes.rows[0].user_id === null, 'Foreign key user_id was set to NULL safely');
    assert(preservedLogRes.rows[0].resolved_username === testUsername, `Username was resolved from username_snapshot ("${preservedLogRes.rows[0].resolved_username}")`);

    // Clean up test audit logs
    await client.query(`
      DELETE FROM activity_logs 
      WHERE action_text LIKE $1 OR action_text LIKE $2;
    `, [`%${testUsername}%`, `%test material inspection%`]);
    console.log('\n  ✓ Test audit data cleaned up cleanly.');

    console.log('\n====================================================');
    console.log(`  TEST RESULTS: ${passed} / ${total} PASSED`);
    console.log('====================================================\n');

  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exitCode = 1;
  } finally {
    client.release();
  }
}

runTests().then(() => {
  process.exit(process.exitCode || 0);
});

