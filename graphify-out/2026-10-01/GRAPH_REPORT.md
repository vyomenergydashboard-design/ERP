# Graph Report - ERP  (2026-10-01)

## Corpus Check
- 73 files · ~2,273,480 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .pptx 5, (none) 4, .example 1)

## Summary
- 397 nodes · 692 edges · 20 communities (14 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edd5b330`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- AllOrdersTableView.jsx
- react
- Masters.jsx
- index.js
- OrderDocumentsModal.jsx
- server/package.json
- Database Connection & Migrations
- Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)
- PlanningModule.jsx
- verify_codebase.js
- Startup Synchronization & Serials
- Workflow Status & Email Alerts
- System Architecture & Guidelines
- Docker Container Orchestration
- Web Entry & Mount Point
- 2. Requirements & Acceptance Criteria
- Spec: Design Department Confirmation Gate & Dynamic Release Documents Status
- Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents

## God Nodes (most connected - your core abstractions)
1. `react` - 33 edges
2. `lucide-react` - 24 edges
3. `Dashboard()` - 22 edges
4. `DocumentPreviewModal()` - 13 edges
5. `AllOrdersTableView()` - 12 edges
6. `pool` - 11 edges
7. `Spec: Design Department Confirmation Gate & Dynamic Release Documents Status` - 11 edges
8. `renderCellContent()` - 10 edges
9. `OrderDocumentsModal()` - 10 edges
10. `ErrorBoundary` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Testing & Verification Strategy` --references--> `ExcelSheetViewer()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/ExcelSheetViewer.jsx
- `Success Criteria` --references--> `ExcelSheetViewer()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/ExcelSheetViewer.jsx
- `Success Criteria` --references--> `TechnicalDocsModal()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/TechnicalDocsModal.jsx
- `3. Implementation Steps` --references--> `getCellTooltip()`  [INFERRED]
  tasks/plan.md → src/components/AllOrdersTableView.jsx
- `Tasks: Complete Text Visibility & Auto-Fit Across Tables` --references--> `getCellTooltip()`  [INFERRED]
  tasks/todo.md → src/components/AllOrdersTableView.jsx

## Import Cycles
- None detected.

## Communities (20 total, 6 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (30): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand (+22 more)

### Community 1 - "App.jsx"
Cohesion: 0.07
Nodes (37): react-dom, App(), Dashboard(), DocumentDirectory, LogsView, Masters, OrderCreationFlow, OrderImport (+29 more)

### Community 2 - "AllOrdersTableView.jsx"
Cohesion: 0.14
Nodes (25): AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS, formatFastDate(), formatFastDateTime(), getCellTooltip() (+17 more)

### Community 3 - "react"
Cohesion: 0.13
Nodes (18): lucide-react, react, AddPartMasterModal(), DEPT_COLORS, PRIORITY_CONFIG, STEP_STATUS_CONFIG, StepPill(), UnitRow() (+10 more)

### Community 4 - "Masters.jsx"
Cohesion: 0.17
Nodes (18): DOC_TYPE_THEMES, DocumentPreviewModal(), EXTENSION_TYPE_MAP, formatDMY(), formatSize(), getDocumentType(), ImageViewerPane(), UnsupportedFallbackPane() (+10 more)

### Community 5 - "index.js"
Cohesion: 0.06
Nodes (32): pool, allowedOrigins, app, BLOCKED_EXTENSIONS, DEFAULT_STEPS, defaultAllowedOrigins, deriveUnitStatus(), __dirname (+24 more)

### Community 6 - "OrderDocumentsModal.jsx"
Cohesion: 0.17
Nodes (15): ref_xlsx, BulkImportModal(), DOC_TYPES, DocumentManager(), PO_AUTHORIZED_ROLES, ExcelSheetViewer(), formatFileSize(), getDocCategoryLabel() (+7 more)

### Community 7 - "server/package.json"
Cohesion: 0.06
Nodes (30): ref_assert, bcryptjs, cors, dotenv, express, multer, nodemailer, pg (+22 more)

### Community 9 - "Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)"
Cohesion: 0.12
Nodes (16): 1. Document Separation & Storage Isolation, 2. Revision Calculation for Non-Standard Documents, 3. Role-Based Access Control (RBAC), Action Boundaries, Boundaries, Code Style & Implementation Standard, Commands, Data Contracts & Architecture (+8 more)

### Community 10 - "PlanningModule.jsx"
Cohesion: 0.29
Nodes (8): DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS, PlanningModule()

### Community 11 - "verify_codebase.js"
Cohesion: 0.06
Nodes (35): ref_babel_parser, ref_babel_traverse, ref_fs, jsonwebtoken, ref_module, ref_os, ref_path, ref_url (+27 more)

### Community 18 - "2. Requirements & Acceptance Criteria"
Cohesion: 0.22
Nodes (8): 1. Objective, 2. Requirements & Acceptance Criteria, A. Comprehensive Column Width & Safe Minimum Scale, B. Auto-Upgrade of Squashed Widths in LocalStorage, C. Double-Click Auto-Fit on Column Resize Handles, D. Rich, Informative, Unmasked Tooltips, E. Department Worklists & Other Modules, Spec & Implementation Plan: Complete Text Visibility & Auto-Fit Across Table Views

### Community 21 - "Spec: Design Department Confirmation Gate & Dynamic Release Documents Status"
Cohesion: 0.12
Nodes (15): 10. Open Questions, 1. Objective, 2. Tech Stack, 3. Commands, 4. Project Structure & Affected Modules, 5.1 Database Schema (Additive & Non-Destructive), 5.2 Backend API & Workflow Logic, 5.3 Frontend UI/UX in `AllOrdersTableView.jsx` (+7 more)

### Community 22 - "Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents"
Cohesion: 0.50
Nodes (3): Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents, Core Intent, Metadata

## Knowledge Gaps
- **135 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+130 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 182 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.jsx`, `AllOrdersTableView.jsx`, `Masters.jsx`, `OrderDocumentsModal.jsx`, `PlanningModule.jsx`?**
  _High betweenness centrality (0.240) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `package.json`, `App.jsx`, `AllOrdersTableView.jsx`, `Masters.jsx`, `OrderDocumentsModal.jsx`, `PlanningModule.jsx`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _135 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06641604010025062 - nodes in this community are weakly interconnected._
- **Should `AllOrdersTableView.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1396011396011396 - nodes in this community are weakly interconnected._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.1268939393939394 - nodes in this community are weakly interconnected._