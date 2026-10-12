import React from 'react';
import Modal from './Modal.jsx';
import { PackagePlus, ShoppingCart, X, Check } from 'lucide-react';

/**
 * PurchaseNewOrderModal
 * Dedicated modal dialog for creating a Purchase Order (buying materials/supplies from vendors).
 * Rendered directly over the Purchase Department Table View.
 */
export default function PurchaseNewOrderModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Purchase Order"
      subtitle="Procurement & Buying · Create order for materials and components to buy"
      maxWidth="1200px"
      width="96%"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Placeholder Canvas Container */}
        <div
          style={{
            minHeight: '520px',
            height: 'calc(72vh - 140px)',
            background: 'var(--bg3)',
            border: '1.5px dashed var(--border2)',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px 32px',
            textAlign: 'center',
            gap: '18px',
            transition: 'border-color 0.2s ease, background 0.2s ease'
          }}
        >
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '18px',
              background: 'rgba(56, 189, 248, 0.12)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--blue, #38bdf8)',
              boxShadow: '0 6px 20px rgba(56, 189, 248, 0.18)'
            }}
          >
            <PackagePlus size={34} />
          </div>

          <div style={{ maxWidth: '460px' }}>
            <h4
              style={{
                margin: '0 0 8px 0',
                fontSize: '17px',
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: '-0.01em'
              }}
            >
              Purchase Order Form Canvas
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: '14px',
                color: 'var(--text3)',
                lineHeight: 1.6
              }}
            >
              Expanded workspace canvas ready. Once you specify what fields, vendor details, and items to buy, they will be laid out here.
            </p>
          </div>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--blue, #38bdf8)',
              background: 'rgba(56, 189, 248, 0.1)',
              padding: '5px 12px',
              borderRadius: '20px',
              border: '1px solid rgba(56, 189, 248, 0.25)'
            }}
          >
            Blank Template · Ready for Fields
          </span>
        </div>

        {/* Modal Action Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            paddingTop: '8px',
            borderTop: '1px solid var(--border)'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              height: '36px',
              padding: '0 16px',
              fontSize: '13px',
              fontWeight: 500,
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'var(--bg2)',
              color: 'var(--text2)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--text3)';
              e.currentTarget.style.color = 'var(--text)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)';
              e.currentTarget.style.color = 'var(--text2)';
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onClose}
            style={{
              height: '36px',
              padding: '0 18px',
              fontSize: '13px',
              fontWeight: 600,
              borderRadius: '8px',
              border: 'none',
              background: 'var(--blue, #38bdf8)',
              color: '#fff',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(56, 189, 248, 0.25)',
              transition: 'opacity 0.15s ease, transform 0.1s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Check size={14} />
            <span>Close</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
