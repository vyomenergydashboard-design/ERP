import { Check, Paperclip, Pause, X } from 'lucide-react';
import { formatFastDate, formatFastDateTime } from '../dates';

/**
 * Order and panel identity: order number, serial, client, Design type, priority, status, delivery date.
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export const ORDER_CELL_KEYS = ['order_number', 'short_serial', 'unit_serial', 'company_name', 'classification', 'priority', 'unit_status', 'delivery_date'];

export default function renderOrderCell({ colKey, unit, currentFilter, status, canEdit, canConfirmDesign, onConfirmDesignClassification, onUnconfirmDesignClassification, onRequestUnconfirmDesign, editingCell, setEditingCell, onRowClick, onSaveInlineCell, onOpenOrderDocs, priority, isOverdue, effectiveUnitId }) {
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
  }
}
