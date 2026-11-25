import { useState } from 'react';
import {
  LayoutDashboard, ClipboardList, PlusCircle, Database, Upload, Users,
  ScrollText, Calendar, Settings, ListTodo, FileText, Table, Layers, ChevronDown
} from 'lucide-react';
import { DEPTS } from '../data/planningData';

const WORKSPACE_PRIMARY_NAV = [
  { id: 'table',     icon: Table,           label: 'Table View',  roles: null },
  { id: 'board',     icon: LayoutDashboard, label: 'Board',       roles: null },
  { id: 'planning',  icon: Calendar,        label: 'Planning',    roles: null },
  { id: 'orders',    icon: ClipboardList,   label: 'Orders',      roles: null },
  { id: 'documents', icon: FileText,        label: 'Documents',   roles: null },
];

const WORKSPACE_SECONDARY_NAV = [
  { id: 'new-order', icon: PlusCircle,      label: 'New Order',   roles: ['Admin', 'Manager', 'Sales'] },
  { id: 'masters',   icon: Database,        label: 'Masters',     roles: ['Admin', 'Manager', 'Sales', 'Production', 'Planning'] },
  { id: 'import',    icon: Upload,          label: 'Import',      roles: ['Admin', 'Manager', 'Sales'] },
  { id: 'worklist',  icon: ListTodo,        label: 'My Worklist', roles: ['Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Sales'] },
];

const FORMS_SUBMENU = [
  { id: 'form-pdr-03', label: 'PDR-03' },
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
  const isAnyFormActive = currentView.startsWith('form-') || currentView === 'all-forms';
  const [isFormsExpanded, setIsFormsExpanded] = useState(() => isAnyFormActive);
  // While the list is visible the open sub-item carries the highlight; the parent only takes it
  // when the list is closed or the collapsed rail hides the sub-items.
  const highlightFormsParent = isAnyFormActive && (!isFormsExpanded || collapsed);
  return (
    <aside className={`sidenav${collapsed ? ' sidenav--collapsed' : ''}`}>
      <div className="sidenav-inner">
        {/* ── Primary Navigation (Workspace) ── */}
        <div className="sidenav-group">
          <p className="sidenav-label">Workspace</p>
          {WORKSPACE_PRIMARY_NAV.map((item) => {
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

          {/* ── Forms Accordion Item inside Workspace ── */}
          <button
            className={`dept-btn forms-parent-btn${highlightFormsParent ? ' active' : ''}`}
            onClick={() => setIsFormsExpanded(prev => !prev)}
            title="Forms"
            type="button"
          >
            <Layers size={16} className="nav-icon" />
            <span className="nav-label">Forms</span>
            <span
              className={`forms-expand-arrow${isFormsExpanded ? ' expanded' : ''}`}
              title={isFormsExpanded ? 'Collapse forms' : 'Expand forms'}
            >
              <ChevronDown size={14} strokeWidth={2.4} />
            </span>
          </button>

          {isFormsExpanded && (
            <div className="forms-submenu">
              {FORMS_SUBMENU.map((form) => (
                <button
                  key={form.id}
                  className={`forms-submenu-item${currentView === form.id ? ' active' : ''}`}
                  onClick={() => {
                    if (form.id === 'all-forms') {
                      onSetView('documents');
                    } else {
                      onSetView(form.id);
                    }
                  }}
                  type="button"
                  title={form.label}
                >
                  <FileText size={13} style={{ opacity: 0.7 }} />
                  <span className="nav-label">{form.label}</span>
                </button>
              ))}
            </div>
          )}

          {WORKSPACE_SECONDARY_NAV.map((item) => {
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
