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
import { fileURLToPath } from 'url';

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

console.log(`\n${results.length - failed.length}/${results.length} test files passed.`);
process.exit(failed.length > 0 ? 1 : 0);
