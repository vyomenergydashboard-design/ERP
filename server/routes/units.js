import express from 'express';
import fs from 'fs';
import { OPERATOR_ROLES } from '../data/workflow.js';
import { evaluatePurchaseAutoCompletion } from '../services/purchaseAutoCompletion.js';
import { evaluateStoresAutoCompletion } from '../services/storesAutoCompletion.js';
import { broadcastEvent } from '../services/eventStream.js';
import { safeEvaluateCondition } from '../services/safeConditionEvaluator.js';
import { publicErrorMessage } from '../services/httpErrors.js';
import { isUnitOnHold } from '../services/holds.js';
import { upload } from '../services/uploads.js';
import { tryInSavepoint, lockOrders } from '../services/transactions.js';
import { resolveCustomFieldValues, propagateCustomFieldsToDB } from '../services/customFields.js';
import {
  deriveUnitStatus, syncLineItemStatusFromUnits, evaluateUnitDesignDocuments,
  syncUnitDesignDocumentStatus, updateOrderQCStatusFromSteps, findBlockingUpstreamDepts, isAwaitingSales,
} from '../services/unitStatus.js';

/**
 * Router for panels / units (mounted at /api/units): unit steps (list and update), the unit edit
 * used by every department table, Admin/Manager status override, Design confirm / unconfirm,
 * batch PO upload, batch 'Purchase not applicable', PO-document delete, Sales clearance,
 * hold / resume / cancel, and a unit's reference documents.
 * Departments are never set directly: handlers update rows and call deriveUnitStatus, which
 * enforces the Sales -> Design, Drawing + BOM + confirmation and Stores-date gates (see AGENTS.md).
 * Completing a step while upstream departments are unfinished returns 409.
 */
