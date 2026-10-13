import React, { useState, useEffect, useRef, useMemo } from 'react';
import Modal from './Modal.jsx';
import {
  Layers,
  Cpu,
  Zap,
  Cable,
  Check,
  ChevronDown,
  ChevronUp,
  Save,
  Plus,
  X,
  Trash2,
  Hash,
  Calendar,
  AlertCircle
} from 'lucide-react';

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
    description: 'PLC, HMI, VFD, drives, sensors, controllers & automation hardware'
  },
  {
    id: 'Low voltage',
    label: 'Low voltage',
    icon: Zap,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    description: 'Switchgear, breakers, contactors, relays & power distribution components'
  },
  {
    id: 'Wires & Accessories',
    label: 'Wires & Accessories',
    icon: Cable,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    description: 'Copper cables, wiring harnesses, lugs, ferrules, glands & hardware'
  }
];

const getCategoryData = (item, catId) => {
  if (!item || !item.categories) return null;
  if (item.categories[catId]) return item.categories[catId];
  if (catId === 'Panel' && item.categories['Panel Order']) return item.categories['Panel Order'];
  if (catId === 'Wires & Accessories' && item.categories['Accessories']) return item.categories['Accessories'];
  if (catId === 'Low voltage' && item.categories['Material']) return item.categories['Material'];
  return null;
};

const getCategoryPos = (item, catId, currentPoEntries = []) => {
  const catData = getCategoryData(item, catId);
  // 1. If catData has an array of pos with poNumbers, return them
  if (catData && Array.isArray(catData.pos) && catData.pos.length > 0) {
    const valid = catData.pos.filter(p => p && p.poNumber);
    if (valid.length > 0) return valid;
  }
  // 2. If currentPoEntries has multiple valid POs entered at the top, use them
  if (Array.isArray(currentPoEntries) && currentPoEntries.length > 0) {
    const validEntries = currentPoEntries
      .map((p, idx) => ({
        id: p.id || idx + 1,
        poNumber: (p.poNumber || '').trim(),
        date: p.date || getTodayDateStr(),
        dateReceived: p.dateReceived || null
      }))
      .filter(p => p.poNumber);
    if (validEntries.length > 0) return validEntries;
  }
  // 3. Fallback to single poNumber if available
  if (catData && catData.poNumber) {
    return [{
      id: 1,
      poNumber: catData.poNumber,
      date: catData.date || getTodayDateStr(),
      dateReceived: catData.dateReceived || null
    }];
  }
  return [];
};

/**
 * Groups consecutive sequential serial numbers (e.g. 222 to 256) into a consolidated range.
 * E.g., serials [222..256, 345] ->
 * Group 1: '222 – 256' (35 Panels)
 * Group 2: '345'
 */
const groupSerialsIntoRanges = (serialsList) => {
  if (!Array.isArray(serialsList) || serialsList.length === 0) return [];

  // Sort by sequence number
  const sorted = [...serialsList].sort((a, b) => {
    const numA = parseInt(String(a.serialNumber).slice(-4), 10);
    const numB = parseInt(String(b.serialNumber).slice(-4), 10);
    if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
    return String(a.serialNumber).localeCompare(String(b.serialNumber));
  });

  const groups = [];
  let currentGroup = null;

  for (const item of sorted) {
    const seqNum = parseInt(String(item.serialNumber).slice(-4), 10);
    const completeSerial = String(item.serialNumber);

    if (!currentGroup) {
      currentGroup = {
        id: 'grp-' + item.id,
        items: [item],
        startSeq: isNaN(seqNum) ? null : seqNum,
        endSeq: isNaN(seqNum) ? null : seqNum,
        startSerial: completeSerial,
        endSerial: completeSerial,
        sampleItem: item
      };
      continue;
    }

    // Check if contiguous to previous item
    const isContiguous = !isNaN(seqNum) && currentGroup.endSeq !== null && seqNum === currentGroup.endSeq + 1;

    if (isContiguous) {
      currentGroup.items.push(item);
      currentGroup.endSeq = seqNum;
      currentGroup.endSerial = completeSerial;
    } else {
      groups.push(currentGroup);
      currentGroup = {
        id: 'grp-' + item.id,
        items: [item],
        startSeq: isNaN(seqNum) ? null : seqNum,
        endSeq: isNaN(seqNum) ? null : seqNum,
        startSerial: completeSerial,
        endSerial: completeSerial,
        sampleItem: item
      };
    }
  }

  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups.map(grp => {
    const isRange = grp.items.length > 1;
    return {
      id: grp.id,
      isRange,
      count: grp.items.length,
      displayLabel: isRange ? `${grp.startSerial} – ${grp.endSerial}` : grp.startSerial,
      items: grp.items,
      sampleItem: grp.sampleItem
    };
  });
};

