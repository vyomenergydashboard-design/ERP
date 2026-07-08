import React, { useState, useEffect, useCallback } from 'react';
import { Search, Edit2, CheckCircle2, AlertCircle, X, ChevronLeft, ChevronRight, ChevronDown, ChevronsLeft, ChevronsRight, GripVertical } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const DEFAULT_COLUMNS = [
  'sr_no',
  'order_number',
  'po_number',
  'reference_number',
  'part_number',
  'client_name',
  'end_client_name',
  'planned_dispatch',
  'mounting_start',
  'mounting_complete',
  'wiring_assigned',
  'wiring_expected',
  'expected_qc',
  'priority',
  'status',
  'qc_status',
  'qc_date',
  'progress',
  'action'
];

export default function PlanningModule() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canEdit = ['Admin', 'Manager', 'Production', 'Sales'].includes(user.role);

  const [orders, setOrders] = useState([]);
  const [columnOrder, setColumnOrder] = useState(() => {
    const saved = localStorage.getItem('planning_column_order');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validSaved = parsed.filter(col => DEFAULT_COLUMNS.includes(col));
          const missing = DEFAULT_COLUMNS.filter(col => !validSaved.includes(col));
          return [...validSaved, ...missing];
        }
      } catch (e) {
        console.error('Error parsing column order from localStorage:', e);
      }
    }
    return DEFAULT_COLUMNS;
  });

  const [draggedColId, setDraggedColId] = useState(null);
  const [dragOverColId, setDragOverColId] = useState(null);

  const handleDragStart = (e, colId) => {
    setDraggedColId(colId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', colId);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    if (draggedColId === colId) return;
    if (dragOverColId !== colId) {
      setDragOverColId(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    if (dragOverColId === colId) {
      setDragOverColId(null);
    }
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    if (!draggedColId || draggedColId === targetColId) {
      setDraggedColId(null);
      setDragOverColId(null);
      return;
    }

    const sourceIdx = columnOrder.indexOf(draggedColId);
    const targetIdx = columnOrder.indexOf(targetColId);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const newOrder = [...columnOrder];
      newOrder.splice(sourceIdx, 1);
      newOrder.splice(targetIdx, 0, draggedColId);
      setColumnOrder(newOrder);
      localStorage.setItem('planning_column_order', JSON.stringify(newOrder));
    }
    setDraggedColId(null);
    setDragOverColId(null);
  };

  const handleDragEnd = () => {
    setDraggedColId(null);
    setDragOverColId(null);
  };

  const getColumnLabel = (colId) => {
    switch (colId) {
      case 'sr_no': return 'Sr. No.';
      case 'order_number': return 'Order Number';
      case 'po_number': return 'PO Number';
      case 'reference_number': return 'Cust. Ref #';
      case 'part_number': return 'Part Number';
      case 'client_name': return 'Client Name';
      case 'end_client_name': return 'End Client Name';
      case 'planned_dispatch': return 'Planned Dispatch';
      case 'mounting_start': return 'Mounting Start';
      case 'mounting_complete': return 'Mounting Complete';
      case 'delivery_date': return 'Order Delivery Date';
      case 'wiring_assigned': return 'Wiring Assigned';
      case 'wiring_expected': return 'Wiring Expected';
      case 'expected_qc': return 'Expected QC';
      case 'priority': return 'Priority';
      case 'status': return 'Status';
      case 'qc_status': return 'QC Status';
      case 'qc_date': return 'QC Passed Date';
      case 'progress': return 'Progress';
      case 'action': return 'Action';
      default: return colId;
    }
  };

  const activeColumns = columnOrder.filter(colId => {
    if (colId === 'action' && !canEdit) return false;
    return true;
  });

  const renderCell = (columnId, order, globalIdx, progressPct) => {
    const isEditing = editingCell && editingCell.lineItemId === order.line_item_id && editingCell.colId === columnId;
    const isSaving = savingCell && savingCell.lineItemId === order.line_item_id && savingCell.colId === columnId;

    if (isSaving) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="inline-saving-spinner"></span>
          <span className="dim text-xs">Saving...</span>
        </div>
      );
    }

    if (isEditing) {
      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          e.target.blur();
        } else if (e.key === 'Escape') {
          setEditingCell(null);
        }
      };

      const handleSelectChange = (val) => {
        saveInlineField(order.line_item_id, columnId, val, editingCell.oldValue);
      };

      const handleBlur = () => {
        if (editingCell && editingCell.lineItemId === order.line_item_id && editingCell.colId === columnId) {
          saveInlineField(order.line_item_id, columnId, editingCell.value, editingCell.oldValue);
        }
      };

      if (['priority', 'status', 'qc_status'].includes(columnId)) {
        let options = [];
        if (columnId === 'priority') {
          options = ['Low', 'Medium', 'High', 'Urgent'];
        } else if (columnId === 'status') {
          options = ['Not Started', 'In Progress', 'Waiting for Material', 'QC Testing', 'Completed'];
        } else if (columnId === 'qc_status') {
          options = ['Pending', 'Pass', 'Fail'];
        }
        return (
          <select
            className="inline-edit-select"
            value={editingCell.value}
            onChange={(e) => handleSelectChange(e.target.value)}
            onBlur={handleBlur}
            autoFocus
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        );
      }

      if (['planned_dispatch', 'mounting_start', 'mounting_complete', 'wiring_assigned', 'wiring_expected', 'expected_qc', 'qc_date'].includes(columnId)) {
        return (
          <input
            type="date"
            className="inline-edit-input"
            value={editingCell.value}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        );
      }

      if (columnId === 'end_client_name') {
        return (
          <input
            type="text"
            className="inline-edit-input"
            value={editingCell.value}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        );
      }
    }

    switch (columnId) {
      case 'sr_no':
        return globalIdx;
      case 'order_number':
        return (
          <>
            {order.order_number} <span style={{ opacity: 0.5 }}>/ {order.line_item_number}</span>
          </>
        );
      case 'po_number':
        return order.po_number || <span className="dim text-xs">—</span>;
      case 'reference_number':
        return order.reference_number
          ? <span style={{ color: '#f59e0b', fontWeight: 600 }}>{order.reference_number}</span>
          : <span className="dim text-xs">—</span>;
      case 'part_number':
        return order.part_number || <span className="dim text-xs">—</span>;
      case 'client_name':
        return order.company_name;
      case 'end_client_name':
        return order.end_client_name || <span className="dim text-xs">Unspecified</span>;
      case 'planned_dispatch':
        return formatDate(order.planned_dispatch_date);
      case 'mounting_start':
        return formatDate(order.mounting_start_date);
      case 'mounting_complete':
        return formatDate(order.mounting_complete_date);
      case 'wiring_assigned':
        return formatDate(order.wiring_assigned_date);
      case 'wiring_expected':
        return formatDate(order.wiring_expected_date);
      case 'expected_qc':
        return formatDate(order.expected_qc_date);
      case 'priority':
        return (
          <span className={`priority-badge ${order.priority?.toLowerCase() || 'medium'}`}>
            {order.priority}
          </span>
        );
      case 'status':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className={`status-badge ${(order.status || 'Not Started').toLowerCase().replace(/\s+/g, '-')}`}>
              {order.status || 'Not Started'}
            </span>
            {order.active_dept && (
              <span className={`dept-badge dept-${(order.active_dept || '').toLowerCase()}`}>
                ⚙ {order.active_dept}
              </span>
            )}
          </div>
        );
      case 'qc_status':
        return (
          <span className={`qc-badge ${(order.qc_status || 'Pending').toLowerCase()}`}>
            {order.qc_status || 'Pending'}
          </span>
        );
      case 'qc_date':
        return formatDate(order.qc_date);
      case 'progress':
        return (
          <div className="progress-cell">
            <div className="progress-text">{progressPct}%</div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${progressPct}%`,
                  backgroundColor: getProgressColor(progressPct)
                }}
              />
            </div>
          </div>
        );
      case 'action':
        return canEdit ? (
          <button className="icon-btn" onClick={() => handleEditClick(order)} title="Edit planning data">
            <Edit2 size={13} />
          </button>
        ) : null;
      default:
        return null;
    }
  };
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
    end_client_name: '',
    planned_dispatch_date: '',
    mounting_start_date: '',
    mounting_complete_date: '',
    wiring_assigned_date: '',
    wiring_expected_date: '',
    expected_qc_date: '',
    priority: '',
    status: '',
    qc_status: '',
    qc_date: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [selectedRowIds, setSelectedRowIds] = useState([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkFieldsEnabled, setBulkFieldsEnabled] = useState({
    end_client_name: false,
    planned_dispatch_date: false,
    mounting_start_date: false,
    mounting_complete_date: false,
    wiring_assigned_date: false,
    wiring_expected_date: false,
    expected_qc_date: false,
    priority: false,
    status: false,
    qc_status: false,
    qc_date: false
  });
  const [bulkEditForm, setBulkEditForm] = useState({
    end_client_name: '',
    planned_dispatch_date: '',
    mounting_start_date: '',
    mounting_complete_date: '',
    wiring_assigned_date: '',
    wiring_expected_date: '',
    expected_qc_date: '',
    priority: '',
    status: '',
    qc_status: '',
    qc_date: ''
  });
  const [editingCell, setEditingCell] = useState(null); // { lineItemId, colId, value, oldValue }
  const [savingCell, setSavingCell] = useState(null); // { lineItemId, colId }

  // ── Pagination state ──
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [groupByPrimary, setGroupByPrimary] = useState('none');
  const [groupBySecondary, setGroupBySecondary] = useState('none');
  const [expandedGroups, setExpandedGroups] = useState({});

  const toggleGroupExpand = (path) => {
    setExpandedGroups(prev => ({
      ...prev,
      [path]: prev[path] === false ? true : false
    }));
  };



  useEffect(() => {
    fetchPlanningData();
  }, []);

  const fetchPlanningData = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/planning", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (err) {
      console.error('Error fetching planning data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (order) => {
    if (!canEdit) return;
    setEditingOrder(order);
    setEditForm({
      end_client_name: order.end_client_name || '',
      planned_dispatch_date: order.planned_dispatch_date ? order.planned_dispatch_date.split('T')[0] : '',
      mounting_start_date: order.mounting_start_date ? order.mounting_start_date.split('T')[0] : '',
      mounting_complete_date: order.mounting_complete_date ? order.mounting_complete_date.split('T')[0] : '',
      wiring_assigned_date: order.wiring_assigned_date ? order.wiring_assigned_date.split('T')[0] : '',
      wiring_expected_date: order.wiring_expected_date ? order.wiring_expected_date.split('T')[0] : '',
      expected_qc_date: order.expected_qc_date ? order.expected_qc_date.split('T')[0] : '',
      priority: order.priority || 'Medium',
      status: order.status || 'Not Started',
      qc_status: order.qc_status || 'Pending',
      qc_date: order.qc_date ? order.qc_date.split('T')[0] : ''
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${window.API_BASE}/api/planning/line-items/${editingOrder.line_item_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (res.ok) {
        setSuccessMessage('Planning details updated successfully.');
        setTimeout(() => {
          setEditingOrder(null);
          fetchPlanningData();
          window.dispatchEvent(new CustomEvent('orderUpdated'));
        }, 1200);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to update planning details.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error, please try again.');
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // ── Filtered rows ──
  const filteredOrders = orders.filter(order => {
    let matchesSearch = true;
    if (searchTerm.trim() !== '') {
      const tokens = searchTerm.trim().toLowerCase().split(/\s+/);
      const orderNum = (order.order_number || '').toLowerCase();
      const lineItemNum = (order.line_item_number || '').toLowerCase();
      const orderNumFull = `${order.order_number || ''} / ${order.line_item_number || ''}`.toLowerCase();
      const orderNumSpaceless = `${order.order_number || ''}/${order.line_item_number || ''}`.toLowerCase();
      const orderNumSpacelessOnly = `${order.order_number || ''}${order.line_item_number || ''}`.toLowerCase();
      const poNum = (order.po_number || '').toLowerCase();
      const partNum = (order.part_number || '').toLowerCase();
      const compName = (order.company_name || '').toLowerCase();
      const endClient = (order.end_client_name || '').toLowerCase();
      
      matchesSearch = tokens.every(token => 
        orderNum.includes(token) ||
        lineItemNum.includes(token) ||
        orderNumFull.includes(token) ||
        orderNumSpaceless.includes(token) ||
        orderNumSpacelessOnly.includes(token) ||
        poNum.includes(token) ||
        partNum.includes(token) ||
        compName.includes(token) ||
        endClient.includes(token)
      );
    }

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // ── Reset to page 1 when filters change ──
  const handleSearchChange = (v) => { setSearchTerm(v); setCurrentPage(1); };
  const handleStatusChange = (v) => { setStatusFilter(v); setCurrentPage(1); };
  const handlePriorityChange = (v) => { setPriorityFilter(v); setCurrentPage(1); };
  const handlePageSizeChange = (v) => { setPageSize(Number(v)); setCurrentPage(1); };

  // ── Pagination calculations ──
  const totalRows = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalRows);
  const pageRows = filteredOrders.slice(startIdx, endIdx);

  const getProgressColor = (pct) => {
    if (pct < 30) return '#ef4444';
    if (pct < 70) return '#f59e0b';
    return '#10b981';
  };

  // ── Page number window (show up to 7 page buttons) ──
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const delta = 3;
    const left = Math.max(1, safePage - delta);
    const right = Math.min(totalPages, safePage + delta);
    for (let i = left; i <= right; i++) pages.push(i);
    return pages;
  }, [safePage, totalPages]);

  const handleRowSelectToggle = (id) => {
    setSelectedRowIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = () => {
    const pageRowIds = pageRows.map(r => r.line_item_id);
    const allSelected = pageRowIds.every(id => selectedRowIds.includes(id));
    if (allSelected) {
      setSelectedRowIds(prev => prev.filter(id => !pageRowIds.includes(id)));
    } else {
      setSelectedRowIds(prev => {
        const newSelection = [...prev];
        pageRowIds.forEach(id => {
          if (!newSelection.includes(id)) newSelection.push(id);
        });
        return newSelection;
      });
    }
  };

  const handleBulkSave = async (e) => {
    e.preventDefault();
    const fieldsToUpdate = {};
    let hasSelection = false;
    Object.keys(bulkEditForm).forEach(key => {
      if (bulkEditForm[key] !== '') {
        fieldsToUpdate[key] = bulkEditForm[key];
        hasSelection = true;
      }
    });

    if (!hasSelection) {
      setErrorMessage('Please modify at least one field to update.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(window.API_BASE + "/api/planning/line-items/bulk", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          lineItemIds: selectedRowIds,
          fields: fieldsToUpdate
        })
      });

      if (res.ok) {
        setSuccessMessage(`Successfully updated ${selectedRowIds.length} items.`);
        setSelectedRowIds([]);
        setTimeout(() => {
          setIsBulkEditModalOpen(false);
          setErrorMessage('');
          setSuccessMessage('');
          setBulkEditForm({
            end_client_name: '',
            planned_dispatch_date: '',
            wiring_assigned_date: '',
            wiring_expected_date: '',
            expected_qc_date: '',
            priority: '',
            status: '',
            qc_status: '',
            qc_date: ''
          });
          fetchPlanningData();
          window.dispatchEvent(new CustomEvent('orderUpdated'));
        }, 1200);
      } else {
        const data = await res.json();
        setErrorMessage(data.error || 'Failed to update selected items.');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Network error, please try again.');
      setLoading(false);
    }
  };

  const handleCellClick = (e, colId, order) => {
    if (!canEdit) return;
    if (['INPUT', 'SELECT', 'OPTION', 'BUTTON', 'A', 'svg', 'path'].includes(e.target.tagName)) {
      return;
    }

    let rawValue = '';
    if (colId === 'end_client_name') {
      rawValue = order.end_client_name || '';
    } else if (colId === 'planned_dispatch') {
      rawValue = order.planned_dispatch_date ? order.planned_dispatch_date.split('T')[0] : '';
    } else if (colId === 'mounting_start') {
      rawValue = order.mounting_start_date ? order.mounting_start_date.split('T')[0] : '';
    } else if (colId === 'mounting_complete') {
      rawValue = order.mounting_complete_date ? order.mounting_complete_date.split('T')[0] : '';
    } else if (colId === 'wiring_assigned') {
      rawValue = order.wiring_assigned_date ? order.wiring_assigned_date.split('T')[0] : '';
    } else if (colId === 'wiring_expected') {
      rawValue = order.wiring_expected_date ? order.wiring_expected_date.split('T')[0] : '';
    } else if (colId === 'expected_qc') {
      rawValue = order.expected_qc_date ? order.expected_qc_date.split('T')[0] : '';
    } else if (colId === 'priority') {
      rawValue = order.priority || 'Medium';
    } else if (colId === 'status') {
      rawValue = order.status || 'Not Started';
    } else if (colId === 'qc_status') {
      rawValue = order.qc_status || 'Pending';
    } else if (colId === 'qc_date') {
      rawValue = order.qc_date ? order.qc_date.split('T')[0] : '';
    }

    setEditingCell({
      lineItemId: order.line_item_id,
      colId,
      value: rawValue,
      oldValue: rawValue
    });
  };

  const saveInlineField = async (lineItemId, colId, value, oldValue) => {
    if (value === oldValue) {
      setEditingCell(null);
      return;
    }

    setSavingCell({ lineItemId, colId });
    setEditingCell(null);

    try {
      let fieldName = colId;
      if (colId === 'planned_dispatch') fieldName = 'planned_dispatch_date';
      else if (colId === 'mounting_start') fieldName = 'mounting_start_date';
      else if (colId === 'mounting_complete') fieldName = 'mounting_complete_date';
      else if (colId === 'wiring_assigned') fieldName = 'wiring_assigned_date';
      else if (colId === 'wiring_expected') fieldName = 'wiring_expected_date';
      else if (colId === 'expected_qc') fieldName = 'expected_qc_date';

      const targetOrder = orders.find(o => o.line_item_id === lineItemId);
      if (!targetOrder) throw new Error('Order not found');

      const updateForm = {
        end_client_name: targetOrder.end_client_name || '',
        planned_dispatch_date: targetOrder.planned_dispatch_date ? targetOrder.planned_dispatch_date.split('T')[0] : '',
        mounting_start_date: targetOrder.mounting_start_date ? targetOrder.mounting_start_date.split('T')[0] : '',
        mounting_complete_date: targetOrder.mounting_complete_date ? targetOrder.mounting_complete_date.split('T')[0] : '',
        wiring_assigned_date: targetOrder.wiring_assigned_date ? targetOrder.wiring_assigned_date.split('T')[0] : '',
        wiring_expected_date: targetOrder.wiring_expected_date ? targetOrder.wiring_expected_date.split('T')[0] : '',
        expected_qc_date: targetOrder.expected_qc_date ? targetOrder.expected_qc_date.split('T')[0] : '',
        priority: targetOrder.priority || 'Medium',
        status: targetOrder.status || 'Not Started',
        qc_status: targetOrder.qc_status || 'Pending',
        qc_date: targetOrder.qc_date ? targetOrder.qc_date.split('T')[0] : ''
      };

      updateForm[fieldName] = value;

      const res = await fetch(`${window.API_BASE}/api/planning/line-items/${lineItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updateForm)
      });

      if (res.ok) {
        await fetchPlanningData();
        window.dispatchEvent(new CustomEvent('orderUpdated'));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update planning details.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error, please try again.');
    } finally {
      setSavingCell(null);
    }
  };

  const getGroupKeyValue = (order, field) => {
    if (!field || field === 'none') return '';
    switch (field) {
      case 'planned_dispatch': return formatDate(order.planned_dispatch_date);
      case 'mounting_start': return formatDate(order.mounting_start_date);
      case 'mounting_complete': return formatDate(order.mounting_complete_date);
      case 'delivery_date': return formatDate(order.delivery_date);
      case 'wiring_assigned': return formatDate(order.wiring_assigned_date);
      case 'wiring_expected': return formatDate(order.wiring_expected_date);
      case 'expected_qc': return formatDate(order.expected_qc_date);
      case 'qc_date': return formatDate(order.qc_date);
      case 'client_name': return order.company_name || 'Unspecified';
      case 'end_client_name': return order.end_client_name || 'Unspecified';
      case 'priority': return order.priority || 'Medium';
      case 'status': return order.status || 'Not Started';
      case 'qc_status': return order.qc_status || 'Pending';
      case 'active_dept': return order.active_dept || 'Planning';
      default: return order[field] || 'Unspecified';
    }
  };

  const buildGroupHierarchy = (rows) => {
    if (!groupByPrimary || groupByPrimary === 'none') {
      return { type: 'flat', rows };
    }

    const primaryGroups = {};
    rows.forEach(row => {
      const pKey = getGroupKeyValue(row, groupByPrimary);
      if (!primaryGroups[pKey]) primaryGroups[pKey] = [];
      primaryGroups[pKey].push(row);
    });

    const hierarchy = { type: 'grouped', keys: Object.keys(primaryGroups).sort(), groups: {} };

    Object.keys(primaryGroups).forEach(pKey => {
      const pRows = primaryGroups[pKey];
      if (groupBySecondary && groupBySecondary !== 'none') {
        const secondaryGroups = {};
        pRows.forEach(row => {
          const sKey = getGroupKeyValue(row, groupBySecondary);
          if (!secondaryGroups[sKey]) secondaryGroups[sKey] = [];
          secondaryGroups[sKey].push(row);
        });
        hierarchy.groups[pKey] = {
          type: 'subgrouped',
          keys: Object.keys(secondaryGroups).sort(),
          groups: secondaryGroups
        };
      } else {
        hierarchy.groups[pKey] = {
          type: 'flat',
          rows: pRows
        };
      }
    });

    return hierarchy;
  };

  const renderRow = (order, globalIdx, progressPct) => {
    const isRowSelected = selectedRowIds.includes(order.line_item_id);

    return (
      <tr key={order.line_item_id} className={`planning-row ${isRowSelected ? 'selected-row' : ''}`}>
        {canEdit && (
          <td className="col-sticky-checkbox" style={{ width: '40px', minWidth: '40px', textAlign: 'center', left: 0 }}>
            <input
              type="checkbox"
              checked={isRowSelected}
              onChange={() => handleRowSelectToggle(order.line_item_id)}
            />
          </td>
        )}
        {activeColumns.map((colId, cIdx) => {
          const isFirst = cIdx === 0;
          let tdClass = '';

          const isMono = ['sr_no', 'order_number', 'po_number', 'reference_number', 'part_number', 'planned_dispatch', 'mounting_start', 'mounting_complete', 'wiring_assigned', 'wiring_expected', 'expected_qc', 'qc_date'].includes(colId);
          if (isMono) {
            tdClass += ' mono';
          }

          if (colId === 'order_number') {
            tdClass += ' font-semibold text-accent';
          }

          let tdStyle = {};
          if (colId === 'part_number') {
            tdStyle = { maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
          }

          if (isFirst) {
            tdClass += ' col-sticky-first';
            tdStyle = { ...tdStyle, left: canEdit ? '40px' : 0 };
          }

          const isEditable = [
            'planned_dispatch',
            'mounting_start',
            'mounting_complete',
            'wiring_assigned',
            'wiring_expected',
            'expected_qc',
            'status',
            'qc_date'
          ].includes(colId);

          const isEditing = editingCell && editingCell.lineItemId === order.line_item_id && editingCell.colId === colId;
          const isSaving = savingCell && savingCell.lineItemId === order.line_item_id && savingCell.colId === colId;

          if (canEdit && isEditable) {
            tdClass += ' editable-cell';
          }
          if (isEditing) {
            tdClass += ' is-editing';
          }
          if (isSaving) {
            tdClass += ' is-saving';
          }

          return (
            <td
              key={colId}
              className={tdClass.trim()}
              style={tdStyle}
              title={colId === 'part_number' ? order.part_number : undefined}
              onClick={(e) => isEditable && handleCellClick(e, colId, order)}
            >
              {renderCell(colId, order, globalIdx, progressPct)}
            </td>
          );
        })}
      </tr>
    );
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: '#888' }}>
        Loading Planning Records...
      </div>
    );
  }

  return (
    <div className="planning-module">
      {/* ── Search & Filter Controls ── */}
      <div className="planning-controls">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search by PO, Client, End Client, or Order Number..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <div className="filter-select-wrapper">
            <label>Status</label>
            <select value={statusFilter} onChange={(e) => handleStatusChange(e.target.value)}>
              <option value="all">All Statuses</option>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Material">Waiting for Material</option>
              <option value="QC Testing">QC Testing</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label>Priority</label>
            <select value={priorityFilter} onChange={(e) => handlePriorityChange(e.target.value)}>
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label>Group By</label>
            <select value={groupByPrimary} onChange={(e) => {
              setGroupByPrimary(e.target.value);
              if (e.target.value === 'none') {
                setGroupBySecondary('none');
              }
            }}>
              <option value="none">None</option>
              <option value="client_name">Client Name</option>
              <option value="end_client_name">End Client Name</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="qc_status">QC Status</option>
              <option value="planned_dispatch">Planned Dispatch Date</option>
              <option value="mounting_start">Mounting Start Date</option>
              <option value="mounting_complete">Mounting Complete Date</option>
              <option value="wiring_assigned">Wiring Assigned Date</option>
              <option value="wiring_expected">Wiring Expected Date</option>
              <option value="expected_qc">Expected QC Date</option>
              <option value="qc_date">QC Passed Date</option>
              <option value="delivery_date">Order Delivery Date</option>
              <option value="active_dept">Active Dept</option>
            </select>
          </div>

          <div className="filter-select-wrapper">
            <label>Then Group By</label>
            <select
              value={groupBySecondary}
              onChange={(e) => setGroupBySecondary(e.target.value)}
              disabled={groupByPrimary === 'none'}
            >
              <option value="none">None</option>
              <option value="client_name">Client Name</option>
              <option value="end_client_name">End Client Name</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="qc_status">QC Status</option>
              <option value="planned_dispatch">Planned Dispatch Date</option>
              <option value="mounting_start">Mounting Start Date</option>
              <option value="mounting_complete">Mounting Complete Date</option>
              <option value="wiring_assigned">Wiring Assigned Date</option>
              <option value="wiring_expected">Wiring Expected Date</option>
              <option value="expected_qc">Expected QC Date</option>
              <option value="qc_date">QC Passed Date</option>
              <option value="delivery_date">Order Delivery Date</option>
              <option value="active_dept">Active Dept</option>
            </select>
          </div>

          <button
            className="reset-columns-btn"
            onClick={() => {
              setColumnOrder(DEFAULT_COLUMNS);
              localStorage.removeItem('planning_column_order');
            }}
            title="Reset columns to default order"
          >
            Reset Columns
          </button>
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="table-responsive">
        <table className="planning-table">
          <thead>
            <tr>
              {canEdit && (
                <th className="col-sticky-checkbox" style={{ width: '40px', minWidth: '40px', textAlign: 'center', left: 0 }}>
                  <input
                    type="checkbox"
                    checked={pageRows.length > 0 && pageRows.every(r => selectedRowIds.includes(r.line_item_id))}
                    onChange={handleSelectAllToggle}
                  />
                </th>
              )}
              {activeColumns.map((colId, idx) => {
                const isFirst = idx === 0;
                const columnLabel = getColumnLabel(colId);
                const isOver = dragOverColId === colId;
                const draggedIdx = columnOrder.indexOf(draggedColId);
                const targetIdx = columnOrder.indexOf(colId);

                let dragOverClass = '';
                if (isOver && draggedIdx !== -1 && draggedIdx !== targetIdx) {
                  dragOverClass = draggedIdx < targetIdx ? ' drag-over-right' : ' drag-over-left';
                }

                let thStyle = {};
                let thClass = `${draggedColId === colId ? ' dragging' : ''}${dragOverClass}`;
                if (isFirst) {
                  thClass += ' col-sticky-first';
                  thStyle = { left: canEdit ? '40px' : 0 };
                }

                return (
                  <th
                    key={colId}
                    className={thClass.trim()}
                    style={thStyle}
                    draggable
                    onDragStart={(e) => handleDragStart(e, colId)}
                    onDragOver={(e) => handleDragOver(e, colId)}
                    onDragLeave={(e) => handleDragLeave(e, colId)}
                    onDrop={(e) => handleDrop(e, colId)}
                    onDragEnd={handleDragEnd}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GripVertical size={12} className="drag-handle" />
                      <span>{columnLabel}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={activeColumns.length + (canEdit ? 1 : 0)} style={{ textAlign: 'center', padding: '32px', color: '#666', fontStyle: 'italic' }}>
                  No planning records match your search criteria.
                </td>
              </tr>
            ) : (
              (() => {
                const hierarchy = buildGroupHierarchy(pageRows);
                if (hierarchy.type === 'flat') {
                  return hierarchy.rows.map((order, idx) => {
                    const totalSteps = parseInt(order.total_steps || 0);
                    const doneSteps = parseInt(order.done_steps || 0);
                    const progressPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
                    return renderRow(order, startIdx + idx + 1, progressPct);
                  });
                }

                let globalRowIndex = startIdx;
                return hierarchy.keys.map(pKey => {
                  const pGroup = hierarchy.groups[pKey];
                  const pGroupPath = `p:${pKey}`;
                  const isPExpanded = expandedGroups[pGroupPath] !== false;

                  let pTotalItems = 0;
                  if (pGroup.type === 'flat') {
                    pTotalItems = pGroup.rows.length;
                  } else {
                    pGroup.keys.forEach(sKey => {
                      pTotalItems += pGroup.groups[sKey].length;
                    });
                  }

                  return (
                    <React.Fragment key={pGroupPath}>
                      <tr className="group-header-row primary" onClick={() => toggleGroupExpand(pGroupPath)}>
                        <td colSpan={activeColumns.length + (canEdit ? 1 : 0)}>
                          <div className="group-header-content">
                            <span className="expand-icon">
                              {isPExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </span>
                            <span className="group-title">
                              <strong>{getColumnLabel(groupByPrimary)}:</strong> {pKey}
                            </span>
                            <span className="group-badge">{pTotalItems} items</span>
                          </div>
                        </td>
                      </tr>

                      {isPExpanded && (
                        pGroup.type === 'flat' ? (
                          pGroup.rows.map(order => {
                            globalRowIndex++;
                            const totalSteps = parseInt(order.total_steps || 0);
                            const doneSteps = parseInt(order.done_steps || 0);
                            const progressPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
                            return renderRow(order, globalRowIndex, progressPct);
                          })
                        ) : (
                          pGroup.keys.map(sKey => {
                            const sRows = pGroup.groups[sKey];
                            const sGroupPath = `p:${pKey}|s:${sKey}`;
                            const isSExpanded = expandedGroups[sGroupPath] !== false;

                            return (
                              <React.Fragment key={sGroupPath}>
                                <tr className="group-header-row secondary" onClick={() => toggleGroupExpand(sGroupPath)}>
                                  <td colSpan={activeColumns.length + (canEdit ? 1 : 0)}>
                                    <div className="group-header-content secondary-content" style={{ paddingLeft: '24px' }}>
                                      <span className="expand-icon">
                                        {isSExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                      </span>
                                      <span className="group-title">
                                        <strong>{getColumnLabel(groupBySecondary)}:</strong> {sKey}
                                      </span>
                                      <span className="group-badge secondary-badge">{sRows.length} items</span>
                                    </div>
                                  </td>
                                </tr>

                                {isSExpanded && (
                                  sRows.map(order => {
                                    globalRowIndex++;
                                    const totalSteps = parseInt(order.total_steps || 0);
                                    const doneSteps = parseInt(order.done_steps || 0);
                                    const progressPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
                                    return renderRow(order, globalRowIndex, progressPct);
                                  })
                                )}
                              </React.Fragment>
                            );
                          })
                        )
                      )}
                    </React.Fragment>
                  );
                });
              })()
            )}
          </tbody>
        </table>
      </div>

      {/* ── Pagination Bar ── */}
      <div className="pagination-bar">
        {/* Left: row info + page size */}
        <div className="pagination-info">
          <span className="row-count">
            {totalRows === 0
              ? 'No records'
              : `Showing ${startIdx + 1}–${endIdx} of ${totalRows} records`}
          </span>
          <div className="page-size-control">
            <span>Rows per page</span>
            <select value={pageSize} onChange={(e) => handlePageSizeChange(e.target.value)}>
              {PAGE_SIZE_OPTIONS.map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: navigation */}
        <div className="pagination-nav">
          {/* First */}
          <button
            className="pg-btn"
            onClick={() => setCurrentPage(1)}
            disabled={safePage === 1}
            title="First page"
          >
            <ChevronsLeft size={14} />
          </button>

          {/* Prev */}
          <button
            className="pg-btn"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            title="Previous page"
          >
            <ChevronLeft size={14} />
          </button>

          {/* Page numbers */}
          {getPageNumbers().map(n => (
            <button
              key={n}
              className={`pg-btn pg-num ${n === safePage ? 'active' : ''}`}
              onClick={() => setCurrentPage(n)}
            >
              {n}
            </button>
          ))}

          {/* Next */}
          <button
            className="pg-btn"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            title="Next page"
          >
            <ChevronRight size={14} />
          </button>

          {/* Last */}
          <button
            className="pg-btn"
            onClick={() => setCurrentPage(totalPages)}
            disabled={safePage === totalPages}
            title="Last page"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>

      {/* ── Edit Planning Modal ── */}
      {editingOrder && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target.className === 'modal-overlay open') setEditingOrder(null); }}>
          <div className="modal" style={{ maxWidth: '520px', width: '95%' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Edit Planning Parameters</div>
                <div className="modal-sub">Order: {editingOrder.order_number} / Line: {editingOrder.line_item_number} (PO: {editingOrder.po_number || 'N/A'})</div>
              </div>
              <button className="modal-close" onClick={() => setEditingOrder(null)}><X size={18} /></button>
            </div>

            <form onSubmit={handleSave} className="modal-body">
              {errorMessage && (
                <div className="alert-message error">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="alert-message success">
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="modal-form-grid">
                <div className="modal-field">
                  <label>Planned Dispatch Date</label>
                  <input
                    type="date"
                    name="planned_dispatch_date"
                    value={editForm.planned_dispatch_date}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>

                <div className="modal-field">
                  <label>Mounting Start Date</label>
                  <input
                    type="date"
                    name="mounting_start_date"
                    value={editForm.mounting_start_date}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>

                <div className="modal-field">
                  <label>Mounting Complete Date</label>
                  <input
                    type="date"
                    name="mounting_complete_date"
                    value={editForm.mounting_complete_date}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>

                <div className="modal-field">
                  <label>Wiring Assigned Date</label>
                  <input
                    type="date"
                    name="wiring_assigned_date"
                    value={editForm.wiring_assigned_date}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>

                <div className="modal-field">
                  <label>Wiring Expected Date</label>
                  <input
                    type="date"
                    name="wiring_expected_date"
                    value={editForm.wiring_expected_date}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>

                <div className="modal-field">
                  <label>Expected QC Date</label>
                  <input
                    type="date"
                    name="expected_qc_date"
                    value={editForm.expected_qc_date}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>



                <div className="modal-field">
                  <label>Overall Planning Status</label>
                  <select name="status" value={editForm.status} onChange={handleFormChange} className="form-select">
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting for Material">Waiting for Material</option>
                    <option value="QC Testing">QC Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>



                <div className="modal-field">
                  <label>QC Passed Date</label>
                  <input
                    type="date"
                    name="qc_date"
                    value={editForm.qc_date}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setEditingOrder(null)}>Cancel</button>
                <button type="submit" className="btn-save">Save Planning Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Bulk Actions Floating Banner ── */}
      {selectedRowIds.length > 0 && (
        <div className="bulk-actions-banner">
          <div className="bulk-actions-content">
            <span className="bulk-count">
              <strong>{selectedRowIds.length}</strong> items selected
            </span>
            <div className="bulk-buttons">
              <button className="btn-bulk-edit" onClick={() => {
                setBulkEditForm({
                  end_client_name: '',
                  planned_dispatch_date: '',
                  wiring_assigned_date: '',
                  wiring_expected_date: '',
                  expected_qc_date: '',
                  priority: '',
                  status: '',
                  qc_status: '',
                  qc_date: ''
                });
                setIsBulkEditModalOpen(true);
              }}>
                Bulk Edit Parameters
              </button>
              <button className="btn-bulk-clear" onClick={() => setSelectedRowIds([])}>
                Deselect All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Edit Modal ── */}
      {isBulkEditModalOpen && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target.className === 'modal-overlay open') setIsBulkEditModalOpen(false); }}>
          <div className="modal" style={{ maxWidth: '560px', width: '95%' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Bulk Edit Planning Parameters</div>
                <div className="modal-sub">Updating {selectedRowIds.length} selected line items</div>
              </div>
              <button className="modal-close" onClick={() => setIsBulkEditModalOpen(false)}><X size={18} /></button>
            </div>

            <form onSubmit={handleBulkSave} className="modal-body">
              {errorMessage && (
                <div className="alert-message error">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}
              {successMessage && (
                <div className="alert-message success">
                  <CheckCircle2 size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              <p className="bulk-instructions">
                Enter values or select options for parameters you want to update for all selected items. Blank fields will remain unchanged.
              </p>

              <div className="modal-form-grid">
                {/* Planned Dispatch Date */}
                <div className="modal-field">
                  <label>Planned Dispatch Date</label>
                  <input
                    type="date"
                    value={bulkEditForm.planned_dispatch_date}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, planned_dispatch_date: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Mounting Start Date */}
                <div className="modal-field">
                  <label>Mounting Start Date</label>
                  <input
                    type="date"
                    value={bulkEditForm.mounting_start_date}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, mounting_start_date: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Mounting Complete Date */}
                <div className="modal-field">
                  <label>Mounting Complete Date</label>
                  <input
                    type="date"
                    value={bulkEditForm.mounting_complete_date}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, mounting_complete_date: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Wiring Assigned Date */}
                <div className="modal-field">
                  <label>Wiring Assigned Date</label>
                  <input
                    type="date"
                    value={bulkEditForm.wiring_assigned_date}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, wiring_assigned_date: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Wiring Expected Date */}
                <div className="modal-field">
                  <label>Wiring Expected Date</label>
                  <input
                    type="date"
                    value={bulkEditForm.wiring_expected_date}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, wiring_expected_date: e.target.value })}
                    className="form-input"
                  />
                </div>

                {/* Expected QC Date */}
                <div className="modal-field">
                  <label>Expected QC Date</label>
                  <input
                    type="date"
                    value={bulkEditForm.expected_qc_date}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, expected_qc_date: e.target.value })}
                    className="form-input"
                  />
                </div>



                {/* Status */}
                <div className="modal-field">
                  <label>Planning Status</label>
                  <select
                    value={bulkEditForm.status}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, status: e.target.value })}
                    className="form-select"
                  >
                    <option value="">Leave unchanged</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting for Material">Waiting for Material</option>
                    <option value="QC Testing">QC Testing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>



                 {/* QC Date */}
                 <div className="modal-field">
                   <label>QC Passed Date</label>
                  <input
                    type="date"
                    value={bulkEditForm.qc_date}
                    onChange={(e) => setBulkEditForm({ ...bulkEditForm, qc_date: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsBulkEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-save">Apply Bulk Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Custom CSS for Planning Module ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .planning-module {
          display: flex;
          flex-direction: column;
          gap: 16px;
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .planning-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          background: var(--bg2, #14161a);
          border: 1px solid var(--border, #2a2f3a);
          border-radius: var(--radius-lg, 10px);
          padding: 12px 16px;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 480px;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text3, #5a6070);
          pointer-events: none;
        }

        .search-box input {
          width: 100%;
          background: var(--bg, #0e0f11);
          border: 1px solid var(--border2, #363d4a);
          border-radius: var(--radius, 6px);
          padding: 8px 12px 8px 36px;
          color: var(--text, #e8eaf0);
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s;
        }

        .search-box input:focus {
          border-color: var(--accent, #f59e0b);
        }

        .filter-group {
          display: flex;
          gap: 12px;
        }

        .filter-select-wrapper {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .filter-select-wrapper label {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text3, #5a6070);
        }

        .filter-select-wrapper select {
          background: var(--bg, #0e0f11);
          border: 1px solid var(--border2, #363d4a);
          border-radius: var(--radius, 6px);
          padding: 6px 12px;
          color: var(--text2, #8a93a8);
          font-size: 12px;
          outline: none;
          cursor: pointer;
        }

        .filter-select-wrapper select:focus {
          border-color: var(--accent, #f59e0b);
          color: var(--text, #e8eaf0);
        }

        /* ─── Table ─── */
        .table-responsive {
          background: var(--bg2, #14161a);
          border: 1px solid var(--border, #2a2f3a);
          border-radius: var(--radius-lg, 10px);
          overflow-x: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
        }

        .planning-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          font-size: 12px;
          text-align: left;
        }

        .planning-table th {
          background: var(--bg2, #14161a);
          border-bottom: 1px solid var(--border, #2a2f3a);
          padding: 12px 14px;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--text2, #8a93a8);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 500;
          white-space: nowrap;
          position: sticky;
          top: 0;
          z-index: 2;
        }

        /* Sticky first column */
        .col-sticky {
          position: sticky !important;
          left: 0;
          z-index: 3 !important;
          background: var(--bg2, #14161a) !important;
          box-shadow: 2px 0 6px rgba(0,0,0,0.3);
        }

        .col-sticky-td {
          background: var(--bg2, #14161a);
          box-shadow: 2px 0 6px rgba(0,0,0,0.3);
        }

        .planning-row:hover .col-sticky-td {
          background: #1a1d23;
        }

        .planning-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: background 0.15s;
        }

        .planning-row:hover {
          background: #1a1d23;
        }

        /* Draggable Columns styling */
        .planning-table th {
          cursor: grab;
          transition: background-color 0.15s, box-shadow 0.15s;
        }
        .planning-table th:active {
          cursor: grabbing;
        }
        .drag-handle {
          color: var(--text3, #5a6070);
          opacity: 0.4;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        .planning-table th:hover .drag-handle {
          opacity: 0.9;
          color: var(--accent, #f59e0b);
        }
        .dragging {
          opacity: 0.4;
          border: 1px dashed var(--accent, #f59e0b) !important;
        }
        .drag-over-left {
          box-shadow: inset 3px 0 0 0 var(--accent, #f59e0b) !important;
        }
        .drag-over-right {
          box-shadow: inset -3px 0 0 0 var(--accent, #f59e0b) !important;
        }

        .reset-columns-btn {
          align-self: flex-end;
          background: none;
          border: 1px solid var(--border2, #363d4a);
          color: var(--text2, #8a93a8);
          padding: 6px 12px;
          height: 32px;
          border-radius: var(--radius, 6px);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .reset-columns-btn:hover {
          border-color: var(--accent, #f59e0b);
          color: var(--text, #e8eaf0);
          background: rgba(245,158,11,0.05);
        }

        .planning-table td {
          padding: 10px 14px;
          color: var(--text, #e8eaf0);
          white-space: nowrap;
          vertical-align: middle;
          border-bottom: 1px solid rgba(255,255,255,0.03);
        }

        .planning-table td.mono {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text2, #8a93a8);
        }

        .text-accent { color: var(--accent, #f59e0b) !important; }
        .font-semibold { font-weight: 600; }
        .dim { color: var(--text3, #5a6070); }
        .text-xs { font-size: 10px; }

        .priority-badge {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }
        .priority-badge.low    { background: rgba(156,163,175,0.1); color: #9ca3af; border: 1px solid rgba(156,163,175,0.2); }
        .priority-badge.medium { background: rgba(59,130,246,0.1);  color: #60a5fa; border: 1px solid rgba(59,130,246,0.2);  }
        .priority-badge.high   { background: rgba(245,158,11,0.1);  color: #fbbf24; border: 1px solid rgba(245,158,11,0.2);  }
        .priority-badge.urgent { background: rgba(239,68,68,0.1);   color: #f87171; border: 1px solid rgba(239,68,68,0.2);   }

        .status-badge {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }
        .status-badge.not-started          { background: rgba(156,163,175,0.1); color: #9ca3af; border: 1px solid rgba(156,163,175,0.2); }
        .status-badge.in-progress          { background: rgba(59,130,246,0.1);  color: #3b82f6; border: 1px solid rgba(59,130,246,0.2);  }
        .status-badge.waiting-for-material { background: rgba(167,139,250,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.2); }
        .status-badge.qc-testing           { background: rgba(245,158,11,0.1);  color: #f59e0b; border: 1px solid rgba(245,158,11,0.2);  }
        .status-badge.completed            { background: rgba(34,197,94,0.1);   color: #22c55e; border: 1px solid rgba(34,197,94,0.2);   }

        .qc-badge {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
        }
        .qc-badge.pending { background: rgba(245,158,11,0.08); color: #fbbf24; }
        .qc-badge.pass    { background: rgba(34,197,94,0.08);  color: #22c55e; }
        .qc-badge.fail    { background: rgba(239,68,68,0.08);  color: #ef4444; }

        /* Department badge in Status column */
        .dept-badge {
          font-size: 9px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          display: inline-block;
          letter-spacing: 0.5px;
        }
        .dept-badge.dept-planning    { background: rgba(156,163,175,0.12); color: #9ca3af; }
        .dept-badge.dept-sales       { background: rgba(99,102,241,0.15);  color: #818cf8; }
        .dept-badge.dept-design      { background: rgba(167,139,250,0.15); color: #c084fc; }
        .dept-badge.dept-purchase    { background: rgba(251,191,36,0.12);  color: #fbbf24; }
        .dept-badge.dept-stores      { background: rgba(251,191,36,0.12);  color: #fbbf24; }
        .dept-badge.dept-production  { background: rgba(59,130,246,0.15);  color: #60a5fa; }
        .dept-badge.dept-qc          { background: rgba(245,158,11,0.15);  color: #f59e0b; }
        .dept-badge.dept-dispatch    { background: rgba(34,197,94,0.15);   color: #4ade80; }
        .dept-badge.dept-accounts    { background: rgba(34,197,94,0.15);   color: #4ade80; }

        .progress-cell {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 110px;
        }

        .progress-text {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          color: var(--text, #e8eaf0);
          font-weight: 600;
          width: 28px;
          text-align: right;
        }

        .progress-track {
          flex: 1;
          height: 5px;
          background: var(--bg4, #242830);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease-out;
        }

        .icon-btn {
          background: none;
          border: 1px solid var(--border2, #363d4a);
          color: var(--text2, #8a93a8);
          padding: 4px 6px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-btn:hover {
          border-color: var(--accent, #f59e0b);
          color: var(--text, #e8eaf0);
          background: rgba(245,158,11,0.05);
        }

        /* ─── Pagination Bar ─── */
        .pagination-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          background: var(--bg2, #14161a);
          border: 1px solid var(--border, #2a2f3a);
          border-radius: var(--radius-lg, 10px);
          padding: 10px 16px;
          flex-wrap: wrap;
        }

        .pagination-info {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .row-count {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: var(--text2, #8a93a8);
        }

        .page-size-control {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          color: var(--text3, #5a6070);
        }

        .page-size-control select {
          background: var(--bg, #0e0f11);
          border: 1px solid var(--border2, #363d4a);
          border-radius: 5px;
          padding: 4px 8px;
          color: var(--text2, #8a93a8);
          font-size: 11px;
          outline: none;
          cursor: pointer;
          transition: border-color 0.15s;
        }

        .page-size-control select:focus {
          border-color: var(--accent, #f59e0b);
        }

        .pagination-nav {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .pg-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 30px;
          height: 30px;
          padding: 0 6px;
          background: var(--bg, #0e0f11);
          border: 1px solid var(--border2, #363d4a);
          border-radius: 6px;
          color: var(--text2, #8a93a8);
          font-size: 12px;
          font-family: var(--font-mono, monospace);
          cursor: pointer;
          transition: all 0.15s;
          user-select: none;
        }

        .pg-btn:hover:not(:disabled) {
          border-color: var(--accent, #f59e0b);
          color: var(--text, #e8eaf0);
          background: rgba(245,158,11,0.06);
        }

        .pg-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .pg-btn.active {
          background: var(--accent, #f59e0b);
          border-color: var(--accent, #f59e0b);
          color: #000;
          font-weight: 700;
        }

        /* Modal Styles */
        .modal-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .modal-form-grid .full {
          grid-column: span 2;
        }

        .modal-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .modal-field label {
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          color: var(--text3, #5a6070);
          letter-spacing: 0.5px;
        }

        .alert-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          margin-bottom: 14px;
          line-height: 1.4;
        }

        .alert-message.error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.2);
          color: #f87171;
        }

        .alert-message.success {
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.2);
          color: #4ade80;
        }

        /* ── Sticky Checkbox Column ── */
        .col-sticky-checkbox {
          position: sticky !important;
          left: 0;
          z-index: 3 !important;
          background: var(--bg2, #14161a) !important;
          border-right: 1px solid var(--border, #2a2f3a);
          width: 40px;
          min-width: 40px;
          text-align: center;
          vertical-align: middle;
        }

        .col-sticky-checkbox input[type="checkbox"] {
          cursor: pointer;
          accent-color: var(--accent, #f59e0b);
          width: 14px;
          height: 14px;
          vertical-align: middle;
        }

        .col-sticky-first {
          position: sticky !important;
          z-index: 3 !important;
          background: var(--bg2, #14161a) !important;
          box-shadow: 2px 0 6px rgba(0, 0, 0, 0.3);
        }

        .selected-row {
          background: rgba(245, 158, 11, 0.03) !important;
        }

        .selected-row:hover {
          background: rgba(245, 158, 11, 0.06) !important;
        }

        /* ── Click-to-Edit Styles ── */
        .planning-table td.editable-cell {
          cursor: pointer;
          position: relative;
          transition: background-color 0.15s;
        }

        .planning-table td.editable-cell:hover {
          background: rgba(245, 158, 11, 0.05) !important;
        }

        .planning-table td.editable-cell::after {
          content: '✎';
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 10px;
          color: var(--text3, #5a6070);
          opacity: 0;
          transition: opacity 0.15s;
          pointer-events: none;
        }

        .planning-table td.editable-cell:hover::after {
          opacity: 0.6;
        }

        .planning-table td.editable-cell.is-editing::after,
        .planning-table td.editable-cell.is-saving::after {
          display: none !important;
        }

        .inline-edit-input, .inline-edit-select {
          width: 100%;
          background: var(--bg, #0e0f11);
          border: 1px solid var(--accent, #f59e0b);
          border-radius: 4px;
          padding: 4px 6px;
          color: var(--text, #e8eaf0);
          font-size: 11px;
          outline: none;
          font-family: inherit;
          box-sizing: border-box;
        }

        .inline-edit-input:focus, .inline-edit-select:focus {
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
        }

        .inline-saving-spinner {
          width: 12px;
          height: 12px;
          border: 2px solid rgba(245, 158, 11, 0.2);
          border-top-color: var(--accent, #f59e0b);
          border-radius: 50%;
          animation: inline-spin 0.6s linear infinite;
          display: inline-block;
          margin-right: 4px;
        }

        @keyframes inline-spin {
          to { transform: rotate(360deg); }
        }

        /* ── Bulk Actions Floating Banner ── */
        .bulk-actions-banner {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 99;
          background: rgba(20, 22, 26, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(245, 158, 11, 0.3);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 16px rgba(245, 158, 11, 0.1);
          border-radius: 12px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          max-width: 90%;
          width: 500px;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        .bulk-actions-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 16px;
        }

        .bulk-count {
          color: var(--text, #e8eaf0);
          font-size: 13px;
        }

        .bulk-count strong {
          color: var(--accent, #f59e0b);
          font-size: 15px;
        }

        .bulk-buttons {
          display: flex;
          gap: 10px;
        }

        .btn-bulk-edit {
          background: var(--accent, #f59e0b);
          border: none;
          color: #000;
          font-weight: 600;
          font-size: 12px;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }

        .btn-bulk-edit:hover {
          background: #d97706;
        }

        .btn-bulk-edit:active {
          transform: scale(0.98);
        }

        .btn-bulk-clear {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border2, #363d4a);
          color: var(--text2, #8a93a8);
          font-weight: 500;
          font-size: 12px;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-bulk-clear:hover {
          background: rgba(255, 255, 255, 0.1);
          color: var(--text, #e8eaf0);
          border-color: var(--border, #2a2f3a);
        }

        /* ── Bulk Edit Modal Styles ── */
        .bulk-instructions {
          font-size: 12px;
          color: var(--text2, #8a93a8);
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .bulk-grid {
          gap: 16px 20px;
        }

        .bulk-field-row {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start;
          gap: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          padding-bottom: 12px;
        }

        .bulk-field-row input[type="checkbox"] {
          margin-top: 26px;
          cursor: pointer;
          accent-color: var(--accent, #f59e0b);
          width: 14px;
          height: 14px;
        }

        .bulk-field-row.full input[type="checkbox"] {
          margin-top: 26px;
        }

        .bulk-field-input-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .bulk-field-input-wrapper label {
          font-size: 10px;
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
          color: var(--text3, #5a6070);
          letter-spacing: 0.5px;
        }

        .bulk-field-input-wrapper input:disabled,
        .bulk-field-input-wrapper select:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          background: rgba(0, 0, 0, 0.2) !important;
          border-color: rgba(255, 255, 255, 0.05) !important;
        }

        /* ── Grouping Styles ── */
        .group-header-row {
          background: var(--bg2, #14161a) !important;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.15s;
        }
        .group-header-row:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .group-header-row.primary {
          border-bottom: 2px solid var(--border2, #363d4a);
        }
        .group-header-row.secondary {
          border-bottom: 1px dashed var(--border, #2a2f3a);
        }
        .group-header-content {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          color: var(--text, #e8eaf0);
          font-size: 13px;
        }
        .secondary-content {
          font-size: 12px;
          color: var(--text2, #8a93a8);
        }
        .expand-icon {
          color: var(--accent, #f59e0b);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 16px;
          height: 16px;
        }
        .group-title {
          font-family: var(--font-mono, monospace);
        }
        .group-badge {
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent, #f59e0b);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        .secondary-badge {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text2, #8a93a8);
        }
      `}} />
    </div>
  );
}
