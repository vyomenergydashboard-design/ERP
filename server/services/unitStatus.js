// Unit status derivation: deriveUnitStatus recomputes order_units.current_dept/status from
// unit steps, documents, Sales/Design gates and holds. Change advancement behaviour here,
// never by writing current_dept directly. Also: line-item and QC status roll-ups, the Design
// document gate and the upstream-department completion check.
import { PIPELINE } from '../data/workflow.js';
import { runAfterCommit } from './afterCommit.js';
import { sendDepartmentHandoverEmail } from './notifications.js';

// True while initDB() re-derives every unit on boot; suppresses handover emails meanwhile.
let isSystemSeeding = false;
export const setSystemSeeding = (value) => { isSystemSeeding = value; };

export const syncLineItemStatusFromUnits = async (lineItemId, clientOrPool) => {
  try {
    const unitsRes = await clientOrPool.query(
      `SELECT current_dept, status FROM order_units WHERE line_item_id = $1`,
      [lineItemId]
    );
    const units = unitsRes.rows;
    if (units.length === 0) return;

    const allDispatched = units.every(u => u.status === 'Dispatched' || u.current_dept === 'Accounts');
    if (allDispatched) {
      await clientOrPool.query(
        `UPDATE order_line_items SET status = 'Completed' WHERE id = $1`,
        [lineItemId]
      );
      return;
    }

    const depts = units.map(u => u.current_dept);
    let mappedStatus = 'Not Started';

    if (depts.includes('Design')) {
      mappedStatus = 'In Progress';
    } else if (depts.includes('Purchase') || depts.includes('Stores')) {
      mappedStatus = 'Waiting for Material';
    } else if (depts.includes('Planning')) {
      mappedStatus = 'In Progress';
    } else if (depts.includes('Production')) {
      mappedStatus = 'In Progress';
    } else if (depts.includes('QC')) {
      mappedStatus = 'QC Testing';
    } else if (depts.includes('Dispatch') || depts.includes('Accounts')) {
      mappedStatus = 'Completed';
    }

    await clientOrPool.query(
      `UPDATE order_line_items SET status = $1 WHERE id = $2`,
      [mappedStatus, lineItemId]
    );
  } catch (err) {
    console.error('Error in syncLineItemStatusFromUnits:', err);
  }
};

