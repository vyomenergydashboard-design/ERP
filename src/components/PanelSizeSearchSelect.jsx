import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, ChevronDown, X, Check, PenTool } from 'lucide-react';

/**
 * PanelSizeSearchSelect
 * A searchable, visually distinct dropdown component for selecting standard panel sizes and codes.
 * Features:
 * - Real-time filtering across dimensions, panel code, IP rating, and comments/door type
 * - Distinct visual hierarchy: Dimensions (mono), Panel Code (purple pill), IP Rating (green pill)
 * - Support for standard panel masters and custom non-standard panel dimensions
 * - Keyboard navigation (Up/Down arrows, Enter to select, Escape to dismiss)
 * - React Portal rendering to avoid clipping by modal or container scrollbars
 */
export default function PanelSizeSearchSelect({
  value = '',
  onChange,
  panelSizes = [],
  placeholder = '-- Select / search standard panel size --',
  disabled = false,
  allowClear = true,
  clearLabel = '-- No linked panel size --',
  valueKey = 'panel_code', // 'panel_code' or 'panel_size'
  allowCustom = false,
  isCustom = false,
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [coords, setCoords] = useState(null);

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const isCustomMode = Boolean(isCustom || value === '__custom__');

  // Find currently selected panel size object
  const selectedItem = useMemo(() => {
    if (!value || isCustomMode) return null;
    const strVal = String(value).trim().toLowerCase();
    return (
      panelSizes.find(ps => {
        const code = (ps.panel_code || '').trim().toLowerCase();
        const size = (ps.panel_size || ps.size_name || '').trim().toLowerCase();
        return (code && code === strVal) || (size && size === strVal);
      }) || null
    );
  }, [value, panelSizes, isCustomMode]);

  // Compute position for portal dropdown
  const calculatePosition = () => {
    if (!triggerRef.current) return null;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const minWidth = Math.max(rect.width, 420);

    let left = rect.left;
    if (left + minWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - minWidth - 12);
    }

    const opensUpward = spaceBelow < 260 && spaceAbove > spaceBelow;

    if (opensUpward) {
      return {
        top: 'auto',
        bottom: window.innerHeight - rect.top + 6,
        left,
        width: minWidth,
        maxHeight: Math.min(spaceAbove - 16, 380),
        opensUpward: true
      };
    } else {
      return {
        top: rect.bottom + 6,
        bottom: 'auto',
        left,
        width: minWidth,
        maxHeight: Math.min(spaceBelow - 16, 380),
        opensUpward: false
      };
    }
  };

  // Open dropdown
  const openDropdown = (e) => {
    if (disabled) return;
    e?.stopPropagation?.();
    e?.preventDefault?.();

    if (isOpen) {
      setIsOpen(false);
      return;
    }

    const pos = calculatePosition();
    if (pos) setCoords(pos);
    setSearchQuery('');
    setHighlightIndex(-1);
    setIsOpen(true);
  };

  // Handle position tracking and outside clicks
  useEffect(() => {
    if (!isOpen) return;

    const updatePos = () => {
      const pos = calculatePosition();
      if (pos) setCoords(pos);
    };

    const handleClickOutside = (e) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', updatePos);
    window.addEventListener('scroll', updatePos, true);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('resize', updatePos);
      window.removeEventListener('scroll', updatePos, true);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Filter items based on search query
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return panelSizes;
    const tokens = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return panelSizes.filter(ps => {
      const size = (ps.panel_size || ps.size_name || '').toLowerCase();
      const sizeNoSpaces = size.replace(/\s+/g, '');
      const code = (ps.panel_code || '').toLowerCase();
      const ip = (ps.ip_rating || '').toLowerCase();
      const comments = (ps.comments || ps.description || '').toLowerCase();

      return tokens.every(t => {
        const tNoSpaces = t.replace(/\s+/g, '');
        return (
          size.includes(t) ||
          sizeNoSpaces.includes(tNoSpaces) ||
          code.includes(t) ||
          ip.includes(t) ||
          comments.includes(t)
        );
      });
    });
  }, [panelSizes, searchQuery]);

  // Has exact match with a master size
  const hasExactMatch = useMemo(() => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.trim().toLowerCase();
    return panelSizes.some(ps => {
      const size = (ps.panel_size || ps.size_name || '').toLowerCase();
      const code = (ps.panel_code || '').toLowerCase();
      return size === q || code === q;
    });
  }, [panelSizes, searchQuery]);

  // Total selectable options count
  const customOptionsCount = allowCustom ? (searchQuery.trim() && !hasExactMatch ? 2 : 1) : 0;
  const totalOptions = (allowClear ? 1 : 0) + filteredItems.length + customOptionsCount;

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const children = listRef.current.children;
      if (children[highlightIndex]) {
        children[highlightIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightIndex]);

  const handleSelect = (item) => {
    if (!item) {
      onChange?.('', null, false);
    } else {
      const val = valueKey === 'panel_size'
        ? (item.panel_size || item.size_name || item.panel_code || '')
        : (item.panel_code || item.panel_size || item.size_name || '');
      onChange?.(val, item, false);
    }
    setIsOpen(false);
  };

  const handleSelectCustom = (customVal = '__custom__') => {
    onChange?.(customVal, null, true);
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.('', null, false);
  };

  // Keyboard navigation inside search input
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => (totalOptions > 0 ? (prev + 1) % totalOptions : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => (totalOptions > 0 ? (prev - 1 + totalOptions) % totalOptions : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allowClear && highlightIndex === 0) {
        handleSelect(null);
      } else {
        const itemOffset = allowClear ? 1 : 0;
        const itemIndex = highlightIndex - itemOffset;
        if (itemIndex >= 0 && itemIndex < filteredItems.length) {
          handleSelect(filteredItems[itemIndex]);
        } else if (allowCustom && itemIndex >= filteredItems.length) {
          if (searchQuery.trim() && !hasExactMatch && itemIndex === filteredItems.length) {
            handleSelectCustom(searchQuery.trim());
          } else {
            handleSelectCustom('__custom__');
          }
        } else if (filteredItems.length === 1) {
          handleSelect(filteredItems[0]);
        } else if (allowCustom && searchQuery.trim() && !hasExactMatch) {
          handleSelectCustom(searchQuery.trim());
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  // Highlight search text match
  const renderHighlighted = (text, query) => {
    if (!query || !text) return text;
    const str = String(text);
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return str;

    const escaped = tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = str.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <span
          key={i}
          style={{
            color: 'var(--blue)',
            fontWeight: 800,
            textDecoration: 'underline',
            background: 'var(--blue-dim)',
            borderRadius: '2px',
            padding: '0 1px'
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Format dimensions display text
  const formatSize = (ps) => {
    return ps.panel_size || ps.size_name || '';
  };

  const formatIp = (ps) => {
    return (ps.ip_rating || '').replace(/,\s*/g, ' ').trim();
  };

  const formatComments = (ps) => {
    const ip = formatIp(ps);
    let comments = (ps.comments || ps.description || '').trim();
    if (ip && comments.toLowerCase() === ip.toLowerCase()) return '';
    return comments;
  };

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      {/* Trigger Box */}
      <div
        ref={triggerRef}
        onClick={openDropdown}
        title={selectedItem ? 'Click to change panel size' : 'Click to select standard panel size'}
        style={{
          width: '100%',
          height: '38px',
          minHeight: '38px',
          maxHeight: '38px',
          background: 'var(--bg3)',
          border: isOpen ? '1px solid var(--blue)' : '1px solid var(--border2)',
          borderRadius: '8px',
          padding: '0 10px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          transition: 'all 0.15s ease',
          boxShadow: isOpen
            ? '0 0 0 3px var(--blue-dim)'
            : 'inset 0 1px 3px rgba(0,0,0,0.1)',
          opacity: disabled ? 0.6 : 1,
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {selectedItem ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1, overflow: 'hidden', flexWrap: 'nowrap' }}>
            {/* Dimension */}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flexShrink: 1
              }}
            >
              {formatSize(selectedItem) || 'Standard Panel'}
            </span>

            {/* Panel Code Badge */}
            {selectedItem.panel_code && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--purple)',
                  background: 'var(--purple-dim)',
                  border: '1px solid rgba(167, 139, 250, 0.3)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {selectedItem.panel_code}
              </span>
            )}

            {/* IP Rating Badge */}
            {formatIp(selectedItem) && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: 'var(--green)',
                  background: 'var(--green-dim)',
                  border: '1px solid rgba(34, 197, 94, 0.3)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {formatIp(selectedItem)}
              </span>
            )}

            {/* Comments / Door Style */}
            {formatComments(selectedItem) && (
              <span
                style={{
                  fontSize: '10.5px',
                  color: 'var(--text3)',
                  background: 'var(--bg4)',
                  border: '1px solid var(--border)',
                  padding: '1px 5px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  maxWidth: '90px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexShrink: 2
                }}
                title={formatComments(selectedItem)}
              >
                {formatComments(selectedItem)}
              </span>
            )}
          </div>
        ) : isCustomMode || (value && value === '__custom__') ? (
          // Custom dimensions selected - clean single-line display
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1, overflow: 'hidden', flexWrap: 'nowrap' }}>
            <span
              style={{
                fontFamily: value && value !== '__custom__' ? 'var(--font-mono)' : 'var(--font)',
                fontSize: '12px',
                fontWeight: 600,
                color: value && value !== '__custom__' ? 'var(--text)' : 'var(--accent)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flexShrink: 1
              }}
            >
              {value && value !== '__custom__' ? value : 'Custom Dimensions'}
            </span>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: 'var(--accent)',
                background: 'var(--orange-dim)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                padding: '1px 5px',
                borderRadius: '3px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Custom
            </span>
          </div>
        ) : value ? (
          // Value exists but not matched to master list
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1, overflow: 'hidden', flexWrap: 'nowrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flexShrink: 1
              }}
            >
              {value}
            </span>
            <span
              style={{
                fontSize: '9.5px',
                fontWeight: 700,
                color: 'var(--accent)',
                background: 'var(--orange-dim)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                padding: '1px 5px',
                borderRadius: '3px',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Custom
            </span>
          </div>
        ) : (
          <span
            style={{
              fontSize: '12px',
              color: 'var(--text3)',
              userSelect: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              flex: 1
            }}
          >
            {placeholder}
          </span>
        )}

        {/* Right side icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          {(value || isCustomMode) && allowClear && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear panel size"
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: 'var(--text3)',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '4px',
                transition: 'color 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown
            size={14}
            style={{
              color: isOpen ? 'var(--blue)' : 'var(--text3)',
              transform: isOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.15s ease'
            }}
          />
        </div>
      </div>

      {/* Floating Portal Dropdown */}
      {isOpen && coords && createPortal(
        <div
          ref={dropdownRef}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: coords.top,
            bottom: coords.bottom,
            left: coords.left,
            width: coords.width,
            zIndex: 99999,
            background: 'var(--bg2)',
            border: '1px solid var(--border2)',
            borderRadius: '10px',
            boxShadow: '0 16px 36px rgba(0,0,0,0.45), 0 4px 14px rgba(0,0,0,0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: coords.maxHeight,
            animation: 'fadeIn 0.12s ease'
          }}
        >
          {/* Search Header */}
          <div
            style={{
              padding: '8px 10px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0
            }}
          >
            <Search size={14} style={{ color: 'var(--blue)', flexShrink: 0 }} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search dimensions, code, IP rating, door type..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: '12px',
                width: '100%',
                fontFamily: 'var(--font)'
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text3)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex'
                }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Results Summary Subheader */}
          <div
            style={{
              padding: '4px 10px',
              background: 'var(--bg4)',
              borderBottom: '1px solid var(--border)',
              fontSize: '10px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: 'var(--text3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <span>Standard Panel Sizes</span>
            <span>
              {searchQuery ? `${filteredItems.length} matching` : `${panelSizes.length} available`}
            </span>
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            style={{
              overflowY: 'auto',
              padding: '4px',
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}
          >
            {/* Clear / Unlink Option */}
            {allowClear && (
              <div
                onClick={() => handleSelect(null)}
                onMouseEnter={() => setHighlightIndex(0)}
                style={{
                  padding: '8px 10px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: highlightIndex === 0
                    ? 'var(--bg3)'
                    : (!value && !isCustomMode ? 'rgba(59, 130, 246, 0.08)' : 'transparent'),
                  border: highlightIndex === 0 ? '1px solid var(--border2)' : '1px solid transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'background 0.1s ease',
                  marginBottom: '2px'
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    color: !value && !isCustomMode ? 'var(--blue)' : 'var(--text3)',
                    fontStyle: 'italic',
                    fontWeight: !value && !isCustomMode ? 600 : 'normal'
                  }}
                >
                  {clearLabel}
                </span>
                {!value && !isCustomMode && <Check size={14} style={{ color: 'var(--blue)' }} />}
              </div>
            )}

            {/* List of Panel Sizes */}
            {filteredItems.length > 0 ? (
              filteredItems.map((ps, idx) => {
                const optIndex = allowClear ? idx + 1 : idx;
                const isSelected = !isCustomMode && (
                  selectedItem?.id === ps.id ||
                  (value && (
                    (ps.panel_code && ps.panel_code === value) ||
                    ((ps.panel_size || ps.size_name) === value)
                  ))
                );
                const isHighlighted = optIndex === highlightIndex;

                const sizeVal = formatSize(ps);
                const ipRating = formatIp(ps);
                const comments = formatComments(ps);

                return (
                  <div
                    key={ps.id || ps.panel_code || idx}
                    onClick={() => handleSelect(ps)}
                    onMouseEnter={() => setHighlightIndex(optIndex)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: isHighlighted
                        ? 'var(--bg3)'
                        : (isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent'),
                      border: isHighlighted
                        ? '1px solid var(--blue)'
                        : (isSelected ? '1px solid rgba(59, 130, 246, 0.25)' : '1px solid transparent'),
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      transition: 'background 0.1s ease'
                    }}
                  >
                    {/* Row 1: Dimensions, Badges (Panel Code, IP Rating), and Checkmark */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', minWidth: 0 }}>
                        {/* Dimensions */}
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            color: isHighlighted ? 'var(--blue)' : 'var(--text)'
                          }}
                        >
                          {renderHighlighted(sizeVal, searchQuery)}
                        </span>

                        {/* Panel Code Badge */}
                        {ps.panel_code && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: 'var(--purple)',
                              background: 'var(--purple-dim)',
                              border: '1px solid rgba(167, 139, 250, 0.3)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              flexShrink: 0
                            }}
                          >
                            {renderHighlighted(ps.panel_code, searchQuery)}
                          </span>
                        )}

                        {/* IP Rating Badge */}
                        {ipRating && (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              color: 'var(--green)',
                              background: 'var(--green-dim)',
                              border: '1px solid rgba(34, 197, 94, 0.3)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              flexShrink: 0
                            }}
                          >
                            {renderHighlighted(ipRating, searchQuery)}
                          </span>
                        )}
                      </div>

                      {isSelected && (
                        <Check size={14} style={{ color: 'var(--green)', flexShrink: 0, strokeWidth: 2.5 }} />
                      )}
                    </div>

                    {/* Row 2: Door Type / Comments Subtitle */}
                    {comments && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingLeft: '1px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            color: isHighlighted ? 'var(--text2)' : 'var(--text3)',
                            fontFamily: 'var(--font)'
                          }}
                        >
                          {renderHighlighted(comments, searchQuery)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : !allowCustom ? (
              <div
                style={{
                  padding: '16px 12px',
                  textAlign: 'center',
                  color: 'var(--text3)',
                  fontSize: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  alignItems: 'center'
                }}
              >
                <span>No panel sizes match "{searchQuery}"</span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--blue)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: 600,
                    textDecoration: 'underline',
                    padding: 0
                  }}
                >
                  Clear search filter
                </button>
              </div>
            ) : null}

            {/* Custom Options (if allowCustom is true) */}
            {allowCustom && (
              <>
                {/* Specific custom size typed in search */}
                {searchQuery.trim() && !hasExactMatch && (
                  <div
                    onClick={() => handleSelectCustom(searchQuery.trim())}
                    onMouseEnter={() => setHighlightIndex((allowClear ? 1 : 0) + filteredItems.length)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: highlightIndex === (allowClear ? 1 : 0) + filteredItems.length
                        ? 'var(--bg3)'
                        : 'rgba(249, 115, 22, 0.05)',
                      border: highlightIndex === (allowClear ? 1 : 0) + filteredItems.length
                        ? '1px solid var(--accent)'
                        : '1px dashed rgba(249, 115, 22, 0.35)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                      marginTop: '4px',
                      transition: 'all 0.1s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent)' }}>
                          + Use custom size: "{searchQuery.trim()}"
                        </span>
                        <span
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: 'var(--accent)',
                            background: 'var(--orange-dim)',
                            border: '1px solid rgba(249, 115, 22, 0.3)',
                            padding: '1px 5px',
                            borderRadius: '3px'
                          }}
                        >
                          Custom
                        </span>
                      </div>
                      {isCustomMode && value === searchQuery.trim() && (
                        <Check size={14} style={{ color: 'var(--green)' }} />
                      )}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--text3)' }}>
                      Set non-standard dimension directly
                    </div>
                  </div>
                )}

                {/* Generic Custom Dimensions option */}
                <div
                  onClick={() => handleSelectCustom('__custom__')}
                  onMouseEnter={() => setHighlightIndex(
                    (allowClear ? 1 : 0) + filteredItems.length + (searchQuery.trim() && !hasExactMatch ? 1 : 0)
                  )}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: highlightIndex === ((allowClear ? 1 : 0) + filteredItems.length + (searchQuery.trim() && !hasExactMatch ? 1 : 0))
                      ? 'var(--bg3)'
                      : (isCustomMode && (!value || value === '__custom__') ? 'rgba(249, 115, 22, 0.08)' : 'transparent'),
                    border: highlightIndex === ((allowClear ? 1 : 0) + filteredItems.length + (searchQuery.trim() && !hasExactMatch ? 1 : 0))
                      ? '1px solid var(--accent)'
                      : (isCustomMode && (!value || value === '__custom__') ? '1px solid rgba(249, 115, 22, 0.3)' : '1px solid transparent'),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '3px',
                    marginTop: '2px',
                    transition: 'all 0.1s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>
                        ✎ Custom Panel Dimensions…
                      </span>
                    </div>
                    {isCustomMode && (!value || value === '__custom__') && (
                      <Check size={14} style={{ color: 'var(--green)' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text3)' }}>
                    Enter custom dimensions manually in input field
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
