# Preserve Completed Panels in Previous Departments Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure panels that have completed a department and moved downstream remain visible in all previously completed departments marked as "Completed", with full milestone history and active location indicators.

**Architecture:** 
- In PostgreSQL/Express backend (`server/index.js`), overhaul `GET /api/dept-worklist/:dept` to select units where `current_dept = :dept` OR `array_position(PIPELINE, current_dept) > array_position(PIPELINE, :dept)` OR `status IN ('Dispatched', 'Completed')`.
- Aggregate relevant department steps (`order_steps` + `unit_steps` for Sales; `unit_steps` where `dept = :dept` for other departments; `ou.current_dept` for `'all'`) and compute `is_dept_completed` and `is_downstream` booleans in SQL.
- In React frontend (`DeptWorklist.jsx` and `AllOrdersTableView.jsx`), display completed panels with "Completed" status, green styling, and `→ In <current_dept>` indicators, properly including them in the "All" and "Done" filter tabs.

**Tech Stack:** Node.js (Express, pg Pool), PostgreSQL 15, React 18, Vite.

**Spec:** [docs/superpowers/specs/2026-10-02-preserve-completed-panels-in-departments-design.md](file:///c:/Users/cerul/Documents/ERP/docs/superpowers/specs/2026-10-02-preserve-completed-panels-in-departments-design.md)

## Global Constraints
- Order numbers and serial numbers are strictly immutable; do not renumber or alter serial generation.
- Never truncate `task_masters` or alter existing schemas destructively.
- Preserve modal structures and conventions; maintain dark-mode styling harmony using CSS variables from `src/index.css`.
- All SQL queries must be parameterized (`$1, $2, ...`).

## Review Focus
1. **Sales Order-Level Task Visibility:** In Sales worklist, panels must display `Upload PO` (`status = 'done'`) rather than blank or foreign department steps.
2. **Terminal Pipeline Panels:** Panels marked `'Dispatched'` or `'Completed'` in Accounts must remain visible as completed in all upstream departments.
3. **On Hold / Cancelled Priority:** If a panel is on Hold or Cancelled downstream, hold/cancellation badges must take visual precedence in upstream views while still indicating completion of that upstream department.
4. **Step Editing Guardrail:** Standard department operators cannot edit steps of a panel that has already advanced downstream; only Admin/Manager retain override permissions.
5. **Table View Filter Consistency:** In `AllOrdersTableView`, selecting any department filter must evaluate downstream panels as `'Completed'`.

---

### Task 1: Backend Integration Tests for Completed Panel Visibility

**Files:**
- Create/Modify: `server/test_dept_completed_visibility.js`

**Interfaces:**
- Consumes: `GET /api/dept-worklist/:dept`
- Produces: Test assertions for `is_downstream`, `is_dept_completed`, `dept_steps`, and retention across Sales, Design, and Purchase.

- [ ] **Step 1: Write test cases in `server/test_dept_completed_visibility.js`**
  Add assertions checking:
  - Unit initially in Sales -> visible in Sales as active (`current_dept: 'Sales'`, `is_downstream: false`).
  - Unit advances to Design -> visible in Sales as Completed (`is_dept_completed: true`, `is_downstream: true`, `dept_steps` contains `Upload PO` with `done`), AND visible in Design as active.
  - Unit advances to Purchase -> visible in Sales (Completed), visible in Design (Completed, 2/2 steps done), AND visible in Purchase as active.
  - Query with `all` returns units with current department steps.

- [ ] **Step 2: Run test to verify failure on current backend**
  Run: `node server/test_dept_completed_visibility.js`  
  Expected: FAIL with assertion error that unit is not found in Sales worklist after moving to Design.

- [ ] **Step 3: Commit test suite**
  ```bash
  git add server/test_dept_completed_visibility.js
  git commit -m "test: add integration test suite for department completion visibility"
  ```

---

### Task 2: Backend Query Overhaul in `GET /api/dept-worklist/:dept`

**Files:**
- Modify: `server/index.js` around line 4502–4670

**Interfaces:**
- Consumes: HTTP `GET /api/dept-worklist/:dept` with Bearer JWT token
- Produces: JSON array of unit objects with `is_downstream: boolean`, `is_dept_completed: boolean`, and accurate `dept_steps`

- [ ] **Step 1: Refactor `dept_steps` aggregation in `server/index.js`**
  Replace line 4578 subquery with conditional aggregation:
  - If `$1 = 'Sales'`: Union `order_steps` where `os.order_id = o.id AND os.dept = 'Sales'` and `unit_steps` where `us.order_unit_id = ou.id AND us.dept = 'Sales'`.
  - If `$1 = 'all'`: Select `unit_steps` where `us.order_unit_id = ou.id AND us.dept = ou.current_dept`.
  - Otherwise (`$1` is any other department): Select `unit_steps` where `us.order_unit_id = ou.id AND us.dept = $1`.

- [ ] **Step 2: Add `is_downstream` and `is_dept_completed` projections**
  Use PostgreSQL `array_position` over `ARRAY['Sales','Design','Purchase','Stores','Planning','Production','QC','Dispatch','Accounts']::text[]` to compare `ou.current_dept` against `$1`.

- [ ] **Step 3: Update `WHERE` clause in `server/index.js`**
  Include panels where `array_position(PIPELINE, ou.current_dept) > array_position(PIPELINE, $1)` or `ou.status IN ('Dispatched', 'Completed')`.

- [ ] **Step 4: Restart backend container and run tests**
  Run: `docker restart vyom-erp-backend`  
  Run: `node server/test_dept_completed_visibility.js`  
  Expected: ALL 5 TESTS PASS.

- [ ] **Step 5: Commit backend changes**
  ```bash
  git add server/index.js
  git commit -m "feat: overhaul dept-worklist to preserve completed panels in upstream departments"
  ```

---

### Task 3: Frontend Department Worklist Updates (`DeptWorklist.jsx`)

**Files:**
- Modify: `src/components/DeptWorklist.jsx`

**Interfaces:**
- Consumes: `unit.is_dept_completed`, `unit.is_downstream`, `unit.dept_steps`, `unit.current_dept`
- Produces: Updated worklist table, filter counts, and visual badges

- [ ] **Step 1: Update unit status and filter logic in `DeptWorklist.jsx`**
  - Update `isCompletedUnit(u)` helper: checks `u.is_dept_completed === true` OR `u.is_downstream === true` OR all `u.dept_steps` done.
  - Update `filteredUnits`:
    - `filter === 'all'`: Include both active and completed units.
    - `filter === 'done'`: Include completed units (`isCompletedUnit(u)`).
    - `filter === 'inprogress'`: Include units where not completed and has inprogress step.
    - `filter === 'pending'`: Include units where not completed and pending.
  - Update `doneUnits` counter in stats strip to include `isCompletedUnit`.

- [ ] **Step 2: Update `UnitRow` rendering for completed panels**
  - When a unit is completed in this department:
    - Set row left border to `var(--green)` (`#10b981`).
    - Progress summary displays `CheckCircle2` with `✓ {doneCount}/{steps.length}` in green.
    - If `unit.current_dept !== dept`: Display location badge next to serial: `→ In {unit.current_dept}` with subtle department color pill.
  - Lock step editing (`getCanEditStep`): If `unit.is_downstream && !['admin', 'manager'].includes(currentUser.role?.toLowerCase())`, return `false`.

- [ ] **Step 3: Commit `DeptWorklist.jsx` changes**
  ```bash
  git add src/components/DeptWorklist.jsx
  git commit -m "feat: render completed panel indicators and update filter tabs in DeptWorklist"
  ```

---

### Task 4: Master Table View Status Calculation (`AllOrdersTableView.jsx`)

**Files:**
- Modify: `src/components/AllOrdersTableView.jsx`

**Interfaces:**
- Consumes: `calculateUnitStatus(unit, currentFilter, userRole)`
- Produces: Correct `'Completed'` status string for panels downstream of `currentFilter`

- [ ] **Step 1: Update `calculateUnitStatus` in `AllOrdersTableView.jsx`**
  - Define `PIPELINE` array in helper scope.
  - When `currentFilter` is in `PIPELINE`:
    - If `unit.is_dept_completed === true` or `unit.is_downstream === true`, or `PIPELINE.indexOf(unit.current_dept) > PIPELINE.indexOf(currentFilter)`:
      Return `'Completed'`.
    - Handle Sales specifically: If `currentFilter === 'Sales'` and `unit.current_dept !== 'Sales'`, return `'Completed'`.

- [ ] **Step 2: Commit `AllOrdersTableView.jsx` changes**
  ```bash
  git add src/components/AllOrdersTableView.jsx
  git commit -m "feat: show Completed status for downstream panels in AllOrdersTableView department filters"
  ```

---

### Task 5: End-to-End Verification & Production Build

**Files:**
- Test files and bundle validation

- [ ] **Step 1: Run complete backend regression test suite**
  Run: `node server/test_dept_completed_visibility.js`  
  Run: `node server/test_po_system.js`  
  Run: `node server/test_sales_to_design_gate.js`  
  Run: `node server/test_task_masters_lifecycle.js`  
  Expected: All test suites PASS with zero failures.

- [ ] **Step 2: Validate frontend build**
  Run: `npm run build`  
  Expected: Vite build succeeds with 0 errors.

- [ ] **Step 3: Update knowledge graph**
  Run: `python -m graphify update .` (or equivalent graphify command)
