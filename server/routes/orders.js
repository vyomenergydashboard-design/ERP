import express from 'express';
import fs from 'fs';
import XLSX from 'xlsx';
import { runDeploymentMigrations } from '../run_deployment_migrations.js';
import { PIPELINE, OPERATOR_ROLES, deptOrderSql } from '../data/workflow.js';
import { DEFAULT_STEPS } from '../data/defaultTaskMasters.js';
import { publicErrorMessage } from '../services/httpErrors.js';
import { safeEvaluateCondition } from '../services/safeConditionEvaluator.js';
import { isOrderOnHold } from '../services/holds.js';
import { sendHoldRequestEmail } from '../services/notifications.js';
import { upload } from '../services/uploads.js';
import { formatOrderNumber, parseOrderCounter, lockSerialAllocation, generateOrderNumber } from '../services/orderNumbers.js';
import { resolveCustomFieldValues, propagateCustomFieldsToDB } from '../services/customFields.js';
import { deriveUnitStatus, evaluateUnitDesignDocuments, updateOrderQCStatusFromSteps, syncUnitDesignDocumentStatus } from '../services/unitStatus.js';
import { lockOrders } from '../services/transactions.js';
import { sentFieldAssignments } from '../services/partialUpdate.js';

// Order-level planning fields PUT /:id/planning may change; only the ones sent are written.
const ORDER_PLANNING_FIELDS = [
  'end_client_name', 'planned_dispatch_date', 'wiring_assigned_date', 'wiring_expected_date',
  'expected_qc_date', 'qc_date'
];

// Order-level Design gate: every active (non-cancelled) panel of the order must have Drawing AND BOM AND
// Design confirmation before an order-level Release Documents step may be marked done.
const evaluateOrderDesignGate = async (clientOrPool, orderId) => {
  const unitsRes = await clientOrPool.query(
    `SELECT id, unit_id FROM order_units WHERE order_id = $1 AND COALESCE(hold_status, '') <> 'Cancelled' ORDER BY id`,
    [orderId]
  );
  const failing = [];
  for (const u of unitsRes.rows) {
    const info = await evaluateUnitDesignDocuments(clientOrPool, u.id);
    if (!info.hasDrawing || !info.hasBom || !info.designConfirmed) {
      const missing = [];
      if (!info.hasDrawing) missing.push('Drawing');
      if (!info.hasBom) missing.push('BOM');
      if (!info.designConfirmed) missing.push('Design confirmation');
      failing.push({ unitId: u.id, unit: u.unit_id, missing });
    }
  }
  return { ok: failing.length === 0, failing };
};

const isReleaseDocumentsStep = (s) =>
  Boolean(s) && s.dept === 'Design' && (s.name === 'Release Documents' || s.special === 'design');

/**
 * Router for orders (mounted at /api/orders): create (with line items, units and serials), Excel
 * bulk import, list / detail, edit, classification, line-item amend / add, order-level steps
 * (add, reorder, update, delete), hold request / approve / reject / resume, pipeline realign,
 * and order-level planning dates.
 * Order numbers and unit serials come from services/orderNumbers.js and are never renumbered
 * (AGENTS.md). '/:orderId/steps/reorder' must stay registered before '/:orderId/steps/:stepId'.
 * An order-level Release Documents step can only be done when every active panel has Drawing,
 * BOM and Design confirmation (evaluateOrderDesignGate).
 */
