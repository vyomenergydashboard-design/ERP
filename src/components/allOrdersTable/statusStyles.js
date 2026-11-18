const PRIORITY_ORDER = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

const PRIORITY_STYLES = {
  Urgent: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(248, 113, 113, 0.35)' },
  High: { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.35)' },
  Medium: { bg: 'rgba(234, 179, 8, 0.12)', color: '#eab308', border: 'rgba(234, 179, 8, 0.35)' },
  Low: { bg: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.35)' },
};

const STATUS_STYLES = {
  Completed: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(16, 185, 129, 0.3)' },
  Blocked: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(248, 113, 113, 0.3)' },
  'In Progress': { bg: 'var(--blue-dim)', color: 'var(--blue)', border: 'rgba(56, 189, 248, 0.3)' },
  'In Process': { bg: 'var(--blue-dim)', color: 'var(--blue)', border: 'rgba(56, 189, 248, 0.3)' },
  Pending: { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.3)' },
  'Not Started': { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.3)' },
  'Partial Ready': { bg: 'rgba(20, 184, 166, 0.12)', color: 'var(--teal, #14b8a6)', border: 'rgba(20, 184, 166, 0.3)' },
  'Full Ready': { bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(16, 185, 129, 0.3)' },
  'Partial Issued': { bg: 'rgba(168, 85, 247, 0.12)', color: 'var(--purple, #a855f7)', border: 'rgba(168, 85, 247, 0.3)' },
  'All Issued': { bg: 'rgba(139, 92, 246, 0.18)', color: '#c084fc', border: 'rgba(139, 92, 246, 0.35)' },
  Hold: { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.35)' },
  'On Hold': { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.35)' },
  Cancelled: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(248, 113, 113, 0.35)' },
};

export { PRIORITY_ORDER, PRIORITY_STYLES, STATUS_STYLES };
