# Graph Report - ERP  (2026-09-29)

## Corpus Check
- 67 files · ~2,265,759 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .pptx 5, (none) 4, .example 1)

## Summary
- 337 nodes · 616 edges · 20 communities (12 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e3569446`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Frontend Packages & Tooling
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
- Integration & PO Testing Suite
- Startup Synchronization & Serials
- DeptWorklist.jsx
- Workflow Status & Email Alerts
- System Architecture & Guidelines
- Docker Container Orchestration
- Web Entry & Mount Point
- Implementation Plan: Non-Standard Panel Drawings & BOM Support
- todo.md

## God Nodes (most connected - your core abstractions)
1. `react` - 32 edges
2. `lucide-react` - 23 edges
3. `Dashboard()` - 22 edges
4. `AllOrdersTableView()` - 12 edges
5. `DocumentPreviewModal()` - 12 edges
6. `pool` - 11 edges
7. `OrderDocumentsModal()` - 10 edges
8. `ErrorBoundary` - 9 edges
9. `Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)` - 9 edges
10. `ExcelSheetViewer()` - 8 edges

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

## Communities (20 total, 8 thin omitted)

### Community 0 - "Frontend Packages & Tooling"
Cohesion: 0.07
Nodes (29): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand (+21 more)

### Community 1 - "App.jsx"
Cohesion: 0.09
Nodes (39): react-router-dom, App(), Dashboard(), ProtectedRoute(), BoardView(), StatusBadge(), BulkImportModal(), DeptWorklist() (+31 more)

### Community 2 - "AllOrdersTableView.jsx"
Cohesion: 0.10
Nodes (34): react-dom, ref_xlsx, Success Criteria, AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS (+26 more)

### Community 3 - "react"
Cohesion: 0.17
Nodes (13): lucide-react, react, AddPartMasterModal(), DOC_TYPES, EditRefTagModal(), Modal(), getDefaultFormData(), getInitialFormData() (+5 more)

### Community 4 - "Masters.jsx"
Cohesion: 0.24
Nodes (13): DocumentPreviewModal(), formatDMY(), formatSize(), getDocumentType(), ImageViewerPane(), UnsupportedFallbackPane(), buildCondition(), DATAKEY_OPTIONS (+5 more)

### Community 5 - "index.js"
Cohesion: 0.07
Nodes (25): pool, app, DEFAULT_STEPS, deriveUnitStatus(), __dirname, __filename, formatOrderNumber(), generateOrderNumber() (+17 more)

### Community 7 - "server/package.json"
Cohesion: 0.06
Nodes (33): bcryptjs, cors, dotenv, express, jsonwebtoken, multer, nodemailer, pg (+25 more)

### Community 9 - "Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)"
Cohesion: 0.12
Nodes (15): 1. Document Separation & Storage Isolation, 2. Revision Calculation for Non-Standard Documents, 3. Role-Based Access Control (RBAC), Action Boundaries, Boundaries, Code Style & Implementation Standard, Commands, Data Contracts & Architecture (+7 more)

### Community 10 - "Production Planning Module"
Cohesion: 0.29
Nodes (8): DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS, PlanningModule()

### Community 11 - "Integration & PO Testing Suite"
Cohesion: 0.09
Nodes (21): ref_babel_parser, ref_babel_traverse, ref_fs, ref_module, ref_path, ref_url, content, filePath (+13 more)

### Community 13 - "DeptWorklist.jsx"
Cohesion: 0.40
Nodes (5): DEPT_COLORS, PRIORITY_CONFIG, STEP_STATUS_CONFIG, StepPill(), UnitRow()

### Community 18 - "Implementation Plan: Non-Standard Panel Drawings & BOM Support"
Cohesion: 0.22
Nodes (8): Architecture Decisions, Implementation Plan: Non-Standard Panel Drawings & BOM Support, Overview, Phase 1: Core Logic & Card Bindings, Phase 2: Actions, Previews & RBAC, Phase 3: Verification & Subagent Audit, Risks and Mitigations, Task List

## Knowledge Gaps
- **110 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+105 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 145 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Frontend Packages & Tooling`, `App.jsx`, `AllOrdersTableView.jsx`, `Masters.jsx`, `Production Planning Module`, `DeptWorklist.jsx`?**
  _High betweenness centrality (0.244) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `Frontend Packages & Tooling`, `App.jsx`, `AllOrdersTableView.jsx`, `Masters.jsx`, `Production Planning Module`, `DeptWorklist.jsx`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Why does `Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)` connect `Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)` to `AllOrdersTableView.jsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _110 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Packages & Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08635703918722787 - nodes in this community are weakly interconnected._
- **Should `AllOrdersTableView.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10384068278805121 - nodes in this community are weakly interconnected._