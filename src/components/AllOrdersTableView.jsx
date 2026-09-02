import { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowUpDown, ChevronUp, ChevronDown, Layers, Pin, GripVertical, RotateCcw } from 'lucide-react';

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

const ALL_COLUMNS = [
  { key: 'order_number',          label: 'Order #',       align: 'left' },
  { key: 'short_serial',          label: 'Unit Serial',   align: 'left', alias: 'unit_serial' },
  { key: 'company_name',          label: 'Customer',      align: 'left' },
  { key: 'po_number',             label: 'PO Number',     align: 'left' },
  { key: 'reference_number',      label: 'Ref #',         align: 'left' },
  { key: 'end_client_name',       label: 'End Client',    align: 'left' },
  { key: 'part_number',           label: 'Part Number',   align: 'left' },
  { key: 'panel_type_size',       label: 'Panel Size',    align: 'left' },
  { key: 'material_description',  label: 'Description',   align: 'left' },
  { key: 'classification',        label: 'Type (Design)', align: 'center' },
  { key: 'current_dept',          label: 'Current Dept',  align: 'left' },
  { key: 'priority',              label: 'Priority',      align: 'center' },
  { key: 'delivery_date',         label: 'Delivery',      align: 'left' },
  { key: 'unit_status',           label: 'Status',        align: 'center' },
];

const DEFAULT_COLUMN_KEYS = ALL_COLUMNS.map(c => c.key);

const DEFAULT_COL_WIDTHS = {
  order_number: 130,
  short_serial: 135,
  company_name: 180,
  po_number: 140,
  reference_number: 130,
  end_client_name: 140,
  part_number: 140,
  panel_type_size: 150,
  material_description: 220,
  classification: 130,
  current_dept: 120,
  priority: 110,
  delivery_date: 130,
  unit_status: 120,
};

