import React from 'react';
import { Check, Pause, X, AlertTriangle, Clock } from 'lucide-react';
import { colors } from '../../theme/colors';

/**
 * Enterprise Status & Priority Badge Component (ERPNext style)
 */
export default function StatusBadge({
  status,
  label = null,
  variant = 'status', // 'status' | 'priority' | 'pill'
  showDot = true,
  showIcon = false,
  size = 'sm', // 'xs' | 'sm'
  className = '',
  style = {}
}) {
  const normKey = String(status || '').toLowerCase().replace(/[\s_-]+/g, '');

  let config = {
    text: 'var(--text2, #cbd5e1)',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.25)',
    dot: '#94a3b8',
    label: label || status || 'Unknown',
    icon: null
  };

  if (variant === 'priority') {
    const pConfig = colors.priority[normKey] || colors.priority.medium;
    config = {
      text: pConfig.text,
      bg: pConfig.bg,
      border: pConfig.border,
      dot: pConfig.text,
      label: label || status || 'Medium',
      icon: null
    };
  } else {
    if (['done', 'completed', 'complete'].includes(normKey)) {
      config = { ...colors.status.completed, label: label || 'Completed', icon: Check };
    } else if (['inprogress', 'inprocess', 'active'].includes(normKey)) {
      config = { ...colors.status.inprogress, label: label || 'In Progress', icon: Clock };
    } else if (normKey.startsWith('hold')) {
      config = { ...colors.status.hold, label: label || status || 'On Hold', icon: Pause };
    } else if (normKey.startsWith('cancel')) {
      config = { ...colors.status.cancelled, label: label || 'Cancelled', icon: X };
    } else if (['blocked', 'fail', 'failed'].includes(normKey)) {
      config = { ...colors.status.blocked, label: label || 'Blocked', icon: AlertTriangle };
    } else if (['review', 'underreview'].includes(normKey)) {
      config = { ...colors.status.review, label: label || 'Under Review', icon: Clock };
    } else if (['draft'].includes(normKey)) {
      config = {
        text: 'var(--text3, #94a3b8)',
        bg: 'rgba(148, 163, 184, 0.08)',
        border: 'rgba(148, 163, 184, 0.2)',
        dot: '#94a3b8',
        label: label || 'Draft',
        icon: null
      };
    }
  }

  const height = size === 'xs' ? 18 : 22;
  const fontSize = size === 'xs' ? 10 : 11;
  const dotSize = size === 'xs' ? 5 : 6;
  const IconComp = showIcon ? config.icon : null;

  return (
    <span
      className={`erp-status-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        height,
        padding: '0 8px',
        fontSize,
        fontWeight: 600,
        fontFamily: 'inherit',
        color: config.text,
        background: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: 12,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {showDot && !IconComp && (
        <span
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            background: config.dot,
            flexShrink: 0
          }}
        />
      )}
      {IconComp && <IconComp size={10} strokeWidth={2.8} style={{ flexShrink: 0 }} />}
      <span>{config.label}</span>
    </span>
  );
}

