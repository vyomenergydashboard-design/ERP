import { useState, useEffect } from 'react';
import { DEPTS } from '../data/planningData';

const FIELD_TYPES = ['Text', 'Number', 'Date', 'Yes/No', 'Dropdown'];

// Known DB fields admins can pick from (grouped by category)
const DATAKEY_OPTIONS = [
  // ── Order ──────────────────────────────────────────────
  { key: 'orders.order_number',           label: 'Order #' },
  { key: 'orders.po_number',              label: 'PO Number' },
  { key: 'orders.order_date',             label: 'Order Date' },
  { key: 'orders.delivery_date',          label: 'Delivery Date' },
  { key: 'orders.planned_dispatch_date',  label: 'Planned Dispatch Date' },
  { key: 'orders.priority',               label: 'Priority' },
  { key: 'orders.classification',         label: 'Classification' },
  { key: 'orders.packaging_type',         label: 'Packaging Type' },
  { key: 'orders.end_client_name',        label: 'End Client Name' },
  { key: 'orders.reference_number',       label: 'Reference Number' },
  { key: 'orders.gst_number',             label: 'GST Number' },
  { key: 'orders.hold_status',            label: 'Hold Status' },
  { key: 'orders.order_status',           label: 'Order Status' },
  { key: 'orders.notes',                  label: 'Order Notes' },
  // ── Company ────────────────────────────────────────────
  { key: 'company_name',                  label: 'Company Name' },
  { key: 'company_city',                  label: 'Company City' },
  { key: 'person_in_charge',              label: 'Person In Charge' },
  { key: 'contact_number',               label: 'Contact Number' },
  { key: 'company_email',                 label: 'Company Email' },
  // ── Planning Dates ─────────────────────────────────────
  { key: 'orders.wiring_assigned_date',   label: 'Wiring Assigned Date' },
  { key: 'orders.wiring_expected_date',   label: 'Wiring Expected Date' },
  { key: 'orders.expected_qc_date',       label: 'Expected QC Date' },
  { key: 'orders.qc_date',               label: 'QC Date' },
  { key: 'orders.qc_status',             label: 'QC Status' },
  // ── Line Item ──────────────────────────────────────────
  { key: 'li.material_description',       label: 'Material Description' },
  { key: 'li.part_number',               label: 'Part Number' },
  { key: 'li.panel_type_size',           label: 'Panel Type / Size' },
  { key: 'li.delivery_date',             label: 'Line Item Delivery Date' },
  { key: 'li.quantity',                  label: 'Quantity' },
  { key: 'li.unit',                      label: 'Unit' },
  { key: 'li.unit_price',               label: 'Unit Price' },
  { key: 'li.total_price',              label: 'Total Price' },
  // ── Documents ──────────────────────────────────────────
  { key: 'docs.any',                    label: 'Any document uploaded' },
  { key: 'docs.PO',                     label: 'PO document uploaded' },
  { key: 'docs.Drawing',                label: 'Drawing uploaded' },
  { key: 'docs.BOM',                    label: 'BOM uploaded' },
  { key: 'docs.QC',                     label: 'QC document uploaded' },
  { key: 'docs.Dispatch',               label: 'Dispatch document uploaded' },
  { key: 'docs.Quotation',              label: 'Quotation uploaded' },
  { key: 'docs.General',                label: 'General document uploaded' },
  { key: 'docs.TaskUpload',             label: 'Task upload present' },
  // ── Unit (unit-level tasks only) ───────────────────────
  { key: 'unit_serial',                  label: 'Unit Serial' },
  { key: 'short_serial',                 label: 'Short Serial' },
  { key: 'current_dept',                 label: 'Current Department' },
  { key: 'unit_status',                  label: 'Unit Status' },
  // ── Custom ─────────────────────────────────────────────
  { key: '__custom__',                   label: 'Custom key…' },
];

