import jwt from 'jsonwebtoken';

const API_BASE = 'http://localhost:5000';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

async function runSecurityTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: SECURITY & HARDENING VERIFICATION');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  const assert = (condition, msg) => {
    total++;
    if (condition) {
      console.log(`  ✓ PASSED: ${msg}`);
      passed++;
    } else {
      console.error(`  ✗ FAILED: ${msg}`);
    }
  };

  // 1. Check Security Headers on GET /api/orders
  console.log('[TEST 1] Verifying Security Headers on API response...');
  const resHeaders = await fetch(`${API_BASE}/api/orders`);
  const nosniff = resHeaders.headers.get('x-content-type-options');
  const frameOptions = resHeaders.headers.get('x-frame-options');
  const xssProtection = resHeaders.headers.get('x-xss-protection');
  const referrerPolicy = resHeaders.headers.get('referrer-policy');

  assert(nosniff === 'nosniff', `X-Content-Type-Options is nosniff (got: "${nosniff}")`);
  assert(frameOptions === 'SAMEORIGIN', `X-Frame-Options is SAMEORIGIN (got: "${frameOptions}")`);
  assert(xssProtection === '1; mode=block', `X-XSS-Protection is 1; mode=block (got: "${xssProtection}")`);
  assert(referrerPolicy === 'strict-origin-when-cross-origin', `Referrer-Policy is strict-origin-when-cross-origin (got: "${referrerPolicy}")`);

  // 2. Test File Upload Filter (blocking malicious/script extensions)
  console.log('\n[TEST 2] Testing upload blocking for dangerous extensions (.html, .exe)...');
  const token = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
  assert(!!token, 'Generated valid auth token for admin');

  // Attempt to upload dangerous .html file via multi-part form
  const form = new FormData();
  form.append('entity_type', 'Order');
  form.append('entity_id', '1');
  form.append('doc_type', 'Drawing');
  form.append('files', new Blob(['<script>alert("xss")</script>'], { type: 'text/html' }), 'malicious.html');

  const uploadRes = await fetch(`${API_BASE}/api/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: form
  });

  const uploadJson = await uploadRes.json();
  assert(uploadRes.status === 400 || uploadRes.status === 500, `Blocked dangerous .html upload with status ${uploadRes.status}`);
  assert(uploadJson.error && uploadJson.error.includes('not permitted for security reasons'), `Security error message returned: "${uploadJson.error}"`);

  // Also test .exe extension
  const formExe = new FormData();
  formExe.append('entity_type', 'Order');
  formExe.append('entity_id', '1');
  formExe.append('doc_type', 'Drawing');
  formExe.append('files', new Blob(['binary payload'], { type: 'application/octet-stream' }), 'malicious.exe');

  const uploadExeRes = await fetch(`${API_BASE}/api/documents/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formExe
  });

  const uploadExeJson = await uploadExeRes.json();
  assert(uploadExeRes.status === 400 || uploadExeRes.status === 500, `Blocked dangerous .exe upload with status ${uploadExeRes.status}`);
  assert(uploadExeJson.error && uploadExeJson.error.includes('not permitted for security reasons'), `Security error message returned for .exe: "${uploadExeJson.error}"`);

  // 3. Test Rate Limiting on /api/auth/login
  console.log('\n[TEST 3] Testing brute-force rate limiter on /api/auth/login...');
  let hitRateLimit = false;
  let status429Count = 0;
  for (let i = 1; i <= 20; i++) {
    const attempt = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'fakeuser_' + i, password: 'wrongpassword' })
    });
    if (attempt.status === 429) {
      hitRateLimit = true;
      status429Count++;
    }
  }
  assert(hitRateLimit, `Brute-force attempts triggered HTTP 429 Too Many Requests (caught ${status429Count} 429s)`);

  console.log('\n====================================================');
  console.log(`  SECURITY TEST RESULTS: ${passed} / ${total} PASSED`);
  console.log('====================================================\n');
}

runSecurityTests().catch(console.error);
