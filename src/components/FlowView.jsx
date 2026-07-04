import { useState, useEffect, useRef } from 'react';
import { DEPTS, STATUS_BADGE_MAP } from '../data/planningData';
import DocumentManager from './DocumentManager';


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
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canEditUnitStep = editingUnitStep ? (['Admin', 'Manager'].includes(userRole) || editingUnitStep.dept === userRole || editingUnitStep.assigned_user_id === currentUser.id) : false;
  const [unitModalActiveTab, setUnitModalActiveTab] = useState('details');
  const [unitDocCount, setUnitDocCount] = useState(0);

  const unitCustomFields = (() => {
    if (!editingUnitStep) return [];
    try {
      return Array.isArray(editingUnitStep.custom_fields) ? editingUnitStep.custom_fields : JSON.parse(editingUnitStep.custom_fields || '[]');
    } catch {
      return [];
    }
  })();


  useEffect(() => {
    fetch('http://localhost:5000/api/users', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(async res => {
      if (res.ok) setUsers(await res.json());
    })
    .catch(console.error);
  }, [token]);

  const handleUpdateUnitStep = async (stepId, body) => {
    if (!canEditUnitStep) return;
    const stepObj = unitSteps.find(s => s.id === stepId);
    const unitId = stepObj ? stepObj.order_unit_id : selectedUnitId;
    if (!unitId) return;

    try {
      const res = await fetch(`http://localhost:5000/api/units/${unitId}/steps/${stepId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const freshSteps = await fetch(`http://localhost:5000/api/units/${unitId}/steps`, {
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


  const handleStepClick = (step) => {
    setUnitStepError(null); // clear errors when opening a new step
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

  const renderUnitSelector = () => {
    const units = selectedOrder?.units || [];
    return (
      <div className="unit-selector-container" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
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
    );
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/task_masters', {
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
      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrderId}/steps`, {
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
      const res = await fetch(`http://localhost:5000/api/orders/${selectedOrderId}/steps/reorder`, {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {renderUnitSelector()}
      
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
                          className={`step status-${step.status}${!canEditStep ? ' read-only' : ''}${step.dept === 'Sales' && step.status === 'pending' ? ' pulse-sales' : ''}${draggedStep?.id === step.id ? ' dragging' : ''}`}
                          onClick={() => handleStepClick(step)}
                          style={{ cursor: canDrag ? 'grab' : 'pointer' }}
                        >
                          <span className={`step-dot dot-${step.status}`} />
                          <div className="step-num">{dept.id.toUpperCase().slice(0, 3)}-{String(i + 1).padStart(2, '0')}</div>
                          <div className="step-name">
                            {step.name} 
                            {step.requires_upload && <span title="Requires Upload" style={{ marginLeft: 4 }}>📎</span>}
                          </div>
                          <div className="step-sub">{step.sub}</div>
                          <StatusBadge status={step.status} />
                          {step.notes && <div className="step-note">{step.notes}</div>}
                          {step.special === 'sales' && userRole === 'Sales' && (
                            <button 
                              className="vbtn"
                              style={{ marginTop: 8, fontSize: 10, width: '100%', background: 'rgba(20, 184, 166, 0.2)', color: 'var(--teal)', border: '1px solid rgba(20, 184, 166, 0.4)' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSetView('new-order');
                              }}
                            >
                              Go to Order Creation
                            </button>
                          )}
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
                        <span className="icon">🚚</span> {new Date(selectedOrder.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                        className={`step status-${step.status}${!canEditStep ? ' read-only' : ''}${step.dept === 'Sales' && step.status === 'pending' ? ' pulse-sales' : ''}${draggedStep?.id === step.id ? ' dragging' : ''}`}
                        onClick={() => handleStepClick(step)}
                        style={{ cursor: canDrag ? 'grab' : 'pointer' }}
                      >
                        <span className={`step-dot dot-${step.status}`} />
                        <div className="step-num">{dept.id.toUpperCase().slice(0, 3)}-{String(i + 1).padStart(2, '0')}</div>
                        <div className="step-name">
                          {step.name} 
                          {step.requires_upload && <span title="Requires Upload" style={{ marginLeft: 4 }}>📎</span>}
                        </div>
                        <div className="step-sub">{step.sub}</div>
                        <StatusBadge status={step.status} />
                        {step.notes && <div className="step-note">{step.notes}</div>}
                        {step.special === 'sales' && userRole === 'Sales' && (
                          <button 
                            className="vbtn"
                            style={{ marginTop: 8, fontSize: 10, width: '100%', background: 'rgba(20, 184, 166, 0.2)', color: 'var(--teal)', border: '1px solid rgba(20, 184, 166, 0.4)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onSetView('new-order');
                            }}
                          >
                            Go to Order Creation
                          </button>
                        )}
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
                <div className="modal-sub">{editingUnitStep.name} ({editingUnitStep.dept})</div>
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
                  ℹ️ <strong>View-Only Mode</strong> — This task is managed by the <strong>{editingUnitStep.dept}</strong> department.
                </div>
              )}

              {/* Upstream Validation Error Banner */}
              {unitStepError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#f87171', fontSize: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '14px', flexShrink: 0 }}>⛔</span>
                  <span style={{ flex: 1 }}>{unitStepError}</span>
                  <button onClick={() => setUnitStepError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '14px', padding: '0', lineHeight: 1 }}>✕</button>
                </div>
              )}

              {unitModalActiveTab === 'details' && (
                <>
                  <div className="modal-field" style={{ marginBottom: '16px' }}>
                    <label>Status</label>
                    {canEditUnitStep ? (
                      <select 
                        className="form-select"
                        value={editingUnitStep.status}
                        onChange={(e) => {
                          const newStatus = e.target.value;
                          if (editingUnitStep.requires_upload && newStatus === 'done' && unitDocCount === 0) {
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
                      </select>
                    ) : (
                      <div style={{ marginTop: '4px' }}>
                        <span className={`step-status-badge ${(STATUS_BADGE_MAP[editingUnitStep.status] || STATUS_BADGE_MAP.pending).cls}`} style={{ fontSize: '12px', padding: '4px 10px', fontWeight: 'bold' }}>
                          {(STATUS_BADGE_MAP[editingUnitStep.status] || STATUS_BADGE_MAP.pending).label}
                        </span>
                      </div>
                    )}
                  </div>

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

              {unitModalActiveTab === 'documents' && (
                <div>
                  {editingUnitStep.requires_upload && (
                    <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#fbbf24', fontSize: 13 }}>
                      ⚠️ This task requires at least one document to be marked as Done.
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
              )}
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
