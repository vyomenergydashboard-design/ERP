import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Maximize2, Minimize2, PanelLeftClose, Eye, EyeOff } from 'lucide-react';
import Header from './components/Header';
import Sidenav from './components/Sidenav';
import StatsRow from './components/StatsRow';
import FlowView from './components/FlowView';
import BoardView from './components/BoardView';
import TableView from './components/TableView';
import AllOrdersTableView from './components/AllOrdersTableView';
import RightPanel from './components/RightPanel';
import StepModal from './components/StepModal';
import Login from './components/Login';
import OrderList from './components/OrderList';
import DeptWorklist from './components/DeptWorklist';

// Code-split heavy route modules with dynamic imports
const PlanningModule = lazy(() => import('./components/PlanningModule'));
const Masters = lazy(() => import('./components/Masters'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const OrderCreationFlow = lazy(() => import('./components/OrderCreationFlow'));
const OrderImport = lazy(() => import('./components/OrderImport'));
const DocumentDirectory = lazy(() => import('./components/DocumentDirectory'));
const LogsView = lazy(() => import('./components/LogsView'));
const SettingsView = lazy(() => import('./components/Settings'));
const Pdr03View = lazy(() => import('./components/Pdr03View'));
import PageHeader from './components/layout/PageHeader';
import ErrorBoundary from './components/ErrorBoundary';
import { fmtTime } from './data/planningData';
import useGlobalModalEscape from './hooks/useGlobalModalEscape';
import { useEventStream } from './hooks/useEventStream';
import { isDepartmentRole } from './data/roles';
import { apiFetch } from './api/client';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || token === 'undefined' || token === 'null' || !user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const ADMIN_ONLY_VIEWS = ['users', 'logs', 'settings'];
const KNOWN_VIEWS = ['board', 'planning', 'flow', 'table', 'orders', 'documents', 'new-order', 'import', 'masters', 'worklist', ...ADMIN_ONLY_VIEWS];

function Dashboard() {
  useEventStream();
  const [steps, setSteps] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [currentFilter, setCurrentFilter] = useState(() => {
    const saved = localStorage.getItem('erp_currentFilter');
    if (saved) return saved;
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    if (u.role && isDepartmentRole(u.role)) {
      return u.role;
    }
    return 'all';
  });
  const [currentView, setCurrentView] = useState(() => localStorage.getItem('erp_currentView') || 'table'); // default to table

  useEffect(() => {
    localStorage.setItem('erp_currentView', currentView);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('erp_currentFilter', currentFilter);
  }, [currentFilter]);
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(() => {
    const saved = localStorage.getItem('erp_selectedOrderId');
    return saved ? parseInt(saved, 10) || null : null;
  });
  const selectedOrderIdRef = useRef(selectedOrderId); // ref so closures always see latest value
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPlanningFullscreen, setIsPlanningFullscreen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [sidenavCollapsed, setSidenavCollapsed] = useState(() => window.innerWidth < 1200);
  const [statCardFilter, setStatCardFilter] = useState(null);
  const [showTableStats, setShowTableStats] = useState(() => localStorage.getItem('erp_show_table_stats') === 'true'); // 'all' | 'priority' | 'inprogress' | 'blocked' | 'due'

  const [selectedUnitId, setSelectedUnitId] = useState(() => {
    return localStorage.getItem('erp_selectedUnitId') || '';
  });

  useEffect(() => {
    if (selectedUnitId) {
      localStorage.setItem('erp_selectedUnitId', selectedUnitId);
    } else {
      localStorage.removeItem('erp_selectedUnitId');
    }
  }, [selectedUnitId]);

  const [unitSteps, setUnitSteps] = useState([]);
  const [taskMasters, setTaskMasters] = useState([]);
  const lastInitializedOrderIdRef = useRef(null);
  const requestedUnitIdRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const token = localStorage.getItem('token');
  const isAdmin = user.role === 'Admin';

  // Admin-only views (mirrors ADMIN_NAV in Sidenav). A stale or hand-edited
  // erp_currentView must not open them for other roles; unknown views reset too.
  useEffect(() => {
    const allowed = KNOWN_VIEWS.includes(currentView) || currentView.startsWith('form-');
    if (!allowed || (ADMIN_ONLY_VIEWS.includes(currentView) && !isAdmin)) {
      setCurrentView('table');
    }
  }, [currentView, isAdmin]);

  // apiFetch adds the bearer token; 401 handling is done globally by the fetch interceptor in main.jsx
  const authFetch = apiFetch;

  const fetchTaskMasters = async () => {
    if (!token) return;
    try {
      const res = await authFetch(`${window.API_BASE}/api/task_masters`);
      if (res?.ok) {
        setTaskMasters(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch task masters', err);
    }
  };

  useEffect(() => {
    syncProfile();
    fetchLogs();

    const handleSetViewEvent = (e) => {
      if (typeof e.detail === 'string') {
        setCurrentView(e.detail);
      } else if (e.detail && e.detail.view) {
        setCurrentView(e.detail.view);
        if (e.detail.orderId !== undefined) {
          const newOid = e.detail.orderId ? parseInt(e.detail.orderId, 10) : null;
          setSelectedOrderId(newOid);
          selectedOrderIdRef.current = newOid;
        }
        if (e.detail.unitId !== undefined) {
          const newUid = e.detail.unitId ? String(e.detail.unitId) : '';
          requestedUnitIdRef.current = newUid || null;
          setSelectedUnitId(newUid);
        } else if (e.detail.orderId === null) {
          requestedUnitIdRef.current = null;
          setSelectedUnitId('');
        }
      }
    };
    window.addEventListener('setView', handleSetViewEvent);
    return () => window.removeEventListener('setView', handleSetViewEvent);
  }, []);

  // Task masters are only needed by the Process Flow view
  useEffect(() => {
    if (currentView === 'flow') fetchTaskMasters();
  }, [currentView]);

  useEffect(() => {
    if (selectedOrderId) {
      localStorage.setItem('erp_selectedOrderId', String(selectedOrderId));
      fetchOrderSteps(selectedOrderId);
      fetchOrderDetails(selectedOrderId);
    } else {
      localStorage.removeItem('erp_selectedOrderId');
      setSteps([]);
      setSelectedOrder(null);
    }
  }, [selectedOrderId]);

  // Auto-select unit when order changes
  useEffect(() => {
    if (!selectedOrder) {
      if (!requestedUnitIdRef.current) {
        setSelectedUnitId('');
      }
      lastInitializedOrderIdRef.current = null;
      return;
    }

    if (lastInitializedOrderIdRef.current !== selectedOrder.id) {
      const units = selectedOrder.units || [];
      const savedUnitId = localStorage.getItem('erp_selectedUnitId');
      if (requestedUnitIdRef.current && units.some(u => u.id.toString() === requestedUnitIdRef.current.toString())) {
        setSelectedUnitId(requestedUnitIdRef.current.toString());
      } else if (savedUnitId && units.some(u => u.id.toString() === savedUnitId.toString())) {
        setSelectedUnitId(savedUnitId.toString());
      } else if (units.length > 0) {
        setSelectedUnitId(units[0].id.toString());
      } else {
        setSelectedUnitId('');
      }
      requestedUnitIdRef.current = null;
      lastInitializedOrderIdRef.current = selectedOrder.id;
    } else {
      const units = selectedOrder.units || [];
      if (selectedUnitId && !units.some(u => u.id.toString() === selectedUnitId.toString())) {
        if (units.length > 0) {
          setSelectedUnitId(units[0].id.toString());
        } else {
          setSelectedUnitId('');
        }
      }
    }
  }, [selectedOrder, selectedUnitId]);

  // Fetch unit steps concurrently when selectedUnitId changes
  useEffect(() => {
    const targetUnitId = selectedUnitId;
    if (!targetUnitId || !token) {
      setUnitSteps([]);
      return undefined;
    }
    const controller = new AbortController();
    apiFetch(`/api/units/${targetUnitId}/steps`, {
      signal: controller.signal
    })
      .then(async res => {
        if (!res.ok) return;
        const data = await res.json();
        if (!controller.signal.aborted) setUnitSteps(data);
      })
      .catch(err => {
        if (err?.name !== 'AbortError') console.error(err);
      });
    return () => controller.abort();
  }, [selectedUnitId, token]);

  // Reactively fetch steps and order details when any step is updated
  useEffect(() => {
    const handleOrderUpdate = (e) => {
      if (!selectedOrderId) return;
      // Only refetch for global/resync events or updates to the currently selected order
      const changedOrderId = e?.detail?.orderId;
      if (changedOrderId != null && String(changedOrderId) !== String(selectedOrderId)) return;
      fetchOrderSteps(selectedOrderId);
      fetchOrderDetails(selectedOrderId);

      const targetUnitId = selectedUnitId;
      if (targetUnitId && token) {
        apiFetch(`/api/units/${targetUnitId}/steps`)
          .then(async res => {
            if (res.ok) setUnitSteps(await res.json());
          })
          .catch(console.error);
      }
    };
    window.addEventListener('orderUpdated', handleOrderUpdate);
    return () => window.removeEventListener('orderUpdated', handleOrderUpdate);
  }, [selectedOrderId, selectedUnitId, token]);

  const fetchOrderDetails = async (orderId) => {
    if (!token) return;
    try {
      const res = await authFetch(`${window.API_BASE}/api/orders/${orderId}`);
      if (res?.ok) {
        setSelectedOrder(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch order details', err);
    }
  };

  const fetchOrderSteps = async (orderId) => {
    if (!token) return;
    try {
      const res = await authFetch(`${window.API_BASE}/api/orders/${orderId}/steps`);
      if (res?.ok) {
        setSteps(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch steps', err);
    }
  };

  const syncProfile = async () => {
    if (!token) return;
    try {
      const res = await authFetch(window.API_BASE + "/api/auth/profile");
      if (res?.ok) {
        const latestUser = await res.json();
        setUser(latestUser);
        localStorage.setItem('user', JSON.stringify(latestUser));
      }
    } catch (err) {
      console.error('Failed to sync profile', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await authFetch(window.API_BASE + "/api/logs");
      if (res?.ok) {
        const data = await res.json();
        setActivityLog(data.map(l => ({
          time: fmtTime(new Date(l.timestamp)),
          dept: l.dept,
          text: l.action_text,
          username: l.username
        })));
      }
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  const logActivity = async (dept, text, orderId) => {
    const oid = orderId ?? selectedOrderIdRef.current;
    try {
      const res = await authFetch(window.API_BASE + "/api/logs", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dept, action_text: text, order_id: oid ? parseInt(oid) : null })
      });
      fetchLogs();
    } catch (err) {
      console.error('Failed to log activity', err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Navigating to Table View or Board clears the selected order and search query
  const navigateToView = (view) => {
    if (view === 'table' || view === 'board') {
      setCurrentView(view);
      setSelectedOrderId(null);
      selectedOrderIdRef.current = null;
      setSelectedOrder(null);
      setSelectedUnitId('');
      setSteps([]);
      window.dispatchEvent(new CustomEvent('setView', { detail: { view, orderId: null, unitId: null } }));
    } else {
      setCurrentView(view);
    }
  };

  const selectedStep = steps.find((s) => s.id === selectedStepId) || null;

  const handleOpenModal = (id) => {
    setSelectedStepId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveStep = async (data) => {
    try {
      const res = await apiFetch(`/api/orders/${selectedOrderId}/steps/${selectedStepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        // The orderUpdated listener refetches steps, order details and unit steps
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrderId } }));

        if (selectedStep.special === 'qc' && data.status === 'blocked' && data.qcFailTarget) {
          const routeText = data.qcFailTarget === 'production'
            ? 'QC FAIL → returned to Production for rework'
            : 'QC FAIL → returned to Design for re-check';
          logActivity('QC', routeText, selectedOrderId);
        }

        logActivity(selectedStep.dept, `"${selectedStep.name}" → ${data.status.toUpperCase()}${data.notes ? ' — ' + data.notes : ''}`, selectedOrderId);
        setIsModalOpen(false);
        return null; // success
      } else {
        const errData = await res.json().catch(() => ({}));
        return errData.error || 'Failed to save step'; // return error to StepModal
      }
    } catch (err) {
      console.error('Failed to save step', err);
      return 'Network error — could not save step';
    }
  };

  const handleDeleteStep = async (stepId) => {
    if (!window.confirm("Are you sure you want to permanently delete this task from the order's flow?")) return;
    try {
      const res = await apiFetch(`/api/orders/${selectedOrderId}/steps/${stepId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchOrderSteps(selectedOrderId);
        window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: selectedOrderId } }));
      } else {
        alert('Failed to delete step');
      }
    } catch (err) {
      console.error(err);
    }
  };


  const orderLevelSteps = steps.filter(s => !s.order_unit_id);
  const combinedSteps = [...unitSteps, ...orderLevelSteps];

  return (
    <div className="app-container">
      <Header
        onLogout={handleLogout}
        onToggleSidebar={() => setSidenavCollapsed(c => !c)}
        sidenavCollapsed={sidenavCollapsed}
      />
      <div className="app">
        {(!isPlanningFullscreen || currentView !== 'planning') && (
          <Sidenav
            steps={combinedSteps}
            currentFilter={currentFilter}
            onFilterDept={setCurrentFilter}
            currentView={currentView}
            onSetView={navigateToView}
            userRole={user.role}
            collapsed={sidenavCollapsed}
          />
        )}
        <main className={`main${currentView === 'table' ? ' main-table-mode' : ''}`}>
          {currentView !== 'planning' && !currentView.startsWith('form-') && (currentView !== 'table' || showTableStats) && (
            <StatsRow
              steps={combinedSteps}
              currentFilter={currentFilter}
              selectedOrder={selectedOrder}
              selectedOrderId={selectedOrderId}
              currentView={currentView}
              activeStatFilter={statCardFilter}
              onSelectStatFilter={(key) => {
                setStatCardFilter(prev => prev === key ? null : key);
              }}
            />
          )}

          <PageHeader
            title={
              currentView === 'board' ? 'Board' :
                currentView === 'planning' ? 'Planning Board' :
                  currentView === 'flow' ? (selectedOrder ? `Process Flow: ${selectedOrder.order_number}` : 'Process Flow') :
                    currentView === 'table' ? 'Table View' :
                      currentView === 'orders' ? 'Order Directory' :
                        currentView === 'documents' ? 'Document Directory' :
                          currentView === 'new-order' ? 'New Order' :
                            currentView === 'import' ? 'Import Orders' :
                              currentView === 'masters' ? 'Masters' :
                                currentView === 'logs' ? 'System Logs' :
                                  currentView === 'worklist' ? `${user.role} Worklist` :
                                    currentView === 'form-pdr-03' ? 'PDR-03 Form' :
                                      currentView === 'form-qc' ? 'QC Form' :
                                        currentView === 'form-inspection' ? 'Inspection Form' :
                                          currentView === 'form-material-req' ? 'Material Request' :
                                            'User Management'
            }
            subtitle={
              currentView === 'flow' && selectedOrder
                ? `${selectedOrder.company_name || 'Client'}${selectedOrder.project_name ? ` · ${selectedOrder.project_name}` : ''}`
                : null
            }
            status={
              currentView === 'flow' && selectedOrder
                ? (selectedOrder.status || 'In Progress')
                : null
            }
            breadcrumbs={[
              { label: 'Vyom ERP', onClick: () => navigateToView('table') },
              ...(currentFilter && currentFilter !== 'all' ? [{ label: currentFilter }] : []),
              {
                label:
                  currentView === 'board' ? 'Board' :
                    currentView === 'planning' ? 'Planning' :
                      currentView === 'flow' ? (selectedOrder ? `Order #${selectedOrder.order_number}` : 'Flow') :
                        currentView === 'table' ? 'Table View' :
                          currentView === 'orders' ? 'Orders' :
                            currentView === 'documents' ? 'Documents' :
                              currentView === 'new-order' ? 'New Order' :
                                currentView === 'import' ? 'Import' :
                                  currentView === 'masters' ? 'Masters' :
                                    currentView === 'logs' ? 'Logs' :
                                      currentView === 'worklist' ? 'Worklist' :
                                        currentView.startsWith('form-') ? 'Forms' :
                                          'Users'
              }
            ]}
            actions={
              <>
                {['board', 'flow', 'table'].includes(currentView) && (
                  <div className="view-toggle" style={{ margin: 0 }}>
                    <button className={`vbtn${currentView === 'board' ? ' active' : ''}`} onClick={() => navigateToView('board')}>Board</button>
                    <button className={`vbtn${currentView === 'flow' ? ' active' : ''}`} onClick={() => setCurrentView('flow')}>Flow</button>
                    <button className={`vbtn${currentView === 'table' ? ' active' : ''}`} onClick={() => navigateToView('table')}>Table</button>
                  </div>
                )}
                {currentView === 'table' && (
                  <button
                    type="button"
                    className={`vbtn${showTableStats ? ' active' : ''}`}
                    onClick={() => setShowTableStats(s => {
                      const next = !s;
                      localStorage.setItem('erp_show_table_stats', String(next));
                      return next;
                    })}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, padding: '4px 10px' }}
                    title={showTableStats ? 'Hide KPI summary cards to show more panel rows' : 'Show KPI summary cards'}
                  >
                    {showTableStats ? <EyeOff size={13} /> : <Eye size={13} />}
                    <span>{showTableStats ? 'Hide KPIs' : 'Show KPIs'}</span>
                  </button>
                )}
                {currentView === 'planning' && (
                  <button
                    className={`vbtn${isPlanningFullscreen ? ' active' : ''}`}
                    onClick={() => setIsPlanningFullscreen(!isPlanningFullscreen)}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {isPlanningFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                    {isPlanningFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  </button>
                )}
              </>
            }
            style={{ marginBottom: currentView === 'table' ? 6 : 16, padding: currentView === 'table' ? '6px 14px' : '10px 14px', borderRadius: 'var(--radius, 8px)' }}
          />

          <ErrorBoundary key={currentView} name={currentView.toUpperCase()}>
            <Suspense fallback={
              <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text3)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 28, height: 28, border: '3px solid var(--border)', borderTopColor: 'var(--blue)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Loading view...</span>
              </div>
            }>

              {currentView === 'board' ? (
                <BoardView
                  currentFilter={currentFilter}
                  userRole={user.role}
                  onSetView={navigateToView}
                  statCardFilter={statCardFilter}
                  onClearStatFilter={() => setStatCardFilter(null)}
                />
              ) : currentView === 'planning' ? (
                <PlanningModule />
              ) : currentView === 'flow' ? (
                selectedOrderId ? (
                  <FlowView
                    steps={steps}
                    currentFilter={currentFilter}
                    onOpenModal={handleOpenModal}
                    onSetView={navigateToView}
                    userRole={user.role}
                    selectedOrderId={selectedOrderId}
                    selectedOrder={selectedOrder}
                    onStepsChanged={() => fetchOrderSteps(selectedOrderId)}
                    selectedUnitId={selectedUnitId}
                    setSelectedUnitId={setSelectedUnitId}
                    unitSteps={unitSteps}
                    setUnitSteps={setUnitSteps}
                    taskMasters={taskMasters}
                  />
                ) : (
                  <div style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>
                    Please select an order from the Header dropdown to view its Process Flow.
                  </div>
                )
              ) : currentView === 'table' ? (
                <AllOrdersTableView
                  currentFilter={currentFilter}
                  userRole={user?.role}
                  onSetView={navigateToView}
                  statCardFilter={statCardFilter}
                  onClearStatFilter={() => setStatCardFilter(null)}
                />
              ) : currentView === 'orders' ? (
                <OrderList
                  initialSelectedId={selectedOrderId}
                  onSelectOrder={(id) => {
                    setSelectedOrderId(id);
                    selectedOrderIdRef.current = id;
                  }}
                />
              ) : currentView === 'documents' ? (
                <DocumentDirectory />
              ) : currentView === 'new-order' ? (
                <OrderCreationFlow onOrderCreated={() => {
                  setCurrentView('orders');
                  window.dispatchEvent(new CustomEvent('orderUpdated'));
                }} />
              ) : currentView === 'import' ? (
                <OrderImport onImportComplete={() => {
                  setCurrentView('orders');
                  window.dispatchEvent(new CustomEvent('orderUpdated'));
                }} />
              ) : currentView === 'masters' ? (
                <Masters />
              ) : currentView === 'logs' ? (
                isAdmin ? <LogsView /> : null
              ) : currentView === 'settings' ? (
                isAdmin ? <SettingsView /> : null
              ) : currentView === 'worklist' ? (
                <DeptWorklist dept={user.role} />
              ) : currentView === 'form-pdr-03' ? (
                <Pdr03View onNavigateToView={navigateToView} userRole={user.role} />
              ) : currentView.startsWith('form-') ? (
                <div style={{
                  background: 'var(--bg2)',
                  border: '1px solid var(--border)',
                  borderRadius: 12,
                  padding: '40px 24px',
                  textAlign: 'center',
                  maxWidth: 640,
                  margin: '24px auto',
                  boxShadow: 'var(--card-shadow)'
                }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                    {currentView === 'form-qc' ? 'QC Form' :
                      currentView === 'form-inspection' ? 'Inspection Form' :
                        currentView === 'form-material-req' ? 'Material Request' :
                          'Form View'}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>
                    This form is ready. Form fields will be loaded here.
                  </p>
                  <button
                    className="vbtn active"
                    onClick={() => navigateToView('table')}
                    style={{ padding: '8px 16px', fontSize: 12.5 }}
                  >
                    Return to Table View
                  </button>
                </div>
              ) : currentView === 'users' && isAdmin ? (
                <UserManagement />
              ) : null}

            </Suspense>
          </ErrorBoundary>
        </main>
        {currentView !== 'planning' && user.role === 'Admin' && (
          <RightPanel
            selectedStep={selectedStep}
            activityLog={activityLog}
            selectedOrder={selectedOrder}
            isOpen={rightPanelOpen}
            onToggle={() => setRightPanelOpen(o => !o)}
          />
        )}
      </div>

      <StepModal
        step={selectedStep}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveStep}
        onDelete={handleDeleteStep}
        userRole={user.role}
        selectedOrder={selectedOrder}
      />
    </div>
  );
}

export default function App() {
  useGlobalModalEscape();

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
