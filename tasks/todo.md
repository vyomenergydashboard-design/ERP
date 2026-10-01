# Tasks: Resilient & Dynamic Task Masters Lifecycle

- [x] **Task 1: Clean Removal of "Confirm Dispatch Date" & "Sales Clearance"**
  - **Description:** Remove "Confirm Dispatch Date" and "Sales Clearance" from `task_masters` and step tables, remove them from `run_deployment_migrations.js`, and remove `CORE_PROTECTED_TASKS` block in `server/index.js` and `Masters.jsx`.
  - **Files:** `server/index.js`, `server/run_deployment_migrations.js`, `src/components/Masters.jsx`

- [x] **Task 2: Non-Advancing Task Deletion in `server/index.js`**
  - **Description:** Refactor `DELETE /api/task_masters/:id` so deleting a task master deletes step instances without running a global `deriveUnitStatus` that pushes in-flight orders forward.
  - **Files:** `server/index.js`

- [x] **Task 3: Selective Task Addition in `server/index.js`**
  - **Description:** Refactor `POST /api/task_masters` so newly added tasks are populated into new orders and active orders currently in that department, but never into orders that have already passed that department or completed.
  - **Files:** `server/index.js`

- [x] **Task 4: Dynamic Department Progression & Sales Retention (`deriveUnitStatus`)**
  - **Description:** Ensure units stay in Sales as long as Sales tasks (such as "Upload PO") are pending, and only advance to Design once Sales tasks are marked done.
  - **Files:** `server/index.js`

- [x] **Task 5: Self-Healing Migration & Production Realignment**
  - **Description:** Ensure `run_deployment_migrations.js` cleanly removes unused Sales tasks, realigns active orders with pending POs to Sales, and leaves downstream orders in their proper departments.
  - **Files:** `server/run_deployment_migrations.js`

- [x] **Task 6: Verification Tests & Production Build**
  - **Description:** Verify deletion does not advance departments, verify addition does not affect downstream orders, run `node server/test_po_system.js`, and verify `npm run build`.
  - **Files:** `server/test_po_system.js`, `dist/`
