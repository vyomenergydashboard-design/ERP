import { useState, useEffect } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { DEPTS, STATUS_BADGE_MAP } from '../data/planningData';

function StatusBadge({ status }) {
  const { cls, label } = STATUS_BADGE_MAP[status] || STATUS_BADGE_MAP.pending;
  return <span className={`step-status-badge ${cls}`}>{label}</span>;
}

export default function BoardView({ currentFilter, userRole, onSetView }) {
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
      const res = await fetch('http://localhost:5000/api/board', {
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
      if (priorityFilter !== 'all' && (o.priority || 'Medium').toLowerCase() !== priorityFilter) return false;
      if (statusFilter === 'incomplete' && o.status === 'completed') return false;
      if (statusFilter === 'completed' && o.status !== 'completed') return false;
      
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesOrderNumber = (o.order_number || '').toLowerCase().includes(query);
        const matchesCompany = (o.company_name || '').toLowerCase().includes(query);
        const matchesPO = (o.po_number || '').toLowerCase().includes(query);
        const matchesSteps = o.steps && o.steps.some(s => (s.name || '').toLowerCase().includes(query) || (s.dept || '').toLowerCase().includes(query));
        
        if (!matchesOrderNumber && !matchesCompany && !matchesPO && !matchesSteps) return false;
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
                      <span className="icon">🚚</span> {new Date(order.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                            <span className="icon">🚚</span> {new Date(order.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
          background: var(--bg2);
          padding: 12px 20px;
          border-radius: 8px;
          border: 1px solid var(--border);
          margin-bottom: -8px;
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
        }
        .board-select {
          background: var(--bg4);
          border: 1px solid var(--border2);
          color: var(--text);
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
        }
        .board-select option {
          background: var(--bg3);
          color: var(--text);
        }
        .board-select:hover {
          border-color: var(--accent);
        }
        .board-order-title {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 700;
          color: var(--text);
          border-bottom: 1px solid var(--border);
          padding-bottom: 12px;
          letter-spacing: 0.5px;
        }
        .board-order-company {
          color: var(--text2);
          font-size: 15px;
          font-weight: normal;
        }
        .board-dept-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          align-items: start;
        }
        .dept-flow-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-top: 2px solid var(--border2);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.2s ease;
        }
        .dept-flow-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 32px rgba(0, 0, 0, 0.15);
          border-color: var(--accent);
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
          background: var(--bg4);
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
          background: var(--bg4);
          border: 1px solid var(--border2);
          border-radius: 6px;
          padding: 4px 10px;
          margin-left: auto;
          flex: 1 1 200px;
          max-width: 280px;
          min-width: 140px;
          height: 28px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .board-search-container:focus-within {
          border-color: var(--blue);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
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
          background: var(--green-dim);
          border: 1px solid rgba(22, 163, 74, 0.25);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.25s ease;
          cursor: pointer;
        }
        .completed-order-row:hover {
          border-color: var(--green);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
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

