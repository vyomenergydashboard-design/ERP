# Remaining Tasks — Handoff for Next Sessions

Last updated: 2026-11-18. Read this together with `CLAUDE.md` and `AGENTS.md` before starting.
AGENTS.md rules still apply: no code changes unless asked, **no commits/pushes unless the user
explicitly says so**. The user's workflow so far: one task at a time → verify → user says
"commit, merge into main and push" → commit on a short-lived branch, fast-forward `main`, push,
delete the branch.

---

## 1. Done so far (all on `main`)

`main`'s history was rewritten on 2026-11-18 (git filter-repo stripped a committed `.env`, dumps,
uploads and other junk; same file contents, new hashes). The hashes below are the new ones; the
old→new map is kept outside the repo in `ERP-local-archive/commit-map.txt`. Never push anything
built on the pre-rewrite history.

| Commit | What |
|---|---|
| `fabd56d` | Settings shows the real next order number |
| `8ca810d` | P0 security: CORS allowlist, required `JWT_SECRET`, no `admin123` seed, role fixes, `trust proxy` |
| `072a0d5` | P1 data integrity: transactions on 3 big routes, emails after COMMIT, startup waits for migrations, run-once boot migrations |
| `dabfd0b` | Same-order deadlock fix (`lockOrders`), `npm test` runner, CI workflow, fixture seeding |
| `8623f4c` | `xlsx` 0.20.3 (SheetJS CDN) + `multer` 2.5.0, UTF-8 upload names |
| `9a8fa67` | Cleanups: orphan-upload script, safe error messages, fetch `res.ok` checks, untracked AI-tool folders, docs |
| `898478e` | Docker: deps baked into images, healthchecks, restart policies, Postgres pinned to 18, `/api/health` |
| `5e5f24f` | **Task A** — single source for departments/roles (`server/data/workflow.js`, `src/data/roles.js`) |
| `200ad84` | **Task B** — shared `apiFetch` (`src/api/client.js`), 134 calls migrated |
| `0921483` | Handoff notes and the headless-Edge smoke harness (`scripts/e2e/`) |
| `55198e2` | **Task C step 1** — shared helpers into `server/services/` |
| `2e5a437`, `2f9abbb`, `261fdaa` | **Task C step 2** — companies, part-number / panel-size, task / column masters, logs / users / system-settings routers |
| `fa522ad`, `07b4d1b`, `1e18f61` | Repo cleanup (another session): stale files removed, docs reorganised, unused deps dropped, tests moved to `server/tests/` |

---

## 2. Remaining refactor tasks

### Task C — Move routes out of `server/index.js`

