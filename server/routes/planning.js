import express from 'express';
import { PIPELINE } from '../data/workflow.js';
import { isLineItemOnHold } from '../services/holds.js';
import { deriveUnitStatus, updateOrderQCStatusFromSteps, findBlockingUpstreamDepts } from '../services/unitStatus.js';

/**
 * Router for the Planning view (mounted at /api/planning): the line-item planning list and
 * planning-date / status updates per line item, per unit and in bulk, plus the batch
 * 'set every unit step of one department' action used by Production and QC.
 * Keep '/line-items/bulk' registered before '/line-items/:lineItemId'. Writes are refused while
 * the order is on hold; completing a department's steps returns 409 while upstream departments
 * are unfinished (except for Admin / Manager). PUT /api/orders/:id/planning stays with orders.
 */
export default function createPlanningRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT 
            oli.id as line_item_id,
            o.id as order_id,
            o.order_number,
            COALESCE((SELECT ou.po_number FROM order_units ou WHERE ou.line_item_id = oli.id AND ou.po_number IS NOT NULL LIMIT 1), o.po_number) AS po_number,
            COALESCE(oli.delivery_date, o.delivery_date) AS delivery_date,
            o.priority,
            o.notes,
            o.end_client_name,
            o.reference_number,
            oli.tag,
            oindentdoc.file_path AS indent_file_path,
            oindentdoc.file_name AS indent_file_name,
            o.hold_status,
            oli.planned_dispatch_date,
            oli.wiring_assigned_date,
            oli.wiring_expected_date,
            oli.expected_qc_date,
            oli.status,
            oli.qc_status,
            oli.qc_date,
            oli.mounting_start_date,
            oli.mounting_complete_date,
            oli.part_number,
            oli.line_item_number,
            oli.quantity,
            oli.custom_fields,
            (
                SELECT STRING_AGG(ou.unit_id, ', ' ORDER BY ou.id ASC)
                FROM order_units ou
                WHERE ou.line_item_id = oli.id
            ) as unit_numbers,
            (
                SELECT MIN(ou.unit_id) || CASE WHEN COUNT(ou.id) > 1 THEN ' – ' || MAX(ou.unit_id) ELSE '' END
                FROM order_units ou
                WHERE ou.line_item_id = oli.id
            ) as unit_range,
            (
                SELECT json_agg(json_build_object(
                  'id', ou.id, 
                  'unit_id', ou.unit_id, 
                  'short_serial', ou.short_serial, 
                  'current_dept', ou.current_dept, 
                  'status', COALESCE(ou.status, oli.status, 'Not Started'),
                  'hold_status', ou.hold_status,
                  'hold_step_name', ou.hold_step_name,
                  'hold_dept', ou.hold_dept,
                  'hold_reason', ou.hold_reason,
                  'held_by_name', ou.held_by_name,
                  'held_at', ou.held_at,
                  'cancelled_step_name', ou.cancelled_step_name,
                  'cancelled_dept', ou.cancelled_dept,
                  'cancelled_reason', ou.cancelled_reason,
                  'planned_dispatch_date', COALESCE(ou.planned_dispatch_date, oli.planned_dispatch_date),
                  'wiring_assigned_date', COALESCE(ou.wiring_assigned_date, oli.wiring_assigned_date),
                  'wiring_expected_date', COALESCE(ou.wiring_expected_date, oli.wiring_expected_date),
                  'expected_qc_date', COALESCE(ou.expected_qc_date, oli.expected_qc_date),
                  'qc_status', COALESCE(ou.qc_status, oli.qc_status, 'Pending'),
                  'qc_date', COALESCE(ou.qc_date, oli.qc_date),
                  'mounting_start_date', COALESCE(ou.mounting_start_date, oli.mounting_start_date),
                  'mounting_complete_date', COALESCE(ou.mounting_complete_date, oli.mounting_complete_date),
                  'custom_fields', COALESCE(ou.custom_fields, oli.custom_fields, '{}'::jsonb),
                  'tray_status', COALESCE(ou.tray_status, oli.tray_status, 'Not Started'),
                  'tray_start_date', COALESCE(ou.tray_start_date, oli.tray_start_date),
                  'issued_date', COALESCE(ou.issued_date, oli.issued_date)
                ) ORDER BY ou.id ASC)
                FROM order_units ou
                WHERE ou.line_item_id = oli.id
            ) as units,
            c.name as company_name,
            l.city as company_city,
            (
                SELECT COUNT(*) 
                FROM order_steps os 
                WHERE os.order_id = o.id
            ) + (
                SELECT COUNT(*) 
                FROM unit_steps us
                JOIN order_units ou ON us.order_unit_id = ou.id
                WHERE ou.line_item_id = oli.id
            ) as total_steps,
            (
                SELECT COUNT(*) 
                FROM order_steps os 
                WHERE os.order_id = o.id AND os.status = 'done'
            ) + (
                SELECT COUNT(*) 
                FROM unit_steps us
                JOIN order_units ou ON us.order_unit_id = ou.id
                WHERE ou.line_item_id = oli.id AND us.status = 'done'
            ) as done_steps,
            (
                SELECT ou.current_dept
                FROM order_units ou
                WHERE ou.line_item_id = oli.id AND ou.status NOT IN ('Dispatched')
                ORDER BY ou.id ASC
                LIMIT 1
            ) as active_dept
        FROM order_line_items oli
        JOIN orders o ON oli.order_id = o.id
        LEFT JOIN company_locations l ON o.company_location_id = l.id
        LEFT JOIN companies c ON l.company_id = c.id
        LEFT JOIN LATERAL (
          SELECT file_path, file_name 
          FROM documents 
          WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'Indent' 
          ORDER BY uploaded_at DESC 
          LIMIT 1
        ) oindentdoc ON true
        ORDER BY o.created_at DESC, oli.id ASC`
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Failed to fetch planning orders:', err);
      res.status(500).json({ error: 'Failed to fetch planning orders' });
    }
  });

  router.put('/line-items/bulk', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
    const { lineItemIds, fields } = req.body;
    if (!lineItemIds || !Array.isArray(lineItemIds) || lineItemIds.length === 0) {
      return res.status(400).json({ error: 'lineItemIds array required' });
    }

    // Check if any order is on hold
    for (const lineItemId of lineItemIds) {
      if (await isLineItemOnHold(lineItemId)) {
        return res.status(400).json({ error: 'One or more of the selected orders are currently on hold. Updates are disabled.' });
      }
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Sort lineItemIds deterministically by ID ascending to avoid deadlock
      const sortedLineItemIds = [...lineItemIds].map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
      for (const lineItemId of sortedLineItemIds) {
        const checkLi = await client.query('SELECT order_id FROM order_line_items WHERE id = $1', [lineItemId]);
        if (checkLi.rows.length === 0) continue;
        const order_id = checkLi.rows[0].order_id;

        // 1. Update order level fields (only if provided in req.body.fields)
        const orderUpdates = [];
        const orderParams = [];
        let oIdx = 1;

        if (fields.hasOwnProperty('end_client_name')) {
          orderUpdates.push(`end_client_name = $${oIdx++}`);
          orderParams.push(fields.end_client_name || null);
        }
        if (fields.hasOwnProperty('priority')) {
          orderUpdates.push(`priority = $${oIdx++}`);
          orderParams.push(fields.priority || 'Medium');
        }

        if (orderUpdates.length > 0) {
          orderParams.push(order_id);
          await client.query(
            `UPDATE orders SET ${orderUpdates.join(', ')} WHERE id = $${oIdx}`,
            orderParams
          );
        }

        // 2. Update line item level fields
        const liUpdates = [];
        const liParams = [];
        let lIdx = 1;

        if (fields.hasOwnProperty('planned_dispatch_date')) {
          liUpdates.push(`planned_dispatch_date = $${lIdx++}`);
          liParams.push(fields.planned_dispatch_date || null);
        }
        if (fields.hasOwnProperty('wiring_assigned_date')) {
          liUpdates.push(`wiring_assigned_date = $${lIdx++}`);
          liParams.push(fields.wiring_assigned_date || null);
        }
        if (fields.hasOwnProperty('wiring_expected_date')) {
          liUpdates.push(`wiring_expected_date = $${lIdx++}`);
          liParams.push(fields.wiring_expected_date || null);
        }
        if (fields.hasOwnProperty('expected_qc_date')) {
          liUpdates.push(`expected_qc_date = $${lIdx++}`);
          liParams.push(fields.expected_qc_date || null);
        }
        if (fields.hasOwnProperty('status')) {
          liUpdates.push(`status = $${lIdx++}`);
          liParams.push(fields.status || 'Not Started');
        }
        if (fields.hasOwnProperty('qc_status')) {
          liUpdates.push(`qc_status = $${lIdx++}`);
          liParams.push(fields.qc_status || 'Pending');
        }
        if (fields.hasOwnProperty('qc_date')) {
          liUpdates.push(`qc_date = $${lIdx++}`);
          liParams.push(fields.qc_date || null);
        }
        if (fields.hasOwnProperty('mounting_start_date')) {
          liUpdates.push(`mounting_start_date = $${lIdx++}`);
          liParams.push(fields.mounting_start_date || null);
        }
        if (fields.hasOwnProperty('mounting_complete_date')) {
          liUpdates.push(`mounting_complete_date = $${lIdx++}`);
          liParams.push(fields.mounting_complete_date || null);
        }
        if (fields.hasOwnProperty('custom_fields') && fields.custom_fields) {
          liUpdates.push(`custom_fields = COALESCE(custom_fields, '{}'::jsonb) || $${lIdx++}::jsonb`);
          liParams.push(JSON.stringify(fields.custom_fields));
        }

        if (liUpdates.length > 0) {
          liParams.push(lineItemId);
          await client.query(
            `UPDATE order_line_items SET ${liUpdates.join(', ')} WHERE id = $${lIdx}`,
            liParams
          );
        }

        if (fields.custom_fields) {
          await client.query(
            `UPDATE order_units 
             SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) || $1::jsonb 
             WHERE line_item_id = $2`,
            [JSON.stringify(fields.custom_fields), lineItemId]
          );
        }

        if (fields.hasOwnProperty('status') && fields.status) {
          await client.query(
            `UPDATE order_units SET status = $1 WHERE line_item_id = $2`,
            [fields.status, lineItemId]
          );

          if (fields.status === 'Completed') {
            await client.query(
              `UPDATE unit_steps 
               SET status = 'done', updated = $1 
               WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept = 'Planning'`,
              [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), lineItemId]
            );
            await client.query(
              `UPDATE unit_steps 
               SET status = 'done', updated = $1 
               WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept IN ('Sales', 'Design', 'Purchase', 'Stores') AND status = 'pending'`,
              [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), lineItemId]
            );
          } else if (fields.status === 'Not Started' || fields.status === 'Pending') {
            await client.query(
              `UPDATE unit_steps 
               SET status = 'pending', updated = $1 
               WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept = 'Planning' AND status = 'done'`,
              [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), lineItemId]
            );
          }

          const unitsRes = await client.query('SELECT id FROM order_units WHERE line_item_id = $1', [lineItemId]);
          for (const u of unitsRes.rows) {
            await deriveUnitStatus(u.id, client);
          }
        }

        await client.query(
          'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
          [req.user.id, req.user.role, 'Updated planning details (bulk) for line item', order_id]
        );
      }

      await client.query('COMMIT');
      res.json({ success: true, message: `Bulk updated ${lineItemIds.length} line items` });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to bulk update planning details:', err);
      res.status(500).json({ error: 'Failed to bulk update planning details' });
    } finally {
      client.release();
    }
  });

  router.put('/units/:unitId', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
    const { unitId } = req.params;
    const {
      end_client_name,
      planned_dispatch_date,
      wiring_assigned_date,
      wiring_expected_date,
      expected_qc_date,
      priority,
      status,
      qc_status,
      qc_date,
      mounting_start_date,
      mounting_complete_date,
      custom_fields
    } = req.body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const checkUnit = await client.query('SELECT id, order_id, line_item_id, unit_id FROM order_units WHERE id = $1', [unitId]);
      if (checkUnit.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Unit not found' });
      }
      const unit = checkUnit.rows[0];

      if (await isLineItemOnHold(unit.line_item_id)) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
      }

      // Update order level fields if provided
      if (end_client_name || priority) {
        await client.query(
          `UPDATE orders SET end_client_name = COALESCE($1, end_client_name), priority = COALESCE($2, priority) WHERE id = $3`,
          [end_client_name || null, priority, unit.order_id]
        );
      }

      // Update unit level planning fields directly
      const result = await client.query(
        `UPDATE order_units 
         SET planned_dispatch_date = $1, 
             wiring_assigned_date = $2, 
             wiring_expected_date = $3, 
             expected_qc_date = $4, 
             status = COALESCE($5, status), 
             qc_status = COALESCE($6, qc_status), 
             qc_date = $7,
             mounting_start_date = $8,
             mounting_complete_date = $9,
             custom_fields = CASE 
               WHEN $10::text IS NOT NULL THEN COALESCE(custom_fields, '{}'::jsonb) || $10::jsonb 
               ELSE custom_fields 
             END
         WHERE id = $11 
         RETURNING *`,
        [
          planned_dispatch_date || null,
          wiring_assigned_date || null,
          wiring_expected_date || null,
          expected_qc_date || null,
          status,
          qc_status,
          qc_date || null,
          mounting_start_date || null,
          mounting_complete_date || null,
          custom_fields ? JSON.stringify(custom_fields) : null,
          unitId
        ]
      );

      // If status was updated, propagate to unit_steps and derive new department
      if (status) {
        if (status === 'Completed') {
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', updated = $1 
             WHERE order_unit_id = $2 AND dept = 'Planning'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), unitId]
          );
          // Also ensure lingering pending upstream steps are marked done so unit is never blocked from Production
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', updated = $1 
             WHERE order_unit_id = $2 AND dept IN ('Sales', 'Design', 'Purchase', 'Stores') AND status = 'pending'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), unitId]
          );
          await deriveUnitStatus(unitId, client);
        } else if (status === 'Not Started' || status === 'Pending') {
          await client.query(
            `UPDATE unit_steps 
             SET status = 'pending', updated = $1 
             WHERE order_unit_id = $2 AND dept = 'Planning' AND status = 'done'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), unitId]
          );
          await deriveUnitStatus(unitId, client);
        }
      }

      await client.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, `Updated planning details for unit ${unit.unit_id}`, unit.order_id]
      );

      await client.query('COMMIT');
      const updatedUnitRes = await client.query('SELECT * FROM order_units WHERE id = $1', [unitId]);
      res.json(updatedUnitRes.rows[0] || result.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to update unit planning details:', err);
      res.status(500).json({ error: 'Failed to update unit planning details' });
    } finally {
      client.release();
    }
  });

  router.put('/line-items/:lineItemId', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
    if (await isLineItemOnHold(req.params.lineItemId)) {
      return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
    }
    const {
      end_client_name,
      planned_dispatch_date,
      wiring_assigned_date,
      wiring_expected_date,
      expected_qc_date,
      priority,
      status,
      qc_status,
      qc_date,
      mounting_start_date,
      mounting_complete_date,
      custom_fields
    } = req.body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const checkLi = await client.query('SELECT order_id FROM order_line_items WHERE id = $1', [req.params.lineItemId]);
      if (checkLi.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Line item not found' });
      }
      const order_id = checkLi.rows[0].order_id;

      // Update order level fields
      await client.query(
        `UPDATE orders SET end_client_name = COALESCE($1, end_client_name), priority = COALESCE($2, priority) WHERE id = $3`,
        [end_client_name || null, priority, order_id]
      );

      // Update line item level fields
      const result = await client.query(
        `UPDATE order_line_items 
         SET planned_dispatch_date = $1, 
             wiring_assigned_date = $2, 
             wiring_expected_date = $3, 
             expected_qc_date = $4, 
             status = COALESCE($5, status), 
             qc_status = COALESCE($6, qc_status), 
             qc_date = $7,
             mounting_start_date = $8,
             mounting_complete_date = $9,
             custom_fields = CASE 
               WHEN $10::text IS NOT NULL THEN COALESCE(custom_fields, '{}'::jsonb) || $10::jsonb 
               ELSE custom_fields 
             END
         WHERE id = $11 
         RETURNING *`,
        [
          planned_dispatch_date || null,
          wiring_assigned_date || null,
          wiring_expected_date || null,
          expected_qc_date || null,
          status,
          qc_status,
          qc_date || null,
          mounting_start_date || null,
          mounting_complete_date || null,
          custom_fields ? JSON.stringify(custom_fields) : null,
          req.params.lineItemId
        ]
      );

      if (custom_fields) {
        await client.query(
          `UPDATE order_units 
           SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) || $1::jsonb 
           WHERE line_item_id = $2`,
          [JSON.stringify(custom_fields), req.params.lineItemId]
        );
      }

      if (status) {
        await client.query(
          `UPDATE order_units SET status = $1 WHERE line_item_id = $2`,
          [status, req.params.lineItemId]
        );

        if (status === 'Completed') {
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', updated = $1 
             WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept = 'Planning'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), req.params.lineItemId]
          );
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', updated = $1 
             WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept IN ('Sales', 'Design', 'Purchase', 'Stores') AND status = 'pending'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), req.params.lineItemId]
          );
        } else if (status === 'Not Started' || status === 'Pending') {
          await client.query(
            `UPDATE unit_steps 
             SET status = 'pending', updated = $1 
             WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept = 'Planning' AND status = 'done'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), req.params.lineItemId]
          );
        }

        const unitsRes = await client.query('SELECT id FROM order_units WHERE line_item_id = $1', [req.params.lineItemId]);
        for (const u of unitsRes.rows) {
          await deriveUnitStatus(u.id, client);
        }
      }

      await client.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, `Updated planning details for line item`, order_id]
      );

      await client.query('COMMIT');
      res.json(result.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to update planning details:', err);
      res.status(500).json({ error: 'Failed to update planning details' });
    } finally {
      client.release();
    }
  });

  router.put('/line-items/:lineItemId/bulk-units-status', authorize(['Admin', 'Manager', 'Production']), async (req, res) => {
    if (await isLineItemOnHold(req.params.lineItemId)) {
      return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
    }
    const { dept, status } = req.body;
    if (!dept || !status) return res.status(400).json({ error: 'dept and status are required' });

    const VALID_STEP_STATUSES = ['pending', 'inprogress', 'done', 'blocked', 'review', 'hold', 'cancelled'];
    if (!VALID_STEP_STATUSES.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${VALID_STEP_STATUSES.join(', ')}.` });
    }
    if (!PIPELINE.includes(dept)) {
      return res.status(400).json({ error: 'Invalid department.' });
    }
    const isPrivileged = ['Admin', 'Manager'].includes(req.user.role);
    if (!isPrivileged && dept !== req.user.role) {
      return res.status(403).json({ error: `You can only bulk-update ${req.user.role} steps.` });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 0. Same upstream gate as single-step completion
      if (status === 'done' && !isPrivileged) {
        const liUnits = await client.query('SELECT id FROM order_units WHERE line_item_id = $1', [req.params.lineItemId]);
        const blocking = await findBlockingUpstreamDepts(client, liUnits.rows.map(r => Number(r.id)), dept);
        if (blocking.length > 0) {
          await client.query('ROLLBACK');
          return res.status(409).json({ error: `Cannot complete: upstream departments not finished yet — ${blocking.join(', ')}.` });
        }
      }

      // 1. Update all unit steps for this line item and department
      await client.query(
        `UPDATE unit_steps 
         SET status = $1, updated = $2
         WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $3) AND dept = $4`,
        [status, new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), req.params.lineItemId, dept]
      );

      // 2. Derive unit status for all units of this line item to propagate departments & statuses
      const unitsRes = await client.query(
        'SELECT id FROM order_units WHERE line_item_id = $1 ORDER BY id ASC',
        [req.params.lineItemId]
      );
      for (const unit of unitsRes.rows) {
        await deriveUnitStatus(unit.id, client);
      }

      // 3. Update QC calculations for this order if the updated steps were in QC
      const checkLi = await client.query('SELECT order_id FROM order_line_items WHERE id = $1', [req.params.lineItemId]);
      if (checkLi.rows.length > 0) {
        await updateOrderQCStatusFromSteps(checkLi.rows[0].order_id, client);
        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, checkLi.rows[0].order_id, dept, `Bulk updated all unit steps in ${dept} to ${status}`]
        );
      }

      await client.query('COMMIT');
      res.json({ message: `Successfully updated all ${dept} steps to ${status} for this batch.` });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Failed to bulk update unit steps' });
    } finally {
      client.release();
    }
  });

  return router;
}
