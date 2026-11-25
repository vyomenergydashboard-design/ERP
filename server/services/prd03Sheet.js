// Data behind the PRD-03 "Panel Production Plan" form for one panel (unit). Read-only: no writes,
// no deriveUnitStatus, no auto-completion. Every value comes straight from stored data; nothing is
// guessed (Project is project_name only, document numbers are file names only).

const toIso = (v) => (v instanceof Date ? v.toISOString() : v ?? null);

// One form row. Dates are 'YYYY-MM-DD' strings, ISO timestamps, 'Standard' / 'N/A', or null.
const row = (key, start = null, end = null, reference = null) => ({
  key,
  start: toIso(start),
  end: toIso(end),
  reference,
});

// Standard panels take their documents from the part number master; every other panel uses its own.
const isStandardClassification = (classification) => String(classification || '').trim().toLowerCase() === 'standard';

/**
 * File name and upload instant of the BOM and the Drawing that apply to a panel.
 * Standard panels use the current document of their part number master (unit uploads are ignored);
 * every other panel uses its own newest upload. A missing document gives nulls.
 * @param {import('pg').Pool|import('pg').PoolClient} db
 * @param {{ id: number, classification: string|null, partNumber: string|null }} unit
 * @returns {Promise<{ bom: DocFact, drawing: DocFact }>} DocFact = { fileName, uploadedAt }
 */
export async function loadDocFacts(db, unit) {
  const isStandard = isStandardClassification(unit.classification);
  const none = { fileName: null, uploadedAt: null };
  const load = async (docType) => {
    let res;
    if (isStandard) {
      if (!unit.partNumber) return none;
      res = await db.query(
        `SELECT pd.file_name, pd.uploaded_at
         FROM part_number_masters pm
         JOIN part_number_documents pd ON pd.part_number_id = pm.id
         WHERE LOWER(TRIM(pm.part_number)) = LOWER(TRIM($1))
           AND pd.is_current AND UPPER(pd.doc_type) = $2
         ORDER BY pd.revision_number DESC, pd.id DESC
         LIMIT 1`,
        [unit.partNumber, docType]
      );
    } else {
      res = await db.query(
        `SELECT file_name, uploaded_at
         FROM documents
         WHERE entity_type = 'Unit' AND entity_id = $1 AND UPPER(doc_type) = $2
         ORDER BY uploaded_at DESC NULLS LAST, id DESC
         LIMIT 1`,
        [unit.id, docType]
      );
    }
    const r = res.rows[0];
    return r ? { fileName: r.file_name, uploadedAt: toIso(r.uploaded_at) } : none;
  };
  return { bom: await load('BOM'), drawing: await load('DRAWING') };
}

// BOM / Drawing form row: Standard panels show 'Standard' in both date columns, others the upload instant.
const docRow = (key, isStandard, doc) =>
  isStandard ? row(key, 'Standard', 'Standard') : row(key, doc.uploadedAt, doc.uploadedAt);

// Purchase category -> the unit custom field that marks it "not applicable" (value 'NA').
const PURCHASE_CATEGORIES = {
  Panel: 'purchase_cat_panel',
  Automation: 'purchase_cat_automation',
  'Low voltage': 'purchase_cat_low_voltage',
  'Wires & Accessories': 'purchase_cat_wires',
};

// Same closed test as the Purchase table (purchaseCells.jsx).
const isClosedStatus = (status) => {
  const s = String(status || '').trim().toLowerCase();
  return s === 'po closed' || s === 'closed';
};

const hasDate = (v) => v != null && v !== '' && !Number.isNaN(Date.parse(toIso(v)));

/**
 * Purchase dates and PO numbers per category for one panel, from the vendor purchase orders linked
 * to its serial (matched on the full serial, exactly; category compared case-insensitively).
 * Start = earliest PO date. End = latest received date, only once every PO is closed.
 * Reference = PO numbers in stored order. A category marked N/A on the unit shows 'N/A' in both
 * date columns, unless a PO is linked to it (PO data wins).
 * @param {import('pg').Pool|import('pg').PoolClient} db
 * @param {{ serial: string, customFields: object|null }} unit
 * @returns {Promise<Record<string, { start: string|null, end: string|null, reference: string|null }>>}
 */
