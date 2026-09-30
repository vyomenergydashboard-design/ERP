# Technical Implementation Plan: Design Department Confirmation & Dynamic Release Documents

## Architectural Overview
This plan implements the Design Department Confirmation Gate and dynamic Step 2 ("Release Documents") status progression. It connects the Table View classification dropdown with backend transactional step updates and real-time document detection for both Standard and Non-Standard panels.

---

## Phases & Build Order

```
Phase 1: DB Migration & Query Enrichment (server/run_deployment_migrations.js, server/index.js)
   │
   ▼
Phase 2: Confirmation API & Dynamic Document Evaluator (server/index.js)
   │
   ▼
Phase 3: Table View Confirmation UI & Optimistic Updates (src/components/AllOrdersTableView.jsx, src/index.css)
   │
   ▼
Phase 4: Part Number Modal Hook & Real-Time Sync (src/components/AllOrdersTableView.jsx, src/components/StepModal.jsx)
   │
   ▼
Phase 5: Verification, PO System Tests, Code Review & Graphify
```

---

## Major Components & Dependencies

1. **Database Schema (`server/run_deployment_migrations.js`):**
   - Add `design_confirmed`, `design_confirmed_at`, `design_confirmed_by` to `order_units`.
   - Additive and non-destructive.

2. **Backend Engine (`server/index.js`):**
   - Document Evaluator: determines if Drawing and BOM are present for a given unit (Standard vs Non-Standard).
   - Endpoint `POST /api/units/:id/design-confirm`:
     - Sets unit `design_confirmed = true`.
     - Marks Step 1 ("Review & Classify") as `done`.
     - Evaluates documents: both present → Step 2 `done`; 1 present → Step 2 `inprogress`; 0 present → Step 2 `pending`.
   - Endpoint `PUT /api/units/:id`:
     - When `classification` changes, resets `design_confirmed = false` and reverts steps for re-inspection.
   - Query updates:
     - Include confirmation fields and `design_confirmed_by_name` in `/api/units` and `/api/orders` fetches.

3. **Frontend Presentation (`src/components/AllOrdersTableView.jsx`, `src/index.css`):**
   - In `Type (Design)` column:
     - Render `Confirm` button if `!design_confirmed` (clickable for `Design` and `Admin`).
     - Render `✓ Confirmed` badge if `design_confirmed`.
     - Clicking `Confirm` makes optimistic UI update and calls `POST /api/units/:id/design-confirm`.
     - Changing classification dropdown resets confirmation.
     - Document upload/delete in Part Number modal dynamically refreshes Step 2 state.

---

## Risks & Mitigation Strategies

| Risk | Mitigation |
|---|---|
| Concurrent updates to Step 1 & Step 2 | Dedicated PostgreSQL transaction (`BEGIN` / `COMMIT`) with scoped error handling and guaranteed release. |
| Inadvertent auto-completion of unconfirmed panels | Step 2 can ONLY transition to `done` if `design_confirmed === true` AND both documents exist. |
| Order numbers or unit serial sequence corruption | No updates touch order IDs, numbers, or serial counters. Strictly additive fields. |
| UI scroll jump on table cell interaction | Local state is updated optimistically via `setUnits` and `onSaveInlineCell` without re-mounting the table. |

---

## Verification Checkpoints

1. **Checkpoint 1 (DB & Backend):** Execute deployment migration, test `POST /api/units/:id/design-confirm` with mock data.
2. **Checkpoint 2 (Frontend Rendering):** Verify `Confirm` button and `✓ Confirmed` badge appear in the table cell with proper RBAC.
3. **Checkpoint 3 (Integration):** Verify full workflow across Standard (Master Catalog) and Non-Standard (Custom uploads) panels.
4. **Checkpoint 4 (Build & Review):** `npm run check` and `npm run build` pass cleanly; subagent review audits correctness.
