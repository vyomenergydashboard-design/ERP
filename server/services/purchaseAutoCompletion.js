/**
 * purchaseAutoCompletion.js
 * 
 * Automates marking the Purchase step ("Procure Materials") as DONE when:
 * All 4 material categories (Panel, Automation, Low voltage, Wires & Accessories)
 * are satisfied (either marked N/A or have Vendor POs with order given date and received date).
 */

export const PURCHASE_CATEGORIES = [
  { id: 'Panel', colKey: 'purchase_cat_panel' },
  { id: 'Automation', colKey: 'purchase_cat_automation' },
  { id: 'Low voltage', colKey: 'purchase_cat_low_voltage' },
  { id: 'Wires & Accessories', colKey: 'purchase_cat_wires' }
];

/**
 * Checks whether all 4 categories are satisfied for a single unit.
 * A category is satisfied if:
 *  1. Marked N/A in unit.custom_fields (e.g. purchase_cat_panel === 'NA')
 *  OR
 *  2. Has at least one linked Vendor PO in that category, and all linked POs
 *     have an order given date (p.date / created_at) AND received date (p.dateReceived / received_at / status == 'PO closed').
 */
export function checkUnitPurchaseCategoriesStatus(unit, linkedPOs = []) {
  let cf = {};
  try {
    cf = typeof unit.custom_fields === 'string'
      ? JSON.parse(unit.custom_fields || '{}')
      : (unit.custom_fields || {});
  } catch {
    cf = {};
  }

  const statusByCategory = {};

  for (const cat of PURCHASE_CATEGORIES) {
    // 1. Check if marked N/A
    if (cf[cat.colKey] === 'NA') {
      statusByCategory[cat.id] = { satisfied: true, reason: 'NA' };
      continue;
    }

    // 2. Check linked POs for this category
    const catPOs = linkedPOs.filter(po => {
      const c1 = String(po.category || '').trim().toLowerCase();
      const c2 = cat.id.toLowerCase();
      return c1 === c2;
    });

    if (catPOs.length === 0) {
      statusByCategory[cat.id] = { satisfied: false, reason: 'NO_PO' };
      continue;
    }

    // Check if every linked PO in this category has order given date AND received date / is closed
    const allCatPOsSatisfied = catPOs.every(po => {
      const isClosedStatus = (s) => {
        const str = String(s || '').trim().toLowerCase();
        return str === 'po closed' || str === 'closed';
      };

      const posArray = Array.isArray(po.pos) ? po.pos : [];
      if (posArray.length === 0) {
        // Fallback to top-level PO fields
        const hasOrderDate = Boolean(po.created_at || po.date);
        const hasRecDate = Boolean(po.received_at || po.dateReceived) || isClosedStatus(po.status);
        return hasOrderDate && hasRecDate;
      }

      return posArray.every(p => {
        const hasOrderDate = Boolean(p.date || p.createdDate || po.created_at);
        const hasRecDate = Boolean(p.dateReceived || p.receivedDate || po.received_at) || 
                           isClosedStatus(p.status) || 
                           isClosedStatus(po.status);
        return hasOrderDate && hasRecDate;
      });
    });

    if (allCatPOsSatisfied) {
      statusByCategory[cat.id] = { satisfied: true, reason: 'PO_RECEIVED' };
    } else {
      statusByCategory[cat.id] = { satisfied: false, reason: 'PO_PENDING' };
    }
  }

  const allSatisfied = PURCHASE_CATEGORIES.every(cat => statusByCategory[cat.id]?.satisfied);
  return { allSatisfied, statusByCategory };
}

/** Length of legacy vendor-PO serial references that stored only the last 4 digits. */
const LEGACY_SHORT_LEN = 4;

/**
 * Evaluates auto-completion for a set of unit IDs or serial numbers.
 * If all 4 categories are satisfied and "Procure Materials" is pending, marks it done and derives unit status.
 *
 * Matching is exact: a unit is identified by its exact unit_id or exact short_serial
 * (and, when allowed, its numeric order_units.id). The only fuzzy case is legacy
 * vendor-PO rows that stored a 4-character serial: such a row is linked to a unit only
 * when exactly one of the candidate units ends with those 4 characters.
 *
 * @param {Array<number|string>} identifiers - Unit IDs or unit serial numbers
 * @param {object} clientOrPool - pg Pool or client handle
 * @param {Function} [deriveUnitStatus] - deriveUnitStatus function reference
 * @param {{by?: 'auto'|'serial'|'id'}} [options]
 *   - 'serial': identifiers are serials only (never treated as order_units.id)
 *   - 'id': identifiers are order_units.id values only
 *   - 'auto' (default): numbers are ids; strings are serials, and all-digit strings
 *     shorter than 8 chars are additionally tried as ids
 * @returns {Promise<Array<object>>} - List of units updated
 */
