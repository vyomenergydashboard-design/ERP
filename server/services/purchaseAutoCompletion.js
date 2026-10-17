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

/**
 * Evaluates auto-completion for a set of unit IDs or serial numbers.
 * If all 4 categories are satisfied and "Procure Materials" is pending, marks it done and derives unit status.
 * 
 * @param {Array<number|string>} identifiers - Unit IDs or unit serial numbers
 * @param {object} clientOrPool - pg Pool or client handle
 * @param {Function} [deriveUnitStatus] - deriveUnitStatus function reference
 * @returns {Promise<Array<object>>} - List of units updated
 */
export async function evaluatePurchaseAutoCompletion(identifiers, clientOrPool, deriveUnitStatus = null) {
  if (!identifiers || !Array.isArray(identifiers) || identifiers.length === 0) {
    return [];
  }

  // Separate integer IDs and string serial numbers
  const intIds = [];
  const stringSerials = [];
  for (const id of identifiers) {
    if (typeof id === 'number' || (/^\d+$/.test(String(id)) && String(id).length < 8)) {
      intIds.push(parseInt(id, 10));
    }
    stringSerials.push(String(id).trim());
  }

  // 1. Fetch matching units
  let unitsQuery = `
    SELECT id, unit_id, short_serial, order_id, custom_fields, current_dept, status
    FROM order_units
    WHERE 1=0
  `;
  const params = [];
  const conditions = [];

  if (intIds.length > 0) {
    params.push(intIds);
    conditions.push(`id = ANY($${params.length})`);
  }
  if (stringSerials.length > 0) {
    params.push(stringSerials);
    conditions.push(`unit_id = ANY($${params.length})`);
    params.push(stringSerials);
    conditions.push(`short_serial = ANY($${params.length})`);
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

  // Collect all unit serials to query vendor_purchase_order_units
  const allSerials = new Set();
  const allShortSerials = new Set();
  units.forEach(u => {
    if (u.unit_id) {
      allSerials.add(String(u.unit_id).trim());
      allShortSerials.add(String(u.unit_id).trim().slice(-4));
    }
    if (u.short_serial) {
      allSerials.add(String(u.short_serial).trim());
      allShortSerials.add(String(u.short_serial).trim().slice(-4));
    }
  });

  const serialArray = Array.from(allSerials);
  const shortSerialArray = Array.from(allShortSerials);

  // 2. Query vendor purchase orders linked to these serials
  let posRes = { rows: [] };
  if (serialArray.length > 0) {
    posRes = await clientOrPool.query(
      `SELECT vpo.id, vpo.category, vpo.pos, vpo.status, vpo.received_at, vpo.created_at, vpou.unit_serial
       FROM vendor_purchase_order_units vpou
       JOIN vendor_purchase_orders vpo ON vpou.vendor_purchase_order_id = vpo.id
       WHERE vpou.unit_serial = ANY($1) 
          OR RIGHT(vpou.unit_serial, 4) = ANY($2)`,
      [serialArray, shortSerialArray]
    );
  }

  const updatedUnits = [];
  const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // 3. Evaluate each unit
  for (const unit of units) {
    // Find all POs matching this unit's serial or short serial
    const uSerial = String(unit.unit_id || '').trim();
    const uShort = String(unit.short_serial || uSerial.slice(-4)).trim();

    const unitPOs = posRes.rows.filter(po => {
      const s = String(po.unit_serial || '').trim();
      return s === uSerial || s === uShort || s.slice(-4) === uShort;
    });

    const { allSatisfied, statusByCategory } = checkUnitPurchaseCategoriesStatus(unit, unitPOs);

    if (allSatisfied) {
      // Find "Procure Materials" step in unit_steps
      const stepRes = await clientOrPool.query(
        `SELECT id, status FROM unit_steps 
         WHERE order_unit_id = $1 AND dept = 'Purchase' AND name = 'Procure Materials'`,
        [unit.id]
      );

      if (stepRes.rows.length > 0) {
        const step = stepRes.rows[0];
        if (step.status !== 'done') {
          await clientOrPool.query(
            `UPDATE unit_steps 
             SET status = 'done', 
                 notes = 'Auto-completed (All categories have POs with order & received dates or N/A)',
                 updated = $1
             WHERE id = $2`,
            [updatedStr, step.id]
          );

          if (typeof deriveUnitStatus === 'function') {
            await deriveUnitStatus(unit.id, clientOrPool);
          }

          updatedUnits.push({
            unitId: unit.id,
            unitSerial: unit.unit_id,
            statusByCategory
          });
        }
      }
    }
  }

  return updatedUnits;
}
