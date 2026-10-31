import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

/**
 * Enterprise FormSection Component (ERPNext Section Break style)
 */
export default function FormSection({
  title,
  description = null,
  collapsible = false,
  defaultExpanded = true,
  children,
  extra = null,
  className = '',
  style = {}
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className={`erp-form-section ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: '16px 0',
        borderBottom: '1px solid var(--border, #2e3547)',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {title && (
        <div
          onClick={collapsible ? () => setExpanded(!expanded) : undefined}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: collapsible ? 'pointer' : 'default',
            userSelect: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {collapsible && (
              <span style={{ color: 'var(--text3)' }}>
                {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
            <div>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                {title}
              </h4>
              {description && (
                <p style={{ margin: '2px 0 0 0', fontSize: 11.5, color: 'var(--text3)' }}>
                  {description}
                </p>
              )}
            </div>
          </div>

          {extra && <div>{extra}</div>}
        </div>
      )}

      {(!collapsible || expanded) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14,
            boxSizing: 'border-box'
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

