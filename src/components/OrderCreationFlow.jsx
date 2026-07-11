import { useState, useEffect } from 'react';

export default function OrderCreationFlow({ onOrderCreated }) {
  const [formData, setFormData] = useState({
    company_location_id: '',
    order_date: '',
    delivery_date: '',
    notes: '',
    priority: 'Medium',
    po_number: '',
    packaging_type: '',
    end_client_name: '',
    gst_number: '',
    reference_number: '',
    classification: 'Standard',
    lineItems: [{
      material_description: '',
      part_number: '',
      panel_type_size: '',
      delivery_date: '',
      quantity: 1,
      unit: 'Nos',
      unit_price: '',
      total_price: '',
      notes: ''
    }]
  });
  const [companies, setCompanies] = useState([]);
  const [files, setFiles] = useState({
    po: null,
    quotation: null,
    approved_docs: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [draggingPo, setDraggingPo] = useState(false);
  const [draggingQuotation, setDraggingQuotation] = useState(false);
  const [draggingDocs, setDraggingDocs] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch(window.API_BASE + "/api/companies", {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setCompanies(data))
    .catch(err => console.error(err));
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLineItemChange = (index, field, value) => {
    setFormData(prev => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index][field] = value;
      
      // Auto-calculate total price
      if (field === 'quantity' || field === 'unit_price') {
        const q = parseFloat(newLineItems[index].quantity) || 0;
        const p = parseFloat(newLineItems[index].unit_price) || 0;
        newLineItems[index].total_price = (q * p).toFixed(2);
      }
      
      return { ...prev, lineItems: newLineItems };
    });
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          material_description: '',
          part_number: '',
          panel_type_size: '',
          delivery_date: '',
          quantity: 1,
          unit: 'Nos',
          unit_price: '',
          total_price: '',
          notes: ''
        }
      ]
    }));
  };

  const removeLineItem = (index) => {
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const handleFiles = (selectedFiles, type) => {
    if (type === 'approved_docs') {
      setFiles(prev => {
        const existing = prev.approved_docs || [];
        const newFiles = [...existing, ...selectedFiles];
        if (newFiles.length > 20) {
          alert('Maximum 20 files allowed');
          return prev;
        }
        return { ...prev, [type]: newFiles };
      });
    } else {
      setFiles(prev => ({ ...prev, [type]: selectedFiles[0] }));
    }
  };

  const handleFileChange = (e, type) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    handleFiles(selectedFiles, type);
    e.target.value = '';
  };

  const handleDragOver = (e, setDragging) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (setDragging) => {
    setDragging(false);
  };

  const handleDrop = (e, type, setDragging) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length === 0) return;
    handleFiles(droppedFiles, type);
  };

  const removeFile = (indexToRemove) => {
    setFiles(prev => ({
      ...prev,
      approved_docs: prev.approved_docs.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const removeSingleFile = (type) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    const input = document.getElementById(`file-input-${type}`);
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_location_id || formData.lineItems.length === 0) {
      alert('Please select a company and add at least one line item.');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('company_location_id', formData.company_location_id);
    data.append('order_date', formData.order_date);
    data.append('delivery_date', formData.delivery_date);
    data.append('notes', formData.notes);
    data.append('priority', formData.priority);
    data.append('po_number', formData.po_number);
    data.append('end_client_name', formData.end_client_name || '');
    data.append('gst_number', formData.gst_number || '');
    data.append('reference_number', formData.reference_number || '');
    data.append('classification', formData.classification || 'Standard');
    data.append('lineItems', JSON.stringify(formData.lineItems));

    if (files.po) data.append('po', files.po);
    if (files.quotation) data.append('quotation', files.quotation);
    if (files.approved_docs && files.approved_docs.length > 0) {
      files.approved_docs.forEach(file => data.append('approved', file));
    }

    try {
      const res = await fetch(window.API_BASE + "/api/orders", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data
      });

      if (res.ok) {
        const result = await res.json();
        alert(result.message);
        if (onOrderCreated) onOrderCreated(result.order);
        // Reset form
        setFormData({
          company_location_id: '',
          order_date: '',
          delivery_date: '',
          notes: '',
          priority: 'Medium',
          po_number: '',
          packaging_type: '',
          end_client_name: '',
          gst_number: '',
          reference_number: '',
          classification: 'Standard',
          lineItems: [{
            material_description: '',
            part_number: '',
            panel_type_size: '',
            delivery_date: '',
            quantity: 1,
            unit: 'Nos',
            unit_price: '',
            total_price: '',
            notes: ''
          }]
        });
        setFiles({ po: null, quotation: null, approved_docs: [] });
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create order');
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert('Network error during order creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="order-creation-container">
      <div className="form-card">
        <h2 className="form-title">Create New Order</h2>
        <p className="form-subtitle">Fill in the details to generate an Internal Order Number and Unit IDs.</p>

        <form onSubmit={handleSubmit} className="order-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Select Company & Location</label>
              <select 
                name="company_location_id" 
                value={formData.company_location_id} 
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">-- None --</option>
                {companies.map(comp => (
                  <optgroup key={comp.id} label={comp.name}>
                    {comp.locations?.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {comp.name} - {loc.city}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Order Date</label>
              <input 
                type="date" 
                name="order_date" 
                value={formData.order_date} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>Overall Delivery Date</label>
              <input 
                type="date" 
                name="delivery_date" 
                value={formData.delivery_date} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>Priority</label>
              <select 
                name="priority" 
                value={formData.priority} 
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Customer PO Number</label>
              <input 
                type="text" 
                name="po_number" 
                value={formData.po_number} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>Dispatch / Packaging</label>
              <select 
                name="packaging_type" 
                value={formData.packaging_type} 
                onChange={handleInputChange}
                className="form-input"
              >
                <option value="">-- Select Packaging Type --</option>
                <option value="Wooden Packaging">Wooden Packaging</option>
                <option value="Foam Packaging">Foam Packaging</option>
              </select>
            </div>

            <div className="form-group">
              <label>End Client Name (Optional)</label>
              <input 
                type="text" 
                name="end_client_name" 
                value={formData.end_client_name} 
                onChange={handleInputChange} 
              />
            </div>

            <div className="form-group">
              <label>GST Number (Optional)</label>
              <input 
                type="text" 
                name="gst_number" 
                value={formData.gst_number} 
                onChange={handleInputChange} 
                placeholder="e.g. 27AAAAA1111A1Z1"
              />
            </div>

            <div className="form-group">
              <label>Customer Reference Number (Optional)</label>
              <input 
                type="text" 
                name="reference_number" 
                value={formData.reference_number} 
                onChange={handleInputChange} 
                placeholder="e.g. REF-2026-99"
              />
            </div>

            <div className="form-group">
              <label>Classification</label>
              <select 
                name="classification" 
                value={formData.classification || 'Standard'} 
                onChange={handleInputChange}
                style={{ width: '100%', padding: '8px 12px', background: 'var(--bg4)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text2)', fontSize: '13px' }}
              >
                <option value="Standard">Standard</option>
                <option value="Non-Standard">Non-Standard</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>Overall Order Notes</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="line-items-section" style={{ marginTop: '32px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="section-title" style={{ margin: 0 }}>Line Items</h3>
              <button type="button" className="vbtn" style={{ background: '#3b82f6', fontSize: '12px', padding: '6px 12px' }} onClick={addLineItem}>
                + Add Line Item
              </button>
            </div>
            
            {formData.lineItems.map((li, idx) => (
              <div key={idx} style={{ background: 'var(--bg3)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '16px', position: 'relative' }}>
                {formData.lineItems.length > 1 && (
                  <button type="button" onClick={() => removeLineItem(idx)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '16px' }}>✕</button>
                )}
                <div className="line-item-grid-1">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Line Item # <span style={{ color: '#888', fontStyle: 'italic' }}>(auto-assigned)</span></label>
                    <input type="text" className="form-input" value={`Item ${idx + 1}`} readOnly style={{ background: 'var(--bg4)', opacity: 0.6, cursor: 'not-allowed' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Material Description</label>
                    <input type="text" className="form-input" value={li.material_description} onChange={e => handleLineItemChange(idx, 'material_description', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Part Number *</label>
                    <input type="text" className="form-input" value={li.part_number} onChange={e => handleLineItemChange(idx, 'part_number', e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Panel Type / Size</label>
                    <input type="text" className="form-input" value={li.panel_type_size} onChange={e => handleLineItemChange(idx, 'panel_type_size', e.target.value)} />
                  </div>
                </div>

                <div className="line-item-grid-2">
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Quantity *</label>
                    <input type="number" className="form-input" min="1" value={li.quantity} onChange={e => handleLineItemChange(idx, 'quantity', e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Unit</label>
                    <input type="text" className="form-input" value={li.unit} onChange={e => handleLineItemChange(idx, 'unit', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Unit Price *</label>
                    <input type="number" step="0.01" className="form-input" value={li.unit_price} onChange={e => handleLineItemChange(idx, 'unit_price', e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Total Price</label>
                    <input type="number" step="0.01" className="form-input" value={li.total_price} onChange={e => handleLineItemChange(idx, 'total_price', e.target.value)} readOnly style={{ background: 'var(--bg4)', opacity: 0.7 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Delivery Date</label>
                    <input type="date" className="form-input" value={li.delivery_date} onChange={e => handleLineItemChange(idx, 'delivery_date', e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: '#888', marginBottom: '4px' }}>Item Notes</label>
                  <input type="text" className="form-input" value={li.notes} onChange={e => handleLineItemChange(idx, 'notes', e.target.value)} />
                </div>
              </div>
            ))}
          </div>



          <div className="file-upload-section">
            <h3 className="section-title">Required Documents</h3>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '16px' }}>
              ⚠️ Only <strong style={{ color: 'var(--text2)' }}>one</strong> PO copy and one Quotation allowed. To replace after submission, delete the existing file first.
            </div>
            <div className="file-grid">

              {/* Customer PO Copy — single file only */}
              <div 
                className={`file-input-wrapper${draggingPo ? ' dragging' : ''}`}
                onDragOver={(e) => handleDragOver(e, setDraggingPo)}
                onDragLeave={() => handleDragLeave(setDraggingPo)}
                onDrop={(e) => handleDrop(e, 'po', setDraggingPo)}
              >
                <label>Customer PO Copy</label>
                {files.po ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 10px', width: '100%', justifyContent: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#10b981' }}>✔</span>
                    <span className="file-name-hint" style={{ flex: 1, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{files.po.name}</span>
                    <label style={{ fontSize: '10px', color: '#60a5fa', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Replace
                      <input id="file-input-po" type="file" hidden onChange={(e) => handleFileChange(e, 'po')} />
                    </label>
                    <button type="button" onClick={() => removeSingleFile('po')} className="remove-file-btn" title="Remove">✕</button>
                  </div>
                ) : (
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '8px', border: '1px dashed var(--border2)', borderRadius: '6px', padding: '16px', cursor: 'pointer', color: 'var(--text3)', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <span>📁 Drag file here or</span>
                    <span style={{ color: 'var(--blue)' }}>browse files</span>
                    <input id="file-input-po" type="file" hidden onChange={(e) => handleFileChange(e, 'po')} />
                  </label>
                )}
              </div>

              {/* Quotation — single file only */}
              <div 
                className={`file-input-wrapper${draggingQuotation ? ' dragging' : ''}`}
                onDragOver={(e) => handleDragOver(e, setDraggingQuotation)}
                onDragLeave={() => handleDragLeave(setDraggingQuotation)}
                onDrop={(e) => handleDrop(e, 'quotation', setDraggingQuotation)}
              >
                <label>Quotation</label>
                {files.quotation ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px 10px', width: '100%', justifyContent: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#10b981' }}>✔</span>
                    <span className="file-name-hint" style={{ flex: 1, maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{files.quotation.name}</span>
                    <label style={{ fontSize: '10px', color: '#60a5fa', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      Replace
                      <input id="file-input-quotation" type="file" hidden onChange={(e) => handleFileChange(e, 'quotation')} />
                    </label>
                    <button type="button" onClick={() => removeSingleFile('quotation')} className="remove-file-btn" title="Remove">✕</button>
                  </div>
                ) : (
                  <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '8px', border: '1px dashed var(--border2)', borderRadius: '6px', padding: '16px', cursor: 'pointer', color: 'var(--text3)', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}>
                    <span>📁 Drag file here or</span>
                    <span style={{ color: 'var(--blue)' }}>browse files</span>
                    <input id="file-input-quotation" type="file" hidden onChange={(e) => handleFileChange(e, 'quotation')} />
                  </label>
                )}
              </div>

              {/* Approved Documents — multiple files */}
              <div 
                className={`file-input-wrapper${draggingDocs ? ' dragging' : ''}`}
                onDragOver={(e) => handleDragOver(e, setDraggingDocs)}
                onDragLeave={() => handleDragLeave(setDraggingDocs)}
                onDrop={(e) => handleDrop(e, 'approved_docs', setDraggingDocs)}
                style={{ alignItems: 'center' }}
              >
                <label>Approved Documents (Up to 20)</label>
                <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', marginTop: '8px', border: '1px dashed var(--border2)', borderRadius: '6px', padding: '16px', cursor: 'pointer', color: 'var(--text3)', fontSize: '12px', width: '100%', boxSizing: 'border-box' }}>
                  <span>📁 Drag files here or</span>
                  <span style={{ color: 'var(--blue)' }}>browse files</span>
                  <input type="file" multiple hidden onChange={(e) => handleFileChange(e, 'approved_docs')} />
                </label>
                {files.approved_docs && files.approved_docs.length > 0 && (
                  <div className="selected-files-list">
                    {files.approved_docs.map((file, idx) => (
                      <div key={idx} className="selected-file-item">
                        <span className="file-name-hint">{file.name}</span>
                        <button type="button" onClick={() => removeFile(idx)} className="remove-file-btn">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Order...' : 'Initialize Order'}
            </button>
          </div>
        </form>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .order-creation-container {
          padding: 24px;
          max-width: 900px;
          margin: 0 auto;
        }
        .form-card {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.1);
        }
        .form-title { margin: 0 0 8px 0; color: var(--text); font-size: 24px; }
        .form-subtitle { color: var(--text3); font-size: 14px; margin-bottom: 32px; }
        
        .order-form { display: flex; flex-direction: column; gap: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .full-width { grid-column: span 2; }
        
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { color: var(--text2); font-size: 13px; font-weight: 500; }
        .form-group input, .form-group textarea {
          background: var(--bg3);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 12px;
          color: var(--text);
          font-size: 14px;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--blue);
          outline: none;
        }
        .form-group textarea { min-height: 80px; resize: vertical; }
        
        .file-upload-section {
          margin-top: 16px;
          padding-top: 24px;
          border-top: 1px solid var(--border);
        }
        .section-title { font-size: 16px; color: var(--text); margin-bottom: 16px; }
        .file-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        
        .file-input-wrapper { 
          display: flex; flex-direction: column; gap: 12px;
          background: var(--bg3); border: 1px dashed var(--border2); border-radius: 12px; padding: 20px;
          align-items: center; justify-content: center; text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .file-input-wrapper:hover { border-color: var(--blue); background: var(--bg4); }
        .file-input-wrapper.dragging {
          border-color: var(--blue) !important;
          background: var(--blue-dim) !important;
        }
        .file-input-wrapper label { color: var(--text2); font-size: 13px; font-weight: 600; }
        .file-input-wrapper input[type="file"] {
          font-size: 12px; color: var(--text3); max-width: 100%;
        }
        .file-name-hint { font-size: 12px; color: var(--blue); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px;}
        
        .selected-files-list {
          display: flex; flex-direction: column; gap: 4px; width: 100%;
          max-height: 120px; overflow-y: auto; padding-right: 4px; margin-top: 8px;
        }
        .selected-file-item {
          display: flex; justify-content: space-between; align-items: center;
          background: var(--bg4); padding: 4px 8px; border-radius: 4px;
        }
        .remove-file-btn {
          background: transparent; border: none; color: var(--red); cursor: pointer; font-size: 12px; padding: 2px 6px;
        }
        .remove-file-btn:hover { opacity: 0.8; }
        
        .form-actions { margin-top: 16px; display: flex; justify-content: flex-end; }
        .submit-btn {
          background: var(--blue);
          color: white;
          border: none;
          padding: 14px 28px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.1s, background 0.2s;
        }
        .submit-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .line-item-grid-1 {
          display: grid;
          grid-template-columns: 100px 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }
        .line-item-grid-2 {
          display: grid;
          grid-template-columns: 100px 100px 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .full-width {
            grid-column: span 1;
          }
          .form-card {
            padding: 20px;
          }
          .line-item-grid-1, .line-item-grid-2 {
            grid-template-columns: 1fr;
            gap: 12px;
          }
        }
      `}} />
    </div>
  );
}
