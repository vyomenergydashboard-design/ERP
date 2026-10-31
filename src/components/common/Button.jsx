import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Enterprise Button Component (Frappe UI / ERPNext Desk inspired)
 */
export default function Button({
  children,
  variant = 'secondary', // 'primary' | 'secondary' | 'subtle' | 'danger' | 'ghost'
  size = 'sm',          // 'xs' (24px) | 'sm' (28px) | 'md' (32px) | 'lg' (38px)
  icon: Icon = null,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  style = {},
  title,
  ...props
}) {
  const isDisabled = disabled || loading;

  const sizeStyles = {
    xs: { height: 24, padding: '0 8px', fontSize: 11, gap: 4, iconSize: 12 },
    sm: { height: 28, padding: '0 10px', fontSize: 12, gap: 5, iconSize: 13 },
    md: { height: 32, padding: '0 14px', fontSize: 13, gap: 6, iconSize: 15 },
    lg: { height: 38, padding: '0 18px', fontSize: 14, gap: 8, iconSize: 16 }
  }[size] || { height: 28, padding: '0 10px', fontSize: 12, gap: 5, iconSize: 13 };

  const variantStyles = {
    primary: {
      background: 'var(--blue, #3b82f6)',
      color: '#ffffff',
      border: '1px solid var(--blue, #3b82f6)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
    },
    secondary: {
      background: 'var(--bg3, #242937)',
      color: 'var(--text, #f1f5f9)',
      border: '1px solid var(--border, #2e3547)',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.08)'
    },
    subtle: {
      background: 'var(--blue-dim, rgba(56, 189, 248, 0.12))',
      color: 'var(--blue, #38bdf8)',
      border: '1px solid rgba(56, 189, 248, 0.25)'
    },
    danger: {
      background: 'rgba(239, 68, 68, 0.15)',
      color: 'var(--red, #ef4444)',
      border: '1px solid rgba(239, 68, 68, 0.35)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text2, #cbd5e1)',
      border: '1px solid transparent'
    }
  }[variant] || {};

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      title={title}
      className={`erp-btn erp-btn-${variant} erp-btn-${size} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontFamily: 'inherit',
        borderRadius: 'var(--radius-sm, 4px)',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? (loading ? 0.8 : 0.5) : 1,
        transition: 'all 0.15s ease',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        lineHeight: 1,
        ...sizeStyles,
        ...variantStyles,
        ...style
      }}
      {...props}
    >
      {loading ? (
        <Loader2 size={sizeStyles.iconSize} className="erp-spin" style={{ animation: 'spin 0.8s linear infinite' }} />
      ) : (
        Icon && iconPosition === 'left' && <Icon size={sizeStyles.iconSize} style={{ flexShrink: 0 }} />
      )}
      {children && <span>{children}</span>}
      {!loading && Icon && iconPosition === 'right' && (
        <Icon size={sizeStyles.iconSize} style={{ flexShrink: 0 }} />
      )}
    </button>
  );
}

