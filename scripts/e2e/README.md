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

## Limits

These are smoke tests: they prove screens load and requests succeed for each role. They do not
click through workflows. For a refactor of a specific screen, add a targeted interaction script.
