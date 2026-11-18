import pg from 'pg';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import os from 'os';
import path from 'path';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';

const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });
const salesToken = jwt.sign({ id: 27, username: 'sales', role: 'Sales' }, JWT_SECRET, { expiresIn: '1h' });
const designToken = jwt.sign({ id: 31, username: 'design', role: 'Design' }, JWT_SECRET, { expiresIn: '1h' });

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
  console.log('  TEST SUITE: DESIGN CONFIRMATION & AUTO RELEASE');
  console.log('====================================================\n');

  let testOrderId = null;
  let testUnitId = null;

  try {
    // 0. Setup dummy files for drawing & BOM
    const dummyDrawingPath = path.join(os.tmpdir(), 'test_drawing.pdf');
    fs.writeFileSync(dummyDrawingPath, '%PDF-1.4 sample drawing content');

    const dummyBomPath = path.join(os.tmpdir(), 'test_bom.xlsx');
    fs.writeFileSync(dummyBomPath, 'PK dummy excel content');

    // 1. Create a test order and unit directly via SQL
    console.log('[TEST 1] Setting up test order and Non-Standard unit...');
    const locRes = await pool.query('SELECT id FROM company_locations LIMIT 1');
    const locId = locRes.rows[0]?.id || 1;

    const ordRes = await pool.query(`
      INSERT INTO orders (order_number, company_location_id, priority, created_by, status)
      VALUES ('TEST-DESIGN-8888', $1, 'High', 1, 'Active')
      RETURNING id
    `, [locId]);
    testOrderId = ordRes.rows[0].id;
    assert(testOrderId, `Created test order #${testOrderId}`);

    const liRes = await pool.query(`
      INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price)
      VALUES ($1, 'TEST-DESIGN-8888-01', 'Test Non-Standard Panel', 1, 'Nos', 10000, 10000)
      RETURNING id
    `, [testOrderId]);
    const lineItemId = liRes.rows[0].id;

    const uRes = await pool.query(`
      INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, classification, design_confirmed, current_dept)
      VALUES ($1, $2, '88880001', '0001', 'Non-Standard', FALSE, 'Design')
      RETURNING id, unit_id, classification, design_confirmed
    `, [testOrderId, lineItemId]);
    testUnitId = uRes.rows[0].id;
    assert(testUnitId, `Created test unit #${testUnitId}`);

    // Attach PO to Order so unit is validly in Design (Sales cleared)
    await pool.query(`
      INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
      VALUES ('Order', $1, 'PO', 'test_po.pdf', 'uploads/test_po.pdf', 1)
    `, [testOrderId]);
    await pool.query(`
      INSERT INTO order_steps (order_id, dept, name, status, step_order)
      VALUES ($1, 'Sales', 'Upload PO', 'done', 0)
    `, [testOrderId]);

    // Insert steps: Review & Classify (1), Release Documents (2), Receive Shortfall (3)
    await pool.query(`
      INSERT INTO unit_steps (order_unit_id, name, dept, status, step_order)
      VALUES 
        ($1, 'Review & Classify', 'Design', 'pending', 1),
        ($1, 'Release Documents', 'Design', 'pending', 2),
        ($1, 'Receive Shortfall', 'Purchase', 'pending', 3)
    `, [testUnitId]);

    // Check initial worklist state
    console.log('[TEST 2] Verifying Initial State in Worklist...');
    const wlRes1 = await fetch(`${API_BASE}/api/dept-worklist/Design`, {
      headers: { 'Authorization': `Bearer ${designToken}` }
    });
    if (wlRes1.status !== 200) {
      console.error('Worklist failed with status:', wlRes1.status, await wlRes1.text());
    }
    assert(wlRes1.status === 200, `Dept worklist returned 200`);
    const wlUnits1 = await wlRes1.json();
    const testUnitWl1 = wlUnits1.find(u => u.unit_id === testUnitId || u.id === testUnitId);
    assert(testUnitWl1 !== undefined, 'Found test unit in Design worklist');
    console.log('    debug design_confirmed:', testUnitWl1.design_confirmed, typeof testUnitWl1.design_confirmed);
    assert(Boolean(testUnitWl1.design_confirmed) === false, 'Unit design_confirmed is initially false');

    const step1_init = (testUnitWl1.dept_steps || []).find(s => s.name === 'Review & Classify');
    const step2_init = (testUnitWl1.dept_steps || []).find(s => s.name === 'Release Documents');
    assert(step1_init && step1_init.status !== 'done', 'Step 1 ("Review & Classify") is not done');
    assert(step2_init && step2_init.status === 'pending', 'Step 2 ("Release Documents") is pending (no docs)');

    // 2. Test RBAC: Sales role cannot confirm Design
    console.log('[TEST 3] Testing RBAC on Design Confirmation...');
    const salesConfirmRes = await fetch(`${API_BASE}/api/units/${testUnitId}/design-confirm`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${salesToken}` }
    });
    assert(salesConfirmRes.status === 403, `Sales role blocked with HTTP 403 (got ${salesConfirmRes.status})`);

    // 3. Design confirms the panel without docs
    console.log('[TEST 4] Design confirms the panel without docs (must stay in Design)...');
    const designConfirmRes = await fetch(`${API_BASE}/api/units/${testUnitId}/design-confirm`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${designToken}` }
    });
    assert(designConfirmRes.status === 200, `Design confirmation succeeded with HTTP 200`);
    const confirmBody = await designConfirmRes.json();
    assert(confirmBody.unit && confirmBody.unit.design_confirmed === true, 'Response confirms design_confirmed is true');

    // Verify in DB / worklist: Step 1 is done, Step 2 is inprogress, Unit REMAINS in Design
    const wlRes2 = await fetch(`${API_BASE}/api/dept-worklist/Design`, {
      headers: { 'Authorization': `Bearer ${designToken}` }
    });
    const wlUnits2 = await wlRes2.json();
    const testUnitWl2 = wlUnits2.find(u => u.unit_id === testUnitId || u.id === testUnitId);
    const step1_conf = (testUnitWl2.dept_steps || []).find(s => s.name === 'Review & Classify');
    const step2_conf = (testUnitWl2.dept_steps || []).find(s => s.name === 'Release Documents');
    assert(step1_conf.status === 'done', 'Step 1 ("Review & Classify") is auto marked DONE');
    assert(step2_conf.status === 'inprogress', 'Step 2 ("Release Documents") is inprogress because docs are missing');
    assert(testUnitWl2.current_dept === 'Design', `Unit remains in Design without both docs (got "${testUnitWl2.current_dept}")`);

    // 4. Upload 1 document (Drawing only)
    console.log('[TEST 5] Uploading Drawing only (1 doc) - must still remain in Design...');
    const drawForm = new FormData();
    drawForm.append('entity_type', 'Unit');
    drawForm.append('entity_id', String(testUnitId));
    drawForm.append('doc_type', 'Drawing');
    drawForm.append('files', new Blob([fs.readFileSync(dummyDrawingPath)], { type: 'application/pdf' }), 'unit_drawing.pdf');

    const upDrawRes = await fetch(`${API_BASE}/api/documents/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${designToken}` },
      body: drawForm
    });
    assert(upDrawRes.status === 200 || upDrawRes.status === 201, `Drawing upload returned 200/201 (got ${upDrawRes.status})`);

    const wlRes3 = await fetch(`${API_BASE}/api/dept-worklist/Design`, {
      headers: { 'Authorization': `Bearer ${designToken}` }
    });
    const wlUnits3 = await wlRes3.json();
    const testUnitWl3 = wlUnits3.find(u => u.unit_id === testUnitId || u.id === testUnitId);
    assert(testUnitWl3.current_dept === 'Design', 'Unit still remains in Design when only Drawing is present (BOM missing)');
    const step2_draw = (testUnitWl3.dept_steps || []).find(s => s.name === 'Release Documents');
    assert(step2_draw && step2_draw.status === 'inprogress', 'Step 2 remains inprogress (BOM pending)');
    assert(step2_draw.notes.includes('awaiting BOM') || step2_draw.notes.includes('BOM pending'), `Step 2 notes state BOM is pending (got "${step2_draw.notes}")`);

    // 5. Upload second document (BOM)
    console.log('[TEST 6] Uploading BOM (both docs now present) - must now advance to Purchase...');
    const bomForm = new FormData();
    bomForm.append('entity_type', 'Unit');
    bomForm.append('entity_id', String(testUnitId));
    bomForm.append('doc_type', 'BOM');
    bomForm.append('files', new Blob([fs.readFileSync(dummyBomPath)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), 'unit_bom.xlsx');

    const upBomRes = await fetch(`${API_BASE}/api/documents/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${designToken}` },
      body: bomForm
    });
    assert(upBomRes.status === 200 || upBomRes.status === 201, `BOM upload returned 200/201 (got ${upBomRes.status})`);

    // Because both docs exist AND panel is confirmed, Step 2 must be auto DONE and unit moves to Purchase!
    const stepsAfterBoth = await pool.query('SELECT name, status, notes FROM unit_steps WHERE order_unit_id = $1', [testUnitId]);
    const uStateBoth = await pool.query('SELECT current_dept FROM order_units WHERE id = $1', [testUnitId]);
    const step2_both = stepsAfterBoth.rows.find(s => s.name === 'Release Documents');
    assert(step2_both && step2_both.status === 'done', 'Step 2 is auto DONE when both docs are attached and Design confirmed!');
    assert(step2_both.notes.includes('released by Design'), `Step 2 notes confirm release by Design (got "${step2_both.notes}")`);
    assert(uStateBoth.rows[0].current_dept === 'Purchase', `Unit advances to Purchase now that both Drawing and BOM are present (got "${uStateBoth.rows[0].current_dept}")`);

    // 6. Test Un-confirming
    console.log('[TEST 7] Un-confirming Design classification...');
    const unconfirmRes = await fetch(`${API_BASE}/api/units/${testUnitId}/design-unconfirm`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${designToken}` }
    });
    assert(unconfirmRes.status === 200, `Unconfirm returned 200`);

    const stepsAfterUnconf = await pool.query('SELECT name, status, notes FROM unit_steps WHERE order_unit_id = $1', [testUnitId]);
    const uAfterUnconf = await pool.query('SELECT current_dept, design_confirmed FROM order_units WHERE id = $1', [testUnitId]);
    const step1_unconf = stepsAfterUnconf.rows.find(s => s.name === 'Review & Classify');
    const step2_unconf = stepsAfterUnconf.rows.find(s => s.name === 'Release Documents');
    assert(uAfterUnconf.rows[0].design_confirmed === false, 'Unit design_confirmed is false after unconfirm');
    assert(uAfterUnconf.rows[0].current_dept === 'Design', 'Unit returns to Design when unconfirmed');
    assert(step1_unconf.status === 'pending' || step1_unconf.status === 'inprogress', `Step 1 reverted from done (status: ${step1_unconf.status})`);
    assert(step2_unconf.status === 'inprogress', `Step 2 reverted from done to inprogress (status: ${step2_unconf.status})`);
    assert(step2_unconf.notes.includes('pending Design confirmation'), `Step 2 notes show awaiting Design confirmation (got "${step2_unconf.notes}")`);

    console.log('\n[CLEANUP] Cleaning up test data...');
    await pool.query('DELETE FROM documents WHERE entity_type = $1 AND entity_id = $2', ['Unit', testUnitId]);
    await pool.query('DELETE FROM unit_steps WHERE order_unit_id = $1', [testUnitId]);
    await pool.query('DELETE FROM order_units WHERE id = $1', [testUnitId]);
    await pool.query('DELETE FROM order_line_items WHERE id = $1', [lineItemId]);
    await pool.query('DELETE FROM orders WHERE id = $1', [testOrderId]);
    console.log(`  ✓ Test order #${testOrderId} and related test entities cleaned up.`);

  } catch (err) {
    console.error('Test error:', err);
    if (testUnitId) {
      await pool.query('DELETE FROM documents WHERE entity_type = $1 AND entity_id = $2', ['Unit', testUnitId]).catch(() => {});
      await pool.query('DELETE FROM unit_steps WHERE order_unit_id = $1', [testUnitId]).catch(() => {});
      await pool.query('DELETE FROM order_units WHERE id = $1', [testUnitId]).catch(() => {});
    }
    if (testOrderId) {
      await pool.query('DELETE FROM orders WHERE id = $1', [testOrderId]).catch(() => {});
    }
  } finally {
    pool.end();
  }

  console.log('====================================================');
  console.log(`  TEST RESULTS: ${passedTests} / ${totalTests} PASSED`);
  console.log('====================================================\n');

  if (passedTests !== totalTests || totalTests === 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite();
