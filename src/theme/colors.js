/**
 * ERPNext-inspired Semantic Color System for Vyom ERP
 * Aligns with CSS tokens in src/index.css and supports dark/light themes.
 */
export const colors = {
  brand: {
    primary: 'var(--blue, #3b82f6)',
    primaryHover: 'var(--blue-hover, #2563eb)',
    primaryDim: 'var(--blue-dim, rgba(56, 189, 248, 0.12))',
    accent: 'var(--accent, #f97316)',
    accentDim: 'var(--orange-dim, rgba(249, 115, 22, 0.12))',
  },
  status: {
    completed: {
      text: 'var(--green, #10b981)',
      bg: 'var(--green-dim, rgba(16, 185, 129, 0.12))',
      border: 'rgba(16, 185, 129, 0.28)',
      dot: '#10b981',
      label: 'Completed'
    },
    inprogress: {
      text: 'var(--blue, #38bdf8)',
      bg: 'var(--blue-dim, rgba(56, 189, 248, 0.12))',
      border: 'rgba(56, 189, 248, 0.28)',
      dot: '#38bdf8',
      label: 'In Progress'
    },
    pending: {
      text: 'var(--text3, #94a3b8)',
      bg: 'rgba(148, 163, 184, 0.10)',
      border: 'rgba(148, 163, 184, 0.22)',
      dot: '#94a3b8',
      label: 'Pending'
    },
    hold: {
      text: 'var(--orange, #f97316)',
      bg: 'var(--orange-dim, rgba(249, 115, 22, 0.12))',
      border: 'rgba(249, 115, 22, 0.32)',
      dot: '#f97316',
      label: 'On Hold'
    },
    blocked: {
      text: 'var(--red, #f87171)',
      bg: 'var(--red-dim, rgba(248, 113, 113, 0.12))',
      border: 'rgba(248, 113, 113, 0.32)',
      dot: '#f87171',
      label: 'Blocked'
    },
    cancelled: {
      text: 'var(--red, #f87171)',
      bg: 'var(--red-dim, rgba(248, 113, 113, 0.12))',
      border: 'rgba(248, 113, 113, 0.32)',
      dot: '#ef4444',
      label: 'Cancelled'
    },
    review: {
      text: 'var(--purple, #a855f7)',
      bg: 'var(--purple-dim, rgba(168, 85, 247, 0.12))',
      border: 'rgba(168, 85, 247, 0.28)',
      dot: '#a855f7',
      label: 'Under Review'
    }
  },
  priority: {
    urgent: { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.35)' },
    high:   { text: '#f97316', bg: 'rgba(249, 115, 22, 0.15)', border: 'rgba(249, 115, 22, 0.35)' },
    medium: { text: '#eab308', bg: 'rgba(234, 179, 8, 0.15)',  border: 'rgba(234, 179, 8, 0.35)' },
    low:    { text: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)', border: 'rgba(59, 130, 246, 0.35)' }
  }
};

