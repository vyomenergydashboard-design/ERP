import React, { useState, useEffect, useRef } from 'react';
import ExcelSheetViewer from './ExcelSheetViewer';
import {
  X, ExternalLink, Download, ZoomIn, ZoomOut, RotateCcw,
  Maximize2, FileText, AlertCircle, Loader2, Compass
} from 'lucide-react';

/**
 * Detect file classification from file name or extension.
 */
const EXTENSION_TYPE_MAP = {
  // Images
  png: 'image', jpg: 'image', jpeg: 'image', gif: 'image', webp: 'image',
  svg: 'image', bmp: 'image', ico: 'image', tiff: 'image', avif: 'image',
  // PDF
  pdf: 'pdf',
  // Spreadsheets
  xlsx: 'excel', xls: 'excel', csv: 'excel', tsv: 'excel', ods: 'excel',
  // CAD / Technical drawings
  dwg: 'cad', dxf: 'cad', step: 'cad', stp: 'cad', iges: 'cad', igs: 'cad',
  sat: 'cad', sldprt: 'cad', sldasm: 'cad',
  // Documents & archives
  doc: 'word', docx: 'word', rtf: 'word',
  zip: 'archive', rar: 'archive', '7z': 'archive', tar: 'archive', gz: 'archive',
  txt: 'text', log: 'text', json: 'text', xml: 'text', md: 'text'
};

export function getDocumentType(fileName) {
  if (!fileName) return 'other';
  const cleanName = String(fileName).split('?')[0].split('#')[0];
  const ext = cleanName.split('.').pop().toLowerCase();
  return EXTENSION_TYPE_MAP[ext] || 'other';
}

const DOC_TYPE_THEMES = {
  image: {
    bg: 'rgba(59, 130, 246, 0.15)',
    color: '#3b82f6',
    tagColor: '#60a5fa',
    renderIcon: () => <span style={{ fontSize: '15px' }}>🖼️</span>
  },
  cad: {
    bg: 'rgba(245, 158, 11, 0.15)',
    color: '#f59e0b',
    tagColor: '#fbbf24',
    renderIcon: () => <Compass size={18} />
  },
  pdf: {
    bg: 'rgba(239, 68, 68, 0.15)',
    color: '#ef4444',
    tagColor: '#f87171',
    renderIcon: () => <FileText size={18} />
  },
  other: {
    bg: 'rgba(148, 163, 184, 0.15)',
    color: '#94a3b8',
    tagColor: '#cbd5e1',
    renderIcon: () => <FileText size={18} />
  }
};

/**
 * Format bytes to readable string (e.g. 1.2 MB).
 */
