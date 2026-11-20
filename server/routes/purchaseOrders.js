import express from 'express';
import { evaluatePurchaseAutoCompletion } from '../services/purchaseAutoCompletion.js';
import { broadcastOrderUpdated } from '../services/eventStream.js';

/**
 * Router for Vendor Purchase Orders (Buying materials/components from vendors).
 * Handles persistent database storage in PostgreSQL.
 */
export default function createPurchaseOrdersRouter(pool, authorize, deriveUnitStatus = null) {
  const router = express.Router();

  // GET /api/purchase-orders
  // Returns all vendor purchase orders with linked serials
  router.get('/', authorize(), async (req, res) => {
    try {
      const { search, status } = req.query;
      const params = [];
      const where = [];

      if (typeof status === 'string' && status.trim() && status !== 'All') {
        params.push(status.trim());
        where.push(`LOWER(COALESCE(vpo.status, 'Pending')) = LOWER($${params.length})`);
      }
      if (typeof search === 'string' && search.trim()) {
        // Escape LIKE wildcards so the term is matched literally
        const term = search.trim().replace(/[\\%_]/g, ch => `\\${ch}`);
        params.push(`%${term}%`);
        where.push(`EXISTS (
          SELECT 1 FROM jsonb_array_elements(
            CASE WHEN jsonb_typeof(vpo.pos) = 'array' THEN vpo.pos ELSE '[]'::jsonb END
          ) AS p
          WHERE COALESCE(p->>'poNumber', '') ILIKE $${params.length}
        )`);
      }

      const query = `
        SELECT
          vpo.id,
          vpo.order_uid,
          vpo.category,
          vpo.pos,
          COALESCE(vpo.status, 'Pending') AS status,
          vpo.received_at,
          vpo.created_by,
          vpo.created_at,
          COALESCE(
            json_agg(
              json_build_object(
                'id', vpou.id,
                'serialNumber', vpou.unit_serial
              )
            ) FILTER (WHERE vpou.id IS NOT NULL),
            '[]'::json
          ) AS serials
        FROM vendor_purchase_orders vpo
        LEFT JOIN vendor_purchase_order_units vpou ON vpou.vendor_purchase_order_id = vpo.id
        ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
        GROUP BY vpo.id
        ORDER BY vpo.created_at DESC
      `;

      const ordersRes = await pool.query(query, params);
      res.json(ordersRes.rows);
    } catch (err) {
      console.error('Error fetching vendor purchase orders:', err);
      res.status(500).json({ error: 'Failed to fetch purchase orders' });
    }
  });

  // POST /api/purchase-orders
  // Saves a new vendor purchase order with assigned serial numbers
  router.post('/', authorize(['Admin', 'Manager', 'Purchase', 'Stores']), async (req, res) => {
    const { category, pos, serials, status = 'Pending' } = req.body;

    if (!category || !Array.isArray(pos) || pos.length === 0) {
      return res.status(400).json({ error: 'Category and at least one PO entry are required' });
    }

    if (!Array.isArray(serials) || serials.length === 0) {
      return res.status(400).json({ error: 'At least one serial number is required' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const orderUid = `VPO-${Date.now()}`;
      const createdBy = req.user?.username || 'system';

      // Ensure each PO entry in pos array has status = 'Pending'
      const sanitizedPos = pos.map((p, idx) => ({
        id: p.id || idx + 1,
        poNumber: String(p.poNumber || '').trim(),
        date: p.date || new Date().toISOString().slice(0, 10),
        status: p.status || 'Pending',
        dateReceived: p.dateReceived || null
      }));

      const insertOrderSql = `
        INSERT INTO vendor_purchase_orders (order_uid, category, pos, status, created_by, created_at)
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *
      `;
      const orderRes = await client.query(insertOrderSql, [
        orderUid,
        category,
        JSON.stringify(sanitizedPos),
        status,
        createdBy
      ]);
      const newOrder = orderRes.rows[0];

      // Insert linked units in a single statement
      const serialList = serials
        .map(s => String((s && typeof s === 'object') ? (s.serialNumber || s.id || '') : s).trim())
        .filter(Boolean);
      if (serialList.length > 0) {
        await client.query(
          `INSERT INTO vendor_purchase_order_units (vendor_purchase_order_id, unit_serial, created_at)
           SELECT $1, s, NOW() FROM unnest($2::text[]) AS s`,
          [newOrder.id, serialList]
        );
      }

      // Best-effort purchase step auto-completion for newly linked serials.
      // Runs under a savepoint so a failure cannot leave the transaction aborted before COMMIT.
      if (serialList.length > 0) {
        await client.query('SAVEPOINT vpo_create_autocomplete');
        try {
          await evaluatePurchaseAutoCompletion(serialList, client, deriveUnitStatus, { by: 'serial' });
          await client.query('RELEASE SAVEPOINT vpo_create_autocomplete');
        } catch (autoErr) {
          await client.query('ROLLBACK TO SAVEPOINT vpo_create_autocomplete');
          console.warn('Purchase auto-completion warning on save:', autoErr);
        }
      }

      await client.query('COMMIT');
      // Linked units may have auto-completed Purchase steps; no single order, so views refetch.
      broadcastOrderUpdated(undefined, 'po', req.user);

      res.status(201).json({
        success: true,
        order: {
          ...newOrder,
          serials: serialList.map(serialNumber => ({ serialNumber }))
        }
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error saving vendor purchase order:', err);
      res.status(500).json({ error: 'Failed to save vendor purchase order' });
    } finally {
      client.release();
    }
  });

  // PATCH /api/purchase-orders/:id/status
  // Updates the receipt status of a specific vendor purchase order
  router.patch('/:id/status', authorize(['Admin', 'Manager', 'Purchase', 'Stores']), async (req, res) => {
    const { id } = req.params;
    const { status, dateReceived } = req.body;

    const validStatuses = ['Pending', 'Partial recieved', 'PO closed'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Fetch the order by integer id or order_uid
      const isNum = /^\d+$/.test(id);
      const findSql = isNum 
        ? 'SELECT * FROM vendor_purchase_orders WHERE id = $1 FOR UPDATE'
        : 'SELECT * FROM vendor_purchase_orders WHERE order_uid = $1 FOR UPDATE';
      const existingRes = await client.query(findSql, [id]);

      if (existingRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Purchase order not found' });
      }

      const order = existingRes.rows[0];
      const todayStr = new Date().toISOString().slice(0, 10);
      const effectiveDateReceived = status === 'Pending' ? null : (dateReceived || todayStr);

      // Update pos array to reflect the new status
      const updatedPos = (Array.isArray(order.pos) ? order.pos : []).map(p => ({
        ...p,
        status: status,
        dateReceived: effectiveDateReceived
      }));

      const updateSql = `
        UPDATE vendor_purchase_orders
        SET 
          status = $1,
          received_at = CASE WHEN $1 = 'Pending' THEN NULL ELSE COALESCE(received_at, NOW()) END,
          pos = $2
        WHERE id = $3
        RETURNING *
      `;
      const updateRes = await client.query(updateSql, [
        status,
        JSON.stringify(updatedPos),
        order.id
      ]);

      // Best-effort auto-completion for all units linked to this vendor PO, under a savepoint
      // so a failure cannot silently abort the transaction before COMMIT.
      await client.query('SAVEPOINT vpo_status_autocomplete');
      try {
        const linkedUnitsRes = await client.query(
          'SELECT unit_serial FROM vendor_purchase_order_units WHERE vendor_purchase_order_id = $1',
          [order.id]
        );
        const serialList = linkedUnitsRes.rows.map(r => r.unit_serial).filter(Boolean);
        if (serialList.length > 0) {
          await evaluatePurchaseAutoCompletion(serialList, client, deriveUnitStatus, { by: 'serial' });
        }
        await client.query('RELEASE SAVEPOINT vpo_status_autocomplete');
      } catch (autoErr) {
        await client.query('ROLLBACK TO SAVEPOINT vpo_status_autocomplete');
        console.warn('Purchase auto-completion warning on status update:', autoErr);
      }

      await client.query('COMMIT');
      broadcastOrderUpdated(undefined, 'po', req.user);

      res.json({
        success: true,
        order: updateRes.rows[0]
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error updating purchase order status:', err);
      res.status(500).json({ error: 'Failed to update purchase order status' });
    } finally {
      client.release();
    }
  });

  return router;
}
