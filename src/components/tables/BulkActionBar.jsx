import React, { useEffect } from 'react';
import { CheckSquare, X, Download } from 'lucide-react';
import Button from '../common/Button';

/**
 * Enterprise BulkActionBar Component (ERPNext floating batch actions bar)
 */
export default function BulkActionBar({
  selectedCount = 0,
  totalCount = 0,
  onClearSelection,
  onSelectAllVisible = null,
  actions = null,
  className = '',
  style = {}
}) {
  useEffect(() => {
    if (selectedCount === 0) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClearSelection?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCount, onClearSelection]);

  if (selectedCount === 0) return null;

  return (
    <div
      role="toolbar"
      aria-label="Bulk actions toolbar"
      className={`erp-bulk-bar ${className}`}
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '6px 14px',
        background: 'var(--bg2, #1c202b)',
        border: '1px solid var(--blue, #3b82f6)',
        borderRadius: 24,
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45), 0 0 12px rgba(59, 130, 246, 0.25)',
        animation: 'vyomToastIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {/* Selection Counter Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
        <CheckSquare size={14} color="var(--blue, #3b82f6)" />
        <span>
          <strong style={{ color: 'var(--blue, #3b82f6)' }}>{selectedCount}</strong> {selectedCount === 1 ? 'item' : 'items'} selected
        </span>
      </div>

      <div style={{ width: 1, height: 16, background: 'var(--border, #2e3547)' }} />

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {actions}
      </div>

      <div style={{ width: 1, height: 16, background: 'var(--border, #2e3547)' }} />

      {/* Clear Selection Button */}
      <Button
        variant="ghost"
        size="xs"
        onClick={onClearSelection}
        icon={X}
        title="Deselect all (Esc)"
        style={{ color: 'var(--text3)' }}
      >
        Clear
      </Button>
    </div>
  );
}

