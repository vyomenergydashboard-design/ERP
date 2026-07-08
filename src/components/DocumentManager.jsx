import { useState, useEffect } from 'react';

const DOC_TYPES = [
  'General', 'PO', 'Quotation', 'BOM', 'Drawing', 'QC Report', 'Dispatch Document', 'Photo'
];

const PO_AUTHORIZED_ROLES = ['Sales', 'Accounts', 'Admin', 'Manager'];

export default function DocumentManager({ entityType, entityId, initialDocs = [], onUploadSuccess, onDocsUpdate, readOnly = false, defaultDocType = 'General', userRole = null }) {
  const canSeePO = !userRole || PO_AUTHORIZED_ROLES.includes(userRole);
  const availableDocTypes = canSeePO ? DOC_TYPES : DOC_TYPES.filter(t => t !== 'PO');
  const [docs, setDocs] = useState(initialDocs);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState(defaultDocType);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (defaultDocType) setSelectedType(defaultDocType);
  }, [defaultDocType]);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch(`${window.API_BASE}/api/documents/${entityType}/${entityId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDocs(data);
        }
      } catch (err) {
        console.error('Failed to fetch docs', err);
      }
    };
    if (entityId) fetchDocs();
  }, [entityType, entityId, token]);

  useEffect(() => {
    if (onDocsUpdate) onDocsUpdate(docs);
  }, [docs, onDocsUpdate]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (selectedType === 'PO' || selectedType === 'Quotation') {
      if (files.length > 1) {
        alert(`${selectedType} can only be a single file.`);
        e.target.value = '';
        return;
      }
      if (docs.some(d => d.doc_type === selectedType)) {
        alert(`A ${selectedType} already exists. Please delete it first.`);
        e.target.value = '';
        return;
      }
    }
    if (docs.length + files.length > 20) {
      alert('Maximum 20 files allowed per entity.');
      e.target.value = '';
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('entity_type', entityType);
    formData.append('entity_id', entityId);
    formData.append('doc_type', selectedType);
    files.forEach(file => formData.append('files', file));
    try {
      const res = await fetch(window.API_BASE + "/api/documents/upload", {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const newDocs = await res.json();
        setDocs([...docs, ...newDocs]);
        if (onUploadSuccess) onUploadSuccess(newDocs);
      } else {
        const err = await res.json();
        alert(err.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Network error during upload');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const newDocs = docs.filter(d => d.id !== docId);
        setDocs(newDocs);
        if (onUploadSuccess) onUploadSuccess(newDocs);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to delete document');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error during deletion');
    }
  };

  return (
    <div className="doc-manager">
      {/* Clickable header — toggles collapsed */}
      <div
        className="doc-header"
        onClick={() => setIsCollapsed(c => !c)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <span style={{
            display: 'inline-block',
            fontSize: '10px',
            transition: 'transform 0.2s',
            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
            color: 'var(--text3)',
          }}>▼</span>
          Documents ({docs.length}/20)
          {docs.length > 0 && isCollapsed && (
            <span style={{
              fontSize: '11px',
              fontWeight: '400',
              color: 'var(--text3)',
              background: 'var(--bg4)',
              padding: '1px 7px',
              borderRadius: '10px',
              marginLeft: '2px',
            }}>
              {docs.length} file{docs.length !== 1 ? 's' : ''}
            </span>
          )}
        </h4>
        {/* Upload controls — shown only when expanded; stop propagation */}
        {!readOnly && !isCollapsed && (
          <div className="doc-upload-controls" onClick={e => e.stopPropagation()}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="doc-type-select"
            >
              {availableDocTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <label className="upload-btn">
              {isUploading ? 'Uploading...' : 'Add Files'}
              <input
                type="file"
                multiple
                hidden
                onChange={handleFileChange}
                disabled={isUploading || docs.length >= 20}
              />
            </label>
          </div>
        )}
      </div>

      {/* Collapsible body */}
      {!isCollapsed && (
        <div className="doc-list">
          {docs.length === 0 ? (
            <div className="no-docs">No documents uploaded yet.</div>
          ) : (
            docs.map((doc) => (
              <div key={doc.id} className="doc-item">
                <div className="doc-info">
                  <span className="doc-type-badge">{doc.doc_type}</span>
                  <span className="doc-name" title={doc.file_name}>{doc.file_name}</span>
                </div>
                <div className="doc-meta">
                  <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                  <a
                    href={`${window.API_BASE}/uploads/${doc.file_path.split(/[\/\\]/).pop()}?token=${token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-link"
                  >
                    View
                  </a>
                  {!readOnly && (
                    <button
                      onClick={() => handleDeleteDoc(doc.id)}
                      style={{ background: 'transparent', border: 'none', color: 'var(--red)', cursor: 'pointer', marginLeft: '4px', fontSize: '14px', lineHeight: 1 }}
                      title="Delete document"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .doc-manager {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 12px 14px;
          margin-top: 14px;
        }
        .doc-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .doc-header h4 { color: var(--text); font-weight: 500; font-size: 13px; }
        .doc-header:hover h4 { color: var(--blue); }
        .doc-manager:has(.doc-list) .doc-header { margin-bottom: 10px; }
        .doc-upload-controls { display: flex; gap: 8px; }
        .doc-type-select {
          background: var(--bg4);
          border: 1px solid var(--border);
          color: var(--text2);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
        }
        .upload-btn {
          background: var(--blue);
          color: #fff;
          padding: 5px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          transition: opacity 0.2s;
          white-space: nowrap;
        }
        .upload-btn:hover { opacity: 0.85; }
        .doc-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 280px;
          overflow-y: auto;
          padding-right: 2px;
        }
        .doc-item {
          background: var(--bg4);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 8px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
        }
        .doc-item:hover { border-color: var(--border2); }
        .doc-info { display: flex; align-items: center; gap: 8px; overflow: hidden; flex: 1; min-width: 0; }
        .doc-type-badge {
          font-size: 9px;
          text-transform: uppercase;
          font-weight: 700;
          background: var(--blue-dim);
          color: var(--blue);
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
          letter-spacing: 0.4px;
        }
        .doc-name {
          font-size: 12px;
          color: var(--text2);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .doc-meta { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--text3); flex-shrink: 0; }
        .doc-link { color: var(--blue); text-decoration: none; font-weight: 500; }
        .doc-link:hover { text-decoration: underline; }
        .no-docs { text-align: center; color: var(--text3); font-size: 12px; padding: 16px 0; }
      `}} />
    </div>
  );
}
