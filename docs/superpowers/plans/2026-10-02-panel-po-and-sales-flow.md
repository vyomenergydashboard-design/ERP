# Panel PO and Sales Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable panel-level PO-driven progression to Design, safe panel-level PO deletion in Table View, and manual panel-level Sales clearance in Flow View for Sales and Admin without requiring immediate PO upload.

**Architecture:**
- Extend `order_units` with `sales_cleared`, `sales_cleared_at`, `sales_cleared_by`, and `po_override_unlinked`.
- Update `deriveUnitStatus` to evaluate Sales clearance per unit independently based on unit PO, inherited order PO (if not unlinked), manual sales clearance, or order-level completion.
- Refactor `DELETE /api/units/:id/po-document` to safely unlink PO from the single target unit without destroying shared order documents or affecting sibling units, and re-run `deriveUnitStatus`.
- Add `POST /api/units/:id/sales-clear` for Sales and Admin to clear a panel in Flow View independently of other panels.
- Update `StepModal.jsx` and `FlowView.jsx` to support panel-scoped manual clearance without mandatory upload, and ensure PO deletion is available in `AllOrdersTableView.jsx` (and strictly excluded from Flow View).

**Tech Stack:** Node.js Express, PostgreSQL, React 18, Vite.

**Spec:** In-chat bounded design approved by user with constraint: PO delete button in Table View only, not in Flow View.

## Global Constraints
- Preserve order number and unit serial immutability (NEVER resequence).
- Retain strict Design gate: Drawing and BOM are strictly required before any panel advances past Design to Purchase.
- Deleting an order PO doc or unlinking a unit PO must never corrupt shared files for other panels.
- Flow View clearance of a panel must strictly apply to that individual panel and never mark `order_steps` done for the entire order if other units remain pending Sales.

## Review Focus
1. Sibling panel isolation when panel A uploads a PO: panel A must advance to Design while panel B remains in Sales.
2. Sibling panel isolation when panel A deletes its PO: panel A drops back to Sales while panel B keeps its PO doc and stays in Design.
3. Manual clearance without PO: Sales or Admin marking a panel done in Flow View advances only that panel to Design without requiring document upload.
4. Later PO upload: A panel manually cleared can have a PO attached later via Table View without resetting its department progression.
5. Role authorization: Non-Sales/Admin roles (e.g. Viewer, QC) must not be able to invoke `POST /api/units/:id/sales-clear`.

---

### Task 1: Database Migration for Panel Sales Clearance & PO Unlink Flag

**Files:**
- Modify: `server/run_deployment_migrations.js`
- Test: `server/test_panel_po_and_sales_flow.js`

**Interfaces:**
- Produces: Columns on `order_units`:
  - `sales_cleared BOOLEAN DEFAULT FALSE`
  - `sales_cleared_at TIMESTAMP WITH TIME ZONE`
  - `sales_cleared_by INTEGER REFERENCES users(id)`
  - `po_override_unlinked BOOLEAN DEFAULT FALSE`

- [ ] **Step 1: Write the failing test in `server/test_panel_po_and_sales_flow.js` checking for column existence in `order_units`**
- [ ] **Step 2: Run test to verify it fails**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: FAIL with missing column or migration not yet run.
- [ ] **Step 3: Implement migration in `server/run_deployment_migrations.js` adding columns if they do not exist**
- [ ] **Step 4: Run test to verify it passes**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: PASS

---

### Task 2: Per-Panel PO Advancement in `deriveUnitStatus`

**Files:**
- Modify: `server/index.js:367-402`
- Test: `server/test_panel_po_and_sales_flow.js`

**Interfaces:**
- Consumes: `order_units.po_doc_id`, `order_units.po_override_unlinked`, `order_units.sales_cleared`
- Produces: `deriveUnitStatus(unitId, clientOrPool)` independently evaluates if the unit has satisfied Sales:
  `hasUnitPo = (ou.po_doc_id IS NOT NULL)`
  `hasInheritedOrderPo = (hasOrderPoDoc && !ou.po_override_unlinked)`
  `isUnitSalesSatisfied = hasUnitPo || hasInheritedOrderPo || ou.sales_cleared || isOrderSalesDone`

- [ ] **Step 1: Add test in `server/test_panel_po_and_sales_flow.js` creating an order with two panels, attaching PO to Panel 1 only, running deriveUnitStatus on both**
- [ ] **Step 2: Run test to verify it fails**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: FAIL (Panel 1 does not advance to Design or both remain in Sales).
- [ ] **Step 3: Update `deriveUnitStatus` in `server/index.js` to calculate `isSalesDone` per unit including unit PO doc, inherited PO doc (if not unlinked), and `sales_cleared`**
- [ ] **Step 4: Run test to verify it passes**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: PASS (Panel 1 advances to Design, Panel 2 remains in Sales).

