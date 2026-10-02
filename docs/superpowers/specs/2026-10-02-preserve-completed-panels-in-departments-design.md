# Design Specification: Preserve Completed Panels in Previous Departments

**Date:** 2026-10-02  
**Status:** Approved  
**Topic:** Department Panel Visibility & Completion History Retention  

---

## 1. Executive Summary & Problem Statement

In Vyom ERP, production panels progress through a 9-stage department pipeline:
`Sales` → `Design` → `Purchase` → `Stores` → `Planning` → `Production` → `QC` → `Dispatch` → `Accounts`.

### The Problem
Currently, when an operator in any department (e.g., Sales or Design) marks all tasks done for a panel, `deriveUnitStatus` updates `order_units.current_dept` to the subsequent department (e.g., `Design` or `Purchase`). Because `GET /api/dept-worklist/:dept` filters strictly on `ou.current_dept = :dept`, the panel immediately vanishes from the view of the department that just completed it.

Users lose sight of panels they have processed, cannot review completed milestones or notes, and cannot track where their completed panels are currently located in downstream departments.

### The Objective
Preserve full visibility and completion history of panels across every department they have completed:
1. When a panel moves from department $D_1$ to $D_2$, it remains visible in $D_1$.
2. In $D_1$'s view, the panel is clearly designated as **Completed**, displaying its completion metrics (e.g., `✓ 1/1 Done`), its completed task milestones, and an indicator of its active downstream location (e.g., `→ In Design` or `→ In Purchase`).
3. Completed panels are included in the default **"All"** view and the **"Done"** filter tab of that department.
4. When filtering by department in Master Table View (`AllOrdersTableView`), panels that have passed that department reflect **Completed** status.

---

## 2. Architecture & Data Model

### Pipeline Sequence
The immutable pipeline ordering is defined as:
```javascript
const PIPELINE = [
  'Sales',
  'Design',
  'Purchase',
  'Stores',
  'Planning',
  'Production',
  'QC',
  'Dispatch',
  'Accounts'
];
```

### Relational Schema Reference
- **`order_units`**:
  - `id`: Primary key.
  - `current_dept`: Active department (`'Sales'`, `'Design'`, etc.).
  - `status`: Active status (`'Pending'`, `'Design'`, `'Material Waiting'`, `'Completed'`, `'Dispatched'`, `'Hold'`, `'Cancelled'`, etc.).
- **`unit_steps`**:
  - Stores unit-level task steps per department (`order_unit_id`, `dept`, `name`, `status`, `notes`, `updated`, `assigned_user_id`).
- **`order_steps`**:
  - Stores order-level task steps per department, primarily `Sales` (`order_id`, `dept`, `name`, `status`, etc., such as `Upload PO`).

### Completion Invariant
A panel is considered **completed** for department $D$ if:
1. Its active department (`current_dept`) is strictly downstream of $D$ in `PIPELINE` (`position(current_dept) > position(D)`), OR
2. Its overall status is `'Completed'` or `'Dispatched'` (it has cleared the entire factory), OR
3. All steps associated with department $D$ are marked `done`.

---

## 3. Backend Specification (`server/index.js`)

### 3.1 Endpoint Overhaul: `GET /api/dept-worklist/:dept`

#### Query Filtering Clause
Update the `WHERE` condition to include units currently in the requested department, units downstream of the requested department, and terminal/completed units:

```sql
WHERE $1 = 'all'
   OR ou.current_dept = $1
   OR (
     array_position(ARRAY['Sales','Design','Purchase','Stores','Planning','Production','QC','Dispatch','Accounts']::text[], ou.current_dept) >
     array_position(ARRAY['Sales','Design','Purchase','Stores','Planning','Production','QC','Dispatch','Accounts']::text[], $1)
   )
   OR ou.status IN ('Dispatched', 'Completed')
   OR ou.hold_status IN ('Hold', 'Cancelled')
   OR ou.status = 'Cancelled'
   OR ou.status ILIKE 'hold%'
   OR o.hold_status = 'Approved'
   OR o.status = 'Cancelled'
   OR o.status ILIKE 'hold%'
   OR ($1 = 'Production' AND ...)
```

#### Department Steps Aggregation (`dept_steps`)
Currently, `dept_steps` only aggregates `unit_steps` where `us.dept = (CASE WHEN $1 = 'Sales' THEN ou.current_dept ELSE $1 END)`. This breaks down for Sales (which uses `order_steps`) and incorrectly leaks downstream steps.

Refactor the subquery to dynamically return the relevant department's steps:
- **When `$1 = 'Sales'`**:
  Aggregate Sales steps by combining `order_steps` (`dept = 'Sales'`) and any `unit_steps` (`dept = 'Sales'`). This ensures `Upload PO` (`status = 'done'`) is provided as a step.
