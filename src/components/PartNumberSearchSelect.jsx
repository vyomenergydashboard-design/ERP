import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Plus, X, Check, FileText } from 'lucide-react';

export default function PartNumberSearchSelect({
  value = '',
  onChange,
  partMasters = [],
  placeholder = 'Select or type Part #...',
  onAddNew,
  required = false,
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Sync internal search term when external value changes
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Find currently selected part master object
  const selectedPart = useMemo(() => {
    if (!value) return null;
    return partMasters.find(p => p.part_number === value) || null;
  }, [value, partMasters]);

  // Filter part masters based on what user has typed
  const filteredParts = useMemo(() => {
    if (!searchTerm.trim()) return partMasters;
    const query = searchTerm.trim().toLowerCase();
    return partMasters.filter(p => {
      const partNo = (p.part_number || '').toLowerCase();
      const desc = (p.description || '').toLowerCase();
      const client = (p.client_name || '').toLowerCase();
      const project = (p.project || '').toLowerCase();
      return partNo.includes(query) || desc.includes(query) || client.includes(query) || project.includes(query);
    });
  }, [partMasters, searchTerm]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
        // If user typed something that isn't selected, reset to current value if any
        if (value) {
          setSearchTerm(value);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value]);

  // Keep highlighted item in view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const itemEl = listRef.current.children[highlightedIndex];
      if (itemEl) {
        itemEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (part) => {
    setSearchTerm(part.part_number);
    onChange?.(part.part_number, part);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setSearchTerm('');
    onChange?.('', null);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleInputChange = (e) => {
    const newText = e.target.value;
    setSearchTerm(newText);
    setIsOpen(true);
    setHighlightedIndex(0);

    // If exact match exists, we can keep track, but let user select explicitly or press Enter
    const exactMatch = partMasters.find(p => p.part_number?.toLowerCase() === newText.trim().toLowerCase());
    if (exactMatch && newText.trim() === exactMatch.part_number) {
      onChange?.(exactMatch.part_number, exactMatch);
    } else if (value && newText.trim() !== value) {
      // User is typing something else, clear selected part until chosen
      onChange?.('', null);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      if (filteredParts.length > 0) {
        setHighlightedIndex(0);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const next = prev + 1;
        return next >= filteredParts.length ? 0 : next;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => {
        const next = prev - 1;
        return next < 0 ? filteredParts.length - 1 : next;
      });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredParts.length) {
        handleSelect(filteredParts[highlightedIndex]);
      } else if (filteredParts.length === 0 && searchTerm.trim() && onAddNew) {
        onAddNew(searchTerm.trim());
        setIsOpen(false);
      }
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      setIsOpen(false);
      setHighlightedIndex(-1);
      if (value) {
        setSearchTerm(value);
      }
    }
  };

  const handleTriggerAddNew = (e) => {
    e.stopPropagation();
    onAddNew?.(searchTerm.trim());
    setIsOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (!disabled) {
      if (!isOpen) {
        inputRef.current?.focus();
      }
      setIsOpen(!isOpen);
    }
  };

  // Check if typed search term does not match any existing part
  const hasNoMatch = searchTerm.trim() && filteredParts.length === 0;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for HTML5 required form validation if empty */}
      <input
        type="text"
        required={required}
        value={value || ''}
        onChange={() => {}}
        style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, width: 0 }}
        tabIndex={-1}
      />

      {/* Standard Form Input Wrapper matching exact form-input / form-select format */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        <input
          ref={inputRef}
          type="text"
          className="form-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          disabled={disabled}
          autoComplete="off"
          style={{
            paddingRight: (value || searchTerm) ? '54px' : '32px',
            fontFamily: value ? 'var(--font-mono)' : 'inherit',
            fontWeight: value ? 600 : 'normal'
          }}
        />

        {/* Action icons on right side */}
        <div style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          pointerEvents: 'auto'
        }}>
          {(value || searchTerm) && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              title="Clear selection"
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: 'var(--text3)',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '3px'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={toggleDropdown}
            title="Open part number list"
            tabIndex={-1}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: 'var(--text3)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronDown
              size={15}
              style={{
                transform: isOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s ease'
              }}
            />
          </button>
        </div>
      </div>

      {/* Hint if typed something not in master and dropdown is closed */}
      {!isOpen && hasNoMatch && onAddNew && (
        <div style={{ marginTop: '3px', fontSize: '11px' }}>
          <button
            type="button"
            onClick={handleTriggerAddNew}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--blue)',
              padding: 0,
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 500,
              textDecoration: 'underline'
            }}
          >
            + Register "{searchTerm.trim()}" in Master Data
          </button>
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: 'var(--bg2)',
            border: '1px solid var(--border2)',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
            zIndex: 1050,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* Options list */}
          <div
            ref={listRef}
            style={{
              maxHeight: '230px',
              overflowY: 'auto',
              padding: '4px'
            }}
          >
            {filteredParts.length > 0 ? (
              filteredParts.map((part, idx) => {
                const isSelected = part.part_number === value;
                const isHighlighted = idx === highlightedIndex;
                const docCount = part.documents?.length || 0;

                return (
                  <div
                    key={part.id || part.part_number}
                    onClick={() => handleSelect(part)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    style={{
                      padding: '7px 10px',
                      borderRadius: '6px',
                      background: isHighlighted
                        ? 'var(--bg3)'
                        : (isSelected ? 'rgba(59, 130, 246, 0.1)' : 'transparent'),
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '1px',
                      transition: 'background 0.1s ease'
                    }}
                  >
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          fontSize: '12px',
                          color: isSelected ? 'var(--blue)' : 'var(--text)'
                        }}>
                          {part.part_number}
                        </span>
                        {part.category && (
                          <span style={{
                            fontSize: '9px',
                            padding: '1px 5px',
                            borderRadius: '3px',
                            background: part.category === 'Standard' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: part.category === 'Standard' ? '#10b981' : '#f59e0b',
                            fontWeight: 600
                          }}>
                            {part.category}
                          </span>
                        )}
                        {docCount > 0 && (
                          <span style={{
                            fontSize: '9px',
                            padding: '1px 4px',
                            borderRadius: '3px',
                            background: 'rgba(16, 185, 129, 0.1)',
                            color: '#10b981',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px'
                          }}>
                            <FileText size={9} />
                            {docCount} drawing{docCount === 1 ? '' : 's'}
                          </span>
                        )}
                      </div>
                      {part.description && (
                        <div style={{
                          fontSize: '11px',
                          color: 'var(--text3)',
                          marginTop: '2px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {part.description}
                        </div>
                      )}
                      {(part.client_name || part.project) && (
                        <div style={{
                          fontSize: '10px',
                          color: 'var(--text3)',
                          opacity: 0.75,
                          marginTop: '1px'
                        }}>
                          {[part.client_name, part.project].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>

                    {isSelected && (
                      <Check size={14} style={{ color: 'var(--blue)', flexShrink: 0 }} />
                    )}
                  </div>
                );
              })
            ) : (
              <div style={{ padding: '14px 10px', textAlign: 'center', color: 'var(--text3)', fontSize: '12px' }}>
                <div style={{ marginBottom: '8px' }}>
                  No master parts match <strong>"{searchTerm}"</strong>
                </div>
                {onAddNew && (
                  <button
                    type="button"
                    onClick={handleTriggerAddNew}
                    style={{
                      background: 'var(--blue, #3b82f6)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '5px',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Plus size={13} />
                    <span>Create "{searchTerm.trim()}" in Master</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Bottom Add New Master Action */}
          {onAddNew && (
            <div style={{
              padding: '6px 10px',
              borderTop: '1px solid var(--border)',
              background: 'var(--bg3)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                type="button"
                onClick={handleTriggerAddNew}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--blue)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '2px 0',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={13} />
                <span>Add New Part Number to Master...</span>
              </button>
              <span style={{ fontSize: '10px', color: 'var(--text3)' }}>
                {filteredParts.length} available
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
