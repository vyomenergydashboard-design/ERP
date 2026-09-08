import OrderImport from './OrderImport';

export default function BulkImportModal({ isOpen, onClose, onImportComplete }) {
  if (!isOpen) return null;

  return (
    <div
      className="bim-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bim-modal">
        {/* Modal header bar */}
        <div className="bim-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text)' }}>
              Bulk Order Import
            </span>
          </div>
          <button className="bim-close" onClick={onClose} title="Close (Esc)">✕</button>
        </div>

        {/* Scrollable body — reuse the full OrderImport component */}
        <div className="bim-body">
          <OrderImport
            onImportComplete={() => {
              onImportComplete?.();
              onClose();
            }}
          />
        </div>
      </div>

      <style>{`
        .bim-overlay {
          position: fixed;
          inset: 0;
          z-index: 1200;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: bim-fade-in 0.15s ease;
        }
        @keyframes bim-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .bim-modal {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 18px;
          width: 100%;
          max-width: 860px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 24px 80px rgba(0,0,0,0.45);
          animation: bim-slide-up 0.2s ease;
          overflow: hidden;
        }
        @keyframes bim-slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .bim-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
          background: var(--bg3);
          border-radius: 18px 18px 0 0;
          flex-shrink: 0;
        }

        .bim-close {
          background: transparent;
          border: none;
          color: var(--text3);
          font-size: 16px;
          cursor: pointer;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s, color 0.15s;
        }
        .bim-close:hover {
          background: var(--bg4);
          color: var(--red);
        }

        .bim-body {
          overflow-y: auto;
          flex: 1;
          /* Override oi-container/oi-card for modal context */
        }

        /* ── Override OrderImport card styles inside the modal ── */
        .bim-body .oi-container {
          padding: 20px 24px;
          max-width: 100%;
          margin: 0;
        }
        .bim-body .oi-card {
          background: transparent;
          border: none;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
        }
        .bim-body .oi-title  { color: var(--text);  }
        .bim-body .oi-subtitle { color: var(--text3); }
        .bim-body .oi-subtitle code { background: var(--bg4); color: var(--blue); }
        .bim-body .oi-download-btn {
          background: var(--blue-dim);
          color: var(--blue);
          border-color: var(--blue);
          opacity: 0.9;
        }
        .bim-body .oi-download-btn:hover { opacity: 1; }
        .bim-body .oi-dropzone {
          border-color: var(--border2);
          background: var(--bg3);
        }
        .bim-body .oi-dropzone:hover { border-color: var(--blue); background: var(--bg4); }
        .bim-body .oi-dragging  { border-color: var(--blue) !important; background: var(--bg4) !important; }
        .bim-body .oi-has-file  { border-color: var(--green) !important; background: var(--bg3) !important; }
        .bim-body .oi-drop-text { color: var(--text2); }
        .bim-body .oi-drop-sub  { color: var(--text3); }
        .bim-body .oi-file-name { color: var(--text); }
        .bim-body .oi-file-size { color: var(--text3); }
        .bim-body .oi-instructions { border-top-color: var(--border); }
        .bim-body .oi-inst-title { color: var(--text); }
        .bim-body .oi-inst-list { color: var(--text2); }
        .bim-body .oi-inst-list strong { color: var(--text); }
        .bim-body .oi-inst-list code { background: var(--bg4); color: var(--blue); }
        .bim-body .oi-field-ref h4 { color: var(--text); }
        .bim-body .oi-field-row { background: var(--bg3); }
        .bim-body .oi-field-name { color: var(--blue); }
        .bim-body .oi-field-note { color: var(--text3); }
        .bim-body .oi-result { border-top-color: var(--border); }
        .bim-body .oi-result-section h4 { color: var(--text); }
        .bim-body .oi-result-table th { color: var(--text3); border-bottom-color: var(--border); }
        .bim-body .oi-result-table td { color: var(--text2); border-bottom-color: var(--border); }
      `}</style>
    </div>
  );
}
