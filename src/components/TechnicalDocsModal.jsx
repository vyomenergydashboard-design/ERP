import { useState, useEffect, useRef, useMemo } from 'react';
import DocumentPreviewModal from './DocumentPreviewModal';
import {
  FileText, UploadCloud, Trash2, ExternalLink, AlertCircle, Plus, FileCheck, Loader2,
  Eye, History, Download, Upload, CheckSquare, Square, Paperclip, Info, ChevronUp, ChevronDown, Check, X
} from 'lucide-react';

export default function TechnicalDocsModal({
  selectedPart,
  onClose,
  canManageDocs,
  userRole,
  token,
  getDocUrl,
  onUpdatePartMasters,
  onUpdateSelectedPart,
  onDocumentChange
}) {
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [uploadDocType, setUploadDocType] = useState('Drawing');
  const [pdfViewerDoc, setPdfViewerDoc] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [showDrawingHistory, setShowDrawingHistory] = useState(false);
  const [showBomHistory, setShowBomHistory] = useState(false);
  const [showCustomDrawingHistory, setShowCustomDrawingHistory] = useState(false);
  const [showCustomBomHistory, setShowCustomBomHistory] = useState(false);
  const [showOtherDocs, setShowOtherDocs] = useState(true);
  const modalBodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const nonStandardFileInputRef = useRef(null);
  const [targetUploadDocType, setTargetUploadDocType] = useState('Drawing');

  useEffect(() => {
    if (modalBodyRef.current) {
      modalBodyRef.current.scrollTop = 0;
    }
  }, [selectedPart]);

  const handleTriggerNonStandardUpload = (docType) => {
    setTargetUploadDocType(docType);
    setUploadError('');
    setUploadSuccess('');
    if (nonStandardFileInputRef.current) {
      nonStandardFileInputRef.current.value = '';
      nonStandardFileInputRef.current.click();
    }
  };

  const handleDirectNonStandardFileSelect = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      await executeNonStandardUpload(targetUploadDocType, files);
    }
  };

  const executeNonStandardUpload = async (docType, files) => {
    if (!files || files.length === 0) return;
    if (!selectedPart.orderId && !selectedPart.unitId) {
      setUploadError('No Order or Unit ID found to attach this document to.');
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
      formData.append('doc_type', docType);
      files.forEach(f => formData.append('files', f));

      const upRes = await fetch(`${window.API_BASE}/api/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!upRes.ok) {
        const errData = await upRes.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to upload ${docType}`);
      }

      const savedDocs = await upRes.json();
      onUpdateSelectedPart(prev => ({
        ...prev,
        orderDocs: [...(prev.orderDocs || []), ...(Array.isArray(savedDocs) ? savedDocs : [savedDocs])]
      }));
      setUploadSuccess(`${docType === 'BOM' ? 'BOM' : 'Drawing'} revision uploaded successfully.`);
      if (onDocumentChange) onDocumentChange();
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const effectiveRole = (userRole || (typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || '{}').role) || '').trim().toUpperCase();
  const isDesignOrAdmin = ['ADMIN', 'DESIGN'].includes(effectiveRole);

  const isStandard = (selectedPart.classification || '').trim().toLowerCase() === 'standard';
  const canManageThisPanelDocs = isStandard ? canManageDocs : isDesignOrAdmin;
  const canViewRevisionHistory = true;

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

  // For Non-Standard units: Documents are unit/order-specific and never inherited into part masters
  const customDrawings = useMemo(() => {
    return [...(orderDocs || [])]
      .filter(d => (d.doc_type || '').toLowerCase() === 'drawing')
      .sort((a, b) => {
        const da = new Date(a.uploaded_at || a.created_at || 0).getTime();
        const db = new Date(b.uploaded_at || b.created_at || 0).getTime();
        if (da !== db) return da - db;
        return (a.id || 0) - (b.id || 0);
      })
      .map((d, idx) => ({
        ...d,
        revision_number: idx,
        revision_label: `R${idx}`
      }));
  }, [orderDocs]);

  const customBoms = useMemo(() => {
    return [...(orderDocs || [])]
      .filter(d => {
        const dt = (d.doc_type || '').toLowerCase();
        return dt === 'bom' || dt === 'bill of materials';
      })
      .sort((a, b) => {
        const da = new Date(a.uploaded_at || a.created_at || 0).getTime();
        const db = new Date(b.uploaded_at || b.created_at || 0).getTime();
        if (da !== db) return da - db;
        return (a.id || 0) - (b.id || 0);
      })
      .map((d, idx) => ({
        ...d,
        revision_number: idx,
        revision_label: `R${idx}`
      }));
  }, [orderDocs]);

  const customSpecs = useMemo(() => {
    return (orderDocs || []).filter(d => {
      const dt = (d.doc_type || '').toLowerCase();
      return dt === 'technical specification' || dt === 'spec' || dt === 'specification' || dt === 'datasheet';
    });
  }, [orderDocs]);

  const otherOrderDocs = useMemo(() => {
    return (orderDocs || []).filter(d => {
      const dt = (d.doc_type || '').toLowerCase();
      return dt !== 'drawing' && dt !== 'bom' && dt !== 'bill of materials' &&
             dt !== 'technical specification' && dt !== 'spec' && dt !== 'specification' && dt !== 'datasheet';
    });
  }, [orderDocs]);

  const latestCustomDrawing = customDrawings.length > 0 ? customDrawings[customDrawings.length - 1] : null;
  const latestCustomBom = customBoms.length > 0 ? customBoms[customBoms.length - 1] : null;

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
      const files = Array.from(e.target.files);
      setFilesToUpload(files);
      setUploadError('');
      setUploadSuccess('');
      if (!isStandard && files.length > 0) {
        const first = files[0].name.toLowerCase();
        if (first.endsWith('.xlsx') || first.endsWith('.xls') || first.endsWith('.csv')) {
          setUploadDocType('BOM');
        } else if (first.endsWith('.dwg') || first.endsWith('.dxf') || first.endsWith('.step') || first.endsWith('.stp') || first.endsWith('.cad')) {
          setUploadDocType('Drawing');
        }
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      setFilesToUpload(files);
      setUploadError('');
      setUploadSuccess('');
      if (!isStandard && files.length > 0) {
        const first = files[0].name.toLowerCase();
        if (first.endsWith('.xlsx') || first.endsWith('.xls') || first.endsWith('.csv')) {
          setUploadDocType('BOM');
        } else if (first.endsWith('.dwg') || first.endsWith('.dxf') || first.endsWith('.step') || first.endsWith('.stp') || first.endsWith('.cad')) {
          setUploadDocType('Drawing');
        }
      }
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
      if (onDocumentChange) onDocumentChange();
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadNonStandard = async (targetType) => {
    const docTypeToUpload = targetType || uploadDocType || 'Drawing';
    if (filesToUpload.length === 0) {
      setUploadError(`Please select at least one file to upload for ${docTypeToUpload}.`);
      return;
    }
    if (!selectedPart.orderId && !selectedPart.unitId) {
      setUploadError('No Order or Unit ID found to attach this document to.');
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
      formData.append('doc_type', docTypeToUpload);
      filesToUpload.forEach(f => formData.append('files', f));

      const upRes = await fetch(`${window.API_BASE}/api/documents/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      if (!upRes.ok) {
        const errData = await upRes.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to upload ${docTypeToUpload}`);
      }

      const savedDocs = await upRes.json();
      onUpdateSelectedPart(prev => ({
        ...prev,
        orderDocs: [...(prev.orderDocs || []), ...(Array.isArray(savedDocs) ? savedDocs : [savedDocs])]
      }));
      setFilesToUpload([]);
      const typeDisplay = docTypeToUpload === 'BOM' ? 'Bill of Materials (BOM)' : docTypeToUpload === 'Drawing' ? 'Technical Drawing' : 'Specification';
      setUploadSuccess(`Custom ${typeDisplay} uploaded successfully! (Saved to this unit/order — not added to master catalog)`);
      if (onDocumentChange) onDocumentChange();
    } catch (err) {
      console.error(err);
      setUploadError(err.message || 'Failed to upload document');
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
        if (onDocumentChange) onDocumentChange();
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
        if (onDocumentChange) onDocumentChange();
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
          {uploadDocType === 'BOM'
            ? 'Excel (.xlsx, .xls, .csv) or PDF documents (Up to 10 files)'
            : uploadDocType === 'Drawing'
              ? (isStandard ? 'PDF documents only (Up to 10 files)' : 'Supports PDF, DWG, DXF, PNG, JPG, CAD, STEP, ZIP (Up to 10 files)')
              : 'Supports all technical document types (Up to 10 files)'}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={uploadDocType === 'BOM'
            ? '.pdf,application/pdf,.xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv'
            : (uploadDocType === 'Drawing' && isStandard ? '.pdf,application/pdf' : undefined)}
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
                background: uploadDocType === 'BOM' ? '#10b981' : uploadDocType === 'Technical Specification' ? '#a855f7' : '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
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
        <div ref={modalBodyRef} className="modal-body" style={{ padding: '20px', maxHeight: '72vh', overflowY: 'auto' }}>

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
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
                  ? 'Master catalog drawings & BOM apply to this unit.'
                  : 'Custom specification panel unit.'}
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
          {/* ══════════════════════════════════════════════════════════
              CONDITION 2: NON-STANDARD CLASSIFICATION
              Non-Standard units have BOTH Custom Drawing and Custom BOM.
              Neither is inherited in the Master Part Catalog.
             ══════════════════════════════════════════════════════════ */}
          {!isStandard && (
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Technical Documents (Drawing & BOM)
                  </div>
                </div>
              </div>

              {/* Hidden file input for direct card uploads */}
              <input
                ref={nonStandardFileInputRef}
                type="file"
                style={{ display: 'none' }}
                accept={targetUploadDocType === 'BOM'
                  ? '.pdf,.xlsx,.xls,.csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv'
                  : '.pdf,.png,.jpg,.jpeg,.dwg,.dxf,.step,.stp,.zip,application/pdf,image/*'}
                onChange={handleDirectNonStandardFileSelect}
              />

              {/* Status and feedback messages */}
              {isUploading && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '6px',
                  color: '#60a5fa',
                  fontSize: '12px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Uploading {targetUploadDocType === 'BOM' ? 'Bill of Materials (BOM)' : 'Technical Drawing'}...</span>
                </div>
              )}

              {uploadSuccess && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '6px',
                  color: '#34d399',
                  fontSize: '12px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Check size={14} />
                  <span>{uploadSuccess}</span>
                </div>
              )}

              {uploadError && (
                <div style={{
                  padding: '8px 12px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '6px',
                  color: '#f87171',
                  fontSize: '12px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <AlertCircle size={14} />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Grid with 2 distinct cards: Custom Drawing and Custom BOM */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px', marginBottom: '16px' }}>

                {/* ── CARD 1: CUSTOM TECHNICAL DRAWING ── */}
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

                    {latestCustomDrawing ? (
                      <span style={{
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: '#60a5fa',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {latestCustomDrawing.revision_label || `R${latestCustomDrawing.revision_number ?? 0}`} · Latest
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

                  {latestCustomDrawing ? (
                    <>
                      <div style={{ minWidth: 0 }}>
                        <div
                          title={latestCustomDrawing.file_name}
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
                          {latestCustomDrawing.file_name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
                          Uploaded {formatDateDMY(latestCustomDrawing.created_at || latestCustomDrawing.uploaded_at)}
                          {latestCustomDrawing.file_size ? ` · ${formatFileSize(latestCustomDrawing.file_size)}` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: 'auto', paddingTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="vbtn"
                            onClick={() => setPdfViewerDoc({
                              ...latestCustomDrawing,
                              title: `Custom Drawing (${latestCustomDrawing.revision_label || 'R0'}) - ${selectedPart.unitSerial || selectedPart.partNumber}`
                            })}
                            style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>
                          <a
                            href={getDocUrl(latestCustomDrawing)}
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
                          {canManageThisPanelDocs && (
                            <>
                              <button
                                type="button"
                                className="vbtn"
                                onClick={() => handleTriggerNonStandardUpload('Drawing')}
                                title="Upload new revision of Drawing"
                                style={{ fontSize: '11px', padding: '5px 8px' }}
                                disabled={isUploading}
                              >
                                + New Rev
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOrderDoc(latestCustomDrawing.id)}
                                title="Delete this custom drawing"
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

                      {/* Earlier custom drawings list */}
                      {customDrawings.length > 1 && (
                        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={() => setShowCustomDrawingHistory(!showCustomDrawingHistory)}
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
                            <span>{showCustomDrawingHistory ? 'Hide Earlier Revisions' : `View Earlier Revisions (${customDrawings.length - 1})`}</span>
                          </button>

                          {showCustomDrawingHistory && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                              {customDrawings.slice(0, -1).reverse().map((doc) => (
                                <div
                                  key={`custom-draw-hist-${doc.id}`}
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
                                      {doc.revision_label}
                                    </span>
                                    <span style={{ color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.file_name}>
                                      {doc.file_name}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                    <span style={{ color: 'var(--text3)', fontSize: '10px' }}>{formatDateDMY(doc.created_at || doc.uploaded_at)}</span>
                                    <button
                                      type="button"
                                      onClick={() => setPdfViewerDoc({
                                        ...doc,
                                        title: `Custom Drawing (${doc.revision_label}) - ${selectedPart.unitSerial || selectedPart.partNumber}`
                                      })}
                                      style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                      title="Preview revision"
                                    >
                                      <Eye size={12} />
                                    </button>
                                    <a
                                      href={getDocUrl(doc)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: '#60a5fa', display: 'flex', alignItems: 'center' }}
                                      title="Download revision"
                                    >
                                      <Download size={12} />
                                    </a>
                                    {canManageThisPanelDocs && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteOrderDoc(doc.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                                        title="Delete revision"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    )}
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
                        No custom drawing uploaded for this unit.
                      </div>
                      {canManageThisPanelDocs && (
                        <button
                          type="button"
                          className="vbtn primary"
                          onClick={() => handleTriggerNonStandardUpload('Drawing')}
                          style={{ fontSize: '11px', padding: '5px 12px' }}
                          disabled={isUploading}
                        >
                          + Upload Drawing (R0)
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* ── CARD 2: CUSTOM BILL OF MATERIALS (BOM) ── */}
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
                        background: 'rgba(168, 85, 247, 0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Layers size={15} style={{ color: '#a855f7' }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>
                        Bill of Materials (BOM)
                      </span>
                    </div>

                    {latestCustomBom ? (
                      <span style={{
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#34d399',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {latestCustomBom.revision_label || `R${latestCustomBom.revision_number ?? 0}`} · Latest
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

                  {latestCustomBom ? (
                    <>
                      <div style={{ minWidth: 0 }}>
                        <div
                          title={latestCustomBom.file_name}
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
                          {latestCustomBom.file_name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
                          Uploaded {formatDateDMY(latestCustomBom.created_at || latestCustomBom.uploaded_at)}
                          {latestCustomBom.file_size ? ` · ${formatFileSize(latestCustomBom.file_size)}` : ''}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: 'auto', paddingTop: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="vbtn"
                            onClick={() => setPdfViewerDoc({
                              ...latestCustomBom,
                              title: `Custom BOM (${latestCustomBom.revision_label || 'R0'}) - ${selectedPart.unitSerial || selectedPart.partNumber}`
                            })}
                            style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            <Eye size={12} />
                            <span>Preview</span>
                          </button>
                          <a
                            href={getDocUrl(latestCustomBom)}
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
                          {canManageThisPanelDocs && (
                            <>
                              <button
                                type="button"
                                className="vbtn"
                                onClick={() => handleTriggerNonStandardUpload('BOM')}
                                title="Upload new revision of BOM"
                                style={{ fontSize: '11px', padding: '5px 8px' }}
                                disabled={isUploading}
                              >
                                + New Rev
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOrderDoc(latestCustomBom.id)}
                                title="Delete this custom BOM"
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

                      {/* Earlier custom BOMs list */}
                      {customBoms.length > 1 && (
                        <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '8px', marginTop: '4px' }}>
                          <button
                            type="button"
                            onClick={() => setShowCustomBomHistory(!showCustomBomHistory)}
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
                            <span>{showCustomBomHistory ? 'Hide Earlier Revisions' : `View Earlier Revisions (${customBoms.length - 1})`}</span>
                          </button>

                          {showCustomBomHistory && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                              {customBoms.slice(0, -1).reverse().map((doc) => (
                                <div
                                  key={`custom-bom-hist-${doc.id}`}
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
                                    <span style={{ fontWeight: 700, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                                      {doc.revision_label}
                                    </span>
                                    <span style={{ color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={doc.file_name}>
                                      {doc.file_name}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                                    <span style={{ color: 'var(--text3)', fontSize: '10px' }}>{formatDateDMY(doc.created_at || doc.uploaded_at)}</span>
                                    <button
                                      type="button"
                                      onClick={() => setPdfViewerDoc({
                                        ...doc,
                                        title: `Custom BOM (${doc.revision_label}) - ${selectedPart.unitSerial || selectedPart.partNumber}`
                                      })}
                                      style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                      title="Preview BOM revision"
                                    >
                                      <Eye size={12} />
                                    </button>
                                    <a
                                      href={getDocUrl(doc)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: '#10b981', display: 'flex', alignItems: 'center' }}
                                      title="Download revision"
                                    >
                                      <Download size={12} />
                                    </a>
                                    {canManageThisPanelDocs && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteOrderDoc(doc.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                                        title="Delete revision"
                                      >
                                        <Trash2 size={11} />
                                      </button>
                                    )}
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
                        No custom BOM uploaded for this unit.
                      </div>
                      {canManageThisPanelDocs && (
                        <button
                          type="button"
                          className="vbtn primary"
                          onClick={() => handleTriggerNonStandardUpload('BOM')}
                          style={{ fontSize: '11px', padding: '5px 12px', background: '#10b981' }}
                          disabled={isUploading}
                        >
                          + Upload BOM (R0)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Other Custom Technical Specifications List (if any) */}
              {customSpecs.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                    Other Custom Specifications & Documents ({customSpecs.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {customSpecs.map((doc) => {
                      const docUrl = getDocUrl(doc);
                      return (
                        <div
                          key={`custom-spec-${doc.id}`}
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
                                {doc.doc_type || 'Custom Specification'} · Uploaded {formatDateDMY(doc.created_at || doc.uploaded_at)}
                                {doc.file_size ? ` · ${formatFileSize(doc.file_size)}` : ''}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <button
                              type="button"
                              className="vbtn"
                              onClick={() => setPdfViewerDoc({
                                ...doc,
                                title: `Custom Specification - ${selectedPart.unitSerial || selectedPart.partNumber}`
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
                                background: '#a855f7',
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
                              <span>Download</span>
                              <ExternalLink size={13} />
                            </a>
                            {canManageThisPanelDocs && (
                              <button
                                type="button"
                                onClick={() => handleDeleteOrderDoc(doc.id)}
                                title="Delete document"
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
                </div>
              )}
            </div>
          )}

          {/* Section: Other Order Documents (PO, Quotation, General) */}
          {otherOrderDocs.length > 0 && (
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <div
                onClick={() => setShowOtherDocs(!showOtherDocs)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  marginBottom: showOtherDocs ? '12px' : 0
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Other Order Documents ({otherOrderDocs.length})</span>
                  <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 400, textTransform: 'none' }}>
                    (PO, Details, Quotations)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--text3)' }}>
                  <span>{showOtherDocs ? 'Hide' : 'Show'}</span>
                  {showOtherDocs ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </div>

              {showOtherDocs && (
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
                          borderRadius: '8px',
                          padding: '10px 14px',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '6px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <FileText size={16} style={{ color: '#3b82f6' }} />
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div
                              title={doc.file_name}
                              style={{
                                fontWeight: 600,
                                color: 'var(--text)',
                                fontSize: '12px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {doc.file_name}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                              <span style={{
                                display: 'inline-block',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                fontWeight: 600,
                                background: 'var(--bg2)',
                                border: '1px solid var(--border)',
                                color: 'var(--text2)'
                              }}>
                                {doc.doc_type || 'General'}
                              </span>
                              <span>Uploaded {formatDateDMY(doc.created_at || doc.uploaded_at)}</span>
                              {doc.file_size ? <span>· {formatFileSize(doc.file_size)}</span> : null}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                          <button
                            type="button"
                            className="vbtn"
                            onClick={() => setPdfViewerDoc({
                              ...doc,
                              title: `${doc.file_name} - ${selectedPart.unitSerial || selectedPart.partNumber || ''}`
                            })}
                            style={{ fontSize: '11px', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
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
                              fontSize: '11px',
                              padding: '5px 12px',
                              textDecoration: 'none',
                              color: 'var(--text)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <span>Download</span>
                            <ExternalLink size={12} />
                          </a>
                          {canManageDocs && (
                            <button
                              type="button"
                              onClick={() => handleDeleteOrderDoc(doc.id)}
                              title="Delete document"
                              style={{
                                background: 'transparent',
                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                color: '#ef4444',
                                borderRadius: '6px',
                                padding: '5px 8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                              }}
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
          )}

        </div>

        {/* Modal Footer */}
        <div className="modal-actions" style={{ borderTop: '1px solid var(--border)', padding: '14px 20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="vbtn" onClick={onClose} style={{ padding: '7px 20px', fontSize: '13px' }}>
            Close
          </button>
        </div>
      </div>

      {/* In-App Multi-Format Document Viewer (Images, Excel, PDF, CAD) */}
      {pdfViewerDoc && (
        <DocumentPreviewModal
          doc={pdfViewerDoc}
          getDocUrl={getDocUrl}
          onClose={() => setPdfViewerDoc(null)}
        />
      )}
    </div>
  );
}