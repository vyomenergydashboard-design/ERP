import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Maximize2, Minimize2 } from 'lucide-react';
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
import UserManagement from './components/UserManagement';
import OrderCreationFlow from './components/OrderCreationFlow';
import OrderImport from './components/OrderImport';
import OrderList from './components/OrderList';
import Masters from './components/Masters';
import LogsView from './components/LogsView';
import PlanningModule from './components/PlanningModule';
import SettingsView from './components/Settings';
import DeptWorklist from './components/DeptWorklist';
import DocumentDirectory from './components/DocumentDirectory';
import { INITIAL_STEPS, fmtTime } from './data/planningData';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || token === 'undefined' || token === 'null' || !user) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function Dashboard() {
  const [steps, setSteps] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentView, setCurrentView] = useState('board'); // default to board
  const [bomState, setBomState] = useState('Accept-Complete');
  const [designType, setDesignType] = useState('Standard');
  const [selectedStepId, setSelectedStepId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const selectedOrderIdRef = useRef(null); // ref so closures always see latest value
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPlanningFullscreen, setIsPlanningFullscreen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [unitSteps, setUnitSteps] = useState([]);
  const lastInitializedOrderIdRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));
  const token = localStorage.getItem('token');

  // Auto-logout on 401
  const authFetch = async (url, options = {}) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
      return null;
    }
    return res;
  };

  useEffect(() => {
    syncProfile();
    fetchLogs();

    const handleSetViewEvent = (e) => {
      if (typeof e.detail === 'string') {
        setCurrentView(e.detail);
      } else if (e.detail && e.detail.view) {
        setCurrentView(e.detail.view);
        if (e.detail.orderId) {
          setSelectedOrderId(e.detail.orderId);
          selectedOrderIdRef.current = e.detail.orderId;
        } else if (e.detail.orderId === null) {
          setSelectedOrderId(null);
          selectedOrderIdRef.current = null;
        }
      }
    };
    window.addEventListener('setView', handleSetViewEvent);
    return () => window.removeEventListener('setView', handleSetViewEvent);
  }, []);

  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderSteps(selectedOrderId);
      fetchOrderDetails(selectedOrderId);
    } else {
      setSteps([]);
      setSelectedOrder(null);
    }
  }, [selectedOrderId]);

  // Auto-select unit when order changes
  useEffect(() => {
    if (!selectedOrder) {
      setSelectedUnitId('');
      lastInitializedOrderIdRef.current = null;
      return;
    }

    if (lastInitializedOrderIdRef.current !== selectedOrder.id) {
      const units = selectedOrder.units || [];
      if (units.length > 0) {
        setSelectedUnitId(units[0].id.toString());
      } else {
        setSelectedUnitId('');
      }
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

  // Fetch unit steps when selectedUnitId or selectedOrder changes
  useEffect(() => {
    const targetUnitId = selectedUnitId || (selectedOrder?.units?.[0]?.id);
    if (targetUnitId && token) {
      fetch(`${window.API_BASE}/api/units/${targetUnitId}/steps`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(async res => {
        if (res.ok) setUnitSteps(await res.json());
      })
      .catch(console.error);
    } else {
      setUnitSteps([]);
    }
  }, [selectedUnitId, selectedOrder, token]);

  // Reactively fetch steps and order details when any step is updated
  useEffect(() => {
    const handleOrderUpdate = () => {
      if (selectedOrderId) {
        fetchOrderSteps(selectedOrderId);
        fetchOrderDetails(selectedOrderId);
        
        const targetUnitId = selectedUnitId || (selectedOrder?.units?.[0]?.id);
        if (targetUnitId && token) {
          fetch(`${window.API_BASE}/api/units/${targetUnitId}/steps`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          .then(async res => {
            if (res.ok) setUnitSteps(await res.json());
          })
          .catch(console.error);
        }
      }
    };
    window.addEventListener('orderUpdated', handleOrderUpdate);
    return () => window.removeEventListener('orderUpdated', handleOrderUpdate);
  }, [selectedOrderId, selectedUnitId, selectedOrder, token]);

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

  // Navigating to Board clears the selected order — Board shows all orders,
  // so having one "selected" is confusing and pollutes the stats + right panel.
  const navigateToView = (view) => {
    setCurrentView(view);
    if (view === 'board') {
      setSelectedOrderId(null);
      selectedOrderIdRef.current = null;
      setSelectedOrder(null);
      setSteps([]);
      setCurrentFilter('all'); // board always shows all departments
      // Also tell the Header to clear its search input
      window.dispatchEvent(new CustomEvent('setView', { detail: { orderId: null } }));
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
      const res = await fetch(`${window.API_BASE}/api/orders/${selectedOrderId}/steps/${selectedStepId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        await fetchOrderSteps(selectedOrderId); // refresh steps
        await fetchOrderDetails(selectedOrderId); // refresh order details
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
      const res = await fetch(`${window.API_BASE}/api/orders/${selectedOrderId}/steps/${stepId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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

  const handleSetBomState = (state) => {
    if (!['Admin', 'Manager', 'Accounts', 'Production'].includes(user.role)) {
      alert('Unauthorized to change BOM status');
      return;
    }
    setBomState(state);
    logActivity('Stores', `BOM status updated → ${state}`, selectedOrderId);
  };

  const handleSetDesignType = (type) => {
    if (!['Admin', 'Manager', 'Design'].includes(user.role)) {
      alert('Unauthorized to change Design classification');
      return;
    }
    setDesignType(type);
    logActivity('Design', `Design classified as ${type}`, selectedOrderId);
  };

  const orderLevelSteps = steps.filter(s => !s.order_unit_id);
  const combinedSteps = [...unitSteps, ...orderLevelSteps];

  return (
    <div className="app-container">
      <Header onLogout={handleLogout} />
      <div className="app">
        {(!isPlanningFullscreen || currentView !== 'planning') && (
          <Sidenav
            steps={combinedSteps}
            currentFilter={currentFilter}
            onFilterDept={setCurrentFilter}
            bomState={bomState}
            onSetBomState={handleSetBomState}
            designType={designType}
            onSetDesignType={handleSetDesignType}
            currentView={currentView}
            onSetView={navigateToView}
            userRole={user.role}
          />
        )}
        <main className="main">
          {currentView !== 'planning' && (
            <StatsRow steps={combinedSteps} currentFilter={currentFilter} selectedOrder={selectedOrder} />
          )}
          
          <div className="flow-header">
            <div className="flow-title">
              {currentView === 'board' ? 'Board' :
               currentView === 'planning' ? 'Planning Board' :
               currentView === 'flow' ? 'Process Flow' :
               currentView === 'table' ? 'Table View' :
               currentView === 'orders' ? 'Order Directory' :
               currentView === 'documents' ? 'Document Directory' :
               currentView === 'new-order' ? 'New Order' :
               currentView === 'import' ? 'Import Orders' :
               currentView === 'masters' ? 'Masters' :
               currentView === 'logs' ? 'System Logs' :
               currentView === 'worklist' ? `${user.role} Worklist` :
               'User Management'}
            </div>
            {['board', 'flow', 'table'].includes(currentView) && (
              <div className="view-toggle">
                <button className={`vbtn${currentView === 'board' ? ' active' : ''}`} onClick={() => navigateToView('board')}>Board</button>
                <button className={`vbtn${currentView === 'flow' ? ' active' : ''}`} onClick={() => setCurrentView('flow')}>Flow</button>
                <button className={`vbtn${currentView === 'table' ? ' active' : ''}`} onClick={() => setCurrentView('table')}>Table</button>
              </div>
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
          </div>

          {currentView === 'board' ? (
            <BoardView currentFilter={currentFilter} userRole={user.role} onSetView={setCurrentView} />
          ) : currentView === 'planning' ? (
            <PlanningModule />
          ) : currentView === 'flow' ? (
            selectedOrderId ? (
              <FlowView 
                steps={steps} 
                currentFilter={currentFilter} 
                onOpenModal={handleOpenModal} 
                onSetView={setCurrentView} 
                userRole={user.role} 
                selectedOrderId={selectedOrderId} 
                selectedOrder={selectedOrder} 
                onStepsChanged={() => fetchOrderSteps(selectedOrderId)}
                selectedUnitId={selectedUnitId}
                setSelectedUnitId={setSelectedUnitId}
                unitSteps={unitSteps}
                setUnitSteps={setUnitSteps}
              />
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
                Please select an order from the Header dropdown to view its Process Flow.
              </div>
            )
          ) : currentView === 'table' ? (
            selectedOrderId ? (
              <TableView steps={combinedSteps} currentFilter={currentFilter} onOpenModal={handleOpenModal} userRole={user.role} />
            ) : (
              <AllOrdersTableView currentFilter={currentFilter} onSetView={navigateToView} />
            )
          ) : currentView === 'orders' ? (
            <OrderList initialSelectedId={selectedOrderId} />
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
            <LogsView />
          ) : currentView === 'settings' ? (
            <SettingsView />
          ) : currentView === 'worklist' ? (
            <DeptWorklist dept={user.role} />
          ) : (
            <UserManagement />
          )}
        </main>
        {currentView !== 'planning' && (
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
  return (
    <BrowserRouter>
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
