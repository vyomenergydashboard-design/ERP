import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Check, X, ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const HOURS_12 = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

/**
 * Format timestamp or ISO string to short Date + Time: "DD/MM/YYYY, hh:mm a"
 */
export const formatCellDateTime = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day}/${month}/${year}, ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

/**
 * Converts ISO/Date to local "HH:mm"
 */
const getTimePart = (val) => {
  const d = val ? new Date(val) : new Date();
  if (isNaN(d.getTime())) return '09:00';
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm}`;
};

/**
 * Parses "HH:mm" into 12-hour parts { hour, minute, ampm }
 */
const parseTimeParts = (timeStr) => {
  const [h, m] = (timeStr || '09:00').split(':').map(Number);
  const ampm = (h >= 12) ? 'PM' : 'AM';
  const hh12 = (h % 12) || 12;
  const mm = isNaN(m) ? 0 : m;
  return {
    hour: String(hh12).padStart(2, '0'),
    minute: String(mm).padStart(2, '0'),
    ampm
  };
};

/**
 * Formats 12-hour parts back to "HH:mm" (24-hour)
 */
const formatTimeFromParts = (hour, minute, ampm) => {
  let h = Number(hour) || 12;
  const m = Number(minute) || 0;
  if (ampm === 'PM') {
    if (h !== 12) h += 12;
  } else {
    if (h === 12) h = 0;
  }
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

/**
 * ProductionDateTimeCell
 * 
 * Clean, compact Date & Time picker for Production milestones.
 * Features an integrated calendar popup with selectable dropdowns for Time
 * and the [✓ Save] button positioned cleanly at the right bottom of the calendar.
 */
export default function ProductionDateTimeCell({
  value,
  canEdit = false,
  onSave,
  placeholder = '+ Set Date & Time',
  title = 'Click to edit date & time'
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => (value ? new Date(value) : new Date()));
  const [viewYear, setViewYear] = useState(() => (value ? new Date(value).getFullYear() : new Date().getFullYear()));
  const [viewMonth, setViewMonth] = useState(() => (value ? new Date(value).getMonth() : new Date().getMonth()));
  const [timeStr, setTimeStr] = useState(() => getTimePart(value));
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 });

  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const { hour: curHour, minute: curMinute, ampm: curAmpm } = useMemo(
    () => parseTimeParts(timeStr),
    [timeStr]
  );

  const startEditing = (e) => {
    if (!canEdit) return;
    e?.stopPropagation();

    const d = value ? new Date(value) : new Date();
    const validD = isNaN(d.getTime()) ? new Date() : d;

    setSelectedDate(validD);
    setViewYear(validD.getFullYear());
    setViewMonth(validD.getMonth());
    setTimeStr(getTimePart(value));

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 260;
      const popoverHeight = 310;
      let left = rect.left;
      let top = rect.bottom + 4;

      if (top + popoverHeight > window.innerHeight) {
        top = Math.max(10, rect.top - popoverHeight - 4);
      }
      if (left + popoverWidth > window.innerWidth) {
        left = Math.max(10, window.innerWidth - popoverWidth - 10);
      }
      setPopoverPos({ top, left });
    }

    setIsEditing(true);
  };

  useEffect(() => {
    if (!isEditing) return;

    const handleMouseDownOutside = (e) => {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) {
        setIsEditing(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsEditing(false);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleCommit();
      }
    };

    document.addEventListener('mousedown', handleMouseDownOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleMouseDownOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isEditing, selectedDate, timeStr]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day, e) => {
    e.stopPropagation();
    setSelectedDate(new Date(viewYear, viewMonth, day));
  };

  const handleHourChange = (newHour) => {
    setTimeStr(formatTimeFromParts(newHour, curMinute, curAmpm));
  };

  const handleMinuteChange = (newMinute) => {
    setTimeStr(formatTimeFromParts(curHour, newMinute, curAmpm));
  };

  const handleAmpmChange = (newAmpm) => {
    setTimeStr(formatTimeFromParts(curHour, curMinute, newAmpm));
  };

  const handleCommit = () => {
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      onSave?.(null);
      setIsEditing(false);
      return;
    }
    const [hh, mm] = (timeStr || '09:00').split(':').map(Number);
    const resultDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      isNaN(hh) ? 9 : hh,
      isNaN(mm) ? 0 : mm,
      0
    );
    onSave?.(resultDate.toISOString());
    setIsEditing(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSave?.(null);
    setIsEditing(false);
  };

  // Calendar calculations
  const daysInMonth = useMemo(() => new Date(viewYear, viewMonth + 1, 0).getDate(), [viewYear, viewMonth]);
  const firstDayOfWeek = useMemo(() => new Date(viewYear, viewMonth, 1).getDay(), [viewYear, viewMonth]);
  const today = useMemo(() => new Date(), []);

  const yearOptions = useMemo(() => {
    const currentY = new Date().getFullYear();
    const start = Math.min(viewYear - 2, currentY - 5);
    const end = Math.max(viewYear + 2, currentY + 10);
    const years = [];
    for (let y = start; y <= end; y++) {
      years.push(y);
    }
    return years;
  }, [viewYear]);

  const calendarGrid = useMemo(() => {
    const slots = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      slots.push({ type: 'empty', key: `empty-${i}` });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = selectedDate &&
        selectedDate.getFullYear() === viewYear &&
        selectedDate.getMonth() === viewMonth &&
        selectedDate.getDate() === day;

      const isToday = today.getFullYear() === viewYear &&
        today.getMonth() === viewMonth &&
        today.getDate() === day;

      slots.push({ type: 'day', day, isSelected, isToday, key: `day-${day}` });
    }
    return slots;
  }, [firstDayOfWeek, daysInMonth, viewYear, viewMonth, selectedDate, today]);

  return (
    <>
      <span
        ref={triggerRef}
        onClick={startEditing}
        style={{
          color: value ? 'var(--text2)' : (canEdit ? 'var(--blue)' : 'var(--text3)'),
          fontSize: 11.5,
          fontFamily: 'var(--font-mono)',
          cursor: canEdit ? 'pointer' : 'default',
          display: 'inline-flex',
          alignItems: 'center',
          height: 24,
          maxHeight: 24,
          boxSizing: 'border-box',
          padding: canEdit ? '0 7px' : '0 2px',
          borderRadius: 4,
          background: isEditing
            ? 'rgba(56, 189, 248, 0.15)'
            : (value ? 'rgba(255, 255, 255, 0.03)' : (canEdit ? 'rgba(56, 189, 248, 0.06)' : 'transparent')),
          border: isEditing
            ? '1px solid var(--blue)'
            : (value ? '1px solid rgba(255, 255, 255, 0.07)' : (canEdit ? '1px dashed rgba(56, 189, 248, 0.28)' : '1px solid transparent')),
          whiteSpace: 'nowrap',
          verticalAlign: 'middle',
          transition: 'all 0.15s ease'
        }}
        onMouseEnter={(e) => {
          if (canEdit && !isEditing) {
            e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)';
            e.currentTarget.style.color = 'var(--text)';
          }
        }}
        onMouseLeave={(e) => {
          if (canEdit && !isEditing) {
            e.currentTarget.style.borderColor = value ? 'rgba(255, 255, 255, 0.07)' : 'rgba(56, 189, 248, 0.28)';
            e.currentTarget.style.background = value ? 'rgba(255, 255, 255, 0.03)' : 'rgba(56, 189, 248, 0.06)';
            e.currentTarget.style.color = value ? 'var(--text2)' : 'var(--blue)';
          }
        }}
        title={canEdit ? (value ? title : 'Click to set date & time') : undefined}
      >
        {value ? formatCellDateTime(value) : (canEdit ? placeholder : '—')}
      </span>

      {/* Floating Calendar Popover rendered via Portal */}
      {isEditing && createPortal(
        <div
          ref={popoverRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: popoverPos.top,
            left: popoverPos.left,
            zIndex: 99999,
            width: 254,
            boxSizing: 'border-box',
            background: 'var(--bg2, #1e293b)',
            border: '1px solid var(--border, rgba(255, 255, 255, 0.12))',
            borderRadius: 8,
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.45), 0 4px 10px rgba(0,0,0,0.3)',
            padding: 10,
            color: 'var(--text, #f8fafc)',
            fontFamily: 'inherit',
            userSelect: 'none'
          }}
        >
          {/* Calendar Header (Month + Year navigation & selectors) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginBottom: 8 }}>
            <button
              type="button"
              onClick={handlePrevMonth}
              title="Previous month"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border, rgba(255,255,255,0.1))',
                borderRadius: 4,
                width: 22,
                height: 24,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text2, #94a3b8)',
                flexShrink: 0
              }}
            >
              <ChevronLeft size={14} />
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, flex: 1, justifyContent: 'center' }}>
              {/* Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                style={{
                  background: 'var(--bg3, #0f172a)',
                  color: 'var(--text, #f8fafc)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                  borderRadius: 4,
                  padding: '2px 4px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx} style={{ background: 'var(--bg2, #1e293b)', color: '#fff' }}>
                    {name}
                  </option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                style={{
                  background: 'var(--bg3, #0f172a)',
                  color: 'var(--text, #f8fafc)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                  borderRadius: 4,
                  padding: '2px 4px',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {yearOptions.map(y => (
                  <option key={y} value={y} style={{ background: 'var(--bg2, #1e293b)', color: '#fff' }}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleNextMonth}
              title="Next month"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border, rgba(255,255,255,0.1))',
                borderRadius: 4,
                width: 22,
                height: 24,
                padding: 0,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text2, #94a3b8)',
                flexShrink: 0
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Days of week header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAYS_OF_WEEK.map(d => (
              <div
                key={d}
                style={{
                  textAlign: 'center',
                  fontSize: 10.5,
                  fontWeight: 600,
                  color: 'var(--text3, #64748b)',
                  padding: '2px 0'
                }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Month Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {calendarGrid.map((slot) => {
              if (slot.type === 'empty') {
                return <div key={slot.key} style={{ height: 26 }} />;
              }
              const { day, isSelected, isToday } = slot;
              return (
                <button
                  key={slot.key}
                  type="button"
                  onClick={(e) => handleSelectDay(day, e)}
                  style={{
                    height: 26,
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: isSelected ? 700 : (isToday ? 600 : 400),
                    borderRadius: 4,
                    border: isSelected
                      ? 'none'
                      : (isToday ? '1px solid var(--blue, #3b82f6)' : '1px solid transparent'),
                    background: isSelected
                      ? 'var(--blue, #3b82f6)'
                      : (isToday ? 'rgba(56, 189, 248, 0.1)' : 'transparent'),
                    color: isSelected ? '#ffffff' : (isToday ? 'var(--blue, #38bdf8)' : 'var(--text, #f8fafc)'),
                    cursor: 'pointer',
                    transition: 'background-color 0.1s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = isToday ? 'rgba(56, 189, 248, 0.1)' : 'transparent';
                    }
                  }}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Time Selector Dropdowns Row (Select Hour, Minute, AM/PM instead of manual entry) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '6px 8px',
              borderTop: '1px solid var(--border, rgba(255, 255, 255, 0.08))',
              background: 'rgba(0, 0, 0, 0.22)',
              borderRadius: 6,
              marginTop: 8
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text2, #94a3b8)' }}>
              <Clock size={12} style={{ color: 'var(--blue, #38bdf8)' }} />
              <span style={{ fontWeight: 600 }}>Time:</span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              {/* Hour Dropdown */}
              <select
                value={curHour}
                onChange={(e) => handleHourChange(e.target.value)}
                style={{
                  background: 'var(--bg3, #0f172a)',
                  color: 'var(--text, #f8fafc)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                  borderRadius: 4,
                  padding: '3px 4px',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {HOURS_12.map(h => (
                  <option key={h} value={h} style={{ background: 'var(--bg2, #1e293b)', color: '#fff' }}>
                    {h}
                  </option>
                ))}
              </select>

              <span style={{ color: 'var(--text3, #64748b)', fontWeight: 700, fontSize: 11 }}>:</span>

              {/* Minute Dropdown (00 to 59) */}
              <select
                value={curMinute}
                onChange={(e) => handleMinuteChange(e.target.value)}
                style={{
                  background: 'var(--bg3, #0f172a)',
                  color: 'var(--text, #f8fafc)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                  borderRadius: 4,
                  padding: '3px 4px',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {MINUTES.map(m => (
                  <option key={m} value={m} style={{ background: 'var(--bg2, #1e293b)', color: '#fff' }}>
                    {m}
                  </option>
                ))}
              </select>

              {/* AM / PM Dropdown */}
              <select
                value={curAmpm}
                onChange={(e) => handleAmpmChange(e.target.value)}
                style={{
                  background: 'var(--bg3, #0f172a)',
                  color: 'var(--blue, #38bdf8)',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.15))',
                  borderRadius: 4,
                  padding: '3px 4px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="AM" style={{ background: 'var(--bg2, #1e293b)', color: '#fff' }}>AM</option>
                <option value="PM" style={{ background: 'var(--bg2, #1e293b)', color: '#fff' }}>PM</option>
              </select>
            </div>
          </div>

          {/* Footer Actions — [✓ Save] button shifted to right bottom of the calendar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 8,
              paddingTop: 6,
              borderTop: '1px solid var(--border, rgba(255, 255, 255, 0.08))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                title="Cancel (Esc)"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border, rgba(255, 255, 255, 0.1))',
                  borderRadius: 4,
                  padding: '4px 8px',
                  fontSize: 11,
                  color: 'var(--text3, #94a3b8)',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  title="Clear date & time"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 4,
                    padding: '4px 6px',
                    fontSize: 11,
                    color: 'var(--red, #ef4444)',
                    cursor: 'pointer'
                  }}
                >
                  Clear
                </button>
              )}
            </div>

            {/* Save Button (Shifted to right bottom of the calendar) */}
            <button
              type="button"
              onClick={handleCommit}
              title="Save Date & Time (Enter)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                height: 26,
                padding: '0 12px',
                background: 'var(--blue, #3b82f6)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 4,
                fontSize: 11.5,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)'
              }}
            >
              <Check size={13} strokeWidth={2.8} />
              <span>Save</span>
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