export async function loadPurchaseFacts(db, unit) {
  const res = await db.query(
    `SELECT vpo.order_uid, vpo.category, vpo.pos, vpo.status, vpo.created_at, vpo.received_at
     FROM vendor_purchase_orders vpo
     WHERE EXISTS (SELECT 1 FROM vendor_purchase_order_units vpou
                   WHERE vpou.vendor_purchase_order_id = vpo.id AND vpou.unit_serial = $1)
     ORDER BY vpo.id`,
    [unit.serial]
  );
  const fields = unit.customFields && typeof unit.customFields === 'object' ? unit.customFields : {};
  const facts = {};
  for (const [category, naKey] of Object.entries(PURCHASE_CATEGORIES)) {
    const entries = [];
    for (const vpo of res.rows) {
      if (String(vpo.category || '').trim().toLowerCase() !== category.toLowerCase()) continue;
      const pos = Array.isArray(vpo.pos) ? vpo.pos.filter((p) => p && typeof p === 'object') : [];
      if (pos.length === 0) {
        entries.push({ poNumber: vpo.order_uid, status: vpo.status, created: vpo.created_at, received: vpo.received_at });
      } else {
        for (const p of pos) {
          entries.push({
            poNumber: p.poNumber,
            status: p.status,
            created: p.date || vpo.created_at,
            received: p.dateReceived || vpo.received_at,
          });
        }
      }
    }
    if (entries.length === 0) {
      const na = fields[naKey] === 'NA' ? 'N/A' : null;
      facts[category] = { start: na, end: na, reference: null };
      continue;
    }
    const earliest = (list) => list.reduce((a, b) => (Date.parse(toIso(b)) < Date.parse(toIso(a)) ? b : a));
    const latest = (list) => list.reduce((a, b) => (Date.parse(toIso(b)) > Date.parse(toIso(a)) ? b : a));
    const created = entries.map((e) => e.created).filter(hasDate);
    const received = entries.map((e) => e.received).filter(hasDate);
    const allClosed = entries.every((e) => isClosedStatus(e.status));
    // First occurrence wins, stored order kept (the same PO number can sit in two vendor orders).
    const poNumbers = [...new Set(entries.map((e) => e.poNumber).filter((n) => n != null && String(n).trim() !== ''))];
    facts[category] = {
      start: created.length ? toIso(earliest(created)) : null,
      end: allClosed && received.length ? toIso(latest(received)) : null,
      reference: poNumbers.length ? poNumbers.join(', ') : null,
    };
  }
  return facts;
}

const purchaseRow = (key, fact) => row(key, fact.start, fact.end, fact.reference);

/**
 * @param {import('pg').Pool|import('pg').PoolClient} db
 * @param {number|string} unitDbId order_units.id
 * @returns {Promise<object|null>} the sheet, or null when the unit does not exist
 */
export async function getPrd03Sheet(db, unitDbId) {
  const unitRes = await db.query(
    `SELECT ou.id, ou.unit_id AS serial,
            COALESCE(ou.classification, o.classification, 'Standard') AS classification,
            oli.part_number, ou.custom_fields,
            COALESCE(oli.project_name, o.project_name) AS project_name,
            o.packaging_type, creator.username AS sales_person,
            to_char(ou.dispatch_date, 'YYYY-MM-DD') AS dispatch_date,
            ou.mounting_start_date, ou.mounting_complete_date,
            ou.wiring_start_date, ou.wiring_complete_date,
            ou.qc_start_date, ou.qc_complete_date
     FROM order_units ou
     LEFT JOIN orders o ON ou.order_id = o.id
     LEFT JOIN users creator ON o.created_by = creator.id
     LEFT JOIN order_line_items oli ON ou.line_item_id = oli.id
     WHERE ou.id = $1`,
    [unitDbId]
  );
  if (unitRes.rows.length === 0) return null;
  const u = unitRes.rows[0];
  const isStandard = isStandardClassification(u.classification);
  const docs = await loadDocFacts(db, { id: u.id, classification: u.classification, partNumber: u.part_number });
  const purchase = await loadPurchaseFacts(db, { serial: u.serial, customFields: u.custom_fields });

  return {
    projectName: u.project_name || null,
    salesPerson: u.sales_person || null, // username of the user who created the order
    bomNumber: docs.bom.fileName,
    drawingNumber: docs.drawing.fileName,
    instructionForDispatch: u.packaging_type || null,
    dateOfCompletion: u.dispatch_date || null,
    rows: [
      docRow('bom', isStandard, docs.bom),
      docRow('drawing', isStandard, docs.drawing),
      purchaseRow('cabinet', purchase['Panel']),
      purchaseRow('automation', purchase['Automation']),
      purchaseRow('low_voltage', purchase['Low voltage']),
      purchaseRow('wires', purchase['Wires & Accessories']),
      row('mounting', u.mounting_start_date, u.mounting_complete_date),
      row('wiring', u.wiring_start_date, u.wiring_complete_date),
      row('internal_inspection', u.qc_start_date, u.qc_complete_date),
      row('fat', u.qc_start_date, u.qc_complete_date),
    ],
  };
}
