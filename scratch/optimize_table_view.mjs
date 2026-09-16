import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/components/AllOrdersTableView.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove duplicate renderCellContent
const startMark = '  const renderCellContent = (unit, colKey) => {';
const startIdx = content.indexOf(startMark);
if (startIdx !== -1) {
  const isLoadMark = '  if (isLoading) return (';
  const isLoadIdx = content.indexOf(isLoadMark, startIdx);
  if (isLoadIdx !== -1) {
    content = content.slice(0, startIdx) + content.slice(isLoadIdx);
    console.log('Removed duplicate renderCellContent successfully.');
  } else {
    console.error('Could not find isLoadMark');
  }
} else {
  console.log('startMark not found (might already be removed)');
}

// 2. Header checkbox update
const headerCbMark = 'title="Select / Deselect all visible serial numbers"';
const headerCbIdx = content.indexOf(headerCbMark);
if (headerCbIdx !== -1) {
  const inputStart = content.lastIndexOf('<input', headerCbIdx);
  const inputEnd = content.indexOf('/>', headerCbIdx) + 2;
  const newCheckbox = `<input
                  type="checkbox"
                  checked={displayedUnits.length > 0 && displayedUnits.every(u => selectedUnitIds.has(u.unit_id))}
                  ref={el => {
                    if (el) {
                      const hasSome = displayedUnits.some(u => selectedUnitIds.has(u.unit_id));
                      const hasAll = displayedUnits.length > 0 && displayedUnits.every(u => selectedUnitIds.has(u.unit_id));
                      el.indeterminate = hasSome && !hasAll;
                    }
                  }}
                  onChange={handleToggleSelectAll}
                  style={{ cursor: 'pointer', accentColor: 'var(--blue)', width: 14, height: 14 }}
                  title="Select / Deselect visible serial numbers"
                />`;
  content = content.slice(0, inputStart) + newCheckbox + content.slice(inputEnd);
  console.log('Updated header checkbox successfully.');
} else {
  console.log('headerCbMark not found');
}

// 3. Add Pagination Footer right after </table>
const tableEndTag = '</table>';
const tableEndIdx = content.indexOf(tableEndTag);
if (tableEndIdx !== -1) {
  const divCloseIdx = content.indexOf('</div>', tableEndIdx) + 6;
  const paginationFooter = `

      {/* ── Table Footer & Pagination ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        fontSize: '12px',
        color: 'var(--text2)',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>
            Showing <strong>{sorted.length === 0 ? 0 : (pageSize === 'all' ? 1 : (currentPage - 1) * pageSize + 1)}</strong>–
            <strong>{pageSize === 'all' ? sorted.length : Math.min(currentPage * pageSize, sorted.length)}</strong> of <strong>{sorted.length}</strong> serials
          </span>
          {selectedUnitIds.size > 0 && (
            <span style={{ color: 'var(--blue)', fontWeight: 600 }}>
              ({selectedUnitIds.size} selected)
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setPageSize(val);
                setCurrentPage(1);
              }}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: '12px',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <option value={50}>50</option>
              <option value={100}>100 (Default)</option>
              <option value={250}>250</option>
              <option value="all">All ({sorted.length})</option>
            </select>
          </div>

          {pageSize !== 'all' && totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: currentPage <= 1 ? 'var(--text3)' : 'var(--text)',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: currentPage <= 1 ? 0.4 : 1
                }}
              >
                ‹ Prev
              </button>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: currentPage >= totalPages ? 'var(--text3)' : 'var(--text)',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: currentPage >= totalPages ? 0.4 : 1
                }}
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </div>`;
  content = content.slice(0, divCloseIdx) + paginationFooter + content.slice(divCloseIdx);
  console.log('Added pagination footer successfully.');
} else {
  console.error('Could not find tableEndTag');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('All remaining optimizations applied!');
