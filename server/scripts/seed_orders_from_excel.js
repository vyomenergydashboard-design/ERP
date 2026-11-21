/**
 * seed_orders_from_excel.js
 * 
 * Standalone transactional seeding script to import 1,569 units across 269 orders
 * from the user's Excel file into Vyom ERP PostgreSQL database.
 * 
 * Strict User Requirements:
 * 1. Group serial numbers by order number (multiple serial numbers belong to one order).
 * 2. Add customer as in the client mapped with serial number (resolve/create company and location, store end-client).
 * 3. Don't populate information for any department other than sales (all orders/units fresh in Sales queue, pending).
 * 4. Use standard numeric format for order numbers (e.g. 26270001, not ORD-2627-0001).
 */

import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import pg from 'pg';

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5433/erp_db';
const pool = new Pool({ connectionString });

const EXCEL_PATH = process.env.EXCEL_PATH || 'C:/Users/cerul/.gemini/antigravity/brain/9c03ce4f-bb76-49f4-868a-735a8c582d11/.user_uploaded/media_1794655308519_68312489.xlsx';

// Helper to convert Excel date code or string to YYYY-MM-DD
function parseDate(v) {
  if (!v) return null;
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
  }
  const s = String(v).trim();
  if (/^\d+$/.test(s)) {
    const d = XLSX.SSF.parse_date_code(parseInt(s, 10));
    return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    return s.slice(0, 10);
  }
  return null;
}

// Convert ORD-2627-0001 to standard numeric 26270001
function toNumericOrderNumber(ordStr) {
  if (!ordStr) return '';
  const clean = String(ordStr).trim();
  const match = clean.match(/^(?:ORD-)?(\d{4})-(\d{4})$/i);
  if (match) {
    return `${match[1]}${match[2]}`; // e.g. 2627 + 0001 = 26270001
  }
  const digits = clean.replace(/\D/g, '');
  if (digits.length >= 8) return digits.slice(-8);
  return clean;
}

