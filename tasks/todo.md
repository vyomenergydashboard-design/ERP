# Tasks: Complete Text Visibility & Auto-Fit Across Tables

- [x] **Task 1: Upgrade Default Column Widths & Safe Minimums**
  - **Description:** Update `DEFAULT_COL_WIDTHS` and `MIN_COL_WIDTHS` in `src/components/AllOrdersTableView.jsx` to generous, comfortable values (status: 220px, serial: 155px, priority: 140px, delivery: 155px, project: 185px, description: 255px, comments: 220px, client: 200px).
  - **Acceptance:** Full headers and status badges fit without truncation.
  - **Files:** `src/components/AllOrdersTableView.jsx`

- [x] **Task 2: Automatic LocalStorage Width Migration**
  - **Description:** Update the localStorage column width loader in `AllOrdersTableView.jsx` to enforce `MIN_COL_WIDTHS` and bump storage version to `erp_all_colWidths_v5`.
  - **Acceptance:** Existing sessions with squashed widths auto-upgrade to readable widths immediately.
  - **Files:** `src/components/AllOrdersTableView.jsx`

- [x] **Task 3: Implement Double-Click Auto-Fit on Column Resize Handles**
  - **Description:** Add `onDoubleClick={() => handleAutoFitColumn(colKey)}` on `.erp-resize-handle`. Measure maximum text length for visible rows and header, automatically sizing the column.
  - **Acceptance:** Double-clicking column divider smoothly expands/shrinks column to fit text completely.
  - **Files:** `src/components/AllOrdersTableView.jsx`

- [x] **Task 4: Rich, Informative & Unmasked Tooltips**
  - **Description:** Fix `case 'unit_status':` in `renderCellContent` to remove child `title` masking. Enhance `getCellTooltip` so hovering over any cell displays 100% of the information (status, step name, reason, actor, date).
  - **Acceptance:** Hovering over status shows `Cancelled @ Sales Clearance` with actor, date, and reason, not generic `Cancelled: Cancelled`.
  - **Files:** `src/components/AllOrdersTableView.jsx`

- [x] **Task 5: Refine DeptWorklist & General Table Styles**
  - **Description:** Ensure status pills and steps in `DeptWorklist.jsx` have full text visibility and descriptive tooltips.
  - **Files:** `src/components/DeptWorklist.jsx`, `src/index.css`

- [x] **Task 6: Verification & Build Validation**
  - **Description:** Run `npm run check`, `npm run build`, and integration test suite to verify 0 regressions.
  - **Files:** `server/test_po_system.js`, `dist/`