export const deriveUnitStatus = async (unitId, clientOrPool, suppressEmail = false) => {
  const prevUnitRes = await clientOrPool.query(
    `SELECT ou.current_dept, ou.status, ou.line_item_id, ou.unit_id, ou.short_serial, ou.order_id, ou.hold_status, ou.hold_step_name, ou.hold_dept, ou.cancelled_step_name, ou.cancelled_dept, ou.design_confirmed, ou.po_number as unit_po_number, ou.po_doc_id, ou.po_override_unlinked, ou.sales_cleared, ou.tray_start_date, ou.issued_date, o.classification, o.po_number as order_po_number, o.hold_status as order_hold_status
     FROM order_units ou
     JOIN orders o ON ou.order_id = o.id
     WHERE ou.id = $1`,
    [unitId]
  );
  if (prevUnitRes.rows.length === 0) return;

  const row = prevUnitRes.rows[0];
  const oldDept = row.current_dept;
  const unit_id_str = row.unit_id || '';
  const short_serial = row.short_serial || '';
  const orderId = row.order_id;
  const unitHoldStatus = row.hold_status;
  const orderHoldStatus = row.order_hold_status;

  // 1. Check if unit is Cancelled
  if (unitHoldStatus === 'Cancelled') {
    const cancelDept = row.cancelled_dept || oldDept || 'Sales';
    await clientOrPool.query(
      `UPDATE order_units SET status = 'Cancelled', current_dept = $1 WHERE id = $2`,
      [cancelDept, unitId]
    );
    return;
  }

  // 2. Check if unit or order is On Hold
  if (unitHoldStatus === 'Hold' || orderHoldStatus === 'Approved') {
    const holdDept = row.hold_dept || oldDept || 'Sales';
    const statusText = row.hold_step_name ? `Hold @ ${row.hold_step_name}` : 'Hold';
    await clientOrPool.query(
      `UPDATE order_units SET status = $1, current_dept = $2 WHERE id = $3`,
      [statusText, holdDept, unitId]
    );
    return;
  }

  // Check individual panel PO resolution
  const isSalesCleared = row.sales_cleared === true;
  const isUnlinked = row.po_override_unlinked === true;
  const unitPoNum = row.unit_po_number ? String(row.unit_po_number).trim() : '';
  const orderPoNum = (!isUnlinked && row.order_po_number) ? String(row.order_po_number).trim() : '';
  const resolvedPoNumber = unitPoNum || orderPoNum;
  const hasPoNumber = Boolean(resolvedPoNumber);

  let hasPoDoc = false;
  if (row.po_doc_id) {
    hasPoDoc = true;
  } else {
    const unitDocRes = await clientOrPool.query(
      `SELECT 1 FROM documents WHERE entity_type = 'Unit' AND entity_id = $1 AND doc_type = 'PO' LIMIT 1`,
      [unitId]
    );
    if (unitDocRes.rows.length > 0) {
      hasPoDoc = true;
    } else if (!isUnlinked) {
      const orderDocRes = await clientOrPool.query(
        `SELECT 1 FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO' LIMIT 1`,
        [orderId]
      );
      if (orderDocRes.rows.length > 0) {
        hasPoDoc = true;
      }
    }
  }

  const hasPanelPo = hasPoDoc && hasPoNumber;

  // Check if Sales order-level steps (like Upload PO) are completed (non-mandatory tasks do not block pipeline)
  const salesOrderStepsRes = await clientOrPool.query(
    `SELECT os.status, os.name, COALESCE(tm.is_mandatory, true) as is_mandatory 
     FROM order_steps os
     LEFT JOIN task_masters tm ON os.task_id = tm.id
     WHERE os.order_id = $1 AND os.dept = 'Sales'`,
    [orderId]
  );

  const uploadPoOrderStep = salesOrderStepsRes.rows.find(s => s.name === 'Upload PO');
  const orderPoStepDone = uploadPoOrderStep ? (uploadPoOrderStep.status === 'done' && !isUnlinked) : false;
  const otherSalesOrderStepsPending = salesOrderStepsRes.rows.some(
    s => s.name !== 'Upload PO' && s.is_mandatory && s.status !== 'done'
  );

  let hasOrderDocFallback = false;
  if (salesOrderStepsRes.rows.length === 0 && !isUnlinked) {
    const poDocCheck = await clientOrPool.query(
      `SELECT 1 FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO' LIMIT 1`,
      [orderId]
    );
    hasOrderDocFallback = poDocCheck.rows.length > 0;
  }

  const isPoSatisfied = hasPanelPo || orderPoStepDone || isSalesCleared || hasOrderDocFallback;
  const isSalesDone = isPoSatisfied && !otherSalesOrderStepsPending;

  let newStatus = 'Pending';
  let newDept = 'Sales';

  const stepsRes = await clientOrPool.query(
    `SELECT id, dept, name, status FROM unit_steps WHERE order_unit_id = $1 ORDER BY step_order ASC, id ASC`,
    [unitId]
  );

  // A panel stays in Sales until Sales is done AND any unit Sales Clearance steps are done
  const hasUnitSalesPending = stepsRes.rows.some(s => s.dept === 'Sales' && s.status !== 'done');
  if (!isSalesDone || hasUnitSalesPending) {
    newDept = 'Sales';
    newStatus = 'Pending';
  } else {

    if (stepsRes.rows.length > 0) {
      const steps = stepsRes.rows;
      const blockedStep = steps.find(s => s.status === 'blocked');
      if (blockedStep) {
        if (blockedStep.dept === 'QC') {
          newDept = 'Production';
          newStatus = 'Rework';
        } else {
          newDept = blockedStep.dept;
          if (blockedStep.dept === 'Production') {
            newStatus = 'Rework';
          } else {
            newStatus = 'Blocked';
          }
        }
      } else {
        const allDone = steps.every(s => s.status === 'done');
        if (allDone) {
          newStatus = 'Dispatched';
          newDept = 'Accounts';
        } else {
          const firstIncomplete = steps.find(s => s.status !== 'done');
          if (firstIncomplete) {
            newDept = firstIncomplete.dept;

            const statusMap = {
              'Sales': 'Pending',
              'Design': 'Design',
              'Purchase': 'Material Waiting',
              'Stores': 'Material Waiting',
              'Planning': 'Planning',
              'Production': 'Production',
              'QC': 'QC Testing',
              'Dispatch': 'Ready for Dispatch',
              'Accounts': 'Dispatched'
            };

            newStatus = statusMap[firstIncomplete.dept] || 'Production';

            // HARD SAFETY GATE: Without Drawing AND BOM AND Design confirmation, no panel can go to next department (Purchase, Stores, Planning, etc.)
            let deptIdx = PIPELINE.indexOf(newDept);
            const designIdx = PIPELINE.indexOf('Design');
            if (deptIdx > designIdx) {
              const docInfo = await evaluateUnitDesignDocuments(clientOrPool, unitId);
              if (!docInfo.hasDrawing || !docInfo.hasBom || !docInfo.designConfirmed) {
                newDept = 'Design';
                newStatus = 'Design';
                deptIdx = designIdx;
              }
            }

            // HARD SAFETY GATE: Without BOTH Tray Start Date and Issued Date, no panel can advance past Stores
            const storesIdx = PIPELINE.indexOf('Stores');
            if (deptIdx > storesIdx) {
              const hasTrayStartDate = Boolean(row.tray_start_date);
              const hasIssuedDate = Boolean(row.issued_date);
              if (!hasTrayStartDate || !hasIssuedDate) {
                newDept = 'Stores';
                newStatus = 'In Process';
              }
            }
          }
        }
      }
    } else {
      // If there are no unit steps at all, retain the current department and status
      newDept = oldDept || 'Sales';
      newStatus = row.status || 'Pending';
    }
  }

  await clientOrPool.query(
    `UPDATE order_units SET status = $1, current_dept = $2 WHERE id = $3`,
    [newStatus, newDept, unitId]
  );

  if (oldDept && oldDept !== newDept && newDept !== 'Planning' && !isSystemSeeding && !suppressEmail) {
    // Deferred until the caller's transaction commits (runs immediately when called with the pool).
    runAfterCommit(clientOrPool, () => sendDepartmentHandoverEmail(unit_id_str, short_serial, oldDept, newDept));
  }

  if (row.line_item_id) {
    await syncLineItemStatusFromUnits(row.line_item_id, clientOrPool);
  }
};

