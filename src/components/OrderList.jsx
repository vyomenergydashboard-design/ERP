import { useState, useEffect } from 'react';
import DocumentManager from './DocumentManager';
import BulkImportModal from './BulkImportModal';
import { STATUS_BADGE_MAP } from '../data/planningData';

export default function OrderList({ initialSelectedId }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [displayField, setDisplayField] = useState('created_at');
  const [isLoading, setIsLoading] = useState(true);
  const [orderTab, setOrderTab] = useState('inprogress'); // 'inprogress' | 'completed'
  const token = localStorage.getItem('token');

  const [unitSteps, setUnitSteps] = useState([]);
  const [users, setUsers] = useState([]);
  const [expandedStepId, setExpandedStepId] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const [bulkUpdateLi, setBulkUpdateLi] = useState(null);
  const [bulkDept, setBulkDept] = useState('');
  const [bulkStatus, setBulkStatus] = useState('done');
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [showImport, setShowImport] = useState(false);

  // Amend Order states
  const [editingOrderDetails, setEditingOrderDetails] = useState(null);
  const [editOrderForm, setEditOrderForm] = useState({
    company_location_id: '',
    order_date: '',
    delivery_date: '',
    notes: '',
    priority: 'Medium',
    po_number: '',
    packaging_type: '',
    end_client_name: '',
    gst_number: '',
    reference_number: '',
    classification: 'Standard',
  });
  const [companiesList, setCompaniesList] = useState([]);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/companies", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCompaniesList(await res.json());
      }
    } catch (err) {
      console.error('Fetch companies error:', err);
    }
  };

  const handleStartEditOrder = (order) => {
    setEditOrderForm({
      company_location_id: order.company_location_id || '',
      order_date: order.order_date ? order.order_date.split('T')[0] : '',
      delivery_date: order.delivery_date ? order.delivery_date.split('T')[0] : '',
      notes: order.notes || '',
      priority: order.priority || 'Medium',
      po_number: order.po_number || '',
      packaging_type: order.packaging_type || '',
      end_client_name: order.end_client_name || '',
      gst_number: order.gst_number || '',
      reference_number: order.reference_number || '',
      classification: order.classification || 'Standard',
    });
    setEditingOrderDetails(order);
    fetchCompanies();
  };

  const handleEditOrderSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingEdit(true);
    try {
      const res = await fetch(`${window.API_BASE}/api/orders/${editingOrderDetails.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editOrderForm)
      });
      if (res.ok) {
        alert('Order amended successfully!');
        setEditingOrderDetails(null);
        await fetchOrderDetails(selectedOrder.id);
        await fetchOrders();
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrder.id } }));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to amend order.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error, please try again.');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const handleHoldAction = async (action) => {
    try {
      const res = await fetch(`${window.API_BASE}/api/orders/${selectedOrder.id}/hold/${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        await fetchOrderDetails(selectedOrder.id);
        await fetchOrders();
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrder.id } }));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update hold status');
      }
    } catch (err) {
      console.error(err);
      alert('Network error updating hold status');
    }
  };

  const isAdmin = ['Admin', 'Manager', 'Sales'].includes(currentUser.role);

  const handleBulkUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!bulkDept || !bulkStatus) return;
    setBulkSubmitting(true);
    try {
      const res = await fetch(`${window.API_BASE}/api/planning/line-items/${bulkUpdateLi.id}/bulk-units-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ dept: bulkDept, status: bulkStatus })
      });
      if (res.ok) {
        alert(`Successfully updated all ${bulkDept} steps to ${bulkStatus} for this batch.`);
        setBulkUpdateLi(null);
        await fetchOrderDetails(selectedOrder.id);
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrder.id } }));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to bulk update units.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error, please try again.');
    } finally {
      setBulkSubmitting(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchUsers();

    const handleUpdate = (e) => {
      fetchOrders();
      if (e.detail && e.detail.orderId) {
        setSelectedOrder(prev => {
          if (prev && prev.id === e.detail.orderId) {
            fetchOrderDetails(e.detail.orderId);
          }
          return prev;
        });
      }
    };
    window.addEventListener('orderUpdated', handleUpdate);
    return () => window.removeEventListener('orderUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    if (selectedUnit) {
      fetchUnitSteps(selectedUnit.id);
    } else {
      setUnitSteps([]);
      setExpandedStepId(null);
    }
  }, [selectedUnit]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/users", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    }
  };

  const fetchUnitSteps = async (unitId) => {
    try {
      const res = await fetch(`${window.API_BASE}/api/units/${unitId}/steps`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUnitSteps(await res.json());
      }
    } catch (err) {
      console.error('Fetch unit steps error:', err);
    }
  };

  const updateUnitStep = async (stepId, body) => {
    try {
      const res = await fetch(`${window.API_BASE}/api/units/${selectedUnit.id}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        await fetchUnitSteps(selectedUnit.id);
        await fetchOrderDetails(selectedOrder.id);
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrder.id } }));
      }
    } catch (err) {
      console.error('Update unit step error:', err);
    }
  };

  useEffect(() => {
    if (initialSelectedId && orders.length > 0) {
      fetchOrderDetails(initialSelectedId);
    }
  }, [initialSelectedId, orders]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/orders", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrderDetails = async (id) => {
    try {
      const res = await fetch(`${window.API_BASE}/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data);
        if (selectedUnit) {
          const freshUnit = data.units?.find(u => u.id === selectedUnit.id);
          if (freshUnit) setSelectedUnit(freshUnit);
        }
      }
    } catch (err) {
      console.error('Fetch details error:', err);
    }
  };

  const getOrderProgress = (units) => {
    if (!units || units.length === 0) return 0;
    const weights = {
      'Pending': 0,
      'Design': 15,
      'Material Waiting': 30,
      'Production': 55,
      'QC Testing': 75,
      'QC Passed': 90,
      'Ready for Dispatch': 95,
      'Dispatched': 100,
      'Delivered': 100,
      'Rework': 40,
      'QC Failed': 60
    };
    let totalProgress = 0;
    units.forEach(u => {
      totalProgress += weights[u.status] || 0;
    });
    return Math.round(totalProgress / units.length);
  };

  const updateUnitStatus = async (unitId, newStatus) => {
    try {
      const res = await fetch(`${window.API_BASE}/api/units/${unitId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updatedUnit = await res.json();
        setSelectedOrder(prev => ({
          ...prev,
          units: prev.units.map(u => u.id === unitId ? { ...u, status: newStatus } : u)
        }));
        setSelectedUnit(prev => ({ ...prev, status: newStatus }));
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrder.id } }));
      }
    } catch (err) {
      console.error('Failed to update unit status', err);
    }
  };

  if (isLoading) return <div className="loading">Loading orders...</div>;

  const isCompleted = (order) =>
    parseInt(order.unit_count) > 0 &&
    parseInt(order.dispatched_unit_count) >= parseInt(order.unit_count);

  const inProgressOrders = orders.filter(o => !isCompleted(o));
  const completedOrders  = orders.filter(o => isCompleted(o));
  const visibleOrders    = orderTab === 'completed' ? completedOrders : inProgressOrders;

  return (
    <div className="order-list-container">
      <div className="orders-sidebar">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 className="sidebar-title" style={{ margin: 0 }}>Orders</h3>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {isAdmin && (
              <button
                onClick={() => setShowImport(true)}
                title="Bulk Import Orders from Excel"
                style={{
                  background: 'var(--blue-dim)',
                  border: '1px solid var(--blue)',
                  color: 'var(--blue)',
                  borderRadius: '6px',
                  padding: '3px 9px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  transition: 'opacity 0.15s',
                }}
                onMouseOver={e => e.currentTarget.style.opacity = '0.8'}
                onMouseOut={e => e.currentTarget.style.opacity = '1'}
              >
                📥 Import
              </button>
            )}
            <select
              value={displayField}
              onChange={(e) => setDisplayField(e.target.value)}
              className="form-select"
              style={{ padding: '2px 8px', fontSize: '11px', width: 'auto' }}
            >
              <option value="created_at">Created Date</option>
              <option value="order_date">Order Date</option>
              <option value="delivery_date">Delivery Date</option>
              <option value="po_number">PO Number</option>
            </select>
          </div>
        </div>

        {/* In Progress / Completed tabs */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', background: 'var(--bg4)', borderRadius: '8px', padding: '4px', border: '1px solid var(--border)' }}>
          <button
            onClick={() => setOrderTab('inprogress')}
            style={{ flex: 1, padding: '6px 0', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s',
              background: orderTab === 'inprogress' ? 'var(--blue)' : 'transparent',
              color: orderTab === 'inprogress' ? '#fff' : 'var(--text3)'
            }}
          >
            In Progress <span style={{ opacity: 0.7, fontWeight: 400 }}>({inProgressOrders.length})</span>
          </button>
          <button
            onClick={() => setOrderTab('completed')}
            style={{ flex: 1, padding: '6px 0', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s',
              background: orderTab === 'completed' ? 'var(--green)' : 'transparent',
              color: orderTab === 'completed' ? '#fff' : 'var(--text3)'
            }}
          >
            Completed <span style={{ opacity: 0.7, fontWeight: 400 }}>({completedOrders.length})</span>
          </button>
        </div>
        <div className="order-items">
          {visibleOrders.length === 0 && (
            <div style={{ color: 'var(--text3)', fontSize: '13px', textAlign: 'center', padding: '32px 16px', fontStyle: 'italic' }}>
              {orderTab === 'completed' ? 'No completed orders yet.' : 'No in-progress orders.'}
            </div>
          )}
          {visibleOrders.map(order => (
            <div 
              key={order.id} 
              className={`order-card ${selectedOrder?.id === order.id ? 'active' : ''}`}
              onClick={() => fetchOrderDetails(order.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div className="order-num" style={{ margin: 0 }}>{order.order_number}</div>
                {orderTab === 'completed' ? (
                  <span style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', fontWeight: '700' }}>✓ DONE</span>
                ) : order.priority && (
                  <span className={`priority-badge ${order.priority.toLowerCase()}`}>
                    {order.priority}
                  </span>
                )}
              </div>
              <div className="order-meta">
                <span>{order.unit_count} Units</span> • 
                <span>
                  {displayField === 'created_at' ? new Date(order.created_at).toLocaleDateString() :
                   displayField === 'order_date' ? (order.order_date ? new Date(order.order_date).toLocaleDateString() : 'No Order Date') :
                   displayField === 'delivery_date' ? (order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'No Delivery Date') :
                   displayField === 'po_number' ? (order.po_number || 'No PO Number') : ''}
                </span>
              </div>
              {order.company_name && (
                <div className="order-company">
                  🏢 {order.company_name} - {order.company_city}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="order-details-pane">
        {selectedOrder ? (
          <div className="details-content">
            <div className="details-header">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: 0 }}>{selectedOrder.order_number}</h2>
                  {currentUser.role === 'Admin' && (
                    <button 
                      className="vbtn" 
                      style={{ padding: '4px 12px', fontSize: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={() => handleStartEditOrder(selectedOrder)}
                    >
                      Amend Order
                    </button>
                  )}

                  {/* Hold management buttons */}
                  {selectedOrder.hold_status === 'Requested' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '4px 8px', borderRadius: '4px', fontWeight: '600' }}>
                        Hold Requested
                      </span>
                      {['Admin', 'Manager'].includes(currentUser.role) && (
                        <>
                          <button 
                            type="button"
                            className="vbtn" 
                            style={{ padding: '4px 12px', fontSize: '11px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => handleHoldAction('approve')}
                          >
                            Approve Hold
                          </button>
                          <button 
                            type="button"
                            className="vbtn" 
                            style={{ padding: '4px 12px', fontSize: '11px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            onClick={() => handleHoldAction('reject')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {selectedOrder.hold_status === 'Approved' && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontWeight: '700', textTransform: 'uppercase' }}>
                        ⛔ ON HOLD
                      </span>
                      {['Admin', 'Manager', 'Sales'].includes(currentUser.role) && (
                        <button 
                          type="button"
                          className="vbtn" 
                          style={{ padding: '4px 12px', fontSize: '11px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                          onClick={() => handleHoldAction('resume')}
                        >
                          Resume Order
                        </button>
                      )}
                    </div>
                  )}

                  {(selectedOrder.hold_status === 'None' || !selectedOrder.hold_status) && ['Admin', 'Manager', 'Sales'].includes(currentUser.role) && (
                    <button 
                      type="button"
                      className="vbtn" 
                      style={{ padding: '4px 12px', fontSize: '11px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      onClick={() => handleHoldAction('request')}
                    >
                      Request Hold
                    </button>
                  )}
                </div>
                {selectedOrder.company_name && (
                  <div className="order-company-lg" style={{ marginTop: '4px' }}>
                    🏢 {selectedOrder.company_name} ({selectedOrder.company_city})
                  </div>
                )}
              </div>
              <div className="creator-info">Created by: {selectedOrder.creator_name || 'System'}</div>
            </div>

            {selectedOrder.hold_status === 'Approved' && (
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', color: '#ef4444', fontWeight: '500', fontSize: '13px' }}>
                ⚠️ <strong>ORDER IS CURRENTLY ON HOLD</strong> — All production updates, step changes, and document uploads for this order and its units are currently locked.
              </div>
            )}

            <div className="order-progress-container">
              <div className="progress-labels">
                <span>Order Progress</span>
                <span>{getOrderProgress(selectedOrder.units)}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill" 
                  style={{ width: `${getOrderProgress(selectedOrder.units)}%` }}
                />
              </div>
            </div>

            <div className="details-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
              <div className="detail-box">
                <label>Priority</label>
                <div className="val">
                  <span className={`priority-badge ${selectedOrder.priority?.toLowerCase() || 'medium'}`}>
                    {selectedOrder.priority || 'Medium'}
                  </span>
                </div>
              </div>
              <div className="detail-box">
                <label>Order Date</label>
                <div className="val">{selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleDateString('en-IN') : 'N/A'}</div>
              </div>
              <div className="detail-box">
                <label>Delivery Date</label>
                <div className="val">{selectedOrder.delivery_date ? new Date(selectedOrder.delivery_date).toLocaleDateString('en-IN') : 'TBD'}</div>
              </div>
              <div className="detail-box">
                <label>PO Number</label>
                <div className="val">{selectedOrder.po_number || 'N/A'}</div>
              </div>
              <div className="detail-box">
                <label>Cust. Ref #</label>
                <div className="val">{selectedOrder.reference_number || 'N/A'}</div>
              </div>
              <div className="detail-box">
                <label>Classification</label>
                <div className="val" style={{ fontWeight: '600', color: selectedOrder.classification === 'Non-Standard' ? 'var(--blue)' : 'var(--text2)' }}>
                  {selectedOrder.classification || 'Standard'}
                </div>
              </div>
              <div className="detail-box">
                <label>End Client</label>
                <div className="val">{selectedOrder.end_client_name || 'N/A'}</div>
              </div>
              <div className="detail-box">
                <label>GST Number</label>
                <div className="val">{selectedOrder.gst_number || 'N/A'}</div>
              </div>
              <div className="detail-box">
                <label>Packaging</label>
                <div className="val">{selectedOrder.packaging_type || 'N/A'}</div>
              </div>
              <div className="detail-box" style={{ gridColumn: '1 / -1' }}>
                <label>Notes</label>
                <div className="val" style={{ whiteSpace: 'pre-wrap' }}>{selectedOrder.notes || 'No notes'}</div>
              </div>
            </div>

            <div className="line-items-section" style={{ marginTop: '24px' }}>
              <h3>Line Items & Units</h3>
              {selectedOrder.line_items?.map(li => {
                const liUnits = selectedOrder.units?.filter(u => u.line_item_id === li.id) || [];
                return (
                  <div key={li.id} style={{ background: 'var(--bg3)', borderRadius: '8px', padding: '16px', marginBottom: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--border2)', paddingBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <strong>Line {li.line_item_number}</strong>: {li.material_description} {li.part_number ? `(${li.part_number})` : ''}
                        {['Admin', 'Manager', 'Production', 'Sales', 'Design', 'Purchase', 'Stores', 'QC', 'Dispatch', 'Accounts'].includes(currentUser.role) && (
                          <button 
                            className="vbtn" 
                            style={{ padding: '2px 8px', fontSize: '10px', background: '#2563eb', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', height: '22px' }} 
                            onClick={() => {
                              if (selectedOrder.hold_status === 'Approved') {
                                alert('Order is currently on hold. Updates are disabled.');
                                return;
                              }
                              setBulkDept('');
                              setBulkStatus('done');
                              setBulkUpdateLi(li);
                            }}
                          >
                            Bulk Update Batch
                          </button>
                        )}
                      </div>
                      <div style={{ color: 'var(--text3)', fontSize: '13px' }}>
                        {li.quantity} {li.unit || 'Nos'} @ ₹{li.unit_price}
                      </div>
                    </div>
                    
                    <div className="units-grid">
                      {liUnits.map(unit => (
                        <div 
                          key={unit.id} 
                          className="unit-badge interactive"
                          onClick={() => setSelectedUnit(unit)}
                        >
                          <span className="u-id">{unit.short_serial}</span>
                          <span className={`u-status ${unit.status.toLowerCase().replace(/\s+/g, '-')}`}>{unit.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <DocumentManager 
              entityType="Order" 
              entityId={selectedOrder.id} 
              initialDocs={selectedOrder.documents?.filter(d => d.entity_type === 'Order') || []} 
              userRole={currentUser.role}
              readOnly={selectedOrder.hold_status === 'Approved'}
            />
          </div>
        ) : (
          <div className="select-prompt">Select an order from the list to view details and documents.</div>
        )}
      </div>

      {selectedUnit && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setSelectedUnit(null); }}>
          <div className="modal" style={{ maxWidth: '600px', width: '95%' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Unit Tracking</div>
                <div className="modal-sub">{selectedUnit.unit_id} ({selectedUnit.status})</div>
              </div>
              <button className="modal-close" onClick={() => setSelectedUnit(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selectedOrder?.hold_status === 'Approved' && (
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', color: '#ef4444', fontSize: '11px', fontWeight: '500' }}>
                  ⛔ <strong>Order is on hold.</strong> Production flow step updates are locked until the hold is released.
                </div>
              )}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ margin: '0 0 12px 0', color: 'var(--text)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Production Steps</h4>
                
                {unitSteps.length === 0 ? (
                  <div style={{ color: 'var(--text3)', fontSize: '13px', fontStyle: 'italic' }}>Loading steps...</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[...unitSteps].sort((a, b) => {
                      if (['Admin', 'Manager'].includes(currentUser.role)) return 0;
                      if (a.dept === currentUser.role && b.dept !== currentUser.role) return -1;
                      if (b.dept === currentUser.role && a.dept !== currentUser.role) return 1;
                      return 0;
                    }).map(step => {
                      const isExpanded = expandedStepId === step.id;
                      const canEditStep = (['Admin', 'Manager'].includes(currentUser.role) || step.dept === currentUser.role || step.assigned_user_id === currentUser.id) && selectedOrder?.hold_status !== 'Approved';
                      const assignedUser = users.find(u => u.id === step.assigned_user_id);
                      
                      let stepCustomFields = [];
                      try {
                        stepCustomFields = Array.isArray(step.custom_fields) ? step.custom_fields : JSON.parse(step.custom_fields || '[]');
                      } catch {
                        stepCustomFields = [];
                      }

                      const matchingUsers = users.filter(u => u.role === step.dept);

                      return (
                        <div key={step.id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px' }}>
                          <div 
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                          >
                            <div>
                              <div style={{ fontWeight: '600', color: 'var(--text)', fontSize: '13px' }}>
                                {!canEditStep && (
                                  <span style={{ color: '#60a5fa', marginRight: '6px', fontSize: '9px', textTransform: 'uppercase', background: 'rgba(59, 130, 246, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                    View Only
                                  </span>
                                )}
                                {step.name}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                                Dept: <span style={{ color: '#60a5fa' }}>{step.dept}</span> | Assigned: <span style={{ color: '#34d399' }}>{assignedUser ? assignedUser.username : 'Unassigned'}</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span className={`step-status-badge badge-${step.status}`} style={{ fontSize: '9px', fontWeight: 'bold' }}>
                                {step.status}
                              </span>
                              <span style={{ fontSize: '10px', color: 'var(--text3)' }}>{isExpanded ? '▲' : '▼'}</span>
                            </div>
                          </div>

                          {isExpanded && (
                            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border2)' }}>
                              {/* Read-Only Banner */}
                              {!canEditStep && (
                                <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', color: '#60a5fa', fontSize: '11px' }}>
                                  ℹ️ <strong>View-Only Mode</strong> — managed by the <strong>{step.dept}</strong> department.
                                </div>
                              )}
                              
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                                <div>
                                  <label style={{ fontSize: '11px', color: 'var(--text3)', display: 'block', marginBottom: '4px' }}>Step Status</label>
                                  {canEditStep ? (
                                    <select 
                                      className="form-select"
                                      value={step.status}
                                      onChange={(e) => updateUnitStep(step.id, { status: e.target.value })}
                                      style={{ fontSize: '12px', padding: '4px' }}
                                    >
                                      <option value="pending">Pending</option>
                                      <option value="inprogress">In Progress</option>
                                      <option value="done">Done</option>
                                      <option value="blocked">Blocked</option>
                                      <option value="review">Review</option>
                                    </select>
                                  ) : (
                                    <div style={{ marginTop: '2px' }}>
                                      <span className={`step-status-badge ${(STATUS_BADGE_MAP[step.status] || STATUS_BADGE_MAP.pending).cls}`} style={{ fontSize: '11px', padding: '3px 8px', fontWeight: 'bold' }}>
                                        {(STATUS_BADGE_MAP[step.status] || STATUS_BADGE_MAP.pending).label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <label style={{ fontSize: '11px', color: 'var(--text3)', display: 'block', marginBottom: '4px' }}>Assign Worker</label>
                                  {canEditStep ? (
                                    <select 
                                      className="form-select"
                                      value={step.assigned_user_id || ''}
                                      onChange={(e) => updateUnitStep(step.id, { assigned_user_id: e.target.value ? parseInt(e.target.value) : null })}
                                      style={{ fontSize: '12px', padding: '4px' }}
                                    >
                                      <option value="">Unassigned</option>
                                      {matchingUsers.map(u => (
                                        <option key={u.id} value={u.id}>{u.username}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <div style={{ fontSize: '12px', color: 'var(--text)', background: 'var(--bg3)', padding: '6px 10px', borderRadius: '6px' }}>
                                      {assignedUser ? assignedUser.username : 'Unassigned'}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div style={{ marginBottom: '12px' }}>
                                <label style={{ fontSize: '11px', color: 'var(--text3)', display: 'block', marginBottom: '4px' }}>Notes</label>
                                {canEditStep ? (
                                  <textarea 
                                    className="form-input"
                                    defaultValue={step.notes || ''}
                                    onBlur={(e) => updateUnitStep(step.id, { notes: e.target.value })}
                                    placeholder="Add step notes..."
                                    style={{ fontSize: '12px', height: '50px', resize: 'vertical' }}
                                  />
                                ) : (
                                  <div style={{ fontSize: '12px', color: 'var(--text2)', fontStyle: 'italic', background: 'var(--bg3)', padding: '8px 12px', borderRadius: '6px', whiteSpace: 'pre-wrap' }}>
                                    {step.notes || 'No notes added.'}
                                  </div>
                                )}
                              </div>

                              {stepCustomFields.length > 0 && (
                                <div style={{ marginBottom: '12px', padding: '10px', background: 'var(--bg3)', borderRadius: '6px', border: '1px solid var(--border)' }}>
                                  <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Custom Fields</div>
                                  {stepCustomFields.map((field, fIdx) => {
                                    const handleFieldChange = (val) => {
                                      const updatedCF = [...stepCustomFields];
                                      updatedCF[fIdx].value = val;
                                      updateUnitStep(step.id, { custom_fields: updatedCF });
                                    };

                                    return (
                                      <div key={field.id} style={{ marginBottom: '8px' }}>
                                        <label style={{ fontSize: '11px', color: 'var(--text2)', display: 'block', marginBottom: '2px' }}>{field.label}</label>
                                        {!canEditStep ? (
                                          <div style={{ fontSize: '12px', color: 'var(--text)', fontWeight: '500', marginTop: '2px' }}>
                                            {field.type === 'Yes/No' ? (field.value === 'Yes' || field.value === true ? '✅ Yes' : '❌ No') : (field.value || '—')}
                                          </div>
                                        ) : field.type === 'Yes/No' ? (
                                          <input 
                                            type="checkbox"
                                            checked={!!field.value}
                                            onChange={(e) => handleFieldChange(e.target.checked)}
                                          />
                                        ) : field.type === 'Dropdown' ? (
                                          <select 
                                            className="form-select"
                                            value={field.value || ''}
                                            onChange={(e) => handleFieldChange(e.target.value)}
                                            style={{ fontSize: '12px', padding: '4px' }}
                                          >
                                            <option value="">Select...</option>
                                            {field.options?.map(o => (
                                              <option key={o} value={o}>{o}</option>
                                            ))}
                                          </select>
                                        ) : (
                                          <input 
                                            type={field.type === 'Number' ? 'number' : 'text'}
                                            className="form-input"
                                            defaultValue={field.value || ''}
                                            onBlur={(e) => handleFieldChange(e.target.value)}
                                            style={{ fontSize: '12px', padding: '4px 8px' }}
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div style={{ marginTop: 24, borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <DocumentManager 
                  entityType="Unit" 
                  entityId={selectedUnit.id} 
                  initialDocs={selectedOrder.documents?.filter(d => d.entity_type === 'Unit' && d.entity_id === selectedUnit.id) || []} 
                  onUploadSuccess={() => fetchOrderDetails(selectedOrder.id)}
                  userRole={currentUser.role}
                  readOnly={selectedOrder.hold_status === 'Approved'}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {bulkUpdateLi && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setBulkUpdateLi(null); }}>
          <div className="modal" style={{ maxWidth: '400px', width: '90%' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Bulk Update Batch Units</div>
                <div className="modal-sub">Line Item: {bulkUpdateLi.line_item_number} ({bulkUpdateLi.quantity} units)</div>
              </div>
              <button className="modal-close" onClick={() => setBulkUpdateLi(null)}>✕</button>
            </div>
            <form onSubmit={handleBulkUpdateSubmit} className="modal-body">
              <div className="modal-field" style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'var(--text2)', fontSize: '13px', marginBottom: '6px' }}>Target Department Task</label>
                <select 
                  className="form-select" 
                  value={bulkDept} 
                  onChange={(e) => setBulkDept(e.target.value)}
                  style={{ width: '100%', borderRadius: '6px', padding: '10px' }}
                  required
                >
                  <option value="">-- Select Department --</option>
                  <option value="Design">Design</option>
                  <option value="Purchase">Purchase</option>
                  <option value="Stores">Stores</option>
                  <option value="Production">Production</option>
                  <option value="QC">QC</option>
                  <option value="Dispatch">Dispatch</option>
                </select>
              </div>

              <div className="modal-field" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', color: 'var(--text2)', fontSize: '13px', marginBottom: '6px' }}>Set Task Status to</label>
                <select 
                  className="form-select" 
                  value={bulkStatus} 
                  onChange={(e) => setBulkStatus(e.target.value)}
                  style={{ width: '100%', borderRadius: '6px', padding: '10px' }}
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="inprogress">In Progress</option>
                  <option value="done">Done</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" className="btn-cancel" onClick={() => setBulkUpdateLi(null)} disabled={bulkSubmitting}>Cancel</button>
                <button type="submit" className="btn-save" disabled={bulkSubmitting} style={{ background: '#3b82f6', border: 'none', color: '#fff', borderRadius: '6px', padding: '8px 16px', cursor: 'pointer', fontWeight: '600' }}>
                  {bulkSubmitting ? 'Updating...' : 'Update All Units'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .order-list-container {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          height: calc(100vh - 200px);
        }
        .orders-sidebar {
          background: var(--bg2);
          border-radius: 12px;
          border: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .sidebar-title { padding: 16px; border-bottom: 1px solid var(--border); margin: 0; font-size: 16px; color: var(--text); }
        .order-items { overflow-y: auto; flex: 1; }
        .order-card {
          padding: 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background 0.2s;
        }
        .order-card:hover { background: var(--bg3); }
        .order-card.active { background: var(--bg3); border-left: 3px solid var(--blue); }
        .order-num { color: var(--text); font-weight: 600; font-size: 14px; margin-bottom: 4px; }
        .order-meta { color: var(--text3); font-size: 12px; }
        .order-company { color: var(--text3); font-size: 11px; margin-top: 6px; }
        .order-company-lg { color: var(--text2); font-size: 14px; margin-top: 4px; }
        
        .order-details-pane {
          background: var(--bg2);
          border-radius: 12px;
          border: 1px solid var(--border);
          padding: 24px;
          overflow-y: auto;
        }
        .details-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
        .details-header h2 { margin: 0; color: var(--text); }
        .creator-info { color: var(--text3); font-size: 13px; }
        
        .order-progress-container { margin-bottom: 24px; }
        .progress-labels { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; color: var(--text2); text-transform: uppercase; font-weight: 600; }
        .progress-bar-bg { background: var(--border2); border-radius: 6px; height: 8px; overflow: hidden; width: 100%; }
        .progress-bar-fill { background: var(--teal); height: 100%; transition: width 0.4s ease-out; }
        
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; }
        .detail-box label { color: var(--text3); font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px; }
        .detail-box .val { color: var(--text); font-size: 15px; }
        
        .units-section { margin-bottom: 32px; }
        .units-section h3 { font-size: 16px; color: var(--text); margin-bottom: 12px; }
        .units-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .unit-badge {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 6px;
          padding: 6px 10px;
          display: flex;
          flex-direction: column;
          min-width: 140px;
        }
        .unit-badge.interactive { cursor: pointer; transition: background 0.2s, border-color 0.2s; }
        .unit-badge.interactive:hover { background: var(--bg4); border-color: var(--blue); }
        .u-id { font-size: 12px; color: var(--text); font-weight: 500; }
        .u-status { font-size: 10px; color: var(--text3); margin-top: 2px; text-transform: uppercase; }
        .u-status.pending { color: var(--accent); }
        
        .select-prompt { height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text3); }
        .loading { text-align: center; padding: 40px; color: var(--text3); }
        
        .priority-badge {
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .priority-badge.low { background: var(--gray-dim); color: var(--text3); border: 1px solid var(--border2); }
        .priority-badge.medium { background: var(--blue-dim); color: var(--blue); border: 1px solid rgba(59, 130, 246, 0.4); }
        .priority-badge.high { background: var(--orange-dim); color: var(--orange); border: 1px solid rgba(245, 158, 11, 0.4); }
        .priority-badge.urgent { background: var(--red-dim); color: var(--red); border: 1px solid rgba(239, 68, 68, 0.4); }
      `}} />

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={showImport}
        onClose={() => setShowImport(false)}
        onImportComplete={() => {
          fetchOrders();
          window.dispatchEvent(new CustomEvent('orderUpdated'));
        }}
      />

      {/* Amend Order Modal */}
      {editingOrderDetails && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setEditingOrderDetails(null); }}>
          <div className="modal" style={{ maxWidth: '700px', width: '95%' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">Amend Order Details</div>
                <div className="modal-sub">Updating fields for {editingOrderDetails.order_number}</div>
              </div>
              <button className="modal-close" onClick={() => setEditingOrderDetails(null)}>✕</button>
            </div>
            <form onSubmit={handleEditOrderSubmit}>
              <div className="modal-body">
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Select Company & Location</label>
                    <select 
                      className="form-select"
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.company_location_id} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, company_location_id: e.target.value})}
                      required
                    >
                      <option value="">-- None --</option>
                      {companiesList.map(comp => (
                        <optgroup key={comp.id} label={comp.name}>
                          {comp.locations?.map(loc => (
                            <option key={loc.id} value={loc.id}>
                              {comp.name} - {loc.city}
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Order Date</label>
                    <input 
                      type="date" 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.order_date} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, order_date: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Overall Delivery Date</label>
                    <input 
                      type="date" 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.delivery_date} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, delivery_date: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Priority</label>
                    <select 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.priority} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, priority: e.target.value})}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Customer PO Number</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.po_number} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, po_number: e.target.value})}
                      placeholder="e.g. PO-45000"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Packaging Type</label>
                    <select 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.packaging_type} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, packaging_type: e.target.value})}
                    >
                      <option value="">-- Select Packaging Type --</option>
                      <option value="Wooden Packaging">Wooden Packaging</option>
                      <option value="Foam Packaging">Foam Packaging</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>End Client Name</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.end_client_name} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, end_client_name: e.target.value})}
                      placeholder="e.g. Reliance Industries"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>GST Number</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.gst_number} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, gst_number: e.target.value})}
                      placeholder="e.g. 27AAAAA1111A1Z1"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Customer Reference Number</label>
                    <input 
                      type="text" 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.reference_number} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, reference_number: e.target.value})}
                      placeholder="e.g. REF-2026-99"
                    />
                  </div>

                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Classification</label>
                    <select 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)' }}
                      value={editOrderForm.classification || 'Standard'} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, classification: e.target.value})}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Non-Standard">Non-Standard</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', textTransform: 'uppercase' }}>Overall Order Notes</label>
                    <textarea 
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border)', height: '80px', resize: 'vertical' }}
                      value={editOrderForm.notes} 
                      onChange={(e) => setEditOrderForm({...editOrderForm, notes: e.target.value})}
                      placeholder="Enter special notes..."
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '16px', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="vbtn" style={{ background: '#64748b', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }} onClick={() => setEditingOrderDetails(null)}>Cancel</button>
                <button type="submit" className="vbtn" style={{ background: '#10b981', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }} disabled={isSubmittingEdit}>
                  {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
