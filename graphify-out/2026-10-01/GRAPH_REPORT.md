# Graph Report - ERP  (2026-10-01)

## Corpus Check
- 74 files · ~2,275,928 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .pptx 5, (none) 4, .example 1)

## Summary
- 402 nodes · 698 edges · 25 communities (18 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dc076f86`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- AllOrdersTableView.jsx
- db.js
- Masters.jsx
- index.js
- OrderCreationFlow.jsx
- server/package.json
- Database Connection & Migrations
- OrderDocumentsModal.jsx
- PlanningModule.jsx
- test_design_confirmation.js
- Startup Synchronization & Serials
- deriveUnitStatus
- Workflow Status & Email Alerts
- System Architecture & Guidelines
- Docker Container Orchestration
- Web Entry & Mount Point
- Implementation Plan: Resilient & Dynamic Task Masters Lifecycle
- DeptWorklist.jsx
- verify_codebase.js
- Spec: Design Department Confirmation Gate & Dynamic Release Documents Status
- Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents
- dependencies
- bcryptjs

## God Nodes (most connected - your core abstractions)
1. `react` - 33 edges
2. `lucide-react` - 24 edges
3. `Dashboard()` - 22 edges
4. `DocumentPreviewModal()` - 13 edges
5. `AllOrdersTableView()` - 12 edges
6. `pool` - 11 edges
7. `Spec: Design Department Confirmation Gate & Dynamic Release Documents Status` - 11 edges
8. `deriveUnitStatus()` - 10 edges
9. `OrderDocumentsModal()` - 10 edges
10. `ErrorBoundary` - 9 edges

## Surprising Connections (you probably didn't know these)
- `2. Architecture Decisions` --references--> `deriveUnitStatus()`  [INFERRED]
  tasks/plan.md → server/index.js
- `Phase 2: Pipeline State Machine & Sales Department Retention` --references--> `deriveUnitStatus()`  [INFERRED]
  tasks/plan.md → server/index.js
- `Tasks: Resilient & Dynamic Task Masters Lifecycle` --references--> `deriveUnitStatus()`  [INFERRED]
  tasks/todo.md → server/index.js
- `Testing & Verification Strategy` --references--> `ExcelSheetViewer()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/ExcelSheetViewer.jsx
- `Success Criteria` --references--> `TechnicalDocsModal()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/TechnicalDocsModal.jsx

## Import Cycles
- None detected.

## Communities (25 total, 7 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (30): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand (+22 more)

### Community 1 - "App.jsx"
Cohesion: 0.07
Nodes (43): lucide-react, react, react-router-dom, App(), Dashboard(), DocumentDirectory, LogsView, Masters (+35 more)

### Community 2 - "AllOrdersTableView.jsx"
Cohesion: 0.16
Nodes (23): AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS, formatFastDate(), formatFastDateTime(), getCellTooltip() (+15 more)

### Community 3 - "db.js"
Cohesion: 0.14
Nodes (9): pool, extractYearFromOrder(), formatOrderNumber(), migrate(), migrateUnitSerials(), formatOrderNumber(), parseOrderCounter(), realignUnitSerials() (+1 more)

### Community 4 - "Masters.jsx"
Cohesion: 0.17
Nodes (18): DOC_TYPE_THEMES, DocumentPreviewModal(), EXTENSION_TYPE_MAP, formatDMY(), formatSize(), getDocumentType(), ImageViewerPane(), UnsupportedFallbackPane() (+10 more)

### Community 5 - "index.js"
Cohesion: 0.09
Nodes (15): allowedOrigins, app, BLOCKED_EXTENSIONS, DEFAULT_STEPS, defaultAllowedOrigins, __dirname, __filename, formatOrderNumber() (+7 more)

### Community 6 - "OrderCreationFlow.jsx"
Cohesion: 0.24
Nodes (10): AddPartMasterModal(), EditRefTagModal(), Modal(), getDefaultFormData(), getInitialFormData(), getTodayDateStr(), OrderCreationFlow(), PanelSizeSearchSelect() (+2 more)

### Community 7 - "server/package.json"
Cohesion: 0.15
Nodes (12): cors, dotenv, express, multer, nodemailer, xlsx, main, name (+4 more)

### Community 9 - "OrderDocumentsModal.jsx"
Cohesion: 0.10
Nodes (23): ref_xlsx, 1. Document Separation & Storage Isolation, 2. Revision Calculation for Non-Standard Documents, 3. Role-Based Access Control (RBAC), Action Boundaries, Boundaries, Code Style & Implementation Standard, Commands (+15 more)

### Community 10 - "PlanningModule.jsx"
Cohesion: 0.29
Nodes (8): DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS, PlanningModule()

### Community 11 - "test_design_confirmation.js"
Cohesion: 0.06
Nodes (31): ref_assert, ref_fs, jsonwebtoken, ref_os, ref_path, pg, pool, content (+23 more)

### Community 13 - "deriveUnitStatus"
Cohesion: 0.22
Nodes (9): deriveUnitStatus(), evaluateUnitDesignDocuments(), initDB(), seedSayaUser(), sendDepartmentHandoverEmail(), syncLineItemStatusFromUnits(), syncUnitDesignDocumentStatus(), updateOrderQCStatusFromSteps() (+1 more)

### Community 18 - "Implementation Plan: Resilient & Dynamic Task Masters Lifecycle"
Cohesion: 0.22
Nodes (8): 1. Overview, 2. Architecture Decisions, 3. Task List, 4. Risks & Mitigations, Implementation Plan: Resilient & Dynamic Task Masters Lifecycle, Phase 1: Task Masters Deletion & Addition Mechanics, Phase 2: Pipeline State Machine & Sales Department Retention, Phase 3: Verification & Checkpoint

### Community 19 - "DeptWorklist.jsx"
Cohesion: 0.12
Nodes (10): DEPT_COLORS, PRIORITY_CONFIG, STEP_STATUS_CONFIG, StepPill(), UnitRow(), ErrorBoundary, AggregateStats(), DaysChip() (+2 more)

### Community 20 - "verify_codebase.js"
Cohesion: 0.14
Nodes (14): ref_babel_parser, ref_babel_traverse, ref_module, ref_url, __dirname, __filename, globalAllowList, parser (+6 more)

### Community 21 - "Spec: Design Department Confirmation Gate & Dynamic Release Documents Status"
Cohesion: 0.12
Nodes (15): 10. Open Questions, 1. Objective, 2. Tech Stack, 3. Commands, 4. Project Structure & Affected Modules, 5.1 Database Schema (Additive & Non-Destructive), 5.2 Backend API & Workflow Logic, 5.3 Frontend UI/UX in `AllOrdersTableView.jsx` (+7 more)

### Community 22 - "Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents"
Cohesion: 0.50
Nodes (3): Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents, Core Intent, Metadata

### Community 23 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, multer, nodemailer (+2 more)

## Knowledge Gaps
- **137 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+132 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 184 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `package.json`, `AllOrdersTableView.jsx`, `Masters.jsx`, `OrderCreationFlow.jsx`, `OrderDocumentsModal.jsx`, `PlanningModule.jsx`, `DeptWorklist.jsx`?**
  _High betweenness centrality (0.246) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `App.jsx` to `package.json`, `AllOrdersTableView.jsx`, `Masters.jsx`, `OrderCreationFlow.jsx`, `OrderDocumentsModal.jsx`, `PlanningModule.jsx`, `DeptWorklist.jsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `jsonwebtoken` connect `test_design_confirmation.js` to `index.js`, `server/package.json`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _137 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07372229760289462 - nodes in this community are weakly interconnected._
- **Should `db.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14333333333333334 - nodes in this community are weakly interconnected._