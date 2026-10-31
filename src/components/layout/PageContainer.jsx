import React from 'react';

/**
 * Enterprise PageContainer Component (ERPNext Desk page container)
 */
export default function PageContainer({
  children,
  header = null,
  fluid = false,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`erp-page-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100%',
        boxSizing: 'border-box',
        background: 'var(--bg, #151821)',
        overflow: 'hidden',
        ...style
      }}
    >
      {header}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: fluid ? '100%' : '100%',
          boxSizing: 'border-box',
          minHeight: 0
        }}
      >
        {children}
      </div>
    </div>
  );
}

