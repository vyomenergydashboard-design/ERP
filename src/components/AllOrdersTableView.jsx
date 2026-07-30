import { useState, useEffect, useRef } from 'react';
import { DEPTS } from '../data/planningData';
import { Search, X, ArrowUpDown, ChevronUp, ChevronDown, Layers } from 'lucide-react';

const PRIORITY_ORDER = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

const PRIORITY_STYLES = {
  Urgent: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.35)' },
  High:   { bg: 'rgba(249,115,22,0.12)', color: '#f97316', border: 'rgba(249,115,22,0.35)' },
  Medium: { bg: 'rgba(234,179,8,0.12)',  color: '#eab308', border: 'rgba(234,179,8,0.35)' },
  Low:    { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.35)' },
};

const STATUS_STYLES = {
  Completed:   { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  Blocked:     { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  'In Progress':{ bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  'On Hold':   { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
};

export default function AllOrdersTableView({ currentFilter, onSetView, selectedOrderId }) {
  const [units, setUnits] = useState([]);
  const tableContainerRef = useRef(null);

  useEffect(() => {
    const slider = tableContainerRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      if (['INPUT', 'SELECT', 'OPTION', 'BUTTON', 'A', 'TH'].includes(e.target.tagName) || e.target.closest('th') || e.target.closest('button')) {
        return;
      }
      isDown = true;
      slider.classList.add('active-drag');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active-drag');
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove('active-drag');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('incomplete');
  const [sortKey, setSortKey] = useState('order_number');
  const [sortDir, setSortDir] = useState('asc');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUnits();
    
    const handleUpdate = () => {
      fetchUnits();
    };
    window.addEventListener('orderUpdated', handleUpdate);
    return () => window.removeEventListener('orderUpdated', handleUpdate);
  }, [currentFilter, selectedOrderId]);

  const fetchUnits = async () => {
    setIsLoading(true);
    try {
      const deptParam = (selectedOrderId || currentFilter === 'all') ? 'Sales' : currentFilter;
      const res = await fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(deptParam)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUnits(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (orderId, unitId) => {
    window.dispatchEvent(new CustomEvent('setView', {
      detail: { view: 'flow', orderId: parseInt(orderId), unitId: parseInt(unitId) }
    }));
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const getUnitStatus = (unit) => {
    if (unit.unit_status === 'Dispatched') return 'Completed';
    if (unit.unit_status === 'Hold') return 'On Hold';
    if (unit.dept_steps?.some(s => s.status === 'blocked')) return 'Blocked';
    return 'In Progress';
  };

  const filtered = units.filter(u => {
    if (selectedOrderId && u.order_id !== selectedOrderId) return false;
    const status = getUnitStatus(u);
    if (priorityFilter !== 'all' && (u.priority || 'Medium').toLowerCase() !== priorityFilter) return false;
    if (statusFilter === 'incomplete' && status === 'Completed') return false;
    if (statusFilter === 'completed' && status !== 'Completed') return false;
    if (statusFilter === 'blocked' && status !== 'Blocked') return false;
    if (statusFilter === 'hold' && status !== 'On Hold') return false;
    
    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      return (
        (u.order_number || '').toLowerCase().includes(q) ||
        (u.unit_serial || '').toLowerCase().includes(q) ||
        (u.company_name || '').toLowerCase().includes(q) ||
        (u.po_number || '').toLowerCase().includes(q) ||
        (u.reference_number || '').toLowerCase().includes(q) ||
        (u.end_client_name || '').toLowerCase().includes(q) ||
        (u.material_description || '').toLowerCase().includes(q) ||
        (u.part_number || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let av, bv;
    if (sortKey === 'priority') {
      av = PRIORITY_ORDER[a.priority || 'Medium'] ?? 2;
      bv = PRIORITY_ORDER[b.priority || 'Medium'] ?? 2;
    } else if (sortKey === 'delivery_date') {
      av = a.delivery_date ? new Date(a.delivery_date).getTime() : Infinity;
      bv = b.delivery_date ? new Date(b.delivery_date).getTime() : Infinity;
    } else if (sortKey === 'unit_status') {
      av = getUnitStatus(a);
      bv = getUnitStatus(b);
    } else {
      av = (a[sortKey] || '').toString().toLowerCase();
      bv = (b[sortKey] || '').toString().toLowerCase();
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={11} style={{ opacity: 0.3, marginLeft: 4 }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} style={{ color: 'var(--blue)', marginLeft: 4 }} />
      : <ChevronDown size={11} style={{ color: 'var(--blue)', marginLeft: 4 }} />;
  };

  const Th = ({ label, col, style }) => (
    <th
      onClick={() => col && handleSort(col)}
      style={{
        cursor: col ? 'pointer' : 'default',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        padding: '11px 14px',
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        color: sortKey === col ? 'var(--blue)' : 'var(--text3)',
        background: 'var(--bg3)',
        borderBottom: '1px solid var(--border)',
        ...style
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center' }}>
        {label}{col && <SortIcon col={col} />}
      </span>
    </th>
  );

  if (isLoading) return (
    <div style={{ padding: 60, textAlign: 'center', color: 'var(--text3)' }}>
      <div style={{ fontSize: 13 }}>Loading units...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap'
      }}>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '7px 12px', flex: '1 1 200px', minWidth: 0
        }}>
          <Search size={13} style={{ color: 'var(--text3)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search order, serial, PO, description, customer..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: 13, width: '100%'
            }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', display: 'flex', padding: 0 }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--text2)', fontSize: 12, padding: '7px 10px', cursor: 'pointer', outline: 'none'
          }}
        >
          <option value="all">All Status</option>
          <option value="incomplete">Incomplete</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
          <option value="hold">On Hold</option>
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--text2)', fontSize: 12, padding: '7px 10px', cursor: 'pointer', outline: 'none'
          }}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Summary chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginLeft: 'auto', background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 12px', fontSize: 12, color: 'var(--text3)',
          whiteSpace: 'nowrap', flexShrink: 0
        }}>
          <Layers size={13} />
          <strong style={{ color: 'var(--text)' }}>{sorted.length}</strong> unit items
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div 
        ref={tableContainerRef}
        className="table-responsive-scroll"
        style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 2 }}>
            <tr>
              <Th label="Order #" col="order_number" />
              <Th label="Unit Serial" col="unit_serial" />
              <Th label="Customer" col="company_name" />
              <Th label="PO Number" col="po_number" />
              <Th label="Ref #" col="reference_number" />
              <Th label="End Client" col="end_client_name" />
              <Th label="Part Number" col="part_number" />
              <Th label="Description" col="material_description" />
              <Th label="Current Dept" col="current_dept" />
              <Th label="Priority" col="priority" style={{ textAlign: 'center' }} />
              <Th label="Delivery" col="delivery_date" />
              <Th label="Status" col="unit_status" style={{ textAlign: 'center' }} />
            </tr>
          </thead>
          <tbody>
            {sorted.map((unit, idx) => {
              const status = getUnitStatus(unit);
              const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['In Progress'];
              const priority = unit.priority || 'Medium';
              const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
              const isOverdue = unit.delivery_date && new Date(unit.delivery_date) < new Date() && status !== 'Completed';

              return (
                <tr
                  key={unit.unit_id}
                  onClick={() => handleRowClick(unit.order_id, unit.id)}
                  style={{
                    background: idx % 2 === 0 ? 'var(--bg)' : 'var(--bg2)',
                    cursor: 'pointer',
                    transition: 'background 0.12s',
                    borderBottom: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
                  onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'var(--bg)' : 'var(--bg2)'}
                >
                  {/* Order # */}
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--blue)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {unit.order_number}
                  </td>

                  {/* Unit Serial */}
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text)', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {unit.unit_serial}
                  </td>

                  {/* Customer */}
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {unit.company_name || <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>—</span>}
                    {unit.company_city && <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 11, marginLeft: 4 }}>· {unit.company_city}</span>}
                  </td>

                  {/* PO */}
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', color: 'var(--text3)', fontSize: 12 }}>
                    {unit.po_number || '—'}
                  </td>

                  {/* Ref # */}
                  <td style={{ padding: '10px 14px', fontSize: 12, whiteSpace: 'nowrap' }}>
                    {unit.reference_number
                      ? <span style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b', fontWeight: 600 }}>{unit.reference_number}</span>
                      : <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
                    }
                  </td>

                  {/* End Client */}
                  <td style={{ padding: '10px 14px', color: 'var(--text3)', fontSize: 12, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {unit.end_client_name || <span style={{ opacity: 0.4 }}>—</span>}
                  </td>

                  {/* Part Number */}
                  <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text2)' }}>
                    {unit.part_number || '—'}
                  </td>

                  {/* Description */}
                  <td style={{ padding: '10px 14px', color: 'var(--text2)', fontSize: 12, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={unit.material_description}>
                    {unit.material_description || '—'}
                  </td>

                  {/* Current Dept */}
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--text2)' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
                      background: 'rgba(99,102,241,0.1)',
                      color: '#818cf8',
                      border: '1px solid rgba(99,102,241,0.25)',
                      textTransform: 'uppercase', letterSpacing: '0.4px'
                    }}>
                      {unit.current_dept || 'Sales'}
                    </span>
                  </td>

                  {/* Priority */}
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
                      background: priorityStyle.bg, color: priorityStyle.color,
                      border: `1px solid ${priorityStyle.border}`,
                      textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>
                      {priority}
                    </span>
                  </td>

                  {/* Delivery */}
                  <td style={{ padding: '10px 14px', color: isOverdue ? '#ef4444' : 'var(--text2)', fontWeight: isOverdue ? 600 : 400, whiteSpace: 'nowrap', fontSize: 12 }}>
                    {unit.delivery_date
                      ? new Date(unit.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                      : <span style={{ color: 'var(--text3)' }}>—</span>}
                    {isOverdue && <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700, marginLeft: 5, background: 'rgba(239,68,68,0.12)', borderRadius: 4, padding: '1px 5px' }}>OVERDUE</span>}
                  </td>

                  {/* Status */}
                  <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: statusStyle.bg, color: statusStyle.color,
                      border: `1px solid ${statusStyle.border}`,
                      textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap'
                    }}>
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={12} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
                  <Search size={28} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 14 }}>No units match the current filters</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .table-responsive-scroll {
          cursor: grab;
        }
        .table-responsive-scroll.active-drag {
          cursor: grabbing;
          user-select: none;
        }
      `}} />
    </div>
  );
}
