import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import { Lock, Check } from 'lucide-react';

export default function EditRefTagModal({
  isOpen,
  unit,
  onClose,
  onSave
}) {
  const [refNumber, setRefNumber] = useState('');
  const [tagNumber, setTagNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (unit) {
      setRefNumber(unit.reference_number || '');
      setTagNumber(unit.tag || '');
      setError('');
    }
  }, [unit, isOpen]);

  if (!unit) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      await onSave({
        reference_number: refNumber.trim(),
        tag: tagNumber.trim()
      });
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update Reference & Tag');
    } finally {
      setIsSubmitting(false);
    }
  };

  const preview = (refNumber.trim() && tagNumber.trim())
    ? `${refNumber.trim()}/${tagNumber.trim()}`
    : (refNumber.trim() || tagNumber.trim() || '—');

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Reference & Tag Number"
      subtitle={`Order ${unit.order_number || ''}${unit.company_name ? ` · ${unit.company_name}` : ''}`}
      maxWidth="480px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Serial Number Protection Notice */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.08)',
          border: '1px solid rgba(59, 130, 246, 0.25)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Lock size={16} color="var(--blue)" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '12px' }}>
            <div>
              Attached Serial No: <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--blue)' }}>{unit.short_serial || unit.unit_id}</strong>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
              The attached serial number is permanent and will NOT be modified.
            </div>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '6px', padding: '8px 12px', fontSize: '12px' }}>
            {error}
          </div>
        )}

        {/* Customer Reference Number (Order-Level) */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px', fontWeight: 600 }}>
            Customer Reference Number (Order)
          </label>
          <input
            type="text"
            className="form-input"
            value={refNumber}
            onChange={(e) => setRefNumber(e.target.value)}
            placeholder="e.g. REF-2026-99, PO-REF-01"
            autoFocus
          />
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
            Applies to Order #{unit.order_number} and all associated units.
          </div>
        </div>

        {/* Tag Number (Unit / Line Item Level) */}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px', fontWeight: 600 }}>
            Tag Number (Unit / Line Item)
          </label>
          <input
            type="text"
            className="form-input"
            value={tagNumber}
            onChange={(e) => setTagNumber(e.target.value)}
            placeholder="e.g. TG-01, 1A, FE-01"
          />
          <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '3px' }}>
            Equipment tag identifier for unit {unit.short_serial || unit.unit_id}.
          </div>
        </div>

        {/* Live Ref / Tag Display Preview */}
        <div style={{
          background: 'var(--bg3)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Ref / Tag Display Preview:</span>
          <span style={{ color: '#f59e0b', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
            {preview}
          </span>
        </div>

        {/* Modal Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
          <button
            type="button"
            className="vbtn"
            onClick={onClose}
            style={{ background: '#475569', color: '#fff', padding: '8px 16px', borderRadius: '6px', fontSize: '12px' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="vbtn"
            disabled={isSubmitting}
            style={{
              background: '#3b82f6',
              color: '#fff',
              padding: '8px 20px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Check size={14} />
            <span>{isSubmitting ? 'Saving...' : 'Save Ref & Tag'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