- **When `$1` is any specific department (e.g. `'Design'`, `'Purchase'`, etc.)**:
  Aggregate `unit_steps` where `dept = $1`. When a panel is downstream, these steps are in `status = 'done'`.
- **When `$1 = 'all'`**:
  Aggregate steps for `ou.current_dept`.

#### Computed Attributes in JSON Response
Add helper flags to the SQL projection:
```sql
CASE 
  WHEN array_position(ARRAY['Sales','Design','Purchase','Stores','Planning','Production','QC','Dispatch','Accounts']::text[], ou.current_dept) >
       array_position(ARRAY['Sales','Design','Purchase','Stores','Planning','Production','QC','Dispatch','Accounts']::text[], $1)
       OR ou.status IN ('Dispatched', 'Completed')
  THEN true 
  ELSE false 
END AS is_downstream,

CASE 
  WHEN array_position(ARRAY['Sales','Design','Purchase','Stores','Planning','Production','QC','Dispatch','Accounts']::text[], ou.current_dept) >
       array_position(ARRAY['Sales','Design','Purchase','Stores','Planning','Production','QC','Dispatch','Accounts']::text[], $1)
       OR ou.status IN ('Dispatched', 'Completed')
       OR (ou.current_dept = $1 AND (
          SELECT count(*) FROM unit_steps us WHERE us.order_unit_id = ou.id AND us.dept = $1 AND us.status != 'done'
       ) = 0)
  THEN true
  ELSE false
END AS is_dept_completed
```

---

## 4. Frontend Specification

### 4.1 Department Worklist (`src/components/DeptWorklist.jsx`)

#### Unit Row Status & Badges
In `UnitRow`:
- Check if `unit.is_dept_completed` is true, or if all `unit.dept_steps` are done, or if the unit is downstream of `dept`.
- If completed for this department:
  - Row border indicator: `#10b981` (green).
  - Progress summary: Shows `✓ {doneCount}/{steps.length}` in green.
  - Sub-label in unit cell: When `unit.current_dept !== dept`, display a discreet badge: `→ In ${unit.current_dept}` with department theme color so the operator knows where the panel currently is.
- Step editing permissions: If a panel has moved downstream (`is_downstream === true`), steps are locked to read-only for standard department users (editable only by Admin / Manager).

#### Stats Strip & Filter Tabs
- **Total Units**: Total units in the worklist (active + completed).
- **Completed Tab (`done`)**: Includes both units active in this department whose steps are all done AND units that have progressed downstream.
- **In Progress Tab (`inprogress`)**: Strictly units actively in this department with steps in progress (excludes completed downstream units).
- **Pending Tab (`pending`)**: Strictly units actively in this department with pending steps (excludes completed downstream units).
- **All Tab (`all`)**: Shows active units followed/accompanied by completed units.

### 4.2 Master Table View (`src/components/AllOrdersTableView.jsx`)

#### Status Calculation (`calculateUnitStatus`)
Update `calculateUnitStatus(unit, currentFilter, userRole)`:
- When `currentFilter` matches a department in `PIPELINE`:
  - Check if the unit has progressed downstream:
    ```javascript
    const deptIdx = PIPELINE.indexOf(currentFilter);
    const unitDeptIdx = PIPELINE.indexOf(unit.current_dept);
    if (deptIdx !== -1 && unitDeptIdx !== -1 && unitDeptIdx > deptIdx) {
      return 'Completed';
    }
    ```
  - This ensures that filtering the master table by "Sales" or "Design" displays passed panels as **Completed** rather than "In Progress" or "Pending".

---

## 5. Security, Guardrails & Edge Cases

1. **Order Number & Serial Immutability**:
   No changes to serial numbering or order numbering logic.
2. **Hold and Cancelled Invariants**:
   If an order or unit is on Hold or Cancelled, hold and cancellation badges take precedence over "Completed" styling, preserving visual alerts.
3. **Admin Task Master Compatibility**:
   Works dynamically with custom task templates created via Task Masters.
4. **Performance**:
   The SQL `array_position` check on a fixed 9-element array in PostgreSQL runs in microseconds and preserves index scans on `order_units.order_id` and foreign keys.

---

## 6. Verification Plan

### Automated Tests
1. **`server/test_dept_completed_visibility.js`**:
   - Create a test order and panel in Sales.
   - Complete Sales PO -> Verify panel appears in Sales worklist as Completed AND in Design worklist as Active.
   - Upload Drawing & BOM, confirm Design -> Verify panel appears in Sales as Completed, in Design as Completed, and in Purchase as Active.
   - Verify step contents: Sales worklist provides `Upload PO` (Done); Design worklist provides `Review & Classify` (Done) and `Release Documents` (Done).
2. **Master Table Status Test**:
   - Verify `calculateUnitStatus` returns `'Completed'` when filtering by upstream departments.
3. **Frontend Production Build**:
   - Run `npm run build` to ensure zero compilation or bundle errors.
