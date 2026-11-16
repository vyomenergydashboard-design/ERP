/**
 * storesAutoCompletion.js
 *
 * Automates:
 * 1. Marking all Stores unit_steps as DONE when both tray_start_date and issued_date are present.
 * 2. Reverting Stores unit_steps that THIS module auto-completed when either date goes missing
 *    (e.g. tray status changed to non-issued). Manually completed steps are never reverted.
 * 3. Calling deriveUnitStatus to advance to Production (or regress back to Stores).
 */

export const STORES_AUTO_COMPLETE_NOTE = 'Auto-completed (Tray started and material issued)';

export async function evaluateStoresAutoCompletion(unitIds, clientOrPool, deriveUnitStatus = null) {
  if (!Array.isArray(unitIds) || unitIds.length === 0) return [];

  const numIds = [];
  const strIds = [];
  for (const raw of unitIds) {
    if (raw === null || raw === undefined) continue;
    const str = String(raw).trim();
    if (!str) continue;
    if (/^\d+$/.test(str) && Number(str) <= 2147483647) numIds.push(Number(str));
    strIds.push(str);
  }
  if (numIds.length === 0 && strIds.length === 0) return [];

  const unitsRes = await clientOrPool.query(
    `SELECT id, unit_id, tray_status, tray_start_date, issued_date, current_dept
     FROM order_units
     WHERE id = ANY($1::int[]) OR unit_id = ANY($2::text[])`,
    [numIds, strIds]
  );
  if (unitsRes.rows.length === 0) return [];

  const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const satisfiedIds = [];
  const revertToInProgress = [];
  const revertToPending = [];
  for (const unit of unitsRes.rows) {
    const hasStartDate = Boolean(unit.tray_start_date);
    const hasIssuedDate = Boolean(unit.issued_date);
    if (hasStartDate && hasIssuedDate) satisfiedIds.push(unit.id);
    else if (hasStartDate) revertToInProgress.push(unit.id);
    else revertToPending.push(unit.id);
  }

  const results = new Map(); // unitId -> action

  // Both dates present -> auto-complete all open Stores steps in one statement
  if (satisfiedIds.length > 0) {
    const res = await clientOrPool.query(
      `UPDATE unit_steps
       SET status = 'done', notes = $2, updated = $3
       WHERE order_unit_id = ANY($1::int[]) AND dept = 'Stores' AND status <> 'done'
       RETURNING order_unit_id`,
      [satisfiedIds, STORES_AUTO_COMPLETE_NOTE, updatedStr]
    );
    for (const r of res.rows) results.set(Number(r.order_unit_id), 'completed');
  }

  // One or both dates missing -> revert ONLY steps this module auto-completed
  const revert = async (ids, revertStatus) => {
    if (ids.length === 0) return;
    const res = await clientOrPool.query(
      `UPDATE unit_steps
       SET status = $2, notes = 'Awaiting Tray Issue', updated = $3
       WHERE order_unit_id = ANY($1::int[]) AND dept = 'Stores' AND status = 'done' AND notes = $4
       RETURNING order_unit_id`,
      [ids, revertStatus, updatedStr, STORES_AUTO_COMPLETE_NOTE]
    );
    if (res.rowCount > 0) {
      for (const r of res.rows) results.set(Number(r.order_unit_id), 'reverted');
    }
  };
  await revert(revertToInProgress, 'inprogress');
  await revert(revertToPending, 'pending');

  const updatedUnits = [];
  for (const [unitId, action] of results) {
    if (typeof deriveUnitStatus === 'function') {
      await deriveUnitStatus(unitId, clientOrPool);
    }
    updatedUnits.push({ unitId, action });
  }

  return updatedUnits;
}
