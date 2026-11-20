// Deleting a part-number document removes its uploaded file, unless another row still uses it.
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db' });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const UPLOADS = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'uploads');

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
const H = { Authorization: `Bearer ${adminToken}` };
const BASE = `${API_BASE}/api/part-number-masters`;

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: PART-NUMBER DOCUMENT DELETE REMOVES FILE');
  console.log('====================================================\n');

  let partId = null;
  const leftovers = [];
  try {
    const part = await (await fetch(BASE, {
      method: 'POST', headers: { ...H, 'Content-Type': 'application/json' },
      body: JSON.stringify({ part_number: `TEST-PN-FILEDEL-${Date.now()}`, client_name: 't', project: 't', description: 't' })
    })).json();
    partId = part.id;
    assert.ok(partId, 'test part number should be created');

    const upload = async (name) => {
      const form = new FormData();
      form.append('doc_type', 'Drawing');
      form.append('file', new Blob([`%PDF-1.4 ${name}`], { type: 'application/pdf' }), `${name}.pdf`);
      const res = await fetch(`${BASE}/${partId}/documents`, { method: 'POST', headers: H, body: form });
      assert.strictEqual(res.status, 200, `upload ${name} should succeed`);
    };
    await upload('filedel_a');
    await upload('filedel_b');

    const docs = (await pool.query(
      'SELECT id, file_path FROM part_number_documents WHERE part_number_id = $1 ORDER BY id', [partId]
    )).rows;
    assert.strictEqual(docs.length, 2);
    docs.forEach(d => leftovers.push(path.join(UPLOADS, d.file_path)));
    const exists = (d) => fs.existsSync(path.join(UPLOADS, d.file_path));
    docs.forEach(d => assert.ok(exists(d), 'uploaded file should be on disk'));

    const del = async (id) => (await fetch(`${BASE}/${partId}/documents/${id}`, { method: 'DELETE', headers: H })).status;

    // Plain delete: the file goes with the row.
    assert.strictEqual(await del(docs[1].id), 200);
    assert.ok(!exists(docs[1]), 'the file should be removed with its document row');
    console.log('✓ deleting a document removes its file');

    // Shared file: another row still points at it, so it must stay until the last one goes.
    const sharedPath = docs[0].file_path;
    const second = (await pool.query(
      `INSERT INTO part_number_documents (part_number_id, file_name, file_path, file_type, doc_type, revision_number, revision_label, is_current)
       VALUES ($1, 'shared.pdf', $2, 'application/pdf', 'Drawing', 9, 'R9', false) RETURNING id`,
      [partId, sharedPath]
    )).rows[0].id;
    assert.strictEqual(await del(docs[0].id), 200);
    assert.ok(exists(docs[0]), 'the file must stay while another row still uses it');
    assert.strictEqual(await del(second), 200);
    assert.ok(!exists(docs[0]), 'the file should go with the last row that used it');
    console.log('✓ a file shared with another row is kept until the last row is deleted');

    // A document whose file is already gone still deletes cleanly.
    await upload('filedel_c');
    const c = (await pool.query(
      'SELECT id, file_path FROM part_number_documents WHERE part_number_id = $1', [partId]
    )).rows[0];
    leftovers.push(path.join(UPLOADS, c.file_path));
    fs.unlinkSync(path.join(UPLOADS, c.file_path));
    assert.strictEqual(await del(c.id), 200, 'deleting a row whose file is missing should still succeed');
    console.log('✓ a missing file does not break the delete');

    console.log('\n====================================================');
    console.log('  ALL PART-NUMBER FILE DELETE TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    if (partId) await fetch(`${BASE}/${partId}`, { method: 'DELETE', headers: H }).catch(() => {});
    if (partId) await pool.query('DELETE FROM part_number_documents WHERE part_number_id = $1', [partId]);
    for (const f of leftovers) { try { fs.unlinkSync(f); } catch (_) { /* already gone */ } }
    await pool.query("DELETE FROM activity_logs WHERE action_text LIKE '%TEST-PN-FILEDEL-%'");
    await pool.end();
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
