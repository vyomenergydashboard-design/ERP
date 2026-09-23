import { useEffect, useState, useRef } from 'react';
import { LogOut, User, Search, Sun, Moon, Menu } from 'lucide-react';

export default function Header({ onLogout, onToggleSidebar, sidenavCollapsed }) {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString('en-IN'));
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(() => localStorage.getItem('erp_selectedOrderId') || '');
  const [selectedUnitId, setSelectedUnitId] = useState(() => localStorage.getItem('erp_selectedUnitId') || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('erp_theme');
    return saved ? saved === 'dark' : true; // default dark
  });

  const [logoName, setLogoName] = useState(() => localStorage.getItem('erp_company_name') || 'Vyom Process Flow');
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
      if (e.detail) {
        if (e.detail.orderId !== undefined) {
          setSelectedOrderId(e.detail.orderId || '');
        } else if (e.detail.orderId === null) {
          setSelectedOrderId('');
        }
        if (e.detail.unitId !== undefined) {
          setSelectedUnitId(e.detail.unitId || '');
        } else if (e.detail.unitId === null) {
          setSelectedUnitId('');
        }
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
      setLogoName(localStorage.getItem('erp_company_name') || 'Vyom Process Flow');
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

  // Sync searchQuery with selectedOrderId/selectedUnitId when it changes externally
  useEffect(() => {
    if (selectedOrderId && orders.length > 0) {
      const order = orders.find(o => o.id == selectedOrderId);
      if (order) {
        if (selectedUnitId) {
          const unit = (order.units || []).find(u => u.id == selectedUnitId);
          if (unit) {
            setSearchQuery(unit.unit_serial || unit.short_serial || order.order_number);
            return;
          }
        }
        setSearchQuery(order.order_number);
      }
    } else if (!selectedOrderId) {
      setSearchQuery('');
    }
  }, [selectedOrderId, selectedUnitId, orders]);

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const res = await fetch(window.API_BASE + "/api/orders", {
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
        detail: { view: 'table', orderId: null, unitId: null } 
      }));
    }
  };

  const handleSelectUnit = (unitId, unitSerial, orderId, orderNum) => {
    setSelectedOrderId(orderId);
    setSearchQuery(unitSerial || orderNum || '');
    setIsDropdownOpen(false);
    
    if (unitId && orderId) {
      window.dispatchEvent(new CustomEvent('setView', { 
        detail: { view: 'flow', orderId: parseInt(orderId), unitId: parseInt(unitId) } 
      }));
    } else {
      window.dispatchEvent(new CustomEvent('setView', { 
        detail: { view: 'table', orderId: null, unitId: null } 
      }));
    }
  };

  const allUnitItems = [];
  orders.forEach(order => {
    const isOrderHold = order.hold_status === 'Approved' || String(order.status || '').toLowerCase().startsWith('hold');
    const isOrderCancelled = String(order.status || '').toLowerCase().startsWith('cancel');

    const units = Array.isArray(order.units) && order.units.length > 0 
      ? order.units 
      : [{ id: order.id, unit_serial: order.order_number, material_description: '', part_number: '', hold_status: order.hold_status, status: order.status }];
    
    units.forEach(u => {
      const isUnitHold = isOrderHold || u.hold_status === 'Hold' || String(u.status || '').toLowerCase().startsWith('hold');
      const isUnitCancelled = isOrderCancelled || u.hold_status === 'Cancelled' || String(u.status || '').toLowerCase().startsWith('cancel');

      allUnitItems.push({
        unitId: u.id,
        unitSerial: u.unit_serial || u.short_serial || order.order_number,
        orderId: order.id,
        orderNumber: order.order_number,
        companyName: order.company_name,
        poNumber: order.po_number,
        materialDescription: u.material_description || '',
        partNumber: u.part_number || '',
        isHold: isUnitHold,
        isCancelled: isUnitCancelled,
      });
    });
  });

  const isQueryingSelected = selectedOrderId && searchQuery.trim();
  const filteredUnits = allUnitItems.filter(item => {
    const q = isQueryingSelected && searchQuery.trim() === item.unitSerial ? '' : searchQuery.trim().toLowerCase();
    if (!q) return true;
    const tokens = q.split(/\s+/);
    const serial = (item.unitSerial || '').toLowerCase();
    const orderNum = (item.orderNumber || '').toLowerCase();
    const compName = (item.companyName || '').toLowerCase();
    const poNum = (item.poNumber || '').toLowerCase();
    const desc = (item.materialDescription || '').toLowerCase();
    const part = (item.partNumber || '').toLowerCase();
    return tokens.every(token => 
      serial.includes(token) || 
      orderNum.includes(token) || 
      compName.includes(token) || 
      poNum.includes(token) ||
      desc.includes(token) ||
      part.includes(token)
    );
  });

  return (
    <div className="header">
      <div className="header-left">
        <button 
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title={sidenavCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={sidenavCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          <Menu size={16} />
        </button>
        <div className="logo">{logoName}</div>
        <div className="header-title">{headerTitle}</div>
      </div>
      <div className="header-right">
        <div className="user-info">
          <User size={14} className="user-icon" />
          <span className="user-name">{user.username || 'User'}</span>
          <span className={`role-badge role-${user.role?.toLowerCase()}`}>{user.role || 'Viewer'}</span>
        </div>

        <div className="order-selector" ref={searchRef}>
          <Search size={14} className="search-icon" />
          <input 
            type="text"
            className="order-search-input"
            placeholder="Search Serial No., Order #, PO, Client..."
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
                View All Units (Table View)
              </div>
              {filteredUnits.length > 0 ? filteredUnits.map(item => (
                <div 
                  key={`${item.orderId}-${item.unitId}`} 
                  className={`search-dropdown-item ${selectedOrderId == item.orderId ? 'active' : ''}`}
                  onClick={() => handleSelectUnit(item.unitId, item.unitSerial, item.orderId, item.orderNumber)}
                  style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontWeight: 700, color: 'var(--blue)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
                        {item.unitSerial}
                      </span>
                      {item.isHold && (
                        <span style={{
                          background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b',
                          border: '1px solid rgba(245, 158, 11, 0.4)', borderRadius: 3,
                          fontSize: 9, fontWeight: 800, padding: '1px 5px', letterSpacing: 0.5
                        }}>HOLD</span>
                      )}
                      {item.isCancelled && (
                        <span style={{
                          background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444',
                          border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 3,
                          fontSize: 9, fontWeight: 800, padding: '1px 5px', letterSpacing: 0.5
                        }}>CANCELLED</span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>
                      Order #{item.orderNumber}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {item.companyName && <span>{item.companyName}</span>}
                    {item.materialDescription && <span style={{ color: 'var(--text3)' }}>· {item.materialDescription}</span>}
                  </div>
                </div>
              )) : (
                <div className="search-dropdown-item empty">No serial nos. found</div>
              )}
            </div>
          )}
        </div>

        <div className="clock-wrapper">{time}</div>
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="theme-toggle-btn"
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
          <span className="theme-toggle-text">{isDark ? 'Light' : 'Dark'}</span>
        </button>
        <button onClick={onLogout} className="logout-btn">
          <LogOut size={14} className="logout-icon" />
          <span className="logout-text">Logout</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .sidebar-toggle-btn {
          background: transparent;
          border: 1px solid var(--border);
          border-radius: 6px;
          color: var(--text2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          transition: all 0.2s;
          margin-right: 4px;
        }
        .sidebar-toggle-btn:hover {
          background: var(--bg4);
          color: var(--accent);
          border-color: var(--accent);
        }
        .order-selector {
          position: relative;
          display: flex;
          align-items: center;
          margin-right: 16px;
        }
        .order-search-input {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 30px;
          color: var(--text);
          padding: 8px 30px 8px 36px;
          font-size: 12px;
          width: 260px;
          outline: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        }
        .order-search-input:hover {
          border-color: var(--border2);
        }
        .order-search-input:focus {
          border-color: var(--accent);
          background: var(--bg2);
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12), 0 4px 12px rgba(245, 158, 11, 0.04);
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
          top: calc(100% + 6px);
          left: 0;
          width: 100%;
          max-height: 300px;
          overflow-y: auto;
          background: var(--bg2);
          border: 1px solid var(--border2);
          border-radius: 12px;
          box-shadow: 0 12px 36px rgba(0,0,0,0.18);
          z-index: 1000;
          padding: 6px;
        }
        .search-dropdown-item {
          padding: 10px 14px;
          cursor: pointer;
          font-size: 12px;
          color: var(--text2);
          border-radius: 8px;
          margin-bottom: 2px;
          transition: background 0.15s, color 0.15s;
        }
        .search-dropdown-item:last-child { margin-bottom: 0; }
        .search-dropdown-item:hover { background: var(--bg3); color: var(--text); }
        .search-dropdown-item.active { background: var(--blue-dim); color: var(--blue); }
        .search-dropdown-item.empty { color: var(--text3); text-align: center; font-style: italic; cursor: default; }
        .search-dropdown-item.empty:hover { background: transparent; }
        
        .user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-right: 16px;
          color: var(--text2);
          font-size: 12px;
        }
        .clock-wrapper {
          margin-right: 16px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text3);
        }
        .theme-toggle-btn {
          background: var(--bg4);
          border: 1px solid var(--border2);
          border-radius: 6px;
          color: var(--text2);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 5px 10px;
          margin-right: 8px;
          transition: all 0.2s;
          gap: 5px;
          font-size: 12px;
        }
        .theme-toggle-btn:hover {
          color: var(--accent);
          border-color: var(--accent);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Responsive styling for small laptops / tablets */
        @media (max-width: 1200px) {
          .header-title {
            display: none;
          }
        }
        @media (max-width: 1024px) {
          .order-search-input {
            width: 180px;
          }
        }
        @media (max-width: 900px) {
          .user-name {
            display: none;
          }
          .clock-wrapper {
            display: none;
          }
          .order-search-input {
            width: 140px;
          }
        }
        @media (max-width: 768px) {
          .role-badge {
            display: none;
          }
          .theme-toggle-text, .logout-text {
            display: none;
          }
          .theme-toggle-btn, .logout-btn {
            padding: 6px;
            margin-right: 4px;
          }
          .user-info {
            margin-right: 8px;
          }
          .order-selector {
            margin-right: 8px;
          }
        }
      `}} />
    </div>
  );
}
