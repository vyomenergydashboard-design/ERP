import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function runSecurityTests() {
  console.log('========================================================================');
  console.log('  TEST SUITE: SECURITY HARDENING (FIXES 1, 3, AND 5)                    ');
  console.log('========================================================================\n');

  const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
  const client = await pool.connect();
  let createdVpoId = null;
  let testViewerId = null;
  let testPurchaseId = null;

  try {
    // Ensure viewer and purchase test users exist in DB for authorize() verification
    const vRes = await client.query(`
      INSERT INTO users (username, email, password, role) 
      VALUES ('sec_test_viewer', 'viewer@test.local', 'hash', 'Viewer')
      ON CONFLICT (username) DO UPDATE SET role = 'Viewer'
      RETURNING id
    `);
    testViewerId = vRes.rows[0].id;
    const viewerToken = jwt.sign({ id: testViewerId, username: 'sec_test_viewer', role: 'Viewer' }, JWT_SECRET, { expiresIn: '1h' });

    const pRes = await client.query(`
      INSERT INTO users (username, email, password, role) 
      VALUES ('sec_test_purchase', 'purchase@test.local', 'hash', 'Purchase')
      ON CONFLICT (username) DO UPDATE SET role = 'Purchase'
      RETURNING id
    `);
    testPurchaseId = pRes.rows[0].id;
    const purchaseToken = jwt.sign({ id: testPurchaseId, username: 'sec_test_purchase', role: 'Purchase' }, JWT_SECRET, { expiresIn: '1h' });
    // -------------------------------------------------------------------------
    // TEST 1: Fix 3 - Broken Access Control on Vendor POs (Viewer role blocked)
    // -------------------------------------------------------------------------
    console.log('[TEST 1] Verifying RBAC: Viewer must be rejected on Vendor PO endpoints...');

    // A. Viewer attempts to create a vendor PO
    const viewerPostRes = await fetch(`${API_BASE}/api/purchase-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${viewerToken}`
      },
      body: JSON.stringify({
        category: 'Electrical Components',
        pos: [{ poNumber: 'VPO-TEST-001', date: '2026-11-04' }],
        serials: ['26270001']
      })
    });
    console.log(`Viewer POST /api/purchase-orders status: ${viewerPostRes.status}`);
    assert.strictEqual(
      viewerPostRes.status,
      403,
      `Expected HTTP 403 Forbidden for Viewer on POST /api/purchase-orders, got ${viewerPostRes.status}`
    );
    console.log('✓ Viewer is properly forbidden from creating Vendor Purchase Orders (HTTP 403).');

    // B. Purchase role attempts to create a vendor PO -> must succeed
    const purchasePostRes = await fetch(`${API_BASE}/api/purchase-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${purchaseToken}`
      },
      body: JSON.stringify({
        category: 'Hardware',
        pos: [{ poNumber: 'VPO-SEC-001', date: '2026-11-04' }],
        serials: ['26279999']
      })
    });
    assert.strictEqual(purchasePostRes.status, 201, `Purchase role should succeed with 201, got ${purchasePostRes.status}`);
    const createdVpo = await purchasePostRes.json();
    createdVpoId = createdVpo.order?.id;
    console.log(`✓ Purchase role can create Vendor PO (HTTP 201, ID: ${createdVpoId}).`);

    // C. Viewer attempts to PATCH vendor PO status -> must be forbidden
    const viewerPatchRes = await fetch(`${API_BASE}/api/purchase-orders/${createdVpoId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${viewerToken}`
      },
      body: JSON.stringify({ status: 'PO closed' })
    });
    console.log(`Viewer PATCH status: ${viewerPatchRes.status}`);
    assert.strictEqual(
      viewerPatchRes.status,
      403,
      `Expected HTTP 403 Forbidden for Viewer on PATCH /api/purchase-orders/:id/status, got ${viewerPatchRes.status}`
    );
    console.log('✓ Viewer is properly forbidden from updating Vendor PO status (HTTP 403).');

    // -------------------------------------------------------------------------
    // TEST 2: Fix 5 - Reject Tokens in Query Parameters for API Endpoints
    // -------------------------------------------------------------------------
    console.log('\n[TEST 2] Verifying that API endpoints strictly reject ?token= in query string...');

    // Attempt to access /api/orders using ?token= without Authorization header
    const queryTokenRes = await fetch(`${API_BASE}/api/orders?token=${adminToken}`, {
      method: 'GET'
    });
    console.log(`GET /api/orders?token=... response status: ${queryTokenRes.status}`);
    assert.strictEqual(
      queryTokenRes.status,
      401,
      `API routes must reject tokens passed via query parameters, got ${queryTokenRes.status}`
    );
    console.log('✓ API route correctly rejected ?token= query parameter (HTTP 401).');

    // Verify Authorization: Bearer header still works cleanly
    const headerAuthRes = await fetch(`${API_BASE}/api/orders`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    assert.strictEqual(headerAuthRes.status, 200, `API route with Bearer header must succeed, got ${headerAuthRes.status}`);
    console.log('✓ API route successfully authorized via Authorization: Bearer header (HTTP 200).');

    // -------------------------------------------------------------------------
    // TEST 3: Fix 5 - Short-Lived Scoped Download Tickets for /uploads
    // -------------------------------------------------------------------------
    console.log('\n[TEST 3] Verifying Short-Lived Download Ticket System...');

    // Create a dummy test file in uploads/
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    const testFileName = `sec-test-${Date.now()}.txt`;
    const testFilePath = path.join(uploadsDir, testFileName);
    fs.writeFileSync(testFilePath, 'Security Test File Content', 'utf8');

    // A. Request download ticket via POST /api/documents/ticket
    const ticketRes = await fetch(`${API_BASE}/api/documents/ticket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify({ file: testFileName })
    });
    assert.strictEqual(ticketRes.status, 200, `Generating ticket should return 200, got ${ticketRes.status}`);
    const { ticket } = await ticketRes.json();
    assert(ticket, 'Ticket must be returned');
    console.log('✓ Successfully generated short-lived download ticket.');

    // B. Download using the ticket: /uploads/:fileName?ticket=...
    const downloadRes = await fetch(`${API_BASE}/uploads/${testFileName}?ticket=${ticket}`);
    assert.strictEqual(downloadRes.status, 200, `Download with valid ticket should return 200, got ${downloadRes.status}`);
    const fileBody = await downloadRes.text();
    assert.strictEqual(fileBody, 'Security Test File Content', 'File content must match');
    console.log('✓ Download using valid short-lived ticket succeeded (HTTP 200).');

    // C. Download with invalid/forged ticket -> must be rejected
    const invalidDownloadRes = await fetch(`${API_BASE}/uploads/${testFileName}?ticket=invalid.jwt.ticket`);
    assert.strictEqual(invalidDownloadRes.status, 401, `Invalid ticket must return 401, got ${invalidDownloadRes.status}`);
    console.log('✓ Invalid ticket was properly rejected (HTTP 401).');

    // Cleanup test file
    try { fs.unlinkSync(testFilePath); } catch (_) {}

    // -------------------------------------------------------------------------
    // TEST 4: Fix 1 - Safe Condition Evaluator (Prevent RCE)
    // -------------------------------------------------------------------------
    console.log('\n[TEST 4] Verifying Safe Condition Evaluation (Eliminating new Function RCE)...');
    
    // Dynamically test the safeEvaluateCondition implementation from server/index.js (or test helper)
    // We import index.js or verify via endpoint test
    const { safeEvaluateCondition } = await import('./services/safeConditionEvaluator.js');
    
    // Normal cases
    assert.strictEqual(safeEvaluateCondition("$val === 'Yes'", 'Yes'), true, 'Should match equal string');
    assert.strictEqual(safeEvaluateCondition("$val === 'Yes'", 'No'), false, 'Should not match different string');
    assert.strictEqual(safeEvaluateCondition("$val > 10", 15), true, 'Should evaluate numeric greater-than');
    assert.strictEqual(safeEvaluateCondition("$val <= 5", 10), false, 'Should evaluate numeric less-than-or-equal');
    assert.strictEqual(safeEvaluateCondition("$val", 'anything'), true, 'Should evaluate truthy check');
    assert.strictEqual(safeEvaluateCondition("$val", ''), false, 'Should evaluate empty string as false');

    // Malicious RCE injection attempts
    const rcePayloads = [
      "process.mainModule.require('child_process').execSync('whoami')",
      "global.process.exit(1)",
      "this.constructor.constructor('return process')()",
      "eval('1+1')",
      "Function('return 1')()"
    ];

    for (const payload of rcePayloads) {
      const result = safeEvaluateCondition(payload, 'test');
      assert.strictEqual(result, false, `Malicious payload must be safely rejected: ${payload}`);
    }
    console.log('✓ All malicious code injection payloads safely blocked by evaluator.');
    console.log('✓ Standard business conditions evaluated accurately.');

    console.log('\n========================================================================');
    console.log('  ALL SECURITY HARDENING TESTS PASSED SUCCESSFULLY!                     ');
    console.log('========================================================================\n');
  } catch (err) {
    console.error('\n❌ SECURITY TEST FAILED:', err);
    process.exitCode = 1;
  } finally {
    if (createdVpoId) {
      await client.query('DELETE FROM vendor_purchase_order_units WHERE vendor_purchase_order_id = $1', [createdVpoId]);
      await client.query('DELETE FROM vendor_purchase_orders WHERE id = $1', [createdVpoId]);
    }
    if (testViewerId || testPurchaseId) {
      await client.query('DELETE FROM users WHERE id IN ($1, $2)', [testViewerId || -1, testPurchaseId || -1]);
    }
    client.release();
    await pool.end();
  }
}

runSecurityTests();