export default function createUnitsRouter(pool, authorize) {
  const router = express.Router();

  router.get('/:unitId/steps', authorize(), async (req, res) => {
    try {
      try {
        await evaluatePurchaseAutoCompletion([req.params.unitId], pool, deriveUnitStatus);
      } catch (evalErr) {
        console.warn('evaluatePurchaseAutoCompletion warn in get unit steps:', evalErr);
      }

      const result = await pool.query(
        `SELECT s.*, tm.custom_fields as tm_custom_fields, tm.order_fields as tm_order_fields
         FROM unit_steps s
         LEFT JOIN task_masters tm ON s.task_id = tm.id
         WHERE s.order_unit_id = $1
         ORDER BY s.step_order ASC, s.id ASC`,
        [req.params.unitId]
      );

      // Check if any step has custom fields requiring datakey resolution
      let preloadedUnitRow = null;
      const hasAnyCustomFields = result.rows.some(s => s.custom_fields || s.tm_custom_fields);
      if (hasAnyCustomFields) {
        const uRes = await pool.query(
          `SELECT 
            o.order_number, o.po_number, o.delivery_date, o.order_date,
            o.notes as order_notes, o.priority, o.packaging_type,
            o.end_client_name, o.gst_number, o.reference_number, o.classification,
            o.hold_status, o.status as order_status, o.qc_status, o.qc_date,
            o.planned_dispatch_date, o.wiring_assigned_date, o.wiring_expected_date, o.expected_qc_date,
            c.name as company_name,
            cl.city as company_city, cl.person_in_charge, cl.contact_number, cl.email as company_email,
            li.material_description, li.part_number, COALESCE(u.panel_type_size, li.panel_type_size) as panel_type_size,
            li.delivery_date as line_item_delivery_date, li.quantity, li.unit,
            li.unit_price, li.total_price, li.notes as line_item_notes,
            u.unit_id as unit_serial, u.short_serial, u.current_dept, u.status as unit_status
          FROM order_units u
          JOIN orders o ON u.order_id = o.id
          LEFT JOIN company_locations cl ON o.company_location_id = cl.id
          LEFT JOIN companies c ON cl.company_id = c.id
          LEFT JOIN order_line_items li ON u.line_item_id = li.id
          WHERE u.id = $1`,
          [req.params.unitId]
        );
        if (uRes.rows.length > 0) preloadedUnitRow = uRes.rows[0];
      }

      const steps = [];
      for (const step of result.rows) {
        let cf = [];
        try { cf = Array.isArray(step.custom_fields) ? step.custom_fields : JSON.parse(step.custom_fields || '[]'); } catch { cf = []; }

        if (cf.length === 0 && step.tm_custom_fields) {
          try {
            const tmCf = Array.isArray(step.tm_custom_fields) ? step.tm_custom_fields : JSON.parse(step.tm_custom_fields);
            cf = tmCf.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
          } catch { cf = []; }
        }

        // Resolve datakeys dynamically with preloadedUnitRow
        if (cf.length > 0) {
          cf = await resolveCustomFieldValues(cf, null, req.params.unitId, preloadedUnitRow);
        }

        let autoDone = false;
        if (step.status !== 'done') {
          const hasResolvedVal = cf.some(f => {
            if (!f.datakey) return false;
            const val = f.value;
            const isValPresent = val !== null && val !== undefined && val !== '' && val !== false;
            if (!isValPresent) return false;

            // Auto-complete ONLY IF explicitly marked for auto-complete OR has an IF statement (condition)
            if (f.auto_complete === true || f.auto_complete === 'true' || step.auto_complete === true) {
              return true;
            }

            if (f.condition && String(f.condition).trim() !== '') {
              try {
                return safeEvaluateCondition(f.condition, val);
              } catch (err) {
                console.error('Failed evaluating condition:', f.condition, err);
                return false;
              }
            }
            return false;
          });

          if (hasResolvedVal) {
            autoDone = true;
          }
        }

        const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        if (autoDone) {
          const deliveryField = cf.find(f => f.datakey && f.datakey.includes('delivery_date'));
          let dispatchDateVal = step.dispatch_date;
          if (deliveryField && deliveryField.value) {
            dispatchDateVal = deliveryField.value;
          }

          await pool.query(
            `UPDATE unit_steps SET status = 'done', custom_fields = $1, dispatch_date = COALESCE($2, dispatch_date), updated = $3 WHERE id = $4`,
            [JSON.stringify(cf), dispatchDateVal || null, updatedStr, step.id]
          );
          step.status = 'done';
          step.dispatch_date = dispatchDateVal;
          step.updated = updatedStr;

          // Recalculate derived status and QC status
          await deriveUnitStatus(req.params.unitId, pool);
          const unitRes = await pool.query('SELECT order_id FROM order_units WHERE id = $1', [req.params.unitId]);
          if (unitRes.rows.length > 0) {
            await updateOrderQCStatusFromSteps(unitRes.rows[0].order_id, pool);
          }
        }

        let orderFields = [];
        try { orderFields = Array.isArray(step.tm_order_fields) ? step.tm_order_fields : JSON.parse(step.tm_order_fields || '[]'); } catch { orderFields = []; }

        const { tm_custom_fields, tm_order_fields, ...rest } = step;
        steps.push({ ...rest, custom_fields: cf, order_fields: orderFields });
      }

      res.json(steps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch unit steps' });
    }
  });

  router.put('/:unitId/steps/:stepId', authorize(), async (req, res) => {
    const {
      action,
      status,
      notes,
      dispatchDate,
      custom_fields,
      assigned_user_id,
      holdReason,
      scope = 'unit',
      targetUnitIds,
      resumeTarget,
      last_updated_at,
      force = false
    } = req.body;

    const isSpecialAction = ['hold', 'resume', 'cancel'].includes(action);
    if (!isSpecialAction && (await isUnitOnHold(req.params.unitId))) {
      return res.status(400).json({ error: 'This unit is currently on hold. Resume the panel to make updates.' });
    }

    const updated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Fetch step details to verify permissions & OCC timestamp
      const stepRes = await client.query(
        `SELECT s.id, s.name, s.dept, s.status, s.notes, s.updated, s.updated_at, s.assigned_user_id, ou.order_id, ou.short_serial, ou.unit_id 
         FROM unit_steps s 
         JOIN order_units ou ON s.order_unit_id = ou.id 
         WHERE s.id = $1 AND s.order_unit_id = $2`,
        [req.params.stepId, req.params.unitId]
      );
      if (stepRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Unit step not found' });
      }
      const step = stepRes.rows[0];

      const canEdit = ['Admin', 'Manager'].includes(req.user.role) || step.dept === req.user.role || step.assigned_user_id === req.user.id;
      if (!canEdit) {
        await client.query('ROLLBACK');
        return res.status(403).json({ error: 'Forbidden: You are not authorized to update this task.' });
      }

      // Optimistic Concurrency Control (OCC): Check if another operator modified this step
      if (last_updated_at && !force && step.updated_at) {
        const clientTime = new Date(last_updated_at).getTime();
        const dbTime = new Date(step.updated_at).getTime();
        if (!isNaN(clientTime) && !isNaN(dbTime) && (dbTime - clientTime > 500)) {
          await client.query('ROLLBACK');
          return res.status(409).json({
            error: 'Conflict',
            message: `This task was updated at ${step.updated || 'recently'} by another user. Refresh to view the latest status.`,
            current: {
              status: step.status,
              notes: step.notes,
              updated: step.updated,
              updated_at: step.updated_at
            }
          });
        }
      }

      // Determine target units
      let targetUnits = [];
      if (scope === 'order') {
        const orderUnitsRes = await client.query('SELECT id, short_serial FROM order_units WHERE order_id = $1 ORDER BY id ASC', [step.order_id]);
        targetUnits = orderUnitsRes.rows;
      } else if (scope === 'selected' && Array.isArray(targetUnitIds) && targetUnitIds.length > 0) {
        const selectedIds = targetUnitIds.map(v => Number(v)).filter(v => Number.isInteger(v) && v > 0);
        // Only units belonging to the same order as the step being edited may be targeted
        const selectedRes = await client.query(
          'SELECT id, short_serial FROM order_units WHERE id = ANY($1::int[]) AND order_id = $2 ORDER BY id ASC',
          [selectedIds, step.order_id]
        );
        targetUnits = selectedRes.rows;
        if (targetUnits.length === 0) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'None of the selected units belong to this order.' });
        }
      } else {
        targetUnits = [{ id: parseInt(req.params.unitId), short_serial: step.short_serial }];
      }
      // Guaranteed deterministic ascending order to prevent deadlocks under concurrent operations
      targetUnits.sort((a, b) => Number(a.id) - Number(b.id));

      let lastResult = null;
      const userName = req.user.name || req.user.username || 'User';

      if (action === 'hold') {
        const reason = (holdReason || notes || 'On hold').trim();
        for (const tu of targetUnits) {
          const matchingStep = await client.query(
            'SELECT id FROM unit_steps WHERE order_unit_id = $1 AND name = $2 AND dept = $3 LIMIT 1',
            [tu.id, step.name, step.dept]
          );
          const sId = matchingStep.rows.length > 0 ? matchingStep.rows[0].id : null;
          if (sId) {
            const upd = await client.query(
              `UPDATE unit_steps 
               SET status = 'hold', hold_reason = $1, held_by = $2, hold_at = NOW(), updated = $3, updated_at = NOW() 
               WHERE id = $4 RETURNING *`,
              [reason, userName, updated, sId]
            );
            if (tu.id === parseInt(req.params.unitId)) lastResult = upd.rows[0];
          }

          await client.query(
            `UPDATE order_units 
             SET hold_status = 'Hold', hold_step_id = $1, hold_step_name = $2, hold_dept = $3, 
                 hold_reason = $4, held_by_name = $5, held_at = NOW(), status = $6, updated_at = NOW() 
             WHERE id = $7`,
            [sId, step.name, step.dept, reason, userName, `Hold @ ${step.name}`, tu.id]
          );

          await client.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
            [req.user.id, step.order_id, step.dept, `Unit ${tu.short_serial}: Put on HOLD @ ${step.name} (${step.dept}) — Reason: ${reason}`]
          );

          await deriveUnitStatus(tu.id, client);
        }
      } else if (action === 'resume') {
        for (const tu of targetUnits) {
          const matchingStep = await client.query(
            'SELECT id FROM unit_steps WHERE order_unit_id = $1 AND name = $2 AND dept = $3 LIMIT 1',
            [tu.id, step.name, step.dept]
          );
          const sId = matchingStep.rows.length > 0 ? matchingStep.rows[0].id : null;
          if (sId) {
            const upd = await client.query(
              `UPDATE unit_steps 
               SET status = 'inprogress', hold_reason = NULL, held_by = NULL, hold_at = NULL, updated = $1, updated_at = NOW() 
               WHERE id = $2 RETURNING *`,
              [updated, sId]
            );
            if (tu.id === parseInt(req.params.unitId)) lastResult = upd.rows[0];
          }

          await client.query(
            `UPDATE order_units 
             SET hold_status = 'None', 
                 hold_step_id = NULL, hold_step_name = NULL, hold_dept = NULL, 
                 hold_reason = NULL, held_by_name = NULL, held_at = NULL,
                 cancelled_step_id = NULL, cancelled_step_name = NULL, cancelled_dept = NULL,
                 cancelled_reason = NULL, cancelled_by_name = NULL, cancelled_at = NULL,
                 updated_at = NOW()
             WHERE id = $1`,
            [tu.id]
          );

          await client.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
            [req.user.id, step.order_id, step.dept, `Unit ${tu.short_serial}: RESUMED @ ${step.name} (${step.dept})`]
          );

          await deriveUnitStatus(tu.id, client);
        }
      } else if (action === 'cancel') {
        const reason = (holdReason || notes || 'Cancelled').trim();
        for (const tu of targetUnits) {
          const matchingStep = await client.query(
            'SELECT id FROM unit_steps WHERE order_unit_id = $1 AND name = $2 AND dept = $3 LIMIT 1',
            [tu.id, step.name, step.dept]
          );
          const sId = matchingStep.rows.length > 0 ? matchingStep.rows[0].id : null;
          if (sId) {
            const upd = await client.query(
              `UPDATE unit_steps 
               SET status = 'cancelled', hold_reason = $1, held_by = $2, hold_at = NOW(), updated = $3, updated_at = NOW() 
               WHERE id = $4 RETURNING *`,
              [reason, userName, updated, sId]
            );
            if (tu.id === parseInt(req.params.unitId)) lastResult = upd.rows[0];
          }

          await client.query(
            `UPDATE order_units 
             SET hold_status = 'Cancelled', cancelled_step_id = $1, cancelled_step_name = $2, cancelled_dept = $3, 
                 cancelled_reason = $4, cancelled_by_name = $5, cancelled_at = NOW(), status = 'Cancelled', updated_at = NOW() 
             WHERE id = $6`,
            [sId, step.name, step.dept, reason, userName, tu.id]
          );

          await client.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
            [req.user.id, step.order_id, step.dept, `Unit ${tu.short_serial}: CANCELLED @ ${step.name} (${step.dept}) — Reason: ${reason}`]
          );

          await deriveUnitStatus(tu.id, client);
        }
      } else {
        // Regular step update (done, inprogress, blocked, etc.)
        const newStatus = status || 'pending';

        // Upstream validation: block marking 'done' if upstream depts are incomplete
        if (newStatus === 'done' && !['Admin', 'Manager'].includes(req.user.role)) {
          const blocking = await findBlockingUpstreamDepts(client, targetUnits.map(tu => Number(tu.id)), step.dept);
          if (blocking.length > 0) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: `Cannot complete: upstream departments not finished yet — ${blocking.join(', ')}.` });
          }
        }

        // Mandatory Design gate: Release Documents cannot be completed without Drawing AND BOM AND Design confirmation
        if (newStatus === 'done' && step.dept === 'Design' && (step.name === 'Release Documents' || step.name.toLowerCase().includes('release'))) {
          for (const tu of targetUnits) {
            const docInfo = await evaluateUnitDesignDocuments(client, tu.id);
            if (!docInfo.hasDrawing || !docInfo.hasBom || !docInfo.designConfirmed) {
              await client.query('ROLLBACK');
              return res.status(400).json({
                error: !docInfo.hasDrawing || !docInfo.hasBom
                  ? 'Cannot complete task: Both Drawing and BOM must be uploaded before this panel can leave Design.'
                  : 'Cannot complete task: Design must be confirmed before this panel can leave Design.'
              });
            }
          }
        }

        // Mandatory Tray Start Date + Issued Date gate: Cannot complete Stores tasks if dates are missing
        if (newStatus === 'done' && step.dept === 'Stores') {
          for (const tu of targetUnits) {
            const uDateRes = await client.query('SELECT tray_start_date, issued_date FROM order_units WHERE id = $1', [tu.id]);
            const uDates = uDateRes.rows[0];
            if (!uDates?.tray_start_date || !uDates?.issued_date) {
              await client.query('ROLLBACK');
              return res.status(400).json({
                error: 'Cannot complete task: Both Tray Start Date and Issued Date (Partial Issued or All Issued) must be set for this panel.'
              });
            }
          }
        }

        for (const tu of targetUnits) {
          const matchingStep = await client.query(
            'SELECT id FROM unit_steps WHERE order_unit_id = $1 AND name = $2 AND dept = $3 LIMIT 1',
            [tu.id, step.name, step.dept]
          );
          const sId = matchingStep.rows.length > 0 ? matchingStep.rows[0].id : null;
          if (!sId) continue;

          if (custom_fields) {
            await propagateCustomFieldsToDB(custom_fields, null, tu.id, client);
          }

          let cfJson = custom_fields ? JSON.stringify(custom_fields) : null;

          const upd = await client.query(
            `UPDATE unit_steps 
             SET status = $1, notes = $2, dispatch_date = $3, updated = $4, custom_fields = COALESCE($5, custom_fields), assigned_user_id = COALESCE($6, assigned_user_id), updated_at = NOW() 
             WHERE id = $7 AND order_unit_id = $8 
             RETURNING *`,
            [newStatus, notes, dispatchDate || null, updated, cfJson, assigned_user_id || null, sId, tu.id]
          );

          if (tu.id === parseInt(req.params.unitId)) {
            lastResult = upd.rows[0];
          }

          await client.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
            [req.user.id, step.order_id, step.dept, `Unit ${tu.short_serial}: Updated step "${step.name}" (Status: ${newStatus})`]
          );

          // Synchronize Design Confirmation & Release Documents when Step 1 (Review & Classify) is updated
          if (step.dept === 'Design' && (step.name === 'Review & Classify' || step.name.toLowerCase().includes('classify'))) {
            let resolvedClassification = null;
            if (Array.isArray(custom_fields)) {
              const classField = custom_fields.find(f => f.datakey === 'classification' || f.id === 'classification' || f.label?.toLowerCase() === 'classification');
              if (classField && classField.value) {
                resolvedClassification = String(classField.value).trim();
              }
            }
            if (resolvedClassification) {
              await client.query('UPDATE order_units SET classification = $1 WHERE id = $2', [resolvedClassification, tu.id]);
            }

            if (newStatus === 'done') {
              await client.query(
                `UPDATE order_units 
                 SET design_confirmed = true, design_confirmed_at = NOW(), design_confirmed_by = $1 
                 WHERE id = $2`,
                [req.user.id, tu.id]
              );
              await syncUnitDesignDocumentStatus(client, tu.id, req.user.id);
            } else {
              await client.query(
                `UPDATE order_units 
                 SET design_confirmed = false, design_confirmed_at = NULL, design_confirmed_by = NULL 
                 WHERE id = $1`,
                [tu.id]
              );
              await syncUnitDesignDocumentStatus(client, tu.id, req.user.id);
            }
          }

          if (step.dept === 'QC' && newStatus === 'blocked') {
            const { qcFailTarget } = req.body;
            const target = qcFailTarget === 'design' ? 'Design' : 'Production';
            const remark = target === 'Design' ? 'Returned from QC — design re-check needed' : 'Returned from QC — rework required';

            await client.query(
              `UPDATE unit_steps 
               SET status = 'inprogress', notes = $1, updated = $2 
               WHERE order_unit_id = $3 AND dept = $4`,
              [remark, updated, tu.id, target]
            );

            await client.query(
              `INSERT INTO activity_logs (user_id, order_id, dept, action_text) 
               VALUES ($1, $2, 'QC', $3)`,
              [req.user.id, step.order_id, `QC FAIL → returned to ${target} for ${target === 'Design' ? 're-check' : 'rework'}`]
            );
          }

          await deriveUnitStatus(tu.id, client);
        }

        await updateOrderQCStatusFromSteps(step.order_id, client);
      }

      await client.query('COMMIT');

      broadcastEvent({
        type: 'ORDER_UPDATED',
        entity: 'step',
        unitId: parseInt(req.params.unitId),
        orderId: step.order_id,
        dept: step.dept,
        status: req.body.status || req.body.action,
        updatedBy: userName,
        timestamp: Date.now()
      });

      res.json(lastResult || { success: true });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Failed to update unit step' });
    } finally {
      client.release();
    }
  });


  router.put('/:id/status', authorize(['Admin', 'Manager']), async (req, res) => {
    if (await isUnitOnHold(req.params.id)) {
      return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
    }
    const status = typeof req.body.status === 'string' ? req.body.status.trim() : '';
    if (!status) {
      return res.status(400).json({ error: 'status must be a non-empty string' });
    }
    try {
      const result = await pool.query(
        'UPDATE order_units SET status = $1 WHERE id = $2 RETURNING *',
        [status, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Unit not found' });

      const lineItemId = result.rows[0].line_item_id;
      if (lineItemId) {
        await syncLineItemStatusFromUnits(lineItemId, pool);
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update unit status' });
    }
  });

  router.put('/:id', authorize(OPERATOR_ROLES), async (req, res) => {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Valid unit ID is required' });
    }
    if (await isUnitOnHold(id) && req.body.po_number === undefined && req.body.reference_number === undefined && req.body.tag === undefined) {
      return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
    }
    const { 
      panel_type_size, classification, custom_fields, po_number, tag, reference_number, 
      tray_status, tray_start_date, issued_date,
      wiremen, mounting_start_date, mounting_complete_date, wiring_start_date, wiring_complete_date, pending_material_complete_date, handover_to_qc_date,
      qc_receiving_date, qc_start_date, qc_complete_date, qc_status,
      dispatch_date, invoice_number, invoice_date
    } = req.body;

    // All writes below are one transaction: a validation error part-way through
    // (the early `return res.status(400)` paths) rolls back earlier writes.
    let client = null;
    let committed = false;
    try {
      client = await pool.connect();
      await client.query('BEGIN');

      const numId = !isNaN(Number(id)) ? Number(id) : -1;
      const checkUnit = await client.query(
        'SELECT id, order_id, line_item_id, unit_id, tray_status, tray_start_date, issued_date, dispatch_date, invoice_number, qc_receiving_date, qc_start_date FROM order_units WHERE id = $1 OR unit_id = $2',
        [numId, String(id)]
      );
      if (checkUnit.rows.length === 0) {
        return res.status(404).json({ error: 'Unit not found' });
      }
      const unit = checkUnit.rows[0];
      const realId = unit.id;
      await lockOrders(client, [unit.order_id]);

      const updates = [];
      const values = [];
      let idx = 1;

      // Admin/Manager update of Customer Reference Number on parent order (without touching serial numbers)
      if (reference_number !== undefined) {
        const cleanRef = (reference_number && typeof reference_number === 'string' && reference_number.trim()) ? reference_number.trim() : null;
        await client.query('UPDATE orders SET reference_number = $1 WHERE id = $2', [cleanRef, unit.order_id]);
      }

      if (panel_type_size !== undefined) {
        updates.push(`panel_type_size = $${idx++}`);
        values.push(panel_type_size || null);

        // Also keep line item in sync if unit is linked to a line item
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET panel_type_size = $1 WHERE id = $2', [panel_type_size || null, unit.line_item_id]);
        }
      }

      if (classification !== undefined) {
        updates.push(`classification = $${idx++}`);
        values.push(classification || 'Standard');
        updates.push('design_confirmed = false', 'design_confirmed_at = NULL', 'design_confirmed_by = NULL');
      }

      if (po_number !== undefined) {
        const cleanPo = (po_number && typeof po_number === 'string' && po_number.trim()) ? po_number.trim() : null;
        updates.push(`po_number = $${idx++}`);
        values.push(cleanPo);
        if (!cleanPo) {
          updates.push(`po_doc_id = $${idx++}`);
          values.push(null);
        } else {
          updates.push('po_override_unlinked = false');
        }
      }

      // Admin/Manager update of Tag Number on unit and parent line item (without touching serial numbers)
      if (tag !== undefined) {
        const cleanTag = (tag && typeof tag === 'string' && tag.trim()) ? tag.trim() : null;
        updates.push(`tag = $${idx++}`);
        values.push(cleanTag);

        // Keep line item in sync if unit is linked to a line item
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET tag = $1 WHERE id = $2', [cleanTag, unit.line_item_id]);
        }
      }

      if (tray_status !== undefined) {
        const newTrayStatus = tray_status || 'Not Started';
        const oldStatus = unit.tray_status || 'Not Started';
        const startedStatuses = ['In Process', 'Partial Ready', 'Full Ready'];
        const issuedStatuses = ['Partial Issued', 'All Issued'];
        const hasStartDate = !!(unit.tray_start_date || (tray_start_date !== undefined && tray_start_date));
        const wasStarted = ['In Process', 'Partial Ready', 'Full Ready', 'Partial Issued', 'All Issued'].includes(oldStatus);

        // Constraint: Cannot issue tray unless it was started first
        if (issuedStatuses.includes(newTrayStatus)) {
          if (!hasStartDate && !wasStarted) {
            return res.status(400).json({ error: 'Tray must be started (In Process / Ready) before an issue date can be assigned.' });
          }
        }

        updates.push(`tray_status = $${idx++}`);
        values.push(newTrayStatus);

        // Start date recorded on 1st time departure from Not Started
        if ((oldStatus === 'Not Started' || !unit.tray_start_date) && startedStatuses.includes(newTrayStatus)) {
          if (tray_start_date === undefined) {
            updates.push(`tray_start_date = CURRENT_DATE`);
          }
        }

        // Issued date recorded when status becomes Partial Issued or All Issued;
        // if status changes away from issued, reset issued_date to NULL
        if (issuedStatuses.includes(newTrayStatus)) {
          if (issued_date === undefined) {
            updates.push(`issued_date = CURRENT_DATE`);
            if (custom_fields === undefined) {
              updates.push(`custom_fields = jsonb_set(COALESCE(custom_fields, '{}'::jsonb), '{issued_date}', to_jsonb(CURRENT_DATE::text))`);
            }
          }
        } else {
          if (issued_date === undefined) {
            updates.push(`issued_date = NULL`);
            if (custom_fields === undefined) {
              updates.push(`custom_fields = CASE WHEN custom_fields ? 'issued_date' THEN custom_fields - 'issued_date' ELSE custom_fields END`);
            }
          }
        }
      }

      const normalizeDateStr = (val) => {
        if (!val) return '';
        if (val instanceof Date) {
          const y = val.getFullYear();
          const m = String(val.getMonth() + 1).padStart(2, '0');
          const d = String(val.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
        }
        const str = String(val).trim();
        if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
          return str.substring(0, 10);
        }
        const parsed = new Date(val);
        if (!isNaN(parsed.getTime())) {
          const y = parsed.getFullYear();
          const m = String(parsed.getMonth() + 1).padStart(2, '0');
          const d = String(parsed.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}`;
        }
        return str;
      };

      if (issued_date !== undefined && issued_date !== null && issued_date !== '') {
        const effectiveStartDate = tray_start_date !== undefined ? tray_start_date : unit.tray_start_date;
        if (!effectiveStartDate) {
          return res.status(400).json({ error: 'Tray Start Date must be set before an Issued Date can be set.' });
        }
        const sDateStr = normalizeDateStr(effectiveStartDate);
        const iDateStr = normalizeDateStr(issued_date);
        if (iDateStr < sDateStr) {
          return res.status(400).json({ error: `Issued Date (${iDateStr}) cannot be earlier than Tray Start Date (${sDateStr}).` });
        }
      }

      if (tray_start_date !== undefined && tray_start_date !== null && tray_start_date !== '') {
        const effectiveIssuedDate = issued_date !== undefined ? issued_date : unit.issued_date;
        if (effectiveIssuedDate) {
          const sDateStr = normalizeDateStr(tray_start_date);
          const iDateStr = normalizeDateStr(effectiveIssuedDate);
          if (sDateStr > iDateStr) {
            return res.status(400).json({ error: `Tray Start Date (${sDateStr}) cannot be after Issued Date (${iDateStr}).` });
          }
        }
      }

      if (tray_start_date !== undefined) {
        updates.push(`tray_start_date = $${idx++}`);
        values.push(tray_start_date || null);
      }

      if (issued_date !== undefined) {
        updates.push(`issued_date = $${idx++}`);
        values.push(issued_date || null);
      }

      if (wiremen !== undefined) {
        let cleanWiremen = null;
        if (Array.isArray(wiremen)) {
          const cleaned = wiremen
            .map(w => (typeof w === 'string' ? w.trim() : (w?.name ? String(w.name).trim() : '')))
            .filter(Boolean);
          const unique = Array.from(new Set(cleaned));
          cleanWiremen = unique.length > 0 ? unique.join(', ') : null;
        } else if (typeof wiremen === 'string') {
          const parts = wiremen.split(',').map(s => s.trim()).filter(Boolean);
          const unique = Array.from(new Set(parts));
          cleanWiremen = unique.length > 0 ? unique.join(', ') : null;
        }
        updates.push(`wiremen = $${idx++}`);
        values.push(cleanWiremen);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET wiremen = $1 WHERE id = $2', [cleanWiremen, unit.line_item_id]);
        }
      }

      if (mounting_start_date !== undefined) {
        updates.push(`mounting_start_date = $${idx++}`);
        values.push(mounting_start_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET mounting_start_date = $1 WHERE id = $2', [mounting_start_date || null, unit.line_item_id]);
        }
      }

      if (mounting_complete_date !== undefined) {
        updates.push(`mounting_complete_date = $${idx++}`);
        values.push(mounting_complete_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET mounting_complete_date = $1 WHERE id = $2', [mounting_complete_date || null, unit.line_item_id]);
        }
      }

      if (wiring_start_date !== undefined) {
        updates.push(`wiring_start_date = $${idx++}`);
        values.push(wiring_start_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET wiring_start_date = $1 WHERE id = $2', [wiring_start_date || null, unit.line_item_id]);
        }
      }

      if (wiring_complete_date !== undefined) {
        updates.push(`wiring_complete_date = $${idx++}`);
        values.push(wiring_complete_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET wiring_complete_date = $1 WHERE id = $2', [wiring_complete_date || null, unit.line_item_id]);
        }
      }

      if (pending_material_complete_date !== undefined) {
        updates.push(`pending_material_complete_date = $${idx++}`);
        values.push(pending_material_complete_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET pending_material_complete_date = $1 WHERE id = $2', [pending_material_complete_date || null, unit.line_item_id]);
        }
      }

      if (handover_to_qc_date !== undefined) {
        updates.push(`handover_to_qc_date = $${idx++}`);
        values.push(handover_to_qc_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET handover_to_qc_date = $1 WHERE id = $2', [handover_to_qc_date || null, unit.line_item_id]);
        }
        if (handover_to_qc_date) {
          const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', notes = 'Handover to QC completed', updated = $1 
             WHERE order_unit_id = $2 AND dept = 'Production' AND status != 'done'`,
            [updatedStr, realId]
          );
        } else if (handover_to_qc_date === null || handover_to_qc_date === '') {
          const qcStarted = await client.query(
            `SELECT 1 FROM unit_steps WHERE order_unit_id = $1 AND dept = 'QC' AND status != 'pending' LIMIT 1`,
            [realId]
          );
          if (qcStarted.rows.length === 0 && !checkUnit.rows[0]?.qc_receiving_date && !checkUnit.rows[0]?.qc_start_date) {
            await client.query(
              `UPDATE unit_steps 
               SET status = 'pending', notes = NULL 
               WHERE order_unit_id = $1 AND dept = 'Production' AND notes = 'Handover to QC completed'`,
              [realId]
            );
          }
        }
      }

      if (qc_receiving_date !== undefined) {
        updates.push(`qc_receiving_date = $${idx++}`);
        values.push(qc_receiving_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET qc_receiving_date = $1 WHERE id = $2', [qc_receiving_date || null, unit.line_item_id]);
        }
      }

      if (qc_start_date !== undefined) {
        updates.push(`qc_start_date = $${idx++}`);
        values.push(qc_start_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET qc_start_date = $1 WHERE id = $2', [qc_start_date || null, unit.line_item_id]);
        }
      }

      if (qc_complete_date !== undefined) {
        updates.push(`qc_complete_date = $${idx++}`);
        values.push(qc_complete_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET qc_complete_date = $1 WHERE id = $2', [qc_complete_date || null, unit.line_item_id]);
        }
      }

      if (qc_status !== undefined) {
        updates.push(`qc_status = $${idx++}`);
        values.push(qc_status || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET qc_status = $1 WHERE id = $2', [qc_status || null, unit.line_item_id]);
        }
        const normQcStatus = String(qc_status || '').trim().toLowerCase();
        if (normQcStatus === 'handover to packing') {
          const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', notes = 'Handover to packing completed', updated = $1 
             WHERE order_unit_id = $2 AND dept = 'QC' AND status != 'done'`,
            [updatedStr, realId]
          );
          if (unit.order_id) {
            await updateOrderQCStatusFromSteps(unit.order_id, client);
          }
        } else {
          const dispatchStarted = await client.query(
            `SELECT 1 FROM unit_steps WHERE order_unit_id = $1 AND dept IN ('Dispatch', 'Accounts') AND status != 'pending' LIMIT 1`,
            [realId]
          );
          if (dispatchStarted.rows.length === 0 && !unit.dispatch_date && !unit.invoice_number) {
            await client.query(
              `UPDATE unit_steps 
               SET status = 'pending', notes = NULL 
               WHERE order_unit_id = $1 AND dept = 'QC' AND notes = 'Handover to packing completed'`,
              [realId]
            );
            if (unit.order_id) {
              await updateOrderQCStatusFromSteps(unit.order_id, client);
            }
          }
        }
      }

      if (dispatch_date !== undefined) {
        updates.push(`dispatch_date = $${idx++}`);
        values.push(dispatch_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET dispatch_date = $1 WHERE id = $2', [dispatch_date || null, unit.line_item_id]);
        }
        if (dispatch_date) {
          const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', notes = 'Dispatch completed', updated = $1 
             WHERE order_unit_id = $2 AND dept = 'Dispatch' AND status != 'done'`,
            [updatedStr, realId]
          );
        }
      }

      if (invoice_number !== undefined) {
        updates.push(`invoice_number = $${idx++}`);
        values.push(invoice_number ? String(invoice_number).trim() : null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET invoice_number = $1 WHERE id = $2', [invoice_number ? String(invoice_number).trim() : null, unit.line_item_id]);
        }
        if (invoice_number && String(invoice_number).trim()) {
          const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', notes = $1, updated = $2 
             WHERE order_unit_id = $3 AND dept = 'Accounts' AND status != 'done'`,
            [`Invoice: ${String(invoice_number).trim()}`, updatedStr, realId]
          );
        }
      }

      if (invoice_date !== undefined) {
        updates.push(`invoice_date = $${idx++}`);
        values.push(invoice_date || null);
        if (unit.line_item_id) {
          await client.query('UPDATE order_line_items SET invoice_date = $1 WHERE id = $2', [invoice_date || null, unit.line_item_id]);
        }
      }

      if (custom_fields !== undefined) {
        let cfObj = custom_fields;
        if (typeof cfObj === 'string') {
          try { cfObj = JSON.parse(cfObj); } catch (_) { cfObj = {}; }
        }
        let shouldDeleteIssuedDate = false;
        if (cfObj && typeof cfObj === 'object') {
          if (tray_status !== undefined && !['Partial Issued', 'All Issued'].includes(tray_status)) {
            delete cfObj.issued_date;
            shouldDeleteIssuedDate = true;
          } else if (issued_date !== undefined && !issued_date) {
            delete cfObj.issued_date;
            shouldDeleteIssuedDate = true;
          }
        }
        // Non-destructive JSONB merge: preserves existing custom fields while updating supplied keys
        if (shouldDeleteIssuedDate) {
          updates.push(`custom_fields = (COALESCE(custom_fields, '{}'::jsonb) || $${idx++}::jsonb) - 'issued_date'`);
        } else {
          updates.push(`custom_fields = (COALESCE(custom_fields, '{}'::jsonb) || $${idx++}::jsonb)`);
        }
        values.push(JSON.stringify(cfObj || {}));
      }

      if (updates.length === 0 && reference_number === undefined) {
        return res.json({ success: true, message: 'No changes provided' });
      }

      let updatedUnit;
      if (updates.length > 0) {
        updates.push('updated_at = NOW()');
        values.push(realId);
        const result = await client.query(
          `UPDATE order_units SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
          values
        );
        updatedUnit = result.rows[0];
      } else {
        const refreshedUnit = await client.query('SELECT * FROM order_units WHERE id = $1', [realId]);
        updatedUnit = refreshedUnit.rows[0];
      }

      if (custom_fields !== undefined) {
        await tryInSavepoint(client, 'unit_update_purchase_auto', () =>
          evaluatePurchaseAutoCompletion([realId], client, deriveUnitStatus));
      }

      if (tray_status !== undefined || tray_start_date !== undefined || issued_date !== undefined) {
        await tryInSavepoint(client, 'unit_update_stores_auto', () =>
          evaluateStoresAutoCompletion([realId], client, deriveUnitStatus));
      }

      if (classification !== undefined) {
        const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        await client.query(
          `UPDATE unit_steps 
           SET status = 'pending', notes = 'Classification updated; pending Design re-confirmation.', updated = $1 
           WHERE order_unit_id = $2 AND dept = 'Design' 
             AND (name = 'Review & Classify' OR name ILIKE '%classify%')`,
          [updatedStr, realId]
        );
        await syncUnitDesignDocumentStatus(client, realId, req.user.id);
      } else {
        await tryInSavepoint(client, 'unit_update_derive', () => deriveUnitStatus(realId, client));
      }

      let logAction = `Updated unit ${unit.unit_id}`;
      if (panel_type_size !== undefined) logAction += ` panel size: "${panel_type_size}"`;
      if (classification !== undefined) logAction += ` classification: "${classification}"`;
      if (po_number !== undefined) logAction += ` po_number: "${po_number}"`;
      if (reference_number !== undefined) logAction += ` ref: "${reference_number}"`;
      if (tag !== undefined) logAction += ` tag: "${tag}"`;

      await client.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, logAction, unit.order_id]
      );

      await client.query('COMMIT');
      committed = true;

      broadcastEvent({
        type: 'ORDER_UPDATED',
        entity: 'unit',
        unitId: realId,
        orderId: unit.order_id,
        updatedBy: req.user?.username || 'User',
        timestamp: Date.now()
      });

      res.json({ success: true, unit: updatedUnit });
    } catch (err) {
      console.error('Failed to update unit:', err);
      res.status(500).json({ error: 'Failed to update unit' });
    } finally {
      if (client) {
        if (!committed) await client.query('ROLLBACK').catch(() => {});
        client.release();
      }
    }
  });

  router.post('/:id/design-confirm', authorize(['Admin', 'Manager', 'Design']), async (req, res) => {
    const { id } = req.params;
    const numId = !isNaN(Number(id)) ? Number(id) : -1;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const uRes = await client.query(
        `UPDATE order_units 
         SET design_confirmed = true, design_confirmed_at = NOW(), design_confirmed_by = $1 
         WHERE id = $2 OR unit_id = $3 RETURNING *`,
        [req.user.id, numId, String(id)]
      );
      if (uRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Unit not found' });
      }
      const unit = uRes.rows[0];

      // A panel only comes to Design after Sales has cleared it: the full Sales gate (PO, mandatory
      // order-level Sales steps and the panel's own Sales steps). Admin / Manager may override
      // (owner decision 2026-11-19).
      if (!['Admin', 'Manager'].includes(req.user.role) && await isAwaitingSales(client, unit.id)) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: 'Panel cannot be confirmed by Design: Awaiting Sales clearance (PO or Sales tasks still pending). A panel only comes to Design after Sales has cleared it.'
        });
      }

      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      await client.query(
        `UPDATE unit_steps 
         SET status = 'done', notes = 'Classification confirmed by Design.', updated = $1 
         WHERE order_unit_id = $2 AND dept = 'Design' 
           AND (name = 'Review & Classify' OR name ILIKE '%classify%')`,
        [updatedStr, unit.id]
      );

      const syncRes = await syncUnitDesignDocumentStatus(client, unit.id, req.user.id);

      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, 'Design', $3)`,
        [req.user.id, unit.order_id, `Unit ${unit.short_serial || unit.unit_id}: Confirmed Design classification (${unit.classification})`]
      );

      await client.query('COMMIT');

      broadcastEvent({
        type: 'ORDER_UPDATED',
        entity: 'unit',
        unitId: unit.id,
        orderId: unit.order_id,
        action: 'design-confirm',
        updatedBy: req.user?.username || 'Design',
        timestamp: Date.now()
      });

      const refreshed = await pool.query(
        `SELECT ou.*, u_conf.username AS design_confirmed_by_name 
         FROM order_units ou 
         LEFT JOIN users u_conf ON ou.design_confirmed_by = u_conf.id 
         WHERE ou.id = $1`,
        [unit.id]
      );

      res.json({ success: true, unit: refreshed.rows[0], step2Status: syncRes.status, notes: syncRes.notes });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to confirm design:', err);
      res.status(500).json({ error: 'Failed to confirm design' });
    } finally {
      client.release();
    }
  });

  router.post('/:id/design-unconfirm', authorize(['Admin', 'Manager', 'Design']), async (req, res) => {
    const { id } = req.params;
    const numId = !isNaN(Number(id)) ? Number(id) : -1;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const uRes = await client.query(
        `UPDATE order_units 
         SET design_confirmed = false, design_confirmed_at = NULL, design_confirmed_by = NULL 
         WHERE id = $1 OR unit_id = $2 RETURNING *`,
        [numId, String(id)]
      );
      if (uRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Unit not found' });
      }
      const unit = uRes.rows[0];

      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      await client.query(
        `UPDATE unit_steps 
         SET status = 'pending', notes = 'Classification unconfirmed / pending re-check.', updated = $1 
         WHERE order_unit_id = $2 AND dept = 'Design' 
           AND (name = 'Review & Classify' OR name ILIKE '%classify%')`,
        [updatedStr, unit.id]
      );

      const syncRes = await syncUnitDesignDocumentStatus(client, unit.id, req.user.id);

      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, 'Design', $3)`,
        [req.user.id, unit.order_id, `Unit ${unit.short_serial || unit.unit_id}: Re-opened Design inspection (Unconfirmed)`]
      );

      await client.query('COMMIT');

      broadcastEvent({
        type: 'ORDER_UPDATED',
        entity: 'unit',
        unitId: unit.id,
        orderId: unit.order_id,
        action: 'design-unconfirm',
        updatedBy: req.user?.username || 'Design',
        timestamp: Date.now()
      });

      const refreshed = await pool.query(
        `SELECT ou.*, u_conf.username AS design_confirmed_by_name 
         FROM order_units ou 
         LEFT JOIN users u_conf ON ou.design_confirmed_by = u_conf.id 
         WHERE ou.id = $1`,
        [unit.id]
      );

      res.json({ success: true, unit: refreshed.rows[0], step2Status: syncRes.status, notes: syncRes.notes });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to unconfirm design:', err);
      res.status(500).json({ error: 'Failed to unconfirm design' });
    } finally {
      client.release();
    }
  });

  router.post('/batch-po', authorize(['Sales', 'Admin', 'Manager']), upload.single('file'), async (req, res) => {
    const { po_number } = req.body;
    let unit_ids = req.body.unit_ids;

    if (!po_number || !po_number.trim()) {
      if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) { }
      }
      return res.status(400).json({ error: 'PO Number is required.' });
    }

    if (!unit_ids) {
      if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) { }
      }
      return res.status(400).json({ error: 'At least one serial number must be selected.' });
    }

    let client = null;
    let committed = false;
    try {
      if (typeof unit_ids === 'string') {
        try {
          unit_ids = JSON.parse(unit_ids);
        } catch (e) {
          unit_ids = unit_ids.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
        }
      }
      if (!Array.isArray(unit_ids) || unit_ids.length === 0) {
        if (req.file && fs.existsSync(req.file.path)) {
          try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        return res.status(400).json({ error: 'Invalid or empty unit_ids array.' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'PO PDF file is required.' });
      }

      const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        if (fs.existsSync(req.file.path)) {
          try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        return res.status(400).json({ error: 'Only PDF files are allowed for PO document upload.' });
      }

      client = await pool.connect();
      await client.query('BEGIN');

      // Verify units exist
      const unitRes = await client.query(
        'SELECT ou.id, ou.order_id, ou.unit_id FROM order_units ou WHERE ou.id = ANY($1::int[])',
        [unit_ids]
      );

      if (unitRes.rows.length === 0) {
        if (fs.existsSync(req.file.path)) {
          try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        return res.status(404).json({ error: 'No matching units found.' });
      }

      await lockOrders(client, unitRes.rows.map(u => u.order_id));

      const firstUnit = unitRes.rows[0];
      const cleanPo = po_number.trim();

      // 1. Insert into documents table (linked to the first unit or entity_type = 'Unit')
      const docRes = await client.query(
        `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        ['Unit', firstUnit.id, 'PO', req.file.originalname, req.file.path, req.file.size, req.file.mimetype, req.user.id]
      );
      const savedDoc = docRes.rows[0];

      // 2. Update order_units table for all selected unit IDs
      await client.query(
        `UPDATE order_units
         SET po_number = $1, po_doc_id = $2, po_override_unlinked = false
         WHERE id = ANY($3::int[])`,
        [cleanPo, savedDoc.id, unit_ids]
      );

      // 3. Update orders table po_number if all units in this order have POs
      const orderIds = [...new Set(unitRes.rows.map(u => u.order_id).filter(Boolean))];
      if (orderIds.length > 0) {
        for (const ordId of orderIds) {
          const totalUnitsRes = await client.query('SELECT COUNT(*) as total FROM order_units WHERE order_id = $1', [ordId]);
          const totalUnits = parseInt(totalUnitsRes.rows[0]?.total || 0);
          const selectedUnitsInOrder = unitRes.rows.filter(u => u.order_id === ordId).length;

          const unitsWithoutPoRes = await client.query(
            `SELECT COUNT(*) as cnt FROM order_units 
             WHERE order_id = $1 
               AND (po_number IS NULL OR po_number = '' OR (po_doc_id IS NULL AND po_override_unlinked = true))
               AND COALESCE(sales_cleared, false) = false`,
            [ordId]
          );
          const allUnitsHavePo = parseInt(unitsWithoutPoRes.rows[0]?.cnt || 0) === 0;

          // Only update order-level PO if all units of this order are included or have POs
          if (selectedUnitsInOrder >= totalUnits || allUnitsHavePo) {
            await client.query(
              `UPDATE orders SET po_number = $1 WHERE id = $2 AND (po_number IS NULL OR po_number = '')`,
              [cleanPo, ordId]
            );

            // Ensure Order-level document entry exists so order documents list shows PO copy
            const checkOrdDoc = await client.query("SELECT id FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO' LIMIT 1", [ordId]);
            if (checkOrdDoc.rows.length === 0) {
              await client.query(
                `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by)
                 VALUES ('Order', $1, 'PO', $2, $3, $4, $5, $6)`,
                [ordId, req.file.originalname, req.file.path, req.file.size, req.file.mimetype, req.user.id]
              );
            }

            // Auto-resolve 'Upload PO' milestone in order_steps
            const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            await client.query(
              `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
              [`PO #${cleanPo} uploaded.`, updatedStr, ordId]
            );
          }
        }
      }

      // 4. Re-derive unit status for all affected units so they transition out of Sales gating
      const sortedUnitIds = [...unit_ids].map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
      for (const uId of sortedUnitIds) {
        await tryInSavepoint(client, 'batch_po_derive', () => deriveUnitStatus(uId, client));
      }

      // 5. Activity log for affected orders
      const serialList = unitRes.rows.map(u => u.unit_id).join(', ');
      for (const ordId of orderIds) {
        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, ordId, 'Sales', `Attached PO #${cleanPo} (${req.file.originalname}) to serials: ${serialList}`]
        );
      }

      await client.query('COMMIT');
      committed = true;

      res.status(200).json({
        success: true,
        message: `PO #${cleanPo} attached to ${unitRes.rows.length} serials.`,
        po_number: cleanPo,
        po_doc_id: savedDoc.id,
        po_file_path: savedDoc.file_path,
        po_file_name: savedDoc.file_name,
        updated_unit_ids: unit_ids
      });
    } catch (err) {
      console.error('Error in batch-po upload:', err);
      if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) { }
      }
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to upload PO for selected serials') });
    } finally {
      if (client) {
        if (!committed) await client.query('ROLLBACK').catch(() => {});
        client.release();
      }
    }
  });

  router.post('/batch-purchase-na', authorize(['Purchase', 'Stores', 'Sales', 'Design', 'Admin', 'Manager']), async (req, res) => {
    const { unit_ids, colKey, value } = req.body;
    const VALID_COLS = ['purchase_cat_panel', 'purchase_cat_automation', 'purchase_cat_low_voltage', 'purchase_cat_wires'];
    
    if (!VALID_COLS.includes(colKey)) {
      return res.status(400).json({ error: 'Invalid purchase category column' });
    }

    if (!Array.isArray(unit_ids) || unit_ids.length === 0) {
      return res.status(400).json({ error: 'At least one serial number must be selected.' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const intIds = unit_ids.map(Number).filter(n => !isNaN(n));
      const strIds = unit_ids.map(String).filter(Boolean);

      const unitsRes = await client.query(
        `SELECT id, unit_id, custom_fields, order_id FROM order_units 
         WHERE id = ANY($1) OR unit_id = ANY($2)
         ORDER BY id ASC`,
        [intIds, strIds]
      );

      const updatedIds = [];
      for (const u of unitsRes.rows) {
        if (value === 'NA') {
          await client.query(
            `UPDATE order_units 
             SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) || jsonb_build_object($1::text, 'NA')
             WHERE id = $2`,
            [colKey, u.id]
          );
        } else {
          await client.query(
            `UPDATE order_units 
             SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) - $1::text
             WHERE id = $2`,
            [colKey, u.id]
          );
        }
        updatedIds.push(u.id);
      }

      if (updatedIds.length > 0) {
        await evaluatePurchaseAutoCompletion(updatedIds, client, deriveUnitStatus, { by: 'id' });
      }

      await client.query('COMMIT');
      res.json({ success: true, count: updatedIds.length });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error in batch-purchase-na:', err);
      res.status(500).json({ error: 'Failed to batch update purchase categories' });
    } finally {
      client.release();
    }
  });

  router.delete('/:id/po-document', authorize(['Sales', 'Admin', 'Manager']), async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Unit ID is required' });

    try {
      const numId = !isNaN(Number(id)) ? Number(id) : -1;
      const unitRes = await pool.query(
        'SELECT id, order_id, unit_id, short_serial, po_number, po_doc_id FROM order_units WHERE id = $1 OR unit_id = $2',
        [numId, String(id)]
      );
      if (unitRes.rows.length === 0) {
        return res.status(404).json({ error: 'Unit not found' });
      }
      const unit = unitRes.rows[0];

      // Check if unit has a specific po_doc_id
      if (unit.po_doc_id) {
        const oldDocId = unit.po_doc_id;
        // 1. Unlink and clear PO data from this unit
        await pool.query(
          'UPDATE order_units SET po_doc_id = NULL, po_number = NULL, po_override_unlinked = true WHERE id = $1',
          [unit.id]
        );

        // 2. Check if any other units or orders still reference this document
        const otherRef = await pool.query('SELECT id FROM order_units WHERE po_doc_id = $1 LIMIT 1', [oldDocId]);
        const ordRef = await pool.query("SELECT id FROM documents WHERE id = $1 AND entity_type = 'Order' LIMIT 1", [oldDocId]);
        if (otherRef.rows.length === 0 && ordRef.rows.length === 0) {
          const docRes = await pool.query('SELECT file_path FROM documents WHERE id = $1', [oldDocId]);
          if (docRes.rows.length > 0 && docRes.rows[0].file_path && fs.existsSync(docRes.rows[0].file_path)) {
            try { fs.unlinkSync(docRes.rows[0].file_path); } catch (e) { console.warn('Failed to delete file from disk:', e); }
          }
          await pool.query('DELETE FROM documents WHERE id = $1', [oldDocId]);
        }
      } else {
        // If no unit-level po_doc_id, mark this unit as unlinked from the shared order PO
        // and nullify its po_number. Do NOT delete the shared order PO document.
        await pool.query(
          'UPDATE order_units SET po_override_unlinked = true, po_number = NULL, po_doc_id = NULL WHERE id = $1',
          [unit.id]
        );
      }

      // 3. Immediately re-derive unit status so this unit returns to Sales
      await deriveUnitStatus(unit.id, pool);

      // Write activity log
      await pool.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, unit.order_id, req.user.role, `Removed PO document for serial ${unit.short_serial || unit.unit_id}`]
      );

      res.json({ success: true, message: 'PO document removed successfully.' });
    } catch (err) {
      console.error('Error removing unit PO document:', err);
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to remove PO document') });
    }
  });

  router.post('/:id/sales-clear', authorize(['Sales', 'Admin', 'Manager']), async (req, res) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'Unit ID is required' });

    try {
      const numId = !isNaN(Number(id)) ? Number(id) : -1;
      const unitRes = await pool.query(
        'SELECT id, order_id, unit_id, short_serial FROM order_units WHERE id = $1 OR unit_id = $2',
        [numId, String(id)]
      );
      if (unitRes.rows.length === 0) {
        return res.status(404).json({ error: 'Unit not found' });
      }
      const unit = unitRes.rows[0];

      await pool.query(
        `UPDATE order_units 
         SET sales_cleared = true, sales_cleared_at = NOW(), sales_cleared_by = $1 
         WHERE id = $2`,
        [req.user.id, unit.id]
      );

      await deriveUnitStatus(unit.id, pool);

      await pool.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, unit.order_id, req.user.role, `Manually cleared serial ${unit.short_serial || unit.unit_id} from Sales`]
      );

      res.json({ success: true, message: `Panel ${unit.unit_id} cleared from Sales.` });
    } catch (err) {
      console.error('Error clearing panel from Sales:', err);
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to clear panel from Sales') });
    }
  });

  router.post('/hold-action', authorize(OPERATOR_ROLES), async (req, res) => {
    const { unit_ids, action, reason, scope, order_id } = req.body;
    if (!['hold', 'cancel', 'resume'].includes(action)) {
      return res.status(400).json({ error: "Invalid action. Must be 'hold', 'cancel', or 'resume'." });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let targetUnits = [];
      if (scope === 'order') {
        let resolvedOrderId = order_id;
        if (!resolvedOrderId && Array.isArray(unit_ids) && unit_ids.length > 0) {
          const intIds = unit_ids.map(Number).filter(n => !isNaN(n) && n > 0);
          const strIds = unit_ids.map(String);
          const firstUnit = await client.query(
            'SELECT order_id FROM order_units WHERE id = ANY($1::int[]) OR unit_id = ANY($2::text[]) LIMIT 1',
            [intIds.length > 0 ? intIds : [-1], strIds]
          );
          if (firstUnit.rows.length > 0) resolvedOrderId = firstUnit.rows[0].order_id;
        }
        if (resolvedOrderId) {
          const orderUnitsRes = await client.query('SELECT id, short_serial, unit_id, order_id FROM order_units WHERE order_id = $1', [resolvedOrderId]);
          targetUnits = orderUnitsRes.rows;
        }
      }

      if (targetUnits.length === 0) {
        if (Array.isArray(unit_ids) && unit_ids.length > 0) {
          const intIds = unit_ids.map(Number).filter(n => !isNaN(n) && n > 0);
          const strIds = unit_ids.map(String);
          const selectedRes = await client.query(
            'SELECT id, short_serial, unit_id, order_id FROM order_units WHERE id = ANY($1::int[]) OR unit_id = ANY($2::text[])',
            [intIds.length > 0 ? intIds : [-1], strIds]
          );
          targetUnits = selectedRes.rows;
        } else {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: 'No units specified.' });
        }
      }

      if (targetUnits.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Target units not found.' });
      }

      const userName = req.user.name || req.user.username || 'User';
      const userRole = req.user.role || 'Production';
      const cleanReason = (reason || '').trim();
      const targetIds = targetUnits.map(u => u.id);

      if (action === 'hold') {
        const finalReason = cleanReason || 'On hold';
        await client.query(
          `UPDATE order_units 
           SET hold_status = 'Hold',
               hold_dept = $1,
               hold_reason = $2,
               held_by_name = $3,
               held_at = NOW(),
               status = 'Hold'
           WHERE id = ANY($4::int[])`,
          [userRole, finalReason, userName, targetIds]
        );

        for (const tu of targetUnits) {
          await client.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
            [req.user.id, tu.order_id, userRole, `Panel ${tu.unit_id || tu.short_serial}: Put on HOLD by ${userRole}${finalReason ? ` — Reason: ${finalReason}` : ''}`]
          );
          await deriveUnitStatus(tu.id, client);
        }
      } else if (action === 'cancel') {
        const finalReason = cleanReason || 'Cancelled';
        await client.query(
          `UPDATE order_units 
           SET hold_status = 'Cancelled',
               cancelled_dept = $1,
               cancelled_reason = $2,
               cancelled_by_name = $3,
               cancelled_at = NOW(),
               status = 'Cancelled'
           WHERE id = ANY($4::int[])`,
          [userRole, finalReason, userName, targetIds]
        );

        for (const tu of targetUnits) {
          await client.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
            [req.user.id, tu.order_id, userRole, `Panel ${tu.unit_id || tu.short_serial}: CANCELLED by ${userRole}${finalReason ? ` — Reason: ${finalReason}` : ''}`]
          );
          await deriveUnitStatus(tu.id, client);
        }
      } else if (action === 'resume') {
        const resumeOrder = req.body.resume_order === true || scope === 'order';
        let resolvedOrderId = order_id;
        if (!resolvedOrderId && targetUnits.length > 0) {
          resolvedOrderId = targetUnits[0].order_id;
        }
        if (resolvedOrderId) {
          const oCheck = await client.query('SELECT hold_status, order_number FROM orders WHERE id = $1', [resolvedOrderId]);
          if (resumeOrder || (oCheck.rows.length > 0 && oCheck.rows[0].hold_status === 'Approved')) {
            await client.query("UPDATE orders SET hold_status = 'None' WHERE id = $1", [resolvedOrderId]);
            const ordNum = oCheck.rows[0]?.order_number || resolvedOrderId;
            await client.query(
              `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
              [req.user.id, resolvedOrderId, userRole, `Order #${ordNum}: Resumed hold by ${userRole}`]
            );
            // If we resumed the order, refresh all units in this order
            const allOrderUnits = await client.query('SELECT id, short_serial, unit_id, order_id FROM order_units WHERE order_id = $1', [resolvedOrderId]);
            targetUnits = allOrderUnits.rows;
          }
        }

        const allTargetIds = targetUnits.map(u => u.id);

        await client.query(
          `UPDATE order_units 
           SET hold_status = 'None',
               hold_step_id = NULL,
               hold_step_name = NULL,
               hold_dept = NULL,
               hold_reason = NULL,
               held_by_name = NULL,
               held_at = NULL,
               cancelled_step_id = NULL,
               cancelled_step_name = NULL,
               cancelled_dept = NULL,
               cancelled_reason = NULL,
               cancelled_by_name = NULL,
               cancelled_at = NULL
           WHERE id = ANY($1::int[])`,
          [allTargetIds]
        );

        await client.query(
          `UPDATE unit_steps 
           SET status = 'inprogress', hold_reason = NULL, held_by = NULL, hold_at = NULL 
           WHERE order_unit_id = ANY($1::int[]) AND status IN ('hold', 'cancelled')`,
          [allTargetIds]
        );

        for (const tu of targetUnits) {
          await client.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
            [req.user.id, tu.order_id, userRole, `Panel ${tu.unit_id || tu.short_serial}: RESUMED by ${userRole}`]
          );
          await deriveUnitStatus(tu.id, client);
        }
      }

      await client.query('COMMIT');
      res.json({ success: true, count: targetUnits.length, action });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Error performing unit hold action:', err);
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to process panel ' + action) });
    } finally {
      client.release();
    }
  });

  // Reference documents for a unit (Part Number Master Drawings & BOM + Order Attachments)
  router.get('/:unitId/reference-documents', authorize(), async (req, res) => {
    try {
      const { unitId } = req.params;
      const unitRes = await pool.query(
        `SELECT ou.id, ou.order_id, ou.short_serial, ou.unit_id, ou.classification,
                oli.part_number, oli.material_description,
                o.order_number, o.po_number
         FROM order_units ou
         LEFT JOIN order_line_items oli ON ou.line_item_id = oli.id
         LEFT JOIN orders o ON ou.order_id = o.id
         WHERE ou.id = $1`,
        [unitId]
      );

      if (unitRes.rows.length === 0) {
        return res.status(404).json({ error: 'Unit not found' });
      }

      const unit = unitRes.rows[0];
      let masterPart = null;
      let masterDocs = [];

      if (unit.part_number && unit.part_number.trim()) {
        const partRes = await pool.query(
          `SELECT id, part_number, client_name, project, description, category, panel_code
           FROM part_number_masters
           WHERE LOWER(TRIM(part_number)) = LOWER(TRIM($1)) LIMIT 1`,
          [unit.part_number.trim()]
        );

        if (partRes.rows.length > 0) {
          masterPart = partRes.rows[0];
          const pDocsRes = await pool.query(
            `SELECT d.id, d.part_number_id, d.doc_type, d.revision_number, d.revision_label,
                    d.file_name, d.file_path, d.file_size, d.is_current, d.uploaded_at,
                    COALESCE(d.uploaded_by_name, u.username, 'System') as uploaded_by_name
             FROM part_number_documents d
             LEFT JOIN users u ON d.uploaded_by_id = u.id
             WHERE d.part_number_id = $1
             ORDER BY d.is_current DESC, d.revision_number DESC, d.id DESC`,
            [masterPart.id]
          );
          masterDocs = pDocsRes.rows;
        }
      }

      // Fetch order-level and unit-level documents
      const docsRes = await pool.query(
        `SELECT id, entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_at
         FROM documents
         WHERE (entity_type = 'Order' AND entity_id = $1)
            OR (entity_type = 'Unit' AND entity_id = $2)
         ORDER BY uploaded_at DESC`,
        [unit.order_id, unit.id]
      );

      let orderDocs = docsRes.rows;
      const isSalesOrAccounts = ['Sales', 'Accounts', 'Admin', 'Manager'].includes(req.user.role);
      if (!isSalesOrAccounts) {
        orderDocs = orderDocs.filter(d => d.doc_type !== 'PO');
      }

      res.json({
        unit_id: unit.unit_id,
        short_serial: unit.short_serial,
        part_number: unit.part_number,
        material_description: unit.material_description,
        classification: unit.classification,
        order_number: unit.order_number,
        master_part: masterPart,
        master_documents: masterDocs,
        order_documents: orderDocs
      });
    } catch (err) {
      console.error('Error fetching reference documents:', err);
      res.status(500).json({ error: 'Failed to fetch reference documents' });
    }
  });

  return router;
}
