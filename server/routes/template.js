import express from 'express';
import XLSX from 'xlsx';

const templateHandler = (req, res) => {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Field Reference ─────────────────────────────────────────────
  const ref = [
    ['SECTION', 'FIELD', 'EXAMPLE / ALLOWED VALUES', 'REQUIRED?', 'NOTES'],
    ['── ORDER HEADER ──', '', '', '', ''],
    ['Company & Location', 'company_name', 'Acme Corp', 'YES', 'Must match Masters. Case-insensitive.'],
    ['Company & Location', 'company_city', 'Mumbai', 'YES', 'Must match Masters location city.'],
    ['Dates', 'order_date', '2026-05-19', 'YES', 'Format: YYYY-MM-DD'],
    ['Dates', 'delivery_date', '2026-07-31', 'YES', 'Overall delivery date. YYYY-MM-DD'],
    ['PO Details', 'po_number', 'PO-2026-1234', 'YES', 'Groups rows into one order. Same PO = same order.'],
    ['PO Details', 'priority', 'Medium', 'YES', 'Low | Medium | High | Urgent'],
    ['PO Details', 'packaging_type', 'Wooden Packaging', 'NO', 'Wooden Packaging | Foam Packaging'],
    ['PO Details', 'end_client_name', 'Basavanakolla site', 'NO', 'End client name / site location'],
    ['PO Details', 'project_name', 'Mooviboost Project', 'NO', 'Project / System Name'],
    ['PO Details', 'order_notes', 'Handle with care.', 'NO', 'Overall order notes'],
    ['PO Details', 'gst_number', '27AAAAA1111A1Z1', 'NO', 'GST Number of client'],
    ['PO Details', 'reference_number', 'REF-2026-99', 'NO', 'Customer Reference Number'],
    ['PO Details', 'classification', 'Standard', 'NO', 'Standard | Non-Standard (Defaults to Standard)'],
    ['── LINE ITEMS ──', '', '', '', 'One row per line item; repeat po_number to group into one order'],
    ['Line Item', 'line_item_number', '0001', 'YES', '0001, 0002, 0003 etc.'],
    ['Line Item', 'material_description', 'VFD Control Panel 22kW', 'YES', 'Full description'],
    ['Line Item', 'part_number', 'VFD-22K-STD', 'NO', 'Internal / customer part number'],
    ['Line Item', 'panel_type_size', 'VFD Panel 800x600', 'NO', 'Physical type/size'],
    ['Line Item', 'quantity', '3', 'YES', 'Positive integer'],
    ['Line Item', 'unit', 'Nos', 'YES', 'e.g. Nos, Sets, Pcs'],
    ['Line Item', 'unit_price', '45000', 'YES', 'Numeric only, no Rs.'],
    ['Line Item', 'total_price', '135000', 'AUTO', 'quantity x unit_price (leave blank — auto-calculated)'],
    ['Line Item', 'line_item_delivery_date', '2026-06-30', 'NO', 'YYYY-MM-DD; defaults to delivery_date'],
    ['Line Item', 'line_item_notes', 'FAT required before dispatch', 'NO', 'Item-level notes'],
    ['Line Item', 'tag', 'TG-01', 'NO', 'Line item tag (combined with reference_number as Ref/Tag)'],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(ref);
  ws1['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 42 }, { wch: 12 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Field Reference');

  // ── Sheet 2: Import Template — 2000 blank rows ready for bulk paste ──────
  const COLS = [
    'company_name', 'company_city', 'order_date', 'delivery_date',
    'po_number', 'priority', 'packaging_type', 'end_client_name', 'project_name', 'order_notes',
    'gst_number', 'reference_number', 'classification',
    'line_item_number', 'material_description', 'part_number', 'panel_type_size',
    'quantity', 'unit', 'unit_price', 'total_price',
    'line_item_delivery_date', 'line_item_notes', 'tag'
  ];

  // Visual group-label row so users understand which columns are order-level vs item-level
  const groupRow = [
    '<-- ORDER LEVEL: repeat these 13 columns on every row of the same PO -->',
    '', '', '', '', '', '', '', '', '', '', '', '',
    '<-- LINE ITEM LEVEL: one row = one item in the order -->',
    '', '', '', '', '', '', '', '', '', ''
  ];

  const exampleRows = [
    // ORDER 1 — PO-2026-1001 — 3 line items (same PO groups them into 1 order)
    ['Acme Corp', 'Mumbai', '2026-05-20', '2026-07-31', 'PO-2026-1001', 'High', 'Wooden Packaging', 'Basavanakolla site', 'Mooviboost Line 1', 'Rush order — deliver before monsoon', '27AAAAA1111A1Z1', 'REF-2026-99', 'Standard', '00010', 'VFD Control Panel 22kW', 'VFD-22K-STD', '800x600x300 mm', 3, 'Nos', 45000, 135000, '2026-06-30', 'FAT required before dispatch', 'TG-01'],
    ['Acme Corp', 'Mumbai', '2026-05-20', '2026-07-31', 'PO-2026-1001', 'High', 'Wooden Packaging', 'Basavanakolla site', 'Mooviboost Line 1', '', '27AAAAA1111A1Z1', 'REF-2026-99', 'Standard', '00020', 'Motor Control Centre 8 Way', 'MCC-400A-8W', '1600x800x400 mm', 2, 'Nos', 72000, 144000, '2026-07-15', '', 'TG-02'],
    ['Acme Corp', 'Mumbai', '2026-05-20', '2026-07-31', 'PO-2026-1001', 'High', 'Wooden Packaging', 'Basavanakolla site', 'Mooviboost Line 1', '', '27AAAAA1111A1Z1', 'REF-2026-99', 'Standard', '00030', 'Power Factor Correction Panel', 'PFCP-100K', '1000x800x300 mm', 1, 'Nos', 38000, 38000, '2026-07-20', 'Include capacitor bank', 'TG-03'],
    // ORDER 2 — PO-2026-1002 — 1 line item
    ['Beta Industries', 'Pune', '2026-05-22', '2026-08-15', 'PO-2026-1002', 'Medium', 'Foam Packaging', 'Pune Site', 'Solar Grid System', '', '27BBBBB2222B2Z2', 'REF-2026-100', 'Non-Standard', '00010', 'PLC Automation Panel', 'PLC-S7-300', '600x400x300 mm', 1, 'Nos', 90000, 90000, '2026-08-15', 'Include Siemens S7-300', 'PLC-01'],
    // ORDER 3 — PO-2026-1003 — 2 line items
    ['Gamma Systems', 'Chennai', '2026-05-25', '2026-09-01', 'PO-2026-1003', 'Low', 'Wooden Packaging', '', 'Warehouse Expansion', 'Standard delivery', '', '', 'Standard', '00010', 'Distribution Board 8 Way', 'DB-8W-63A', '500x400x200 mm', 5, 'Nos', 12000, 60000, '2026-09-01', '', ''],
    ['Gamma Systems', 'Chennai', '2026-05-25', '2026-09-01', 'PO-2026-1003', 'Low', 'Wooden Packaging', '', 'Warehouse Expansion', '', '', '', 'Standard', '00020', 'Surge Protection Device', 'SPD-40KA', '', 5, 'Nos', 4500, 22500, '2026-09-01', '', ''],
  ];

  // Pre-allocate 2000 blank rows so the sheet is bulk-paste ready
  const blankRows = Array.from({ length: 2000 }, () => COLS.map(() => ''));

  const tmpl = [groupRow, COLS, ...exampleRows, ...blankRows];
  const ws2 = XLSX.utils.aoa_to_sheet(tmpl);
  ws2['!cols'] = [20, 15, 13, 15, 20, 10, 18, 22, 38, 22, 22, 16, 18, 32, 18, 22, 10, 8, 12, 12, 24, 38].map(w => ({ wch: w }));
  // Freeze top 2 rows — headers stay visible scrolling through thousands of rows
  ws2['!freeze'] = { xSplit: 0, ySplit: 2, topLeftCell: 'A3', activePane: 'bottomLeft' };
  XLSX.utils.book_append_sheet(wb, ws2, 'Import Template');

  // ── Sheet 3: How It Works — explicit multi-order walkthrough ─────────────
  const howto = [
    ['HOW THIS SHEET WORKS — MULTI-ORDER BULK IMPORT', '', ''],
    ['', '', ''],
    ['KEY RULE:', 'Each ROW = one Line Item.', ''],
    ['', 'Rows with the SAME po_number are grouped into ONE order.', ''],
    ['', 'A DIFFERENT po_number = a NEW separate order.', ''],
    ['', 'No limit on rows. Import hundreds or thousands of orders at once.', ''],
    ['', '', ''],
    ['EXAMPLE — 3 orders, 6 rows:', '', ''],
    ['', '', ''],
    ['Row', 'po_number', 'RESULT'],
    ['1', 'PO-2026-1001 (item 1)', 'Part of ORDER 1'],
    ['2', 'PO-2026-1001 (item 2)', 'Part of ORDER 1'],
    ['3', 'PO-2026-1001 (item 3)', 'Part of ORDER 1  <-- 3 rows = 1 order with 3 line items'],
    ['4', 'PO-2026-1002 (item 1)', 'ORDER 2  <-- different PO = new order'],
    ['5', 'PO-2026-1003 (item 1)', 'Part of ORDER 3'],
    ['6', 'PO-2026-1003 (item 2)', 'Part of ORDER 3  <-- 2 rows = 1 order with 2 line items'],
    ['', '', ''],
    ['RESULT:', '3 orders created. ORDER 1 has 3 line items, ORDER 2 has 1, ORDER 3 has 2.', ''],
    ['', '', ''],
    ['SCALE:', 'The Import Template sheet has 2000 blank rows pre-loaded.', ''],
    ['', 'Excel supports ~1,048,576 rows — you can paste as many as you need.', ''],
    ['', 'Each order processes in its own DB transaction.', ''],
    ['', 'If one PO fails (e.g. company not found), the others still succeed.', ''],
    ['', 'The upload result screen shows a per-PO success/error breakdown.', ''],
    ['', '', ''],
    ['TIPS:', '', ''],
    ['', '1. Keep rows for the same order together (sort by po_number) — not required but cleaner.', ''],
    ['', '2. company_name + company_city must match Masters exactly (case-insensitive).', ''],
    ['', '3. Dates: type as YYYY-MM-DD. Format the column as Text in Excel first to avoid auto-conversion.', ''],
    ['', '4. Leave total_price blank — always recalculated as quantity x unit_price on the server.', ''],
    ['', '5. Documents (PO copy, Quotation) cannot be included here. Attach them after import.', ''],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(howto);
  ws3['!cols'] = [{ wch: 12 }, { wch: 78 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'How It Works');

  // ── Sheet 4: Validation Rules ─────────────────────────────────────────────
  const rules = [
    ['FIELD', 'TYPE', 'REQUIRED', 'ALLOWED VALUES / FORMAT', 'IF WRONG'],
    ['company_name', 'Text', 'YES', 'Exact name in Masters (case-insensitive)', 'Order fails — company not found'],
    ['company_city', 'Text', 'YES', 'Exact city in Masters (case-insensitive)', 'Order fails — location not found'],
    ['order_date', 'Date', 'YES', 'YYYY-MM-DD', 'Rejected if invalid'],
    ['delivery_date', 'Date', 'YES', 'YYYY-MM-DD', 'Rejected if invalid'],
    ['po_number', 'Text', 'YES', 'Any alphanumeric string', 'Row skipped if blank'],
    ['priority', 'Enum', 'YES', 'Low | Medium | High | Urgent', 'Defaults to Medium'],
    ['packaging_type', 'Enum', 'NO', 'Wooden Packaging | Foam Packaging', 'Left blank if invalid'],
    ['end_client_name', 'Text', 'NO', 'End client name / site location', 'Left blank if missing'],
    ['quantity', 'Integer', 'YES', 'Positive whole number', 'Defaults to 1'],
    ['unit', 'Text', 'YES', 'Nos, Sets, Pcs ...', 'Defaults to Nos'],
    ['unit_price', 'Decimal', 'YES', 'Numeric, no Rs.', 'Defaults to 0'],
    ['total_price', 'Decimal', 'AUTO', 'quantity x unit_price', 'Always recalculated server-side'],
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(rules);
  ws4['!cols'] = [{ wch: 26 }, { wch: 10 }, { wch: 12 }, { wch: 48 }, { wch: 42 }];
  XLSX.utils.book_append_sheet(wb, ws4, 'Validation Rules');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Disposition', 'attachment; filename="order_import_template.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
};

/**
 * Router for the Excel order-import template download (mounted at /api/template).
 * Deliberately registered without authorize (as it was in index.js).
 */
export default function createTemplateRouter() {
  const router = express.Router();

  router.get('/download', templateHandler);
  router.get('/order_import_template.xlsx', templateHandler);

  return router;
}
