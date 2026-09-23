import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import ExcelSheetViewer from './ExcelSheetViewer';
import {
  X, UploadCloud, FileText, Download, Trash2, Eye,
  CheckCircle2, AlertCircle, Loader2, RefreshCw, ExternalLink,
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw,
  FileSpreadsheet, Image as ImageIcon, Plus, Layers
} from 'lucide-react';

function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getDocumentUrl(filePath) {
  if (!filePath) return '';
  let pathStr = filePath.replace(/\\/g, '/');
  const uploadsIdx = pathStr.indexOf('uploads/');
  let relPath = '';
  if (uploadsIdx !== -1) {
    relPath = pathStr.substring(uploadsIdx + 8);
  } else {
    relPath = pathStr.split('/').pop();
  }
  relPath = relPath.replace(/^\/+/, '');
  const token = localStorage.getItem('token');
  const tokenParam = token ? `?token=${encodeURIComponent(token)}` : '';
  const baseUrl = window.API_BASE || '';
  return `${baseUrl}/uploads/${relPath}${tokenParam}`;
}

function getFileType(fileName) {
  if (!fileName) return 'other';
  const ext = fileName.split('.').pop().toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  if (['xlsx', 'xls', 'csv'].includes(ext)) return 'excel';
  if (['doc', 'docx'].includes(ext)) return 'word';
  return 'other';
}

function getDocCategoryLabel(docType) {
  const type = (docType || '').toLowerCase();
  if (type === 'quotation') return 'Quotation';
  if (type === 'po') return 'Purchase Order (PO)';
  if (type === 'indent' || type === 'details') return 'Details';
  if (type === 'approved' || type === 'general') return 'Approved Document';
  return docType || 'Document';
}

