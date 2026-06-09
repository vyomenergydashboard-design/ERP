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
        let displaySteps = [];
        let orderDepts = [];

        if (order.status === 'completed') {
          // For completed orders, show all steps so they appear under their departments as 'done'
          displaySteps = order.steps;
          orderDepts = depts.filter(dept => displaySteps.some(s => s.dept === dept.id));
        } else {
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
        }

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
          background: rgba(25, 25, 25, 0.4);
          padding: 12px 20px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          margin-bottom: -8px;
        }
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .filter-icon {
          color: #888;
        }
        .filter-label {
          font-size: 11px;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .board-select {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
          font-size: 12px;
          padding: 4px 8px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
        }
        .board-select option {
          background: #1a1a1a;
          color: #eee;
        }
        .board-select:hover {
          border-color: rgba(255, 255, 255, 0.2);
        }
        .board-order-title {
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 700;
          color: #f8fafc;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 12px;
          letter-spacing: 0.5px;
        }
        .board-order-company {
          color: #94a3b8;
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
          background: rgba(25, 25, 25, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 12px;
          padding: 20px;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .dept-flow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.15);
        }
        .dept-card-header {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px dashed rgba(255, 255, 255, 0.1);
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
          color: #f8fafc;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .dept-card-ord-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }
        .ord-badge {
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-weight: 600;
          font-size: 13px;
          color: #cbd5e1;
        }
        .delivery-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          color: #a78bfa;
          background: rgba(167, 139, 250, 0.1);
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid rgba(167, 139, 250, 0.2);
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
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 12px;
          transition: all 0.2s;
        }
        .board-task:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateX(4px);
        }
        .board-search-container {
          position: relative;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          padding: 4px 10px;
          margin-left: auto;
          flex: 1 1 200px;
          max-width: 280px;
          min-width: 140px;
          height: 26px;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }
        .board-search-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
          width: 320px;
        }
        .board-search-icon {
          color: #888;
          margin-right: 8px;
          flex-shrink: 0;
        }
        .board-search-input {
          background: transparent;
          border: none;
          color: #e2e8f0;
          font-size: 12px;
          outline: none;
          width: 100%;
          padding: 0;
          height: 100%;
          box-sizing: border-box;
        }
        .search-clear-btn {
          background: transparent;
          border: none;
          color: #888;
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
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }
      `}} />
    </div>
  );
}
