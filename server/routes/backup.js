/**
 * routes/backup.js
 * 
 * Secure Admin Database Backup API endpoint.
 * Protected by RBAC authorize(['Admin']).
 */

import express from 'express';
import { generateDatabaseBackup } from '../services/databaseBackup.js';

export default function createBackupRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(['Admin']), async (req, res) => {
    try {
      const { filename, sql, stats } = await generateDatabaseBackup();

      // Audit Log: Database Backup Generation
      try {
        await pool.query(
          `INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot) 
           VALUES ($1, 'Admin', $2, $3)`,
          [
            req.user.id,
            `Generated database backup (${stats.totalRows} records across ${stats.tables} tables): ${filename}`,
            req.user.username || 'Admin'
          ]
        );
      } catch (logErr) {
        console.warn('[Audit Log] Failed to log backup action:', logErr.message);
      }

      const sqlBuffer = Buffer.from(sql, 'utf8');

      res.setHeader('Content-Type', 'application/sql; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', sqlBuffer.length);

      return res.status(200).send(sqlBuffer);

    } catch (err) {
      console.error('[Database Backup Error]:', err);
      return res.status(500).json({ error: 'Failed to generate database backup: ' + err.message });
    }
  });

  return router;
}

