# Graph Report - ERP  (2026-09-28)

## Corpus Check
- Large corpus: 137 files · ~2,265,519 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 259 nodes · 516 edges · 18 communities (15 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

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
1. `react` - 30 edges
2. `lucide-react` - 21 edges
3. `Dashboard()` - 21 edges
4. `AllOrdersTableView()` - 12 edges
5. `pool` - 10 edges
6. `OrderDocumentsModal()` - 10 edges
7. `OrderCreationFlow()` - 8 edges
8. `realignUnitSerials()` - 7 edges
9. `renderCellContent()` - 7 edges
10. `DocumentManager()` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Dashboard()` --calls--> `AllOrdersTableView()`  [EXTRACTED]
  src/App.jsx → src/components/AllOrdersTableView.jsx
- `Dashboard()` --calls--> `BoardView()`  [EXTRACTED]
  src/App.jsx → src/components/BoardView.jsx
- `Dashboard()` --calls--> `DeptWorklist()`  [EXTRACTED]
  src/App.jsx → src/components/DeptWorklist.jsx
- `Dashboard()` --calls--> `FlowView()`  [EXTRACTED]
  src/App.jsx → src/components/FlowView.jsx
- `Dashboard()` --calls--> `Masters()`  [EXTRACTED]
  src/App.jsx → src/components/Masters.jsx

## Import Cycles
- None detected.

## Communities (18 total, 3 thin omitted)

### Community 0 - "Frontend Packages & Tooling"
Cohesion: 0.07
Nodes (28): dependencies, lucide-react, react, react-dom, react-router-dom, @tanstack/react-query, xlsx, zustand (+20 more)

### Community 1 - "App Routing & Document Navigation"
Cohesion: 0.12
Nodes (23): react-dom, react-router-dom, App(), Dashboard(), ProtectedRoute(), DOC_TYPES, DocumentDirectory(), Header() (+15 more)

### Community 2 - "Master Orders Table View"
Cohesion: 0.16
Nodes (24): AllOrdersTableView(), BASE_COLUMNS, calculateUnitStatus(), DEFAULT_COL_WIDTHS, DEFAULT_COLUMN_KEYS, formatFastDate(), formatFastDateTime(), getCellTooltip() (+16 more)

### Community 3 - "Navigation & Modal Components"
Cohesion: 0.20
Nodes (12): lucide-react, react, AddPartMasterModal(), EditRefTagModal(), Modal(), getDefaultFormData(), getInitialFormData(), getTodayDateStr() (+4 more)

### Community 4 - "Masters & Spreadsheet Viewers"
Cohesion: 0.15
Nodes (17): ref_xlsx, BulkImportModal(), ExcelSheetViewer(), buildCondition(), DATAKEY_OPTIONS, describeCondition(), FIELD_TYPES, Masters() (+9 more)

### Community 5 - "Backend Core & Express API"
Cohesion: 0.10
Nodes (12): ref_path, ref_url, app, DEFAULT_STEPS, __dirname, __filename, formatOrderNumber(), generateOrderNumber() (+4 more)

### Community 6 - "Visual Boards & Document Flows"
Cohesion: 0.17
Nodes (15): BoardView(), StatusBadge(), DOC_TYPES, DocumentManager(), PO_AUTHORIZED_ROLES, FlowView(), StatusBadge(), StepModal() (+7 more)

### Community 7 - "Backend Security & Admin Scripts"
Cohesion: 0.12
Nodes (15): bcryptjs, cors, dotenv, express, multer, nodemailer, pg, pool (+7 more)

### Community 8 - "Database Connection & Migrations"
Cohesion: 0.20
Nodes (5): pool, extractYearFromOrder(), formatOrderNumber(), migrate(), migrateUnitSerials()

### Community 9 - "Server Runtime Dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcryptjs, cors, dotenv, express, jsonwebtoken, multer, nodemailer (+2 more)

### Community 10 - "Production Planning Module"
Cohesion: 0.29
Nodes (8): DEFAULT_COLUMNS, formatFastDateTime(), getDocUrl(), isDateTimeType(), isDateType(), MONTH_NAMES, PAGE_SIZE_OPTIONS, PlanningModule()

### Community 11 - "Integration & PO Testing Suite"
Cohesion: 0.25
Nodes (8): ref_fs, jsonwebtoken, adminToken, assert(), designToken, pool, runTestSuite(), salesToken

### Community 12 - "Startup Synchronization & Serials"
Cohesion: 0.43
Nodes (6): initDB(), updateOrderQCStatusFromSteps(), formatOrderNumber(), parseOrderCounter(), realignUnitSerials(), runDeploymentMigrations()

### Community 13 - "Department Worklist Queue"
Cohesion: 0.38
Nodes (6): DEPT_COLORS, DeptWorklist(), PRIORITY_CONFIG, STEP_STATUS_CONFIG, StepPill(), UnitRow()

### Community 14 - "Workflow Status & Email Alerts"
Cohesion: 0.50
Nodes (4): deriveUnitStatus(), seedSayaUser(), sendDepartmentHandoverEmail(), syncLineItemStatusFromUnits()

## Knowledge Gaps
- **77 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+72 more)
  These have ≤1 connection - possible missing edges. (Counts symbols only; 95 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Navigation & Modal Components` to `Frontend Packages & Tooling`, `App Routing & Document Navigation`, `Master Orders Table View`, `Masters & Spreadsheet Viewers`, `Visual Boards & Document Flows`, `Production Planning Module`, `Department Worklist Queue`?**
  _High betweenness centrality (0.283) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `Navigation & Modal Components` to `Frontend Packages & Tooling`, `App Routing & Document Navigation`, `Master Orders Table View`, `Masters & Spreadsheet Viewers`, `Visual Boards & Document Flows`, `Production Planning Module`, `Department Worklist Queue`?**
  _High betweenness centrality (0.136) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Server Runtime Dependencies` to `Backend Security & Admin Scripts`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Packages & Tooling` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._
- **Should `App Routing & Document Navigation` be split into smaller, more focused modules?**
  _Cohesion score 0.11954022988505747 - nodes in this community are weakly interconnected._
- **Should `Backend Core & Express API` be split into smaller, more focused modules?**
  _Cohesion score 0.10476190476190476 - nodes in this community are weakly interconnected._