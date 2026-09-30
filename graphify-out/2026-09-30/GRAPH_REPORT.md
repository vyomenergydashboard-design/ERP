# Graph Report - ERP  (2026-09-30)

## Corpus Check
- 70 files · ~2,271,247 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .pptx 5, (none) 4, .example 1)

## Summary
- 369 nodes · 656 edges · 23 communities (15 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `885d4932`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- AllOrdersTableView.jsx
- react
- Masters.jsx
- index.js
- ErrorBoundary
- server/package.json
- Database Connection & Migrations
- Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)
- Production Planning Module
- verify_codebase.js
- Startup Synchronization & Serials
- DeptWorklist.jsx
- Workflow Status & Email Alerts
- System Architecture & Guidelines
- Docker Container Orchestration
- Web Entry & Mount Point
- Technical Implementation Plan: Design Department Confirmation & Dynamic Release Documents
- todo.md
- db.js
- Spec: Design Department Confirmation Gate & Dynamic Release Documents Status
- Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents

## God Nodes (most connected - your core abstractions)
1. `react` - 32 edges
2. `lucide-react` - 23 edges
3. `Dashboard()` - 22 edges
4. `AllOrdersTableView()` - 12 edges
5. `DocumentPreviewModal()` - 12 edges
6. `pool` - 11 edges
7. `Spec: Design Department Confirmation Gate & Dynamic Release Documents Status` - 11 edges
8. `OrderDocumentsModal()` - 10 edges
9. `ErrorBoundary` - 9 edges
10. `Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Testing & Verification Strategy` --references--> `ExcelSheetViewer()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/ExcelSheetViewer.jsx
- `Success Criteria` --references--> `TechnicalDocsModal()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/AllOrdersTableView.jsx
- `Success Criteria` --references--> `ExcelSheetViewer()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/ExcelSheetViewer.jsx
- `Dashboard()` --calls--> `AllOrdersTableView()`  [EXTRACTED]
  src/App.jsx → src/components/AllOrdersTableView.jsx
- `Dashboard()` --calls--> `ErrorBoundary`  [EXTRACTED]
  src/App.jsx → src/components/ErrorBoundary.jsx

## Import Cycles
- None detected.

## Communities (23 total, 8 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (30): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand (+22 more)

### Community 1 - "App.jsx"
Cohesion: 0.09
Nodes (39): App(), Dashboard(), ProtectedRoute(), BoardView(), StatusBadge(), BulkImportModal(), DeptWorklist(), DOC_TYPES (+31 more)

### Community 2 - "AllOrdersTableView.jsx"
Cohesion: 0.11
Nodes (34): react-dom, ref_xlsx, Success Criteria, AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS (+26 more)

### Community 3 - "react"
Cohesion: 0.18
Nodes (12): lucide-react, react, AddPartMasterModal(), EditRefTagModal(), Modal(), getDefaultFormData(), getInitialFormData(), getTodayDateStr() (+4 more)

### Community 4 - "Masters.jsx"
Cohesion: 0.18
Nodes (17): DOC_TYPE_THEMES, DocumentPreviewModal(), EXTENSION_TYPE_MAP, formatDMY(), formatSize(), getDocumentType(), ImageViewerPane(), UnsupportedFallbackPane() (+9 more)

### Community 5 - "index.js"
Cohesion: 0.09
Nodes (22): app, DEFAULT_STEPS, deriveUnitStatus(), __dirname, evaluateUnitDesignDocuments(), __filename, formatOrderNumber(), generateOrderNumber() (+14 more)

### Community 7 - "server/package.json"
Cohesion: 0.07
Nodes (26): bcryptjs, cors, dotenv, express, multer, nodemailer, pg, pool (+18 more)

### Community 9 - "Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)"
Cohesion: 0.12
Nodes (15): 1. Document Separation & Storage Isolation, 2. Revision Calculation for Non-Standard Documents, 3. Role-Based Access Control (RBAC), Action Boundaries, Boundaries, Code Style & Implementation Standard, Commands, Data Contracts & Architecture (+7 more)

### Community 10 - "Production Planning Module"
Cohesion: 0.29
Nodes (8): DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS, PlanningModule()

### Community 11 - "verify_codebase.js"
Cohesion: 0.06
Nodes (35): ref_babel_parser, ref_babel_traverse, ref_fs, jsonwebtoken, ref_module, ref_os, ref_path, ref_url (+27 more)

### Community 13 - "DeptWorklist.jsx"
Cohesion: 0.40
Nodes (5): DEPT_COLORS, PRIORITY_CONFIG, STEP_STATUS_CONFIG, StepPill(), UnitRow()

### Community 18 - "Technical Implementation Plan: Design Department Confirmation & Dynamic Release Documents"
Cohesion: 0.29
Nodes (6): Architectural Overview, Major Components & Dependencies, Phases & Build Order, Risks & Mitigation Strategies, Technical Implementation Plan: Design Department Confirmation & Dynamic Release Documents, Verification Checkpoints

### Community 20 - "db.js"
Cohesion: 0.18
Nodes (5): pool, extractYearFromOrder(), formatOrderNumber(), migrate(), migrateUnitSerials()

### Community 21 - "Spec: Design Department Confirmation Gate & Dynamic Release Documents Status"
Cohesion: 0.12
Nodes (15): 10. Open Questions, 1. Objective, 2. Tech Stack, 3. Commands, 4. Project Structure & Affected Modules, 5.1 Database Schema (Additive & Non-Destructive), 5.2 Backend API & Workflow Logic, 5.3 Frontend UI/UX in `AllOrdersTableView.jsx` (+7 more)

### Community 22 - "Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents"
Cohesion: 0.50
Nodes (3): Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents, Core Intent, Metadata

## Knowledge Gaps
- **129 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+124 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 166 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `package.json`, `App.jsx`, `AllOrdersTableView.jsx`, `Masters.jsx`, `Production Planning Module`, `DeptWorklist.jsx`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `package.json`, `App.jsx`, `AllOrdersTableView.jsx`, `Masters.jsx`, `Production Planning Module`, `DeptWorklist.jsx`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Why does `Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)` connect `Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)` to `AllOrdersTableView.jsx`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _129 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06451612903225806 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08563134978229318 - nodes in this community are weakly interconnected._
- **Should `AllOrdersTableView.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._