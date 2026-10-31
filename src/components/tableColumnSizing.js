/**
 * tableColumnSizing.js
 * 
 * Modular layout and column sizing utilities for AllOrdersTableView.
 * Follows AGENTS.md monolithic decomposition guardrail and Impeccable spatial rhythm.
 * 
 * Calibrated to snugly hug cell content and column headers without wasteful empty voids.
 */

export const DEFAULT_COL_WIDTHS = {
  order_number: 118,
  short_serial: 108,
  company_name: 180,
  project_name: 155,
  po_number: 135,
  reference_number: 135,
  end_client_name: 145,
  part_number: 145,
  panel_code: 110,
  panel_type_size: 160,
  panel_ip_rating: 95,
  panel_comments: 155,
  material_description: 180,
  classification: 185,
  priority: 108,
  delivery_date: 120,
  unit_status: 130,
  purchase_cat_panel: 140,
  purchase_cat_automation: 140,
  purchase_cat_low_voltage: 140,
  purchase_cat_wires: 145,
  tray_status: 125,
  tray_start_date: 110,
  issued_date: 110,
  wiremen: 135,
  mounting_start_date: 172,
  mounting_complete_date: 172,
  wiring_start_date: 172,
  wiring_complete_date: 172,
  pending_material_complete_date: 175,
  handover_to_qc_date: 172,
};

export const MIN_COL_WIDTHS = {
  order_number: 108,
  short_serial: 98,
  company_name: 135,
  project_name: 115,
  po_number: 115,
  reference_number: 115,
  end_client_name: 115,
  part_number: 125,
  panel_code: 95,
  panel_type_size: 140,
  panel_ip_rating: 85,
  panel_comments: 110,
  material_description: 120,
  classification: 170,
  priority: 95,
  delivery_date: 112,
  unit_status: 118,
  purchase_cat_panel: 125,
  purchase_cat_automation: 125,
  purchase_cat_low_voltage: 125,
  purchase_cat_wires: 130,
  tray_status: 105,
  tray_start_date: 98,
  issued_date: 98,
  wiremen: 115,
  mounting_start_date: 165,
  mounting_complete_date: 165,
  wiring_start_date: 165,
  wiring_complete_date: 165,
  pending_material_complete_date: 165,
  handover_to_qc_date: 165,
};

/**
 * Approximate rendered text width in pixels for monospace / sans UI fonts
 */
export function estimateTextWidth(text, isMono = false, fontSize = 12) {
  if (!text) return 0;
  const str = String(text);
  // Monospace characters are roughly 0.60 * fontSize wide
  // Sans-serif UI characters are roughly 0.52 * fontSize wide
  const charWidth = isMono ? fontSize * 0.60 : fontSize * 0.52;
  return Math.ceil(str.length * charWidth);
}

/**
 * Extracts sample text representation for a unit and column key
 */
export function getCellSampleText(unit, colKey, panelSizeMap, getUnitStatus) {
  if (!unit) return '';

  switch (colKey) {
    case 'order_number':
      return String(unit.order_number || '');
    case 'short_serial':
    case 'unit_serial':
      return String(unit.short_serial || unit.unit_serial || '');
    case 'company_name':
      return `${unit.company_name || ''}${unit.company_city ? ` · ${unit.company_city}` : ''}`;
    case 'project_name':
      return String(unit.project_name || '');
    case 'end_client_name':
      return String(unit.end_client_name || '');
    case 'po_number':
      return String(unit.po_number || '');
    case 'reference_number': {
      const parts = [unit.reference_number, unit.tag_name].filter(Boolean);
      return parts.length > 0 ? parts.join(' - ') : '';
    }
    case 'part_number':
      return String(unit.part_number || '');
    case 'panel_code': {
      const sz = unit.panel_type_size || '';
      const master = panelSizeMap?.get ? panelSizeMap.get(sz) : null;
      return String(unit.panel_code || master?.panel_code || '');
    }
    case 'panel_type_size':
      return String(unit.panel_type_size || '');
    case 'panel_ip_rating': {
      const sz = unit.panel_type_size || '';
      const master = panelSizeMap?.get ? panelSizeMap.get(sz) : null;
      return String(unit.panel_ip_rating || master?.ip_rating || '');
    }
    case 'panel_comments':
      return String(unit.panel_comments || '');
    case 'material_description':
      return String(unit.material_description || '');
    case 'classification':
      return `${unit.classification || 'Standard'} ${unit.design_confirmed ? 'Confirmed' : 'Confirm'}`;
    case 'priority':
      return String(unit.priority || 'Medium');
    case 'unit_status': {
      const st = getUnitStatus ? getUnitStatus(unit) : (unit.unit_status || 'In Progress');
      return String(st);
    }
    case 'wiremen': {
      const w = unit.wiremen || unit.custom_fields?.wiremen || '';
      return String(w);
    }
    case 'mounting_start_date':
    case 'mounting_complete_date':
    case 'wiring_start_date':
    case 'wiring_complete_date':
    case 'pending_material_complete_date':
    case 'handover_to_qc_date': {
      const d = unit[colKey] || unit.custom_fields?.[colKey];
      if (!d) return '';
      // Formatted date + time: "DD/MM/YYYY, hh:mm am" -> ~20 chars
      return '29/10/2026, 12:00 pm';
    }
    case 'delivery_date':
    case 'tray_start_date':
    case 'issued_date': {
      const d = unit[colKey] || unit.custom_fields?.[colKey];
      return d ? '29/10/2026' : '';
    }
    default: {
      const val = unit.custom_fields?.[colKey] ?? unit[colKey];
      return val ? String(val) : '';
    }
  }
}

