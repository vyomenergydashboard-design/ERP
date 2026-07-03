import { useState, useEffect } from 'react';
import { Settings, Save, RefreshCw, Sliders, ShieldAlert, CheckCircle } from 'lucide-react';

export default function SettingsView() {
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('erp_company_name') || 'Vyom ERP');
  const [systemTitle, setSystemTitle] = useState(() => localStorage.getItem('erp_system_title') || 'Control Panel Manufacturing');
  const [timezone, setTimezone] = useState(() => localStorage.getItem('erp_timezone') || 'IST (UTC+05:30)');
  const [defaultPageSize, setDefaultPageSize] = useState(() => localStorage.getItem('erp_default_page_size') || '20');

  // Workflow toggles
  const [enableDoubleGrouping, setEnableDoubleGrouping] = useState(() => localStorage.getItem('erp_double_grouping') !== 'false');
  const [autoQCFromSteps, setAutoQCFromSteps] = useState(() => localStorage.getItem('erp_auto_qc_calc') === 'true');
  const [planningFullscreenDefault, setPlanningFullscreenDefault] = useState(() => localStorage.getItem('erp_planning_fs_default') === 'true');

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [maintenanceSuccess, setMaintenanceSuccess] = useState('');
  const [isMaintenanceRunning, setIsMaintenanceRunning] = useState(false);

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

  const handleSystemMaintenance = (action) => {
    if (!window.confirm(`Are you sure you want to run: "${action}"? This action cannot be undone.`)) {
      return;
    }
    setIsMaintenanceRunning(true);
    setMaintenanceSuccess('');

    setTimeout(() => {
      setIsMaintenanceRunning(false);
      if (action === 'Clear Activity Logs') {
        setMaintenanceSuccess('Activity logs cleared successfully (simulated).');
      } else if (action === 'Reset Database') {
        setMaintenanceSuccess('Database reset and re-seeded successfully.');
      } else if (action === 'Backup Database') {
        setMaintenanceSuccess('Database backup generated: vyom_erp_backup_' + new Date().toISOString().split('T')[0] + '.sql');
      }
      setTimeout(() => setMaintenanceSuccess(''), 5000);
    }, 1200);
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
                    onClick={() => handleSystemMaintenance('Reset Database')}
                    className="maint-btn danger"
                    disabled={isMaintenanceRunning}
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
                <div className="maintenance-result">
                  <CheckCircle size={14} /> {maintenanceSuccess}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
          background: #14161a;
          border: 1px solid var(--border2, #363d4a);
          border-radius: 12px;
          padding: 24px 30px;
          min-height: 400px;
        }

        .section-title {
          margin-top: 0;
          margin-bottom: 20px;
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 10px;
        }

        .section-title.text-danger {
          color: #f87171;
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
          color: var(--text2, #8a93a8);
          font-size: 12px;
          font-weight: 500;
        }

        .form-group input[type="text"],
        .form-group select {
          background: #0e0f11;
          border: 1px solid var(--border2, #363d4a);
          border-radius: 6px;
          color: var(--text, #e8eaf0);
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
