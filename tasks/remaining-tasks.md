# Remaining Tasks — Handoff for Next Sessions

Last updated: 2026-11-18. Read this together with `CLAUDE.md` and `AGENTS.md` before starting.
AGENTS.md rules still apply: no code changes unless asked, **no commits/pushes unless the user
explicitly says so**. The user's workflow so far: one task at a time → verify → user says
"commit, merge into main and push" → commit on a short-lived branch, fast-forward `main`, push,
delete the branch.

---

## 1. Done so far (all on `main`)

| Commit | What |
|---|---|
| `fed1d84` | Settings shows the real next order number |
| `bafcc7c` | P0 security: CORS allowlist, required `JWT_SECRET`, no `admin123` seed, role fixes, `trust proxy` |
| `6a87158` | P1 data integrity: transactions on 3 big routes, emails after COMMIT, startup waits for migrations, run-once boot migrations |
| `3980753` | Same-order deadlock fix (`lockOrders`), `npm test` runner, CI workflow, fixture seeding |
| `015ab48` | `xlsx` 0.20.3 (SheetJS CDN) + `multer` 2.5.0, UTF-8 upload names |
| `48dda8c` | Cleanups: orphan-upload script, safe error messages, fetch `res.ok` checks, untracked AI-tool folders, docs |
| `5895460` | Docker: deps baked into images, healthchecks, restart policies, Postgres pinned to 18, `/api/health` |
| `02cf54a` | **Task A** — single source for departments/roles (`server/data/workflow.js`, `src/data/roles.js`) |
| `6bf7bcb` | **Task B** — shared `apiFetch` (`src/api/client.js`), 134 calls migrated |

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
`routes/taskMasters.js`, `column-masters` → `routes/columnMasters.js`. `index.js` is now ~5,770
lines. Next routers: `logs` + `users` + `system-settings` (note: `system-settings` uses
`computeNextOrderNumber` from `services/orderNumbers.js`).
Still in `index.js` and route-group-local (move with their router):
`evaluateOrderDesignGate` / `isReleaseDocumentsStep` (orders), `templateHandler` (template),
`authorizeUploadDownload` (uploads), `loginRateLimiter` (auth); `authorize` stays in `index.js`
and is passed to each router factory.

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

**State:** ~7,000 lines. Main component starts ~line 3686 (≈3,350 lines, ~50 `useState`,
~26 `useEffect`); `renderCellContent` is one ~1,500-line function; several components are defined
inside the file: `PanelSizeComboboxCell` (~line 227, ~530 lines), `PoUploadModal`, `PoUploadBar`,
`StoresBatchTrayStatusBar` (~2870–3685), `TableRow` (custom `memo` comparator ~2843).

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

---

## 4. How to verify (tools set up this session)

- **Backend integration tests:** `npm test` in `server/` (runs all `test_*.js`, cleans up uploads
  and dangling document rows it created). Run inside the container with the env shown in §2.
- **Fresh-database run** (what CI does): create a throwaway DB `erp_ci`, start a second backend on
  port 5055 against it, seed fixtures, run the suite, drop the DB:
  ```bash
  docker-compose exec -T db psql -U postgres -c "DROP DATABASE IF EXISTS erp_ci WITH (FORCE)" -c "CREATE DATABASE erp_ci"
  docker-compose exec -T -d -e DB_NAME=erp_ci -e PORT=5055 -e INITIAL_ADMIN_PASSWORD=ci-admin-pass -e SMTP_USER= backend sh -c "exec node index.js > /tmp/ci_backend.log 2>&1"
  E="-e DATABASE_URL=postgresql://postgres:postgres@db:5432/erp_ci -e API_BASE=http://localhost:5055"
  docker-compose exec -T $E -e ALLOW_FIXTURE_SEED=1 -e ADMIN_PASSWORD=ci-admin-pass backend node scripts/seed_ci_fixtures.js
  docker-compose exec -T $E backend npm test
  ```
  Stop the extra backend **by PID** afterwards (`pgrep node` inside the container; PID 1 is the
  main backend) — a second start on 5055 fails with EADDRINUSE and silently leaves the old process
  serving stale code.
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
