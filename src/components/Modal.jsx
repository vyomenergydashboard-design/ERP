import React from 'react';

/**
 * Shared reusable Modal component.
 * Automatically integrates with global Escape key closing, overlay styling, and modal conventions.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '520px',
  width = '95%',
  style = {},
  className = '',
  overlayClassName = '',
  showCloseButton = true,
  headerActions = null,
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay open ${overlayClassName}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={`modal ${className}`} style={{ maxWidth, width, ...style }}>
        {(title || showCloseButton || headerActions) && (
          <div className="modal-header">
            <div>
              {title && <div className="modal-title">{title}</div>}
              {subtitle && <div className="modal-sub">{subtitle}</div>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: headerActions ? '12px' : 0 }}>
              {headerActions}
              {showCloseButton && (
                <button
                  type="button"
                  className="modal-close"
                  onClick={onClose}
                  aria-label="Close"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
