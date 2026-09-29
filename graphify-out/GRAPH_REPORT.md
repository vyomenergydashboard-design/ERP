# Graph Report - ERP  (2026-09-29)

## Corpus Check
- 63 files · ~2,266,311 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: .pptx 5, (none) 4, .example 1)

## Summary
- 302 nodes · 567 edges · 18 communities (11 shown, 7 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1d907e34`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Frontend Packages & Tooling
- App Routing & Document Navigation
- Master Orders Table View
- Navigation & Modal Components
- Masters & Spreadsheet Viewers
- Backend Core & Express API
- Visual Boards & Document Flows
- Backend Security & Admin Scripts
- Database Connection & Migrations
- Server Runtime Dependencies
- Production Planning Module
- Integration & PO Testing Suite
- Startup Synchronization & Serials
- Department Worklist Queue
- Workflow Status & Email Alerts
- System Architecture & Guidelines
- Docker Container Orchestration
- Web Entry & Mount Point

## God Nodes (most connected - your core abstractions)
1. `react` - 31 edges
2. `lucide-react` - 22 edges
3. `Dashboard()` - 22 edges
4. `AllOrdersTableView()` - 12 edges
5. `pool` - 11 edges
6. `OrderDocumentsModal()` - 10 edges
7. `ErrorBoundary` - 9 edges
8. `OrderCreationFlow()` - 8 edges
9. `realignUnitSerials()` - 7 edges
10. `renderCellContent()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --calls--> `AllOrdersTableView()`  [EXTRACTED]
  src/App.jsx → src/components/AllOrdersTableView.jsx
- `Dashboard()` --calls--> `DeptWorklist()`  [EXTRACTED]
  src/App.jsx → src/components/DeptWorklist.jsx
- `Dashboard()` --calls--> `ErrorBoundary`  [EXTRACTED]
  src/App.jsx → src/components/ErrorBoundary.jsx
- `Dashboard()` --calls--> `Masters()`  [EXTRACTED]
  src/App.jsx → src/components/Masters.jsx
- `Dashboard()` --calls--> `OrderCreationFlow()`  [EXTRACTED]
  src/App.jsx → src/components/OrderCreationFlow.jsx

## Import Cycles
- None detected.

## Communities (18 total, 7 thin omitted)

### Community 0 - "Frontend Packages & Tooling"
Cohesion: 0.07
Nodes (29): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand (+21 more)

### Community 1 - "App Routing & Document Navigation"
Cohesion: 0.08
Nodes (39): react-router-dom, App(), Dashboard(), ProtectedRoute(), BoardView(), StatusBadge(), BulkImportModal(), DOC_TYPES (+31 more)

### Community 2 - "Master Orders Table View"
Cohesion: 0.12
Nodes (31): ref_xlsx, AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS, formatFastDate(), formatFastDateTime() (+23 more)

### Community 3 - "Navigation & Modal Components"
Cohesion: 0.21
Nodes (14): lucide-react, react, react-dom, AddPartMasterModal(), EditRefTagModal(), Modal(), getDefaultFormData(), getInitialFormData() (+6 more)

### Community 4 - "Masters & Spreadsheet Viewers"
Cohesion: 0.32
Nodes (7): buildCondition(), DATAKEY_OPTIONS, describeCondition(), FIELD_TYPES, Masters(), OPERATORS, ORDER_FIELDS

### Community 5 - "Backend Core & Express API"
Cohesion: 0.07
Nodes (25): pool, app, DEFAULT_STEPS, deriveUnitStatus(), __dirname, __filename, formatOrderNumber(), generateOrderNumber() (+17 more)

### Community 7 - "Backend Security & Admin Scripts"
Cohesion: 0.08
Nodes (23): bcryptjs, cors, dotenv, express, jsonwebtoken, multer, nodemailer, pg (+15 more)

### Community 9 - "Server Runtime Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, multer, nodemailer (+2 more)

### Community 10 - "Production Planning Module"
Cohesion: 0.29
Nodes (8): DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS, PlanningModule()

### Community 11 - "Integration & PO Testing Suite"
Cohesion: 0.09
Nodes (21): ref_babel_parser, ref_babel_traverse, ref_fs, ref_module, ref_path, ref_url, content, filePath (+13 more)

### Community 13 - "Department Worklist Queue"
Cohesion: 0.38
Nodes (6): DEPT_COLORS, DeptWorklist(), PRIORITY_CONFIG, STEP_STATUS_CONFIG, StepPill(), UnitRow()

## Knowledge Gaps
- **94 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+89 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 126 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Navigation & Modal Components` to `Frontend Packages & Tooling`, `App Routing & Document Navigation`, `Master Orders Table View`, `Masters & Spreadsheet Viewers`, `Visual Boards & Document Flows`, `Production Planning Module`, `Department Worklist Queue`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Navigation & Modal Components` to `Frontend Packages & Tooling`, `App Routing & Document Navigation`, `Master Orders Table View`, `Visual Boards & Document Flows`, `Production Planning Module`, `Department Worklist Queue`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Server Runtime Dependencies` to `Backend Security & Admin Scripts`?**
  _High betweenness centrality (0.057) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _94 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Packages & Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Should `App Routing & Document Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.07743496672716274 - nodes in this community are weakly interconnected._
- **Should `Master Orders Table View` be split into smaller, more focused modules?**
  _Cohesion score 0.12299465240641712 - nodes in this community are weakly interconnected._