/**
 * Calculates optimal column width based on column header and cell contents.
 * Intentionally does NOT clamp to defWidth so columns with short content can snugly shrink!
 */
export function calculateOptimalColumnWidth(colKey, units = [], allColumns = [], panelSizeMap, getUnitStatus) {
  const colDef = allColumns.find(c => c.key === colKey) || {};
  const label = colDef.label || colKey;

  const isMono = ['order_number', 'short_serial', 'unit_serial', 'panel_code', 'mounting_start_date',
    'mounting_complete_date', 'wiring_start_date', 'wiring_complete_date', 'pending_material_complete_date',
    'handover_to_qc_date', 'delivery_date', 'po_number'].includes(colKey);

  // When headers wrap cleanly into up to 2 lines:
  // Split multi-word labels into balanced lines so column name stays completely visible without forcing wide voids
  const words = String(label).trim().split(/\s+/);
  let effectiveHeaderCharCount = label.length;
  if (words.length >= 2) {
    let bestLineLen = label.length;
    let running = '';
    for (let i = 0; i < words.length; i++) {
      running += (i > 0 ? ' ' : '') + words[i];
      const remainder = words.slice(i + 1).join(' ');
      const longest = Math.max(running.length, remainder.length);
      if (longest < bestLineLen) {
        bestLineLen = longest;
      }
    }
    const maxSingleWord = Math.max(...words.map(w => w.length));
    effectiveHeaderCharCount = Math.max(bestLineLen, maxSingleWord, 6);
  }
  const headerTextWidth = Math.ceil(effectiveHeaderCharCount * 11 * 0.55);
  const headerTotal = headerTextWidth + 30;

  // Measure content from sample units
  const sampleUnits = units.slice(0, 100);
  let maxContentWidth = 0;

  for (const u of sampleUnits) {
    const text = getCellSampleText(u, colKey, panelSizeMap, getUnitStatus);
    if (!text || text === '—') continue;

    let w = estimateTextWidth(text, isMono, isMono ? 11.5 : 12);

    // Realistic element accessory widths (icons, pills, badges)
    if (colKey === 'order_number') {
      w += 32; // badge padding + paperclip button + gap
    } else if (colKey === 'short_serial' || colKey === 'unit_serial') {
      w += 22; // badge padding (0 6px) + border
    } else if (colKey === 'panel_type_size') {
      w += 36; // combobox padding + chevron + gaps
    } else if (colKey === 'classification') {
      w += 46; // dropdown chevron + confirm button badge with icon
    } else if (colKey === 'priority' || colKey === 'unit_status') {
      w += 26; // pill padding & dot/icon
    } else if (colKey === 'wiremen') {
      w += 28; // icon + count chip
    } else if (colKey === 'po_number' || colKey === 'reference_number') {
      w += 32; // upload cloud / edit icon / pdf button
    } else if (colKey.startsWith('purchase_cat_')) {
      w = Math.max(w, 135);
    } else if (colKey.includes('date')) {
      if (colKey.includes('mounting') || colKey.includes('wiring') || colKey.includes('material') || colKey.includes('handover')) {
        w = Math.max(w, 168); // "DD/MM/YYYY, hh:mm a" formatted full timestamp
      } else {
        w = Math.max(w, 108); // "DD/MM/YYYY"
      }
    }

    if (w > maxContentWidth) {
      maxContentWidth = w;
    }
  }

  // Cell padding: 6px left + 6px right = 12px + 4px buffer
  const cellTotal = maxContentWidth > 0 ? maxContentWidth + 16 : 0;

  const minSafe = MIN_COL_WIDTHS[colKey] || 80;
  const maxSafe = 450;

  // Optimal width is strictly the larger of header requirement, content requirement, or minSafe
  const optimal = Math.max(headerTotal, cellTotal, minSafe);
  return Math.min(Math.round(optimal), maxSafe);
}

/**
 * Calculates optimal widths for all visible columns
 */
export function calculateAllOptimalWidths(visibleCols = [], units = [], allColumns = [], panelSizeMap, getUnitStatus) {
  const result = {};
  for (const c of visibleCols) {
    const colKey = c.key;
    result[colKey] = calculateOptimalColumnWidth(colKey, units, allColumns, panelSizeMap, getUnitStatus);
  }
  return result;
}
