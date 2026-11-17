/**
 * Runs the integration test scripts (server/test_*.js) one after another and prints a summary.
 *
 * These tests talk to a LIVE backend and database (see CLAUDE.md). Never point them at production.
 *
 * Usage (from server/):
 *   npm test                         # all tests except the ones that write backup files
 *   npm test -- --all                # include test_maintenance_api / test_backup_and_audit
 *   npm test -- po_system qc         # only tests whose file name contains one of these words
 *
 * Environment (passed through to each test): DATABASE_URL, API_BASE, JWT_SECRET.
 */
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { listUploadFiles, findOrphanUploads, deleteUploads } from './scripts/cleanup_orphan_uploads.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// These write emergency/backup bundles to server/backups, so they only run with --all.
const SIDE_EFFECT_TESTS = new Set(['test_maintenance_api.js', 'test_backup_and_audit.js']);
const TIMEOUT_MS = 4 * 60 * 1000;

const args = process.argv.slice(2);
const includeAll = args.includes('--all');
const filters = args.filter((a) => !a.startsWith('--'));

const tests = fs.readdirSync(__dirname)
  .filter((f) => /^test_.*\.js$/.test(f))
  .filter((f) => includeAll || !SIDE_EFFECT_TESTS.has(f))
  .filter((f) => filters.length === 0 || filters.some((word) => f.includes(word)))
  .sort();

if (tests.length === 0) {
  console.error('No matching test files.');
  process.exit(1);
}

const runOne = (file) => new Promise((resolve) => {
  const started = Date.now();
  let output = '';
  const child = spawn(process.execPath, [path.join(__dirname, file)], { cwd: __dirname, env: process.env });
  const timer = setTimeout(() => {
    output += `\n[run_tests] Timed out after ${TIMEOUT_MS / 1000}s`;
    child.kill('SIGKILL');
  }, TIMEOUT_MS);
  child.stdout.on('data', (d) => { output += d; });
  child.stderr.on('data', (d) => { output += d; });
  child.on('close', (code) => {
    clearTimeout(timer);
    resolve({ file, code, output, seconds: ((Date.now() - started) / 1000).toFixed(1) });
  });
});

// Tests upload sample files and delete their rows, but not the files. Remember what was
// there before so afterwards we can remove only files created during this run that no
// row references. (If the backend runs elsewhere, nothing new appears here: no-op.)
const uploadsBefore = new Set(listUploadFiles());
const runStartedAt = new Date();

const cleanupTestUploads = async () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db'
  });
  try {
    // Tests delete their orders/units, but `documents` is polymorphic (no FK cascade), so
    // their document rows are left pointing at nothing. Remove such rows created in this run.
    const dangling = await pool.query(
      `DELETE FROM documents d
       WHERE d.uploaded_at >= $1
         AND ((d.entity_type = 'Order' AND NOT EXISTS (SELECT 1 FROM orders o WHERE o.id = d.entity_id))
           OR (d.entity_type = 'Unit' AND NOT EXISTS (SELECT 1 FROM order_units u WHERE u.id = d.entity_id)))`,
      [runStartedAt]
    );
    if (dangling.rowCount > 0) console.log(`\nRemoved ${dangling.rowCount} document row(s) whose test order/unit was deleted.`);

    const created = listUploadFiles().filter((name) => !uploadsBefore.has(name));
    if (created.length === 0) return;
    const orphans = await findOrphanUploads(pool, { candidates: created });
    const deleted = deleteUploads(orphans);
    console.log(`\nRemoved ${deleted} upload file(s) left behind by tests (${created.length - orphans.length} still referenced, kept).`);
  } catch (err) {
    console.warn(`\nCould not clean up test uploads: ${err.message}`);
  } finally {
    await pool.end();
  }
};

const results = [];
for (const file of tests) {
  process.stdout.write(`▶ ${file} ... `);
  const result = await runOne(file);
  results.push(result);
  console.log(result.code === 0 ? `ok (${result.seconds}s)` : `FAILED (exit ${result.code}, ${result.seconds}s)`);
}

const failed = results.filter((r) => r.code !== 0);
for (const r of failed) {
  console.log(`\n──── ${r.file} output (last 40 lines) ────`);
  console.log(r.output.trimEnd().split('\n').slice(-40).join('\n'));
}

await cleanupTestUploads();

console.log(`\n${results.length - failed.length}/${results.length} test files passed.`);
process.exit(failed.length > 0 ? 1 : 0);
