# Implementation Plan: Non-Standard Panel Drawings & BOM Support

## Overview
Implement dedicated, dual-card management for **Technical Drawings** and **Bill of Materials (BOM)** for Non-Standard panel units inside [TechnicalDocsModal](file:///c:/Users/cerul/Documents/ERP/src/components/AllOrdersTableView.jsx#L629), featuring chronological revision history (R0, R1...), strict RBAC (only `Design` and `Admin` may upload/delete), spreadsheet previews via [ExcelSheetViewer](file:///c:/Users/cerul/Documents/ERP/src/components/ExcelSheetViewer.jsx), and architectural isolation from `part_number_masters`.

## Architecture Decisions
- **Unit Document Isolation:** Non-standard panel uploads attach to the `documents` table (`entity_type: 'Unit'`). Zero records will ever be created or modified in `part_number_masters` or `part_number_documents`.
- **Chronological Revision Calculation:** For a given unit and `doc_type` (`Drawing` or `BOM`), documents sorted by `uploaded_at` ascending are assigned `R0`, `R1`, `R2`, ... with the latest displayed as the active document.
- **Strict Role-Based Permissions:** Management actions (`Upload New Revision`, `Delete Revision`) are guarded by `['ADMIN', 'DESIGN'].includes(userRole.toUpperCase())`. All other roles (`Stores`, `Purchase`, `Production`, `QC`, `Viewer`) are read-only (preview & download).
- **Separation of Deletion Handlers:** Non-standard deletions hit `/api/documents/:id` via `handleDeleteOrderDoc`, fixing the latent bug where `handleDeleteMasterDoc` was erroneously invoked.

## Task List

### Phase 1: Core Logic & Card Bindings
- [ ] **Task 1:** Fix card state bindings and chronological revision calculation for Non-Standard panels in [AllOrdersTableView.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/AllOrdersTableView.jsx).
  - Bind Card 1 to `latestCustomDrawing` and Card 2 to `latestCustomBom`.
  - Calculate `customDrawingHistory` and `customBomHistory` with chronological `R0`, `R1`, ... revision tags.

### Phase 2: Actions, Previews & RBAC
- [ ] **Task 2:** Enforce RBAC and wire up deletion & preview actions in [AllOrdersTableView.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/AllOrdersTableView.jsx).
  - Restrict `canManageDocs` for non-standard panels strictly to `Admin` and `Design`.
  - Wire up `handleDeleteOrderDoc` on non-standard revision cards and history items.
  - Connect Excel spreadsheet preview for custom BOM files.

### Phase 3: Verification & Subagent Audit
- [ ] **Task 3:** Automated verification, build testing, and `code-reviewer` subagent audit.
  - Run `npm run check` and `npm run build`.
  - Dispatch `code-reviewer` subagent to audit security, correctness, and architecture.
  - Update knowledge graph with `graphify update .`.

## Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Accidental mutation of Master Part Catalog | High | Non-standard code path strictly uses `/api/documents/upload` and `handleDeleteOrderDoc`, completely isolated from `/api/part-number-masters`. |
| Out-of-order revision timestamps | Medium | Stable sort by `uploaded_at` ascending, fallback to `id` ascending, guaranteeing deterministic `R0, R1...` labeling. |
| Inadvertent syntax or reference errors in monolith | High | Verified by automated AST check (`npm run check`) and full Vite build (`npm run build`). |
