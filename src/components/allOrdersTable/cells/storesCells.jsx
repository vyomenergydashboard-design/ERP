import { formatFastDate } from '../dates';

/**
 * Stores columns: tray status, tray start date and issued date.
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export const STORES_CELL_KEYS = ['tray_status', 'tray_start_date', 'issued_date'];

export default function renderStoresCell({ colKey, unit, canEdit, editingCell, setEditingCell, onSaveInlineCell, effectiveUnitId }) {
  switch (colKey) {
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
  }
}
