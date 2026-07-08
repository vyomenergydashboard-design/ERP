import { useState, useEffect } from 'react';
import DocumentManager from './DocumentManager';
import { STATUS_BADGE_MAP } from '../data/planningData';

export default function StepModal({ step, isOpen, onClose, onSave, onDelete, userRole, selectedOrder }) {
  const [status, setStatus] = useState('pending');
  const [notes, setNotes] = useState('');
  const [qcFailTarget, setQcFailTarget] = useState(null);
  const [dispatchDate, setDispatchDate] = useState('');
  const [checklist, setChecklist] = useState({ layout: false, electrical: false, bom: false });
  const [docCount, setDocCount] = useState(0);
  const [customFields, setCustomFields] = useState([]);
  const [activeTab, setActiveTab] = useState('details');
  const [saveError, setSaveError] = useState(null);

  const canEditStructure = ['Admin', 'Manager'].includes(userRole);
  const canEditStep = step ? (['Admin', 'Manager'].includes(userRole) || step.dept === userRole) : false;

  useEffect(() => {
    if (step) {
      setStatus(step.status);
      setNotes(step.notes || '');
      setDispatchDate(step.dispatch_date || '');
      setQcFailTarget(null);
      setChecklist({ layout: false, electrical: false, bom: false });
      setDocCount(0);
      setActiveTab('details');
      setSaveError(null);
      try {
        const cf = Array.isArray(step.custom_fields) ? step.custom_fields : JSON.parse(step.custom_fields || '[]');
        setCustomFields(Array.isArray(cf) ? cf : []);
      } catch {
        setCustomFields([]);
      }
    }
  }, [step]);

  if (!isOpen || !step) return null;

  const handleSave = async () => {
    if (!canEditStep) return;
    if (step.requires_upload && status === 'done' && docCount === 0) {
      alert('You must upload at least one document to complete this task.');
      return;
    }
    setSaveError(null);
    const err = await onSave({ status, notes, qcFailTarget, dispatchDate, checklist, custom_fields: customFields });
    if (err) setSaveError(err);
  };

  const updateFieldValue = (idx, value) => {
    setCustomFields(prev => prev.map((f, i) => i === idx ? { ...f, value } : f));
  };

  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay open') onClose();
  };

  const renderFieldInput = (field, idx) => {
    switch (field.type) {
      case 'Text':
        return (
          <input
            type="text"
            className="form-input"
            value={field.value || ''}
            onChange={e => updateFieldValue(idx, e.target.value)}
            placeholder={`Enter ${field.label}...`}
            disabled={!canEditStep}
          />
        );
      case 'Number':
        return (
          <input
            type="number"
            className="form-input"
            value={field.value || ''}
            onChange={e => updateFieldValue(idx, e.target.value)}
            disabled={!canEditStep}
          />
        );
      case 'Date':
        return (
          <input
            type="date"
            className="form-input"
            value={field.value || ''}
            onChange={e => updateFieldValue(idx, e.target.value)}
            disabled={!canEditStep}
          />
        );
      case 'Yes/No':
        return (
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            {['Yes', 'No'].map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => canEditStep && updateFieldValue(idx, opt)}
                style={{
                  padding: '6px 20px',
                  borderRadius: '6px',
                  border: '1px solid',
                  cursor: canEditStep ? 'pointer' : 'default',
                  fontSize: '13px',
                  fontWeight: '600',
                  background: field.value === opt
                    ? (opt === 'Yes' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)')
                    : 'transparent',
                  borderColor: field.value === opt
                    ? (opt === 'Yes' ? '#10b981' : '#ef4444')
                    : '#444',
                  color: field.value === opt
                    ? (opt === 'Yes' ? '#10b981' : '#ef4444')
                    : '#888',
                  opacity: !canEditStep && field.value !== opt ? 0.4 : 1
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        );
      case 'Dropdown':
        return (
          <select
            className="form-select"
            value={field.value || ''}
            onChange={e => updateFieldValue(idx, e.target.value)}
            disabled={!canEditStep}
          >
            <option value="">-- Select --</option>
            {(field.options || []).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      default:
        return <input type="text" className="form-input" value={field.value || ''} onChange={e => updateFieldValue(idx, e.target.value)} placeholder={`Enter ${field.label}...`} disabled={!canEditStep} />;
    }
  };

  return (
    <div className="modal-overlay open" onClick={handleOverlayClick}>
      <div className="modal" style={{ maxWidth: '600px', width: '95%' }}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{step.name}</div>
            <div className="modal-sub">{step.dept} — {step.sub}</div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs — only show Form Fields tab if there are fields */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', padding: '0 24px' }}>
          {(['details', ...(customFields.length > 0 ? ['fields'] : []), 'documents']).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid var(--blue)` : '2px solid transparent',
                color: activeTab === tab ? 'var(--blue)' : 'var(--text3)',
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: activeTab === tab ? '600' : '400',
                textTransform: 'capitalize',
                marginBottom: '-1px',
              }}
            >
              {tab === 'fields' ? 'Form Fields' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'fields' && (
                <span style={{ marginLeft: 6, background: '#3b82f6', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '10px' }}>
                  {customFields.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="modal-body">

          {/* ── TAB: DETAILS ── */}
          {activeTab === 'details' && (
            <>
              {/* Read-Only Banner */}
              {!canEditStep && (
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#60a5fa', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '15px' }}>ℹ️</span>
                  <span><strong>View-Only Mode</strong> — This task is managed by the <strong>{step.dept}</strong> department.</span>
                </div>
              )}

              {/* Upstream Validation Error */}
              {saveError && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '16px', color: '#f87171', fontSize: '13px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '15px', flexShrink: 0 }}>⛔</span>
                  <span style={{ flex: 1 }}>{saveError}</span>
                  <button onClick={() => setSaveError(null)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '16px', padding: '0', lineHeight: 1 }}>✕</button>
                </div>
              )}

              {/* Order Reference Fields */}
              {selectedOrder && step.order_fields && step.order_fields.length > 0 && (
                <div style={{ marginBottom: '16px', padding: '12px 16px', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#3b82f6', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Order Reference</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '8px' }}>
                    {step.order_fields.map(key => {
                      const labelMap = { order_number: 'Order #', company_name: 'Company', delivery_date: 'Delivery Date', po_number: 'PO Number', packaging_type: 'Packaging', priority: 'Priority', notes: 'Order Notes' };
                      let val = selectedOrder[key];
                      if (key === 'delivery_date' && val) val = new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
                      return (
                        <div key={key} style={{ background: 'var(--bg3)', borderRadius: '6px', padding: '8px 10px' }}>
                          <div style={{ fontSize: '10px', color: 'var(--text3)', marginBottom: '3px' }}>{labelMap[key] || key}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500' }}>{val || '—'}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}



              <div className="modal-field">
                <label>Status</label>
                {canEditStep ? (
                  <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="inprogress">In Progress</option>
                    <option value="review">Under Review</option>
                    <option value="done">Done</option>
                    <option value="blocked">Blocked</option>
                  </select>
                ) : (
                  <div style={{ marginTop: '4px' }}>
                    <span className={`step-status-badge ${(STATUS_BADGE_MAP[status] || STATUS_BADGE_MAP.pending).cls}`} style={{ fontSize: '12px', padding: '4px 10px', fontWeight: 'bold' }}>
                      {(STATUS_BADGE_MAP[status] || STATUS_BADGE_MAP.pending).label}
                    </span>
                  </div>
                )}
              </div>

              {step.special === 'qc' && (
                <div id="qcFailArea">
                  <label style={{ fontSize: 10, color: 'var(--text3)', display: 'block', marginBottom: 6 }}>If QC Fail — return to:</label>
                  {canEditStep ? (
                    <div className="qc-options">
                      <div 
                        className={`qc-opt${qcFailTarget === 'production' ? ' selected' : ''}`} 
                        onClick={() => canEditStep && setQcFailTarget('production')}
                        style={{ cursor: canEditStep ? 'pointer' : 'default' }}
                      >
                        ↩ Production<br /><span style={{ fontSize: 9, opacity: 0.7 }}>Rework</span>
                      </div>
                      <div 
                        className={`qc-opt${qcFailTarget === 'design' ? ' selected' : ''}`} 
                        onClick={() => canEditStep && setQcFailTarget('design')}
                        style={{ cursor: canEditStep ? 'pointer' : 'default' }}
                      >
                        ↩ Design<br /><span style={{ fontSize: 9, opacity: 0.7 }}>Re-check</span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--text)', background: 'var(--bg3)', padding: '8px 12px', borderRadius: '6px' }}>
                      {qcFailTarget ? `↩ Returned to ${qcFailTarget.charAt(0).toUpperCase() + qcFailTarget.slice(1)}` : 'No fail action selected'}
                    </div>
                  )}
                </div>
              )}

              {step.special === 'design' && (
                <div className="design-checklist">
                  <div className="design-checklist-title">Simultaneous Release Checklist</div>
                  {canEditStep ? (
                    <>
                      <label><input type="checkbox" checked={checklist.layout} onChange={(e) => setChecklist({ ...checklist, layout: e.target.checked })} /> Panel Layout (for Fitter)</label>
                      <label><input type="checkbox" checked={checklist.electrical} onChange={(e) => setChecklist({ ...checklist, electrical: e.target.checked })} /> Electrical Design (for Wireman)</label>
                      <label><input type="checkbox" checked={checklist.bom} onChange={(e) => setChecklist({ ...checklist, bom: e.target.checked })} /> BOM Released to Purchase &amp; Stores</label>
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                      <div>{checklist.layout ? '✅' : '❌'} Panel Layout (for Fitter)</div>
                      <div>{checklist.electrical ? '✅' : '❌'} Panel Design (for Wireman)</div>
                      <div>{checklist.bom ? '✅' : '❌'} BOM Released to Purchase &amp; Stores</div>
                    </div>
                  )}
                </div>
              )}

              {step.special === 'dispatch' && (
                <div className="modal-field">
                  <label>Confirmed Dispatch Date</label>
                  {canEditStep ? (
                    <input type="date" className="form-input" value={dispatchDate} onChange={(e) => setDispatchDate(e.target.value)} />
                  ) : (
                    <div style={{ fontSize: '14px', color: 'var(--text)', background: 'var(--bg3)', padding: '8px 12px', borderRadius: '6px' }}>
                      {dispatchDate ? new Date(dispatchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Not set'}
                    </div>
                  )}
                </div>
              )}

              <div className="modal-field">
                <label>Notes / Remarks</label>
                {canEditStep ? (
                  <textarea className="form-textarea" placeholder="Add notes…" value={notes} onChange={(e) => setNotes(e.target.value)} />
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text2)', fontStyle: 'italic', background: 'var(--bg3)', padding: '10px 14px', borderRadius: '6px', border: '1px solid var(--border)', minHeight: '40px', whiteSpace: 'pre-wrap' }}>
                    {notes || 'No notes or remarks added.'}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── TAB: FORM FIELDS ── */}
          {activeTab === 'fields' && customFields.length > 0 && (
            <div>
              <div style={{ color: 'var(--text3)', fontSize: '12px', marginBottom: '16px' }}>
                {!canEditStep ? 'Information filled in for this task.' : 'Fill in the required information for this task.'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {customFields.map((field, idx) => (
                  <div key={idx} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px 16px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: '600' }}>{field.label}</span>
                      <span style={{ marginLeft: '8px', fontSize: '10px', color: 'var(--text3)', textTransform: 'uppercase', background: 'var(--bg4)', padding: '1px 5px', borderRadius: '3px' }}>{field.type}</span>
                    </div>
                    {!canEditStep ? (
                      <div style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500', marginTop: '4px' }}>
                        {field.type === 'Yes/No' ? (field.value === 'Yes' || field.value === true ? '✅ Yes' : '❌ No') : (field.value || '—')}
                      </div>
                    ) : (
                      renderFieldInput(field, idx)
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB: DOCUMENTS ── */}
          {activeTab === 'documents' && (
            <div>
              {step.requires_upload && (
                <div style={{ marginBottom: 16, padding: '10px 14px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 8, color: '#fbbf24', fontSize: 13 }}>
                  ⚠️ This task requires at least one document to be marked as Done.
                </div>
              )}
              <DocumentManager
                entityType="Step"
                entityId={step.id}
                initialDocs={[]}
                onDocsUpdate={(docs) => setDocCount(docs.length)}
                readOnly={!canEditStep}
                defaultDocType={step.default_doc_type || 'General'}
                userRole={userRole}
              />
            </div>
          )}

          {/* Actions */}
          <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
            {canEditStructure && canEditStep ? (
              <button
                className="vbtn"
                style={{ background: 'transparent', border: '1px solid #ef444444', color: '#ef4444' }}
                onClick={() => onDelete(step.id)}
              >
                Delete Task
              </button>
            ) : <div />}
            <div style={{ display: 'flex', gap: '12px' }}>
              {canEditStep ? (
                <>
                  <button className="btn-cancel" onClick={onClose}>Cancel</button>
                  <button className="btn-save" onClick={handleSave}>Update Status</button>
                </>
              ) : (
                <button className="btn-cancel" onClick={onClose} style={{ minWidth: '100px' }}>Close</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .sales-action-box {
          background: rgba(20, 184, 166, 0.1);
          border: 1px solid rgba(20, 184, 166, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .action-label { color: var(--teal); font-size: 11px; font-weight: 700; margin-bottom: 4px; text-transform: uppercase; }
        .action-text { color: var(--text2); font-size: 13px; margin-bottom: 12px; line-height: 1.4; }
        .action-btn {
          background: var(--teal);
          color: #000;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
        }
        .action-btn:hover { opacity: 0.9; }
      `}} />
    </div>
  );
}
