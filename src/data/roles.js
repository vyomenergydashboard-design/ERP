// Single source of truth for roles on the frontend.
// Backend mirror: server/data/workflow.js (ALL_ROLES, OPERATOR_ROLES, PRIVILEGED_ROLES) — keep in sync.
// Feature-specific permissions (e.g. who may upload a PO) stay next to the feature that
// uses them, because each mirrors a specific backend route.
import { PIPELINE } from './planningData';

// Every valid user role.
export const ALL_ROLES = ['Admin', 'Manager', ...PIPELINE, 'Viewer'];

// Roles that can operate on orders/units: everyone except read-only Viewer.
export const OPERATOR_ROLES = ['Admin', 'Manager', ...PIPELINE];

// Roles that may act across departments (edit any step, bypass upstream gates).
export const PRIVILEGED_ROLES = ['Admin', 'Manager'];

// Table View cell editing. Planning is intentionally excluded (read-only in the table;
// Planning users work in the Planning module), even though the backend accepts their edits.
export const TABLE_EDIT_ROLES = OPERATOR_ROLES.filter((r) => r !== 'Planning');

const normalize = (role) => String(role || '').trim().toLowerCase();

// Case-insensitive role membership (older code stored/compared roles in mixed case).
export const hasRole = (role, roles) => {
  const r = normalize(role);
  return r !== '' && roles.some((candidate) => normalize(candidate) === r);
};

export const isPrivileged = (role) => hasRole(role, PRIVILEGED_ROLES);

// True for roles that belong to a pipeline department (not Admin, Manager or Viewer).
export const isDepartmentRole = (role) => hasRole(role, PIPELINE);
