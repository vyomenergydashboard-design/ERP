# Graph Report - ERP  (2026-09-30)

## Corpus Check
- 73 files · ~2,273,240 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .pptx 5, (none) 4, .example 1)

## Summary
- 394 nodes · 685 edges · 21 communities (14 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `14b39a04`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- App.jsx
- AllOrdersTableView.jsx
- OrderCreationFlow.jsx
- Masters.jsx
- index.js
- ErrorBoundary
- server/package.json
- Database Connection & Migrations
- OrderDocumentsModal.jsx
- PlanningModule.jsx
- verify_codebase.js
- Startup Synchronization & Serials
- Workflow Status & Email Alerts
- System Architecture & Guidelines
- Docker Container Orchestration
- Web Entry & Mount Point
- Technical Implementation Plan: Design Department Confirmation & Dynamic Release Documents
- todo.md
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
8. `OrderDocumentsModal()` - 10 edges
9. `ErrorBoundary` - 9 edges
10. `Spec: Non-Standard Panel Drawings & Bill of Materials (BOM)` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Testing & Verification Strategy` --references--> `ExcelSheetViewer()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/ExcelSheetViewer.jsx
- `Success Criteria` --references--> `TechnicalDocsModal()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/TechnicalDocsModal.jsx
- `Success Criteria` --references--> `ExcelSheetViewer()`  [INFERRED]
  SPEC-non-standard-panel-docs.md → src/components/ExcelSheetViewer.jsx
- `Dashboard()` --calls--> `AllOrdersTableView()`  [EXTRACTED]
  src/App.jsx → src/components/AllOrdersTableView.jsx
- `Dashboard()` --calls--> `ErrorBoundary`  [EXTRACTED]
  src/App.jsx → src/components/ErrorBoundary.jsx

## Import Cycles
- None detected.

## Communities (21 total, 7 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.06
Nodes (30): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand (+22 more)

### Community 1 - "App.jsx"
Cohesion: 0.07
Nodes (48): lucide-react, react, react-router-dom, App(), Dashboard(), DocumentDirectory, LogsView, Masters (+40 more)

### Community 2 - "AllOrdersTableView.jsx"
Cohesion: 0.16
Nodes (23): AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS, formatFastDate(), formatFastDateTime(), getCellTooltip() (+15 more)

### Community 3 - "OrderCreationFlow.jsx"
Cohesion: 0.24
Nodes (10): AddPartMasterModal(), EditRefTagModal(), Modal(), getDefaultFormData(), getInitialFormData(), getTodayDateStr(), OrderCreationFlow(), PanelSizeSearchSelect() (+2 more)

### Community 4 - "Masters.jsx"
Cohesion: 0.17
Nodes (18): DOC_TYPE_THEMES, DocumentPreviewModal(), EXTENSION_TYPE_MAP, formatDMY(), formatSize(), getDocumentType(), ImageViewerPane(), UnsupportedFallbackPane() (+10 more)

### Community 5 - "index.js"
Cohesion: 0.06
Nodes (32): pool, allowedOrigins, app, BLOCKED_EXTENSIONS, DEFAULT_STEPS, defaultAllowedOrigins, deriveUnitStatus(), __dirname (+24 more)

### Community 6 - "ErrorBoundary"
Cohesion: 0.20
Nodes (5): ErrorBoundary, AggregateStats(), DaysChip(), OrderStats(), StatsRow()

### Community 7 - "server/package.json"
Cohesion: 0.06
Nodes (30): ref_assert, bcryptjs, cors, dotenv, express, multer, nodemailer, pg (+22 more)

### Community 9 - "OrderDocumentsModal.jsx"
Cohesion: 0.10
Nodes (23): ref_xlsx, 1. Document Separation & Storage Isolation, 2. Revision Calculation for Non-Standard Documents, 3. Role-Based Access Control (RBAC), Action Boundaries, Boundaries, Code Style & Implementation Standard, Commands (+15 more)

### Community 10 - "PlanningModule.jsx"
Cohesion: 0.29
Nodes (8): DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS, PlanningModule()

### Community 11 - "verify_codebase.js"
Cohesion: 0.06
Nodes (35): ref_babel_parser, ref_babel_traverse, ref_fs, jsonwebtoken, ref_module, ref_os, ref_path, ref_url (+27 more)

### Community 18 - "Technical Implementation Plan: Design Department Confirmation & Dynamic Release Documents"
Cohesion: 0.29
Nodes (6): Architectural Overview, Major Components & Dependencies, Phases & Build Order, Risks & Mitigation Strategies, Technical Implementation Plan: Design Department Confirmation & Dynamic Release Documents, Verification Checkpoints

### Community 21 - "Spec: Design Department Confirmation Gate & Dynamic Release Documents Status"
Cohesion: 0.12
Nodes (15): 10. Open Questions, 1. Objective, 2. Tech Stack, 3. Commands, 4. Project Structure & Affected Modules, 5.1 Database Schema (Additive & Non-Destructive), 5.2 Backend API & Workflow Logic, 5.3 Frontend UI/UX in `AllOrdersTableView.jsx` (+7 more)

### Community 22 - "Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents"
Cohesion: 0.50
Nodes (3): Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents, Core Intent, Metadata

## Knowledge Gaps
- **135 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+130 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 182 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `App.jsx` to `package.json`, `AllOrdersTableView.jsx`, `OrderCreationFlow.jsx`, `Masters.jsx`, `ErrorBoundary`, `OrderDocumentsModal.jsx`, `PlanningModule.jsx`?**
  _High betweenness centrality (0.238) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `App.jsx` to `package.json`, `AllOrdersTableView.jsx`, `OrderCreationFlow.jsx`, `Masters.jsx`, `OrderDocumentsModal.jsx`, `PlanningModule.jsx`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _135 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0625 - nodes in this community are weakly interconnected._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06621004566210045 - nodes in this community are weakly interconnected._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.055523085914669784 - nodes in this community are weakly interconnected._
- **Should `server/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05714285714285714 - nodes in this community are weakly interconnected._