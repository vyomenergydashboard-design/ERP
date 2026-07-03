import { useEffect, useState, useRef } from 'react';
import { LogOut, User, Search, Sun, Moon } from 'lucide-react';

export default function Header({ onLogout }) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-IN'));
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('erp_theme');
    return saved ? saved === 'dark' : true; // default dark
  });

  const [logoName, setLogoName] = useState(() => localStorage.getItem('erp_company_name') || 'Vyom ERP');
  const [headerTitle, setHeaderTitle] = useState(() => localStorage.getItem('erp_system_title') || 'Control Panel Manufacturing');

  // Apply theme to document root
  useEffect(() => {
    const saved = localStorage.getItem('erp_theme');
    const dark = saved ? saved === 'dark' : true;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('erp_theme', newDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN'));
    }, 1000);
    
    // Fetch orders for everyone
    fetchOrders();

    const handleSetView = (e) => {
      if (e.detail && e.detail.orderId !== undefined) {
        setSelectedOrderId(e.detail.orderId || '');
      } else if (e.detail && e.detail.orderId === null) {
        setSelectedOrderId('');
      }
    };
    window.addEventListener('setView', handleSetView);

    const handleUpdate = () => {
      fetchOrders();
    };
    window.addEventListener('orderUpdated', handleUpdate);
    
    // Click outside to close dropdown
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handleSettingsUpdate = () => {
      setLogoName(localStorage.getItem('erp_company_name') || 'Vyom ERP');
      setHeaderTitle(localStorage.getItem('erp_system_title') || 'Control Panel Manufacturing');
    };
    window.addEventListener('erpSettingsUpdated', handleSettingsUpdate);
    
    return () => {
      clearInterval(id);
      window.removeEventListener('setView', handleSetView);
      window.removeEventListener('orderUpdated', handleUpdate);
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener('erpSettingsUpdated', handleSettingsUpdate);
    };
  }, []);

  // Sync searchQuery with selectedOrderId when it changes externally
  useEffect(() => {
    if (selectedOrderId && orders.length > 0) {
      const order = orders.find(o => o.id == selectedOrderId);
      if (order) setSearchQuery(order.order_number);
    } else if (!selectedOrderId) {
      setSearchQuery('');
    }
  }, [selectedOrderId, orders]);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Header fetch error:', err);
    }
  };

  const handleSelectOrder = (orderId, orderNum) => {
    setSelectedOrderId(orderId);
    setSearchQuery(orderNum || '');
    setIsDropdownOpen(false);
    
    if (orderId) {
      window.dispatchEvent(new CustomEvent('setView', { 
        detail: { view: 'flow', orderId: parseInt(orderId) } 
      }));
    } else {
      window.dispatchEvent(new CustomEvent('setView', { 
        detail: { view: 'board', orderId: null } 
      }));
    }
  };

  const filteredOrders = orders.filter(o => 
    (o.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.company_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="header">
      <div className="header-left">
        <div className="logo">{logoName}</div>
        <div className="header-title">{headerTitle}</div>
      </div>
      <div className="header-right">
        <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '16px', color: 'var(--text2)', fontSize: '12px' }}>
          <User size={14} />
          <span>{user.username || 'User'}</span>
          <span className={`role-badge role-${user.role?.toLowerCase()}`}>{user.role || 'Viewer'}</span>
        </div>

        <div className="order-selector" ref={searchRef}>
          <Search size={14} className="search-icon" />
          <input 
            type="text"
            className="order-search-input"
            placeholder="Search Order..."
            value={searchQuery}
            onFocus={() => setIsDropdownOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsDropdownOpen(true);
            }}
          />
          {selectedOrderId && (
            <button 
              className="clear-search" 
              onClick={(e) => { e.stopPropagation(); handleSelectOrder('', ''); }}
              title="Clear Selection"
            >
              ×
            </button>
          )}
          
          {isDropdownOpen && (
            <div className="search-dropdown-menu">
              <div 
                className={`search-dropdown-item ${!selectedOrderId ? 'active' : ''}`}
                onClick={() => handleSelectOrder('', '')}
              >
                View All Orders (Board)
              </div>
              {filteredOrders.length > 0 ? filteredOrders.map(order => (
                <div 
                  key={order.id} 
                  className={`search-dropdown-item ${selectedOrderId == order.id ? 'active' : ''}`}
                  onClick={() => handleSelectOrder(order.id, order.order_number)}
                >
                  <div style={{ fontWeight: 600 }}>{order.order_number}</div>
                  {order.company_name && <div style={{ fontSize: '10px', color: '#888' }}>{order.company_name}</div>}
                </div>
              )) : (
                <div className="search-dropdown-item empty">No orders found</div>
              )}
            </div>
          )}
        </div>

        <div className="clock" style={{ marginRight: '16px' }}>{time}</div>
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          style={{
            background: 'var(--bg4)',
            border: '1px solid var(--border2)',
            borderRadius: '6px',
            color: 'var(--text2)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '5px 10px',
            marginRight: '8px',
            transition: 'all 0.2s',
            gap: '5px',
            fontSize: '12px',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text2)'; e.currentTarget.style.borderColor = 'var(--border2)'; }}
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
          {isDark ? 'Light' : 'Dark'}
        </button>
        <button onClick={onLogout} className="logout-btn">
          <LogOut size={14} />
          Logout
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .order-selector {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 16px;
        }
        .order-search-input {
          background: var(--bg4);
          border: 1px solid var(--border2);
          border-radius: 20px;
          color: var(--text);
          padding: 6px 30px 6px 32px;
          font-size: 12px;
          width: 240px;
          outline: none;
          transition: all 0.2s;
        }
        .order-search-input:focus {
          background: var(--bg3);
          border-color: var(--blue);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        .search-icon {
          position: absolute;
          left: 12px;
          color: var(--text3);
          pointer-events: none;
        }
        .clear-search {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text3);
          cursor: pointer;
          font-size: 16px;
          line-height: 1;
          padding: 0;
        }
        .clear-search:hover { color: var(--text); }
        
        .search-dropdown-menu {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          background: var(--bg2);
          border: 1px solid var(--border2);
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          z-index: 1000;
        }
        .search-dropdown-item {
          padding: 8px 12px;
          cursor: pointer;
          font-size: 12px;
          color: var(--text2);
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .search-dropdown-item:last-child { border-bottom: none; }
        .search-dropdown-item:hover { background: var(--bg3); color: var(--text); }
        .search-dropdown-item.active { background: var(--blue-dim); color: var(--blue); }
        .search-dropdown-item.empty { color: var(--text3); text-align: center; font-style: italic; cursor: default; }
        .search-dropdown-item.empty:hover { background: transparent; }
      `}} />
    </div>
  );
}