export const evaluateUnitDesignDocuments = async (clientOrPool, unitIdOrObj) => {
  let unit = unitIdOrObj;
  if (typeof unitIdOrObj === 'number' || typeof unitIdOrObj === 'string') {
    const res = await clientOrPool.query(
      `SELECT ou.id, ou.order_id, ou.classification, ou.design_confirmed, oli.part_number
       FROM order_units ou
       LEFT JOIN order_line_items oli ON ou.line_item_id = oli.id
       WHERE ou.id = $1`,
      [Number(unitIdOrObj)]
    );
    if (res.rows.length === 0) return { hasDrawing: false, hasBom: false, isStandard: true, designConfirmed: false };
    unit = res.rows[0];
  } else if (!unit.part_number && unit.line_item_id) {
    const liRes = await clientOrPool.query('SELECT part_number FROM order_line_items WHERE id = $1', [unit.line_item_id]);
    unit.part_number = liRes.rows[0]?.part_number || '';
  }

  const isStandard = String(unit.classification || 'Standard').trim().toLowerCase() === 'standard';
  let hasDrawing = false;
  let hasBom = false;

  if (isStandard && unit.part_number) {
    const pmRes = await clientOrPool.query(
      `SELECT id FROM part_number_masters 
       WHERE LOWER(TRIM(part_number)) = LOWER(TRIM($1)) LIMIT 1`,
      [unit.part_number]
    );
    if (pmRes.rows.length > 0) {
      const pmId = pmRes.rows[0].id;
      const pDocs = await clientOrPool.query(
        `SELECT doc_type FROM part_number_documents 
         WHERE part_number_id = $1 AND (is_current = true OR is_current IS NULL)`,
        [pmId]
      );
      for (const d of pDocs.rows) {
        const dt = String(d.doc_type || '').toLowerCase();
        if (dt === 'drawing') hasDrawing = true;
        if (dt === 'bom' || dt === 'bill of materials') hasBom = true;
      }
    }
  }

  // Check custom/unit documents (for Non-Standard, and also unit/order specific uploads)
  const docRes = await clientOrPool.query(
    `SELECT doc_type FROM documents 
     WHERE (entity_type = 'Unit' AND entity_id = $1)
        OR (entity_type = 'Order' AND entity_id = $2)`,
    [unit.id, unit.order_id]
  );
  for (const d of docRes.rows) {
    const dt = String(d.doc_type || '').toLowerCase();
    if (dt === 'drawing') hasDrawing = true;
    if (dt === 'bom' || dt === 'bill of materials') hasBom = true;
  }

  return { hasDrawing, hasBom, isStandard, designConfirmed: Boolean(unit.design_confirmed) };
};

