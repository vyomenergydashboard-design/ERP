import express from 'express';

/**
 * Router for the board view (mounted at /api/board): every order with its order-level and
 * unit-level steps and a derived overall status.
 */
export default function createBoardRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
    try {
      const ordersResult = await pool.query(
        `SELECT o.id, o.order_number, o.po_number, o.delivery_date, o.priority, o.notes,
                o.reference_number, o.end_client_name, o.classification, o.hold_status, o.status as order_status,
                c.name AS company_name, l.city AS company_city,
                (SELECT COUNT(*) FROM order_units ou WHERE ou.order_id = o.id) AS unit_count,
                (SELECT COUNT(*) FROM order_line_items oli WHERE oli.order_id = o.id) AS line_item_count,
                COALESCE(
                  (SELECT MAX(s.created_at) FROM order_steps s WHERE s.order_id = o.id),
                  o.created_at
                ) AS updated_at
         FROM orders o
         LEFT JOIN company_locations l ON o.company_location_id = l.id
         LEFT JOIN companies c ON l.company_id = c.id
         ORDER BY o.created_at DESC`
      );

      // Fetch order-level steps
      const orderStepsRes = await pool.query(
        `SELECT s.id, s.order_id, s.dept, s.name, s.status, s.requires_upload, s.notes, s.step_order
         FROM order_steps s
         ORDER BY s.step_order ASC, s.id ASC`
      );

      // Fetch unit-level steps joined with order_units to get order_id
      const unitStepsRes = await pool.query(
        `SELECT s.id, u.order_id, s.dept, CONCAT(u.short_serial, ': ', s.name) as name, s.status, s.requires_upload, s.notes, s.step_order
         FROM unit_steps s
         JOIN order_units u ON s.order_unit_id = u.id
         ORDER BY s.step_order ASC, s.id ASC`
      );

      const orderStepsByOrderId = new Map();
      for (const s of orderStepsRes.rows) {
        let list = orderStepsByOrderId.get(s.order_id);
        if (!list) {
          list = [];
          orderStepsByOrderId.set(s.order_id, list);
        }
        list.push({
          id: `o_${s.id}`,
          dept: s.dept,
          name: s.name,
          status: s.status,
          notes: s.notes
        });
      }

      const unitStepsByOrderId = new Map();
      for (const s of unitStepsRes.rows) {
        let list = unitStepsByOrderId.get(s.order_id);
        if (!list) {
          list = [];
          unitStepsByOrderId.set(s.order_id, list);
        }
        list.push({
          id: `u_${s.id}`,
          dept: s.dept,
          name: s.name,
          status: s.status,
          notes: s.notes
        });
      }

      const orders = ordersResult.rows.map(o => {
        const oSteps = orderStepsByOrderId.get(o.id) || [];
        const uSteps = unitStepsByOrderId.get(o.id) || [];
        const allSteps = [...oSteps, ...uSteps];

        let status = 'incomplete';
        if (o.hold_status === 'Approved' || String(o.order_status || '').toLowerCase().startsWith('hold')) {
          status = 'hold';
        } else if (String(o.order_status || '').toLowerCase().startsWith('cancel')) {
          status = 'cancelled';
        } else if (allSteps.length === 0) {
          status = 'no_steps';
        } else if (allSteps.every(s => s.status === 'done')) {
          status = 'completed';
        }

        return {
          ...o,
          status,
          steps: allSteps
        };
      });

      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
