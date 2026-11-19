import { useState, useEffect, useRef } from 'react';
import { DEFAULT_COL_WIDTHS, MIN_COL_WIDTHS } from '../../tableColumnSizing';
import { isDateTimeType } from '../../allOrdersTable/dates';

/**
 * Column widths of the All Orders table: initial widths (saved erp_all_colWidths_v16 / v15, else
 * the defaults), debounced saving to localStorage, and drag-to-resize from the header handle.
 * Moved unchanged from AllOrdersTableView (Task D step 4) and called where these hooks used to be,
 * so React sees the same hooks on every render.
 */
export default function useColumnWidths({ allColumns }) {
  // Column Widths (Resizing)
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const savedV16 = localStorage.getItem('erp_all_colWidths_v16');
      if (savedV16) {
        const parsed = JSON.parse(savedV16);
        const merged = { ...DEFAULT_COL_WIDTHS };
        for (const k of Object.keys(DEFAULT_COL_WIDTHS)) {
          if (parsed[k] !== undefined) {
            const minSafe = MIN_COL_WIDTHS[k] || 85;
            merged[k] = Math.max(Number(parsed[k]) || minSafe, minSafe);
          }
        }
        for (const [k, v] of Object.entries(parsed)) {
          if (merged[k] === undefined && typeof v === 'number') {
            merged[k] = Math.max(v, MIN_COL_WIDTHS[k] || 85);
          }
        }
        return merged;
      }
      // Migrate from v15 if available, but clamp strictly to new safe MIN_COL_WIDTHS
      const savedV15 = localStorage.getItem('erp_all_colWidths_v15');
      if (savedV15) {
        const parsed = JSON.parse(savedV15);
        const merged = { ...DEFAULT_COL_WIDTHS };
        for (const k of Object.keys(DEFAULT_COL_WIDTHS)) {
          const minSafe = MIN_COL_WIDTHS[k] || 85;
          if (parsed[k] !== undefined) {
            merged[k] = Math.max(Number(parsed[k]) || (DEFAULT_COL_WIDTHS[k] || minSafe), minSafe);
          }
        }
        return merged;
      }
      return { ...DEFAULT_COL_WIDTHS };
    } catch (e) {
      return { ...DEFAULT_COL_WIDTHS };
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('erp_all_colWidths_v16', JSON.stringify(columnWidths));
      } catch (err) {
        console.error('Failed to save colWidths', err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [columnWidths]);

  const rafResizeRef = useRef(null);

  const handleResizeStart = (e, colKey) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const startWidth = columnWidths[colKey] || DEFAULT_COL_WIDTHS[colKey] || 120;
    const colDef = allColumns?.find(c => c.key === colKey);
    const minSafe = MIN_COL_WIDTHS[colKey] || (isDateTimeType(colDef?.fieldType) ? 165 : 80);

    document.body.classList.add('resizing-active');
    let latestWidth = startWidth;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      latestWidth = Math.max(minSafe, startWidth + (moveEvent.pageX - startX));

      if (!rafResizeRef.current) {
        rafResizeRef.current = requestAnimationFrame(() => {
          setColumnWidths(prev => {
            if (prev[colKey] === latestWidth) return prev;
            return {
              ...prev,
              [colKey]: latestWidth
            };
          });
          rafResizeRef.current = null;
        });
      }
    };

    const onMouseUp = () => {
      if (rafResizeRef.current) {
        cancelAnimationFrame(rafResizeRef.current);
        rafResizeRef.current = null;
      }
      document.body.classList.remove('resizing-active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      setColumnWidths(prev => {
        const finalMap = { ...prev, [colKey]: latestWidth };
        try {
          localStorage.setItem('erp_all_colWidths_v16', JSON.stringify(finalMap));
        } catch (err) {
          console.error('Failed to save colWidths', err);
        }
        return finalMap;
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return {
    columnWidths, setColumnWidths, handleResizeStart,
  };
}
