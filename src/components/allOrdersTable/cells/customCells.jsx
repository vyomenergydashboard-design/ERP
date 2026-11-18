import { formatCustomDate, formatCustomDateTime, formatDateTimeForInput, isDateTimeType, isDateType } from '../dates';

/**
 * Every column without a dedicated case: admin-defined custom columns and generic order / line-item fields (the original switch's default branch).
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export default function renderCustomCell({ colKey, unit, canEdit, customColumnDefs, editingCell, setEditingCell, onSaveInlineCell, effectiveUnitId }) {
  switch (colKey) {
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
