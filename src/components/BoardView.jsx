import { useState, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { DEPTS, STATUS_BADGE_MAP } from '../data/planningData';

function StatusBadge({ status }) {
  const { cls, label } = STATUS_BADGE_MAP[status] || STATUS_BADGE_MAP.pending;
  return <span className={`step-status-badge ${cls}`}>{label}</span>;
}

export default function BoardView({ currentFilter, userRole, onSetView, statCardFilter, onClearStatFilter }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('incomplete');
  const [sortBy, setSortBy] = useState('updated');
  const [searchTerm, setSearchTerm] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchBoard();

    const handleUpdate = () => {
      fetchBoard();
    };
    window.addEventListener('orderUpdated', handleUpdate);
    return () => window.removeEventListener('orderUpdated', handleUpdate);
  }, []);

  const fetchBoard = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/board", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const depts = currentFilter === 'all' ? DEPTS : DEPTS.filter((d) => d.id === currentFilter);

  if (isLoading) return <div className="loading" style={{ padding: 40, textAlign: 'center', color: '#888' }}>Loading board...</div>;

  const displayOrders = orders
    .filter(o => {
      if (statCardFilter === 'priority') {
        const p = (o.priority || 'Medium').toLowerCase();
        if (p !== 'urgent' && p !== 'high') return false;
      } else if (statCardFilter === 'inprogress') {
        const hasIP = (o.steps || []).some(s => s.status === 'inprogress');
        if (!hasIP) return false;
      } else if (statCardFilter === 'blocked') {
        const hasBlocked = (o.steps || []).some(s => s.status === 'blocked');
        if (!hasBlocked) return false;
      } else if (statCardFilter === 'due') {
        if (!o.delivery_date) return false;
        const today = new Date();
        const in7 = new Date(today);
        in7.setDate(today.getDate() + 7);
        const d = new Date(o.delivery_date);
        if (d < today || d > in7) return false;
      }

      if (priorityFilter !== 'all' && (o.priority || 'Medium').toLowerCase() !== priorityFilter) return false;
      if (statusFilter === 'incomplete' && o.status === 'completed') return false;
      if (statusFilter === 'completed' && o.status !== 'completed') return false;
      
      if (searchTerm.trim() !== '') {
        const tokens = searchTerm.trim().toLowerCase().split(/\s+/);
        const orderNum = (o.order_number || '').toLowerCase();
        const compName = (o.company_name || '').toLowerCase();
        const poNum = (o.po_number || '').toLowerCase();
        
        const matchesAllTokens = tokens.every(token => 
          orderNum.includes(token) || 
          compName.includes(token) || 
          poNum.includes(token) ||
          (o.steps && o.steps.some(s => (s.name || '').toLowerCase().includes(token) || (s.dept || '').toLowerCase().includes(token)))
        );
        if (!matchesAllTokens) return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'updated') {
        const dateA = new Date(a.updated_at || 0);
        const dateB = new Date(b.updated_at || 0);
        return dateB - dateA;
      }
      return 0; // Default is created_at desc from API
    });

  return (
    <div className="board-view-orders">
      <div className="board-filters">
        <div className="filter-group">
          <Filter size={14} className="filter-icon" />
          <span className="filter-label">Sort:</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="board-select">
            <option value="updated">Recently Updated</option>
            <option value="created">Recently Created</option>
          </select>
        </div>
        
        <div className="filter-group">
          <span className="filter-label">Status:</span>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="board-select">
            <option value="all">All Orders</option>
            <option value="incomplete">Incomplete Only</option>
            <option value="completed">Completed Only</option>
          </select>
        </div>

        <div className="filter-group">
          <span className="filter-label">Priority:</span>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="board-select">
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {statCardFilter && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: statCardFilter === 'priority' ? 'rgba(249, 115, 22, 0.12)' :
                        statCardFilter === 'inprogress' ? 'rgba(59, 130, 246, 0.12)' :
                        statCardFilter === 'blocked' ? 'rgba(239, 68, 68, 0.12)' :
                        statCardFilter === 'due' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: statCardFilter === 'priority' ? '#f97316' :
                   statCardFilter === 'inprogress' ? '#3b82f6' :
                   statCardFilter === 'blocked' ? '#ef4444' :
                   statCardFilter === 'due' ? '#a855f7' : '#f59e0b',
            border: `1px solid ${
              statCardFilter === 'priority' ? 'rgba(249, 115, 22, 0.35)' :
              statCardFilter === 'inprogress' ? 'rgba(59, 130, 246, 0.35)' :
              statCardFilter === 'blocked' ? 'rgba(239, 68, 68, 0.35)' :
              statCardFilter === 'due' ? 'rgba(168, 85, 247, 0.35)' : 'rgba(245, 158, 11, 0.35)'
            }`,
            borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>
            <span>
              Card Filter: {
                statCardFilter === 'priority' ? 'Urgent / High' :
                statCardFilter === 'inprogress' ? 'In Progress' :
                statCardFilter === 'blocked' ? 'Blocked' :
                statCardFilter === 'due' ? 'Due This Week' : 'All Active'
              }
            </span>
            <button
              onClick={onClearStatFilter}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, marginLeft: 2, display: 'flex', alignItems: 'center',
                color: 'inherit'
              }}
              title="Clear card filter"
            >
              <X size={13} />
            </button>
          </div>
        )}

        <div className="board-search-container">
          <Search size={14} className="board-search-icon" />
          <input
            type="text"
            placeholder="Search by Order, PO, Company or Task..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="board-search-input"
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')} title="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {displayOrders.map((order) => {
        if (order.status === 'completed') {
          if (currentFilter !== 'all') {
            const hasMatchingDept = order.steps.some(s => s.dept === currentFilter);
            if (!hasMatchingDept) return null;
          }

          return (
            <div 
              key={order.id} 
              className="completed-order-row"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('setView', { detail: { view: 'flow', orderId: order.id } }));
                onSetView('flow');
              }}
            >
              <div className="completed-order-header">
                <h3 className="board-order-title">
                  {order.order_number} {order.company_name && <span className="board-order-company">— {order.company_name}</span>}
                </h3>
                <div className="completed-badges-row">
                  {order.delivery_date && (
                    <div className="delivery-badge">
                      <span className="icon">Delivery:</span> {new Date(order.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  )}
                  <span className="completed-global-badge">COMPLETED</span>
                </div>
              </div>
              <div className="completed-banner">
                <div className="completed-banner-content">
                  <div className="completed-icon-badge">✓</div>
                  <div className="completed-text-content">
                    <span className="completed-title">Order Fully Completed</span>
                    <span className="completed-subtitle">All steps have been successfully finalized. Click to view process flow logs.</span>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        let displaySteps = [];
        let orderDepts = [];

        // Find the specific active steps for the entire order
        displaySteps = order.steps.filter(s => ['inprogress', 'blocked', 'review'].includes(s.status));
        
        // If no steps are currently in progress, find the VERY NEXT pending step in the sequence
        if (displaySteps.length === 0) {
          const firstPending = order.steps.find(s => s.status === 'pending');
          if (firstPending) {
            displaySteps = [firstPending];
          } else {
            return null; // Entire order is done or has no steps
          }
        }
        orderDepts = depts.filter(dept => displaySteps.some(s => s.dept === dept.id));

        if (orderDepts.length === 0) return null;

        return (
          <div key={order.id} className="board-order-row">
            <h3 className="board-order-title">
              {order.order_number} {order.company_name && <span className="board-order-company">— {order.company_name}</span>}
            </h3>
            
            <div className="board-dept-grid">
              {orderDepts.map(dept => {
                // Only list the specific active steps in the card, not all pending tasks
                const deptSteps = displaySteps.filter(s => s.dept === dept.id);
                
                return (
                  <div 
                    key={dept.id} 
                    className="dept-flow-card" 
                    style={{ borderTopColor: dept.color }}
                    onClick={() => {
                      window.dispatchEvent(new CustomEvent('setView', { detail: { view: 'flow', orderId: order.id } }));
                      onSetView('flow');
                    }}
                  >
                    <div className="dept-card-header">
                      <div className="dept-card-title-row">
                        <div className="dept-color-bar" style={{ background: dept.color }}></div>
                        <div className="dept-card-title">{dept.label}</div>
                      </div>
                      
                      <div className="dept-card-ord-row">
                        <div className="ord-badge">{order.order_number}</div>
                        {order.company_name && (
                          <div style={{ fontSize: '11px', color: '#aaa', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                            {order.company_name}
                          </div>
                        )}
                        {order.delivery_date && (
                          <div className="delivery-badge">
                            <span className="icon">Delivery:</span> {new Date(order.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        )}
                      </div>
                      
                      {order.notes && (
                        <div style={{
                          marginTop: '10px',
                          fontSize: '11px',
                          color: '#f59e0b',
                          background: 'rgba(245, 158, 11, 0.05)',
                          border: '1px solid rgba(245, 158, 11, 0.15)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          fontStyle: 'italic',
                          lineHeight: '1.4',
                          wordBreak: 'break-word',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '4px'
                        }}>
                          <span style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px', color: '#f59e0b', marginTop: '1px', flexShrink: 0 }}>Note:</span>
                          <span style={{ color: '#d1d5db' }}>{order.notes}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="dept-card-tasks">
                      {deptSteps.map(step => (
                        <div key={step.id} className={`board-task status-${step.status}`}>
                          <span className={`step-dot dot-${step.status}`} />
                          <div className="board-task-name" title={step.name}>{step.name}</div>
                          <StatusBadge status={step.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      
      {displayOrders.length === 0 && (
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>No orders match the current filters.</div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .board-view-orders {
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding-bottom: 40px;
        }
        .board-filters {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--card-bg);
          padding: 12px 20px;
          border-radius: 8px;
          border: 1px solid var(--card-border);
          margin-bottom: -8px;
          box-shadow: var(--card-shadow);
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-icon {
          color: var(--text3);
        }
        .filter-label {
          font-size: 11px;
          color: var(--text3);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        .board-select {
          background: var(--bg3);
          border: 1px solid var(--border);
          color: var(--text);
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .board-select option {
          background: var(--bg3);
          color: var(--text);
        }
        .board-select:hover {
          border-color: var(--border2);
          background: var(--bg4);
        }
        .board-select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
        }
        .board-order-row {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 32px;
          box-shadow: var(--card-shadow);
        }
        .board-order-title {
          margin: 0 0 20px 0;
          font-size: 18px;
          font-weight: 800;
          color: var(--text);
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          letter-spacing: -0.2px;
        }
        .board-order-company {
          color: var(--text3);
          font-size: 14px;
          font-weight: 500;
          margin-left: 8px;
        }
        .board-dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          align-items: start;
        }
        .dept-flow-card {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-top: 3px solid var(--border2);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.2s ease, background 0.2s ease;
        }
        .dept-flow-card:hover {
          transform: translateY(-4px);
          background: var(--bg2);
          border-color: var(--accent);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
        }
        .dept-card-header {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px dashed var(--border2);
        }
        .dept-card-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .dept-color-bar {
          width: 4px;
          height: 32px;
          border-radius: 4px;
        }
        .dept-card-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .dept-card-ord-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg3);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid var(--border);
        }
        .ord-badge {
          font-family: 'IBM Plex Mono', monospace;
          font-weight: 600;
          font-size: 13px;
          color: var(--text);
        }
        .delivery-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: var(--purple);
          background: var(--purple-dim);
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid rgba(124, 58, 237, 0.25);
          font-weight: 500;
        }
        .delivery-badge .icon {
          font-size: 10px;
        }
        .dept-card-tasks {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .board-task {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 8px;
          background: var(--bg3);
          border: 1px solid var(--border);
          font-size: 12px;
          transition: all 0.2s;
        }
        .board-task:hover {
          background: var(--bg4);
          border-color: var(--border2);
          transform: translateX(3px);
        }
        .board-task-name {
          flex: 1;
          color: var(--text);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .board-search-container {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 6px 12px;
          margin-left: auto;
          flex: 1 1 200px;
          max-width: 280px;
          min-width: 140px;
          height: 32px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .board-search-container:hover {
          border-color: var(--border2);
        }
        .board-search-container:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
        }
        .board-search-icon {
          color: var(--text3);
          margin-right: 8px;
          flex-shrink: 0;
        }
        .board-search-input {
          background: transparent;
          border: none;
          color: var(--text);
          font-size: 12px;
          outline: none;
          width: 100%;
          padding: 0;
          height: 100%;
          box-sizing: border-box;
        }
        .board-search-input::placeholder {
          color: var(--text3);
        }
        .search-clear-btn {
          background: transparent;
          border: none;
          color: var(--text3);
          cursor: pointer;
          padding: 0;
          margin-left: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          flex-shrink: 0;
        }
        .search-clear-btn:hover {
          color: var(--red);
          background: var(--red-dim);
        }
        .completed-order-row {
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-left: 4px solid var(--green);
          border-radius: 16px;
          padding: 24px 28px;
          margin-bottom: 32px;
          box-shadow: var(--card-shadow);
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .completed-order-row:hover {
          border-color: rgba(22, 163, 74, 0.4);
          border-left-color: var(--green);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(22, 163, 74, 0.05);
        }
        .completed-order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .completed-order-header .board-order-title {
          margin: 0;
          border-bottom: none;
          padding-bottom: 0;
        }
        .completed-badges-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .completed-global-badge {
          font-size: 11px;
          color: var(--green);
          background: var(--green-dim);
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid rgba(22, 163, 74, 0.3);
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .completed-banner {
          display: flex;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px 20px;
          align-items: center;
        }
        .completed-banner-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .completed-icon-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: var(--green);
          color: #fff;
          border-radius: 50%;
          font-size: 18px;
          font-weight: bold;
        }
        .completed-text-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .completed-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--green);
        }
        .completed-subtitle {
          font-size: 13px;
          color: var(--text2);
        }
        .loading {
          color: var(--text3);
        }
      `}} />
    </div>
  );
}

