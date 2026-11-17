/**
 * routes/maintenance.js
 * 
 * System Maintenance and Disaster Recovery API endpoints.
 * Includes Factory Reset endpoint protected by Admin RBAC.
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZipArchive } from 'archiver';
import { generateDatabaseBackup } from '../services/databaseBackup.js';
import { publicErrorMessage } from '../services/httpErrors.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Base directory for emergency backups (configurable; defaults to server/backups). */
const BACKUP_BASE_DIR = process.env.BACKUP_DIR || path.resolve(__dirname, '../backups');

/**
 * Writes a zip archive to `outPath`. `populate(archive)` adds entries.
 * Resolves on the output stream's 'close'; rejects on archive errors, output stream
 * errors, and archive warnings other than ENOENT.
 */
function writeZip(outPath, level, populate) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const fail = (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    };
    const output = fs.createWriteStream(outPath);
    const archive = new ZipArchive({ zlib: { level } });
    output.on('close', () => {
      if (settled) return;
      settled = true;
      resolve(archive.pointer());
    });
    output.on('error', fail);
    archive.on('error', fail);
    archive.on('warning', (warn) => {
      if (warn && warn.code === 'ENOENT') {
        console.warn('[Factory Reset] Archive warning (ignored):', warn.message);
      } else {
        fail(warn);
      }
    });
    archive.pipe(output);
    try {
      populate(archive);
      archive.finalize();
    } catch (err) {
      fail(err);
    }
  });
}

