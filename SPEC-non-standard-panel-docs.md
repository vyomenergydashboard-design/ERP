# Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)

## Objective
Support both **Technical Drawings** and **Bill of Materials (BOM)** for **Non-Standard** panels with full revision history (R0, R1...), with the strict architectural guarantee that all uploaded documents remain attached exclusively to the specific Unit and Order, and are **never inherited into or mutated within the Master Part Catalog** (`part_number_masters` / `part_number_documents`).

### User Stories
- **Design Engineers & Admins:** Can upload, replace with new revisions (R0, R1...), preview, and delete custom Drawings and BOMs for any Non-Standard panel unit.
- **Stores & Purchase:** Can inspect, preview via in-browser [ExcelSheetViewer](file:///c:/Users/cerul/Documents/ERP/src/components/ExcelSheetViewer.jsx), and download the custom BOM for procurement and kit allocation without requiring a catalog part number.
- **Production & QC:** Can view and preview both technical drawings and BOMs during assembly and inspection without risk of using obsolete revisions.

---

## Tech Stack & Commands

- **Frontend:** React 18.3, Vite 5.4, Lucide React, XLSX (SheetJS)
- **Backend:** Node.js (ES Modules), Express 4.19, PostgreSQL (`pg` Pool)
- **Styling:** CSS tokens (`var(--bg)`, `var(--border)`, etc.) in `src/index.css`

### Commands
- **Check / Lint:** `npm run check` (runs `node scripts/verify_codebase.js`)
- **Build:** `npm run build` (Vite production bundle check)
- **Dev Server:** `npm run dev`
- **Backend Server:** `cd server && node index.js`

---

## Project Structure

```
ERP/
├── SPEC-non-standard-panel-docs.md  # This formal specification
├── server/
│   ├── index.js                     # /api/documents/upload, /api/documents/:id, /api/units/:unitId/reference-documents
│   └── init.sql                     # Core documents table definition
├── src/
│   ├── components/
│   │   ├── AllOrdersTableView.jsx   # TechnicalDocsModal (Standard vs Non-Standard panel documents)
│   │   ├── OrderDocumentsModal.jsx  # Order-level document management
│   │   └── ExcelSheetViewer.jsx     # In-browser spreadsheet viewer for BOM (.xlsx, .xls, .csv)
│   └── App.jsx                      # ProtectedRoute and ErrorBoundary wrapping
└── scripts/
    └── verify_codebase.js           # Automated syntax and undeclared identifier linter
```

---

## Data Contracts & Architecture

### 1. Document Separation & Storage Isolation
- **Standard Panels:** Attach to `part_number_documents` linked via `part_number_id` (`part_number_masters.id`). Master changes propagate to all units sharing that catalog part number.
- **Non-Standard Panels:** Attach strictly to the `documents` table via:
  ```json
  {
    "entity_type": "Unit",
    "entity_id": "<order_unit_id>",
    "doc_type": "Drawing" | "BOM",
    "file_name": "example.xlsx",
    "file_path": "uploads/...",
    "file_size": 12345,
    "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "uploaded_by": "<user_id>"
  }
  ```
  *Constraint:* No rows in `part_number_masters` or `part_number_documents` shall ever be inserted, updated, or deleted for a Non-Standard panel document action.

### 2. Revision Calculation for Non-Standard Documents
Because `documents` records are timestamped (`uploaded_at`), revisions for a given `doc_type` (`Drawing` or `BOM`) on a unit are sorted chronologically:
- Earliest document = `R0`
- Subsequent revisions = `R1`, `R2`, ...
- The latest document by `uploaded_at` (or highest `id`) is marked **Latest / Current**.
- Earlier documents are preserved in an expandable **Revision History** list with download links, upload dates, file sizes, and uploader identities.

### 3. Role-Based Access Control (RBAC)
- **Edit Actions (Upload New Revision, Delete Revision):**
  Strictly restricted to roles: `['ADMIN', 'DESIGN']`.
  `Manager`, `Sales`, `Stores`, `Planning`, `Production`, `QC`, `Dispatch`, `Accounts`, `Viewer` are prohibited from mutating Non-Standard technical documents.
- **View / Preview / Download Actions:**
  Permitted for all authenticated users (including `Stores`, `Purchase`, `Production`, `QC`).

---

## Code Style & Implementation Standard

### Non-Standard Document Card Implementation Sample
```jsx
// Filtering orderDocs for Non-Standard Unit
const customDrawings = useMemo(() => {
  return (orderDocs || [])
    .filter(d => (d.doc_type || '').toLowerCase() === 'drawing')
    .sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
}, [orderDocs]);

const customBoms = useMemo(() => {
  return (orderDocs || [])
    .filter(d => {
      const dt = (d.doc_type || '').toLowerCase();
      return dt === 'bom' || dt === 'bill of materials';
    })
    .sort((a, b) => new Date(a.uploaded_at) - new Date(b.uploaded_at));
}, [orderDocs]);

// Chronological revisions: latest is last item, history is reversed earlier items
const latestCustomDrawing = customDrawings.length > 0 ? customDrawings[customDrawings.length - 1] : null;
const drawingCustomHistory = [...customDrawings].reverse(); // latest first

const latestCustomBom = customBoms.length > 0 ? customBoms[customBoms.length - 1] : null;
const bomCustomHistory = [...customBoms].reverse(); // latest first
```

### Action Boundaries
- Deletion in Non-Standard mode calls `handleDeleteOrderDoc(doc.id)` (hitting `/api/documents/:id`), NEVER `handleDeleteMasterDoc`.
- Upload in Non-Standard mode posts to `/api/documents/upload` with `entity_type: 'Unit'` and `entity_id: selectedPart.unitId`.

---

## Testing & Verification Strategy

1. **Automated Syntax & Scope Verification:**
   - Execute `npm run check` (`node scripts/verify_codebase.js`) to guarantee 0 undeclared variables, undefined hooks, or broken imports.
2. **Build Verification:**
   - Run `npm run build` to confirm clean Vite bundling.
3. **Subagent Code Review:**
   - Run `code-reviewer` on the diff in `AllOrdersTableView.jsx` across correctness, security, architecture, and performance dimensions.
4. **Behavioral Edge-Case Testing:**
   - Test empty state (no drawing, no BOM uploaded).
   - Test single file upload for Drawing (PDF/DWG) and BOM (.xlsx).
   - Test multiple revision uploads (R0 -> R1 -> R2) and verify chronological revision labeling.
   - Verify non-Design/non-Admin roles cannot see "+ New Rev" or delete buttons.
   - Verify Stores/Purchase can preview BOM in `ExcelSheetViewer` and download files.
   - Verify `part_number_masters` table count remains completely unchanged.

---

## Boundaries

- **Always do:**
  - Route non-standard uploads strictly to `/api/documents/upload` with `entity_type: 'Unit'`.
  - Validate file extensions (`.xlsx`, `.xls`, `.csv` for BOM; `.dwg`, `.dxf`, `.step`, `.pdf` for Drawing).
  - Use `handleDeleteOrderDoc` for non-standard documents.
  - Retain dark mode styling and existing CSS tokens (`var(--bg3)`, `var(--border)`, etc.).
- **Ask first:**
  - Adding new database columns to `documents` table (only if runtime performance or schema requirements dictate).
- **Never do:**
  - Never insert or modify records in `part_number_masters` or `part_number_documents` for non-standard panels.
  - Never resequence order numbers or unit serial IDs.
  - Never allow non-Design/non-Admin users to delete or overwrite engineering documents.

---

## Success Criteria

1. Non-Standard panels display two distinct, first-class cards in `TechnicalDocsModal`: **Technical Drawing** and **Bill of Materials (BOM)**.
2. Design and Admin users can upload new revisions for Drawing and BOM independently.
3. Revision numbers are calculated chronologically (`R0`, `R1`, `R2`...) and displayed clearly on each document badge.
4. "View Earlier Revisions" accordion expands to reveal all previous revisions with upload date, file size, uploader, preview, and download links.
5. In-browser spreadsheet viewer (`ExcelSheetViewer`) works directly for uploaded BOM files.
6. The Master Part Catalog (`part_number_masters`) remains 100% untouched.
7. `npm run check` and `npm run build` pass with zero errors.
