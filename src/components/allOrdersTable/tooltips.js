import { BASE_COLUMNS } from './columns';
import { formatFastDate, formatFastDateTime, isDateTimeType, isDateType } from './dates';

function getCellTooltip(unit, colKey, status, customColumnDefs = []) {
  if (!unit) return undefined;
  switch (colKey) {
    case 'order_number':
      return [
        `Order #: ${unit.order_number}`,
        unit.company_name ? `Client: ${unit.company_name}${unit.company_city ? ` (${unit.company_city})` : ''}` : null,
        unit.project_name ? `Project: ${unit.project_name}` : null,
        unit.po_number ? `PO Number: ${unit.po_number}` : null,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        'Click to view Process Flow'
      ].filter(Boolean).join('\n');

    case 'short_serial':
    case 'unit_serial':
      return [
        `Serial Number: ${unit.unit_serial || unit.short_serial}`,
        `Order #: ${unit.order_number}`,
        unit.company_name ? `Client: ${unit.company_name}` : null,
        unit.part_number ? `Part No: ${unit.part_number}` : null,
        unit.material_description ? `Description: ${unit.material_description}` : null,
        'Click to view Process Flow for this Serial No.'
      ].filter(Boolean).join('\n');

    case 'po_number': {
      const hasPo = Boolean(unit.po_number);
      const hasPdf = Boolean(unit.po_file_path);
      return [
        hasPo ? `PO Number: ${unit.po_number}` : 'PO Number: Not Assigned',
        unit.po_file_name ? `Attached File: ${unit.po_file_name}` : null,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        unit.company_name ? `Client: ${unit.company_name}` : null,
        hasPdf ? 'Click to open PO Document' : null
      ].filter(Boolean).join('\n');
    }

    case 'reference_number': {
      const ref = (unit.reference_number || '').trim();
      const tag = (unit.tag || '').trim();
      const combined = (ref && tag) ? `${ref}/${tag}` : (ref || tag || '');
      return [
        ref ? `Customer Ref: ${ref}` : null,
        tag ? `Tag: ${tag}` : null,
        (!ref && !tag && combined) ? `Ref/Tag: ${combined}` : null,
        (!ref && !tag && !combined) ? 'Reference / Tag: Not Specified' : null,
        unit.indent_file_name ? `Attached File: ${unit.indent_file_name}` : null,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        unit.indent_file_path ? 'Click to open Details document' : null
      ].filter(Boolean).join('\n');
    }

    case 'part_number':
      return [
        unit.part_number ? `Part Number: ${unit.part_number}` : 'Part Number: Not Assigned',
        unit.material_description ? `Description: ${unit.material_description}` : null,
        unit.panel_type_size ? `Size: ${unit.panel_type_size}` : null,
        `Order #: ${unit.order_number}`,
        'Click to view Design Drawings & Technical Documents'
      ].filter(Boolean).join('\n');

    case 'panel_code':
      return [
        unit.panel_code ? `Panel Code: ${unit.panel_code}` : 'Panel Code: None',
        unit.panel_type_size ? `Panel Size: ${unit.panel_type_size}` : null,
        unit.panel_ip_rating ? `IP Rating: ${unit.panel_ip_rating}` : null,
        unit.panel_comments ? `Comments: ${unit.panel_comments}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'panel_type_size':
      return [
        unit.panel_type_size ? `Panel Size: ${unit.panel_type_size}` : 'Panel Size: Not Selected',
        unit.panel_code ? `Panel Code: ${unit.panel_code}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'panel_ip_rating':
      return [
        unit.panel_ip_rating ? `IP Rating: ${unit.panel_ip_rating}` : 'IP Rating: Not Specified',
        unit.panel_type_size ? `Size: ${unit.panel_type_size}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'panel_comments':
      return [
        unit.panel_comments ? `Comments: ${unit.panel_comments}` : 'Comments: None',
        unit.panel_type_size ? `Size: ${unit.panel_type_size}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'company_name':
      return [
        unit.company_name ? `Client: ${unit.company_name}` : null,
        unit.company_city ? `City: ${unit.company_city}` : null,
        unit.end_client_name ? `End Client: ${unit.end_client_name}` : null,
        unit.project_name ? `Project: ${unit.project_name}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'classification':
      return [
        `Type (Design): ${unit.classification || 'Standard'}`,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
      ].filter(Boolean).join('\n');

    case 'priority':
      return [
        `Priority: ${unit.priority || 'Medium'}`,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
      ].filter(Boolean).join('\n');

    case 'delivery_date': {
      const isOverdue = unit.delivery_date && new Date(unit.delivery_date) < new Date() && status !== 'Completed' && status !== 'Cancelled';
      return [
        unit.delivery_date ? `Delivery Date: ${formatFastDate(unit.delivery_date)}` : 'Delivery Date: TBD',
        isOverdue ? 'Status: OVERDUE' : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');
    }

    case 'unit_status': {
      if (status === 'Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold')) {
        let holdStep = unit.hold_step_name || (unit.unit_status?.replace(/^Hold @\s*/i, '')) || '';
        if (holdStep.trim().toLowerCase() === 'hold' || holdStep.trim().toLowerCase() === 'current step') holdStep = '';
        return [
          holdStep ? `Status: On Hold @ ${holdStep}` : 'Status: On Hold',
          `Held by: ${unit.held_by_name || 'User'} on ${unit.held_at ? formatFastDateTime(unit.held_at) : 'N/A'}`,
          `Reason: ${unit.hold_reason || 'No reason specified'}`,
          `Order #: ${unit.order_number}`,
          unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
        ].filter(Boolean).join('\n');
      }
      if (status === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel')) {
        let cancelStep = unit.cancelled_step_name || (unit.unit_status?.replace(/^Cancelled @\s*/i, '')) || '';
        if (cancelStep.trim().toLowerCase() === 'cancelled' || cancelStep.trim().toLowerCase() === 'cancel' || cancelStep.trim().toLowerCase() === 'current step') cancelStep = '';
        return [
          cancelStep ? `Status: Cancelled @ ${cancelStep}` : 'Status: Cancelled',
          `Cancelled by: ${unit.cancelled_by_name || 'User'} on ${unit.cancelled_at ? formatFastDateTime(unit.cancelled_at) : 'N/A'}`,
          `Reason: ${unit.cancelled_reason || 'No reason specified'}`,
          `Order #: ${unit.order_number}`,
          unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
        ].filter(Boolean).join('\n');
      }
      return [
        `Status: ${status}`,
        unit.current_dept ? `Department: ${unit.current_dept}` : null,
        Number(unit.inprogress_step_count || 0) > 0 ? `${unit.inprogress_step_count} step(s) in progress` : null,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        unit.company_name ? `Client: ${unit.company_name}` : null
      ].filter(Boolean).join('\n');
    }

    case 'material_description':
      return [
        unit.material_description ? `Description: ${unit.material_description}` : 'Description: None',
        unit.part_number ? `Part No: ${unit.part_number}` : null,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
      ].filter(Boolean).join('\n');

    case 'project_name':
      return [
        unit.project_name ? `Project: ${unit.project_name}` : 'Project: None',
        unit.company_name ? `Client: ${unit.company_name}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'end_client_name':
      return [
        unit.end_client_name ? `End Client: ${unit.end_client_name}` : 'End Client: Unspecified',
        unit.company_name ? `Client: ${unit.company_name}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'wiremen': {
      const currentVal = unit.wiremen || unit.custom_fields?.wiremen || '';
      if (!currentVal) return 'Wiremen: Unassigned';
      const list = currentVal.split(',').map(s => s.trim()).filter(Boolean);
      if (list.length === 1) return `Wireman: ${list[0]}`;
      return `Assigned Wiremen (${list.length}):\n` + list.map((w, idx) => `${idx + 1}. ${w}`).join('\n');
    }

    case 'mounting_start_date':
    case 'mounting_complete_date':
    case 'wiring_start_date':
    case 'wiring_complete_date':
    case 'pending_material_complete_date':
    case 'handover_to_qc_date':
    case 'qc_receiving_date':
    case 'qc_start_date':
    case 'qc_complete_date': {
      const val = unit[colKey] || unit.custom_fields?.[colKey];
      const colLabel = BASE_COLUMNS.find(c => c.key === colKey)?.label || colKey;
      return [
        `${colLabel}: ${val ? formatFastDateTime(val) : 'Not Set'}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');
    }

    case 'dispatch_date':
    case 'invoice_date': {
      const val = unit[colKey] || unit.custom_fields?.[colKey];
      const colLabel = BASE_COLUMNS.find(c => c.key === colKey)?.label || colKey;
      return [
        `${colLabel}: ${val ? formatFastDate(val) : 'Not Set'}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');
    }

    case 'invoice_number': {
      const val = unit.invoice_number || unit.custom_fields?.invoice_number;
      return [
        `Invoice Number: ${val || 'Not Set'}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');
    }

    case 'qc_status': {
      const val = unit.qc_status || unit.custom_fields?.qc_status;
      return [
        `QC Status: ${val || 'Not Set'}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');
    }

    default: {
      const customCol = customColumnDefs?.find ? customColumnDefs.find(c => c.col_key === colKey) : customColumnDefs?.[colKey];
      const val = unit.custom_fields?.[colKey] ?? unit[colKey];
      if (customCol) {
        const displayVal = isDateTimeType(customCol.field_type) ? formatFastDateTime(val) : isDateType(customCol.field_type) ? formatFastDate(val) : (val || 'Not Specified');
        return [
          `${customCol.label || colKey}: ${displayVal}`,
          `Order #: ${unit.order_number}`
        ].filter(Boolean).join('\n');
      }
      return val ? String(val) : undefined;
    }
  }
}

export { getCellTooltip };
