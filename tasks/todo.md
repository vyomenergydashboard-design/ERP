# Tasks: Non-Standard Panel Drawings & BOM Support

- [x] **Task 1: Non-Standard Document State and History Derivation in `AllOrdersTableView.jsx`**
  - **Description:** Fix the card bindings in [AllOrdersTableView.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/AllOrdersTableView.jsx) so Card 1 displays `latestCustomDrawing` and Card 2 displays `latestCustomBom`. Compute chronological revision labels (`R0`, `R1`, `R2`...) based on `uploaded_at` ascending and generate reverse-chronological history lists for both Drawings and BOMs.
  - **Acceptance:**
    - Non-standard panel modal displays the actual latest uploaded custom drawing in Card 1 and latest custom BOM in Card 2.
    - Each revision is labeled `R0`, `R1`, etc. according to its chronological upload sequence.
    - Earlier revisions are listed in expandable accordions with file names, sizes, uploaders, and timestamps.
  - **Verify:** `npm run check` passes with 0 undeclared variables.
  - **Files:** `src/components/AllOrdersTableView.jsx`

- [x] **Task 2: Actions, Previews & RBAC Guardrails in `AllOrdersTableView.jsx`**
  - **Description:** Lock edit actions (`Upload New Revision`, `Delete Revision`) on non-standard panels strictly to `Admin` and `Design` roles. Ensure deletion calls `handleDeleteOrderDoc(doc.id)` (hitting `/api/documents/:id`) rather than the master catalog endpoint. Enable in-browser [ExcelSheetViewer](file:///c:/Users/cerul/Documents/ERP/src/components/ExcelSheetViewer.jsx) preview for spreadsheet BOM files.
  - **Acceptance:**
    - Non-Design / Non-Admin users see read-only controls (Preview & Download only).
    - Deleting a non-standard document calls `handleDeleteOrderDoc`, properly removing it from `documents` and state without touching `part_number_masters`.
    - Clicking Preview on an Excel BOM opens [ExcelSheetViewer](file:///c:/Users/cerul/Documents/ERP/src/components/ExcelSheetViewer.jsx) modal.
  - **Verify:** `npm run check` and `npm run build` succeed cleanly.
  - **Files:** `src/components/AllOrdersTableView.jsx`

- [x] **Task 3: Verification, Subagent Audit, and Knowledge Graph Update**
  - **Description:** Run full automated linter checks, run production build, dispatch the `code-reviewer` subagent to audit changes, and update the graphify index.
  - **Acceptance:**
    - `npm run check` passes with 0 errors.
    - `npm run build` generates production bundle cleanly.
    - 5-axis code review completed with 0 blockers.
    - `graphify update .` running/completed.
  - **Verify:** Clean command outputs and positive review report.
  - **Files:** `tasks/todo.md`, `tasks/plan.md`

- [x] **Task 4: De-clutter and Streamline Non-Standard Modal UI**
  - **Description:** Remove redundant disclaimers and repeated upload UI:
    - Removed `NOT IN MASTERS` badge and verbose repetitive banner copy.
    - Removed `"Attached specifically to Unit ... · Not inherited into Part Masters"` subtitle.
    - Removed the redundant bottom `"Upload Custom Technical Document"` box with radio buttons (`Target Document: Technical Drawing (creates R0) / Bill of Materials / BOM (creates R0)`).
    - Removed the purple `"Unit-Specific Upload: Documents uploaded here apply exclusively to Unit ... and will not be inherited into the Master Part Catalog"` disclaimer box.
    - Wired Card 1 (`+ Upload Drawing (R0)` & `+ New Rev`) and Card 2 (`+ Upload BOM (R0)` & `+ New Rev`) directly to immediate file upload triggers with automatic revision assignment.
  - **Acceptance:**
    - Clean, modern dual-card UI without duplicate upload triggers or redundant disclaimers.
    - Direct card upload seamlessly uploads Drawing or BOM and assigns `R0`, `R1`, etc.
  - **Verify:** `npm.cmd run build` passes with 0 errors; 0 undeclared variables.
  - **Files:** `src/components/AllOrdersTableView.jsx`