**Progress:** step 1 (shared helpers → `server/services/`) is done: `unitStatus.js`
(`deriveUnitStatus`, `syncLineItemStatusFromUnits`, `evaluateUnitDesignDocuments`,
`syncUnitDesignDocumentStatus`, `updateOrderQCStatusFromSteps`, `findBlockingUpstreamDepts`,
`setSystemSeeding`), `holds.js`, `notifications.js`, `uploads.js` (`upload`,
`cleanupUploadedFiles`), `orderNumbers.js`, `transactions.js` (`tryInSavepoint`, `lockOrders`),
`customFields.js`. Routers import these directly. Step 2 has started — extracted so far, each
`createXRouter(pool, authorize)` mounted where its routes were: `companies` → `routes/companies.js`,
`part-number-masters` → `routes/partNumberMasters.js` (its 3 document routes used to sit after the
panel-size routes; they now register with the rest of the router, which is safe because the
prefixes are disjoint), `panel-size-masters` → `routes/panelSizeMasters.js`, `task_masters` →
`routes/taskMasters.js`, `column-masters` → `routes/columnMasters.js`, `logs` → `routes/logs.js`,
`users` → `routes/users.js`, `system-settings` → `routes/systemSettings.js` (`/api/auth/*` stays in
`index.js` with `loginRateLimiter` for now), `documents` → `routes/documents.js`
(`createDocumentsRouter(pool, authorize, JWT_SECRET)`; the secret signs download tickets and stays
read/checked only in `index.js`; its five routes used to be interleaved with `units` routes and now
register together, which is safe because the prefixes are disjoint), `planning` →
`routes/planning.js` (5 routes; `bulk-units-status` used to sit among the `units` routes; keep
`/line-items/bulk` before `/line-items/:lineItemId`; `PUT /api/orders/:id/planning` stays with
`orders`), `units` → `routes/units.js` (12 routes in three blocks that now register together;
needs only `services/` and `data/` imports — no `index.js`-local helpers), `orders` →
`routes/orders.js` (20 routes in four blocks that now register together in their original relative
order; `evaluateOrderDesignGate` / `isReleaseDocumentsStep` moved with them as module-level helpers;
`/:orderId/steps/reorder` still precedes `/:orderId/steps/:stepId`). The last five small groups are
moved too, each mounted where its first route was: `auth` → `routes/auth.js`
(`createAuthRouter(pool, authorize, JWT_SECRET)`; `loginRateLimiter`, `loginAttempts` and the two
constants moved with it, nothing else used them), `diagnostic-status` → `routes/diagnostics.js`,
`board` → `routes/board.js`, `dept-worklist` → `routes/deptWorklist.js` (imports
`evaluatePurchaseAutoCompletion` and `deriveUnitStatus` itself), `template` → `routes/template.js`
(`createTemplateRouter()`, no `authorize`, as before; `templateHandler` moved with it). The route
table (95 registrations) is identical before and after. **Task C is complete:** `index.js` is now
~570 lines. What is left inline on purpose: `/api/health` (must stay before the request logger), the
`authorize` middleware, `/uploads` (+ `authorizeUploadDownload`), the error handler, and startup
(`initDB`, `seedSayaUser`, `startServer`).

Pre-existing behaviours seen while probing `orders` (not changed): creating an order whose line item
has no `unit_price` fails with 500 (NOT NULL) instead of a 400; `PUT /api/orders/:id/planning` sets
`end_client_name` to NULL when the field is not sent; changing an order's classification only applies
to units created afterwards (existing units keep theirs).

Found while probing (pre-existing, not changed): `POST /api/units/:id/design-confirm` only refuses
when the unit has unfinished *unit-level* Sales steps. A unit still in Sales because its PO /
order-level `Upload PO` is missing can be pre-confirmed (200; `design_confirmed` set). It still
cannot advance, because `deriveUnitStatus` keeps it in Sales, but AGENTS.md §8 says this call should
return 400 while Sales clearances are pending. Owner to decide whether to tighten the guard.
Still in `index.js`: `authorizeUploadDownload` (guards the `/uploads` static); `authorize` stays in
`index.js` and is passed to each router factory. (`evaluateOrderDesignGate` /
`isReleaseDocumentsStep`, `templateHandler` and `loginRateLimiter` now live in their routers.)

**State:** `server/index.js` was ~7,700 lines with **84 routes**. Only `routes/backup.js`,
`maintenance.js`, `purchaseOrders.js`, `wiremanMasters.js` exist. Route groups still inline:
`/api/orders` (20), `/api/units` (12), `/api/part-number-masters` (7), `/api/users` (5),
`/api/planning` (5), `/api/documents` (5), `/api/column-masters` (5), `/api/task_masters` (4),
`/api/panel-size-masters` (4), `/api/logs` (3), `/api/companies` (3), `/api/auth` (3),
`/api/template` (2), `/api/system-settings` (2), and single routes (`health`, `diagnostic-status`,
`dept-worklist`, `board`).

**Approach (one group per step, verify, then the next):**
1. Move shared helpers out first so routers can import them instead of receiving 15 arguments:
   e.g. `server/services/` for `deriveUnitStatus` + its helpers, `lockOrders`, `tryInSavepoint`,
   `findBlockingUpstreamDepts`, `isUnitOnHold` / `isOrderOnHold` / `isLineItemOnHold`,
   `cleanupUploadedFiles`, `syncUnitDesignDocumentStatus`, `updateOrderQCStatusFromSteps`, and
   the multer `upload` config (`server/services/uploads.js`). Already extracted:
   `services/httpErrors.js`, `services/afterCommit.js`, `data/workflow.js`, `data/defaultTaskMasters.js`.