// Condition operators for the visual if-statement builder
const OPERATORS = [
  { value: '',                           label: '— No condition (any non-empty) —', needsValue: false },
  { value: 'IS_NOT_EMPTY',               label: 'is not empty',                     needsValue: false },
  { value: 'IS_EMPTY',                   label: 'is empty',                         needsValue: false },
  { value: 'HAS_DOCS',                   label: 'has documents (count > 0)',      needsValue: false },
  { value: 'NO_DOCS',                    label: 'has no documents (count = 0)',   needsValue: false },
  { value: 'EQUALS',                     label: '= equals',                         needsValue: true  },
  { value: 'NOT_EQUALS',                 label: '≠ not equals',                     needsValue: true  },
  { value: 'CONTAINS',                   label: 'contains',                         needsValue: true  },
  { value: 'GT',                         label: '> greater than',                   needsValue: true  },
  { value: 'GTE',                        label: '≥ greater than or equal',          needsValue: true  },
  { value: 'LT',                         label: '< less than',                      needsValue: true  },
  { value: 'LTE',                        label: '≤ less than or equal',             needsValue: true  },
  { value: 'DATE_FUTURE',                label: 'date is in the future',            needsValue: false },
  { value: 'DATE_PAST',                  label: 'date is today or past',            needsValue: false },
];

// Build a JS condition string from visual builder inputs
const buildCondition = (operator, conditionValue) => {
  switch (operator) {
    case '':             return '';
    case 'IS_NOT_EMPTY': return '$val !== "" && $val !== null && $val !== undefined';
    case 'IS_EMPTY':     return '$val === "" || $val === null || $val === undefined';
    case 'HAS_DOCS':     return 'Number($val) > 0';
    case 'NO_DOCS':      return 'Number($val) === 0 || $val === ""';
    case 'EQUALS':       return `String($val).toLowerCase() === ${JSON.stringify(String(conditionValue).toLowerCase())}`;
    case 'NOT_EQUALS':   return `String($val).toLowerCase() !== ${JSON.stringify(String(conditionValue).toLowerCase())}`;
    case 'CONTAINS':     return `String($val).toLowerCase().includes(${JSON.stringify(String(conditionValue).toLowerCase())})`;
    case 'GT':           return `Number($val) > ${Number(conditionValue) || 0}`;
    case 'GTE':          return `Number($val) >= ${Number(conditionValue) || 0}`;
    case 'LT':           return `Number($val) < ${Number(conditionValue) || 0}`;
    case 'LTE':          return `Number($val) <= ${Number(conditionValue) || 0}`;
    case 'DATE_FUTURE':  return 'new Date($val) > new Date()';
    case 'DATE_PAST':    return 'new Date($val) <= new Date()';
    default:             return '';
  }
};

// Human-readable description of a saved condition
const describeCondition = (condition, datakey) => {
  if (!condition) return 'auto-done when not empty';
  const fieldLabel = DATAKEY_OPTIONS.find(o => o.key === datakey)?.label || datakey;
  // Document checks
  if (condition === 'Number($val) > 0')                      return `${fieldLabel} → at least 1 document`;
  if (condition.includes('Number($val) === 0'))              return `${fieldLabel} → no documents`;
  // Standard checks
  if (condition.includes('!== ""'))   return `${fieldLabel} is not empty`;
  if (condition.includes('=== ""'))   return `${fieldLabel} is empty`;
  if (condition.includes('.includes('))return `${fieldLabel} contains value`;
  if (condition.includes('new Date($val) > new Date()'))  return `${fieldLabel} is in the future`;
  if (condition.includes('new Date($val) <= new Date()')) return `${fieldLabel} is today or past`;
  if (condition.includes('=== '))  return `${fieldLabel} equals value`;
  if (condition.includes('!== '))  return `${fieldLabel} does not equal value`;
  if (condition.includes('> '))    return `${fieldLabel} > value`;
  if (condition.includes('>= '))   return `${fieldLabel} >= value`;
  if (condition.includes('< '))    return `${fieldLabel} < value`;
  if (condition.includes('<= '))   return `${fieldLabel} <= value`;
  return condition;
};

