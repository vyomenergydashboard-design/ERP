import { useState } from 'react';
import { LayoutDashboard, ClipboardList, PlusCircle, Database, Upload, Users, ScrollText, Calendar, Settings, ListTodo, FileText, Table, Layers, ArrowDown } from 'lucide-react';
import { DEPTS } from '../data/planningData';

const PRIMARY_NAV = [
  { id: 'table',     icon: Table,           label: 'Table View',  roles: null },
  { id: 'board',     icon: LayoutDashboard, label: 'Board',       roles: null },
  { id: 'planning',  icon: Calendar,        label: 'Planning',    roles: null },
  { id: 'orders',    icon: ClipboardList,   label: 'Orders',      roles: null },
  { id: 'documents', icon: FileText,        label: 'Documents',   roles: null },
  { id: 'new-order', icon: PlusCircle,      label: 'New Order',   roles: ['Admin', 'Manager', 'Sales'] },
  { id: 'masters',   icon: Database,        label: 'Masters',     roles: ['Admin', 'Manager', 'Sales', 'Production', 'Planning'] },
  { id: 'import',    icon: Upload,          label: 'Import',      roles: ['Admin', 'Manager', 'Sales'] },
  { id: 'worklist',  icon: ListTodo,        label: 'My Worklist', roles: ['Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Sales'] },
];

const ADMIN_NAV = [
  { id: 'users',    icon: Users,      label: 'User Directory' },
  { id: 'logs',     icon: ScrollText, label: 'System Logs' },
  { id: 'settings', icon: Settings,   label: 'System Settings' },
];

function NavItem({ item, isActive, onClick }) {
  const Icon = item.icon;
  return (
    <button
      className={`dept-btn${isActive ? ' active' : ''}`}
      onClick={onClick}
      title={item.label}
    >
      <Icon size={16} className="nav-icon" />
      <span className="nav-label">{item.label}</span>
    </button>
  );
}

export default function Sidenav({
  steps,
  currentFilter,
  onFilterDept,
  currentView,
  onSetView,
  userRole,
  collapsed = false,
}) {
  const [isFormsExpanded, setIsFormsExpanded] = useState(false);
  const [formsList, setFormsList] = useState([]);
  return (
    <aside className={`sidenav${collapsed ? ' sidenav--collapsed' : ''}`}>
      <div className="sidenav-inner">
        {/* ── Primary Navigation ── */}
        <div className="sidenav-group">
          <p className="sidenav-label">Workspace</p>
          {PRIMARY_NAV.map((item) => {
            if (item.roles && !item.roles.includes(userRole)) return null;
            return (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentView === item.id}
                onClick={() => onSetView(item.id)}
              />
            );
          })}
        </div>

        {/* ── Forms ── */}
        <div className="sidenav-group">
          <p className="sidenav-label">Forms</p>
          <button
            className={`dept-btn forms-parent-btn${isFormsExpanded ? ' active' : ''}`}
            onClick={() => setIsFormsExpanded(prev => !prev)}
            title="All Forms"
            type="button"
          >
            <Layers size={16} className="nav-icon" style={{ color: 'var(--accent, #f97316)', opacity: 1 }} />
            <span className="nav-label" style={{ fontWeight: 600 }}>All Forms</span>
            <span
              className={`forms-expand-arrow${isFormsExpanded ? ' expanded' : ''}`}
              title={isFormsExpanded ? 'Collapse forms' : 'Expand forms'}
            >
              <ArrowDown size={11} strokeWidth={2.5} />
            </span>
          </button>

          {isFormsExpanded && (
            <div className="forms-submenu">
              {formsList.length > 0 ? (
                formsList.map((form) => (
                  <button
                    key={form.id}
                    className={`forms-submenu-item${currentView === form.id ? ' active' : ''}`}
                    onClick={() => onSetView(form.id)}
                    type="button"
                    title={form.label}
                  >
                    <FileText size={13} style={{ opacity: 0.7 }} />
                    <span className="nav-label">{form.label}</span>
                  </button>
                ))
              ) : (
                <div className="forms-submenu-placeholder">
                  Forms will appear here
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Departments ── */}
        <div className="sidenav-group">
          <p className="sidenav-label">Departments</p>
          <button
            className={`dept-btn${currentFilter === 'all' ? ' active' : ''}`}
            onClick={() => {
              onFilterDept('all');
              if (!['table', 'board', 'flow'].includes(currentView)) {
                onSetView('table');
              }
            }}
            title="All Departments"
          >
            <span className="dept-dot" style={{ background: 'var(--accent)' }} />
            <span className="nav-label">All Departments</span>
          </button>
          {DEPTS.map((dept) => {
            const done  = steps.filter((s) => s.dept === dept.id && s.status === 'done').length;
            const total = steps.filter((s) => s.dept === dept.id).length;
            return (
              <button
                key={dept.id}
                className={`dept-btn${currentFilter === dept.id ? ' active' : ''}`}
                onClick={() => {
                  onFilterDept(dept.id);
                  if (!['table', 'board', 'flow'].includes(currentView)) {
                    onSetView('table');
                  }
                }}
                title={dept.label}
              >
                <span className="dept-dot" style={{ background: dept.color }} />
                <span className="nav-label">{dept.label}</span>
                {total > 0 && (
                  <span className="dept-count nav-count">
                    {`${done}/${total}`}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Admin ── */}
        {userRole === 'Admin' && (
          <div className="sidenav-group sidenav-group--admin">
            <p className="sidenav-label">Admin</p>
            {ADMIN_NAV.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentView === item.id}
                onClick={() => onSetView(item.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
