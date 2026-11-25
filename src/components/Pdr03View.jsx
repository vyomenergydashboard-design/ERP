import { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Printer, ArrowRight } from 'lucide-react';
import { apiFetch } from '../api/client';

export default function Pdr03View({ onNavigateToView, userRole }) {
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // The serial list failed to load; the dropdown then offers a Retry (there is no Refresh button).
  const [listError, setListError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // Loaded form data is stored with the unit it belongs to: { unitId, data } on success,
  // { unitId, error: true } on failure. It only counts while unitId is the selected unit.
  const [sheetState, setSheetState] = useState(null);
  const [sheetRetry, setSheetRetry] = useState(0);
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  const token = localStorage.getItem('token');

  // Fetch all units from backend. Runs when the view opens (it remounts on every visit), so the
  // list is fresh each time; the form data itself is fetched per serial when one is selected.
  const fetchAllUnits = async () => {
    setIsLoading(true);
    setListError(false);
    try {
      const res = await apiFetch(`/api/dept-worklist/all`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setUnits(await res.json());
    } catch (err) {
      console.error('Failed to load units for PRD-03:', err);
      setListError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUnits();
  }, []);

  // Load the form data for the selected serial from the one PRD-03 endpoint.
  // A late response for a previously selected serial is ignored (cancelled flag);
  // bumping sheetRetry re-runs the load for the same serial.
  useEffect(() => {
    setSheetState(null);
    const unitId = selectedUnit?.unit_id;
    if (!unitId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const res = await apiFetch(`/api/units/${unitId}/prd03`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) setSheetState({ unitId, data });
      } catch (err) {
        console.error('Failed to load PRD-03 form data:', err);
        if (!cancelled) setSheetState({ unitId, error: true });
      }
    })();
    return () => { cancelled = true; };
  }, [selectedUnit?.unit_id, sheetRetry]);

  // The sheet is valid only for the serial it was loaded for, so a new serial never
  // shows (or prints) the previous serial's milestone data.
  const selectedUnitId = selectedUnit?.unit_id;
  const stateMatches = !!selectedUnitId && sheetState?.unitId === selectedUnitId;
  const sheet = stateMatches && sheetState.data ? sheetState.data : null;
  const sheetError = stateMatches && !!sheetState.error;
  const sheetReady = !!sheet;
  // A serial is selected but its form data is loading or failed: the sheet must not pass for a real form.
  const sheetBlocked = !!selectedUnitId && !sheetReady;

  // Handle clicking outside of search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered units matching search query
  const filteredUnits = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return units;

    return units.filter(u => {
      const serial = String(u.unit_serial || u.short_serial || '').toLowerCase();
      const order = String(u.order_number || '').toLowerCase();
      const client = String(u.company_name || '').toLowerCase();
      const po = String(u.po_number || '').toLowerCase();
      const desc = String(u.material_description || '').toLowerCase();
      const part = String(u.part_number || '').toLowerCase();
      const tag = String(u.tag || u.reference_number || '').toLowerCase();

      return (
        serial.includes(q) ||
        order.includes(q) ||
        client.includes(q) ||
        po.includes(q) ||
        desc.includes(q) ||
        part.includes(q) ||
        tag.includes(q)
      );
    });
  }, [units, searchQuery]);

  // Auto-select if query matches exact serial
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q) return;
    const exact = units.find(u =>
      String(u.unit_serial || '').trim() === q ||
      String(u.short_serial || '').trim() === q
    );
    if (exact && selectedUnit?.unit_id !== exact.unit_id) {
      setSelectedUnit(exact);
    }
  }, [searchQuery, units]);

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    setIsDropdownOpen(false);
  };

  const handlePrint = () => {
    if (sheetBlocked) return;
    window.print();
  };

  // Format date to DD/MM/YYYY matching document standard
  const formatDate = (val) => {
    if (!val) return '';
    try {
      const d = new Date(val);
      if (isNaN(d.getTime())) return '';
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return '';
    }
  };

  // Cell value from the endpoint: 'YYYY-MM-DD' -> 'DD/MM/YYYY' by rearranging the
  // string (no Date, so no timezone shift); a full ISO timestamp -> formatDate;
  // anything else ('Standard', 'N/A', ...) is shown as is.
  const formatCell = (value) => {
    if (value === null || value === undefined) return '';
    const s = String(value);
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    if (/^\d{4}-\d{2}-\d{2}T/.test(s)) return formatDate(s);
    return s;
  };

  // 10 milestone rows; each key matches a row of sheet.rows from the endpoint
  const milestoneActivities = [
    { key: 'bom', label: 'Production BOM' },
    { key: 'drawing', label: 'Production drawing' },
    { key: 'cabinet', label: 'Electrical cabinet procurement' },
    { key: 'automation', label: 'Automation components procurement' },
    { key: 'low_voltage', label: 'Low voltage components procurement' },
    { key: 'wires', label: 'Wires & Accessories procurement' },
    { key: 'mounting', label: 'Mounting of components' },
    { key: 'wiring', label: 'Electrical wiring' },
    { key: 'internal_inspection', label: 'Internal inspection' },
    { key: 'fat', label: 'Factory acceptance test' }
  ];

  return (
    <div className="prd03-view-container" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      padding: '0 0 32px 0',
      width: '100%'
    }}>

      {/* ── Top Toolbar (Search, Filter, Actions - Hidden when printing) ── */}
      <div className="no-print" style={{
        background: 'var(--bg2, #ffffff)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: 12,
        padding: '14px 20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        maxWidth: 1040,
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
          {/* Search Bar Input with Autocomplete Dropdown */}
          <div ref={searchContainerRef} style={{ position: 'relative', flex: 1 }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              width: '100%'
            }}>
              <Search size={16} style={{
                position: 'absolute',
                left: 14,
                color: 'var(--text3, #94a3b8)',
                pointerEvents: 'none'
              }} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search serial numbers to inspect or print Work Order (e.g. 26270001, Client, PO)..."
                value={searchQuery}
                onFocus={() => setIsDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (filteredUnits.length > 0) {
                      handleSelectUnit(filteredUnits[0]);
                    }
                  }
                }}
                style={{
                  width: '100%',
                  height: 42,
                  borderRadius: 8,
                  background: 'var(--bg3, #f8fafc)',
                  border: '1.5px solid var(--border, #e2e8f0)',
                  padding: '0 112px 0 40px',
                  fontSize: 13,
                  fontWeight: 500,
                  color: 'var(--text, #172033)',
                  outline: 'none',
                  transition: 'all 0.15s ease'
                }}
                onFocusCapture={e => {
                  e.currentTarget.style.borderColor = 'var(--accent, #f97316)';
                  e.currentTarget.style.background = 'var(--bg2, #ffffff)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.12)';
                }}
                onBlurCapture={e => {
                  e.currentTarget.style.borderColor = 'var(--border, #e2e8f0)';
                  e.currentTarget.style.background = 'var(--bg3, #f8fafc)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {/* Clear button and result count share one right-aligned row so they never overlap */}
              <div style={{
                position: 'absolute',
                right: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text3)',
                      cursor: 'pointer',
                      display: 'flex',
                      padding: 4
                    }}
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
                <span style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--text3, #64748b)',
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none'
                }}>
                  {isLoading ? 'Loading…' : `${filteredUnits.length} found`}
                </span>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {isDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '100%',
                maxHeight: 320,
                overflowY: 'auto',
                background: 'var(--bg2, #ffffff)',
                border: '1px solid var(--border, #cbd5e1)',
                borderRadius: 10,
                boxShadow: '0 12px 32px rgba(0,0,0,0.14)',
                zIndex: 100,
                padding: 6
              }}>
                <div style={{
                  padding: '6px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  color: 'var(--text3, #64748b)',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  borderBottom: '1px solid var(--border, #f1f5f9)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span>Matching Serial Numbers</span>
                  <span>Select or press Enter to load</span>
                </div>

                {filteredUnits.length > 0 ? (
                  filteredUnits.map((u) => {
                    const isSelected = selectedUnit?.unit_id === u.unit_id;
                    return (
                      <div
                        key={u.unit_id}
                        onClick={() => handleSelectUnit(u)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 6,
                          borderBottom: '1px solid var(--border, #f1f5f9)',
                          cursor: 'pointer',
                          background: isSelected ? 'var(--blue-dim, #eff6ff)' : 'transparent',
                          transition: 'background 0.12s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = isSelected ? 'var(--blue-dim, #eff6ff)' : 'var(--bg3, #f8fafc)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = isSelected ? 'var(--blue-dim, #eff6ff)' : 'transparent'; }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 12.5,
                              fontWeight: 700,
                              color: 'var(--blue, #0284c7)',
                              background: 'var(--blue-dim, #f0f9ff)',
                              padding: '2px 8px',
                              borderRadius: 4,
                              border: '1px solid rgba(2, 132, 199, 0.2)'
                            }}>
                              {u.unit_serial || u.short_serial}
                            </span>
                            <span style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: 11.5,
                              color: 'var(--text3)',
                              background: 'var(--bg3)',
                              padding: '2px 6px',
                              borderRadius: 4
                            }}>
                              Order #{u.order_number}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: 'var(--text3)',
                              textTransform: 'uppercase'
                            }}>
                              {u.current_dept || 'Sales'}
                            </span>
                            <ArrowRight size={13} style={{ color: 'var(--text3)' }} />
                          </div>
                        </div>

                        <div style={{ fontSize: 11.5, color: 'var(--text2, #475569)', marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {u.company_name && <span style={{ fontWeight: 600, color: 'var(--text)' }}>{u.company_name}</span>}
                          {u.material_description && <span style={{ color: 'var(--text3)' }}>· {u.material_description}</span>}
                          {u.po_number && <span style={{ color: 'var(--text3)' }}>· PO: {u.po_number}</span>}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>
                    {listError ? (
                      <>
                        <div style={{ marginBottom: 10 }}>Could not load serial numbers.</div>
                        <button type="button" className="vbtn" onClick={fetchAllUnits} style={{ fontSize: 12, padding: '6px 16px' }}>
                          Retry
                        </button>
                      </>
                    ) : isLoading ? (
                      'Loading serial numbers…'
                    ) : (
                      `No serial numbers found matching "${searchQuery}"`
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              onClick={handlePrint}
              disabled={sheetBlocked}
              className="vbtn"
              title={sheetBlocked
                ? (sheetError ? 'Form data failed to load. Retry before printing.' : 'Waiting for form data to load')
                : 'Print Production Work Order (PRD-03)'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 12,
                height: 42,
                padding: '0 16px',
                background: 'var(--accent, #f97316)',
                color: '#ffffff',
                border: 'none',
                fontWeight: 600,
                opacity: sheetBlocked ? 0.5 : 1,
                cursor: sheetBlocked ? 'not-allowed' : 'pointer'
              }}
            >
              <Printer size={14} />
              <span>Print Form</span>
            </button>
          </div>
        </div>

        {/* Active Selection Indicator */}
        {selectedUnit && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg3, #f8fafc)',
            border: '1px solid var(--border, #e2e8f0)',
            borderRadius: 8,
            padding: '8px 14px',
            fontSize: 12.5
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{ color: 'var(--text3)', fontWeight: 500 }}>Active Serial:</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--blue, #0284c7)',
                fontSize: 13
              }}>
                {selectedUnit.unit_serial || selectedUnit.short_serial}
              </span>
              <span style={{ color: 'var(--text3)' }}>·</span>
              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{selectedUnit.company_name || 'Customer'}</span>
              <span style={{ color: 'var(--text3)' }}>·</span>
              <span style={{ color: 'var(--text2)' }}>Order #{selectedUnit.order_number}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedUnit(null);
                setSearchQuery('');
                searchInputRef.current?.focus();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent, #f97316)',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer'
              }}
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {sheetError && (
        <div className="no-print" role="alert" style={{
          maxWidth: 1040,
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 16px',
          borderRadius: 8,
          border: '1px solid var(--red, #dc2626)',
          background: 'var(--red-dim, #fef2f2)',
          color: 'var(--red, #dc2626)',
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <span>Could not load form data for this serial. Do not print.</span>
          <button
            type="button"
            onClick={() => setSheetRetry(n => n + 1)}
            style={{
              background: 'none',
              border: '1px solid var(--red, #dc2626)',
              borderRadius: 6,
              color: 'var(--red, #dc2626)',
              fontWeight: 700,
              fontSize: 12,
              padding: '3px 12px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Document Viewer Background (Dark slate canvas matching the PDF reader in the screenshot) ── */}
      <div style={{
        background: '#2a2d32',
        padding: '28px 16px',
        borderRadius: 12,
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.3)',
        overflowX: 'auto',
        display: 'flex'
      }}>

        {/* ── A4 landscape sheet (297mm x 210mm). Sizing is in the <style> block below so the screen
            view and the printout share it. ── */}
        <div className="prd03-sheet">

          {/* Outer black frame: fills the page like the official PRD-03, footer at the bottom */}
          <div className="prd03-frame">

            {/* Shown on screen and in print while a selected serial has no loaded form data */}
            {sheetBlocked && (
              <div role="status" style={{
                border: '3px solid #000000',
                padding: '8px 12px',
                marginBottom: 12,
                textAlign: 'center',
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: '0.5px',
                color: '#000000'
              }}>
                FORM DATA NOT LOADED — DO NOT USE THIS PRINTOUT
              </div>
            )}

            {/* Document Header Row: Title Centered + Logo Top Right */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              minHeight: 46
            }}>
              {/* Left spacer for optical balance */}
              <div style={{ width: 140 }} />

              {/* Title */}
              <h1 style={{
                fontSize: 20,
                fontWeight: 700,
                color: '#000000',
                margin: 0,
                textAlign: 'center',
                letterSpacing: '0.2px',
                fontFamily: 'Arial, Helvetica, sans-serif',
                flex: 1
              }}>
                Production work order
              </h1>

              {/* Logo: Original raster image from the PDF file */}
              <div style={{ width: 140, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <img
                  src="/Image1.jpg"
                  alt="ABSOLUTE Motion Pvt. Ltd."
                  style={{
                    height: 40,
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>
            </div>

            {/* Heavy Horizontal Divider Line Below Header */}
            <div style={{
              height: 2,
              background: '#000000',
              marginTop: 14,
              marginBottom: 10
            }} />

            {/* ── Top 6-Column Metadata Grid (Exact 3 Rows × 6 Columns from PDF) ── */}
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #000000',
              fontSize: 11,
              fontFamily: 'Arial, Helvetica, sans-serif',
              marginBottom: 10
            }}>
              <tbody>
                <tr style={{ height: 23 }}>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', width: '11.0%', whiteSpace: 'nowrap' }}>
                    Client name:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', width: '21.4%' }}>
                    {selectedUnit?.company_name || ''}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', width: '22.2%', whiteSpace: 'nowrap' }}>
                    Production BOM number:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', width: '12.6%' }}>
                    {sheet?.bomNumber || ''}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', width: '13.8%', whiteSpace: 'nowrap' }}>
                    WO Number:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', width: '19.0%' }}>
                    {selectedUnit?.unit_serial || selectedUnit?.short_serial || selectedUnit?.order_number || ''}
                  </td>
                </tr>
                <tr style={{ height: 23 }}>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', whiteSpace: 'nowrap' }}>
                    Project:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px' }}>
                    {sheet?.projectName || ''}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', whiteSpace: 'nowrap' }}>
                    Production Drawing number:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px' }}>
                    {sheet?.drawingNumber || ''}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', whiteSpace: 'nowrap' }}>
                    Order date:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px' }}>
                    {formatCell(selectedUnit?.order_date)}
                  </td>
                </tr>
                <tr style={{ height: 23 }}>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', whiteSpace: 'nowrap' }}>
                    Sales person:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px' }}>
                    {sheet?.salesPerson || ''}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', whiteSpace: 'nowrap' }}>
                    Priority:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px' }}>
                    {selectedUnit?.priority || ''}
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px', whiteSpace: 'nowrap' }}>
                    Delivery date:
                  </td>
                  <td style={{ border: '1px solid #000000', padding: '2px 6px' }}>
                    {formatDate(selectedUnit?.delivery_date)}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* ── Milestones / Activities Table (Exact 5 Columns × 11 Rows from PDF) ── */}
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: '1px solid #000000',
              fontSize: 11,
              fontFamily: 'Arial, Helvetica, sans-serif',
              marginBottom: 10
            }}>
              <thead>
                <tr style={{ height: 23 }}>
                  <th style={{ border: '1px solid #000000', padding: '2px 6px', width: '28.7%' }}></th>
                  <th style={{ border: '1px solid #000000', padding: '2px 6px', width: '13.9%', fontWeight: 'normal', textAlign: 'center' }}>
                    Start date
                  </th>
                  <th style={{ border: '1px solid #000000', padding: '2px 6px', width: '13.9%', fontWeight: 'normal', textAlign: 'center' }}>
                    End date
                  </th>
                  <th style={{ border: '1px solid #000000', padding: '2px 6px', width: '14.8%', fontWeight: 'normal', textAlign: 'center' }}>
                    Reference number
                  </th>
                  <th style={{ border: '1px solid #000000', padding: '2px 6px', width: '28.7%', fontWeight: 'normal', textAlign: 'center' }}>
                    Comments
                  </th>
                </tr>
              </thead>
              <tbody>
                {milestoneActivities.map(({ key, label }) => {
                  const row = sheet?.rows?.find(r => r.key === key);
                  return (
                    <tr key={key} style={{ height: 21 }}>
                      <td style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'left' }}>
                        {label}
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'center' }}>
                        {formatCell(row?.start)}
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'center' }}>
                        {formatCell(row?.end)}
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'center' }}>
                        {row?.reference ?? ''}
                      </td>
                      <td style={{ border: '1px solid #000000', padding: '2px 6px', textAlign: 'center' }}></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* ── Instruction for Dispatch (4 Ruled Lines from PDF) ── */}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontSize: 11, fontFamily: 'Arial, Helvetica, sans-serif', marginBottom: 2 }}>
                Instruction for dispatch:
              </div>
              <div style={{ borderBottom: '1px solid #000000', height: 23, fontSize: 11, lineHeight: '22px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                {sheet?.instructionForDispatch || ''}
              </div>
              <div style={{ borderBottom: '1px solid #000000', height: 23 }} />
              <div style={{ borderBottom: '1px solid #000000', height: 23 }} />
              <div style={{ borderBottom: '1px solid #000000', height: 23 }} />
            </div>

            {/* ── Date of Completion ── */}
            <div style={{
              marginTop: 14,
              fontSize: 11,
              fontFamily: 'Arial, Helvetica, sans-serif'
            }}>
              Date of completion:  {sheet?.dateOfCompletion ? formatCell(sheet.dateOfCompletion) : '__ / __ / ____'}
            </div>

            {/* ── 4 Signatures: pushed down to sit just above the footer, as on the official form ── */}
            <div style={{
              marginTop: 'auto',
              paddingTop: 16,
              marginBottom: 14,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 16,
              textAlign: 'center',
              fontFamily: 'Arial, Helvetica, sans-serif'
            }}>
              <div>
                <div style={{ borderTop: '1px solid #000000', width: 140, margin: '0 auto 4px auto' }} />
                <span style={{ fontSize: 10.5 }}>(Production Manager)</span>
              </div>
              <div>
                <div style={{ borderTop: '1px solid #000000', width: 140, margin: '0 auto 4px auto' }} />
                <span style={{ fontSize: 10.5 }}>(QA / QC Manager)</span>
              </div>
              <div>
                <div style={{ borderTop: '1px solid #000000', width: 140, margin: '0 auto 4px auto' }} />
                <span style={{ fontSize: 10.5 }}>(Dispatch In-charge)</span>
              </div>
              <div>
                <div style={{ borderTop: '1px solid #000000', width: 140, margin: '0 auto 4px auto' }} />
                <span style={{ fontSize: 10.5 }}>(Purchase In-charge)</span>
              </div>
            </div>

            {/* ── Document Footer ── */}
            <div style={{
              borderTop: '1.5px solid #000000',
              paddingTop: 5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 10,
              fontFamily: 'Arial, Helvetica, sans-serif'
            }}>
              <div>Issue No. 01/ Rev.0 dated 01/02/2024</div>
              <div style={{ letterSpacing: '0.4px' }}>PRD-03</div>
            </div>

          </div>
        </div>
      </div>

      {/* A4 landscape sheet (297mm x 210mm) on screen and on paper */}
      <style dangerouslySetInnerHTML={{ __html: `
        .prd03-sheet {
          box-sizing: border-box;
          flex: none;
          display: flex;
          flex-direction: column;
          width: 297mm;
          min-width: 297mm;
          min-height: 210mm;
          margin: 0 auto;
          padding: 9mm 10mm;
          background: #ffffff;
          color: #000000;
          font-family: Arial, Helvetica, sans-serif;
          box-shadow: 0 8px 30px rgba(0,0,0,0.5);
        }
        .prd03-frame {
          box-sizing: border-box;
          flex: 1 0 auto;
          display: flex;
          flex-direction: column;
          border: 1px solid #000000;
          padding: 24px 28px 16px 28px;
        }
        .prd03-frame > * {
          flex-shrink: 0;
        }
        @media print {
          @page {
            size: A4 landscape;
            margin: 0;
          }
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          /* .app is position:relative; overflow:hidden; one screen high, so it was the sheet's
             containing block and cut the bottom of the page off (frame border and footer). */
          .app {
            position: static !important;
          }
          body * {
            visibility: hidden;
          }
          .prd03-sheet, .prd03-sheet * {
            visibility: visible;
          }
          .prd03-sheet {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            box-shadow: none;
            /* 1mm under the page so rounding never adds a blank second page; if the content is
               ever taller, it overflows visibly onto a second page instead of being cut off. */
            height: 209mm;
            min-height: 0;
          }
          .no-print, .header, .sidenav, .vbtn, .order-selector {
            display: none !important;
          }
        }
      `}} />
    </div>
  );
}
