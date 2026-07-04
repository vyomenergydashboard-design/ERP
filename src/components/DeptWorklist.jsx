import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronRight, User } from 'lucide-react';

const PRIORITY_CONFIG = {
  Urgent: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' },
  High:   { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)' },
  Medium: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.3)' },
  Low:    { color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.3)' },
};

const STEP_STATUS_CONFIG = {
  done:       { label: 'Done',        color: '#10b981', bg: 'rgba(16,185,129,0.12)', icon: '✓' },
  inprogress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', icon: '◉' },
  pending:    { label: 'Pending',     color: '#6b7280', bg: 'rgba(107,114,128,0.12)', icon: '○' },
  blocked:    { label: 'Blocked',     color: '#ef4444', bg: 'rgba(239,68,68,0.12)', icon: '✕' },
  review:     { label: 'Review',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)', icon: '⟳' },
};

const DEPT_COLORS = {
  Design:     '#6366f1',
  Purchase:   '#f59e0b',
  Stores:     '#10b981',
  Production: '#3b82f6',
  QC:         '#8b5cf6',
  Dispatch:   '#ec4899',
  Accounts:   '#14b8a6',
  Sales:      '#f97316',
};



function StepPill({ step, onStatusChange, canEdit }) {
  const cfg = STEP_STATUS_CONFIG[step.status] || STEP_STATUS_CONFIG.pending;
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 20,
      background: cfg.bg, border: `1px solid ${cfg.color}33`,
      fontSize: 11, color: cfg.color, fontWeight: 600,
    }}>
      <span>{cfg.icon}</span>
      <span>{step.name}</span>
      {canEdit && (
        <select
          value={step.status}
          onChange={e => onStatusChange(step.id, e.target.value)}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'transparent', border: 'none', color: cfg.color,
            fontSize: 10, cursor: 'pointer', outline: 'none', padding: 0,
          }}
        >
          <option value="pending">Pending</option>
          <option value="inprogress">In Progress</option>
          <option value="done">Done</option>
          <option value="blocked">Blocked</option>
          <option value="review">Review</option>
        </select>
      )}
    </div>
  );
}

