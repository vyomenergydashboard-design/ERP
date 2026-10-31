import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Info, Trash2, X } from 'lucide-react';
import Button from '../common/Button';

/**
 * Enterprise Confirmation Dialog (ERPNext / Frappe UI style)
 */
export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  loading = false
}) {
  const confirmBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus confirm button on open
    setTimeout(() => {
      confirmBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const icons = {
    danger: <Trash2 size={20} color="var(--red, #ef4444)" />,
    warning: <AlertTriangle size={20} color="var(--orange, #f97316)" />,
    primary: <Info size={20} color="var(--blue, #3b82f6)" />
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10, 12, 16, 0.75)',
        backdropFilter: 'blur(4px)',
        padding: 16
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'var(--bg2, #1c202b)',
          border: '1px solid var(--border, #2e3547)',
          borderRadius: 'var(--radius-lg, 8px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'vyomToastIn 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid var(--border, #2e3547)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {icons[variant] || icons.primary}
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            title="Close (Esc)"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text3)',
              padding: 4,
              display: 'inline-flex',
              borderRadius: 4
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '16px 18px', fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
          {message}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 8,
            padding: '12px 18px',
            background: 'var(--bg, #151821)',
            borderTop: '1px solid var(--border, #2e3547)'
          }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            ref={confirmBtnRef}
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

