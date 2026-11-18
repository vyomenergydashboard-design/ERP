import ProductionDateTimeCell from '../../ProductionDateTimeCell';

/**
 * Dispatch and Accounts columns: dispatch date, invoice number and invoice date.
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export const DISPATCH_CELL_KEYS = ['dispatch_date', 'invoice_date', 'invoice_number'];

export default function renderDispatchCell({ colKey, unit, canEdit, editingCell, setEditingCell, onSaveInlineCell, effectiveUnitId }) {
  switch (colKey) {
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
  }
}
