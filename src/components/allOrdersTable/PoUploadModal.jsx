import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Loader2, Trash2, UploadCloud, X } from 'lucide-react';

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

export default PoUploadModal;
