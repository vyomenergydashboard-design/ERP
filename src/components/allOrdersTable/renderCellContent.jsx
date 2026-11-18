import { Check, Edit2, FileText, Paperclip, Pause, Trash2, UploadCloud, X } from 'lucide-react';
import WiremenMultiSelect from '../WiremenMultiSelect';
import ProductionDateTimeCell from '../ProductionDateTimeCell';
import { formatCustomDate, formatCustomDateTime, formatDateTimeForInput, formatFastDate, formatFastDateTime, isDateTimeType, isDateType } from './dates';
import PanelSizeComboboxCell from './PanelSizeComboboxCell.jsx';
import { PRIORITY_STYLES, STATUS_STYLES } from './statusStyles';
import { openUploadSafely } from './uploads';

function renderCellContent({
  unit,
  colKey,
  currentFilter,
  status,
  canEdit,
  canEditPanelSize,
  canUploadPo,
  canConfirmDesign,
  onConfirmDesignClassification,
  onUnconfirmDesignClassification,
  onRequestUnconfirmDesign,
  panelSizeMasters,
  panelSizeMap,
  customColumnDefs,
  editingCell,
  setEditingCell,
  onRowClick,
  onSaveInlineCell,
  onSingleUnitPoClick,
  onDeleteUnitPoDoc,
  onPartNumberClick,
  setPoPdfViewer,
  onEditRefTag,
  onOpenOrderDocs,
  onDeletePanelSize,
  purchaseOrdersBySerialAndCat,
  canEditPurchaseNA,
  onTogglePurchaseCatNA,
  wiremenList = []
}) {
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['In Progress'];
  const priority = unit.priority || 'Medium';
  const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
  const isOverdue = unit.delivery_date && new Date(unit.delivery_date) < new Date() && status !== 'Completed' && status !== 'Cancelled';
  const effectiveUnitId = unit.unit_id || unit.id;

  switch (colKey) {
    case 'order_number': {
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>
          <span
            className="erp-order-badge"
            style={{ whiteSpace: 'nowrap', wordBreak: 'keep-all', flexShrink: 0 }}
            onClick={(e) => { e.stopPropagation(); onRowClick(unit.order_id, effectiveUnitId); }}
          >
            {unit.order_number}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenOrderDocs?.({
                orderId: unit.order_id,
                orderNumber: unit.order_number,
                clientName: unit.company_name,
                projectName: unit.project_name
              });
            }}
            title={`Order Documents (${unit.order_number}) - Click to open Quotation, Details & Docs`}
            style={{
              background: 'var(--blue-dim)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              cursor: 'pointer',
              padding: '2px 4px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--blue)',
              borderRadius: 'var(--radius-sm, 4px)',
              transition: 'all 0.15s',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.22)';
              e.currentTarget.style.borderColor = 'var(--blue)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--blue-dim)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
            }}
          >
            <Paperclip size={11} />
          </button>
        </div>
      );
    }

    case 'short_serial':
    case 'unit_serial': {
      return (
        <div
          onClick={(e) => { e.stopPropagation(); onRowClick(unit.order_id, effectiveUnitId); }}
          style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <span className="erp-serial-badge">
            {unit.unit_serial}
          </span>
        </div>
      );
    }

    case 'company_name': {
      return (
        <div
          style={{ overflowWrap: 'break-word', wordBreak: 'normal', whiteSpace: 'normal', lineHeight: 1.3 }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{unit.company_name || '—'}</span>
          {unit.company_city && <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 11, marginLeft: 4 }}>· {unit.company_city}</span>}
        </div>
      );
    }

    case 'classification': {
      const clsVal = unit.classification || 'Standard';
      const isConfirmed = Boolean(unit.design_confirmed);
      const isStd = clsVal.toLowerCase() === 'standard';
      const isDesign = (currentFilter || '').toLowerCase() === 'design';
      const groupCls = `design-type-control-group ${isStd ? 'standard' : 'non-standard'}${isDesign && isConfirmed ? ' is-confirmed' : ''}${!isDesign ? ' plain' : ''}`;

      return (
        <div
          className={groupCls}
          onClick={(e) => e.stopPropagation()}
        >
          {canEdit ? (
            <select
              value={clsVal}
              onChange={(e) => onSaveInlineCell(unit, 'classification', e.target.value)}
              className="design-type-select"
              title="Panel Design Classification (Standard / Non-Standard)"
            >
              <option value="Standard" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>Standard</option>
              <option value="Non-Standard" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>Non-Standard</option>
            </select>
          ) : (
            <span
              className="design-type-static-label"
              title="Panel Design Classification"
            >
              {clsVal}
            </span>
          )}

          {isDesign && (
            isConfirmed ? (
              <button
                type="button"
                className={`btn-confirmed-indicator${canConfirmDesign ? ' can-reset' : ''}`}
                title={unit.design_confirmed_at ? `Confirmed by ${unit.design_confirmed_by_name || 'Design'} on ${formatFastDateTime(unit.design_confirmed_at)}${canConfirmDesign ? ' (Click to reset sign-off)' : ''}` : `Confirmed by Design${canConfirmDesign ? ' (Click to reset sign-off)' : ''}`}
                onClick={() => {
                  if (canConfirmDesign) {
                    if (onRequestUnconfirmDesign) {
                      onRequestUnconfirmDesign(unit);
                    } else {
                      onUnconfirmDesignClassification?.(unit);
                    }
                  }
                }}
              >
                <Check size={11} strokeWidth={2.8} />
                <span>Confirmed</span>
              </button>
            ) : canConfirmDesign ? (
              <button
                type="button"
                className="btn-confirm-action"
                onClick={() => onConfirmDesignClassification?.(unit)}
                title="Click to sign off & confirm Design classification"
              >
                <span>Confirm</span>
              </button>
            ) : (
              <span
                className="design-unconfirmed-indicator"
                title="Awaiting Design Confirmation"
              >
                Unconfirmed
              </span>
            )
          )}
        </div>
      );
    }

    case 'priority': {
      const pLower = (priority || 'medium').toLowerCase();
      if (canEdit) {
        return (
          <select
            value={priority}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSaveInlineCell(unit, 'priority', e.target.value)}
            className={`erp-priority-select ${pLower}`}
          >
            <option value="Urgent" style={{ background: 'var(--bg3)', color: 'var(--red)' }}>Urgent</option>
            <option value="High" style={{ background: 'var(--bg3)', color: 'var(--orange)' }}>High</option>
            <option value="Medium" style={{ background: 'var(--bg3)', color: '#eab308' }}>Medium</option>
            <option value="Low" style={{ background: 'var(--bg3)', color: 'var(--blue)' }}>Low</option>
          </select>
        );
      }
      return (
        <span className={`erp-priority-pill ${pLower}`}>
          {priority}
        </span>
      );
    }

    case 'unit_status': {
      if (status === 'Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold')) {
        let holdStep = unit.hold_step_name || (unit.unit_status?.replace(/^Hold @\s*/i, '')) || '';
        if (holdStep.trim().toLowerCase() === 'hold' || holdStep.trim().toLowerCase() === 'current step') holdStep = '';
        return (
          <span className="erp-status-pill hold">
            <Pause size={10} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }} /> {holdStep ? `Hold @ ${holdStep}` : 'On Hold'}
          </span>
        );
      }
      if (status === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel')) {
        let cancelStep = unit.cancelled_step_name || (unit.unit_status?.replace(/^Cancelled @\s*/i, '')) || '';
        if (cancelStep.trim().toLowerCase() === 'cancelled' || cancelStep.trim().toLowerCase() === 'cancel' || cancelStep.trim().toLowerCase() === 'current step') cancelStep = '';
        return (
          <span className="erp-status-pill cancelled">
            <X size={10} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }} /> {cancelStep ? `Cancelled @ ${cancelStep}` : 'Cancelled'}
          </span>
        );
      }

      const stLower = String(status).toLowerCase();
      let statusClass = 'pending';
      let icon = '●';
      if (stLower === 'done' || stLower === 'completed' || stLower === 'complete') {
        statusClass = 'completed';
        icon = '✓';
      } else if (stLower === 'inprogress' || stLower === 'in progress' || stLower === 'in process' || stLower === 'review') {
        statusClass = 'inprogress';
        icon = '●';
      } else if (stLower === 'blocked') {
        statusClass = 'blocked';
        icon = '⚠';
      }

      return (
        <span className={`erp-status-pill ${statusClass}`}>
          <span>{icon}</span> {status}
        </span>
      );
    }

    case 'tray_status': {
      const currentVal = unit.tray_status || unit.custom_fields?.tray_status || 'Not Started';
      const stLower = String(currentVal).toLowerCase().replace(/\s+/g, '');

      let bg = 'rgba(249, 115, 22, 0.12)';
      let color = 'var(--amber, #f59e0b)';
      let border = 'rgba(249, 115, 22, 0.3)';

      if (stLower === 'inprocess' || stLower === 'inprogress') {
        bg = 'rgba(56, 189, 248, 0.12)';
        color = 'var(--blue, #38bdf8)';
        border = 'rgba(56, 189, 248, 0.3)';
      } else if (stLower === 'partialready') {
        bg = 'rgba(20, 184, 166, 0.12)';
        color = 'var(--teal, #14b8a6)';
        border = 'rgba(20, 184, 166, 0.3)';
      } else if (stLower === 'fullready' || stLower === 'ready' || stLower === 'completed' || stLower === 'done') {
        bg = 'rgba(16, 185, 129, 0.12)';
        color = 'var(--green, #10b981)';
        border = 'rgba(16, 185, 129, 0.3)';
      } else if (stLower === 'partialissued' || stLower === 'issued') {
        bg = 'rgba(168, 85, 247, 0.12)';
        color = 'var(--purple, #a855f7)';
        border = 'rgba(168, 85, 247, 0.3)';
      } else if (stLower === 'allissued') {
        bg = 'rgba(139, 92, 246, 0.18)';
        color = '#c084fc';
        border = 'rgba(139, 92, 246, 0.35)';
      }

      if (canEdit) {
        return (
          <select
            value={currentVal}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSaveInlineCell(unit, 'tray_status', e.target.value)}
            style={{
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 'var(--radius-sm, 4px)',
              background: bg,
              color: color,
              border: `1px solid ${border}`,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="Not Started" style={{ background: 'var(--bg3)', color: 'var(--amber, #f59e0b)' }}>Not Started</option>
            <option value="In Process" style={{ background: 'var(--bg3)', color: 'var(--blue, #38bdf8)' }}>In Process</option>
            <option value="Partial Ready" style={{ background: 'var(--bg3)', color: 'var(--teal, #14b8a6)' }}>Partial Ready</option>
            <option value="Full Ready" style={{ background: 'var(--bg3)', color: 'var(--green, #10b981)' }}>Full Ready</option>
            <option value="Partial Issued" style={{ background: 'var(--bg3)', color: 'var(--purple, #a855f7)' }}>Partial Issued</option>
            <option value="All Issued" style={{ background: 'var(--bg3)', color: '#c084fc' }}>All Issued</option>
          </select>
        );
      }

      return (
        <span
          style={{
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 'var(--radius-sm, 4px)',
            background: bg,
            color: color,
            border: `1px solid ${border}`,
            display: 'inline-block'
          }}
        >
          {currentVal}
        </span>
      );
    }

    case 'tray_start_date':
    case 'issued_date': {
      const isEditingThisDate = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === colKey;
      const currentVal = unit[colKey] || unit.custom_fields?.[colKey] || '';

      if (isEditingThisDate) {
        return (
          <input
            type="date"
            autoFocus
            ref={(el) => {
              if (el && typeof el.showPicker === 'function') {
                try { el.showPicker(); } catch (_) { }
              }
            }}
            onClick={(e) => {
              if (e.target.showPicker) {
                try { e.target.showPicker(); } catch (_) { }
              }
            }}
            value={currentVal ? String(currentVal).split('T')[0] : ''}
            onChange={(e) => onSaveInlineCell(unit, colKey, e.target.value)}
            onBlur={() => setEditingCell(null)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveInlineCell(unit, colKey, e.target.value);
              if (e.key === 'Escape') setEditingCell(null);
            }}
            style={{
              padding: '2px 4px', fontSize: 11, background: 'var(--bg3)',
              color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4,
              cursor: 'pointer'
            }}
          />
        );
      }

      return (
        <span
          onClick={(e) => {
            if (canEdit) {
              e.stopPropagation();
              if (colKey === 'issued_date' && !unit.tray_start_date && !unit.custom_fields?.tray_start_date) {
                onSaveInlineCell(unit, 'issued_date', '');
                return;
              }
              setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
            }
          }}
          style={{
            color: currentVal ? 'var(--text2)' : 'var(--text3)',
            fontSize: 12,
            fontFamily: currentVal ? 'var(--font-mono)' : 'inherit',
            cursor: canEdit ? 'pointer' : 'default'
          }}
          title={canEdit ? 'Click to edit date' : undefined}
        >
          {formatFastDate(currentVal)}
        </span>
      );
    }

    case 'wiremen': {
      const currentVal = unit.wiremen || unit.custom_fields?.wiremen || '';
      return (
        <WiremenMultiSelect
          value={currentVal}
          wiremenList={wiremenList}
          canEdit={canEdit}
          onSave={(newVal) => onSaveInlineCell(unit, 'wiremen', newVal)}
        />
      );
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
      const currentVal = unit[colKey] || unit.custom_fields?.[colKey] || '';
      const colLabels = {
        mounting_start_date: 'Mounting Start Date',
        mounting_complete_date: 'Mounting Complete',
        wiring_start_date: 'Wiring Start',
        wiring_complete_date: 'Wiring Complete',
        pending_material_complete_date: 'Pending Material Complete',
        handover_to_qc_date: 'Handover to QC',
        qc_receiving_date: 'QC Receiving Date',
        qc_start_date: 'QC Start Date',
        qc_complete_date: 'QC Complete Date'
      };
      return (
        <ProductionDateTimeCell
          value={currentVal}
          label={colLabels[colKey] || colKey}
          canEdit={canEdit}
          onSave={(newIso) => onSaveInlineCell(unit, colKey, newIso)}
        />
      );
    }

    case 'dispatch_date':
    case 'invoice_date': {
      const currentVal = unit[colKey] || unit.custom_fields?.[colKey] || '';
      const colLabels = {
        dispatch_date: 'Dispatch Date',
        invoice_date: 'Invoice Date'
      };
      return (
        <ProductionDateTimeCell
          value={currentVal}
          label={colLabels[colKey] || colKey}
          canEdit={canEdit}
          dateOnly={true}
          placeholder="+ Set Date"
          title={`Click to edit ${colLabels[colKey] || colKey}`}
          onSave={(newVal) => onSaveInlineCell(unit, colKey, newVal)}
        />
      );
    }

    case 'invoice_number': {
      const isEditingThis = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === 'invoice_number';
      const currentVal = unit.invoice_number || unit.custom_fields?.invoice_number || '';

      if (isEditingThis) {
        return (
          <input
            autoFocus
            type="text"
            defaultValue={editingCell.value !== undefined ? editingCell.value : currentVal}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={() => onSaveInlineCell(unit, 'invoice_number', editingCell.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveInlineCell(unit, 'invoice_number', editingCell.value);
              if (e.key === 'Escape') setEditingCell(null);
            }}
            style={{
              padding: '3px 8px',
              fontSize: 12,
              background: 'var(--bg3)',
              color: 'var(--text)',
              border: '1px solid var(--blue)',
              borderRadius: 4,
              width: '90%',
              maxWidth: 140,
              textAlign: 'center',
              outline: 'none'
            }}
            placeholder="INV-XXXX"
          />
        );
      }

      return (
        <span
          onClick={(e) => {
            if (canEdit) {
              e.stopPropagation();
              setEditingCell({ unitId: effectiveUnitId, colKey: 'invoice_number', value: currentVal });
            }
          }}
          title={canEdit ? 'Click to edit Invoice Number' : (currentVal || 'No invoice number')}
          style={{
            cursor: canEdit ? 'pointer' : 'default',
            color: currentVal ? 'var(--text)' : 'var(--text3)',
            fontWeight: currentVal ? 600 : 400,
            fontSize: 12,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2px 8px',
            borderRadius: 4,
            background: currentVal ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
            border: currentVal ? '1px solid rgba(56, 189, 248, 0.2)' : '1px dashed rgba(255, 255, 255, 0.1)',
            minWidth: 70
          }}
        >
          {currentVal || '—'}
        </span>
      );
    }

    case 'qc_status': {
      const currentVal = unit.qc_status || unit.custom_fields?.qc_status || '';
      const stNorm = String(currentVal).trim().toLowerCase().replace(/\s+/g, '');

      let bg = 'rgba(100, 116, 139, 0.12)';
      let color = '#94a3b8';
      let border = 'rgba(100, 116, 139, 0.3)';

      if (stNorm === 'labeling') {
        bg = 'rgba(249, 115, 22, 0.12)';
        color = 'var(--amber, #f59e0b)';
        border = 'rgba(249, 115, 22, 0.3)';
      } else if (stNorm === 'wirechecking') {
        bg = 'rgba(20, 184, 166, 0.12)';
        color = 'var(--teal, #14b8a6)';
        border = 'rgba(20, 184, 166, 0.3)';
      } else if (stNorm === 'inprocess' || stNorm === 'inprogress') {
        bg = 'rgba(56, 189, 248, 0.12)';
        color = 'var(--blue, #38bdf8)';
        border = 'rgba(56, 189, 248, 0.3)';
      } else if (stNorm === 'fatcompleted') {
        bg = 'rgba(16, 185, 129, 0.12)';
        color = 'var(--green, #10b981)';
        border = 'rgba(16, 185, 129, 0.3)';
      } else if (stNorm === 'handovertopacking') {
        bg = 'rgba(168, 85, 247, 0.12)';
        color = 'var(--purple, #a855f7)';
        border = 'rgba(168, 85, 247, 0.3)';
      }

      if (canEdit) {
        return (
          <select
            value={currentVal || ''}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSaveInlineCell(unit, 'qc_status', e.target.value)}
            style={{
              padding: '2px 8px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 'var(--radius-sm, 4px)',
              background: bg,
              color: color,
              border: `1px solid ${border}`,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="" style={{ background: 'var(--bg3)', color: '#94a3b8' }}>— Select QC Status —</option>
            <option value="Labeling" style={{ background: 'var(--bg3)', color: 'var(--amber, #f59e0b)' }}>Labeling</option>
            <option value="WireChecking" style={{ background: 'var(--bg3)', color: 'var(--teal, #14b8a6)' }}>WireChecking</option>
            <option value="In Process" style={{ background: 'var(--bg3)', color: 'var(--blue, #38bdf8)' }}>In Process</option>
            <option value="FAT Completed" style={{ background: 'var(--bg3)', color: 'var(--green, #10b981)' }}>FAT Completed</option>
            <option value="Handover to packing" style={{ background: 'var(--bg3)', color: 'var(--purple, #a855f7)' }}>Handover to packing</option>
          </select>
        );
      }

      return (
        <span
          style={{
            display: 'inline-block',
            padding: '2px 8px',
            fontSize: 11,
            fontWeight: 600,
            borderRadius: 'var(--radius-sm, 4px)',
            background: bg,
            color: color,
            border: `1px solid ${border}`
          }}
        >
          {currentVal || '—'}
        </span>
      );
    }

    case 'delivery_date':
      const isEditingDate = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === 'delivery_date';
      if (isEditingDate) {
        return (
          <input
            type="date"
            autoFocus
            value={unit.delivery_date ? unit.delivery_date.split('T')[0] : ''}
            onChange={(e) => onSaveInlineCell(unit, 'delivery_date', e.target.value)}
            onBlur={() => setEditingCell(null)}
            style={{
              padding: '2px 4px', fontSize: 11, background: 'var(--bg3)',
              color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4
            }}
          />
        );
      }

      return (
        <span
          onClick={(e) => {
            if (canEdit) {
              e.stopPropagation();
              setEditingCell({ unitId: effectiveUnitId, colKey: 'delivery_date', value: unit.delivery_date });
            }
          }}
          style={{
            color: isOverdue ? 'var(--red)' : 'var(--text2)',
            fontWeight: isOverdue ? 600 : 400,
            fontSize: 12,
            cursor: canEdit ? 'pointer' : 'default'
          }}
        >
          {formatFastDate(unit.delivery_date)}
          {isOverdue && <span style={{ fontSize: 9, color: 'var(--red)', fontWeight: 700, marginLeft: 5, background: 'var(--red-dim)', borderRadius: 'var(--radius-sm, 4px)', padding: '1px 5px' }}>OVERDUE</span>}
        </span>
      );

    case 'part_number': {
      const hasPart = Boolean(unit.part_number);

      return (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onPartNumberClick(unit);
          }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            color: hasPart ? 'var(--blue)' : 'var(--text3)',
            cursor: 'pointer',
            textDecoration: hasPart ? 'underline' : 'none',
            whiteSpace: 'nowrap',
            wordBreak: 'keep-all'
          }}
        >
          {unit.part_number || '—'}
        </span>
      );
    }

    case 'panel_code': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMap?.get ? panelSizeMap.get(currentSize) : panelSizeMasters.find(m =>
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const code = unit.panel_code || master?.panel_code;

      return code ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--purple)',
              background: 'var(--purple-dim)',
              border: '1px solid rgba(168, 85, 247, 0.28)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm, 4px)',
              display: 'inline-block'
            }}
          >
            {code}
          </span>
          {canEditPanelSize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePanelSize?.(unit);
              }}
              title="Remove Panel Size, Code & IP Rating"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
                color: 'var(--text3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm, 4px)',
                opacity: 0.5,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'var(--red-dim)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.background = 'none'; }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ) : (
        <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
      );
    }

    case 'panel_type_size':
      return (
        <PanelSizeComboboxCell
          unit={unit}
          panelSizeMasters={panelSizeMasters}
          canEdit={canEditPanelSize}
          onSave={(newSize) => onSaveInlineCell(unit, 'panel_type_size', newSize)}
          onDelete={onDeletePanelSize}
        />
      );

    case 'panel_ip_rating': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMap?.get ? panelSizeMap.get(currentSize) : panelSizeMasters.find(m =>
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const ip = unit.panel_ip_rating || master?.ip_rating;
      return ip ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--green)',
              background: 'var(--green-dim)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm, 4px)',
              display: 'inline-block'
            }}
          >
            {ip}
          </span>
          {canEditPanelSize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePanelSize?.(unit);
              }}
              title="Remove Panel Size, Code & IP Rating"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
                color: 'var(--text3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm, 4px)',
                opacity: 0.5,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'var(--red-dim)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.background = 'none'; }}
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      ) : (
        <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
      );
    }

    case 'panel_comments': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMap?.get ? panelSizeMap.get(currentSize) : panelSizeMasters.find(m =>
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const comment = unit.panel_comments || master?.comments || master?.description;
      return comment ? (
        <span style={{ color: 'var(--text2)', fontSize: 12 }}>
          {comment}
        </span>
      ) : (
        <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
      );
    }

    case 'po_number': {
      const hasPoNum = Boolean(unit.po_number);
      const hasPdf = Boolean(unit.po_file_path);

      const poTooltip = [
        unit.po_number ? `PO Number: ${unit.po_number}` : 'PO Number: Not Assigned',
        unit.po_file_name ? `Attached File: ${unit.po_file_name}` : null,
        unit.order_number ? `Order #: ${unit.order_number}` : null,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        unit.company_name ? `Client: ${unit.company_name}` : null,
        hasPdf ? 'Click to view PO in PDF' : (canUploadPo ? 'Click to edit PO / Upload' : null)
      ].filter(Boolean).join('\n');

      if (editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === 'po_number') {
        return (
          <input
            autoFocus
            defaultValue={editingCell.value || ''}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={() => onSaveInlineCell(unit, 'po_number', editingCell.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveInlineCell(unit, 'po_number', editingCell.value);
              if (e.key === 'Escape') setEditingCell(null);
            }}
            style={{
              width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
              color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
            }}
          />
        );
      }

      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%' }} title={poTooltip}>
          {hasPoNum ? (
            hasPdf ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPoPdfViewer({
                    unit: unit,
                    file_path: unit.po_file_path,
                    file_name: unit.po_file_name || `${unit.po_number}.pdf`,
                    title: `PO Document - ${unit.po_number}`,
                    subtitle: `Serial: ${unit.short_serial || unit.unit_serial} | Order: ${unit.order_number}`
                  });
                }}
                title={poTooltip}
                style={{
                  background: 'var(--blue-dim)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: 'var(--radius-sm, 4px)',
                  padding: '2px 7px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  color: 'var(--blue)',
                  fontSize: 12,
                  fontWeight: 600,
                  flex: '1 1 auto',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <FileText size={12} style={{ flexShrink: 0 }} />
                <span style={{ textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {unit.po_number}
                </span>
              </button>
            ) : (
              <span
                title={poTooltip}
                onClick={(e) => {
                  if (canUploadPo) {
                    e.stopPropagation();
                    setEditingCell({ unitId: effectiveUnitId, colKey: 'po_number', value: unit.po_number });
                  }
                }}
                style={{
                  fontSize: 12,
                  color: 'var(--text)',
                  cursor: canUploadPo ? 'pointer' : 'default',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500
                }}
              >
                {unit.po_number}
              </span>
            )
          ) : (
            <span
              onClick={(e) => {
                if (canUploadPo) {
                  e.stopPropagation();
                  setEditingCell({ unitId: effectiveUnitId, colKey: 'po_number', value: '' });
                }
              }}
              style={{ fontSize: 12, color: 'var(--text3)', cursor: canUploadPo ? 'pointer' : 'default' }}
              title={poTooltip}
            >
              —
            </span>
          )}

          {canUploadPo && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSingleUnitPoClick(unit);
                }}
                title={hasPoNum ? (hasPdf ? "Change PO / Re-upload PDF for this serial" : "Upload PDF for this PO") : "Enter PO & Upload PDF for this serial"}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 2,
                  cursor: 'pointer',
                  color: 'var(--text3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  opacity: 0.7
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.opacity = '0.7'; }}
              >
                <UploadCloud size={12} />
              </button>
              {hasPdf && onDeleteUnitPoDoc && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteUnitPoDoc(unit);
                  }}
                  title="Delete attached PO PDF (keeps PO Number as text)"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 2,
                    cursor: 'pointer',
                    color: 'var(--text3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.opacity = '0.7'; }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    case 'reference_number': {
      const ref = (unit.reference_number || '').trim();
      const tag = (unit.tag || '').trim();
      const combinedVal = (ref && tag) ? `${ref}/${tag}` : (ref || tag || '');
      const hasIndentDoc = Boolean(unit.indent_file_path);

      const refTooltip = [
        unit.reference_number ? `Customer Ref: ${unit.reference_number}` : null,
        unit.tag ? `Tag: ${unit.tag}` : null,
        (!unit.reference_number && !unit.tag && combinedVal) ? `Ref/Tag: ${combinedVal}` : null,
        (!unit.reference_number && !unit.tag && !combinedVal) ? 'Reference / Tag: Not Specified' : null,
        unit.indent_file_name ? `Attached File: ${unit.indent_file_name}` : null,
        unit.order_number ? `Order #: ${unit.order_number}` : null,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        hasIndentDoc ? 'Click to open Details document' : (canEdit ? 'Click to edit Reference & Tag' : null)
      ].filter(Boolean).join('\n');

      if (hasIndentDoc) {
        const isPdf = String(unit.indent_file_path).toLowerCase().endsWith('.pdf') || String(unit.indent_file_name || '').toLowerCase().endsWith('.pdf');
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 5, width: '100%', minWidth: 0 }} title={refTooltip}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (setPoPdfViewer) {
                  setPoPdfViewer({
                    file_path: unit.indent_file_path,
                    file_name: unit.indent_file_name || `Details_${combinedVal || unit.order_number}.pdf`,
                    title: `Details - ${combinedVal || unit.order_number}`,
                    subtitle: `Order: ${unit.order_number}${unit.company_name ? ` · ${unit.company_name}` : ''}`
                  });
                } else {
                  openUploadSafely(unit.indent_file_path);
                }
              }}
              title={refTooltip}
              style={{
                background: 'var(--orange-dim)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                borderRadius: 'var(--radius-sm, 4px)',
                padding: '2px 7px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                color: 'var(--accent)',
                fontSize: 12,
                fontWeight: 600,
                flex: '1 1 auto',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <FileText size={12} style={{ flexShrink: 0 }} />
              <span style={{ textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {combinedVal || 'Details'}
              </span>
            </button>
            {canEdit && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRefTag ? onEditRefTag(unit) : setEditingCell({ unitId: effectiveUnitId, colKey: 'reference_number', value: unit.reference_number || '' });
                }}
                title="Edit Reference & Tag (Serial numbers unchanged)"
                style={{ color: 'var(--text3)', cursor: 'pointer', opacity: 0.5, flexShrink: 0, padding: '2px', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--blue)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text3)'; }}
              >
                <Edit2 size={11} />
              </span>
            )}
          </div>
        );
      }

      return (
        <span
          onClick={(e) => {
            if (canEdit) {
              e.stopPropagation();
              onEditRefTag ? onEditRefTag(unit) : setEditingCell({ unitId: effectiveUnitId, colKey: 'reference_number', value: unit.reference_number || '' });
            }
          }}
          title={refTooltip}
          style={{
            color: 'var(--accent)',
            fontSize: 12,
            fontWeight: combinedVal ? 600 : 400,
            cursor: canEdit ? 'pointer' : 'default',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '100%'
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{combinedVal || '—'}</span>
          {canEdit && (
            <span
              style={{ color: 'var(--text3)', opacity: 0.6, flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '1px' }}
              title="Edit Ref & Tag"
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text3)'; }}
            >
              <Edit2 size={10} />
            </span>
          )}
        </span>
      );
    }

    case 'purchase_cat_panel':
    case 'purchase_cat_automation':
    case 'purchase_cat_low_voltage':
    case 'purchase_cat_wires': {
      const catKeyMap = {
        purchase_cat_panel: 'Panel',
        purchase_cat_automation: 'Automation',
        purchase_cat_low_voltage: 'Low voltage',
        purchase_cat_wires: 'Wires & Accessories'
      };
      const catKey = catKeyMap[colKey] || 'Panel';
      const sn = String(unit.unit_serial || unit.short_serial || unit.unit_id || '').trim();
      const lookupKey = `${sn}__${catKey}`.toLowerCase();
      const shortLookupKey = `${sn.slice(-4)}__${catKey}`.toLowerCase();
      const matched = (purchaseOrdersBySerialAndCat?.get(lookupKey) || purchaseOrdersBySerialAndCat?.get(shortLookupKey) || []);

      if (!matched || matched.length === 0) {
        const isNA = unit.custom_fields?.[colKey] === 'NA';
        const userCanToggle = Boolean(canEditPurchaseNA || canEdit);

        if (isNA) {
          return (
            <div
              onClick={(e) => {
                if (userCanToggle && onTogglePurchaseCatNA) {
                  e.stopPropagation();
                  onTogglePurchaseCatNA(unit, colKey);
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: userCanToggle ? 'pointer' : 'default',
                width: '100%',
                userSelect: 'none'
              }}
              title={userCanToggle ? `Marked Not Applicable · Click to revert to Pending (—)` : 'Not Applicable for this unit'}
            >
              <button
                type="button"
                onClick={(e) => {
                  if (userCanToggle && onTogglePurchaseCatNA) {
                    e.stopPropagation();
                    onTogglePurchaseCatNA(unit, colKey);
                  }
                }}
                disabled={!userCanToggle}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono, monospace)',
                  background: 'rgba(148, 163, 184, 0.12)',
                  color: 'var(--text3)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  cursor: userCanToggle ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
                title={userCanToggle ? `Marked Not Applicable · Click to revert to Pending (—)` : 'Not Applicable for this unit'}
              >
                N/A
              </button>
            </div>
          );
        }

        return (
          <div
            onClick={(e) => {
              if (userCanToggle && onTogglePurchaseCatNA) {
                e.stopPropagation();
                onTogglePurchaseCatNA(unit, colKey);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: userCanToggle ? 'pointer' : 'default',
              userSelect: 'none',
              width: '100%'
            }}
            title={userCanToggle ? `Click to mark ${catKey} as Not Applicable (N/A)` : undefined}
          >
            <span style={{ color: 'var(--text3)', fontSize: '12px' }}>—</span>
            {userCanToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTogglePurchaseCatNA) {
                    onTogglePurchaseCatNA(unit, colKey);
                  }
                }}
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'var(--bg3)',
                  color: 'var(--text3)',
                  border: '1px dashed var(--border)',
                  cursor: 'pointer',
                  opacity: 0.7,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.borderColor = 'var(--blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.color = 'var(--text3)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                title={`Mark ${catKey} as Not Applicable (N/A)`}
              >
                + N/A
              </button>
            )}
          </div>
        );
      }

      // 1. Earliest PO Creation Date
      const createdDates = matched
        .map(p => p.createdDate || p.createdAt || p.date)
        .filter(Boolean)
        .map(d => new Date(d))
        .filter(d => !isNaN(d.getTime()));

      const firstCreatedDate = createdDates.length > 0
        ? new Date(Math.min(...createdDates.map(d => d.getTime())))
        : null;

      // 2. Received Date: when ALL POs are closed, the latest closed date
      const isClosedStatus = (status) => {
        const s = String(status || '').trim().toLowerCase();
        return s === 'po closed' || s === 'closed';
      };
      const allClosed = matched.length > 0 && matched.every(p => isClosedStatus(p.status));

      let lastReceivedDate = null;
      if (allClosed) {
        const receivedDates = matched
          .map(p => p.receivedDate || p.dateReceived || p.receivedAt || p.createdDate || p.date)
          .filter(Boolean)
          .map(d => new Date(d))
          .filter(d => !isNaN(d.getTime()));

        if (receivedDates.length > 0) {
          lastReceivedDate = new Date(Math.max(...receivedDates.map(d => d.getTime())));
        }
      }

      const firstDateStr = firstCreatedDate ? formatFastDate(firstCreatedDate) : '—';
      const secondDateStr = allClosed && lastReceivedDate ? formatFastDate(lastReceivedDate) : '—';

      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 24,
            fontSize: '11px',
            fontFamily: 'var(--font-mono, monospace)',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle'
          }}
          title={`PO Created: ${firstDateStr}\nReceived: ${secondDateStr} (${allClosed ? 'All POs Closed' : 'Pending / Open POs'})\nLinked POs: ${matched.length}`}
        >
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>{firstDateStr}</span>
          <span style={{ color: allClosed ? 'var(--green)' : 'var(--text3)', fontSize: '10px', opacity: 0.9 }}>
            {allClosed ? '✓ Closed' : '· Pending'}
          </span>
        </div>
      );
    }

    default:
      const customCol = customColumnDefs?.find(c => c.col_key === colKey);
      if (customCol) {
        const isEditingThis = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === colKey;
        const currentVal = unit.custom_fields?.[colKey] ?? '';

        if (isEditingThis) {
          if (customCol.field_type === 'Yes/No') {
            return (
              <select
                autoFocus
                value={editingCell.value || 'No'}
                onChange={(e) => onSaveInlineCell(unit, colKey, e.target.value)}
                onBlur={() => setEditingCell(null)}
                style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                  background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--blue)', outline: 'none'
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            );
          }
          if (isDateTimeType(customCol.field_type)) {
            const editVal = editingCell.value !== undefined ? editingCell.value : (currentVal ? formatDateTimeForInput(currentVal) : '');
            const handleCommit = (valToCommit) => {
              const raw = valToCommit !== undefined ? valToCommit : editVal;
              let finalIso = null;
              if (raw) {
                const d = new Date(raw);
                finalIso = isNaN(d.getTime()) ? null : d.toISOString();
              }
              onSaveInlineCell(unit, colKey, finalIso);
            };
            return (
              <input
                type="datetime-local"
                autoFocus
                value={editVal}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onBlur={() => handleCommit(editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCommit(editingCell.value);
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                style={{
                  width: '100%', padding: '2px 6px', fontSize: 11, background: 'var(--bg3)',
                  color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none',
                  fontFamily: 'var(--font-mono)'
                }}
              />
            );
          }
          if (isDateType(customCol.field_type)) {
            return (
              <input
                type="date"
                autoFocus
                value={editingCell.value ? String(editingCell.value).split('T')[0] : ''}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                style={{
                  width: '100%', padding: '2px 6px', fontSize: 11, background: 'var(--bg3)',
                  color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
                }}
              />
            );
          }
          if (customCol.field_type === 'Number') {
            return (
              <input
                type="number"
                autoFocus
                value={editingCell.value}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                style={{
                  width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
                  color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
                }}
              />
            );
          }
          return (
            <input
              type="text"
              autoFocus
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
                if (e.key === 'Escape') setEditingCell(null);
              }}
              style={{
                width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
                color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
              }}
            />
          );
        }

        if (isDateTimeType(customCol.field_type)) {
          return (
            <span
              onClick={(e) => {
                if (canEdit) {
                  e.stopPropagation();
                  setEditingCell({ unitId: effectiveUnitId, colKey, value: formatDateTimeForInput(currentVal) });
                }
              }}
              style={{ cursor: canEdit ? 'pointer' : 'default', fontSize: 11.5, fontFamily: 'var(--font-mono)', color: 'var(--text2)', whiteSpace: 'nowrap' }}
              title={canEdit ? 'Click to edit date & time' : undefined}
            >
              {formatCustomDateTime(currentVal)}
            </span>
          );
        }
        if (isDateType(customCol.field_type)) {
          return (
            <span
              onClick={(e) => {
                if (canEdit) {
                  e.stopPropagation();
                  setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
                }
              }}
              style={{ cursor: canEdit ? 'pointer' : 'default', fontSize: 11, color: 'var(--text2)' }}
              title={canEdit ? 'Click to edit' : undefined}
            >
              {formatCustomDate(currentVal)}
            </span>
          );
        }
        if (customCol.field_type === 'Yes/No') {
          const isYes = String(currentVal).toLowerCase() === 'yes';
          return (
            <span
              onClick={(e) => {
                if (canEdit) {
                  e.stopPropagation();
                  setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
                }
              }}
              style={{
                cursor: canEdit ? 'pointer' : 'default',
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm, 4px)',
                fontSize: 11,
                fontWeight: 600,
                background: isYes ? 'var(--green-dim)' : 'var(--red-dim)',
                color: isYes ? 'var(--green)' : 'var(--red)'
              }}
            >
              {currentVal}
            </span>
          );
        }

        return (
          <span
            onClick={(e) => {
              if (canEdit) {
                e.stopPropagation();
                setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
              }
            }}
            style={{ cursor: canEdit ? 'pointer' : 'default', fontSize: 12 }}
            title={canEdit ? 'Click to edit' : undefined}
          >
            {String(currentVal)}
          </span>
        );
      }

      const isEditingThis = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === colKey;
      const currentVal = unit[colKey] || '';

      if (isEditingThis) {
        return (
          <input
            type="text"
            autoFocus
            value={editingCell.value}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
              if (e.key === 'Escape') setEditingCell(null);
            }}
            style={{
              width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
              color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
            }}
          />
        );
      }

      const isEditableTextCol = ['project_name', 'end_client_name', 'material_description'].includes(colKey);
      const colLabel = customCol ? (customCol.label || colKey) : (colKey === 'material_description' ? 'Description' : colKey === 'project_name' ? 'Project' : colKey === 'end_client_name' ? 'End Client' : colKey);
      const textTooltip = [
        currentVal ? `${colLabel}: ${currentVal}` : `${colLabel}: Not Specified`,
        unit.order_number ? `Order #: ${unit.order_number}` : null,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        canEdit && isEditableTextCol ? '(Click to edit)' : null
      ].filter(Boolean).join('\n');

      const isWrappableText = ['project_name', 'end_client_name', 'material_description', 'panel_comments'].includes(colKey);

      return (
        <span
          onClick={(e) => {
            if (canEdit && isEditableTextCol) {
              e.stopPropagation();
              setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
            }
          }}
          title={textTooltip}
          style={{
            color: colKey === 'project_name' ? '#38bdf8' : 'var(--text2)',
            fontSize: 12,
            cursor: canEdit && isEditableTextCol ? 'pointer' : 'default',
            display: 'block',
            overflow: isWrappableText ? 'visible' : 'hidden',
            textOverflow: isWrappableText ? 'clip' : 'ellipsis',
            whiteSpace: isWrappableText ? 'normal' : 'nowrap',
            wordBreak: isWrappableText ? 'normal' : 'keep-all',
            overflowWrap: isWrappableText ? 'break-word' : 'normal',
            lineHeight: 1.3
          }}
        >
          {currentVal || '—'}
        </span>
      );
  }
}

export default renderCellContent;
