import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import TechnicalDocsModal from './TechnicalDocsModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import EditRefTagModal from './EditRefTagModal.jsx';
import PurchaseNewOrderModal from './PurchaseNewOrderModal.jsx';
import PurchaseOrderReceivedModal from './PurchaseOrderReceivedModal.jsx';
import {
  Search, X, ArrowUpDown, ChevronUp, ChevronDown, Pin, GripVertical, RotateCcw, Check,
  UploadCloud, FileText, Trash2, ExternalLink, AlertCircle, Plus, FileCheck, Loader2,
  Eye, History, Download, Upload, CheckSquare, Square, Paperclip, Info, AlertTriangle,
  Edit2, Pause, PackageCheck
} from 'lucide-react';
import OrderDocumentsModal from './OrderDocumentsModal';
import { ToastContainer, useToast } from './Toast';
import { ConfirmModal } from './ConfirmModal';

const PRIORITY_ORDER = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

const PRIORITY_STYLES = {
  Urgent: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(248, 113, 113, 0.35)' },
  High: { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.35)' },
  Medium: { bg: 'rgba(234, 179, 8, 0.12)', color: '#eab308', border: 'rgba(234, 179, 8, 0.35)' },
  Low: { bg: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.35)' },
};

const STATUS_STYLES = {
  Completed: { bg: 'var(--green-dim)', color: 'var(--green)', border: 'rgba(16, 185, 129, 0.3)' },
  Blocked: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(248, 113, 113, 0.3)' },
  'In Progress': { bg: 'var(--blue-dim)', color: 'var(--blue)', border: 'rgba(56, 189, 248, 0.3)' },
  'In Process': { bg: 'var(--blue-dim)', color: 'var(--blue)', border: 'rgba(56, 189, 248, 0.3)' },
  Pending: { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.3)' },
  'Not Started': { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.3)' },
  Hold: { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.35)' },
  'On Hold': { bg: 'var(--orange-dim)', color: 'var(--orange)', border: 'rgba(249, 115, 22, 0.35)' },
  Cancelled: { bg: 'var(--red-dim)', color: 'var(--red)', border: 'rgba(248, 113, 113, 0.35)' },
};

const BASE_COLUMNS = [
  { key: 'order_number', label: 'Order #', align: 'left' },
  { key: 'short_serial', label: 'Serial No.', align: 'left', alias: 'unit_serial' },
  { key: 'company_name', label: 'Client', align: 'left' },
  { key: 'project_name', label: 'Project Name', align: 'left' },
  { key: 'po_number', label: 'PO Number', align: 'left' },
  { key: 'reference_number', label: 'Ref / Tag', align: 'left' },
  { key: 'end_client_name', label: 'End Client', align: 'left' },
  { key: 'part_number', label: 'Part Number', align: 'left' },
  { key: 'panel_code', label: 'Panel Code', align: 'center' },
  { key: 'panel_type_size', label: 'Panel Size', align: 'left' },
  { key: 'panel_ip_rating', label: 'IP Rating', align: 'center' },
  { key: 'panel_comments', label: 'Comments', align: 'left' },
  { key: 'material_description', label: 'Description', align: 'left' },
  { key: 'classification', label: 'Type (Design)', align: 'center' },
  { key: 'priority', label: 'Priority', align: 'center' },
  { key: 'delivery_date', label: 'Delivery', align: 'left' },
  { key: 'unit_status', label: 'Status', align: 'center' },
  { key: 'purchase_cat_panel', label: 'Panel (PO)', align: 'left', catKey: 'Panel' },
  { key: 'purchase_cat_automation', label: 'Automation (PO)', align: 'left', catKey: 'Automation' },
  { key: 'purchase_cat_low_voltage', label: 'Low Voltage (PO)', align: 'left', catKey: 'Low voltage' },
  { key: 'purchase_cat_wires', label: 'Wires & Acc. (PO)', align: 'left', catKey: 'Wires & Accessories' },
];

const DEFAULT_COLUMN_KEYS = BASE_COLUMNS.map(c => c.key);

const isDateTimeType = (type) => {
  if (!type) return false;
  const lower = String(type).trim().toLowerCase();
  return lower === 'date & time' || lower === 'datetime' || lower === 'date and time' || lower === 'date_and_time';
};

const isDateType = (type) => {
  if (!type) return false;
  const lower = String(type).trim().toLowerCase();
  return lower === 'date';
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatFastDate = (val) => {
  if (!val) return '—';
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const parts = val.split('-');
    const mIdx = parseInt(parts[1], 10) - 1;
    return `${parseInt(parts[2], 10)} ${MONTH_NAMES[mIdx] || parts[1]} ${parts[0]}`;
  }
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
};

const formatFastDateTime = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const day = d.getDate();
  const month = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

const formatCustomDateTime = formatFastDateTime;
const formatCustomDate = formatFastDate;

const DEFAULT_COL_WIDTHS = {
  order_number: 145,
  short_serial: 160,
  company_name: 215,
  project_name: 215,
  po_number: 195,
  reference_number: 185,
  end_client_name: 165,
  part_number: 195,
  panel_code: 145,
  panel_type_size: 195,
  panel_ip_rating: 130,
  panel_comments: 230,
  material_description: 260,
  classification: 225,
  priority: 140,
  delivery_date: 155,
  unit_status: 235,
  purchase_cat_panel: 170,
  purchase_cat_automation: 175,
  purchase_cat_low_voltage: 175,
  purchase_cat_wires: 185,
};

const MIN_COL_WIDTHS = {
  order_number: 135,
  short_serial: 145,
  company_name: 180,
  project_name: 180,
  po_number: 175,
  reference_number: 165,
  end_client_name: 145,
  part_number: 175,
  panel_code: 130,
  panel_type_size: 175,
  panel_ip_rating: 120,
  panel_comments: 190,
  material_description: 220,
  classification: 200,
  priority: 130,
  delivery_date: 140,
  unit_status: 195,
  purchase_cat_panel: 140,
  purchase_cat_automation: 140,
  purchase_cat_low_voltage: 140,
  purchase_cat_wires: 150,
};

export const getDocUrl = (doc) => {
  if (!doc) return '#';
  let pathStr = typeof doc === 'string' ? doc : (doc.file_path || doc.filePath || doc.file_name || '');
  if (!pathStr) return '#';

  pathStr = pathStr.replace(/\\/g, '/');
  const uploadsIdx = pathStr.indexOf('uploads/');
  let relPath = '';
  if (uploadsIdx !== -1) {
    relPath = pathStr.substring(uploadsIdx + 8);
  } else {
    relPath = pathStr.split('/').pop();
  }
  relPath = relPath.replace(/^\/+/, '');

  const authToken = localStorage.getItem('token');
  const tokenParam = authToken ? `?token=${encodeURIComponent(authToken)}` : '';
  const baseUrl = window.API_BASE || '';

  return `${baseUrl}/uploads/${relPath}${tokenParam}`;
};

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

// TechnicalDocsModal has been modularized and extracted to src/components/TechnicalDocsModal.jsx

const isStatusDone = (st) => {
  if (!st) return false;
  const s = String(st).trim().toLowerCase();
  return s === 'done' || s === 'completed' || s === 'complete';
};

const isStatusInProgress = (st) => {
  if (!st) return false;
  const s = String(st).trim().toLowerCase();
  return s === 'inprogress' || s === 'in progress' || s === 'in process' || s === 'review';
};

function calculateUnitStatus(unit, currentFilter, userRole) {
  if (!unit) return 'Pending';

  const rawUnitStatus = String(unit.unit_status || unit.status || '').trim().toLowerCase();
  const rawHoldStatus = String(unit.hold_status || '').trim().toLowerCase();
  const rawOrderStatus = String(unit.order_status || '').trim().toLowerCase();

  // 1. Cancelled orders/units
  if (
    rawUnitStatus === 'cancelled' || rawUnitStatus === 'canceled' ||
    rawUnitStatus.startsWith('cancel') ||
    rawHoldStatus === 'cancelled' ||
    unit.hold_status === 'Cancelled' ||
    rawOrderStatus === 'cancelled' || rawOrderStatus === 'canceled'
  ) {
    return 'Cancelled';
  }

  // 2. Hold orders/units
  if (
    rawUnitStatus === 'hold' || rawUnitStatus === 'on hold' ||
    rawUnitStatus.startsWith('hold') ||
    rawHoldStatus === 'approved' || rawHoldStatus === 'hold' ||
    unit.hold_status === 'Hold' ||
    rawOrderStatus === 'hold' || rawOrderStatus === 'on hold'
  ) {
    return 'Hold';
  }

  if (rawUnitStatus === 'dispatched' || isStatusDone(rawUnitStatus)) return 'Completed';
  if (unit.dept_steps?.some(s => String(s.status).toLowerCase() === 'blocked')) return 'Blocked';

  const PIPELINE = ['Sales', 'Design', 'Purchase', 'Stores', 'Planning', 'Production', 'QC', 'Dispatch', 'Accounts'];
  const filterDeptIdx = PIPELINE.indexOf(currentFilter);
  const unitDeptIdx = PIPELINE.indexOf(unit.current_dept);

  if (filterDeptIdx !== -1) {
    if (unit.is_dept_completed === true || unit.is_downstream === true) {
      return 'Completed';
    }
    if (unitDeptIdx !== -1 && unitDeptIdx > filterDeptIdx) {
      return 'Completed';
    }
    if (currentFilter === 'Sales' && unit.current_dept && unit.current_dept !== 'Sales') {
      return 'Completed';
    }
  }

  // Design workflow evaluation
  const isDesignWorkflow = currentFilter === 'Design' || userRole?.toLowerCase() === 'design';
  const stepsToCheck = isDesignWorkflow
    ? (unit.dept_steps || unit.design_steps || [])
    : (unit.dept_steps || []);

  if (stepsToCheck && stepsToCheck.length > 0) {
    const allDone = stepsToCheck.every(s => isStatusDone(s.status));
    const releaseDocStep = stepsToCheck.find(s =>
      s.name === 'Release Documents' ||
      s.special === 'design' ||
      String(s.name || '').toLowerCase().includes('design')
    );
    const isReleaseDocDone = releaseDocStep && isStatusDone(releaseDocStep.status);

    if (allDone || (isDesignWorkflow && isReleaseDocDone)) {
      return 'Completed';
    }

    const hasStarted = stepsToCheck.some(s => isStatusDone(s.status) || isStatusInProgress(s.status));
    if (hasStarted) {
      return 'In Progress';
    }

    // In All Departments view, check overall factory step progress
    if (currentFilter === 'all') {
      const hasFactoryInprogress =
        Number(unit.inprogress_step_count || 0) > 0 ||
        Number(unit.order_inprogress_step_count || 0) > 0;
      if (hasFactoryInprogress) {
        return 'In Progress';
      }
    }

    return 'Pending';
  }

  const hasInprogress =
    Number(unit.inprogress_step_count || 0) > 0 ||
    Number(unit.order_inprogress_step_count || 0) > 0 ||
    unit.dept_steps?.some(s => isStatusInProgress(s.status));

  const hasDone =
    Number(unit.done_step_count || 0) > 0 ||
    Number(unit.order_done_step_count || 0) > 0 ||
    unit.dept_steps?.some(s => isStatusDone(s.status));

  if (hasInprogress || hasDone) {
    return 'In Progress';
  }

  return 'Pending';
}

function getCellTooltip(unit, colKey, status, customColumnDefs = []) {
  if (!unit) return undefined;
  switch (colKey) {
    case 'order_number':
      return [
        `Order #: ${unit.order_number}`,
        unit.company_name ? `Client: ${unit.company_name}${unit.company_city ? ` (${unit.company_city})` : ''}` : null,
        unit.project_name ? `Project: ${unit.project_name}` : null,
        unit.po_number ? `PO Number: ${unit.po_number}` : null,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        'Click to view Process Flow'
      ].filter(Boolean).join('\n');

    case 'short_serial':
    case 'unit_serial':
      return [
        `Serial Number: ${unit.unit_serial || unit.short_serial}`,
        `Order #: ${unit.order_number}`,
        unit.company_name ? `Client: ${unit.company_name}` : null,
        unit.part_number ? `Part No: ${unit.part_number}` : null,
        unit.material_description ? `Description: ${unit.material_description}` : null,
        'Click to view Process Flow for this Serial No.'
      ].filter(Boolean).join('\n');

    case 'po_number': {
      const hasPo = Boolean(unit.po_number);
      const hasPdf = Boolean(unit.po_file_path);
      return [
        hasPo ? `PO Number: ${unit.po_number}` : 'PO Number: Not Assigned',
        unit.po_file_name ? `Attached File: ${unit.po_file_name}` : null,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        unit.company_name ? `Client: ${unit.company_name}` : null,
        hasPdf ? 'Click to open PO Document' : null
      ].filter(Boolean).join('\n');
    }

    case 'reference_number': {
      const ref = (unit.reference_number || '').trim();
      const tag = (unit.tag || '').trim();
      const combined = (ref && tag) ? `${ref}/${tag}` : (ref || tag || '');
      return [
        ref ? `Customer Ref: ${ref}` : null,
        tag ? `Tag: ${tag}` : null,
        (!ref && !tag && combined) ? `Ref/Tag: ${combined}` : null,
        (!ref && !tag && !combined) ? 'Reference / Tag: Not Specified' : null,
        unit.indent_file_name ? `Attached File: ${unit.indent_file_name}` : null,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        unit.indent_file_path ? 'Click to open Details document' : null
      ].filter(Boolean).join('\n');
    }

    case 'part_number':
      return [
        unit.part_number ? `Part Number: ${unit.part_number}` : 'Part Number: Not Assigned',
        unit.material_description ? `Description: ${unit.material_description}` : null,
        unit.panel_type_size ? `Size: ${unit.panel_type_size}` : null,
        `Order #: ${unit.order_number}`,
        'Click to view Design Drawings & Technical Documents'
      ].filter(Boolean).join('\n');

    case 'panel_code':
      return [
        unit.panel_code ? `Panel Code: ${unit.panel_code}` : 'Panel Code: None',
        unit.panel_type_size ? `Panel Size: ${unit.panel_type_size}` : null,
        unit.panel_ip_rating ? `IP Rating: ${unit.panel_ip_rating}` : null,
        unit.panel_comments ? `Comments: ${unit.panel_comments}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'panel_type_size':
      return [
        unit.panel_type_size ? `Panel Size: ${unit.panel_type_size}` : 'Panel Size: Not Selected',
        unit.panel_code ? `Panel Code: ${unit.panel_code}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'panel_ip_rating':
      return [
        unit.panel_ip_rating ? `IP Rating: ${unit.panel_ip_rating}` : 'IP Rating: Not Specified',
        unit.panel_type_size ? `Size: ${unit.panel_type_size}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'panel_comments':
      return [
        unit.panel_comments ? `Comments: ${unit.panel_comments}` : 'Comments: None',
        unit.panel_type_size ? `Size: ${unit.panel_type_size}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'company_name':
      return [
        unit.company_name ? `Client: ${unit.company_name}` : null,
        unit.company_city ? `City: ${unit.company_city}` : null,
        unit.end_client_name ? `End Client: ${unit.end_client_name}` : null,
        unit.project_name ? `Project: ${unit.project_name}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'classification':
      return [
        `Type (Design): ${unit.classification || 'Standard'}`,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
      ].filter(Boolean).join('\n');

    case 'priority':
      return [
        `Priority: ${unit.priority || 'Medium'}`,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
      ].filter(Boolean).join('\n');

    case 'delivery_date': {
      const isOverdue = unit.delivery_date && new Date(unit.delivery_date) < new Date() && status !== 'Completed' && status !== 'Cancelled';
      return [
        unit.delivery_date ? `Delivery Date: ${formatFastDate(unit.delivery_date)}` : 'Delivery Date: TBD',
        isOverdue ? 'Status: OVERDUE' : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');
    }

    case 'unit_status': {
      if (status === 'Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold')) {
        let holdStep = unit.hold_step_name || (unit.unit_status?.replace(/^Hold @\s*/i, '')) || '';
        if (holdStep.trim().toLowerCase() === 'hold' || holdStep.trim().toLowerCase() === 'current step') holdStep = '';
        return [
          holdStep ? `Status: On Hold @ ${holdStep}` : 'Status: On Hold',
          `Held by: ${unit.held_by_name || 'User'} on ${unit.held_at ? formatFastDateTime(unit.held_at) : 'N/A'}`,
          `Reason: ${unit.hold_reason || 'No reason specified'}`,
          `Order #: ${unit.order_number}`,
          unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
        ].filter(Boolean).join('\n');
      }
      if (status === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel')) {
        let cancelStep = unit.cancelled_step_name || (unit.unit_status?.replace(/^Cancelled @\s*/i, '')) || '';
        if (cancelStep.trim().toLowerCase() === 'cancelled' || cancelStep.trim().toLowerCase() === 'cancel' || cancelStep.trim().toLowerCase() === 'current step') cancelStep = '';
        return [
          cancelStep ? `Status: Cancelled @ ${cancelStep}` : 'Status: Cancelled',
          `Cancelled by: ${unit.cancelled_by_name || 'User'} on ${unit.cancelled_at ? formatFastDateTime(unit.cancelled_at) : 'N/A'}`,
          `Reason: ${unit.cancelled_reason || 'No reason specified'}`,
          `Order #: ${unit.order_number}`,
          unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
        ].filter(Boolean).join('\n');
      }
      return [
        `Status: ${status}`,
        unit.current_dept ? `Department: ${unit.current_dept}` : null,
        Number(unit.inprogress_step_count || 0) > 0 ? `${unit.inprogress_step_count} step(s) in progress` : null,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        unit.company_name ? `Client: ${unit.company_name}` : null
      ].filter(Boolean).join('\n');
    }

    case 'material_description':
      return [
        unit.material_description ? `Description: ${unit.material_description}` : 'Description: None',
        unit.part_number ? `Part No: ${unit.part_number}` : null,
        `Order #: ${unit.order_number}`,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null
      ].filter(Boolean).join('\n');

    case 'project_name':
      return [
        unit.project_name ? `Project: ${unit.project_name}` : 'Project: None',
        unit.company_name ? `Client: ${unit.company_name}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    case 'end_client_name':
      return [
        unit.end_client_name ? `End Client: ${unit.end_client_name}` : 'End Client: Unspecified',
        unit.company_name ? `Client: ${unit.company_name}` : null,
        `Order #: ${unit.order_number}`
      ].filter(Boolean).join('\n');

    default: {
      const customCol = customColumnDefs?.find ? customColumnDefs.find(c => c.col_key === colKey) : customColumnDefs?.[colKey];
      const val = unit.custom_fields?.[colKey] ?? unit[colKey];
      if (customCol) {
        const displayVal = isDateTimeType(customCol.field_type) ? formatFastDateTime(val) : isDateType(customCol.field_type) ? formatFastDate(val) : (val || 'Not Specified');
        return [
          `${customCol.label || colKey}: ${displayVal}`,
          `Order #: ${unit.order_number}`
        ].filter(Boolean).join('\n');
      }
      return val ? String(val) : undefined;
    }
  }
}