export default function AllOrdersTableView({ currentFilter, onSetView }) {
  const [units, setUnits] = useState([]);
  const tableContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Canvas Mouse Drag Scroll
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
  const [priorityFilter, setPriorityFilter] = useState(() => localStorage.getItem('erp_all_priorityFilter') || 'all');
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem('erp_all_statusFilter') || 'incomplete');
  const [sortKey, setSortKey] = useState(() => localStorage.getItem('erp_all_sortKey') || 'order_number');
  const [sortDir, setSortDir] = useState(() => localStorage.getItem('erp_all_sortDir') || 'asc');

  useEffect(() => {
    localStorage.setItem('erp_all_priorityFilter', priorityFilter);
  }, [priorityFilter]);

  useEffect(() => {
    localStorage.setItem('erp_all_statusFilter', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem('erp_all_sortKey', sortKey);
  }, [sortKey]);

  useEffect(() => {
    localStorage.setItem('erp_all_sortDir', sortDir);
  }, [sortDir]);

  // Column Keys Order (Drag & Drop Reordering)
  const [columnKeys, setColumnKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_column_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid = parsed.filter(k => DEFAULT_COLUMN_KEYS.includes(k));
        const missing = DEFAULT_COLUMN_KEYS.filter(k => !valid.includes(k));
        return [...valid, ...missing];
      }
    } catch (e) {}
    return DEFAULT_COLUMN_KEYS;
  });

  useEffect(() => {
    localStorage.setItem('erp_all_column_order', JSON.stringify(columnKeys));
  }, [columnKeys]);

  // Pinned / Frozen Columns (Frozen on left)
  const [pinnedKeys, setPinnedKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_pinned_keys');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['order_number', 'short_serial'];
  });

  useEffect(() => {
    localStorage.setItem('erp_all_pinned_keys', JSON.stringify(pinnedKeys));
  }, [pinnedKeys]);

  // Column Widths (Resizing)
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_colWidths');
      return saved ? { ...DEFAULT_COL_WIDTHS, ...JSON.parse(saved) } : DEFAULT_COL_WIDTHS;
    } catch (e) {
      return DEFAULT_COL_WIDTHS;
    }
  });

  useEffect(() => {
    localStorage.setItem('erp_all_colWidths', JSON.stringify(columnWidths));
  }, [columnWidths]);

  // Header Drag & Drop state
  const [draggedColKey, setDraggedColKey] = useState(null);
  const [dragOverColKey, setDragOverColKey] = useState(null);

  const handleHeaderDragStart = (e, colKey) => {
    setDraggedColKey(colKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', colKey);
  };

  const handleHeaderDragOver = (e, colKey) => {
    e.preventDefault();
    if (draggedColKey === colKey) return;
    if (dragOverColKey !== colKey) {
      setDragOverColKey(colKey);
    }
  };

  const handleHeaderDragLeave = (e, colKey) => {
    if (dragOverColKey === colKey) {
      setDragOverColKey(null);
    }
  };

  const handleHeaderDrop = (e, targetColKey) => {
    e.preventDefault();
    if (!draggedColKey || draggedColKey === targetColKey) {
      setDraggedColKey(null);
      setDragOverColKey(null);
      return;
    }

    const visibleKeys = visibleCols.map(c => c.key);
    const sourceIdx = visibleKeys.indexOf(draggedColKey);
    const targetIdx = visibleKeys.indexOf(targetColKey);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const newKeys = [...columnKeys];
      const realSource = newKeys.indexOf(draggedColKey);
      const realTarget = newKeys.indexOf(targetColKey);
      if (realSource !== -1 && realTarget !== -1) {
        newKeys.splice(realSource, 1);
        newKeys.splice(realTarget, 0, draggedColKey);
        setColumnKeys(newKeys);
        localStorage.setItem('erp_all_column_order', JSON.stringify(newKeys));
      }
    }

    setDraggedColKey(null);
    setDragOverColKey(null);
  };

  const handleHeaderDragEnd = () => {
    setDraggedColKey(null);
    setDragOverColKey(null);
  };

  const togglePin = (colKey, e) => {
    e?.stopPropagation();
    setPinnedKeys(prev => 
      prev.includes(colKey)
        ? prev.filter(k => k !== colKey)
        : [...prev, colKey]
    );
  };

  const handleResetLayout = () => {
    setColumnKeys(DEFAULT_COLUMN_KEYS);
    setColumnWidths(DEFAULT_COL_WIDTHS);
    setPinnedKeys(['order_number', 'short_serial']);
    localStorage.removeItem('erp_all_column_order');
    localStorage.removeItem('erp_all_colWidths');
    localStorage.removeItem('erp_all_pinned_keys');
  };

  const handleResizeStart = (e, colKey) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const startWidth = columnWidths[colKey] || DEFAULT_COL_WIDTHS[colKey] || 120;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const newWidth = Math.max(60, startWidth + (moveEvent.pageX - startX));
      setColumnWidths(prev => ({
        ...prev,
        [colKey]: newWidth
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'Sales';
  const canEdit = ['Admin', 'Manager', 'Design', 'Sales', 'Production'].includes(userRole);

  const [colVisibility, setColVisibility] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [partMasters, setPartMasters] = useState([]);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedPartForDocs, setSelectedPartForDocs] = useState(null);

  const fetchPartMasters = async () => {
    try {
      const res = await fetch(`${window.API_BASE}/api/part-number-masters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPartMasters(await res.json());
      }
    } catch (err) { console.error(err); }
  };

  const getDocUrl = (doc) => {
    if (!doc) return '#';
    let pathStr = typeof doc === 'string' ? doc : (doc.file_path || doc.filePath || doc.file_name || '');
    if (!pathStr) return '#';
    
    pathStr = pathStr.replace(/\\/g, '/');
    const uploadsIdx = pathStr.indexOf('uploads/');
    let relPath = '';
    if (uploadsIdx !== -1) {
      relPath = pathStr.substring(uploadsIdx + 8);
    } else {
      relPath = pathStr.split('/').pop();
    }
    relPath = relPath.replace(/^\/+/, '');

    const authToken = localStorage.getItem('token');
    const tokenParam = authToken ? `?token=${encodeURIComponent(authToken)}` : '';
    const baseUrl = window.API_BASE || '';
    
    return `${baseUrl}/uploads/${relPath}${tokenParam}`;
  };

  const handlePartNumberClick = async (unit) => {
    const pNum = unit.part_number;
    const match = partMasters.find(p => p.part_number === pNum);
    let masterDocs = match?.documents || [];
    let orderDocs = [];

    try {
      if (unit.order_id) {
        const res = await fetch(`${window.API_BASE}/api/documents/Order/${unit.order_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          orderDocs = await res.json();
        }
      }
    } catch (err) {
      console.error('Failed to fetch order documents:', err);
    }

    setSelectedPartForDocs({
      partNumber: pNum || 'Unspecified',
      orderNumber: unit.order_number || '',
      description: unit.material_description || match?.description || '',
      classification: unit.classification || 'Standard',
      masterDocs,
      orderDocs
    });
    setShowDocsModal(true);
  };

  const handleSaveInlineCell = async (unit, colKey, newValue) => {
    // 1. Optimistic UI update - changes value instantly without unmounting or resetting scroll!
    const targetUnitId = unit.unit_id || unit.id;
    setUnits(prevUnits => prevUnits.map(u => {
      const currentId = u.unit_id || u.id;
      if (currentId === targetUnitId) {
        return { ...u, [colKey]: newValue };
      }
      return u;
    }));
    setEditingCell(null);

    try {
      if (colKey === 'classification') {
        await fetch(`${window.API_BASE}/api/orders/${unit.order_id}/classification`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ classification: newValue })
        });
      } else {
        await fetch(`${window.API_BASE}/api/orders/${unit.order_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ [colKey]: newValue })
        });
      }
      // Silent refresh in background
      fetchUnits(true);
    } catch (err) {
      console.error('Failed to update inline cell:', err);
      fetchUnits(true);
    }
  };

  useEffect(() => {
    fetchColumnVisibility();
    fetchUnits();
    fetchPartMasters();
    
    const handleUpdate = () => {
      fetchUnits(true);
      fetchColumnVisibility();
      fetchPartMasters();
    };
    window.addEventListener('orderUpdated', handleUpdate);
    return () => window.removeEventListener('orderUpdated', handleUpdate);
  }, [currentFilter]);

  const fetchColumnVisibility = async () => {
    try {
      const res = await fetch(`${window.API_BASE}/api/column-masters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setColVisibility(data.visibilityByDept || {});
      }
    } catch (err) { console.error(err); }
  };

  const isColVisible = (colKey) => {
    if (currentFilter === 'all') return true;
    const deptMap = colVisibility[currentFilter];
    if (!deptMap) return true;
    const key = colKey === 'unit_serial' ? 'short_serial' : colKey;
    return deptMap[key] !== false;
  };

  const fetchUnits = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const deptParam = currentFilter === 'all' ? 'Sales' : currentFilter;
      const res = await fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(deptParam)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUnits(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setIsLoading(false);
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
    const status = getUnitStatus(u);
    if (priorityFilter !== 'all' && (u.priority || 'Medium').toLowerCase() !== priorityFilter) return false;
    if (statusFilter === 'incomplete' && status === 'Completed') return false;
    if (statusFilter === 'completed' && status !== 'Completed') return false;
    if (statusFilter === 'blocked' && status !== 'Blocked') return false;
    if (statusFilter === 'hold' && status !== 'On Hold') return false;
    
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        (u.order_number || '').toLowerCase().includes(q) ||
        (u.unit_serial || '').toLowerCase().includes(q) ||
        (u.po_number || '').toLowerCase().includes(q) ||
        (u.company_name || '').toLowerCase().includes(q) ||
        (u.end_client_name || '').toLowerCase().includes(q) ||
        (u.reference_number || '').toLowerCase().includes(q) ||
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

  // Active columns filtered by department visibility
  const activeCols = columnKeys
    .filter(key => isColVisible(key))
    .map(key => ALL_COLUMNS.find(c => c.key === key))
    .filter(Boolean);

  // Partition active columns into Pinned (frozen on left) and Unpinned
  const pinnedCols = activeCols.filter(c => pinnedKeys.includes(c.key));
  const unpinnedCols = activeCols.filter(c => !pinnedKeys.includes(c.key));
  const visibleCols = [...pinnedCols, ...unpinnedCols];

  // Calculate cumulative left offsets for pinned columns
  const stickyLeftMap = {};
  let currentLeft = 0;
  pinnedCols.forEach((c) => {
    const width = columnWidths[c.key] || DEFAULT_COL_WIDTHS[c.key] || 120;
    stickyLeftMap[c.key] = currentLeft;
    currentLeft += width;
  });

  const isPinned = (colKey) => pinnedKeys.includes(colKey);
  const isLastPinned = (colKey) => pinnedCols.length > 0 && pinnedCols[pinnedCols.length - 1].key === colKey;

  const getColStyle = (colKey, isHeader = false, isAltRow = false) => {
    const width = columnWidths[colKey] || DEFAULT_COL_WIDTHS[colKey] || 120;
    const pinned = isPinned(colKey);
    const lastPin = isLastPinned(colKey);

    return {
      width,
      minWidth: width,
      maxWidth: width,
      boxSizing: 'border-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      position: pinned ? 'sticky' : 'relative',
      left: pinned ? `${stickyLeftMap[colKey]}px` : undefined,
      zIndex: pinned ? (isHeader ? 15 : 3) : (isHeader ? 10 : 1),
      background: isHeader
        ? 'var(--bg3)'
        : (pinned ? (isAltRow ? 'var(--bg2)' : 'var(--bg)') : undefined),
      boxShadow: lastPin ? '4px 0 8px -3px rgba(0,0,0,0.35)' : undefined
    };
  };



  const renderCellContent = (unit, colKey) => {
    const status = getUnitStatus(unit);
    const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['In Progress'];
    const priority = unit.priority || 'Medium';
    const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
    const isOverdue = unit.delivery_date && new Date(unit.delivery_date) < new Date() && status !== 'Completed';
    const effectiveUnitId = unit.unit_id || unit.id;

    switch (colKey) {
      case 'order_number':
        return (
          <span 
            onClick={(e) => { e.stopPropagation(); handleRowClick(unit.order_id, effectiveUnitId); }}
            style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--blue)', fontSize: 12, cursor: 'pointer' }}
            title="Click to view Process Flow"
          >
            {unit.order_number}
          </span>
        );

      case 'short_serial':
      case 'unit_serial':
        return (
          <div 
            onClick={(e) => { e.stopPropagation(); handleRowClick(unit.order_id, effectiveUnitId); }} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            title="Click to view Process Flow for this Unit Serial"
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#3b82f6', fontSize: 12, textDecoration: 'underline' }}>
              {unit.unit_serial}
            </span>
          </div>
        );

      case 'company_name':
        return (
          <>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{unit.company_name || '—'}</span>
            {unit.company_city && <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 11, marginLeft: 4 }}>· {unit.company_city}</span>}
          </>
        );

      case 'classification':
        const clsVal = unit.classification || 'Standard';
        if (canEdit) {
          return (
            <select
              value={clsVal}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleSaveInlineCell(unit, 'classification', e.target.value)}
              style={{
                fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                background: clsVal === 'Standard' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                color: clsVal === 'Standard' ? '#60a5fa' : '#fbbf24',
                border: `1px solid ${clsVal === 'Standard' ? 'rgba(59,130,246,0.4)' : 'rgba(245,158,11,0.4)'}`,
                cursor: 'pointer', outline: 'none'
              }}
            >
              <option value="Standard" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>Standard</option>
              <option value="Non-Standard" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>Non-Standard</option>
            </select>
          );
        }
        return (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
            background: clsVal === 'Standard' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)',
            color: clsVal === 'Standard' ? '#60a5fa' : '#fbbf24',
            border: `1px solid ${clsVal === 'Standard' ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)'}`
          }}>
            {clsVal}
          </span>
        );

      case 'priority':
        if (canEdit) {
          return (
            <select
              value={priority}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleSaveInlineCell(unit, 'priority', e.target.value)}
              style={{
                fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
                background: priorityStyle.bg, color: priorityStyle.color,
                border: `1px solid ${priorityStyle.border}`, cursor: 'pointer', outline: 'none',
                textTransform: 'uppercase'
              }}
            >
              <option value="Urgent" style={{ background: 'var(--bg3)', color: '#ef4444' }}>Urgent</option>
              <option value="High" style={{ background: 'var(--bg3)', color: '#f87171' }}>High</option>
              <option value="Medium" style={{ background: 'var(--bg3)', color: '#fbbf24' }}>Medium</option>
              <option value="Low" style={{ background: 'var(--bg3)', color: '#60a5fa' }}>Low</option>
            </select>
          );
        }
        return (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
            background: priorityStyle.bg, color: priorityStyle.color,
            border: `1px solid ${priorityStyle.border}`, textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>
            {priority}
          </span>
        );

      case 'current_dept':
        return (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            background: 'rgba(99,102,241,0.12)', color: '#818cf8',
            border: '1px solid rgba(99,102,241,0.25)', textTransform: 'uppercase', letterSpacing: '0.4px'
          }}>
            {unit.current_dept || 'Sales'}
          </span>
        );

      case 'unit_status':
        return (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            background: statusStyle.bg, color: statusStyle.color,
            border: `1px solid ${statusStyle.border}`, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap'
          }}>
            {status}
          </span>
        );

      case 'delivery_date':
        const isEditingDate = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === 'delivery_date';
        if (isEditingDate) {
          return (
            <input
              type="date"
              autoFocus
              value={unit.delivery_date ? unit.delivery_date.split('T')[0] : ''}
              onChange={(e) => handleSaveInlineCell(unit, 'delivery_date', e.target.value)}
              onBlur={() => setEditingCell(null)}
              style={{
                padding: '2px 4px', fontSize: 11, background: 'var(--bg3)',
                color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4
              }}
            />
          );
        }

        return (
          <span
            onClick={(e) => {
              if (canEdit) {
                e.stopPropagation();
                setEditingCell({ unitId: effectiveUnitId, colKey: 'delivery_date', value: unit.delivery_date || '' });
              }
            }}
            title={canEdit ? "Click to change date" : undefined}
            style={{
              color: isOverdue ? '#ef4444' : 'var(--text2)',
              fontWeight: isOverdue ? 600 : 400,
              fontSize: 12,
              cursor: canEdit ? 'pointer' : 'default'
            }}
          >
            {unit.delivery_date
              ? new Date(unit.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : '—'}
            {isOverdue && <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700, marginLeft: 5, background: 'rgba(239,68,68,0.12)', borderRadius: 4, padding: '1px 5px' }}>OVERDUE</span>}
          </span>
        );

      case 'part_number':
        const hasPart = Boolean(unit.part_number);
        return (
          <span
            onClick={(e) => {
              e.stopPropagation();
              handlePartNumberClick(unit);
            }}
            title="Click to view Design Drawings & Technical Documents"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              fontWeight: 600,
              color: hasPart ? '#60a5fa' : 'var(--text3)',
              cursor: 'pointer',
              textDecoration: hasPart ? 'underline' : 'none'
            }}
          >
            {unit.part_number || '—'}
          </span>
        );

      default:
        const isEditingThis = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === colKey;
        const currentVal = unit[colKey] || '';

        if (isEditingThis) {
          return (
            <input
              type="text"
              autoFocus
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onBlur={() => handleSaveInlineCell(unit, colKey, editingCell.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveInlineCell(unit, colKey, editingCell.value);
                if (e.key === 'Escape') setEditingCell(null);
              }}
              style={{
                width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
                color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
              }}
            />
          );
        }

        const isEditableTextCol = ['end_client_name', 'po_number', 'reference_number', 'material_description', 'panel_type_size'].includes(colKey);

        return (
          <span
            onClick={(e) => {
              if (canEdit && isEditableTextCol) {
                e.stopPropagation();
                setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
              }
            }}
            title={canEdit && isEditableTextCol ? "Click to edit" : undefined}
            style={{
              color: colKey === 'reference_number' ? '#f59e0b' : 'var(--text2)',
              fontSize: 12,
              cursor: canEdit && isEditableTextCol ? 'pointer' : 'default'
            }}
          >
            {currentVal || '—'}
          </span>
        );
    }
  };

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
            ref={searchInputRef}
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

        {/* Reset Layout button */}
        <button
          onClick={handleResetLayout}
          title="Reset column positions, sizes, and freeze states to default"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px 10px', fontSize: 12, color: 'var(--text2)',
            cursor: 'pointer', outline: 'none'
          }}
        >
          <RotateCcw size={12} />
          Reset Layout
        </button>

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
          <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg3)' }}>
            <tr>
              {visibleCols.map(({ key: colKey, label, align }) => {
                const isPinned = pinnedKeys.includes(colKey);
                const isOver = dragOverColKey === colKey;
                const visibleKeys = visibleCols.map(c => c.key);
                const draggedIdx = visibleKeys.indexOf(draggedColKey);
                const targetIdx = visibleKeys.indexOf(colKey);

                let dragOverClass = '';
                if (isOver && draggedIdx !== -1 && draggedIdx !== targetIdx) {
                  dragOverClass = draggedIdx < targetIdx ? ' drag-over-right' : ' drag-over-left';
                }

                const baseStyle = getColStyle(colKey, true);
                const isDragging = draggedColKey === colKey;
                const thClass = `${isDragging ? ' dragging' : ''}${dragOverClass}`.trim();

                return (
                  <th
                    key={colKey}
                    className={thClass}
                    draggable
                    onDragStart={(e) => handleHeaderDragStart(e, colKey)}
                    onDragOver={(e) => handleHeaderDragOver(e, colKey)}
                    onDragLeave={(e) => handleHeaderDragLeave(e, colKey)}
                    onDragEnd={handleHeaderDragEnd}
                    onDrop={(e) => handleHeaderDrop(e, colKey)}
                    title="Drag to reorder column. Click pin to freeze."
                    style={{
                      ...baseStyle,
                      cursor: 'grab',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      padding: '11px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      color: sortKey === colKey ? 'var(--blue)' : 'var(--text3)',
                      borderBottom: '1px solid var(--border)',
                      textAlign: align
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'space-between', gap: 6, width: '100%' }}>
                      <div 
                        onClick={() => handleSort(colKey)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', overflow: 'hidden', flex: 1 }}
                      >
                        <GripVertical size={12} className="drag-handle" style={{ cursor: 'grab' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
                        {sortKey === colKey && <SortIcon col={colKey} />}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => togglePin(colKey, e)}
                        title={isPinned ? "Unfreeze Column" : "Freeze Column to left"}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 2,
                          display: 'flex',
                          alignItems: 'center',
                          color: isPinned ? 'var(--blue)' : 'var(--text3)',
                          opacity: isPinned ? 1 : 0.4,
                          flexShrink: 0
                        }}
                      >
                        <Pin size={12} style={{ transform: isPinned ? 'rotate(-45deg)' : 'none', transition: 'transform 0.15s' }} />
                      </button>
                    </div>

                    {/* Column Resize Handle */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, colKey)}
                      onClick={(e) => e.stopPropagation()}
                      title="Drag to resize column"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '8px',
                        cursor: 'col-resize',
                        zIndex: 10,
                        background: 'transparent',
                        pointerEvents: 'auto'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((unit, idx) => {
              const isAltRow = idx % 2 !== 0;

              return (
                <tr
                  key={unit.unit_id}
                  style={{
                    background: isAltRow ? 'var(--bg2)' : 'var(--bg)',
                    cursor: 'default',
                    transition: 'background 0.12s',
                    borderBottom: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
                  onMouseLeave={e => e.currentTarget.style.background = isAltRow ? 'var(--bg2)' : 'var(--bg)'}
                >
                  {visibleCols.map(c => {
                    const style = getColStyle(c.key, false, isAltRow);
                    return (
                      <td
                        key={c.key}
                        style={{
                          padding: '10px 14px',
                          textAlign: c.align || 'left',
                          ...style
                        }}
                      >
                        {renderCellContent(unit, c.key)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={visibleCols.length || 12} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
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
        .drag-handle {
          color: var(--text3, #5a6070);
          opacity: 0.4;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        th:hover .drag-handle {
          opacity: 0.9;
          color: var(--blue, #3b82f6);
        }
        .dragging {
          opacity: 0.4;
        }
        .drag-over-left {
          box-shadow: inset 3px 0 0 0 #3b82f6 !important;
        }
        .drag-over-right {
          box-shadow: inset -3px 0 0 0 #3b82f6 !important;
        }
      `}} />

      {/* ── Technical Drawings & Standard Documents Modal ── */}
      {showDocsModal && selectedPartForDocs && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setShowDocsModal(false); }}>
          <div className="modal" style={{ maxWidth: '680px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)' }}>
                  Technical Drawings & Standard Documents
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
                  Part Number: <span style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{selectedPartForDocs.partNumber}</span>
                  {selectedPartForDocs.description && ` — ${selectedPartForDocs.description}`}
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowDocsModal(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            
            <div className="modal-body" style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              <div style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--text2)', background: 'var(--bg3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div><strong>Classification:</strong> {selectedPartForDocs.classification}</div>
                {selectedPartForDocs.orderNumber && <div><strong>Order #:</strong> {selectedPartForDocs.orderNumber}</div>}
              </div>

              {/* Section 1: Master Part Drawings */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Master Part Technical Drawings (Design)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedPartForDocs.masterDocs.map((doc) => {
                    const docUrl = getDocUrl(doc);
                    return (
                      <div 
                        key={`master-${doc.id}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 14px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px' }}>{doc.file_name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                            Design Master Document · Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vbtn"
                          style={{ background: '#3b82f6', color: '#fff', textDecoration: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}
                        >
                          View / Download
                        </a>
                      </div>
                    );
                  })}

                  {selectedPartForDocs.masterDocs.length === 0 && (
                    <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text3)', background: 'var(--bg3)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px' }}>
                      No Master Technical Drawings uploaded for this part number yet.
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Order Standard Documents */}
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Order Documents & Attachments
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedPartForDocs.orderDocs.map((doc) => {
                    const docUrl = getDocUrl(doc);
                    return (
                      <div 
                        key={`order-${doc.id}`}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '10px 14px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px' }}>
                            {doc.file_name}
                            <span style={{ fontSize: '10px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: 600 }}>
                              {doc.doc_type || 'General'}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                            Uploaded by {doc.uploaded_by || 'System'} · {new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </div>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vbtn"
                          style={{ background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}
                        >
                          View / Download
                        </a>
                      </div>
                    );
                  })}

                  {selectedPartForDocs.orderDocs.length === 0 && (
                    <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text3)', background: 'var(--bg3)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px' }}>
                      No order-level documents uploaded for this order yet.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-actions" style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="vbtn" onClick={() => setShowDocsModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
