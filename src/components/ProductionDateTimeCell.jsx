import React, { useState, useRef, useEffect } from 'react';

/**
 * Format timestamp or ISO string to short Date + Time: "DD/MM/YYYY, hh:mm a"
 */
export const formatCellDateTime = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day}/${month}/${year}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

/**
 * Converts ISO/Date to local "YYYY-MM-DDTHH:mm" for <input type="datetime-local">
 */
export const formatForDateTimeInput = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${day}T${hh}:${mm}`;
};

/**
 * ProductionDateTimeCell
 * Modular, single-line Date & Time editor and formatter for Production milestones.
 * Conforms to AGENTS.md Monolithic Decomposition guardrail.
 */
export default function ProductionDateTimeCell({
  value,
  canEdit = false,
  onSave,
  placeholder = '+ Set Date & Time',
  title = 'Click to edit date & time'
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);

  const startEditing = (e) => {
    if (!canEdit) return;
    e?.stopPropagation();
    const initial = value ? formatForDateTimeInput(value) : formatForDateTimeInput(new Date());
    setInputValue(initial);
    setIsEditing(true);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      if (typeof inputRef.current.showPicker === 'function') {
        try {
          inputRef.current.showPicker();
        } catch (_) {}
      }
    }
  }, [isEditing]);

  const commitValue = (rawVal) => {
    setIsEditing(false);
    if (!rawVal) {
      if (value) onSave?.(null);
      return;
    }
    const d = new Date(rawVal);
    if (isNaN(d.getTime())) {
      if (value) onSave?.(null);
      return;
    }
    const newIso = d.toISOString();
    if (newIso !== value) {
      onSave?.(newIso);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="datetime-local"
        autoFocus
        value={inputValue}
        onClick={(e) => {
          e.stopPropagation();
          if (typeof e.target.showPicker === 'function') {
            try { e.target.showPicker(); } catch (_) {}
          }
        }}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={() => commitValue(inputValue)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitValue(inputValue);
          } else if (e.key === 'Escape') {
            e.preventDefault();
            setIsEditing(false);
          }
        }}
        style={{
          padding: '2px 4px',
          fontSize: 11,
          fontFamily: 'var(--font-mono)',
          background: 'var(--bg3)',
          color: 'var(--text)',
          border: '1px solid var(--blue)',
          borderRadius: 4,
          cursor: 'pointer',
          outline: 'none'
        }}
      />
    );
  }

  if (value) {
    return (
      <span
        onClick={startEditing}
        style={{
          color: 'var(--text2)',
          fontSize: 11.5,
          fontFamily: 'var(--font-mono)',
          cursor: canEdit ? 'pointer' : 'default',
          display: 'inline-flex',
          alignItems: 'center',
          padding: '1px 4px',
          borderRadius: 3,
          whiteSpace: 'nowrap'
        }}
        title={canEdit ? title : undefined}
      >
        {formatCellDateTime(value)}
      </span>
    );
  }

  return (
    <span
      onClick={startEditing}
      style={{
        color: canEdit ? 'var(--blue)' : 'var(--text3)',
        fontSize: 11,
        cursor: canEdit ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'center',
        opacity: canEdit ? 0.8 : 0.5,
        whiteSpace: 'nowrap'
      }}
      title={canEdit ? 'Click to set date & time (defaults to now)' : undefined}
    >
      {canEdit ? placeholder : '—'}
    </span>
  );
}