function renderCellContent({
  unit,
  colKey,
  currentFilter,
  status,
  canEdit,
  canEditPanelSize,
  canUploadPo,
  canConfirmDesign,
  onConfirmDesignClassification,
  onUnconfirmDesignClassification,
  onRequestUnconfirmDesign,
  panelSizeMasters,
  panelSizeMap,
  customColumnDefs,
  editingCell,
  setEditingCell,
  onRowClick,
  onSaveInlineCell,
  onSingleUnitPoClick,
  onDeleteUnitPoDoc,
  onPartNumberClick,
  setPoPdfViewer,
  onEditRefTag,
  onOpenOrderDocs,
  onDeletePanelSize,
  purchaseOrdersBySerialAndCat,
  canEditPurchaseNA,
  onTogglePurchaseCatNA
}) {
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['In Progress'];
  const priority = unit.priority || 'Medium';
  const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
  const isOverdue = unit.delivery_date && new Date(unit.delivery_date) < new Date() && status !== 'Completed' && status !== 'Cancelled';
  const effectiveUnitId = unit.unit_id || unit.id;

  switch (colKey) {
    case 'order_number': {
      return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexWrap: 'nowrap' }}>
          <span
            className="erp-order-badge"
            onClick={(e) => { e.stopPropagation(); onRowClick(unit.order_id, effectiveUnitId); }}
          >
            {unit.order_number}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenOrderDocs?.({
                orderId: unit.order_id,
                orderNumber: unit.order_number,
                clientName: unit.company_name,
                projectName: unit.project_name
              });
            }}
            title={`Order Documents (${unit.order_number}) - Click to open Quotation, Details & Docs`}
            style={{
              background: 'var(--blue-dim)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              cursor: 'pointer',
              padding: '2px 4px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--blue)',
              borderRadius: 'var(--radius-sm, 4px)',
              transition: 'all 0.15s',
              lineHeight: 1
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(56, 189, 248, 0.22)';
              e.currentTarget.style.borderColor = 'var(--blue)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--blue-dim)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.25)';
            }}
          >
            <Paperclip size={11} />
          </button>
        </div>
      );
    }

    case 'short_serial':
    case 'unit_serial': {
      return (
        <div
          onClick={(e) => { e.stopPropagation(); onRowClick(unit.order_id, effectiveUnitId); }}
          style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
        >
          <span className="erp-serial-badge">
            {unit.unit_serial}
          </span>
        </div>
      );
    }

    case 'company_name': {
      return (
        <div
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{unit.company_name || '—'}</span>
          {unit.company_city && <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 11, marginLeft: 4 }}>· {unit.company_city}</span>}
        </div>
      );
    }

    case 'classification': {
      const clsVal = unit.classification || 'Standard';
      const isConfirmed = Boolean(unit.design_confirmed);
      const isStd = clsVal.toLowerCase() === 'standard';
      const isDesign = (currentFilter || '').toLowerCase() === 'design';
      const groupCls = `design-type-control-group ${isStd ? 'standard' : 'non-standard'}${isDesign && isConfirmed ? ' is-confirmed' : ''}${!isDesign ? ' plain' : ''}`;

      return (
        <div
          className={groupCls}
          onClick={(e) => e.stopPropagation()}
        >
          {canEdit ? (
            <select
              value={clsVal}
              onChange={(e) => onSaveInlineCell(unit, 'classification', e.target.value)}
              className="design-type-select"
              title="Panel Design Classification (Standard / Non-Standard)"
            >
              <option value="Standard" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>Standard</option>
              <option value="Non-Standard" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>Non-Standard</option>
            </select>
          ) : (
            <span
              className="design-type-static-label"
              title="Panel Design Classification"
            >
              {clsVal}
            </span>
          )}

          {isDesign && (
            isConfirmed ? (
              <button
                type="button"
                className={`btn-confirmed-indicator${canConfirmDesign ? ' can-reset' : ''}`}
                title={unit.design_confirmed_at ? `Confirmed by ${unit.design_confirmed_by_name || 'Design'} on ${formatFastDateTime(unit.design_confirmed_at)}${canConfirmDesign ? ' (Click to reset sign-off)' : ''}` : `Confirmed by Design${canConfirmDesign ? ' (Click to reset sign-off)' : ''}`}
                onClick={() => {
                  if (canConfirmDesign) {
                    if (onRequestUnconfirmDesign) {
                      onRequestUnconfirmDesign(unit);
                    } else {
                      onUnconfirmDesignClassification?.(unit);
                    }
                  }
                }}
              >
                <Check size={11} strokeWidth={2.8} />
                <span>Confirmed</span>
              </button>
            ) : canConfirmDesign ? (
              <button
                type="button"
                className="btn-confirm-action"
                onClick={() => onConfirmDesignClassification?.(unit)}
                title="Click to sign off & confirm Design classification"
              >
                <span>Confirm</span>
              </button>
            ) : (
              <span
                className="design-unconfirmed-indicator"
                title="Awaiting Design Confirmation"
              >
                Unconfirmed
              </span>
            )
          )}
        </div>
      );
    }

    case 'priority': {
      const pLower = (priority || 'medium').toLowerCase();
      if (canEdit) {
        return (
          <select
            value={priority}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSaveInlineCell(unit, 'priority', e.target.value)}
            className={`erp-priority-select ${pLower}`}
          >
            <option value="Urgent" style={{ background: 'var(--bg3)', color: 'var(--red)' }}>Urgent</option>
            <option value="High" style={{ background: 'var(--bg3)', color: 'var(--orange)' }}>High</option>
            <option value="Medium" style={{ background: 'var(--bg3)', color: '#eab308' }}>Medium</option>
            <option value="Low" style={{ background: 'var(--bg3)', color: 'var(--blue)' }}>Low</option>
          </select>
        );
      }
      return (
        <span className={`erp-priority-pill ${pLower}`}>
          {priority}
        </span>
      );
    }

    case 'unit_status': {
      if (status === 'Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold')) {
        let holdStep = unit.hold_step_name || (unit.unit_status?.replace(/^Hold @\s*/i, '')) || '';
        if (holdStep.trim().toLowerCase() === 'hold' || holdStep.trim().toLowerCase() === 'current step') holdStep = '';
        return (
          <span className="erp-status-pill hold">
            <Pause size={10} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }} /> {holdStep ? `Hold @ ${holdStep}` : 'On Hold'}
          </span>
        );
      }
      if (status === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel')) {
        let cancelStep = unit.cancelled_step_name || (unit.unit_status?.replace(/^Cancelled @\s*/i, '')) || '';
        if (cancelStep.trim().toLowerCase() === 'cancelled' || cancelStep.trim().toLowerCase() === 'cancel' || cancelStep.trim().toLowerCase() === 'current step') cancelStep = '';
        return (
          <span className="erp-status-pill cancelled">
            <X size={10} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 2 }} /> {cancelStep ? `Cancelled @ ${cancelStep}` : 'Cancelled'}
          </span>
        );
      }

      const stLower = String(status).toLowerCase();
      let statusClass = 'pending';
      let icon = '●';
      if (stLower === 'done' || stLower === 'completed' || stLower === 'complete') {
        statusClass = 'completed';
        icon = '✓';
      } else if (stLower === 'inprogress' || stLower === 'in progress' || stLower === 'in process' || stLower === 'review') {
        statusClass = 'inprogress';
        icon = '●';
      } else if (stLower === 'blocked') {
        statusClass = 'blocked';
        icon = '⚠';
      }

      return (
        <span className={`erp-status-pill ${statusClass}`}>
          <span>{icon}</span> {status}
        </span>
      );
    }

    case 'delivery_date':
      const isEditingDate = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === 'delivery_date';
      if (isEditingDate) {
        return (
          <input
            type="date"
            autoFocus
            value={unit.delivery_date ? unit.delivery_date.split('T')[0] : ''}
            onChange={(e) => onSaveInlineCell(unit, 'delivery_date', e.target.value)}
            onBlur={() => setEditingCell(null)}
            style={{
              padding: '2px 4px', fontSize: 11, background: 'var(--bg3)',
              color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4
            }}
          />
        );
      }

      return (
        <span
          onClick={(e) => {
            if (canEdit) {
              e.stopPropagation();
              setEditingCell({ unitId: effectiveUnitId, colKey: 'delivery_date', value: unit.delivery_date });
            }
          }}
          style={{
            color: isOverdue ? 'var(--red)' : 'var(--text2)',
            fontWeight: isOverdue ? 600 : 400,
            fontSize: 12,
            cursor: canEdit ? 'pointer' : 'default'
          }}
        >
          {formatFastDate(unit.delivery_date)}
          {isOverdue && <span style={{ fontSize: 9, color: 'var(--red)', fontWeight: 700, marginLeft: 5, background: 'var(--red-dim)', borderRadius: 'var(--radius-sm, 4px)', padding: '1px 5px' }}>OVERDUE</span>}
        </span>
      );

    case 'part_number': {
      const hasPart = Boolean(unit.part_number);

      return (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onPartNumberClick(unit);
          }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            color: hasPart ? 'var(--blue)' : 'var(--text3)',
            cursor: 'pointer',
            textDecoration: hasPart ? 'underline' : 'none'
          }}
        >
          {unit.part_number || '—'}
        </span>
      );
    }

    case 'panel_code': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMap?.get ? panelSizeMap.get(currentSize) : panelSizeMasters.find(m =>
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const code = unit.panel_code || master?.panel_code;

      return code ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11.5,
              fontWeight: 700,
              color: 'var(--purple)',
              background: 'var(--purple-dim)',
              border: '1px solid rgba(168, 85, 247, 0.28)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm, 4px)',
              display: 'inline-block'
            }}
          >
            {code}
          </span>
          {canEditPanelSize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePanelSize?.(unit);
              }}
              title="Remove Panel Size, Code & IP Rating"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
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
        </div>
      ) : (
        <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
      );
    }

    case 'panel_type_size':
      return (
        <PanelSizeComboboxCell
          unit={unit}
          panelSizeMasters={panelSizeMasters}
          canEdit={canEditPanelSize}
          onSave={(newSize) => onSaveInlineCell(unit, 'panel_type_size', newSize)}
          onDelete={onDeletePanelSize}
        />
      );

    case 'panel_ip_rating': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMap?.get ? panelSizeMap.get(currentSize) : panelSizeMasters.find(m =>
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const ip = unit.panel_ip_rating || master?.ip_rating;
      return ip ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              fontWeight: 600,
              color: 'var(--green)',
              background: 'var(--green-dim)',
              border: '1px solid rgba(16, 185, 129, 0.28)',
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm, 4px)',
              display: 'inline-block'
            }}
          >
            {ip}
          </span>
          {canEditPanelSize && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePanelSize?.(unit);
              }}
              title="Remove Panel Size, Code & IP Rating"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px 4px',
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
        </div>
      ) : (
        <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
      );
    }

    case 'panel_comments': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMap?.get ? panelSizeMap.get(currentSize) : panelSizeMasters.find(m =>
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const comment = unit.panel_comments || master?.comments || master?.description;
      return comment ? (
        <span style={{ color: 'var(--text2)', fontSize: 12 }}>
          {comment}
        </span>
      ) : (
        <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
      );
    }

    case 'po_number': {
      const hasPoNum = Boolean(unit.po_number);
      const hasPdf = Boolean(unit.po_file_path);

      const poTooltip = [
        unit.po_number ? `PO Number: ${unit.po_number}` : 'PO Number: Not Assigned',
        unit.po_file_name ? `Attached File: ${unit.po_file_name}` : null,
        unit.order_number ? `Order #: ${unit.order_number}` : null,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        unit.company_name ? `Client: ${unit.company_name}` : null,
        hasPdf ? 'Click to view PO in PDF' : (canUploadPo ? 'Click to edit PO / Upload' : null)
      ].filter(Boolean).join('\n');

      if (editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === 'po_number') {
        return (
          <input
            autoFocus
            defaultValue={editingCell.value || ''}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={() => onSaveInlineCell(unit, 'po_number', editingCell.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveInlineCell(unit, 'po_number', editingCell.value);
              if (e.key === 'Escape') setEditingCell(null);
            }}
            style={{
              width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
              color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
            }}
          />
        );
      }

      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6, width: '100%', minWidth: 0 }} title={poTooltip}>
          {hasPoNum ? (
            hasPdf ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPoPdfViewer({
                    unit: unit,
                    file_path: unit.po_file_path,
                    file_name: unit.po_file_name || `${unit.po_number}.pdf`,
                    title: `PO Document - ${unit.po_number}`,
                    subtitle: `Serial: ${unit.short_serial || unit.unit_serial} | Order: ${unit.order_number}`
                  });
                }}
                title={poTooltip}
                style={{
                  background: 'var(--blue-dim)',
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  borderRadius: 'var(--radius-sm, 4px)',
                  padding: '2px 7px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  color: 'var(--blue)',
                  fontSize: 12,
                  fontWeight: 600,
                  flex: '1 1 auto',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <FileText size={12} style={{ flexShrink: 0 }} />
                <span style={{ textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {unit.po_number}
                </span>
              </button>
            ) : (
              <span
                title={poTooltip}
                onClick={(e) => {
                  if (canUploadPo) {
                    e.stopPropagation();
                    setEditingCell({ unitId: effectiveUnitId, colKey: 'po_number', value: unit.po_number });
                  }
                }}
                style={{
                  fontSize: 12,
                  color: 'var(--text)',
                  cursor: canUploadPo ? 'pointer' : 'default',
                  flex: '1 1 auto',
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 500
                }}
              >
                {unit.po_number}
              </span>
            )
          ) : (
            <span
              onClick={(e) => {
                if (canUploadPo) {
                  e.stopPropagation();
                  setEditingCell({ unitId: effectiveUnitId, colKey: 'po_number', value: '' });
                }
              }}
              style={{ fontSize: 12, color: 'var(--text3)', cursor: canUploadPo ? 'pointer' : 'default', flex: '1 1 auto' }}
              title={poTooltip}
            >
              —
            </span>
          )}

          {canUploadPo && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, flexShrink: 0, marginLeft: 'auto' }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSingleUnitPoClick(unit);
                }}
                title={hasPoNum ? (hasPdf ? "Change PO / Re-upload PDF for this serial" : "Upload PDF for this PO") : "Enter PO & Upload PDF for this serial"}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 2,
                  cursor: 'pointer',
                  color: 'var(--text3)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  opacity: 0.7
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.opacity = '1'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.opacity = '0.7'; }}
              >
                <UploadCloud size={12} />
              </button>
              {hasPdf && onDeleteUnitPoDoc && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteUnitPoDoc(unit);
                  }}
                  title="Delete attached PO PDF (keeps PO Number as text)"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 2,
                    cursor: 'pointer',
                    color: 'var(--text3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    opacity: 0.7
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.opacity = '0.7'; }}
                >
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    case 'reference_number': {
      const ref = (unit.reference_number || '').trim();
      const tag = (unit.tag || '').trim();
      const combinedVal = (ref && tag) ? `${ref}/${tag}` : (ref || tag || '');
      const hasIndentDoc = Boolean(unit.indent_file_path);

      const refTooltip = [
        unit.reference_number ? `Customer Ref: ${unit.reference_number}` : null,
        unit.tag ? `Tag: ${unit.tag}` : null,
        (!unit.reference_number && !unit.tag && combinedVal) ? `Ref/Tag: ${combinedVal}` : null,
        (!unit.reference_number && !unit.tag && !combinedVal) ? 'Reference / Tag: Not Specified' : null,
        unit.indent_file_name ? `Attached File: ${unit.indent_file_name}` : null,
        unit.order_number ? `Order #: ${unit.order_number}` : null,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        hasIndentDoc ? 'Click to open Details document' : (canEdit ? 'Click to edit Reference & Tag' : null)
      ].filter(Boolean).join('\n');

      if (hasIndentDoc) {
        const isPdf = String(unit.indent_file_path).toLowerCase().endsWith('.pdf') || String(unit.indent_file_name || '').toLowerCase().endsWith('.pdf');
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 5, width: '100%', minWidth: 0 }} title={refTooltip}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (setPoPdfViewer) {
                  setPoPdfViewer({
                    file_path: unit.indent_file_path,
                    file_name: unit.indent_file_name || `Details_${combinedVal || unit.order_number}.pdf`,
                    title: `Details - ${combinedVal || unit.order_number}`,
                    subtitle: `Order: ${unit.order_number}${unit.company_name ? ` · ${unit.company_name}` : ''}`
                  });
                } else {
                  window.open(getDocUrl(unit.indent_file_path), '_blank');
                }
              }}
              title={refTooltip}
              style={{
                background: 'var(--orange-dim)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                borderRadius: 'var(--radius-sm, 4px)',
                padding: '2px 7px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer',
                color: 'var(--accent)',
                fontSize: 12,
                fontWeight: 600,
                flex: '1 1 auto',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              <FileText size={12} style={{ flexShrink: 0 }} />
              <span style={{ textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {combinedVal || 'Details'}
              </span>
            </button>
            {canEdit && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onEditRefTag ? onEditRefTag(unit) : setEditingCell({ unitId: effectiveUnitId, colKey: 'reference_number', value: unit.reference_number || '' });
                }}
                title="Edit Reference & Tag (Serial numbers unchanged)"
                style={{ color: 'var(--text3)', cursor: 'pointer', opacity: 0.5, flexShrink: 0, padding: '2px', marginLeft: 'auto', display: 'inline-flex', alignItems: 'center' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--blue)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text3)'; }}
              >
                <Edit2 size={11} />
              </span>
            )}
          </div>
        );
      }

      return (
        <span
          onClick={(e) => {
            if (canEdit) {
              e.stopPropagation();
              onEditRefTag ? onEditRefTag(unit) : setEditingCell({ unitId: effectiveUnitId, colKey: 'reference_number', value: unit.reference_number || '' });
            }
          }}
          title={refTooltip}
          style={{
            color: 'var(--accent)',
            fontSize: 12,
            fontWeight: combinedVal ? 600 : 400,
            cursor: canEdit ? 'pointer' : 'default',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
            minWidth: 0
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: '1 1 auto', minWidth: 0 }}>{combinedVal || '—'}</span>
          {canEdit && (
            <span
              style={{ color: 'var(--text3)', opacity: 0.5, marginLeft: 'auto', flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '1px' }}
              title="Edit Ref & Tag"
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.color = 'var(--text3)'; }}
            >
              <Edit2 size={10} />
            </span>
          )}
        </span>
      );
    }

    case 'purchase_cat_panel':
    case 'purchase_cat_automation':
    case 'purchase_cat_low_voltage':
    case 'purchase_cat_wires': {
      const catKeyMap = {
        purchase_cat_panel: 'Panel',
        purchase_cat_automation: 'Automation',
        purchase_cat_low_voltage: 'Low voltage',
        purchase_cat_wires: 'Wires & Accessories'
      };
      const catKey = catKeyMap[colKey] || 'Panel';
      const sn = String(unit.unit_serial || unit.short_serial || unit.unit_id || '').trim();
      const lookupKey = `${sn}__${catKey}`.toLowerCase();
      const shortLookupKey = `${sn.slice(-4)}__${catKey}`.toLowerCase();
      const matched = (purchaseOrdersBySerialAndCat?.get(lookupKey) || purchaseOrdersBySerialAndCat?.get(shortLookupKey) || []);

      if (!matched || matched.length === 0) {
        const isNA = unit.custom_fields?.[colKey] === 'NA';
        const userCanToggle = Boolean(canEditPurchaseNA || canEdit);

        if (isNA) {
          return (
            <div
              onClick={(e) => {
                if (userCanToggle && onTogglePurchaseCatNA) {
                  e.stopPropagation();
                  onTogglePurchaseCatNA(unit, colKey);
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                cursor: userCanToggle ? 'pointer' : 'default',
                width: '100%',
                userSelect: 'none'
              }}
              title={userCanToggle ? `Marked Not Applicable · Click to revert to Pending (—)` : 'Not Applicable for this unit'}
            >
              <button
                type="button"
                onClick={(e) => {
                  if (userCanToggle && onTogglePurchaseCatNA) {
                    e.stopPropagation();
                    onTogglePurchaseCatNA(unit, colKey);
                  }
                }}
                disabled={!userCanToggle}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '11px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono, monospace)',
                  background: 'rgba(148, 163, 184, 0.12)',
                  color: 'var(--text3)',
                  border: '1px solid rgba(148, 163, 184, 0.3)',
                  cursor: userCanToggle ? 'pointer' : 'default',
                  userSelect: 'none'
                }}
                title={userCanToggle ? `Marked Not Applicable · Click to revert to Pending (—)` : 'Not Applicable for this unit'}
              >
                N/A
              </button>
            </div>
          );
        }

        return (
          <div
            onClick={(e) => {
              if (userCanToggle && onTogglePurchaseCatNA) {
                e.stopPropagation();
                onTogglePurchaseCatNA(unit, colKey);
              }
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: userCanToggle ? 'pointer' : 'default',
              userSelect: 'none',
              width: '100%'
            }}
            title={userCanToggle ? `Click to mark ${catKey} as Not Applicable (N/A)` : undefined}
          >
            <span style={{ color: 'var(--text3)', fontSize: '12px' }}>—</span>
            {userCanToggle && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTogglePurchaseCatNA) {
                    onTogglePurchaseCatNA(unit, colKey);
                  }
                }}
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'var(--bg3)',
                  color: 'var(--text3)',
                  border: '1px dashed var(--border)',
                  cursor: 'pointer',
                  opacity: 0.7,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.color = 'var(--text)';
                  e.currentTarget.style.borderColor = 'var(--blue)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                  e.currentTarget.style.color = 'var(--text3)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                title={`Mark ${catKey} as Not Applicable (N/A)`}
              >
                + N/A
              </button>
            )}
          </div>
        );
      }

      // 1. Earliest PO Creation Date
      const createdDates = matched
        .map(p => p.createdDate || p.createdAt || p.date)
        .filter(Boolean)
        .map(d => new Date(d))
        .filter(d => !isNaN(d.getTime()));

      const firstCreatedDate = createdDates.length > 0
        ? new Date(Math.min(...createdDates.map(d => d.getTime())))
        : null;

      // 2. Received Date: when ALL POs are closed, the latest closed date
      const isClosedStatus = (status) => {
        const s = String(status || '').trim().toLowerCase();
        return s === 'po closed' || s === 'closed';
      };
      const allClosed = matched.length > 0 && matched.every(p => isClosedStatus(p.status));

      let lastReceivedDate = null;
      if (allClosed) {
        const receivedDates = matched
          .map(p => p.receivedDate || p.dateReceived || p.receivedAt || p.createdDate || p.date)
          .filter(Boolean)
          .map(d => new Date(d))
          .filter(d => !isNaN(d.getTime()));

        if (receivedDates.length > 0) {
          lastReceivedDate = new Date(Math.max(...receivedDates.map(d => d.getTime())));
        }
      }

      const firstDateStr = firstCreatedDate ? formatFastDate(firstCreatedDate) : '—';
      const secondDateStr = allClosed && lastReceivedDate ? formatFastDate(lastReceivedDate) : '—';

      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            padding: '2px 0',
            lineHeight: 1.25,
            fontSize: '11px',
            whiteSpace: 'nowrap'
          }}
          title={`PO Created: ${firstDateStr}\nReceived: ${secondDateStr} (${allClosed ? 'All POs Closed' : 'Pending / Open POs'})\nLinked POs: ${matched.length}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '10px', color: 'var(--text3)', fontWeight: 600, minWidth: 26 }}>PO:</span>
            <span style={{ color: 'var(--text)', fontWeight: 500, fontFamily: 'var(--font-mono, monospace)' }}>
              {firstDateStr}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '10px', color: allClosed ? 'var(--green)' : 'var(--text3)', fontWeight: 600, minWidth: 26 }}>Rec:</span>
            <span style={{ color: allClosed ? 'var(--green)' : 'var(--text3)', fontWeight: allClosed ? 600 : 400, fontFamily: 'var(--font-mono, monospace)' }}>
              {secondDateStr}
            </span>
          </div>
        </div>
      );
    }

    default:
      const customCol = customColumnDefs?.find(c => c.col_key === colKey);
      if (customCol) {
        const isEditingThis = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === colKey;
        const currentVal = unit.custom_fields?.[colKey] ?? '';

        if (isEditingThis) {
          if (customCol.field_type === 'Yes/No') {
            return (
              <select
                autoFocus
                value={editingCell.value || 'No'}
                onChange={(e) => onSaveInlineCell(unit, colKey, e.target.value)}
                onBlur={() => setEditingCell(null)}
                style={{
                  fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 4,
                  background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--blue)', outline: 'none'
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            );
          }
          if (isDateTimeType(customCol.field_type)) {
            return (
              <input
                type="datetime-local"
                autoFocus
                value={editingCell.value ? String(editingCell.value).slice(0, 16) : ''}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                style={{
                  width: '100%', padding: '2px 6px', fontSize: 11, background: 'var(--bg3)',
                  color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
                }}
              />
            );
          }
          if (isDateType(customCol.field_type)) {
            return (
              <input
                type="date"
                autoFocus
                value={editingCell.value ? String(editingCell.value).split('T')[0] : ''}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                style={{
                  width: '100%', padding: '2px 6px', fontSize: 11, background: 'var(--bg3)',
                  color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
                }}
              />
            );
          }
          if (customCol.field_type === 'Number') {
            return (
              <input
                type="number"
                autoFocus
                value={editingCell.value}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                style={{
                  width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
                  color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
                }}
              />
            );
          }
          return (
            <input
              type="text"
              autoFocus
              value={editingCell.value}
              onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
              onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
                if (e.key === 'Escape') setEditingCell(null);
              }}
              style={{
                width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
                color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
              }}
            />
          );
        }

        if (isDateTimeType(customCol.field_type)) {
          return (
            <span
              onClick={(e) => {
                if (canEdit) {
                  e.stopPropagation();
                  setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
                }
              }}
              style={{ cursor: canEdit ? 'pointer' : 'default', fontSize: 11, color: 'var(--text2)' }}
              title={canEdit ? 'Click to edit' : undefined}
            >
              {formatCustomDateTime(currentVal)}
            </span>
          );
        }
        if (isDateType(customCol.field_type)) {
          return (
            <span
              onClick={(e) => {
                if (canEdit) {
                  e.stopPropagation();
                  setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
                }
              }}
              style={{ cursor: canEdit ? 'pointer' : 'default', fontSize: 11, color: 'var(--text2)' }}
              title={canEdit ? 'Click to edit' : undefined}
            >
              {formatCustomDate(currentVal)}
            </span>
          );
        }
        if (customCol.field_type === 'Yes/No') {
          const isYes = String(currentVal).toLowerCase() === 'yes';
          return (
            <span
              onClick={(e) => {
                if (canEdit) {
                  e.stopPropagation();
                  setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
                }
              }}
              style={{
                cursor: canEdit ? 'pointer' : 'default',
                display: 'inline-block',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm, 4px)',
                fontSize: 11,
                fontWeight: 600,
                background: isYes ? 'var(--green-dim)' : 'var(--red-dim)',
                color: isYes ? 'var(--green)' : 'var(--red)'
              }}
            >
              {currentVal}
            </span>
          );
        }

        return (
          <span
            onClick={(e) => {
              if (canEdit) {
                e.stopPropagation();
                setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
              }
            }}
            style={{ cursor: canEdit ? 'pointer' : 'default', fontSize: 12 }}
            title={canEdit ? 'Click to edit' : undefined}
          >
            {String(currentVal)}
          </span>
        );
      }

      const isEditingThis = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === colKey;
      const currentVal = unit[colKey] || '';

      if (isEditingThis) {
        return (
          <input
            type="text"
            autoFocus
            value={editingCell.value}
            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
            onBlur={() => onSaveInlineCell(unit, colKey, editingCell.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSaveInlineCell(unit, colKey, editingCell.value);
              if (e.key === 'Escape') setEditingCell(null);
            }}
            style={{
              width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
              color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
            }}
          />
        );
      }

      const isEditableTextCol = ['project_name', 'end_client_name', 'material_description'].includes(colKey);
      const colLabel = customCol ? (customCol.label || colKey) : (colKey === 'material_description' ? 'Description' : colKey === 'project_name' ? 'Project' : colKey === 'end_client_name' ? 'End Client' : colKey);
      const textTooltip = [
        currentVal ? `${colLabel}: ${currentVal}` : `${colLabel}: Not Specified`,
        unit.order_number ? `Order #: ${unit.order_number}` : null,
        unit.unit_serial ? `Serial: ${unit.unit_serial}` : null,
        canEdit && isEditableTextCol ? '(Click to edit)' : null
      ].filter(Boolean).join('\n');

      return (
        <span
          onClick={(e) => {
            if (canEdit && isEditableTextCol) {
              e.stopPropagation();
              setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
            }
          }}
          title={textTooltip}
          style={{
            color: colKey === 'project_name' ? '#38bdf8' : 'var(--text2)',
            fontSize: 12,
            cursor: canEdit && isEditableTextCol ? 'pointer' : 'default',
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {currentVal || '—'}
        </span>
      );
  }
}

