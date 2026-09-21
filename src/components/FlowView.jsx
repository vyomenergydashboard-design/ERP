import { useState, useEffect, useRef } from 'react';
import { DEPTS, STATUS_BADGE_MAP } from '../data/planningData';
import DocumentManager from './DocumentManager';
import { FileText, ExternalLink, Download, CheckCircle2, AlertCircle, Layers } from 'lucide-react';


function StatusBadge({ status }) {
  const { cls, label } = STATUS_BADGE_MAP[status] || STATUS_BADGE_MAP.pending;
  return <span className={`step-status-badge ${cls}`}>{label}</span>;
}

export default function FlowView({ 
  steps, 
  currentFilter, 
  onOpenModal, 
  onSetView, 
  userRole, 
  selectedOrderId, 
  selectedOrder, 
  onStepsChanged,
  selectedUnitId,
  setSelectedUnitId,
  unitSteps,
  setUnitSteps
}) {
  const [taskMasters, setTaskMasters] = useState([]);
  const [draggedStep, setDraggedStep] = useState(null);
  const token = localStorage.getItem('token');

  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [editingUnitStep, setEditingUnitStep] = useState(null);
  const [users, setUsers] = useState([]);
  const [unitStepError, setUnitStepError] = useState(null);
  const [showUnitHoldBox, setShowUnitHoldBox] = useState(false);
  const [showUnitCancelBox, setShowUnitCancelBox] = useState(false);
  const [unitActionReason, setUnitActionReason] = useState('');
  const [unitActionScope, setUnitActionScope] = useState('selected');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canEditUnitStep = editingUnitStep ? (['Admin', 'Manager'].includes(userRole) || editingUnitStep.dept === userRole || editingUnitStep.assigned_user_id === currentUser.id) : false;
  const [unitModalActiveTab, setUnitModalActiveTab] = useState('details');
  const [unitDocCount, setUnitDocCount] = useState(0);
  const [unitRefDocs, setUnitRefDocs] = useState(null);
  const [isLoadingRefDocs, setIsLoadingRefDocs] = useState(false);

  const unitCustomFields = (() => {
    if (!editingUnitStep) return [];
    try {
      return Array.isArray(editingUnitStep.custom_fields) ? editingUnitStep.custom_fields : JSON.parse(editingUnitStep.custom_fields || '[]');
    } catch {
      return [];
    }
  })();


  useEffect(() => {
    if (editingUnitStep?.order_unit_id) {
      setIsLoadingRefDocs(true);
      fetch(`${window.API_BASE}/api/units/${editingUnitStep.order_unit_id}/reference-documents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => setUnitRefDocs(data))
      .catch(err => {
        console.error('Failed to load reference documents', err);
        setUnitRefDocs(null);
      })
      .finally(() => setIsLoadingRefDocs(false));
    } else {
      setUnitRefDocs(null);
    }
  }, [editingUnitStep?.order_unit_id, editingUnitStep?.id, token]);

  const handleUpdateUnitStep = async (stepId, body) => {
    const stepObj = unitSteps.find(s => s.id === stepId);
    const unitId = stepObj ? stepObj.order_unit_id : selectedUnitId;
    if (!unitId) return;

    try {
      const res = await fetch(`${window.API_BASE}/api/units/${unitId}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const freshSteps = await fetch(`${window.API_BASE}/api/units/${unitId}/steps`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        setUnitSteps(freshSteps);
        
        const updatedStep = freshSteps.find(s => s.id === stepId);
        setEditingUnitStep(updatedStep);
        
        if (onStepsChanged) onStepsChanged();
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrderId } }));
      } else {
        const errData = await res.json().catch(() => ({}));
        setUnitStepError(errData.error || 'Failed to update step');
      }
    } catch (err) {
      console.error(err);
      setUnitStepError('Network error — could not update step');
    }
  };

  const handleResumeUnitDirect = async (unit) => {
    const isCancel = unit.hold_status === 'Cancelled' || String(unit.status || '').startsWith('Cancel');
    if (!confirm(`Resume panel ${unit.unit_id}${isCancel ? ' (undo cancellation)' : ' from hold'}?`)) return;
    const stepId = unit.hold_step_id || unit.cancelled_step_id || unitSteps.find(s => s.status === 'hold' || s.status === 'cancelled')?.id || (unitSteps[0]?.id);
    if (!stepId) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/units/${unit.id}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action: 'resume', scope: 'selected' })
      });
      if (res.ok) {
        const freshSteps = await fetch(`${window.API_BASE}/api/units/${unit.id}/steps`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(r => r.json());
        setUnitSteps(freshSteps);
        if (onStepsChanged) onStepsChanged();
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrderId } }));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to resume panel');
      }
    } catch (err) {
      console.error('Failed to resume panel', err);
    }
  };

  const handleStepClick = (step) => {
    setUnitStepError(null);
    setShowUnitHoldBox(false);
    setShowUnitCancelBox(false);
    setUnitActionReason('');
    setUnitActionScope('selected');
    if (step.order_unit_id) {
      setEditingUnitStep(step);
      setUnitModalActiveTab('details');
      setUnitDocCount(0);
      setIsUnitModalOpen(true);
    } else {
      onOpenModal(step.id);
    }
  };

  const orderLevelSteps = steps.filter(s => !s.order_unit_id);
  const activeSteps = [...unitSteps, ...orderLevelSteps];

  const handleUpdateClassification = async (newClassification) => {
    if (!selectedOrder?.id) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/orders/${selectedOrder.id}/classification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ classification: newClassification })
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrder.id } }));
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || 'Failed to update classification');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderUnitSelector = () => {
    const units = selectedOrder?.units || [];
    const canChangeClassification = ['Admin', 'Manager', 'Design', 'Sales'].includes(userRole);
    const currentClassification = selectedOrder?.classification || 'Standard';

    return (
      <div className="unit-selector-container" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, color: 'var(--text3)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Track Level:</span>
          <select 
            className="form-select"
            value={selectedUnitId}
            onChange={(e) => setSelectedUnitId(e.target.value)}
            style={{ width: 'auto', background: 'var(--bg3)', fontSize: '13px', padding: '6px 12px', border: '1px solid var(--border2)', color: 'var(--text)', borderRadius: '6px', cursor: 'pointer' }}
          >
            <option value="">Order Milestones</option>
            {units.map(u => (
              <option key={u.id} value={u.id}>Unit: {u.unit_id} ({u.status})</option>
            ))}
          </select>
        </div>

        {selectedOrder && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 'bold' }}>Classification:</span>
            {canChangeClassification ? (
              <select
                className="form-select"
                value={currentClassification}
                onChange={(e) => handleUpdateClassification(e.target.value)}
                style={{
                  fontSize: '12px', padding: '4px 10px', borderRadius: '6px',
                  background: currentClassification === 'Standard' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                  color: currentClassification === 'Standard' ? '#60a5fa' : '#fbbf24',
                  border: `1px solid ${currentClassification === 'Standard' ? 'rgba(59,130,246,0.4)' : 'rgba(245,158,11,0.4)'}`,
                  fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                <option value="Standard">Standard Order</option>
                <option value="Non-Standard">Non-Standard (Custom)</option>
              </select>
            ) : (
              <span style={{
                fontSize: '12px', fontWeight: 'bold', padding: '4px 10px', borderRadius: '6px',
                background: currentClassification === 'Standard' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                color: currentClassification === 'Standard' ? '#60a5fa' : '#fbbf24',
                border: `1px solid ${currentClassification === 'Standard' ? 'rgba(59,130,246,0.4)' : 'rgba(245,158,11,0.4)'}`
              }}>
                {currentClassification}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    fetch(window.API_BASE + "/api/task_masters", {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(async res => {
      if (res.ok) {
        const data = await res.json();
        setTaskMasters(data);
      }
    })
    .catch(console.error);
  }, [token]);

  const handleAddTask = async (taskId) => {
    if (!taskId || !selectedOrderId) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/orders/${selectedOrderId}/steps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ taskId })
      });
      if (res.ok) {
        if (onStepsChanged) onStepsChanged();
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrderId } }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragStart = (e, step) => {
    setDraggedStep(step);
    e.dataTransfer.effectAllowed = 'move';
    // Subtle visual feedback
    setTimeout(() => { e.target.style.opacity = '0.5'; }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedStep(null);
  };

  const handleDragOver = (e, deptId) => {
    e.preventDefault();
    if (draggedStep && draggedStep.dept !== deptId) {
      e.dataTransfer.dropEffect = 'none'; // Prevent dropping in another lane
    } else {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = async (e, targetStep) => {
    e.preventDefault();
    if (!draggedStep || draggedStep.id === targetStep.id || draggedStep.dept !== targetStep.dept) {
      return;
    }

    const deptSteps = steps.filter(s => s.dept === targetStep.dept);
    const oldIndex = deptSteps.findIndex(s => s.id === draggedStep.id);
    const newIndex = deptSteps.findIndex(s => s.id === targetStep.id);
    
    if (oldIndex === -1 || newIndex === -1) return;

    // Create new array with reordered items
    const newOrder = [...deptSteps];
    const [removed] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, removed);

    const orderedIds = newOrder.map(s => s.id);

    try {
      const res = await fetch(`${window.API_BASE}/api/orders/${selectedOrderId}/steps/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ orderedIds })
      });
      if (res.ok && onStepsChanged) {
        onStepsChanged(); // Refresh steps from server
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrderId } }));
      }
    } catch (err) {
      console.error('Failed to reorder', err);
    }
  };

  const sortedDepts = [...DEPTS].sort((a, b) => {
    if (['Admin', 'Manager'].includes(userRole)) return 0;
    if (a.id === userRole) return -1;
    if (b.id === userRole) return 1;
    return 0;
  });
  const depts = currentFilter === 'all' ? sortedDepts : sortedDepts.filter((d) => d.id === currentFilter);

  const selectedUnit = selectedOrder?.units?.find(u => String(u.id) === String(selectedUnitId));
  const isOrderOnHold = selectedOrder?.hold_status === 'Approved' || String(selectedOrder?.status || '').toLowerCase().startsWith('hold');
  const isOrderCancelled = String(selectedOrder?.status || '').toLowerCase().startsWith('cancel');
  const isSelectedUnitOnHold = selectedUnit && (selectedUnit.hold_status === 'Hold' || String(selectedUnit.status || '').startsWith('Hold'));
  const isSelectedUnitCancelled = selectedUnit && (selectedUnit.hold_status === 'Cancelled' || String(selectedUnit.status || '').startsWith('Cancel'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {renderUnitSelector()}

      {/* Prominent Order Hold Alert Banner */}
      {isOrderOnHold && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.28) 0%, rgba(245, 158, 11, 0.14) 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 24px rgba(245, 158, 11, 0.25)',
          animation: 'hold-pulse 2s infinite ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.25)',
              border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0
            }}>
              ⏸
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fbbf24', letterSpacing: '0.5px' }}>
                ORDER #{selectedOrder?.order_number} IS CURRENTLY ON HOLD
              </div>
              <div style={{ fontSize: '13px', color: '#fef3c7', marginTop: '4px' }}>
                Production updates and process flow are paused across all departments.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Order Cancelled Alert Banner */}
      {isOrderCancelled && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.28) 0%, rgba(239, 68, 68, 0.14) 100%)',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 24px rgba(239, 68, 68, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.25)',
              border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0
            }}>
              ✕
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#f87171', letterSpacing: '0.5px' }}>
                ORDER #{selectedOrder?.order_number} HAS BEEN CANCELLED
              </div>
              <div style={{ fontSize: '13px', color: '#fee2e2', marginTop: '4px' }}>
                This order and all associated unit workflows have been cancelled.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Unit Hold Alert Banner */}
      {selectedUnit && isSelectedUnitOnHold && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.28) 0%, rgba(245, 158, 11, 0.14) 100%)',
          border: '2px solid #f59e0b',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 24px rgba(245, 158, 11, 0.25)',
          animation: 'hold-pulse 2s infinite ease-in-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.25)',
              border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0
            }}>
              ⏸
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#fbbf24', letterSpacing: '0.5px' }}>
                PANEL {selectedUnit.unit_id} IS ON HOLD @ {selectedUnit.hold_step_name || 'Step'} ({selectedUnit.hold_dept || 'Department'})
              </div>
              <div style={{ fontSize: '13px', color: '#fef3c7', marginTop: '4px' }}>
                <strong>Reason:</strong> {selectedUnit.hold_reason || 'No reason specified'}
                {selectedUnit.held_by_name && <span style={{ marginLeft: 10 }}>· <strong>Held by:</strong> {selectedUnit.held_by_name}</span>}
                {selectedUnit.held_at && <span style={{ marginLeft: 10 }}>· <strong>Held on:</strong> {new Date(selectedUnit.held_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
            </div>
          </div>
          {(canEditUnitStep || ['Admin', 'Manager'].includes(userRole)) && (
            <button
              type="button"
              onClick={() => handleResumeUnitDirect(selectedUnit)}
              style={{
                background: '#10b981',
                color: '#fff',
                fontWeight: '700',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)',
                flexShrink: 0
              }}
            >
              ▶ Resume Panel
            </button>
          )}
        </div>
      )}

      {/* Prominent Unit Cancelled Alert Banner */}
      {selectedUnit && isSelectedUnitCancelled && (
        <div style={{
          background: 'linear-gradient(90deg, rgba(239, 68, 68, 0.28) 0%, rgba(239, 68, 68, 0.14) 100%)',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 6px 24px rgba(239, 68, 68, 0.25)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.25)',
              border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0
            }}>
              ✕
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#f87171', letterSpacing: '0.5px' }}>
                PANEL {selectedUnit.unit_id} IS CANCELLED @ {selectedUnit.cancelled_step_name || 'Step'} ({selectedUnit.cancelled_dept || 'Department'})
              </div>
              <div style={{ fontSize: '13px', color: '#fee2e2', marginTop: '4px' }}>
                <strong>Reason:</strong> {selectedUnit.cancelled_reason || 'No reason specified'}
                {selectedUnit.cancelled_by_name && <span style={{ marginLeft: 10 }}>· <strong>Cancelled by:</strong> {selectedUnit.cancelled_by_name}</span>}
                {selectedUnit.cancelled_at && <span style={{ marginLeft: 10 }}>· <strong>Cancelled on:</strong> {new Date(selectedUnit.cancelled_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>}
              </div>
            </div>
          </div>
          {(canEditUnitStep || ['Admin', 'Manager'].includes(userRole)) && (
            <button
              type="button"
              onClick={() => handleResumeUnitDirect(selectedUnit)}
              style={{
                background: '#10b981',
                color: '#fff',
                fontWeight: '700',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)',
                flexShrink: 0
              }}
            >
              ▶ Resume Panel (Undo Cancel)
            </button>
          )}
        </div>
      )}
      
      {currentFilter === 'all' ? (
        <div className="lanes">
          {depts.map((dept) => {
            const deptSteps = activeSteps.filter((s) => s.dept === dept.id);
            const hasBlocked = deptSteps.some((s) => s.status === 'blocked');
            const canEdit = !selectedUnitId && (['Admin', 'Manager'].includes(userRole) || dept.id === userRole);
            
            const availableTasks = taskMasters.filter(t => t.dept === dept.id && !deptSteps.some(s => s.task_id === t.id));

            return (
              <div key={dept.id} className={`lane${hasBlocked ? ' active-lane' : ''}`}>
                <div className="lane-label">
                  <div style={{ width: 3, height: 20, background: dept.color, borderRadius: 2, marginBottom: 6 }} />
                  <div className="lane-name">{dept.label}</div>
                  <div className="lane-sub">{dept.sub}</div>
                  {dept.id === 'Sales' && userRole === 'Sales' && !selectedUnitId && (
                    <button 
                      className="vbtn" 
                      style={{ marginTop: 12, width: '100%', fontSize: 11, background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                      onClick={() => onSetView('new-order')}
                    >
                      + New Order
                    </button>
                  )}
                  
                  {canEdit && availableTasks.length > 0 && selectedOrderId && !selectedUnitId && (
                    <div style={{ marginTop: 12 }}>
                      <select 
                        className="form-select" 
                        style={{ fontSize: 11, padding: '4px 8px', background: 'rgba(255,255,255,0.05)' }}
                        onChange={(e) => {
                          handleAddTask(e.target.value);
                          e.target.value = "";
                        }}
                      >
                        <option value="">+ Add Task...</option>
                        {availableTasks.map(t => (
                          <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="lane-steps">
                  {deptSteps.map((step, i) => {
                    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                    const isUnitStep = !!step.order_unit_id;
                    const canEditStep = ['Admin', 'Manager'].includes(userRole) || step.dept === userRole || (isUnitStep && step.assigned_user_id === currentUser.id);
                    const canDrag = !isUnitStep && !selectedUnitId && canEditStep;
                    const isStepHold = step.status === 'hold' || (selectedUnit && selectedUnit.hold_step_id === step.id);
                    const isStepCancelled = step.status === 'cancelled' || (selectedUnit && selectedUnit.cancelled_step_id === step.id);
                    const isPausedDueToHold = selectedUnit && isSelectedUnitOnHold && !isStepHold && (step.status === 'pending' || step.status === 'inprogress');

                    return (
                      <div 
                        key={isUnitStep ? `unit-${step.id}` : `order-${step.id}`}
                        style={{ display: 'flex', alignItems: 'center' }}
                        draggable={canDrag}
                        onDragStart={(e) => canDrag && handleDragStart(e, step)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, dept.id)}
                        onDrop={(e) => canDrag && handleDrop(e, step)}
                      >
                        <div 
                          className={`step status-${step.status}${isStepHold ? ' status-hold' : ''}${isStepCancelled ? ' status-cancelled' : ''}${!canEditStep ? ' read-only' : ''}${step.dept === 'Sales' && step.status === 'pending' ? ' pulse-sales' : ''}${draggedStep?.id === step.id ? ' dragging' : ''}`}
                          onClick={() => handleStepClick(step)}
                          style={{
                            cursor: canDrag ? 'grab' : 'pointer',
                            ...(isStepHold ? {
                              background: 'rgba(245, 158, 11, 0.28)',
                              border: '2px solid #f59e0b',
                              boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
                            } : isStepCancelled ? {
                              background: 'rgba(239, 68, 68, 0.28)',
                              border: '2px solid #ef4444',
                              boxShadow: '0 0 16px rgba(239, 68, 68, 0.45)',
                            } : isPausedDueToHold ? {
                              opacity: 0.55,
                              filter: 'grayscale(0.3)'
                            } : {})
                          }}
                        >
                          <span className={`step-dot dot-${isStepHold ? 'hold' : isStepCancelled ? 'cancelled' : step.status}`} />
                          <div className="step-num">{dept.id.toUpperCase().slice(0, 3)}-{String(i + 1).padStart(2, '0')}</div>
                          <div className="step-name">
                            {step.name} 
                            {step.requires_upload && <span title="Requires Upload" style={{ marginLeft: 4, fontSize: 10, color: 'var(--accent)' }}>(Upload Required)</span>}
                          </div>
                          <div className="step-sub">{step.sub}</div>
                          <StatusBadge status={isStepHold ? 'hold' : isStepCancelled ? 'cancelled' : step.status} />
                          {isStepHold && (selectedUnit?.hold_reason || step.notes) && (
                            <div style={{ fontSize: 10, color: '#fbbf24', marginTop: 4, fontWeight: 700 }}>
                              ⏸ {selectedUnit?.hold_reason || step.notes}
                            </div>
                          )}
                          {isStepCancelled && (selectedUnit?.cancelled_reason || step.notes) && (
                            <div style={{ fontSize: 10, color: '#f87171', marginTop: 4, fontWeight: 700 }}>
                              ✕ {selectedUnit?.cancelled_reason || step.notes}
                            </div>
                          )}
                          {isPausedDueToHold && (
                            <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 4, fontStyle: 'italic' }}>
                              ⏸ Paused (Held Upstream)
                            </div>
                          )}
                          {step.notes && !isStepHold && !isStepCancelled && <div className="step-note">{step.notes}</div>}

                        </div>
                        {i < deptSteps.length - 1 && <div className="step-arrow">›</div>}
                      </div>
                    );
                  })}
                  {deptSteps.length === 0 && (
                    <div style={{ padding: 12, color: 'var(--text3)', fontSize: 11, fontStyle: 'italic', textAlign: 'center' }}>
                      No tasks assigned to this department.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          <style dangerouslySetInnerHTML={{ __html: `
            .pulse-sales {
              animation: sales-glow 2s infinite ease-in-out;
              border: 1px solid rgba(20, 184, 166, 0.4) !important;
            }
            @keyframes sales-glow {
              0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
              50% { box-shadow: 0 0 15px 0 rgba(20, 184, 166, 0.4); }
              100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
            }
          `}} />
        </div>
      ) : (
        <div className="flow-card-grid">
          {depts.map((dept) => {
          const deptSteps = activeSteps.filter((s) => s.dept === dept.id);
          const hasBlocked = deptSteps.some((s) => s.status === 'blocked');
          const canEdit = !selectedUnitId && (['Admin', 'Manager'].includes(userRole) || dept.id === userRole);
          
          const availableTasks = taskMasters.filter(t => t.dept === dept.id && !deptSteps.some(s => s.task_id === t.id));

          return (
            <div key={dept.id} className={`dept-flow-card${hasBlocked ? ' has-blocked' : ''}`}>
              <div className="dept-card-header">
                <div className="dept-card-title-row">
                  <div className="dept-color-bar" style={{ background: dept.color }}></div>
                  <div>
                    <div className="dept-card-title">{dept.label}</div>
                    <div className="dept-card-sub">{dept.sub}</div>
                  </div>
                </div>
                
                {selectedOrder && (
                  <div className="dept-card-ord-row">
                    <div className="ord-badge">{selectedOrder.order_number}</div>
                    {selectedOrder.company_name && (
                      <div style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                        {selectedOrder.company_name}
                      </div>
                    )}
                    {selectedOrder.delivery_date && (
                      <div className="delivery-badge">
                        <span className="icon">Delivery:</span> {new Date(selectedOrder.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                )}
                
                {selectedOrder && selectedOrder.notes && (
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
                    <span style={{ fontWeight: '700', textTransform: 'uppercase', fontSize: '9px', letterSpacing: '0.5px', color: 'var(--accent)', marginTop: '1px', flexShrink: 0 }}>Note:</span>
                    <span style={{ color: 'var(--text2)' }}>{selectedOrder.notes}</span>
                  </div>
                )}
                
                {dept.id === 'Sales' && userRole === 'Sales' && !selectedUnitId && (
                  <button 
                    className="vbtn" 
                    style={{ marginTop: 8, width: '100%', fontSize: 11, background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)' }}
                    onClick={() => onSetView('new-order')}
                  >
                    + New Order
                  </button>
                )}
                
                {canEdit && availableTasks.length > 0 && selectedOrderId && !selectedUnitId && (
                  <div style={{ marginTop: 8 }}>
                    <select 
                      className="form-select" 
                      style={{ fontSize: 11, padding: '4px 8px', background: 'rgba(255,255,255,0.05)' }}
                      onChange={(e) => {
                        handleAddTask(e.target.value);
                        e.target.value = "";
                      }}
                    >
                      <option value="">+ Add Task...</option>
                      {availableTasks.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="dept-card-tasks-vertical">
                {deptSteps.map((step, i) => {
                  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                  const isUnitStep = !!step.order_unit_id;
                  const canEditStep = ['Admin', 'Manager'].includes(userRole) || step.dept === userRole || (isUnitStep && step.assigned_user_id === currentUser.id);
                  const canDrag = !isUnitStep && !selectedUnitId && canEditStep;
                  const isStepHold = step.status === 'hold' || (selectedUnit && selectedUnit.hold_step_id === step.id);
                  const isStepCancelled = step.status === 'cancelled' || (selectedUnit && selectedUnit.cancelled_step_id === step.id);
                  const isPausedDueToHold = selectedUnit && isSelectedUnitOnHold && !isStepHold && (step.status === 'pending' || step.status === 'inprogress');

                  return (
                    <div 
                      key={isUnitStep ? `unit-${step.id}` : `order-${step.id}`}
                      style={{ display: 'flex', alignItems: 'center' }}
                      draggable={canDrag}
                      onDragStart={(e) => canDrag && handleDragStart(e, step)}
                      onDragEnd={handleDragEnd}
                      onDragOver={(e) => handleDragOver(e, dept.id)}
                      onDrop={(e) => canDrag && handleDrop(e, step)}
                    >
                      <div 
                        className={`step status-${step.status}${isStepHold ? ' status-hold' : ''}${isStepCancelled ? ' status-cancelled' : ''}${!canEditStep ? ' read-only' : ''}${step.dept === 'Sales' && step.status === 'pending' ? ' pulse-sales' : ''}${draggedStep?.id === step.id ? ' dragging' : ''}`}
                        onClick={() => handleStepClick(step)}
                        style={{
                          cursor: canDrag ? 'grab' : 'pointer',
                          ...(isStepHold ? {
                            background: 'rgba(245, 158, 11, 0.28)',
                            border: '2px solid #f59e0b',
                            boxShadow: '0 0 16px rgba(245, 158, 11, 0.45)',
                          } : isStepCancelled ? {
                            background: 'rgba(239, 68, 68, 0.28)',
                            border: '2px solid #ef4444',
                            boxShadow: '0 0 16px rgba(239, 68, 68, 0.45)',
                          } : isPausedDueToHold ? {
                            opacity: 0.55,
                            filter: 'grayscale(0.3)'
                          } : {})
                        }}
                      >
                        <span className={`step-dot dot-${isStepHold ? 'hold' : isStepCancelled ? 'cancelled' : step.status}`} />
                        <div className="step-num">{dept.id.toUpperCase().slice(0, 3)}-{String(i + 1).padStart(2, '0')}</div>
                        <div className="step-name">
                          {step.name} 
                          {step.requires_upload && <span title="Requires Upload" style={{ marginLeft: 4, fontSize: 10, color: 'var(--accent)' }}>(Upload Required)</span>}
                        </div>
                        <div className="step-sub">{step.sub}</div>
                        <StatusBadge status={isStepHold ? 'hold' : isStepCancelled ? 'cancelled' : step.status} />
                        {isStepHold && (selectedUnit?.hold_reason || step.notes) && (
                          <div style={{ fontSize: 10, color: '#fbbf24', marginTop: 4, fontWeight: 700 }}>
                            ⏸ {selectedUnit?.hold_reason || step.notes}
                          </div>
                        )}
                        {isStepCancelled && (selectedUnit?.cancelled_reason || step.notes) && (
                          <div style={{ fontSize: 10, color: '#f87171', marginTop: 4, fontWeight: 700 }}>
                            ✕ {selectedUnit?.cancelled_reason || step.notes}
                          </div>
                        )}
                        {isPausedDueToHold && (
                          <div style={{ fontSize: 9, color: 'var(--text3)', marginTop: 4, fontStyle: 'italic' }}>
                            ⏸ Paused (Held Upstream)
                          </div>
                        )}
                        {step.notes && !isStepHold && !isStepCancelled && <div className="step-note">{step.notes}</div>}

                      </div>
                    </div>
                  );
                })}
                {deptSteps.length === 0 && (
                  <div style={{ padding: 12, color: 'var(--text3)', fontSize: 11, fontStyle: 'italic', textAlign: 'center' }}>
                    No tasks assigned to this department.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>)}

      {isUnitModalOpen && editingUnitStep && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setIsUnitModalOpen(false); }}>
          <div className="modal" style={{ maxWidth: '600px', width: '95%' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">{canEditUnitStep ? 'Edit Unit Step' : 'View Unit Step'}</div>
                <div className="modal-sub">{editingUnitStep.name} ({editingUnitStep.dept}) — Unit: {selectedUnit?.unit_id || selectedUnitId}</div>
              </div>
              <button className="modal-close" onClick={() => setIsUnitModalOpen(false)}>✕</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', padding: '0 24px', marginBottom: '16px' }}>
              {(['details', ...(unitCustomFields.length > 0 ? ['fields'] : []), 'documents']).map(tab => (
                <button
                  key={tab}
                  onClick={() => setUnitModalActiveTab(tab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: unitModalActiveTab === tab ? `2px solid var(--blue)` : '2px solid transparent',
                    color: unitModalActiveTab === tab ? 'var(--blue)' : 'var(--text3)',
                    padding: '10px 16px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: unitModalActiveTab === tab ? '600' : '400',
                    textTransform: 'capitalize',
                    marginBottom: '-1px',
                  }}
                >
                  {tab === 'fields' ? 'Form Fields' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === 'fields' && (
                    <span style={{ marginLeft: 6, background: '#3b82f6', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>
                      {unitCustomFields.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="modal-body">
              {/* Read-Only Banner */}
              {!canEditUnitStep && (
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#60a5fa', fontSize: '12px' }}>
                  <strong>View-Only Mode</strong> — This task is managed by the <strong>{editingUnitStep.dept}</strong> department.
                </div>
              )}

              {/* Upstream Validation Error Banner */}
              {unitStepError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#f87171', fontSize: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '12px', flexShrink: 0, fontWeight: 700 }}>Error:</span>
                  <span style={{ flex: 1 }}>{unitStepError}</span>
                  <button onClick={() => setUnitStepError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px', padding: '0', lineHeight: 1 }}>✕</button>
                </div>
              )}

              {unitModalActiveTab === 'details' && (
                <>
                  {/* Hold Banner inside Modal */}
                  {(editingUnitStep.status === 'hold' || selectedUnit?.hold_status === 'Hold') && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '2px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '14px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ fontWeight: '700', color: '#fbbf24', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>⏸</span> PANEL IS CURRENTLY ON HOLD
                        </div>
                        <span style={{ fontSize: '10px', background: '#f59e0b', color: '#000', fontWeight: '800', padding: '2px 8px', borderRadius: '4px' }}>
                          HOLD ACTIVE
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#fef3c7', marginBottom: '6px' }}>
                        <strong>Reason:</strong> {editingUnitStep.hold_reason || selectedUnit?.hold_reason || 'No reason specified'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(254, 243, 199, 0.7)' }}>
                        Held by: {selectedUnit?.held_by_name || 'User'} {selectedUnit?.held_at ? ` · ${new Date(selectedUnit.held_at).toLocaleString()}` : ''}
                      </div>

                      {canEditUnitStep && (
                        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(245, 158, 11, 0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#fbbf24' }}>Resume Scope:</div>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name="unitResumeScope" 
                                value="selected" 
                                checked={unitActionScope === 'selected'} 
                                onChange={() => setUnitActionScope('selected')} 
                              />
                              Only this Panel ({selectedUnit?.unit_id || 'This Unit'})
                            </label>
                            <label style={{ fontSize: '12px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name="unitResumeScope" 
                                value="order" 
                                checked={unitActionScope === 'order'} 
                                onChange={() => setUnitActionScope('order')} 
                              />
                              All Panels in this Order
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateUnitStep(editingUnitStep.id, { action: 'resume', scope: unitActionScope })}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              fontWeight: '700',
                              fontSize: '12px',
                              cursor: 'pointer',
                              marginTop: '4px',
                              width: 'fit-content',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            ▶ Resume Panel (Return to In Progress)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cancelled Banner inside Modal */}
                  {(editingUnitStep.status === 'cancelled' || selectedUnit?.hold_status === 'Cancelled') && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.15)',
                      border: '2px solid #ef4444',
                      borderRadius: '8px',
                      padding: '14px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontWeight: '700', color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>✕</span> PANEL IS CANCELLED
                      </div>
                      <div style={{ fontSize: '12px', color: '#fee2e2', marginTop: '6px' }}>
                        <strong>Reason:</strong> {selectedUnit?.cancelled_reason || 'No reason specified'}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(254, 226, 226, 0.7)', marginTop: '4px' }}>
                        Cancelled by: {selectedUnit?.cancelled_by_name || 'User'} {selectedUnit?.cancelled_at ? ` · ${new Date(selectedUnit.cancelled_at).toLocaleString()}` : ''}
                      </div>

                      {canEditUnitStep && (
                        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(239,68,68,0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#f87171' }}>Resume Scope:</div>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <label style={{ fontSize: '12px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name="unitCancelResumeScope" 
                                value="selected" 
                                checked={unitActionScope === 'selected'} 
                                onChange={() => setUnitActionScope('selected')} 
                              />
                              Only this Panel ({selectedUnit?.unit_id || 'This Unit'})
                            </label>
                            <label style={{ fontSize: '12px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                              <input 
                                type="radio" 
                                name="unitCancelResumeScope" 
                                value="order" 
                                checked={unitActionScope === 'order'} 
                                onChange={() => setUnitActionScope('order')} 
                              />
                              All Panels in this Order
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleUpdateUnitStep(editingUnitStep.id, { action: 'resume', scope: unitActionScope })}
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 16px',
                              fontWeight: '700',
                              fontSize: '12px',
                              cursor: 'pointer',
                              marginTop: '4px',
                              width: 'fit-content',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            ▶ Resume Panel (Undo Cancellation)
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="modal-field" style={{ marginBottom: '16px' }}>
                    <label>Status</label>
                    {canEditUnitStep ? (
                      <select 
                        className="form-select"
                        value={editingUnitStep.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          const isDesign = (editingUnitStep?.dept || '').toLowerCase() === 'design';
                          const isStandardUnit = (selectedUnit?.classification || unitRefDocs?.classification || '').toLowerCase() === 'standard';
                          const hasMasterDocs = (unitRefDocs?.master_documents?.length || 0) > 0;
                          const exemptFromUpload = isDesign && (isStandardUnit || hasMasterDocs);
                          if (editingUnitStep.requires_upload && newStatus === 'done' && unitDocCount === 0 && !exemptFromUpload) {
                            alert('You must upload at least one document to complete this task.');
                            return;
                          }
                          handleUpdateUnitStep(editingUnitStep.id, { status: newStatus });
                        }}
                        style={{ fontSize: '13px' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="inprogress">In Progress</option>
                        <option value="done">Done</option>
                        <option value="blocked">Blocked</option>
                        <option value="review">Review</option>
                        {editingUnitStep.status === 'hold' && <option value="hold" disabled>Hold</option>}
                        {editingUnitStep.status === 'cancelled' && <option value="cancelled" disabled>Cancelled</option>}
                      </select>
                    ) : (
                      <div style={{ marginTop: '4px' }}>
                        <span className={`step-status-badge ${(STATUS_BADGE_MAP[editingUnitStep.status] || STATUS_BADGE_MAP.pending).cls}`} style={{ fontSize: '12px', padding: '4px 10px', fontWeight: 'bold' }}>
                          {(STATUS_BADGE_MAP[editingUnitStep.status] || STATUS_BADGE_MAP.pending).label}
                        </span>
                      </div>
                    )}
                  </div>

                  {canEditUnitStep && editingUnitStep.status !== 'hold' && selectedUnit?.hold_status !== 'Cancelled' && (
                    <div style={{ marginBottom: '16px', display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUnitHoldBox(prev => !prev);
                          setShowUnitCancelBox(false);
                        }}
                        style={{
                          flex: 1,
                          background: showUnitHoldBox ? '#f59e0b' : 'rgba(245, 158, 11, 0.15)',
                          color: showUnitHoldBox ? '#000' : '#fbbf24',
                          border: '1px solid rgba(245, 158, 11, 0.4)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>⏸</span> {showUnitHoldBox ? 'Dismiss Hold' : 'Put Panel on Hold'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUnitCancelBox(prev => !prev);
                          setShowUnitHoldBox(false);
                        }}
                        style={{
                          flex: 1,
                          background: showUnitCancelBox ? '#ef4444' : 'rgba(239, 68, 68, 0.15)',
                          color: showUnitCancelBox ? '#fff' : '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.4)',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>✕</span> {showUnitCancelBox ? 'Dismiss Cancel' : 'Cancel Panel'}
                      </button>
                    </div>
                  )}

                  {showUnitHoldBox && (
                    <div style={{
                      background: 'rgba(245, 158, 11, 0.10)',
                      border: '1px solid #f59e0b',
                      borderRadius: '8px',
                      padding: '14px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#fbbf24', marginBottom: '8px' }}>
                        ⏸ Put Panel on Hold at Step: {editingUnitStep.name}
                      </div>
                      <textarea
                        className="form-input"
                        rows={2}
                        placeholder="Reason for placing on hold (required)..."
                        value={unitActionReason}
                        onChange={e => setUnitActionReason(e.target.value)}
                        style={{ fontSize: '12px', marginBottom: '10px', resize: 'vertical' }}
                      />
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', fontWeight: '600' }}>Scope:</div>
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <label style={{ fontSize: '12px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="unitHoldScope" 
                              value="selected" 
                              checked={unitActionScope === 'selected'} 
                              onChange={() => setUnitActionScope('selected')} 
                            />
                            Only this Panel ({selectedUnit?.unit_id || 'This Unit'})
                          </label>
                          <label style={{ fontSize: '12px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="unitHoldScope" 
                              value="order" 
                              checked={unitActionScope === 'order'} 
                              onChange={() => setUnitActionScope('order')} 
                            />
                            All Panels in this Order
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!unitActionReason.trim()) {
                            alert('Please enter a reason for placing the panel on hold.');
                            return;
                          }
                          await handleUpdateUnitStep(editingUnitStep.id, { 
                            action: 'hold', 
                            reason: unitActionReason, 
                            scope: unitActionScope 
                          });
                          setShowUnitHoldBox(false);
                          setUnitActionReason('');
                        }}
                        style={{
                          background: '#f59e0b',
                          color: '#000',
                          fontWeight: '700',
                          padding: '7px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Confirm Put on Hold
                      </button>
                    </div>
                  )}

                  {showUnitCancelBox && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.10)',
                      border: '1px solid #ef4444',
                      borderRadius: '8px',
                      padding: '14px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', color: '#f87171', marginBottom: '8px' }}>
                        ✕ Cancel Panel at Step: {editingUnitStep.name}
                      </div>
                      <textarea
                        className="form-input"
                        rows={2}
                        placeholder="Reason for cancellation (required)..."
                        value={unitActionReason}
                        onChange={e => setUnitActionReason(e.target.value)}
                        style={{ fontSize: '12px', marginBottom: '10px', resize: 'vertical' }}
                      />
                      <div style={{ marginBottom: '10px' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '4px', fontWeight: '600' }}>Scope:</div>
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <label style={{ fontSize: '12px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="unitCancelScope" 
                              value="selected" 
                              checked={unitActionScope === 'selected'} 
                              onChange={() => setUnitActionScope('selected')} 
                            />
                            Only this Panel ({selectedUnit?.unit_id || 'This Unit'})
                          </label>
                          <label style={{ fontSize: '12px', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="unitCancelScope" 
                              value="order" 
                              checked={unitActionScope === 'order'} 
                              onChange={() => setUnitActionScope('order')} 
                            />
                            All Panels in this Order
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!unitActionReason.trim()) {
                            alert('Please enter a reason for cancelling this panel.');
                            return;
                          }
                          if (!confirm('Are you sure you want to cancel this panel? This will halt operations on this panel.')) return;
                          await handleUpdateUnitStep(editingUnitStep.id, { 
                            action: 'cancel', 
                            reason: unitActionReason, 
                            scope: unitActionScope 
                          });
                          setShowUnitCancelBox(false);
                          setUnitActionReason('');
                        }}
                        style={{
                          background: '#ef4444',
                          color: '#fff',
                          fontWeight: '700',
                          padding: '7px 16px',
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  )}

                  <div className="modal-field" style={{ marginBottom: '16px' }}>
                    <label>Assign Worker</label>
                    {canEditUnitStep ? (
                      <select 
                        className="form-select"
                        value={editingUnitStep.assigned_user_id || ''}
                        onChange={(e) => handleUpdateUnitStep(editingUnitStep.id, { assigned_user_id: e.target.value ? parseInt(e.target.value) : null })}
                        style={{ fontSize: '13px' }}
                      >
                        <option value="">Unassigned</option>
                        {users.filter(u => u.role === editingUnitStep.dept).map(u => (
                          <option key={u.id} value={u.id}>{u.username}</option>
                        ))}
                      </select>
                    ) : (
                      <div style={{ fontSize: '13px', color: 'var(--text)', background: 'var(--bg3)', padding: '8px 12px', borderRadius: '6px' }}>
                        {(() => {
                          const worker = users.find(u => u.id === editingUnitStep.assigned_user_id);
                          return worker ? worker.username : 'Unassigned';
                        })()}
                      </div>
                    )}
                  </div>

                  <div className="modal-field" style={{ marginBottom: '16px' }}>
                    <label>Notes</label>
                    {canEditUnitStep ? (
                      <textarea 
                        className="form-input"
                        defaultValue={editingUnitStep.notes || ''}
                        onBlur={(e) => handleUpdateUnitStep(editingUnitStep.id, { notes: e.target.value })}
                        placeholder="Add step notes..."
                        style={{ fontSize: '13px', height: '60px', resize: 'vertical' }}
                      />
                    ) : (
                      <div style={{ fontSize: '13px', color: 'var(--text2)', fontStyle: 'italic', background: 'var(--bg3)', padding: '10px 12px', borderRadius: '6px', minHeight: '40px', whiteSpace: 'pre-wrap' }}>
                        {editingUnitStep.notes || 'No notes added.'}
                      </div>
                    )}
                  </div>
                </>
              )}

              {unitModalActiveTab === 'fields' && unitCustomFields.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {unitCustomFields.map((field, fIdx) => {
                    const handleFieldChange = (val) => {
                      const updatedCF = [...unitCustomFields];
                      updatedCF[fIdx].value = val;
                      handleUpdateUnitStep(editingUnitStep.id, { custom_fields: updatedCF });
                    };

                    return (
                      <div key={field.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px' }}>
                        <div style={{ marginBottom: '8px' }}>
                          <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: '600' }}>{field.label}</span>
                          <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', background: 'var(--bg4)', padding: '1px 5px', borderRadius: '3px' }}>{field.type}</span>
                        </div>
                        {!canEditUnitStep ? (
                          <div style={{ fontSize: '12px', color: '#ddd', fontWeight: '500', marginTop: '2px' }}>
                            {field.type === 'Yes/No' ? (field.value === 'Yes' || field.value === true ? 'Yes' : 'No') : (field.value || '—')}
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

              {unitModalActiveTab === 'documents' && (() => {
                const deptLower = (editingUnitStep?.dept || '').toLowerCase();
                const isDesign = deptLower === 'design';
                const relevantMasterDocs = isDesign ? (unitRefDocs?.master_documents || []) : [];
                const relevantOrderDocs = isDesign ? (unitRefDocs?.order_documents || []) : [];
                const hasInherited = relevantMasterDocs.length > 0 || relevantOrderDocs.length > 0;

                return (
                  <div>
                    {/* Department-Specific Inherited Reference Documents */}
                    {hasInherited && (
                      <div style={{
                        marginBottom: 18,
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: 10,
                        padding: '14px 16px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Layers size={16} color="var(--blue)" />
                            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                              Inherited Documents ({editingUnitStep.dept})
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {unitRefDocs?.part_number && (
                              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#60a5fa', background: 'rgba(59,130,246,0.15)', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(59,130,246,0.3)' }}>
                                Part: {unitRefDocs.part_number}
                              </span>
                            )}
                            <span style={{
                              fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
                              padding: '2px 8px', borderRadius: 4,
                              background: (unitRefDocs?.classification || '').toLowerCase() === 'standard' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                              color: (unitRefDocs?.classification || '').toLowerCase() === 'standard' ? '#10b981' : '#fbbf24',
                              border: `1px solid ${(unitRefDocs?.classification || '').toLowerCase() === 'standard' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`
                            }}>
                              {unitRefDocs?.classification || 'Standard'}
                            </span>
                          </div>
                        </div>

                        {relevantMasterDocs.length > 0 && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {relevantMasterDocs.map(mdoc => {
                              const isDrawing = (mdoc.doc_type || '').toLowerCase() === 'drawing';
                              const badgeColor = isDrawing ? '#60a5fa' : '#34d399';
                              const badgeBg = isDrawing ? 'rgba(59,130,246,0.15)' : 'rgba(16,185,129,0.15)';
                              const badgeBorder = isDrawing ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.3)';
                              const docDownloadUrl = `${window.API_BASE}/uploads/${mdoc.file_path.split(/[\/\\]/).pop()}?token=${token}`;
                              
                              return (
                                <div key={`mdoc-${mdoc.id}`} style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '10px 12px', background: 'var(--bg4)',
                                  border: '1px solid var(--border2)', borderRadius: 8, gap: 12
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                                    <FileText size={18} color={badgeColor} style={{ flexShrink: 0 }} />
                                    <div style={{ minWidth: 0 }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                        <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 4, background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}` }}>
                                          Master {mdoc.doc_type}
                                        </span>
                                        {mdoc.revision_label && (
                                          <span style={{ fontSize: 10, fontWeight: 800, padding: '1px 5px', borderRadius: 3, background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
                                            {mdoc.revision_label}
                                          </span>
                                        )}
                                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={mdoc.file_name}>
                                          {mdoc.file_name}
                                        </span>
                                      </div>
                                      <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                                        {mdoc.file_size ? `${(mdoc.file_size / 1024).toFixed(1)} KB` : ''} 
                                        {mdoc.uploaded_by_name ? ` · Uploaded by ${mdoc.uploaded_by_name}` : ''}
                                      </div>
                                    </div>
                                  </div>
                                  <a
                                    href={docDownloadUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="vbtn"
                                    style={{
                                      fontSize: 11, padding: '4px 10px', display: 'flex', alignItems: 'center', gap: 5,
                                      textDecoration: 'none', background: 'rgba(59,130,246,0.12)', color: '#60a5fa',
                                      border: '1px solid rgba(59,130,246,0.3)', borderRadius: 5, flexShrink: 0
                                    }}
                                  >
                                    <ExternalLink size={12} />
                                    <span>View</span>
                                  </a>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Order-level Documents if relevant for this department */}
                        {relevantOrderDocs.length > 0 && (
                          <div style={{ marginTop: relevantMasterDocs.length > 0 ? 12 : 0, paddingTop: relevantMasterDocs.length > 0 ? 10 : 0, borderTop: relevantMasterDocs.length > 0 ? '1px solid var(--border)' : 'none' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>
                              Order Attachments ({relevantOrderDocs.length})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                              {relevantOrderDocs.map(odoc => (
                                <div key={`odoc-${odoc.id}`} style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                  padding: '6px 10px', background: 'var(--bg4)', borderRadius: 6, fontSize: 12
                                }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                                    <span style={{ fontSize: 10, padding: '1px 5px', borderRadius: 3, background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}>
                                      {odoc.doc_type}
                                    </span>
                                    <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={odoc.file_name}>
                                      {odoc.file_name}
                                    </span>
                                  </div>
                                  <a
                                    href={`${window.API_BASE}/uploads/${odoc.file_path.split(/[\/\\]/).pop()}?token=${token}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ fontSize: 11, color: '#60a5fa', textDecoration: 'none', marginLeft: 8 }}
                                  >
                                    View
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Upload Required Banner */}
                    {editingUnitStep.requires_upload && (
                      (() => {
                        const isStd = (selectedUnit?.classification || unitRefDocs?.classification || '').toLowerCase() === 'standard';
                        const hasMaster = relevantMasterDocs.length > 0;
                        if (isDesign && (isStd || hasMaster)) {
                          return (
                            <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10b981', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                              <CheckCircle2 size={16} />
                              <span>Standard Panel: Required master documents are inherited. Additional task uploads below are optional.</span>
                            </div>
                          );
                        }
                        return (
                          <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#fbbf24', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <AlertCircle size={16} />
                            <span>This task requires at least one document to be marked as Done.</span>
                          </div>
                        );
                      })()
                    )}

                    {hasInherited && (
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)', marginBottom: 6 }}>
                        Step-Specific Uploads & Notes:
                      </div>
                    )}
                    <DocumentManager
                      entityType="UnitStep"
                      entityId={editingUnitStep.id}
                      initialDocs={[]}
                      onDocsUpdate={(docs) => setUnitDocCount(docs.length)}
                      readOnly={!canEditUnitStep}
                      defaultDocType={editingUnitStep.default_doc_type || 'General'}
                      userRole={userRole}
                    />
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .flow-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 24px;
          align-items: start;
          padding-bottom: 40px;
        }
        .dept-flow-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-top: 2px solid var(--border2);
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease, border-color 0.3s ease;
        }
        .dept-flow-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.15);
          border-color: var(--border2);
        }
        .dept-flow-card.has-blocked {
          border-color: var(--red);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.12);
          background: linear-gradient(180deg, var(--red-dim) 0%, var(--bg2) 100%);
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
        .dept-card-sub {
          font-size: 11px;
          color: var(--text3);
          margin-top: 2px;
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
          font-family: 'JetBrains Mono', 'Fira Code', monospace;
          font-weight: 600;
          font-size: 13px;
          color: var(--text2);
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
          border: 1px solid rgba(167, 139, 250, 0.25);
          font-weight: 500;
        }
        .delivery-badge .icon {
          font-size: 10px;
        }
        .dept-card-tasks-vertical {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        /* Override standard .step to look better in vertical list */
        .dept-card-tasks-vertical .step {
          width: 100%;
          min-width: 0;
          max-width: none;
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 8px;
          transition: all 0.2s;
        }
        .dept-card-tasks-vertical .step:hover {
          background: var(--bg4);
          border-color: var(--border2);
          transform: translateX(4px);
        }
        .pulse-sales {
          animation: sales-glow 2s infinite ease-in-out;
          border: 1px solid rgba(20, 184, 166, 0.4) !important;
        }
        @keyframes sales-glow {
          0% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
          50% { box-shadow: 0 0 15px 0 rgba(20, 184, 166, 0.4); }
          100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.2); }
        }
      `}} />
    </div>
  );
}
