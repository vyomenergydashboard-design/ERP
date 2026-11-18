import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search, Trash2, X } from 'lucide-react';

function PanelSizeComboboxCell({ unit, panelSizeMasters, canEdit, onSave, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [coords, setCoords] = useState({ top: 0, bottom: 'auto', left: 0, width: 380, maxHeight: 370, opensUpward: false });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const currentValue = unit.panel_type_size || '';

  const calculatePosition = () => {
    if (!triggerRef.current) return null;
    const rect = triggerRef.current.getBoundingClientRect();
    const dropdownHeight = 370;
    const dropdownWidth = Math.max(rect.width, 380);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    // Open upwards if space below is too tight and there is more room above
    const opensUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    let left = rect.left;
    if (left + dropdownWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - dropdownWidth - 8);
    }

    if (opensUpward) {
      return {
        top: 'auto',
        bottom: window.innerHeight - rect.top + 4,
        left,
        width: dropdownWidth,
        maxHeight: Math.max(160, Math.min(370, rect.top - 12)),
        opensUpward: true
      };
    } else {
      return {
        top: rect.bottom + 4,
        bottom: 'auto',
        left,
        width: dropdownWidth,
        maxHeight: Math.max(160, Math.min(370, window.innerHeight - rect.bottom - 12)),
        opensUpward: false
      };
    }
  };

  const openDropdown = (e) => {
    if (!canEdit) return;
    e?.preventDefault();
    if (isOpen) {
      setIsOpen(false);
      return;
    }
    // Close any other open dropdowns in the table immediately
    window.dispatchEvent(new CustomEvent('vyom-close-panel-pickers', { detail: unit.id }));
    const pos = calculatePosition();
    if (pos) {
      setCoords(pos);
    }
    // Start with empty search query so all master dimensions from Masters -> Panel Sizes are visible immediately
    setQuery('');
    setHighlightIndex(0);
    setIsOpen(true);
  };

  useEffect(() => {
    const handleCloseOthers = (e) => {
      if (e.detail !== unit.id) {
        setIsOpen(false);
      }
    };
    window.addEventListener('vyom-close-panel-pickers', handleCloseOthers);
    return () => {
      window.removeEventListener('vyom-close-panel-pickers', handleCloseOthers);
    };
  }, [unit.id]);

  useEffect(() => {
    if (!isOpen) return;

    const updatePos = () => {
      const pos = calculatePosition();
      if (pos) {
        setCoords(pos);
      }
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

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  const cleanQ = (query || '').trim().toLowerCase();
  const matchedMasters = panelSizeMasters.filter(item => {
    if (!cleanQ) return true;
    const codeMatch = item.panel_code && item.panel_code.toLowerCase().includes(cleanQ);
    const sizeVal = item.panel_size || item.size_name || '';
    const nameMatch = sizeVal.toLowerCase().includes(cleanQ);
    const ipMatch = item.ip_rating && item.ip_rating.toLowerCase().includes(cleanQ);
    const descVal = item.comments || item.description || '';
    const descMatch = descVal.toLowerCase().includes(cleanQ);
    return codeMatch || nameMatch || ipMatch || descMatch;
  });

  const exactMatch = panelSizeMasters.some(item => {
    const sizeVal = item.panel_size || item.size_name || '';
    return sizeVal.toLowerCase() === cleanQ;
  });

  const options = [...matchedMasters];
  if (cleanQ && !exactMatch) {
    options.push({
      id: 'custom_query_option',
      size_name: query.trim(),
      description: 'Custom dimension (Press Enter to save)',
      isCustom: true
    });
  }

  const handleSelect = (val) => {
    setIsOpen(false);
    if (val !== currentValue) {
      onSave(val);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex(prev => (options.length ? (prev + 1) % options.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex(prev => (options.length ? (prev - 1 + options.length) % options.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (options.length > 0 && highlightIndex >= 0 && highlightIndex < options.length) {
        handleSelect(options[highlightIndex].size_name);
      } else if (query.trim()) {
        handleSelect(query.trim());
      } else {
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const renderHighlighted = (text, highlight) => {
    if (!highlight || text === undefined || text === null) return text;
    const str = String(text);
    const lowerText = str.toLowerCase();
    const lowerHighlight = highlight.toLowerCase();
    let startIndex = 0;
    let index = lowerText.indexOf(lowerHighlight, startIndex);
    if (index === -1) return str;

    const parts = [];
    while (index !== -1) {
      if (index > startIndex) {
        parts.push(str.substring(startIndex, index));
      }
      parts.push(
        <span key={index} style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'underline' }}>
          {str.substring(index, index + highlight.length)}
        </span>
      );
      startIndex = index + highlight.length;
      index = lowerText.indexOf(lowerHighlight, startIndex);
    }
    if (startIndex < str.length) {
      parts.push(str.substring(startIndex));
    }
    return parts;
  };

  if (!canEdit) {
    return (
      <span style={{ fontSize: 12, color: currentValue ? 'var(--text)' : 'var(--text3)' }}>
        {currentValue || '—'}
      </span>
    );
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="no-canvas-drag"
        onClick={openDropdown}
        title="Click to select or change panel size (Design)"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          width: '100%',
          maxWidth: '100%',
          padding: '2px 7px',
          borderRadius: 'var(--radius-sm, 4px)',
          cursor: 'pointer',
          background: isOpen ? 'var(--bg3)' : 'var(--blue-dim)',
          border: isOpen ? '1px solid var(--blue)' : '1px solid rgba(56, 189, 248, 0.25)',
          transition: 'all 0.15s',
          fontSize: 12,
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'var(--blue-dim)';
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
          }
        }}
      >
        <span style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          color: currentValue ? 'var(--text)' : 'var(--text3)',
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          fontWeight: 500,
          flex: 1,
          minWidth: 0
        }}>
          {currentValue || 'Select Size...'}
        </span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
          {canEdit && currentValue && (
            <button
              type="button"
              className="erp-panel-size-del-btn"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(unit);
              }}
              title="Remove Panel Size, Code & IP Rating"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                color: 'var(--text3)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm, 4px)',
                opacity: 0.5,
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'var(--red-dim)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.background = 'none'; }}
            >
              <Trash2 size={12} />
            </button>
          )}
          <ChevronDown size={12} style={{ color: 'var(--blue)', flexShrink: 0, opacity: 0.9 }} />
        </div>
      </div>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: coords.top,
            bottom: coords.bottom,
            left: coords.left,
            width: Math.max(coords.width, 380),
            zIndex: 99999,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 12px 28px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: coords.maxHeight || 370,
            animation: 'fadeIn 0.12s ease'
          }}
        >
          {/* Search Input */}
          <div style={{
            padding: '8px 10px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg3)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <Search size={13} style={{ color: 'var(--blue)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type to filter dimensions..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setHighlightIndex(0);
              }}
              onKeyDown={handleKeyDown}
              style={{
                background: 'none',
                border: 'none',
                outline: 'none',
                color: 'var(--text)',
                fontSize: 12,
                width: '100%',
                fontFamily: 'var(--font-mono)'
              }}
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setHighlightIndex(0); }}
                style={{
                  background: 'none', border: 'none', color: 'var(--text3)',
                  cursor: 'pointer', padding: 0, display: 'flex'
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {canEdit && currentValue && (
            <div
              onClick={() => {
                setIsOpen(false);
                onDelete?.(unit);
              }}
              style={{
                padding: '7px 10px',
                borderBottom: '1px solid var(--border)',
                background: 'rgba(248, 113, 113, 0.08)',
                color: 'var(--red)',
                cursor: 'pointer',
                fontSize: 11.5,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(248, 113, 113, 0.16)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)'; }}
            >
              <Trash2 size={12} />
              <span>Clear / Unassign Panel Size</span>
            </div>
          )}

          {/* Catalog Options List */}
          <div style={{
            overflowY: 'auto',
            padding: '4px',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            <div style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'var(--text3)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '4px 8px 2px 8px'
            }}>
              Master Dimensions ({matchedMasters.length})
            </div>

            {options.map((opt, idx) => {
              const isSelected = opt.size_name === currentValue;
              const isHighlighted = idx === highlightIndex;
              const hasMeta = Boolean(opt.panel_code || opt.ip_rating || opt.comments || opt.description);

              return (
                <div
                  key={opt.id || opt.size_name || idx}
                  onClick={() => handleSelect(opt.size_name)}
                  onMouseEnter={() => setHighlightIndex(idx)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 'var(--radius-sm, 4px)',
                    cursor: 'pointer',
                    background: isHighlighted ? 'rgba(56, 189, 248, 0.18)' : (isSelected ? 'var(--blue-dim)' : 'transparent'),
                    border: isHighlighted ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid transparent',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    transition: 'background 0.1s'
                  }}
                >
                  {hasMeta ? (
                    <>
                      {/* Row 1: Panel Code, Green IP Rating, Comments / Single Door, and Checkmark */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flexWrap: 'wrap' }}>
                          {opt.panel_code && (
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10.5,
                              fontWeight: 700,
                              color: 'var(--purple)',
                              background: 'var(--purple-dim)',
                              border: '1px solid rgba(168, 85, 247, 0.3)',
                              padding: '1px 5px',
                              borderRadius: 'var(--radius-sm, 4px)',
                              flexShrink: 0
                            }}>
                              {renderHighlighted(opt.panel_code, cleanQ)}
                            </span>
                          )}
                          {opt.ip_rating && (
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 10.5,
                              fontWeight: 600,
                              color: '#10b981',
                              background: 'rgba(16, 185, 129, 0.12)',
                              border: '1px solid rgba(16, 185, 129, 0.28)',
                              padding: '1px 5px',
                              borderRadius: 4,
                              flexShrink: 0
                            }}>
                              {renderHighlighted(opt.ip_rating, cleanQ)}
                            </span>
                          )}
                          {(opt.comments || opt.description) && (
                            <span style={{
                              fontSize: 11,
                              fontWeight: 500,
                              color: isHighlighted ? 'var(--text)' : 'var(--text2)',
                              fontStyle: opt.isCustom ? 'italic' : 'normal',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 220
                            }} title={opt.comments || opt.description}>
                              {renderHighlighted(opt.comments || opt.description, cleanQ)}
                            </span>
                          )}
                        </div>
                        {isSelected && <Check size={13} style={{ color: '#10b981', flexShrink: 0 }} />}
                      </div>

                      {/* Row 2: Panel Dimensions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingLeft: 1 }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: 12,
                          fontWeight: 600,
                          color: isHighlighted ? 'var(--blue)' : 'var(--text)'
                        }}>
                          {opt.isCustom ? `+ Use: "${opt.size_name}"` : renderHighlighted(opt.panel_size || opt.size_name, cleanQ)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 12,
                        fontWeight: 600,
                        color: isHighlighted ? 'var(--blue)' : 'var(--text)'
                      }}>
                        {renderHighlighted(opt.panel_size || opt.size_name, cleanQ)}
                      </span>
                      {isSelected && <Check size={13} style={{ color: 'var(--green)', flexShrink: 0 }} />}
                    </div>
                  )}
                </div>
              );
            })}

            {options.length === 0 && (
              <div style={{
                padding: '12px 10px',
                textAlign: 'center',
                color: 'var(--text3)',
                fontSize: 12
              }}>
                No matching sizes found.
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

export default PanelSizeComboboxCell;
