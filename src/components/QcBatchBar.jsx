import React, { useState, memo } from 'react';
import { Calendar, Users, X, Check, CheckCircle2 } from 'lucide-react';

/**
 * QcBatchBar
 * High-density toolbar action bar when rows are selected in QC department view.
 * 
 * Supports:
 * 1. Visual indicator of number of selected serials.
 * 2. Instant "Clear Selection" (X button).
 * 3. Quick batch date applicator for all 3 QC date milestones (Receiving, Start, Complete).
 * 4. Quick batch status applicator for the 5 QC stages.
 * 5. Clear guidance that editing any cell in the table also syncs all selected serials.
 */
export const QcBatchBar = memo(function QcBatchBar({
  selectedCount = 0,
  onClearSelection,
  onBatchSetDate,
  onBatchSetStatus
}) {
  const [selectedCol, setSelectedCol] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const QC_DATE_COLUMNS = [
    { key: 'qc_receiving_date', label: 'QC Receiving Date' },
    { key: 'qc_start_date', label: 'QC Start Date' },
    { key: 'qc_complete_date', label: 'QC Complete Date' },
  ];

  const QC_STATUS_OPTIONS = [
    'Labeling',
    'WireChecking',
    'In Process',
    'FAT Completed',
    'Handover to packing'
  ];

  const handleApplyDate = () => {
    if (!selectedCol) return;
    if (!selectedDateTime) {
      onBatchSetDate?.(selectedCol, null);
    } else {
      const d = new Date(selectedDateTime);
      const iso = isNaN(d.getTime()) ? null : d.toISOString();
      onBatchSetDate?.(selectedCol, iso);
    }
    setSelectedCol('');
    setSelectedDateTime('');
  };

  const handleClearDate = () => {
    if (!selectedCol) return;
    onBatchSetDate?.(selectedCol, null);
    setSelectedCol('');
    setSelectedDateTime('');
  };

  const handleApplyStatus = () => {
    if (!selectedStatus) return;
    onBatchSetStatus?.(selectedStatus);
    setSelectedStatus('');
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
        border: '1px solid rgba(56, 189, 248, 0.35)',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        boxShadow: '0 0 12px rgba(56, 189, 248, 0.15)',
        transition: 'all 0.18s ease'
      }}
      title="Batch update QC dates and status for selected serial numbers"
    >
      {/* Selected count pill */}
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'var(--blue, #38bdf8)',
          background: 'rgba(56, 189, 248, 0.15)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: 'var(--radius-sm, 4px)',
          padding: '3px 8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5
        }}
      >
        <Users size={13} style={{ flexShrink: 0 }} />
        <span>{selectedCount} serial{selectedCount > 1 ? 's' : ''} selected</span>
        <button
          type="button"
          onClick={onClearSelection}
          title="Deselect all (or double-press Esc)"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'inherit',
            padding: 0,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <X size={12} />
        </button>
      </span>

      {/* Quick date applicator dropdown */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <select
          value={selectedCol}
          onChange={(e) => setSelectedCol(e.target.value)}
          style={{
            height: 24,
            padding: '0 6px',
            fontSize: 11,
            fontWeight: 500,
            borderRadius: 4,
            background: 'var(--bg3)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">Set QC Date...</option>
          {QC_DATE_COLUMNS.map(c => (
            <option key={c.key} value={c.key}>{c.label}</option>
          ))}
        </select>

        {selectedCol && (
          <>
            <input
              type="datetime-local"
              value={selectedDateTime}
              onChange={(e) => setSelectedDateTime(e.target.value)}
              style={{
                height: 24,
                padding: '0 6px',
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                background: 'var(--bg3)',
                color: 'var(--text)',
                border: '1px solid var(--blue)',
                borderRadius: 4,
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <button
              type="button"
              onClick={handleApplyDate}
              title={`Apply to all ${selectedCount} selected serials`}
              style={{
                height: 24,
                padding: '0 8px',
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 4,
                background: 'var(--blue)',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Check size={11} strokeWidth={2.5} />
              <span>Apply</span>
            </button>
            <button
              type="button"
              onClick={handleClearDate}
              title={`Clear date for all ${selectedCount} selected serials`}
              style={{
                height: 24,
                padding: '0 6px',
                fontSize: 10.5,
                fontWeight: 500,
                borderRadius: 4,
                background: 'rgba(239, 68, 68, 0.12)',
                color: 'var(--red, #ef4444)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          </>
        )}
      </div>

      {/* Quick QC Status applicator dropdown */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{
            height: 24,
            padding: '0 6px',
            fontSize: 11,
            fontWeight: 500,
            borderRadius: 4,
            background: 'var(--bg3)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="">Set QC Status...</option>
          {QC_STATUS_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        {selectedStatus && (
          <button
            type="button"
            onClick={handleApplyStatus}
            title={`Set QC Status to "${selectedStatus}" for all ${selectedCount} selected serials`}
            style={{
              height: 24,
              padding: '0 8px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 4,
              background: 'var(--green, #10b981)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}
          >
            <CheckCircle2 size={11} strokeWidth={2.5} />
            <span>Apply Status</span>
          </button>
        )}

        {!selectedCol && !selectedStatus && (
          <span style={{ fontSize: 11, color: 'var(--text3)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Calendar size={11} style={{ opacity: 0.7 }} />
            <span>(or edit any cell in table to sync all)</span>
          </span>
        )}
      </div>
    </div>
  );
});

export default QcBatchBar;

