# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The project rules contract (workflow gates, numbering immutability, security guardrails, transaction conventions, and the "don't modify code / don't commit unless asked" rules) lives in AGENTS.md and is binding:

@AGENTS.md

The notes below add what AGENTS.md does not cover.

## Commands

```bash
# Full dev stack (Postgres on host port 5433, backend :5000, Vite :5173)
docker-compose up erp-dev backend db

# Dependencies are baked into the images (no npm install on start). After changing
# package.json / package-lock.json (root or server/), rebuild:
docker-compose up -d --build backend erp-dev
# Source is bind-mounted, so code edits need only a restart (backend) or nothing (Vite HMR).
# Backend health: GET /api/health (unauthenticated, used by the Docker healthcheck).

# Backend only (auto-runs init.sql + run_deployment_migrations.js on boot)
cd server && node index.js

# Frontend
npm run dev          # Vite with --host
npm run build
npm run check        # scripts/verify_codebase.js — Babel AST scan for undeclared identifiers in src/
```

**Tests**: each `server/tests/test_*.js` is a standalone script that runs against a **live backend and live DB**. `server/run_tests.js` runs them in sequence:

```bash
cd server && npm test                    # all except the two that write backup files
cd server && npm test -- po_system qc    # only files whose name contains a word
cd server && npm test -- --all           # include test_maintenance_api / test_backup_and_audit
node server/tests/test_sales_to_design_gate.js # a single file
```

Test defaults: `DATABASE_URL=postgresql://postgres:postgres@localhost:5433/erp_db`, `API_BASE=http://localhost:5000`, and `JWT_SECRET` must equal the backend's (set in `.env`; the backend refuses to start without one). On an empty database, run `server/scripts/seed_ci_fixtures.js` first (needs `ALLOW_FIXTURE_SEED=1`): the tests expect the default task masters, company location 1, users 27 (Sales) and 31 (Design), and at least one order with units. A fresh install intentionally seeds only the `Upload PO` task master (admins build the rest), so the fixture script adds the defaults from `server/data/defaultTaskMasters.js` for test databases only.

**CI**: `.github/workflows/ci.yml` runs `npm run check`, the frontend build and a backend syntax check, then starts the backend against a fresh Postgres, seeds fixtures, and runs `npm test`. The tests mint their own JWTs and insert and delete rows whose order numbers are prefixed with `TEST-...`. That means the backend must be running and the JWT secret must match. Never point a test at a production DB.

`vite.config.js` proxies `/api` and `/uploads` to `http://backend:5000`, the Docker service name. If you run Vite natively outside Docker, that target won't resolve unless you change it.

## Architecture

### Unit status is derived, not set
The core of the system is `deriveUnitStatus(unitId, clientOrPool)` in `server/services/unitStatus.js`. Endpoints that change steps, documents, holds, or Purchase/Stores state update rows and then call `deriveUnitStatus`. That function recomputes `order_units.current_dept` from the `unit_steps` states, uploaded documents (Drawing/BOM/PO), `design_confirmed`, `sales_cleared`, and hold/cancel flags, and it sends dept-change emails. When changing advancement behaviour, change this function rather than writing `current_dept` directly. Pass the transaction `client` when calling it inside a transaction.

The department order is the `PIPELINE` array (`Sales → Design → Purchase → Stores → Planning → Production → QC → Dispatch → Accounts`). Backend source of truth: `server/data/workflow.js` (also `ALL_ROLES`, `OPERATOR_ROLES`, `PRIVILEGED_ROLES`, and `PIPELINE_SQL_ARRAY` / `deptOrderSql()` for SQL ordering — don't hand-write `CASE dept WHEN 'Sales' THEN 1 ...`). Frontend: `DEPTS` in `src/data/planningData.js` and `src/data/roles.js` (`isPrivileged`, `hasRole`, `TABLE_EDIT_ROLES`). Update backend and frontend together. Per-route role lists in `authorize([...])` and feature permissions (e.g. who uploads a PO) are deliberately separate. Completing a step while upstream departments are unfinished returns HTTP 409.

### Backend layout
- `server/index.js` is the monolith. It holds the auth (`authorize(roles)`), the large majority of routes, and startup DB init (being split up: Task C in `tasks/remaining-tasks.md`).
- New code belongs in `server/routes/*.js`. These are router factories that receive dependencies, e.g. `createPurchaseOrdersRouter(pool, authorize, deriveUnitStatus)`, and are mounted in index.js. Supporting logic goes in `server/services/`, which routers import directly:
  - `unitStatus` (`deriveUnitStatus`, line-item/QC roll-ups, Design document gate, `findBlockingUpstreamDepts`), `holds` (`isOrderOnHold` / `isUnitOnHold` / `isLineItemOnHold`), `notifications` (handover / hold emails), `uploads` (multer `upload` + allowlist, `cleanupUploadedFiles`), `orderNumbers` (serial allocation), `transactions` (`tryInSavepoint`, `lockOrders`), `customFields` (task custom-field datakeys), `afterCommit`, `httpErrors`, `partialUpdate` (`sentFieldAssignments`: write only the fields a request sent), `logPrivacy` (`maskLoginId` for login logs);
  - `purchaseAutoCompletion` / `storesAutoCompletion` (automatic step completion; run on write paths, plus a Purchase catch-up sweep at startup, never on GET requests), `eventStream` (SSE), `databaseBackup`, and `safeConditionEvaluator`.
- Schema: `init.sql` is the base schema. It also seeds the DB through docker-entrypoint. `run_deployment_migrations.js` runs on every boot and must stay idempotent and additive.

### Real-time updates
`services/eventStream.js` provides Server-Sent Events. The client first calls `POST /api/events/ticket` with its Bearer token to get a short-lived ticket, then opens `EventSource('/api/events?ticket=…')` (see `src/hooks/useEventStream.js`). This way the JWT never goes in the URL. Mutations call `broadcastEvent(...)` so that open views refresh. Downloads from `/uploads` are likewise protected by `authorizeUploadDownload`.

### Frontend
- `src/main.jsx` sets `window.API_BASE = ''`, so the app uses relative URLs that go through the Vite or Nginx proxy. It also installs a global fetch interceptor that logs the user out on a 401.
- Call the backend with `apiFetch('/api/...', options)` from `src/api/client.js`: it prefixes `window.API_BASE`, adds the `Authorization` header from `localStorage`, and returns the normal `Response` (check `res.ok` as usual). Don't hand-write `Authorization` headers. Only login (no token yet) and ticket-based file downloads use plain `fetch`.
- `src/App.jsx` handles routing, view tabs, and session sync. `AllOrdersTableView.jsx` is the main per-department table. Its dept-specific column sets and batch bars (`ProductionBatchBar`, `QcBatchBar`) are where most department UI changes land.
- Bulk order import works from an Excel template (`BulkImportModal`, `OrderImport`, using `xlsx` on both client and server).

## Other context files
- `PRODUCT.md`, `DESIGN.md`: product intent and UI design language.
- `docs/specs/`: feature specs and statements of intent (design confirmation/auto-release, non-standard panel docs). `docs/design/` holds the PRD-03 form reference image and `docs/samples/` a filled sample of the Excel order-import template.
- `tasks/remaining-tasks.md`: **start here in a new session** — what's done, the remaining refactor tasks (C: split `server/index.js`, D: split `AllOrdersTableView.jsx`), known issues, owner decisions and verification steps.
- `scripts/e2e/`: headless-Edge browser smoke tests for the running dev stack (see its README).
- `docs/BACKUP_AND_RECOVERY_GUIDE.md`: the backup/restore procedure.
