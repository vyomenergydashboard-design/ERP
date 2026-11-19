# Browser smoke tests (headless Edge)

Drives the **running dev stack** (`http://localhost:5173` → backend → `erp_db`) in headless
Microsoft Edge via `playwright-core` (no browser download; Edge ships with Windows 11).
Use it before and after any frontend refactor and compare the results.

## Setup (once)

```bash
cd scripts/e2e && npm install && cd ../..
sh scripts/e2e/mint-tokens.sh          # needs the dev stack up; writes gitignored tokens.json (8h)
```

## Smoke test: every role × every view

```bash
node scripts/e2e/smoke.mjs <label> [roles] [views]
# e.g. node scripts/e2e/smoke.mjs before
#      node scripts/e2e/smoke.mjs after Admin,QC table,flow
```

For each role and view it injects the login into localStorage, loads `/dashboard`, waits 3.5 s and
records page errors, console errors (except `/favicon.ico`), HTTP ≥ 400 responses, failed
requests, `/api` requests sent without a token, and the view it actually landed on (non-admins
asking for users/logs/settings are expected to land on `table`). Output:
`result-<label>.json` and `shots/<label>/<Role>-<view>.png`.

Compare two runs:

```bash
cd scripts/e2e && node -e "
const a=require('./result-before.json'), b=require('./result-after.json');
const k=x=>x.role+'/'+x.view, am=new Map(a.map(x=>[k(x),x]));
for (const y of b) { const x=am.get(k(y)); const A=JSON.stringify([x.landedView,x.issues]), B=JSON.stringify([y.landedView,y.issues]); if (A!==B) console.log(k(y),'\n  before',A,'\n  after ',B); }"
```

## Write-path test

`node scripts/e2e/writes.mjs` — as Admin, inside the real page, calls `apiFetch` for JSON
POST/PUT/DELETE (panel-size master) and a FormData upload (part-number master document) on
throwaway records, then deletes them. Note: deleting a part-number document leaves its file on
disk (known bug, see `tasks/remaining-tasks.md`); clean it with
`node server/scripts/cleanup_orphan_uploads.js --since=<today> --delete` (run in the backend
container).

## Range-selection test

`node scripts/e2e/selection.mjs [filters]` (default `QC,Dispatch,Accounts,Sales,Production,Stores,Purchase`)
is a regression test for the `TableRow` stale-callback bug. As Admin, it opens a view that has
row selection and re-sorts it in the app (header clicks) until some row keeps its position while
rows above it change. It then Shift-clicks, and separately drags, from row 1 to that row, and
checks that exactly the rows displayed in between are selected. It is read-only (selection is
client-side state). Exit code 0 = pass, 1 = wrong rows selected, 2 = inconclusive (the current data
gave no such layout; try other filters). With the dev data of 2026-11-19 the `Sales` view is
enough, and it is much faster: `node scripts/e2e/selection.mjs Sales`. Tokens expire after 8 hours.
A run where every page gets 401 shows up as INCONCLUSIVE, so re-mint `tokens.json` first.

## Limits

These are smoke tests: they prove screens load and requests succeed for each role. They do not
click through workflows. For a refactor of a specific screen, add a targeted interaction script.