export default function createMaintenanceRouter(pool, authorize) {
  const router = express.Router();

  /**
   * POST /api/admin/maintenance/factory-reset
   * 
   * Complete transactional operational data wipe:
   * 1. Creates full emergency database SQL dump and uploads archive.
   * 2. Truncates orders, order_line_items, order_units, order_steps, unit_steps, documents, activity_logs.
   * 3. Preserves users, masters, company locations, task masters, part numbers, column visibility.
   * 4. Optionally resets starting sequences (order_number_start, unit_number_start) in system_settings.
   * 5. Seeds initial audit log recording the reset.
   * 6. Cleans physical files in server/uploads/ while preserving .gitkeep and master documents.
   */
  router.post('/factory-reset', authorize(['Admin']), async (req, res) => {
    const { confirmation, resetStartingSequence } = req.body || {};

    if (confirmation !== 'FACTORY RESET') {
      return res.status(400).json({
        error: 'Confirmation phrase does not match. You must type "FACTORY RESET".'
      });
    }

    const client = await pool.connect();
    let backupFolder = null;

    try {
      await client.query('BEGIN');

      // Step A: Emergency Backup before wipe
      const backupResult = await generateDatabaseBackup(client);

      const timestampStr = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFolderName = `EMERGENCY_BEFORE_RESET_${timestampStr}`;
      backupFolder = path.join(BACKUP_BASE_DIR, backupFolderName);
      fs.mkdirSync(backupFolder, { recursive: true });

      // Write database SQL dump
      const sqlFilePath = path.join(backupFolder, backupResult.filename);
      fs.writeFileSync(sqlFilePath, backupResult.sql, 'utf8');

      // Archive physical uploads into a clean .zip file
      const uploadsDir = path.resolve(__dirname, '../uploads');
      const zipFilePath = path.join(backupFolder, 'uploads.zip');
      if (fs.existsSync(uploadsDir)) {
        await writeZip(zipFilePath, 6, (archive) => {
          archive.directory(uploadsDir, false);
        });
      }

      // Create a master single-zip bundle for easy one-click browser download
      const masterBundlePath = path.join(backupFolder, 'complete_emergency_backup.zip');
      await writeZip(masterBundlePath, 4, (archive) => {
        if (fs.existsSync(sqlFilePath)) {
          archive.file(sqlFilePath, { name: backupResult.filename });
        }
        if (fs.existsSync(zipFilePath)) {
          archive.file(zipFilePath, { name: 'uploads.zip' });
        }
        archive.append(
          `VYOM ERP - COMPLETE EMERGENCY BACKUP BUNDLE\n` +
          `Generated: ${new Date().toISOString()}\n` +
          `Contents:\n` +
          `- ${backupResult.filename} : Full PostgreSQL Database Dump (${backupResult.stats?.totalRows || 0} rows across ${backupResult.stats?.tables || 0} tables)\n` +
          `- uploads.zip : All physical documents, drawings, and BOMs\n`,
          { name: 'BACKUP_INFO.txt' }
        );
      });

      // Abort before any destructive step unless the emergency backup really exists
      const sqlStat = fs.existsSync(sqlFilePath) ? fs.statSync(sqlFilePath) : null;
      const bundleStat = fs.existsSync(masterBundlePath) ? fs.statSync(masterBundlePath) : null;
      if (!sqlStat || sqlStat.size === 0 || !bundleStat || bundleStat.size === 0) {
        throw new Error('Emergency backup bundle is missing or empty; factory reset aborted before any data was deleted.');
      }

      // Step B: Transactional wipe of operational data
      // Cascades cleanly from orders to order_line_items, order_units, order_steps, and unit_steps
      await client.query('TRUNCATE TABLE orders RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE documents RESTART IDENTITY CASCADE');
      await client.query('TRUNCATE TABLE activity_logs RESTART IDENTITY CASCADE');

      // Also wipe vendor purchase orders to prevent orphaned vendor POs matching resequenced unit serials
      await client.query(`
        DO $$ 
        BEGIN 
          IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vendor_purchase_orders') THEN 
            TRUNCATE TABLE vendor_purchase_orders RESTART IDENTITY CASCADE; 
          END IF; 
        END $$;
      `);

      // Step C: Reset starting sequence if requested
      const shouldResetSequence = resetStartingSequence === true || resetStartingSequence === 'true';
      if (shouldResetSequence) {
        await client.query(`
          INSERT INTO system_settings (key, value, updated_at) VALUES ('order_number_start', '1', NOW())
          ON CONFLICT (key) DO UPDATE SET value = '1', updated_at = NOW()
        `);
        await client.query(`
          INSERT INTO system_settings (key, value, updated_at) VALUES ('unit_number_start', '1', NOW())
          ON CONFLICT (key) DO UPDATE SET value = '1', updated_at = NOW()
        `);
      }

      // Step D: Seed initial audit log
      const adminUserId = req.user?.id || null;
      const adminUsername = req.user?.username || 'Admin';
      await client.query(
        `INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot) 
         VALUES ($1, 'Admin', 'Factory Reset executed: All orders, units, steps, and documents cleared.', $2)`,
        [adminUserId, adminUsername]
      );

      await client.query('COMMIT');

      // Step E: Physical files cleanup
      // Read all files in server/uploads/ and delete them EXCEPT .gitkeep and any files in part_number_documents
      try {
        const preservedFiles = new Set(['.gitkeep']);

        // Preserve master part number documents so Part Number Masters are not corrupted
        const pDocsRes = await client.query('SELECT file_path FROM part_number_documents WHERE file_path IS NOT NULL');
        for (const row of pDocsRes.rows) {
          if (row.file_path) {
            preservedFiles.add(path.basename(row.file_path));
          }
        }

        if (fs.existsSync(uploadsDir)) {
          const files = fs.readdirSync(uploadsDir);
          for (const file of files) {
            if (!preservedFiles.has(file)) {
              const filePath = path.join(uploadsDir, file);
              try {
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                  fs.unlinkSync(filePath);
                } else if (stat.isDirectory()) {
                  fs.rmSync(filePath, { recursive: true, force: true });
                }
              } catch (fileErr) {
                console.warn(`[Factory Reset] Could not delete file ${file}:`, fileErr.message);
              }
            }
          }
        }
      } catch (cleanupErr) {
        console.warn('[Factory Reset] Physical files cleanup warning:', cleanupErr.message);
      }

      return res.status(200).json({
        success: true,
        message: 'Factory reset completed successfully. Emergency backup created and ready for download.',
        backupPath: backupFolder,
        downloadUrl: `/api/admin/maintenance/download-emergency-backup?folder=${backupFolderName}`,
        bundleFilename: `${backupFolderName}.zip`
      });

    } catch (err) {
      await client.query('ROLLBACK');
      console.error('[Factory Reset Error]:', err);
      return res.status(500).json({ error: publicErrorMessage(err, 'Failed to perform factory reset') });
    } finally {
      client.release();
    }
  });

  /**
   * GET /api/admin/maintenance/download-emergency-backup
   * Secure Admin direct browser download of complete emergency backup bundle (.zip).
   */
  router.get('/download-emergency-backup', authorize(['Admin']), (req, res) => {
    try {
      const { folder } = req.query || {};
      if (!folder) {
        return res.status(400).json({ error: 'Backup folder parameter is required.' });
      }

      // Sanitize folder string against directory traversal attacks
      const safeFolder = path.basename(String(folder).trim());
      const candidatePaths = Array.from(new Set([
        path.join(BACKUP_BASE_DIR, safeFolder, 'complete_emergency_backup.zip'),
        path.resolve(__dirname, '../backups', safeFolder, 'complete_emergency_backup.zip')
      ]));

      let targetBundle = null;
      for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
          targetBundle = p;
          break;
        }
      }

      if (!targetBundle) {
        return res.status(404).json({ error: `Emergency backup bundle "${safeFolder}" not found.` });
      }

      const stat = fs.statSync(targetBundle);
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFolder}.zip"`);
      res.setHeader('Content-Length', stat.size);

      const stream = fs.createReadStream(targetBundle);
      stream.pipe(res);

    } catch (downloadErr) {
      console.error('[Backup Download Error]:', downloadErr);
      return res.status(500).json({ error: publicErrorMessage(downloadErr, 'Failed to download emergency backup') });
    }
  });

  return router;
}
