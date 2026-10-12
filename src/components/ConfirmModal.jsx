import { memo } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ConfirmModal = memo(function ConfirmModal({
  isOpen,
  title = 'Confirmation',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  onConfirm,
  onClose
}) {
  if (!isOpen) return null;

  const isDanger = variant === 'danger';
  const isWarning = variant === 'warning';

  const iconColor = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : 'var(--blue, #3b82f6)';
  const confirmBtnBg = isDanger ? '#ef4444' : isWarning ? '#f59e0b' : 'var(--blue, #3b82f6)';
  const confirmBtnColor = '#ffffff';

  const Icon = isDanger ? AlertCircle : isWarning ? AlertTriangle : Info;

  return createPortal(
    <div
      className="modal-overlay open"
      data-modal="open"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.72)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 99998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        style={{
          background: 'var(--bg2, #1c202b)',
          border: '1px solid var(--border, #2e3547)',
          borderRadius: 12,
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.55)',
          maxWidth: 440,
          width: '100%',
          overflow: 'hidden',
          animation: 'vyomModalIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border, #2e3547)',
            background: 'var(--bg, #151821)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <Icon size={18} style={{ color: iconColor, flexShrink: 0 }} />
            <span id="confirm-modal-title" style={{ fontWeight: 600, fontSize: 14, color: 'var(--text, #e6edf3)' }}>
              {title}
            </span>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text3, #94a3b8)',
              cursor: 'pointer',
              padding: 3,
              borderRadius: 4,
              display: 'flex'
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '18px 20px', fontSize: 13, color: 'var(--text2, #cbd5e1)', lineHeight: 1.5 }}>
          {message}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '12px 18px',
            borderTop: '1px solid var(--border, #2e3547)',
            background: 'var(--bg, #151821)'
          }}
        >
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid var(--border, #2e3547)',
              color: 'var(--text2, #94a3b8)',
              padding: '7px 14px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className="btn-confirm"
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            style={{
              background: confirmBtnBg,
              border: 'none',
              color: confirmBtnColor,
              padding: '7px 16px',
              borderRadius: 6,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: isDanger ? '0 2px 10px rgba(239, 68, 68, 0.35)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

export default ConfirmModal;
