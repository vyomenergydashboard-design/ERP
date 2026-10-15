import React, { useState, useEffect, useRef, useMemo } from 'react';
import Modal from './Modal.jsx';
import { toast } from './Toast.jsx';
import {
  Search,
  Filter,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  Cpu,
  Zap,
  Cable,
  Calendar,
  X,
  PackageCheck,
  AlertCircle,
  RefreshCw,
  Hash,
  Clock,
  ArrowRight
} from 'lucide-react';

const CATEGORY_CONFIG = {
  'Panel': {
    label: 'Panel',
    icon: Layers,
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.3)'
  },
  'Automation': {
    label: 'Automation',
    icon: Cpu,
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.3)'
  },
  'Low voltage': {
    label: 'Low voltage',
    icon: Zap,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  'Wires & Accessories': {
    label: 'Wires & Accessories',
    icon: Cable,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  }
};

const STATUS_CONFIG = {
  'Pending': {
    label: 'Pending',
    color: 'var(--amber, #f59e0b)',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    dotColor: '#f59e0b'
  },
  'Partial recieved': {
    label: 'Partial recieved',
    color: 'var(--blue, #38bdf8)',
    bgColor: 'rgba(56, 189, 248, 0.14)',
    borderColor: 'rgba(56, 189, 248, 0.35)',
    dotColor: '#38bdf8'
  },
  'PO closed': {
    label: 'Po closed',
    color: 'var(--green, #10b981)',
    bgColor: 'rgba(16, 185, 129, 0.14)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    dotColor: '#10b981'
  }
};

/**
 * Consolidates consecutive sequential serials into ranges (e.g. 1128 – 1129)
 */
