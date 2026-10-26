/**
 * storesAutoCompletion.js
 * 
 * Automates:
 * 1. Marking all Stores unit_steps as DONE when both tray_start_date and issued_date are present.
 * 2. Reverting Stores unit_steps from DONE when either date goes missing (e.g. tray status changed to non-issued).
 * 3. Calling deriveUnitStatus to advance to Production (or regress back to Stores).
 */

export async function evaluateStoresAutoCompletion(unitIds, clientOrPool, deriveUnitStatus = null) {
  if (!Array.isArray(unitIds) || unitIds.length === 0) return [];

  const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const updatedUnits = [];

  for (const rawId of unitIds) {
    const numId = !isNaN(Number(rawId)) ? Number(rawId) : -1;
    const res = await clientOrPool.query(
      `SELECT id, unit_id, tray_status, tray_start_date, issued_date, current_dept
       FROM order_units 
       WHERE id = $1 OR unit_id = $2`,
      [numId, String(rawId)]
    );

    if (res.rows.length === 0) continue;
    const unit = res.rows[0];

    const hasStartDate = Boolean(unit.tray_start_date);
    const hasIssuedDate = Boolean(unit.issued_date);
    const isSatisfied = hasStartDate && hasIssuedDate;

    if (isSatisfied) {
      // Both dates present -> auto-complete all Stores steps for this unit
      const pendingStepsRes = await clientOrPool.query(
        `SELECT id, name, status FROM unit_steps 
         WHERE order_unit_id = $1 AND dept = 'Stores' AND status != 'done'`,
        [unit.id]
      );

      if (pendingStepsRes.rows.length > 0) {
        await clientOrPool.query(
          `UPDATE unit_steps 
           SET status = 'done', 
               notes = 'Auto-completed (Tray started and material issued)',
               updated = $1
           WHERE order_unit_id = $2 AND dept = 'Stores' AND status != 'done'`,
          [updatedStr, unit.id]
        );

        if (typeof deriveUnitStatus === 'function') {
          await deriveUnitStatus(unit.id, clientOrPool);
        }

        updatedUnits.push({ unitId: unit.id, action: 'completed' });
      }
    } else {
      // One or both dates missing -> revert any auto-completed Stores steps
      const doneStepsRes = await clientOrPool.query(
        `SELECT id, name, status, notes FROM unit_steps 
         WHERE order_unit_id = $1 AND dept = 'Stores' AND status = 'done'`,
        [unit.id]
      );

      if (doneStepsRes.rows.length > 0) {
        // Revert to inprogress if start date exists, else pending
        const revertStatus = hasStartDate ? 'inprogress' : 'pending';
        await clientOrPool.query(
          `UPDATE unit_steps 
           SET status = $1, 
               notes = 'Awaiting Tray Issue',
               updated = $2
           WHERE order_unit_id = $3 AND dept = 'Stores' AND status = 'done'`,
          [revertStatus, updatedStr, unit.id]
        );

        if (typeof deriveUnitStatus === 'function') {
          await deriveUnitStatus(unit.id, clientOrPool);
        }

        updatedUnits.push({ unitId: unit.id, action: 'reverted' });
      }
    }
  }

  return updatedUnits;
}
