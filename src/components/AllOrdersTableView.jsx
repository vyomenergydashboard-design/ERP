import { useState, useEffect } from 'react';
import { DEPTS } from '../data/planningData';
import { Search, X } from 'lucide-react';

export default function AllOrdersTableView({ currentFilter, onSetView }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('incomplete');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/board", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setOrders(await res.json());
      }
    } catch (err) {
      console.error('Error fetching board orders for table:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (orderId) => {
    window.dispatchEvent(new CustomEvent('setView', { 
      detail: { view: 'flow', orderId: parseInt(orderId) } 
    }));
  };

  if (isLoading) {
    return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>Loading orders...</div>;
  }

  // Filter logic matching BoardView
  const displayOrders = orders.filter(o => {
    if (priorityFilter !== 'all' && (o.priority || 'Medium').toLowerCase() !== priorityFilter) return false;
    if (statusFilter === 'incomplete' && o.status === 'completed') return false;
    if (statusFilter === 'completed' && o.status !== 'completed') return false;
    
    if (searchTerm.trim() !== '') {
      const tokens = searchTerm.trim().toLowerCase().split(/\s+/);
      const orderNum = (o.order_number || '').toLowerCase();
      const compName = (o.company_name || '').toLowerCase();
      const poNum = (o.po_number || '').toLowerCase();
      
      return tokens.every(token => 
        orderNum.includes(token) || 
        compName.includes(token) || 
        poNum.includes(token)
      );
    }
    return true;
  });

  return (
    <div className="all-orders-table-view">
      {/* Filters Bar matching board filters style */}
      <div className="board-filters" style={{ marginBottom: '24px' }}>
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
            placeholder="Search by Order, PO, Company..."
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

      <div className="table-responsive">
        <table className="step-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Customer</th>
              <th>PO Number</th>
              <th>Priority</th>
              <th>Delivery Date</th>
              <th>Active Depts</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.map((order) => {
              const activeSteps = order.steps?.filter(s => ['inprogress', 'blocked', 'review'].includes(s.status)) || [];
              const uniqueDepts = Array.from(new Set(activeSteps.map(s => s.dept)));
              
              // Status Badge mapping
              const isCompleted = order.status === 'completed';
              const isBlocked = order.steps?.some(s => s.status === 'blocked');
              const statusText = isCompleted ? 'Completed' : isBlocked ? 'Blocked' : 'In Progress';
              const statusClass = isCompleted ? 'badge-done' : isBlocked ? 'badge-blocked' : 'badge-inprogress';

              // Priority Class mapping
              const priorityText = order.priority || 'Medium';
              const priorityClass = priorityText.toLowerCase() === 'high' || priorityText.toLowerCase() === 'urgent' 
                ? 'badge-blocked' 
                : priorityText.toLowerCase() === 'medium' 
                ? 'badge-review' 
                : 'badge-pending';

              return (
                <tr key={order.id} onClick={() => handleRowClick(order.id)}>
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'var(--font-mono)' }}>
                      {order.order_number}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text2)', fontWeight: 500 }}>
                      {order.company_name || '—'}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                      {order.po_number || '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`step-status-badge ${priorityClass}`}>
                      {priorityText}
                    </span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--text2)' }}>
                      {order.delivery_date 
                        ? new Date(order.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'
                      }
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {uniqueDepts.length > 0 ? uniqueDepts.map(deptId => {
                        const dept = DEPTS.find(d => d.id === deptId);
                        const hasBlocked = activeSteps.some(s => s.dept === deptId && s.status === 'blocked');
                        
                        return (
                          <span 
                            key={deptId} 
                            style={{
                              fontSize: '9px',
                              fontWeight: 700,
                              background: hasBlocked ? 'var(--red-dim)' : (dept?.color ? `${dept.color}22` : 'var(--bg4)'),
                              color: hasBlocked ? 'var(--red)' : (dept?.color || 'var(--text2)'),
                              border: `1px solid ${hasBlocked ? 'var(--red)' : (dept?.color || 'var(--border)')}`,
                              padding: '2px 8px',
                              borderRadius: '12px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            {deptId}
                          </span>
                        );
                      }) : (
                        <span style={{ color: 'var(--text3)', fontSize: '11px', fontStyle: 'italic' }}>None (Pending)</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`step-status-badge ${statusClass}`}>
                      {statusText}
                    </span>
                  </td>
                </tr>
              );
            })}
            {displayOrders.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--text3)', fontStyle: 'italic' }}>
                  No orders match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