function formatSize(bytes) {
  if (!bytes || isNaN(bytes)) return '';
  const num = Number(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format date to readable DD/MM/YYYY.
 */
function formatDMY(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

/**
 * DocumentPreviewModal
 * Comprehensive, multi-format viewer for ERP documents:
 * - Images (.jpg, .jpeg, .png, .webp, .svg, etc.): High-res canvas with zoom controls, pan, reset
 * - Spreadsheets (.xlsx, .xls, .csv): Full SheetJS interactive table via ExcelSheetViewer
 * - PDFs (.pdf): Built-in browser PDF preview
 * - CAD (.dwg, .dxf, .step): Engineering file download card
 * - Other files: Clean preview fallback with direct download action
 */
export default function DocumentPreviewModal({ doc, url, getDocUrl, onClose, onDownload, extraActions }) {
  if (!doc) return null;

  const fileName = doc.file_name || doc.name || 'document';
  const fileExt = fileName.split('?')[0].split('#')[0].split('.').pop().toLowerCase();
  const docType = getDocumentType(fileName);

  // Resolve target download/preview URL
  let resolvedUrl = url;
  if (!resolvedUrl && getDocUrl) {
    resolvedUrl = getDocUrl(doc);
  } else if (!resolvedUrl) {
    resolvedUrl = typeof doc === 'string' ? doc : (doc.file_path || doc.filePath || doc.url || '');
  }

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // If it's an Excel spreadsheet or CSV, delegate to ExcelSheetViewer
  if (docType === 'excel') {
    return (
      <ExcelSheetViewer
        url={resolvedUrl}
        fileName={fileName}
        title={doc.title || `Spreadsheet Viewer - ${fileName}`}
        onClose={onClose}
        onDownload={onDownload}
      />
    );
  }

  const theme = DOC_TYPE_THEMES[docType] || DOC_TYPE_THEMES.other;

  return (
    <div
      className="modal-overlay open"
      style={{ zIndex: 1200 }}
      onClick={(e) => {
        if (e.target.className && typeof e.target.className === 'string' && e.target.className.includes('modal-overlay')) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        style={{
          maxWidth: '1050px',
          width: '94vw',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg2, #181b26)',
          borderRadius: '12px',
          border: '1px solid var(--border, #2d3748)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          className="modal-header"
          style={{
            padding: '12px 18px',
            borderBottom: '1px solid var(--border, #2d3748)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg3, #1e2230)',
            flexShrink: 0,
            gap: '12px'
          }}
        >
          {/* Doc Title & Metadata */}
          <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: theme.bg,
                color: theme.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {theme.renderIcon()}
            </div>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: 'var(--text, #f8fafc)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '480px'
                  }}
                  title={doc.title || fileName}
                >
                  {doc.title || fileName}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: theme.bg,
                    color: theme.tagColor,
                    border: '1px solid currentColor',
                    fontFamily: 'var(--font-mono, monospace)',
                    letterSpacing: '0.4px',
                    flexShrink: 0
                  }}
                >
                  .{fileExt.toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: 'var(--text3, #94a3b8)',
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {doc.subtitle ? `${doc.subtitle} · ` : ''}
                {fileName}
                {doc.revision_label ? ` · ${doc.revision_label}` : ''}
                {doc.uploaded_at || doc.created_at ? ` · ${formatDMY(doc.uploaded_at || doc.created_at)}` : ''}
                {doc.file_size ? ` · ${formatSize(doc.file_size)}` : ''}
                {doc.uploaded_by_name ? ` · by ${doc.uploaded_by_name}` : ''}
              </div>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {extraActions}
            {resolvedUrl && (
              <>
                <a
                  href={resolvedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="vbtn"
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    textDecoration: 'none',
                    background: 'var(--bg2, #181b26)',
                    border: '1px solid var(--border, #2d3748)',
                    color: 'var(--text2, #cbd5e1)',
                    borderRadius: '6px'
                  }}
                  title="Open file in a new browser tab"
                >
                  <ExternalLink size={13} />
                  <span>Open Tab</span>
                </a>
                <a
                  href={resolvedUrl}
                  download={fileName}
                  className="vbtn primary"
                  style={{
                    fontSize: '12px',
                    padding: '6px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    textDecoration: 'none',
                    background: 'var(--blue, #3b82f6)',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: 600
                  }}
                  title="Download file to computer"
                >
                  <Download size={13} />
                  <span>Download</span>
                </a>
              </>
            )}
            <button
              className="modal-close"
              onClick={onClose}
              style={{
                fontSize: '18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text3, #94a3b8)',
                padding: '4px 8px',
                borderRadius: '4px',
                lineHeight: 1
              }}
              title="Close viewer (Esc)"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body Based on File Type */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
          {docType === 'image' ? (
            <ImageViewerPane url={resolvedUrl} fileName={fileName} doc={doc} />
          ) : docType === 'pdf' ? (
            <div style={{ flex: 1, position: 'relative', background: '#525659' }}>
              <iframe
                src={resolvedUrl}
                title={fileName}
                style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
              />
            </div>
          ) : (
            <UnsupportedFallbackPane
              fileName={fileName}
              fileExt={fileExt}
              docType={docType}
              doc={doc}
              url={resolvedUrl}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ImageViewerPane
 * Responsive canvas with zoom controls, pan-drag support, and technical dot grid.
 */
function ImageViewerPane({ url, fileName, doc }) {
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [naturalSize, setNaturalSize] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const startDragRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const containerRef = useRef(null);

  // Reset zoom and pan when image URL changes
  useEffect(() => {
    setZoom(1);
    setPanPosition({ x: 0, y: 0 });
    setLoading(true);
    setError(false);
  }, [url]);

  const adjustZoom = (delta) => {
    setZoom((z) => Math.min(5, Math.max(0.2, Math.round((z + delta) * 100) / 100)));
  };

  const handleResetZoom = () => {
    setZoom(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleDoubleClick = () => {
    if (zoom === 1) {
      setZoom(1.75);
    } else {
      handleResetZoom();
    }
  };

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    startDragRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: panPosition.x,
      panY: panPosition.y
    };
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - startDragRef.current.x;
    const dy = e.clientY - startDragRef.current.y;
    setPanPosition({
      x: startDragRef.current.panX + dx,
      y: startDragRef.current.panY + dy
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Wheel zoom
  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      adjustZoom(e.deltaY < 0 ? 0.15 : -0.15);
    }
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: '#090d16' }}>
      {/* Zoom & Control Bar */}
      <div
        style={{
          padding: '8px 16px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--border, #2d3748)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'var(--bg3, #1e2230)',
              borderRadius: '6px',
              border: '1px solid var(--border, #2d3748)',
              padding: '2px'
            }}
          >
            <button
              type="button"
              onClick={() => adjustZoom(-0.25)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text2, #cbd5e1)',
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Zoom Out (-)"
            >
              <ZoomOut size={14} />
            </button>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text, #f8fafc)',
                padding: '0 6px',
                minWidth: '42px',
                textAlign: 'center',
                fontFamily: 'var(--font-mono, monospace)'
              }}
            >
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => adjustZoom(0.25)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text2, #cbd5e1)',
                cursor: 'pointer',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Zoom In (+)"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleResetZoom}
            style={{
              background: 'var(--bg3, #1e2230)',
              border: '1px solid var(--border, #2d3748)',
              color: 'var(--text2, #cbd5e1)',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Fit image to screen"
          >
            <Maximize2 size={12} />
            <span>Fit</span>
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            style={{
              background: 'var(--bg3, #1e2230)',
              border: '1px solid var(--border, #2d3748)',
              color: 'var(--text2, #cbd5e1)',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Reset zoom to 100%"
          >
            <RotateCcw size={12} />
            <span>100%</span>
          </button>
        </div>

        {/* Status / Hint */}
        <div style={{ fontSize: '11px', color: 'var(--text3, #94a3b8)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {naturalSize && (
            <span>
              {naturalSize.width} × {naturalSize.height} px
            </span>
          )}
          <span>Double-click to toggle zoom · Drag to pan</span>
        </div>
      </div>

      {/* Image Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          backgroundColor: '#090d16',
          cursor: zoom > 1 ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
          userSelect: 'none'
        }}
      >
        {loading && !error && (
          <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <Loader2 size={32} className="animate-spin" style={{ color: '#3b82f6' }} />
            <span style={{ fontSize: '13px', color: 'var(--text3, #94a3b8)' }}>Loading image...</span>
          </div>
        )}

        {error ? (
          <div style={{ padding: '32px', textAlign: 'center', maxWidth: '400px' }}>
            <AlertCircle size={40} style={{ color: '#ef4444', margin: '0 auto 12px' }} />
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text, #f8fafc)' }}>
              Could not load image
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text3, #94a3b8)', marginTop: '6px' }}>
              The image could not be loaded or rendered directly.
            </div>
            {url && (
              <a
                href={url}
                download={fileName}
                className="vbtn primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '16px',
                  padding: '8px 18px',
                  fontSize: '12px',
                  textDecoration: 'none'
                }}
              >
                <Download size={14} /> Download Image
              </a>
            )}
          </div>
        ) : (
          <img
            src={url}
            alt={fileName}
            onLoad={(e) => {
              setLoading(false);
              setNaturalSize({
                width: e.currentTarget.naturalWidth,
                height: e.currentTarget.naturalHeight
              });
            }}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
            style={{
              maxWidth: zoom <= 1 ? '92%' : 'none',
              maxHeight: zoom <= 1 ? '92%' : 'none',
              objectFit: 'contain',
              transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoom})`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.15s ease-out',
              boxShadow: '0 12px 40px rgba(0,0,0,0.7)',
              borderRadius: '4px',
              pointerEvents: 'none'
            }}
          />
        )}
      </div>
    </div>
  );
}

/**
 * UnsupportedFallbackPane
 * Clean, technical card for CAD, archive, or non-previewable formats.
 */
function UnsupportedFallbackPane({ fileName, fileExt, docType, doc, url }) {
  const isCad = docType === 'cad';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
        background: 'radial-gradient(circle at center, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)'
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '16px',
          background: isCad ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)',
          color: isCad ? '#f59e0b' : '#3b82f6',
          border: isCad ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid rgba(59, 130, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          boxShadow: isCad ? '0 8px 24px rgba(245, 158, 11, 0.2)' : '0 8px 24px rgba(59, 130, 246, 0.2)'
        }}
      >
        {isCad ? <Compass size={36} /> : <FileText size={36} />}
      </div>

      <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text, #f8fafc)', marginBottom: '8px' }}>
        {fileName}
      </div>

      <div
        style={{
          fontSize: '13px',
          color: 'var(--text3, #94a3b8)',
          maxWidth: '460px',
          lineHeight: '1.5',
          marginBottom: '24px'
        }}
      >
        {isCad ? (
          <>
            Direct in-browser preview is not supported for 2D/3D CAD drawings (<strong>.{fileExt.toUpperCase()}</strong>).
            Please download the file to inspect in AutoCAD, DWG TrueView, SolidWorks, or your engineering viewer.
          </>
        ) : (
          <>
            Direct in-browser preview is not supported for <strong>.{fileExt.toUpperCase()}</strong> files.
            Please download the file to open it in your local desktop application.
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {url && (
          <a
            href={url}
            download={fileName}
            style={{
              padding: '10px 24px',
              background: isCad ? '#f59e0b' : 'var(--blue, #3b82f6)',
              color: '#ffffff',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: isCad ? '0 4px 14px rgba(245, 158, 11, 0.35)' : '0 4px 14px rgba(59, 130, 246, 0.35)'
            }}
          >
            <Download size={16} /> Download File
          </a>
        )}
        {url && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '10px 18px',
              background: 'var(--bg3, #1e2230)',
              color: 'var(--text, #f8fafc)',
              border: '1px solid var(--border, #2d3748)',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={15} /> Open in Tab
          </a>
        )}
      </div>
    </div>
  );
}
