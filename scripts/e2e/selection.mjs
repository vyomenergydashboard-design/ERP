// Regression test: range selection in the All Orders table (Shift-click and drag) must select exactly
// the rows shown between the two rows, also after the table was re-sorted in the app.
//
// Bug it guards against: TableRow is memo'd with a comparator that ignores callback props, so a row
// whose own props did not change after a re-sort kept an old onRowMouseDown / onRowMouseEnter whose
// closure still had the old row order; Shift-clicking or drag-selecting onto that row selected rows by
// their old positions.
//
// Read-only (selection is client-side state). Uses the Admin token from tokens.json.
// Usage: node selection.mjs [filters,comma]      (APP_URL defaults to http://localhost:5173)
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.APP_URL || 'http://localhost:5173';
const { token, user } = JSON.parse(fs.readFileSync(path.join(here, 'tokens.json'), 'utf8')).Admin;
const FILTERS = (process.argv[2] || 'QC,Dispatch,Accounts,Sales,Production,Stores,Purchase').split(',');
const SORT_LABELS = ['Serial #', 'Order #', 'Priority', 'Delivery', 'Client', 'Status', 'Part Number', 'Panel Code', 'Panel Size', 'Project Name', 'End Client'];

const browser = await chromium.launch({ channel: 'msedge', headless: true });

// Opens a view, re-sorts it in the app until some row m keeps its position while rows above it change,
// then runs `act(page, m)` and checks that exactly the displayed rows 1..m+1 are selected.
async function runScenario(name, act) {
  for (const filter of FILTERS) {
    // tall viewport so a drag between row 1 and row m needs no scrolling
    const context = await browser.newContext({ viewport: { width: 1800, height: 9000 } });
    await context.addInitScript(({ token, user, filter }) => {
      if (sessionStorage.getItem('__sel_init')) return;
      sessionStorage.setItem('__sel_init', '1');
      localStorage.clear();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('erp_currentView', 'table');
      localStorage.setItem('erp_currentFilter', filter);
      localStorage.setItem('erp_all_statusFilter', 'all');
      localStorage.setItem('erp_all_pageSize', 'all');
      localStorage.setItem('erp_all_activeTab', 'all');
      localStorage.setItem('erp_all_sortKey', 'order_number');
      localStorage.setItem('erp_all_sortDir', 'asc');
    }, { token, user, filter });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message.split('\n')[0]));
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(3000);

    // One identity string per displayed row: the text of its data cells (not the row-number cell).
    const readOrder = () => page.evaluate(() => Array.from(document.querySelectorAll('tr'))
      .filter((tr) => tr.querySelector('td.erp-td'))
      .map((tr) => Array.from(tr.querySelectorAll('td.erp-td')).map((td) => td.textContent.trim()).join('|')));
    const settle = async () => {
      let prev = null;
      for (let i = 0; i < 15; i++) {
        const cur = JSON.stringify(await readOrder());
        if (cur === prev) return;
        prev = cur;
        await page.waitForTimeout(400);
      }
    };
    await settle();
    let prev = await readOrder();
    const selectable = await page.evaluate(() => Boolean(document.querySelector('td.erp-td-idx input[type=checkbox]')));
    if (prev.length < 3 || !selectable || new Set(prev).size !== prev.length) {
      await context.close();
      continue;
    }

    const labels = await page.evaluate(() => Array.from(document.querySelectorAll('.erp-th-title')).map((e) => e.textContent.trim()));
    for (const label of SORT_LABELS.filter((l) => labels.includes(l))) {
      for (const pass of ['first', 'second']) {
        // the label zone sorts on click (the sort icon itself is only visible on hover)
        await page.locator('th', { has: page.locator('.erp-th-title', { hasText: label }) }).first().locator('.erp-th-label-zone').click();
        await page.waitForTimeout(500);
        await settle();
        const next = await readOrder();
        let m = -1;
        for (let i = 1; i < next.length; i++) {
          if (next[i] === prev[i] && next.slice(0, i + 1).some((r) => !prev.slice(0, i + 1).includes(r))) { m = i; break; }
        }
        if (m === -1) { prev = next; continue; }

        await act(page, m);
        await page.waitForTimeout(500);
        const selected = await page.evaluate(() => Array.from(document.querySelectorAll('tr.row-selected'))
          .map((tr) => Array.from(tr.querySelectorAll('td.erp-td')).map((td) => td.textContent.trim()).join('|')));
        const expected = next.slice(0, m + 1);
        const wrong = selected.filter((r) => !expected.includes(r));
        const missing = expected.filter((r) => !selected.includes(r));
        const short = (r) => r.split('|').slice(0, 3).join(' | ');
        await context.close();
        return {
          pass: wrong.length === 0 && missing.length === 0,
          detail: `${name}: ${filter}, sorted by "${label}" (${pass} click), rows 1..${m + 1}: `
            + `${selected.length} selected, expected ${expected.length}`
            + (wrong.length ? `; wrongly selected ${wrong.length}: ${wrong.slice(0, 3).map(short).join(' ; ')}` : '')
            + (missing.length ? `; missing ${missing.length}: ${missing.slice(0, 3).map(short).join(' ; ')}` : '')
            + (errors.length ? `; page errors: ${errors.join(' | ')}` : ''),
        };
      }
    }
    await context.close();
  }
  return null;
}

const rowIdx = (page, i) => page.locator('tr:has(td.erp-td)').nth(i).locator('td.erp-td-idx');
const scenarios = {
  'shift-click': async (page, m) => {
    await rowIdx(page, 0).click();
    await rowIdx(page, m).click({ modifiers: ['Shift'] });
  },
  drag: async (page, m) => {
    const a = await rowIdx(page, 0).boundingBox();
    const b = await rowIdx(page, m).boundingBox();
    await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2);
    await page.mouse.down();
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await page.mouse.up();
  },
};

let failed = false;
let inconclusive = false;
for (const [name, act] of Object.entries(scenarios)) {
  const r = await runScenario(name, act);
  if (!r) { inconclusive = true; console.log(`INCONCLUSIVE: ${name}: no view and sort order produced the needed row layout with this data`); continue; }
  console.log(`${r.pass ? 'PASS' : 'FAIL'}: ${r.detail}`);
  if (!r.pass) failed = true;
}
await browser.close();
process.exit(failed ? 1 : inconclusive ? 2 : 0);
