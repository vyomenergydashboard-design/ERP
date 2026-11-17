// Single source of truth for departments and roles on the backend.
// Frontend mirror: src/data/planningData.js (DEPTS) and src/data/roles.js — keep in sync.

// Canonical department order. Units advance left to right.
export const PIPELINE = Object.freeze(['Sales', 'Design', 'Purchase', 'Stores', 'Planning', 'Production', 'QC', 'Dispatch', 'Accounts']);

// Every valid user role (users.role CHECK constraint uses the same set).
export const ALL_ROLES = Object.freeze(['Admin', 'Manager', ...PIPELINE, 'Viewer']);

// Roles that can operate on orders/units: everyone except read-only Viewer.
export const OPERATOR_ROLES = Object.freeze(['Admin', 'Manager', ...PIPELINE]);

// Roles that may override workflow gates (upstream checks, other departments' steps).
export const PRIVILEGED_ROLES = Object.freeze(['Admin', 'Manager']);

// Department names are fixed identifiers, so they can be inlined into SQL safely.
if (!PIPELINE.every((d) => /^[A-Za-z]+$/.test(d))) {
  throw new Error('PIPELINE department names must be plain letters (they are inlined into SQL).');
}

// SQL literal of the pipeline, e.g. for array_position(...) comparisons.
export const PIPELINE_SQL_ARRAY = `ARRAY[${PIPELINE.map((d) => `'${d}'`).join(',')}]::text[]`;

// SQL expression ranking a department column in pipeline order (1-based); unknown
// departments sort last. Replaces hand-written CASE dept WHEN 'Sales' THEN 1 ... blocks.
export const deptOrderSql = (column) =>
  `COALESCE(array_position(${PIPELINE_SQL_ARRAY}, ${column}), ${PIPELINE.length + 1})`;
