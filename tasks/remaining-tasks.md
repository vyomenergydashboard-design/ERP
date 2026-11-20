# Remaining Tasks — Handoff for Next Sessions

Last updated: 2026-11-20. Read this together with `CLAUDE.md` and `AGENTS.md` before starting.
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
| `0f5b49a` | Planning removed from the frontend `DEPTS`, kept in `PIPELINE` |
| `2fd84f2`, `1d949c0`, `4b51241` | **Task C step 2** — planning, units and orders routers |
| `24e27b2` | CI: gitleaks secret scan over the full history |
| `005b582` | **Task C complete** — auth, diagnostics, board, dept-worklist and template routers; `index.js` ~570 lines |
| `967697d` | **Task D steps 1-2** — `AllOrdersTableView` helpers and inner components into modules |
| `bb96c21` | **Task D step 3** — `renderCellContent` split into per-column-family cell modules |
| `a89a893` | Fix: range selection picks the displayed rows after the table is re-sorted |
| `a0b60ac` | **Task D step 4** — `AllOrdersTableView` state groups moved into custom hooks |
| `26cb190` | Fix: planning saves keep unsent dates, clear 400 for a missing price, masked login logs, tests honour `DATABASE_URL` |
| `9118ca1` | Fix: design-confirm refuses Design users while a panel awaits Sales |
| `de7e339` | Fix: changing an order's classification updates its panels not past Design |
| `71a2971` | Fix: reads no longer run Purchase auto-completion |

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

Pre-existing behaviours seen while probing `orders`: the missing-`unit_price` 500 and
`PUT /api/orders/:id/planning` clearing fields that were not sent are fixed (2026-11-19, see §3).
Also fixed on 2026-11-19: changing an order's classification used to apply only to units created
afterwards. `PUT /api/orders/:id/classification` now updates existing panels that have not passed
Design (Sales / Design, not cancelled) and re-checks their Drawing / BOM requirement
(`syncUnitDesignDocumentStatus`); panels in Purchase or later keep their type (§5).
Test: `test_order_classification_panels.js`.

Found while probing and fixed on 2026-11-19: `POST /api/units/:id/design-confirm` used to refuse
only when the unit had unfinished *unit-level* Sales steps, so a unit still in Sales because its PO /
order-level `Upload PO` was missing could be pre-confirmed by Design. It now uses the full Sales gate
(`isAwaitingSales`, shared with `deriveUnitStatus`); Admin / Manager keep their override (§5).
Test: `test_design_confirm_sales_gate.js`.
Still in `index.js`: `authorizeUploadDownload` (guards the `/uploads` static); `authorize` stays in
`index.js` and is passed to each router factory. (`evaluateOrderDesignGate` /
`isReleaseDocumentsStep`, `templateHandler` and `loginRateLimiter` now live in their routers.)

**State:** Task C is complete. `server/index.js` went from ~7,700 lines with 84 routes to ~570 lines;
every route group lives in `server/routes/*.js` (`auth`, `backup`, `board`, `columnMasters`,
`companies`, `deptWorklist`, `diagnostics`, `documents`, `logs`, `maintenance`, `orders`,
`panelSizeMasters`, `partNumberMasters`, `planning`, `purchaseOrders`, `systemSettings`,
`taskMasters`, `template`, `units`, `users`, `wiremanMasters`). The text below is the plan that was
followed, kept for reference.

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
- `docker-compose exec -T -e DATABASE_URL=postgresql://postgres:postgres@db:5432/erp_db -e API_BASE=http://localhost:5000 backend npm test` → every test file must pass (30 on 2026-11-20; more with `--all`).
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
cycle. `calculateOptimalColumnWidth` was already in
`tableColumnSizing.js`. `getDocUrl` is no longer a named export of `AllOrdersTableView.jsx` (nothing
imported it). Steps 1-2 were browser-smoked (98/98 identical) before landing (967697d).