async function runSeed({ isDryRun = true } = {}) {
  console.log('========================================================================');
  console.log(`  VYOM ERP: SEED ORDERS FROM EXCEL (Dry Run: ${isDryRun ? 'YES' : 'NO'})  `);
  console.log('========================================================================\n');

  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`Excel file not found at: ${EXCEL_PATH}`);
  }

  const wb = XLSX.read(fs.readFileSync(EXCEL_PATH)); // xlsx 0.20 ESM build has no fs
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  const rawRows = XLSX.utils.sheet_to_json(ws);

  console.log(`Loaded ${rawRows.length} rows from sheet "${sheetName}".\n`);

  // Group rows by Order Number
  const orderGroups = new Map();
  for (const row of rawRows) {
    const rawOrderNum = row['Order Number'];
    if (!rawOrderNum) continue;

    const numericOrderNumber = toNumericOrderNumber(rawOrderNum);
    if (!orderGroups.has(numericOrderNumber)) {
      orderGroups.set(numericOrderNumber, {
        numericOrderNumber,
        rawOrderNumber: String(rawOrderNum).trim(),
        rows: []
      });
    }
    orderGroups.get(numericOrderNumber).rows.push(row);
  }

  console.log(`Grouped into ${orderGroups.size} unique orders.`);

  const client = await pool.connect();

  try {
    if (!isDryRun) {
      await client.query('BEGIN');
    }

    // Load task masters for step assignment
    const tmRes = await client.query(`
      SELECT * FROM task_masters 
      ORDER BY 
        CASE dept
          WHEN 'Sales' THEN 1
          WHEN 'Design' THEN 2
          WHEN 'Purchase' THEN 3
          WHEN 'Stores' THEN 4
          WHEN 'Planning' THEN 5
          WHEN 'Production' THEN 6
          WHEN 'QC' THEN 7
          WHEN 'Dispatch' THEN 8
          WHEN 'Accounts' THEN 9
          ELSE 10
        END ASC,
        id ASC
    `);
    const orderTasks = tmRes.rows.filter(t => t.level === 'order');
    const unitTasks = tmRes.rows.filter(t => t.level === 'unit');

    console.log(`Task templates loaded: ${orderTasks.length} order milestones, ${unitTasks.length} unit steps.`);

    // Company & Location resolution cache
    const companyCache = new Map();

    async function resolveCompanyLocation(custName) {
      const cleanName = String(custName || 'General Customer').trim();
      if (companyCache.has(cleanName.toLowerCase())) {
        return companyCache.get(cleanName.toLowerCase());
      }

      let compRes = await client.query(
        'SELECT id FROM companies WHERE LOWER(TRIM(name)) = LOWER(TRIM($1)) LIMIT 1',
        [cleanName]
      );

      let companyId;
      if (compRes.rows.length > 0) {
        companyId = compRes.rows[0].id;
      } else if (!isDryRun) {
        compRes = await client.query(
          `INSERT INTO companies (name) VALUES ($1)
           ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
           RETURNING id`,
          [cleanName]
        );
        companyId = compRes.rows[0].id;
      } else {
        companyId = 999999;
      }

      let locRes = await client.query(
        'SELECT id FROM company_locations WHERE company_id = $1 LIMIT 1',
        [companyId]
      );

      let locationId;
      if (locRes.rows.length > 0) {
        locationId = locRes.rows[0].id;
      } else if (!isDryRun) {
        locRes = await client.query(
          `INSERT INTO company_locations (company_id, city, address) 
           VALUES ($1, 'Main Location', 'Factory / Project Office') 
           RETURNING id`,
          [companyId]
        );
        locationId = locRes.rows[0].id;
      } else {
        locationId = 999999;
      }

      companyCache.set(cleanName.toLowerCase(), locationId);
      return locationId;
    }

    let totalOrdersCreated = 0;
    let totalLineItemsCreated = 0;
    let totalUnitsCreated = 0;

    // Process orders in sorted order number sequence
    const sortedOrderKeys = Array.from(orderGroups.keys()).sort();

    for (const ordNum of sortedOrderKeys) {
      const group = orderGroups.get(ordNum);
      const firstRow = group.rows[0];

      const customerName = String(firstRow['Customer Name'] || '').trim();
      const companyLocationId = await resolveCompanyLocation(customerName);

      const orderDate = parseDate(firstRow['Order Date']) || new Date().toISOString().split('T')[0];
      const deliveryDate = parseDate(firstRow['Required Date']) || null;
      const poNumber = firstRow['PO No.'] ? String(firstRow['PO No.']).trim() : null;
      const projectName = firstRow['Project'] ? String(firstRow['Project']).trim() : null;
      const endClientName = firstRow['End client'] ? String(firstRow['End client']).trim() : null;
      const internalRemarks = firstRow['Internal Remarks'] ? String(firstRow['Internal Remarks']).trim() : null;

      // Determine classification: if any row indicates Non standard
      const isNonStandard = group.rows.some(r => {
        const desc = String(r['Description'] || '').toLowerCase();
        const proj = String(r['Project'] || '').toLowerCase();
        return desc.includes('non standard') || proj.includes('non standard');
      });
      const classification = isNonStandard ? 'Non-Standard' : 'Standard';

      let orderId;
      if (!isDryRun) {
        const orderRes = await client.query(
          `INSERT INTO orders (
            order_number, company_location_id, order_date, delivery_date, 
            po_number, project_name, end_client_name, notes, 
            classification, priority, status, created_by
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Medium', 'Not Started', 1)
          RETURNING id`,
          [
            ordNum, companyLocationId, orderDate, deliveryDate,
            poNumber, projectName, endClientName, internalRemarks,
            classification
          ]
        );
        orderId = orderRes.rows[0].id;

        // Seed order-level milestones (e.g. Upload PO in Sales)
        for (let i = 0; i < orderTasks.length; i++) {
          const task = orderTasks[i];
          await client.query(
            `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '[]', $9, 'pending')`,
            [orderId, task.id, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', i]
          );
        }
      } else {
        orderId = totalOrdersCreated + 1;
      }
      totalOrdersCreated++;

      // Subgroup rows in this order into distinct line items by product specification
      const lineItemMap = new Map();
      for (const r of group.rows) {
        const partNumber = String(r['Part Number'] || '').trim();
        const unitPrice = parseFloat(String(r['Unit Price']).replace(/[^\d.]/g, '')) || 0;
        const panelSize = r['Panel Enclosure Size'] ? String(r['Panel Enclosure Size']).trim() : null;
        const ipRating = r['IP Rating'] ? String(r['IP Rating']).trim() : null;
        const details = r['Details'] ? String(r['Details']).trim() : '';

        const liKey = `${partNumber}|||${unitPrice}|||${panelSize || ''}|||${ipRating || ''}|||${details}`;
        if (!lineItemMap.has(liKey)) {
          lineItemMap.set(liKey, {
            partNumber,
            unitPrice,
            panelSize,
            ipRating,
            details,
            rows: []
          });
        }
        lineItemMap.get(liKey).rows.push(r);
      }

      let lineIdx = 1;
      for (const [liKey, liGroup] of lineItemMap) {
        const liNumber = `${ordNum}-${String(lineIdx).padStart(2, '0')}`;
        lineIdx++;

        const qty = liGroup.rows.length;
        const unitPrice = liGroup.unitPrice;
        const totalPrice = qty * unitPrice;
        // The sheet has no description text (its "Description" column is Standard / Non standard,
        // imported as classification). Leave material_description empty instead of copying the part
        // number, project name or a placeholder into it; the column is nullable.
        const matDesc = null;

        let lineItemId;
        if (!isDryRun) {
          const liRes = await client.query(
            `INSERT INTO order_line_items (
              order_id, line_item_number, part_number, material_description, 
              panel_type_size, panel_ip_rating, quantity, unit, unit_price, total_price, 
              project_name, tag, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'EA', $8, $9, $10, $11, 'Pending')
            RETURNING id`,
            [
              orderId, liNumber, liGroup.partNumber, matDesc,
              liGroup.panelSize, liGroup.ipRating, qty, unitPrice, totalPrice,
              projectName, liGroup.details || null
            ]
          );
          lineItemId = liRes.rows[0].id;
        } else {
          lineItemId = totalLineItemsCreated + 1;
        }
        totalLineItemsCreated++;

        // Insert units for this line item
        for (const uRow of liGroup.rows) {
          const serialId = String(uRow['Sr. No.']).trim();
          const unitTag = uRow['Details'] ? String(uRow['Details']).trim() : null;

          if (!isDryRun) {
            const unitRes = await client.query(
              `INSERT INTO order_units (
                order_id, line_item_id, unit_id, short_serial,
                panel_type_size, panel_ip_rating, tag, classification,
                current_dept, status, sales_cleared, design_confirmed
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'Sales', 'Pending', false, false)
              RETURNING id`,
              [
                orderId, lineItemId, serialId, serialId,
                liGroup.panelSize, liGroup.ipRating, unitTag, classification
              ]
            );
            const unitDbId = unitRes.rows[0].id;

            // Seed unit-level steps for Sales through Accounts in 'pending' status
            for (let sIdx = 0; sIdx < unitTasks.length; sIdx++) {
              const uTask = unitTasks[sIdx];
              await client.query(
                `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, requires_upload, default_doc_type, custom_fields, step_order, status)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, '[]', $8, 'pending')`,
                [unitDbId, uTask.id, uTask.dept, uTask.name, uTask.sub, uTask.requires_upload, uTask.default_doc_type || 'General', sIdx]
              );
            }
          }
          totalUnitsCreated++;
        }
      }
    }

    if (!isDryRun) {
      // Update system starting sequences to follow the highest seeded IDs
      const nextOrderSeq = sortedOrderKeys.length + 1;
      const nextUnitSeq = totalUnitsCreated + 1;

      await client.query(`
        INSERT INTO system_settings (key, value, updated_at) VALUES ('order_number_start', $1, NOW())
        ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()
      `, [String(nextOrderSeq)]);

      await client.query(`
        INSERT INTO system_settings (key, value, updated_at) VALUES ('unit_number_start', $1, NOW())
        ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()
      `, [String(nextUnitSeq)]);

      // Seed initial activity log
      await client.query(`
        INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot)
        VALUES (1, 'Sales', 'Bulk imported 269 orders and 1,569 units from master spreadsheet.', 'admin')
      `);

      await client.query('COMMIT');
      console.log('\n✓ TRANSACTION COMMITTED SUCCESSFULLY.');
    } else {
      console.log('\n[DRY RUN COMPLETED - NO DATABASE CHANGES MADE]');
    }

    console.log('\nSummary:');
    console.log(`- Orders:     ${totalOrdersCreated}`);
    console.log(`- Line Items: ${totalLineItemsCreated}`);
    console.log(`- Units:      ${totalUnitsCreated}`);
    console.log(`- Department: ALL set to "Sales", status "Pending"`);

  } catch (err) {
    if (!isDryRun) {
      await client.query('ROLLBACK');
      console.error('\n✗ TRANSACTION ROLLED BACK DUE TO ERROR:');
    }
    console.error(err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

// Execute with --commit to apply changes, otherwise dry run
const shouldCommit = process.argv.includes('--commit');
runSeed({ isDryRun: !shouldCommit }).catch(() => process.exit(1));
