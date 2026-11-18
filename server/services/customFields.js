// Task custom fields: resolve datakey values for display and write allowed ones back.
import pool from '../db.js';

export const resolveCustomFieldValues = async (customFields, orderId, unitId = null, preloadedRow = null) => {
  if (!customFields || !Array.isArray(customFields) || customFields.length === 0) {
    return customFields;
  }

  let dbRow = preloadedRow;
  if (!dbRow && unitId) {
    const res = await pool.query(
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
      [unitId]
    );
    if (res.rows.length > 0) dbRow = res.rows[0];
  } else if (orderId) {
    const res = await pool.query(
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
      [orderId]
    );
    if (res.rows.length > 0) dbRow = res.rows[0];
  }

  // Resolve each custom field
  const results = [];
  for (const f of customFields) {
    if (!f.datakey) { results.push(f); continue; }

    const rawKey = f.datakey.trim();

    // ── Document count datakeys (docs.any, docs.PO, docs.Drawing, etc.) ──
    if (rawKey.startsWith('docs.')) {
      const docType = rawKey.slice(5); // e.g. "PO", "any", "Drawing"
      try {
        let count = 0;

        // 1. Resolve order id from context
        let resolvedOrderId = orderId;
        if (!resolvedOrderId && unitId && dbRow) {
          const oRes = await pool.query(`SELECT order_id FROM order_units WHERE id = $1`, [unitId]);
          if (oRes.rows.length > 0) resolvedOrderId = oRes.rows[0].order_id;
        }

        // 2. Query order-level documents + order-step documents
        if (resolvedOrderId) {
          let docRes;
          if (docType === 'any') {
            docRes = await pool.query(
              `SELECT COUNT(*) as cnt FROM documents 
               WHERE (entity_type = 'Order' AND entity_id = $1)
                  OR (entity_type = 'Step' AND entity_id IN (SELECT id FROM order_steps WHERE order_id = $1))`,
              [resolvedOrderId]
            );
          } else {
            docRes = await pool.query(
              `SELECT COUNT(*) as cnt FROM documents 
               WHERE (entity_type = 'Order' AND entity_id = $1 AND doc_type = $2)
                  OR (entity_type = 'Step' AND entity_id IN (SELECT id FROM order_steps WHERE order_id = $1) AND doc_type = $2)`,
              [resolvedOrderId, docType]
            );
          }
          count += parseInt(docRes.rows[0]?.cnt || '0', 10);
        }

        // 3. Query unit-level documents + unit-step documents
        if (unitId) {
          let unitDocRes;
          if (docType === 'any') {
            unitDocRes = await pool.query(
              `SELECT COUNT(*) as cnt FROM documents 
               WHERE (entity_type = 'Unit' AND entity_id = $1)
                  OR (entity_type = 'Step' AND entity_id IN (SELECT id FROM unit_steps WHERE order_unit_id = $1))`,
              [unitId]
            );
          } else {
            unitDocRes = await pool.query(
              `SELECT COUNT(*) as cnt FROM documents 
               WHERE (entity_type = 'Unit' AND entity_id = $1 AND doc_type = $2)
                  OR (entity_type = 'Step' AND entity_id IN (SELECT id FROM unit_steps WHERE order_unit_id = $1) AND doc_type = $2)`,
              [unitId, docType]
            );
          }
          count += parseInt(unitDocRes.rows[0]?.cnt || '0', 10);
        }

        // Return count as value; 0 → empty string so "any non-empty" check correctly fails
        results.push({ ...f, value: count > 0 ? count : '' });
      } catch (err) {
        console.error('Failed resolving docs datakey:', rawKey, err);
        results.push(f);
      }
      continue;
    }

    // ── Regular DB column datakeys ──
    if (!dbRow) { results.push(f); continue; }
    const key = rawKey.includes('.') ? rawKey.split('.').slice(-1)[0] : rawKey;
    const matchedKey = Object.keys(dbRow).find(k => k.toLowerCase() === key.toLowerCase());
    if (matchedKey && dbRow[matchedKey] !== null && dbRow[matchedKey] !== undefined) {
      const val = dbRow[matchedKey];
      let resolvedValue = val;
      if (f.type === 'Date' || val instanceof Date) {
        try {
          const d = new Date(val);
          if (!isNaN(d.getTime())) resolvedValue = d.toISOString().split('T')[0];
        } catch { }
      } else if (f.type === 'Yes/No') {
        resolvedValue = val === true || String(val).toLowerCase() === 'yes';
      } else {
        resolvedValue = String(val);
      }
      results.push({ ...f, value: resolvedValue });
    } else {
      results.push(f);
    }
  }
  return results;
};

