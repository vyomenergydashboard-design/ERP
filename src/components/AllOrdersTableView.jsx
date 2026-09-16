import { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import ExcelSheetViewer from './ExcelSheetViewer';
import { 
  Search, X, ArrowUpDown, ChevronUp, ChevronDown, Layers, Pin, GripVertical, RotateCcw, Check,
  UploadCloud, FileText, Trash2, ExternalLink, AlertCircle, Plus, FileCheck, Loader2,
  Eye, History, Download, Upload, CheckSquare, Square
} from 'lucide-react';

const PRIORITY_ORDER = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

const PRIORITY_STYLES = {
  Urgent: { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'rgba(239,68,68,0.35)' },
  High:   { bg: 'rgba(249,115,22,0.12)', color: '#f97316', border: 'rgba(249,115,22,0.35)' },
  Medium: { bg: 'rgba(234,179,8,0.12)',  color: '#eab308', border: 'rgba(234,179,8,0.35)' },
  Low:    { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.35)' },
};

const STATUS_STYLES = {
  Completed:    { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.3)' },
  Blocked:      { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  'In Progress':{ bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  'In Process': { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: 'rgba(59,130,246,0.3)' },
  Pending:      { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  'Not Started':{ bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  Hold:         { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.35)' },
  'On Hold':    { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.35)' },
  Cancelled:    { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444', border: 'rgba(239,68,68,0.35)' },
};

const BASE_COLUMNS = [
  { key: 'order_number',          label: 'Order #',       align: 'left' },
  { key: 'short_serial',          label: 'Serial No.',    align: 'left', alias: 'unit_serial' },
  { key: 'company_name',          label: 'Customer',      align: 'left' },
  { key: 'project_name',          label: 'Project Name',  align: 'left' },
  { key: 'po_number',             label: 'PO Number',     align: 'left' },
  { key: 'reference_number',      label: 'Ref #',         align: 'left' },
  { key: 'end_client_name',       label: 'End Client',    align: 'left' },
  { key: 'part_number',           label: 'Part Number',   align: 'left' },
  { key: 'panel_code',            label: 'Panel Code',    align: 'center' },
  { key: 'panel_type_size',       label: 'Panel Size',    align: 'left' },
  { key: 'panel_ip_rating',       label: 'IP Rating',     align: 'center' },
  { key: 'panel_comments',        label: 'Comments',      align: 'left' },
  { key: 'material_description',  label: 'Description',   align: 'left' },
  { key: 'classification',        label: 'Type (Design)', align: 'center' },
  { key: 'priority',              label: 'Priority',      align: 'center' },
  { key: 'delivery_date',         label: 'Delivery',      align: 'left' },
  { key: 'unit_status',           label: 'Status',        align: 'center' },
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

const formatCustomDateTime = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const formatCustomDate = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const DEFAULT_COL_WIDTHS = {
  order_number: 105,
  short_serial: 120,
  company_name: 175,
  project_name: 140,
  po_number: 110,
  reference_number: 95,
  end_client_name: 125,
  part_number: 145,
  panel_code: 115,
  panel_type_size: 155,
  panel_ip_rating: 95,
  panel_comments: 190,
  material_description: 220,
  classification: 115,
  priority: 95,
  delivery_date: 110,
  unit_status: 105,
};

function PanelSizeComboboxCell({ unit, panelSizeMasters, canEdit, onSave }) {
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
          borderRadius: 6,
          cursor: 'pointer',
          background: isOpen ? 'var(--bg3)' : 'rgba(59,130,246,0.07)',
          border: isOpen ? '1px solid var(--blue)' : '1px solid rgba(59,130,246,0.25)',
          transition: 'all 0.15s',
          fontSize: 12,
          boxSizing: 'border-box'
        }}
        onMouseEnter={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(59,130,246,0.15)';
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.5)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isOpen) {
            e.currentTarget.style.background = 'rgba(59,130,246,0.07)';
            e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)';
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
          fontWeight: 500
        }}>
          {currentValue || 'Select Size...'}
        </span>
        <ChevronDown size={12} style={{ color: '#60a5fa', flexShrink: 0, opacity: 0.9 }} />
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
                    borderRadius: 6,
                    cursor: 'pointer',
                    background: isHighlighted ? 'rgba(59,130,246,0.18)' : (isSelected ? 'rgba(59,130,246,0.08)' : 'transparent'),
                    border: isHighlighted ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
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
                              color: '#c084fc',
                              background: 'rgba(168, 85, 247, 0.15)',
                              border: '1px solid rgba(168, 85, 247, 0.3)',
                              padding: '1px 5px',
                              borderRadius: 4,
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
                          color: isHighlighted ? '#60a5fa' : 'var(--text)'
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
                        color: isHighlighted ? '#60a5fa' : 'var(--text)'
                      }}>
                        {renderHighlighted(opt.panel_size || opt.size_name, cleanQ)}
                      </span>
                      {isSelected && <Check size={13} style={{ color: '#10b981', flexShrink: 0 }} />}
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

function TechnicalDocsModal({
  selectedPart,
  onClose,
  canManageDocs,
  userRole,
  token,
  getDocUrl,
  onUpdatePartMasters,
  onUpdateSelectedPart
}) {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadDocType, setUploadDocType] = useState('Drawing');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [showDrawingHistory, setShowDrawingHistory] = useState(false);
  const [showBomHistory, setShowBomHistory] = useState(false);
  const [pdfViewerDoc, setPdfViewerDoc] = useState(null);
  const fileInputRef = useRef(null);

  const effectiveRole = (userRole || (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}').role) || '').trim().toLowerCase();
  const isDesignUser = effectiveRole === 'design';
  const canViewRevisionHistory = !isDesignUser;

  const isStandard = (selectedPart.classification || '').trim().toLowerCase() === 'standard';
  const masterDocs = selectedPart.masterDocs || [];
  const orderDocs = selectedPart.orderDocs || [];

  const drawings = masterDocs.filter(d => (d.doc_type || 'Drawing').toLowerCase() === 'drawing');
  const boms = masterDocs.filter(d => (d.doc_type || '').toLowerCase() === 'bom');

  const latestDrawing = selectedPart.drawing || drawings.find(d => d.is_current) || (drawings.length > 0 ? drawings[drawings.length - 1] : null);
  const latestBom = selectedPart.bom || boms.find(d => d.is_current) || (boms.length > 0 ? boms[boms.length - 1] : null);

  const drawingHistory = selectedPart.drawingHistory && selectedPart.drawingHistory.length > 0
    ? selectedPart.drawingHistory
    : [...drawings].reverse();

  const bomHistory = selectedPart.bomHistory && selectedPart.bomHistory.length > 0
    ? selectedPart.bomHistory
    : [...boms].reverse();
  
  const customDrawings = orderDocs.filter(d => 
    (d.doc_type || '').toLowerCase() === 'drawing' || 
    (d.doc_type || '').toLowerCase() === 'technical specification' ||
    (d.doc_type || '').toLowerCase() === 'spec'
  );
  const otherOrderDocs = orderDocs.filter(d => 
    (d.doc_type || '').toLowerCase() !== 'drawing' && 
    (d.doc_type || '').toLowerCase() !== 'technical specification' && 
    (d.doc_type || '').toLowerCase() !== 'spec'
  );

  const formatDateDMY = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return String(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (e) {
      return String(dateStr);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFilesToUpload(Array.from(e.target.files));
      setUploadError('');
      setUploadSuccess('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFilesToUpload(Array.from(e.dataTransfer.files));
      setUploadError('');
      setUploadSuccess('');
    }
  };

  const handleRemoveFile = (index) => {
    setFilesToUpload(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadStandard = async (targetType) => {
    const docTypeToUpload = targetType || uploadDocType || 'Drawing';
    if (filesToUpload.length === 0) {
      setUploadError(`Please select a ${docTypeToUpload} file (${docTypeToUpload === 'BOM' ? 'Excel or PDF' : 'PDF'}) to upload.`);
      return;
    }
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      let partId = selectedPart.partId;

      if (!partId) {
        const createRes = await fetch(`${window.API_BASE}/api/part-number-masters`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            part_number: selectedPart.partNumber,
            description: selectedPart.description || selectedPart.partNumber,
            category: 'Standard'
          })
        });

        if (createRes.ok) {
          const created = await createRes.json();
          partId = created.id;
        } else {
          const listRes = await fetch(`${window.API_BASE}/api/part-number-masters`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (listRes.ok) {
            const list = await listRes.json();
            const found = list.find(p => p.part_number?.trim().toLowerCase() === selectedPart.partNumber?.trim().toLowerCase());
            if (found) partId = found.id;
          }
        }
      }

      if (!partId) {
        throw new Error('Could not associate part master. Please check part number or permissions.');
      }

      const formData = new FormData();
      formData.append('doc_type', docTypeToUpload);
      filesToUpload.forEach(f => formData.append('files', f));

      const upRes = await fetch(`${window.API_BASE}/api/part-number-masters/${partId}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!upRes.ok) {
        const errData = await upRes.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to upload ${docTypeToUpload}`);
      }

      const listRes = await fetch(`${window.API_BASE}/api/part-number-masters`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (listRes.ok) {
        const freshList = await listRes.json();
        const updated = freshList.find(p => p.id === partId || p.part_number?.trim().toLowerCase() === selectedPart.partNumber?.trim().toLowerCase());
        if (updated) {
          onUpdateSelectedPart(prev => ({
            ...prev,
            partId: updated.id,
            clientName: updated.client_name || prev.clientName,
            project: updated.project || prev.project,
            drawing: updated.drawing,
            bom: updated.bom,
            drawingHistory: updated.drawing_history || [],
            bomHistory: updated.bom_history || [],
            masterDocs: updated.documents || []
          }));
        }
      }

      if (onUpdatePartMasters) onUpdatePartMasters();
      setFilesToUpload([]);
      setUploadSuccess(`${docTypeToUpload} uploaded successfully!`);
      setShowUploadBox(false);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadNonStandard = async () => {
    if (filesToUpload.length === 0) {
      setUploadError('Please select at least one drawing file to upload.');
      return;
    }
    if (!selectedPart.orderId) {
      setUploadError('No Order ID found to attach this document to.');
      return;
    }
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      const formData = new FormData();
      if (selectedPart.unitId) {
        formData.append('entity_type', 'Unit');
        formData.append('entity_id', selectedPart.unitId);
      } else {
        formData.append('entity_type', 'Order');
        formData.append('entity_id', selectedPart.orderId);
      }
      formData.append('doc_type', 'Drawing');
      filesToUpload.forEach(f => formData.append('files', f));

      const upRes = await fetch(`${window.API_BASE}/api/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!upRes.ok) {
        const errData = await upRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload drawing');
      }

      const savedDocs = await upRes.json();
      onUpdateSelectedPart(prev => ({
        ...prev,
        orderDocs: [...(prev.orderDocs || []), ...(Array.isArray(savedDocs) ? savedDocs : [savedDocs])]
      }));
      setFilesToUpload([]);
      setUploadSuccess('Custom Technical Drawing(s) uploaded successfully!');
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload drawing');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteMasterDoc = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document revision?')) return;
    try {
      const delRes = await fetch(`${window.API_BASE}/api/part-number-masters/${selectedPart.partId}/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (delRes.ok) {
        const listRes = await fetch(`${window.API_BASE}/api/part-number-masters`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (listRes.ok) {
          const freshList = await listRes.json();
          const updated = freshList.find(p => p.id === selectedPart.partId || p.part_number?.trim().toLowerCase() === selectedPart.partNumber?.trim().toLowerCase());
          if (updated) {
            onUpdateSelectedPart(prev => ({
              ...prev,
              drawing: updated.drawing,
              bom: updated.bom,
              drawingHistory: updated.drawing_history || [],
              bomHistory: updated.bom_history || [],
              masterDocs: updated.documents || []
            }));
          }
        }
        if (onUpdatePartMasters) onUpdatePartMasters();
      } else {
        const err = await delRes.json().catch(() => ({}));
        alert(err.error || 'Failed to delete document');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while deleting document');
    }
  };

  const handleDeleteOrderDoc = async (docId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const delRes = await fetch(`${window.API_BASE}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (delRes.ok) {
        onUpdateSelectedPart(prev => ({
          ...prev,
          orderDocs: prev.orderDocs.filter(d => d.id !== docId)
        }));
      } else {
        const err = await delRes.json().catch(() => ({}));
        alert(err.error || 'Failed to delete document');
      }
    } catch (e) {
      console.error(e);
      alert('Network error while deleting document');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const renderUploadBox = (onUploadAction, buttonLabel) => (
    <div style={{
      background: 'var(--bg3)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '18px'
    }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? '#3b82f6' : 'var(--border)'}`,
          background: isDragging ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.02)',
          borderRadius: '8px',
          padding: '22px 16px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.15s ease'
        }}
      >
        <UploadCloud size={30} style={{ color: isDragging ? '#3b82f6' : 'var(--text3)', margin: '0 auto 8px' }} />
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
          Click to browse or drag & drop technical files
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
          {isStandard ? (uploadDocType === 'BOM' ? 'Excel (.xlsx, .xls, .csv) or PDF documents (Up to 10 files)' : 'PDF documents only (Up to 10 files)') : 'Supports PDF, DWG, DXF, PNG, JPG, CAD, STEP, ZIP (Up to 10 files)'}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={isStandard ? (uploadDocType === 'BOM' ? '.pdf,application/pdf,.xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv' : '.pdf,application/pdf') : undefined}
          multiple
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </div>

      {filesToUpload.length > 0 && (
        <div style={{ marginTop: '14px' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)', marginBottom: '8px' }}>
            Selected Files ({filesToUpload.length}):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
            {filesToUpload.map((f, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <FileCheck size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span style={{ fontWeight: 500, color: 'var(--text)' }}>{f.name}</span>
                  <span style={{ color: 'var(--text3)', fontSize: '11px' }}>({formatFileSize(f.size)})</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveFile(idx); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '2px 4px' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px', gap: '8px' }}>
            <button
              type="button"
              className="vbtn"
              onClick={() => setFilesToUpload([])}
              style={{ fontSize: '12px', padding: '6px 12px' }}
            >
              Clear
            </button>
            <button
              type="button"
              className="vbtn primary"
              disabled={isUploading}
              onClick={onUploadAction}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                padding: '6px 16px',
                background: '#3b82f6',
                color: '#fff'
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={14} />
                  <span>{buttonLabel}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {uploadError && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          borderRadius: '6px',
          background: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#ef4444',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={14} />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          borderRadius: '6px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#10b981',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={14} />
          <span>{uploadSuccess}</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target.className === 'modal-overlay open') onClose(); }}>
      <div className="modal" style={{ maxWidth: '800px', width: '92vw', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: '#3b82f6' }} />
              <span>Technical Drawings & Specifications</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '3px' }}>
              Part Number: <span style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{selectedPart.partNumber}</span>
              {selectedPart.clientName && <span> · Client: <strong style={{ color: 'var(--text)' }}>{selectedPart.clientName}</strong></span>}
              {selectedPart.project && <span> · Project: <strong style={{ color: 'var(--text)' }}>{selectedPart.project}</strong></span>}
              {selectedPart.description && ` — ${selectedPart.description}`}
            </div>
          </div>
          <button className="modal-close" onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '20px', maxHeight: '72vh', overflowY: 'auto' }}>
          
          {/* Classification & Order Banner */}
          <div style={{
            marginBottom: '18px',
            fontSize: '12px',
            color: 'var(--text2)',
            background: 'var(--bg3)',
            padding: '12px 14px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                padding: '3px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.3px',
                background: isStandard ? 'rgba(59, 130, 246, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                color: isStandard ? '#60a5fa' : '#c084fc',
                border: `1px solid ${isStandard ? 'rgba(59, 130, 246, 0.3)' : 'rgba(168, 85, 247, 0.3)'}`
              }}>
                {isStandard ? 'STANDARD' : 'NON-STANDARD'}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text2)' }}>
                {isStandard 
                  ? 'Master catalog drawings & BOM apply to this unit. The latest revisions are shown below.' 
                  : `Custom specification unit (${selectedPart.unitSerial || 'Custom'}). Upload tailored drawings below.`}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text3)' }}>
              {selectedPart.unitSerial && (
                <div>Serial No.: <strong style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{selectedPart.unitSerial}</strong></div>
              )}
              {selectedPart.orderNumber && (
                <div>Order #: <strong style={{ color: 'var(--text)' }}>{selectedPart.orderNumber}</strong></div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              CONDITION 1: STANDARD CLASSIFICATION
              Shows both the Latest Drawing & Latest BOM
             ══════════════════════════════════════════════════════════ */}
          {isStandard && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Standard Master Documents (Drawing & BOM)
                </div>
                {canManageDocs && !showUploadBox && (
                  <button
                    type="button"
                    className="vbtn"
                    onClick={() => {
                      setUploadDocType('Drawing');
                      setShowUploadBox(true);
                    }}
                    style={{ fontSize: '11px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Plus size={13} />
                    <span>Upload New Revision</span>
                  </button>
                )}
              </div>

              {/* Grid with 2 distinct cards: Drawing and BOM */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                {/* ── CARD 1: LATEST DRAWING ── */}
                <div style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'rgba(59, 130, 246, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <FileText size={15} style={{ color: '#3b82f6' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                        Technical Drawing
                      </span>
                    </div>

                    {latestDrawing ? (
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {latestDrawing.revision_label || `R${latestDrawing.revision_number ?? 0}`} · Latest
                      </span>
                    ) : (
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        Not Uploaded
                      </span>
                    )}
                  </div>

                  {latestDrawing ? (
                    <>
                      <div style={{ minWidth: 0 }}>
                        <div
                          title={latestDrawing.file_name}
                          style={{
                            fontWeight: 600,
                            color: 'var(--text)',
                            fontSize: '12px',
                            fontFamily: 'var(--font-mono)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {latestDrawing.file_name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
                          Uploaded {formatDateDMY(latestDrawing.uploaded_at)}
                          {latestDrawing.file_size ? ` · ${formatFileSize(latestDrawing.file_size)}` : ''}
                          {latestDrawing.uploaded_by_name ? ` · by ${latestDrawing.uploaded_by_name}` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: 'auto', paddingTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="vbtn"
                            onClick={() => setPdfViewerDoc({
                              ...latestDrawing,
                              title: `Drawing (${latestDrawing.revision_label || 'R0'}) - ${selectedPart.partNumber}`
                            })}
                            style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>
                          <a
                            href={getDocUrl(latestDrawing)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vbtn"
                            style={{
                              background: '#3b82f6',
                              color: '#fff',
                              textDecoration: 'none',
                              padding: '5px 12px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>Download</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {canManageDocs && (
                            <>
                              <button
                                type="button"
                                className="vbtn"
                                onClick={() => {
                                  setUploadDocType('Drawing');
                                  setShowUploadBox(true);
                                }}
                                title="Upload new revision of Drawing"
                                style={{ fontSize: '11px', padding: '5px 8px' }}
                              >
                                + New Rev
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMasterDoc(latestDrawing.id)}
                                title="Delete this drawing revision"
                                style={{
                                  background: 'transparent',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#ef4444',
                                  borderRadius: '6px',
                                  padding: '5px 8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Revision history toggle */}
                      {canViewRevisionHistory && drawingHistory.length > 1 && (
                        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={() => setShowDrawingHistory(!showDrawingHistory)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#60a5fa',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: 0
                            }}
                          >
                            <History size={12} />
                            <span>{showDrawingHistory ? 'Hide Previous Revisions' : `View Earlier Revisions (${drawingHistory.length - 1})`}</span>
                          </button>

                          {showDrawingHistory && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                              {drawingHistory.slice(1).map((revDoc) => (
                                <div
                                  key={`draw-hist-${revDoc.id}`}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'var(--bg2)',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    gap: '8px'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                    <span style={{ fontWeight: 700, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                                      {revDoc.revision_label || `R${revDoc.revision_number}`}
                                    </span>
                                    <span style={{ color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={revDoc.file_name}>
                                      {revDoc.file_name}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                    <span style={{ color: 'var(--text3)', fontSize: '10px' }}>{formatDateDMY(revDoc.uploaded_at)}</span>
                                    <a
                                      href={getDocUrl(revDoc)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: '#60a5fa', display: 'flex', alignItems: 'center' }}
                                      title="Download this revision"
                                    >
                                      <Download size={12} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: '12px', textAlign: 'center', background: 'var(--bg2)', borderRadius: '6px', border: '1px dashed var(--border)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>
                        No drawing uploaded for this part.
                      </div>
                      {canManageDocs && (
                        <button
                          type="button"
                          className="vbtn primary"
                          onClick={() => {
                            setUploadDocType('Drawing');
                            setShowUploadBox(true);
                          }}
                          style={{ fontSize: '11px', padding: '5px 12px' }}
                        >
                          + Upload Drawing (R0)
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* ── CARD 2: LATEST BOM ── */}
                <div style={{
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Layers size={15} style={{ color: '#10b981' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                        Bill of Materials (BOM)
                      </span>
                    </div>

                    {latestBom ? (
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {latestBom.revision_label || `R${latestBom.revision_number ?? 0}`} · Latest
                      </span>
                    ) : (
                      <span style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        Not Uploaded
                      </span>
                    )}
                  </div>

                  {latestBom ? (
                    <>
                      <div style={{ minWidth: 0 }}>
                        <div
                          title={latestBom.file_name}
                          style={{
                            fontWeight: 600,
                            color: 'var(--text)',
                            fontSize: '12px',
                            fontFamily: 'var(--font-mono)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {latestBom.file_name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
                          Uploaded {formatDateDMY(latestBom.uploaded_at)}
                          {latestBom.file_size ? ` · ${formatFileSize(latestBom.file_size)}` : ''}
                          {latestBom.uploaded_by_name ? ` · by ${latestBom.uploaded_by_name}` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: 'auto', paddingTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="vbtn"
                            onClick={() => setPdfViewerDoc({
                              ...latestBom,
                              title: `BOM (${latestBom.revision_label || 'R0'}) - ${selectedPart.partNumber}`
                            })}
                            style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>
                          <a
                            href={getDocUrl(latestBom)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="vbtn"
                            style={{
                              background: '#10b981',
                              color: '#fff',
                              textDecoration: 'none',
                              padding: '5px 12px',
                              borderRadius: '6px',
                              fontSize: '11px',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <span>Download</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {canManageDocs && (
                            <>
                              <button
                                type="button"
                                className="vbtn"
                                onClick={() => {
                                  setUploadDocType('BOM');
                                  setShowUploadBox(true);
                                }}
                                title="Upload new revision of BOM"
                                style={{ fontSize: '11px', padding: '5px 8px' }}
                              >
                                + New Rev
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMasterDoc(latestBom.id)}
                                title="Delete this BOM revision"
                                style={{
                                  background: 'transparent',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#ef4444',
                                  borderRadius: '6px',
                                  padding: '5px 8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Revision history toggle */}
                      {canViewRevisionHistory && bomHistory.length > 1 && (
                        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={() => setShowBomHistory(!showBomHistory)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#10b981',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: 0
                            }}
                          >
                            <History size={12} />
                            <span>{showBomHistory ? 'Hide Previous Revisions' : `View Earlier Revisions (${bomHistory.length - 1})`}</span>
                          </button>

                          {showBomHistory && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                              {bomHistory.slice(1).map((revDoc) => (
                                <div
                                  key={`bom-hist-${revDoc.id}`}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: 'var(--bg2)',
                                    padding: '6px 8px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    gap: '8px'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                                    <span style={{ fontWeight: 700, color: 'var(--text2)', fontFamily: 'var(--font-mono)' }}>
                                      {revDoc.revision_label || `R${revDoc.revision_number}`}
                                    </span>
                                    <span style={{ color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={revDoc.file_name}>
                                      {revDoc.file_name}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                    <span style={{ color: 'var(--text3)', fontSize: '10px' }}>{formatDateDMY(revDoc.uploaded_at)}</span>
                                    <a
                                      href={getDocUrl(revDoc)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}
                                      title="Download this revision"
                                    >
                                      <Download size={12} />
                                    </a>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ padding: '12px', textAlign: 'center', background: 'var(--bg2)', borderRadius: '6px', border: '1px dashed var(--border)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '8px' }}>
                        No BOM uploaded for this part.
                      </div>
                      {canManageDocs && (
                        <button
                          type="button"
                          className="vbtn primary"
                          onClick={() => {
                            setUploadDocType('BOM');
                            setShowUploadBox(true);
                          }}
                          style={{ fontSize: '11px', padding: '5px 12px', background: '#10b981' }}
                        >
                          + Upload BOM (R0)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Box for Standard Part Documents */}
              {canManageDocs && showUploadBox && (
                <div style={{ marginTop: '14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                      Upload New Master Document
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadBox(false);
                        setFilesToUpload([]);
                        setUploadError('');
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Document Type Selector */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text2)' }}>Target Type:</span>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: uploadDocType === 'Drawing' ? '#60a5fa' : 'var(--text2)', fontWeight: uploadDocType === 'Drawing' ? 700 : 400 }}>
                      <input
                        type="radio"
                        name="standardUploadType"
                        value="Drawing"
                        checked={uploadDocType === 'Drawing'}
                        onChange={() => setUploadDocType('Drawing')}
                      />
                      <span>Technical Drawing ({latestDrawing ? `will create R${(latestDrawing.revision_number ?? 0) + 1}` : 'creates R0'})</span>
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', color: uploadDocType === 'BOM' ? '#34d399' : 'var(--text2)', fontWeight: uploadDocType === 'BOM' ? 700 : 400 }}>
                      <input
                        type="radio"
                        name="standardUploadType"
                        value="BOM"
                        checked={uploadDocType === 'BOM'}
                        onChange={() => setUploadDocType('BOM')}
                      />
                      <span>BOM ({latestBom ? `will create R${(latestBom.revision_number ?? 0) + 1}` : 'creates R0'})</span>
                    </label>
                  </div>

                  {renderUploadBox(() => handleUploadStandard(uploadDocType), `Upload ${uploadDocType}`)}
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════
              CONDITION 2: NON-STANDARD CLASSIFICATION
              "but if it's non standard directly give option to upload"
             ══════════════════════════════════════════════════════════ */}
          {!isStandard && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Upload Custom Technical Drawings / Specifications
              </div>

              {canManageDocs ? (
                /* Directly give option to upload for Non-Standard */
                renderUploadBox(handleUploadNonStandard, 'Upload Custom Technical Drawing')
              ) : (
                <div style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text3)',
                  fontSize: '12px',
                  marginBottom: '16px'
                }}>
                  Non-standard order drawings must be uploaded by Design or Admin.
                </div>
              )}

              {/* List of custom technical drawings attached to this unit / order */}
              <div style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                  Uploaded Custom Drawings for Unit {selectedPart.unitSerial || ''} ({customDrawings.length})
                </div>

                {customDrawings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {customDrawings.map((doc) => {
                      const docUrl = getDocUrl(doc);
                      return (
                        <div
                          key={`custom-${doc.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'var(--bg3)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            padding: '12px 16px',
                            gap: '12px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '6px',
                              background: 'rgba(168, 85, 247, 0.12)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <FileText size={18} style={{ color: '#a855f7' }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {doc.file_name}
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                                Custom Drawing · Uploaded {formatDateDMY(doc.created_at || doc.uploaded_at)}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <button
                              type="button"
                              className="vbtn"
                              onClick={() => setPdfViewerDoc({
                                ...doc,
                                title: `Custom Drawing - ${selectedPart.unitSerial || selectedPart.partNumber}`
                              })}
                              style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Eye size={12} />
                              <span>Preview</span>
                            </button>
                            <a
                              href={docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="vbtn"
                              style={{
                                background: '#3b82f6',
                                color: '#fff',
                                textDecoration: 'none',
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 600,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              <span>View / Download</span>
                              <ExternalLink size={13} />
                            </a>
                            {canManageDocs && (
                              <button
                                type="button"
                                onClick={() => handleDeleteOrderDoc(doc.id)}
                                title="Delete custom drawing"
                                style={{
                                  background: 'transparent',
                                  border: '1px solid rgba(239, 68, 68, 0.3)',
                                  color: '#ef4444',
                                  borderRadius: '6px',
                                  padding: '6px 9px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text3)', background: 'var(--bg3)', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '12px' }}>
                    No custom technical drawings uploaded for this order yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section: Other Order Documents (PO, Quotation, General) */}
          {otherOrderDocs.length > 0 && (
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text2)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Other Order Documents ({otherOrderDocs.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {otherOrderDocs.map((doc) => {
                  const docUrl = getDocUrl(doc);
                  return (
                    <div
                      key={`other-${doc.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--bg3)',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        padding: '10px 14px',
                        fontSize: '12px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <FileText size={15} style={{ color: 'var(--text3)', flexShrink: 0 }} />
                        <div style={{ minWidth: 0 }}>
                          <span style={{ fontWeight: 500, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {doc.file_name}
                          </span>
                          <span style={{ color: 'var(--text3)', marginLeft: '8px', fontSize: '11px' }}>
                            ({doc.doc_type || 'General'} · {formatDateDMY(doc.created_at || doc.uploaded_at)})
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vbtn"
                          style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            textDecoration: 'none',
                            color: 'var(--text)'
                          }}
                        >
                          View / Download
                        </a>
                        {canManageDocs && (
                          <button
                            type="button"
                            onClick={() => handleDeleteOrderDoc(doc.id)}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px 6px' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-actions" style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="vbtn" onClick={onClose} style={{ padding: '7px 20px', fontSize: '13px' }}>
            Close
          </button>
        </div>
      </div>

      {/* In-App Document Viewer (Excel or PDF) */}
      {pdfViewerDoc && !pdfViewerDoc.file_name?.toLowerCase().endsWith('.pdf') ? (
        <ExcelSheetViewer
          url={getDocUrl(pdfViewerDoc)}
          fileName={pdfViewerDoc.file_name}
          title={pdfViewerDoc.title || `Document Viewer - ${pdfViewerDoc.file_name}`}
          onClose={() => setPdfViewerDoc(null)}
        />
      ) : pdfViewerDoc ? (
        <div className="modal-overlay open" style={{ zIndex: 1200 }} onClick={(e) => { if (e.target.className.includes('modal-overlay')) setPdfViewerDoc(null); }}>
          <div className="modal" style={{ maxWidth: '920px', width: '92vw', height: '85vh', display: 'flex', flexDirection: 'column', background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <div className="modal-header" style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)' }}>
                  {pdfViewerDoc.title || 'PDF Document Viewer'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {pdfViewerDoc.file_name} · {pdfViewerDoc.revision_label || 'R0'} · {formatDateDMY(pdfViewerDoc.uploaded_at || pdfViewerDoc.created_at)}
                  {pdfViewerDoc.uploaded_by_name ? ` · by ${pdfViewerDoc.uploaded_by_name}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={getDocUrl(pdfViewerDoc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vbtn"
                  style={{ fontSize: '12px', padding: '5px 12px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}
                >
                  <ExternalLink size={13} />
                  <span>Open New Tab</span>
                </a>
                <a
                  href={getDocUrl(pdfViewerDoc)}
                  download={pdfViewerDoc.file_name || 'document.pdf'}
                  className="vbtn primary"
                  style={{ fontSize: '12px', padding: '5px 12px', textDecoration: 'none' }}
                >
                  Download ↓
                </a>
                <button className="modal-close" onClick={() => setPdfViewerDoc(null)} style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>✕</button>
              </div>
            </div>
            <div style={{ flex: 1, position: 'relative', background: '#525659' }}>
              <iframe
                src={getDocUrl(pdfViewerDoc)}
                title={pdfViewerDoc.file_name}
                style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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

function renderCellContent({
  unit,
  colKey,
  status,
  canEdit,
  canEditPanelSize,
  canUploadPo,
  panelSizeMasters,
  customColumnDefs,
  editingCell,
  setEditingCell,
  onRowClick,
  onSaveInlineCell,
  onSingleUnitPoClick,
  onPartNumberClick,
  setPoPdfViewer
}) {
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['In Progress'];
  const priority = unit.priority || 'Medium';
  const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
  const isOverdue = unit.delivery_date && new Date(unit.delivery_date) < new Date() && status !== 'Completed' && status !== 'Cancelled';
  const effectiveUnitId = unit.unit_id || unit.id;

  switch (colKey) {
    case 'order_number':
      return (
        <span 
          onClick={(e) => { e.stopPropagation(); onRowClick(unit.order_id, effectiveUnitId); }}
          style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--blue)', fontSize: 12, cursor: 'pointer' }}
          title="Click to view Process Flow"
        >
          {unit.order_number}
        </span>
      );

    case 'short_serial':
    case 'unit_serial':
      return (
        <div 
          onClick={(e) => { e.stopPropagation(); onRowClick(unit.order_id, effectiveUnitId); }} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
          title="Click to view Process Flow for this Serial No."
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#3b82f6', fontSize: 12, textDecoration: 'underline' }}>
            {unit.unit_serial}
          </span>
        </div>
      );

    case 'company_name':
      return (
        <div 
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={unit.company_name ? `${unit.company_name}${unit.company_city ? ` · ${unit.company_city}` : ''}` : undefined}
        >
          <span style={{ fontWeight: 600, color: 'var(--text)' }}>{unit.company_name || '—'}</span>
          {unit.company_city && <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 11, marginLeft: 4 }}>· {unit.company_city}</span>}
        </div>
      );

    case 'classification':
      const clsVal = unit.classification || 'Standard';
      if (canEdit) {
        return (
          <select
            value={clsVal}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSaveInlineCell(unit, 'classification', e.target.value)}
            style={{
              fontSize: 11, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
              background: clsVal === 'Standard' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
              color: clsVal === 'Standard' ? '#60a5fa' : '#fbbf24',
              border: `1px solid ${clsVal === 'Standard' ? 'rgba(59,130,246,0.4)' : 'rgba(245,158,11,0.4)'}`,
              cursor: 'pointer', outline: 'none'
            }}
          >
            <option value="Standard" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>Standard</option>
            <option value="Non-Standard" style={{ background: 'var(--bg3)', color: 'var(--text)' }}>Non-Standard</option>
          </select>
        );
      }
      return (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6,
          background: clsVal === 'Standard' ? 'rgba(59,130,246,0.12)' : 'rgba(245,158,11,0.12)',
          color: clsVal === 'Standard' ? '#60a5fa' : '#fbbf24',
          border: `1px solid ${clsVal === 'Standard' ? 'rgba(59,130,246,0.3)' : 'rgba(245,158,11,0.3)'}`
        }}>
          {clsVal}
        </span>
      );

    case 'priority':
      if (canEdit) {
        return (
          <select
            value={priority}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onSaveInlineCell(unit, 'priority', e.target.value)}
            style={{
              fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
              background: priorityStyle.bg, color: priorityStyle.color,
              border: `1px solid ${priorityStyle.border}`, cursor: 'pointer', outline: 'none',
              textTransform: 'uppercase'
            }}
          >
            <option value="Urgent" style={{ background: 'var(--bg3)', color: '#ef4444' }}>Urgent</option>
            <option value="High" style={{ background: 'var(--bg3)', color: '#f87171' }}>High</option>
            <option value="Medium" style={{ background: 'var(--bg3)', color: '#fbbf24' }}>Medium</option>
            <option value="Low" style={{ background: 'var(--bg3)', color: '#60a5fa' }}>Low</option>
          </select>
        );
      }
      return (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20,
          background: priorityStyle.bg, color: priorityStyle.color,
          border: `1px solid ${priorityStyle.border}`, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          {priority}
        </span>
      );

    case 'unit_status':
      if (status === 'Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold')) {
        const holdStep = unit.hold_step_name || (unit.unit_status?.replace(/^Hold @\s*/i, '')) || 'Current Step';
        const holdTooltip = `Held by: ${unit.held_by_name || 'User'} on ${unit.held_at ? new Date(unit.held_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}\nReason: ${unit.hold_reason || 'No reason specified'}`;
        return (
          <span 
            title={holdTooltip}
            style={{
              fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
              background: 'rgba(245, 158, 11, 0.35)', color: '#fbbf24',
              border: '1px solid #f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'help',
              boxShadow: '0 0 10px rgba(245, 158, 11, 0.3)'
            }}
          >
            <span>⏸</span> Hold @ {holdStep}
          </span>
        );
      }
      if (status === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel')) {
        const cancelStep = unit.cancelled_step_name || (unit.unit_status?.replace(/^Cancelled @\s*/i, '')) || 'Current Step';
        const cancelTooltip = `Cancelled by: ${unit.cancelled_by_name || 'User'} on ${unit.cancelled_at ? new Date(unit.cancelled_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}\nReason: ${unit.cancelled_reason || 'No reason specified'}`;
        return (
          <span 
            title={cancelTooltip}
            style={{
              fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
              background: 'rgba(239, 68, 68, 0.35)', color: '#f87171',
              border: '1px solid #ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap',
              display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'help',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
            }}
          >
            <span>✕</span> Cancelled @ {cancelStep}
          </span>
        );
      }
      return (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
          background: statusStyle.bg, color: statusStyle.color,
          border: `1px solid ${statusStyle.border}`, textTransform: 'uppercase', letterSpacing: '0.4px', whiteSpace: 'nowrap'
        }}>
          {status}
        </span>
      );

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
              setEditingCell({ unitId: effectiveUnitId, colKey: 'delivery_date', value: unit.delivery_date || '' });
            }
          }}
          title={canEdit ? "Click to change date" : undefined}
          style={{
            color: isOverdue ? '#ef4444' : 'var(--text2)',
            fontWeight: isOverdue ? 600 : 400,
            fontSize: 12,
            cursor: canEdit ? 'pointer' : 'default'
          }}
        >
          {unit.delivery_date
            ? new Date(unit.delivery_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : '—'}
          {isOverdue && <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700, marginLeft: 5, background: 'rgba(239,68,68,0.12)', borderRadius: 4, padding: '1px 5px' }}>OVERDUE</span>}
        </span>
      );

    case 'part_number':
      const hasPart = Boolean(unit.part_number);
      return (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onPartNumberClick(unit);
          }}
          title="Click to view Design Drawings & Technical Documents"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            fontWeight: 600,
            color: hasPart ? '#60a5fa' : 'var(--text3)',
            cursor: 'pointer',
            textDecoration: hasPart ? 'underline' : 'none'
          }}
        >
          {unit.part_number || '—'}
        </span>
      );

    case 'panel_code': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMasters.find(m => 
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const code = unit.panel_code || master?.panel_code;
      return code ? (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11.5,
          fontWeight: 700,
          color: '#c084fc',
          background: 'rgba(168, 85, 247, 0.12)',
          border: '1px solid rgba(168, 85, 247, 0.28)',
          padding: '2px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {code}
        </span>
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
        />
      );

    case 'panel_ip_rating': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMasters.find(m => 
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const ip = unit.panel_ip_rating || master?.ip_rating;
      return ip ? (
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          fontWeight: 600,
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.28)',
          padding: '2px 8px',
          borderRadius: '4px',
          display: 'inline-block'
        }}>
          {ip}
        </span>
      ) : (
        <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
      );
    }

    case 'panel_comments': {
      const currentSize = unit.panel_type_size || '';
      const master = panelSizeMasters.find(m => 
        (m.panel_size && m.panel_size === currentSize) ||
        (m.size_name && m.size_name === currentSize) ||
        (m.panel_code && m.panel_code === currentSize)
      );
      const comment = unit.panel_comments || master?.comments || master?.description;
      return comment ? (
        <span style={{ color: 'var(--text2)', fontSize: 12 }} title={comment}>
          {comment}
        </span>
      ) : (
        <span style={{ color: 'var(--text3)', opacity: 0.4 }}>—</span>
      );
    }

    case 'po_number': {
      const hasPoNum = Boolean(unit.po_number);
      const hasPdf = Boolean(unit.po_file_path);

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
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, maxWidth: '100%' }}>
          {hasPoNum ? (
            hasPdf ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPoPdfViewer({
                    file_path: unit.po_file_path,
                    file_name: unit.po_file_name || `${unit.po_number}.pdf`,
                    title: `PO Document - ${unit.po_number}`,
                    subtitle: `Serial: ${unit.short_serial || unit.unit_serial} | Order: ${unit.order_number}`
                  });
                }}
                title="Click to view PO in PDF"
                style={{
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 5,
                  padding: '2px 7px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  cursor: 'pointer',
                  color: 'var(--blue)',
                  fontSize: 12,
                  fontWeight: 600,
                  maxWidth: 130,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                <FileText size={12} style={{ flexShrink: 0 }} />
                <span style={{ textDecoration: 'underline', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {unit.po_number}
                </span>
              </button>
            ) : (
              <span
                title={canUploadPo ? "Click to edit PO No." : (unit.po_number || '')}
                onClick={(e) => {
                  if (canUploadPo) {
                    e.stopPropagation();
                    setEditingCell({ unitId: effectiveUnitId, colKey: 'po_number', value: unit.po_number });
                  }
                }}
                style={{
                  fontSize: 12,
                  color: 'var(--text2)',
                  cursor: canUploadPo ? 'pointer' : 'default',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
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
              style={{ fontSize: 12, color: 'var(--text3)', cursor: canUploadPo ? 'pointer' : 'default' }}
              title={canUploadPo ? "Click to enter PO No." : undefined}
            >
              —
            </span>
          )}

          {canUploadPo && (
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
                opacity: 0.6,
                flexShrink: 0
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--blue)'; e.currentTarget.style.opacity = '1'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.opacity = '0.6'; }}
            >
              <UploadCloud size={12} />
            </button>
          )}
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
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                background: isYes ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: isYes ? '#34d399' : '#f87171'
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

      const isEditableTextCol = ['project_name', 'end_client_name', 'reference_number', 'material_description'].includes(colKey);

      return (
        <span
          onClick={(e) => {
            if (canEdit && isEditableTextCol) {
              e.stopPropagation();
              setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
            }
          }}
          title={canEdit && isEditableTextCol ? "Click to edit" : (currentVal ? String(currentVal) : undefined)}
          style={{
            color: colKey === 'reference_number' ? '#f59e0b' : (colKey === 'project_name' ? '#38bdf8' : 'var(--text2)'),
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
  isSelected,
  status,
  visibleCols,
  columnWidths,
  pinnedKeys,
  stickyLeftMap,
  canEdit,
  canEditPanelSize,
  canUploadPo,
  panelSizeMasters,
  customColumnDefs,
  editingCell,
  setEditingCell,
  onRowMouseDown,
  onRowMouseEnter,
  onRowClick,
  onSaveInlineCell,
  onSingleUnitPoClick,
  onPartNumberClick,
  setPoPdfViewer
}) {
  const isAltRow = idx % 2 !== 0;
  const isCancelled = status === 'Cancelled' || unit.hold_status === 'Cancelled' || String(unit.unit_status || '').toLowerCase().startsWith('cancel');
  const isHold = status === 'Hold' || status === 'On Hold' || unit.hold_status === 'Hold' || String(unit.unit_status || '').toLowerCase().startsWith('hold');
  const rowHighlight = isCancelled ? 'cancelled' : (isHold ? 'hold' : null);

  const defaultBg = isSelected
    ? 'rgba(59, 130, 246, 0.16)'
    : isCancelled
    ? (isAltRow ? 'rgba(239, 68, 68, 0.22)' : 'rgba(239, 68, 68, 0.17)')
    : isHold
    ? (isAltRow ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.17)')
    : (isAltRow ? 'var(--bg2)' : 'var(--bg)');

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
      {/* Selection Checkbox Cell */}
      <td
        style={{
          position: 'sticky',
          left: 0,
          zIndex: 3,
          background: isSelected ? 'rgba(59, 130, 246, 0.22)' : defaultBg,
          width: 38,
          minWidth: 38,
          maxWidth: 38,
          padding: '6px 4px',
          textAlign: 'center',
          verticalAlign: 'middle',
          borderRight: '1px solid var(--border)',
          borderLeft: isSelected ? '5px solid #3b82f6' : (isCancelled ? '5px solid #ef4444' : isHold ? '5px solid #f59e0b' : '5px solid transparent'),
          userSelect: 'none',
          cursor: 'pointer'
        }}
        title={isSelected ? "Click to deselect row (or drag to deselect range)" : "Click to select row (or drag to select range)"}
        onMouseDown={(e) => onRowMouseDown(unit.unit_id, idx, e)}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => {}}
          style={{ cursor: 'pointer', accentColor: 'var(--blue)', width: 14, height: 14, pointerEvents: 'none' }}
        />
      </td>

      {visibleCols.map((c) => {
        const colKey = c.key;
        const defaultWidth = isDateTimeType(c.fieldType) ? 170 : (DEFAULT_COL_WIDTHS[colKey] || 125);
        const width = columnWidths[colKey] || defaultWidth;
        const pinned = pinnedKeys.includes(colKey);
        const lastPin = pinned && pinnedKeys[pinnedKeys.length - 1] === colKey;

        let pinnedBg = isAltRow ? 'var(--bg2)' : 'var(--bg)';
        if (rowHighlight === 'cancelled') {
          pinnedBg = isAltRow ? 'rgba(239, 68, 68, 0.24)' : 'rgba(239, 68, 68, 0.20)';
        } else if (rowHighlight === 'hold') {
          pinnedBg = isAltRow ? 'rgba(245, 158, 11, 0.24)' : 'rgba(245, 158, 11, 0.20)';
        }

        return (
          <td
            key={colKey}
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
              boxShadow: lastPin ? '4px 0 8px -3px rgba(0,0,0,0.35)' : undefined,
              padding: '6px 10px',
              textAlign: c.align || 'left'
            }}
          >
            {renderCellContent({
              unit,
              colKey,
              status,
              canEdit,
              canEditPanelSize,
              canUploadPo,
              panelSizeMasters,
              customColumnDefs,
              editingCell,
              setEditingCell,
              onRowClick,
              onSaveInlineCell,
              onSingleUnitPoClick,
              onPartNumberClick,
              setPoPdfViewer
            })}
          </td>
        );
      })}
    </tr>
  );
}, (prevProps, nextProps) => {
  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.unit !== nextProps.unit) return false;
  if (prevProps.idx !== nextProps.idx) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.columnWidths !== nextProps.columnWidths) return false;
  if (prevProps.visibleCols !== nextProps.visibleCols) return false;
  if (prevProps.pinnedKeys !== nextProps.pinnedKeys) return false;
  if (prevProps.panelSizeMasters !== nextProps.panelSizeMasters) return false;
  if (prevProps.customColumnDefs !== nextProps.customColumnDefs) return false;

  const unitId = prevProps.unit.unit_id || prevProps.unit.id;
  const prevEditing = prevProps.editingCell && prevProps.editingCell.unitId === unitId;
  const nextEditing = nextProps.editingCell && nextProps.editingCell.unitId === unitId;
  if (prevEditing !== nextEditing || (prevEditing && prevProps.editingCell !== nextProps.editingCell)) return false;

  return true;
});

const PoUploadBar = memo(function PoUploadBar({
  selectedCount,
  canUploadPo,
  isUploadingPo,
  poSuccessMsg,
  onClearSelection,
  onUploadPo,
  externalPoNumber,
  setExternalPoNumber
}) {
  const [poNumber, setPoNumber] = useState('');
  const poFileInputRef = useRef(null);
  const poInputRef = useRef(null);

  useEffect(() => {
    if (externalPoNumber !== undefined && externalPoNumber !== null && externalPoNumber !== '') {
      setPoNumber(externalPoNumber);
      if (poInputRef.current) {
        poInputRef.current.focus();
        poInputRef.current.select();
      }
    }
  }, [externalPoNumber]);

  const handleUploadClick = () => {
    if (!canUploadPo) {
      alert("Only Sales, Accounts, Admin, and Manager roles can upload PO documents.");
      return;
    }
    if (selectedCount === 0) {
      alert("Please select the serial numbers (on which you require to add the PO data) first.");
      return;
    }
    if (!poNumber.trim()) {
      alert("Please enter the PO No. in the text box.");
      if (poInputRef.current) poInputRef.current.focus();
      return;
    }
    if (poFileInputRef.current) {
      poFileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    onUploadPo(poNumber.trim(), file);
  };

  return (
    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
      {poSuccessMsg && (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 6, padding: '3px 8px' }}>
          {poSuccessMsg}
        </span>
      )}

      {selectedCount > 0 && (
        <span style={{
          fontSize: 12, fontWeight: 600, color: 'var(--blue)', background: 'rgba(59, 130, 246, 0.12)',
          border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 6, padding: '3px 8px',
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
          borderRadius: 6,
          outline: 'none',
          width: 140
        }}
      />

      <button
        type="button"
        onClick={handleUploadClick}
        disabled={isUploadingPo}
        title="Upload PO (PDF) for selected serial numbers"
        style={{
          height: 30,
          padding: '0 12px',
          fontSize: 12,
          fontWeight: 600,
          background: 'var(--blue)',
          color: '#ffffff',
          border: 'none',
          borderRadius: 6,
          cursor: isUploadingPo ? 'wait' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          opacity: isUploadingPo ? 0.7 : 1,
          whiteSpace: 'nowrap'
        }}
      >
        {isUploadingPo ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
        <span>Upload PO</span>
      </button>

      <input
        ref={poFileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
});

export default function AllOrdersTableView({ currentFilter, userRole: propUserRole, onSetView, statCardFilter, onClearStatFilter }) {
  const [units, setUnits] = useState([]);
  const tableContainerRef = useRef(null);
  const searchInputRef = useRef(null);

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

  // Excel-style multi-row selection state
  const [selectedUnitIds, setSelectedUnitIds] = useState(new Set());
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
    } catch (e) {}
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
    } catch (e) {}
    return ['order_number', 'short_serial'];
  });

  useEffect(() => {
    localStorage.setItem('erp_all_pinned_keys', JSON.stringify(pinnedKeys));
  }, [pinnedKeys]);

  // Column Widths (Resizing)
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const savedV2 = localStorage.getItem('erp_all_colWidths_v2');
      if (savedV2) return { ...DEFAULT_COL_WIDTHS, ...JSON.parse(savedV2) };
      return DEFAULT_COL_WIDTHS;
    } catch (e) {
      return DEFAULT_COL_WIDTHS;
    }
  });

  useEffect(() => {
    localStorage.setItem('erp_all_colWidths_v2', JSON.stringify(columnWidths));
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
    localStorage.removeItem('erp_all_pinned_keys');
  };

  const handleResizeStart = (e, colKey) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const startWidth = columnWidths[colKey] || DEFAULT_COL_WIDTHS[colKey] || 120;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      const newWidth = Math.max(60, startWidth + (moveEvent.pageX - startX));
      setColumnWidths(prev => ({
        ...prev,
        [colKey]: newWidth
      }));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const token = localStorage.getItem('token');
  const userRole = (() => {
    if (propUserRole) return propUserRole;
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u && u.role) return u.role;
    } catch (e) {}
    return localStorage.getItem('userRole') || 'Sales';
  })();
  const roleUpper = (userRole || '').trim().toUpperCase();
  const canEdit = ['ADMIN', 'MANAGER', 'DESIGN', 'SALES', 'PRODUCTION'].includes(roleUpper);
  const canEditPanelSize = ['ADMIN', 'MANAGER', 'DESIGN'].includes(roleUpper);
  const canManageDocs = ['ADMIN', 'MANAGER', 'DESIGN'].includes(roleUpper);
  const canUploadPo = ['ADMIN', 'MANAGER', 'SALES', 'ACCOUNTS'].includes(roleUpper);

  const [colVisibility, setColVisibility] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [partMasters, setPartMasters] = useState([]);
  const [panelSizeMasters, setPanelSizeMasters] = useState([]);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedPartForDocs, setSelectedPartForDocs] = useState(null);

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
          await fetch(`${window.API_BASE}/api/units/${uId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ classification: newValue })
          });
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
    
    const handleUpdate = () => {
      fetchUnits(true);
      fetchColumnVisibility();
      fetchPartMasters();
      fetchPanelSizeMasters();
    };
    window.addEventListener('orderUpdated', handleUpdate);
    window.addEventListener('columnMastersUpdated', handleUpdate);
    return () => {
      window.removeEventListener('orderUpdated', handleUpdate);
      window.removeEventListener('columnMastersUpdated', handleUpdate);
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
    if (currentFilter === 'all') return true;
    const deptMap = colVisibility[currentFilter];
    if (!deptMap) return true;
    const key = colKey === 'unit_serial' ? 'short_serial' : colKey;
    return deptMap[key] !== false;
  };

  const fetchUnits = async (silent = false) => {
    if (!silent) setIsLoading(true);
    try {
      const deptParam = currentFilter === 'all' ? 'Sales' : currentFilter;
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
        if (status !== 'In Progress' && status !== 'In Process') return false;
      } else if (statCardFilter === 'blocked') {
        if (status !== 'Blocked') return false;
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
        if ((statusFilter === 'inprogress' || statusFilter === 'in_process') && status !== 'In Progress' && status !== 'In Process') return false;
        if (statusFilter === 'blocked' && status !== 'Blocked') return false;
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
    return [...filtered].sort((a, b) => {
      let av, bv;
      const customDef = customColumnDefs.find(c => c.col_key === sortKey);
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
        if (['panel_code', 'panel_ip_rating', 'panel_comments'].includes(sortKey)) {
          if (!aVal) {
            const masterA = panelSizeMasters.find(m => (m.panel_size || m.size_name) === a.panel_type_size || m.panel_code === a.panel_type_size);
            aVal = sortKey === 'panel_code' ? masterA?.panel_code : sortKey === 'panel_ip_rating' ? masterA?.ip_rating : (masterA?.comments || masterA?.description);
          }
          if (!bVal) {
            const masterB = panelSizeMasters.find(m => (m.panel_size || m.size_name) === b.panel_type_size || m.panel_code === b.panel_type_size);
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
  }, [filtered, sortKey, sortDir, customColumnDefs, panelSizeMasters, getUnitStatus]);

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

    const willSelect = !selectedUnitIds.has(unitId);
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
    const allSelected = displayedIds.length > 0 && displayedIds.every(id => selectedUnitIds.has(id));

    setSelectedUnitIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        displayedIds.forEach(id => next.delete(id));
      } else {
        displayedIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, [displayedUnits, selectedUnitIds]);

  const handleBatchPoUpload = useCallback(async (poNumber, file) => {
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      alert('Only PDF files are allowed for PO document upload.');
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
      setTimeout(() => setPoSuccessMsg(''), 4500);

      setExternalPoNumber('');
      setSelectedUnitIds(new Set());
      await fetchUnits(true);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to upload PO.');
    } finally {
      setIsUploadingPo(false);
    }
  }, [selectedUnitIds, token]);

  const handleSingleUnitPoClick = useCallback((unit) => {
    if (!canUploadPo) {
      alert("Only Sales, Accounts, Admin, and Manager roles can upload PO documents.");
      return;
    }
    setSelectedUnitIds(new Set([unit.unit_id]));
    setExternalPoNumber(unit.po_number || '');
  }, [canUploadPo]);

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={11} style={{ opacity: 0.3, marginLeft: 4 }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} style={{ color: 'var(--blue)', marginLeft: 4 }} />
      : <ChevronDown size={11} style={{ color: 'var(--blue)', marginLeft: 4 }} />;
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

  // Calculate cumulative left offsets for pinned columns (offset by selection column width)
  const SELECTION_COL_WIDTH = 38;
  const stickyLeftMap = useMemo(() => {
    const map = {};
    let currentLeft = SELECTION_COL_WIDTH;
    pinnedCols.forEach((c) => {
      const defaultWidth = isDateTimeType(c.fieldType) ? 170 : (DEFAULT_COL_WIDTHS[c.key] || 140);
      const width = columnWidths[c.key] || defaultWidth;
      map[c.key] = currentLeft;
      currentLeft += width;
    });
    return map;
  }, [pinnedCols, columnWidths]);

  const isPinned = (colKey) => pinnedKeys.includes(colKey);
  const isLastPinned = (colKey) => pinnedCols.length > 0 && pinnedCols[pinnedCols.length - 1].key === colKey;

  const getColStyle = (colKey, isHeader = false) => {
    const colDef = allColumns.find(c => c.key === colKey);
    const defaultWidth = isDateTimeType(colDef?.fieldType) ? 170 : (DEFAULT_COL_WIDTHS[colKey] || 125);
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
      zIndex: pinned ? 15 : 10,
      background: 'var(--bg3)',
      boxShadow: lastPin ? '4px 0 8px -3px rgba(0,0,0,0.35)' : undefined
    };
  };



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
            fontSize: '13px',
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
            background: activeTab === 'all' ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg3)',
            color: activeTab === 'all' ? '#3b82f6' : 'var(--text3)',
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
            borderBottom: activeTab === 'hold' ? '2px solid #f59e0b' : '2px solid transparent',
            color: activeTab === 'hold' ? '#f59e0b' : 'var(--text3)',
            padding: '11px 16px',
            cursor: 'pointer',
            fontSize: '13px',
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
            background: '#f59e0b', display: 'inline-block'
          }} />
          <span>Hold</span>
          <span style={{
            background: activeTab === 'hold' ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg3)',
            color: activeTab === 'hold' ? '#f59e0b' : 'var(--text3)',
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
            borderBottom: activeTab === 'cancelled' ? '2px solid #ef4444' : '2px solid transparent',
            color: activeTab === 'cancelled' ? '#ef4444' : 'var(--text3)',
            padding: '11px 16px',
            cursor: 'pointer',
            fontSize: '13px',
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
            background: '#ef4444', display: 'inline-block'
          }} />
          <span>Cancelled</span>
          <span style={{
            background: activeTab === 'cancelled' ? 'rgba(239, 68, 68, 0.2)' : 'var(--bg3)',
            color: activeTab === 'cancelled' ? '#ef4444' : 'var(--text3)',
            borderRadius: 10,
            padding: '1px 7px',
            fontSize: 11,
            fontWeight: 700
          }}>
            {cancelledCount}
          </span>
        </button>

        {/* ── Right side: PO Controls (Enter PO No. + Upload PO button) ── */}
        <PoUploadBar
          selectedCount={selectedUnitIds.size}
          canUploadPo={canUploadPo}
          isUploadingPo={isUploadingPo}
          poSuccessMsg={poSuccessMsg}
          onClearSelection={() => setSelectedUnitIds(new Set())}
          onUploadPo={handleBatchPoUpload}
          externalPoNumber={externalPoNumber}
          setExternalPoNumber={setExternalPoNumber}
        />
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
            placeholder="Search serial no., PO, description, customer..."
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
            background: statCardFilter === 'priority' ? 'rgba(249, 115, 22, 0.12)' :
                        statCardFilter === 'inprogress' ? 'rgba(59, 130, 246, 0.12)' :
                        statCardFilter === 'blocked' ? 'rgba(239, 68, 68, 0.12)' :
                        statCardFilter === 'due' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            color: statCardFilter === 'priority' ? '#f97316' :
                   statCardFilter === 'inprogress' ? '#3b82f6' :
                   statCardFilter === 'blocked' ? '#ef4444' :
                   statCardFilter === 'due' ? '#a855f7' : '#f59e0b',
            border: `1px solid ${
              statCardFilter === 'priority' ? 'rgba(249, 115, 22, 0.35)' :
              statCardFilter === 'inprogress' ? 'rgba(59, 130, 246, 0.35)' :
              statCardFilter === 'blocked' ? 'rgba(239, 68, 68, 0.35)' :
              statCardFilter === 'due' ? 'rgba(168, 85, 247, 0.35)' : 'rgba(245, 158, 11, 0.35)'
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

        {/* Summary chip */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginLeft: 'auto', background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '6px 12px', fontSize: 12, color: 'var(--text3)',
          whiteSpace: 'nowrap', flexShrink: 0
        }}>
          <Layers size={13} />
          <strong style={{ color: 'var(--text)' }}>
            {new Set(sorted.map(u => u.order_number).filter(Boolean)).size}
          </strong> {new Set(sorted.map(u => u.order_number).filter(Boolean)).size === 1 ? 'order' : 'orders'}
          <span style={{ color: 'var(--text3)', margin: '0 2px' }}>·</span>
          <strong style={{ color: 'var(--text)' }}>{sorted.length}</strong> unit items
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      <div 
        ref={tableContainerRef}
        className="table-responsive-scroll"
        style={{ overflowX: 'auto', overflowY: 'auto', flex: 1 }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg3)' }}>
            <tr>
              {/* Selection Checkbox Header */}
              <th
                style={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 16,
                  background: 'var(--bg3)',
                  width: 38,
                  minWidth: 38,
                  maxWidth: 38,
                  padding: '8px 4px',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  borderBottom: '1px solid var(--border)',
                  borderRight: '1px solid var(--border)',
                  userSelect: 'none'
                }}
              >
                <input
                  type="checkbox"
                  checked={displayedUnits.length > 0 && displayedUnits.every(u => selectedUnitIds.has(u.unit_id))}
                  ref={el => {
                    if (el) {
                      const hasSome = displayedUnits.some(u => selectedUnitIds.has(u.unit_id));
                      const hasAll = displayedUnits.length > 0 && displayedUnits.every(u => selectedUnitIds.has(u.unit_id));
                      el.indeterminate = hasSome && !hasAll;
                    }
                  }}
                  onChange={handleToggleSelectAll}
                  style={{ cursor: 'pointer', accentColor: 'var(--blue)', width: 14, height: 14 }}
                  title="Select / Deselect visible serial numbers"
                />
              </th>
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
                const thClass = `${isDragging ? ' dragging' : ''}${dragOverClass}`.trim();

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
                    title="Drag to reorder column. Click pin to freeze."
                    style={{
                      ...baseStyle,
                      cursor: 'grab',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      padding: '8px 8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: sortKey === colKey ? 'var(--blue)' : 'var(--text3)',
                      borderBottom: '1px solid var(--border)',
                      textAlign: align,
                      verticalAlign: 'middle'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'space-between', gap: 4, width: '100%' }}>
                      <div 
                        onClick={() => handleSort(colKey)}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', overflow: 'hidden', flex: 1 }}
                      >
                        <GripVertical size={11} className="drag-handle" style={{ cursor: 'grab', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={label}>{label}</span>
                        {sortKey === colKey && <SortIcon col={colKey} />}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => togglePin(colKey, e)}
                        title={isPinned ? "Unfreeze Column" : "Freeze Column to left"}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 1,
                          display: 'flex',
                          alignItems: 'center',
                          color: isPinned ? 'var(--blue)' : 'var(--text3)',
                          opacity: isPinned ? 1 : 0.4,
                          flexShrink: 0
                        }}
                      >
                        <Pin size={11} style={{ transform: isPinned ? 'rotate(-45deg)' : 'none', transition: 'transform 0.15s' }} />
                      </button>
                    </div>

                    {/* Column Resize Handle */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, colKey)}
                      onClick={(e) => e.stopPropagation()}
                      title="Drag to resize column"
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '8px',
                        cursor: 'col-resize',
                        zIndex: 10,
                        background: 'transparent',
                        pointerEvents: 'auto'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
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
                isSelected={selectedUnitIds.has(unit.unit_id)}
                status={getUnitStatus(unit)}
                visibleCols={visibleCols}
                columnWidths={columnWidths}
                pinnedKeys={pinnedKeys}
                stickyLeftMap={stickyLeftMap}
                canEdit={canEdit}
                canEditPanelSize={canEditPanelSize}
                canUploadPo={canUploadPo}
                panelSizeMasters={panelSizeMasters}
                customColumnDefs={customColumnDefs}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                onRowMouseDown={handleRowMouseDown}
                onRowMouseEnter={handleRowMouseEnter}
                onRowClick={handleRowClick}
                onSaveInlineCell={handleSaveInlineCell}
                onSingleUnitPoClick={handleSingleUnitPoClick}
                onPartNumberClick={handlePartNumberClick}
                setPoPdfViewer={setPoPdfViewer}
              />
            ))}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={(visibleCols.length || 12) + 1} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
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
                borderRadius: 4,
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.25)',
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
      <style dangerouslySetInnerHTML={{ __html: `
        .table-responsive-scroll {
          cursor: grab;
        }
        .table-responsive-scroll.active-drag {
          cursor: grabbing;
          user-select: none;
        }
        .table-responsive-scroll tbody tr {
          transition: background-color 0.12s ease;
        }

        /* ── Hovering over any row (cursor on row) - Little Dark Color Highlight ── */
        .table-responsive-scroll tbody tr:hover td {
          background-color: rgba(37, 99, 235, 0.22) !important;
          box-shadow: inset 0 1px 0 rgba(59, 130, 246, 0.35), inset 0 -1px 0 rgba(59, 130, 246, 0.35);
        }
        .table-responsive-scroll tbody tr:hover td:first-child {
          border-left: 5px solid #3b82f6 !important;
        }

        .table-responsive-scroll tbody tr.row-hold:hover td {
          background-color: rgba(245, 158, 11, 0.28) !important;
          box-shadow: inset 0 1px 0 rgba(245, 158, 11, 0.45), inset 0 -1px 0 rgba(245, 158, 11, 0.45);
        }
        .table-responsive-scroll tbody tr.row-hold:hover td:first-child {
          border-left: 5px solid #f59e0b !important;
        }

        .table-responsive-scroll tbody tr.row-cancelled:hover td {
          background-color: rgba(239, 68, 68, 0.28) !important;
          box-shadow: inset 0 1px 0 rgba(239, 68, 68, 0.45), inset 0 -1px 0 rgba(239, 68, 68, 0.45);
        }
        .table-responsive-scroll tbody tr.row-cancelled:hover td:first-child {
          border-left: 5px solid #ef4444 !important;
        }

        /* ── Selected Row Highlight (Excel-style) ── */
        .table-responsive-scroll tbody tr.row-selected td {
          background-color: rgba(59, 130, 246, 0.16) !important;
        }
        .table-responsive-scroll tbody tr.row-selected td:first-child {
          border-left: 5px solid #3b82f6 !important;
        }
        .table-responsive-scroll tbody tr.row-selected:hover td {
          background-color: rgba(59, 130, 246, 0.26) !important;
        }

        .drag-handle {
          color: var(--text3, #5a6070);
          opacity: 0.4;
          transition: opacity 0.15s;
          flex-shrink: 0;
        }
        th:hover .drag-handle {
          opacity: 0.9;
          color: var(--blue, #3b82f6);
        }
        .dragging {
          opacity: 0.4;
        }
        .drag-over-left {
          box-shadow: inset 3px 0 0 0 #3b82f6 !important;
        }
        .drag-over-right {
          box-shadow: inset -3px 0 0 0 #3b82f6 !important;
        }
      `}} />

      {/* ── In-App PDF Viewer for PO Document ── */}
      {poPdfViewer && (
        <div className="modal-overlay open" onClick={(e) => { if (e.target.className === 'modal-overlay open') setPoPdfViewer(null); }}>
          <div className="modal-content" style={{ maxWidth: '92vw', width: '1050px', height: '88vh', display: 'flex', flexDirection: 'column', padding: '16px', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={18} color="var(--blue)" />
                  {poPdfViewer.title || 'PO Document Viewer'}
                </h3>
                {poPdfViewer.subtitle && (
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>
                    {poPdfViewer.subtitle} · {poPdfViewer.file_name}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={getDocUrl(poPdfViewer)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                >
                  <ExternalLink size={14} /> Open in New Tab
                </a>
                <a
                  href={getDocUrl(poPdfViewer)}
                  download={poPdfViewer.file_name || 'po_document.pdf'}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                >
                  <Download size={14} /> Download
                </a>
                <button
                  className="modal-close"
                  onClick={() => setPoPdfViewer(null)}
                  style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}
                >
                  ✕
                </button>
              </div>
            </div>
            <iframe
              src={getDocUrl(poPdfViewer)}
              title={poPdfViewer.file_name}
              style={{ flex: 1, width: '100%', border: '1px solid var(--border)', borderRadius: '6px', background: '#fff' }}
            />
          </div>
        </div>
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
        />
      )}
    </div>
  );
}
