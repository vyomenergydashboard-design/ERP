import React from 'react';

/**
 * Enterprise FormField Wrapper (ERPNext Form Field style)
 */
export default function FormField({
  label,
  required = false,
  helperText = null,
  error = null,
  children,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`erp-form-field ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        width: '100%',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {label && (
        <label
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--text2, #cbd5e1)',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span>{label}</span>
          {required && <span style={{ color: 'var(--red, #ef4444)', fontSize: 13 }}>*</span>}
        </label>
      )}

      {children}

      {error ? (
        <span style={{ fontSize: 11, color: 'var(--red, #ef4444)', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: 11, color: 'var(--text3, #94a3b8)' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
}

