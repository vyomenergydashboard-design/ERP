import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export default function ExcelSheetViewer({ url, fileName, title, onClose, onDownload }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workbook, setWorkbook] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [sheetData, setSheetData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchAndParse = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch file (status: ${res.status})`);
        const buffer = await res.arrayBuffer();
        const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
        if (!isMounted) return;

        if (!wb.SheetNames || wb.SheetNames.length === 0) {
          throw new Error('Workbook contains no sheets');
        }

        setWorkbook(wb);
        setSheets(wb.SheetNames);
        setActiveSheet(wb.SheetNames[0]);
      } catch (err) {
        console.error('Error reading Excel spreadsheet:', err);
        if (isMounted) setError(err.message || 'Could not parse Excel spreadsheet');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (url) fetchAndParse();
    return () => { isMounted = false; };
  }, [url]);

  useEffect(() => {
    if (!workbook || !activeSheet) return;
    try {
      const ws = workbook.Sheets[activeSheet];
      if (!ws) {
        setSheetData([]);
        return;
      }
      // Read sheet data as raw rows (2D array)
      const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      setSheetData(data);
      setSearchTerm('');
    } catch (err) {
      console.error('Error parsing active sheet:', err);
      setSheetData([]);
    }
  }, [workbook, activeSheet]);

  // Find max columns to keep table uniform
  const maxCols = sheetData.reduce((max, row) => Math.max(max, row ? row.length : 0), 0);

  // Filter rows based on search
  const filteredData = sheetData.filter((row, idx) => {
    if (!searchTerm.trim()) return true;
    if (idx === 0) return true; // Keep header row
    const term = searchTerm.toLowerCase();
    return (row || []).some(cell => String(cell ?? '').toLowerCase().includes(term));
  });

  const headerRow = filteredData[0] || [];
  const bodyRows = filteredData.slice(1);

  return (
    <div
      className="modal-overlay open"
      style={{ zIndex: 1250 }}
      onClick={(e) => { if (e.target.className === 'modal-overlay open') onClose(); }}
    >
      <div
        className="modal"
        style={{
          maxWidth: '1100px',
          width: '95vw',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        {/* Modal Header */}
        <div
          className="modal-header"
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg3)',
            flexShrink: 0
          }}
        >
          <div style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                fontWeight: '700',
                flexShrink: 0
              }}
            >
              📊
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {title || fileName || 'Excel Spreadsheet Viewer'}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {(fileName?.split('.').pop() || 'XLSX').toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
                {fileName} {bodyRows.length > 0 ? `· ${bodyRows.length} rows` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {url && (
              <a
                href={url}
                download={fileName || 'spreadsheet.xlsx'}
                className="vbtn"
                style={{
                  fontSize: '12px',
                  padding: '6px 14px',
                  background: '#10b981',
                  color: '#fff',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  borderRadius: '6px',
                  fontWeight: '600'
                }}
              >
                <span>Download Excel</span>
                <span>↓</span>
              </a>
            )}
            <button
              className="modal-close"
              onClick={onClose}
              style={{
                fontSize: '18px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text3)',
                padding: '4px 8px'
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sheet Tabs & Search Toolbar */}
        {!loading && !error && (
          <div
            style={{
              padding: '8px 16px',
              borderBottom: '1px solid var(--border)',
              background: 'var(--bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap',
              flexShrink: 0
            }}
          >
            {/* Sheet Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', overflowX: 'auto', maxWidth: '65%' }}>
              <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text3)', marginRight: '6px' }}>Sheets:</span>
              {sheets.map(sheet => {
                const isActive = sheet === activeSheet;
                return (
                  <button
                    key={sheet}
                    type="button"
                    onClick={() => setActiveSheet(sheet)}
                    style={{
                      background: isActive ? 'var(--blue)' : 'var(--bg3)',
                      color: isActive ? '#fff' : 'var(--text2)',
                      border: `1px solid ${isActive ? 'var(--blue)' : 'var(--border)'}`,
                      padding: '4px 10px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      fontWeight: isActive ? '700' : '500',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {sheet}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search cells..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  fontSize: '12px',
                  padding: '4px 10px',
                  width: '180px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: 'var(--text)'
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: '12px' }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Body / Table View */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative', background: 'var(--bg)' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '12px', color: 'var(--text3)' }}>
              <div style={{ fontSize: '28px' }} className="animate-spin">⏳</div>
              <div style={{ fontSize: '14px', fontWeight: '500' }}>Loading spreadsheet data...</div>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '14px', padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px' }}>⚠️</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)' }}>Could not display spreadsheet inline</div>
              <div style={{ fontSize: '13px', color: 'var(--text3)', maxWidth: '440px' }}>{error}</div>
              {url && (
                <a
                  href={url}
                  download={fileName || 'spreadsheet.xlsx'}
                  className="vbtn"
                  style={{
                    background: '#10b981',
                    color: '#fff',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '13px',
                    textDecoration: 'none'
                  }}
                >
                  Download Excel File Instead ↓
                </a>
              )}
            </div>
          ) : sheetData.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text3)', fontStyle: 'italic' }}>
              This sheet is empty.
            </div>
          ) : (
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '12px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace'
              }}
            >
              <thead>
                <tr style={{ background: 'var(--bg3)', position: 'sticky', top: 0, zIndex: 10 }}>
                  <th
                    style={{
                      padding: '8px 10px',
                      borderBottom: '2px solid var(--border)',
                      borderRight: '1px solid var(--border)',
                      color: 'var(--text3)',
                      fontWeight: '700',
                      width: '45px',
                      textAlign: 'center',
                      background: 'var(--bg3)'
                    }}
                  >
                    #
                  </th>
                  {Array.from({ length: maxCols }).map((_, colIdx) => (
                    <th
                      key={colIdx}
                      style={{
                        padding: '8px 12px',
                        borderBottom: '2px solid var(--border)',
                        borderRight: '1px solid var(--border)',
                        color: 'var(--text)',
                        fontWeight: '700',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        background: 'var(--bg3)'
                      }}
                    >
                      {headerRow[colIdx] !== undefined && headerRow[colIdx] !== '' 
                        ? String(headerRow[colIdx]) 
                        : XLSX.utils.encode_col(colIdx)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bodyRows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    style={{
                      background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)',
                      transition: 'background 0.1s ease'
                    }}
                  >
                    <td
                      style={{
                        padding: '6px 10px',
                        borderBottom: '1px solid var(--border)',
                        borderRight: '1px solid var(--border)',
                        color: 'var(--text3)',
                        textAlign: 'center',
                        fontSize: '11px',
                        background: 'var(--bg3)',
                        userSelect: 'none'
                      }}
                    >
                      {rowIdx + 2}
                    </td>
                    {Array.from({ length: maxCols }).map((_, colIdx) => {
                      const val = row ? row[colIdx] : '';
                      const displayVal = val instanceof Date ? val.toLocaleDateString() : (val !== null && val !== undefined ? String(val) : '');
                      const isNumber = !isNaN(Number(val)) && val !== '' && typeof val !== 'boolean';
                      return (
                        <td
                          key={colIdx}
                          style={{
                            padding: '6px 12px',
                            borderBottom: '1px solid var(--border)',
                            borderRight: '1px solid var(--border)',
                            color: displayVal ? 'var(--text)' : 'transparent',
                            whiteSpace: 'nowrap',
                            textAlign: isNumber ? 'right' : 'left',
                            fontFamily: isNumber ? 'var(--font-mono)' : 'inherit'
                          }}
                        >
                          {displayVal || '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '10px 20px',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--bg3)',
            flexShrink: 0
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--text3)' }}>
            Viewing sheet: <strong style={{ color: 'var(--text)' }}>{activeSheet}</strong> ({bodyRows.length} data rows)
          </div>
          <button type="button" className="vbtn" onClick={onClose} style={{ padding: '6px 16px', fontSize: '12px' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
