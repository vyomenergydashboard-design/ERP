import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (!condition) {
    console.error(`  ❌ FAILED: ${message}`);
    throw new Error(message);
  }
  passedTests++;
  console.log(`  ✓ PASSED: ${message}`);
}

async function runTestSuite() {
  console.log('====================================================');
  console.log('  TESTING ORDER RECEIVED: STATUS & SUBSTRING SEARCH');
  console.log('====================================================\n');

  let orderId1 = null;
  let orderId2 = null;

  try {
    // 1. Create PO1 against 1128, 1129, 1130
    console.log('[TEST 1] Creating PO1 with serials 1128, 1129, 1130...');
    const createRes1 = await fetch(`${API_BASE}/api/purchase-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        category: 'Panel',
        pos: [{ id: 1, poNumber: 'TEST-PO1-1128', date: '2026-10-15' }],
        serials: [{ serialNumber: '1128' }, { serialNumber: '1129' }, { serialNumber: '1130' }]
      })
    });
    const data1 = await createRes1.json();
    assert(createRes1.status === 201, `PO1 created with HTTP 201 (got ${createRes1.status})`);
    assert(data1.order && data1.order.id, 'PO1 returned with valid database ID');
    orderId1 = data1.order.id;
    assert(data1.order.status === 'Pending', `PO1 initial status is "Pending" (got ${data1.order.status})`);

    // 2. Create PO2 against 1128, 1129, 1131
    console.log('\n[TEST 2] Creating PO2 with serials 1128, 1129, 1131...');
    const createRes2 = await fetch(`${API_BASE}/api/purchase-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        category: 'Automation',
        pos: [{ id: 1, poNumber: 'TEST-PO2-9999', date: '2026-10-15' }],
        serials: [{ serialNumber: '1128' }, { serialNumber: '1129' }, { serialNumber: '1131' }]
      })
    });
    const data2 = await createRes2.json();
    assert(createRes2.status === 201, `PO2 created with HTTP 201 (got ${createRes2.status})`);
    orderId2 = data2.order.id;
    assert(data2.order.status === 'Pending', `PO2 initial status is "Pending" (got ${data2.order.status})`);

    // 3. Substring (partial) search test
    console.log('\n[TEST 3] Testing Substring Search (?search=PO1-112)...');
    const searchRes = await fetch(`${API_BASE}/api/purchase-orders?search=PO1-112`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const searchData = await searchRes.json();
    assert(searchRes.status === 200, 'Search query returned HTTP 200');
    assert(searchData.some(o => o.id === orderId1), 'Search matched PO1 using substring "PO1-112"');
    assert(!searchData.some(o => o.id === orderId2), 'Search did not match PO2 (correct substring isolation)');

    // 4. Update status of PO1 to "PO closed"
    console.log('\n[TEST 4] Updating status of PO1 to "PO closed"...');
    const updateRes = await fetch(`${API_BASE}/api/purchase-orders/${orderId1}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'PO closed',
        dateReceived: '2026-10-15'
      })
    });
    const updateData = await updateRes.json();
    assert(updateRes.status === 200, `Status update returned HTTP 200 (got ${updateRes.status})`);
    assert(updateData.order && updateData.order.status === 'PO closed', 'PO1 status updated to "PO closed"');

    // 5. Verify PO2 status remained "Pending" (Isolation test: change applies ONLY to searched PO)
    console.log('\n[TEST 5] Verifying PO2 status remains "Pending" (PO Isolation)...');
    const getRes2 = await fetch(`${API_BASE}/api/purchase-orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const allOrders = await getRes2.json();
    const po2Fresh = allOrders.find(o => o.id === orderId2);
    assert(po2Fresh && po2Fresh.status === 'Pending', `PO2 status is still "Pending" despite serial overlap with PO1`);

    // 6. Test Status Filter (?status=PO closed)
    console.log('\n[TEST 6] Testing Status Filter (?status=PO closed)...');
    const filterRes = await fetch(`${API_BASE}/api/purchase-orders?status=PO+closed`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const filterData = await filterRes.json();
    assert(filterRes.status === 200, 'Status filter returned HTTP 200');
    assert(filterData.every(o => o.status === 'PO closed'), 'All returned orders have status "PO closed"');
    assert(filterData.some(o => o.id === orderId1), 'Filter includes PO1');
    assert(!filterData.some(o => o.id === orderId2), 'Filter excludes PO2');

    console.log('\n====================================================');
    console.log(`  ALL TESTS PASSED! (${passedTests}/${totalTests})`);
    console.log('====================================================');
  } catch (err) {
    console.error('\nTest execution failed:', err);
    process.exitCode = 1;
  } finally {
    // Cleanup created test records
    if (orderId1 || orderId2) {
      const ids = [orderId1, orderId2].filter(Boolean);
      await pool.query('DELETE FROM vendor_purchase_orders WHERE id = ANY($1)', [ids]);
      console.log(`Cleaned up test purchase orders: ${ids.join(', ')}`);
    }
    await pool.end();
  }
}

runTestSuite();
