import { memo, useState } from 'react';
import { PackageCheck, X } from 'lucide-react';

const StoresBatchTrayStatusBar = memo(function StoresBatchTrayStatusBar({
  selectedCount,
  onClearSelection,
  onBatchTrayStatus,
  isUpdating
}) {
  const [selectedStatus, setSelectedStatus] = useState('');

  const handleChange = (e) => {
    const status = e.target.value;
    if (!status) return;
    setSelectedStatus('');
    onBatchTrayStatus(status);
  };

  return (
    <div
      style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '3px 8px',
        borderRadius: 8,
        border: '1px solid rgba(245, 158, 11, 0.35)',
        backgroundColor: 'rgba(245, 158, 11, 0.08)',
        boxShadow: '0 0 12px rgba(245, 158, 11, 0.15)',
        transition: 'all 0.18s ease'
      }}
      title="Batch update Tray Status for selected serial numbers"
    >
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--amber, #f59e0b)',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-sm, 4px)',
          padding: '3px 8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5
        }}
      >
        <PackageCheck size={13} style={{ flexShrink: 0 }} />
        <span>{selectedCount} serial{selectedCount > 1 ? 's' : ''} selected</span>
        <button
          type="button"
          onClick={onClearSelection}
          title="Deselect all (or double-press Esc)"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <X size={12} />
        </button>
      </span>

      <select
        value={selectedStatus}
        onChange={handleChange}
        disabled={isUpdating}
        style={{
          height: 30,
          padding: '0 8px',
          fontSize: 12,
          fontWeight: 600,
          background: 'var(--bg3)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm, 4px)',
          outline: 'none',
          cursor: isUpdating ? 'wait' : 'pointer'
        }}
        title="Choose a status to apply to all selected serials"
      >
        <option value="">Set Tray Status for all...</option>
        <option value="Not Started">Not Started</option>
        <option value="In Process">In Process</option>
        <option value="Partial Ready">Partial Ready</option>
        <option value="Full Ready">Full Ready</option>
        <option value="Partial Issued">Partial Issued</option>
        <option value="All Issued">All Issued</option>
      </select>
    </div>
  );
});

export default StoresBatchTrayStatusBar;