const TableRow = memo(function TableRow({
  unit,
  idx,
  currentFilter,
  showSelection = false,
  isSelected,
  status,
  visibleCols,
  columnWidths,
  pinnedKeys,
  stickyLeftMap,
  canEdit,
  canEditPanelSize,
  canUploadPo,
  canConfirmDesign,
  onConfirmDesignClassification,
  onUnconfirmDesignClassification,
  onRequestUnconfirmDesign,
  panelSizeMasters,
  panelSizeMap,
  customColumnDefs,
  editingCell,
  setEditingCell,
  onRowMouseDown,
  onRowMouseEnter,
  onRowClick,
  onSaveInlineCell,
  onSingleUnitPoClick,
  onDeleteUnitPoDoc,
  onPartNumberClick,
  setPoPdfViewer,
  onEditRefTag,
  onOpenOrderDocs,
  onDeletePanelSize,
  purchaseOrdersBySerialAndCat,
  canEditPurchaseNA,
  onTogglePurchaseCatNA
}) {
  const isAltRow = idx % 2 !== 0;
  const isCancelled = status === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel');
  const isHold = status === 'Hold' || status === 'On Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold');

  const baseBg = isAltRow ? 'var(--bg2)' : 'var(--bg)';
  const defaultBg = isSelected
    ? (isAltRow ? 'var(--row-selected-bg-alt, #162846)' : 'var(--row-selected-bg, #122038)')
    : isCancelled
      ? (isAltRow ? 'var(--row-cancelled-bg-alt, #28181c)' : 'var(--row-cancelled-bg, #221417)')
      : isHold
        ? (isAltRow ? 'var(--row-hold-bg-alt, #2c2214)' : 'var(--row-hold-bg, #241c10)')
        : baseBg;

  const borderBottomColor = isCancelled
    ? 'rgba(239, 68, 68, 0.45)'
    : isHold
      ? 'rgba(245, 158, 11, 0.45)'
      : (isSelected ? 'rgba(59, 130, 246, 0.4)' : 'var(--border)');

  const rowClass = [
    isCancelled ? 'row-cancelled' : '',
    isHold ? 'row-hold' : '',
    isSelected ? 'row-selected' : ''
  ].filter(Boolean).join(' ');

  const checkboxBg = isSelected
    ? (isAltRow ? 'var(--row-selected-bg-alt, #162846)' : 'var(--row-selected-bg, #122038)')
    : defaultBg;

  return (
    <tr
      className={rowClass}
      style={{
        background: defaultBg,
        cursor: 'default',
        borderBottom: `1px solid ${borderBottomColor}`,
      }}
      onMouseEnter={(e) => onRowMouseEnter(unit.unit_id, idx, e)}
    >
      {/* Selection Checkbox Cell — Sales Only */}
      {showSelection && (
        <td
          style={{
            position: 'sticky',
            left: 0,
            zIndex: 3,
            background: checkboxBg,
            width: 38,
            minWidth: 38,
            maxWidth: 38,
            padding: '6px 4px',
            textAlign: 'center',
            verticalAlign: 'middle',
            borderRight: '1px solid var(--border)',
            borderLeft: isSelected ? '5px solid var(--blue)' : (isCancelled ? '5px solid var(--red)' : isHold ? '5px solid var(--orange)' : '5px solid transparent'),
            userSelect: 'none',
            cursor: 'pointer'
          }}
          title={isSelected ? "Click to deselect row (or drag to deselect range)" : "Click to select row (or drag to select range)"}
          onMouseDown={(e) => onRowMouseDown(unit.unit_id, idx, e)}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => { }}
            style={{ cursor: 'pointer', accentColor: 'var(--blue)', width: 14, height: 14, pointerEvents: 'none' }}
          />
        </td>
      )}

      {visibleCols.map((c, colIdx) => {
        const colKey = c.key;
        const defaultWidth = isDateTimeType(c.fieldType) ? 170 : (DEFAULT_COL_WIDTHS[colKey] || 150);
        const width = columnWidths[colKey] || defaultWidth;
        const pinned = pinnedKeys.includes(colKey);
        const lastPin = pinned && pinnedKeys[pinnedKeys.length - 1] === colKey;

        let pinnedBg = baseBg;
        if (isSelected) {
          pinnedBg = isAltRow ? 'var(--row-selected-bg-alt, #162846)' : 'var(--row-selected-bg, #122038)';
        } else if (isCancelled) {
          pinnedBg = isAltRow ? 'var(--row-cancelled-bg-alt, #28181c)' : 'var(--row-cancelled-bg, #221417)';
        } else if (isHold) {
          pinnedBg = isAltRow ? 'var(--row-hold-bg-alt, #2c2214)' : 'var(--row-hold-bg, #241c10)';
        }

        const borderLeftStyle = (!showSelection && colIdx === 0)
          ? (isSelected ? '5px solid var(--blue)' : (isCancelled ? '5px solid var(--red)' : isHold ? '5px solid var(--orange)' : '5px solid transparent'))
          : undefined;

        return (
          <td
            key={colKey}
            className={`erp-td${pinned ? ' pinned' : ''}${lastPin ? ' last-pinned' : ''}`}
            onMouseEnter={(e) => {
              e.currentTarget.title = getCellTooltip(unit, colKey, status, customColumnDefs, panelSizeMap);
            }}
            style={{
              width,
              minWidth: width,
              maxWidth: width,
              boxSizing: 'border-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              verticalAlign: 'middle',
              position: pinned ? 'sticky' : 'relative',
              left: pinned ? `${stickyLeftMap[colKey]}px` : undefined,
              zIndex: pinned ? 3 : 1,
              background: pinned ? pinnedBg : undefined,
              borderLeft: borderLeftStyle,
              textAlign: c.align || 'left'
            }}
          >
            {renderCellContent({
              unit,
              colKey,
              currentFilter,
              status,
              canEdit,
              canEditPanelSize,
              canUploadPo,
              canConfirmDesign,
              onConfirmDesignClassification,
              onUnconfirmDesignClassification,
              onRequestUnconfirmDesign,
              panelSizeMasters,
              panelSizeMap,
              customColumnDefs,
              editingCell,
              setEditingCell,
              onRowClick,
              onSaveInlineCell,
              onSingleUnitPoClick,
              onDeleteUnitPoDoc,
              onPartNumberClick,
              setPoPdfViewer,
              onEditRefTag,
              onOpenOrderDocs,
              onDeletePanelSize,
              purchaseOrdersBySerialAndCat,
              canEditPurchaseNA,
              onTogglePurchaseCatNA
            })}
          </td>
        );
      })}
    </tr>
  );
}, (prevProps, nextProps) => {
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.unit !== nextProps.unit) return false;
  if (prevProps.currentFilter !== nextProps.currentFilter) return false;
  if (prevProps.idx !== nextProps.idx) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.columnWidths !== nextProps.columnWidths) return false;
  if (prevProps.visibleCols !== nextProps.visibleCols) return false;
  if (prevProps.pinnedKeys !== nextProps.pinnedKeys) return false;
  if (prevProps.panelSizeMasters !== nextProps.panelSizeMasters) return false;
  if (prevProps.customColumnDefs !== nextProps.customColumnDefs) return false;
  if (prevProps.canEdit !== nextProps.canEdit) return false;
  if (prevProps.canEditPurchaseNA !== nextProps.canEditPurchaseNA) return false;
  if (prevProps.canEditPanelSize !== nextProps.canEditPanelSize) return false;
  if (prevProps.purchaseOrdersBySerialAndCat !== nextProps.purchaseOrdersBySerialAndCat) return false;

  const unitId = prevProps.unit.unit_id || prevProps.unit.id;
  const prevEditing = prevProps.editingCell && prevProps.editingCell.unitId === unitId;
  const nextEditing = nextProps.editingCell && nextProps.editingCell.unitId === unitId;
  if (prevEditing !== nextEditing || (prevEditing && prevProps.editingCell !== nextProps.editingCell)) return false;

  return true;
});

