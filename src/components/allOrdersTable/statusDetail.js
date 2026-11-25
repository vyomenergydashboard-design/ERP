import { isStatusDone } from './status';

// Step statuses that never block a panel, so they are not "next" work.
const NON_BLOCKING_STEP_STATUSES = new Set(['cancelled', 'canceled', 'skipped', 'na', 'n/a', 'not applicable']);

const isOpenStep = (step) => {
  if (!step || isStatusDone(step.status)) return false;
  return !NON_BLOCKING_STEP_STATUSES.has(String(step.status || '').trim().toLowerCase());
};

/**
 * Extra wording for the Status pill, so a panel's status says what it is waiting on instead of
 * a bare "Pending". Display only: it reads fields the worklist already returns (`dept_steps`,
 * `current_dept`) and never decides whether a panel may advance; that stays in deriveUnitStatus.
 *
 * Returns `{ text, title }`, or null when the plain status says it all (Hold and Cancelled name
 * their own step elsewhere).
 */
export function getStatusDetail(unit, status, currentFilter) {
  if (!unit) return null;
  const statusKey = String(status || '').trim().toLowerCase();

  if (statusKey === 'pending') {
    const open = (unit.dept_steps || []).filter(isOpenStep);
    if (open.length === 0) return null;
    const names = open.map((s) => String(s.name || '').trim()).filter(Boolean);
    if (names.length === 0) return null;
    const more = names.length > 1 ? ` +${names.length - 1}` : '';
    return {
      text: `Next: ${names[0]}${more}`,
      title: `Waiting on: ${names.join(', ')}`,
    };
  }

  if (statusKey === 'completed') {
    const dept = unit.current_dept;
    // In a department view "Completed" means this department's work is finished; say where the
    // panel is now. The "all departments" view already shows the current stage's own status.
    if (!dept || currentFilter === 'all' || dept === currentFilter) return null;
    return { text: `Completed → ${dept}`, title: `Done in ${currentFilter}; now in ${dept}` };
  }

  return null;
}
