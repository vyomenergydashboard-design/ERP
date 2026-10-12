import React, { useState, useEffect } from 'react';
import Modal from './Modal.jsx';
import { Layers, Cpu, Zap, Cable, Check, ChevronDown, Save, Plus, X } from 'lucide-react';

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

const getTodayDateStr = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PurchaseNewOrderModal({ isOpen, onClose }) {
  const [category, setCategory] = useState('Panel');
  const [poEntries, setPoEntries] = useState([
    { id: 1, poNumber: '', date: getTodayDateStr() }
  ]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [focusedPoId, setFocusedPoId] = useState(null);

  const handlePoNumberChange = (id, value) => {
    setPoEntries(prev => prev.map(entry => entry.id === id ? { ...entry, poNumber: value } : entry));
  };

  const handleAddPoEntry = () => {
    const newId = Date.now();
    setPoEntries(prev => [
      ...prev,
      { id: newId, poNumber: '', date: getTodayDateStr() }
    ]);
    setFocusedPoId(newId);
  };

  const handleRemovePoEntry = (id) => {
    setPoEntries(prev => prev.length > 1 ? prev.filter(entry => entry.id !== id) : prev);
    setFocusedPoId(prev => (prev === id ? null : prev));
  };

  const handleSave = () => {
    const populatedPoList = poEntries.map((p, idx) => ({
      id: p.id,
      poNumber: p.poNumber.trim() || `PO-${new Date().getFullYear()}-${idx + 1}`,
      date: p.date,
      isPrimary: idx === 0
    }));

    // Build order record ensuring any operation references the date created with the first PO only
    const orderRecord = {
      id: 'PO-' + Date.now(),
      category,
      primaryOperationDate: populatedPoList[0].date, // Reference date for all subsequent operations
      orderDate: populatedPoList[0].date,            // Unified operation date
      pos: populatedPoList,                          // All PO numbers with respective creation dates
      totalPos: populatedPoList.length,
      createdAt: new Date().toISOString()
    };

    try {
      const existingRaw = localStorage.getItem('vyom_purchase_orders');
      const existingList = existingRaw ? JSON.parse(existingRaw) : [];
      const updatedList = [orderRecord, ...(Array.isArray(existingList) ? existingList : [])];
      localStorage.setItem('vyom_purchase_orders', JSON.stringify(updatedList));
    } catch (err) {
      console.error('Failed to save purchase order to localStorage:', err);
    }

    window.dispatchEvent(new CustomEvent('purchaseOrderSaved', { detail: orderRecord }));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Support Ctrl+S / Cmd+S keyboard shortcut to save (must be called unconditionally before any early return)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, category, poEntries]);

  if (!isOpen) return null;

  const currentCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const CategoryIcon = currentCategory.icon;

  // The operation date is strictly referenced from the date created with the first PO only
  const primaryOperationDate = poEntries[0]?.date || getTodayDateStr();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Purchase Order"
      subtitle="Procurement & Buying · Create order for materials and components to buy"
      maxWidth="1200px"
      width="96%"
      headerActions={
        <button
          type="button"
          onClick={handleSave}
          title="Save Purchase Order (Ctrl+S)"
          style={{
            height: '34px',
            padding: '0 16px',
            fontSize: '12.5px',
            fontWeight: 600,
            borderRadius: '7px',
            border: 'none',
            background: 'var(--green, #10b981)',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.28)',
            boxSizing: 'border-box',
            transition: 'opacity 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.94';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.38)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.28)';
          }}
        >
          <Save size={14} />
          <span>Save</span>
        </button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Top Control Bar with Category Dropdown, Multiple PO Entries, and Actions */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            boxShadow: 'var(--card-shadow, 0 1px 4px rgba(0, 0, 0, 0.08))'
          }}
        >
          {/* Control Bar Layout: Category on Left, PO Cluster on Right */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            {/* Category Dropdown (Left Column, fixed width) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: 'fit-content', flexShrink: 0 }}>
              <label
                htmlFor="purchase-order-category-select"
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: 'var(--text)',
                  height: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  userSelect: 'none'
                }}
              >
                <span>Category</span>
                <span style={{ color: 'var(--accent, #f97316)', fontSize: '13px' }}>*</span>
              </label>

              <div style={{ position: 'relative', width: 'fit-content' }}>
                <select
                  id="purchase-order-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    width: 'auto',
                    minWidth: '155px',
                    maxWidth: '210px',
                    height: '30px',
                    padding: '0 30px 0 10px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--text)',
                    background: 'var(--bg3)',
                    border: '1.5px solid var(--border2)',
                    borderRadius: '6px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--blue, #38bdf8)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px var(--blue-dim, rgba(56, 189, 248, 0.25))';
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
                      style={{ background: 'var(--bg2)', color: 'var(--text)' }}
                    >
                      {cat.label}
                    </option>
                  ))}
                </select>
                <div
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none',
                    color: 'var(--text2)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <ChevronDown size={13} />
                </div>
              </div>
            </div>

            {/* PO Entries Cluster: Wraps internally so the next line of POs starts directly under the first PO */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                flex: 1,
                minWidth: 0
              }}
            >
              {poEntries.map((entry, index) => {
                const isFirstPo = index === 0;
                const isFocused = focusedPoId === entry.id;
                const inputWidth = Math.max(110, Math.min(210, ((entry.poNumber || '').length || 6) * 8.5 + 24));

                return (
                  <div key={entry.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: 'fit-content' }}>
                    {/* Top Header Row of PO Container with Label & Compact Removal Option */}
                    <div
                      style={{
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        userSelect: 'none'
                      }}
                    >
                      <label
                        htmlFor={`po-input-${entry.id}`}
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'var(--text)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px',
                          cursor: 'pointer'
                        }}
                      >
                        <span>{isFirstPo ? 'PO No.' : `PO No. ${index + 1}`}</span>
                        {isFirstPo && <span style={{ color: 'var(--accent, #f97316)', fontSize: '12px' }}>*</span>}
                      </label>

                      {/* Compact Refined Removal Option */}
                      {!isFirstPo && (
                        <button
                          type="button"
                          onClick={() => handleRemovePoEntry(entry.id)}
                          title={`Remove PO ${index + 1}`}
                          aria-label={`Remove PO ${index + 1}`}
                          style={{
                            height: '14px',
                            background: 'rgba(239, 68, 68, 0.08)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: 'var(--red, #ef4444)',
                            cursor: 'pointer',
                            padding: '0 3.5px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            borderRadius: '3px',
                            fontSize: '9px',
                            fontWeight: 600,
                            lineHeight: 1,
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'var(--red, #ef4444)';
                            e.currentTarget.style.color = '#ffffff';
                            e.currentTarget.style.borderColor = 'var(--red, #ef4444)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                            e.currentTarget.style.color = 'var(--red, #ef4444)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.25)';
                          }}
                        >
                          <X size={8.5} style={{ strokeWidth: 2.2 }} />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>

                    {/* Clean Standalone PO Number Input (Sleek Compact Height) */}
                    <input
                      id={`po-input-${entry.id}`}
                      type="text"
                      value={entry.poNumber}
                      onChange={(e) => handlePoNumberChange(entry.id, e.target.value)}
                      onFocus={() => setFocusedPoId(entry.id)}
                      onBlur={() => setFocusedPoId(null)}
                      placeholder="PO No."
                      aria-label={isFirstPo ? 'Primary Purchase Order Number' : `Purchase Order Number ${index + 1}`}
                      style={{
                        width: `${inputWidth}px`,
                        height: '30px',
                        padding: '0 10px',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        fontFamily: 'inherit',
                        color: 'var(--text)',
                        background: 'var(--bg3)',
                        border: isFocused ? '1.5px solid var(--blue, #38bdf8)' : '1.5px solid var(--border2)',
                        borderRadius: '6px',
                        boxShadow: isFocused ? '0 0 0 2px var(--blue-dim, rgba(56, 189, 248, 0.25))' : '0 1px 2px rgba(0,0,0,0.05)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease, width 0.12s ease'
                      }}
                    />

                    {/* High-Visibility Date Badge Below PO Number */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 'fit-content',
                        padding: '2px 7px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontWeight: 700,
                        color: 'var(--text)',
                        background: 'var(--bg4)',
                        border: '1.5px solid var(--border2)',
                        borderRadius: '5px',
                        userSelect: 'none',
                        letterSpacing: '0.03em',
                        lineHeight: '14px',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.06)'
                      }}
                      title="Creation date"
                    >
                      <span>{entry.date}</span>
                    </div>
                  </div>
                );
              })}

              {/* Add PO Button (Locked to the Exact Control Baseline) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ height: '16px' }} />
                <button
                  type="button"
                  onClick={handleAddPoEntry}
                  style={{
                    height: '30px',
                    padding: '0 12px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'var(--blue-dim, rgba(56, 189, 248, 0.14))',
                    color: 'var(--blue, #38bdf8)',
                    border: '1.5px solid rgba(56, 189, 248, 0.45)',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                    e.currentTarget.style.borderColor = 'var(--blue, #38bdf8)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--blue-dim, rgba(56, 189, 248, 0.14))';
                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                  }}
                >
                  <Plus size={13} style={{ strokeWidth: 2.4 }} />
                  <span>Add PO</span>
                </button>
              </div>
            </div>
          </div>

          {/* Success Notification Alert */}
          {savedSuccess && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 14px',
                background: 'var(--green-dim, rgba(16, 185, 129, 0.12))',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                borderRadius: '8px',
                color: 'var(--green, #10b981)',
                fontSize: '12.5px',
                fontWeight: 500
              }}
            >
              <Check size={15} style={{ strokeWidth: 2.5 }} />
              <span>
                PO details saved successfully! ({poEntries.length} PO{poEntries.length > 1 ? 's' : ''} recorded for {category})
              </span>
            </div>
          )}
        </div>

        {/* Workspace Canvas for Selected Category */}
        <div
          style={{
            minHeight: '380px',
            height: 'calc(65vh - 160px)',
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
              padding: '0 18px',
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
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
