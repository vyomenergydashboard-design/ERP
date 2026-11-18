
/**
 * QC status column.
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export const QC_CELL_KEYS = ['qc_status'];

export default function renderQcCell({ colKey, unit, canEdit, onSaveInlineCell }) {
  switch (colKey) {
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
  }
}