2. Extract routers, lowest coupling first: `companies` → `panel-size-masters` + `part-number-masters`
   → `column-masters` + `task_masters` → `logs` + `users` + `system-settings` → `documents`
   → `planning` → `units` → `orders`. Follow the existing factory pattern
   (`export default function createXRouter(pool, authorize, deps) { const router = express.Router(); ... }`)
   and mount with `app.use('/api/x', createXRouter(...))`.
3. **Move code, don't rewrite it.** Same SQL, same status codes, same messages.
4. **Mount order:** Express matches routes in registration order. Today no parameter route
   shadows a literal one (checked), but keep each router mounted where its routes used to be
   registered, and keep routes in the same relative order inside the router. Auth routes must
   stay before anything that could intercept them; the error handler and `/uploads` static
   must stay last.
5. Keep `/api/health` before the request logger (it is intentionally not logged).

**Verify after every group:**
- `node --check` on changed files; `docker-compose restart backend`, wait for `healthy`.
- Route table unchanged: dump `METHOD path` for all `app.*` / router routes before and after and diff
  (e.g. walk `app._router.stack` in a one-off script, or grep the sources).
- `docker-compose exec -T -e DATABASE_URL=postgresql://postgres:postgres@db:5432/erp_db -e API_BASE=http://localhost:5000 backend npm test` → must stay 24/24.
- Browser smoke (`scripts/e2e`, see §4) → identical to the run before the step.

### Task D — Split `src/components/AllOrdersTableView.jsx`

**Progress:** steps 1 and 2 are done (code moved verbatim, only `import` / `export` lines added).
`AllOrdersTableView.jsx` went from 7,006 to ~3,355 lines and now holds only the main component
(~50 `useState`, ~26 `useEffect`). New modules in `src/components/allOrdersTable/`:
`columns.js` (`DEPT_OWNED_COLUMNS`, `COLUMN_OWNER_DEPT`, `getOwningDept`, `PRODUCTION_AND_QC_COLS`,
`TEXT_WRAPPABLE_COLS`, `BASE_COLUMNS`, `DEFAULT_COLUMN_KEYS`), `statusStyles.js` (`PRIORITY_ORDER`,
`PRIORITY_STYLES`, `STATUS_STYLES`), `dates.js` (date type checks and formatters), `uploads.js`
(`getDocUrl`, `openUploadSafely`), `status.js` (`isStatusDone`, `isStatusInProgress`,
`calculateUnitStatus`), `tooltips.js` (`getCellTooltip`), and one default-exported component per
file: `PanelSizeComboboxCell.jsx`, `TableRow.jsx` (custom `memo` comparator untouched, stale-callback
bug still there), `PoUploadModal.jsx`, `PoUploadBar.jsx`, `StoresBatchTrayStatusBar.jsx`.
`renderCellContent` (~1,500 lines) was moved whole into `renderCellContent.jsx` because `TableRow`
needs it and it needs `PanelSizeComboboxCell`; leaving it in the main file would create an import
cycle. Splitting it up is step 3 (next). `calculateOptimalColumnWidth` was already in
`tableColumnSizing.js`. `getDocUrl` is no longer a named export of `AllOrdersTableView.jsx` (nothing
imported it). Not yet browser-smoked.

**Approach (small, verifiable steps):**
1. Move module-level constants/helpers (`DEPT_OWNED_COLUMNS`, `PRODUCTION_AND_QC_COLS`,
   `TEXT_WRAPPABLE_COLS`, `getOwningDept`, `calculateOptimalColumnWidth`, date formatters) into
   `src/components/allOrdersTable/` modules.
2. Move the inner components one per file into the same folder (props unchanged).
3. Split `renderCellContent` by department/column family (dates, PO, panel size, QC, Stores …)
   into small cell components or a lookup table.
4. Only then consider state extraction (custom hooks for data loading, selection, column layout).

**Known bug to fix while there:** the `TableRow` `memo` comparator ignores callback props, so
`handleRowMouseDown` can see a stale `displayedUnits` (shift-click range selection may select the
wrong rows after filtering/sorting). Fix by including the callbacks or making them stable
(`useStableCallback` already exists in `src/hooks/`).

