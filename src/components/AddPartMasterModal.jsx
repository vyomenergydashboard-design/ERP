import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import { UploadCloud, FileText, Check, AlertCircle, X } from 'lucide-react';
import PanelSizeSearchSelect from './PanelSizeSearchSelect.jsx';

export default function AddPartMasterModal({
  isOpen,
  onClose,
  initialPartNumber = '',
  initialClientName = '',
  initialProject = '',
  panelSizeMasters = [],
  onPartCreated
}) {
  const [formData, setFormData] = useState({
    part_number: '',
    description: '',
    client_name: '',
    project: '',
    category: 'Standard',
    panel_code: ''
  });
  const [fetchedPanelSizes, setFetchedPanelSizes] = useState([]);
  const [drawingFile, setDrawingFile] = useState(null);
  const [bomFile, setBomFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch panel sizes if not supplied via props
  useEffect(() => {
    if (isOpen && (!panelSizeMasters || panelSizeMasters.length === 0)) {
      const token = localStorage.getItem('token');
      fetch(`${window.API_BASE}/api/panel-size-masters`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setFetchedPanelSizes(Array.isArray(data) ? data : []))
        .catch(err => console.error('Failed to load panel sizes in modal:', err));
    }
  }, [isOpen, panelSizeMasters]);

  const availablePanelSizes = (panelSizeMasters && panelSizeMasters.length > 0) ? panelSizeMasters : fetchedPanelSizes;

  // Pre-fill initial values when modal opens or initialPartNumber changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        part_number: initialPartNumber || '',
        description: '',
        client_name: initialClientName || '',
        project: initialProject || '',
        category: 'Standard',
        panel_code: ''
      });
      setDrawingFile(null);
      setBomFile(null);
      setErrorMessage('');
    }
  }, [isOpen, initialPartNumber, initialClientName, initialProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.part_number.trim()) {
      setErrorMessage('Part Number is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    const token = localStorage.getItem('token');

    try {
      // 1. Create Part Number Master
      const res = await fetch(`${window.API_BASE}/api/part-number-masters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create Part Number Master');
      }

      const createdPart = data;
      createdPart.documents = createdPart.documents || [];

      // 2. Upload initial Drawing PDF if provided
      if (drawingFile) {
        const drawBody = new FormData();
        drawBody.append('file', drawingFile);
        drawBody.append('doc_type', 'Drawing');
        try {
          const drawRes = await fetch(`${window.API_BASE}/api/part-number-masters/${createdPart.id}/documents`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: drawBody
          });
          if (drawRes.ok) {
            const savedDraw = await drawRes.json();
            createdPart.documents.push(savedDraw);
            createdPart.drawing = savedDraw;
          }
        } catch (dErr) {
          console.warn('Drawing upload warning:', dErr);
        }
      }

      // 3. Upload initial BOM PDF if provided
      if (bomFile) {
        const bomBody = new FormData();
        bomBody.append('file', bomFile);
        bomBody.append('doc_type', 'BOM');
        try {
          const bomRes = await fetch(`${window.API_BASE}/api/part-number-masters/${createdPart.id}/documents`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: bomBody
          });
          if (bomRes.ok) {
            const savedBom = await bomRes.json();
            createdPart.documents.push(savedBom);
            createdPart.bom = savedBom;
          }
        } catch (bErr) {
          console.warn('BOM upload warning:', bErr);
        }
      }

      // 4. Notify parent with the new part and close
      onPartCreated?.(createdPart);
      onClose?.();
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to create part number.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Part Number Master"
      subtitle="Register a new part number. It will be saved to masters and auto-selected for this order."
      maxWidth="620px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {errorMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#f87171',
            borderRadius: '6px',
            padding: '10px 12px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Part Number (Required) */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>
              Part Number *
            </label>
            <input
              type="text"
              className="form-input"
              required
              autoFocus
              placeholder="e.g. VFD-22K-STD, MCC-400A-8W"
              value={formData.part_number}
              onChange={(e) => setFormData({ ...formData, part_number: e.target.value })}
              style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}
            />
          </div>

          {/* Description */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>
              Material / Part Description
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. VFD Control Panel 22kW, Motor Control Centre"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>
              Category
            </label>
            <select
              className="form-select"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Standard">Standard</option>
              <option value="Non-Standard">Non-Standard</option>
            </select>
          </div>

          {/* Client Name */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>
              Client (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Acme Corp"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            />
          </div>

          {/* Project Name */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>
              Project Name (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Mooviboost Line 1"
              value={formData.project}
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            />
          </div>

          {/* Linked Standard Panel Code / Size */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>
              Standard Panel Code / Size (Optional)
            </label>
            <PanelSizeSearchSelect
              value={formData.panel_code || ''}
              onChange={(val) => setFormData({ ...formData, panel_code: val })}
              panelSizes={availablePanelSizes}
              placeholder="-- No linked panel size (Click to search / select) --"
            />
          </div>

          {/* Optional Drawing Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>
              Technical Drawing (PDF)
            </label>
            {drawingFile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}>
                <FileText size={14} color="#10b981" />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{drawingFile.name}</span>
                <button type="button" onClick={() => setDrawingFile(null)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>✕</button>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', border: '1px dashed var(--border2)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text3)', fontSize: '12px', background: 'var(--bg3)' }}>
                <UploadCloud size={14} color="var(--blue)" />
                <span>Upload Drawing PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => { if (e.target.files?.[0]) setDrawingFile(e.target.files[0]); }}
                />
              </label>
            )}
          </div>

          {/* Optional BOM Upload */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--text3)', textTransform: 'uppercase', marginBottom: '4px', fontWeight: 600 }}>
              BOM Document (PDF)
            </label>
            {bomFile ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '12px' }}>
                <FileText size={14} color="#10b981" />
                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bomFile.name}</span>
                <button type="button" onClick={() => setBomFile(null)} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer' }}>✕</button>
              </div>
            ) : (
              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', border: '1px dashed var(--border2)', borderRadius: '6px', cursor: 'pointer', color: 'var(--text3)', fontSize: '12px', background: 'var(--bg3)' }}>
                <UploadCloud size={14} color="var(--blue)" />
                <span>Upload BOM PDF</span>
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) => { if (e.target.files?.[0]) setBomFile(e.target.files[0]); }}
                />
              </label>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', paddingTop: '14px', borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            className="vbtn"
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: '#475569',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="vbtn"
            disabled={isSubmitting}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              background: '#7c3aed',
              border: 'none',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isSubmitting ? 'Saving Master...' : 'Save & Select Part'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
