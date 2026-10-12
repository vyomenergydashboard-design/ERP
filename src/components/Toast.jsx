import { useState, useCallback, useImperativeHandle, forwardRef, memo } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const TOAST_ICONS = {
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info
};

export const ToastContainer = memo(forwardRef(function ToastContainer({ toasts, onDismiss }, ref) {
  if (!toasts || toasts.length === 0) return null;

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 420,
        width: 'calc(100vw - 48px)',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => {
        const type = toast.type || 'info';
        const Icon = TOAST_ICONS[type] || Info;

        return (
          <div
            key={toast.id}
            role="alert"
            aria-live="polite"
            className={`vyom-toast-item toast-${type}`}
          >
            <div className="vyom-toast-icon-wrap">
              <Icon size={16} />
            </div>
            <div style={{ flex: 1, minWidth: 0, wordBreak: 'break-word', paddingTop: 1 }}>
              {toast.title && (
                <div className="vyom-toast-title">
                  {toast.title}
                </div>
              )}
              <div className="vyom-toast-message">
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="vyom-toast-close"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}));

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', title = '', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type, title };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, dismissToast };
}

export default ToastContainer;