Step 3 is done: `renderCellContent.jsx` (1,519 → 74 lines) is now a dispatcher. It keeps the same
signature and the five values it computes up front (`statusStyle`, `priority`, `priorityStyle`,
`isOverdue`, `effectiveUnitId`), puts everything in one `ctx` object and calls the column family's
renderer from `CELL_RENDERERS` (a `Map`, so a custom column named e.g. `constructor` can't hit an
`Object` prototype key). Anything not in the map goes to `renderCustomCell`, as the old `default`
did. The family modules in `allOrdersTable/cells/` each hold the original `case` blocks unchanged
inside the same `switch (colKey)`: `orderCells` (order #, serial, client, type, priority, status,
delivery), `salesCells` (PO #, ref / tag), `panelCells` (part number, panel code / size / IP /
comments), `purchaseCells`, `storesCells` (tray), `productionCells` (wiremen, production and QC
stage dates), `qcCells` (QC status), `dispatchCells` (dispatch / invoice), `customCells` (the old
`default`). Each exports its `*_CELL_KEYS`, which must equal its `case` labels. Every case ends in
`return`/`throw` (no fall-through), so grouping them is behaviour-preserving.
Verified: rendered HTML of every table cell for each role and every Admin department filter
(184,144 cells, page size "all", status "all") was identical before and after, and two "before"
runs were identical too, so the comparison has no noise.

Step 4 (state hooks) is done for the self-contained groups: `AllOrdersTableView.jsx` went from 3,355
to ~3,100 lines. New hooks in `allOrdersTable/hooks/`, each holding the moved code unchanged and called
where its first hook used to be:
- `useTableFilters()`: search, tab, priority / status filters, sort key / direction (saved as
  `erp_all_*`) and `handleSort`.
- `usePagination({ searchTerm, activeTab, priorityFilter, statusFilter, statCardFilter })`: page
  size (saved) and current page, reset to 1 when any input changes.
- `useReferenceData()`: part-number and panel-size masters (+ `panelSizeMap`), wiremen (cached in
  sessionStorage) and vendor POs (+ `purchaseOrdersBySerialAndCat`), with their fetch functions.
- `useColumnWidths({ allColumns })`: column widths (saved v16 / v15 or the defaults), debounced
  saving, and `handleResizeStart`.
Hook call order moves only by whole groups and is the same on every render, which is all React needs.
Verified: every moved line is in a hook and every kept line is unchanged and in order, `npm run
check` / build pass, the 184,144-cell render snapshot is identical, a settings test (sort, filters,
page size, next page, search reset, column resize, reload) is identical before and after, and
`scripts/e2e/selection.mjs` passes.
Deliberately not extracted, because they are entangled:
- Row selection: its state and `isIdSelected` are used by callbacks defined long before
  `displayedUnits`, whose dependency arrays are evaluated during render, while the range handlers
  need `displayedUnits`. Splitting it would need two hooks or a ref.
- Column order / pin / visibility: `handleHeaderDrop` reads `visibleCols`, which is computed at the
  end of the component from `activeCols`, `isColVisible` and `userHiddenColumns`.
Both are possible follow-ups if wanted, with the same verification.

**Approach (small, verifiable steps):**
1. Move module-level constants/helpers (`DEPT_OWNED_COLUMNS`, `PRODUCTION_AND_QC_COLS`,
   `TEXT_WRAPPABLE_COLS`, `getOwningDept`, `calculateOptimalColumnWidth`, date formatters) into
   `src/components/allOrdersTable/` modules.
2. Move the inner components one per file into the same folder (props unchanged).
3. Split `renderCellContent` by department/column family (dates, PO, panel size, QC, Stores …)
   into small cell components or a lookup table.
4. Only then consider state extraction (custom hooks for data loading, selection, column layout).