// ── PO Upload Modal with Drag & Drop ──────────────────────────────────────────
const PoUploadModal = memo(function PoUploadModal({
  isOpen,
  onClose,
  selectedCount,
  selectedUnitSerials = [],
  initialPoNumber = '',
  onUpload,
  isUploading,
  addToast
}) {
  const [poNumber, setPoNumber] = useState(initialPoNumber);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setPoNumber(initialPoNumber || '');
      setSelectedFile(null);
      setIsDragging(false);
      dragCounter.current = 0;
    }
  }, [isOpen, initialPoNumber]);

  if (!isOpen) return null;

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDragging(false);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      addToast?.('Only PDF files are allowed for PO document upload.', 'warning');
      return;
    }

    setSelectedFile(file);
    if (!poNumber.trim()) {
      const suggestedPo = file.name.replace(/\.[^/.]+$/, '').trim();
      setPoNumber(suggestedPo);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      addToast?.('Only PDF files are allowed for PO document upload.', 'warning');
      return;
    }
    setSelectedFile(file);
    if (!poNumber.trim()) {
      const suggestedPo = file.name.replace(/\.[^/.]+$/, '').trim();
      setPoNumber(suggestedPo);
    }
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!poNumber.trim()) {
      addToast?.('Please enter a PO Number.', 'warning');
      return;
    }
    if (!selectedFile) {
      addToast?.('Please select or drag & drop a PO PDF file.', 'warning');
      return;
    }
    onUpload(poNumber.trim(), selectedFile);
  };

  return createPortal(
    <div
      className="modal-overlay open"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--modal-overlay-bg, rgba(0, 0, 0, 0.75))',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.15s ease'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUploading) onClose();
      }}
    >
      <div
        style={{
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg, 14px)',
          width: 520,
          maxWidth: '92vw',
          padding: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
          color: 'var(--text)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius, 8px)',
              background: 'var(--blue-dim)',
              color: 'var(--blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>
                Upload PO Document
              </h3>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text3)' }}>
                Drag & drop or browse PO PDF for selected serial numbers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            style={{
              background: 'none',
              border: 'none',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              color: 'var(--text3)',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              borderRadius: 'var(--radius-sm, 4px)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Selected Panels Context */}
        <div style={{
          background: 'var(--blue-dim)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius: 'var(--radius, 8px)',
          padding: '10px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: 'var(--text2)', fontWeight: 600 }}>Target Serials:</span>
            <span style={{
              background: 'var(--blue)',
              color: 'var(--bg, #151821)',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 12,
              fontSize: 11
            }}>
              {selectedCount} Serial{selectedCount > 1 ? 's' : ''} Selected
            </span>
          </div>
          {selectedUnitSerials.length > 0 && (
            <div style={{
              fontSize: 11,
              color: 'var(--text3)',
              display: 'flex',
              flexWrap: 'wrap',
              gap: 4,
              marginTop: 4,
              maxHeight: 48,
              overflowY: 'auto'
            }}>
              {selectedUnitSerials.slice(0, 10).map((serial, idx) => (
                <span
                  key={idx}
                  style={{
                    background: 'var(--bg3)',
                    border: '1px solid var(--border)',
                    padding: '1px 6px',
                    borderRadius: 4,
                    color: 'var(--text2)'
                  }}
                >
                  {serial}
                </span>
              ))}
              {selectedUnitSerials.length > 10 && (
                <span style={{ color: 'var(--text3)', fontStyle: 'italic', padding: '1px 4px' }}>
                  +{selectedUnitSerials.length - 10} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* PO Number Input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>
            PO Number <span style={{ color: 'var(--red)' }}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. PO-2026-9842"
            value={poNumber}
            onChange={(e) => setPoNumber(e.target.value)}
            disabled={isUploading}
            style={{
              height: 36,
              padding: '0 12px',
              fontSize: 13,
              background: 'var(--bg3)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Drag & Drop Zone */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text2)' }}>
            PO Document (PDF) <span style={{ color: 'var(--red)' }}>*</span>
          </label>

          {!selectedFile ? (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: isDragging ? '2px dashed var(--blue)' : '2px dashed var(--border2)',
                background: isDragging ? 'var(--blue-dim)' : 'var(--bg3)',
                borderRadius: 12,
                padding: '32px 16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'center'
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: '50%',
                background: isDragging ? 'rgba(56, 189, 248, 0.25)' : 'var(--blue-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--blue)'
              }}>
                <UploadCloud size={26} style={{ transform: isDragging ? 'scale(1.12)' : 'scale(1)', transition: 'transform 0.15s ease' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                  {isDragging ? 'Drop your PO PDF file here' : 'Drag & drop PO document here'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>
                  or <span style={{ color: 'var(--blue)', fontWeight: 600 }}>browse from your computer</span>
                </div>
              </div>
              <div style={{
                fontSize: 11,
                color: 'var(--text3)',
                background: 'var(--bg2)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm, 4px)',
                border: '1px solid var(--border)'
              }}>
                Only PDF files supported
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div style={{
              border: '1px solid rgba(56, 189, 248, 0.35)',
              background: 'var(--blue-dim)',
              borderRadius: 10,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                <div style={{
                  width: 38,
                  height: 38,
                  borderRadius: 8,
                  background: 'var(--red-dim)',
                  color: 'var(--red)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <FileText size={20} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB · PDF Document
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
                title="Remove / change file"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  color: 'var(--text3)',
                  padding: 6,
                  borderRadius: 6,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 10,
          marginTop: 6,
          paddingTop: 14,
          borderTop: '1px solid var(--border)'
        }}>
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            style={{
              height: 34,
              padding: '0 16px',
              fontSize: 13,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text2)',
              cursor: isUploading ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isUploading || !selectedFile || !poNumber.trim()}
            style={{
              height: 34,
              padding: '0 18px',
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 8,
              border: 'none',
              background: 'var(--blue)',
              color: 'var(--bg, #151821)',
              cursor: (isUploading || !selectedFile || !poNumber.trim()) ? 'not-allowed' : 'pointer',
              opacity: (isUploading || !selectedFile || !poNumber.trim()) ? 0.6 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            {isUploading ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
            <span>{isUploading ? 'Uploading...' : 'Upload & Attach PO'}</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

const PoUploadBar = memo(function PoUploadBar({
  selectedCount,
  selectedUnitSerials = [],
  canUploadPo,
  isUploadingPo,
  poSuccessMsg,
  onClearSelection,
  onUploadPo,
  externalPoNumber,
  setExternalPoNumber,
  addToast
}) {
  const [poNumber, setPoNumber] = useState(() => {
    return externalPoNumber || localStorage.getItem('erp_all_poNumber') || '';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const dragCounter = useRef(0);
  const poInputRef = useRef(null);

  useEffect(() => {
    try {
      if (poNumber) {
        localStorage.setItem('erp_all_poNumber', poNumber);
      } else {
        localStorage.removeItem('erp_all_poNumber');
      }
    } catch (e) {
      // ignore
    }
  }, [poNumber]);

  useEffect(() => {
    if (externalPoNumber !== undefined && externalPoNumber !== null) {
      setPoNumber(externalPoNumber);
      if (externalPoNumber && poInputRef.current) {
        poInputRef.current.focus();
        poInputRef.current.select();
      }
    }
  }, [externalPoNumber]);

  const handleUploadClick = () => {
    if (!canUploadPo) {
      addToast?.("Only Sales, Admin, and Manager roles can upload PO documents.", 'warning');
      return;
    }
    if (selectedCount === 0) {
      addToast?.("Please select the serial numbers to attach the PO data to first.", 'warning');
      return;
    }
    setIsModalOpen(true);
  };

  const handleDirectDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current = 0;
    setIsDraggingOver(false);

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!canUploadPo) {
      addToast?.("Only Sales, Admin, and Manager roles can upload PO documents.", 'warning');
      return;
    }

    if (selectedCount === 0) {
      addToast?.("Please select the serial numbers to attach the PO data to first.", 'warning');
      return;
    }

    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      addToast?.('Only PDF files are allowed for PO document upload.', 'warning');
      return;
    }

    let currentPo = poNumber.trim();
    if (!currentPo) {
      const suggestedPo = file.name.replace(/\.[^/.]+$/, '').trim();
      setPoNumber(suggestedPo);
      setIsModalOpen(true);
      return;
    }

    setPoNumber('');
    if (setExternalPoNumber) setExternalPoNumber('');
    onUploadPo(currentPo, file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
      setIsDraggingOver(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
    if (!isDraggingOver) {
      setIsDraggingOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDraggingOver(false);
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDirectDrop}
      style={{
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '3px 8px',
        position: 'relative',
        borderRadius: 8,
        border: isDraggingOver
          ? '2px dashed var(--blue)'
          : selectedCount > 0
            ? '1px dashed rgba(59, 130, 246, 0.45)'
            : '1px dashed transparent',
        backgroundColor: isDraggingOver
          ? 'rgba(59, 130, 246, 0.14)'
          : selectedCount > 0
            ? 'rgba(59, 130, 246, 0.04)'
            : 'transparent',
        boxShadow: isDraggingOver ? '0 0 16px rgba(59, 130, 246, 0.35)' : 'none',
        transition: 'all 0.18s ease'
      }}
      title={selectedCount > 0 ? "Click Upload PO to open Drag & Drop dialog (or drop PDF here)" : "Select serials to upload PO document"}
    >
      {/* Drag Over Active Overlay */}
      {isDraggingOver && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(56, 189, 248, 0.95)',
          backdropFilter: 'blur(3px)',
          borderRadius: 'var(--radius, 8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: 'var(--bg, #151821)',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '0.01em',
          zIndex: 20,
          pointerEvents: 'none',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.3)'
        }}>
          <UploadCloud size={16} style={{ transform: isDraggingOver ? 'scale(1.12)' : 'scale(1)', transition: 'transform 0.15s ease' }} />
          <span>Drop PO PDF to Upload</span>
        </div>
      )}

      {poSuccessMsg && (
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', background: 'var(--green-dim)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-sm, 4px)', padding: '3px 8px' }}>
          {poSuccessMsg}
        </span>
      )}

      {selectedCount > 0 && (
        <span style={{
          fontSize: 12, fontWeight: 600, color: 'var(--blue)', background: 'var(--blue-dim)',
          border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 'var(--radius-sm, 4px)', padding: '3px 8px',
          display: 'inline-flex', alignItems: 'center', gap: 5
        }}>
          <span>{selectedCount} serial{selectedCount > 1 ? 's' : ''} selected</span>
          <button
            type="button"
            onClick={onClearSelection}
            title="Deselect all"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, display: 'flex', alignItems: 'center' }}
          >
            <X size={12} />
          </button>
        </span>
      )}

      <input
        ref={poInputRef}
        type="text"
        placeholder="Enter PO No."
        value={poNumber}
        onChange={(e) => {
          setPoNumber(e.target.value);
          if (externalPoNumber) setExternalPoNumber('');
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleUploadClick();
        }}
        style={{
          height: 30,
          padding: '0 10px',
          fontSize: 12,
          background: 'var(--bg3)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm, 4px)',
          outline: 'none',
          width: 140
        }}
        title="Enter PO Number (or click Upload PO to open drag & drop uploader)"
      />

      <button
        type="button"
        onClick={handleUploadClick}
        disabled={isUploadingPo}
        title={selectedCount > 0 ? `Click to attach PO to ${selectedCount} selected serial(s)` : "Select serials then click to upload PO"}
        style={{
          height: 30,
          padding: '0 12px',
          fontSize: 12,
          fontWeight: 600,
          background: selectedCount > 0 ? 'var(--blue)' : 'var(--bg3)',
          color: selectedCount > 0 ? 'var(--bg, #151821)' : 'var(--text2)',
          border: selectedCount > 0 ? 'none' : '1px solid var(--border)',
          borderRadius: 'var(--radius-sm, 4px)',
          cursor: isUploadingPo ? 'wait' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          opacity: isUploadingPo ? 0.7 : 1,
          whiteSpace: 'nowrap',
          boxShadow: selectedCount > 0 ? '0 0 10px rgba(56, 189, 248, 0.35)' : 'none',
          transition: 'all 0.15s ease'
        }}
      >
        {isUploadingPo ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
        <span>{selectedCount > 0 ? `Upload PO (${selectedCount})` : 'Upload PO'}</span>
      </button>

      {/* Modal with Drag & Drop Option */}
      <PoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedCount={selectedCount}
        selectedUnitSerials={selectedUnitSerials}
        initialPoNumber={poNumber}
        onUpload={(submittedPo, file) => {
          setPoNumber('');
          if (setExternalPoNumber) setExternalPoNumber('');
          setIsModalOpen(false);
          onUploadPo(submittedPo, file);
        }}
        isUploading={isUploadingPo}
        addToast={addToast}
      />
    </div>
  );
});

export default function AllOrdersTableView({ currentFilter, userRole: propUserRole, onSetView, statCardFilter, onClearStatFilter }) {
  const [units, setUnits] = useState([]);
  const tableContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const { toasts, addToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'warning',
    confirmText: 'Confirm',
    onConfirm: null
  });

  // Prevent browser from navigating away if a user drops a file outside the dropzone
  useEffect(() => {
    const handleDragOverWindow = (e) => {
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault();
      }
    };
    const handleDropWindow = (e) => {
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault();
      }
    };
    window.addEventListener('dragover', handleDragOverWindow);
    window.addEventListener('drop', handleDropWindow);
    return () => {
      window.removeEventListener('dragover', handleDragOverWindow);
      window.removeEventListener('drop', handleDropWindow);
    };
  }, []);

  // Canvas Mouse Drag Scroll
  useEffect(() => {
    const slider = tableContainerRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      if (
        ['INPUT', 'SELECT', 'OPTION', 'BUTTON', 'A', 'TH'].includes(e.target.tagName) ||
        e.target.closest('th') ||
        e.target.closest('button') ||
        e.target.closest('.no-canvas-drag')
      ) {
        return;
      }
      isDown = true;
      slider.classList.add('active-drag');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active-drag');
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove('active-drag');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('erp_all_activeTab') || 'all');
  const [priorityFilter, setPriorityFilter] = useState(() => localStorage.getItem('erp_all_priorityFilter') || 'all');
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem('erp_all_statusFilter') || 'incomplete');
  const [sortKey, setSortKey] = useState(() => localStorage.getItem('erp_all_sortKey') || 'order_number');
  const [sortDir, setSortDir] = useState(() => localStorage.getItem('erp_all_sortDir') || 'asc');

  useEffect(() => {
    localStorage.setItem('erp_all_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('erp_all_priorityFilter', priorityFilter);
  }, [priorityFilter]);

  useEffect(() => {
    localStorage.setItem('erp_all_statusFilter', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem('erp_all_sortKey', sortKey);
  }, [sortKey]);

  useEffect(() => {
    localStorage.setItem('erp_all_sortDir', sortDir);
  }, [sortDir]);

  // Excel-style multi-row selection state (persisted across browser refresh)
  const [selectedUnitIds, setSelectedUnitIds] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_selectedUnitIds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load erp_all_selectedUnitIds', e);
    }
    return new Set();
  });

  useEffect(() => {
    try {
      if (selectedUnitIds.size > 0) {
        localStorage.setItem('erp_all_selectedUnitIds', JSON.stringify(Array.from(selectedUnitIds)));
      } else {
        localStorage.removeItem('erp_all_selectedUnitIds');
      }
    } catch (e) {
      console.warn('Failed to save erp_all_selectedUnitIds', e);
    }
  }, [selectedUnitIds]);

  const isIdSelected = useCallback((id) => {
    if (id === undefined || id === null) return false;
    return selectedUnitIds.has(id) || selectedUnitIds.has(String(id)) || (typeof id === 'string' && !isNaN(id) && selectedUnitIds.has(Number(id)));
  }, [selectedUnitIds]);

  const lastSelectedIndexRef = useRef(null);
  const isDraggingSelectRef = useRef(false);
  const dragStartIdxRef = useRef(null);
  const dragSelectTargetStateRef = useRef(true);

  // PO upload state
  const [externalPoNumber, setExternalPoNumber] = useState('');
  const [isUploadingPo, setIsUploadingPo] = useState(false);
  const [poSuccessMsg, setPoSuccessMsg] = useState('');

  // Pagination state
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem('erp_all_pageSize');
    if (saved === 'all') return 'all';
    const num = Number(saved);
    return num && num > 0 ? num : 100;
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem('erp_all_pageSize', String(pageSize));
  }, [pageSize]);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, priorityFilter, statusFilter, statCardFilter]);

  // In-app PDF viewer modal for PO document
  const [poPdfViewer, setPoPdfViewer] = useState(null);

  // Reset drag-select on mouseup anywhere
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingSelectRef.current = false;
      dragStartIdxRef.current = null;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Column Definitions (Merged BASE_COLUMNS + Custom columns from column-masters)
  const [allColumns, setAllColumns] = useState(BASE_COLUMNS);
  const [customColumnDefs, setCustomColumnDefs] = useState([]);

  // Column Keys Order (Drag & Drop Reordering)
  const [columnKeys, setColumnKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_column_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid = parsed.filter(k => DEFAULT_COLUMN_KEYS.includes(k));
        const missing = DEFAULT_COLUMN_KEYS.filter(k => !valid.includes(k));
        if (missing.length > 0) {
          const result = [...valid];
          const ptsIdx = result.indexOf('panel_type_size');
          if (ptsIdx !== -1) {
            const panelMissing = missing.filter(k => ['panel_code', 'panel_ip_rating', 'panel_comments'].includes(k));
            const otherMissing = missing.filter(k => !panelMissing.includes(k));
            if (panelMissing.includes('panel_code')) {
              result.splice(ptsIdx, 0, 'panel_code');
            }
            const newPtsIdx = result.indexOf('panel_type_size');
            if (panelMissing.includes('panel_ip_rating')) {
              result.splice(newPtsIdx + 1, 0, 'panel_ip_rating');
            }
            const ipIdx = result.indexOf('panel_ip_rating');
            if (panelMissing.includes('panel_comments')) {
              result.splice((ipIdx !== -1 ? ipIdx : newPtsIdx) + 1, 0, 'panel_comments');
            }
            return [...result, ...otherMissing];
          }
          return [...valid, ...missing];
        }
        return valid;
      }
    } catch (e) { }
    return DEFAULT_COLUMN_KEYS;
  });

  // Whenever allColumns changes, sync any newly added custom columns into columnKeys
  useEffect(() => {
    const availableKeys = allColumns.map(c => c.key);
    setColumnKeys(prev => {
      const valid = prev.filter(k => availableKeys.includes(k));
      const missing = availableKeys.filter(k => !valid.includes(k));
      if (missing.length === 0 && valid.length === prev.length) return prev;
      return [...valid, ...missing];
    });
  }, [allColumns]);

  useEffect(() => {
    localStorage.setItem('erp_all_column_order', JSON.stringify(columnKeys));
  }, [columnKeys]);

  // Pinned / Frozen Columns (Frozen on left)
  const [pinnedKeys, setPinnedKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_pinned_keys');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return ['order_number', 'short_serial'];
  });

  useEffect(() => {
    localStorage.setItem('erp_all_pinned_keys', JSON.stringify(pinnedKeys));
  }, [pinnedKeys]);

  // Column Widths (Resizing)
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const savedV6 = localStorage.getItem('erp_all_colWidths_v6');
      const saved = savedV6 || localStorage.getItem('erp_all_colWidths_v5') || localStorage.getItem('erp_all_colWidths_v4') || localStorage.getItem('erp_all_colWidths_v3') || localStorage.getItem('erp_all_colWidths_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...DEFAULT_COL_WIDTHS };
        for (const k of Object.keys(DEFAULT_COL_WIDTHS)) {
          if (parsed[k] !== undefined) {
            const minSafe = MIN_COL_WIDTHS[k] || 120;
            const savedVal = Number(parsed[k]);
            if (!savedV6) {
              // Upgrading to v6: ensure widened defaults for project_name, part_number, etc.
              merged[k] = (savedVal && savedVal >= DEFAULT_COL_WIDTHS[k]) ? savedVal : DEFAULT_COL_WIDTHS[k];
            } else {
              merged[k] = Math.max(savedVal || minSafe, minSafe);
            }
          }
        }
        for (const [k, v] of Object.entries(parsed)) {
          if (merged[k] === undefined && typeof v === 'number') {
            merged[k] = Math.max(v, 120);
          }
        }
        return merged;
      }
      return DEFAULT_COL_WIDTHS;
    } catch (e) {
      return DEFAULT_COL_WIDTHS;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('erp_all_colWidths_v6', JSON.stringify(columnWidths));
      } catch (err) {
        console.error('Failed to save colWidths', err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [columnWidths]);

  // Header Drag & Drop state
  const [draggedColKey, setDraggedColKey] = useState(null);
  const [dragOverColKey, setDragOverColKey] = useState(null);

  const handleHeaderDragStart = (e, colKey) => {
    setDraggedColKey(colKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', colKey);
  };

  const handleHeaderDragOver = (e, colKey) => {
    e.preventDefault();
    if (draggedColKey === colKey) return;
    if (dragOverColKey !== colKey) {
      setDragOverColKey(colKey);
    }
  };

  const handleHeaderDragLeave = (e, colKey) => {
    if (dragOverColKey === colKey) {
      setDragOverColKey(null);
    }
  };

  const handleHeaderDrop = (e, targetColKey) => {
    e.preventDefault();
    if (!draggedColKey || draggedColKey === targetColKey) {
      setDraggedColKey(null);
      setDragOverColKey(null);
      return;
    }

    const visibleKeys = visibleCols.map(c => c.key);
    const sourceIdx = visibleKeys.indexOf(draggedColKey);
    const targetIdx = visibleKeys.indexOf(targetColKey);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const newKeys = [...columnKeys];
      const realSource = newKeys.indexOf(draggedColKey);
      const realTarget = newKeys.indexOf(targetColKey);
      if (realSource !== -1 && realTarget !== -1) {
        newKeys.splice(realSource, 1);
        newKeys.splice(realTarget, 0, draggedColKey);
        setColumnKeys(newKeys);
        localStorage.setItem('erp_all_column_order', JSON.stringify(newKeys));
      }
    }

    setDraggedColKey(null);
    setDragOverColKey(null);
  };

  const handleHeaderDragEnd = () => {
    setDraggedColKey(null);
    setDragOverColKey(null);
  };

  const togglePin = (colKey, e) => {
    e?.stopPropagation();
    setPinnedKeys(prev =>
      prev.includes(colKey)
        ? prev.filter(k => k !== colKey)
        : [...prev, colKey]
    );
  };

  const handleResetLayout = () => {
    setColumnKeys(allColumns.map(c => c.key));
    setColumnWidths(DEFAULT_COL_WIDTHS);
    setPinnedKeys(['order_number', 'short_serial']);
    localStorage.removeItem('erp_all_column_order');
    localStorage.removeItem('erp_all_colWidths');
    localStorage.removeItem('erp_all_colWidths_v2');
    localStorage.removeItem('erp_all_colWidths_v3');
    localStorage.removeItem('erp_all_colWidths_v4');
    localStorage.removeItem('erp_all_colWidths_v5');
    localStorage.removeItem('erp_all_colWidths_v6');
    localStorage.removeItem('erp_all_pinned_keys');
  };

  const rafResizeRef = useRef(null);

  const handleResizeStart = (e, colKey) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const startWidth = columnWidths[colKey] || DEFAULT_COL_WIDTHS[colKey] || 120;
    const minSafe = MIN_COL_WIDTHS[colKey] || 60;

    document.body.classList.add('resizing-active');
    let latestWidth = startWidth;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      latestWidth = Math.max(minSafe, startWidth + (moveEvent.pageX - startX));

      if (!rafResizeRef.current) {
        rafResizeRef.current = requestAnimationFrame(() => {
          setColumnWidths(prev => {
            if (prev[colKey] === latestWidth) return prev;
            return {
              ...prev,
              [colKey]: latestWidth
            };
          });
          rafResizeRef.current = null;
        });
      }
    };

    const onMouseUp = () => {
      if (rafResizeRef.current) {
        cancelAnimationFrame(rafResizeRef.current);
        rafResizeRef.current = null;
      }
      document.body.classList.remove('resizing-active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      setColumnWidths(prev => {
        const finalMap = { ...prev, [colKey]: latestWidth };
        try {
          localStorage.setItem('erp_all_colWidths_v6', JSON.stringify(finalMap));
        } catch (err) {
          console.error('Failed to save colWidths', err);
        }
        return finalMap;
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleAutoFitColumn = (colKey, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const colDef = allColumns.find(c => c.key === colKey);
    const headerLabel = colDef?.label || colKey;
    const minSafe = MIN_COL_WIDTHS[colKey] || 120;

    // Header minimum required width: label text + grip + sort icon + pin button + padding
    let maxCharLen = headerLabel.length;
    let baseExtraPadding = 65;

    // Scan up to 150 displayed units to determine longest content
    const sampleUnits = displayedUnits.slice(0, 150);
    for (const unit of sampleUnits) {
      let cellStr = '';
      switch (colKey) {
        case 'order_number':
          cellStr = String(unit.order_number || '');
          break;
        case 'short_serial':
        case 'unit_serial':
          cellStr = String(unit.unit_serial || unit.short_serial || '');
          break;
        case 'company_name':
          cellStr = `${unit.company_name || ''}${unit.company_city ? ` · ${unit.company_city}` : ''}`;
          break;
        case 'project_name':
          cellStr = String(unit.project_name || '');
          break;
        case 'po_number':
          cellStr = String(unit.po_number || '');
          break;
        case 'reference_number':
          cellStr = `${unit.reference_number || ''}${unit.tag ? `/${unit.tag}` : ''}`;
          break;
        case 'classification':
          cellStr = 'Standard - Confirmed';
          break;
        case 'priority':
          cellStr = String(unit.priority || 'Medium');
          break;
        case 'delivery_date':
          cellStr = unit.delivery_date ? '00 MMM 0000 OVERDUE' : '';
          break;
        case 'unit_status': {
          const st = getUnitStatus(unit);
          if (st === 'Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold')) {
            const holdStep = unit.hold_step_name || (unit.unit_status?.replace(/^Hold @\s*/i, '')) || 'Current Step';
            cellStr = `Hold @ ${holdStep}`;
          } else if (st === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel')) {
            const cancelStep = unit.cancelled_step_name || (unit.unit_status?.replace(/^Cancelled @\s*/i, '')) || 'Current Step';
            cellStr = `Cancelled @ ${cancelStep}`;
          } else {
            cellStr = String(st || '');
          }
          break;
        }
        case 'material_description':
          cellStr = String(unit.material_description || '');
          break;
        case 'panel_comments':
          cellStr = String(unit.panel_comments || '');
          break;
        case 'panel_code':
          cellStr = String(unit.panel_code || '');
          break;
        case 'panel_ip_rating':
          cellStr = String(unit.panel_ip_rating || '');
          break;
        case 'purchase_cat_panel':
        case 'purchase_cat_automation':
        case 'purchase_cat_low_voltage':
        case 'purchase_cat_wires':
          cellStr = 'PO-2026-9999 Partial received +9';
          break;
        default:
          cellStr = String(unit[colKey] || unit.custom_fields?.[colKey] || '');
          break;
      }
      if (cellStr.length > maxCharLen) {
        maxCharLen = cellStr.length;
      }
    }

    const estimatedWidth = Math.ceil(maxCharLen * 8.2) + baseExtraPadding;
    const finalWidth = Math.min(Math.max(estimatedWidth, minSafe), 650);

    setColumnWidths(prev => {
      const updated = { ...prev, [colKey]: finalWidth };
      try {
        localStorage.setItem('erp_all_colWidths_v5', JSON.stringify(updated));
      } catch (err) { }
      return updated;
    });
  };

  const token = localStorage.getItem('token');
  const userRole = (() => {
    if (propUserRole) return propUserRole;
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u && u.role) return u.role;
    } catch (e) { }
    return localStorage.getItem('userRole') || 'Sales';
  })();
  const roleUpper = (userRole || '').trim().toUpperCase();
  const canEdit = ['ADMIN', 'MANAGER', 'DESIGN', 'SALES', 'PRODUCTION'].includes(roleUpper);
  const canEditPurchaseNA = ['ADMIN', 'MANAGER', 'PURCHASE', 'STORES', 'DESIGN', 'SALES'].includes(roleUpper);
  const canEditPanelSize = ['ADMIN', 'MANAGER', 'DESIGN'].includes(roleUpper);
  const canManageDocs = ['ADMIN', 'MANAGER', 'DESIGN'].includes(roleUpper);
  const canUploadPo = ['ADMIN', 'MANAGER', 'SALES'].includes(roleUpper);
  const canConfirmDesign = ['ADMIN', 'MANAGER', 'DESIGN'].includes(roleUpper);
  const isPurchaseView = (currentFilter || '').toLowerCase() === 'purchase' || (roleUpper === 'PURCHASE' && (currentFilter === 'all' || (currentFilter || '').toLowerCase() === 'purchase'));

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      return {};
    }
  })();

  const [colVisibility, setColVisibility] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [partMasters, setPartMasters] = useState([]);
  const [panelSizeMasters, setPanelSizeMasters] = useState([]);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedPartForDocs, setSelectedPartForDocs] = useState(null);
  const [editingRefTagUnit, setEditingRefTagUnit] = useState(null);
  const [orderDocsModalData, setOrderDocsModalData] = useState(null);
  const [isPurchaseNewOrderOpen, setIsPurchaseNewOrderOpen] = useState(false);
  const [isPurchaseOrderReceivedOpen, setIsPurchaseOrderReceivedOpen] = useState(false);
  const [vendorPurchaseOrders, setVendorPurchaseOrders] = useState([]);

  const fetchVendorPurchaseOrders = async () => {
    try {
      const res = await fetch(`${window.API_BASE}/api/purchase-orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setVendorPurchaseOrders(data);
          try {
            localStorage.setItem('vyom_purchase_orders', JSON.stringify(data));
          } catch (e) {}
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch vendor purchase orders:', err);
    }
    try {
      const cached = localStorage.getItem('vyom_purchase_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setVendorPurchaseOrders(parsed);
      }
    } catch (e) {}
  };

  const purchaseOrdersBySerialAndCat = useMemo(() => {
    const map = new Map();
    (vendorPurchaseOrders || []).forEach(order => {
      const cat = String(order.category || '').trim();
      const posList = Array.isArray(order.pos) && order.pos.length > 0
        ? order.pos
        : [{ poNumber: order.poNumber || order.order_uid || 'PO', status: order.status || 'Pending' }];
      const serials = Array.isArray(order.serials) ? order.serials : [];

      serials.forEach(s => {
        const sn = String(s?.serialNumber || s?.unit_serial || s?.serial_number || s?.serial || s || '').trim();
        if (!sn) return;

        posList.forEach(p => {
          const entry = {
            poNumber: p.poNumber || order.poNumber || order.order_uid || 'PO',
            status: p.status || order.status || 'Pending',
            category: cat,
            orderId: order.id,
            createdDate: p.date || (order.created_at ? String(order.created_at).slice(0, 10) : null),
            receivedDate: p.dateReceived || (order.received_at ? String(order.received_at).slice(0, 10) : null)
          };

          const key = `${sn}__${cat}`.toLowerCase();
          const shortKey = `${sn.slice(-4)}__${cat}`.toLowerCase();

          if (!map.has(key)) map.set(key, []);
          map.get(key).push(entry);

          if (!map.has(shortKey)) map.set(shortKey, []);
          map.get(shortKey).push(entry);
        });
      });
    });
    return map;
  }, [vendorPurchaseOrders]);

  const fetchPartMasters = async () => {
    try {
      const res = await fetch(`${window.API_BASE}/api/part-number-masters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPartMasters(await res.json());
      }
    } catch (err) { console.error(err); }
  };

  const fetchPanelSizeMasters = async () => {
    try {
      const res = await fetch(`${window.API_BASE}/api/panel-size-masters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setPanelSizeMasters(await res.json());
      }
    } catch (err) { console.error(err); }
  };

  const panelSizeMap = useMemo(() => {
    const map = new Map();
    (panelSizeMasters || []).forEach(m => {
      if (m.panel_size) map.set(m.panel_size, m);
      if (m.size_name) map.set(m.size_name, m);
      if (m.panel_code) map.set(m.panel_code, m);
    });
    return map;
  }, [panelSizeMasters]);

  const customColumnMap = useMemo(() => {
    const map = new Map();
    (customColumnDefs || []).forEach(c => {
      map.set(c.col_key, c);
    });
    return map;
  }, [customColumnDefs]);

  const getDocUrl = (doc) => {
    if (!doc) return '#';
    let pathStr = typeof doc === 'string' ? doc : (doc.file_path || doc.filePath || doc.file_name || '');
    if (!pathStr) return '#';

    pathStr = pathStr.replace(/\\/g, '/');
    const uploadsIdx = pathStr.indexOf('uploads/');
    let relPath = '';
    if (uploadsIdx !== -1) {
      relPath = pathStr.substring(uploadsIdx + 8);
    } else {
      relPath = pathStr.split('/').pop();
    }
    relPath = relPath.replace(/^\/+/, '');

    const authToken = localStorage.getItem('token');
    const tokenParam = authToken ? `?token=${encodeURIComponent(authToken)}` : '';
    const baseUrl = window.API_BASE || '';

    return `${baseUrl}/uploads/${relPath}${tokenParam}`;
  };



  const handlePartNumberClick = async (unit) => {
    const pNum = unit.part_number;
    const match = partMasters.find(p =>
      p.part_number && pNum && p.part_number.trim().toLowerCase() === pNum.trim().toLowerCase()
    ) || partMasters.find(p => p.part_number === pNum);
    let masterDocs = match?.documents || [];
    let orderDocs = [];
    const targetUnitId = unit.unit_id || unit.id;

    try {
      if (targetUnitId) {
        const resUnit = await fetch(`${window.API_BASE}/api/documents/Unit/${targetUnitId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resUnit.ok) {
          const uDocs = await resUnit.json();
          orderDocs = [...orderDocs, ...(Array.isArray(uDocs) ? uDocs : [uDocs])];
        }
      }
      if (unit.order_id) {
        const res = await fetch(`${window.API_BASE}/api/documents/Order/${unit.order_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const oDocs = await res.json();
          orderDocs = [...orderDocs, ...(Array.isArray(oDocs) ? oDocs : [oDocs])];
        }
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }

    const drawings = masterDocs.filter(d => (d.doc_type || 'Drawing').toLowerCase() === 'drawing');
    const boms = masterDocs.filter(d => (d.doc_type || '').toLowerCase() === 'bom');
    const currentDrawing = match?.drawing || drawings.find(d => d.is_current) || (drawings.length > 0 ? drawings[drawings.length - 1] : null);
    const currentBOM = match?.bom || boms.find(d => d.is_current) || (boms.length > 0 ? boms[boms.length - 1] : null);

    setSelectedPartForDocs({
      partId: match?.id || null,
      partNumber: pNum || 'Unspecified',
      clientName: match?.client_name || '',
      project: match?.project || '',
      orderId: unit.order_id,
      orderNumber: unit.order_number || '',
      unitId: targetUnitId,
      unitSerial: unit.unit_serial || unit.short_serial || '',
      description: unit.material_description || match?.description || '',
      classification: unit.classification || 'Standard',
      drawing: currentDrawing,
      bom: currentBOM,
      drawingHistory: match?.drawing_history || [...drawings].reverse(),
      bomHistory: match?.bom_history || [...boms].reverse(),
      masterDocs,
      orderDocs
    });
    setShowDocsModal(true);
  };

  const handleConfirmDesignClassification = async (unit) => {
    const targetUnitId = unit.unit_id || unit.id;
    if (!targetUnitId) return;

    // Optimistic UI update: mark design_confirmed = true immediately
    setUnits(prevUnits => prevUnits.map(u => {
      const uId = u.unit_id || u.id;
      if (uId === targetUnitId) {
        const updatedDesignSteps = (u.design_steps || []).map(s => {
          if (s.name === 'Review & Classify' || (s.name || '').toLowerCase().includes('classify')) {
            return { ...s, status: 'done', notes: 'Classification confirmed by Design.' };
          }
          return s;
        });
        const updatedDeptSteps = (u.dept_steps || []).map(s => {
          if (s.name === 'Review & Classify' || (s.name || '').toLowerCase().includes('classify')) {
            return { ...s, status: 'done', notes: 'Classification confirmed by Design.' };
          }
          return s;
        });
        return {
          ...u,
          design_confirmed: true,
          design_confirmed_at: new Date().toISOString(),
          design_confirmed_by_name: currentUser?.name || currentUser?.username || 'Design',
          design_steps: updatedDesignSteps,
          dept_steps: updatedDeptSteps
        };
      }
      return u;
    }));

    try {
      const res = await fetch(`${window.API_BASE}/api/units/${targetUnitId}/design-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.unit) {
          setUnits(prevUnits => prevUnits.map(u => {
            const uId = u.unit_id || u.id;
            if (uId === targetUnitId) {
              const updatedDesignSteps = (u.design_steps || []).map(s => {
                if (s.name === 'Review & Classify' || (s.name || '').toLowerCase().includes('classify')) {
                  return { ...s, status: 'done', notes: 'Classification confirmed by Design.' };
                }
                if (s.name === 'Release Documents' || (s.name || '').toLowerCase().includes('release')) {
                  return { ...s, status: data.step2Status || s.status, notes: data.notes || s.notes };
                }
                return s;
              });
              const updatedDeptSteps = (u.dept_steps || []).map(s => {
                if (s.name === 'Review & Classify' || (s.name || '').toLowerCase().includes('classify')) {
                  return { ...s, status: 'done', notes: 'Classification confirmed by Design.' };
                }
                if (s.name === 'Release Documents' || (s.name || '').toLowerCase().includes('release')) {
                  return { ...s, status: data.step2Status || s.status, notes: data.notes || s.notes };
                }
                return s;
              });
              return {
                ...u,
                ...data.unit,
                unit_id: u.unit_id,
                unit_status: data.unit.status || u.unit_status,
                current_dept: data.unit.current_dept || u.current_dept,
                design_steps: updatedDesignSteps,
                dept_steps: updatedDeptSteps
              };
            }
            return u;
          }));
        }
      } else {
        console.error('Failed to confirm design classification');
        fetchUnits(true);
      }
    } catch (err) {
      console.error('Error confirming design classification:', err);
      fetchUnits(true);
    }
  };

  const handleUnconfirmDesignClassification = async (unit) => {
    const targetUnitId = unit.unit_id || unit.id;
    if (!targetUnitId) return;

    setUnits(prevUnits => prevUnits.map(u => {
      const uId = u.unit_id || u.id;
      if (uId === targetUnitId) {
        return {
          ...u,
          design_confirmed: false,
          design_confirmed_at: null,
          design_confirmed_by: null,
          design_confirmed_by_name: null
        };
      }
      return u;
    }));

    try {
      const res = await fetch(`${window.API_BASE}/api/units/${targetUnitId}/design-unconfirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.unit) {
          setUnits(prevUnits => prevUnits.map(u => {
            const uId = u.unit_id || u.id;
            if (uId === targetUnitId) {
              return {
                ...u,
                ...data.unit,
                unit_id: u.unit_id,
                unit_status: data.unit.status || u.unit_status,
                current_dept: data.unit.current_dept || u.current_dept
              };
            }
            return u;
          }));
        }
      }
    } catch (err) {
      console.error('Error unconfirming design:', err);
      fetchUnits(true);
    }
  };

  const handleRequestUnconfirmDesign = useCallback((unit) => {
    const serial = unit.short_serial || unit.unit_serial || unit.unit_id;
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Design Sign-Off',
      message: `Reset Design confirmation for Unit ${serial} to re-evaluate? This will return the panel classification to unconfirmed status.`,
      variant: 'warning',
      confirmText: 'Reset Sign-Off',
      onConfirm: () => handleUnconfirmDesignClassification(unit)
    });
  }, [handleUnconfirmDesignClassification]);

  const handleTogglePurchaseCatNA = async (unit, colKey) => {
    const catLabels = {
      purchase_cat_panel: 'Panel',
      purchase_cat_automation: 'Automation',
      purchase_cat_low_voltage: 'Low Voltage',
      purchase_cat_wires: 'Wires & Accessories'
    };
    const catLabel = catLabels[colKey] || 'Purchase Category';

    // 1. Determine target units (all selected units if any selected, otherwise clicked unit)
    const selectedList = units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
    let targetUnits = [];
    if (selectedList.length > 0) {
      const clickedId = unit ? (unit.unit_id || unit.id) : null;
      const hasClicked = clickedId && selectedList.some(u => (u.unit_id || u.id) === clickedId);
      targetUnits = hasClicked || !unit ? selectedList : [...selectedList, unit];
    } else if (unit) {
      targetUnits = [unit];
    }

    if (targetUnits.length === 0) return;

    // 2. If multiple units: if ANY unit is not NA, set all to 'NA'. If all are already 'NA', revert them.
    // If single unit: toggle current state.
    const shouldSetNA = targetUnits.length > 1
      ? targetUnits.some(u => u.custom_fields?.[colKey] !== 'NA')
      : targetUnits[0].custom_fields?.[colKey] !== 'NA';

    const nextVal = shouldSetNA ? 'NA' : null;
    const targetIdsSet = new Set(targetUnits.map(u => String(u.unit_id || u.id)));

    // 3. Optimistic UI update across all target units instantly (0ms)
    setUnits(prevUnits => prevUnits.map(u => {
      const uId = String(u.unit_id || u.id);
      if (targetIdsSet.has(uId)) {
        const cf = { ...(u.custom_fields || {}) };
        if (nextVal === 'NA') {
          cf[colKey] = 'NA';
        } else {
          delete cf[colKey];
        }
        return { ...u, custom_fields: cf };
      }
      return u;
    }));

    // 4. Persist to backend via batch endpoint
    try {
      const targetIdsList = targetUnits.map(u => u.unit_id || u.id);
      const res = await fetch(`${window.API_BASE}/api/units/batch-purchase-na`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          unit_ids: targetIdsList,
          colKey,
          value: nextVal
        })
      });

      if (!res.ok) {
        console.warn('Batch endpoint failed, falling back to individual updates:', res.statusText);
        await Promise.all(targetUnits.map(async (tu) => {
          const tuId = tu.unit_id || tu.id;
          const cf = { ...(tu.custom_fields || {}) };
          if (nextVal === 'NA') cf[colKey] = 'NA';
          else delete cf[colKey];
          return fetch(`${window.API_BASE}/api/units/${tuId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ custom_fields: cf })
          });
        }));
      }

      if (addToast) {
        addToast(
          `${shouldSetNA ? 'Marked' : 'Reverted'} ${targetUnits.length} serial${targetUnits.length > 1 ? 's' : ''} ${shouldSetNA ? 'as N/A' : 'to Pending'} for ${catLabel}`,
          'success'
        );
      }
      fetchUnits(true);
    } catch (err) {
      console.error('Error saving purchase category N/A status:', err);
      if (addToast) {
        addToast(err.message || 'Failed to update category status', 'error');
      }
      fetchUnits(true);
    }
  };

  const handleSaveInlineCell = async (unit, colKey, newValue) => {
    const targetUnitId = unit.unit_id || unit.id;
    const customDef = customColumnDefs.find(c => c.col_key === colKey);

    // If this is a custom field from column-masters, save into custom_fields jsonb
    if (customDef) {
      const currentCF = unit.custom_fields || {};
      const updatedCF = { ...currentCF, [colKey]: newValue };

      setUnits(prevUnits => prevUnits.map(u => {
        const currentId = u.unit_id || u.id;
        if (currentId === targetUnitId) {
          return { ...u, custom_fields: updatedCF };
        }
        return u;
      }));
      setEditingCell(null);

      try {
        if (targetUnitId) {
          await fetch(`${window.API_BASE}/api/units/${targetUnitId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ custom_fields: updatedCF })
          });
        }
      } catch (err) {
        console.error('Failed to save custom field:', err);
      }
      return;
    }

    // 1. Optimistic UI update - changes value instantly without unmounting or resetting scroll!
    setUnits(prevUnits => prevUnits.map(u => {
      const currentId = u.unit_id || u.id;
      if (currentId === targetUnitId) {
        const updated = { ...u, [colKey]: newValue };
        if (colKey === 'classification') {
          updated.design_confirmed = false;
          updated.design_confirmed_at = null;
          updated.design_confirmed_by = null;
          updated.design_confirmed_by_name = null;
        }
        if (colKey === 'panel_type_size') {
          const matched = panelSizeMasters.find(m => (m.panel_size || m.size_name) === newValue || m.panel_code === newValue);
          updated.panel_code = matched?.panel_code || '';
          updated.panel_ip_rating = matched?.ip_rating || '';
          updated.panel_comments = matched?.comments || matched?.description || '';
        }
        return updated;
      }
      return u;
    }));
    setEditingCell(null);

    try {
      if (colKey === 'classification') {
        const uId = unit.unit_id || unit.id;
        if (uId) {
          const res = await fetch(`${window.API_BASE}/api/units/${uId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ classification: newValue })
          });
          if (res.ok) {
            fetchUnits(true);
          }
        }
      } else if (colKey === 'panel_type_size') {
        const uId = unit.id || unit.unit_id;
        if (uId) {
          const res = await fetch(`${window.API_BASE}/api/units/${uId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ panel_type_size: newValue })
          });
          if (!res.ok) {
            console.error('Failed to update panel size', await res.text());
          }
        }
      } else if (colKey === 'po_number') {
        const uId = unit.id || unit.unit_id;
        if (uId) {
          await fetch(`${window.API_BASE}/api/units/${uId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ po_number: newValue })
          });
        }
      } else {
        await fetch(`${window.API_BASE}/api/orders/${unit.order_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ [colKey]: newValue })
        });
      }
      // Silent refresh in background
      fetchUnits(true);
    } catch (err) {
      console.error('Failed to update inline cell:', err);
      fetchUnits(true);
    }
  };

  useEffect(() => {
    fetchColumnVisibility();
    fetchUnits();
    fetchPartMasters();
    fetchPanelSizeMasters();
    fetchVendorPurchaseOrders();

    const handleUpdate = () => {
      fetchUnits(true);
      fetchColumnVisibility();
      fetchPartMasters();
      fetchPanelSizeMasters();
      fetchVendorPurchaseOrders();
    };
    window.addEventListener('orderUpdated', handleUpdate);
    window.addEventListener('columnMastersUpdated', handleUpdate);
    window.addEventListener('purchaseOrderStatusChanged', handleUpdate);
    window.addEventListener('purchaseOrderSaved', handleUpdate);
    return () => {
      window.removeEventListener('orderUpdated', handleUpdate);
      window.removeEventListener('columnMastersUpdated', handleUpdate);
      window.removeEventListener('purchaseOrderStatusChanged', handleUpdate);
      window.removeEventListener('purchaseOrderSaved', handleUpdate);
    };
  }, [currentFilter]);

  const fetchColumnVisibility = async () => {
    try {
      const res = await fetch(`${window.API_BASE}/api/column-masters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setColVisibility(data.visibilityByDept || {});

        const customCols = (data.columns || []).filter(c => !c.is_system);
        setCustomColumnDefs(customCols);

        const customMapped = customCols.map(c => ({
          key: c.col_key,
          label: c.label,
          align: (isDateType(c.field_type) || isDateTimeType(c.field_type) || c.field_type === 'Number' || c.field_type === 'Yes/No') ? 'center' : 'left',
          isCustom: true,
          fieldType: c.field_type,
          category: c.category
        }));

        const baseKeys = new Set(BASE_COLUMNS.map(c => c.key));
        const merged = [
          ...BASE_COLUMNS,
          ...customMapped.filter(c => !baseKeys.has(c.key))
        ];
        setAllColumns(merged);
      }
    } catch (err) { console.error(err); }
  };

  const isColVisible = (colKey) => {
    const isPurchaseCatCol = colKey.startsWith('purchase_cat_');
    if (isPurchaseCatCol) {
      if (currentFilter === 'Purchase') {
        const deptMap = colVisibility['Purchase'];
        return deptMap ? deptMap[colKey] !== false : true;
      }
      if (currentFilter === 'all') {
        const allMap = colVisibility['all'];
        return allMap ? allMap[colKey] !== false : true;
      }
      const deptMap = colVisibility[currentFilter];
      return deptMap ? deptMap[colKey] === true : false;
    }

    if (currentFilter === 'all') return true;
    const deptMap = colVisibility[currentFilter];
    if (!deptMap) return true;
    const key = colKey === 'unit_serial' ? 'short_serial' : colKey;
    return deptMap[key] !== false;
  };

  const fetchUnits = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const deptParam = currentFilter;
      const res = await fetch(`${window.API_BASE}/api/dept-worklist/${encodeURIComponent(deptParam)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUnits(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  const handleRowClick = useCallback((orderId, unitId) => {
    window.dispatchEvent(new CustomEvent('setView', {
      detail: { view: 'flow', orderId: parseInt(orderId), unitId: parseInt(unitId) }
    }));
  }, []);

  const handleSort = useCallback((key) => {
    setSortKey(prevKey => {
      if (prevKey === key) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        return prevKey;
      } else {
        setSortDir('asc');
        return key;
      }
    });
  }, []);

  const unitStatusMap = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      const id = u.unit_id || u.id;
      map.set(id, calculateUnitStatus(u, currentFilter, userRole));
    }
    return map;
  }, [units, currentFilter, userRole]);

  const getUnitStatus = useCallback((unit) => {
    if (!unit) return 'Pending';
    const id = unit.unit_id || unit.id;
    return unitStatusMap.get(id) || 'Pending';
  }, [unitStatusMap]);

  const { holdCount, cancelledCount } = useMemo(() => {
    let hold = 0;
    let cancelled = 0;
    for (let i = 0; i < units.length; i++) {
      const s = getUnitStatus(units[i]);
      if (s === 'Hold' || s === 'On Hold') hold++;
      else if (s === 'Cancelled') cancelled++;
    }
    return { holdCount: hold, cancelledCount: cancelled };
  }, [units, getUnitStatus]);

  const filtered = useMemo(() => {
    return units.filter(u => {
      const status = getUnitStatus(u);

      // Tab-level filtering
      if (activeTab === 'hold' && status !== 'Hold' && status !== 'On Hold') return false;
      if (activeTab === 'cancelled' && status !== 'Cancelled') return false;

      // Apply Stat Card Filter if active
      if (statCardFilter === 'priority') {
        const p = (u.priority || 'Medium').toLowerCase();
        if (p !== 'urgent' && p !== 'high') return false;
      } else if (statCardFilter === 'inprogress') {
        const isUnitInProgress =
          status === 'In Progress' ||
          status === 'In Process' ||
          Number(u.inprogress_step_count || 0) > 0 ||
          Number(u.order_inprogress_step_count || 0) > 0 ||
          u.dept_steps?.some(s => isStatusInProgress(s.status)) ||
          u.design_steps?.some(s => isStatusInProgress(s.status)) ||
          u.steps?.some(s => isStatusInProgress(s.status)) ||
          isStatusInProgress(u.unit_status) ||
          isStatusInProgress(u.status) ||
          isStatusInProgress(u.order_status);
        if (!isUnitInProgress) return false;
      } else if (statCardFilter === 'blocked') {
        const isUnitBlocked =
          status === 'Blocked' ||
          String(u.unit_status || '').toLowerCase() === 'blocked' ||
          String(u.status || '').toLowerCase() === 'blocked' ||
          u.dept_steps?.some(s => String(s.status || '').toLowerCase() === 'blocked') ||
          u.steps?.some(s => String(s.status || '').toLowerCase() === 'blocked');
        if (!isUnitBlocked) return false;
      } else if (statCardFilter === 'due') {
        if (!u.delivery_date) return false;
        const today = new Date();
        const in7 = new Date(today);
        in7.setDate(today.getDate() + 7);
        const d = new Date(u.delivery_date);
        if (d < today || d > in7) return false;
      }

      if (priorityFilter !== 'all' && (u.priority || 'Medium').toLowerCase() !== priorityFilter) return false;

      // Status filter dropdown (when in All Orders tab)
      if (activeTab === 'all') {
        if ((statusFilter === 'incomplete' || statusFilter === 'active') && (status === 'Completed' || status === 'Cancelled')) return false;
        if (statusFilter === 'completed' && status !== 'Completed') return false;
        if ((statusFilter === 'pending' || statusFilter === 'not_started') && status !== 'Pending' && status !== 'Not Started') return false;
        if (statusFilter === 'inprogress' || statusFilter === 'in_process') {
          const isUnitInProgress =
            status === 'In Progress' ||
            status === 'In Process' ||
            Number(u.inprogress_step_count || 0) > 0 ||
            Number(u.order_inprogress_step_count || 0) > 0 ||
            u.dept_steps?.some(s => isStatusInProgress(s.status)) ||
            u.design_steps?.some(s => isStatusInProgress(s.status)) ||
            u.steps?.some(s => isStatusInProgress(s.status)) ||
            isStatusInProgress(u.unit_status) ||
            isStatusInProgress(u.status) ||
            isStatusInProgress(u.order_status);
          if (!isUnitInProgress) return false;
        }
        if (statusFilter === 'blocked') {
          const isUnitBlocked =
            status === 'Blocked' ||
            String(u.unit_status || '').toLowerCase() === 'blocked' ||
            String(u.status || '').toLowerCase() === 'blocked' ||
            u.dept_steps?.some(s => String(s.status || '').toLowerCase() === 'blocked') ||
            u.steps?.some(s => String(s.status || '').toLowerCase() === 'blocked');
          if (!isUnitBlocked) return false;
        }
        if (statusFilter === 'hold' && status !== 'Hold' && status !== 'On Hold') return false;
        if (statusFilter === 'cancelled' && status !== 'Cancelled') return false;
      }

      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const customMatches = Object.values(u.custom_fields || {}).some(
          val => val != null && String(val).toLowerCase().includes(q)
        );
        return (
          customMatches ||
          (u.unit_serial || '').toLowerCase().includes(q) ||
          (u.short_serial || '').toLowerCase().includes(q) ||
          (u.po_number || '').toLowerCase().includes(q) ||
          (u.company_name || '').toLowerCase().includes(q) ||
          (u.end_client_name || '').toLowerCase().includes(q) ||
          (u.reference_number || '').toLowerCase().includes(q) ||
          (u.tag || '').toLowerCase().includes(q) ||
          ((u.reference_number && u.tag) ? `${u.reference_number}/${u.tag}`.toLowerCase().includes(q) : false) ||
          (u.material_description || '').toLowerCase().includes(q) ||
          (u.part_number || '').toLowerCase().includes(q) ||
          (u.panel_type_size || '').toLowerCase().includes(q) ||
          (u.panel_code || '').toLowerCase().includes(q) ||
          (u.panel_ip_rating || '').toLowerCase().includes(q) ||
          (u.panel_comments || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [units, activeTab, statCardFilter, priorityFilter, statusFilter, searchTerm, getUnitStatus]);

  const sorted = useMemo(() => {
    const customDef = customColumnMap.get(sortKey);
    return [...filtered].sort((a, b) => {
      let av, bv;
      if (customDef) {
        const aVal = a.custom_fields?.[sortKey] ?? '';
        const bVal = b.custom_fields?.[sortKey] ?? '';
        if (isDateType(customDef.field_type) || isDateTimeType(customDef.field_type)) {
          av = aVal ? new Date(aVal).getTime() : Infinity;
          bv = bVal ? new Date(bVal).getTime() : Infinity;
        } else if (customDef.field_type === 'Number') {
          av = aVal !== '' ? Number(aVal) : Infinity;
          bv = bVal !== '' ? Number(bVal) : Infinity;
        } else {
          av = String(aVal).toLowerCase();
          bv = String(bVal).toLowerCase();
        }
      } else if (sortKey === 'priority') {
        av = PRIORITY_ORDER[a.priority || 'Medium'] ?? 2;
        bv = PRIORITY_ORDER[b.priority || 'Medium'] ?? 2;
      } else if (sortKey === 'delivery_date') {
        av = a.delivery_date ? new Date(a.delivery_date).getTime() : Infinity;
        bv = b.delivery_date ? new Date(b.delivery_date).getTime() : Infinity;
      } else if (sortKey === 'unit_status') {
        av = getUnitStatus(a);
        bv = getUnitStatus(b);
      } else {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        if (sortKey === 'reference_number') {
          aVal = (a.reference_number && a.tag) ? `${a.reference_number}/${a.tag}` : (a.reference_number || a.tag || '');
          bVal = (b.reference_number && b.tag) ? `${b.reference_number}/${b.tag}` : (b.reference_number || b.tag || '');
        } else if (['panel_code', 'panel_ip_rating', 'panel_comments'].includes(sortKey)) {
          if (!aVal) {
            const masterA = panelSizeMap.get(a.panel_type_size);
            aVal = sortKey === 'panel_code' ? masterA?.panel_code : sortKey === 'panel_ip_rating' ? masterA?.ip_rating : (masterA?.comments || masterA?.description);
          }
          if (!bVal) {
            const masterB = panelSizeMap.get(b.panel_type_size);
            bVal = sortKey === 'panel_code' ? masterB?.panel_code : sortKey === 'panel_ip_rating' ? masterB?.ip_rating : (masterB?.comments || masterB?.description);
          }
        }
        av = (aVal || '').toString().toLowerCase();
        bv = (bVal || '').toString().toLowerCase();
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir, customColumnMap, panelSizeMap, getUnitStatus]);

  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(sorted.length / pageSize));

  const displayedUnits = useMemo(() => {
    if (pageSize === 'all') return sorted;
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pageSize, currentPage]);

  const handleRowMouseDown = useCallback((unitId, idx, e) => {
    if (e.button !== 0) return; // Only primary (left) mouse click
    if (e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') return;
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('a') || e.target.closest('.modal-overlay')) return;

    if (e.shiftKey && lastSelectedIndexRef.current !== null) {
      e.preventDefault();
      const start = Math.min(lastSelectedIndexRef.current, idx);
      const end = Math.max(lastSelectedIndexRef.current, idx);
      setSelectedUnitIds(prev => {
        const next = new Set(prev);
        for (let i = start; i <= end; i++) {
          if (displayedUnits[i]) next.add(displayedUnits[i].unit_id);
        }
        return next;
      });
      lastSelectedIndexRef.current = idx;
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setSelectedUnitIds(prev => {
        const next = new Set(prev);
        if (next.has(unitId)) next.delete(unitId);
        else next.add(unitId);
        return next;
      });
      lastSelectedIndexRef.current = idx;
      return;
    }

    isDraggingSelectRef.current = true;
    dragStartIdxRef.current = idx;
    lastSelectedIndexRef.current = idx;

    const willSelect = !isIdSelected(unitId);
    dragSelectTargetStateRef.current = willSelect;

    setSelectedUnitIds(prev => {
      const next = new Set(prev);
      if (willSelect) next.add(unitId);
      else next.delete(unitId);
      return next;
    });
  }, [displayedUnits, selectedUnitIds]);

  const handleRowMouseEnter = useCallback((unitId, idx, e) => {
    if (!isDraggingSelectRef.current || dragStartIdxRef.current === null) return;

    const start = Math.min(dragStartIdxRef.current, idx);
    const end = Math.max(dragStartIdxRef.current, idx);
    const targetState = dragSelectTargetStateRef.current;

    setSelectedUnitIds(prev => {
      const next = new Set(prev);
      for (let i = start; i <= end; i++) {
        if (displayedUnits[i]) {
          if (targetState) next.add(displayedUnits[i].unit_id);
          else next.delete(displayedUnits[i].unit_id);
        }
      }
      return next;
    });
  }, [displayedUnits]);

  const handleToggleSelectAll = useCallback(() => {
    const displayedIds = displayedUnits.map(u => u.unit_id);
    const allSelected = displayedIds.length > 0 && displayedIds.every(id => isIdSelected(id));

    setSelectedUnitIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        displayedIds.forEach(id => {
          next.delete(id);
          next.delete(String(id));
          if (!isNaN(id)) next.delete(Number(id));
        });
      } else {
        displayedIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, [displayedUnits, isIdSelected]);

  const handleBatchPoUpload = useCallback(async (poNumber, file) => {
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      addToast('Only PDF files are allowed for PO document upload.', 'warning');
      return;
    }

    setIsUploadingPo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('po_number', poNumber);
      formData.append('unit_ids', JSON.stringify(Array.from(selectedUnitIds)));

      const res = await fetch(`${window.API_BASE}/api/units/batch-po`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload PO');
      }

      setPoSuccessMsg(`✓ PO #${data.po_number} attached to ${selectedUnitIds.size} serial numbers!`);
      addToast(`PO #${data.po_number} attached to ${selectedUnitIds.size} serial numbers!`, 'success');
      setTimeout(() => setPoSuccessMsg(''), 4500);

      setExternalPoNumber('');
      setSelectedUnitIds(new Set());
      try {
        localStorage.removeItem('erp_all_selectedUnitIds');
        localStorage.removeItem('erp_all_poNumber');
      } catch (e) { }
      await fetchUnits(true);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to upload PO.', 'error');
    } finally {
      setIsUploadingPo(false);
    }
  }, [selectedUnitIds, token, addToast, fetchUnits]);

  const handleSingleUnitPoClick = useCallback((unit) => {
    if (!canUploadPo) {
      addToast("Only Sales, Admin, and Manager roles can upload PO documents.", 'warning');
      return;
    }
    setSelectedUnitIds(new Set([unit.unit_id]));
    setExternalPoNumber(unit.po_number || '');
  }, [canUploadPo, addToast]);

  const handleDeleteUnitPoDoc = useCallback((unit) => {
    if (!canUploadPo) {
      addToast("Only Sales, Admin, and Manager roles can remove PO documents.", 'warning');
      return;
    }
    const serial = unit.short_serial || unit.unit_serial || unit.unit_id;
    setConfirmDialog({
      isOpen: true,
      title: 'Remove PO Document',
      message: `Are you sure you want to remove the attached PO PDF for serial ${serial}? This will return the panel to Sales.`,
      variant: 'danger',
      confirmText: 'Remove Document',
      onConfirm: async () => {
        const uId = unit.id || unit.unit_id;
        try {
          const res = await fetch(`${window.API_BASE}/api/units/${uId}/po-document`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to remove PO document');
          }

          setPoSuccessMsg(`✓ PO PDF removed for serial ${serial}`);
          addToast(`PO PDF removed for serial ${serial}`, 'success');
          setTimeout(() => setPoSuccessMsg(''), 4000);
          await fetchUnits(true);
        } catch (err) {
          console.error('Error removing PO PDF:', err);
          addToast(err.message || 'Failed to remove PO PDF document.', 'error');
        }
      }
    });
  }, [canUploadPo, token, fetchUnits, addToast]);

  const handleDeletePanelSize = useCallback((unit) => {
    if (!canEditPanelSize) {
      addToast("Only Design, Admin, and Manager roles can modify panel sizes.", 'warning');
      return;
    }
    const serial = unit.short_serial || unit.unit_serial || unit.unit_id;
    const currentSize = unit.panel_type_size || 'assigned size';
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Panel Size',
      message: `Are you sure you want to remove the panel size ("${currentSize}"), code, and IP rating for serial ${serial}?`,
      variant: 'danger',
      confirmText: 'Remove Panel Size',
      onConfirm: async () => {
        const uId = unit.id || unit.unit_id;
        try {
          // Optimistic local update so UI reflects immediately
          setUnits(prev => prev.map(u => {
            const currentId = u.unit_id || u.id;
            if (currentId === uId) {
              return {
                ...u,
                panel_type_size: null,
                panel_code: '',
                panel_ip_rating: '',
                panel_comments: ''
              };
            }
            return u;
          }));

          const res = await fetch(`${window.API_BASE}/api/units/${uId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ panel_type_size: null })
          });

          if (!res.ok) {
            throw new Error('Failed to remove panel size on server');
          }

          addToast(`Panel size cleared for serial ${serial}`, 'success');
          await fetchUnits(true);
        } catch (err) {
          console.error('Error removing panel size:', err);
          addToast(err.message || 'Failed to remove panel size.', 'error');
          await fetchUnits(true);
        }
      }
    });
  }, [canEditPanelSize, token, fetchUnits, addToast]);

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={11} className="sort-icon-idle" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="sort-icon-active" />
      : <ChevronDown size={12} className="sort-icon-active" />;
  };

  // Active columns filtered by department visibility
  const activeCols = useMemo(() => {
    return columnKeys
      .filter(key => isColVisible(key))
      .map(key => allColumns.find(c => c.key === key))
      .filter(Boolean);
  }, [columnKeys, allColumns, isColVisible]);

  // Partition active columns into Pinned (frozen on left) and Unpinned
  const pinnedCols = useMemo(() => activeCols.filter(c => pinnedKeys.includes(c.key)), [activeCols, pinnedKeys]);
  const unpinnedCols = useMemo(() => activeCols.filter(c => !pinnedKeys.includes(c.key)), [activeCols, pinnedKeys]);
  const visibleCols = useMemo(() => [...pinnedCols, ...unpinnedCols], [pinnedCols, unpinnedCols]);

  // Calculate cumulative left offsets for pinned columns (offset by selection column width in Sales view)
  const isSalesView = (currentFilter || '').toLowerCase() === 'sales';
  const showRowSelection = isSalesView || isPurchaseView;
  const SELECTION_COL_WIDTH = showRowSelection ? 38 : 0;
  const stickyLeftMap = useMemo(() => {
    const map = {};
    let currentLeft = SELECTION_COL_WIDTH;
    pinnedCols.forEach((c) => {
      const defaultWidth = isDateTimeType(c.fieldType) ? 170 : (DEFAULT_COL_WIDTHS[c.key] || 150);
      const width = columnWidths[c.key] || defaultWidth;
      map[c.key] = currentLeft;
      currentLeft += width;
    });
    return map;
  }, [pinnedCols, columnWidths, SELECTION_COL_WIDTH]);

  const isPinned = (colKey) => pinnedKeys.includes(colKey);
  const isLastPinned = (colKey) => pinnedCols.length > 0 && pinnedCols[pinnedCols.length - 1].key === colKey;

  const getColStyle = (colKey, isHeader = false) => {
    const colDef = allColumns.find(c => c.key === colKey);
    const defaultWidth = isDateTimeType(colDef?.fieldType) ? 170 : (DEFAULT_COL_WIDTHS[colKey] || 150);
    const width = columnWidths[colKey] || defaultWidth;
    const pinned = isPinned(colKey);
    const lastPin = isLastPinned(colKey);

    return {
      width,
      minWidth: width,
      maxWidth: width,
      boxSizing: 'border-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      position: pinned ? 'sticky' : 'relative',
      left: pinned ? `${stickyLeftMap[colKey]}px` : undefined,
      zIndex: pinned ? (isHeader ? 24 : 3) : (isHeader ? 20 : 1),
      background: isHeader ? 'var(--bg2)' : undefined,
      willChange: pinned ? 'transform' : undefined,
      borderRight: lastPin ? '2px solid var(--blue, #3b82f6)' : undefined
    };
  };



  const selectedUnitSerials = useMemo(() => {
    if (selectedUnitIds.size === 0) return [];
    return units
      .filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id))
      .map(u => u.short_serial || u.unit_serial || u.serial_number || u.unit_id)
      .filter(Boolean);
  }, [units, selectedUnitIds, isIdSelected]);

  if (isLoading) return (
    <div style={{ padding: 60, textAlign: 'center', color: 'var(--text3)' }}>
      <div style={{ fontSize: 13 }}>Loading units...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>

      {/* ── Tabs Bar (All Orders, Hold, Cancelled) ─────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
        gap: 6
      }}>
        {/* All Orders Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'all' ? '2px solid var(--blue)' : '2px solid transparent',
            color: activeTab === 'all' ? 'var(--text)' : 'var(--text3)',
            padding: '11px 16px',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: activeTab === 'all' ? 600 : 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: '-1px',
            transition: 'all 0.15s'
          }}
        >
          <span>All Orders</span>
          <span style={{
            background: activeTab === 'all' ? 'var(--blue-dim)' : 'var(--bg3)',
            color: activeTab === 'all' ? 'var(--blue)' : 'var(--text3)',
            borderRadius: 10,
            padding: '1px 7px',
            fontSize: 11,
            fontWeight: 700
          }}>
            {units.length}
          </span>
        </button>

        {/* Hold Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('hold')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'hold' ? '2px solid var(--orange)' : '2px solid transparent',
            color: activeTab === 'hold' ? 'var(--orange)' : 'var(--text3)',
            padding: '11px 16px',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: activeTab === 'hold' ? 600 : 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: '-1px',
            transition: 'all 0.15s'
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--orange)', display: 'inline-block'
          }} />
          <span>Hold</span>
          <span style={{
            background: activeTab === 'hold' ? 'var(--orange-dim)' : 'var(--bg3)',
            color: activeTab === 'hold' ? 'var(--orange)' : 'var(--text3)',
            borderRadius: 10,
            padding: '1px 7px',
            fontSize: 11,
            fontWeight: 700
          }}>
            {holdCount}
          </span>
        </button>

        {/* Cancelled Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'cancelled' ? '2px solid var(--red)' : '2px solid transparent',
            color: activeTab === 'cancelled' ? 'var(--red)' : 'var(--text3)',
            padding: '11px 16px',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: activeTab === 'cancelled' ? 600 : 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: '-1px',
            transition: 'all 0.15s'
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--red)', display: 'inline-block'
          }} />
          <span>Cancelled</span>
          <span style={{
            background: activeTab === 'cancelled' ? 'var(--red-dim)' : 'var(--bg3)',
            color: activeTab === 'cancelled' ? 'var(--red)' : 'var(--text3)',
            borderRadius: 10,
            padding: '1px 7px',
            fontSize: 11,
            fontWeight: 700
          }}>
            {cancelledCount}
          </span>
        </button>

        {/* ── Right side: Purchase Department Action Buttons ── */}
        {isPurchaseView && (
          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 0'
          }}>
            {/* Order Recieved Button */}
            <button
              type="button"
              onClick={() => {
                setIsPurchaseOrderReceivedOpen(true);
              }}
              title="Purchase: Order Recieved"
              style={{
                height: 34,
                padding: '0 15px',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.01em',
                borderRadius: 7,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--green, #10b981)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.18)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <PackageCheck size={15} style={{ flexShrink: 0 }} />
              <span>Order Recieved</span>
            </button>

            {/* New Order Button */}
            <button
              type="button"
              onClick={() => {
                setIsPurchaseNewOrderOpen(true);
              }}
              title="Purchase: New Order"
              style={{
                height: 34,
                padding: '0 15px',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.01em',
                borderRadius: 7,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(56, 189, 248, 0.12)',
                color: 'var(--blue, #38bdf8)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.65)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Plus size={15} style={{ flexShrink: 0 }} />
              <span>New Order</span>
            </button>
          </div>
        )}

        {/* ── Right side: PO Controls (Enter PO No. + Upload PO button) — Sales Only ── */}
        {isSalesView && (
          <PoUploadBar
            selectedCount={selectedUnitIds.size}
            selectedUnitSerials={selectedUnitSerials}
            canUploadPo={canUploadPo}
            isUploadingPo={isUploadingPo}
            poSuccessMsg={poSuccessMsg}
            onClearSelection={() => setSelectedUnitIds(new Set())}
            onUploadPo={handleBatchPoUpload}
            externalPoNumber={externalPoNumber}
            setExternalPoNumber={setExternalPoNumber}
            addToast={addToast}
          />
        )}

      </div>

      {/* ── Toolbar ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap'
      }}>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '7px 12px', flex: '1 1 200px', minWidth: 0
        }}>
          <Search size={13} style={{ color: 'var(--text3)', flexShrink: 0 }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search serial no., PO, description, client..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: 13, width: '100%'
            }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', display: 'flex', padding: 0 }}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--text2)', fontSize: 12, padding: '7px 10px', cursor: 'pointer', outline: 'none'
          }}
        >
          <option value="all">All Status</option>
          <option value="incomplete">Not Started + In Process</option>
          <option value="pending">Not Started</option>
          <option value="inprogress">In Process</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
          <option value="hold">On Hold</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={e => setPriorityFilter(e.target.value)}
          style={{
            background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--text2)', fontSize: 12, padding: '7px 10px', cursor: 'pointer', outline: 'none'
          }}
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* Reset Layout button */}
        <button
          onClick={handleResetLayout}
          title="Reset column positions, sizes, and freeze states to default"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            background: 'var(--bg3)', border: '1px solid var(--border)',
            borderRadius: 8, padding: '7px 10px', fontSize: 12, color: 'var(--text2)',
            cursor: 'pointer', outline: 'none'
          }}
        >
          <RotateCcw size={12} />
          Reset Layout
        </button>

        {statCardFilter && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: statCardFilter === 'priority' ? 'var(--orange-dim)' :
              statCardFilter === 'inprogress' ? 'var(--blue-dim)' :
                statCardFilter === 'blocked' ? 'var(--red-dim)' :
                  statCardFilter === 'due' ? 'var(--purple-dim)' : 'var(--orange-dim)',
            color: statCardFilter === 'priority' ? 'var(--orange)' :
              statCardFilter === 'inprogress' ? 'var(--blue)' :
                statCardFilter === 'blocked' ? 'var(--red)' :
                  statCardFilter === 'due' ? 'var(--purple)' : 'var(--orange)',
            border: `1px solid ${statCardFilter === 'priority' ? 'rgba(249, 115, 22, 0.35)' :
              statCardFilter === 'inprogress' ? 'rgba(56, 189, 248, 0.35)' :
                statCardFilter === 'blocked' ? 'rgba(248, 113, 113, 0.35)' :
                  statCardFilter === 'due' ? 'rgba(168, 85, 247, 0.35)' : 'rgba(249, 115, 22, 0.35)'
              }`,
            borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>
            <span>
              Card Filter: {
                statCardFilter === 'priority' ? 'Urgent / High' :
                  statCardFilter === 'inprogress' ? 'In Progress' :
                    statCardFilter === 'blocked' ? 'Blocked' :
                      statCardFilter === 'due' ? 'Due This Week' : 'All Active'
              }
            </span>
            <button
              onClick={onClearStatFilter}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, marginLeft: 2, display: 'flex', alignItems: 'center',
                color: 'inherit'
              }}
              title="Clear card filter"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div
        ref={tableContainerRef}
        className="table-responsive-scroll"
        style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}
      >
        <table className="erp-master-table">
          <thead>
            <tr>
              {/* Selection Checkbox Header — Sales & Purchase */}
              {showRowSelection && (
                <th
                  className="erp-th"
                  style={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 26,
                    width: 38,
                    minWidth: 38,
                    maxWidth: 38,
                    padding: '8px 4px',
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    borderBottom: '2px solid var(--border)',
                    borderRight: '1px solid var(--border)',
                    userSelect: 'none'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={displayedUnits.length > 0 && displayedUnits.every(u => isIdSelected(u.unit_id))}
                    ref={el => {
                      if (el) {
                        const hasSome = displayedUnits.some(u => isIdSelected(u.unit_id));
                        const hasAll = displayedUnits.length > 0 && displayedUnits.every(u => isIdSelected(u.unit_id));
                        el.indeterminate = hasSome && !hasAll;
                      }
                    }}
                    onChange={handleToggleSelectAll}
                    style={{ cursor: 'pointer', accentColor: 'var(--blue)', width: 14, height: 14 }}
                    title="Select / Deselect visible serial numbers"
                  />
                </th>
              )}
              {visibleCols.map(({ key: colKey, label, align }) => {
                const isPinned = pinnedKeys.includes(colKey);
                const isOver = dragOverColKey === colKey;
                const visibleKeys = visibleCols.map(c => c.key);
                const draggedIdx = visibleKeys.indexOf(draggedColKey);
                const targetIdx = visibleKeys.indexOf(colKey);

                let dragOverClass = '';
                if (isOver && draggedIdx !== -1 && draggedIdx !== targetIdx) {
                  dragOverClass = draggedIdx < targetIdx ? ' drag-over-right' : ' drag-over-left';
                }

                const baseStyle = getColStyle(colKey, true);
                const isDragging = draggedColKey === colKey;
                const isSorted = sortKey === colKey;
                const lastPin = isLastPinned(colKey);
                const thClass = `erp-th${isDragging ? ' dragging' : ''}${dragOverClass}${isSorted ? ' is-sorted' : ''}${isPinned ? ' is-pinned' : ''}${lastPin ? ' last-pinned' : ''}`.trim();

                return (
                  <th
                    key={colKey}
                    className={thClass}
                    draggable
                    onDragStart={(e) => handleHeaderDragStart(e, colKey)}
                    onDragOver={(e) => handleHeaderDragOver(e, colKey)}
                    onDragLeave={(e) => handleHeaderDragLeave(e, colKey)}
                    onDragEnd={handleHeaderDragEnd}
                    onDrop={(e) => handleHeaderDrop(e, colKey)}
                    style={{
                      ...baseStyle,
                      cursor: 'grab',
                      textAlign: align,
                      verticalAlign: 'middle'
                    }}
                  >
                    <div className="erp-th-content" style={{ justifyContent: align === 'center' ? 'center' : 'space-between' }}>
                      <div
                        onClick={() => handleSort(colKey)}
                        className="erp-th-label-zone"
                      >
                        <GripVertical size={12} className="erp-th-drag-handle" />
                        <span className="erp-th-title" title={label}>{label}</span>
                        <div className="erp-th-sort-icon">
                          <SortIcon col={colKey} />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => togglePin(colKey, e)}
                        title={isPinned ? "Unfreeze Column" : "Freeze Column to left"}
                        className={`erp-th-pin-btn${isPinned ? ' is-pinned' : ''}`}
                      >
                        <Pin size={11} style={{ transform: isPinned ? 'rotate(-45deg)' : 'none', transition: 'transform 0.15s' }} />
                      </button>
                    </div>

                    {/* Column Resize Handle */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, colKey)}
                      onDoubleClick={(e) => handleAutoFitColumn(colKey, e)}
                      onClick={(e) => e.stopPropagation()}
                      title="Drag to resize. Double-click to auto-fit to content."
                      className="erp-resize-handle"
                    />
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayedUnits.map((unit, idx) => (
              <TableRow
                key={unit.unit_id}
                unit={unit}
                idx={idx}
                currentFilter={currentFilter}
                showSelection={showRowSelection}
                isSelected={isIdSelected(unit.unit_id)}
                status={getUnitStatus(unit)}
                visibleCols={visibleCols}
                columnWidths={columnWidths}
                pinnedKeys={pinnedKeys}
                stickyLeftMap={stickyLeftMap}
                canEdit={canEdit}
                canEditPanelSize={canEditPanelSize}
                canUploadPo={canUploadPo}
                canConfirmDesign={canConfirmDesign}
                onConfirmDesignClassification={handleConfirmDesignClassification}
                onUnconfirmDesignClassification={handleUnconfirmDesignClassification}
                onRequestUnconfirmDesign={handleRequestUnconfirmDesign}
                panelSizeMasters={panelSizeMasters}
                panelSizeMap={panelSizeMap}
                customColumnDefs={customColumnDefs}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                onRowMouseDown={handleRowMouseDown}
                onRowMouseEnter={handleRowMouseEnter}
                onRowClick={handleRowClick}
                onSaveInlineCell={handleSaveInlineCell}
                onSingleUnitPoClick={handleSingleUnitPoClick}
                onDeleteUnitPoDoc={handleDeleteUnitPoDoc}
                onPartNumberClick={handlePartNumberClick}
                setPoPdfViewer={setPoPdfViewer}
                onEditRefTag={setEditingRefTagUnit}
                onOpenOrderDocs={setOrderDocsModalData}
                onDeletePanelSize={handleDeletePanelSize}
                purchaseOrdersBySerialAndCat={purchaseOrdersBySerialAndCat}
                canEditPurchaseNA={canEditPurchaseNA}
                onTogglePurchaseCatNA={handleTogglePurchaseCatNA}
              />
            ))}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={(visibleCols.length || 12) + (showRowSelection ? 1 : 0)} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
                  <Search size={28} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 14 }}>
                    {activeTab === 'hold'
                      ? 'No orders are currently on hold'
                      : activeTab === 'cancelled'
                        ? 'No cancelled orders found'
                        : 'No units match the current filters'}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Table Footer & Pagination ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        fontSize: '12px',
        color: 'var(--text2)',
        flexWrap: 'wrap',
        gap: 8
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>
            Showing <strong>{sorted.length === 0 ? 0 : (pageSize === 'all' ? 1 : (currentPage - 1) * pageSize + 1)}</strong>–
            <strong>{pageSize === 'all' ? sorted.length : Math.min(currentPage * pageSize, sorted.length)}</strong> of <strong>{sorted.length}</strong> serials
          </span>
          {selectedUnitIds.size > 0 && (
            <span
              onClick={() => setSelectedUnitIds(new Set())}
              style={{
                color: 'var(--blue)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm, 4px)',
                background: 'var(--blue-dim)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: 12
              }}
              title="Click to deselect all"
            >
              <span>{selectedUnitIds.size} selected</span>
              <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>✕</span>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setPageSize(val);
                setCurrentPage(1);
              }}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: '12px',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <option value={50}>50</option>
              <option value={100}>100 (Default)</option>
              <option value={250}>250</option>
              <option value="all">All ({sorted.length})</option>
            </select>
          </div>

          {pageSize !== 'all' && totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: currentPage <= 1 ? 'var(--text3)' : 'var(--text)',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: currentPage <= 1 ? 0.4 : 1
                }}
              >
                ‹ Prev
              </button>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: currentPage >= totalPages ? 'var(--text3)' : 'var(--text)',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: currentPage >= totalPages ? 0.4 : 1
                }}
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── In-App Viewer for PO Document ── */}
      {poPdfViewer && (
        <DocumentPreviewModal
          doc={poPdfViewer}
          getDocUrl={getDocUrl}
          onClose={() => setPoPdfViewer(null)}
          extraActions={
            canUploadPo && poPdfViewer.unit ? (
              <button
                type="button"
                className="vbtn"
                onClick={() => {
                  const u = poPdfViewer.unit;
                  setPoPdfViewer(null);
                  handleDeleteUnitPoDoc(u);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 12,
                  padding: '6px 12px',
                  color: 'var(--red)',
                  background: 'var(--red-dim)',
                  border: '1px solid rgba(248, 113, 113, 0.35)',
                  borderRadius: 'var(--radius-sm, 4px)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                title="Delete attached PO document"
              >
                <Trash2 size={13} color="var(--red)" />
                <span>Delete File</span>
              </button>
            ) : null
          }
        />
      )}

      {/* ── Technical Drawings & Standard Documents Modal ── */}
      {showDocsModal && selectedPartForDocs && (
        <TechnicalDocsModal
          selectedPart={selectedPartForDocs}
          onClose={() => setShowDocsModal(false)}
          canManageDocs={canManageDocs}
          userRole={userRole}
          token={token}
          getDocUrl={getDocUrl}
          onUpdatePartMasters={fetchPartMasters}
          onUpdateSelectedPart={setSelectedPartForDocs}
          onDocumentChange={() => fetchUnits(true)}
        />
      )}

      {/* ── Edit Reference & Tag Number Modal (Admin / Manager / Sales) ── */}
      {editingRefTagUnit && (
        <EditRefTagModal
          isOpen={true}
          unit={editingRefTagUnit}
          onClose={() => setEditingRefTagUnit(null)}
          onSave={async ({ reference_number, tag }) => {
            // Optimistic UI update so table view reflects changes immediately
            setUnits(prev => prev.map(u => {
              let updated = u;
              if (u.unit_id === editingRefTagUnit.unit_id || u.id === editingRefTagUnit.id) {
                updated = { ...updated, tag };
              }
              if (u.order_id === editingRefTagUnit.order_id) {
                updated = { ...updated, reference_number };
              }
              return updated;
            }));

            // Persist to backend without touching unit serial numbers
            const uId = editingRefTagUnit.id || editingRefTagUnit.unit_id;
            const res = await fetch(`${window.API_BASE}/api/units/${uId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ reference_number, tag })
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || 'Failed to save Reference & Tag');
            }

            window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: editingRefTagUnit.order_id } }));
            fetchUnits(true);
          }}
        />
      )}

      {/* ── Order Documents Modal (Quotation, Details, Approved Documents) ── */}
      {orderDocsModalData && (
        <OrderDocumentsModal
          isOpen={true}
          orderId={orderDocsModalData.orderId}
          orderNumber={orderDocsModalData.orderNumber}
          clientName={orderDocsModalData.clientName}
          projectName={orderDocsModalData.projectName}
          onClose={() => setOrderDocsModalData(null)}
          onDocumentsUpdated={() => {
            fetchUnits(true);
          }}
        />
      )}

      {/* ── Purchase New Order Modal (Buying from Vendors) ── */}
      <PurchaseNewOrderModal
        isOpen={isPurchaseNewOrderOpen}
        onClose={() => setIsPurchaseNewOrderOpen(false)}
        existingUnits={units}
        addToast={addToast}
        onOrderSaved={() => {
          fetchUnits(true);
          fetchVendorPurchaseOrders();
        }}
      />

      {/* ── Purchase Order Received Modal (Goods Receipt / Incoming from Vendors) ── */}
      <PurchaseOrderReceivedModal
        isOpen={isPurchaseOrderReceivedOpen}
        onClose={() => setIsPurchaseOrderReceivedOpen(false)}
        onStatusUpdated={() => {
          fetchUnits(true);
          fetchVendorPurchaseOrders();
        }}
      />

      {/* ── Toast Notifications & Confirmation Dialog ── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(d => ({ ...d, isOpen: false }))}
      />
    </div>
  );
}
