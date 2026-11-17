import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Sliders, ShieldAlert, CheckCircle, Hash, Lock, AlertTriangle, X } from 'lucide-react';

export default function SettingsView() {
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('erp_company_name') || 'Vyom Process Flow');
  const [systemTitle, setSystemTitle] = useState(() => localStorage.getItem('erp_system_title') || 'Control Panel Manufacturing');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('erp_timezone') || 'IST (UTC+05:30)');
  const [defaultPageSize, setDefaultPageSize] = useState(() => localStorage.getItem('erp_default_page_size') || '20');

  // Workflow toggles
  const [enableDoubleGrouping, setEnableDoubleGrouping] = useState(() => localStorage.getItem('erp_double_grouping') !== 'false');
  const [autoQCFromSteps, setAutoQCFromSteps] = useState(() => localStorage.getItem('erp_auto_qc_calc') === 'true');
  const [planningFullscreenDefault, setPlanningFullscreenDefault] = useState(() => localStorage.getItem('erp_planning_fs_default') === 'true');

  // Order Numbering (DB-backed)
  const [orderNumberStart, setOrderNumberStart] = useState('1');
  const [ordersExist, setOrdersExist] = useState(true); // default to locked until confirmed
  const [nextOrderNumber, setNextOrderNumber] = useState('');
  const [orderSettingError, setOrderSettingError] = useState('');
  const [orderSettingSaving, setOrderSettingSaving] = useState(false);
  const [orderSettingSuccess, setOrderSettingSuccess] = useState(false);
  const token = localStorage.getItem('token');

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [maintenanceSuccess, setMaintenanceSuccess] = useState('');
  const [isMaintenanceRunning, setIsMaintenanceRunning] = useState(false);

  // Factory Reset Modal States
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetConfirmationInput, setResetConfirmationInput] = useState('');
  const [resetStartingSequence, setResetStartingSequence] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [resetModalError, setResetModalError] = useState('');

  const fetchSettings = () => {
    const currentToken = localStorage.getItem('token');
    fetch(window.API_BASE + '/api/system-settings', {
      headers: { Authorization: `Bearer ${currentToken}` }
    })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (data.order_number_start) setOrderNumberStart(data.order_number_start);
        setOrdersExist(!!data._orders_exist);
        setNextOrderNumber(data._next_order_number || '');
      })
      .catch((err) => {
        // Field stays locked (ordersExist defaults to true); tell the admin why the values are missing.
        console.error('Failed to load system settings:', err);
        setOrderSettingError('Could not load order numbering settings. Refresh to try again.');
      });
  };

  useEffect(() => {
    fetchSettings();
  }, [token]);

  // Accessibility: Close modal on Escape
  useEffect(() => {
    if (!showResetModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isResetting) {
        handleCloseResetModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showResetModal, isResetting]);

  const handleOrderNumberSave = async () => {
    setOrderSettingError('');
    setOrderSettingSuccess(false);
    const num = parseInt(orderNumberStart);
    if (isNaN(num) || num < 1) {
      setOrderSettingError('Please enter a valid positive number.');
      return;
    }
    setOrderSettingSaving(true);
    try {
      const res = await fetch(window.API_BASE + '/api/system-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ order_number_start: num })
      });
      const data = await res.json();
      if (!res.ok) {
        setOrderSettingError(data.error || 'Failed to save.');
      } else {
        setOrderSettingSuccess(true);
        setTimeout(() => setOrderSettingSuccess(false), 3000);
      }
    } catch {
      setOrderSettingError('Network error.');
    } finally {
      setOrderSettingSaving(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    // Simulate saving delay
    setTimeout(() => {
      localStorage.setItem('erp_company_name', companyName);
      localStorage.setItem('erp_system_title', systemTitle);
      localStorage.setItem('erp_timezone', timezone);
      localStorage.setItem('erp_default_page_size', defaultPageSize);
      localStorage.setItem('erp_double_grouping', enableDoubleGrouping ? 'true' : 'false');
      localStorage.setItem('erp_auto_qc_calc', autoQCFromSteps ? 'true' : 'false');
      localStorage.setItem('erp_planning_fs_default', planningFullscreenDefault ? 'true' : 'false');

      setIsSaving(false);
      setSaveSuccess(true);
      window.dispatchEvent(new CustomEvent('erpSettingsUpdated'));

      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleDownloadBackup = async () => {
    setIsMaintenanceRunning(true);
    setMaintenanceSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE}/api/admin/backup`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Backup failed with status ${res.status}`);
      }

      const disposition = res.headers.get('Content-Disposition') || '';
      let filename = `vyom_erp_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
      const match = disposition.match(/filename="?([^";]+)"?/i);
      if (match && match[1]) {
        filename = match[1];
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMaintenanceSuccess(`Database backup downloaded successfully: ${filename}`);
      setTimeout(() => setMaintenanceSuccess(''), 7000);
    } catch (err) {
      console.error('Database backup error:', err);
      alert(`Database Backup Failed: ${err.message}`);
    } finally {
      setIsMaintenanceRunning(false);
    }
  };

  const handleClearActivityLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) {
      return;
    }
    setIsMaintenanceRunning(true);
    setMaintenanceSuccess('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE}/api/logs`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Failed to clear activity logs');
      }
      setMaintenanceSuccess(`Activity logs cleared successfully (${data.purgedCount || 0} historical entries purged).`);
      setTimeout(() => setMaintenanceSuccess(''), 7000);
    } catch (err) {
      console.error('Clear logs error:', err);
      alert(`Failed to clear activity logs: ${err.message}`);
    } finally {
      setIsMaintenanceRunning(false);
    }
  };

  const handleOpenResetModal = () => {
    setResetModalError('');
    setResetConfirmationInput('');
    setResetStartingSequence(true);
    setShowResetModal(true);
  };

  const handleCloseResetModal = () => {
    if (isResetting) return;
    setShowResetModal(false);
    setResetConfirmationInput('');
    setResetStartingSequence(true);
    setResetModalError('');
  };

  const handleExecuteFactoryReset = async () => {
    if (resetConfirmationInput !== 'FACTORY RESET' || isResetting) return;
    setIsResetting(true);
    setResetModalError('');
    try {
      const currentToken = localStorage.getItem('token');
      const res = await fetch(`${window.API_BASE}/api/admin/maintenance/factory-reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentToken}`
        },
        body: JSON.stringify({
          confirmation: 'FACTORY RESET',
          resetStartingSequence: resetStartingSequence
        })
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Factory reset failed with status ${res.status}`);
      }

      // Format success message with backup path if provided
      let successMsg = data.message || 'ERP system successfully reset to factory defaults.';
      const backupPath = data.backupPath || data.backupFile || (data.summary && data.summary.backupPath);
      if (backupPath) {
        successMsg += ` (Saved on server: ${backupPath})`;
      }

      // Automatically trigger direct browser download to personal computer
      if (data.downloadUrl) {
        try {
          const downloadRes = await fetch(`${window.API_BASE}${data.downloadUrl}`, {
            headers: {
              'Authorization': `Bearer ${currentToken}`
            }
          });
          if (downloadRes.ok) {
            const blob = await downloadRes.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = data.bundleFilename || 'complete_emergency_backup.zip';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            successMsg += ' Complete backup bundle (.zip) downloaded to your computer!';
          }
        } catch (dlErr) {
          console.warn('[Factory Reset] Auto-download error:', dlErr);
        }
      }

      setMaintenanceSuccess(successMsg);
      handleCloseResetModal();

      // Clear stale order selection caches from localStorage
      localStorage.removeItem('erp_selectedOrderId');
      localStorage.removeItem('erp_selectedUnitId');
      localStorage.removeItem('erp_all_selectedUnitIds');
      localStorage.removeItem('vyom_purchase_orders');

      // Refresh system settings and notify application
      fetchSettings();
      window.dispatchEvent(new CustomEvent('erpSettingsUpdated'));
      window.dispatchEvent(new CustomEvent('orderUpdated'));
      window.dispatchEvent(new CustomEvent('ordersUpdated'));
    } catch (err) {
      console.error('Factory reset error:', err);
      setResetModalError(err.message || 'An unexpected error occurred during factory reset.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleSystemMaintenance = (action) => {
    if (action === 'Backup Database') {
      return handleDownloadBackup();
    }
    if (action === 'Clear Activity Logs') {
      return handleClearActivityLogs();
    }
    if (action === 'Reset Database') {
      return handleOpenResetModal();
    }
  };

  return (
    <div style={{ padding: '24px' }} className="settings-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <h2 style={{ margin: 0, color: '#fff', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Settings size={22} style={{ color: '#f59e0b' }} />
          Administration Settings
        </h2>
      </div>

      <div className="settings-layout">
        {/* Navigation Sidebar */}
        <div className="settings-tabs">
          <button 
            className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <Sliders size={14} />
            General Setup
          </button>
          <button 
            className={`tab-btn ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            <Settings size={14} />
            Workflow & Features
          </button>
          <button 
            className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <ShieldAlert size={14} />
            System Maintenance
          </button>
        </div>

        {/* Content Pane */}
        <div className="settings-content">
          {activeTab === 'general' && (
            <>
              <form onSubmit={handleSave} className="settings-form">
              <h3 className="section-title">General System Configurations</h3>
              
              <div className="form-group">
                <label>Company Name (Logo Text)</label>
                <input 
                  type="text" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  required
                />
                <span className="helper-text">This label appears on the top-left logo header.</span>
              </div>

              <div className="form-group">
                <label>System/Factory Title</label>
                <input 
                  type="text" 
                  value={systemTitle} 
                  onChange={(e) => setSystemTitle(e.target.value)} 
                  required
                />
                <span className="helper-text">Descriptive subtitle shown next to the logo.</span>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label>System Timezone</label>
                  <select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option value="IST (UTC+05:30)">India Standard Time (IST)</option>
                    <option value="UTC">Coordinated Universal Time (UTC)</option>
                    <option value="EST (UTC-05:00)">Eastern Standard Time (EST)</option>
                    <option value="GMT">Greenwich Mean Time (GMT)</option>
                  </select>
                </div>

                <div className="form-group half">
                  <label>Default Page Size</label>
                  <select value={defaultPageSize} onChange={(e) => setDefaultPageSize(e.target.value)}>
                    <option value="10">10 Rows per page</option>
                    <option value="20">20 Rows per page</option>
                    <option value="50">50 Rows per page</option>
                    <option value="100">100 Rows per page</option>
                  </select>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={isSaving}>
                  {isSaving ? <RefreshCw size={14} className="spin" /> : <Save size={14} />}
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
                {saveSuccess && (
                  <span className="success-msg">
                    <CheckCircle size={14} /> Settings updated successfully!
                  </span>
                )}
              </div>
            </form>

            {/* Order Numbering - DB-backed, one-time lock */}
            <div style={{ marginTop: '28px', padding: '20px 24px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px' }}>
              <h3 style={{ margin: '0 0 6px 0', color: 'var(--text)', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Hash size={16} style={{ color: '#f59e0b' }} />
                Order Number Sequence
              </h3>
              <p style={{ margin: '0 0 16px 0', color: 'var(--text3)', fontSize: '13px' }}>
                Set the starting order number for this system. <strong style={{ color: '#f59e0b' }}>Once the first order is created, this setting is permanently locked.</strong>
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {ordersExist ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 14px' }}>
                  <span style={{ color: 'var(--text3)', fontSize: '13px', whiteSpace: 'nowrap' }}>Next order number</span>
                  <span style={{ color: 'var(--text)', fontSize: '15px', fontWeight: '700' }}>{nextOrderNumber || '—'}</span>
                </div>
                ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg3)', border: '1px solid #f59e0b', borderRadius: '8px', padding: '8px 14px' }}>
                  <span style={{ color: 'var(--text3)', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {`${String(new Date().getFullYear() % 100).padStart(2, '0')}${String((new Date().getFullYear() + 1) % 100).padStart(2, '0')}`}
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={orderNumberStart}
                    onChange={e => { setOrderNumberStart(e.target.value); setOrderSettingError(''); }}
                    disabled={ordersExist}
                    style={{
                      width: '90px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: ordersExist ? 'var(--text3)' : 'var(--text)',
                      fontSize: '15px',
                      fontWeight: '700',
                      cursor: ordersExist ? 'not-allowed' : 'text',
                    }}
                  />
                </div>
                )}

                {ordersExist ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px' }}>
                    <Lock size={14} />
                    Locked &mdash; orders already exist
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleOrderNumberSave}
                    disabled={orderSettingSaving}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '8px', padding: '9px 18px', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
                  >
                    {orderSettingSaving ? <RefreshCw size={13} className="spin" /> : <Save size={13} />}
                    {orderSettingSaving ? 'Saving...' : 'Set Starting Number'}
                  </button>
                )}

                {orderSettingSuccess && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '13px' }}>
                    <CheckCircle size={14} /> Saved! Next order will be {`${String(new Date().getFullYear() % 100).padStart(2, '0')}${String((new Date().getFullYear() + 1) % 100).padStart(2, '0')}`}{String(orderNumberStart).padStart(4, '0')}
                  </span>
                )}
              </div>

              {orderSettingError && (
                <p style={{ margin: '10px 0 0', color: '#ef4444', fontSize: '12px' }}>{orderSettingError}</p>
              )}
            </div>
            </>
          )}

          {activeTab === 'workflow' && (
            <form onSubmit={handleSave} className="settings-form">
              <h3 className="section-title">Planning Module & Workflow Toggles</h3>

              <div className="toggle-group">
                <div className="toggle-item">
                  <input 
                    type="checkbox" 
                    id="enableDoubleGrouping" 
                    checked={enableDoubleGrouping}
                    onChange={(e) => setEnableDoubleGrouping(e.target.checked)}
                  />
                  <div className="toggle-label-group">
                    <label htmlFor="enableDoubleGrouping">Enable Double Grouping Filter</label>
                    <span className="toggle-desc">Allows planning board users to apply a secondary group parameter simultaneously.</span>
                  </div>
                </div>

                <div className="toggle-item">
                  <input 
                    type="checkbox" 
                    id="autoQCFromSteps" 
                    checked={autoQCFromSteps}
                    onChange={(e) => setAutoQCFromSteps(e.target.checked)}
                  />
                  <div className="toggle-label-group">
                    <label htmlFor="autoQCFromSteps">Auto-calculate QC Status</label>
                    <span className="toggle-desc">Automatically update line item QC status to completed when all QC department steps are checked off.</span>
                  </div>
                </div>

                <div className="toggle-item">
                  <input 
                    type="checkbox" 
                    id="planningFullscreenDefault" 
                    checked={planningFullscreenDefault}
                    onChange={(e) => setPlanningFullscreenDefault(e.target.checked)}
                  />
                  <div className="toggle-label-group">
                    <label htmlFor="planningFullscreenDefault">Planning Board Fullscreen by Default</label>
                    <span className="toggle-desc">Loads the Planning Module in fullscreen mode automatically.</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={isSaving}>
                  {isSaving ? <RefreshCw size={14} className="spin" /> : <Save size={14} />}
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </button>
                {saveSuccess && (
                  <span className="success-msg">
                    <CheckCircle size={14} /> Workflow updated successfully!
                  </span>
                )}
              </div>
            </form>
          )}

          {activeTab === 'maintenance' && (
            <div className="settings-form">
              <h3 className="section-title text-danger">System Operations & Diagnostics</h3>
              <p className="danger-notice">
                WARNING: The operations below are administrative privileges. Running them can modify systemic operational states or reset logging indices.
              </p>

              <div className="maintenance-actions">
                <div className="maintenance-card">
                  <div className="card-info">
                    <h4>Database Backup</h4>
                    <p>Generate a complete SQL schema and data export dump for emergency recovery.</p>
                  </div>
                  <button 
                    onClick={() => handleSystemMaintenance('Backup Database')}
                    className="maint-btn secondary"
                    disabled={isMaintenanceRunning}
                  >
                    Backup DB
                  </button>
                </div>

                <div className="maintenance-card">
                  <div className="card-info">
                    <h4>Clear Activity Logs</h4>
                    <p>Trims or wipes the system activity logger history database to conserve resources.</p>
                  </div>
                  <button 
                    onClick={() => handleSystemMaintenance('Clear Activity Logs')}
                    className="maint-btn warning"
                    disabled={isMaintenanceRunning}
                  >
                    Wipe Logs
                  </button>
                </div>

                <div className="maintenance-card">
                  <div className="card-info">
                    <h4>Factory Reset ERP</h4>
                    <p>Re-seeds and formats databases to standard template values (removes testing orders).</p>
                  </div>
                  <button 
                    onClick={handleOpenResetModal}
                    className="maint-btn danger"
                    disabled={isMaintenanceRunning || isResetting}
                  >
                    Factory Reset
                  </button>
                </div>
              </div>

              {isMaintenanceRunning && (
                <div className="maintenance-loader">
                  <RefreshCw size={18} className="spin" /> Running operations...
                </div>
              )}

              {maintenanceSuccess && (
                <div className="maintenance-result success" style={{
                  color: 'var(--green, #10b981)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  marginTop: '16px',
                  fontSize: '13px',
                  lineHeight: '1.4'
                }}>
                  <CheckCircle size={18} style={{ flexShrink: 0, color: 'var(--green, #10b981)' }} />
                  <span style={{ flex: 1 }}>{maintenanceSuccess}</span>
                  <button
                    type="button"
                    onClick={() => setMaintenanceSuccess('')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text3, #5a6070)',
                      cursor: 'pointer',
                      padding: '2px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    aria-label="Dismiss"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Factory Reset Confirmation Modal */}
      {showResetModal && (
        <div 
          className="modal-overlay open" 
          data-modal="open" 
          data-modal-overlay="true"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isResetting) {
              handleCloseResetModal();
            }
          }}
        >
          <div 
            className="modal" 
            style={{ 
              width: '560px', 
              maxWidth: '92vw',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: 'var(--bg2)',
              border: '1px solid var(--border2)',
              borderRadius: '12px',
              boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(239, 68, 68, 0.25)',
              padding: '24px'
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="factory-reset-modal-title"
          >
            <div className="modal-header" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--red, #ef4444)'
                }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 id="factory-reset-modal-title" style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: 'var(--text)' }}>
                    Factory Reset ERP
                  </h3>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>
                    Complete system wipe and factory restoration
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="modal-close"
                data-modal-close
                onClick={handleCloseResetModal}
                disabled={isResetting}
                aria-label="Close"
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text3)',
                  cursor: isResetting ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Prominent warning styling (red/danger alert banner) */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--red, #f87171)', fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>
                <AlertTriangle size={15} />
                DANGER: Irreversible Administrative Action
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: 'var(--text2)', lineHeight: '1.45' }}>
                This operation permanently purges operational transactional records from the database. Please review the details below before proceeding.
              </p>
            </div>

            {/* Clear explanation of changes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ fontSize: '16px', lineHeight: 1.2 }}>⚠️</span>
                <div style={{ fontSize: '12.5px' }}>
                  <strong style={{ color: 'var(--red, #f87171)', display: 'block', marginBottom: '2px' }}>What will be deleted:</strong>
                  <span style={{ color: 'var(--text2, #94a3b8)', lineHeight: '1.4' }}>
                    All orders, line items, panel units, steps, uploaded documents, and activity logs.
                  </span>
                </div>
              </div>

              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ fontSize: '16px', lineHeight: 1.2 }}>🛡️</span>
                <div style={{ fontSize: '12.5px' }}>
                  <strong style={{ color: 'var(--green, #10b981)', display: 'block', marginBottom: '2px' }}>What will be kept:</strong>
                  <span style={{ color: 'var(--text2, #94a3b8)', lineHeight: '1.4' }}>
                    All users, companies &amp; customer locations, task masters, panel sizes, and catalog masters.
                  </span>
                </div>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <span style={{ fontSize: '16px', lineHeight: 1.2 }}>💾</span>
                <div style={{ fontSize: '12.5px' }}>
                  <strong style={{ color: 'var(--blue, #3b82f6)', display: 'block', marginBottom: '2px' }}>Emergency Backup:</strong>
                  <span style={{ color: 'var(--text2, #94a3b8)', lineHeight: '1.4' }}>
                    An emergency snapshot will be automatically created on disk before wiping.
                  </span>
                </div>
              </div>
            </div>

            {/* Checkbox: Reset Order Number Sequence */}
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: isResetting ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
              userSelect: 'none'
            }}>
              <input
                type="checkbox"
                id="resetStartingSequenceCheckbox"
                checked={resetStartingSequence}
                onChange={(e) => setResetStartingSequence(e.target.checked)}
                disabled={isResetting}
                style={{ accentColor: 'var(--red, #ef4444)', width: '16px', height: '16px', cursor: isResetting ? 'not-allowed' : 'pointer' }}
              />
              <span style={{ fontSize: '13px', color: 'var(--text)', fontWeight: '500' }}>
                Reset Order Number Sequence to 1
              </span>
            </label>

            {/* Confirmation text input */}
            <div style={{ marginBottom: '16px' }}>
              <label htmlFor="factoryResetConfirmInput" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text)', marginBottom: '8px' }}>
                To confirm, type <span style={{ color: 'var(--red, #f87171)', fontFamily: 'monospace', fontWeight: 'bold' }}>FACTORY RESET</span> below:
              </label>
              <input
                id="factoryResetConfirmInput"
                type="text"
                value={resetConfirmationInput}
                onChange={(e) => {
                  setResetConfirmationInput(e.target.value);
                  if (resetModalError) setResetModalError('');
                }}
                placeholder="Type FACTORY RESET to confirm"
                disabled={isResetting}
                autoFocus
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '10px 14px',
                  background: 'var(--bg)',
                  border: `1px solid ${resetConfirmationInput === 'FACTORY RESET' ? 'var(--red, #ef4444)' : 'var(--border2)'}`,
                  borderRadius: '6px',
                  color: 'var(--text)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  letterSpacing: '0.5px',
                  outline: 'none'
                }}
              />
            </div>

            {/* Error alert banner */}
            {resetModalError && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid var(--red, #ef4444)',
                color: '#fca5a5',
                borderRadius: '6px',
                padding: '10px 14px',
                fontSize: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                <span>{resetModalError}</span>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={handleCloseResetModal}
                disabled={isResetting}
                style={{
                  padding: '9px 18px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  color: 'var(--text2, #94a3b8)',
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: isResetting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteFactoryReset}
                disabled={resetConfirmationInput !== 'FACTORY RESET' || isResetting}
                style={{
                  padding: '9px 20px',
                  background: resetConfirmationInput === 'FACTORY RESET' && !isResetting ? 'var(--red, #ef4444)' : 'rgba(239, 68, 68, 0.25)',
                  border: 'none',
                  borderRadius: '6px',
                  color: resetConfirmationInput === 'FACTORY RESET' && !isResetting ? '#fff' : 'rgba(255, 255, 255, 0.4)',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: resetConfirmationInput === 'FACTORY RESET' && !isResetting ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s'
                }}
              >
                {isResetting ? <RefreshCw size={14} className="spin" /> : <AlertTriangle size={14} />}
                {isResetting ? 'Resetting...' : 'Confirm Factory Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .settings-layout {
          display: flex;
          gap: 24px;
          margin-top: 16px;
        }

        .settings-tabs {
          width: 240px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--border2, #363d4a);
          color: var(--text2, #8a93a8);
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          text-align: left;
          transition: all 0.15s;
        }

        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--text, #e8eaf0);
        }

        .tab-btn.active {
          background: rgba(245, 158, 11, 0.1);
          color: var(--accent, #f59e0b);
          border-color: var(--accent, #f59e0b);
        }

        .settings-content {
          flex: 1;
          background: var(--bg2, #1c202b);
          border: 1px solid var(--border, #2e3547);
          border-radius: 12px;
          padding: 24px 30px;
          min-height: 400px;
        }

        .section-title {
          margin-top: 0;
          margin-bottom: 20px;
          color: var(--text, #e6edf3);
          font-size: 16px;
          font-weight: 600;
          border-bottom: 1px solid var(--border, #2e3547);
          padding-bottom: 10px;
        }

        .section-title.text-danger {
          color: var(--red, #f87171);
        }

        .form-group {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-row {
          display: flex;
          gap: 20px;
        }

        .form-group.half {
          flex: 1;
        }

        .form-group label {
          color: var(--text2, #94a3b8);
          font-size: 12px;
          font-weight: 500;
        }

        .form-group input[type="text"],
        .form-group select {
          background: var(--bg, #151821);
          border: 1px solid var(--border2, #3f475c);
          border-radius: 6px;
          color: var(--text, #e6edf3);
          padding: 10px 12px;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }

        .form-group input[type="text"]:focus,
        .form-group select:focus {
          border-color: var(--accent, #f59e0b);
        }

        .helper-text {
          font-size: 11px;
          color: var(--text3, #5a6070);
        }

        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .toggle-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.02);
        }

        .toggle-item input[type="checkbox"] {
          margin-top: 3px;
          cursor: pointer;
          accent-color: var(--accent, #f59e0b);
          width: 15px;
          height: 15px;
        }

        .toggle-label-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .toggle-label-group label {
          color: var(--text, #e8eaf0);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
        }

        .toggle-desc {
          font-size: 11px;
          color: var(--text2, #8a93a8);
        }

        .danger-notice {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #f87171;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .maintenance-actions {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .maintenance-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          background: rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          border: 1px solid var(--border2, #363d4a);
        }

        .card-info h4 {
          margin: 0 0 4px;
          color: var(--text, #e8eaf0);
          font-size: 13px;
          font-weight: 600;
        }

        .card-info p {
          margin: 0;
          color: var(--text2, #8a93a8);
          font-size: 11px;
        }

        .maint-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: background 0.15s;
        }

        .maint-btn.secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #e8eaf0;
        }
        .maint-btn.secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        .maint-btn.warning {
          background: rgba(245, 158, 11, 0.15);
          color: var(--accent, #f59e0b);
        }
        .maint-btn.warning:hover {
          background: rgba(245, 158, 11, 0.25);
        }

        .maint-btn.danger {
          background: rgba(239, 68, 68, 0.15);
          color: #f87171;
        }
        .maint-btn.danger:hover {
          background: rgba(239, 68, 68, 0.25);
        }

        .maintenance-loader {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 16px;
          font-size: 12px;
          color: var(--text2, #8a93a8);
        }

        .maintenance-result {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          font-size: 12px;
          color: var(--accent, #f59e0b);
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.15);
          padding: 10px 14px;
          border-radius: 6px;
        }

        .form-actions {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--accent, #f59e0b);
          border: none;
          color: #000;
          font-weight: 600;
          font-size: 13px;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.15s, transform 0.1s;
        }

        .save-btn:hover:not(:disabled) {
          background: #d97706;
        }

        .save-btn:active {
          transform: scale(0.98);
        }

        .success-msg {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #22c55e;
          font-size: 12px;
          font-weight: 500;
        }

        .spin {
          animation: spin-anim 1s linear infinite;
        }

        @keyframes spin-anim {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
