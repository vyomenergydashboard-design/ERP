import { formatFastDate } from '../dates';

/**
 * Purchase category columns (vendor PO status per category, or NA).
 * Called by renderCellContent (../renderCellContent.jsx) with the same arguments it received plus
 * the values it computes up front; the case blocks below are moved there unchanged.
 */
export const PURCHASE_CELL_KEYS = ['purchase_cat_panel', 'purchase_cat_automation', 'purchase_cat_low_voltage', 'purchase_cat_wires'];

export default function renderPurchaseCell({ colKey, unit, canEdit, purchaseOrdersBySerialAndCat, canEditPurchaseNA, onTogglePurchaseCatNA }) {
  switch (colKey) {
    case 'purchase_cat_panel':
    case 'purchase_cat_automation':
    case 'purchase_cat_low_voltage':
    case 'purchase_cat_wires': {
      const catKeyMap = {
        purchase_cat_panel: 'Panel',
        purchase_cat_automation: 'Automation',
        purchase_cat_low_voltage: 'Low voltage',
        purchase_cat_wires: 'Wires & Accessories'
      };
      const catKey = catKeyMap[colKey] || 'Panel';
      const sn = String(unit.unit_serial || unit.short_serial || unit.unit_id || '').trim();
      const lookupKey = `${sn}__${catKey}`.toLowerCase();
      const shortLookupKey = `${sn.slice(-4)}__${catKey}`.toLowerCase();
      const matched = (purchaseOrdersBySerialAndCat?.get(lookupKey) || purchaseOrdersBySerialAndCat?.get(shortLookupKey) || []);

      if (!matched || matched.length === 0) {
        const isNA = unit.custom_fields?.[colKey] === 'NA';
        const userCanToggle = Boolean(canEditPurchaseNA || canEdit);

        if (isNA) {
          return (
            <div
              onClick={(e) => {
                if (userCanToggle && onTogglePurchaseCatNA) {
                  e.stopPropagation();
                  onTogglePurchaseCatNA(unit, colKey);
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: userCanToggle ? 'pointer' : 'default',
                width: '100%',
                userSelect: 'none'
              }}
              title={userCanToggle ? `Marked Not Applicable · Click to revert to Pending (—)` : 'Not Applicable for this unit'}
            >
              <button
                type="button"
                onClick={(e) => {
                  if (userCanToggle && onTogglePurchaseCatNA) {
                    e.stopPropagation();
                    onTogglePurchaseCatNA(unit, colKey);
                  }
                }}
                disabled={!userCanToggle}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono, monospace)',
                  background: 'rgba(148, 163, 184, 0.12)',
                  color: 'var(--text3)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  cursor: userCanToggle ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
                title={userCanToggle ? `Marked Not Applicable · Click to revert to Pending (—)` : 'Not Applicable for this unit'}
              >
                N/A
              </button>
            </div>
          );
        }

        return (
          <div
            onClick={(e) => {
              if (userCanToggle && onTogglePurchaseCatNA) {
                e.stopPropagation();
                onTogglePurchaseCatNA(unit, colKey);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: userCanToggle ? 'pointer' : 'default',
              userSelect: 'none',
              width: '100%'
            }}
            title={userCanToggle ? `Click to mark ${catKey} as Not Applicable (N/A)` : undefined}
          >
            <span style={{ color: 'var(--text3)', fontSize: '12px' }}>—</span>
            {userCanToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTogglePurchaseCatNA) {
                    onTogglePurchaseCatNA(unit, colKey);
                  }
                }}
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'var(--bg3)',
                  color: 'var(--text3)',
                  border: '1px dashed var(--border)',
                  cursor: 'pointer',
                  opacity: 0.7,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.borderColor = 'var(--blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.color = 'var(--text3)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                title={`Mark ${catKey} as Not Applicable (N/A)`}
              >
                + N/A
              </button>
            )}
          </div>
        );
      }

      // 1. Earliest PO Creation Date
      const createdDates = matched
        .map(p => p.createdDate || p.createdAt || p.date)
        .filter(Boolean)
        .map(d => new Date(d))
        .filter(d => !isNaN(d.getTime()));

      const firstCreatedDate = createdDates.length > 0
        ? new Date(Math.min(...createdDates.map(d => d.getTime())))
        : null;

      // 2. Received Date: when ALL POs are closed, the latest closed date
      const isClosedStatus = (status) => {
        const s = String(status || '').trim().toLowerCase();
        return s === 'po closed' || s === 'closed';
      };
      const allClosed = matched.length > 0 && matched.every(p => isClosedStatus(p.status));

      let lastReceivedDate = null;
      if (allClosed) {
        const receivedDates = matched
          .map(p => p.receivedDate || p.dateReceived || p.receivedAt || p.createdDate || p.date)
          .filter(Boolean)
          .map(d => new Date(d))
          .filter(d => !isNaN(d.getTime()));

        if (receivedDates.length > 0) {
          lastReceivedDate = new Date(Math.max(...receivedDates.map(d => d.getTime())));
        }
      }

      const firstDateStr = firstCreatedDate ? formatFastDate(firstCreatedDate) : '—';
      const secondDateStr = allClosed && lastReceivedDate ? formatFastDate(lastReceivedDate) : '—';

      return (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            height: 24,
            fontSize: '11px',
            fontFamily: 'var(--font-mono, monospace)',
            whiteSpace: 'nowrap',
            verticalAlign: 'middle'
          }}
          title={`PO Created: ${firstDateStr}\nReceived: ${secondDateStr} (${allClosed ? 'All POs Closed' : 'Pending / Open POs'})\nLinked POs: ${matched.length}`}
        >
          <span style={{ color: 'var(--text)', fontWeight: 500 }}>{firstDateStr}</span>
          <span style={{ color: allClosed ? 'var(--green)' : 'var(--text3)', fontSize: '10px', opacity: 0.9 }}>
            {allClosed ? '✓ Closed' : '· Pending'}
          </span>
        </div>
      );
    }
  }
}
