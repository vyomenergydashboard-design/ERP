import { PRIORITY_STYLES, STATUS_STYLES } from './statusStyles';
import renderOrderCell, { ORDER_CELL_KEYS } from './cells/orderCells.jsx';
import renderSalesCell, { SALES_CELL_KEYS } from './cells/salesCells.jsx';
import renderPanelCell, { PANEL_CELL_KEYS } from './cells/panelCells.jsx';
import renderPurchaseCell, { PURCHASE_CELL_KEYS } from './cells/purchaseCells.jsx';
import renderStoresCell, { STORES_CELL_KEYS } from './cells/storesCells.jsx';
import renderProductionCell, { PRODUCTION_CELL_KEYS } from './cells/productionCells.jsx';
import renderQcCell, { QC_CELL_KEYS } from './cells/qcCells.jsx';
import renderDispatchCell, { DISPATCH_CELL_KEYS } from './cells/dispatchCells.jsx';
import renderCustomCell from './cells/customCells.jsx';

// colKey -> renderer for the columns that have a dedicated case; every other column (custom
// columns and generic fields) goes to renderCustomCell, as the old switch's default branch did.
const CELL_RENDERERS = new Map([
  ...ORDER_CELL_KEYS.map((key) => [key, renderOrderCell]),
  ...SALES_CELL_KEYS.map((key) => [key, renderSalesCell]),
  ...PANEL_CELL_KEYS.map((key) => [key, renderPanelCell]),
  ...PURCHASE_CELL_KEYS.map((key) => [key, renderPurchaseCell]),
  ...STORES_CELL_KEYS.map((key) => [key, renderStoresCell]),
  ...PRODUCTION_CELL_KEYS.map((key) => [key, renderProductionCell]),
  ...QC_CELL_KEYS.map((key) => [key, renderQcCell]),
  ...DISPATCH_CELL_KEYS.map((key) => [key, renderDispatchCell]),
]);

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

  const ctx = {
    unit, colKey, currentFilter, status, canEdit, canEditPanelSize,
    canUploadPo, canConfirmDesign, onConfirmDesignClassification, onUnconfirmDesignClassification, onRequestUnconfirmDesign, panelSizeMasters,
    panelSizeMap, customColumnDefs, editingCell, setEditingCell, onRowClick, onSaveInlineCell,
    onSingleUnitPoClick, onDeleteUnitPoDoc, onPartNumberClick, setPoPdfViewer, onEditRefTag, onOpenOrderDocs,
    onDeletePanelSize, purchaseOrdersBySerialAndCat, canEditPurchaseNA, onTogglePurchaseCatNA, wiremenList, statusStyle,
    priority, priorityStyle, isOverdue, effectiveUnitId,
  };
  const renderCell = CELL_RENDERERS.get(colKey) || renderCustomCell;
  return renderCell(ctx);
}

export default renderCellContent;