export const syncUnitDesignDocumentStatus = async (clientOrPool, unitId, userId = null) => {
  const docInfo = await evaluateUnitDesignDocuments(clientOrPool, unitId);
  const { hasDrawing, hasBom, designConfirmed } = docInfo;

  let newStatus = 'pending';
  let newNotes = 'Awaiting Drawing and BOM upload.';

  // Mandatory Invariant: Without BOTH Drawing and BOM, Release Documents is NEVER done and panel NEVER advances to Purchase
  if (hasDrawing && hasBom && designConfirmed) {
    newStatus = 'done';
    newNotes = 'Drawing and BOM released by Design.';
  } else if (hasDrawing && hasBom) {
    newStatus = 'inprogress';
    newNotes = 'Drawing and BOM present; pending Design confirmation.';
  } else if (designConfirmed) {
    newStatus = 'inprogress';
    if (hasDrawing) {
      newNotes = 'Design confirmed & Drawing present; awaiting BOM upload.';
    } else if (hasBom) {
      newNotes = 'Design confirmed & BOM present; awaiting Drawing upload.';
    } else {
      newNotes = 'Design confirmed; awaiting Drawing and BOM upload.';
    }
  } else if (hasDrawing || hasBom) {
    newStatus = 'inprogress';
    newNotes = hasDrawing ? 'Drawing attached; BOM pending.' : 'BOM attached; Drawing pending.';
  } else {
    newStatus = 'pending';
    newNotes = 'Awaiting Drawing and BOM upload.';
  }

  const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  await clientOrPool.query(
    `UPDATE unit_steps 
     SET status = $1, notes = $2, updated = $3 
     WHERE order_unit_id = $4 AND dept = 'Design' 
       AND (name = 'Release Documents' OR name ILIKE '%release%')`,
    [newStatus, newNotes, updatedStr, unitId]
  );

  await deriveUnitStatus(unitId, clientOrPool);
  return { status: newStatus, notes: newNotes, ...docInfo };
};

