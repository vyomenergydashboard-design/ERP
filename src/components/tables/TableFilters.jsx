import React from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';
import SearchInput from '../common/SearchInput';
import Button from '../common/Button';

/**
 * Enterprise TableFilters Toolbar (ERPNext List Filter Bar style)
 */
export default function TableFilters({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search units, orders, serials, clients...',
  departments = [],
  currentDepartment = 'all',
  onDepartmentChange = null,
  statuses = [],
  currentStatus = 'all',
  onStatusChange = null,
  priorities = [],
  currentPriority = 'all',
  onPriorityChange = null,
  onResetFilters = null,
  activeFilterCount = 0,
  extraActions = null,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`erp-table-filters ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10,
        padding: '8px 14px',
        background: 'var(--bg2, #1c202b)',
        borderBottom: '1px solid var(--border, #2e3547)',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {/* Left Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, flex: 1, minWidth: 260 }}>
        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          size="sm"
          style={{ width: 260 }}
        />

        {/* Department Filter (if provided) */}
        {departments && departments.length > 0 && onDepartmentChange && (
          <select
            value={currentDepartment}
            onChange={(e) => onDepartmentChange(e.target.value)}
            style={{
              height: 28,
              padding: '0 8px',
              fontSize: 12,
              fontFamily: 'inherit',
              fontWeight: 500,
              background: 'var(--bg3, #242937)',
              color: currentDepartment !== 'all' ? 'var(--blue, #38bdf8)' : 'var(--text2, #cbd5e1)',
              border: `1px solid ${currentDepartment !== 'all' ? 'var(--blue, #38bdf8)' : 'var(--border, #2e3547)'}`,
              borderRadius: 'var(--radius-sm, 4px)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id || dept} value={dept.id || dept}>
                {dept.label || dept}
              </option>
            ))}
          </select>
        )}

        {/* Status Filter (if provided) */}
        {statuses && statuses.length > 0 && onStatusChange && (
          <select
            value={currentStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            style={{
              height: 28,
              padding: '0 8px',
              fontSize: 12,
              fontFamily: 'inherit',
              fontWeight: 500,
              background: 'var(--bg3, #242937)',
              color: currentStatus !== 'all' ? 'var(--blue, #38bdf8)' : 'var(--text2, #cbd5e1)',
              border: `1px solid ${currentStatus !== 'all' ? 'var(--blue, #38bdf8)' : 'var(--border, #2e3547)'}`,
              borderRadius: 'var(--radius-sm, 4px)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Statuses</option>
            {statuses.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        )}

        {/* Priority Filter (if provided) */}
        {priorities && priorities.length > 0 && onPriorityChange && (
          <select
            value={currentPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            style={{
              height: 28,
              padding: '0 8px',
              fontSize: 12,
              fontFamily: 'inherit',
              fontWeight: 500,
              background: 'var(--bg3, #242937)',
              color: currentPriority !== 'all' ? 'var(--orange, #f97316)' : 'var(--text2, #cbd5e1)',
              border: `1px solid ${currentPriority !== 'all' ? 'var(--orange, #f97316)' : 'var(--border, #2e3547)'}`,
              borderRadius: 'var(--radius-sm, 4px)',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Priorities</option>
            {priorities.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        )}

        {/* Clear Filters Button */}
        {activeFilterCount > 0 && onResetFilters && (
          <Button
            variant="ghost"
            size="xs"
            onClick={onResetFilters}
            icon={RotateCcw}
            title="Reset all filters"
            style={{ color: 'var(--text3)' }}
          >
            Reset
          </Button>
        )}
      </div>

      {/* Right Controls / Extra Actions */}
      {extraActions && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {extraActions}
        </div>
      )}
    </div>
  );
}

