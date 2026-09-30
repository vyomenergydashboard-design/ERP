# Tasks: Design Confirmation Gate & Dynamic Release Documents

- [x] **Task 1: Database Migration & Schema Updates**
  - **Description:** Add `design_confirmed` (BOOLEAN DEFAULT FALSE), `design_confirmed_at` (TIMESTAMP WITH TIME ZONE), and `design_confirmed_by` (INTEGER REFERENCES users(id)) to `order_units` in `server/run_deployment_migrations.js`. Enrich `GET /api/orders` and `GET /api/units` in `server/index.js` to return these fields along with `design_confirmed_by_name`.
  - **Acceptance:**
    - Migration runs idempotently on server start or via runner without errors.
    - `GET /api/units` returns `design_confirmed`, `design_confirmed_at`, `design_confirmed_by`, and `design_confirmed_by_name`.
  - **Verify:** Run migration check in node; verify schema returns expected columns.
  - **Files:** `server/run_deployment_migrations.js`, `server/index.js`

- [x] **Task 2: Confirmation API & Dynamic Document Evaluator**
  - **Description:** Implement `evaluateUnitDesignDocuments(client, unit)` helper in `server/index.js` to check Drawing and BOM presence for Standard (Master Catalog) and Non-Standard (unit-specific custom uploads). Implement `POST /api/units/:id/design-confirm` (restricted to `Admin`, `Manager`, `Design`) to mark `design_confirmed = true`, complete Step 1 ("Review & Classify"), and dynamically set Step 2 ("Release Documents") status (Done if both docs exist, In Progress if 1 doc exists, Pending if 0 exist). In `PUT /api/units/:id`, if classification changes, reset `design_confirmed = false` and revert Step 1 & Step 2 for re-inspection.
  - **Acceptance:**
    - `POST /api/units/:id/design-confirm` marks Step 1 as `done` and sets Step 2 status accurately in a transaction.
    - Changing classification resets `design_confirmed` to false and requires re-confirmation.
    - Unconfirmed units never have Step 2 set to `done`.
  - **Verify:** Run node test script against the new endpoint.
  - **Files:** `server/index.js`

- [x] **Task 3: Table View Confirmation UI & Optimistic Updates**
  - **Description:** Update the `case 'classification':` cell in `AllOrdersTableView.jsx` to render the `Confirm` button beside the Standard / Non-Standard dropdown when `!unit.design_confirmed`, or a `✓ Confirmed` badge when `unit.design_confirmed`. Restrict action to `Design` and `Admin` users. Implement `handleConfirmDesignClassification(unit)` with optimistic local UI state update and API call. Add CSS tokens in `src/index.css`.
  - **Acceptance:**
    - `Confirm` button displays beside the dropdown for unconfirmed units.
    - Clicking `Confirm` immediately transitions the badge to `✓ Confirmed`, updates Step 1 to `done`, and updates Step 2 status in the local state.
    - Changing the dropdown resets the confirmation status.
    - Non-Design/Admin users see read-only status without the clickable confirm action.
  - **Verify:** `npm run check` passes with 0 undeclared variables.
  - **Files:** `src/components/AllOrdersTableView.jsx`, `src/index.css`

- [x] **Task 4: Part Number Modal Hook & Real-Time Sync**
  - **Description:** When a drawing or BOM is uploaded or deleted in the Part Number modal in `AllOrdersTableView.jsx`, dynamically update the local unit's Step 2 status (Done if confirmed & both exist, In Progress if 1 exists, Pending if 0 exist). Ensure `StepModal.jsx` displays accurate status and notes for Step 1 and Step 2.
  - **Acceptance:**
    - Uploading or deleting a document in the modal instantly refreshes Step 2 status in the table without requiring a page reload via `onDocumentChange={() => fetchUnits(true)}`.
    - StepModal reflects the confirmed status and updated notes.
  - **Verify:** `npm run check` and `npm run build` pass cleanly.
  - **Files:** `src/components/AllOrdersTableView.jsx`, `src/components/StepModal.jsx`

- [x] **Task 5: UI Refinement & Anti-Cluttering (frontend-ui-engineering)**
  - **Description:** Replaced clustered, disjointed dropdown and button layout with a unified, cohesive segmented control group (`.design-type-control-group`).
  - **Acceptance:**
    - Segmented capsule integrates classification selector (`.design-type-select`) and confirmation action (`.btn-confirm-action` / `.btn-confirmed-indicator`).
    - Eliminates left/right text truncation (`andard` / `Conf`) by removing faulty `justify-content: center` overflow.
    - Upgrades `DEFAULT_COL_WIDTHS.classification` to 220px and `MIN_COL_WIDTHS.classification` to 200px, with `erp_all_colWidths_v4` migration.
    - Custom SVG chevrons replace bulky OS select arrows for a clean, premium aesthetic.
    - Unconfirmed state shows clear actionable `Confirm` button; Confirmed state shows distinct emerald `✓ Confirmed` badge.
  - **Files:** `src/components/AllOrdersTableView.jsx`, `src/index.css`

- [x] **Task 6: Verification & Automated Integration Test Suite**
  - **Description:** Automated test suite `server/test_design_confirmation.js` (23/23 tests passed), PO hierarchy test suite `server/test_po_system.js` (44/44 tests passed), `npm.cmd run check` (0 syntax errors), and `npm.cmd run build` (production build succeeds).
  - **Acceptance:**
    - 23/23 tests pass in `test_design_confirmation.js`.
    - 44/44 tests pass in `test_po_system.js`.
    - Frontend bundle builds with 0 errors.
  - **Files:** `server/test_design_confirmation.js`, `server/index.js`, `tasks/todo.md`
