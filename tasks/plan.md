# Implementation Plan: Resilient & Dynamic Task Masters Lifecycle

## 1. Overview
Empower admins to freely add, edit, and delete task templates in Task Masters across all departments without artificial deletion blocks. Ensure deleting a task template removes that step from active orders without automatically advancing or shifting their current department. Ensure adding a task template never applies retroactively to orders that have already passed that department. Maintain orders in Sales until their mandatory Sales tasks (like "Upload PO") are completed.

---

## 2. Architecture Decisions
1. **Dynamic Task Deletion (`DELETE /api/task_masters/:id`):**
   - Remove the step instances linked to `task_id` from `order_steps` and `unit_steps`.
   - Stop invoking global `deriveUnitStatus` on all orders during template deletion, which previously caused active units to prematurely jump forward into Design.
   - Remove `CORE_PROTECTED_TASKS` deletion blocks in both backend API and frontend UI (`Masters.jsx`).
2. **Selective Task Addition (`POST /api/task_masters`):**
   - When a new task is created, add it only to new orders and active orders/units currently in that department.
   - Never add new tasks to orders that have already progressed past that department or completed, preventing downstream manufacturing work from being blocked or pulled backward.
3. **Sales Retention in `deriveUnitStatus`:**
   - In `deriveUnitStatus`, an order remains in `Sales` as long as its Sales order tasks (such as "Upload PO") have not been completed (`status !== 'done'`).
   - Units advance to `Design` only when Sales tasks are genuinely done.
4. **Data Healing in `run_deployment_migrations.js`:**
   - Remove "Confirm Dispatch Date" and "Sales Clearance" from `task_masters` and step tables.
   - Realignt units with pending POs to `current_dept = 'Sales'` and `status = 'Pending'`.

---

## 3. Task List

### Phase 1: Task Masters Deletion & Addition Mechanics
- [ ] **Task 1: Clean Removal of "Confirm Dispatch Date" & "Sales Clearance"**
  - Delete "Confirm Dispatch Date" and "Sales Clearance" from `task_masters` and active steps.
  - Remove from `run_deployment_migrations.js`.
  - Remove `CORE_PROTECTED_TASKS` block in `server/index.js` and `Masters.jsx`.
- [ ] **Task 2: Non-Advancing Task Deletion in `server/index.js`**
  - Update `DELETE /api/task_masters/:id` to remove the task without shifting orders' current departments.
- [ ] **Task 3: Selective Task Addition in `server/index.js`**
  - Update `POST /api/task_masters` to only apply new tasks to orders currently in that department, never to downstream/completed orders.

### Phase 2: Pipeline State Machine & Sales Department Retention
- [ ] **Task 4: Dynamic Department Progression & Sales Retention (`deriveUnitStatus`)**
  - Enforce that orders in Sales remain in Sales while "Upload PO" (or any Sales order step) is pending.
  - Units transition to Design only once Sales steps are done.
- [ ] **Task 5: Self-Healing Migration & Production Realignment**
  - Update `run_deployment_migrations.js` to ensure clean state and correct department positioning on boot.

### Phase 3: Verification & Checkpoint
- [ ] **Task 6: Verification Tests & Production Build**
  - Verify task deletion does not shift order departments.
  - Verify task addition does not affect downstream orders.
  - Run PO system tests and `npm run build`.

---

## 4. Risks & Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Deleting a task leaves an order with 0 tasks in that department | Low | Order stays in current department until explicitly moved or remaining tasks are completed |
| Newly added task blocks an order already in production | High | Strict filter ensures only orders currently in that department receive the new task |
| Database migration modifies order numbers or serials | Critical | Invariant: No updates to `order_number`, `unit_id`, or `short_serial` |