const getTodayDateStr = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function PurchaseNewOrderModal({ isOpen, onClose, existingUnits = [] }) {
  const [category, setCategory] = useState('Panel');
  const [poEntries, setPoEntries] = useState([
    { id: 1, poNumber: '', date: getTodayDateStr() }
  ]);
  const [serialInput, setSerialInput] = useState('');
  const [serials, setSerials] = useState([]);
  const [serialError, setSerialError] = useState('');
  const [lastAddedNotice, setLastAddedNotice] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [focusedPoId, setFocusedPoId] = useState(null);
  const [existingUnitsMap, setExistingUnitsMap] = useState(new Map());
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [expandedGroupIds, setExpandedGroupIds] = useState(new Set());
  const serialInputRef = useRef(null);

  const toggleGroupExpand = (grpId) => {
    setExpandedGroupIds(prev => {
      const next = new Set(prev);
      if (next.has(grpId)) next.delete(grpId);
      else next.add(grpId);
      return next;
    });
  };

  const handleRemoveGroup = (grp) => {
    const idsToRemove = new Set(grp.items.map(i => i.id));
    setSerials(prev => prev.filter(s => !idsToRemove.has(s.id)));
  };

  const groups = useMemo(() => groupSerialsIntoRanges(serials), [serials]);
  const hasRanges = groups.some(g => g.isRange);
  const allExpanded = hasRanges && groups.filter(g => g.isRange).every(g => expandedGroupIds.has(g.id));

  const toggleExpandAll = () => {
    if (allExpanded) {
      setExpandedGroupIds(new Set());
    } else {
      setExpandedGroupIds(new Set(groups.filter(g => g.isRange).map(g => g.id)));
    }
  };

  const syncSerialsWithPoEntries = (entries, activeCategory) => {
    const activePos = entries
      .map((p, idx) => ({
        id: p.id || idx + 1,
        poNumber: (p.poNumber || '').trim(),
        date: p.date || getTodayDateStr(),
        dateReceived: null
      }))
      .filter(p => p.poNumber);

    if (activePos.length === 0) return;

    setSerials(prev => prev.map(item => {
      const catData = item.categories?.[activeCategory];
      if (!catData) return item;
      return {
        ...item,
        categories: {
          ...item.categories,
          [activeCategory]: {
            ...catData,
            poNumber: activePos[0].poNumber,
            date: activePos[0].date,
            pos: activePos
          }
        }
      };
    }));
  };

  const handlePoNumberChange = (id, value) => {
    setPoEntries(prev => {
      const next = prev.map(entry => entry.id === id ? { ...entry, poNumber: value } : entry);
      syncSerialsWithPoEntries(next, category);
      return next;
    });
  };

  const handleAddPoEntry = () => {
    const newId = Date.now();
    setPoEntries(prev => {
      const next = [
        ...prev,
        { id: newId, poNumber: '', date: getTodayDateStr() }
      ];
      return next;
    });
    setFocusedPoId(newId);
  };

  const handleRemovePoEntry = (id) => {
    setPoEntries(prev => {
      const next = prev.length > 1 ? prev.filter(entry => entry.id !== id) : prev;
      syncSerialsWithPoEntries(next, category);
      return next;
    });
    setFocusedPoId(prev => (prev === id ? null : prev));
  };

  const getFyPrefix = () => {
    const year = new Date().getFullYear();
    const startYr = String(year % 100).padStart(2, '0');
    const endYr = String((year + 1) % 100).padStart(2, '0');
    return `${startYr}${endYr}`;
  };

  // Populate active units map for serial validation
  useEffect(() => {
    const map = new Map();
    const registerUnit = (u) => {
      if (!u) return;
      const ids = [u.unit_serial, u.short_serial, u.unit_id, u.serialNumber, u.serial_no].filter(Boolean);
      for (const rawId of ids) {
        const strId = String(rawId).trim();
        if (strId) {
          map.set(strId, u);
          if (/^\d{8}$/.test(strId)) {
            const seqNum = parseInt(strId.slice(-4), 10);
            if (!isNaN(seqNum)) {
              map.set(String(seqNum), u);
              map.set(String(seqNum).padStart(4, '0'), u);
            }
          } else if (/^\d{1,4}$/.test(strId)) {
            const seqNum = parseInt(strId, 10);
            if (!isNaN(seqNum)) {
              map.set(String(seqNum), u);
              map.set(String(seqNum).padStart(4, '0'), u);
              const fyPrefix = getFyPrefix();
              map.set(`${fyPrefix}${String(seqNum).padStart(4, '0')}`, u);
            }
          }
        }
      }
    };

    if (Array.isArray(existingUnits) && existingUnits.length > 0) {
      existingUnits.forEach(registerUnit);
      setExistingUnitsMap(new Map(map));
    }

    if (isOpen) {
      let isMounted = true;
      const fetchAllActiveUnits = async () => {
        try {
          setIsLoadingUnits(true);
          const token = localStorage.getItem('token');
          const res = await fetch(`${window.API_BASE}/api/dept-worklist/all`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          });
          if (res.ok) {
            const data = await res.json();
            if (isMounted && Array.isArray(data)) {
              data.forEach(registerUnit);
              setExistingUnitsMap(new Map(map));
            }
          }
        } catch (err) {
          console.error('Failed to load active serials from ERP:', err);
        } finally {
          if (isMounted) setIsLoadingUnits(false);
        }
      };

      fetchAllActiveUnits();
      return () => { isMounted = false; };
    }
  }, [isOpen, existingUnits]);

  /**
   * Parses user input in the single box according to Vyom ERP criteria:
   * - Range e.g. "222-256" or "222 - 256" -> expands from 222 to 256 (normalized to FY serials 26270222..26270256)
   * - Single e.g. "345" -> normalized to "26270345"
   * - Few serials e.g. "456 458 460" or "456, 458, 460" -> normalized to "26270456", "26270458", "26270460"
   * - Full 8-digit serials e.g. "26270222-26270256" or "26270345" -> preserved
   * - Invalid formats (non-numbers) are rejected with clear user guidance
   */
  const parseSerialExpression = (inputStr) => {
    const raw = (inputStr || '').trim();
    if (!raw) {
      return { error: 'Please enter serial number(s).' };
    }

    const fyPrefix = getFyPrefix();

    // Normalize hyphens so ranges like "222 - 256" become "222-256"
    const cleaned = raw.replace(/(\d+)\s*-\s*(\d+)/g, '$1-$2');

    // Split by commas, semicolons, newlines, or whitespace
    const tokens = cleaned
      .split(/[\s,;\n\r]+/)
      .map(t => t.trim())
      .filter(Boolean);

    if (tokens.length === 0) {
      return { error: 'Please enter serial number(s).' };
    }

    const resolved = [];
    const invalidFormatTokens = [];

    for (const token of tokens) {
      // 1. Range: "222-256" or "26270222-26270256"
      if (token.includes('-')) {
        const parts = token.split('-');
        if (parts.length === 2 && /^\d+$/.test(parts[0]) && /^\d+$/.test(parts[1])) {
          const numA = parseInt(parts[0], 10);
          const numB = parseInt(parts[1], 10);
          const minNum = Math.min(numA, numB);
          const maxNum = Math.max(numA, numB);

          if (maxNum - minNum > 1000) {
            return { error: 'Please enter a range of up to 1,000 serials at a time.' };
          }

          const isFull8 = parts[0].length === 8 && parts[1].length === 8;
          for (let i = minNum; i <= maxNum; i++) {
            if (isFull8) {
              resolved.push({ full: String(i), display: String(i) });
            } else {
              resolved.push({ full: `${fyPrefix}${String(i).padStart(4, '0')}`, display: String(i) });
            }
          }
          continue;
        } else {
          invalidFormatTokens.push(token);
          continue;
        }
      }

      // 2. Pure numeric token: "345" or "26270345"
      if (/^\d+$/.test(token)) {
        if (token.length === 8) {
          resolved.push({ full: token, display: String(parseInt(token.slice(-4), 10)) });
        } else if (token.length <= 4) {
          resolved.push({ full: `${fyPrefix}${token.padStart(4, '0')}`, display: token });
        } else {
          invalidFormatTokens.push(token);
        }
        continue;
      }

      // 3. Non-numeric token: e.g. "abc", "xyz"
      invalidFormatTokens.push(token);
    }

    if (invalidFormatTokens.length > 0) {
      return {
        error: `Invalid serial number: '${invalidFormatTokens.slice(0, 3).join(', ')}'. Please enter numbers (e.g. 222-256, 345, or 456, 458).`
      };
    }

    return { serials: resolved };
  };

  const handleAddSerials = () => {
    setSerialError('');
    setLastAddedNotice('');

    const result = parseSerialExpression(serialInput);
    if (result.error) {
      setSerialError(result.error);
      return;
    }

    // Strict validation against active ERP orders ("should not be any invalid serial numbers")
    if (existingUnitsMap.size > 0) {
      const nonExistent = result.serials.filter(itemObj => !existingUnitsMap.has(itemObj.full));
      if (nonExistent.length > 0) {
        const labels = nonExistent.map(x => x.display || x.full);
        if (labels.length === 1) {
          setSerialError(`Serial number ${labels[0]} does not exist in active orders.`);
        } else if (labels.length <= 5) {
          setSerialError(`The following serial numbers do not exist in active orders: ${labels.join(', ')}.`);
        } else {
          setSerialError(`${labels.length} serial numbers do not exist in active orders (e.g. ${labels.slice(0, 4).join(', ')}...).`);
        }
        return;
      }
    }

    const activePos = poEntries
      .map((p, idx) => ({
        id: p.id || idx + 1,
        poNumber: (p.poNumber || '').trim(),
        date: p.date || getTodayDateStr(),
        dateReceived: null
      }))
      .filter(p => p.poNumber);

    const posToAssign = activePos.length > 0
      ? activePos
      : [{
          id: 1,
          poNumber: `PO-${new Date().getFullYear()}-1`,
          date: getTodayDateStr(),
          dateReceived: null
        }];

    const primaryPoNum = posToAssign[0].poNumber;
    const currentDate = posToAssign[0].date;

    setSerials(prev => {
      const existingMap = new Map(
        prev.map(item => [
          item.serialNumber.toLowerCase(),
          { ...item, categories: { ...(item.categories || {}) } }
        ])
      );

      for (const itemObj of result.serials) {
        const cleanSn = String(itemObj.full || itemObj).trim();
        const displaySn = String(itemObj.display || cleanSn);
        if (!cleanSn) continue;
        const key = cleanSn.toLowerCase();

        const currentEntry = existingMap.get(key) || {
          id: 'sn-' + cleanSn,
          serialNumber: cleanSn,
          displaySerial: displaySn,
          categories: {
            'Panel': null,
            'Automation': null,
            'Low voltage': null,
            'Wires & Accessories': null
          }
        };

        currentEntry.displaySerial = displaySn;

        // Attach all active POs to the current category column
        currentEntry.categories = {
          ...currentEntry.categories,
          [category]: {
            poNumber: primaryPoNum,
            date: currentDate,
            dateReceived: null,
            pos: posToAssign
          }
        };

        existingMap.set(key, currentEntry);
      }

      return Array.from(existingMap.values());
    });

    setSerialInput('');
    setTimeout(() => {
      serialInputRef.current?.focus();
    }, 50);

    const noticeMsg = `Recorded ${result.serials.length} serial${result.serials.length > 1 ? 's' : ''} under ${category}`;
    setLastAddedNotice(noticeMsg);
    setTimeout(() => setLastAddedNotice(''), 3500);
  };

  const handleRemoveSerial = (id) => {
    setSerials(prev => prev.filter(s => s.id !== id));
  };

  const handleClearAllSerials = () => {
    if (serials.length === 0) return;
    setSerials([]);
    setSerialError('');
  };

  const handleSave = () => {
    const populatedPoList = poEntries.map((p, idx) => ({
      id: p.id,
      poNumber: p.poNumber.trim() || `PO-${new Date().getFullYear()}-${idx + 1}`,
      date: p.date,
      isPrimary: idx === 0
    }));

    const primaryPoNum = populatedPoList[0].poNumber;

    // Build order record ensuring any operation references the date created with the first PO only
    const orderRecord = {
      id: 'PO-' + Date.now(),
      category,
      primaryOperationDate: populatedPoList[0].date,
      orderDate: populatedPoList[0].date,
      pos: populatedPoList,
      totalPos: populatedPoList.length,
      serials: serials.map(s => ({
        id: s.id,
        serialNumber: s.serialNumber,
        categories: s.categories,
        panel: getCategoryData(s, 'Panel'),
        automation: getCategoryData(s, 'Automation'),
        lowVoltage: getCategoryData(s, 'Low voltage'),
        wiresAccessories: getCategoryData(s, 'Wires & Accessories')
      })),
      totalSerials: serials.length,
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
    setTimeout(() => setSavedSuccess(false), 4500);
    // Explicitly does NOT close modal so user can view/verify the table output!
  };

  // Support Ctrl+S / Cmd+S keyboard shortcut to save
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
  }, [isOpen, category, poEntries, serials]);

  if (!isOpen) return null;

  const currentCategory = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const CategoryIcon = currentCategory.icon;
  const allEnteredPos = poEntries.map(p => p.poNumber.trim()).filter(Boolean);
  const poCount = allEnteredPos.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Purchase Order"
      subtitle="Procurement & Buying · Create vendor order and assign panel serial numbers"
      maxWidth="1200px"
      width="96%"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* ── 1. Top Control Bar: Category Dropdown & PO Entries Cluster ── */}
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
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '18px', flexWrap: 'wrap' }}>
            {/* Category Dropdown (Left Column) */}
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
                    minWidth: '160px',
                    maxWidth: '220px',
                    height: '32px',
                    padding: '0 32px 0 10px',
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
                    right: '10px',
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

            {/* PO Entries Cluster */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px',
                flex: 1,
                minWidth: '240px'
              }}
            >
              {poEntries.map((entry, index) => {
                const isFirstPo = index === 0;
                const isFocused = focusedPoId === entry.id;
                const inputWidth = Math.max(120, Math.min(220, ((entry.poNumber || '').length || 6) * 8.5 + 24));

                return (
                  <div key={entry.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: 'fit-content' }}>
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
                            padding: '0 4px',
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

                    <input
                      id={`po-input-${entry.id}`}
                      type="text"
                      value={entry.poNumber}
                      onChange={(e) => handlePoNumberChange(entry.id, e.target.value)}
                      onFocus={() => setFocusedPoId(entry.id)}
                      onBlur={() => setFocusedPoId(null)}
                      placeholder="e.g. PO-2026-001"
                      aria-label={isFirstPo ? 'Primary Purchase Order Number' : `Purchase Order Number ${index + 1}`}
                      style={{
                        width: `${inputWidth}px`,
                        height: '32px',
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

                    {/* Auto-date badge */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        width: 'fit-content',
                        padding: '2px 7px',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono, monospace)',
                        fontWeight: 600,
                        color: 'var(--text2)',
                        background: 'var(--bg4)',
                        border: '1px solid var(--border2)',
                        borderRadius: '4px',
                        userSelect: 'none',
                        letterSpacing: '0.02em',
                        lineHeight: '14px'
                      }}
                      title="Auto-recorded creation date"
                    >
                      <Calendar size={10} style={{ opacity: 0.7 }} />
                      <span>{entry.date}</span>
                    </div>
                  </div>
                );
              })}

              {/* Add PO Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ height: '16px' }} />
                <button
                  type="button"
                  onClick={handleAddPoEntry}
                  style={{
                    height: '32px',
                    padding: '0 12px',
                    fontSize: '12px',
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

              {/* Primary PO Save Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginLeft: 'auto' }}>
                <div style={{ height: '16px' }} />
                <button
                  type="button"
                  onClick={handleSave}
                  style={{
                    height: '32px',
                    padding: '0 14px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'var(--green, #10b981)',
                    color: '#ffffff',
                    border: 'none',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                    boxSizing: 'border-box',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.92';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Save size={13} />
                  <span>Save</span>
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
                Saved successfully! ({category} order recorded with {serials.length} serial{serials.length === 1 ? '' : 's'} linked). Modal remains open for review.
              </span>
            </div>
          )}
        </div>

        {/* ── 2. Serial Number Entry Controls (Range & Manual) ── */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: 'var(--card-shadow, 0 1px 4px rgba(0, 0, 0, 0.08))'
          }}
        >
          {/* Single Input Box matching user request: e.g. 222-256, 345, or 456, 458  [ Save ] */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <input
              ref={serialInputRef}
              type="text"
              value={serialInput}
              onChange={(e) => {
                setSerialInput(e.target.value);
                if (serialError) setSerialError('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSerials();
                }
              }}
              placeholder="Enter serial number(s)"
              aria-label="Enter serial number(s)"
              style={{
                width: '380px',
                height: '34px',
                padding: '0 12px',
                fontSize: '12.5px',
                fontFamily: 'var(--font-mono, monospace)',
                fontWeight: 600,
                color: 'var(--text)',
                background: 'var(--bg3)',
                border: '1.5px solid var(--border2)',
                borderRadius: '6px',
                outline: 'none',
                boxSizing: 'border-box',
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
            />

            {/* Green Save Button */}
            <button
              type="button"
              onClick={handleAddSerials}
              title="Save serials to list"
              style={{
                height: '34px',
                padding: '0 16px',
                fontSize: '12.5px',
                fontWeight: 600,
                borderRadius: '6px',
                border: 'none',
                background: 'var(--green, #10b981)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.28)',
                boxSizing: 'border-box',
                transition: 'opacity 0.15s ease, transform 0.1s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.92';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Save size={13.5} />
              <span>Save</span>
            </button>

            {lastAddedNotice && (
              <span style={{ fontSize: '12px', color: 'var(--green, #10b981)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', marginLeft: '4px' }}>
                <Check size={13} />
                <span>{lastAddedNotice}</span>
              </span>
            )}

          </div>

          {/* Validation Error Banner */}
          {serialError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                color: 'var(--red, #ef4444)',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              <span>{serialError}</span>
            </div>
          )}
        </div>

        {/* ── 3. Table Output of Serial Numbers (with X Remove) ── */}
        <div
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: 'var(--card-shadow, 0 1px 4px rgba(0, 0, 0, 0.08))'
          }}
        >
          {/* Table Header Bar */}
          <div
            style={{
              padding: '12px 18px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg3)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono, monospace)',
                  color: 'var(--blue, #38bdf8)',
                  background: 'var(--blue-dim, rgba(56, 189, 248, 0.15))',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}
              >
                {serials.length} Serial{serials.length === 1 ? '' : 's'}
                {hasRanges && ` (${groups.length} Group${groups.length === 1 ? '' : 's'})`}
              </span>

              {hasRanges && (
                <button
                  type="button"
                  onClick={toggleExpandAll}
                  style={{
                    height: '24px',
                    padding: '0 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--text2)',
                    background: 'var(--bg4)',
                    border: '1px solid var(--border)',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--blue, #38bdf8)';
                    e.currentTarget.style.color = 'var(--text)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text2)';
                  }}
                >
                  {allExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                  <span>{allExpanded ? 'Collapse Ranges' : 'Expand Ranges'}</span>
                </button>
              )}
            </div>

            {serials.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllSerials}
                title="Remove all serials from list"
                style={{
                  height: '26px',
                  padding: '0 10px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--red, #ef4444)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--red, #ef4444)';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.08)';
                  e.currentTarget.style.color = 'var(--red, #ef4444)';
                }}
              >
                <Trash2 size={12} />
                <span>Clear All</span>
              </button>
            )}
          </div>

          {/* Table Container */}
          <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {serials.length === 0 ? (
              <div
                style={{
                  padding: '48px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: currentCategory.bgColor,
                    color: currentCategory.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CategoryIcon size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                    No Serial Numbers Added Yet
                  </div>
                </div>
              </div>
            ) : (
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  textAlign: 'left',
                  fontSize: '12.5px'
                }}
              >
                <thead>
                  <tr
                    style={{
                      position: 'sticky',
                      top: 0,
                      background: 'var(--bg3)',
                      borderBottom: '1.5px solid var(--border)',
                      zIndex: 2,
                      userSelect: 'none'
                    }}
                  >
                    <th
                      style={{
                        padding: '11px 16px',
                        width: '180px',
                        color: 'var(--text)',
                        fontSize: '12px',
                        fontWeight: 700,
                        borderRight: '1px solid var(--border)'
                      }}
                    >
                      Sr.
                    </th>
                    <th
                      style={{
                        padding: '11px 16px',
                        color: 'var(--text)',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                        <span style={{ color: currentCategory.color, display: 'inline-flex', alignItems: 'center' }}>
                          <CategoryIcon size={14} />
                        </span>
                        <span>{category}</span>
                      </div>
                    </th>
                    <th
                      style={{
                        padding: '11px 16px',
                        textAlign: 'right',
                        color: 'var(--text)',
                        fontSize: '12px',
                        fontWeight: 700,
                        width: '80px',
                        borderLeft: '1px solid var(--border)'
                      }}
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groups.map((grp) => {
                    const isExpanded = expandedGroupIds.has(grp.id);
                    const pos = getCategoryPos(grp.sampleItem, category, poEntries);

                    return (
                      <tr
                        key={grp.id}
                        style={{
                          borderBottom: '1px solid var(--border)',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--bg3)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {/* Sr. Column */}
                        <td
                          style={{
                            padding: '12px 16px',
                            verticalAlign: 'middle',
                            borderRight: '1px solid var(--border)',
                            width: '180px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono, monospace)',
                                fontWeight: 700,
                                fontSize: '13px',
                                color: 'var(--text)',
                                letterSpacing: '0.02em'
                              }}
                            >
                              {grp.displayLabel}
                            </span>

                            {grp.isRange && (
                              <button
                                type="button"
                                onClick={() => toggleGroupExpand(grp.id)}
                                aria-expanded={isExpanded}
                                aria-controls={`range-tray-${grp.id}`}
                                aria-label={`Range of ${grp.count} panels from ${grp.displayLabel}. Click to ${isExpanded ? 'collapse' : 'expand'} individual panels.`}
                                title={isExpanded ? 'Click to collapse individual panels' : `Click to expand ${grp.count} individual panels`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  height: '22px',
                                  padding: '0 8px',
                                  borderRadius: '12px',
                                  background: isExpanded ? 'var(--blue, #38bdf8)' : 'rgba(56, 189, 248, 0.16)',
                                  color: isExpanded ? '#0f172a' : 'var(--blue, #38bdf8)',
                                  border: isExpanded ? '1px solid var(--blue, #38bdf8)' : '1px solid rgba(56, 189, 248, 0.45)',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.15s ease',
                                  userSelect: 'none'
                                }}
                                onMouseEnter={(e) => {
                                  if (!isExpanded) {
                                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.26)';
                                    e.currentTarget.style.borderColor = 'var(--blue, #38bdf8)';
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isExpanded) {
                                    e.currentTarget.style.background = 'rgba(56, 189, 248, 0.16)';
                                    e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                                  }
                                }}
                              >
                                <span>{grp.count} {grp.count === 1 ? 'Panel' : 'Panels'}</span>
                                {isExpanded ? <ChevronUp size={11} style={{ strokeWidth: 2.5 }} /> : <ChevronDown size={11} style={{ strokeWidth: 2.5 }} />}
                              </button>
                            )}
                          </div>
                        </td>

                        {/* Selected Category Column (Horizontal POs utilizing horizontal space with no overflow) */}
                        <td style={{ padding: '10px 16px', verticalAlign: 'middle' }}>
                          {pos.length === 0 ? (
                            <span style={{ color: 'var(--text3)', fontSize: '13px' }}>—</span>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {/* Responsive PO cards grid avoiding overflow */}
                              <div
                                style={{
                                  display: 'grid',
                                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                                  gap: '10px',
                                  width: '100%'
                                }}
                              >
                                {pos.map((po, pIdx) => (
                                  <div
                                    key={po.id || pIdx}
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      gap: '4px',
                                      padding: '7px 12px',
                                      background: 'var(--bg3)',
                                      border: '1px solid var(--border2)',
                                      borderRadius: '6px',
                                      minWidth: 0,
                                      boxSizing: 'border-box',
                                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
                                    }}
                                  >
                                    {/* Line 1: PO no – [poNumber] */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', minWidth: 0, overflow: 'hidden' }}>
                                        <span style={{ color: 'var(--text2)', fontWeight: 600, fontSize: '11.5px', whiteSpace: 'nowrap' }}>
                                          PO no –
                                        </span>
                                        <span
                                          style={{
                                            fontFamily: 'var(--font-mono, monospace)',
                                            fontWeight: 700,
                                            color: 'var(--blue, #38bdf8)',
                                            fontSize: '12.5px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                          }}
                                        >
                                          {po.poNumber}
                                        </span>
                                      </div>
                                      {pos.length > 1 && (
                                        <span
                                          style={{
                                            fontSize: '9.5px',
                                            fontWeight: 700,
                                            color: 'var(--text2)',
                                            background: 'var(--bg4)',
                                            padding: '1px 5px',
                                            borderRadius: '4px',
                                            border: '1px solid var(--border)',
                                            whiteSpace: 'nowrap',
                                            flexShrink: 0
                                          }}
                                        >
                                          PO {pIdx + 1}
                                        </span>
                                      )}
                                    </div>

                                    {/* Line 2: Given Date – Date Received (Wrap safely, no overflow or clipping) */}
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexWrap: 'wrap',
                                        gap: '4px 8px',
                                        fontSize: '11px',
                                        color: 'var(--text3)'
                                      }}
                                    >
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        <strong style={{ color: 'var(--text2)', fontWeight: 600 }}>Given Date –</strong> {po.date || '—'}
                                      </span>
                                      <span style={{ color: 'var(--border2)' }}>·</span>
                                      <span style={{ whiteSpace: 'nowrap' }}>
                                        <strong style={{ color: 'var(--text2)', fontWeight: 600 }}>Date Received –</strong>{' '}
                                        <span
                                          style={{
                                            color: po.dateReceived ? 'var(--green, #10b981)' : 'var(--orange, #f97316)',
                                            fontWeight: 600
                                          }}
                                        >
                                          {po.dateReceived || 'Pending'}
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* If Expanded, show horizontal chips for individual serials */}
                              {grp.isRange && isExpanded && (
                                <div
                                  id={`range-tray-${grp.id}`}
                                  style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    padding: '8px 12px',
                                    background: 'var(--bg4)',
                                    border: '1px dashed var(--border2)',
                                    borderRadius: '6px',
                                    alignItems: 'center'
                                  }}
                                >
                                  <span style={{ fontSize: '11px', color: 'var(--text3)', fontWeight: 600, marginRight: '4px' }}>
                                    Individual Panels ({grp.count}):
                                  </span>
                                  {grp.items.map((subItem) => {
                                    const completeSn = String(subItem.serialNumber);
                                    return (
                                      <span
                                        key={subItem.id}
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '4px',
                                          padding: '2px 7px',
                                          borderRadius: '4px',
                                          background: 'var(--bg2)',
                                          border: '1px solid var(--border)',
                                          fontSize: '11.5px',
                                          fontWeight: 600,
                                          fontFamily: 'var(--font-mono, monospace)',
                                          color: 'var(--text)'
                                        }}
                                      >
                                        <span>{completeSn}</span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveSerial(subItem.id);
                                          }}
                                          title={`Remove serial ${completeSn}`}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text3)',
                                            cursor: 'pointer',
                                            padding: 0,
                                            display: 'inline-flex',
                                            alignItems: 'center'
                                          }}
                                          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--red, #ef4444)'; }}
                                          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text3)'; }}
                                        >
                                          <X size={10} />
                                        </button>
                                      </span>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Action: Remove */}
                        <td
                          style={{
                            padding: '10px 16px',
                            textAlign: 'right',
                            verticalAlign: 'middle',
                            borderLeft: '1px solid var(--border)',
                            width: '80px'
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveGroup(grp)}
                            title={grp.isRange ? `Remove batch (${grp.displayLabel})` : `Remove serial ${grp.displayLabel}`}
                            aria-label={grp.isRange ? `Remove batch (${grp.displayLabel})` : `Remove serial ${grp.displayLabel}`}
                            style={{
                              height: '24px',
                              padding: '0 8px',
                              fontSize: '11px',
                              fontWeight: 600,
                              color: 'var(--red, #ef4444)',
                              background: 'rgba(239, 68, 68, 0.08)',
                              border: '1px solid rgba(239, 68, 68, 0.25)',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
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
                            <X size={10} style={{ strokeWidth: 2.4 }} />
                            <span>Remove</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── 4. Modal Bottom Action Bar ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '10px',
            borderTop: '1px solid var(--border)'
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text3)' }}>
            Order Summary: <strong style={{ color: 'var(--text)' }}>{category} - {serials.length}</strong> · <strong style={{ color: 'var(--text)' }} title={allEnteredPos.length > 0 ? allEnteredPos.join(', ') : undefined}>POs - {poCount}</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

            <button
              type="button"
              onClick={handleSave}
              style={{
                height: '36px',
                padding: '0 20px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                background: 'var(--green, #10b981)',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.28)',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.94';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Save size={14} />
              <span>Save Order</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