// Explicit allowlist of business columns a task custom field (datakey) may write.
// Workflow/identity columns (current_dept, status, design_confirmed*, sales_cleared*, hold_*, cancelled_*,
// po_override_unlinked, order_number, unit_id, short_serial, line_item_number, ids, FKs, custom_fields)
// are deliberately excluded. Table and column names are only ever interpolated from this map.
const CUSTOM_FIELD_WRITABLE_COLUMNS = Object.freeze({
  orders: new Set([
    'po_number', 'order_date', 'delivery_date', 'planned_dispatch_date', 'priority', 'classification',
    'packaging_type', 'end_client_name', 'project_name', 'reference_number', 'gst_number', 'notes',
    'wiring_assigned_date', 'wiring_expected_date', 'expected_qc_date', 'qc_date', 'qc_status',
  ]),
  order_line_items: new Set([
    'material_description', 'part_number', 'panel_type_size', 'delivery_date', 'unit', 'unit_price',
    'total_price', 'notes', 'project_name', 'tag', 'panel_code', 'panel_ip_rating',
    'planned_dispatch_date', 'wiring_assigned_date', 'wiring_expected_date', 'expected_qc_date',
    'qc_status', 'qc_date', 'mounting_start_date', 'mounting_complete_date', 'tray_status',
    'tray_start_date', 'issued_date', 'wiremen', 'wiring_start_date', 'wiring_complete_date',
    'pending_material_complete_date', 'handover_to_qc_date', 'qc_receiving_date', 'qc_start_date',
    'qc_complete_date', 'dispatch_date', 'invoice_number', 'invoice_date',
  ]),
  order_units: new Set([
    'po_number', 'panel_type_size', 'classification', 'tag', 'panel_code', 'panel_ip_rating',
    'planned_dispatch_date', 'wiring_assigned_date', 'wiring_expected_date', 'expected_qc_date',
    'qc_status', 'qc_date', 'mounting_start_date', 'mounting_complete_date', 'tray_status',
    'tray_start_date', 'issued_date', 'wiremen', 'wiring_start_date', 'wiring_complete_date',
    'pending_material_complete_date', 'handover_to_qc_date', 'qc_receiving_date', 'qc_start_date',
    'qc_complete_date', 'dispatch_date', 'invoice_number', 'invoice_date',
  ]),
});

// Datakey prefixes (as offered in Masters DATAKEY_OPTIONS) mapped to their target table.
const CUSTOM_FIELD_PREFIX_TABLE = Object.freeze({
  orders: 'orders', order: 'orders', o: 'orders',
  li: 'order_line_items', line_item: 'order_line_items', order_line_items: 'order_line_items',
  unit: 'order_units', units: 'order_units', ou: 'order_units', order_units: 'order_units',
});

export const propagateCustomFieldsToDB = async (customFields, orderId, unitId = null, client = pool) => {
  if (!customFields || !Array.isArray(customFields) || customFields.length === 0) {
    return;
  }

  // Get order_id if only unitId is provided
  let resolvedOrderId = orderId;
  let lineItemId = null;
  if (unitId) {
    const unitRes = await client.query(
      `SELECT order_id, line_item_id FROM order_units WHERE id = $1`,
      [unitId]
    );
    if (unitRes.rows.length > 0) {
      resolvedOrderId = unitRes.rows[0].order_id;
      lineItemId = unitRes.rows[0].line_item_id;
    }
  }

  const targetIds = {
    orders: resolvedOrderId || null,
    order_line_items: lineItemId || null,
    order_units: unitId || null,
  };

  for (const f of customFields) {
    if (!f || typeof f.datakey !== 'string' || f.value === undefined || f.value === null) continue;
    const rawKey = f.datakey.trim();
    if (!rawKey || rawKey.startsWith('docs.')) continue;

    const parts = rawKey.split('.');
    const column = parts[parts.length - 1].toLowerCase();
    const prefix = parts.length > 1 ? parts[0].toLowerCase() : null;
    const prefixedTable = prefix ? CUSTOM_FIELD_PREFIX_TABLE[prefix] : null;

    // Explicit prefix → only that table; otherwise the legacy precedence orders → line items → units.
    const candidateTables = prefixedTable ? [prefixedTable] : ['orders', 'order_line_items', 'order_units'];
    const table = candidateTables.find(t => CUSTOM_FIELD_WRITABLE_COLUMNS[t].has(column) && targetIds[t]);
    if (!table) continue;

    let valToSave = f.value;
    if (f.type === 'Yes/No') {
      valToSave = f.value === true || String(f.value).toLowerCase() === 'yes';
    }
    // table/column come exclusively from CUSTOM_FIELD_WRITABLE_COLUMNS above
    await client.query(
      `UPDATE ${table} SET ${column} = $1 WHERE id = $2`,
      [valToSave, targetIds[table]]
    );
  }
};
