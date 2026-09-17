import { useState } from 'react';
import { DEPTS } from '../data/planningData';
import { Clock, ChevronLeft } from 'lucide-react';
import EditRefTagModal from './EditRefTagModal.jsx';

function relativeTime(isoString) {
  if (!isoString) return null;
  const diff = Date.now() - new Date(isoString).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function RightPanel({ selectedStep, activityLog, selectedOrder, isOpen = true, onToggle }) {
  const dept = selectedStep ? DEPTS.find((d) => d.id === selectedStep.dept) : null;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');
  const canEditClassification = ['Admin', 'Manager', 'Design', 'Sales'].includes(user.role);
  const canEditRefTag = ['Admin', 'Manager', 'Sales'].includes(user.role);
  const [showEditRefTagModal, setShowEditRefTagModal] = useState(false);

  const handleClassificationChange = async (newVal) => {
    if (!selectedOrder?.id) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/orders/${selectedOrder.id}/classification`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ classification: newVal })
      });
      if (res.ok) {
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrder.id } }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`right-panel${isOpen ? '' : ' right-panel--collapsed'}`}>

      {/* ── Floating toggle pill — always sits on the left border edge ── */}
      <button
        className="rp-toggle"
        onClick={onToggle}
        title={isOpen ? 'Collapse panel' : 'Expand panel'}
        aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
      >
        <ChevronLeft
          size={15}
          style={{
            transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(180deg)',
          }}
        />
      </button>

      {/* ── Inner clip container ── */}
      <div className="rp-inner">
        {/* ── Panel content (hidden when collapsed) ── */}
        <div className="rp-content">

          {/* ── Selected Step ── */}
          <div className="panel-section">
            <div className="panel-sec-title">Selected Step</div>
            {selectedStep ? (
              <div className="detail-card">
                <h4 style={{ marginBottom: 8, color: dept?.color || 'var(--text)' }}>{selectedStep.name}</h4>
                <div className="detail-row">
                  <span className="detail-key">Department</span>
                  <span className="detail-val" style={{ color: dept?.color || 'inherit' }}>{selectedStep.dept}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Status</span>
                  <span className={`step-status-badge badge-${selectedStep.status}`} style={{ marginTop: 0 }}>
                    {selectedStep.status.toUpperCase()}
                  </span>
                </div>
                {selectedStep.notes && (
                  <div className="detail-row">
                    <span className="detail-key">Notes</span>
                    <span className="detail-val" style={{ color: 'var(--text2)', maxWidth: 130, textAlign: 'right', wordBreak: 'break-word' }}>{selectedStep.notes}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-detail">Click any step to see details.</div>
            )}
          </div>

          {/* ── Order Overview ── */}
          {selectedOrder ? (
            <div className="panel-section">
              <div className="panel-sec-title">Order Overview</div>
              <div className="detail-card">
                <h4 style={{ marginBottom: 4, fontFamily: 'var(--font-mono)', fontSize: 13 }}>{selectedOrder.order_number}</h4>
                {selectedOrder.company_name && (
                  <div style={{ color: 'var(--text2)', fontSize: 11, marginBottom: 12 }}>
                    {selectedOrder.company_name}
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-key">Priority</span>
                  <span className={`priority-badge ${selectedOrder.priority?.toLowerCase() || 'medium'}`} style={{ fontSize: 10 }}>
                    {selectedOrder.priority || 'Medium'}
                  </span>
                </div>
                {selectedOrder.po_number && (
                  <div className="detail-row">
                    <span className="detail-key">PO Number</span>
                    <span className="detail-val">{selectedOrder.po_number}</span>
                  </div>
                )}
                <div className="detail-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="detail-key">Ref / Tag</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="detail-val" style={{ color: '#f59e0b', fontWeight: 600 }}>
                      {(selectedOrder.reference_number && (selectedStep?.tag || selectedOrder.line_items?.[0]?.tag))
                        ? `${selectedOrder.reference_number}/${selectedStep?.tag || selectedOrder.line_items?.[0]?.tag}`
                        : (selectedOrder.reference_number || selectedStep?.tag || selectedOrder.line_items?.[0]?.tag || '—')}
                    </span>
                    {canEditRefTag && (
                      <button
                        type="button"
                        onClick={() => setShowEditRefTagModal(true)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px', padding: 0 }}
                        title="Edit Reference & Tag (Serial numbers unchanged)"
                      >
                        ✏️
                      </button>
                    )}
                  </div>
                </div>
                {selectedOrder.line_items?.[0]?.panel_type_size && (
                  <div className="detail-row">
                    <span className="detail-key">Panel Size</span>
                    <span className="detail-val" style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                      {selectedOrder.line_items[0].panel_type_size}
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-key">Classification</span>
                  {canEditClassification ? (
                    <select
                      className="form-select"
                      value={selectedOrder.classification || 'Standard'}
                      onChange={(e) => handleClassificationChange(e.target.value)}
                      style={{
                        fontSize: '11px', padding: '2px 6px', borderRadius: '4px',
                        background: (selectedOrder.classification || 'Standard') === 'Standard' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                        color: (selectedOrder.classification || 'Standard') === 'Standard' ? '#60a5fa' : '#fbbf24',
                        border: `1px solid ${(selectedOrder.classification || 'Standard') === 'Standard' ? 'rgba(59,130,246,0.4)' : 'rgba(245,158,11,0.4)'}`,
                        fontWeight: 'bold', cursor: 'pointer'
                      }}
                    >
                      <option value="Standard">Standard</option>
                      <option value="Non-Standard">Non-Standard</option>
                    </select>
                  ) : (
                    <span className="detail-val" style={{ fontWeight: '600', color: selectedOrder.classification === 'Non-Standard' ? '#fbbf24' : '#60a5fa' }}>
                      {selectedOrder.classification || 'Standard'}
                    </span>
                  )}
                </div>
                <div className="detail-row">
                  <span className="detail-key">Order Date</span>
                  <span className="detail-val">
                    {selectedOrder.order_date ? new Date(selectedOrder.order_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-key">Delivery</span>
                  <span className="detail-val" style={{ color: 'var(--accent)' }}>
                    {selectedOrder.delivery_date ? new Date(selectedOrder.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}
                  </span>
                </div>
                {selectedOrder.packaging_type && (
                  <div className="detail-row">
                    <span className="detail-key">Packaging</span>
                    <span className="detail-val" style={{ color: 'var(--purple)' }}>
                      {selectedOrder.packaging_type === 'Wooden Packaging' ? '🪵' : '🫧'} {selectedOrder.packaging_type}
                    </span>
                  </div>
                )}

                {/* Unit status summary */}
                {selectedOrder.units?.length > 0 && (
                  <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <span className="detail-key" style={{ display: 'block', marginBottom: 8 }}>
                      Units ({selectedOrder.units.length})
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {selectedOrder.units.slice(0, 12).map((u) => (
                        <span key={u.id} style={{
                          fontSize: 9, padding: '2px 5px', borderRadius: 3,
                          background: 'var(--bg4)', border: '1px solid var(--border2)',
                          color: 'var(--text2)', fontFamily: 'var(--font-mono)',
                        }}>
                          {u.short_serial}
                        </span>
                      ))}
                      {selectedOrder.units.length > 12 && (
                        <span style={{ fontSize: 9, color: 'var(--text3)', padding: '2px 4px' }}>
                          +{selectedOrder.units.length - 12} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Documents */}
                {selectedOrder.documents?.filter(d => d.doc_type !== 'TaskUpload').length > 0 && (
                  <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                    <span className="detail-key" style={{ display: 'block', marginBottom: 6 }}>Documents</span>
                    {selectedOrder.documents.filter(d => d.doc_type !== 'TaskUpload').map((doc) => (
                      <div key={doc.id} style={{ fontSize: 11, marginBottom: 3 }}>
                        <a
                          href={`${window.API_BASE}/uploads/${doc.file_path.split(/[/\\]/).pop()}?token=${localStorage.getItem('token')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--blue)', textDecoration: 'none' }}
                        >
                          {doc.file_name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* ── Activity Log ── */}
          <div className="panel-section" style={{ flex: 1 }}>
            <div className="panel-sec-title" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={10} />
              Activity Log
            </div>
            <div id="activityLog" style={{ maxHeight: 280, overflowY: 'auto' }}>
              {activityLog.length === 0 && (
                <div className="empty-detail">No activity recorded yet.</div>
              )}
              {activityLog.slice(0, 50).map((e, i) => {
                const deptColor = DEPTS.find(d => d.id === e.dept)?.color || 'var(--text2)';
                return (
                  <div key={i} className="log-entry">
                    <div className="log-time">{e.time}</div>
                    <div className="log-text">
                      <span className="log-dept" style={{ color: deptColor }}>[{e.dept}]</span>
                      {' '}
                      <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{e.username}</span>
                      {': '}
                      {e.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>{/* end rp-content */}
      </div>{/* end rp-inner */}

      {/* ── Edit Reference & Tag Modal (Admin / Manager / Sales) ── */}
      {showEditRefTagModal && selectedOrder && (
        <EditRefTagModal
          isOpen={true}
          unit={{
            id: selectedStep?.id || selectedStep?.unit_id || selectedOrder.units?.[0]?.id || selectedOrder.id,
            unit_id: selectedStep?.unit_id || selectedOrder.units?.[0]?.unit_id || 'N/A',
            short_serial: selectedStep?.short_serial || selectedStep?.unit_serial || selectedOrder.units?.[0]?.short_serial || selectedOrder.units?.[0]?.unit_id || `Order #${selectedOrder.order_number}`,
            order_id: selectedOrder.id,
            order_number: selectedOrder.order_number,
            company_name: selectedOrder.company_name,
            reference_number: selectedOrder.reference_number || '',
            tag: selectedStep?.tag || selectedOrder.line_items?.[0]?.tag || selectedOrder.units?.[0]?.tag || ''
          }}
          onClose={() => setShowEditRefTagModal(false)}
          onSave={async ({ reference_number, tag }) => {
            const targetUnitId = selectedStep?.id || selectedStep?.unit_id || selectedOrder.units?.[0]?.id || selectedOrder.units?.[0]?.unit_id;
            if (targetUnitId) {
              const res = await fetch(`${window.API_BASE}/api/units/${targetUnitId}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reference_number, tag })
              });
              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to save Reference & Tag');
              }
            } else {
              const res = await fetch(`${window.API_BASE}/api/orders/${selectedOrder.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ reference_number })
              });
              if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.error || 'Failed to save Reference Number');
              }
            }
            window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrder.id } }));
            setShowEditRefTagModal(false);
          }}
        />
      )}
    </div>
  );
}
