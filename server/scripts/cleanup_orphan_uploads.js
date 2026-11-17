/**
 * Finds (and optionally deletes) files in server/uploads that no database row references.
 *
 * Upload references live only in documents.file_path and part_number_documents.file_path.
 * Files with the multer name pattern "<13-digit ms timestamp>-<random>-<name>" are candidates;
 * anything else (.gitkeep, sub-folders, hand-placed files) is never touched.
 *
 * CLI (from server/):
 *   node scripts/cleanup_orphan_uploads.js                         # dry run: list orphans
 *   node scripts/cleanup_orphan_uploads.js --since=2026-11-17      # only files uploaded on/after a date
 *   node scripts/cleanup_orphan_uploads.js --since=... --delete    # actually delete them
 *
 * Env: DATABASE_URL (default: local dev DB).
 */
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const UPLOADS_DIR = path.resolve(__dirname, '..', 'uploads');
const UPLOAD_NAME = /^(\d{13})-\d+-.+/;

export const listUploadFiles = (dir = UPLOADS_DIR) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isFile() && UPLOAD_NAME.test(e.name))
    .map((e) => e.name);
};

export const referencedUploadNames = async (pool) => {
  const { rows } = await pool.query(`
    SELECT file_path FROM documents WHERE file_path IS NOT NULL
    UNION ALL
    SELECT file_path FROM part_number_documents WHERE file_path IS NOT NULL
  `);
  return new Set(rows.map((r) => path.basename(String(r.file_path).replace(/\\/g, '/'))));
};

// Returns the orphaned names among `candidates` (defaults to every upload file).
export const findOrphanUploads = async (pool, { candidates, sinceMs = 0, dir = UPLOADS_DIR } = {}) => {
  const referenced = await referencedUploadNames(pool);
  return (candidates || listUploadFiles(dir)).filter((name) => {
    const match = name.match(UPLOAD_NAME);
    return match && Number(match[1]) >= sinceMs && !referenced.has(name);
  });
};

export const deleteUploads = (names, dir = UPLOADS_DIR) => {
  let deleted = 0;
  for (const name of names) {
    try {
      fs.unlinkSync(path.join(dir, name));
      deleted++;
    } catch (err) {
      if (err.code !== 'ENOENT') console.warn(`Could not delete ${name}: ${err.message}`);
    }
  }
  return deleted;
};

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const args = process.argv.slice(2);
  const sinceArg = args.find((a) => a.startsWith('--since='));
  const sinceMs = sinceArg ? Date.parse(sinceArg.slice('--since='.length)) : 0;
  if (Number.isNaN(sinceMs)) {
    console.error('Invalid --since date.');
    process.exit(1);
  }
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db'
  });
  try {
    const orphans = await findOrphanUploads(pool, { sinceMs });
    orphans.forEach((name) => console.log(name));
    if (args.includes('--delete')) {
      console.log(`Deleted ${deleteUploads(orphans)} of ${orphans.length} orphaned upload file(s).`);
    } else {
      console.log(`${orphans.length} orphaned upload file(s). Dry run — pass --delete to remove them.`);
    }
  } finally {
    await pool.end();
  }
}