**Fixed: range selection after re-sorting.** The `TableRow` `memo` comparator ignores callback
props, so a row that did not re-render after a sort / filter kept an old `onRowMouseDown` /
`onRowMouseEnter` whose closure had the old `displayedUnits`. Shift-click and drag selection then
picked rows by their old positions (reproduced: Sales view re-sorted by Priority, rows 1-137 gave
7 wrong rows and missed 7). `handleRowMouseDown` and `handleRowMouseEnter` now use
`useStableCallback`: a stable identity that always calls the latest closure, so the comparator can
keep ignoring callbacks without making all rows re-render. `scripts/e2e/selection.mjs` is the
regression test. It failed on the old code and passes now; see `scripts/e2e/README.md`.
Checked and deliberately left unchanged, because no stale behaviour is possible today:
- The other row callbacks. `handleSingleUnitPoClick`, `handleDeleteUnitPoDoc` and
  `handleDeletePanelSize` close over `canUploadPo` / `canEditPanelSize`, which are constant per
  session, state setters, and `fetchUnits`, whose only captured value is `currentFilter`, which the
  comparator compares. The rest are `useCallback(..., [])` or already `useStableCallback`.
- The ignored data props. `showSelection` and `stickyLeftMap` follow `currentFilter`, `visibleCols`,
  `columnWidths` and `pinnedKeys`; `panelSizeMap` follows `panelSizeMasters`; `canUploadPo` and
  `canConfirmDesign` are constant per role.
If any of those inputs start depending on other state, wrap the handler in `useStableCallback` or
add the prop to the comparator.

**Verify after every step:** `npm run check`, `npm run build`, browser smoke for all roles
(identical results), plus a targeted interaction script for the cells touched (open table as the
owning role, edit a cell on a TEST order created via API, check the PUT and the re-render, delete
the TEST order). There are no unit tests for the frontend — the e2e harness is the safety net.

---

## 3. Known issues backlog (found, not fixed)

| Issue | Where | Notes |
|---|---|---|
| Login rate limiter can be bypassed via port 5000 | `server/index.js` `trust proxy` | Port 5000 stays public by owner's choice, so `X-Forwarded-For` can be spoofed when calling it directly. **Decided 2026-11-20: owner decided to leave it; handle at production time (expose only nginx).** |
| Big table not virtualized | `AllOrdersTableView.jsx` | "All" page size renders every row. **Decided 2026-11-20: measured 2026-11-20, left as is: 100 rows blocks 0.3 s, "All" (1,574) about 4 s on a production build; revisit past ~5,000 serials; `content-visibility` does not help.** |
| ~1,200 hardcoded hex colors in JSX | many components | Should use CSS tokens from `src/index.css`. **Decided 2026-11-20: owner decided to leave it.** |
| No ESLint / Prettier | repo | `npm run check` is the only static check. **Decided 2026-11-20: owner decided to leave it.** |
| nginx: no TLS/HSTS/CSP | `nginx.conf` | Depends on how production is exposed. **Decided 2026-11-20: owner decided to leave it for now; revisit before exposing the app outside the network.** |
| Default DB credentials `postgres/postgres` | `docker-compose.yml` | Port 5433 is public by owner's choice. **Decided 2026-11-20: owner decided to leave it; not verified on the production server.** |
| Adding a line item without a price stores 0 | `POST /api/orders/:orderId/line-items` | Order create and line-item edit answer 400 "Unit price is required" since 2026-11-19; this route still turns a missing price into 0. Probably fine; align if wanted. |

Fixed on 2026-11-20 (`4177d7b`, `4353642`, `b4a7205`, `e9f860f`):
- Planning "Completed" no longer ticks off upstream Sales / Design / Purchase / Stores steps. Non-Admin/
  Manager users get 409 naming the unfinished departments (unit, line-item and bulk saves; only panels
  not already Completed are checked, so re-saving a finished row still works). Admin / Manager are
  exempt from the 409 but never force-complete. Test: `test_planning_completion_gate.js`.
- Deleting a part-number document removes its file unless another row still uses it.
  Test: `test_part_number_document_file_delete.js`.
- Settings page header and breadcrumb say "Settings".
- Live updates (SSE): `broadcastOrderUpdated()` after commit in the orders, planning, purchase-orders,
  documents and units routers. Test: `test_event_broadcasts.js`.
