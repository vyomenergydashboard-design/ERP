// Headless Edge smoke test: logs in as each role (token injected into localStorage),
// opens every view, and records page errors, console errors, failed API calls and a
// screenshot per view. Usage: node smoke.mjs <label> [roles,comma] [views,comma]
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const label = process.argv[2] || 'run';
const BASE = process.env.APP_URL || 'http://localhost:5173';
const tokens = JSON.parse(fs.readFileSync(path.join(here, 'tokens.json'), 'utf8'));
const roles = (process.argv[3] || Object.keys(tokens).join(',')).split(',');
const VIEWS = (process.argv[4] || 'table,board,flow,planning,orders,documents,new-order,masters,import,worklist,form-pdr-03,users,logs,settings').split(',');
const shotDir = path.join(here, 'shots', label);
fs.mkdirSync(shotDir, { recursive: true });

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const results = [];

for (const role of roles) {
  const { token, user } = tokens[role];
  for (const view of VIEWS) {
    const context = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await context.addInitScript(({ token, user, view }) => {
      if (sessionStorage.getItem('__smoke_init')) return; // only before the first load
      sessionStorage.setItem('__smoke_init', '1');
      localStorage.clear();
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('erp_currentFilter', ['Admin', 'Manager', 'Viewer'].includes(user.role) ? 'all' : user.role);
      localStorage.setItem('erp_currentView', view);
    }, { token, user, view });

    const page = await context.newPage();
    const issues = [];
    page.on('pageerror', (err) => issues.push(`pageerror: ${err.message.split('\n')[0]}`));
    page.on('console', (msg) => {
      if (msg.type() === 'error' && !(msg.location()?.url || '').endsWith('/favicon.ico')) issues.push(`console: ${msg.text().split('\n')[0].slice(0, 200)} @ ${(msg.location()?.url || '').replace(BASE, '')}`);
    });
    page.on('response', (res) => {
      const url = res.url();
      if (res.status() >= 400 && !url.endsWith('/favicon.ico')) issues.push(`http ${res.status()} ${res.request().method()} ${url.replace(BASE, '')}`);
    });
    page.on('request', (req) => {
      const u = req.url();
      const isApi = u.startsWith(BASE + '/api/') && !u.includes('/api/auth/login') && !u.includes('/api/events?ticket=');
      if (isApi && !req.headers()['authorization']) issues.push(`no-auth ${req.method()} ${u.replace(BASE, '')}`);
    });
    page.on('requestfailed', (req) => {
      const f = req.failure()?.errorText || '';
      if (!f.includes('ERR_ABORTED')) issues.push(`requestfailed: ${req.url().replace(BASE, '')} ${f}`);
    });

    let landedView = '?';
    try {
      await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3500); // SSE keeps the network busy, so wait a fixed settle time
      landedView = await page.evaluate(() => localStorage.getItem('erp_currentView'));
      await page.screenshot({ path: path.join(shotDir, `${role}-${view}.png` ) });
    } catch (err) {
      issues.push(`navigation: ${err.message.split('\n')[0]}`);
    }
    results.push({ role, view, landedView, issues: [...new Set(issues)] });
    await context.close();
  }
}
await browser.close();

fs.writeFileSync(path.join(here, `result-${label}.json`), JSON.stringify(results, null, 2));
let problems = 0;
for (const r of results) {
  const redirected = r.landedView !== r.view ? ` -> landed on "${r.landedView}"` : '';
  if (r.issues.length || redirected) {
    problems++;
    console.log(`${r.role}/${r.view}${redirected}`);
    r.issues.forEach((i) => console.log(`    ${i}`));
  }
}
console.log(`\n${results.length} role/view pages checked, ${problems} with issues or redirects. Screenshots: ${shotDir}`);
