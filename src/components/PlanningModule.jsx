import { useState, useEffect, useCallback } from 'react';
import { Search, Edit2, CheckCircle2, AlertCircle, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function PlanningModule() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({
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
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // ── Pagination state ──
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canEdit = ['Admin', 'Manager', 'Production', 'Sales'].includes(user.role);

  useEffect(() => {
    fetchPlanningData();
  }, []);

  const fetchPlanningData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/planning', {
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
      const res = await fetch(`http://localhost:5000/api/planning/line-items/${editingOrder.line_item_id}`, {
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
    const matchesSearch =
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.po_number || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.end_client_name || '').toLowerCase().includes(searchTerm.toLowerCase());

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
        </div>
      </div>

      {/* ── Data Table ── */}
      <div className="table-responsive">
        <table className="planning-table">
          <thead>
            <tr>
              <th className="col-sticky">Sr. No.</th>
              <th>Order Number</th>
              <th>PO Number</th>
              <th>Part Number</th>
              <th>Client Name</th>
              <th>End Client Name</th>
              <th>Planned Dispatch</th>
              <th>Wiring Assigned</th>
              <th>Wiring Expected</th>
              <th>Expected QC</th>
              <th>Priority</th>
              <th>Status</th>
              <th>QC Status</th>
              <th>QC Date</th>
              <th>Progress</th>
              {canEdit && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={canEdit ? 16 : 15} style={{ textAlign: 'center', padding: '32px', color: '#666', fontStyle: 'italic' }}>
                  No planning records match your search criteria.
                </td>
              </tr>
            ) : (
              pageRows.map((order, idx) => {
                const totalSteps = parseInt(order.total_steps || 0);
                const doneSteps = parseInt(order.done_steps || 0);
                const progressPct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
                const globalIdx = startIdx + idx + 1;

                return (
                  <tr key={order.line_item_id} className="planning-row">
                    <td className="mono col-sticky col-sticky-td">{globalIdx}</td>
                    <td className="mono font-semibold text-accent">
                      {order.order_number} <span style={{ opacity: 0.5 }}>/ {order.line_item_number}</span>
                    </td>
                    <td className="mono">{order.po_number || <span className="dim text-xs">—</span>}</td>
                    <td className="mono" style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={order.part_number}>
                      {order.part_number || <span className="dim text-xs">—</span>}
                    </td>
                    <td>{order.company_name}</td>
                    <td>{order.end_client_name || <span className="dim text-xs">Unspecified</span>}</td>
                    <td className="mono">{formatDate(order.planned_dispatch_date)}</td>
                    <td className="mono">{formatDate(order.wiring_assigned_date)}</td>
                    <td className="mono">{formatDate(order.wiring_expected_date)}</td>
                    <td className="mono">{formatDate(order.expected_qc_date)}</td>
                    <td>
                      <span className={`priority-badge ${order.priority?.toLowerCase() || 'medium'}`}>
                        {order.priority}
                      </span>
                    </td>
                    <td>
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
                    </td>
                    <td>
                      <span className={`qc-badge ${(order.qc_status || 'Pending').toLowerCase()}`}>
                        {order.qc_status || 'Pending'}
                      </span>
                    </td>
                    <td className="mono">{formatDate(order.qc_date)}</td>
                    <td>
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
                    </td>
                    {canEdit && (
                      <td>
                        <button className="icon-btn" onClick={() => handleEditClick(order)} title="Edit planning data">
                          <Edit2 size={13} />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })
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
                <div className="modal-field full">
                  <label>End Client Name</label>
                  <input
                    type="text"
                    name="end_client_name"
                    value={editForm.end_client_name}
                    onChange={handleFormChange}
                    className="form-input"
                  />
                </div>

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
                  <label>Priority</label>
                  <select name="priority" value={editForm.priority} onChange={handleFormChange} className="form-select">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
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
                  <label>QC Status</label>
                  <select name="qc_status" value={editForm.qc_status} onChange={handleFormChange} className="form-select">
                    <option value="Pending">Pending</option>
                    <option value="Pass">Pass</option>
                    <option value="Fail">Fail</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label>QC Date</label>
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
      `}} />
    </div>
  );
}