- The 28 older orphan uploads were gone: `cleanup_orphan_uploads.js` (dry run) found 0.

Fixed on 2026-11-19 (each with a test that failed first):
- Planning saves (`PUT /api/planning/line-items/:id`, `PUT /api/planning/units/:unitId`,
  `PUT /api/orders/:id/planning`) only change the fields they are sent (`services/partialUpdate.js`).
  The Planning screen's custom-column edit sends only `custom_fields` and used to empty the row's 7
  planning dates. Test: `test_planning_partial_update.js`.
- Line-item prices: 0 is allowed; a missing or empty price is a 400 on order create and line-item
  edit (was a 500, NOT NULL), and quantity × price 0 gives total 0. Test: `test_line_item_price.js`.
- The six tests that imported `../db.js` (backup_and_audit, deadlock_immunity, jsonb_merge_integrity,
  multiple_wiremen, optimistic_concurrency_control, purchase_auto_completion) use `DATABASE_URL`;
  `test_purchase_auto_completion.js` uses `API_BASE` instead of a hard-coded `localhost:5000`.
- Login logs show a masked id (`services/logPrivacy.js`: `s***@gmail.com`, `a***`), never the full
  email or username; the diagnostics route's copy-pasted error label is corrected.
  Test: `test_mask_login_id.js`.
- CI checked on GitHub: CI and the secret scan are green on `a0b60ac`.
- Reads no longer write: `GET /api/dept-worklist/Purchase|all` and `GET /api/units/:unitId/steps`
  used to run Purchase auto-completion, so merely viewing could complete "Procure Materials" and move
  panels. It now runs only on the write paths (unit edit, batch "Purchase not applicable", vendor PO
  create / status update) plus once at startup (`sweepPurchaseAutoCompletion` in `startServer`), which
  catches legacy data or a "Procure Materials" step added later. Test: `test_reads_do_not_auto_complete.js`.

---

## 4. How to verify (tools set up this session)

- **Backend integration tests:** `npm test` in `server/` (runs all `test_*.js`, cleans up uploads
  and dangling document rows it created). Run inside the container with the env shown in §2.
- **Fresh-database run** (what CI does): a throwaway DB `erp_ci` served by its **own container**,
  whose PID 1 listens on port 5000 with `DB_NAME=erp_ci`. The tests reach the backend via `API_BASE`
  and the DB via `DATABASE_URL` (since 2026-11-19 none use `../db.js` or a hard-coded
  `localhost:5000`), and the backend itself uses `erp_ci`, so nothing touches `erp_db`. Run from the
  repo root:
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
- Design confirmation while a panel is awaiting Sales: **Admin and Manager keep their override**;
  Design users get 400 (2026-11-19).
- Changing an order's classification updates **existing panels that have not passed Design** and
  re-checks their Drawing / BOM; panels in Purchase or later keep the type they were built with,
  because Non-Standard ignores part-number documents and would send them back to Design (2026-11-19).
- Opening a worklist or a unit's steps must not change data: Purchase auto-completion runs on the
  write paths and once at server startup, not on reads (2026-11-19).

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

## 7. Production redeploy (done 2026-11-19)

Production was moved from the pre-rewrite `d773d42` to `a0b60ac` with `git fetch` +
`git reset --hard origin/main` (a `git pull` across the history rewrite would merge the old history
back in). Before that, `.env`, uploads and a full DB dump were copied out of the checkout, because
the old history had tracked `.env` and some uploads and the reset removes them. A new random
`JWT_SECRET` was written to `.env` (the old compose file hard-coded a public one), and the images
were rebuilt with `docker compose --profile prod up -d --build`. Login, documents and Settings were
checked afterwards.

Next deploys (now on the new history): `git fetch && git reset --hard origin/main` (or `git pull`),
then `docker compose --profile prod up -d --build`; check `docker compose ps` shows everything
healthy and log in once.
