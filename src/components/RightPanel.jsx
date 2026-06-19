import { DEPTS } from '../data/planningData';
import { Clock } from 'lucide-react';

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

export default function RightPanel({ selectedStep, activityLog, selectedOrder }) {
  const dept = selectedStep ? DEPTS.find((d) => d.id === selectedStep.dept) : null;

  return (
    <div className="right-panel">

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

      {/* ── Order Overview (when an order is selected) ── */}
      {selectedOrder ? (
        <div className="panel-section">
          <div className="panel-sec-title">Order Overview</div>
          <div className="detail-card">
            <h4 style={{ marginBottom: 4, fontFamily: 'var(--font-mono)', fontSize: 13 }}>{selectedOrder.order_number}</h4>
            {selectedOrder.company_name && (
              <div style={{ color: 'var(--text2)', fontSize: 11, marginBottom: 12 }}>
                🏢 {selectedOrder.company_name}
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
                      fontSize: 9,
                      padding: '2px 5px',
                      borderRadius: 3,
                      background: 'var(--bg4)',
                      border: '1px solid var(--border2)',
                      color: 'var(--text2)',
                      fontFamily: 'var(--font-mono)',
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
                      href={`http://localhost:5000/uploads/${doc.file_path.split(/[/\\]/).pop()}?token=${localStorage.getItem('token')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--blue)', textDecoration: 'none' }}
                    >
                      📄 {doc.file_name}
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
    </div>
  );
}
