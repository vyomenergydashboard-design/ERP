import { LayoutDashboard, ClipboardList, PlusCircle, Database, Upload, Users, ScrollText, Calendar, Settings, ListTodo, FileText } from 'lucide-react';
import { DEPTS } from '../data/planningData';

const BOM_STATES = [
  { key: 'Stock Check',       label: '① Stock Check' },
  { key: 'Material Allotted', label: '② Material Allotted' },
  { key: 'Acceptance',        label: '③ Acceptance' },
  { key: 'Accept-Complete',   label: '④ Accept-Complete' },
];

const PRIMARY_NAV = [
  { id: 'board',     icon: LayoutDashboard, label: 'Board',     roles: null },
  { id: 'planning',  icon: Calendar,        label: 'Planning',  roles: ['Admin', 'Manager', 'Planning'] },
  { id: 'orders',    icon: ClipboardList,   label: 'Orders',    roles: null },
  { id: 'documents', icon: FileText,        label: 'Documents', roles: null },
  { id: 'new-order', icon: PlusCircle,      label: 'New Order', roles: ['Admin', 'Manager', 'Sales'] },
  { id: 'masters',   icon: Database,        label: 'Masters',   roles: ['Admin', 'Manager', 'Sales'] },
  { id: 'import',    icon: Upload,          label: 'Import',    roles: ['Admin', 'Manager', 'Sales'] },
  { id: 'worklist',  icon: ListTodo,        label: 'My Worklist', roles: ['Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Sales'] },
];

const ADMIN_NAV = [
  { id: 'users', icon: Users,      label: 'User Directory' },
  { id: 'logs',  icon: ScrollText, label: 'System Logs' },
  { id: 'settings', icon: Settings, label: 'System Settings' },
];

export default function Sidenav({
  steps,
  currentFilter,
  onFilterDept,
  bomState,
  onSetBomState,
  designType,
  onSetDesignType,
  currentView,
  onSetView,
  userRole,
}) {
  return (
    <div className="sidenav">

      {/* ── Primary Navigation ── */}
      <div className="sidenav-section">Workspace</div>
      {PRIMARY_NAV.map((item) => {
        if (item.roles && !item.roles.includes(userRole)) return null;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            className={`dept-btn${currentView === item.id ? ' active' : ''}`}
            onClick={() => onSetView(item.id)}
          >
            <Icon size={14} className="nav-icon" />
            {item.label}
          </button>
        );
      })}

      {/* ── Departments (filter for Flow view) ── */}
      <div className="sidenav-section" style={{ marginTop: 8 }}>Departments</div>

      <button
        className={`dept-btn${currentFilter === 'all' ? ' active' : ''}`}
        onClick={() => onFilterDept('all')}
      >
        <span className="dept-dot" style={{ background: 'var(--accent)' }} />
        All Departments
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
              onSetView('flow');
            }}
          >
            <span className="dept-dot" style={{ background: dept.color }} />
            {dept.label}
            {total > 0
              ? <span className="dept-count">{done}/{total}</span>
              : <span className="dept-count" style={{ opacity: 0.3 }}>—</span>
            }
          </button>
        );
      })}


      {/* ── Admin Section ── */}
      {userRole === 'Admin' && (
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--sidebar-border)', padding: '8px 0 4px' }}>
          <div className="sidenav-section">Administration</div>
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`dept-btn${currentView === item.id ? ' active' : ''}`}
                onClick={() => onSetView(item.id)}
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                <Icon size={14} className="nav-icon" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
