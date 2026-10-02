# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are manufacturing and operational teams managing custom industrial electrical control panel fabrication across 12 distinct roles:
- **Sales:** Ingests customer purchase orders (PO), customer specifications, delivery targets, and initiates orders.
- **Design:** Reviews panel classifications (Standard vs. Non-Standard), checks/uploads layout drawings and Bill of Materials (BOM), and provides formal engineering sign-off.
- **Purchase & Stores:** Tracks BOM shortfall, issues supplier purchase orders, and confirms raw material receipt.
- **Planning:** Allocates plant floor capacity, schedules mechanical mounting and electrical wiring, and commits dispatch timelines.
- **Production:** Mechanical fitters and electrical wiremen executing physical panel assembly and wiring.
- **QC (Quality Control):** Conducts high-voltage testing, functional inspections, logs defect checklists, and manages pass/fail/rework loops.
- **Dispatch & Accounts:** Verifies dispatch documentation, shipping dockets, tax invoicing, and clears panels for customer delivery.
- **Managers & Admins:** Oversee end-to-end plant throughput, bottlenecks, order priorities, user RBAC, and master data configurations.

## Product Purpose

Vyom ERP orchestrates the complete lifecycle of custom electrical control panels from order intake to customer delivery. It replaces fragmented spreadsheets and ad-hoc communication with a single source of manufacturing truth, eliminating premature fabrication, costly shop-floor rework, and missed customer dispatch commitments.

## Positioning

Unlike generic manufacturing ERPs that treat production as linear inventory batches, Vyom ERP is purpose-built for electrical panel fabrication with unbreakable engineering gates. Panels cannot progress to procurement or shop-floor assembly without both verified drawings and BOMs accompanied by formal Design confirmation, completely preventing premature assembly of unverified panel designs.

## Operating Context

- **Environment:** High-paced industrial manufacturing shop floor, engineering design offices, and procurement desks. Fast desktop scanning and dense data visibility are critical.
- **Rituals & Workflows:**
  - Daily production and wiring scheduling via Gantt-style planning grids ([PlanningModule.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/PlanningModule.jsx)).
  - Multi-level table inspection ([AllOrdersTableView.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/AllOrdersTableView.jsx)) filtering across orders, line items, and unit serials.
  - Department worklists ([DeptWorklist.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/DeptWorklist.jsx)) displaying actionable unit queues.
  - Technical document inspection ([TechnicalDocsModal.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/TechnicalDocsModal.jsx), [OrderDocumentsModal.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/OrderDocumentsModal.jsx)) comparing PDF engineering schematics and Excel BOM revisions.
  - Department task execution modals ([StepModal.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/StepModal.jsx)) and quick-action classification/confirmation bars.

## Capabilities and Constraints

- **9-Stage Production Pipeline:** `Sales` → `Design` → `Purchase` → `Stores` → `Planning` → `Production` → `QC` → `Dispatch` → `Accounts`.
- **Sales Retention Gate:** Panels remain in `Sales` until customer PO documents are uploaded and mandatory Sales clearance tasks are marked complete. Design confirmation is strictly blocked if Sales steps are pending.
- **Design Document Mandatory Gate:** Advancement past Design to Purchase/Stores/Planning is strictly blocked unless **both** Technical Drawing and BOM are attached and Design sign-off is confirmed.
- **Two Panel Classifications:**
  - *Standard:* Backed by pre-configured master catalog part numbers with versioned drawings and BOMs.
  - *Non-Standard:* Custom one-off engineered panels requiring unit-specific document uploads.
- **QC Rework Loop:** Blocked or failed QC inspections automatically route units back to `Production` in `Rework` status.
- **Immutability of Identifiers:** Order numbers (`YY(YY+1)XXXX`) and continuous unit serials are shared externally (customer invoices, vendor POs, physical metal nameplates) and must never be resequenced or altered upon order edits or deletions.
- **Role-Based Access Control:** Strict role segregation enforced on every API route and UI view action.

## Brand Commitments

- **Name:** Vyom ERP (Vyom Energy).
- **Aesthetic Direction:** Professional industrial software aesthetic; high-contrast dark theme (`#0b0f19` background) with semantic neon accent tokens (blue, emerald green, amber, crimson) for instantaneous status recognition in high-ambient-light industrial environments.

## Evidence on Hand

- Core database schema and seed data in [server/init.sql](file:///c:/Users/cerul/Documents/ERP/server/init.sql).
- Active pipeline state engine in [server/index.js](file:///c:/Users/cerul/Documents/ERP/server/index.js#L320).
- Confirmed design confirmation statement of intent in [docs/intent/design-confirmation.md](file:///c:/Users/cerul/Documents/ERP/docs/intent/design-confirmation.md).
- Architectural guardrails and operational specifications in [AGENTS.md](file:///c:/Users/cerul/Documents/ERP/AGENTS.md).
- Regression test suites in [server/test_design_confirmation.js](file:///c:/Users/cerul/Documents/ERP/server/test_design_confirmation.js), [server/test_sales_to_design_gate.js](file:///c:/Users/cerul/Documents/ERP/server/test_sales_to_design_gate.js), and [server/test_po_system.js](file:///c:/Users/cerul/Documents/ERP/server/test_po_system.js).

## Product Principles

1. **Safety Gates Are Unbreakable:** No UI shortcut or manual override may bypass upstream gates (PO intake, Drawing & BOM presence, Design confirmation). Data integrity protects physical manufacturing.
2. **Dense, Scannable Operational Clarity:** Shop floor managers and engineers need immediate status comprehension across hundreds of panels without nested click-hunting.
3. **Auditability and Traceability:** Every document upload, revision, hold, cancellation, and department handover must be attributed, time-stamped, and permanently auditable.
4. **Resilient Production Cadence:** The software must never halt production due to transient client failures; fast offline-tolerant local operations with server validation ensure continuous floor progress.

## Accessibility & Inclusion

- Keyboard navigability across dense tabular rows and modals via `Escape` key listeners ([useGlobalModalEscape.js](file:///c:/Users/cerul/Documents/ERP/src/hooks/useGlobalModalEscape.js)).
- High-contrast visual cues (distinct color + iconography + text labels) for color-blind friendly status differentiation on the shop floor.