export default function createOrdersRouter(pool, authorize) {
  const router = express.Router();

  router.post('/', authorize(['Admin', 'Manager', 'Sales']), upload.any(), async (req, res) => {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const { order_date, delivery_date, notes, company_location_id, lineItems, priority, po_number, packaging_type, end_client_name, gst_number, reference_number, classification, project_name } = req.body;
      let parsedLineItems = [];
      try {
        parsedLineItems = JSON.parse(lineItems);
      } catch (e) {
        // Ignore
      }

      // Validate line item price values to prevent Postgres numeric field overflow. A price is
      // required (0 is fine); the validated numbers replace the raw values for the insert below,
      // since unit_price and total_price are NOT NULL.
      const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';
      for (const [index, li] of parsedLineItems.entries()) {
        const qty = parseInt(li.quantity) || 1;
        if (isBlank(li.unit_price)) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: `Unit price is required (line item ${index + 1}).` });
        }
        const uPrice = parseFloat(li.unit_price);
        const tPrice = isBlank(li.total_price) ? qty * uPrice : parseFloat(li.total_price);
        li.unit_price = uPrice;
        li.total_price = tPrice;

        if (isNaN(uPrice) || uPrice < 0 || uPrice > 9999999999999.99) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: "Unit price must be a valid number between 0 and 9,999,999,999,999.99." });
        }
        if (isNaN(tPrice) || tPrice < 0 || tPrice > 9999999999999.99) {
          await client.query('ROLLBACK');
          return res.status(400).json({ error: "Total price must be a valid number between 0 and 9,999,999,999,999.99." });
        }
      }

      // 1. Generate Order Number
      const order_number = await generateOrderNumber(client);

      const resolved_order_date = order_date || new Date().toISOString().split('T')[0];
      const orderDateObj = new Date(resolved_order_date);
      const year = orderDateObj.getFullYear();
      const resolved_delivery_date = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim()) ? delivery_date.trim() : null;

      const orderResult = await client.query(
        `INSERT INTO orders (order_number, company_location_id, order_date, delivery_date, notes, priority, po_number, packaging_type, created_by, end_client_name, gst_number, reference_number, classification, project_name) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
        [order_number, company_location_id || null, resolved_order_date, resolved_delivery_date, notes, priority || 'Medium', po_number || null, packaging_type || null, req.user.id, end_client_name || null, gst_number || null, reference_number || null, classification || 'Standard', project_name || null]
      );
      const order = orderResult.rows[0];

      // 2. Insert Line Items
      const maxUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
      let max_unit_seq = parseOrderCounter(maxUnitRes.rows[0]?.max_unit);
      let order_seq = parseOrderCounter(order_number);
      let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);
      let totalUnits = 0;
      const createdUnits = [];

      let itemIdx = 1;
      for (const li of parsedLineItems) {
        const qty = parseInt(li.quantity) || 1;
        const assigned_li_number = `${order_number}-${String(itemIdx).padStart(2, '0')}`;
        itemIdx++;

        const cleanTag = (li.tag && typeof li.tag === 'string' && li.tag.trim()) ? li.tag.trim() : null;
        const li_delivery_date = (li.delivery_date && typeof li.delivery_date === 'string' && li.delivery_date.trim()) ? li.delivery_date.trim() : resolved_delivery_date;
        const rawDesc = (li.material_description && typeof li.material_description === 'string' && li.material_description.trim()) ? li.material_description.trim() : null;
        const rawPart = (li.part_number && typeof li.part_number === 'string' && li.part_number.trim()) ? li.part_number.trim() : null;
        // Anti-duplicate rule: if description is identical to part number, do not duplicate
        const cleanDesc = (rawDesc && rawPart && rawDesc.toLowerCase() === rawPart.toLowerCase()) ? null : rawDesc;
        const liResult = await client.query(
          `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number, panel_type_size, delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
          [order.id, assigned_li_number, cleanDesc, rawPart, li.panel_type_size, li_delivery_date, qty, li.unit, li.unit_price, li.total_price, li.notes, li.project_name || order.project_name || null, cleanTag]
        );
        const lineItem = liResult.rows[0];
        totalUnits += qty;

        for (let i = 0; i < qty; i++) {
          const unit_id = formatOrderNumber(year, globalUnitCounter);
          const short_serial = unit_id;
          const unitResult = await client.query(
            `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanTag]
          );
          createdUnits.push(unitResult.rows[0].id);
          globalUnitCounter++;
        }
      }

      // 3. Auto-assign mandatory steps
      const tasksResult = await client.query(`
        SELECT * FROM task_masters 
        WHERE is_mandatory = true 
        ORDER BY 
          ${deptOrderSql('dept')} ASC,
          id ASC
      `);
      let tasks = tasksResult.rows;
      if (tasks.length === 0) {
        tasks = DEFAULT_STEPS;
      }

      const orderTasks = tasks.filter(t => t.level === 'order');
      const unitTasks = tasks.filter(t => t.level === 'unit');

      // Insert order-level milestones
      for (let i = 0; i < orderTasks.length; i++) {
        const task = orderTasks[i];
        let fieldDefs = [];
        if (task.id) {
          try {
            const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
            fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
          } catch { fieldDefs = []; }
        }

        await client.query(
          `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [order.id, task.id || null, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
        );
      }

      // Insert unit-level production steps for each unit
      for (const unitDbId of createdUnits) {
        for (let i = 0; i < unitTasks.length; i++) {
          const task = unitTasks[i];
          let fieldDefs = [];
          if (task.id) {
            try {
              const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
              fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
            } catch { fieldDefs = []; }
          }

          await client.query(
            `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order) 
             VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
            [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
          );
        }
        // Derive initial unit status
        await deriveUnitStatus(unitDbId, client);
      }

      // 4. Save Uploaded Documents
      let hasPO = false;
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          let docType = 'General';
          const field = file.fieldname.toLowerCase();
          if (field.includes('po')) {
            docType = 'PO';
            hasPO = true;
          }
          else if (field.includes('quotation')) docType = 'Quotation';
          else if (field.includes('approved')) docType = 'Approved';
          else if (field.includes('indent')) docType = 'Indent';

          await client.query(
            `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            ['Order', order.id, docType, file.originalname, file.path, file.size, file.mimetype, req.user.id]
          );
        }
      }

      // Auto-inherit master technical drawings from Part Number Masters
      for (const item of parsedLineItems) {
        if (item.part_number && item.part_number.trim()) {
          const pCheck = await client.query('SELECT id FROM part_number_masters WHERE LOWER(part_number) = LOWER($1)', [item.part_number.trim()]);
          if (pCheck.rows.length > 0) {
            const masterId = pCheck.rows[0].id;
            const pDocs = await client.query('SELECT * FROM part_number_documents WHERE part_number_id = $1 AND is_current = true', [masterId]);
            for (const doc of pDocs.rows) {
              const masterDocType = doc.doc_type || 'Drawing';
              await client.query(
                `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
                 VALUES ('Order', $1, $2, $3, $4, $5)`,
                [order.id, masterDocType, `[Master ${masterDocType}] ${doc.file_name}`, doc.file_path, req.user.id]
              );
            }
          }
        }
      }

      if (hasPO) {
        if ((!po_number || !po_number.trim()) && req.files) {
          const poFile = req.files.find(f => f.fieldname && f.fieldname.toLowerCase().includes('po'));
          if (poFile) {
            const derivedPo = poFile.originalname.replace(/\.[^/.]+$/, '').trim();
            await client.query('UPDATE orders SET po_number = $1 WHERE id = $2', [derivedPo, order.id]);
            order.po_number = derivedPo;
          }
        }

        const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        await client.query(
          `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
          ['PO uploaded during order creation.', updatedStr, order.id]
        );
        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, order.id, 'Sales', 'Completed: Upload PO (System Auto-Check)']
        );
        // Re-derive unit status for all units in this order so they advance out of Sales gating
        for (const unitDbId of createdUnits) {
          await deriveUnitStatus(unitDbId, client);
        }
      }

      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, 'Sales', $3)`,
        [req.user.id, order.id, `Created order ${order_number} with ${totalUnits} units`]
      );

      await client.query('COMMIT');
      res.status(201).json({ order, message: `Order ${order_number} created with ${totalUnits} units.` });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Order creation error:', err);
      res.status(500).json({ error: 'Failed to create order' });
    } finally {
      client.release();
    }
  });

  router.put('/:id/classification', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
    const { classification } = req.body;
    if (!['Standard', 'Non-Standard'].includes(classification)) {
      return res.status(400).json({ error: 'Classification must be Standard or Non-Standard' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await lockOrders(client, [req.params.id]);

      const checkOrder = await client.query('SELECT order_number, classification FROM orders WHERE id = $1', [req.params.id]);
      if (checkOrder.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Order not found' });
      }
      const oldClass = checkOrder.rows[0].classification || 'Standard';
      const order_number = checkOrder.rows[0].order_number;

      await client.query('UPDATE orders SET classification = $1 WHERE id = $2', [classification, req.params.id]);

      // Existing panels that have not passed Design take the new type and get their Drawing / BOM
      // requirement re-checked (owner decision 2026-11-19). Panels in Purchase or later keep the type
      // they were built with: Non-Standard ignores part-number documents, so switching them could send
      // them back to Design. Cancelled panels are left alone.
      const notPastDesign = PIPELINE.slice(0, PIPELINE.indexOf('Design') + 1);
      const updatedUnits = await client.query(
        `UPDATE order_units SET classification = $1
         WHERE order_id = $2 AND COALESCE(hold_status, '') <> 'Cancelled'
           AND current_dept = ANY($3::text[]) AND classification IS DISTINCT FROM $1
         RETURNING id`,
        [classification, req.params.id, notPastDesign]
      );
      for (const u of updatedUnits.rows) {
        await syncUnitDesignDocumentStatus(client, u.id, req.user.id);
      }
      const panelCount = updatedUnits.rows.length;

      await client.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role,
          `Changed classification of order ${order_number} from "${oldClass}" to "${classification}" (${panelCount} panel(s) not past Design updated)`,
          req.params.id]
      );

      await client.query('COMMIT');
      res.json({
        success: true,
        classification,
        updatedPanels: panelCount,
        message: `Order ${order_number} classification updated to ${classification}`
      });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Failed to update order classification' });
    } finally {
      client.release();
    }
  });

  router.delete('/:id', authorize(['Admin']), async (req, res) => {
    const { id } = req.params;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Lock the order row (order numbers / unit serials are immutable: NEVER resequence on delete)
      const orderCheck = await client.query('SELECT id, order_number FROM orders WHERE id = $1 FOR UPDATE', [id]);
      if (orderCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Order not found' });
      }
      const orderNumberToDelete = orderCheck.rows[0].order_number;

      // 2. Log action to activity logs
      await client.query(
        `INSERT INTO activity_logs (user_id, action_text, dept) VALUES ($1, $2, $3)`,
        [req.user.id, `Deleted order: ${orderNumberToDelete} (ID: ${id})`, 'Admin']
      );

      // 3. Remove polymorphic documents for the order, its units and its steps.
      //    'Step' entity ids are shared between order_steps and unit_steps, so a Step document is only
      //    removed when its id cannot belong to a step of another order.
      await client.query(
        `DELETE FROM documents d
          WHERE (d.entity_type = 'Order' AND d.entity_id = $1)
             OR (d.entity_type = 'Unit' AND d.entity_id IN (SELECT id FROM order_units WHERE order_id = $1))
             OR (d.entity_type = 'Step'
                 AND (d.entity_id IN (SELECT id FROM order_steps WHERE order_id = $1)
                      OR d.entity_id IN (SELECT us.id FROM unit_steps us JOIN order_units ou ON us.order_unit_id = ou.id WHERE ou.order_id = $1))
                 AND d.entity_id NOT IN (SELECT id FROM order_steps WHERE order_id <> $1)
                 AND d.entity_id NOT IN (SELECT us.id FROM unit_steps us JOIN order_units ou ON us.order_unit_id = ou.id WHERE ou.order_id <> $1))`,
        [id]
      );

      // 4. Delete the order (FK cascades delete line items, units, unit steps, order steps)
      await client.query('DELETE FROM orders WHERE id = $1', [id]);

      await client.query('COMMIT');
      res.json({ message: `Order ${orderNumberToDelete} deleted successfully` });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Order deletion error:', err);
      res.status(500).json({ error: 'Failed to delete order' });
    } finally {
      client.release();
    }
  });

  router.put('/:id', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
    const {
      company_location_id,
      order_date,
      delivery_date,
      notes,
      priority,
      po_number,
      packaging_type,
      end_client_name,
      gst_number,
      reference_number,
      classification,
      project_name
    } = req.body;

    try {
      const checkOrder = await pool.query('SELECT order_number, order_date FROM orders WHERE id = $1', [req.params.id]);
      if (checkOrder.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      const { order_number, order_date: existing_order_date } = checkOrder.rows[0];

      const resolved_order_date = order_date || (existing_order_date ? (existing_order_date instanceof Date ? existing_order_date.toISOString().split('T')[0] : String(existing_order_date).split('T')[0]) : new Date().toISOString().split('T')[0]);

      if (delivery_date !== undefined) {
        // Auto-update all line items' delivery dates if delivery_date was explicitly changed
        await pool.query(
          'UPDATE order_line_items SET delivery_date = $1 WHERE order_id = $2',
          [delivery_date || null, req.params.id]
        );
      }

      const result = await pool.query(
        `UPDATE orders 
         SET company_location_id = COALESCE($1, company_location_id), 
             order_date = COALESCE($2, order_date), 
             delivery_date = COALESCE($3, delivery_date), 
             notes = CASE WHEN $4::text IS NOT NULL THEN $4 ELSE notes END, 
             priority = COALESCE($5, priority), 
             po_number = CASE WHEN $6::text IS NOT NULL THEN $6 ELSE po_number END, 
             packaging_type = CASE WHEN $7::text IS NOT NULL THEN $7 ELSE packaging_type END, 
             end_client_name = CASE WHEN $8::text IS NOT NULL THEN $8 ELSE end_client_name END, 
             gst_number = CASE WHEN $9::text IS NOT NULL THEN $9 ELSE gst_number END, 
             reference_number = CASE WHEN $10::text IS NOT NULL THEN $10 ELSE reference_number END,
             classification = COALESCE($11, classification),
             project_name = CASE WHEN $12::text IS NOT NULL THEN $12 ELSE project_name END
         WHERE id = $13 
         RETURNING *`,
        [
          company_location_id ? parseInt(company_location_id) : null,
          order_date || null,
          delivery_date || null,
          notes !== undefined ? notes : null,
          priority || null,
          po_number !== undefined ? po_number : null,
          packaging_type !== undefined ? packaging_type : null,
          end_client_name !== undefined ? end_client_name : null,
          gst_number !== undefined ? gst_number : null,
          reference_number !== undefined ? reference_number : null,
          classification || null,
          project_name !== undefined ? project_name : null,
          req.params.id
        ]
      );

      // If project_name was updated, also sync line items
      if (project_name !== undefined) {
        await pool.query('UPDATE order_line_items SET project_name = $1 WHERE order_id = $2', [project_name || null, req.params.id]);
      }

      await pool.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [
          req.user.id,
          req.user.role,
          `Amended order details for ${order_number}`,
          req.params.id
        ]
      );

      // Sync units' deriveUnitStatus after order details change
      const unitsRes = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [req.params.id]);
      for (const unit of unitsRes.rows) {
        await deriveUnitStatus(unit.id, pool);
      }

      res.json({ success: true, order: result.rows[0] });
    } catch (err) {
      console.error('Failed to amend order details:', err);
      res.status(500).json({ error: 'Failed to amend order details' });
    }
  });

  // Amend a single line item's core details
  router.put('/:orderId/line-items/:liId', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
    const { orderId, liId } = req.params;
    const {
      material_description,
      part_number,
      panel_type_size,
      quantity,
      unit,
      unit_price,
      delivery_date,
      notes,
      tag,
    } = req.body;

    try {
      // Verify the order exists and fetch order_date
      const orderCheck = await pool.query('SELECT order_number, hold_status, order_date FROM orders WHERE id = $1', [orderId]);
      if (orderCheck.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      const { order_number, hold_status, order_date } = orderCheck.rows[0];
      if (hold_status === 'Approved') return res.status(403).json({ error: 'Order is on hold. Amendments are disabled.' });

      // Verify the line item belongs to this order
      const liCheck = await pool.query('SELECT id FROM order_line_items WHERE id = $1 AND order_id = $2', [liId, orderId]);
      if (liCheck.rows.length === 0) return res.status(404).json({ error: 'Line item not found for this order' });

      const updates = [];
      const values = [];
      let idx = 1;

      if (material_description !== undefined) {
        updates.push(`material_description = $${idx++}`);
        values.push(material_description || null);
      }
      if (part_number !== undefined) {
        updates.push(`part_number = $${idx++}`);
        values.push(part_number || null);
      }
      if (panel_type_size !== undefined) {
        updates.push(`panel_type_size = $${idx++}`);
        values.push(panel_type_size || null);
      }
      if (quantity !== undefined) {
        const qty = quantity ? parseInt(quantity) : null;
        updates.push(`quantity = $${idx++}`);
        values.push(qty);
      }
      if (unit !== undefined) {
        updates.push(`unit = $${idx++}`);
        values.push(unit || null);
      }
      if (unit_price !== undefined) {
        // unit_price is NOT NULL: 0 is a valid price, an empty one is refused.
        if (unit_price === null || String(unit_price).trim() === '') {
          return res.status(400).json({ error: 'Unit price is required.' });
        }
        const price = parseFloat(unit_price);
        if (isNaN(price) || price < 0 || price > 9999999999999.99) {
          return res.status(400).json({ error: "Unit price must be a valid number between 0 and 9,999,999,999,999.99." });
        }
        updates.push(`unit_price = $${idx++}`);
        values.push(price);
      }
      if (req.body.total_price !== undefined || (quantity !== undefined && unit_price !== undefined)) {
        let total = null;
        if (req.body.total_price !== undefined) {
          total = parseFloat(req.body.total_price);
        } else if (quantity) {
          total = parseInt(quantity) * parseFloat(unit_price);
        }
        if (total !== null && (isNaN(total) || total < 0 || total > 9999999999999.99)) {
          return res.status(400).json({ error: "Total price must be a valid number between 0 and 9,999,999,999,999.99." });
        }
        updates.push(`total_price = $${idx++}`);
        values.push(total);
      }
      if (delivery_date !== undefined) {
        const cleanDeliveryDate = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim()) ? delivery_date.trim() : null;
        updates.push(`delivery_date = $${idx++}`);
        values.push(cleanDeliveryDate);
      }
      if (tag !== undefined) {
        const cleanTag = (tag && typeof tag === 'string' && tag.trim()) ? tag.trim() : null;
        updates.push(`tag = $${idx++}`);
        values.push(cleanTag);
        // Synchronize tag to all units associated with this line item
        await pool.query('UPDATE order_units SET tag = $1 WHERE line_item_id = $2', [cleanTag, liId]);
      }
      if (notes !== undefined) {
        updates.push(`notes = $${idx++}`);
        values.push(notes || null);
      }

      if (updates.length === 0) {
        return res.json({ success: true, message: 'No changes provided' });
      }

      values.push(liId);
      const result = await pool.query(
        `UPDATE order_line_items
         SET ${updates.join(', ')}
         WHERE id = $${idx}
         RETURNING *`,
        values
      );

      await pool.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, `Amended line item ${result.rows[0].line_item_number} on order ${order_number}`, orderId]
      );

      res.json({ success: true, line_item: result.rows[0] });
    } catch (err) {
      console.error('Failed to amend line item:', err);
      res.status(500).json({ error: 'Failed to amend line item' });
    }
  });

  // Add a new line item (and corresponding units & steps) to an existing order
  router.post('/:orderId/line-items', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
    const { orderId } = req.params;
    const {
      material_description,
      part_number,
      panel_type_size,
      quantity,
      unit,
      unit_price,
      delivery_date,
      notes,
      tag,
    } = req.body;

    const rawDesc = (material_description && typeof material_description === 'string' && material_description.trim()) ? material_description.trim() : null;
    const rawPart = (part_number && typeof part_number === 'string' && part_number.trim()) ? part_number.trim() : null;

    if (!rawDesc && !rawPart) {
      return res.status(400).json({ error: 'Either Material description or Part number is required.' });
    }

    // Anti-duplicate rule: if description is identical to part number, do not duplicate
    const cleanDesc = (rawDesc && rawPart && rawDesc.toLowerCase() === rawPart.toLowerCase()) ? null : rawDesc;

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1.' });
    }

    const uPrice = parseFloat(unit_price) || 0;
    if (isNaN(uPrice) || uPrice < 0 || uPrice > 9999999999999.99) {
      return res.status(400).json({ error: 'Unit price must be a valid number between 0 and 9,999,999,999,999.99.' });
    }

    let tPrice = req.body.total_price !== undefined ? parseFloat(req.body.total_price) : (qty * uPrice);
    if (isNaN(tPrice) || tPrice < 0 || tPrice > 9999999999999.99) {
      return res.status(400).json({ error: 'Total price must be a valid number between 0 and 9,999,999,999,999.99.' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Verify the order exists and is not on hold
      const orderCheck = await client.query(
        'SELECT id, order_number, hold_status, order_date, delivery_date, classification, project_name FROM orders WHERE id = $1',
        [orderId]
      );
      if (orderCheck.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Order not found' });
      }
      const order = orderCheck.rows[0];
      if (order.hold_status === 'Approved') {
        await client.query('ROLLBACK');
        return res.status(403).json({ error: 'Order is on hold. Adding line items is disabled.' });
      }

      // 2. Determine next line item number suffix
      const existingLis = await client.query(
        'SELECT line_item_number FROM order_line_items WHERE order_id = $1',
        [order.id]
      );
      let maxItemIdx = 0;
      for (const row of existingLis.rows) {
        const match = String(row.line_item_number || '').match(/-(\d+)$/);
        if (match) {
          const parsed = parseInt(match[1], 10);
          if (parsed > maxItemIdx) maxItemIdx = parsed;
        }
      }
      const nextItemIdx = maxItemIdx > 0 ? maxItemIdx + 1 : (existingLis.rows.length + 1);
      const assigned_li_number = `${order.order_number}-${String(nextItemIdx).padStart(2, '0')}`;

      const cleanTag = (tag && typeof tag === 'string' && tag.trim()) ? tag.trim() : null;
      const resolvedDeliveryDate = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim())
        ? delivery_date.trim()
        : (order.delivery_date ? new Date(order.delivery_date).toISOString().split('T')[0] : null);

      // 3. Insert line item
      const liResult = await client.query(
        `INSERT INTO order_line_items (
          order_id, line_item_number, material_description, part_number, panel_type_size,
          delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *`,
        [
          order.id,
          assigned_li_number,
          cleanDesc,
          rawPart,
          panel_type_size ? panel_type_size.trim() : null,
          resolvedDeliveryDate,
          qty,
          unit || 'Nos',
          uPrice,
          tPrice,
          notes || null,
          order.project_name || null,
          cleanTag,
        ]
      );
      const lineItem = liResult.rows[0];

      // 4. Determine starting unit serial sequence
      let year = new Date().getFullYear();
      if (order.order_date) {
        const d = new Date(order.order_date);
        if (!isNaN(d.getFullYear())) year = d.getFullYear();
      } else if (order.order_number && /^\d{8,}$/.test(order.order_number)) {
        const yy = parseInt(order.order_number.substring(0, 2), 10);
        if (!isNaN(yy)) year = 2000 + yy;
      }

      await lockSerialAllocation(client);
      const maxUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
      let max_unit_seq = parseOrderCounter(maxUnitRes.rows[0]?.max_unit);
      let order_seq = parseOrderCounter(order.order_number);
      let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);

      // 5. Create units
      const createdUnits = [];
      for (let i = 0; i < qty; i++) {
        const unit_id = formatOrderNumber(year, globalUnitCounter);
        const short_serial = unit_id;
        const unitResult = await client.query(
          `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanTag]
        );
        createdUnits.push(unitResult.rows[0].id);
        globalUnitCounter++;
      }

      // 6. Assign mandatory unit-level steps
      const tasksResult = await client.query(`
        SELECT * FROM task_masters 
        WHERE is_mandatory = true AND level = 'unit'
        ORDER BY 
          ${deptOrderSql('dept')} ASC,
          id ASC
      `);
      let unitTasks = tasksResult.rows;
      if (unitTasks.length === 0) {
        unitTasks = DEFAULT_STEPS.filter(t => t.level === 'unit');
      }

      for (const unitDbId of createdUnits) {
        for (let i = 0; i < unitTasks.length; i++) {
          const task = unitTasks[i];
          let fieldDefs = [];
          if (task.id) {
            try {
              const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
              fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
            } catch { fieldDefs = []; }
          }

          await client.query(
            `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order) 
             VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
            [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
          );
        }
        // Derive initial unit status
        await deriveUnitStatus(unitDbId, client);
      }

      // 7. Activity Log
      await client.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, `Added line item ${assigned_li_number} (${qty} units) to order ${order.order_number}`, order.id]
      );

      await client.query('COMMIT');
      res.status(201).json({ success: true, line_item: lineItem, units_created: createdUnits.length });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('Failed to add line item to order:', err);
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to add line item to order') });
    } finally {
      client.release();
    }
  });

  router.post('/:id/hold/request', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
    try {
      const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
      if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      const order_number = checkOrder.rows[0].order_number;

      await pool.query("UPDATE orders SET hold_status = 'Requested' WHERE id = $1", [req.params.id]);
      await pool.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, `Requested hold for order ${order_number}`, req.params.id]
      );

      const userRes = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.id]);
      const requestedByUsername = userRes.rows[0]?.username || 'Sales User';
      sendHoldRequestEmail(req.params.id, order_number, requestedByUsername).catch(console.error);

      res.json({ success: true, message: 'Hold requested successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/:id/hold/approve', authorize(['Admin', 'Manager']), async (req, res) => {
    try {
      const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
      if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      const order_number = checkOrder.rows[0].order_number;

      await pool.query("UPDATE orders SET hold_status = 'Approved' WHERE id = $1", [req.params.id]);
      await pool.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, `Approved hold for order ${order_number}`, req.params.id]
      );
      res.json({ success: true, message: 'Order put on hold.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/:id/hold/reject', authorize(['Admin', 'Manager']), async (req, res) => {
    try {
      const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
      if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      const order_number = checkOrder.rows[0].order_number;

      await pool.query("UPDATE orders SET hold_status = 'None' WHERE id = $1", [req.params.id]);
      await pool.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, `Rejected hold request for order ${order_number}`, req.params.id]
      );
      res.json({ success: true, message: 'Hold request rejected.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/:id/hold/resume', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
    try {
      const numId = !isNaN(Number(req.params.id)) ? Number(req.params.id) : -1;
      const checkOrder = await pool.query('SELECT id, order_number FROM orders WHERE id = $1 OR order_number = $2', [numId, String(req.params.id)]);
      if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
      const order = checkOrder.rows[0];
      const order_number = order.order_number;
      const orderId = order.id;

      await pool.query("UPDATE orders SET hold_status = 'None' WHERE id = $1", [orderId]);
      await pool.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, `Resumed order ${order_number}`, orderId]
      );

      // Sync all units belonging to this order so their statuses update from Hold to active pipeline
      const uRes = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [orderId]);
      for (const u of uRes.rows) {
        await deriveUnitStatus(u.id, pool);
      }

      res.json({ success: true, message: 'Order resumed successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/realign-pipeline', authorize(['Admin', 'Manager']), async (req, res) => {
    try {
      for (const colDef of [
        'po_override_unlinked BOOLEAN DEFAULT FALSE',
        'sales_cleared BOOLEAN DEFAULT FALSE',
        'sales_cleared_at TIMESTAMP WITH TIME ZONE',
        'sales_cleared_by INTEGER'
      ]) {
        try {
          await pool.query(`ALTER TABLE order_units ADD COLUMN IF NOT EXISTS ${colDef}`);
        } catch (colErr) {
          console.warn(`[Realign Pipeline] Column check notice (${colDef}):`, colErr.message);
        }
      }
      await runDeploymentMigrations();
      const allUnits = await pool.query('SELECT id FROM order_units');
      for (const u of allUnits.rows) {
        await deriveUnitStatus(u.id, pool, true);
      }
      res.json({ success: true, message: 'Pipeline successfully realigned. Units without PO restored to Sales.' });
    } catch (err) {
      console.error('Failed to realign pipeline:', err);
      res.status(500).json({ error: publicErrorMessage(err, 'Failed to realign pipeline') });
    }
  });

  // ── BULK IMPORT via Excel ─────────────────────────────────────────────────────
  // Accepts a single .xlsx file whose "Import Template" sheet follows the
  // column layout generated by the sample template tool.
  router.post('/import', authorize(['Sales', 'Admin', 'Manager']), upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    // 1. Parse the workbook — auto-detect which sheet and which row is the real header
    let rows;
    let detectedSheet = '';
    let detectedHeaders = [];
    try {
      const wb = XLSX.read(fs.readFileSync(req.file.path)); // xlsx 0.20 ESM build has no fs, so read the buffer here

      // Prefer "Import Template" sheet, otherwise try first sheet
      const sheetName = wb.SheetNames.includes('Import Template')
        ? 'Import Template'
        : wb.SheetNames[0];
      detectedSheet = sheetName;
      const ws = wb.Sheets[sheetName];

      // Convert to raw 2D array first so we can scan for the real header row
      const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

      // Find the row index that contains 'po_number' — handles group-label rows above real headers
      let headerRowIdx = -1;
      for (let i = 0; i < Math.min(raw.length, 10); i++) {
        const rowStr = raw[i].map(c => String(c).toLowerCase().trim());
        if (rowStr.includes('po_number')) {
          headerRowIdx = i;
          break;
        }
      }

      if (headerRowIdx === -1) {
        fs.unlinkSync(req.file.path);
        const firstRowPreview = raw[0] ? raw[0].slice(0, 5).join(', ') : '(empty)';
        return res.status(400).json({
          error: `Column header "po_number" not found in the first 10 rows of sheet "${sheetName}". ` +
            `First row detected: [${firstRowPreview}]. ` +
            `Make sure you are filling the "Import Template" sheet from the downloaded template.`
        });
      }

      // Use that row as headers, parse data rows below it
      const headers = raw[headerRowIdx].map(h => String(h).trim());
      detectedHeaders = headers;
      rows = raw.slice(headerRowIdx + 1).map(rowArr => {
        const obj = {};
        headers.forEach((h, i) => { obj[h] = rowArr[i] !== undefined ? rowArr[i] : ''; });
        return obj;
      });
    } catch (err) {
      try { fs.unlinkSync(req.file.path); } catch (_) { }
      return res.status(400).json({ error: `Failed to read Excel file: ${err.message}` });
    }

    // Cleanup the temp upload
    try { fs.unlinkSync(req.file.path); } catch (_) { }

    // Filter to rows that have any content at all
    rows = rows.filter(r => Object.values(r).some(v => String(v).trim() !== ''));

    if (!rows || rows.length === 0) {
      return res.status(400).json({
        error: `The sheet "${detectedSheet}" appears to be empty or has no data rows below the header. ` +
          `Detected headers: [${detectedHeaders.slice(0, 6).join(', ')}...]`
      });
    }

    // 2. Group rows by po_number (one order per unique PO)
    const orderMap = new Map();
    for (const row of rows) {
      const po = String(row['po_number'] || '').trim();
      if (!po) continue; // skip blank rows

      if (!orderMap.has(po)) {
        orderMap.set(po, { header: row, lineItems: [] });
      }
      orderMap.get(po).lineItems.push(row);
    }

    if (orderMap.size === 0) {
      return res.status(400).json({
        error: `No rows with a po_number value found in sheet "${detectedSheet}". ` +
          `Make sure the po_number column is filled in for every data row. ` +
          `Detected columns: [${detectedHeaders.join(', ')}]`
      });
    }

    // 3. Resolve company_name + company_city → company_location_id (cached)
    const locationCache = new Map();
    const resolveLocation = async (client, name, city) => {
      const key = `${name}|||${city}`.toLowerCase();
      if (locationCache.has(key)) return locationCache.get(key);

      // 1. Find or create company
      let compRes = await client.query(
        `SELECT id FROM companies WHERE LOWER(name) = LOWER($1) LIMIT 1`,
        [name]
      );
      let companyId;
      if (compRes.rows.length > 0) {
        companyId = compRes.rows[0].id;
      } else {
        compRes = await client.query(
          `INSERT INTO companies (name) VALUES ($1)
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [name]
        );
        companyId = compRes.rows[0].id;
      }

      // 2. Find or create location under that company
      let locRes = await client.query(
        `SELECT id FROM company_locations 
         WHERE company_id = $1 AND LOWER(city) = LOWER($2) 
         LIMIT 1`,
        [companyId, city]
      );
      let locationId;
      if (locRes.rows.length > 0) {
        locationId = locRes.rows[0].id;
      } else {
        locRes = await client.query(
          `INSERT INTO company_locations (company_id, city) VALUES ($1, $2) RETURNING id`,
          [companyId, city]
        );
        locationId = locRes.rows[0].id;
      }

      locationCache.set(key, locationId);
      return locationId;
    };

    // 4. Create each order in a transaction
    const results = [];
    const errors = [];

    for (const [po_number, { header, lineItems }] of orderMap) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');

        // Resolve location
        const companyName = String(header['company_name'] || '').trim();
        const companyCity = String(header['company_city'] || '').trim();
        if (!companyName || !companyCity) {
          errors.push({ po_number, error: 'company_name or company_city is missing.' });
          await client.query('ROLLBACK');
          continue;
        }
        const company_location_id = await resolveLocation(client, companyName, companyCity);

        // Validate priority
        const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
        const priority = VALID_PRIORITIES.includes(header['priority']) ? header['priority'] : 'Medium';

        // Validate packaging (accept any custom packaging type string entered in the sheet)
        const packaging_type = header['packaging_type'] ? String(header['packaging_type']).trim() : null;

        // Parse dates (handles both JS Date objects from xlsx and YYYY-MM-DD strings)
        const parseDate = (v) => {
          if (!v) return null;
          if (v instanceof Date) return v.toISOString().split('T')[0];
          const s = String(v).trim();
          // Handle Excel serial numbers
          if (/^\d+$/.test(s)) {
            const d = XLSX.SSF.parse_date_code(parseInt(s));
            return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
          }
          return s || null;
        };

        const order_date = parseDate(header['order_date']) || new Date().toISOString().split('T')[0];
        const orderDateObj = new Date(order_date);
        const deliveryDateObj = new Date(orderDateObj);
        deliveryDateObj.setDate(orderDateObj.getDate() + 28); // 4 weeks
        const delivery_date = deliveryDateObj.toISOString().split('T')[0];

        // Check if order already exists with this po_number
        const existingOrderRes = await client.query(
          'SELECT * FROM orders WHERE po_number = $1 LIMIT 1',
          [po_number]
        );

        let order;
        let lineNum = 1;
        let isAppended = false;

        if (existingOrderRes.rows.length > 0) {
          order = existingOrderRes.rows[0];
          isAppended = true;
        } else {
          const order_number = await generateOrderNumber(client);
          const VALID_CLASSIFICATIONS = ['Standard', 'Non-Standard'];
          const classification = VALID_CLASSIFICATIONS.includes(header['classification']) ? header['classification'] : 'Standard';
          const orderResult = await client.query(
            `INSERT INTO orders (order_number, company_location_id, order_date, delivery_date, notes, priority, po_number, packaging_type, created_by, end_client_name, gst_number, reference_number, classification, project_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
            [order_number, company_location_id, order_date, delivery_date,
              header['order_notes'] || null, priority, po_number, packaging_type, req.user.id,
              header['end_client_name'] || header['end_client'] || null,
              header['gst_number'] || null,
              header['reference_number'] || null,
              classification,
              header['project_name'] || header['project'] || null]
          );
          order = orderResult.rows[0];
        }

        const order_number = order.order_number;
        const order_seq = parseOrderCounter(order_number);

        await lockSerialAllocation(client);
        const maxGlobalUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
        let max_unit_seq = parseOrderCounter(maxGlobalUnitRes.rows[0]?.max_unit);
        let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);

        const countRes = await client.query('SELECT COUNT(*) FROM order_line_items WHERE order_id = $1', [order.id]);
        let itemIdx = parseInt(countRes.rows[0].count, 10) + 1;

        // Insert line items & units
        let totalUnits = 0;
        const createdUnits = [];

        for (const li of lineItems) {
          const qty = parseInt(li['quantity']) || 1;
          const li_number = `${order_number}-${String(itemIdx).padStart(2, '0')}`;
          itemIdx++;

          // Smart Deduplication: Check if this line item already exists (by number OR by matching description)
          if (isAppended) {
            const checkLi = await client.query(
              `SELECT id FROM order_line_items 
               WHERE order_id = $1 AND (
                 line_item_number = $2 OR 
                 (LOWER(TRIM(material_description)) = LOWER(TRIM($3)) AND TRIM($3) != '')
               ) LIMIT 1`,
              [order.id, li_number, li['material_description'] || '']
            );
            if (checkLi.rows.length > 0) {
              // Already exists — skip to prevent stacking duplicate lines
              continue;
            }
          }
          const unit_price = parseFloat(li['unit_price']) || 0;
          const total_price = parseFloat(li['total_price']) || (qty * unit_price);

          if (isNaN(unit_price) || unit_price < 0 || unit_price > 9999999999999.99) {
            throw new Error(`Unit price for line item must be a valid number between 0 and 9,999,999,999,999.99.`);
          }
          if (isNaN(total_price) || total_price < 0 || total_price > 9999999999999.99) {
            throw new Error(`Total price for line item must be a valid number between 0 and 9,999,999,999,999.99.`);
          }

          const cleanLiTag = li['tag'] && typeof li['tag'] === 'string' && li['tag'].trim() ? li['tag'].trim() : null;
          const impDesc = (li['material_description'] && typeof li['material_description'] === 'string' && li['material_description'].trim()) ? li['material_description'].trim() : null;
          const impPart = (li['part_number'] && typeof li['part_number'] === 'string' && li['part_number'].trim()) ? li['part_number'].trim() : null;
          const finalImpDesc = (impDesc && impPart && impDesc.toLowerCase() === impPart.toLowerCase()) ? null : impDesc;
          const liResult = await client.query(
            `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number,
              panel_type_size, delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
            [order.id, li_number, finalImpDesc, impPart || '',
            li['panel_type_size'] || '', delivery_date,
              qty, li['unit'] || 'Nos', unit_price, total_price, li['line_item_notes'] || null,
            li['project_name'] || li['project'] || order.project_name || null, cleanLiTag]
          );
          const lineItem = liResult.rows[0];
          totalUnits += qty;

          for (let i = 0; i < qty; i++) {
            const unit_id = formatOrderNumber(new Date().getFullYear(), globalUnitCounter);
            const short_serial = unit_id;
            const unitResult = await client.query(
              `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
              [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanLiTag]
            );
            createdUnits.push(unitResult.rows[0].id);
            globalUnitCounter++;
          }
        }

        // Auto-assign steps
        const tasksResult = await client.query(`
          SELECT * FROM task_masters 
          WHERE is_mandatory = true 
          ORDER BY 
            ${deptOrderSql('dept')} ASC,
            id ASC
        `);
        let tasks = tasksResult.rows;
        if (tasks.length === 0) {
          tasks = DEFAULT_STEPS;
        }

        const orderTasks = tasks.filter(t => t.level === 'order');
        const unitTasks = tasks.filter(t => t.level === 'unit');

        if (!isAppended) {
          for (let i = 0; i < orderTasks.length; i++) {
            const task = orderTasks[i];
            let fieldDefs = [];
            if (task.id) {
              try {
                const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
                fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
              } catch { fieldDefs = []; }
            }

            await client.query(
              `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order)
               VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
              [order.id, task.id || null, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
            );
          }
        }

        for (const unitDbId of createdUnits) {
          for (let i = 0; i < unitTasks.length; i++) {
            const task = unitTasks[i];
            let fieldDefs = [];
            if (task.id) {
              try {
                const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
                fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
              } catch { fieldDefs = []; }
            }

            await client.query(
              `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order)
               VALUES ($1,$2,$3,$4,$5,'pending',$6,$7,$8,$9)`,
              [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
            );
          }
          await deriveUnitStatus(unitDbId, client);
        }

        await client.query('COMMIT');
        results.push({ po_number, order_number, units: totalUnits, is_appended: isAppended });
      } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Import error for PO ${po_number}:`, err);
        errors.push({ po_number, error: publicErrorMessage(err, 'Server error while importing this order') });
      } finally {
        client.release();
      }
    }

    res.status(errors.length === orderMap.size ? 400 : 201).json({
      message: `Import complete. ${results.length} order(s) created, ${errors.length} failed.`,
      created: results,
      errors
    });
  });

  router.get('/', authorize(), async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT o.*, COALESCE(u.username, 'System') as creator_name, 
         (SELECT count(*) FROM order_units WHERE order_id = o.id) as unit_count,
         (SELECT count(*) FROM order_units WHERE order_id = o.id AND status = 'Dispatched') as dispatched_unit_count,
         (SELECT count(*) FROM order_line_items WHERE order_id = o.id) as line_item_count,
         c.name as company_name, l.city as company_city,
         oindentdoc.file_path as indent_file_path, oindentdoc.file_name as indent_file_name
         FROM orders o 
         LEFT JOIN users u ON o.created_by = u.id 
         LEFT JOIN company_locations l ON o.company_location_id = l.id
         LEFT JOIN companies c ON l.company_id = c.id
         LEFT JOIN LATERAL (
           SELECT file_path, file_name 
           FROM documents 
           WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'Indent' 
           ORDER BY uploaded_at DESC 
           LIMIT 1
         ) oindentdoc ON true
         ORDER BY o.created_at DESC`
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/:id', authorize(), async (req, res) => {
    try {
      const order = await pool.query(`
        SELECT o.*, c.name as company_name, l.city as company_city, l.address as company_address, l.person_in_charge, l.contact_number, l.email as company_email
        FROM orders o
        LEFT JOIN company_locations l ON o.company_location_id = l.id
        LEFT JOIN companies c ON l.company_id = c.id
        WHERE o.id = $1
      `, [req.params.id]);
      if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

      const lineItems = await pool.query('SELECT * FROM order_line_items WHERE order_id = $1 ORDER BY id ASC', [req.params.id]);
      const units = await pool.query('SELECT * FROM order_units WHERE order_id = $1 ORDER BY id ASC', [req.params.id]);
      const docs = await pool.query(
        `SELECT * FROM documents 
         WHERE (entity_type = 'Order' AND entity_id = $1) 
            OR (entity_type = 'Unit' AND entity_id IN (SELECT id FROM order_units WHERE order_id = $1))`,
        [req.params.id]
      );

      let docsList = docs.rows;
      const isSalesOrAccounts = ['Sales', 'Accounts', 'Admin', 'Manager'].includes(req.user.role);
      if (!isSalesOrAccounts) {
        docsList = docsList.filter(d => d.doc_type !== 'PO');
      }

      res.json({ ...order.rows[0], line_items: lineItems.rows, units: units.rows, documents: docsList });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/:id/steps', authorize(), async (req, res) => {
    try {
      // Self-healing: check if a PO document exists for this order
      const poDocCheck = await pool.query(
        `SELECT id FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO' LIMIT 1`,
        [req.params.id]
      );

      // Join with task_masters to get the field definitions template
      const result = await pool.query(`
        SELECT s.*, tm.custom_fields as tm_custom_fields, tm.order_fields as tm_order_fields
        FROM order_steps s
        LEFT JOIN task_masters tm ON s.task_id = tm.id
        WHERE s.order_id = $1
        ORDER BY s.step_order ASC, s.id ASC
      `, [req.params.id]);

      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      // Check if any step has custom fields requiring datakey resolution
      let preloadedOrderRow = null;
      const hasAnyCustomFields = result.rows.some(s => s.custom_fields || s.tm_custom_fields);
      if (hasAnyCustomFields) {
        const ordRes = await pool.query(
          `SELECT 
            o.order_number, o.po_number, o.delivery_date, o.order_date,
            o.notes as order_notes, o.priority, o.packaging_type,
            o.end_client_name, o.gst_number, o.reference_number, o.classification,
            o.hold_status, o.status as order_status, o.qc_status, o.qc_date,
            o.planned_dispatch_date, o.wiring_assigned_date, o.wiring_expected_date, o.expected_qc_date,
            c.name as company_name,
            cl.city as company_city, cl.person_in_charge, cl.contact_number, cl.email as company_email
          FROM orders o
          LEFT JOIN company_locations cl ON o.company_location_id = cl.id
          LEFT JOIN companies c ON cl.company_id = c.id
          WHERE o.id = $1`,
          [req.params.id]
        );
        if (ordRes.rows.length > 0) preloadedOrderRow = ordRes.rows[0];
      }

      // For each step, if its own custom_fields is empty, seed from task master definitions
      const steps = [];
      for (const step of result.rows) {
        if (step.name === 'Upload PO' && step.status !== 'done' && poDocCheck.rows.length > 0) {
          await pool.query(
            `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE id = $3`,
            ['PO uploaded (Auto-resolved).', updatedStr, step.id]
          );
          step.status = 'done';
          step.notes = 'PO uploaded (Auto-resolved).';
          step.updated = updatedStr;
        }

        let cf = [];
        try { cf = Array.isArray(step.custom_fields) ? step.custom_fields : JSON.parse(step.custom_fields || '[]'); } catch { cf = []; }

        if (cf.length === 0 && step.tm_custom_fields) {
          try {
            const tmCf = Array.isArray(step.tm_custom_fields) ? step.tm_custom_fields : JSON.parse(step.tm_custom_fields);
            cf = tmCf.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
          } catch { cf = []; }
        }

        // Resolve datakeys dynamically with preloadedOrderRow
        if (cf.length > 0) {
          cf = await resolveCustomFieldValues(cf, req.params.id, null, preloadedOrderRow);
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

        if (autoDone) {
          const deliveryField = cf.find(f => f.datakey && f.datakey.includes('delivery_date'));
          let dispatchDateVal = step.dispatch_date;
          if (deliveryField && deliveryField.value) {
            dispatchDateVal = deliveryField.value;
          }

          await pool.query(
            `UPDATE order_steps SET status = 'done', custom_fields = $1, dispatch_date = COALESCE($2, dispatch_date), updated = $3 WHERE id = $4`,
            [JSON.stringify(cf), dispatchDateVal || null, updatedStr, step.id]
          );
          step.status = 'done';
          step.dispatch_date = dispatchDateVal;
          step.updated = updatedStr;
        }

        // Pass order_fields config from task master to step
        let orderFields = [];
        try { orderFields = Array.isArray(step.tm_order_fields) ? step.tm_order_fields : JSON.parse(step.tm_order_fields || '[]'); } catch { orderFields = []; }

        const { tm_custom_fields, tm_order_fields, ...rest } = step;
        steps.push({ ...rest, custom_fields: cf, order_fields: orderFields });
      }

      res.json(steps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch order steps' });
    }
  });

  router.post('/:id/steps', authorize(OPERATOR_ROLES), async (req, res) => {
    const { taskId } = req.body;
    try {
      const taskResult = await pool.query('SELECT * FROM task_masters WHERE id = $1', [taskId]);
      if (taskResult.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
      const task = taskResult.rows[0];

      // Department operators may only add tasks for their own department (mirrors FlowView UI gating)
      if (!['Admin', 'Manager'].includes(req.user.role) && task.dept !== req.user.role) {
        return res.status(403).json({ error: 'Forbidden: You can only add tasks for your own department.' });
      }

      // Copy field definitions (without values) from task master
      let fieldDefs = [];
      try {
        const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
        fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
      } catch { fieldDefs = []; }

      const result = await pool.query(
        `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (SELECT COALESCE(MAX(step_order), 0) + 1 FROM order_steps WHERE order_id = $1 AND dept = $3)) RETURNING *`,
        [req.params.id, task.id, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs)]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to add step to order' });
    }
  });

  router.put('/:orderId/steps/reorder', authorize(OPERATOR_ROLES), async (req, res) => {
    const { orderedIds } = req.body; // Array of step IDs in the new order
    if (!orderedIds || !Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds array required' });
    const ids = orderedIds.map(v => Number(v));
    if (ids.some(v => !Number.isInteger(v) || v <= 0)) {
      return res.status(400).json({ error: 'orderedIds must contain positive integer step IDs' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // step_order is 0-based to match the previous per-step loop
      await client.query(
        `UPDATE order_steps s
            SET step_order = v.ord - 1
           FROM unnest($1::int[]) WITH ORDINALITY AS v(id, ord)
          WHERE s.id = v.id AND s.order_id = $2`,
        [ids, req.params.orderId]
      );
      await client.query('COMMIT');
      res.json({ message: 'Steps reordered successfully' });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Failed to reorder steps' });
    } finally {
      client.release();
    }
  });

  router.put('/:orderId/steps/:stepId', authorize(), async (req, res) => {
    if (await isOrderOnHold(req.params.orderId)) {
      return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
    }
    const { status, notes, dispatchDate, custom_fields } = req.body;
    const updated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Fetch step details to verify permissions
      const stepRes = await client.query(
        'SELECT dept, name, special FROM order_steps WHERE id = $1 AND order_id = $2 FOR UPDATE',
        [req.params.stepId, req.params.orderId]
      );
      if (stepRes.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Step not found' });
      }
      const step = stepRes.rows[0];

      const canEdit = ['Admin', 'Manager'].includes(req.user.role) || step.dept === req.user.role;
      if (!canEdit) {
        await client.query('ROLLBACK');
        return res.status(403).json({ error: 'Forbidden: You are not authorized to update this task.' });
      }

      // Upstream validation: block marking 'done' if upstream depts are incomplete
      if (status === 'done' && !['Admin', 'Manager'].includes(req.user.role)) {
        const myIndex = PIPELINE.indexOf(step.dept);
        if (myIndex > 0) {
          const upstreamDepts = PIPELINE.slice(0, myIndex);
          const blockingRes = await client.query(
            `SELECT DISTINCT dept FROM order_steps WHERE order_id = $1 AND dept = ANY($2::text[]) AND status NOT IN ('done')`,
            [req.params.orderId, upstreamDepts]
          );
          if (blockingRes.rows.length > 0) {
            const blocking = blockingRes.rows.map(r => r.dept).join(', ');
            await client.query('ROLLBACK');
            return res.status(409).json({ error: `Cannot complete: upstream departments not finished yet — ${blocking}.` });
          }
        }
      }

      // Mandatory Design gate on an order-level Release Documents step
      if (status === 'done' && isReleaseDocumentsStep(step)) {
        const gate = await evaluateOrderDesignGate(client, req.params.orderId);
        if (!gate.ok) {
          const detail = gate.failing.slice(0, 5).map(f => `${f.unit || f.unitId}: ${f.missing.join(', ')}`).join('; ');
          await client.query('ROLLBACK');
          return res.status(400).json({
            error: `Cannot complete Release Documents: Drawing, BOM and Design confirmation are required for every panel (${detail}${gate.failing.length > 5 ? '; …' : ''}).`
          });
        }
      }

      if (custom_fields) {
        await propagateCustomFieldsToDB(custom_fields, req.params.orderId, null, client);
      }

      let cfJson = null;
      if (custom_fields) {
        cfJson = JSON.stringify(custom_fields);
      }

      const result = await client.query(
        'UPDATE order_steps SET status = $1, notes = $2, dispatch_date = $3, updated = $4, custom_fields = COALESCE($5, custom_fields) WHERE id = $6 AND order_id = $7 RETURNING *',
        [status, notes, dispatchDate || null, updated, cfJson, req.params.stepId, req.params.orderId]
      );
      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Step not found' });
      }

      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, req.params.orderId, step.dept, `Updated step "${result.rows[0].name}" (Status: ${status})`]
      );

      // Auto-complete Step 2 (Release Documents) on Order level when Step 1 (Review & Classify) is Standard and marked Done
      if (step.dept === 'Design' && (result.rows[0].name === 'Review & Classify' || result.rows[0].name.toLowerCase().includes('classify'))) {
        let resolvedClassification = null;
        if (Array.isArray(custom_fields)) {
          const classField = custom_fields.find(f => f.datakey === 'classification' || f.id === 'classification' || f.label?.toLowerCase() === 'classification');
          if (classField && classField.value) {
            resolvedClassification = String(classField.value).trim();
          }
        }
        if (!resolvedClassification) {
          const oCheck = await client.query('SELECT classification FROM orders WHERE id = $1', [req.params.orderId]);
          if (oCheck.rows.length > 0) {
            resolvedClassification = oCheck.rows[0].classification;
          }
        }

        if (resolvedClassification && resolvedClassification.toLowerCase() === 'standard' && status === 'done') {
          const step2Res = await client.query(
            `SELECT id, status, notes FROM order_steps
             WHERE order_id = $1 AND dept = 'Design'
               AND (name = 'Release Documents' OR special = 'design')
             LIMIT 1`,
            [req.params.orderId]
          );
          if (step2Res.rows.length > 0 && step2Res.rows[0].status !== 'done') {
            // Same mandatory gate as a manual completion: Drawing + BOM + Design confirmation for every panel
            const gate = await evaluateOrderDesignGate(client, req.params.orderId);
            if (gate.ok) {
              const step2 = step2Res.rows[0];
              const autoNote = 'Auto-completed: Standard master drawings & BOM applied.';
              const finalNotes = step2.notes ? step2.notes : autoNote;
              await client.query(
                `UPDATE order_steps
                 SET status = 'done', notes = $1, updated = $2
                 WHERE id = $3`,
                [finalNotes, updated, step2.id]
              );
              await client.query(
                `INSERT INTO activity_logs (user_id, order_id, dept, action_text)
                 VALUES ($1, $2, 'Design', $3)`,
                [req.user.id, req.params.orderId, `Order: Step "Release Documents" auto-completed (Standard Panel)`]
              );
            }
          }
        }
      }

      if (step.dept === 'QC' && status === 'blocked') {
        const { qcFailTarget } = req.body;
        const target = qcFailTarget === 'design' ? 'Design' : 'Production';
        const remark = target === 'Design' ? 'Returned from QC — design re-check needed' : 'Returned from QC — rework required';

        await client.query(
          `UPDATE order_steps
           SET status = 'inprogress', notes = $1, updated = $2
           WHERE order_id = $3 AND dept = $4`,
          [remark, updated, req.params.orderId, target]
        );

        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text)
           VALUES ($1, $2, 'QC', $3)`,
          [req.user.id, req.params.orderId, `QC FAIL → returned to ${target} for ${target === 'Design' ? 're-check' : 'rework'}`]
        );
      }

      await updateOrderQCStatusFromSteps(req.params.orderId, client);

      // Re-evaluate unit statuses for all units in this order (e.g. when Sales completes Upload PO)
      const unitsForOrder = await client.query('SELECT id FROM order_units WHERE order_id = $1', [req.params.orderId]);
      for (const u of unitsForOrder.rows) {
        await deriveUnitStatus(u.id, client);
      }

      await client.query('COMMIT');
      res.json(result.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK').catch(() => {});
      console.error(err);
      res.status(500).json({ error: 'Failed to update step' });
    } finally {
      client.release();
    }
  });


  router.delete('/:orderId/steps/:stepId', authorize(['Admin', 'Manager']), async (req, res) => {
    try {
      const result = await pool.query(
        'DELETE FROM order_steps WHERE id = $1 AND order_id = $2 RETURNING *',
        [req.params.stepId, req.params.orderId]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Step not found' });

      // Also log this deletion
      await pool.query(
        'INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, $2, $3)',
        [req.user.id, result.rows[0].dept, `Deleted task step: ${result.rows[0].name}`]
      );

      res.json({ message: 'Step deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete step' });
    }
  });

  router.put('/:id/planning', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
    if (await isOrderOnHold(req.params.id)) {
      return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
    }
    const { priority, status, qc_status } = req.body;

    try {
      const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
      if (checkOrder.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
      const order_number = checkOrder.rows[0].order_number;

      // Only the planning fields that were sent are written; an empty value clears one.
      const sent = sentFieldAssignments(req.body, ORDER_PLANNING_FIELDS, 5);
      const result = await pool.query(
        `UPDATE orders
         SET ${sent.clauses.map(c => `${c},`).join(' ')}
             priority = COALESCE($1, priority),
             status = COALESCE($2, status),
             qc_status = COALESCE($3, qc_status)
         WHERE id = $4
         RETURNING *`,
        [
          priority,
          status,
          qc_status,
          req.params.id,
          ...sent.values
        ]
      );

      await pool.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [
          req.user.id,
          req.user.role,
          `Updated planning details for order ${order_number}`,
          req.params.id
        ]
      );

      res.json(result.rows[0]);
    } catch (err) {
      console.error('Failed to update planning details:', err);
      res.status(500).json({ error: 'Failed to update planning details' });
    }
  });

  return router;
}
