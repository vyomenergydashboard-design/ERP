import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { User, Users, Search, X, Check, ChevronDown } from 'lucide-react';

/**
 * WiremenMultiSelect
 * High-density multi-wiremen cell editor & display.
 * 
 * Invariants:
 * 1. Cell rhythm is strictly maintained: single-line compact height (24px max),
 *    no vertical expansion, no jagged table rows.
 * 2. Visual summary:
 *    - 0 assigned: "+ Assign" (editable) or "—" (view-only)
 *    - 1 assigned: "[ 👤 Name ]"
 *    - 2+ assigned: "[ 👥 Name ] +N" with tooltip listing all assignees.
 * 3. Popover is rendered via React Portal into document.body to avoid clipping
 *    by table overflow-x/overflow-y scroll containers.
 * 4. Strictly restricted to registered wiremen from wiremen masters.
 */
export default function WiremenMultiSelect({
  value = '',
  wiremenList = [],
  canEdit = false,
  onSave,
  placeholder = 'Unassigned'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize initial value to array of trimmed unique names
  const currentAssignedList = useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) {
      return Array.from(new Set(
        value.map(v => typeof v === 'string' ? v.trim() : (v?.name ? String(v.name).trim() : '')).filter(Boolean)
      ));
    }
    if (typeof value === 'string') {
      return Array.from(new Set(
        value.split(',').map(s => s.trim()).filter(Boolean)
      ));
    }
    return [];
  }, [value]);

  // Working state when popover is open
  const [selectedList, setSelectedList] = useState(currentAssignedList);

  // Sync working state when prop changes while closed
  useEffect(() => {
    if (!isOpen) {
      setSelectedList(currentAssignedList);
    }
  }, [currentAssignedList, isOpen]);

  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const searchInputRef = useRef(null);

  // Calculate portal popup position
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverWidth = 310;
    const popoverHeight = 320;

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 12) {
      left = Math.max(12, window.innerWidth - popoverWidth - 12);
    }

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const opensUpward = spaceBelow < popoverHeight && spaceAbove > spaceBelow;

    setCoords({
      top: opensUpward ? 'auto' : rect.bottom + 4,
      bottom: opensUpward ? window.innerHeight - rect.top + 4 : 'auto',
      left: Math.max(10, left),
      width: popoverWidth,
      maxHeight: opensUpward ? Math.min(spaceAbove - 16, popoverHeight) : Math.min(spaceBelow - 16, popoverHeight),
      opensUpward
    });
  }, []);

  const handleOpen = (e) => {
    if (!canEdit) return;
    e.stopPropagation();
    e.preventDefault();

    if (isOpen) {
      handleClose();
      return;
    }

    setSelectedList(currentAssignedList);
    setSearchQuery('');
    updatePosition();
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleApply = (e) => {
    e?.stopPropagation?.();
    const finalVal = selectedList.join(', ');
    onSave?.(finalVal);
    setIsOpen(false);
  };

  const handleToggleWireman = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setSelectedList(prev => {
      if (prev.includes(trimmed)) {
        return prev.filter(w => w !== trimmed);
      } else {
        return [...prev, trimmed];
      }
    });
  };

  const handleClearAll = (e) => {
    e?.stopPropagation?.();
    setSelectedList([]);
  };

  // Keyboard navigation & outside click dismissal
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) &&
          triggerRef.current && !triggerRef.current.contains(e.target)) {
        // Auto-save on outside click if selection changed
        const currentStr = currentAssignedList.join(', ');
        const workingStr = selectedList.join(', ');
        if (currentStr !== workingStr) {
          onSave?.(workingStr);
        }
        handleClose();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        handleClose();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        e.stopPropagation();
        handleApply();
      }
    };

    const handleScrollOrResize = () => {
      updatePosition();
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    // Auto-focus search input
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 40);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, selectedList, currentAssignedList, onSave, updatePosition]);

  // Build full list of selectable wiremen from masters
  const allWiremenOptions = useMemo(() => {
    const list = [];
    const seen = new Set();

    // Populate all from wiremenList
    (wiremenList || []).forEach(w => {
      const name = typeof w === 'string' ? w.trim() : (w?.name ? String(w.name).trim() : '');
      const exp = typeof w === 'object' && w.experience ? String(w.experience).trim() : '';
      if (name && !seen.has(name)) {
        seen.add(name);
        list.push({ id: w.id || name, name, experience: exp });
      }
    });

    // If unit already has a historically assigned wireman not in masters, preserve it for toggle
    selectedList.forEach(name => {
      if (name && !seen.has(name)) {
        seen.add(name);
        list.push({ id: `existing-${name}`, name, experience: '' });
      }
    });

    return list;
  }, [wiremenList, selectedList]);

  // Filter wiremen by query
  const filteredWiremen = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return allWiremenOptions;
    return allWiremenOptions.filter(w => 
      w.name.toLowerCase().includes(q) || (w.experience && w.experience.toLowerCase().includes(q))
    );
  }, [allWiremenOptions, searchQuery]);

  // Tooltip content for table cell
  const cellTooltip = useMemo(() => {
    if (currentAssignedList.length === 0) return 'Wiremen: Unassigned';
    if (currentAssignedList.length === 1) return `Wireman: ${currentAssignedList[0]}`;
    return `Assigned Wiremen (${currentAssignedList.length}):\n` +
      currentAssignedList.map((w, idx) => `${idx + 1}. ${w}`).join('\n') +
      (canEdit ? '\n\nClick to edit wiremen' : '');
  }, [currentAssignedList, canEdit]);

  // First wireman & remaining count
  const firstWireman = currentAssignedList[0] || '';
  const remainingCount = currentAssignedList.length - 1;

  return (
    <>
      {/* Table Cell Trigger - Strict single-line compact container */}
      <div
        ref={triggerRef}
        onClick={handleOpen}
        title={cellTooltip}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          maxWidth: '100%',
          height: '24px',
          maxHeight: '24px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          cursor: canEdit ? 'pointer' : 'default',
          userSelect: 'none',
          verticalAlign: 'middle'
        }}
      >
        {currentAssignedList.length === 0 ? (
          canEdit ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 7px',
                fontSize: 11,
                fontWeight: 500,
                borderRadius: 'var(--radius-sm, 4px)',
                background: 'rgba(255, 255, 255, 0.03)',
                color: 'var(--text3, #94a3b8)',
                border: '1px dashed var(--border, rgba(255, 255, 255, 0.15))',
                transition: 'all 0.15s ease'
              }}
            >
              <User size={11} style={{ opacity: 0.7 }} />
              <span>{placeholder}</span>
              <ChevronDown size={10} style={{ opacity: 0.6 }} />
            </span>
          ) : (
            <span style={{ color: 'var(--text3)', fontSize: 12 }}>—</span>
          )
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 7px',
              fontSize: 11,
              fontWeight: 600,
              borderRadius: 'var(--radius-sm, 4px)',
              background: 'rgba(56, 189, 248, 0.12)',
              color: 'var(--blue, #38bdf8)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              transition: 'background 0.15s, border-color 0.15s'
            }}
          >
            {currentAssignedList.length > 1 ? (
              <Users size={12} style={{ flexShrink: 0, color: 'var(--blue)' }} />
            ) : (
              <User size={12} style={{ flexShrink: 0, color: 'var(--blue)' }} />
            )}
            
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {firstWireman}
            </span>

            {remainingCount > 0 && (
              <span
                style={{
                  flexShrink: 0,
                  fontSize: 10,
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: 999,
                  background: 'rgba(56, 189, 248, 0.25)',
                  color: 'var(--blue, #38bdf8)',
                  lineHeight: 1.2
                }}
              >
                +{remainingCount}
              </span>
            )}

            {canEdit && (
              <ChevronDown size={10} style={{ flexShrink: 0, opacity: 0.7, marginLeft: '1px' }} />
            )}
          </span>
        )}
      </div>

      {/* Floating Multi-Select Portal */}
      {isOpen && coords && createPortal(
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: coords.top !== 'auto' ? `${coords.top}px` : undefined,
            bottom: coords.bottom !== 'auto' ? `${coords.bottom}px` : undefined,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            maxHeight: `${coords.maxHeight}px`,
            background: 'var(--bg2, #0f172a)',
            border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
            borderRadius: 'var(--radius, 8px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(56, 189, 248, 0.15)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontSize: 12,
            color: 'var(--text, #f1f5f9)',
            animation: 'fadeIn 0.12s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
              background: 'var(--bg3, #1e293b)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={14} style={{ color: 'var(--blue, #38bdf8)' }} />
              <span style={{ fontWeight: 600, fontSize: 12 }}>Assign Wiremen</span>
              {selectedList.length > 0 && (
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: 999,
                    fontSize: 10,
                    fontWeight: 700,
                    background: 'rgba(56, 189, 248, 0.2)',
                    color: 'var(--blue, #38bdf8)'
                  }}
                >
                  {selectedList.length} selected
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleClose}
              title="Close (Esc)"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text3, #94a3b8)',
                cursor: 'pointer',
                padding: '2px',
                display: 'inline-flex',
                borderRadius: '4px'
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Search Box */}
          <div
            style={{
              padding: '8px 10px',
              borderBottom: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
              background: 'var(--bg2, #0f172a)'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm, 4px)',
                background: 'var(--bg, #0b1329)',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.15))'
              }}
            >
              <Search size={13} style={{ color: 'var(--text3, #94a3b8)', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registered wiremen..."
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text, #f1f5f9)',
                  fontSize: 12
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text3)',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Selected Chips Strip (if any selected) */}
          {selectedList.length > 0 && (
            <div
              style={{
                padding: '6px 10px',
                borderBottom: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
                background: 'rgba(56, 189, 248, 0.04)',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '4px',
                maxHeight: '65px',
                overflowY: 'auto'
              }}
            >
              {selectedList.map(name => (
                <span
                  key={name}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '1px 6px',
                    borderRadius: '12px',
                    fontSize: 10,
                    fontWeight: 500,
                    background: 'rgba(56, 189, 248, 0.16)',
                    color: 'var(--blue, #38bdf8)',
                    border: '1px solid rgba(56, 189, 248, 0.3)'
                  }}
                >
                  {name}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleWireman(name);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--blue, #38bdf8)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'inline-flex',
                      alignItems: 'center'
                    }}
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text3, #94a3b8)',
                  cursor: 'pointer',
                  fontSize: 10,
                  textDecoration: 'underline',
                  padding: '1px 4px',
                  alignSelf: 'center'
                }}
              >
                Clear all
              </button>
            </div>
          )}

          {/* Registered Wiremen Options List */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '4px 0',
              maxHeight: '220px'
            }}
          >
            {filteredWiremen.length === 0 ? (
              <div style={{ padding: '20px 12px', textAlign: 'center', color: 'var(--text3, #94a3b8)' }}>
                {searchQuery ? 'No matching wiremen found.' : 'No wiremen registered yet in Masters.'}
              </div>
            ) : (
              filteredWiremen.map(w => {
                const isChecked = selectedList.includes(w.name);
                return (
                  <div
                    key={w.id}
                    onClick={() => handleToggleWireman(w.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '7px 12px',
                      cursor: 'pointer',
                      background: isChecked ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                      borderLeft: isChecked ? '3px solid var(--blue, #38bdf8)' : '3px solid transparent',
                      transition: 'background 0.1s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isChecked) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isChecked) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div onClick
                        style={{ cursor: 'pointer', accentColor: 'var(--blue, #38bdf8)' }}
                      />
                      <span
                        style={{
                          fontWeight: isChecked ? 600 : 400,
                          color: isChecked ? 'var(--blue, #38bdf8)' : 'var(--text, #f1f5f9)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {w.name}
                      </span>
                    </div>

                    {w.experience && (
                      <span
                        style={{
                          fontSize: 10,
                          padding: '1px 5px',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: 'var(--text3, #94a3b8)',
                          flexShrink: 0,
                          marginLeft: '8px'
                        }}
                      >
                        {w.experience}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Actions */}
          <div
            style={{
              padding: '8px 12px',
              borderTop: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
              background: 'var(--bg3, #1e293b)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '8px'
            }}
          >
            <button
              type="button"
              onClick={handleClose}
              style={{
                padding: '4px 10px',
                fontSize: 11,
                background: 'transparent',
                border: '1px solid var(--border, rgba(255, 255, 255, 0.2))',
                borderRadius: 'var(--radius-sm, 4px)',
                color: 'var(--text3, #94a3b8)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApply}
              style={{
                padding: '5px 14px',
                fontSize: 11,
                fontWeight: 600,
                background: 'var(--blue, #38bdf8)',
                color: '#0b1329',
                border: 'none',
                borderRadius: 'var(--radius-sm, 4px)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              <Check size={12} strokeWidth={3} />
              <span>Apply</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
