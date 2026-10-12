import React, { useState } from 'react';
import Modal from './Modal.jsx';
import { PackagePlus, Layers, Cpu, Zap, Cable, Check, ChevronDown } from 'lucide-react';

/**
 * PurchaseNewOrderModal
 * Dedicated modal dialog for creating a Purchase Order (buying materials/supplies from vendors).
 * Rendered directly over the Purchase Department Table View.
 */
const CATEGORIES = [
  {
    id: 'Panel',
    label: 'Panel',
    icon: Layers,
    color: '#38bdf8',
    bgColor: 'rgba(56, 189, 248, 0.12)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    description: 'Enclosures, sheet metal fabrication, panel structures & housing components'
  },
  {
    id: 'Automation',
    label: 'Automation',
    icon: Cpu,
    color: '#a855f7',
    bgColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.3)',
    description: 'PLCs, HMIs, VFDs/drives, automation controllers, relays & smart modules'
  },
  {
    id: 'Low voltage',
    label: 'Low voltage',
    icon: Zap,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    description: 'MCBs, MCCBs, contactors, busbars, power distribution & protection gear'
  },
  {
    id: 'Wires & Accessories',
    label: 'Wires & Accessories',
    icon: Cable,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    description: 'Copper cables, wiring harnesses, lugs, ferrules, cable glands, ties & ducting'
  }
];

export default function PurchaseNewOrderModal({ isOpen, onClose }) {
  const [category, setCategory] = useState('Panel');

  if (!isOpen) return null;

  const currentCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const CategoryIcon = currentCategory.icon;

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
        {/* Top Control Bar with Category Dropdown */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '260px' }}>
              <label
                htmlFor="purchase-order-category-select"
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Category</span>
                <span style={{ color: 'var(--accent, #f97316)', fontSize: '13px' }}>*</span>
              </label>

              <div style={{ position: 'relative', width: '100%', maxWidth: '340px' }}>
                <select
                  id="purchase-order-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 36px 0 14px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--text)',
                    background: 'var(--bg3)',
                    border: '1px solid var(--border2)',
                    borderRadius: '8px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--blue, #38bdf8)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(56, 189, 248, 0.2)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border2)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option
                      key={cat.id}
                      value={cat.id}
                      style={{ background: '#1c202b', color: '#f1f5f9' }}
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--text3)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Workspace Canvas for Selected Category */}
        <div
          style={{
            minHeight: '420px',
            height: 'calc(68vh - 160px)',
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
              background: currentCategory.bgColor,
              border: `1px solid ${currentCategory.borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: currentCategory.color,
              boxShadow: `0 6px 20px ${currentCategory.bgColor}`
            }}
          >
            <CategoryIcon size={34} />
          </div>

          <div style={{ maxWidth: '480px' }}>
            <h4
              style={{
                margin: '0 0 8px 0',
                fontSize: '18px',
                fontWeight: 600,
                color: 'var(--text)',
                letterSpacing: '-0.01em'
              }}
            >
              {currentCategory.label} Purchase Order
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: '13.5px',
                color: 'var(--text3)',
                lineHeight: 1.6
              }}
            >
              {currentCategory.description}
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
              color: currentCategory.color,
              background: currentCategory.bgColor,
              padding: '5px 12px',
              borderRadius: '20px',
              border: `1px solid ${currentCategory.borderColor}`
            }}
          >
            Category: {currentCategory.label} · Ready for Fields
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
