// GET /api/units/:unitId/prd03 - the data behind the PRD-03 "Panel Production Plan" form.
// Read-only endpoint; later tasks append BOM/Drawing and Purchase assertions to this file.
import assert from 'assert';
import pg from 'pg';
import jwt from 'jsonwebtoken';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db' });
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const adminToken = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

const ROW_KEYS = ['bom', 'drawing', 'cabinet', 'automation', 'low_voltage', 'wires', 'mounting', 'wiring', 'internal_inspection', 'fat'];
const createdOrderIds = [];
let seedCounter = 0;

/**
 * Inserts an order, one line item and one unit. Returns { orderId, unitDbId, serial }.
 * opts: projectName, partNumber, description, packaging, classification (default 'Non-Standard'),
 * dispatchDate, mountingStart/End, wiringStart/End, qcStart/End, customFields (object),
 * createdBy (users.id of the order's creator; default 1, pass null for none).
 */
async function seedUnit(opts = {}) {
  const ts = `${Date.now()}${seedCounter++}`;
  const locId = (await pool.query('SELECT id FROM company_locations LIMIT 1')).rows[0]?.id || 1;
  const orderId = (await pool.query(
    `INSERT INTO orders (order_number, company_location_id, priority, created_by, packaging_type)
     VALUES ($1, $2, 'Medium', $4, $3) RETURNING id`,
    [`TEST-PRD03-${ts}`, locId, opts.packaging ?? null, 'createdBy' in opts ? opts.createdBy : 1]
  )).rows[0].id;
  createdOrderIds.push(orderId);
  const lineId = (await pool.query(
    `INSERT INTO order_line_items (order_id, line_item_number, material_description, quantity, unit, unit_price, total_price, project_name, part_number)
     VALUES ($1, $2, $3, 1, 'Nos', 1, 1, $4, $5) RETURNING id`,
    [orderId, `TEST-PRD03-${ts}-01`, opts.description ?? 'Test panel', opts.projectName ?? null, opts.partNumber ?? null]
  )).rows[0].id;
  const serial = `TEST-PRD03-${ts}-U1`;
  const unitDbId = (await pool.query(
    `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, current_dept, status, classification,
                              dispatch_date, mounting_start_date, mounting_complete_date,
                              wiring_start_date, wiring_complete_date, qc_start_date, qc_complete_date, custom_fields)
     VALUES ($1, $2, $3, $3, 'Sales', 'Pending', $4, $5, $6, $7, $8, $9, $10, $11, COALESCE($12::jsonb, '{}'::jsonb)) RETURNING id`,
    [
      orderId, lineId, serial, opts.classification ?? 'Non-Standard', opts.dispatchDate ?? null,
      opts.mountingStart ?? null, opts.mountingEnd ?? null, opts.wiringStart ?? null, opts.wiringEnd ?? null,
      opts.qcStart ?? null, opts.qcEnd ?? null, opts.customFields ? JSON.stringify(opts.customFields) : null,
    ]
  )).rows[0].id;
  return { orderId, unitDbId, serial };
}

async function addUnitDoc(unitDbId, docType, fileName, uploadedAt) {
  await pool.query(
    `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_at)
     VALUES ('Unit', $1, $2, $3, $4, $5)`,
    [unitDbId, docType, fileName, `uploads/TEST-PRD03-${fileName}`, uploadedAt]
  );
}

