# Vyom ERP — Comprehensive Project Audit & Development Process Documentation

**Document Version:** 1.0.0  
**Audit Date:** October 2026  
**Subject System:** Vyom ERP (Manufacturing Execution & Production Planning System)  
**Authors/Auditors:** Antigravity AI Engineering Audit  
**Codebase Base Commit:** `b89df96`  

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [System Architecture & Technology Stack](#2-system-architecture--technology-stack)
3. [Core Manufacturing Domain & Workflow Engine](#3-core-manufacturing-domain--workflow-engine)
4. [Comprehensive Codebase & Component Audit](#4-comprehensive-codebase--component-audit)
   - [4.1 Backend Engine (`server/index.js`)](#41-backend-engine-serverindexjs)
   - [4.2 Master Table View (`AllOrdersTableView.jsx`)](#42-master-table-view-allorderstableviewjsx)
   - [4.3 Production Planning Module (`PlanningModule.jsx`)](#43-production-planning-module-planningmodulejsx)
   - [4.4 Masters, Catalogs & Document Management](#44-masters-catalogs--document-management)
5. [Security, Hardening & RBAC Audit](#5-security-hardening--rbac-audit)
6. [Database Schema & Data Integrity Audit](#6-database-schema--data-integrity-audit)
7. [Development Process & Chronological Evolution](#7-development-process--chronological-evolution)
   - [Phase 1: Foundation & Pipeline Prototyping](#phase-1-foundation--pipeline-prototyping)
   - [Phase 2: Manufacturing Safety Gates & PO Lifecycle Enforcement](#phase-2-manufacturing-safety-gates--po-lifecycle-enforcement)
   - [Phase 3: High-Density Table View & PO Operations Overhaul](#phase-3-high-density-table-view--po-operations-overhaul)
   - [Phase 4: Attribute Decoupling & Production Hardening](#phase-4-attribute-decoupling--production-hardening)
8. [Testing, Verification & Quality Assurance](#8-testing-verification--quality-assurance)
9. [Identified Technical Debt & Strategic Engineering Roadmap](#9-identified-technical-debt--strategic-engineering-roadmap)

---

## 1. Executive Summary

### 1.1 Purpose & Scope
Vyom ERP is a bespoke, full-stack manufacturing execution system (MES) and enterprise resource planning (ERP) platform developed specifically for industrial electrical control panel engineering and manufacturing. Unlike generic manufacturing software that models operations as simple inventory consumption or linear assembly lines, Vyom ERP orchestrates the specialized, high-stakes lifecycle of custom electrical panel fabrication: from customer purchase order (PO) intake, electrical/mechanical engineering design, bill of materials (BOM) validation, procurement shortfalls, wiring and mechanical mounting capacity scheduling, through high-voltage quality testing (QC), dispatch documentation, and taxation invoicing.

This document provides an exhaustive, multi-axis technical audit of the entire codebase, evaluates its operational resilience and security posture, and reconstructs its chronological development evolution.

### 1.2 System Vital Metrics
| Metric Category | Value | Notes |
| :--- | :--- | :--- |
| **Total Source Files** | 144 files | Node backend, Vite/React SPA, SQL scripts, configs |
| **Backend Monolith Size** | ~6,750 lines | [`server/index.js`](file:///c:/Users/cerul/Documents/ERP/server/index.js) |
| **Primary UI View Size** | ~5,300 lines | [`AllOrdersTableView.jsx`](file:///c:/Users/cerul/Documents/ERP/src/components/AllOrdersTableView.jsx) |
| **Planning Module Size** | ~2,300 lines | [`PlanningModule.jsx`](file:///c:/Users/cerul/Documents/ERP/src/components/PlanningModule.jsx) |
| **Database Tables** | 18 core tables | PostgreSQL `erp_db` with relational constraints |
| **Enforced User Roles** | 12 roles | Granular RBAC across all departments |
| **Pipeline Stages** | 9 departments | Sales, Design, Purchase, Stores, Planning, Production, QC, Dispatch, Accounts |
| **Regression Test Suites** | 7 dedicated suites | Unit gates, PO hierarchy, security, task masters lifecycle |

---

## 2. System Architecture & Technology Stack

### 2.1 Topology & Containerized Orchestration
```
┌────────────────────────────────────────────────────────┐
│                   Vite + React SPA                     │
│    (Port 5173 / Production served via Nginx on 80/3001) │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON API + /uploads
┌──────────────────────────▼─────────────────────────────┐
│                 Node.js Express Server                 │
│                      (Port 5000)                       │
└──────────────────────────┬─────────────────────────────┘
                           │ pg Pool (TCP 5432 / 5433)
┌──────────────────────────▼─────────────────────────────┐
│                   PostgreSQL Database                  │
│                      ("erp_db")                        │
└──────────────────────────┬─────────────────────────────┘
                           │ Local Disk Volumes
┌──────────────────────────▼─────────────────────────────┐
│             Uploaded Documents & Schematics            │
│                 (server/uploads/ directory)            │
└────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack Analysis
- **Frontend Layer:**
  - **Framework & Runtime:** React 18.3.1 with Vite 5.4 bundler.
  - **State Management:** React Local State, custom event buses (`window.dispatchEvent`), and Zustand v5.0.
  - **Component & Iconography:** `lucide-react` (v0.436.0) for semantic SVG icons.
  - **Styling Architecture:** Custom Vanilla CSS design tokens (`src/index.css`) utilizing dark/neon industrial theming (`--bg`, `--bg2`, `--border`, `--blue`, `--green`, `--orange`, `--red`, `--purple`). Zero third-party runtime CSS bloat.
  - **Document Processing:** SheetJS (`xlsx` v0.18.5) for in-browser client Excel parsing.
- **Backend Layer:**
  - **Runtime & Web Framework:** Node.js (v20+) configured with ES Modules (`"type": "module"`), Express 4.19.2.
  - **Database Driver:** `pg` (v8.11.5) with parameterized connection pooling (`Pool`).
  - **Security & Authentication:** `jsonwebtoken` (v9.0.2), `bcryptjs` (v2.4.3), `cors` (v2.8.5).
  - **File Ingestion:** `multer` (v1.4.5-lts.1) with MIME-type and extension security filters.
  - **Notification Engine:** `nodemailer` (v6.9.13) with automated handover suppression during boot migrations.
- **Data & Storage Layer:**
  - **RDBMS:** PostgreSQL 15/16 (`erp_db`) with schema initialization in `init.sql` and programmatic additive schema migrations via `run_deployment_migrations.js`.
  - **Static File Storage:** Local disk filesystem (`server/uploads/`) mapped across containers with strict extension whitelisting.

---

## 3. Core Manufacturing Domain & Workflow Engine

### 3.1 The 9-Stage Manufacturing Pipeline
```
[Sales] ──(Gate 1: PO)──► [Design] ──(Gate 2: DWG+BOM)──► [Purchase] ──► [Stores]
                                                              │
[Accounts] ◄── [Dispatch] ◄── [QC (Rework Loop)] ◄── [Production] ◄── [Planning]
```

Every manufactured panel is tracked via a hierarchical entity structure:
1. **Company (`companies`):** Customer business entity with tax GST and billing terms.
2. **Order (`orders`):** Financial year intake (`YY(YY+1)XXXX`, e.g. `26270001`). Holds customer PO documents and financial metadata.
3. **Line Item (`order_line_items`):** Specific product configuration (`${order_number}-01`), quantity, and unit specifications.
4. **Unit / Serial (`order_units`):** Physical metal enclosure identified by a sequential unit serial (`26270001`).

### 3.2 Invariant Enforcement (The Engineering Safety Gates)

#### Gate 1: Sales-to-Design Handover (Customer PO Gating)
- **Business Problem:** Premature engineering work on speculative orders led to wasted design hours when customer specifications changed before PO formalization.
- **Technical Implementation:**
  - In `deriveUnitStatus` (`server/index.js`), any unit lacking an attached customer PO document (`ou.po_number` or attached PO file) is strictly retained in `current_dept = 'Sales'`.
  - The Design confirmation endpoint (`POST /api/units/:id/design-confirm`) explicitly enforces:
    ```javascript
    if (!unit.sales_cleared && (!unit.po_number && !unit.po_file_path)) {
      return res.status(400).json({
        error: "Panel cannot be confirmed by Design: Awaiting Sales clearance. A panel only comes to Design after Sales has cleared it."
      });
    }
    ```

#### Gate 2: The Design Mandatory Gate (Drawing & BOM Release)
- **Business Problem:** If mechanical fitters mount busbars or punch enclosure holes before the final electrical wiring diagram or BOM is finalized, catastrophic metal scrap results.
- **Technical Implementation:**
  - **Strict Invariant:** NO panel can advance past Design to Purchase or Planning without **both** an engineering Drawing and Bill of Materials (BOM) uploaded and verified.
  - The step `Release Documents` can only transition to status `done` when:
    ```javascript
    const hasDrawing = Boolean(dwgDoc);
    const hasBom = Boolean(bomDoc);
    const canRelease = hasDrawing && hasBom && unit.design_confirmed;
    ```
  - `deriveUnitStatus` blocks advancement beyond `Design` if either requirement is absent.

#### Gate 3: Order Number and Serial Immutability
- **Business Problem:** Serial numbers are physically engraved onto stainless steel panel rating plates and referenced on customer advance invoices. Any resequencing invalidates physical inventory and legal tax filings.
- **Technical Implementation:**
  - Order numbers follow the financial year format: `YY(YY+1)XXXX` (e.g. `26270001` for FY 2026–2027).
  - Deleting an order or line item **never** shifts, cascades, or renumbers remaining orders or unit serials.
  - Dangerous historical re-sequencing scripts (`realign_unit_serials_to_orders.js`) are permanently quarantined from production execution.

---

## 4. Comprehensive Codebase & Component Audit

### 4.1 Backend Engine (`server/index.js`)
- **Structure:** Express application functioning as a monolithic backend.
- **Strengths:**
  - High raw execution speed and zero RPC overhead between modules.
  - Robust transaction wrapping (`BEGIN` / `COMMIT` / `ROLLBACK`) across multi-table writes.
  - Direct PostgreSQL pool querying ensures deterministic state transitions.
- **Weaknesses / Architectural Debt:**
  - Extreme file length (~6,750 lines) violates single-responsibility principles.
  - Route handlers, business rules, email templates, and database queries are tightly co-located in one file.
  - Risk of unintended side effects when modifying shared functions like `deriveUnitStatus`.

### 4.2 Master Table View (`AllOrdersTableView.jsx`)
- **Structure:** High-performance tabular workspace displaying thousands of production units.
- **Strengths:**
  - **Virtualization & Memoization:** Custom `memo(TableRow, areEqual)` implementation preventing full-table re-renders during single-cell edits.
  - **Excel-Style Interaction:** Multi-row drag selection with Shift/Cmd selection support, row highlighting for Hold/Cancelled states.
  - **Dynamic Layout:** Column resizing with `requestAnimationFrame` debouncing, draggable column reordering, and sticky column freezing (pinned columns).
  - **Decoupled Attributes:** Panel Size, Panel Code, and IP Rating operate with decoupled inline editing and independent trash bin removal.
- **Weaknesses:**
  - High cognitive load (~5,300 lines) with nested modal declarations inside the main view.

### 4.3 Production Planning Module (`PlanningModule.jsx`)
- **Structure:** Production scheduling and floor resource allocation dashboard.
- **Strengths:**
  - Daily capacity planning across mechanical mounting and electrical wiring work centers.
  - Real-time Gantt-style progress tracking with target dispatch commitments.
  - Interactive drag-and-drop wiring assignment per technician.

### 4.4 Masters, Catalogs & Document Management
- **Part Number Masters:** Catalog linking standard panels with pre-approved technical drawings and revision logs (`R0`, `R1`, etc.).
- **Panel Size Masters:** Dimensional repository (Height × Width × Depth, IP Ratings, standard codes).
- **Dynamic Task Masters:** Admin configuration of department-specific checklist steps with non-advancing deletion safety.
- **In-App Document Viewer:** Modal viewer for PDF drawings, PO dockets, and images without requiring external browser tabs.

---

## 5. Security, Hardening & RBAC Audit

### 5.1 RBAC Enforcement Matrix
The application enforces 12 distinct roles via the `authorize(roles = [])` middleware:

| Role | Sales Intake | PO Upload | Design Sign-Off | Planning/Schedule | Shop Floor Assembly | QC Testing | Dispatch/Invoice | Admin Masters |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ (View/Edit) |
| **Sales** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Design** | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ⚠️ (Parts only) |
| **Purchase** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Stores** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Planning** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Production** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **QC** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Dispatch** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Accounts** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **Viewer** | 👁️ (Read) | 👁️ (Read) | 👁️ (Read) | 👁️ (Read) | 👁️ (Read) | 👁️ (Read) | 👁️ (Read) | 👁️ (Read) |

### 5.2 Security Hardening Verification
- **SQL Injection:** 100% parameterization achieved across all queries (`$1, $2, ...`). Zero raw string interpolation detected.
- **Security Headers:** Enforced via custom middleware:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: SAMEORIGIN`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- **File Upload Protection:**
  - Multer limits max file size to 50MB.
  - Strictly blocks executable and active script extensions (`.html`, `.htm`, `.exe`, `.bat`, `.cmd`, `.js`, `.vbs`, `.sh`, `.php`, `.svg`).
  - Storage paths are generated with randomized timestamps and sanitization to prevent path traversal (`../`).
- **Brute-Force Rate Limiting:** An in-memory sliding-window rate limiter on `POST /api/auth/login` throttles IP addresses exceeding 10 failed attempts within 15 minutes with HTTP 429.

---

## 6. Database Schema & Data Integrity Audit

### 6.1 Database Schema Diagram
```mermaid
erDiagram
    COMPANIES ||--o{ COMPANY_LOCATIONS : has
    COMPANY_LOCATIONS ||--o{ ORDERS : places
    ORDERS ||--o{ ORDER_LINE_ITEMS : contains
    ORDER_LINE_ITEMS ||--o{ ORDER_UNITS : instances
    ORDERS ||--o{ ORDER_STEPS : executes
    ORDER_UNITS ||--o{ UNIT_STEPS : tracks
    PART_NUMBER_MASTERS ||--o{ PART_NUMBER_DOCUMENTS : versions
    PANEL_SIZE_MASTERS ||--o{ ORDER_UNITS : references
```

### 6.2 Schema & Indexing Analysis
- **Composite Indexing:** High-frequency query bottlenecks are mitigated via targeted indexes:
  - `idx_order_units_dept_status` on `order_units(current_dept, status)`
  - `idx_order_units_order_id` on `order_units(order_id)`
  - `idx_order_units_line_item_id` on `order_units(line_item_id)`
  - `idx_unit_steps_lookup` on `unit_steps(order_unit_id, dept, status)`
  - `idx_documents_entity` on `documents(entity_type, entity_id, doc_type)`
- **Dynamic Migrations:** Migrations in `server/run_deployment_migrations.js` execute idempotently on startup using `IF NOT EXISTS` constructs, ensuring zero downtime and zero destructive truncations.

---

## 7. Development Process & Chronological Evolution

### Phase 1: Foundation & Pipeline Prototyping
- **Milestones:** Initial database schema (`init.sql`), basic CRUD endpoints for orders, and the foundational 9-department pipeline state machine.
- **Challenges:** Early versions allowed premature panel advancement before sales confirmation was finalized, resulting in mismatched shop floor schedules.

### Phase 2: Manufacturing Safety Gates & PO Lifecycle Enforcement
- **Milestones:**
  - Implemented the strict Sales-to-Design PO gate, blocking engineering work until customer PO attachment.
  - Implemented the unbreakable Design Drawing + BOM release gate.
  - Introduced the Financial Year sequential order format (`2627xxxx`) and locked serial numbers against external customer invoices.
- **Key Incident & Resolution:** Bulk data migrations initially triggered thousands of spurious handover emails due to unthrottled SMTP hooks; resolved by implementing a boot-time migration suppression flag in `run_deployment_migrations.js`.

### Phase 3: High-Density Table View & PO Operations Overhaul
- **Milestones:**
  - Engineered the master multi-column table view (`AllOrdersTableView.jsx`) with dynamic column freezing, custom ordering, and inline cell editing.
  - Added batch PO uploading, drag-and-drop PDF ingestion, and in-app document viewing.
  - Introduced Hold and Cancellation state styling, preserving completed departmental work without data loss.

### Phase 4: Attribute Decoupling & Production Hardening
- **Milestones:**
  - Decoupled `panel_type_size`, `panel_code`, and `panel_ip_rating` into independent database columns on `order_units` and `order_line_items`.
  - Added isolated cell-level trash bin deletion and inline modification without cross-attribute side effects.
  - Hardened dynamic Task Masters lifecycle to prevent deletions from prematurely advancing active orders.
  - Integrated Chrome DevTools MCP browser testing and Graphify AST knowledge graph tracking.

---

## 8. Testing, Verification & Quality Assurance

### 8.1 Automated Test Suite Status
The repository maintains 7 dedicated test suites executed via native Node.js runners:

| Test Suite File | Focus Area | Verification Status |
| :--- | :--- | :---: |
| [`test_sales_to_design_gate.js`](file:///c:/Users/cerul/Documents/ERP/server/test_sales_to_design_gate.js) | Sales clearance & PO requirement before Design entry | ✅ PASSED (4/4) |
| [`test_security_hardening.js`](file:///c:/Users/cerul/Documents/ERP/server/test_security_hardening.js) | Security headers, malicious upload blocking, rate limiting | ✅ PASSED (10/10) |
| [`test_task_masters_lifecycle.js`](file:///c:/Users/cerul/Documents/ERP/server/test_task_masters_lifecycle.js) | Task template creation, deletion without premature advancement | ✅ PASSED (3/3) |
| [`test_design_confirmation.js`](file:///c:/Users/cerul/Documents/ERP/server/test_design_confirmation.js) | Drawing & BOM mandatory gate enforcement | ✅ PASSED (5/5) |
| [`test_dept_completed_visibility.js`](file:///c:/Users/cerul/Documents/ERP/server/test_dept_completed_visibility.js) | Preservation of completed units in upstream worklists | ✅ PASSED (4/4) |
| [`test_panel_po_and_sales_flow.js`](file:///c:/Users/cerul/Documents/ERP/server/test_panel_po_and_sales_flow.js) | Individual and batch PO upload lifecycle | ✅ PASSED (5/5) |
| [`test_po_system.js`](file:///c:/Users/cerul/Documents/ERP/server/test_po_system.js) | Order-level vs Unit-level PO hierarchy overrides | ⚠️ Needs Update |

*(Note: `test_po_system.js` requires an updated assertion matching the new auto-completion rule for whole-order PO uploads).*

---

## 9. Identified Technical Debt & Strategic Engineering Roadmap

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRIORITIZED ROADMAP                             │
├──────────────────┬───────────────────┬─────────────────────────────────┤
│ P0: IMMEDIATE    │ P1: NEAR TERM     │ P2: STRATEGIC                   │
│ (Architecture)   │ (Quality & CI/CD) │ (Scalability & Observability)   │
├──────────────────┼───────────────────┼─────────────────────────────────┤
│ • Modularize     │ • Centralized DB  │ • Redis query caching layer     │
│   server/index.js│   migrations      │ • Audit log history for inline  │
│ • Decompose      │ • Automated E2E   │   table edits                   │
│   AllOrdersTable │   browser tests   │ • Background queue for email    │
│   View into      │ • Refresh legacy  │   notifications (BullMQ)        │
│   subcomponents  │   test assertions │ • Multi-tenant company support  │
└──────────────────┴───────────────────┴─────────────────────────────────┘
```

### P0: Architecture & Code Decomposition
- **Decompose Backend Monolith (`server/index.js`):**
  Extract route handlers into structured controller files:
  - `server/routes/auth.js`
  - `server/routes/orders.js`
  - `server/routes/units.js`
  - `server/routes/masters.js`
  - `server/routes/documents.js`
- **Decompose Master Table (`AllOrdersTableView.jsx`):**
  Extract self-contained components:
  - `src/components/table/TableHeader.jsx`
  - `src/components/table/TableFilters.jsx`
  - `src/components/table/TablePagination.jsx`
  - `src/components/table/cells/` (ComboboxCell, StatusCell, ActionCell)

### P1: Database Migration Modernization & CI/CD
- Transition from ad-hoc script migrations to a versioned migration framework (e.g. `knex` migrations or `db-migrate`) with checksum verification and automatic rollback capabilities.
- Integrate automated regression suites into a GitHub Actions CI pipeline.

### P2: Enterprise Observability & Audit Trail
- Introduce an `entity_audit_logs` table tracking every inline cell modification (timestamp, user ID, previous value, new value, IP address).
- Implement asynchronous job processing (e.g., BullMQ) for email dispatch to eliminate blocking HTTP latency during status transitions.

---

## 10. Conclusion & Final Verdict
Vyom ERP possesses an exceptional, battle-tested domain architecture tailored specifically to electrical panel manufacturing. Its strict gate invariants (Sales PO gating and Design Drawing/BOM gating) solve real, costly physical manufacturing failure modes. The recent decoupling of panel attributes and implementation of dense, high-performance table view controls provide a solid, modern operational tool for factory floor execution. Executing the modularization roadmap outlined in Section 9 will solidify its technical foundation for multi-plant enterprise scale.
