import React, { useRef } from 'react';
import { Search, X } from 'lucide-react';

/**
 * Enterprise SearchInput Component (Frappe UI Awesomebar style)
 */
export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  size = 'sm', // 'sm' (28px) | 'md' (32px)
  shortcut = null, // e.g. 'Ctrl+K'
  onClear = null,
  className = '',
  style = {},
  autoFocus = false,
  ...props
}) {
  const inputRef = useRef(null);

  const height = size === 'sm' ? 28 : 32;
  const iconSize = size === 'sm' ? 13 : 15;
  const fontSize = size === 'sm' ? 12 : 13;

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
    inputRef.current?.focus();
  };

  return (
    <div
      className={`erp-search-container ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        width: '100%',
        maxWidth: 320,
        ...style
      }}
    >
      <Search
        size={iconSize}
        style={{
          position: 'absolute',
          left: 8,
          color: 'var(--text3, #94a3b8)',
          pointerEvents: 'none',
          flexShrink: 0
        }}
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        onKeyDown={(e) => {
          if (e.key === 'Escape' && value) {
            e.stopPropagation();
            handleClear();
          }
        }}
        style={{
          width: '100%',
          height,
          paddingLeft: 28,
          paddingRight: (value || shortcut) ? 28 : 10,
          fontSize,
          fontFamily: 'inherit',
          background: 'var(--bg3, #242937)',
          color: 'var(--text, #f1f5f9)',
          border: '1px solid var(--border, #2e3547)',
          borderRadius: 'var(--radius-sm, 4px)',
          outline: 'none',
          boxSizing: 'border-box',
          transition: 'all 0.15s ease'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--blue, #3b82f6)';
          e.currentTarget.style.boxShadow = '0 0 0 1px var(--blue, #3b82f6)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'var(--border, #2e3547)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        {...props}
      />
      {value ? (
        <button
          type="button"
          onClick={handleClear}
          title="Clear search (Esc)"
          style={{
            position: 'absolute',
            right: 6,
            background: 'transparent',
            border: 'none',
            padding: 2,
            cursor: 'pointer',
            color: 'var(--text3, #94a3b8)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            lineHeight: 1
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text3)')}
        >
          <X size={iconSize} />
        </button>
      ) : (
        shortcut && (
          <span
            style={{
              position: 'absolute',
              right: 6,
              fontSize: 10,
              fontFamily: 'var(--font-mono)',
              fontWeight: 600,
              color: 'var(--text3, #94a3b8)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border, #2e3547)',
              padding: '1px 4px',
              borderRadius: 3,
              pointerEvents: 'none'
            }}
          >
            {shortcut}
          </span>
        )
      )}
    </div>
  );
}