export const updateOrderQCStatusFromSteps = async (orderId, clientOrPool) => {
  try {
    const orderQcRes = await clientOrPool.query(
      `SELECT name, status FROM order_steps WHERE order_id = $1 AND dept = 'QC'`,
      [orderId]
    );
    const unitQcRes = await clientOrPool.query(
      `SELECT us.name, us.status 
       FROM unit_steps us 
       JOIN order_units ou ON us.order_unit_id = ou.id 
       WHERE ou.order_id = $1 AND us.dept = 'QC'`,
      [orderId]
    );

    const allQcSteps = [...orderQcRes.rows, ...unitQcRes.rows];
    if (allQcSteps.length === 0) return;

    const decisionSteps = allQcSteps.filter(s => s.name.toLowerCase().includes('decision'));
    const targetSteps = decisionSteps.length > 0 ? decisionSteps : allQcSteps;

    let newQcStatus = 'Pending';
    let setQcDate = false;

    if (targetSteps.some(s => s.status === 'blocked')) {
      newQcStatus = 'Fail';
      setQcDate = true;
    } else if (targetSteps.every(s => s.status === 'done')) {
      newQcStatus = 'Pass';
      setQcDate = true;
    }

    if (setQcDate) {
      await clientOrPool.query(
        `UPDATE orders SET qc_status = $1, qc_date = CURRENT_DATE WHERE id = $2`,
        [newQcStatus, orderId]
      );
    } else {
      await clientOrPool.query(
        `UPDATE orders SET qc_status = $1, qc_date = NULL WHERE id = $2`,
        [newQcStatus, orderId]
      );
    }

    // Update each line item of this order individually based on its own units' QC steps
    const lineItemsRes = await clientOrPool.query(
      `SELECT id FROM order_line_items WHERE order_id = $1`,
      [orderId]
    );

    for (const li of lineItemsRes.rows) {
      const liQcRes = await clientOrPool.query(
        `SELECT us.name, us.status 
         FROM unit_steps us 
         JOIN order_units ou ON us.order_unit_id = ou.id 
         WHERE ou.line_item_id = $1 AND us.dept = 'QC'`,
        [li.id]
      );
      const liQcSteps = liQcRes.rows;
      if (liQcSteps.length === 0) continue;

      const liDecisionSteps = liQcSteps.filter(s => s.name.toLowerCase().includes('decision'));
      const liTargetSteps = liDecisionSteps.length > 0 ? liDecisionSteps : liQcSteps;

      let liQcStatus = 'Pending';
      let liSetQcDate = false;

      if (liTargetSteps.some(s => s.status === 'blocked')) {
        liQcStatus = 'Fail';
        liSetQcDate = true;
      } else if (liTargetSteps.every(s => s.status === 'done')) {
        liQcStatus = 'Pass';
        liSetQcDate = true;
      }

      if (liSetQcDate) {
        await clientOrPool.query(
          `UPDATE order_line_items SET qc_status = $1, qc_date = CURRENT_DATE WHERE id = $2`,
          [liQcStatus, li.id]
        );
      } else {
        await clientOrPool.query(
          `UPDATE order_line_items SET qc_status = $1, qc_date = NULL WHERE id = $2`,
          [liQcStatus, li.id]
        );
      }
    }
  } catch (err) {
    console.error('Error in updateOrderQCStatusFromSteps:', err);
  }
};

// Returns the upstream departments (before `dept` in PIPELINE) that still have
// unfinished unit_steps for the given unit ids. Empty array means OK to complete.
export const findBlockingUpstreamDepts = async (db, unitIds, dept) => {
  const myIndex = PIPELINE.indexOf(dept);
  if (myIndex <= 0 || unitIds.length === 0) return [];
  const blockingRes = await db.query(
    `SELECT DISTINCT dept FROM unit_steps WHERE order_unit_id = ANY($1::int[]) AND dept = ANY($2::text[]) AND status NOT IN ('done')`,
    [unitIds, PIPELINE.slice(0, myIndex)]
  );
  return blockingRes.rows.map(r => r.dept);
};
