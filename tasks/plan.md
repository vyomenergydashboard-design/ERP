# Spec & Implementation Plan: Complete Text Visibility & Auto-Fit Across Table Views

## 1. Objective
Enable users in every department and module to view all table contents, headers, and statuses completely without truncation. Ensure that when any cell content exceeds visible bounds, rich informative tooltips provide 100% of the details (including status, step, reason, actor, and date). Provide 1-click double-click column auto-fit to adapt column widths to their widest content.

---

## 2. Requirements & Acceptance Criteria

### A. Comprehensive Column Width & Safe Minimum Scale
- **Status Column (`unit_status`):**
  - Increase default width from `130px` to `220px` (min safe width: `190px`).
  - Ensures full status badges like `✕ Cancelled @ Sales Clearance` and `⏸ Hold @ Mechanical Assembly` are completely visible.
- **Serial Number Column (`short_serial`):**
  - Increase default width from `130px` to `155px` (min safe width: `145px`).
  - Prevents header truncation to `SERIA...`.
- **Priority Column (`priority`):**
  - Increase default width from `115px` to `140px` (min safe width: `130px`).
  - Prevents header truncation to `PRI...`.
- **Delivery Date Column (`delivery_date`):**
  - Increase default width from `130px` to `155px` (min safe width: `140px`).
  - Prevents header truncation to `DELIV...`.
- **Project Name Column (`project_name`):**
  - Increase default width from `160px` to `185px` (min safe width: `165px`).
  - Prevents header truncation to `PROJEC...`.
- **Description Column (`material_description`):**
  - Increase default width from `230px` to `255px` (min safe width: `220px`).
- **Comments Column (`panel_comments`):**
  - Increase default width from `200px` to `220px` (min safe width: `185px`).
- **Company / Client Column (`company_name`):**
  - Increase default width from `185px` to `200px` (min safe width: `175px`).

### B. Auto-Upgrade of Squashed Widths in LocalStorage
- When initializing `columnWidths` from `localStorage`, check all keys against `MIN_COL_WIDTHS`.
- Any existing saved widths that are squashed or below `MIN_COL_WIDTHS` must automatically upgrade to the comfortable minimum so returning users instantly see full text without needing a manual reset.

### C. Double-Click Auto-Fit on Column Resize Handles
- Add `onDoubleClick` handler to `.erp-resize-handle`.
- Double-clicking the resize handle calculates the maximum character length across visible rows and header, automatically adjusting the column width to fit all content cleanly.

### D. Rich, Informative, Unmasked Tooltips
- Fix tooltip conflict on `unit_status`: Remove redundant/low-quality child `title="Cancelled: Cancelled"` that masked the parent `td` tooltip.
- Ensure the tooltip shows full context:
  - `Cancelled @ [Step Name]`
  - `Cancelled by: [User Name] on [Date]`
  - `Reason: [Reason]`
  - Order #, Serial #, and Client
- Apply rich tooltips across all columns (Serial, PO, Reference, Description, Comments, Project, Status, Priority, Delivery).

### E. Department Worklists & Other Modules
- Check `DeptWorklist.jsx` and other table views to ensure status pills and steps do not clip text and have full hover tooltips.

---

## 3. Implementation Steps

1. **Step 1:** Update `DEFAULT_COL_WIDTHS` and `MIN_COL_WIDTHS` in `src/components/AllOrdersTableView.jsx`.
2. **Step 2:** Enhance column widths initialization in `AllOrdersTableView.jsx` to migrate old squashed widths (`erp_all_colWidths_v5`).
3. **Step 3:** Implement double-click auto-fit logic (`handleAutoFitColumn`) on column resize handles.
4. **Step 4:** Refine status badge rendering and remove nested child title masking in `renderCellContent`.
5. **Step 5:** Enhance `getCellTooltip` to return full, structured information for statuses and text columns.
6. **Step 6:** Inspect and adjust `DeptWorklist.jsx` for consistent status display and unmasked tooltips.
7. **Step 7:** Verify build and test suite (`npm run check`, `npm run build`, `test_po_system.js`).
