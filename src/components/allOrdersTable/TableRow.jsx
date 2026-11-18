import { memo } from 'react';
import { DEFAULT_COL_WIDTHS } from '../tableColumnSizing';
import { TEXT_WRAPPABLE_COLS } from './columns';
import { isDateTimeType } from './dates';
import renderCellContent from './renderCellContent.jsx';
import { getCellTooltip } from './tooltips';

const TableRow = memo(function TableRow({
  isActiveRow,
  onRowClickHighlight,
  unit,
  idx,
  currentFilter,
  showSelection = false,
  isSelected,
  status,
  visibleCols,
  columnWidths,
  pinnedKeys,
  stickyLeftMap,
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
  onRowMouseDown,
  onRowMouseEnter,
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
  wiremenList
}) {
  const isAltRow = idx % 2 !== 0;
  const isCancelled = status === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel');
  const isHold = status === 'Hold' || status === 'On Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold');

  const baseBg = isAltRow ? 'var(--bg2)' : 'var(--bg)';
  const defaultBg = isSelected
    ? 'var(--row-selected-bg, #122038)'
    : isActiveRow
      ? (isCancelled ? 'var(--row-cancelled-active-bg, #fed7d7)' : isHold ? 'var(--row-hold-active-bg, #fde68a)' : 'var(--row-active-bg, #e0f2fe)')
      : isCancelled
        ? 'var(--row-cancelled-bg, #221417)'
        : isHold
          ? (isAltRow ? 'var(--row-hold-bg-alt, #2c2214)' : 'var(--row-hold-bg, #241c10)')
          : baseBg;

  const borderBottomColor = isCancelled
    ? 'rgba(239, 68, 68, 0.45)'
    : isHold
      ? 'rgba(245, 158, 11, 0.45)'
      : (isSelected ? 'rgba(59, 130, 246, 0.4)' : 'var(--border)');

  const rowClass = [
    isCancelled ? 'row-cancelled' : '',
    isHold ? 'row-hold' : '',
    isSelected ? 'row-selected' : '',
    isActiveRow ? 'row-active' : ''
  ].filter(Boolean).join(' ');

  const checkboxBg = isSelected
    ? 'var(--row-selected-bg, #122038)'
    : defaultBg;

  return (
    <tr
      className={rowClass}
      style={{
        background: defaultBg,
        cursor: 'pointer',
        borderBottom: `1px solid ${borderBottomColor}`,
      }}
      onClick={(e) => onRowClickHighlight(unit.unit_id, e)}
      onMouseEnter={(e) => onRowMouseEnter(unit.unit_id, idx, e)}
    >
      {/* Row Index / Selection Cell — Spreadsheet Values Column */}
      <td
        className="erp-td-idx"
        style={{
          position: 'sticky',
          left: 0,
          zIndex: 4,
          width: showSelection ? 68 : 58,
          minWidth: showSelection ? 68 : 58,
          maxWidth: showSelection ? 68 : 58,
          padding: '4px 2px',
          textAlign: 'center',
          verticalAlign: 'middle',
          userSelect: 'none',
          cursor: showSelection ? 'pointer' : 'default',
          borderLeft: isSelected ? '4px solid var(--blue)' : (isCancelled ? '4px solid var(--red)' : isHold ? '4px solid var(--orange)' : '4px solid transparent'),
        }}
        title={showSelection ? (isSelected ? "Click to deselect row (or drag to deselect range)" : "Click to select row (or drag to select range)") : `Row ${idx + 1}`}
        onMouseDown={showSelection ? ((e) => onRowMouseDown(unit.unit_id, idx, e)) : undefined}
      >
        {showSelection ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => { }}
              style={{ cursor: 'pointer', accentColor: 'var(--blue)', width: 13, height: 13, pointerEvents: 'none' }}
            />
            <span style={{ fontSize: 11, opacity: 0.9 }}>{idx + 1}</span>
          </div>
        ) : (
          <span style={{ fontSize: 11.5 }}>{idx + 1}</span>
        )}
      </td>

      {visibleCols.map((c, colIdx) => {
        const colKey = c.key;
        const defaultWidth = DEFAULT_COL_WIDTHS[colKey] || (isDateTimeType(c.fieldType) ? 175 : 120);
        const width = columnWidths[colKey] || defaultWidth;
        const pinned = pinnedKeys.includes(colKey);
        const lastPin = pinned && pinnedKeys[pinnedKeys.length - 1] === colKey;

        let pinnedBg = baseBg;
        if (isSelected) {
          pinnedBg = 'var(--row-selected-bg, #122038)';
        } else if (isActiveRow) {
          pinnedBg = isCancelled ? 'var(--row-cancelled-active-bg, #fed7d7)' : isHold ? 'var(--row-hold-active-bg, #fde68a)' : 'var(--row-active-bg, #e0f2fe)';
        } else if (isCancelled) {
          pinnedBg = 'var(--row-cancelled-bg, #221417)';
        } else if (isHold) {
          pinnedBg = isAltRow ? 'var(--row-hold-bg-alt, #2c2214)' : 'var(--row-hold-bg, #241c10)';
        }

        const borderLeftStyle = (!showSelection && colIdx === 0)
          ? (isSelected ? '5px solid var(--blue)' : isActiveRow ? '5px solid var(--blue)' : (isCancelled ? '5px solid var(--red)' : isHold ? '5px solid var(--orange)' : '5px solid transparent'))
          : undefined;

        const isTextWrappable = TEXT_WRAPPABLE_COLS.has(colKey);

        return (
          <td
            key={colKey}
            className={`erp-td${pinned ? ' pinned' : ''}${lastPin ? ' last-pinned' : ''}`}
            onMouseEnter={(e) => {
              e.currentTarget.title = getCellTooltip(unit, colKey, status, customColumnDefs, panelSizeMap);
            }}
            style={{
              width,
              minWidth: width,
              maxWidth: width,
              boxSizing: 'border-box',
              overflow: isTextWrappable ? 'visible' : 'hidden',
              textOverflow: isTextWrappable ? 'clip' : 'ellipsis',
              wordBreak: isTextWrappable ? 'normal' : 'keep-all',
              overflowWrap: isTextWrappable ? 'break-word' : 'normal',
              whiteSpace: isTextWrappable ? 'normal' : 'nowrap',
              verticalAlign: 'middle',
              position: pinned ? 'sticky' : 'relative',
              left: pinned ? `${stickyLeftMap[colKey]}px` : undefined,
              zIndex: pinned ? 3 : 1,
              background: pinned ? pinnedBg : undefined,
              borderLeft: borderLeftStyle,
              borderRight: lastPin ? '2px solid var(--blue, #3b82f6)' : '1px solid var(--border-grid, var(--border))',
              borderBottom: '1px solid var(--border-grid, var(--border))',
              textAlign: c.align || 'left'
            }}
          >
            {renderCellContent({
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
              wiremenList
            })}
          </td>
        );
      })}
      <td className="erp-td erp-td-filler" />
    </tr>
  );
}, (prevProps, nextProps) => {
  if (prevProps.isActiveRow !== nextProps.isActiveRow) return false;
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.unit !== nextProps.unit) return false;
  if (prevProps.currentFilter !== nextProps.currentFilter) return false;
  if (prevProps.idx !== nextProps.idx) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.columnWidths !== nextProps.columnWidths) return false;
  if (prevProps.visibleCols !== nextProps.visibleCols) return false;
  if (prevProps.pinnedKeys !== nextProps.pinnedKeys) return false;
  if (prevProps.panelSizeMasters !== nextProps.panelSizeMasters) return false;
  if (prevProps.customColumnDefs !== nextProps.customColumnDefs) return false;
  if (prevProps.canEdit !== nextProps.canEdit) return false;
  if (prevProps.canEditPurchaseNA !== nextProps.canEditPurchaseNA) return false;
  if (prevProps.canEditPanelSize !== nextProps.canEditPanelSize) return false;
  if (prevProps.purchaseOrdersBySerialAndCat !== nextProps.purchaseOrdersBySerialAndCat) return false;
  if (prevProps.wiremenList !== nextProps.wiremenList) return false;

  const unitId = prevProps.unit.unit_id || prevProps.unit.id;
  const prevEditing = prevProps.editingCell && prevProps.editingCell.unitId === unitId;
  const nextEditing = nextProps.editingCell && nextProps.editingCell.unitId === unitId;
  if (prevEditing !== nextEditing || (prevEditing && prevProps.editingCell !== nextProps.editingCell)) return false;

  return true;
});

export default TableRow;
