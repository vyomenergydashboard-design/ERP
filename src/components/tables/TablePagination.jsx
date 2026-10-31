import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Button from '../common/Button';

/**
 * Enterprise TablePagination Component (ERPNext style list footer)
 */
export default function TablePagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 50,
  pageSizeOptions = [25, 50, 100, 250],
  onPageChange,
  onPageSizeChange,
  className = '',
  style = {}
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(totalItems, currentPage * pageSize);

  return (
    <div
      className={`erp-table-pagination ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        padding: '6px 14px',
        background: 'var(--bg2, #1c202b)',
        borderTop: '1px solid var(--border, #2e3547)',
        fontSize: 12,
        color: 'var(--text3, #94a3b8)',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {/* Range Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>
          Showing <strong style={{ color: 'var(--text)' }}>{startItem}</strong> to{' '}
          <strong style={{ color: 'var(--text)' }}>{endItem}</strong> of{' '}
          <strong style={{ color: 'var(--text)' }}>{totalItems}</strong> entries
        </span>
      </div>

      {/* Page Size & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Page Size Selector */}
        {pageSizeOptions && onPageSizeChange && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              style={{
                height: 24,
                padding: '0 6px',
                fontSize: 11,
                fontFamily: 'inherit',
                fontWeight: 600,
                background: 'var(--bg3, #242937)',
                color: 'var(--text, #f1f5f9)',
                border: '1px solid var(--border, #2e3547)',
                borderRadius: 'var(--radius-sm, 4px)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Page Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onPageChange?.(1)}
            disabled={currentPage <= 1}
            title="First Page"
            icon={ChevronsLeft}
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage <= 1}
            title="Previous Page"
            icon={ChevronLeft}
          />

          <span style={{ padding: '0 6px', fontWeight: 600, color: 'var(--text)' }}>
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="ghost"
            size="xs"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage >= totalPages}
            title="Next Page"
            icon={ChevronRight}
          />
          <Button
            variant="ghost"
            size="xs"
            onClick={() => onPageChange?.(totalPages)}
            disabled={currentPage >= totalPages}
            title="Last Page"
            icon={ChevronsRight}
          />
        </div>
      </div>
    </div>
  );
}

