import { Trash2 } from 'lucide-react';
import PanelSizeComboboxCell from '../PanelSizeComboboxCell.jsx';

/**
 * Part number and panel attributes: panel code, size, IP rating, comments.
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export const PANEL_CELL_KEYS = ['part_number', 'panel_code', 'panel_type_size', 'panel_ip_rating', 'panel_comments'];

export default function renderPanelCell({ colKey, unit, canEditPanelSize, panelSizeMasters, panelSizeMap, onSaveInlineCell, onPartNumberClick, onDeletePanelSize }) {
  switch (colKey) {
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
  }
}
