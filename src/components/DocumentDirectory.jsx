import { useState, useEffect } from 'react';
import { Search, Filter, FolderOpen, RefreshCw, FileText, Download, Trash2, Calendar, User } from 'lucide-react';

const DOC_TYPES = [
  'All', 'General', 'PO', 'Quotation', 'BOM', 'Drawing', 'QC Report', 'Dispatch Document', 'Photo'
];

export default function DocumentDirectory() {
  const [data, setData] = useState({ orders: [], documents: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [collapsedOrders, setCollapsedOrders] = useState({});

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDirectory();
  }, []);

  const fetchDirectory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(window.API_BASE + "/api/documents/directory", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch document directory', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDoc = async (e, docId) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        // Remove document from state
        setData(prev => ({
          ...prev,
          documents: prev.documents.filter(d => d.id !== docId)
        }));
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error during deletion');
    }
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

  const getTagBadgeStyle = (tag) => {
    switch (tag?.toUpperCase()) {
      case 'PO':
        return { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' };
      case 'QUOTATION':
        return { background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' };
      case 'BOM':
        return { background: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf', border: '1px solid rgba(45,212,191,0.3)' };
      case 'DRAWING':
        return { background: 'rgba(167, 139, 250, 0.15)', color: '#c084fc', border: '1px solid rgba(167,139,250,0.3)' };
      case 'QC REPORT':
        return { background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.3)' };
      default:
        return { background: 'rgba(255, 255, 255, 0.08)', color: '#e8eaf0', border: '1px solid rgba(255,255,255,0.15)' };
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

  const toggleCollapse = (orderId) => {
    setCollapsedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]  // undefined → true → false toggle; we invert reading below
    }));
  };

  // Filter documents
  const filteredDocuments = data.documents.filter(doc => {
    // Dept Filter (role of uploader)
    if (selectedDept !== 'All' && doc.uploader_role !== selectedDept) {
      return false;
    }
    // Tag Filter
    if (selectedTag !== 'All' && doc.doc_type !== selectedTag) {
      return false;
    }
    // Text search
    if (searchTerm.trim() !== '') {
      const tokens = searchTerm.trim().toLowerCase().split(/\s+/);
      const fileName = (doc.file_name || '').toLowerCase();
      const username = (doc.uploader_username || '').toLowerCase();
      const details = (doc.source_details || '').toLowerCase();
      
      const order = data.orders.find(o => Number(o.id) === Number(doc.order_id));
      const orderNum = (order?.order_number || '').toLowerCase();
      const poNum = (order?.po_number || '').toLowerCase();
      const compName = (order?.company_name || '').toLowerCase();
      const clientName = (order?.end_client_name || '').toLowerCase();
      
      return tokens.every(token => 
        fileName.includes(token) || 
        username.includes(token) || 
        details.includes(token) ||
        orderNum.includes(token) ||
        poNum.includes(token) ||
        compName.includes(token) ||
        clientName.includes(token)
      );
    }
    return true;
  });

  // Map orders to their filtered documents
  const ordersWithDocs = data.orders.map(order => {
    const docs = filteredDocuments.filter(d => Number(d.order_id) === Number(order.id));
    return {
      ...order,
      docs
    };
  }).filter(order => {
    if (searchTerm || selectedDept !== 'All' || selectedTag !== 'All') {
      if (searchTerm.trim() !== '') {
        const tokens = searchTerm.trim().toLowerCase().split(/\s+/);
        const orderNum = (order.order_number || '').toLowerCase();
        const poNum = (order.po_number || '').toLowerCase();
        const compName = (order.company_name || '').toLowerCase();
        const clientName = (order.end_client_name || '').toLowerCase();
        
        const orderMatches = tokens.every(token =>
          orderNum.includes(token) ||
          poNum.includes(token) ||
          compName.includes(token) ||
          clientName.includes(token)
        );
        
        const hasActiveDeptTagFilters = selectedDept !== 'All' || selectedTag !== 'All';
        if (orderMatches && !hasActiveDeptTagFilters) {
          return true;
        }
      }
      return order.docs.length > 0;
    }
    return true;
  });

  const totalFilteredDocsCount = filteredDocuments.length;

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '18px', fontWeight: 600 }}>
          <FolderOpen size={22} style={{ color: '#f59e0b' }} />
          Order Document Directory
        </h2>
      </div>

      {/* Filters Dashboard Panel */}
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
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
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <input
              type="text"
              placeholder="Search by file name, uploader, details..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                padding: '10px 12px 10px 38px',
                fontSize: '13px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              className="doc-search-input"
            />
          </div>

          {/* Department Select */}
          <div style={{ position: 'relative', width: '180px' }}>
            <Filter size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
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
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text3)', fontSize: '10px' }}>▼</div>
          </div>

          {/* Tag Select */}
          <div style={{ position: 'relative', width: '180px' }}>
            <FileText size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                color: 'var(--text)',
                padding: '10px 12px 10px 34px',
                fontSize: '13px',
                outline: 'none',
                appearance: 'none',
                cursor: 'pointer',
              }}
            >
              {DOC_TYPES.map(type => (
                <option key={type} value={type === 'All' ? 'All' : type}>{type === 'All' ? 'All Document Tags' : type}</option>
              ))}
            </select>
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text3)', fontSize: '10px' }}>▼</div>
          </div>
        </div>

        {/* Clear/Refresh Action Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {(searchTerm || selectedDept !== 'All' || selectedTag !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDept('All');
                setSelectedTag('All');
              }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: 'var(--red)',
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
            onClick={fetchDirectory}
            disabled={isLoading}
            style={{
              background: 'var(--bg3)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
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
            <RefreshCw size={14} className={isLoading ? "spin" : ""} />
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
        marginBottom: '16px',
        fontSize: '12px',
        color: 'var(--text2)'
      }}>
        <div>
          Showing documents for <span style={{ color: 'var(--accent)', fontWeight: '600' }}>{ordersWithDocs.length}</span> orders{' '}
          (<span style={{ color: '#fff', fontWeight: '600' }}>{totalFilteredDocsCount}</span> documents match filters)
        </div>
      </div>

      {/* Orders List Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isLoading && data.orders.length === 0 ? (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '64px', textAlign: 'center', color: 'var(--text2)' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px', color: 'var(--accent)', display: 'block' }} />
            Loading Document Directory...
          </div>
        ) : ordersWithDocs.length === 0 ? (
          <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', padding: '48px', textAlign: 'center', color: 'var(--text3)' }}>
            No orders or documents match the current filters.
          </div>
        ) : (
          ordersWithDocs.map(order => {
            // Default collapsed = true (absent key); explicit true = expanded
            const isCollapsed = collapsedOrders[order.id] !== true;
            const hasDocs = order.docs.length > 0;
            return (
              <div 
                key={order.id} 
                style={{ 
                  background: 'var(--bg2)', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  transition: 'border-color 0.2s'
                }}
                className="order-card"
              >
                {/* Order Header / Accordion trigger */}
                <div 
                  onClick={() => toggleCollapse(order.id)}
                  style={{ 
                    padding: '16px 20px', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    background: 'rgba(255, 255, 255, 0.01)',
                    borderBottom: !isCollapsed ? '1px solid var(--border)' : 'none'
                  }}
                  className="order-card-header"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {/* Order Number tag */}
                    <span style={{ 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '13px', 
                      background: 'rgba(245,158,11,0.1)', 
                      color: 'var(--accent)', 
                      padding: '4px 10px', 
                      borderRadius: '6px', 
                      border: '1px solid rgba(245,158,11,0.2)',
                      fontWeight: 600
                    }}>
                      {order.order_number}
                    </span>

                    {/* PO Number */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--text3)', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>PO:</span>
                      <span style={{ color: '#fff', fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>
                        {order.po_number || '—'}
                      </span>
                    </div>

                    {/* Client / Company */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--text3)', fontSize: '11px' }}>Client:</span>
                      <span style={{ color: 'var(--text2)', fontSize: '13px', fontWeight: 500 }}>
                        {order.company_name || order.end_client_name || '—'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ 
                      fontSize: '11px', 
                      background: hasDocs ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.03)', 
                      color: hasDocs ? 'var(--green)' : 'var(--text3)', 
                      padding: '3px 8px', 
                      borderRadius: '20px',
                      border: hasDocs ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid var(--border)'
                    }}>
                      {order.docs.length} document{order.docs.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: 'var(--text3)', fontSize: '11px', transition: 'transform 0.2s', transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                      ▼
                    </span>
                  </div>
                </div>

                {/* Collapsible Content */}
                {!isCollapsed && (
                  <div style={{ padding: '20px' }}>
                    {!hasDocs ? (
                      <div style={{ color: 'var(--text3)', textAlign: 'center', fontSize: '13px', padding: '12px 0', fontStyle: 'italic' }}>
                        No documents associated with this order.
                      </div>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border2)', color: 'var(--text2)' }}>
                              <th style={{ padding: '10px 12px', fontWeight: 500, fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Document Name</th>
                              <th style={{ padding: '10px 12px', fontWeight: 500, fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Tag</th>
                              <th style={{ padding: '10px 12px', fontWeight: 500, fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Uploading Dept</th>
                              <th style={{ padding: '10px 12px', fontWeight: 500, fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Uploaded By</th>
                              <th style={{ padding: '10px 12px', fontWeight: 500, fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Source Context</th>
                              <th style={{ padding: '10px 12px', fontWeight: 500, fontSize: '11px', fontFamily: 'var(--font-mono)' }}>Date &amp; Time</th>
                              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.docs.map(doc => {
                              const canDelete = doc.uploaded_by === user.id || ['admin', 'manager'].includes(user.role?.toLowerCase());
                              const fileNameOnDisk = doc.file_path.split(/[\/\\]/).pop();
                              const downloadUrl = `${window.API_BASE}/uploads/${fileNameOnDisk}?token=${token}`;

                              return (
                                <tr key={doc.id} className="doc-row" style={{ borderBottom: '1px solid var(--border)' }}>
                                  {/* Document Name */}
                                  <td style={{ padding: '12px' }}>
                                    <a 
                                      href={downloadUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      style={{ color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}
                                      className="doc-file-link"
                                    >
                                      <FileText size={16} style={{ color: 'var(--text3)', flexShrink: 0 }} />
                                      <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '280px' }} title={doc.file_name}>
                                        {doc.file_name}
                                      </span>
                                      <span style={{ fontSize: '10px', color: 'var(--text3)' }}>
                                        ({(doc.file_size / 1024).toFixed(1)} KB)
                                      </span>
                                    </a>
                                  </td>

                                  {/* Document Tag */}
                                  <td style={{ padding: '12px' }}>
                                    <span style={{
                                      fontSize: '10px',
                                      fontWeight: 600,
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      textTransform: 'uppercase',
                                      display: 'inline-block',
                                      ...getTagBadgeStyle(doc.doc_type)
                                    }}>
                                      {doc.doc_type}
                                    </span>
                                  </td>

                                  {/* Uploading Dept */}
                                  <td style={{ padding: '12px' }}>
                                    <span style={{
                                      fontSize: '11px',
                                      fontWeight: 500,
                                      padding: '2px 8px',
                                      borderRadius: '12px',
                                      display: 'inline-block',
                                      ...getDeptBadgeStyle(doc.uploader_role)
                                    }}>
                                      {doc.uploader_role || 'System'}
                                    </span>
                                  </td>

                                  {/* Uploaded By */}
                                  <td style={{ padding: '12px', color: 'var(--text2)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <User size={13} style={{ color: 'var(--text3)' }} />
                                      <span>{doc.uploader_username || 'system'}</span>
                                    </div>
                                  </td>

                                  {/* Source Details */}
                                  <td style={{ padding: '12px', color: 'var(--text2)', fontStyle: doc.source_details === 'Order Level' ? 'italic' : 'normal' }}>
                                    {doc.source_details}
                                  </td>

                                  {/* Timestamp */}
                                  <td style={{ padding: '12px', color: 'var(--text3)', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                                      <Calendar size={13} />
                                      <span>{formatDate(doc.uploaded_at)}</span>
                                    </div>
                                  </td>

                                  {/* Actions */}
                                  <td style={{ padding: '12px', textAlign: 'right' }}>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                      <a 
                                        href={downloadUrl} 
                                        download={doc.file_name}
                                        style={{
                                          background: 'rgba(255, 255, 255, 0.05)',
                                          border: '1px solid var(--border)',
                                          color: 'var(--text2)',
                                          padding: '5px 8px',
                                          borderRadius: '6px',
                                          cursor: 'pointer',
                                          display: 'inline-flex',
                                          alignItems: 'center'
                                        }}
                                        title="Download document"
                                        className="action-icon-btn"
                                      >
                                        <Download size={13} />
                                      </a>
                                      {canDelete && (
                                        <button 
                                          onClick={(e) => handleDeleteDoc(e, doc.id)}
                                          style={{
                                            background: 'rgba(239, 68, 68, 0.05)',
                                            border: '1px solid rgba(239, 68, 68, 0.15)',
                                            color: 'var(--red)',
                                            padding: '5px 8px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center'
                                          }}
                                          title="Delete document"
                                          className="action-icon-btn delete-btn"
                                        >
                                          <Trash2 size={13} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .doc-search-input:focus {
          border-color: var(--accent) !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.15);
        }
        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.2) !important;
        }
        .refresh-btn:hover:not(:disabled) {
          background: var(--bg4) !important;
          border-color: var(--border2) !important;
          color: #fff !important;
        }
        .spin {
          animation: spin-anim 1s linear infinite;
        }
        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .order-card {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .order-card-header:hover {
          background: rgba(255, 255, 255, 0.02) !important;
        }
        .doc-row {
          transition: background 0.1s ease;
        }
        .doc-row:hover {
          background: rgba(255, 255, 255, 0.01) !important;
        }
        .doc-file-link:hover {
          text-decoration: underline !important;
        }
        .action-icon-btn:hover {
          background: var(--bg4) !important;
          border-color: var(--border2) !important;
          color: #fff !important;
        }
        .action-icon-btn.delete-btn:hover {
          background: rgba(239, 68, 68, 0.15) !important;
          border-color: var(--red) !important;
          color: var(--red) !important;
        }
      `}} />
    </div>
  );
}