const groupSerialsIntoRanges = (serialsList = []) => {
  if (!Array.isArray(serialsList) || serialsList.length === 0) return [];

  const sorted = [...serialsList].sort((a, b) => {
    const snA = String(a.serialNumber || a.id || a).trim();
    const snB = String(b.serialNumber || b.id || b).trim();
    const numA = parseInt(snA.slice(-4), 10);
    const numB = parseInt(snB.slice(-4), 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return snA.localeCompare(snB);
  });

  const groups = [];
  let currentGroup = null;

  for (const item of sorted) {
    const rawSn = String(item.serialNumber || item.id || item).trim();
    const seqNum = parseInt(rawSn.slice(-4), 10);

    if (!currentGroup) {
      currentGroup = {
        id: 'grp-' + rawSn,
        items: [rawSn],
        startSeq: isNaN(seqNum) ? null : seqNum,
        endSeq: isNaN(seqNum) ? null : seqNum,
        startSerial: rawSn,
        endSerial: rawSn
      };
      continue;
    }

    const isContiguous =
      !isNaN(seqNum) &&
      currentGroup.endSeq !== null &&
      seqNum === currentGroup.endSeq + 1;

    if (isContiguous) {
      currentGroup.items.push(rawSn);
      currentGroup.endSeq = seqNum;
      currentGroup.endSerial = rawSn;
    } else {
      groups.push(currentGroup);
      currentGroup = {
        id: 'grp-' + rawSn,
        items: [rawSn],
        startSeq: isNaN(seqNum) ? null : seqNum,
        endSeq: isNaN(seqNum) ? null : seqNum,
        startSerial: rawSn,
        endSerial: rawSn
      };
    }
  }

  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups.map(grp => {
    const isRange = grp.items.length > 1;
    return {
      id: grp.id,
      isRange,
      count: grp.items.length,
      displayLabel: isRange ? `${grp.startSerial} – ${grp.endSerial}` : grp.startSerial,
      items: grp.items
    };
  });
};

/**
 * Highlights substring matches within a text string
 */
const HighlightedText = ({ text = '', highlight = '' }) => {
  if (!highlight || !highlight.trim()) {
    return <span>{text}</span>;
  }
  const str = String(text);
  const query = highlight.trim().toLowerCase();
  const lowerStr = str.toLowerCase();
  const index = lowerStr.indexOf(query);

  if (index === -1) {
    return <span>{str}</span>;
  }

  const before = str.slice(0, index);
  const matched = str.slice(index, index + query.length);
  const after = str.slice(index + query.length);

  return (
    <span>
      {before}
      <span
        style={{
          background: 'rgba(56, 189, 248, 0.3)',
          color: 'var(--blue, #38bdf8)',
          borderRadius: '3px',
          padding: '1px 3px',
          fontWeight: 700
        }}
      >
        {matched}
      </span>
      {after}
    </span>
  );
};

/**
 * PurchaseOrderReceivedModal
 * Dedicated modal dialog for logging Order Recieved (goods receipts & incoming supplier materials).
 * Features:
 * 1. Button 1: Search PO number with partial/substring matching. Shows all serials under that PO with top status switcher.
 * 2. Button 2: Status Filter with 4 options (All, Pending, Partial recieved, Po closed).
 * 3. Uniform status per PO (all serials under that PO share the same status).
 */
export default function PurchaseOrderReceivedModal({ isOpen, onClose, onStatusUpdated }) {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All'); // 'All' | 'Pending' | 'Partial recieved' | 'PO closed'
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [selectedPoOrder, setSelectedPoOrder] = useState(null);
  const [expandedRangeIds, setExpandedRangeIds] = useState(new Set());
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMenuOpenOrderId, setStatusMenuOpenOrderId] = useState(null);

  const searchInputRef = useRef(null);
  const filterDropdownRef = useRef(null);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(e.target)) {
        setIsFilterDropdownOpen(false);
      }
      if (!e.target.closest('.status-action-container')) {
        setStatusMenuOpenOrderId(null);
      }
    };
    if (isFilterDropdownOpen || statusMenuOpenOrderId) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isFilterDropdownOpen, statusMenuOpenOrderId]);

  // Sync historical purchase orders on open
  const fetchPurchaseOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE}/api/purchase-orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          // Normalize status if missing
          const normalized = data.map(o => ({
            ...o,
            status: o.status || 'Pending'
          }));
          setOrders(normalized);
          try {
            localStorage.setItem('vyom_purchase_orders', JSON.stringify(normalized));
          } catch (e) {
            console.warn('LocalStorage cache error:', e);
          }
          return;
        }
      }
    } catch (err) {
      console.warn('Could not sync purchase orders from API, checking local backup:', err);
    } finally {
      setIsLoading(false);
    }

    // Fallback to localStorage
    try {
      const cachedRaw = localStorage.getItem('vyom_purchase_orders');
      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (Array.isArray(parsed)) {
          const normalized = parsed.map(o => ({
            ...o,
            status: o.status || 'Pending'
          }));
          setOrders(normalized);
        }
      }
    } catch (cacheErr) {
      console.error('Failed to read cached purchase orders:', cacheErr);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPurchaseOrders();
      setSearchQuery('');
      setSelectedPoOrder(null);
      setActiveFilter('All');
    }
  }, [isOpen]);

  // Listen to external order saved events to refresh instantly
  useEffect(() => {
    const handleOrderSaved = () => {
      if (isOpen) fetchPurchaseOrders();
    };
    window.addEventListener('purchaseOrderSaved', handleOrderSaved);
    return () => window.removeEventListener('purchaseOrderSaved', handleOrderSaved);
  }, [isOpen]);

  // Toggle range chip tray expansion
  const toggleRangeExpand = (rangeId) => {
    setExpandedRangeIds(prev => {
      const next = new Set(prev);
      if (next.has(rangeId)) next.delete(rangeId);
      else next.add(rangeId);
      return next;
    });
  };

  // Helper to extract all PO numbers from an order record
  const getOrderPoNumbers = (order) => {
    if (!order) return [];
    if (Array.isArray(order.pos) && order.pos.length > 0) {
      return order.pos.map(p => (p && p.poNumber ? String(p.poNumber).trim() : '')).filter(Boolean);
    }
    if (order.poNumber) return [String(order.poNumber).trim()];
    return [];
  };

  // Helper to get formatted primary PO string
  const getDisplayPoNumber = (order) => {
    const pos = getOrderPoNumbers(order);
    if (pos.length === 0) return order.order_uid || 'PO-Unknown';
    return pos.join(', ');
  };

  // Substring (partial) search matching
  const matchesSearch = (order, query) => {
    if (!query || !query.trim()) return true;
    const term = query.trim().toLowerCase();
    const pos = getOrderPoNumbers(order);
    const orderUid = (order.order_uid || '').toLowerCase();
    return pos.some(p => p.toLowerCase().includes(term)) || orderUid.includes(term);
  };

  // Status Filter matching
  const matchesFilter = (order, filter) => {
    if (!filter || filter === 'All') return true;
    const currentStatus = order.status || 'Pending';
    return currentStatus.toLowerCase() === filter.toLowerCase();
  };

  // Filtered orders list based on status filter and search query
  const displayedOrders = useMemo(() => {
    return orders.filter(order => {
      const statusPass = matchesFilter(order, activeFilter);
      const searchPass = searchQuery ? matchesSearch(order, searchQuery) : true;
      return statusPass && searchPass;
    });
  }, [orders, activeFilter, searchQuery]);

  // If a user has searched a PO, auto-select the best matching order or allow selecting one
  useEffect(() => {
    if (searchQuery.trim()) {
      const matched = orders.filter(o => matchesSearch(o, searchQuery));
      if (matched.length === 1) {
        setSelectedPoOrder(matched[0]);
      } else if (matched.length > 1) {
        // If current selected is among matched, keep it; else pick first
        if (!selectedPoOrder || !matched.some(m => m.id === selectedPoOrder.id)) {
          setSelectedPoOrder(matched[0]);
        }
      } else {
        setSelectedPoOrder(null);
      }
    } else {
      setSelectedPoOrder(null);
    }
  }, [searchQuery, orders]);

  // Handle updating status of a specific PO
  const handleUpdatePoStatus = async (targetOrder, newStatus) => {
    if (!targetOrder || !newStatus) return;
    if (targetOrder.status === newStatus) return;

    setIsUpdatingStatus(true);
    const orderId = targetOrder.id || targetOrder.order_uid;
    const todayStr = new Date().toISOString().slice(0, 10);

    // 1. Optimistic update
    setOrders(prev => prev.map(o => {
      if (o.id === targetOrder.id || o.order_uid === targetOrder.order_uid) {
        const updatedPos = (Array.isArray(o.pos) ? o.pos : []).map(p => ({
          ...p,
          status: newStatus,
          dateReceived: newStatus === 'Pending' ? null : todayStr
        }));
        return {
          ...o,
          status: newStatus,
          received_at: newStatus === 'Pending' ? null : todayStr,
          pos: updatedPos
        };
      }
      return o;
    }));

    if (selectedPoOrder && (selectedPoOrder.id === targetOrder.id || selectedPoOrder.order_uid === targetOrder.order_uid)) {
      setSelectedPoOrder(prev => ({
        ...prev,
        status: newStatus,
        received_at: newStatus === 'Pending' ? null : todayStr
      }));
    }

    // 2. Persist to API
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE}/api/purchase-orders/${encodeURIComponent(orderId)}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          status: newStatus,
          dateReceived: newStatus === 'Pending' ? null : todayStr
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update status on server');
      }

      const resData = await res.json();
      if (resData.order) {
        // Update localStorage backup
        try {
          const cachedRaw = localStorage.getItem('vyom_purchase_orders');
          const cached = cachedRaw ? JSON.parse(cachedRaw) : [];
          const updated = cached.map(o => (o.id === resData.order.id || o.order_uid === resData.order.order_uid ? { ...o, ...resData.order } : o));
          localStorage.setItem('vyom_purchase_orders', JSON.stringify(updated));
        } catch (e) {
          console.warn('LocalStorage update warning:', e);
        }
      }

      toast.success(`PO status updated to "${newStatus}"`);
      onStatusUpdated?.();
      window.dispatchEvent(new CustomEvent('purchaseOrderStatusChanged', { detail: { orderId, status: newStatus } }));
    } catch (err) {
      console.error('Status update failed:', err);
      toast.error(err.message || 'Failed to update status');
      // Refresh to restore accurate state
      fetchPurchaseOrders();
    } finally {
      setIsUpdatingStatus(false);
      setStatusMenuOpenOrderId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Order Recieved"
      subtitle="Procurement & Receiving · Log incoming materials, supplier shipments, and goods receipts (GRN)"
      maxWidth="1260px"
      width="96%"
      style={{
        height: '82vh',
        minHeight: '620px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', flex: 1, minHeight: 0 }}>

        {/* ── Top Action Toolbar with 2 Buttons ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            padding: '14px 18px',
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '10px'
          }}
        >
          {/* Left: Search PO Number Input (Substring / Partial Search) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 340px', maxWidth: '520px' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Search
                size={15}
                style={{
                  position: 'absolute',
                  left: '12px',
                  color: searchQuery ? 'var(--blue, #38bdf8)' : 'var(--text3)',
                  pointerEvents: 'none',
                  transition: 'color 0.15s ease'
                }}
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PO number"
                aria-label="Search PO number"
                style={{
                  width: '100%',
                  height: '36px',
                  paddingLeft: '36px',
                  paddingRight: searchQuery ? '32px' : '12px',
                  fontSize: '12.5px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 600,
                  color: 'var(--text)',
                  background: 'var(--bg3)',
                  border: searchQuery ? '1.5px solid var(--blue, #38bdf8)' : '1.5px solid var(--border2)',
                  borderRadius: '7px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  boxShadow: searchQuery ? '0 0 0 2px var(--blue-dim, rgba(56, 189, 248, 0.2))' : 'none',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPoOrder(null);
                    searchInputRef.current?.focus();
                  }}
                  title="Clear search"
                  style={{
                    position: 'absolute',
                    right: '10px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text3)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '2px',
                    borderRadius: '4px'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {searchQuery && (
              <span
                style={{
                  fontSize: '11px',
                  color: 'var(--text3)',
                  whiteSpace: 'nowrap',
                  fontWeight: 600
                }}
              >
                {displayedOrders.length} match{displayedOrders.length === 1 ? '' : 'es'}
              </span>
            )}
          </div>

          {/* Right: Filter Status Dropdown Button (4 options: All, Pending, Partial recieved, Po closed) */}
          <div ref={filterDropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setIsFilterDropdownOpen(prev => !prev)}
              aria-expanded={isFilterDropdownOpen}
              title="Filter orders by PO status"
              style={{
                height: '36px',
                padding: '0 14px',
                fontSize: '12.5px',
                fontWeight: 600,
                borderRadius: '7px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: activeFilter !== 'All' ? STATUS_CONFIG[activeFilter]?.bgColor || 'var(--bg3)' : 'var(--bg3)',
                color: activeFilter !== 'All' ? STATUS_CONFIG[activeFilter]?.color || 'var(--text)' : 'var(--text)',
                border: activeFilter !== 'All' ? `1.5px solid ${STATUS_CONFIG[activeFilter]?.borderColor || 'var(--border2)'}` : '1.5px solid var(--border2)',
                transition: 'all 0.15s ease',
                userSelect: 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--blue, #38bdf8)';
              }}
              onMouseLeave={(e) => {
                if (!isFilterDropdownOpen) {
                  e.currentTarget.style.borderColor = activeFilter !== 'All' ? STATUS_CONFIG[activeFilter]?.borderColor : 'var(--border2)';
                }
              }}
            >
              <Filter size={14} style={{ opacity: 0.85 }} />
              <span>
                Filter: <strong style={{ fontWeight: 700 }}>{activeFilter === 'All' ? 'All Statuses' : activeFilter}</strong>
              </span>
              <ChevronDown
                size={13}
                style={{
                  transform: isFilterDropdownOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.15s ease',
                  opacity: 0.7
                }}
              />
            </button>

            {/* Filter Dropdown Popover */}
            {isFilterDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 6px)',
                  right: 0,
                  width: '210px',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border2)',
                  borderRadius: '9px',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
                  zIndex: 20,
                  padding: '6px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}
              >
                <div
                  style={{
                    padding: '6px 10px',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--text3)',
                    borderBottom: '1px solid var(--border)'
                  }}
                >
                  Filter PO Status
                </div>

                {/* Option 1: All */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('All');
                    setIsFilterDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFilter === 'All' ? 'var(--bg3)' : 'transparent',
                    color: 'var(--text)',
                    fontSize: '12px',
                    fontWeight: activeFilter === 'All' ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg3)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = activeFilter === 'All' ? 'var(--bg3)' : 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--text3)' }} />
                    <span>All POs</span>
                  </div>
                  {activeFilter === 'All' && <Check size={14} style={{ color: 'var(--blue, #38bdf8)' }} />}
                </button>

                {/* Option 2: Pending */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('Pending');
                    setIsFilterDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFilter === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'transparent',
                    color: activeFilter === 'Pending' ? 'var(--amber, #f59e0b)' : 'var(--text)',
                    fontSize: '12px',
                    fontWeight: activeFilter === 'Pending' ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(245, 158, 11, 0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = activeFilter === 'Pending' ? 'rgba(245, 158, 11, 0.15)' : 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                    <span>Pending</span>
                  </div>
                  {activeFilter === 'Pending' && <Check size={14} style={{ color: '#f59e0b' }} />}
                </button>

                {/* Option 3: Partial recieved */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('Partial recieved');
                    setIsFilterDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFilter === 'Partial recieved' ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    color: activeFilter === 'Partial recieved' ? 'var(--blue, #38bdf8)' : 'var(--text)',
                    fontSize: '12px',
                    fontWeight: activeFilter === 'Partial recieved' ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = activeFilter === 'Partial recieved' ? 'rgba(56, 189, 248, 0.15)' : 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }} />
                    <span>Partial recieved</span>
                  </div>
                  {activeFilter === 'Partial recieved' && <Check size={14} style={{ color: '#38bdf8' }} />}
                </button>

                {/* Option 4: Po closed */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveFilter('PO closed');
                    setIsFilterDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFilter === 'PO closed' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: activeFilter === 'PO closed' ? 'var(--green, #10b981)' : 'var(--text)',
                    fontSize: '12px',
                    fontWeight: activeFilter === 'PO closed' ? 700 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.12s ease'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = activeFilter === 'PO closed' ? 'rgba(16, 185, 129, 0.15)' : 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                    <span>Po closed</span>
                  </div>
                  {activeFilter === 'PO closed' && <Check size={14} style={{ color: '#10b981' }} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Mode 1: Active PO Focus Banner (When Searching a PO Number) ── */}
        {selectedPoOrder && (
          <div
            style={{
              padding: '16px 20px',
              background: 'var(--bg3)',
              border: '1.5px solid var(--blue-dim, rgba(56, 189, 248, 0.35))',
              borderRadius: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              {/* Left PO metadata */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Searched PO:
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: 'var(--blue, #38bdf8)',
                      letterSpacing: '0.02em'
                    }}
                  >
                    <HighlightedText text={getDisplayPoNumber(selectedPoOrder)} highlight={searchQuery} />
                  </span>
                </div>

                {/* Category badge */}
                {selectedPoOrder.category && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11.5px',
                      fontWeight: 600,
                      background: CATEGORY_CONFIG[selectedPoOrder.category]?.bgColor || 'var(--bg4)',
                      color: CATEGORY_CONFIG[selectedPoOrder.category]?.color || 'var(--text)',
                      border: `1px solid ${CATEGORY_CONFIG[selectedPoOrder.category]?.borderColor || 'var(--border)'}`
                    }}
                  >
                    {CATEGORY_CONFIG[selectedPoOrder.category]?.icon &&
                      React.createElement(CATEGORY_CONFIG[selectedPoOrder.category].icon, { size: 12 })}
                    <span>{selectedPoOrder.category}</span>
                  </span>
                )}

                {/* Given Date */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    color: 'var(--text3)',
                    fontFamily: 'var(--font-mono, monospace)'
                  }}
                >
                  <Calendar size={12} style={{ opacity: 0.7 }} />
                  <span>Given: {(selectedPoOrder.pos?.[0]?.date || selectedPoOrder.created_at || '').slice(0, 10)}</span>
                </span>
              </div>

              {/* Right: Uniform Status Changer for this specific PO */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text2)', fontWeight: 600 }}>
                  PO Status:
                </span>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '3px',
                    background: 'var(--bg2)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                >
                  {/* Pending Button */}
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdatePoStatus(selectedPoOrder, 'Pending')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      height: '28px',
                      padding: '0 10px',
                      borderRadius: '5px',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: isUpdatingStatus ? 'not-allowed' : 'pointer',
                      background: (selectedPoOrder.status || 'Pending') === 'Pending' ? '#f59e0b' : 'transparent',
                      color: (selectedPoOrder.status || 'Pending') === 'Pending' ? '#0f172a' : 'var(--text3)',
                      boxShadow: (selectedPoOrder.status || 'Pending') === 'Pending' ? '0 1px 4px rgba(245, 158, 11, 0.4)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: (selectedPoOrder.status || 'Pending') === 'Pending' ? '#0f172a' : '#f59e0b'
                      }}
                    />
                    <span>Pending</span>
                  </button>

                  {/* Partial recieved Button */}
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdatePoStatus(selectedPoOrder, 'Partial recieved')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      height: '28px',
                      padding: '0 10px',
                      borderRadius: '5px',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: isUpdatingStatus ? 'not-allowed' : 'pointer',
                      background: selectedPoOrder.status === 'Partial recieved' ? '#38bdf8' : 'transparent',
                      color: selectedPoOrder.status === 'Partial recieved' ? '#0f172a' : 'var(--text3)',
                      boxShadow: selectedPoOrder.status === 'Partial recieved' ? '0 1px 4px rgba(56, 189, 248, 0.4)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: selectedPoOrder.status === 'Partial recieved' ? '#0f172a' : '#38bdf8'
                      }}
                    />
                    <span>Partial recieved</span>
                  </button>

                  {/* Po closed Button */}
                  <button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdatePoStatus(selectedPoOrder, 'PO closed')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      height: '28px',
                      padding: '0 10px',
                      borderRadius: '5px',
                      border: 'none',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: isUpdatingStatus ? 'not-allowed' : 'pointer',
                      background: selectedPoOrder.status === 'PO closed' ? '#10b981' : 'transparent',
                      color: selectedPoOrder.status === 'PO closed' ? '#0f172a' : 'var(--text3)',
                      boxShadow: selectedPoOrder.status === 'PO closed' ? '0 1px 4px rgba(16, 185, 129, 0.4)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: selectedPoOrder.status === 'PO closed' ? '#0f172a' : '#10b981'
                      }}
                    />
                    <span>Po closed</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Note regarding uniform status */}
            <div style={{ fontSize: '11px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PackageCheck size={13} style={{ color: 'var(--blue, #38bdf8)' }} />
              <span>
                All {selectedPoOrder.serials?.length || 0} serial numbers under PO <strong>{getDisplayPoNumber(selectedPoOrder)}</strong> share this status.
              </span>
            </div>
          </div>
        )}

        {/* ── Main Data Table View ── */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow, 0 1px 4px rgba(0,0,0,0.08))',
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            minHeight: '360px'
          }}
        >
          {/* Table Header Summary */}
          <div
            style={{
              padding: '12px 18px',
              background: 'var(--bg3)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12.5px',
              flexShrink: 0
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ color: 'var(--text)' }}>
                {activeFilter === 'All' ? 'All Purchase Orders' : `${activeFilter} Orders`}
              </strong>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text2)',
                  background: 'var(--bg4)',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)'
                }}
              >
                {displayedOrders.length} {displayedOrders.length === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            <button
              type="button"
              onClick={fetchPurchaseOrders}
              title="Refresh list"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text3)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11.5px',
                padding: '3px 8px',
                borderRadius: '5px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
            >
              <RefreshCw size={12} className={isLoading ? 'spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Table Container */}
          <div style={{ flex: 1, minHeight: '300px', overflowY: 'auto' }}>
            {displayedOrders.length === 0 ? (
              <div
                style={{
                  padding: '64px 24px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--text3)'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text2)'
                  }}
                >
                  <AlertCircle size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                    No Purchase Orders Found
                  </div>
                  <div style={{ fontSize: '12px', maxWidth: '380px' }}>
                    {searchQuery
                      ? `No orders matching "${searchQuery}" with status "${activeFilter}". Try clearing your search.`
                      : `No orders found with status "${activeFilter}".`}
                  </div>
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    style={{
                      marginTop: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '6px',
                      border: '1px solid var(--border2)',
                      background: 'var(--bg3)',
                      color: 'var(--blue, #38bdf8)',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Search Query
                  </button>
                )}
              </div>
            ) : (
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '12.5px'
                }}
              >
                <thead>
                  <tr
                    style={{
                      position: 'sticky',
                      top: 0,
                      background: 'var(--bg3)',
                      borderBottom: '1.5px solid var(--border)',
                      zIndex: 2,
                      userSelect: 'none'
                    }}
                  >
                    <th style={{ padding: '10px 14px', width: '180px', color: 'var(--text)', fontWeight: 700 }}>
                      PO Number
                    </th>
                    <th style={{ padding: '10px 14px', width: '140px', color: 'var(--text)', fontWeight: 700 }}>
                      Category
                    </th>
                    <th style={{ padding: '10px 14px', color: 'var(--text)', fontWeight: 700 }}>
                      Serial Numbers / Ranges
                    </th>
                    <th style={{ padding: '10px 14px', width: '120px', color: 'var(--text)', fontWeight: 700 }}>
                      Given Date
                    </th>
                    <th style={{ padding: '10px 14px', width: '130px', color: 'var(--text)', fontWeight: 700 }}>
                      PO Status
                    </th>
                    <th style={{ padding: '10px 14px', width: '130px', textAlign: 'right', color: 'var(--text)', fontWeight: 700 }}>
                      Update Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedOrders.map((order) => {
                    const currentStatus = order.status || 'Pending';
                    const statusTheme = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['Pending'];
                    const groups = groupSerialsIntoRanges(order.serials || []);
                    const isSelected = selectedPoOrder && (selectedPoOrder.id === order.id || selectedPoOrder.order_uid === order.order_uid);
                    const isStatusMenuOpen = statusMenuOpenOrderId === (order.id || order.order_uid);

                    return (
                      <tr
                        key={order.id || order.order_uid}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          background: isSelected ? 'rgba(56, 189, 248, 0.06)' : 'transparent',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'var(--bg3)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {/* PO Number */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono, monospace)',
                                fontWeight: 700,
                                fontSize: '13px',
                                color: 'var(--blue, #38bdf8)',
                                letterSpacing: '0.02em'
                              }}
                            >
                              <HighlightedText text={getDisplayPoNumber(order)} highlight={searchQuery} />
                            </span>
                            <span style={{ fontSize: '10.5px', color: 'var(--text3)', fontFamily: 'var(--font-mono, monospace)' }}>
                              {order.order_uid}
                            </span>
                          </div>
                        </td>

                        {/* Category */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          {order.category ? (
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 600,
                                background: CATEGORY_CONFIG[order.category]?.bgColor || 'var(--bg4)',
                                color: CATEGORY_CONFIG[order.category]?.color || 'var(--text)',
                                border: `1px solid ${CATEGORY_CONFIG[order.category]?.borderColor || 'var(--border)'}`,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {CATEGORY_CONFIG[order.category]?.icon &&
                                React.createElement(CATEGORY_CONFIG[order.category].icon, { size: 12 })}
                              <span>{order.category}</span>
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text3)' }}>—</span>
                          )}
                        </td>

                        {/* Serial Numbers / Ranges */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          {groups.length === 0 ? (
                            <span style={{ color: 'var(--text3)' }}>No serials</span>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                                {groups.map((grp) => {
                                  const isExpanded = expandedRangeIds.has(grp.id);
                                  return (
                                    <div
                                      key={grp.id}
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        padding: '2px 8px',
                                        borderRadius: '5px',
                                        background: 'var(--bg3)',
                                        border: '1px solid var(--border2)',
                                        fontSize: '12px',
                                        fontFamily: 'var(--font-mono, monospace)',
                                        fontWeight: 600,
                                        color: 'var(--text)'
                                      }}
                                    >
                                      <span>{grp.displayLabel}</span>
                                      {grp.isRange && (
                                        <button
                                          type="button"
                                          onClick={() => toggleRangeExpand(grp.id)}
                                          title={isExpanded ? 'Collapse individual serials' : `Expand ${grp.count} panels`}
                                          style={{
                                            height: '18px',
                                            padding: '0 5px',
                                            borderRadius: '10px',
                                            background: isExpanded ? 'var(--blue, #38bdf8)' : 'rgba(56, 189, 248, 0.16)',
                                            color: isExpanded ? '#0f172a' : 'var(--blue, #38bdf8)',
                                            border: 'none',
                                            fontSize: '10px',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '2px'
                                          }}
                                        >
                                          <span>{grp.count}P</span>
                                          {isExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Expanded panel chips */}
                              {groups.some(g => g.isRange && expandedRangeIds.has(g.id)) && (
                                <div
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '4px',
                                    padding: '6px 10px',
                                    background: 'var(--bg4)',
                                    border: '1px dashed var(--border2)',
                                    borderRadius: '6px'
                                  }}
                                >
                                  {groups
                                    .filter(g => g.isRange && expandedRangeIds.has(g.id))
                                    .flatMap(g => g.items)
                                    .map((sn, snIdx) => (
                                      <span
                                        key={snIdx}
                                        style={{
                                          padding: '1px 6px',
                                          fontSize: '11px',
                                          fontFamily: 'var(--font-mono, monospace)',
                                          background: 'var(--bg2)',
                                          border: '1px solid var(--border)',
                                          borderRadius: '3px',
                                          color: 'var(--text2)'
                                        }}
                                      >
                                        {sn}
                                      </span>
                                    ))}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Given Date */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                          <span
                            style={{
                              fontSize: '11.5px',
                              fontFamily: 'var(--font-mono, monospace)',
                              color: 'var(--text2)'
                            }}
                          >
                            {(order.pos?.[0]?.date || order.created_at || '').slice(0, 10)}
                          </span>
                        </td>

                        {/* PO Status Badge (Uniform across all serials) */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '3px 9px',
                              borderRadius: '20px',
                              fontSize: '11px',
                              fontWeight: 700,
                              background: statusTheme.bgColor,
                              color: statusTheme.color,
                              border: `1px solid ${statusTheme.borderColor}`,
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background: statusTheme.dotColor
                              }}
                            />
                            <span>{currentStatus}</span>
                          </span>
                        </td>

                        {/* Update Status Action */}
                        <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }}>
                          <div
                            className="status-action-container"
                            style={{ position: 'relative', display: 'inline-block' }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setStatusMenuOpenOrderId(prev =>
                                  prev === (order.id || order.order_uid) ? null : (order.id || order.order_uid)
                                );
                              }}
                              style={{
                                height: '28px',
                                padding: '0 10px',
                                fontSize: '11.5px',
                                fontWeight: 600,
                                borderRadius: '5px',
                                border: '1px solid var(--border2)',
                                background: 'var(--bg3)',
                                color: 'var(--text)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.12s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'var(--blue, #38bdf8)';
                                e.currentTarget.style.color = 'var(--blue, #38bdf8)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'var(--border2)';
                                e.currentTarget.style.color = 'var(--text)';
                              }}
                            >
                              <span>Update</span>
                              <ChevronDown size={11} />
                            </button>

                            {/* Dropdown Menu to change status */}
                            {isStatusMenuOpen && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: 'calc(100% + 4px)',
                                  right: 0,
                                  width: '160px',
                                  background: 'var(--bg2)',
                                  border: '1px solid var(--border2)',
                                  borderRadius: '8px',
                                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.45)',
                                  zIndex: 30,
                                  padding: '4px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '2px',
                                  textAlign: 'left'
                                }}
                              >
                                {['Pending', 'Partial recieved', 'PO closed'].map((st) => {
                                  const isCurrent = currentStatus === st;
                                  const cfg = STATUS_CONFIG[st];
                                  return (
                                    <button
                                      key={st}
                                      type="button"
                                      onClick={() => handleUpdatePoStatus(order, st)}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '7px 9px',
                                        borderRadius: '5px',
                                        border: 'none',
                                        background: isCurrent ? cfg.bgColor : 'transparent',
                                        color: isCurrent ? cfg.color : 'var(--text)',
                                        fontSize: '11.5px',
                                        fontWeight: isCurrent ? 700 : 500,
                                        cursor: 'pointer',
                                        transition: 'background 0.12s ease'
                                      }}
                                      onMouseEnter={(e) => { e.currentTarget.style.background = cfg.bgColor; }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.background = isCurrent ? cfg.bgColor : 'transparent';
                                      }}
                                    >
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span
                                          style={{
                                            width: '6px',
                                            height: '6px',
                                            borderRadius: '50%',
                                            background: cfg.dotColor
                                          }}
                                        />
                                        <span>{st}</span>
                                      </div>
                                      {isCurrent && <Check size={12} />}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── Modal Footer ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingTop: '8px',
            borderTop: '1px solid var(--border)'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              height: '36px',
              padding: '0 18px',
              fontSize: '12.5px',
              fontWeight: 600,
              borderRadius: '7px',
              border: '1px solid var(--border2)',
              background: 'var(--bg3)',
              color: 'var(--text)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg4)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--bg3)';
              e.currentTarget.style.borderColor = 'var(--border2)';
            }}
          >
            Close
          </button>
        </div>

      </div>
    </Modal>
  );
}
