import React from 'react';
import { ChevronRight } from 'lucide-react';
import StatusBadge from '../feedback/StatusBadge';

/**
 * Enterprise PageHeader Component (ERPNext Desk page-head inspired)
 */
export default function PageHeader({
  title,
  subtitle = null,
  breadcrumbs = [],
  status = null,
  statusLabel = null,
  statusVariant = 'status',
  actions = null,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`erp-page-head ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '12px 18px',
        borderBottom: '1px solid var(--border, #2e3547)',
        background: 'var(--bg2, #1c202b)',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {/* Breadcrumb Trail */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 11,
            color: 'var(--text3, #94a3b8)',
            lineHeight: 1
          }}
        >
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const label = typeof crumb === 'string' ? crumb : crumb.label;
            const onClick = typeof crumb === 'object' ? crumb.onClick : null;

            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight size={10} style={{ opacity: 0.5 }} />}
                {onClick && !isLast ? (
                  <span
                    onClick={onClick}
                    style={{
                      cursor: 'pointer',
                      color: 'var(--text3)',
                      transition: 'color 0.15s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--blue, #38bdf8)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}
                  >
                    {label}
                  </span>
                ) : (
                  <span style={{ color: isLast ? 'var(--text2, #cbd5e1)' : 'var(--text3)', fontWeight: isLast ? 600 : 400 }}>
                    {label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      )}

      {/* Title, Status & Actions Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--text, #f1f5f9)',
              letterSpacing: '-0.2px',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </h1>

          {status && (
            <StatusBadge
              status={status}
              label={statusLabel}
              variant={statusVariant}
              size="sm"
            />
          )}

          {subtitle && (
            <span style={{ fontSize: 12, color: 'var(--text3, #94a3b8)', fontWeight: 400 }}>
              · {subtitle}
            </span>
          )}
        </div>

        {/* Right-aligned action buttons slot */}
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}

