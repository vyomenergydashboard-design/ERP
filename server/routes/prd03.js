import express from 'express';
import { getPrd03Sheet } from '../services/prd03Sheet.js';

const MAX_INT4 = 2147483647;

/**
 * Router (mounted at /api/units): GET /:unitId/prd03, the data behind the PRD-03 form for a panel.
 * Read-only; any logged-in user.
 */
export default function createPrd03Router(pool, authorize) {
  const router = express.Router();

  router.get('/:unitId/prd03', authorize(), async (req, res) => {
    const { unitId } = req.params;
    if (!/^\d+$/.test(unitId)) return res.status(400).json({ error: 'Invalid unit id' });
    // order_units.id is an int4; a larger id cannot exist, and Postgres would reject it with a 500.
    if (Number(unitId) > MAX_INT4) return res.status(404).json({ error: 'Unit not found' });
    try {
      const sheet = await getPrd03Sheet(pool, unitId);
      if (!sheet) return res.status(404).json({ error: 'Unit not found' });
      res.json(sheet);
    } catch (err) {
      console.error('PRD-03 sheet error:', err);
      res.status(500).json({ error: 'Failed to load the PRD-03 sheet' });
    }
  });

  return router;
}
