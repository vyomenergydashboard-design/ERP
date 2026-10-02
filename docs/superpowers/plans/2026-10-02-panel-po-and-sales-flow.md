# Per-Panel PO Advancement and Sales Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow individual panels to advance from Sales to Design automatically when both a PO document and a PO number are present against that panel, while sibling panels without a PO remain in Sales.

**Architecture:**
- In `server/index.js` `deriveUnitStatus`: evaluate Sales completion at the **individual panel level** based on presence of a PO document (`ou.po_doc_id` or inherited order PO without unlinking) AND a PO number (`ou.po_number` or inherited order PO number), plus completion of any unit Sales tasks (or `sales_cleared`).
- In `POST /api/units/batch-po`: update order-level milestone only when all units in the order are satisfied, and ensure each target panel's status is re-derived.
- In `DELETE /api/units/:id/po-document`: safely unlink panel without destroying shared order documents, clear panel PO number, and re-derive unit status so the panel returns to Sales.
- In `POST /api/units/:id/sales-clear`: allow Sales/Admin to clear an individual panel without PO to Design.
- In `PUT /api/units/:id`: call `deriveUnitStatus` when `po_number` is updated/cleared.

**Tech Stack:** Node.js (Express, pg Pool), PostgreSQL 15, React 18.

## Global Constraints
- Order numbers and serial numbers are strictly immutable; do not renumber.
- Never truncate `task_masters` or alter existing schemas destructively.
- All SQL queries must be parameterized (`$1, $2, ...`).
- In accordance with user preference, do NOT make git commits during execution.

## Review Focus
1. **Per-Panel Advancement Independence:** Uploading a PO for Panel 1 must advance only Panel 1; Panel 2 must stay in Sales even after order or unit updates.
2. **Safe Deletion of Shared PO:** Deleting PO on Panel 1 in an order with whole-order PO must unlink Panel 1 and drop it to Sales, while leaving the shared PO file and Panel 2 in Design intact.
3. **Both PO Document AND PO Number Required:** Having only a PO number without a document, or having only a document without a PO number, must keep the panel in Sales.
4. **Immediate Re-Derivation on Update:** Updating `po_number` via `PUT /api/units/:id` or deleting PO via `DELETE /api/units/:id/po-document` must trigger `deriveUnitStatus` immediately.
5. **Worklist Visibility Compatibility:** Panels that advance to Design must remain visible in Sales worklist as Completed (preserving our previous department completion visibility).

---

### Task 1: Database Migration for Panel Sales Clearance & PO Unlink Flag

**Files:**
- Modify: `server/run_deployment_migrations.js:35-45`
- Modify: `server/init.sql:200-210`
- Test: `server/test_panel_po_and_sales_flow.js`

- [x] **Step 1: Update schema in `server/run_deployment_migrations.js` and `server/init.sql`**
  Ensure columns exist on `order_units`:
  - `po_override_unlinked BOOLEAN DEFAULT FALSE`
  - `sales_cleared BOOLEAN DEFAULT FALSE`
  - `sales_cleared_at TIMESTAMP WITH TIME ZONE`
  - `sales_cleared_by INTEGER REFERENCES users(id)`

- [x] **Step 2: Run migration check in `test_panel_po_and_sales_flow.js`**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: Test 1 passes.

---

### Task 2: Per-Panel PO Advancement in `deriveUnitStatus`

**Files:**
- Modify: `server/index.js:320-410`

- [x] **Step 1: Implement panel-level PO resolution in `deriveUnitStatus`**
  Query `order_units` joined with `orders`:
  - Check unit PO document: `ou.po_doc_id IS NOT NULL` OR document exists in `documents` with `entity_type = 'Unit' AND entity_id = ou.id AND doc_type = 'PO'`.
  - Check inherited order PO document: document exists with `entity_type = 'Order' AND entity_id = ou.order_id AND doc_type = 'PO'` AND `COALESCE(ou.po_override_unlinked, false) = false`.
  - Check resolved PO number: `COALESCE(NULLIF(TRIM(ou.po_number), ''), CASE WHEN COALESCE(ou.po_override_unlinked, false) = false THEN NULLIF(TRIM(o.po_number), '') ELSE NULL END)`.
  - Condition: `hasPanelPo = (hasPoDoc && hasPoNumber)`.
  - Panel clears Sales if `hasPanelPo || ou.sales_cleared === true`, provided no unit-level Sales steps are pending.

- [x] **Step 2: Restart backend and verify Test 2**
  Run: `docker restart vyom-erp-backend`
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: Test 2 passes (Unit 1 in Design, Unit 2 stays in Sales even after update).

---

### Task 3: Safe Panel-Level PO Deletion & Re-derivation

**Files:**
- Modify: `server/index.js:5106-5165` (`DELETE /api/units/:id/po-document`)

- [x] **Step 1: Refactor `DELETE /api/units/:id/po-document`**
  - If unit has `po_doc_id`: set `po_doc_id = NULL, po_number = NULL`. Clean up file only if no other unit references it.
  - If unit inherited order PO: set `po_override_unlinked = true, po_number = NULL`. DO NOT delete the order-level PO document from `documents` or disk.
  - Call `await deriveUnitStatus(unit.id, pool)`.

- [x] **Step 2: Restart backend and verify Test 3**
  Run: `docker restart vyom-erp-backend`
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: Test 3A and 3B pass.

---

### Task 4: Manual Panel Sales Clear Endpoint (`POST /api/units/:id/sales-clear`)

**Files:**
- Modify: `server/index.js` around line 4330

- [x] **Step 1: Implement `POST /api/units/:id/sales-clear`**
  - Role check: `['Sales', 'Admin', 'Manager']`.
  - Update `order_units SET sales_cleared = true, sales_cleared_at = NOW(), sales_cleared_by = $1 WHERE id = $2`.
  - Call `await deriveUnitStatus(id, pool)`.
  - Log activity.

- [x] **Step 2: Restart backend and verify Test 4**
  Run: `docker restart vyom-erp-backend`
  Run: `node server/test_panel_po_and_sales_flow.js`
  Expected: All 4 tests in `test_panel_po_and_sales_flow.js` pass.

---

### Task 5: Unit Update Re-derivation in `PUT /api/units/:id` & Document Upload

**Files:**
- Modify: `server/index.js` in `PUT /api/units/:id` and `POST /api/documents/upload`

- [x] **Step 1: Call `deriveUnitStatus` on `po_number` change in `PUT /api/units/:id`**
  When `po_number !== undefined`, call `deriveUnitStatus(realId, pool)`.

- [x] **Step 2: Handle `entity_type === 'Unit'` PO upload in `POST /api/documents/upload`**
  When a PO document is uploaded for a Unit, update `order_units.po_doc_id` and call `deriveUnitStatus(entity_id, pool)`.

---

### Task 6: Full Regression Suite Verification

- [x] **Step 1: Run complete test suite**
  Run: `node server/test_panel_po_and_sales_flow.js`
  Run: `node server/test_dept_completed_visibility.js`
  Run: `node server/test_po_system.js`
  Run: `node server/test_sales_to_design_gate.js`
  Run: `node server/test_task_masters_lifecycle.js`
  Expected: 100% PASS across all suites.

- [x] **Step 2: Run frontend production build**
  Run: `npm run build`
  Expected: 0 errors.