function UnitRow({ unit, dept, onStepStatusChange, users, currentUser }) {
  const [expanded, setExpanded] = useState(false);
  const steps = unit.dept_steps || [];
  const doneCount = steps.filter(s => s.status === 'done').length;
  const allDone = doneCount === steps.length && steps.length > 0;
  const hasBlocked = steps.some(s => s.status === 'blocked');

  const getCanEditStep = (step) => {
    return ['Admin', 'Manager'].includes(currentUser.role) || step.dept === currentUser.role;
  };

  const rowBorder = hasBlocked ? 'var(--red)' : allDone ? 'var(--green)' : 'transparent';

  return (
    <>
      <tr
        onClick={() => setExpanded(e => !e)}
        style={{
          cursor: 'pointer',
          borderLeft: `3px solid ${rowBorder}`,
          background: expanded ? 'var(--bg3)' : 'transparent',
          transition: 'background 0.15s',
        }}
        className="worklist-row"
      >
        {/* Order Info */}
        <td style={{ padding: '10px 14px' }}>
          <div style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>
            {unit.order_number}
          </div>
          {unit.company_name && (
            <div style={{ color: 'var(--text3)', fontSize: 11, marginTop: 2 }}>
              🏢 {unit.company_name}{unit.company_city ? ` · ${unit.company_city}` : ''}
            </div>
          )}
        </td>

        {/* Unit ID */}
        <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--text)', fontSize: 13 }}>
          {unit.unit_serial}
        </td>

        {/* Item Details */}
        <td style={{ padding: '10px 14px', color: 'var(--text2)', fontSize: 12 }}>
          {unit.material_description}
          {unit.part_number && (
            <div style={{ color: 'var(--text3)', fontSize: 10, marginTop: 2 }}>Part: {unit.part_number}</div>
          )}
        </td>

        {/* Priority */}
        <td style={{ padding: '10px 14px' }}>
          {(() => {
            const pCfg = PRIORITY_CONFIG[unit.priority] || PRIORITY_CONFIG.Medium;
            return (
              <span style={{
                padding: '3px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                background: pCfg.bg, color: pCfg.color, border: `1px solid ${pCfg.border}`,
                textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {unit.priority}
              </span>
            );
          })()}
        </td>

        {/* Delivery Date */}
        <td style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text2)' }}>
          {unit.delivery_date ? new Date(unit.delivery_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}
        </td>

        {/* Tasks Pills */}
        <td style={{ padding: '10px 14px' }}>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {steps.length === 0 ? (
              <span style={{ color: '#475569', fontSize: 11, fontStyle: 'italic' }}>No steps</span>
            ) : (
              steps.map(step => (
                <StepPill
                  key={step.id}
                  step={step}
                  canEdit={getCanEditStep(step)}
                  onStatusChange={(stepId, val) => onStepStatusChange(unit.unit_id, stepId, val)}
                />
              ))
            )}
          </div>
        </td>

        {/* Progress Summary */}
        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: 12, fontWeight: 700,
            color: allDone ? 'var(--green)' : hasBlocked ? 'var(--red)' : 'var(--text2)',
          }}>
            {allDone ? <CheckCircle2 size={13} /> : hasBlocked ? <AlertCircle size={13} /> : <Clock size={13} />}
            {doneCount}/{steps.length}
          </div>
        </td>

        {/* Expand Action */}
        <td style={{ padding: '10px 14px', textAlign: 'center' }}>
          <span style={{ color: 'var(--text3)', display: 'inline-flex', alignItems: 'center' }}>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </td>
      </tr>

      {expanded && steps.length > 0 && (
        <tr style={{ background: 'var(--bg3)' }}>
          <td colSpan={8} style={{ padding: '12px 24px 16px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {steps.map(step => {
                const cfg = STEP_STATUS_CONFIG[step.status] || STEP_STATUS_CONFIG.pending;
                const assignedUser = users.find(u => u.id === step.assigned_user_id);
                return (
                  <div key={step.id} style={{
                    background: 'var(--bg4)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: '10px 14px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 13 }}>{step.name}</div>
                      {step.notes && (
                        <div style={{ color: 'var(--text3)', fontSize: 11, marginTop: 2, fontStyle: 'italic' }}>
                          {step.notes}
                        </div>
                      )}
                      {assignedUser && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: 'var(--green)', fontSize: 11 }}>
                          <User size={10} />
                          {assignedUser.username}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {step.updated && (
                        <span style={{ color: 'var(--text3)', fontSize: 10 }}>{step.updated}</span>
                      )}
                      {getCanEditStep(step) ? (
                        <select
                           value={step.status}
                           onChange={e => onStepStatusChange(unit.unit_id, step.id, e.target.value)}
                           style={{
                             background: cfg.bg, border: `1px solid ${cfg.color}44`,
                             color: cfg.color, fontSize: 11, borderRadius: 6, padding: '4px 8px',
                             cursor: 'pointer', fontWeight: 600, outline: 'none',
                           }}
                        >
                          <option value="pending">Pending</option>
                          <option value="inprogress">In Progress</option>
                          <option value="done">Done</option>
                          <option value="blocked">Blocked</option>
                          <option value="review">Review</option>
                        </select>
                      ) : (
                        <span style={{
                          background: cfg.bg, border: `1px solid ${cfg.color}44`,
                          color: cfg.color, fontSize: 11, borderRadius: 6, padding: '4px 8px',
                          fontWeight: 600,
                        }}>
                          {cfg.label}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}



export default function DeptWorklist({ dept }) {
  const [units, setUnits]       = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter]     = useState('all'); // 'all' | 'pending' | 'inprogress' | 'done'
  const [search, setSearch]     = useState('');
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const canEdit = ['Admin', 'Manager', dept].includes(currentUser.role);
  const deptColor = DEPT_COLORS[dept] || '#6366f1';

  const fetchWorklist = useCallback(async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const [wRes, uRes] = await Promise.all([
        fetch(`http://localhost:5000/api/dept-worklist/${encodeURIComponent(dept)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:5000/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);
      if (wRes.ok) setUnits(await wRes.json());
      if (uRes.ok) setUsers(await uRes.json());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dept, token]);

  useEffect(() => { fetchWorklist(); }, [fetchWorklist]);

  // Also refresh when orderUpdated event fires
  useEffect(() => {
    const handler = () => fetchWorklist(true);
    window.addEventListener('orderUpdated', handler);
    return () => window.removeEventListener('orderUpdated', handler);
  }, [fetchWorklist]);

  const handleStepStatusChange = async (unitId, stepId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/units/${unitId}/steps/${stepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        // Optimistically update locally
        setUnits(prev => prev.map(u => {
          if (u.unit_id !== unitId) return u;
          return {
            ...u,
            dept_steps: (u.dept_steps || []).map(s =>
              s.id === stepId ? { ...s, status: newStatus } : s
            ),
          };
        }));
        window.dispatchEvent(new CustomEvent('orderUpdated'));
      }
    } catch (err) {
      console.error('Failed to update step', err);
    }
  };

  // Filtering
  const filteredUnits = units.filter(u => {
    if (search.trim() !== '') {
      const tokens = search.trim().toLowerCase().split(/\s+/);
      const serial = (u.unit_serial || '').toLowerCase();
      const orderNum = (u.order_number || '').toLowerCase();
      const material = (u.material_description || '').toLowerCase();
      const company = (u.company_name || '').toLowerCase();
      
      const matchesAllTokens = tokens.every(token => 
        serial.includes(token) || 
        orderNum.includes(token) || 
        material.includes(token) || 
        company.includes(token)
      );
      if (!matchesAllTokens) return false;
    }
    if (filter === 'done') {
      const steps = u.dept_steps || [];
      return steps.length > 0 && steps.every(s => s.status === 'done');
    }
    if (filter === 'inprogress') {
      const steps = u.dept_steps || [];
      return steps.some(s => s.status === 'inprogress');
    }
    if (filter === 'pending') {
      const steps = u.dept_steps || [];
      return steps.every(s => s.status === 'pending') || steps.length === 0;
    }
    return true;
  });


  const totalUnits = units.length;
  const doneUnits = units.filter(u => (u.dept_steps || []).every(s => s.status === 'done') && (u.dept_steps || []).length > 0).length;
  const inProgUnits = units.filter(u => (u.dept_steps || []).some(s => s.status === 'inprogress')).length;
  const blockedUnits = units.filter(u => (u.dept_steps || []).some(s => s.status === 'blocked')).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, gap: 16 }}>
        <div style={{
          width: 48, height: 48, border: `3px solid ${deptColor}33`,
          borderTopColor: deptColor, borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ color: 'var(--text3)', fontSize: 14 }}>Loading {dept} worklist...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '4px 0' }}>
      {/* Header bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 20, flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${deptColor}22`, border: `1px solid ${deptColor}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            {dept === 'Design' ? '✏️' : dept === 'QC' ? '🔬' : dept === 'Production' ? '🔧' :
             dept === 'Purchase' ? '📦' : dept === 'Stores' ? '🏪' :
             dept === 'Dispatch' ? '🚚' : dept === 'Accounts' ? '💼' : '📋'}
          </div>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text)', fontSize: 20, fontWeight: 800 }}>
              {dept} Worklist
            </h2>
            <div style={{ color: 'var(--text3)', fontSize: 12, marginTop: 2 }}>
              {dept === 'Sales' 
                ? `${totalUnits} unit${totalUnits !== 1 ? 's' : ''} total in system`
                : `${totalUnits} unit${totalUnits !== 1 ? 's' : ''} currently in ${dept}`
              }
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchWorklist(true)}
          disabled={refreshing}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'var(--bg4)', border: '1px solid var(--border2)',
            color: 'var(--text2)', fontSize: 12, borderRadius: 8, padding: '7px 14px',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          Refresh
        </button>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Total Units', value: totalUnits, color: deptColor },
          { label: 'In Progress', value: inProgUnits, color: '#f59e0b' },
          { label: 'Completed',   value: doneUnits,   color: '#10b981' },
          { label: 'Blocked',     value: blockedUnits, color: '#ef4444' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
            padding: '14px 16px', textAlign: 'center',
            borderTop: `2px solid ${stat.color}55`,
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter bar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by unit ID, order, item, client..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 220, background: 'var(--bg4)', border: '1px solid var(--border2)',
            borderRadius: 8, padding: '9px 14px', color: 'var(--text)', fontSize: 13,
            outline: 'none', transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = deptColor}
          onBlur={e => e.target.style.borderColor = 'var(--border2)'}
        />
        <div style={{ display: 'flex', background: 'var(--bg4)', border: '1px solid var(--border2)', borderRadius: 8, overflow: 'hidden' }}>
          {['all', 'pending', 'inprogress', 'done'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '9px 14px', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: filter === f ? deptColor : 'transparent',
                color: filter === f ? '#fff' : 'var(--text2)',
                textTransform: 'capitalize', transition: 'all 0.15s',
              }}
            >
              {f === 'inprogress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Empty state */}
      {filteredUnits.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'var(--bg2)', borderRadius: 12, border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
          <div style={{ color: 'var(--text)', fontWeight: 700, fontSize: 18, marginBottom: 6 }}>
            {search || filter !== 'all' 
              ? 'No matching units' 
              : dept === 'Sales' 
                ? 'No units in the system' 
                : `No units in ${dept}`
            }
          </div>
          <div style={{ color: 'var(--text3)', fontSize: 13 }}>
            {search || filter !== 'all' ? 'Try adjusting your search or filter.' : `All ${dept} tasks are complete or no units have been assigned yet.`}
          </div>
        </div>
      )}

      {/* Worklist Table */}
      {filteredUnits.length > 0 && (
        <div style={{
          background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12,
          overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Order Info</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Unit ID</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Item Details</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Priority</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Delivery Date</th>
                <th style={{ padding: '12px 14px', textAlign: 'left', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Tasks</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Progress</th>
                <th style={{ padding: '12px 14px', textAlign: 'center', color: 'var(--text3)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Expand</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnits.map(unit => (
                <UnitRow
                  key={unit.unit_id}
                  unit={unit}
                  dept={dept}
                  onStepStatusChange={handleStepStatusChange}
                  users={users}
                  currentUser={currentUser}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .worklist-row:hover { background: rgba(255,255,255,0.03) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