const ORDER_FIELDS = [
  { key: 'order_number',   label: 'Order Number' },
  { key: 'company_name',   label: 'Company Name' },
  { key: 'delivery_date',  label: 'Delivery Date' },
  { key: 'po_number',      label: 'PO Number' },
  { key: 'packaging_type', label: 'Packaging Type' },
  { key: 'priority',       label: 'Priority' },
  { key: 'notes',          label: 'Order Notes' },
];

export default function Masters() {
  const [activeTab, setActiveTab] = useState('companies');
  
  // Companies State
  const [companies, setCompanies] = useState([]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [companyFormData, setCompanyFormData] = useState({
    name: '',
    locations: [{ address: '', city: '', person_in_charge: '', contact_number: '', email: '' }]
  });

  // Tasks State
  const [tasks, setTasks] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    dept: 'Sales',
    name: '',
    sub: '',
    special: '',
    is_mandatory: true,
    requires_upload: false,
    default_doc_type: 'General',
    order_fields: []
  });
  const [taskCustomFields, setTaskCustomFields] = useState([]);
  const [showFieldBuilder, setShowFieldBuilder] = useState(false);
  const [newField, setNewField] = useState({ label: '', type: 'Text', options: '', datakeyPreset: '', customDatakey: '', operator: '', conditionValue: '' });

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canEditMasters = user.role?.toLowerCase() === 'admin';

  useEffect(() => {
    fetchCompanies();
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if Alt+N is pressed
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault(); // Prevent standard browser Alt+N shortcut behavior
        if (activeTab === 'companies' && canEditMasters) {
          setShowCompanyModal(true);
        } else if (activeTab === 'tasks' && canEditMasters) {
          setEditingTaskId(null);
          setTaskFormData({ dept: 'Sales', name: '', sub: '', special: '', is_mandatory: true, requires_upload: false, order_fields: [] });
          setTaskCustomFields([]);
          setShowFieldBuilder(false);
          setShowTaskModal(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeTab, canEditMasters]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/companies", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setCompanies(await res.json());
    } catch (err) { console.error(err); }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/task_masters", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setTasks(await res.json());
    } catch (err) { console.error(err); }
  };

  const handleLocationChange = (index, field, value) => {
    const newLocs = [...companyFormData.locations];
    newLocs[index][field] = value;
    setCompanyFormData({ ...companyFormData, locations: newLocs });
  };

  const addLocation = () => {
    setCompanyFormData({
      ...companyFormData,
      locations: [...companyFormData.locations, { address: '', city: '', person_in_charge: '', contact_number: '', email: '' }]
    });
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(window.API_BASE + "/api/companies", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(companyFormData)
      });
      if (res.ok) {
        setShowCompanyModal(false);
        setCompanyFormData({ name: '', locations: [{ address: '', city: '', person_in_charge: '', contact_number: '', email: '' }] });
        fetchCompanies();
      }
    } catch (err) { console.error(err); }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!editingTaskId;
    const url = isEdit ? `${window.API_BASE}/api/task_masters/${editingTaskId}` : window.API_BASE + "/api/task_masters";
    const method = isEdit ? 'PUT' : 'POST';

    // Strip values from field definitions before saving to template
    const fieldDefs = taskCustomFields.map(({ id, label, type, options, datakey, condition }) => ({ 
      id, 
      label, 
      type, 
      options: options || [], 
      datakey: datakey || '', 
      condition: condition || '' 
    }));

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ ...taskFormData, custom_fields: fieldDefs, order_fields: taskFormData.order_fields || [] })
      });
      if (res.ok) {
        setShowTaskModal(false);
        setEditingTaskId(null);
        setTaskFormData({ dept: 'Sales', name: '', sub: '', special: '', is_mandatory: true, requires_upload: false, default_doc_type: 'General', order_fields: [] });
        setTaskCustomFields([]);
        setShowFieldBuilder(false);
        fetchTasks();
      } else {
        alert('Failed to save task');
      }
    } catch (err) { console.error(err); }
  };

  const handleEditTaskClick = (task) => {
    setEditingTaskId(task.id);
    setTaskFormData({
      dept: task.dept,
      name: task.name,
      sub: task.sub || '',
      special: task.special || '',
      is_mandatory: task.is_mandatory,
      requires_upload: task.requires_upload,
      default_doc_type: task.default_doc_type || 'General',
      order_fields: Array.isArray(task.order_fields) ? task.order_fields : (task.order_fields ? JSON.parse(task.order_fields) : [])
    });
    try {
      const cf = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
      setTaskCustomFields(cf);
    } catch { setTaskCustomFields([]); }
    setShowFieldBuilder(false);
    setShowTaskModal(true);
  };

  const addTaskField = () => {
    if (!newField.label.trim()) { alert('Label is required.'); return; }
    const effectiveDatakey = newField.datakeyPreset === '__custom__'
      ? (newField.customDatakey || '').trim()
      : (newField.datakeyPreset || '').trim();
    const effectiveCondition = buildCondition(newField.operator, newField.conditionValue);
    const field = {
      id: Date.now(),
      label: newField.label.trim(),
      type: newField.type,
      options: newField.type === 'Dropdown' ? newField.options.split(',').map(o => o.trim()).filter(Boolean) : [],
      datakey: effectiveDatakey,
      condition: effectiveCondition,
    };
    setTaskCustomFields(prev => [...prev, field]);
    setNewField({ label: '', type: 'Text', options: '', datakeyPreset: '', customDatakey: '', operator: '', conditionValue: '' });
    setShowFieldBuilder(false);
  };

  const removeTaskField = (id) => setTaskCustomFields(prev => prev.filter(f => f.id !== id));

  const handleDeleteTaskClick = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/task_masters/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchTasks();
      } else {
        alert('Failed to delete task');
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
        <button className={`vbtn ${activeTab === 'companies' ? 'active' : ''}`} onClick={() => setActiveTab('companies')}>Companies</button>
        <button className={`vbtn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Task Masters</button>
      </div>

      {activeTab === 'companies' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: 'var(--text)' }}>Company Masters</h2>
            {canEditMasters && <button className="vbtn" onClick={() => setShowCompanyModal(true)}>+ Register Company (Alt+N)</button>}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {companies.map(comp => (
              <div key={comp.id} style={{ background: 'var(--bg2)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)' }}>{comp.name}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {comp.locations.map(loc => (
                    <div key={loc.id} style={{ background: 'var(--bg3)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <div style={{ color: 'var(--blue)', fontWeight: 'bold', marginBottom: '8px' }}>{loc.city}</div>
                      <div style={{ fontSize: '13px', color: 'var(--text2)', marginBottom: '4px' }}>{loc.address}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '12px' }}>
                        <div><strong>Contact:</strong> {loc.person_in_charge || 'N/A'}</div>
                        <div><strong>Phone:</strong> {loc.contact_number || 'N/A'}</div>
                        <div><strong>Email:</strong> {loc.email || 'N/A'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'tasks' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, color: 'var(--text)' }}>Task Masters</h2>
            {canEditMasters && (
              <button className="vbtn" onClick={() => {
                setEditingTaskId(null);
                setTaskFormData({ dept: 'Sales', name: '', sub: '', special: '', is_mandatory: true, requires_upload: false, default_doc_type: 'General', order_fields: [] });
                setTaskCustomFields([]);
                setShowFieldBuilder(false);
                setShowTaskModal(true);
              }}>+ New Task (Alt+N)</button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {DEPTS.map(dept => {
              const deptTasks = tasks.filter(t => t.dept === dept.id);
              if (deptTasks.length === 0) return null;
              
              return (
                <div key={dept.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ width: '4px', height: '16px', background: dept.color, borderRadius: '2px' }} />
                    <h3 style={{ margin: 0, color: 'var(--text)', fontSize: '15px' }}>{dept.label}</h3>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    {deptTasks.map(task => (
                      <div key={task.id} style={{ background: 'var(--bg2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: dept.color, fontWeight: 'bold', textTransform: 'uppercase' }}>{task.dept}</span>
                          <span style={{ fontSize: '10px', background: task.is_mandatory ? 'var(--blue-dim)' : 'var(--gray-dim)', color: task.is_mandatory ? 'var(--blue)' : 'var(--text3)', padding: '2px 6px', borderRadius: '4px' }}>
                            {task.is_mandatory ? 'MANDATORY' : 'OPTIONAL'}
                          </span>
                        </div>
                        <div style={{ color: 'var(--text)', fontWeight: '500', marginBottom: '4px' }}>{task.name}</div>
                        <div style={{ color: 'var(--text3)', fontSize: '12px', marginBottom: '12px' }}>{task.sub || 'No description'}</div>
                        
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {task.requires_upload && <span style={{ fontSize: '10px', background: '#f59e0b44', color: '#fbbf24', padding: '2px 6px', borderRadius: '4px' }}>Requires: {task.default_doc_type || 'General'}</span>}
                            {task.special && <span style={{ fontSize: '10px', background: '#10b98144', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>Special: {task.special}</span>}
                          </div>
                          {canEditMasters && (
                            <div style={{ display: 'flex', gap: '4px' }}>
                              <button 
                                style={{ background: 'transparent', border: '1px solid var(--border2)', color: 'var(--text2)', borderRadius: '4px', cursor: 'pointer', padding: '2px 6px', fontSize: '10px' }}
                                onClick={() => handleEditTaskClick(task)}
                              >Edit</button>
                              <button 
                                style={{ background: 'transparent', border: '1px solid #ef444444', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', padding: '2px 6px', fontSize: '10px' }}
                                onClick={() => handleDeleteTaskClick(task.id)}
                              >Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Company Modal */}
      {showCompanyModal && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setShowCompanyModal(false); }}>
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <div className="modal-title">Register Company</div>
              <button className="modal-close" onClick={() => setShowCompanyModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCompanySubmit}>
                <div className="modal-field">
                  <label>Company Name</label>
                  <input type="text" className="form-input" required value={companyFormData.name} onChange={(e) => setCompanyFormData({ ...companyFormData, name: e.target.value })} />
                </div>
                <div style={{ marginTop: '24px', marginBottom: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', color: 'var(--text)' }}>Locations</div>
                {companyFormData.locations.map((loc, idx) => (
                  <div key={idx} style={{ background: 'var(--bg3)', padding: '16px', borderRadius: '8px', marginBottom: '16px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                      <div><label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>City *</label><input type="text" className="form-input" required value={loc.city} onChange={e => handleLocationChange(idx, 'city', e.target.value)} /></div>
                      <div><label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Person in Charge</label><input type="text" className="form-input" value={loc.person_in_charge} onChange={e => handleLocationChange(idx, 'person_in_charge', e.target.value)} /></div>
                    </div>
                    <div style={{ marginBottom: '12px' }}><label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Full Address</label><input type="text" className="form-input" value={loc.address} onChange={e => handleLocationChange(idx, 'address', e.target.value)} /></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div><label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Contact Number</label><input type="text" className="form-input" value={loc.contact_number} onChange={e => handleLocationChange(idx, 'contact_number', e.target.value)} /></div>
                      <div><label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Email</label><input type="email" className="form-input" value={loc.email} onChange={e => handleLocationChange(idx, 'email', e.target.value)} /></div>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addLocation} style={{ background: 'transparent', border: '1px dashed var(--border2)', color: 'var(--text3)', width: '100%', padding: '12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '24px' }}>+ Add Another Location</button>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" className="vbtn" style={{ background: 'var(--bg4)' }}  onClick={() => setShowCompanyModal(false)}>Cancel</button>
                  <button type="submit" className="vbtn">Save Company</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setShowTaskModal(false); }}>
          <div className="modal" style={{ maxWidth: '520px', width: '95%' }}>
            <div className="modal-header">
              <div className="modal-title">{editingTaskId ? 'Edit Task Master' : 'New Task Master'}</div>
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleTaskSubmit}>
                <div className="modal-field">
                  <label>Department</label>
                  <select className="form-select" value={taskFormData.dept} onChange={(e) => setTaskFormData({ ...taskFormData, dept: e.target.value })}>
                    {DEPTS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </select>
                </div>
                <div className="modal-field">
                  <label>Task Name</label>
                  <input type="text" className="form-input" required value={taskFormData.name} onChange={(e) => setTaskFormData({ ...taskFormData, name: e.target.value })} />
                </div>
                <div className="modal-field">
                  <label>Description / Subtitle</label>
                  <input type="text" className="form-input" value={taskFormData.sub} onChange={(e) => setTaskFormData({ ...taskFormData, sub: e.target.value })} />
                </div>
                <div className="modal-field" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }}>
                  <input type="checkbox" checked={taskFormData.is_mandatory} onChange={(e) => setTaskFormData({ ...taskFormData, is_mandatory: e.target.checked })} />
                  <label style={{ margin: 0, color: 'var(--text)' }}>Mandatory Task (added to all new orders)</label>
                </div>
                <div className="modal-field" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
                  <input type="checkbox" checked={taskFormData.requires_upload} onChange={(e) => setTaskFormData({ ...taskFormData, requires_upload: e.target.checked })} />
                  <label style={{ margin: 0, color: 'var(--text)' }}>Requires Document Upload to complete</label>
                </div>
                {taskFormData.requires_upload && (
                  <div className="modal-field" style={{ marginLeft: '24px', marginTop: '8px' }}>
                    <label style={{ color: '#fff', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Default Document Type</label>
                    <select 
                      className="form-select" 
                      value={taskFormData.default_doc_type || 'General'} 
                      onChange={(e) => setTaskFormData({ ...taskFormData, default_doc_type: e.target.value })}
                      style={{ fontSize: '13px', width: '100%', padding: '6px 12px' }}
                    >
                      <option value="General">General</option>
                      <option value="PO">PO</option>
                      <option value="Quotation">Quotation</option>
                      <option value="BOM">BOM</option>
                      <option value="Drawing">Drawing</option>
                      <option value="QC Report">QC Report</option>
                      <option value="Dispatch Document">Dispatch Document</option>
                      <option value="Photo">Photo</option>
                    </select>
                  </div>
                )}

                {/* Order Fields to Display */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #333' }}>
                  <label style={{ color: '#fff', fontWeight: '600', display: 'block', marginBottom: '10px' }}>Order Fields to Show</label>
                  <div style={{ color: 'var(--text3)', fontSize: '11px', marginBottom: '10px' }}>These fields from the order will be shown as read-only reference inside the task modal.</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {ORDER_FIELDS.map(f => {
                      const checked = (taskFormData.order_fields || []).includes(f.key);
                      return (
                        <label key={f.key} style={{
                          display: 'flex', alignItems: 'center', gap: '6px',
                          background: checked ? 'var(--blue-dim)' : 'var(--bg3)',
                          border: `1px solid ${checked ? 'rgba(59,130,246,0.4)' : 'var(--border)'}`,
                          borderRadius: '6px', padding: '5px 10px', cursor: 'pointer',
                          fontSize: '12px', color: checked ? 'var(--blue)' : 'var(--text3)'
                        }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            style={{ display: 'none' }}
                            onChange={() => {
                              const curr = taskFormData.order_fields || [];
                              const next = checked ? curr.filter(k => k !== f.key) : [...curr, f.key];
                              setTaskFormData(p => ({ ...p, order_fields: next }));
                            }}
                          />
                          {checked ? '✓ ' : ''}{f.label}
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ color: 'var(--text)', fontWeight: '600' }}>Form Fields</label>
                    <button
                      type="button"
                      onClick={() => setShowFieldBuilder(!showFieldBuilder)}
                      style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                    >
                      {showFieldBuilder ? 'Cancel' : '+ Add Field'}
                    </button>
                  </div>

                  {showFieldBuilder && (
                    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <label style={{ fontSize: '11px', color: 'var(--text3)', display: 'block', marginBottom: '4px' }}>Label *</label>
                        <input type="text" className="form-input" value={newField.label} onChange={e => setNewField(p => ({ ...p, label: e.target.value }))} placeholder="e.g. Test Voltage" />
                      </div>
                      {/* ── IF-STATEMENT BUILDER ── */}
                      <div style={{ background: 'var(--bg4)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: '8px', padding: '12px', marginBottom: '12px' }}>
                        <div style={{ fontSize: '11px', color: '#a78bfa', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>Auto-Done Trigger (optional)</div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '10px' }}>If the selected DB field matches this condition, the task is automatically marked Done.</div>
                        {/* Row: IF [field] [operator] [value] */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#a78bfa', minWidth: '18px' }}>IF</span>
                          {/* Data Key picker */}
                          <div style={{ flex: '1 1 160px' }}>
                            <select
                              className="form-select"
                              value={newField.datakeyPreset || ''}
                              onChange={e => setNewField(p => ({ ...p, datakeyPreset: e.target.value, customDatakey: '', operator: '', conditionValue: '' }))}
                            >
                              <option value="">— pick a field —</option>
                              {DATAKEY_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                            </select>
                            {newField.datakeyPreset === '__custom__' && (
                              <input
                                type="text"
                                className="form-input"
                                style={{ marginTop: '6px', fontFamily: 'monospace', fontSize: '12px' }}
                                value={newField.customDatakey || ''}
                                onChange={e => setNewField(p => ({ ...p, customDatakey: e.target.value }))}
                                placeholder="table.column_name"
                              />
                            )}
                          </div>
                          {/* Operator picker */}
                          <div style={{ flex: '1 1 160px' }}>
                            <select
                              className="form-select"
                              value={newField.operator || ''}
                              onChange={e => setNewField(p => ({ ...p, operator: e.target.value, conditionValue: '' }))}
                              disabled={!newField.datakeyPreset || newField.datakeyPreset === ''}
                            >
                              {OPERATORS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                          </div>
                          {/* Value input — only shown when operator needs it */}
                          {OPERATORS.find(o => o.value === newField.operator)?.needsValue && (
                            <div style={{ flex: '1 1 120px' }}>
                              <input
                                type="text"
                                className="form-input"
                                value={newField.conditionValue || ''}
                                onChange={e => setNewField(p => ({ ...p, conditionValue: e.target.value }))}
                                placeholder="value…"
                              />
                            </div>
                          )}
                        </div>
                        {/* Preview */}
                        {newField.datakeyPreset && newField.datakeyPreset !== '' && (
                          <div style={{ marginTop: '8px', fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace', background: 'var(--bg3)', padding: '6px 10px', borderRadius: '4px' }}>
                            {buildCondition(newField.operator, newField.conditionValue)
                              ? `Auto-done: ${buildCondition(newField.operator, newField.conditionValue)}`
                              : 'Auto-done when field has any value'}
                          </div>
                        )}
                      </div>
                      <button type="button" onClick={addTaskField} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                        Add Field
                      </button>
                    </div>
                  )}

                  {taskCustomFields.length === 0 ? (
                    <div style={{ color: 'var(--text3)', fontSize: '12px', fontStyle: 'italic', padding: '8px 0' }}>No form fields defined. Users will only see Notes when filling this task.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {taskCustomFields.map(f => (
                        <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg3)', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div>
                              <span style={{ color: 'var(--text)', fontSize: '13px', fontWeight: '600' }}>{f.label}</span>
                              {f.options?.length > 0 && <span style={{ marginLeft: '6px', fontSize: '10px', color: 'var(--text3)' }}>({f.options.join(', ')})</span>}
                            </div>
                            {(f.datakey || f.condition) && (
                              <div style={{ fontSize: '11px', color: '#a78bfa', marginTop: '3px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '4px', padding: '1px 6px' }}>
                                  IF {describeCondition(f.condition, f.datakey)}
                                </span>
                              </div>
                            )}
                          </div>
                          <button type="button" onClick={() => removeTaskField(f.id)} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: '14px' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="vbtn" style={{ background: '#333' }} onClick={() => setShowTaskModal(false)}>Cancel</button>
                  <button type="submit" className="vbtn">{editingTaskId ? 'Update Task' : 'Save Task'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