async function addMasterDoc(partNumberId, docType, fileName, revision, isCurrent) {
  await pool.query(
    `INSERT INTO part_number_documents (part_number_id, doc_type, revision_number, revision_label, file_name, file_path, is_current)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [partNumberId, docType, revision, `R${revision}`, fileName, `uploads/TEST-PRD03-${fileName}`, isCurrent]
  );
}

/** Inserts a vendor purchase order for `category` linked to one unit serial (full serial, exact match). */
async function addVendorOrder(category, serial, { status = 'Pending', pos = [], createdAt = null, receivedAt = null, orderUid = null } = {}) {
  const id = (await pool.query(
    `INSERT INTO vendor_purchase_orders (order_uid, category, pos, status, created_at, received_at)
     VALUES ($1, $2, $3::jsonb, $4, COALESCE($5::timestamptz, NOW()), $6::timestamptz) RETURNING id`,
    [orderUid ?? `TEST-PRD03-VPO-${Date.now()}-${seedCounter++}`, category, JSON.stringify(pos), status, createdAt, receivedAt]
  )).rows[0].id;
  await pool.query(
    'INSERT INTO vendor_purchase_order_units (vendor_purchase_order_id, unit_serial) VALUES ($1, $2)',
    [id, serial]
  );
}

async function cleanup() {
  // Match by the TEST-PRD03- prefix (not only this run's ids) so rows left by a killed run are removed too.
  await pool.query(
    `DELETE FROM documents WHERE entity_type = 'Unit'
       AND entity_id IN (SELECT ou.id FROM order_units ou JOIN orders o ON o.id = ou.order_id
                         WHERE o.order_number LIKE 'TEST-PRD03-%')`
  );
  await pool.query(`DELETE FROM vendor_purchase_orders WHERE order_uid LIKE 'TEST-PRD03-%'`);
  await pool.query(`DELETE FROM orders WHERE order_number LIKE 'TEST-PRD03-%'`);
  await pool.query(`DELETE FROM part_number_masters WHERE part_number LIKE 'TEST-PRD03-%'`);
}

const getSheet = (unitId, token = adminToken) =>
  fetch(`${API_BASE}/api/units/${unitId}/prd03`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
const row = (sheet, key) => sheet.rows.find(r => r.key === key);
const sameInstant = (actual, expected) => Date.parse(actual) === Date.parse(expected);

async function runTests() {
  console.log('====================================================');
  console.log('  TEST SUITE: PRD-03 FORM DATA');
  console.log('====================================================\n');

  try {
    await cleanup(); // stale TEST-PRD03 rows from a killed earlier run must not break inserts
    assert.strictEqual((await getSheet(1, null)).status, 401, 'no token must be rejected');
    console.log('✓ unauthenticated request -> 401');

    assert.strictEqual((await getSheet('abc')).status, 400, 'non-numeric id is a bad request');
    assert.strictEqual((await getSheet(999999999)).status, 404, 'unknown unit is not found');
    const huge = await getSheet('99999999999');
    assert.ok([400, 404].includes(huge.status), `an id above int4 max must be 400/404, got ${huge.status}`);
    console.log('✓ non-numeric id -> 400, unknown id -> 404, id above int4 max -> 404/400');

    // Header fields and the Production / QC rows
    const full = await seedUnit({
      projectName: 'TEST Proj', packaging: 'Wooden Packaging', dispatchDate: '2026-06-15',
      mountingStart: '2026-05-01T09:00:00Z', mountingEnd: '2026-05-03T09:00:00Z',
      wiringStart: '2026-05-04T09:00:00Z', wiringEnd: '2026-05-06T09:00:00Z',
      qcStart: '2026-05-07T09:00:00Z', qcEnd: '2026-05-08T09:00:00Z',
    });
    const res = await getSheet(full.unitDbId);
    assert.strictEqual(res.status, 200);
    const sheet = await res.json();
    assert.strictEqual(sheet.projectName, 'TEST Proj');
    const creator = (await pool.query('SELECT username FROM users WHERE id = 1')).rows[0].username;
    assert.strictEqual(sheet.salesPerson, creator, 'Sales person is the username of the user who created the order');
    assert.strictEqual(sheet.instructionForDispatch, 'Wooden Packaging');
    assert.strictEqual(sheet.dateOfCompletion, '2026-06-15');
    assert.deepStrictEqual(sheet.rows.map(r => r.key), ROW_KEYS);
    assert.ok(sameInstant(row(sheet, 'mounting').start, '2026-05-01T09:00:00Z'));
    assert.ok(sameInstant(row(sheet, 'mounting').end, '2026-05-03T09:00:00Z'));
    assert.ok(sameInstant(row(sheet, 'wiring').start, '2026-05-04T09:00:00Z'));
    assert.ok(sameInstant(row(sheet, 'wiring').end, '2026-05-06T09:00:00Z'));
    for (const key of ['internal_inspection', 'fat']) {
      assert.ok(sameInstant(row(sheet, key).start, '2026-05-07T09:00:00Z'), `${key} start is the QC start`);
      assert.ok(sameInstant(row(sheet, key).end, '2026-05-08T09:00:00Z'), `${key} end is the QC end`);
    }
    const PURCHASE_KEYS = ['cabinet', 'automation', 'low_voltage', 'wires'];
    assert.ok(
      sheet.rows.filter(r => !PURCHASE_KEYS.includes(r.key)).every(r => r.reference === null),
      'only the four Purchase rows can carry a reference'
    );
    console.log('✓ header fields and Production/QC rows come from the unit');

    // Review Focus 2: a blank panel shows blanks, not errors
    const blank = await seedUnit({ createdBy: null });
    const blankSheet = await (await getSheet(blank.unitDbId)).json();
    assert.strictEqual(blankSheet.projectName, null);
    assert.strictEqual(blankSheet.salesPerson, null, 'an order with no creator has no sales person');
    assert.strictEqual(blankSheet.instructionForDispatch, null);
    assert.strictEqual(blankSheet.dateOfCompletion, null);
    assert.strictEqual(blankSheet.rows.length, 10);
    assert.ok(blankSheet.rows.every(r => r.start === null && r.end === null), 'every date is blank');
    console.log('✓ blank panel -> null header fields and 10 blank rows');

    // Project has no fallback to part number or description
    const noProject = await seedUnit({ partNumber: 'TEST-PRD03-PN', description: 'A described panel' });
    const noProjectSheet = await (await getSheet(noProject.unitDbId)).json();
    assert.strictEqual(noProjectSheet.projectName, null, 'project is never guessed from part number or description');
    console.log('✓ project name has no fallback');

    // Task 2: BOM and Drawing rows, Non-Standard (unit uploads, newest wins)
    const ns = await seedUnit({ classification: 'Non-Standard' });
    await addUnitDoc(ns.unitDbId, 'Drawing', 'old.pdf', '2026-04-01T10:00:00Z');
    await addUnitDoc(ns.unitDbId, 'Drawing', 'new.pdf', '2026-04-10T10:00:00Z');
    await addUnitDoc(ns.unitDbId, 'BOM', 'bom.xlsx', '2026-04-05T10:00:00Z');
    const nsSheet = await (await getSheet(ns.unitDbId)).json();
    assert.strictEqual(nsSheet.drawingNumber, 'new.pdf');
    assert.strictEqual(nsSheet.bomNumber, 'bom.xlsx');
    assert.ok(sameInstant(row(nsSheet, 'drawing').start, '2026-04-10T10:00:00Z'));
    assert.ok(sameInstant(row(nsSheet, 'drawing').end, '2026-04-10T10:00:00Z'));
    assert.ok(sameInstant(row(nsSheet, 'bom').start, '2026-04-05T10:00:00Z'));
    assert.ok(sameInstant(row(nsSheet, 'bom').end, '2026-04-05T10:00:00Z'));
    assert.strictEqual(row(nsSheet, 'drawing').reference, null);
    assert.strictEqual(row(nsSheet, 'bom').reference, null);
    console.log('✓ Non-Standard: newest unit Drawing and BOM give numbers and upload instants');

    // Review Focus 3a: only a BOM uploaded
    const bomOnly = await seedUnit({ classification: 'Non-Standard' });
    await addUnitDoc(bomOnly.unitDbId, 'BOM', 'only-bom.xlsx', '2026-04-05T10:00:00Z');
    const bomOnlySheet = await (await getSheet(bomOnly.unitDbId)).json();
    assert.strictEqual(bomOnlySheet.drawingNumber, null);
    assert.strictEqual(row(bomOnlySheet, 'drawing').start, null);
    assert.strictEqual(row(bomOnlySheet, 'drawing').end, null);
    assert.strictEqual(bomOnlySheet.bomNumber, 'only-bom.xlsx');
    assert.ok(sameInstant(row(bomOnlySheet, 'bom').start, '2026-04-05T10:00:00Z'));
    console.log('✓ Non-Standard with only a BOM: Drawing blank, BOM filled');

    // Standard: the part number master's current documents, never unit uploads
    const masterId = (await pool.query(
      `INSERT INTO part_number_masters (part_number, category) VALUES ('TEST-PRD03-PN', 'Standard') RETURNING id`
    )).rows[0].id;
    await addMasterDoc(masterId, 'Drawing', 'master-drawing-r0.pdf', 0, false);
    await addMasterDoc(masterId, 'Drawing', 'master-drawing-r1.pdf', 1, true);
    await addMasterDoc(masterId, 'BOM', 'master-bom.xlsx', 0, true);
    const std = await seedUnit({ classification: 'Standard', partNumber: 'TEST-PRD03-PN' });
    await addUnitDoc(std.unitDbId, 'Drawing', 'unit-drawing.pdf', '2026-04-10T10:00:00Z');
    const stdSheet = await (await getSheet(std.unitDbId)).json();
    assert.strictEqual(stdSheet.drawingNumber, 'master-drawing-r1.pdf', 'current master Drawing; unit upload ignored');
    assert.strictEqual(stdSheet.bomNumber, 'master-bom.xlsx');
    for (const key of ['bom', 'drawing']) {
      assert.strictEqual(row(stdSheet, key).start, 'Standard');
      assert.strictEqual(row(stdSheet, key).end, 'Standard');
      assert.strictEqual(row(stdSheet, key).reference, null);
    }
    console.log('✓ Standard: current master documents, Standard in both date columns, unit uploads ignored');

    // Part number match ignores case and surrounding spaces
    const stdCase = await seedUnit({ classification: 'Standard', partNumber: '  test-prd03-pn ' });
    const stdCaseSheet = await (await getSheet(stdCase.unitDbId)).json();
    assert.strictEqual(stdCaseSheet.bomNumber, 'master-bom.xlsx');
    console.log('✓ Standard: part number lookup ignores case and surrounding spaces');

    // Review Focus 3b: Standard with no master
    const noMaster = await seedUnit({ classification: 'Standard', partNumber: 'TEST-PRD03-NOMASTER' });
    const noMasterSheet = await (await getSheet(noMaster.unitDbId)).json();
    assert.strictEqual(noMasterSheet.bomNumber, null);
    assert.strictEqual(noMasterSheet.drawingNumber, null);
    for (const key of ['bom', 'drawing']) {
      assert.strictEqual(row(noMasterSheet, key).start, 'Standard');
      assert.strictEqual(row(noMasterSheet, key).end, 'Standard');
    }
    console.log('✓ Standard without a master: Standard rows, null numbers');

    // Task 3: Purchase rows. Panel: two closed POs (earliest date, latest received, order as stored).
    const pu = await seedUnit();
    await addVendorOrder('Panel', pu.serial, {
      status: 'PO closed',
      pos: [
        { poNumber: 'PO-A', status: 'PO closed', date: '2026-03-02', dateReceived: '2026-03-20' },
        { poNumber: 'PO-B', status: 'PO closed', date: '2026-03-01', dateReceived: '2026-03-25' },
      ],
    });
    // Case-insensitive category; a PO with a different serial ending in the same 4 characters is not ours.
    await addVendorOrder('low voltage', pu.serial, {
      status: 'PO closed',
      pos: [{ poNumber: 'PO-LV', status: 'Closed', date: '2026-03-10', dateReceived: '2026-03-12' }],
    });
    await addVendorOrder('Automation', `TEST-PRD03-OTHER-${pu.serial.slice(-4)}`, {
      status: 'Pending',
      pos: [{ poNumber: 'PO-OTHER', status: 'Pending', date: '2026-03-03' }],
    });
    const puSheet = await (await getSheet(pu.unitDbId)).json();
    const cabinet = row(puSheet, 'cabinet');
    assert.strictEqual(cabinet.start, '2026-03-01', 'start is the earliest PO date');
    assert.strictEqual(cabinet.end, '2026-03-25', 'end is the latest received date');
    assert.strictEqual(cabinet.reference, 'PO-A, PO-B', 'reference lists the PO numbers in stored order');
    const lv = row(puSheet, 'low_voltage');
    assert.deepStrictEqual([lv.start, lv.end, lv.reference], ['2026-03-10', '2026-03-12', 'PO-LV']);
    const auto = row(puSheet, 'automation');
    assert.deepStrictEqual([auto.start, auto.end, auto.reference], [null, null, null], 'a serial sharing the last 4 characters does not match');
    const wiresBlank = row(puSheet, 'wires');
    assert.deepStrictEqual([wiresBlank.start, wiresBlank.end, wiresBlank.reference], [null, null, null]);
    console.log('✓ Purchase: earliest start, latest received end, stored-order reference, case-insensitive category, exact serial');

    // Review Focus 4a: one PO still open -> no end date, start still the earliest
    const open = await seedUnit();
    await addVendorOrder('Panel', open.serial, {
      status: 'Pending',
      pos: [
        { poNumber: 'PO-C', status: 'PO closed', date: '2026-03-05', dateReceived: '2026-03-15' },
        { poNumber: 'PO-D', status: 'Pending', date: '2026-03-04' },
      ],
    });
    const openCabinet = row(await (await getSheet(open.unitDbId)).json(), 'cabinet');
    assert.strictEqual(openCabinet.start, '2026-03-04');
    assert.strictEqual(openCabinet.end, null, 'end stays blank until every PO is closed');
    assert.strictEqual(openCabinet.reference, 'PO-C, PO-D');
    console.log('✓ Purchase: an open PO keeps the end date blank');

    // The same PO number in two vendor orders of one category is listed once, first occurrence kept
    const dup = await seedUnit();
    await addVendorOrder('Automation', dup.serial, {
      status: 'Pending',
      pos: [{ poNumber: 'PO-1', status: 'Pending', date: '2026-03-01' }, { poNumber: 'PO-2', status: 'Pending', date: '2026-03-02' }],
    });
    await addVendorOrder('Automation', dup.serial, {
      status: 'Pending',
      pos: [{ poNumber: 'PO-1', status: 'Pending', date: '2026-03-03' }, { poNumber: 'PO-3', status: 'Pending', date: '2026-03-04' }],
    });
    const dupAuto = row(await (await getSheet(dup.unitDbId)).json(), 'automation');
    assert.strictEqual(dupAuto.reference, 'PO-1, PO-2, PO-3', 'a repeated PO number is listed once, in stored order');
    console.log('✓ Purchase: a PO number repeated across vendor orders is listed once');

    // A vendor order without a pos array falls back to its own order_uid / status / timestamps
    const noPos = await seedUnit();
    await addVendorOrder('Wires & Accessories', noPos.serial, {
      status: 'Closed', pos: [], createdAt: '2026-02-01T08:00:00Z', receivedAt: '2026-02-09T08:00:00Z', orderUid: 'TEST-PRD03-NOPOS-1',
    });
    const noPosWires = row(await (await getSheet(noPos.unitDbId)).json(), 'wires');
    assert.ok(sameInstant(noPosWires.start, '2026-02-01T08:00:00Z'));
    assert.ok(sameInstant(noPosWires.end, '2026-02-09T08:00:00Z'));
    assert.strictEqual(noPosWires.reference, 'TEST-PRD03-NOPOS-1');
    console.log('✓ Purchase: vendor order without a pos array uses its own fields');

    // N/A: marked not applicable and no PO -> N/A; a linked PO wins over the mark
    const na = await seedUnit({ customFields: { purchase_cat_wires: 'NA' } });
    const naWires = row(await (await getSheet(na.unitDbId)).json(), 'wires');
    assert.deepStrictEqual([naWires.start, naWires.end, naWires.reference], ['N/A', 'N/A', null]);
    const naWins = await seedUnit({ customFields: { purchase_cat_wires: 'NA' } });
    await addVendorOrder('Wires & Accessories', naWins.serial, {
      status: 'PO closed',
      pos: [{ poNumber: 'PO-W', status: 'PO closed', date: '2026-03-06', dateReceived: '2026-03-09' }],
    });
    const naWinsWires = row(await (await getSheet(naWins.unitDbId)).json(), 'wires');
    assert.deepStrictEqual([naWinsWires.start, naWinsWires.end, naWinsWires.reference], ['2026-03-06', '2026-03-09', 'PO-W']);
    console.log('✓ Purchase: N/A mark shows N/A, but a linked PO wins');

    console.log('\n====================================================');
    console.log('  ALL PRD-03 FORM DATA TESTS PASSED!');
    console.log('====================================================\n');
  } finally {
    try {
      await cleanup();
    } finally {
      await pool.end();
    }
  }
}

runTests().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