**Verify after every step:** `npm run check`, `npm run build`, browser smoke for all roles
(identical results), plus a targeted interaction script for the cells touched (open table as the
owning role, edit a cell on a TEST order created via API, check the PUT and the re-render, delete
the TEST order). There are no unit tests for the frontend — the e2e harness is the safety net.

---

## 3. Known issues backlog (found, not fixed)

| Issue | Where | Notes |
|---|---|---|
| Deleting a part-number document leaves its file on disk | `server/index.js` `DELETE /api/part-number-masters/:id/documents/:docId` | Row is deleted, file never unlinked → orphan. Unlink after delete (or keep if history is wanted — ask). |
| Settings page header says "User Management" | `src/App.jsx` page-title chain | The title ternary has no `settings`/`users` cases and falls through. Cosmetic. |
| 28 older unreferenced upload files | `server/uploads` | From before 2026-11-17, origin unknown. Review with `node scripts/cleanup_orphan_uploads.js` (dry run, in the backend container) before deleting. |
| CI first run not verified | GitHub Actions | `gh` is not installed locally. Check the Actions tab; integration job may need tweaks. |
| Login rate limiter can be bypassed via port 5000 | `server/index.js` `trust proxy` | Port 5000 stays public by owner's choice, so `X-Forwarded-For` can be spoofed when calling it directly. |
| SSE only broadcasts from 4 routes | `server/services/eventStream.js` callers | Other users don't see order/step/hold/PO changes live. |
| Big table not virtualized | `AllOrdersTableView.jsx` | "All" page size renders every row. |
| ~1,200 hardcoded hex colors in JSX | many components | Should use CSS tokens from `src/index.css`. |
| No ESLint / Prettier | repo | `npm run check` is the only static check. |
| nginx: no TLS/HSTS/CSP | `nginx.conf` | Depends on how production is exposed. |
| Default DB credentials `postgres/postgres` | `docker-compose.yml` | Port 5433 is public by owner's choice. |
| Some tests ignore `DATABASE_URL` / `API_BASE` | `server/tests/` | Five tests import `../db.js`, which uses `DB_NAME` (deadlock_immunity, jsonb_merge_integrity, multiple_wiremen, optimistic_concurrency_control, purchase_auto_completion), and `test_purchase_auto_completion.js` hard-codes `http://localhost:5000/api/units/batch-purchase-na`. Inside the dev backend container these always reach `erp_db`, whatever `DATABASE_URL` says. In a "fresh DB" run next to the dev backend, that hard-coded call sends throwaway-DB unit ids to the dev backend. Fix: use `API_BASE` and `DATABASE_URL` everywhere (or a shared test helper). Until then use the isolated recipe in §4. |

---

## 4. How to verify (tools set up this session)

- **Backend integration tests:** `npm test` in `server/` (runs all `test_*.js`, cleans up uploads
  and dangling document rows it created). Run inside the container with the env shown in §2.
- **Fresh-database run** (what CI does): a throwaway DB `erp_ci` served by its **own container**,
  whose PID 1 listens on port 5000 with `DB_NAME=erp_ci`. Every way a test reaches the backend or DB
  then points at `erp_ci`: `API_BASE`, `DATABASE_URL`, `../db.js` (`DB_NAME`) and the hard-coded
  `localhost:5000` (see §3). Don't run the suite inside the dev `backend` container against a second
  port: those tests would still hit `erp_db`. Run from the repo root:
  ```bash
  docker-compose exec -T db psql -U postgres -c "DROP DATABASE IF EXISTS erp_ci WITH (FORCE)" -c "CREATE DATABASE erp_ci"
  docker run -d --name erp-ci --network erp_default -v "$PWD/server:/app" --tmpfs /app/node_modules -w /app \
    -e DB_HOST=db -e DB_USER=postgres -e DB_PASSWORD=postgres -e DB_NAME=erp_ci -e DB_PORT=5432 \
    -e SMTP_USER= -e INITIAL_ADMIN_PASSWORD=ci-admin-pass \
    -e JWT_SECRET="$(docker-compose exec -T backend printenv JWT_SECRET)" vyom-erp-backend
  # wait until: docker exec erp-ci wget -qO- http://127.0.0.1:5000/api/health
  E="-e DATABASE_URL=postgresql://postgres:postgres@db:5432/erp_ci -e API_BASE=http://localhost:5000"
  docker exec $E -e ALLOW_FIXTURE_SEED=1 -e ADMIN_PASSWORD=ci-admin-pass erp-ci node scripts/seed_ci_fixtures.js
  docker exec $E erp-ci npm test
  docker rm -f erp-ci && docker-compose exec -T db psql -U postgres -c "DROP DATABASE erp_ci WITH (FORCE)"
  ```
  Sanity check: `SELECT count(*) FROM activity_logs` on `erp_db` should be the same before and after.
  (On Windows Git Bash, prefix `MSYS_NO_PATHCONV=1` and use a `C:/...` path for `-v`.)
