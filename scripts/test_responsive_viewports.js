import http from 'http';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const VIEWPORT_TESTS = [
  { name: '1920px (Desktop Full HD)', width: 1920, height: 1080 },
  { name: '1366px (Standard Laptop)', width: 1366, height: 768 },
  { name: '1024px (Tablet Landscape / Split-Screen)', width: 1024, height: 768 },
  { name: '820px (Medium Tablet)', width: 820, height: 1180 },
  { name: '768px (Tablet Portrait / Mobile Drawer)', width: 768, height: 1024 }
];

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const USER_DATA_DIR = path.resolve('scratch/edge_profile_test');
const SCREENSHOT_DIR = path.resolve('scratch/screenshots');
const DEBUG_PORT = 9225;

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CdpConnection {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.callbacks = new Map();
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.ws = new globalThis.WebSocket(this.wsUrl);
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
      this.ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && this.callbacks.has(msg.id)) {
          const cb = this.callbacks.get(msg.id);
          this.callbacks.delete(msg.id);
          if (msg.error) cb.reject(msg.error);
          else cb.resolve(msg.result);
        }
      };
    });
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function run() {
  console.log('--- Starting Responsive Viewport Verification Suite ---');

  // Spawn Edge headless
  const edgeProc = spawn(EDGE_PATH, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${USER_DATA_DIR}`,
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    'about:blank'
  ], { detached: false });

  await sleep(2500);

  try {
    const list = await fetchJson(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
    const pageTarget = list.find(t => t.type === 'page') || list[0];
    if (!pageTarget) throw new Error('No page target found');

    const cdp = new CdpConnection(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();

    await cdp.send('Page.enable');
    await cdp.send('DOM.enable');

    // Generate valid signed JWT for real session
    const jwt = (await import('../server/node_modules/jsonwebtoken/index.js')).default;
    const realToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, process.env.JWT_SECRET || 'supersecret', { expiresIn: '12h' });

    // Set script to run on every new document to point API_BASE to 5000 and ensure auth
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `
        window.API_BASE = 'http://127.0.0.1:5000';
        localStorage.setItem('token', ${JSON.stringify(realToken)});
        localStorage.setItem('user', JSON.stringify({ id: 1, username: 'admin', role: 'Admin' }));
        localStorage.setItem('userRole', 'Admin');
        localStorage.setItem('erp_theme', 'dark');
        localStorage.setItem('erp_show_table_stats', 'true');
        localStorage.setItem('erp_selectedOrderId', '');
      `
    });

    console.log('Navigating to http://127.0.0.1:5173/dashboard ...');
    await cdp.send('Page.navigate', { url: 'http://127.0.0.1:5173/dashboard' });
    await sleep(4000);

    const results = [];

    for (const test of VIEWPORT_TESTS) {
      console.log(`\nTesting viewport: ${test.name} (${test.width}x${test.height})...`);

      // Set viewport
      await cdp.send('Emulation.setDeviceMetricsOverride', {
        width: test.width,
        height: test.height,
        deviceScaleFactor: 1,
        mobile: test.width <= 768
      });
      await sleep(1000);

      // Measure layout metrics
      const evalRes = await cdp.send('Runtime.evaluate', {
        expression: `(() => {
          const winW = window.innerWidth;
          const winH = window.innerHeight;
          const docScrollW = document.documentElement.scrollWidth;
          const bodyScrollW = document.body.scrollWidth;
          const appW = document.querySelector('.app')?.offsetWidth || 0;
          const appScrollW = document.querySelector('.app')?.scrollWidth || 0;
          const mainW = document.querySelector('.main')?.offsetWidth || 0;
          const mainScrollW = document.querySelector('.main')?.scrollWidth || 0;
          const sidenavW = document.querySelector('.sidenav')?.offsetWidth || 0;
          const sidenavCollapsed = document.querySelector('.sidenav')?.classList.contains('sidenav--collapsed');
          const tableScrollContainer = document.querySelector('.table-responsive-scroll');
          const tableScrollW = tableScrollContainer?.scrollWidth || 0;
          const tableClientW = tableScrollContainer?.clientWidth || 0;
          
          return {
            winW,
            winH,
            docScrollW,
            bodyScrollW,
            hasRootHorizontalOverflow: docScrollW > winW,
            appW,
            appScrollW,
            mainW,
            mainScrollW,
            sidenavW,
            sidenavCollapsed,
            tableScrollW,
            tableClientW,
            tableIsScrollable: tableScrollW > tableClientW
          };
        })()`,
        returnByValue: true
      });

      const metrics = evalRes.result.value;

      // Capture screenshot
      const shotRes = await cdp.send('Page.captureScreenshot', { format: 'png' });
      const shotFile = path.join(SCREENSHOT_DIR, `viewport_${test.width}.png`);
      fs.writeFileSync(shotFile, Buffer.from(shotRes.data, 'base64'));

      const passed = !metrics.hasRootHorizontalOverflow;
      results.push({
        ...test,
        ...metrics,
        screenshot: shotFile,
        passed
      });

      console.log(`  Window Width: ${metrics.winW}px | Document Scroll Width: ${metrics.docScrollW}px`);
      console.log(`  Root Horizontal Overflow: ${metrics.hasRootHorizontalOverflow ? 'FAIL (Overflow detected)' : 'PASS (No overflow)'}`);
      console.log(`  Sidenav Width: ${metrics.sidenavW}px (Collapsed: ${metrics.sidenavCollapsed})`);
      console.log(`  Table Container: Client=${metrics.tableClientW}px, Scroll=${metrics.tableScrollW}px (Scrollable: ${metrics.tableIsScrollable})`);
      console.log(`  Screenshot saved: ${shotFile}`);
    }

    cdp.close();

    console.log('\n=== Summary of Results ===');
    let allPassed = true;
    for (const r of results) {
      const status = r.passed ? 'PASS' : 'FAIL';
      if (!r.passed) allPassed = false;
      console.log(`- [${status}] ${r.name}: docScrollW=${r.docScrollW}px vs winW=${r.winW}px`);
    }

    if (allPassed) {
      console.log('\nALL 5 VIEWPORTS PASSED VERIFICATION WITH ZERO ROOT OVERFLOW!');
    } else {
      console.log('\nSOME VIEWPORTS EXPERIENCED OVERFLOW.');
    }

  } finally {
    edgeProc.kill();
  }
}

run().catch(err => {
  console.error('Error running viewport tests:', err);
  process.exit(1);
});
