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
  className = '',
  overlayClassName = '',
  showCloseButton = true,
}) {
  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay open ${overlayClassName}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className={`modal ${className}`} style={{ maxWidth, width }}>
        {(title || showCloseButton) && (
          <div className="modal-header">
            <div>
              {title && <div className="modal-title">{title}</div>}
              {subtitle && <div className="modal-sub">{subtitle}</div>}
            </div>
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
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
