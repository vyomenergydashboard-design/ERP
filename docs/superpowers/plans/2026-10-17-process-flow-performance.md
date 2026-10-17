# Process Flow Performance Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate the loading lag, network waterfalls, and multi-render jank when opening the Process Flow view in Vyom ERP, making the view open smoothly and near-instantaneously.

**Architecture:** 
1. Convert the current 3-stage sequential waterfall in `App.jsx` (`fetchOrderDetails` -> state wipe -> state restore -> `fetchUnitSteps`) into a single concurrent `Promise.all` fetch cycle.
2. Fix the unit ID passing in `Header.jsx` to prevent ID mismatch fallback churn.
3. Cache/lift `task_masters` to avoid redundant network calls on every `FlowView` mount.
4. Fast-path empty custom fields in backend step endpoints (`/api/orders/:id/steps` and `/api/units/:unitId/steps`) to eliminate redundant sequential queries.

**Tech Stack:** React 18, Vite, Node.js Express, PostgreSQL (`pg`)

**Spec:** Identified in systematic performance debugging audit of `App.jsx`, `FlowView.jsx`, `Header.jsx`, and `server/index.js`.

## Global Constraints
- Preserve all existing invariants defined in `AGENTS.md` (no order renumbering, Sales-to-Design gate, Drawing & BOM gate).
- Zero breaking changes to API contracts or payload shapes for `/api/orders/:id`, `/api/orders/:id/steps`, and `/api/units/:unitId/steps`.
- Maintain full dark mode theme styling and accessibility.

## Review Focus
1. Switching to Flow from Table view with both `orderId` and `unitId` selected must immediately load both without clearing `selectedUnitId`.
2. Switching to Flow from Board view with only `orderId` selected must correctly auto-select the first unit once order details arrive without error.
3. Selecting an order from the Header search dropdown must open Process Flow cleanly without `order.id` / `unit.id` collision.
4. Step updates, holds, cancellations, and task reordering inside `FlowView` must continue to dispatch and update state seamlessly.
5. Task masters must remain reactive if an admin modifies them in Masters.

---

### Task 1: Parallelize Network Fetching & Fix Unit Wipeout in `App.jsx`

**Files:**
- Modify: `src/App.jsx:119-227`

**Interfaces:**
- Consumes: `GET /api/orders/:id`, `GET /api/orders/:id/steps`, `GET /api/units/:unitId/steps`
- Produces: Synchronized `selectedOrder`, `steps`, and `unitSteps` state without intermediate empty-state renders.

- [ ] **Step 1: Update `handleSetViewEvent` and ref tracking**
  Ensure that when `setView` includes `unitId`, `requestedUnitIdRef.current` and `selectedUnitId` are set, and a flag or ref indicates an active unit selection so `selectedOrder` initialization does not wipe it out.

- [ ] **Step 2: Consolidate order and unit data fetching into a concurrent pipeline**
  Refactor `fetchOrderDetails`, `fetchOrderSteps`, and `fetchUnitSteps` so that if `orderId` and `unitId` are known simultaneously, they are fetched in parallel with `Promise.all`.

- [ ] **Step 3: Lift `taskMasters` fetch to `App.jsx`**
  Fetch `/api/task_masters` once in `App.jsx` and pass `taskMasters` down to `FlowView`, eliminating the duplicate fetch on every `FlowView` mount.

---

### Task 2: Update `FlowView.jsx` to Consume Lifted Task Masters & Prevent Render Thrashing

**Files:**
- Modify: `src/components/FlowView.jsx:26-30`, `src/components/FlowView.jsx:385-396`

**Interfaces:**
- Consumes: `taskMasters` prop from `App.jsx` (with fallback self-fetch if not provided).
- Produces: Faster initial render without layout shift or delayed "+ Add Task..." dropdown rendering.

- [ ] **Step 1: Accept `taskMasters` prop in `FlowView`**
  Add `taskMasters: propTaskMasters` to `FlowView` props. If `propTaskMasters` is passed, use it directly; only fetch if `propTaskMasters` is undefined.

- [ ] **Step 2: Add memoization for department steps**
  Memoize `deptSteps` and sorted departments where appropriate to avoid re-filtering `activeSteps` on minor state changes.

---

### Task 3: Fix Order & Unit Dropdown Identification in `Header.jsx`

**Files:**
- Modify: `src/components/Header.jsx:123-181`

**Interfaces:**
- Consumes: `GET /api/orders`
- Produces: Accurate `setView` custom events where `unitId` is only supplied when an actual unit is selected, and never falsely substitutes `order.id`.

- [ ] **Step 1: Fix fallback unit item generation**
  When `order.units` is not present on an order item in Header, distinguish between order-level selection (`unitId: null`) and unit-level selection so `order.id` is never passed as `unitId`.

- [ ] **Step 2: Verify `handleSelectOrder` and `handleSelectUnit` dispatch correct payloads**
  Ensure `handleSelectOrder` dispatches `{ view: 'flow', orderId, unitId: null }` and `handleSelectUnit` only dispatches a valid unit ID.

---

### Task 4: Backend Step Endpoints Fast-Path for Custom Fields

**Files:**
- Modify: `server/index.js:3008-3040`, `server/index.js:3896-3920`

**Interfaces:**
- Consumes: `GET /api/orders/:id/steps`, `GET /api/units/:unitId/steps`
- Produces: Identical JSON response with significantly reduced DB roundtrips.

- [ ] **Step 1: Fast-path empty custom fields in `GET /api/orders/:id/steps`**
  Check if `cf.length === 0` after checking task master definitions. If empty, skip calling `resolveCustomFieldValues(cf, ...)`.

- [ ] **Step 2: Fast-path empty custom fields in `GET /api/units/:unitId/steps`**
  Check if `cf.length === 0` after checking task master definitions. If empty, skip calling `resolveCustomFieldValues(cf, ...)`.

---

### Task 5: Verification & Regression Testing

**Files:**
- Test scripts: `server/test_po_system.js`, `server/test_sales_to_design_gate.js`
- Build verification: `npm run build`

- [ ] **Step 1: Run frontend build check**
  Run `npm run build` to verify JSX syntax, imports, and bundle compilation.

- [ ] **Step 2: Measure API response times for flow endpoints**
  Verify that `/api/orders/:id/steps` and `/api/units/:unitId/steps` respond within < 15ms.

- [ ] **Step 3: Run existing automated backend test suite**
  Execute `node server/test_po_system.js` and `node server/test_sales_to_design_gate.js` to confirm all workflow invariants and gates remain 100% green.