export async function evaluatePurchaseAutoCompletion(identifiers, clientOrPool, deriveUnitStatus = null, options = {}) {
  if (!identifiers || !Array.isArray(identifiers) || identifiers.length === 0) {
    return [];
  }
  const by = options?.by === 'serial' || options?.by === 'id' ? options.by : 'auto';

  // Separate integer IDs and string serial numbers
  const intIds = [];
  const stringSerials = [];
  for (const raw of identifiers) {
    if (raw === null || raw === undefined) continue;
    const str = String(raw).trim();
    if (!str) continue;
    const isAllDigits = /^\d+$/.test(str);

    if (by === 'id') {
      if (isAllDigits) intIds.push(parseInt(str, 10));
      continue;
    }
    if (by === 'serial') {
      stringSerials.push(str);
      continue;
    }
    // auto
    if (typeof raw === 'number') {
      intIds.push(raw);
      continue;
    }
    if (isAllDigits && str.length < 8) intIds.push(parseInt(str, 10));
    stringSerials.push(str);
  }

  // 1. Fetch matching units (exact matches only)
  const params = [];
  const conditions = [];

  if (intIds.length > 0) {
    params.push(intIds);
    conditions.push(`id = ANY($${params.length}::int[])`);
  }
  if (stringSerials.length > 0) {
    params.push(stringSerials);
    conditions.push(`unit_id = ANY($${params.length}::text[])`);
    conditions.push(`short_serial = ANY($${params.length}::text[])`);
  }

  if (conditions.length === 0) return [];

  const unitsRes = await clientOrPool.query(
    `SELECT id, unit_id, short_serial, order_id, custom_fields, current_dept, status
     FROM order_units
     WHERE ${conditions.join(' OR ')}`,
    params
  );

  const units = unitsRes.rows;
  if (units.length === 0) return [];

  // Collect exact serials to query vendor_purchase_order_units
  const allSerials = new Set();
  const legacyKeys = new Set();
  units.forEach(u => {
    for (const v of [u.unit_id, u.short_serial]) {
      const s = String(v || '').trim();
      if (!s) continue;
      allSerials.add(s);
      if (s.length >= LEGACY_SHORT_LEN) legacyKeys.add(s.slice(-LEGACY_SHORT_LEN));
    }
  });

  // 2. Query vendor purchase orders linked to these serials: exact matches, plus
  //    legacy rows whose stored value is exactly 4 characters long.
  const posRes = await clientOrPool.query(
    `SELECT vpo.id, vpo.category, vpo.pos, vpo.status, vpo.received_at, vpo.created_at, vpou.unit_serial
     FROM vendor_purchase_order_units vpou
     JOIN vendor_purchase_orders vpo ON vpou.vendor_purchase_order_id = vpo.id
     WHERE vpou.unit_serial = ANY($1::text[])
        OR (length(vpou.unit_serial) = ${LEGACY_SHORT_LEN} AND vpou.unit_serial = ANY($2::text[]))`,
    [Array.from(allSerials), Array.from(legacyKeys)]
  );

  // Legacy 4-char values are resolved only when they identify exactly one unit
  // among all units sharing that suffix (checked DB-wide, not just this batch).
  const legacyValues = Array.from(new Set(
    posRes.rows
      .map(r => String(r.unit_serial || '').trim())
      .filter(s => s.length === LEGACY_SHORT_LEN && !allSerials.has(s))
  ));
  const legacyOwner = new Map(); // 4-char value -> order_units.id (only when unique)
  if (legacyValues.length > 0) {
    const candRes = await clientOrPool.query(
      `SELECT k AS key, array_agg(DISTINCT ou.id) AS ids
       FROM unnest($1::text[]) AS k
       JOIN order_units ou ON RIGHT(ou.unit_id, ${LEGACY_SHORT_LEN}) = k OR RIGHT(ou.short_serial, ${LEGACY_SHORT_LEN}) = k
       GROUP BY k`,
      [legacyValues]
    );
    for (const row of candRes.rows) {
      if (Array.isArray(row.ids) && row.ids.length === 1) {
        legacyOwner.set(row.key, Number(row.ids[0]));
      } else {
        console.warn(`[purchaseAutoCompletion] Legacy 4-digit vendor PO serial '${row.key}' is ambiguous (${row.ids?.length || 0} candidate units); not matched.`);
      }
    }
  }

  // 3. Evaluate each unit
  const satisfiedIds = [];
  const statusById = new Map();
  for (const unit of units) {
    const uSerial = String(unit.unit_id || '').trim();
    const uShort = String(unit.short_serial || '').trim();

    const unitPOs = posRes.rows.filter(po => {
      const s = String(po.unit_serial || '').trim();
      if (!s) return false;
      if (s === uSerial || (uShort && s === uShort)) return true;
      return legacyOwner.get(s) === Number(unit.id);
    });

    const { allSatisfied, statusByCategory } = checkUnitPurchaseCategoriesStatus(unit, unitPOs);
    if (allSatisfied) {
      satisfiedIds.push(unit.id);
      statusById.set(Number(unit.id), { unitSerial: unit.unit_id, statusByCategory });
    }
  }

  if (satisfiedIds.length === 0) return [];

  // 4. Complete all pending 'Procure Materials' steps in one statement
  const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const updRes = await clientOrPool.query(
    `UPDATE unit_steps
     SET status = 'done',
         notes = 'Auto-completed (All categories have POs with order & received dates or N/A)',
         updated = $2
     WHERE order_unit_id = ANY($1::int[])
       AND dept = 'Purchase' AND name = 'Procure Materials'
       AND status <> 'done'
     RETURNING order_unit_id`,
    [satisfiedIds, updatedStr]
  );

  const changedIds = Array.from(new Set(updRes.rows.map(r => Number(r.order_unit_id))));
  const updatedUnits = [];
  for (const unitId of changedIds) {
    if (typeof deriveUnitStatus === 'function') {
      await deriveUnitStatus(unitId, clientOrPool);
    }
    const info = statusById.get(unitId) || {};
    updatedUnits.push({ unitId, unitSerial: info.unitSerial, statusByCategory: info.statusByCategory });
  }

  return updatedUnits;
}
