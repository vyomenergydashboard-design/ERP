import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, X, ArrowUpDown, ChevronUp, ChevronDown, Layers, Pin, GripVertical, RotateCcw, Check,
  UploadCloud, FileText, Trash2, ExternalLink, AlertCircle, Plus, FileCheck, Loader2
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
  Pending:      { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
  'On Hold':    { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: 'rgba(148,163,184,0.3)' },
};

const BASE_COLUMNS = [
  { key: 'order_number',          label: 'Order #',       align: 'left' },
  { key: 'short_serial',          label: 'Unit Serial',   align: 'left', alias: 'unit_serial' },
  { key: 'company_name',          label: 'Customer',      align: 'left' },
  { key: 'po_number',             label: 'PO Number',     align: 'left' },
  { key: 'reference_number',      label: 'Ref #',         align: 'left' },
  { key: 'end_client_name',       label: 'End Client',    align: 'left' },
  { key: 'part_number',           label: 'Part Number',   align: 'left' },
  { key: 'panel_type_size',       label: 'Panel Size',    align: 'left' },
  { key: 'material_description',  label: 'Description',   align: 'left' },
  { key: 'classification',        label: 'Type (Design)', align: 'center' },
  { key: 'current_dept',          label: 'Current Dept',  align: 'left' },
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
  order_number: 130,
  short_serial: 135,
  company_name: 180,
  po_number: 140,
  reference_number: 130,
  end_client_name: 140,
  part_number: 140,
  panel_type_size: 150,
  material_description: 220,
  classification: 130,
  current_dept: 120,
  priority: 110,
  delivery_date: 130,
  unit_status: 120,
};