- **Browser smoke tests:** `scripts/e2e/README.md` (headless Edge, every role × every view,
  before/after diff, write-path test).

---

## 5. Owner decisions (don't re-ask)

- Hold / Cancel / Resume (`/api/units/hold-action`) stays open to **all operator roles** — intentional.
- Order-number prefix stays **calendar year**; factory reset numbering behaviour stays as is.
- A fresh install seeds **only** the `Upload PO` task master — intentional (admins build the workflow;
  seeding all defaults would bring back tasks they deleted). Tests get defaults via `seed_ci_fixtures.js`.
- **Planning is read-only in the Table View** (`TABLE_EDIT_ROLES`), even though the backend accepts its edits.
- Ports 5000 and 5433 stay **published on all interfaces** (old setting kept on request).
- Wiremen and panel-size lists are **readable by every logged-in user**; writes stay restricted.
- Logs feed visible to everyone (non-admins capped at 1,000 rows); user emails Admin-only.
- Uploads/backups stay in `server/uploads` / `server/backups` (off-site copy is an ops task).

---

## 6. Gotchas learned

- **Line endings:** `core.autocrlf=true`, so working-copy files are **CRLF** while the repo stores LF.
  Scripted edits must handle `\r\n` (normalize to `\n`, edit, write back with `\r\n`); regexes
  written for `\n` silently fail to match otherwise.
- **Untracking folders + fast-forward merge deletes them from disk.** When a commit removes tracked
  files that should stay local, re-check the folders after merging (and restore with
  `git checkout <previous-commit> -- <paths>` then `git rm -r --cached <paths>`). Other clones lose them on `git pull`.
- After changing `package.json`/lockfiles: `docker-compose up -d --build backend erp-dev`.
- Tests and probes that upload files write into the shared `server/uploads`; clean up afterwards.
- The Excel import and order creation on `erp_db` consume real dev order numbers — use the
  throwaway `erp_ci` database for anything that creates orders.
- **Verifying a worktree without touching the running stack** (used for Task C step 1): run the
  `vyom-erp-backend` image with the worktree's `server/` mounted at `/app` (plus
  `--tmpfs /app/node_modules`) on the `erp_default` network, and a `vyom-erp-dev` container with the
  worktree mounted and `--add-host backend:<that container's IP>` on another host port. `vite.config.js`
  pins `server.hmr.clientPort` to 5173, so a second Vite must override it (wrapper config passed via
  `--config`); otherwise every page logs a WebSocket error and pages randomly reload mid-smoke.
  Then `APP_URL=http://localhost:<port> node scripts/e2e/smoke.mjs <label>`.
- In a container whose main process is `node index.js`, stop extra backends with `pgrep -x node`
  (skip PID 1) — `pgrep -f "node index.js"` also matches the `sh -c` running the kill loop.

---

## 7. Production redeploy checklist (not yet done)

1. `JWT_SECRET` set in the server's `.env` (backend refuses to start without it).
2. Copy aside any local AI-tool folders before `git pull` (they are untracked now and will be removed).
3. `git pull && docker-compose up -d --build` (first build needs internet: npm + `cdn.sheetjs.com`).
4. Check `docker-compose ps` shows `backend` and `db` healthy; log in once; spot-check uploads.
