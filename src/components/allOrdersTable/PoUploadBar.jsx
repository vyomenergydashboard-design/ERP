import { memo, useEffect, useRef, useState } from 'react';
import { Loader2, UploadCloud, X } from 'lucide-react';
import PoUploadModal from './PoUploadModal.jsx';

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
            title="Deselect all (or double-press Esc)"
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

export default PoUploadBar;