function PanelSizeComboboxCell({ unit, panelSizeMasters, canEdit, onSave }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 240 });
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const currentValue = unit.panel_type_size || '';

  const openDropdown = (e) => {
    if (!canEdit) return;
    e?.preventDefault();
    e?.stopPropagation();
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 260)
      });
    }
    setQuery(currentValue);
    setHighlightIndex(0);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const updatePos = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 4,
          left: rect.left,
          width: Math.max(rect.width, 240)
        });
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
    const nameMatch = item.size_name && item.size_name.toLowerCase().includes(cleanQ);
    const descMatch = item.description && item.description.toLowerCase().includes(cleanQ);
    return nameMatch || descMatch;
  });

  const exactMatch = panelSizeMasters.some(
    item => item.size_name && item.size_name.toLowerCase() === cleanQ
  );

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
    if (!highlight || !text) return text;
    const parts = [];
    const lowerText = text.toLowerCase();
    const lowerHighlight = highlight.toLowerCase();
    let startIndex = 0;
    let index = lowerText.indexOf(lowerHighlight, startIndex);

    while (index !== -1) {
      if (index > startIndex) {
        parts.push(text.substring(startIndex, index));
      }
      parts.push(
        <span key={index} style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'underline' }}>
          {text.substring(index, index + highlight.length)}
        </span>
      );
      startIndex = index + highlight.length;
      index = lowerText.indexOf(lowerHighlight, startIndex);
    }
    if (startIndex < text.length) {
      parts.push(text.substring(startIndex));
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
        onMouseDown={(e) => e.stopPropagation()}
        title="Click to select or change panel size (Design)"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6,
          width: '100%',
          maxWidth: '100%',
          padding: '3px 8px',
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
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: Math.max(coords.width, 260),
            zIndex: 99999,
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            boxShadow: '0 12px 28px rgba(0,0,0,0.5), 0 4px 10px rgba(0,0,0,0.3)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: 280,
            animation: 'fadeIn 0.12s ease'
          }}
          onClick={(e) => e.stopPropagation()}
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
            maxHeight: 220,
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
                    gap: 2,
                    transition: 'background 0.1s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 12,
                      fontWeight: 600,
                      color: isHighlighted ? '#60a5fa' : 'var(--text)'
                    }}>
                      {opt.isCustom ? `+ Use: "${opt.size_name}"` : renderHighlighted(opt.size_name, cleanQ)}
                    </span>
                    {isSelected && <Check size={13} style={{ color: '#10b981' }} />}
                  </div>
                  {opt.description && (
                    <span style={{
                      fontSize: 10.5,
                      color: isHighlighted ? 'var(--text2)' : 'var(--text3)',
                      fontStyle: opt.isCustom ? 'italic' : 'normal'
                    }}>
                      {opt.description}
                    </span>
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
  token,
  getDocUrl,
  onUpdatePartMasters,
  onUpdateSelectedPart
}) {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showExtraUpload, setShowExtraUpload] = useState(false);
  const fileInputRef = useRef(null);

  const isStandard = (selectedPart.classification || '').trim().toLowerCase() === 'standard';
  const masterDocs = selectedPart.masterDocs || [];
  const orderDocs = selectedPart.orderDocs || [];
  
  // Custom drawings attached to the order
  const customDrawings = orderDocs.filter(d => 
    (d.doc_type || '').toLowerCase() === 'drawing' || 
    (d.doc_type || '').toLowerCase() === 'technical specification' ||
    (d.doc_type || '').toLowerCase() === 'spec'
  );
  // Other attachments like PO, Quotation, General
  const otherOrderDocs = orderDocs.filter(d => 
    (d.doc_type || '').toLowerCase() !== 'drawing' && 
    (d.doc_type || '').toLowerCase() !== 'technical specification' &&
    (d.doc_type || '').toLowerCase() !== 'spec'
  );

  const hasMasterDocs = masterDocs.length > 0;

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

  // Upload handler for Standard Part technical drawings
  const handleUploadStandard = async () => {
    if (filesToUpload.length === 0) {
      setUploadError('Please select at least one drawing file to upload.');
      return;
    }
    setIsUploading(true);
    setUploadError('');
    setUploadSuccess('');

    try {
      let partId = selectedPart.partId;

      // If partId is missing, attempt to create part master entry or find it
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
          // If already exists or error, look it up
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
      filesToUpload.forEach(f => formData.append('files', f));

      const upRes = await fetch(`${window.API_BASE}/api/part-number-masters/${partId}/documents`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!upRes.ok) {
        const errData = await upRes.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to upload technical drawings');
      }

      const newDocs = await upRes.json();
      onUpdateSelectedPart(prev => ({
        ...prev,
        partId,
        masterDocs: [...(prev.masterDocs || []), ...newDocs]
      }));
      if (onUpdatePartMasters) onUpdatePartMasters();
      setFilesToUpload([]);
      setUploadSuccess('Standard Technical Drawing(s) uploaded successfully!');
      setShowExtraUpload(false);
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  // Upload handler for Non-Standard custom drawings
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
        orderDocs: [...(prev.orderDocs || []), ...savedDocs]
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
    if (!window.confirm('Are you sure you want to delete this Standard Technical Drawing?')) return;
    try {
      const delRes = await fetch(`${window.API_BASE}/api/part-number-masters/${selectedPart.partId}/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (delRes.ok) {
        onUpdateSelectedPart(prev => ({
          ...prev,
          masterDocs: prev.masterDocs.filter(d => d.id !== docId)
        }));
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

  // Reusable dropzone component
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
          Click to browse or drag & drop technical drawings
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
          Supports PDF, DWG, DXF, PNG, JPG, CAD, STEP, ZIP (Up to 10 files)
        </div>
        <input
          ref={fileInputRef}
          type="file"
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
      <div className="modal" style={{ maxWidth: '720px', width: '92vw', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        
        {/* Modal Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid var(--border)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={18} style={{ color: '#3b82f6' }} />
              <span>Technical Drawings & Specifications</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '3px' }}>
              Part Number: <span style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{selectedPart.partNumber}</span>
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
                  ? 'Master standard catalog drawings apply to this unit.' 
                  : `Custom specification unit (${selectedPart.unitSerial || 'Custom'}). Upload tailored drawings below.`}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'var(--text3)' }}>
              {selectedPart.unitSerial && (
                <div>Unit Serial: <strong style={{ color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>{selectedPart.unitSerial}</strong></div>
              )}
              {selectedPart.orderNumber && (
                <div>Order #: <strong style={{ color: 'var(--text)' }}>{selectedPart.orderNumber}</strong></div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              CONDITION 1: STANDARD CLASSIFICATION
              "Show Standard docs if present and if not give option to upload docs"
             ══════════════════════════════════════════════════════════ */}
          {isStandard && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Standard Technical Drawings</span>
                  <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 500 }}>({masterDocs.length})</span>
                </div>
                {canManageDocs && hasMasterDocs && !showExtraUpload && (
                  <button
                    type="button"
                    className="vbtn"
                    onClick={() => setShowExtraUpload(true)}
                    style={{ fontSize: '11px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Plus size={13} />
                    <span>Upload Additional Drawing</span>
                  </button>
                )}
              </div>

              {/* If Master Docs are PRESENT -> Render them */}
              {hasMasterDocs ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: showExtraUpload ? '16px' : '0px' }}>
                  {masterDocs.map((doc) => {
                    const docUrl = getDocUrl(doc);
                    return (
                      <div
                        key={`master-${doc.id}`}
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
                            background: 'rgba(59, 130, 246, 0.12)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <FileText size={18} style={{ color: '#3b82f6' }} />
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {doc.file_name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                              Standard Technical Drawing · Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
                              onClick={() => handleDeleteMasterDoc(doc.id)}
                              title="Delete standard drawing"
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
                /* If Master Docs are NOT PRESENT -> Give option to upload */
                <div>
                  <div style={{
                    padding: '14px 16px',
                    borderRadius: '8px',
                    background: 'rgba(234, 179, 8, 0.08)',
                    border: '1px solid rgba(234, 179, 8, 0.25)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px'
                  }}>
                    <AlertCircle size={18} style={{ color: '#eab308', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                        No Standard Technical Drawings found for {selectedPart.partNumber}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                        {canManageDocs 
                          ? 'As Design, you can upload the official standard technical drawings below. They will immediately become available across all orders referencing this part.'
                          : 'Standard technical drawings have not yet been uploaded for this part. Please contact the Design department.'}
                      </div>
                    </div>
                  </div>

                  {canManageDocs ? (
                    renderUploadBox(handleUploadStandard, 'Upload Standard Technical Drawing')
                  ) : null}
                </div>
              )}

              {/* Extra upload box when docs are present and user clicked "+ Upload Additional" */}
              {canManageDocs && hasMasterDocs && showExtraUpload && (
                <div style={{ marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Upload Additional Standard Drawing:</span>
                    <button
                      type="button"
                      onClick={() => setShowExtraUpload(false)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--text3)', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                  {renderUploadBox(handleUploadStandard, 'Upload Additional Drawing')}
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
                              <FileText size={18} style={{ color: '#c084fc' }} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {doc.file_name}
                                <span style={{ fontSize: '10px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', padding: '2px 6px', borderRadius: '4px', marginLeft: '8px', fontWeight: 700 }}>
                                  CUSTOM DRAWING
                                </span>
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                                Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
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
                        padding: '10px 14px'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: '13px' }}>
                          {doc.file_name}
                          <span style={{ fontSize: '10px', background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', fontWeight: 600 }}>
                            {doc.doc_type || 'General'}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                          Uploaded {new Date(doc.uploaded_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="vbtn"
                          style={{ background: 'var(--bg2)', color: 'var(--text)', border: '1px solid var(--border)', textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}
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
    </div>
  );
}

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
  const [priorityFilter, setPriorityFilter] = useState(() => localStorage.getItem('erp_all_priorityFilter') || 'all');
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem('erp_all_statusFilter') || 'incomplete');
  const [sortKey, setSortKey] = useState(() => localStorage.getItem('erp_all_sortKey') || 'order_number');
  const [sortDir, setSortDir] = useState(() => localStorage.getItem('erp_all_sortDir') || 'asc');

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
        return [...valid, ...missing];
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
      const saved = localStorage.getItem('erp_all_colWidths');
      return saved ? { ...DEFAULT_COL_WIDTHS, ...JSON.parse(saved) } : DEFAULT_COL_WIDTHS;
    } catch (e) {
      return DEFAULT_COL_WIDTHS;
    }
  });

  useEffect(() => {
    localStorage.setItem('erp_all_colWidths', JSON.stringify(columnWidths));
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
          orderDocs = [...orderDocs, ...uDocs];
        }
      }
      if (unit.order_id) {
        const res = await fetch(`${window.API_BASE}/api/documents/Order/${unit.order_id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const oDocs = await res.json();
          orderDocs = [...orderDocs, ...oDocs];
        }
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }

    setSelectedPartForDocs({
      partId: match?.id || null,
      partNumber: pNum || 'Unspecified',
      orderId: unit.order_id,
      orderNumber: unit.order_number || '',
      unitId: targetUnitId,
      unitSerial: unit.unit_serial || unit.short_serial || '',
      description: unit.material_description || match?.description || '',
      classification: unit.classification || 'Standard',
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
        return { ...u, [colKey]: newValue };
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
        const uId = unit.unit_id || unit.id;
        if (uId) {
          await fetch(`${window.API_BASE}/api/units/${uId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ panel_type_size: newValue })
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

  const handleRowClick = (orderId, unitId) => {
    window.dispatchEvent(new CustomEvent('setView', {
      detail: { view: 'flow', orderId: parseInt(orderId), unitId: parseInt(unitId) }
    }));
  };

  const handleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const getUnitStatus = (unit) => {
    if (unit.unit_status === 'Dispatched') return 'Completed';
    if (unit.unit_status === 'Hold') return 'On Hold';
    if (unit.dept_steps?.some(s => s.status === 'blocked')) return 'Blocked';

    const hasInprogress = 
      Number(unit.inprogress_step_count || 0) > 0 ||
      Number(unit.order_inprogress_step_count || 0) > 0 ||
      unit.dept_steps?.some(s => s.status === 'inprogress');

    const hasDone = 
      Number(unit.done_step_count || 0) > 0 ||
      Number(unit.order_done_step_count || 0) > 0 ||
      unit.dept_steps?.some(s => s.status === 'done');

    if (hasInprogress || hasDone) {
      return 'In Progress';
    }

    return 'Pending';
  };

  const filtered = units.filter(u => {
    const status = getUnitStatus(u);

    // Apply Stat Card Filter if active
    if (statCardFilter === 'priority') {
      const p = (u.priority || 'Medium').toLowerCase();
      if (p !== 'urgent' && p !== 'high') return false;
    } else if (statCardFilter === 'inprogress') {
      if (status !== 'In Progress') return false;
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
    if (statusFilter === 'incomplete' && status === 'Completed') return false;
    if (statusFilter === 'completed' && status !== 'Completed') return false;
    if (statusFilter === 'pending' && status !== 'Pending') return false;
    if (statusFilter === 'inprogress' && status !== 'In Progress') return false;
    if (statusFilter === 'blocked' && status !== 'Blocked') return false;
    if (statusFilter === 'hold' && status !== 'On Hold') return false;
    
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
        (u.part_number || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
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
      av = (a[sortKey] || '').toString().toLowerCase();
      bv = (b[sortKey] || '').toString().toLowerCase();
    }
    if (av < bv) return sortDir === 'asc' ? -1 : 1;
    if (av > bv) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={11} style={{ opacity: 0.3, marginLeft: 4 }} />;
    return sortDir === 'asc'
      ? <ChevronUp size={11} style={{ color: 'var(--blue)', marginLeft: 4 }} />
      : <ChevronDown size={11} style={{ color: 'var(--blue)', marginLeft: 4 }} />;
  };

  // Active columns filtered by department visibility
  const activeCols = columnKeys
    .filter(key => isColVisible(key))
    .map(key => allColumns.find(c => c.key === key))
    .filter(Boolean);

  // Partition active columns into Pinned (frozen on left) and Unpinned
  const pinnedCols = activeCols.filter(c => pinnedKeys.includes(c.key));
  const unpinnedCols = activeCols.filter(c => !pinnedKeys.includes(c.key));
  const visibleCols = [...pinnedCols, ...unpinnedCols];

  // Calculate cumulative left offsets for pinned columns
  const stickyLeftMap = {};
  let currentLeft = 0;
  pinnedCols.forEach((c) => {
    const defaultWidth = isDateTimeType(c.fieldType) ? 170 : (DEFAULT_COL_WIDTHS[c.key] || 140);
    const width = columnWidths[c.key] || defaultWidth;
    stickyLeftMap[c.key] = currentLeft;
    currentLeft += width;
  });

  const isPinned = (colKey) => pinnedKeys.includes(colKey);
  const isLastPinned = (colKey) => pinnedCols.length > 0 && pinnedCols[pinnedCols.length - 1].key === colKey;

  const getColStyle = (colKey, isHeader = false, isAltRow = false) => {
    const colDef = allColumns.find(c => c.key === colKey);
    const defaultWidth = isDateTimeType(colDef?.fieldType) ? 170 : (DEFAULT_COL_WIDTHS[colKey] || 140);
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
      position: pinned ? 'sticky' : 'relative',
      left: pinned ? `${stickyLeftMap[colKey]}px` : undefined,
      zIndex: pinned ? (isHeader ? 15 : 3) : (isHeader ? 10 : 1),
      background: isHeader
        ? 'var(--bg3)'
        : (pinned ? (isAltRow ? 'var(--bg2)' : 'var(--bg)') : undefined),
      boxShadow: lastPin ? '4px 0 8px -3px rgba(0,0,0,0.35)' : undefined
    };
  };



  const renderCellContent = (unit, colKey) => {
    const status = getUnitStatus(unit);
    const statusStyle = STATUS_STYLES[status] || STATUS_STYLES['In Progress'];
    const priority = unit.priority || 'Medium';
    const priorityStyle = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium;
    const isOverdue = unit.delivery_date && new Date(unit.delivery_date) < new Date() && status !== 'Completed';
    const effectiveUnitId = unit.unit_id || unit.id;

    switch (colKey) {
      case 'order_number':
        return (
          <span 
            onClick={(e) => { e.stopPropagation(); handleRowClick(unit.order_id, effectiveUnitId); }}
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
            onClick={(e) => { e.stopPropagation(); handleRowClick(unit.order_id, effectiveUnitId); }} 
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
            title="Click to view Process Flow for this Unit Serial"
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#3b82f6', fontSize: 12, textDecoration: 'underline' }}>
              {unit.unit_serial}
            </span>
          </div>
        );

      case 'company_name':
        return (
          <>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>{unit.company_name || '—'}</span>
            {unit.company_city && <span style={{ color: 'var(--text3)', fontWeight: 400, fontSize: 11, marginLeft: 4 }}>· {unit.company_city}</span>}
          </>
        );

      case 'classification':
        const clsVal = unit.classification || 'Standard';
        if (canEdit) {
          return (
            <select
              value={clsVal}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => handleSaveInlineCell(unit, 'classification', e.target.value)}
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
              onChange={(e) => handleSaveInlineCell(unit, 'priority', e.target.value)}
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

      case 'current_dept':
        return (
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
            background: 'rgba(99,102,241,0.12)', color: '#818cf8',
            border: '1px solid rgba(99,102,241,0.25)', textTransform: 'uppercase', letterSpacing: '0.4px'
          }}>
            {unit.current_dept || 'Sales'}
          </span>
        );

      case 'unit_status':
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
              onChange={(e) => handleSaveInlineCell(unit, 'delivery_date', e.target.value)}
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
              handlePartNumberClick(unit);
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

      case 'panel_type_size':
        return (
          <PanelSizeComboboxCell
            unit={unit}
            panelSizeMasters={panelSizeMasters}
            canEdit={canEditPanelSize}
            onSave={(newSize) => handleSaveInlineCell(unit, 'panel_type_size', newSize)}
          />
        );

      default:
        const customCol = customColumnDefs.find(c => c.col_key === colKey);
        if (customCol) {
          const isEditingThis = editingCell && editingCell.unitId === effectiveUnitId && editingCell.colKey === colKey;
          const currentVal = unit.custom_fields?.[colKey] ?? '';

          if (isEditingThis) {
            if (customCol.field_type === 'Yes/No') {
              return (
                <select
                  autoFocus
                  value={editingCell.value || 'No'}
                  onChange={(e) => handleSaveInlineCell(unit, colKey, e.target.value)}
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
                  onBlur={() => handleSaveInlineCell(unit, colKey, editingCell.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveInlineCell(unit, colKey, editingCell.value);
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
                  onBlur={() => handleSaveInlineCell(unit, colKey, editingCell.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveInlineCell(unit, colKey, editingCell.value);
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
                  value={editingCell.value ?? ''}
                  onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                  onBlur={() => handleSaveInlineCell(unit, colKey, editingCell.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveInlineCell(unit, colKey, editingCell.value);
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
                value={editingCell.value ?? ''}
                onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                onBlur={() => handleSaveInlineCell(unit, colKey, editingCell.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveInlineCell(unit, colKey, editingCell.value);
                  if (e.key === 'Escape') setEditingCell(null);
                }}
                style={{
                  width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
                  color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
                }}
              />
            );
          }

          if (!currentVal && currentVal !== 0) {
            return (
              <span
                onClick={(e) => {
                  if (canEdit) {
                    e.stopPropagation();
                    setEditingCell({ unitId: effectiveUnitId, colKey, value: '' });
                  }
                }}
                style={{ color: 'var(--text3)', cursor: canEdit ? 'pointer' : 'default', padding: '2px 4px', display: 'inline-block' }}
                title={canEdit ? 'Click to edit' : undefined}
              >
                —
              </span>
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
                style={{ cursor: canEdit ? 'pointer' : 'default', fontFamily: 'var(--font-mono)', fontSize: 11 }}
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
                style={{ cursor: canEdit ? 'pointer' : 'default', fontFamily: 'var(--font-mono)', fontSize: 12 }}
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
              onBlur={() => handleSaveInlineCell(unit, colKey, editingCell.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveInlineCell(unit, colKey, editingCell.value);
                if (e.key === 'Escape') setEditingCell(null);
              }}
              style={{
                width: '100%', padding: '2px 6px', fontSize: 12, background: 'var(--bg3)',
                color: 'var(--text)', border: '1px solid var(--blue)', borderRadius: 4, outline: 'none'
              }}
            />
          );
        }

        const isEditableTextCol = ['end_client_name', 'po_number', 'reference_number', 'material_description'].includes(colKey);

        return (
          <span
            onClick={(e) => {
              if (canEdit && isEditableTextCol) {
                e.stopPropagation();
                setEditingCell({ unitId: effectiveUnitId, colKey, value: currentVal });
              }
            }}
            title={canEdit && isEditableTextCol ? "Click to edit" : undefined}
            style={{
              color: colKey === 'reference_number' ? '#f59e0b' : 'var(--text2)',
              fontSize: 12,
              cursor: canEdit && isEditableTextCol ? 'pointer' : 'default'
            }}
          >
            {currentVal || '—'}
          </span>
        );
    }
  };

  if (isLoading) return (
    <div style={{ padding: 60, textAlign: 'center', color: 'var(--text3)' }}>
      <div style={{ fontSize: 13 }}>Loading units...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>

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
            placeholder="Search unit serial, PO, description, customer..."
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
          <option value="incomplete">Incomplete</option>
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="blocked">Blocked</option>
          <option value="hold">On Hold</option>
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
                      padding: '11px 12px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.6px',
                      color: sortKey === colKey ? 'var(--blue)' : 'var(--text3)',
                      borderBottom: '1px solid var(--border)',
                      textAlign: align
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'space-between', gap: 6, width: '100%' }}>
                      <div 
                        onClick={() => handleSort(colKey)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', overflow: 'hidden', flex: 1 }}
                      >
                        <GripVertical size={12} className="drag-handle" style={{ cursor: 'grab' }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
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
                          padding: 2,
                          display: 'flex',
                          alignItems: 'center',
                          color: isPinned ? 'var(--blue)' : 'var(--text3)',
                          opacity: isPinned ? 1 : 0.4,
                          flexShrink: 0
                        }}
                      >
                        <Pin size={12} style={{ transform: isPinned ? 'rotate(-45deg)' : 'none', transition: 'transform 0.15s' }} />
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
            {sorted.map((unit, idx) => {
              const isAltRow = idx % 2 !== 0;

              return (
                <tr
                  key={unit.unit_id}
                  style={{
                    background: isAltRow ? 'var(--bg2)' : 'var(--bg)',
                    cursor: 'default',
                    transition: 'background 0.12s',
                    borderBottom: '1px solid var(--border)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg4)'}
                  onMouseLeave={e => e.currentTarget.style.background = isAltRow ? 'var(--bg2)' : 'var(--bg)'}
                >
                  {visibleCols.map(c => {
                    const style = getColStyle(c.key, false, isAltRow);
                    return (
                      <td
                        key={c.key}
                        style={{
                          padding: '10px 14px',
                          textAlign: c.align || 'left',
                          ...style
                        }}
                      >
                        {renderCellContent(unit, c.key)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={visibleCols.length || 12} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
                  <Search size={28} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 14 }}>No units match the current filters</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .table-responsive-scroll {
          cursor: grab;
        }
        .table-responsive-scroll.active-drag {
          cursor: grabbing;
          user-select: none;
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

      {/* ── Technical Drawings & Standard Documents Modal ── */}
      {showDocsModal && selectedPartForDocs && (
        <TechnicalDocsModal
          selectedPart={selectedPartForDocs}
          onClose={() => setShowDocsModal(false)}
          canManageDocs={canManageDocs}
          token={token}
          getDocUrl={getDocUrl}
          onUpdatePartMasters={fetchPartMasters}
          onUpdateSelectedPart={setSelectedPartForDocs}
        />
      )}
    </div>
  );
}
