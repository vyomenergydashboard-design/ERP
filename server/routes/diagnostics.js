import express from 'express';
import { publicErrorMessage } from '../services/httpErrors.js';

/**
 * Router for the Admin-only diagnostic status (mounted at /api/diagnostic-status): server time,
 * which order_units columns exist, and order / unit counts.
 */
export default function createDiagnosticsRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(['Admin']), async (req, res) => {
    try {
      const colRes = await pool.query(`
        SELECT column_name FROM information_schema.columns 
        WHERE table_name = 'order_units' 
          AND column_name IN ('sales_cleared', 'sales_cleared_at', 'sales_cleared_by', 'po_override_unlinked')
      `);
      const ordersCount = await pool.query('SELECT count(*) FROM orders');
      const unitsCount = await pool.query('SELECT count(*) FROM order_units');
      res.json({
        serverTime: new Date().toISOString(),
        columnsFound: colRes.rows.map(r => r.column_name),
        ordersCount: ordersCount.rows[0].count,
        unitsCount: unitsCount.rows[0].count,
      });
    } catch (err) {
      console.error('Realign pipeline stats failed:', err);
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to load pipeline counts') });
    }
  });

  return router;
}
