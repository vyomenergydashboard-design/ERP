import { PIPELINE } from '../../data/planningData';

const isStatusDone = (st) => {
  if (!st) return false;
  const s = String(st).trim().toLowerCase();
  return s === 'done' || s === 'completed' || s === 'complete';
};

const isStatusInProgress = (st) => {
  if (!st) return false;
  const s = String(st).trim().toLowerCase();
  return s === 'inprogress' || s === 'in progress' || s === 'in process' || s === 'review';
};

function calculateUnitStatus(unit, currentFilter, userRole) {
  if (!unit) return 'Pending';

  const rawUnitStatus = String(unit.unit_status || unit.status || '').trim().toLowerCase();
  const rawHoldStatus = String(unit.hold_status || '').trim().toLowerCase();
  const rawOrderStatus = String(unit.order_status || '').trim().toLowerCase();

  // 1. Cancelled orders/units
  if (
    rawUnitStatus === 'cancelled' || rawUnitStatus === 'canceled' ||
    rawUnitStatus.startsWith('cancel') ||
    rawHoldStatus === 'cancelled' ||
    unit.hold_status === 'Cancelled' ||
    rawOrderStatus === 'cancelled' || rawOrderStatus === 'canceled'
  ) {
    return 'Cancelled';
  }

  // 2. Hold orders/units
  if (
    rawUnitStatus === 'hold' || rawUnitStatus === 'on hold' ||
    rawUnitStatus.startsWith('hold') ||
    rawHoldStatus === 'approved' || rawHoldStatus === 'hold' ||
    unit.hold_status === 'Hold' ||
    rawOrderStatus === 'hold' || rawOrderStatus === 'on hold'
  ) {
    return 'Hold';
  }

  if (rawUnitStatus === 'dispatched' || isStatusDone(rawUnitStatus)) return 'Completed';
  if (unit.dept_steps?.some(s => String(s.status).toLowerCase() === 'blocked')) return 'Blocked';

  const filterDeptIdx = PIPELINE.indexOf(currentFilter);
  const unitDeptIdx = PIPELINE.indexOf(unit.current_dept);

  if (filterDeptIdx !== -1) {
    if (unit.is_dept_completed === true || unit.is_downstream === true) {
      return 'Completed';
    }
    if (unitDeptIdx !== -1 && unitDeptIdx > filterDeptIdx) {
      return 'Completed';
    }
    if (currentFilter === 'Sales' && unit.current_dept && unit.current_dept !== 'Sales') {
      return 'Completed';
    }
  }

  // Design workflow evaluation
  const isDesignWorkflow = currentFilter === 'Design' || userRole?.toLowerCase() === 'design';
  const stepsToCheck = isDesignWorkflow
    ? (unit.dept_steps || unit.design_steps || [])
    : (unit.dept_steps || []);

  if (stepsToCheck && stepsToCheck.length > 0) {
    const allDone = stepsToCheck.every(s => isStatusDone(s.status));
    const releaseDocStep = stepsToCheck.find(s =>
      s.name === 'Release Documents' ||
      s.special === 'design' ||
      String(s.name || '').toLowerCase().includes('design')
    );
    const isReleaseDocDone = releaseDocStep && isStatusDone(releaseDocStep.status);

    if (allDone || (isDesignWorkflow && isReleaseDocDone)) {
      if (currentFilter === 'Stores') {
        const hasStart = Boolean(unit.tray_start_date || unit.custom_fields?.tray_start_date);
        const hasIssued = Boolean(unit.issued_date || unit.custom_fields?.issued_date);
        if (!hasStart || !hasIssued) {
          return 'In Progress';
        }
      }
      return 'Completed';
    }

    const hasStarted = stepsToCheck.some(s => isStatusDone(s.status) || isStatusInProgress(s.status));
    if (hasStarted) {
      return 'In Progress';
    }

    // In All Departments view, check overall factory step progress
    if (currentFilter === 'all') {
      const hasFactoryInprogress =
        Number(unit.inprogress_step_count || 0) > 0 ||
        Number(unit.order_inprogress_step_count || 0) > 0;
      if (hasFactoryInprogress) {
        return 'In Progress';
      }
    }

    return 'Pending';
  }

  const hasInprogress =
    Number(unit.inprogress_step_count || 0) > 0 ||
    Number(unit.order_inprogress_step_count || 0) > 0 ||
    unit.dept_steps?.some(s => isStatusInProgress(s.status));

  const hasDone =
    Number(unit.done_step_count || 0) > 0 ||
    Number(unit.order_done_step_count || 0) > 0 ||
    unit.dept_steps?.some(s => isStatusDone(s.status));

  if (hasInprogress || hasDone) {
    return 'In Progress';
  }

  return 'Pending';
}

export { isStatusDone, isStatusInProgress, calculateUnitStatus };
