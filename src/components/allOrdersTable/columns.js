// Columns owned by a single department. In that department's view (and in 'all')
// they are shown unless explicitly hidden; in any other department's view they
// are shown only when explicitly enabled. purchase_cat_* columns are matched by prefix.
const DEPT_OWNED_COLUMNS = {
  Stores: ['tray_status', 'tray_start_date', 'issued_date'],
  Production: [
    'wiremen',
    'mounting_start_date',
    'mounting_complete_date',
    'wiring_start_date',
    'wiring_complete_date',
    'pending_material_complete_date',
    'handover_to_qc_date'
  ],
  QC: ['qc_receiving_date', 'qc_start_date', 'qc_complete_date', 'qc_status'],
  Dispatch: ['dispatch_date'],
  Accounts: ['invoice_number', 'invoice_date']
};

const COLUMN_OWNER_DEPT = new Map(
  Object.entries(DEPT_OWNED_COLUMNS).flatMap(([dept, cols]) => cols.map(col => [col, dept]))
);

const getOwningDept = (colKey) => {
  if (colKey.startsWith('purchase_cat_')) return 'Purchase';
  return COLUMN_OWNER_DEPT.get(colKey) || null;
};

// Unit-level Production / QC / Dispatch / Accounts columns saved directly on order_units.
const PRODUCTION_AND_QC_COLS = new Set([
  ...DEPT_OWNED_COLUMNS.Production,
  ...DEPT_OWNED_COLUMNS.QC,
  ...DEPT_OWNED_COLUMNS.Dispatch,
  ...DEPT_OWNED_COLUMNS.Accounts
]);

const TEXT_WRAPPABLE_COLS = new Set([
  'company_name',
  'project_name',
  'end_client_name',
  'material_description',
  'panel_comments',
  'comments'
]);

const BASE_COLUMNS = [
  { key: 'order_number', label: 'Order #', align: 'center' },
  { key: 'short_serial', label: 'Serial #', align: 'center', alias: 'unit_serial' },
  { key: 'company_name', label: 'Client', align: 'left' },
  { key: 'project_name', label: 'Project Name', align: 'center' },
  { key: 'po_number', label: 'PO #', align: 'center' },
  { key: 'reference_number', label: 'Ref / Tag', align: 'center' },
  { key: 'end_client_name', label: 'End Client', align: 'center' },
  { key: 'part_number', label: 'Part Number', align: 'center' },
  { key: 'panel_code', label: 'Panel Code', align: 'center' },
  { key: 'panel_type_size', label: 'Panel Size', align: 'center' },
  { key: 'panel_ip_rating', label: 'IP Rating', align: 'center' },
  { key: 'panel_comments', label: 'Comments', align: 'left' },
  { key: 'material_description', label: 'Description', align: 'left' },
  { key: 'classification', label: 'Type (Design)', align: 'center' },
  { key: 'priority', label: 'Priority', align: 'center' },
  { key: 'order_date', label: 'Order Date', align: 'center' },
  { key: 'delivery_date', label: 'Delivery', align: 'center' },
  { key: 'unit_status', label: 'Status', align: 'center' },
  { key: 'purchase_cat_panel', label: 'Panel (PO)', align: 'center', catKey: 'Panel' },
  { key: 'purchase_cat_automation', label: 'Automation (PO)', align: 'center', catKey: 'Automation' },
  { key: 'purchase_cat_low_voltage', label: 'Low Voltage (PO)', align: 'center', catKey: 'Low voltage' },
  { key: 'purchase_cat_wires', label: 'Wires & Acc. (PO)', align: 'center', catKey: 'Wires & Accessories' },
  { key: 'tray_status', label: 'Tray Status', align: 'center', dept: 'Stores' },
  { key: 'tray_start_date', label: 'Tray Start', align: 'center', dept: 'Stores' },
  { key: 'issued_date', label: 'Issued Date', align: 'center', dept: 'Stores' },
  { key: 'wiremen', label: 'Wiremen', align: 'center', dept: 'Production' },
  { key: 'mounting_start_date', label: 'Mounting Start', align: 'center', dept: 'Production' },
  { key: 'mounting_complete_date', label: 'Mounting Complete', align: 'center', dept: 'Production' },
  { key: 'wiring_start_date', label: 'Wiring Start', align: 'center', dept: 'Production' },
  { key: 'wiring_complete_date', label: 'Wiring Complete', align: 'center', dept: 'Production' },
  { key: 'pending_material_complete_date', label: 'Pending Material', align: 'center', dept: 'Production' },
  { key: 'handover_to_qc_date', label: 'QC Handover', align: 'center', dept: 'Production' },
  { key: 'qc_receiving_date', label: 'QC Receiving Date', align: 'center', dept: 'QC' },
  { key: 'qc_start_date', label: 'QC Start Date', align: 'center', dept: 'QC' },
  { key: 'qc_complete_date', label: 'QC Complete Date', align: 'center', dept: 'QC' },
  { key: 'qc_status', label: 'QC Status', align: 'center', dept: 'QC' },
  { key: 'dispatch_date', label: 'Dispatch Date', align: 'center', dept: 'Dispatch' },
  { key: 'invoice_number', label: 'Invoice #', align: 'center', dept: 'Accounts' },
  { key: 'invoice_date', label: 'Invoice Date', align: 'center', dept: 'Accounts' },
];

const DEFAULT_COLUMN_KEYS = BASE_COLUMNS.map(c => c.key);

// Admin-created (custom) columns are normally appended after BASE_COLUMNS, far to the right of
// a 40-column table. A custom column listed here is placed right after the named column instead,
// so it is visible without scrolling. Saved per-browser layouts are not touched (Reset Layout
// applies the new default).
const CUSTOM_COLUMN_ANCHORS = {
  internal_remarks: 'reference_number'
};

// Returns baseColumns with each custom column inserted after its anchor (else appended).
const mergeCustomColumns = (baseColumns, customColumns) => {
  const merged = [...baseColumns];
  for (const col of customColumns) {
    const anchorIdx = merged.findIndex(c => c.key === CUSTOM_COLUMN_ANCHORS[col.key]);
    if (anchorIdx === -1) merged.push(col);
    else merged.splice(anchorIdx + 1, 0, col);
  }
  return merged;
};

// Adds `missingKeys` to a saved column order, each right after the closest preceding column
// (in `availableKeys` order) that is already present; keys with none go first.
const insertMissingColumnKeys = (orderedKeys, availableKeys, missingKeys) => {
  const result = [...orderedKeys];
  for (const key of missingKeys) {
    let at = availableKeys.indexOf(key) - 1;
    while (at >= 0 && !result.includes(availableKeys[at])) at--;
    result.splice(at >= 0 ? result.indexOf(availableKeys[at]) + 1 : 0, 0, key);
  }
  return result;
};

export { DEPT_OWNED_COLUMNS, COLUMN_OWNER_DEPT, getOwningDept, PRODUCTION_AND_QC_COLS, TEXT_WRAPPABLE_COLS, BASE_COLUMNS, DEFAULT_COLUMN_KEYS, mergeCustomColumns, insertMissingColumnKeys };
