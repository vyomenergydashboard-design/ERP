import express from 'express';
import { computeNextOrderNumber } from '../services/orderNumbers.js';

/**
 * Router for system settings (mounted at /api/system-settings). Admin only.
 * order_number_start can only be set before the first order exists; the GET also previews
 * the next order number (read-only, no serial is allocated).
 */
export default function createSystemSettingsRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(['Admin']), async (req, res) => {
    try {
      const result = await pool.query('SELECT key, value FROM system_settings');
      const settings = {};
      result.rows.forEach(r => { settings[r.key] = r.value; });

      // Check if any orders exist (to lock the order_number_start field)
      const ordersCount = await pool.query('SELECT COUNT(*) as cnt FROM orders');
      settings._orders_exist = parseInt(ordersCount.rows[0].cnt) > 0;
      settings._next_order_number = await computeNextOrderNumber(pool);

      res.json(settings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch system settings' });
    }
  });

  router.put('/', authorize(['Admin']), async (req, res) => {
    const { order_number_start } = req.body;
    try {
      // Only allow changing order_number_start if no orders exist yet
      if (order_number_start !== undefined) {
        const ordersCount = await pool.query('SELECT COUNT(*) as cnt FROM orders');
        if (parseInt(ordersCount.rows[0].cnt) > 0) {
          return res.status(400).json({ error: 'Order number start cannot be changed after the first order has been created.' });
        }
        const num = parseInt(order_number_start);
        if (isNaN(num) || num < 1) {
          return res.status(400).json({ error: 'Order number start must be a positive integer.' });
        }
        await pool.query(
          "INSERT INTO system_settings (key, value, updated_at) VALUES ('order_number_start', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()",
          [String(num)]
        );
      }
      res.json({ success: true, message: 'System settings updated.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update system settings' });
    }
  });

  return router;
}