export default function OrderDocumentsModal({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  clientName = '',
  projectName = '',
  readOnly = false,
  onDocumentsUpdated
}) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingCategory, setUploadingCategory] = useState(null);
  const [draggingCategory, setDraggingCategory] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Active document selected for preview - null by default so preview is NOT always open
  const [selectedDocForPreview, setSelectedDocForPreview] = useState(null);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [imageZoom, setImageZoom] = useState(1);
  const [showFullExcelModal, setShowFullExcelModal] = useState(false);

  // Inline Excel parser state for spreadsheet preview
  const [excelData, setExcelData] = useState({ sheets: [], activeSheet: '', rows: [], loading: false, error: null });
  const [excelSearch, setExcelSearch] = useState('');

  const quotationInputRef = useRef(null);
  const poInputRef = useRef(null);
  const detailsInputRef = useRef(null);
  const approvedInputRef = useRef(null);
  const replaceQuotationInputRef = useRef(null);
  const replacePoInputRef = useRef(null);
  const replaceDetailsInputRef = useRef(null);

  const token = localStorage.getItem('token');

  const fetchDocuments = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${window.API_BASE}/api/documents/Order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const docsList = Array.isArray(data) ? data : [];
        setDocuments(docsList);

        // If user already had a document open for preview, keep it updated.
        // Otherwise do NOT auto-open preview (keep preview closed by default)
        setSelectedDocForPreview(prev => {
          if (prev && docsList.some(d => d.id === prev.id)) {
            return docsList.find(d => d.id === prev.id);
          }
          return null;
        });
      } else {
        const err = await res.json().catch(() => ({}));
        setErrorMessage(err.error || 'Failed to fetch documents for this order.');
      }
    } catch (err) {
      console.error('Error fetching order documents:', err);
      setErrorMessage('Network error while fetching documents.');
    } finally {
      setLoading(false);
    }
  }, [orderId, token]);

  useEffect(() => {
    if (isOpen && orderId) {
      // Reset preview state whenever modal opens fresh
      setSelectedDocForPreview(null);
      setIsFullscreenPreview(false);
      setImageZoom(1);
      fetchDocuments();
    }
  }, [isOpen, orderId, fetchDocuments]);

  // Load Excel data with raw: false so time & dates format correctly
  useEffect(() => {
    if (!selectedDocForPreview) {
      setExcelData({ sheets: [], activeSheet: '', rows: [], loading: false, error: null });
      return;
    }

    const fileType = getFileType(selectedDocForPreview.file_name);
    if (fileType !== 'excel') {
      setExcelData({ sheets: [], activeSheet: '', rows: [], loading: false, error: null });
      return;
    }

    let isMounted = true;
    const loadExcel = async () => {
      setExcelData(prev => ({ ...prev, loading: true, error: null }));
      try {
        const fileUrl = getDocumentUrl(selectedDocForPreview.file_path);
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`Could not load spreadsheet (status ${res.status})`);
        const buffer = await res.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
        if (!isMounted) return;

        const sheetNames = wb.SheetNames || [];
        if (sheetNames.length === 0) throw new Error('No sheets found in workbook');

        const initialSheet = sheetNames[0];
        const ws = wb.Sheets[initialSheet];
        // raw: false ensures formatted cell display (e.g. 09:30:38 instead of 46235.396)
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });

        setExcelData({
          workbook: wb,
          sheets: sheetNames,
          activeSheet: initialSheet,
          rows: rows,
          loading: false,
          error: null
        });
        setExcelSearch('');
      } catch (err) {
        console.error('Excel parse error:', err);
        if (isMounted) {
          setExcelData({ sheets: [], activeSheet: '', rows: [], loading: false, error: err.message || 'Failed to parse Excel file' });
        }
      }
    };

    loadExcel();
    return () => { isMounted = false; };
  }, [selectedDocForPreview]);

  const handleExcelSheetChange = (sheetName) => {
    if (!excelData.workbook) return;
    try {
      const ws = excelData.workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false });
      setExcelData(prev => ({
        ...prev,
        activeSheet: sheetName,
        rows: rows
      }));
      setExcelSearch('');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        if (showFullExcelModal) {
          setShowFullExcelModal(false);
        } else if (isFullscreenPreview) {
          setIsFullscreenPreview(false);
        } else if (selectedDocForPreview) {
          setSelectedDocForPreview(null); // Close preview first
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, showFullExcelModal, isFullscreenPreview, selectedDocForPreview, onClose]);

  if (!isOpen) return null;

  const userRole = (() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u && u.role) return u.role;
    } catch (e) { }
    return localStorage.getItem('userRole') || 'Sales';
  })();
  const roleUpper = (userRole || '').trim().toUpperCase();
  const canSeePo = ['ADMIN', 'MANAGER', 'SALES', 'ACCOUNTS'].includes(roleUpper);
  const canEditPo = ['ADMIN', 'MANAGER', 'SALES'].includes(roleUpper) && !readOnly;

  // Categorize documents
  const poDoc = documents.find(d => (d.doc_type || '').toLowerCase() === 'po');
  const quotationDoc = documents.find(d => (d.doc_type || '').toLowerCase() === 'quotation');
  const detailsDoc = documents.find(d => {
    const type = (d.doc_type || '').toLowerCase();
    return type === 'indent' || type === 'details';
  });
  const approvedDocs = documents.filter(d => {
    const type = (d.doc_type || '').toLowerCase();
    return type === 'approved' || type === 'general';
  });

  const showStatus = (msg, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setSuccessMessage('');
    } else {
      setSuccessMessage(msg);
      setErrorMessage('');
      setTimeout(() => setSuccessMessage(''), 4000);
    }
  };

  const uploadFiles = async (category, files, isReplacement = false, existingDocId = null) => {
    if (readOnly) {
      showStatus('Order documents cannot be modified while on hold or in read-only mode.', true);
      return;
    }
    if (!files || files.length === 0) return;

    setUploadingCategory(category);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (isReplacement && existingDocId) {
        const delRes = await fetch(`${window.API_BASE}/api/documents/${existingDocId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!delRes.ok) {
          const errData = await delRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to remove old file before replacing.');
        }
      }

      let docType = 'Approved';
      if (category === 'po') docType = 'PO';
      if (category === 'quotation') docType = 'Quotation';
      if (category === 'details') docType = 'Indent';

      const formData = new FormData();
      formData.append('entity_type', 'Order');
      formData.append('entity_id', orderId);
      formData.append('doc_type', docType);

      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      const res = await fetch(`${window.API_BASE}/api/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to upload document.');
      }

      const uploadedList = await res.json();
      await fetchDocuments();

      if (uploadedList && uploadedList.length > 0) {
        setSelectedDocForPreview(uploadedList[0]);
      }

      showStatus(
        isReplacement
          ? `${docType} replaced successfully!`
          : `${docType} document(s) uploaded successfully!`
      );
      if (onDocumentsUpdated) onDocumentsUpdated();
    } catch (err) {
      console.error('Upload error:', err);
      showStatus(err.message || 'Error occurred during upload.', true);
    } finally {
      setUploadingCategory(null);
    }
  };

  const handleDeleteDoc = async (docId, docName) => {
    if (readOnly) {
      showStatus('Order documents cannot be modified while on hold.', true);
      return;
    }
    if (!window.confirm(`Are you sure you want to delete "${docName}"?`)) return;

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await fetch(`${window.API_BASE}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        if (selectedDocForPreview?.id === docId) {
          setSelectedDocForPreview(null);
        }
        await fetchDocuments();
        showStatus(`"${docName}" deleted successfully.`);
        if (onDocumentsUpdated) onDocumentsUpdated();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to delete document.');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showStatus(err.message || 'Error deleting document.', true);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e, cat) => {
    e.preventDefault();
    if (readOnly) return;
    setDraggingCategory(cat);
  };

  const handleDragLeave = (e, cat) => {
    e.preventDefault();
    if (draggingCategory === cat) {
      setDraggingCategory(null);
    }
  };

  const handleDrop = (e, cat) => {
    e.preventDefault();
    setDraggingCategory(null);
    if (readOnly) return;
    const droppedFiles = e.dataTransfer?.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    if (cat === 'po') {
      if (!canEditPo) {
        showStatus('Only Sales, Admin, and Manager roles can upload or modify PO documents.', true);
        return;
      }
      if (poDoc) {
        uploadFiles('po', [droppedFiles[0]], true, poDoc.id);
      } else {
        uploadFiles('po', [droppedFiles[0]]);
      }
    } else if (cat === 'quotation') {
      if (quotationDoc) {
        uploadFiles('quotation', [droppedFiles[0]], true, quotationDoc.id);
      } else {
        uploadFiles('quotation', [droppedFiles[0]]);
      }
    } else if (cat === 'details') {
      if (detailsDoc) {
        uploadFiles('details', [droppedFiles[0]], true, detailsDoc.id);
      } else {
        uploadFiles('details', [droppedFiles[0]]);
      }
    } else if (cat === 'approved') {
      const remainingSlots = Math.max(0, 20 - approvedDocs.length);
      if (remainingSlots <= 0) {
        showStatus('Maximum limit of 20 Approved Documents reached.', true);
        return;
      }
      const filesToUpload = Array.from(droppedFiles).slice(0, remainingSlots);
      uploadFiles('approved', filesToUpload);
    }
  };

  const isPreviewActive = Boolean(selectedDocForPreview);
  const activeDocType = selectedDocForPreview ? getFileType(selectedDocForPreview.file_name) : null;
  const activeDocUrl = selectedDocForPreview ? getDocumentUrl(selectedDocForPreview.file_path) : '';

  // Filter Excel rows based on search
  const filteredExcelRows = excelData.rows.filter((row, idx) => {
    if (!excelSearch.trim()) return true;
    if (idx === 0) return true;
    const term = excelSearch.toLowerCase();
    return (row || []).some(cell => String(cell ?? '').toLowerCase().includes(term));
  });

  return createPortal(
    <div
      className="ord-docs-modal-overlay"
      onClick={(e) => {
        if (e.target.classList.contains('ord-docs-modal-overlay')) {
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.15s ease'
      }}
    >
      <div
        className="ord-docs-modal-content"
        style={{
          background: 'var(--bg2, #181b26)',
          border: '1px solid var(--border, #2d3748)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: isPreviewActive ? '1420px' : '1060px',
          height: isPreviewActive ? '90vh' : 'auto',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.75)',
          overflow: 'hidden',
          transition: 'max-width 0.25s ease, height 0.25s ease',
          color: 'var(--text, #f1f5f9)'
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '14px 22px',
            borderBottom: '1px solid var(--border, #2d3748)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            background: 'var(--bg, #0f172a)',
            flexShrink: 0
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.02em', color: 'var(--text)' }}>
                Order Documents
              </h2>
              <span
                style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '13px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--blue, #3b82f6)',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
              >
                {orderNumber || `Order #${orderId}`}
              </span>
              {clientName && (
                <span style={{ fontSize: '13px', color: 'var(--text2, #94a3b8)', fontWeight: '600' }}>
                  • {clientName}
                </span>
              )}
              {projectName && (
                <span style={{ fontSize: '12px', color: 'var(--text3, #64748b)' }}>
                  ({projectName})
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text3, #64748b)', marginTop: '3px' }}>
              Only <strong style={{ color: 'var(--text2, #cbd5e1)' }}>one</strong> Quotation allowed. To replace after submission, delete the existing file first.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={fetchDocuments}
              title="Refresh documents"
              style={{
                background: 'var(--bg3, #1e2230)',
                border: '1px solid var(--border, #2d3748)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: 'var(--text2, #94a3b8)',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                transition: 'all 0.15s'
              }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text3, #64748b)',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMessage && (
          <div
            style={{
              margin: '10px 22px 0',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={15} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage('')}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px' }}
            >
              ✕
            </button>
          </div>
        )}

        {successMessage && (
          <div
            style={{
              margin: '10px 22px 0',
              padding: '8px 12px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#10b981',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle2 size={15} style={{ flexShrink: 0 }} />
            <span style={{ flex: 1 }}>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage('')}
              style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', fontSize: '13px' }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Main Area */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>

          {/* ═════════════════════════════════════════════════════════
              DOCUMENTS MANAGEMENT VIEW (Left Pane when Preview open, Full view when closed)
             ═════════════════════════════════════════════════════════ */}
          {(!isFullscreenPreview || !isPreviewActive) && (
            <div
              className="ord-docs-manage-pane"
              style={{
                width: isPreviewActive ? '440px' : '100%',
                minWidth: isPreviewActive ? '410px' : 'auto',
                maxWidth: isPreviewActive ? '450px' : 'none',
                borderRight: isPreviewActive ? '1px solid var(--border, #2d3748)' : 'none',
                background: 'var(--bg2, #181b26)',
                padding: '20px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: isPreviewActive ? 'column' : 'column',
                gap: '16px',
                transition: 'width 0.25s ease'
              }}
            >
              {/* Show cards in a responsive layout (4 cards if PO visible, 3 otherwise) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isPreviewActive ? '1fr' : (canSeePo ? 'repeat(auto-fit, minmax(210px, 1fr))' : 'repeat(3, minmax(0, 1fr))'),
                  gap: '16px'
                }}
              >
                {/* ── CARD 0: Purchase Order (PO) (Visible to Admin, Manager, Sales, Accounts) ── */}
                {canSeePo && (
                  <div
                    style={{
                      background: 'var(--bg3, #1e2230)',
                      border: `1px solid ${draggingCategory === 'po' ? 'var(--blue, #3b82f6)' : poDoc && selectedDocForPreview?.id === poDoc.id ? 'var(--blue, #3b82f6)' : 'var(--border, #2d3748)'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      minHeight: isPreviewActive ? 'auto' : '200px',
                      transition: 'all 0.15s ease',
                      boxShadow: poDoc && selectedDocForPreview?.id === poDoc.id ? '0 0 0 1px var(--blue, #3b82f6)' : 'none'
                    }}
                    onDragOver={(e) => handleDragOver(e, 'po')}
                    onDragLeave={(e) => handleDragLeave(e, 'po')}
                    onDrop={(e) => handleDrop(e, 'po')}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--blue, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={15} />
                          </div>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>
                              Purchase Order (PO)
                            </h4>
                            <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Order-level PO document</div>
                          </div>
                        </div>
                        {poDoc && (
                          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 7px', borderRadius: '4px' }}>
                            ✓ Done
                          </span>
                        )}
                      </div>

                      {uploadingCategory === 'po' ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '8px' }}>
                          <Loader2 size={18} className="animate-spin" style={{ color: 'var(--blue)' }} />
                          <span style={{ fontSize: '12px', color: 'var(--text2)' }}>Uploading PO...</span>
                        </div>
                      ) : poDoc ? (
                        <div
                          onClick={() => setSelectedDocForPreview(poDoc)}
                          style={{
                            background: selectedDocForPreview?.id === poDoc.id ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg2, #181b26)',
                            border: '1px solid var(--border, #2d3748)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            marginTop: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', wordBreak: 'break-word', lineHeight: '1.4' }} title={poDoc.file_name}>
                            {poDoc.file_name}
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                            {formatFileSize(poDoc.file_size)}
                            {poDoc.uploaded_at && ` · ${new Date(poDoc.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}
                          </div>
                        </div>
                      ) : (
                        canEditPo ? (
                          <label
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              border: '1px dashed var(--border2, #3b4256)',
                              borderRadius: '8px',
                              padding: '24px 12px',
                              marginTop: '8px',
                              cursor: readOnly ? 'not-allowed' : 'pointer',
                              color: 'var(--text3, #64748b)',
                              fontSize: '12px',
                              textAlign: 'center',
                              background: draggingCategory === 'po' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                              transition: 'all 0.15s'
                            }}
                          >
                            <UploadCloud size={22} style={{ color: 'var(--blue, #3b82f6)', opacity: 0.8 }} />
                            <span>Drag file here or <span style={{ color: 'var(--blue, #3b82f6)', fontWeight: '600' }}>browse files</span></span>
                            <input
                              ref={poInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              hidden
                              disabled={readOnly}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  uploadFiles('po', [e.target.files[0]]);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>
                        ) : (
                          <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--text3, #64748b)', fontSize: '12px', border: '1px dashed var(--border2, #3b4256)', borderRadius: '8px', marginTop: '8px' }}>
                            No PO document uploaded
                          </div>
                        )
                      )}
                    </div>

                    {/* Actions for PO when uploaded */}
                    {poDoc && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', flexWrap: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedDocForPreview(poDoc)}
                          style={{
                            flex: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            background: selectedDocForPreview?.id === poDoc.id ? 'var(--blue, #3b82f6)' : 'rgba(59, 130, 246, 0.14)',
                            color: selectedDocForPreview?.id === poDoc.id ? '#ffffff' : 'var(--blue, #3b82f6)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Eye size={13} />
                          <span>{selectedDocForPreview?.id === poDoc.id ? 'Previewing' : 'Preview'}</span>
                        </button>

                        <a
                          href={getDocumentUrl(poDoc.file_path)}
                          download={poDoc.file_name}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '6px 9px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid var(--border, #2d3748)',
                            borderRadius: '6px',
                            color: 'var(--text2, #cbd5e1)',
                            cursor: 'pointer',
                            textDecoration: 'none'
                          }}
                          title="Download"
                        >
                          <Download size={13} />
                        </a>

                        {canEditPo && (
                          <>
                            <button
                              type="button"
                              onClick={() => replacePoInputRef.current?.click()}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px 9px',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.25)',
                                borderRadius: '6px',
                                color: 'var(--blue, #3b82f6)',
                                cursor: 'pointer'
                              }}
                              title="Replace file"
                            >
                              <RefreshCw size={13} />
                            </button>
                            <input
                              ref={replacePoInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx"
                              hidden
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  uploadFiles('po', [e.target.files[0]], true, poDoc.id);
                                  e.target.value = '';
                                }
                              }}
                            />

                            <button
                              type="button"
                              onClick={() => deleteDocument(poDoc.id, poDoc.file_name)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px 9px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                borderRadius: '6px',
                                color: '#ef4444',
                                cursor: 'pointer'
                              }}
                              title="Delete file"
                            >
                              <Trash2 size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── CARD 1: Quotation ── */}
                <div
                  style={{
                    background: 'var(--bg3, #1e2230)',
                    border: `1px solid ${draggingCategory === 'quotation' ? 'var(--blue, #3b82f6)' : quotationDoc && selectedDocForPreview?.id === quotationDoc.id ? 'var(--blue, #3b82f6)' : 'var(--border, #2d3748)'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: isPreviewActive ? 'auto' : '200px',
                    transition: 'all 0.15s ease',
                    boxShadow: quotationDoc && selectedDocForPreview?.id === quotationDoc.id ? '0 0 0 1px var(--blue, #3b82f6)' : 'none'
                  }}
                  onDragOver={(e) => handleDragOver(e, 'quotation')}
                  onDragLeave={(e) => handleDragLeave(e, 'quotation')}
                  onDrop={(e) => handleDrop(e, 'quotation')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--blue, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={15} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>
                            Quotation
                          </h4>
                          <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Single official quotation</div>
                        </div>
                      </div>
                      {quotationDoc && (
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 7px', borderRadius: '4px' }}>
                          ✓ Done
                        </span>
                      )}
                    </div>

                    {uploadingCategory === 'quotation' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '8px' }}>
                        <Loader2 size={18} className="animate-spin" style={{ color: 'var(--blue)' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text2)' }}>Uploading quotation...</span>
                      </div>
                    ) : quotationDoc ? (
                      <div
                        onClick={() => setSelectedDocForPreview(quotationDoc)}
                        style={{
                          background: selectedDocForPreview?.id === quotationDoc.id ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg2, #181b26)',
                          border: '1px solid var(--border, #2d3748)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          marginTop: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', wordBreak: 'break-word', lineHeight: '1.4' }} title={quotationDoc.file_name}>
                          {quotationDoc.file_name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                          {formatFileSize(quotationDoc.file_size)}
                          {quotationDoc.uploaded_at && ` · ${new Date(quotationDoc.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}
                        </div>
                      </div>
                    ) : (
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          border: '1px dashed var(--border2, #3b4256)',
                          borderRadius: '8px',
                          padding: '24px 12px',
                          marginTop: '8px',
                          cursor: readOnly ? 'not-allowed' : 'pointer',
                          color: 'var(--text3, #64748b)',
                          fontSize: '12px',
                          textAlign: 'center',
                          background: draggingCategory === 'quotation' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                          transition: 'all 0.15s'
                        }}
                      >
                        <UploadCloud size={22} style={{ color: 'var(--blue, #3b82f6)', opacity: 0.8 }} />
                        <span>Drag file here or <span style={{ color: 'var(--blue, #3b82f6)', fontWeight: '600' }}>browse files</span></span>
                        <input
                          ref={quotationInputRef}
                          type="file"
                          hidden
                          disabled={readOnly}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              uploadFiles('quotation', [e.target.files[0]]);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Actions for Quotation when uploaded */}
                  {quotationDoc && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', flexWrap: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedDocForPreview(quotationDoc)}
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: selectedDocForPreview?.id === quotationDoc.id ? 'var(--blue, #3b82f6)' : 'rgba(59, 130, 246, 0.14)',
                          color: selectedDocForPreview?.id === quotationDoc.id ? '#ffffff' : 'var(--blue, #3b82f6)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Eye size={13} />
                        <span>{selectedDocForPreview?.id === quotationDoc.id ? 'Previewing' : 'Preview'}</span>
                      </button>

                      <a
                        href={getDocumentUrl(quotationDoc.file_path)}
                        download={quotationDoc.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 8px',
                          color: 'var(--text2)',
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          textDecoration: 'none'
                        }}
                        title="Download"
                      >
                        <Download size={13} />
                      </a>

                      {!readOnly && (
                        <>
                          <label
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: '500',
                              color: 'var(--text2)',
                              background: 'var(--bg2)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                            title="Replace quotation"
                          >
                            Replace
                            <input
                              ref={replaceQuotationInputRef}
                              type="file"
                              hidden
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  uploadFiles('quotation', [e.target.files[0]], true, quotationDoc.id);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(quotationDoc.id, quotationDoc.file_name)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#ef4444',
                              borderRadius: '6px',
                              padding: '6px 8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="Delete quotation"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* ── CARD 2: Details ── */}
                <div
                  style={{
                    background: 'var(--bg3, #1e2230)',
                    border: `1px solid ${draggingCategory === 'details' ? 'var(--blue, #3b82f6)' : detailsDoc && selectedDocForPreview?.id === detailsDoc.id ? 'var(--blue, #3b82f6)' : 'var(--border, #2d3748)'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: isPreviewActive ? 'auto' : '200px',
                    transition: 'all 0.15s ease',
                    boxShadow: detailsDoc && selectedDocForPreview?.id === detailsDoc.id ? '0 0 0 1px var(--blue, #3b82f6)' : 'none'
                  }}
                  onDragOver={(e) => handleDragOver(e, 'details')}
                  onDragLeave={(e) => handleDragLeave(e, 'details')}
                  onDrop={(e) => handleDrop(e, 'details')}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileSpreadsheet size={15} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>
                            Details
                          </h4>
                          <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Indent / Specs / Technical details</div>
                        </div>
                      </div>
                      {detailsDoc && (
                        <span style={{ fontSize: '10px', color: '#10b981', fontWeight: '700', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 7px', borderRadius: '4px' }}>
                          ✓ Done
                        </span>
                      )}
                    </div>

                    {uploadingCategory === 'details' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', gap: '8px' }}>
                        <Loader2 size={18} className="animate-spin" style={{ color: 'var(--blue)' }} />
                        <span style={{ fontSize: '12px', color: 'var(--text2)' }}>Uploading details...</span>
                      </div>
                    ) : detailsDoc ? (
                      <div
                        onClick={() => setSelectedDocForPreview(detailsDoc)}
                        style={{
                          background: selectedDocForPreview?.id === detailsDoc.id ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg2, #181b26)',
                          border: '1px solid var(--border, #2d3748)',
                          borderRadius: '8px',
                          padding: '10px 12px',
                          marginTop: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)', wordBreak: 'break-word', lineHeight: '1.4' }} title={detailsDoc.file_name}>
                          {detailsDoc.file_name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                          <span>{formatFileSize(detailsDoc.file_size)}</span>
                          {detailsDoc.uploaded_at && ` · ${new Date(detailsDoc.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}
                        </div>
                      </div>
                    ) : (
                      <label
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          border: '1px dashed var(--border2, #3b4256)',
                          borderRadius: '8px',
                          padding: '24px 12px',
                          marginTop: '8px',
                          cursor: readOnly ? 'not-allowed' : 'pointer',
                          color: 'var(--text3, #64748b)',
                          fontSize: '12px',
                          textAlign: 'center',
                          background: draggingCategory === 'details' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                          transition: 'all 0.15s'
                        }}
                      >
                        <UploadCloud size={22} style={{ color: 'var(--blue, #3b82f6)', opacity: 0.8 }} />
                        <span>Drag file here or <span style={{ color: 'var(--blue, #3b82f6)', fontWeight: '600' }}>browse files</span></span>
                        <input
                          ref={detailsInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                          hidden
                          disabled={readOnly}
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              uploadFiles('details', [e.target.files[0]]);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Actions for Details when uploaded */}
                  {detailsDoc && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', flexWrap: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedDocForPreview(detailsDoc)}
                        style={{
                          flex: 1,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          padding: '6px 10px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: selectedDocForPreview?.id === detailsDoc.id ? 'var(--blue, #3b82f6)' : 'rgba(59, 130, 246, 0.14)',
                          color: selectedDocForPreview?.id === detailsDoc.id ? '#ffffff' : 'var(--blue, #3b82f6)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Eye size={13} />
                        <span>{selectedDocForPreview?.id === detailsDoc.id ? 'Previewing' : 'Preview'}</span>
                      </button>

                      <a
                        href={getDocumentUrl(detailsDoc.file_path)}
                        download={detailsDoc.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '6px 8px',
                          color: 'var(--text2)',
                          background: 'var(--bg2)',
                          border: '1px solid var(--border)',
                          borderRadius: '6px',
                          textDecoration: 'none'
                        }}
                        title="Download"
                      >
                        <Download size={13} />
                      </a>

                      {!readOnly && (
                        <>
                          <label
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: '500',
                              color: 'var(--text2)',
                              background: 'var(--bg2)',
                              border: '1px solid var(--border)',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap'
                            }}
                            title="Replace details file"
                          >
                            Replace
                            <input
                              ref={replaceDetailsInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                              hidden
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  uploadFiles('details', [e.target.files[0]], true, detailsDoc.id);
                                  e.target.value = '';
                                }
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => handleDeleteDoc(detailsDoc.id, detailsDoc.file_name)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              color: '#ef4444',
                              borderRadius: '6px',
                              padding: '6px 8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center'
                            }}
                            title="Delete details document"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* ── CARD 3: Approved Documents (Up to 20) ── */}
                <div
                  style={{
                    background: 'var(--bg3, #1e2230)',
                    border: `1px solid ${draggingCategory === 'approved' ? 'var(--blue, #3b82f6)' : 'var(--border, #2d3748)'}`,
                    borderRadius: '12px',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minHeight: isPreviewActive ? 'auto' : '200px'
                  }}
                  onDragOver={(e) => handleDragOver(e, 'approved')}
                  onDragLeave={(e) => handleDragLeave(e, 'approved')}
                  onDrop={(e) => handleDrop(e, 'approved')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Layers size={15} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text)' }}>
                          Approved Documents
                        </h4>
                        <div style={{ fontSize: '11px', color: 'var(--text3)' }}>Multiple approved specs / drawings</div>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        background: approvedDocs.length >= 20 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: approvedDocs.length >= 20 ? '#ef4444' : 'var(--blue, #3b82f6)'
                      }}
                    >
                      {approvedDocs.length} / 20
                    </span>
                  </div>

                  {/* Dropzone for Approved Documents */}
                  {approvedDocs.length < 20 && !readOnly && (
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                        border: '1px dashed var(--border2, #3b4256)',
                        borderRadius: '8px',
                        padding: '14px 10px',
                        cursor: 'pointer',
                        color: 'var(--text3, #64748b)',
                        fontSize: '12px',
                        textAlign: 'center',
                        background: draggingCategory === 'approved' ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                        transition: 'all 0.15s'
                      }}
                    >
                      <UploadCloud size={20} style={{ color: 'var(--blue, #3b82f6)', opacity: 0.8 }} />
                      <span>Drag files here or <span style={{ color: 'var(--blue, #3b82f6)', fontWeight: '600' }}>browse files</span></span>
                      <input
                        ref={approvedInputRef}
                        type="file"
                        multiple
                        hidden
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const remaining = Math.max(0, 20 - approvedDocs.length);
                            const selected = Array.from(e.target.files).slice(0, remaining);
                            uploadFiles('approved', selected);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  )}

                  {uploadingCategory === 'approved' && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '6px', color: 'var(--blue)', fontSize: '11px' }}>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Uploading approved files...</span>
                    </div>
                  )}

                  {/* Approved documents list */}
                  {approvedDocs.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        maxHeight: isPreviewActive ? '200px' : '150px',
                        overflowY: 'auto',
                        paddingRight: '2px'
                      }}
                    >
                      {approvedDocs.map((doc) => {
                        const isSelected = selectedDocForPreview?.id === doc.id;
                        const fileType = getFileType(doc.file_name);
                        return (
                          <div
                            key={doc.id}
                            onClick={() => setSelectedDocForPreview(doc)}
                            style={{
                              background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'var(--bg2, #181b26)',
                              border: `1px solid ${isSelected ? 'var(--blue, #3b82f6)' : 'var(--border, #2d3748)'}`,
                              borderRadius: '6px',
                              padding: '6px 10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', overflow: 'hidden', flex: 1 }}>
                              {fileType === 'image' ? (
                                <ImageIcon size={14} style={{ color: '#38bdf8', flexShrink: 0 }} />
                              ) : fileType === 'excel' ? (
                                <FileSpreadsheet size={14} style={{ color: '#10b981', flexShrink: 0 }} />
                              ) : (
                                <FileText size={14} style={{ color: 'var(--blue, #3b82f6)', flexShrink: 0 }} />
                              )}
                              <div style={{ overflow: 'hidden', minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: 'var(--text)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                  }}
                                  title={doc.file_name}
                                >
                                  {doc.file_name}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--text3)' }}>
                                  {formatFileSize(doc.file_size)}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDocForPreview(doc);
                                }}
                                style={{
                                  background: isSelected ? 'var(--blue, #3b82f6)' : 'transparent',
                                  border: '1px solid var(--border)',
                                  color: isSelected ? '#fff' : 'var(--text2)',
                                  borderRadius: '4px',
                                  padding: '3px 7px',
                                  fontSize: '11px',
                                  fontWeight: '500',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '3px'
                                }}
                                title="Preview document"
                              >
                                <Eye size={12} />
                                <span>{isSelected ? 'Viewing' : 'Preview'}</span>
                              </button>

                              <a
                                href={getDocumentUrl(doc.file_path)}
                                download={doc.file_name}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  color: 'var(--text2)',
                                  padding: '3px 5px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  border: '1px solid var(--border)',
                                  borderRadius: '4px',
                                  background: 'transparent'
                                }}
                                title="Download"
                              >
                                <Download size={12} />
                              </a>

                              {!readOnly && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDoc(doc.id, doc.file_name);
                                  }}
                                  style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--text3)',
                                    cursor: 'pointer',
                                    padding: '3px',
                                    display: 'inline-flex',
                                    alignItems: 'center'
                                  }}
                                  title="Delete file"
                                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text3)'}
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              LIVE PREVIEW PANE: Only rendered when user clicks Preview
             ═════════════════════════════════════════════════════════ */}
          {isPreviewActive && (
            <div
              className="ord-docs-right-pane"
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg, #0f172a)',
                minWidth: 0,
                position: 'relative'
              }}
            >
              {/* Preview Top Header */}
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid var(--border, #2d3748)',
                  background: 'var(--bg2, #181b26)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexShrink: 0
                }}
              >
                <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(59, 130, 246, 0.15)',
                      color: 'var(--blue, #3b82f6)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                      flexShrink: 0
                    }}
                  >
                    {getDocCategoryLabel(selectedDocForPreview.doc_type)}
                  </span>
                  <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.2'
                      }}
                      title={selectedDocForPreview.file_name}
                    >
                      {selectedDocForPreview.file_name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px', lineHeight: '1.2' }}>
                      {formatFileSize(selectedDocForPreview.file_size)}
                      {selectedDocForPreview.uploaded_at && ` · Uploaded ${new Date(selectedDocForPreview.uploaded_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`}
                    </div>
                  </div>
                </div>

                {/* Actions, Zoom Controls & Close Preview Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {activeDocType === 'image' && (
                    <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg3)', borderRadius: '6px', border: '1px solid var(--border)', padding: '2px' }}>
                      <button
                        type="button"
                        onClick={() => setImageZoom(z => Math.max(0.4, z - 0.2))}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center' }}
                        title="Zoom Out"
                      >
                        <ZoomOut size={14} />
                      </button>
                      <span style={{ fontSize: '11px', color: 'var(--text3)', padding: '0 4px', minWidth: '36px', textAlign: 'center' }}>
                        {Math.round(imageZoom * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={() => setImageZoom(z => Math.min(3, z + 0.2))}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center' }}
                        title="Zoom In"
                      >
                        <ZoomIn size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageZoom(1)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: '4px 6px', display: 'flex', alignItems: 'center' }}
                        title="Reset Zoom"
                      >
                        <RotateCcw size={12} />
                      </button>
                    </div>
                  )}

                  {activeDocType === 'excel' && (
                    <button
                      type="button"
                      onClick={() => setShowFullExcelModal(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        background: 'rgba(16, 185, 129, 0.12)',
                        color: '#10b981',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <ExternalLink size={13} />
                      <span>Full Spreadsheet</span>
                    </button>
                  )}

                  <a
                    href={activeDocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 11px',
                      fontSize: '12px',
                      fontWeight: '500',
                      background: 'var(--bg3)',
                      color: 'var(--text2)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      textDecoration: 'none'
                    }}
                    title="Open in new browser tab"
                  >
                    <ExternalLink size={13} />
                    <span>New Tab</span>
                  </a>

                  <a
                    href={activeDocUrl}
                    download={selectedDocForPreview.file_name}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 11px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'var(--blue, #3b82f6)',
                      color: '#ffffff',
                      borderRadius: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <Download size={13} />
                    <span>Download</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsFullscreenPreview(f => !f)}
                    style={{
                      background: 'var(--bg3)',
                      border: '1px solid var(--border)',
                      color: 'var(--text2)',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={isFullscreenPreview ? 'Exit Fullscreen' : 'Fullscreen'}
                  >
                    {isFullscreenPreview ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                  </button>

                  {/* Close Preview Button */}
                  <button
                    type="button"
                    onClick={() => setSelectedDocForPreview(null)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'rgba(239, 68, 68, 0.12)',
                      color: '#ef4444',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    title="Close Preview and return to cards"
                  >
                    <X size={14} />
                    <span>Close Preview</span>
                  </button>
                </div>
              </div>

              {/* Preview Main Viewport */}
              <div style={{ flex: 1, minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', position: 'relative' }}>
                
                {/* Case 1: PDF Viewer */}
                {activeDocType === 'pdf' && (
                  <iframe
                    src={activeDocUrl}
                    title={selectedDocForPreview.file_name}
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                      background: '#fff'
                    }}
                  />
                )}

                {/* Case 2: Image Viewer */}
                {activeDocType === 'image' && (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '24px',
                      overflow: 'auto',
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px',
                      backgroundColor: '#090d16'
                    }}
                  >
                    <img
                      src={activeDocUrl}
                      alt={selectedDocForPreview.file_name}
                      style={{
                        transform: `scale(${imageZoom})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.15s ease-out',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                )}

                {/* Case 3: Inline Excel Spreadsheet Viewer with Clean Formatted Dates & Times */}
                {activeDocType === 'excel' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    {excelData.loading ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Loader2 size={28} className="animate-spin" style={{ color: '#10b981' }} />
                        <span style={{ fontSize: '13px', color: 'var(--text2)' }}>Parsing Excel Spreadsheet...</span>
                      </div>
                    ) : excelData.error ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', padding: '24px', textAlign: 'center' }}>
                        <AlertCircle size={32} style={{ color: '#ef4444' }} />
                        <div style={{ fontSize: '14px', color: 'var(--text)' }}>Could not display spreadsheet directly.</div>
                        <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{excelData.error}</div>
                        <a
                          href={activeDocUrl}
                          download={selectedDocForPreview.file_name}
                          style={{
                            padding: '8px 16px',
                            background: '#10b981',
                            color: '#fff',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}
                        >
                          Download Spreadsheet to View
                        </a>
                      </div>
                    ) : (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                        {/* Spreadsheet toolbar */}
                        <div
                          style={{
                            padding: '8px 16px',
                            background: 'var(--bg2)',
                            borderBottom: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            flexWrap: 'wrap'
                          }}
                        >
                          {/* Sheet selector tabs */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', maxWidth: '60%' }}>
                            {excelData.sheets.map(sheet => (
                              <button
                                key={sheet}
                                type="button"
                                onClick={() => handleExcelSheetChange(sheet)}
                                style={{
                                  padding: '4px 10px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  borderRadius: '4px',
                                  border: '1px solid var(--border)',
                                  background: excelData.activeSheet === sheet ? '#10b981' : 'var(--bg3)',
                                  color: excelData.activeSheet === sheet ? '#ffffff' : 'var(--text2)',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {sheet}
                              </button>
                            ))}
                          </div>

                          {/* Search filter in sheet */}
                          <input
                            type="text"
                            value={excelSearch}
                            onChange={(e) => setExcelSearch(e.target.value)}
                            placeholder="Search within sheet..."
                            style={{
                              padding: '4px 10px',
                              fontSize: '12px',
                              background: 'var(--bg3)',
                              border: '1px solid var(--border)',
                              borderRadius: '4px',
                              color: 'var(--text)',
                              width: '180px'
                            }}
                          />
                        </div>

                        {/* Rendered Excel Grid */}
                        <div style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
                          {filteredExcelRows.length === 0 ? (
                            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text3)', fontSize: '13px' }}>
                              No matching rows found in this sheet.
                            </div>
                          ) : (
                            <table
                              style={{
                                borderCollapse: 'collapse',
                                width: '100%',
                                fontSize: '12px',
                                fontFamily: 'var(--font-mono, monospace)'
                              }}
                            >
                              <tbody>
                                {filteredExcelRows.map((row, rIdx) => {
                                  const isHeader = rIdx === 0;
                                  return (
                                    <tr
                                      key={rIdx}
                                      style={{
                                        background: isHeader ? 'var(--bg3)' : rIdx % 2 === 0 ? 'var(--bg)' : 'var(--bg2)',
                                        borderBottom: '1px solid var(--border)'
                                      }}
                                    >
                                      <td
                                        style={{
                                          padding: '4px 8px',
                                          borderRight: '1px solid var(--border)',
                                          color: 'var(--text3)',
                                          fontSize: '10px',
                                          userSelect: 'none',
                                          textAlign: 'center',
                                          width: '32px'
                                        }}
                                      >
                                        {rIdx + 1}
                                      </td>
                                      {(Array.isArray(row) ? row : []).map((cell, cIdx) => (
                                        <td
                                          key={cIdx}
                                          style={{
                                            padding: '6px 10px',
                                            borderRight: '1px solid var(--border)',
                                            fontWeight: isHeader ? '700' : '400',
                                            color: isHeader ? '#10b981' : 'var(--text)',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          {cell instanceof Date ? cell.toLocaleDateString() : String(cell ?? '')}
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Case 4: Other Document Types */}
                {activeDocType === 'other' || activeDocType === 'word' ? (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '16px',
                      padding: '32px',
                      textAlign: 'center'
                    }}
                  >
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '12px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: 'var(--blue, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FileText size={32} />
                    </div>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text)' }}>
                        {selectedDocForPreview.file_name}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text3)', marginTop: '4px' }}>
                        {formatFileSize(selectedDocForPreview.file_size)} · Direct in-browser preview is not supported for this file format.
                      </div>
                    </div>
                    <a
                      href={activeDocUrl}
                      download={selectedDocForPreview.file_name}
                      style={{
                        padding: '10px 24px',
                        background: 'var(--blue, #3b82f6)',
                        color: '#ffffff',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '13px',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <Download size={16} /> Download File
                    </a>
                  </div>
                ) : null}

              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid var(--border, #2d3748)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg, #0f172a)',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text3, #64748b)' }}>
            <CheckCircle2 size={14} style={{ color: '#10b981' }} />
            <span>Changes and document uploads are saved immediately in the ERP.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 24px',
              fontSize: '13px',
              fontWeight: '600',
              background: 'var(--blue, #3b82f6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              transition: 'opacity 0.15s, transform 0.1s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Done
          </button>
        </div>
      </div>

      {/* Full Screen Excel Viewer Modal if requested */}
      {showFullExcelModal && selectedDocForPreview && (
        <ExcelSheetViewer
          url={activeDocUrl}
          fileName={selectedDocForPreview.file_name}
          title={`Spreadsheet Viewer - ${selectedDocForPreview.file_name}`}
          onClose={() => setShowFullExcelModal(false)}
        />
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }
        .ord-docs-manage-pane::-webkit-scrollbar,
        .ord-docs-right-pane::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .ord-docs-manage-pane::-webkit-scrollbar-thumb,
        .ord-docs-right-pane::-webkit-scrollbar-thumb {
          background: var(--border, #2d3748);
          border-radius: 4px;
        }
      `}} />
    </div>,
    document.body
  );
}
