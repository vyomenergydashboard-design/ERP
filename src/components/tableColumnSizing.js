/**
 * tableColumnSizing.js
 * 
 * Modular layout and column sizing utilities for AllOrdersTableView.
 * Follows AGENTS.md monolithic decomposition guardrail and Impeccable spatial rhythm.
 * 
 * Calibrated to snugly hug cell content and column headers without wasteful empty voids.
 */

export const DEFAULT_COL_WIDTHS = {
  order_number: 88,
  short_serial: 82,
  company_name: 150,
  project_name: 110,
  po_number: 85,
  reference_number: 85,
  end_client_name: 95,
  part_number: 105,
  panel_code: 85,
  panel_type_size: 115,
  panel_ip_rating: 78,
  panel_comments: 120,
  material_description: 150,
  classification: 135,
  priority: 80,
  delivery_date: 95,
  unit_status: 105,
  purchase_cat_panel: 110,
  purchase_cat_automation: 115,
  purchase_cat_low_voltage: 115,
  purchase_cat_wires: 120,
  tray_status: 95,
  tray_start_date: 95,
  issued_date: 95,
  wiremen: 110,
  mounting_start_date: 142,
  mounting_complete_date: 142,
  wiring_start_date: 142,
  wiring_complete_date: 142,
  pending_material_complete_date: 155,
  handover_to_qc_date: 142,
};

export const MIN_COL_WIDTHS = {
  order_number: 75,
  short_serial: 72,
  company_name: 95,
  project_name: 80,
  po_number: 70,
  reference_number: 70,
  end_client_name: 75,
  part_number: 80,
  panel_code: 65,
  panel_type_size: 85,
  panel_ip_rating: 60,
  panel_comments: 80,
  material_description: 90,
  classification: 110,
  priority: 65,
  delivery_date: 75,
  unit_status: 80,
  purchase_cat_panel: 85,
  purchase_cat_automation: 90,
  purchase_cat_low_voltage: 90,
  purchase_cat_wires: 95,
  tray_status: 75,
  tray_start_date: 75,
  issued_date: 75,
  wiremen: 85,
  mounting_start_date: 125,
  mounting_complete_date: 125,
  wiring_start_date: 125,
  wiring_complete_date: 125,
  pending_material_complete_date: 135,
  handover_to_qc_date: 125,
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

  // Exact header width requirement:
  // drag handle (10px) + gap (3px) + text + sort icon (12px) + gap (3px) + pin button (16px) + th padding (16px) + buffer (6px) = 56px
  const headerTextWidth = estimateTextWidth(label, false, 11);
  const headerTotal = headerTextWidth + 56;

  // Measure content from sample units
  const sampleUnits = units.slice(0, 100);
  let maxContentWidth = 0;

  for (const u of sampleUnits) {
    const text = getCellSampleText(u, colKey, panelSizeMap, getUnitStatus);
    if (!text || text === '—') continue;

    let w = estimateTextWidth(text, isMono, isMono ? 11.5 : 12);

    // Realistic element accessory widths (icons, pills, badges)
    if (colKey === 'order_number') {
      w += 28; // badge padding + paperclip button
    } else if (colKey === 'short_serial' || colKey === 'unit_serial') {
      w += 16; // badge padding (0 8px)
    } else if (colKey === 'classification') {
      w += 36; // dropdown chevron + confirm button badge
    } else if (colKey === 'priority' || colKey === 'unit_status') {
      w += 20; // pill padding & dot
    } else if (colKey === 'wiremen') {
      w += 22; // icon + count chip
    } else if (colKey === 'po_number' || colKey === 'reference_number') {
      w += 20; // upload cloud / edit icon
    } else if (colKey.startsWith('purchase_cat_')) {
      w = Math.max(w, 110);
    }

    if (w > maxContentWidth) {
      maxContentWidth = w;
    }
  }

  // Cell padding: 8px left + 8px right = 16px + 2px buffer
  const cellTotal = maxContentWidth > 0 ? maxContentWidth + 18 : 0;

  const minSafe = MIN_COL_WIDTHS[colKey] || 80;
  const maxSafe = 450;

  // Optimal width is strictly the larger of header requirement or content requirement
  // (NO defWidth floor, so empty or short columns can snugly hug their headers without empty space!)
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
