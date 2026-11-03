import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: QC MULTI-SELECT & BATCH UPDATE        ');
  console.log('====================================================\n');

  try {
    // 1. Select 3 real units from order_units
    const unitsRes = await pool.query(
      'SELECT id, unit_id, short_serial, order_id FROM order_units ORDER BY id ASC LIMIT 3'
    );
    assert(unitsRes.rows.length >= 3, 'Expected at least 3 order_units for batch test');
    const testUnits = unitsRes.rows;
    const testIds = testUnits.map(u => u.id);
    console.log(`[TEST SETUP] Selected 3 test units: IDs ${testIds.join(', ')}`);

    // 2. Auth user for QC
    async function getOrCreateTestUser(role, username) {
      const existing = await pool.query('SELECT id, username, role FROM users WHERE username = $1', [username]);
      if (existing.rows.length > 0) {
        if (existing.rows[0].role !== role) {
          await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, existing.rows[0].id]);
        }
        return existing.rows[0];
      }
      const created = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, role',
        [username, `${username}@test.com`, 'testhash', role]
      );
      return created.rows[0];
    }

    const qcUser = await getOrCreateTestUser('QC', 'test_qc_batch_user');
    const qcToken = jwt.sign(
      { id: qcUser.id, username: qcUser.username, role: 'QC' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 3. Test Batch Update of QC Receiving Date across all 3 units
    console.log('\n[TEST 1] Batch updating qc_receiving_date on all 3 selected units...');
    const testDateIso = '2026-11-03T10:30:00.000Z';

    const updatePromises = testIds.map(id => {
      return fetch(`${API_BASE}/api/units/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${qcToken}`
        },
        body: JSON.stringify({ qc_receiving_date: testDateIso })
      });
    });

    const responses = await Promise.all(updatePromises);
    for (const res of responses) {
      assert.strictEqual(res.status, 200, `Expected HTTP 200, got ${res.status}`);
    }
    console.log('✓ All 3 units responded with HTTP 200 OK.');

    const dbCheck1 = await pool.query(
      'SELECT id, qc_receiving_date FROM order_units WHERE id = ANY($1)',
      [testIds]
    );
    assert.strictEqual(dbCheck1.rows.length, 3);
    for (const row of dbCheck1.rows) {
      assert.strictEqual(new Date(row.qc_receiving_date).toISOString(), testDateIso);
    }
    console.log('✓ All 3 units have the EXACT identical qc_receiving_date timestamp.');

    // 4. Test Batch Update of QC Status to "FAT Completed"
    console.log('\n[TEST 2] Batch updating qc_status to "FAT Completed" on all 3 selected units...');
    const statusPromises = testIds.map(id => {
      return fetch(`${API_BASE}/api/units/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${qcToken}`
        },
        body: JSON.stringify({ qc_status: 'FAT Completed' })
      });
    });

    const statusResponses = await Promise.all(statusPromises);
    for (const res of statusResponses) {
      assert.strictEqual(res.status, 200, `Expected HTTP 200, got ${res.status}`);
    }

    const dbCheck2 = await pool.query(
      'SELECT id, qc_status FROM order_units WHERE id = ANY($1)',
      [testIds]
    );
    assert.strictEqual(dbCheck2.rows.length, 3);
    for (const row of dbCheck2.rows) {
      assert.strictEqual(row.qc_status, 'FAT Completed');
    }
    console.log('✓ All 3 units updated to "FAT Completed" successfully.');

    // 5. Test Batch Update of QC Complete Date & Status to "Handover to packing"
    console.log('\n[TEST 3] Batch updating qc_complete_date and qc_status to "Handover to packing"...');
    const completeDateIso = '2026-11-03T16:00:00.000Z';
    const finalPromises = testIds.map(id => {
      return fetch(`${API_BASE}/api/units/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${qcToken}`
        },
        body: JSON.stringify({
          qc_complete_date: completeDateIso,
          qc_status: 'Handover to packing'
        })
      });
    });

    const finalResponses = await Promise.all(finalPromises);
    for (const res of finalResponses) {
      assert.strictEqual(res.status, 200);
    }

    const dbCheck3 = await pool.query(
      'SELECT id, qc_complete_date, qc_status FROM order_units WHERE id = ANY($1)',
      [testIds]
    );
    for (const row of dbCheck3.rows) {
      assert.strictEqual(new Date(row.qc_complete_date).toISOString(), completeDateIso);
      assert.strictEqual(row.qc_status, 'Handover to packing');
    }
    console.log('✓ All 3 units updated with complete date and "Handover to packing".');

    console.log('\n====================================================');
    console.log('  ALL QC MULTI-SELECT & BATCH UPDATE TESTS PASSED!  ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test failed with error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runTests();