---

### Task 3: Safe Panel-Level PO Deletion

**Files:**
- Modify: `server/index.js:5077-5134` (`DELETE /api/units/:id/po-document`)
- Test: `server/test_panel_po_and_sales_flow.js`

**Interfaces:**
- Produces: `DELETE /api/units/:id/po-document`
  - Clears `po_doc_id = NULL`, `po_number = NULL`, sets `po_override_unlinked = TRUE`, `sales_cleared = FALSE`.
  - If `oldDocId` had no other units referencing it and is not an Order document, delete doc row & file.
  - NEVER delete order-level PO docs that sibling panels may rely on.
  - Calls `await deriveUnitStatus(unit.id, pool)`.

- [ ] **Step 1: Add test in `server/test_panel_po_and_sales_flow.js` where Panel 1 deletes its PO document: verify Panel 1 drops to Sales, Panel 2 retains its PO and stays in Design**
- [ ] **Step 2: Run test to verify it fails**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: FAIL (either order doc deleted, or panel status not updated to Sales).
- [ ] **Step 3: Refactor `DELETE /api/units/:id/po-document` in `server/index.js`**
- [ ] **Step 4: Run test to verify it passes**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: PASS

---

### Task 4: Panel Sales Clear Endpoint (`POST /api/units/:id/sales-clear`)

**Files:**
- Modify: `server/index.js`
- Test: `server/test_panel_po_and_sales_flow.js`

**Interfaces:**
- Produces: `POST /api/units/:id/sales-clear`
  - Auth: `['Sales', 'Admin', 'Manager']`
  - Sets `ou.sales_cleared = TRUE`, `ou.sales_cleared_at = NOW()`, `ou.sales_cleared_by = req.user.id`
  - Updates any unit-level Sales steps for this unit to `status = 'done'`
  - Calls `await deriveUnitStatus(unit.id, pool)`
  - Returns `{ success: true, unit_id, current_dept: 'Design' }`

- [ ] **Step 1: Add test in `server/test_panel_po_and_sales_flow.js` for `POST /api/units/:id/sales-clear` verifying only target unit is cleared to Design without PO doc**
- [ ] **Step 2: Run test to verify it fails (404 Not Found)**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: FAIL with 404.
- [ ] **Step 3: Implement `POST /api/units/:id/sales-clear` in `server/index.js`**
- [ ] **Step 4: Run test to verify it passes**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: PASS

---

### Task 5: StepModal & FlowView Updates

**Files:**
- Modify: `src/components/StepModal.jsx`
- Modify: `src/components/FlowView.jsx`

**Interfaces:**
- StepModal: Allows Sales/Admin to complete Sales step even if no file uploaded.
- FlowView:
  - When `selectedUnitId` is active, clicking "Complete" on Sales task invokes `POST /api/units/:selectedUnitId/sales-clear`.
  - Only selected panel advances; sibling panels in order remain in Sales.
  - Ensures NO PO delete button is added to Flow View.

- [ ] **Step 1: Update `StepModal.jsx` to relax `requires_upload && docCount === 0` blocking condition when `step.dept === 'Sales'` and user role is `Sales`, `Admin`, or `Manager`**
- [ ] **Step 2: Update `FlowView.jsx` to route Sales task completion to `POST /api/units/:selectedUnitId/sales-clear` when a panel is selected**
- [ ] **Step 3: Verify build compiles cleanly**
  Run: `npm run build`
  Expected: PASS

---

### Task 6: TableView PO Deletion UI & End-to-End Regression Verification

**Files:**
- Modify: `src/components/AllOrdersTableView.jsx`
- Test: `server/test_sales_to_design_gate.js`, `server/test_po_system.js`, `server/test_security_hardening.js`

**Interfaces:**
- TableView: Ensures panel-level PO delete button is available on expandable row and PO column for Sales/Admin/Manager, with confirmation dialog.

- [ ] **Step 1: Ensure TableView has clean PO delete action at panel level calling `DELETE /api/units/:id/po-document`**
- [ ] **Step 2: Run complete integration test suite**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Run: `node server/test_sales_to_design_gate.js`
  Run: `node server/test_po_system.js`
  Run: `node server/test_security_hardening.js`
  Expected: ALL PASS (100%)
- [ ] **Step 3: Run production frontend build**
  Run: `npm run build`
  Expected: Build succeeds with 0 errors.
