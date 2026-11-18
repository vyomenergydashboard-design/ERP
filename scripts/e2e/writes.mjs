// Exercises apiFetch write paths inside the real app page (Admin): JSON POST/PUT/DELETE and a
// FormData upload, all on throwaway master records that are deleted again at the end.
import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const here = path.dirname(fileURLToPath(import.meta.url));
const BASE = 'http://localhost:5173';
const { token, user } = JSON.parse(fs.readFileSync(path.join(here, 'tokens.json'), 'utf8')).Admin;

const browser = await chromium.launch({ channel: 'msedge', headless: true });
const context = await browser.newContext();
await context.addInitScript(({ token, user }) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('erp_currentView', 'table');
}, { token, user });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2500);

const result = await page.evaluate(async () => {
  const { apiFetch } = await import('/src/api/client.js');
  const log = [];
  const step = async (label, promise) => {
    const res = await promise;
    let body = null;
    try { body = await res.json(); } catch { /* no body */ }
    log.push(`${res.status} ${label}`);
    return { res, body };
  };
  const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  // JSON round trip on a panel-size master
  const created = await step('POST panel-size (JSON)', apiFetch('/api/panel-size-masters', json('POST', { panel_size: 'APIFETCH-TEST-SIZE' })));
  const psId = created.body?.id;
  await step('PUT panel-size (JSON)', apiFetch(`/api/panel-size-masters/${psId}`, json('PUT', { panel_size: 'APIFETCH-TEST-SIZE-2' })));
  await step('DELETE panel-size', apiFetch(`/api/panel-size-masters/${psId}`, { method: 'DELETE' }));

  // FormData upload on a part-number master
  const pn = await step('POST part-number (JSON)', apiFetch('/api/part-number-masters', json('POST', { part_number: 'APIFETCH-TEST-PN' })));
  const pnId = pn.body?.id;
  const fd = new FormData();
  fd.append('doc_type', 'Drawing');
  fd.append('files', new Blob(['%PDF-1.4 apifetch smoke'], { type: 'application/pdf' }), 'apifetch_smoke.pdf');
  const up = await step('POST part-number document (FormData)', apiFetch(`/api/part-number-masters/${pnId}/documents`, { method: 'POST', body: fd }));
  const docId = up.body?.id || up.body?.document?.id || (Array.isArray(up.body) ? up.body[0]?.id : null);
  if (docId) await step('DELETE part-number document', apiFetch(`/api/part-number-masters/${pnId}/documents/${docId}`, { method: 'DELETE' }));
  else log.push(`(no document id in upload response: ${JSON.stringify(up.body).slice(0, 120)})`);
  await step('DELETE part-number', apiFetch(`/api/part-number-masters/${pnId}`, { method: 'DELETE' }));
  return log;
});

console.log(result.join('\n'));
console.log(errors.length ? `page errors: ${errors.join(' | ')}` : 'no page errors');
await browser.close();
