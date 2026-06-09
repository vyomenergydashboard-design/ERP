import { useState, useEffect } from 'react';
import { Search, Filter, Database, RefreshCw, FileText } from 'lucide-react';

export default function LogsView() {
  const [logs, setLogs] = useState([]);
  const [limit, setLimit] = useState('1000');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchLogs(limit);
  }, [limit]);

  const fetchLogs = async (currentLimit = limit) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/logs?limit=${currentLimit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    }) + ' ' + d.toLocaleTimeString('en-IN', {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getDeptBadgeStyle = (dept) => {
    switch (dept?.toLowerCase()) {
      case 'sales':
        return { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' };
      case 'design':
        return { background: 'rgba(167, 139, 250, 0.1)', color: '#a78bfa', border: '1px solid rgba(167, 139, 250, 0.2)' };
      case 'purchase':
        return { background: 'rgba(249, 115, 22, 0.1)', color: '#f97316', border: '1px solid rgba(249, 115, 22, 0.2)' };
      case 'stores':
        return { background: 'rgba(45, 212, 191, 0.1)', color: '#2dd4bf', border: '1px solid rgba(45, 212, 191, 0.2)' };
      case 'production':
        return { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'qc':
        return { background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)' };
      case 'dispatch':
        return { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' };
      case 'accounts':
        return { background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', border: '1px solid rgba(14, 165, 233, 0.2)' };
      default:
        return { background: 'rgba(255, 255, 255, 0.05)', color: '#888', border: '1px solid rgba(255, 255, 255, 0.1)' };
    }
  };

  const filteredLogs = logs.filter(log => {
    // Department Filter
    if (selectedDept !== 'All' && log.dept !== selectedDept) {
      return false;
    }
    // Text Search Filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const userMatch = (log.username || '').toLowerCase().includes(term);
      const actionMatch = (log.action_text || '').toLowerCase().includes(term);
      const orderMatch = (log.order_number || '').toLowerCase().includes(term);
      return userMatch || actionMatch || orderMatch;
    }
    return true;
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #333', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={22} style={{ color: '#f59e0b' }} />
          System Activity Logs
        </h2>
      </div>

      {/* Filters Dashboard Panel */}
      <div style={{
        background: '#14161a',
        border: '1px solid #2a2f3a',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', flex: 1, minWidth: '300px' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6070' }} />
            <input
              type="text"
              placeholder="Search logs by user, action or order #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: '#0e0f11',
                border: '1px solid #2a2f3a',
                borderRadius: '8px',
                color: '#e8eaf0',
                padding: '10px 12px 10px 38px',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              className="log-search-input"
            />
          </div>

          {/* Department Select */}
          <div style={{ position: 'relative', width: '180px' }}>
            <Filter size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6070' }} />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                width: '100%',
                background: '#0e0f11',
                border: '1px solid #2a2f3a',
                borderRadius: '8px',
                color: '#e8eaf0',
                padding: '10px 12px 10px 34px',
                fontSize: '13px',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="All">All Departments</option>
              <option value="Sales">Sales</option>
              <option value="Design">Design</option>
              <option value="Purchase">Purchase</option>
              <option value="Stores">Stores</option>
              <option value="Production">Production</option>
              <option value="QC">QC</option>
              <option value="Dispatch">Dispatch</option>
              <option value="Accounts">Accounts</option>
            </select>
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#5a6070', fontSize: '10px' }}>▼</div>
          </div>

          {/* Limit Select */}
          <div style={{ position: 'relative', width: '160px' }}>
            <Database size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#5a6070' }} />
            <select
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              style={{
                width: '100%',
                background: '#0e0f11',
                border: '1px solid #2a2f3a',
                borderRadius: '8px',
                color: '#e8eaf0',
                padding: '10px 12px 10px 34px',
                fontSize: '13px',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="100">Fetch 100 Logs</option>
              <option value="250">Fetch 250 Logs</option>
              <option value="500">Fetch 500 Logs</option>
              <option value="1000">Fetch 1000 Logs</option>
              <option value="5000">Fetch 5000 Logs</option>
              <option value="all">Fetch All Logs</option>
            </select>
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#5a6070', fontSize: '10px' }}>▼</div>
          </div>
        </div>

        {/* Clear/Refresh Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(searchTerm || selectedDept !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All');
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              className="clear-btn"
            >
              Clear Filters
            </button>
          )}
          <button
            onClick={() => fetchLogs(limit)}
            disabled={isLoading}
            style={{
              background: '#1c1f26',
              border: '1px solid #2a2f3a',
              color: '#e8eaf0',
              padding: '10px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            className="refresh-btn"
          >
            <RefreshCw size={14} className={isLoading ? "spin" : ""} style={{ transition: 'transform 0.5s' }} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 8px',
        marginBottom: '12px',
        fontSize: '12px',
        color: '#8a93a8'
      }}>
        <div>
          Showing <span style={{ color: '#f59e0b', fontWeight: '600' }}>{filteredLogs.length}</span>{' '}
          of <span style={{ color: '#fff', fontWeight: '600' }}>{logs.length}</span> fetched logs{' '}
          {limit === 'all' ? '(full system history)' : `(limit: ${limit})`}
        </div>
        {filteredLogs.length < logs.length && (
          <div style={{ fontStyle: 'italic' }}>
            Filtered out {logs.length - filteredLogs.length} logs
          </div>
        )}
      </div>

      <div style={{ background: '#111', borderRadius: '12px', border: '1px solid #2a2f3a', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#14161a', borderBottom: '1px solid #2a2f3a' }}>
              <th style={{ padding: '16px', color: '#8a93a8', fontWeight: '500' }}>Timestamp</th>
              <th style={{ padding: '16px', color: '#8a93a8', fontWeight: '500' }}>User</th>
              <th style={{ padding: '16px', color: '#8a93a8', fontWeight: '500' }}>Order #</th>
              <th style={{ padding: '16px', color: '#8a93a8', fontWeight: '500' }}>Department</th>
              <th style={{ padding: '16px', color: '#8a93a8', fontWeight: '500' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && logs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#8a93a8' }}>
                  <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px', color: '#f59e0b', display: 'block' }} />
                  Loading activity logs...
                </td>
              </tr>
            ) : filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '48px', textAlign: 'center', color: '#5a6070' }}>No matching activity logs found.</td>
              </tr>
            ) : (
              filteredLogs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid #1c1f26' }} className="log-row">
                  <td style={{ padding: '16px', color: '#8a93a8', whiteSpace: 'nowrap' }}>{formatDate(log.timestamp)}</td>
                  <td style={{ padding: '16px', color: '#fff', fontWeight: '600' }}>{log.username}</td>
                  <td style={{ padding: '16px' }}>
                    {log.order_number 
                      ? <span style={{ fontFamily: 'monospace', fontSize: '11px', background: 'rgba(245,158,11,0.1)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(245,158,11,0.2)' }}>{log.order_number}</span>
                      : <span style={{ color: '#444' }}>—</span>
                    }
                  </td>
                  <td style={{ padding: '16px' }}>
                    {log.dept ? (
                      <span style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: '500',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        ...getDeptBadgeStyle(log.dept)
                      }}>
                        {log.dept}
                      </span>
                    ) : (
                      <span style={{ color: '#444' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '16px', color: '#e8eaf0' }}>{log.action_text}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .log-search-input:focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
        }
        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
        }
        .refresh-btn:hover:not(:disabled) {
          background: #242830 !important;
          border-color: #363d4a !important;
          color: #fff !important;
        }
        .spin {
          animation: spin-anim 1s linear infinite;
        }
        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .log-row {
          transition: background 0.15s ease, border-left-color 0.15s ease;
          border-left: 3px solid transparent;
        }
        .log-row:hover {
          background: #14161a !important;
          border-left-color: #f59e0b !important;
        }
      `}} />
    </div>
  );
}

