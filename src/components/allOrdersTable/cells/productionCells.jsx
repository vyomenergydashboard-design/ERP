import WiremenMultiSelect from '../../WiremenMultiSelect';
import ProductionDateTimeCell from '../../ProductionDateTimeCell';

/**
 * Production columns: wiremen and the production / QC stage dates.
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export const PRODUCTION_CELL_KEYS = ['wiremen', 'mounting_start_date', 'mounting_complete_date', 'wiring_start_date', 'wiring_complete_date', 'pending_material_complete_date', 'handover_to_qc_date', 'qc_receiving_date', 'qc_start_date', 'qc_complete_date'];

export default function renderProductionCell({ colKey, unit, canEdit, onSaveInlineCell, wiremenList }) {
  switch (colKey) {
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
  }
}
