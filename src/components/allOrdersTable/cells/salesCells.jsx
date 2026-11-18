import { Edit2, FileText, Trash2, UploadCloud } from 'lucide-react';
import { openUploadSafely } from '../uploads';

/**
 * Sales columns: panel PO number / PO document, and the reference / tag.
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export const SALES_CELL_KEYS = ['po_number', 'reference_number'];

export default function renderSalesCell({ colKey, unit, canEdit, canUploadPo, editingCell, setEditingCell, onSaveInlineCell, onSingleUnitPoClick, onDeleteUnitPoDoc, setPoPdfViewer, onEditRefTag, effectiveUnitId }) {
  switch (colKey) {
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
  }
}
