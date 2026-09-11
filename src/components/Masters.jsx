import { useState, useEffect } from 'react';
import { DEPTS } from '../data/planningData';

const FIELD_TYPES = ['Text', 'Number', 'Date', 'Date & Time', 'Yes/No', 'Dropdown'];

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
  { key: 'orders.project_name',           label: 'Project Name' },
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
  { key: 'unit_serial',                  label: 'Serial No.' },
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

  // Column Masters State
  const [columns, setColumns] = useState([]);
  const [visibilityByDept, setVisibilityByDept] = useState({});
  const [showColModal, setShowColModal] = useState(false);
  const [colFormData, setColFormData] = useState({ label: '', col_key: '', category: 'Order', field_type: 'Text' });
  const [colKeyManuallyEdited, setColKeyManuallyEdited] = useState(false);
  const [savingVisibility, setSavingVisibility] = useState(false);
  const [colSaveSuccess, setColSaveSuccess] = useState('');

  // Part Number Masters State
  const [partMasters, setPartMasters] = useState([]);
  const [showPartModal, setShowPartModal] = useState(false);
  const [editingPartId, setEditingPartId] = useState(null);
  const [partFormData, setPartFormData] = useState({ part_number: '', client_name: '', project: '', description: '', category: 'Standard' });
  const [newPartDrawingFile, setNewPartDrawingFile] = useState(null);
  const [newPartBomFile, setNewPartBomFile] = useState(null);
  const [partSearch, setPartSearch] = useState('');

  // Document modals for Part Number Masters
  const [pdfViewerDoc, setPdfViewerDoc] = useState(null);
  const [showDocUploadModal, setShowDocUploadModal] = useState(false);
  const [activeUploadTarget, setActiveUploadTarget] = useState(null);
  const [docUploadFile, setDocUploadFile] = useState(null);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  const [showDocHistoryModal, setShowDocHistoryModal] = useState(false);
  const [activeHistoryTarget, setActiveHistoryTarget] = useState(null);
  const [activeHistoryList, setActiveHistoryList] = useState([]);

  // Panel Size Masters State
  const [panelSizes, setPanelSizes] = useState([]);
  const [showPanelSizeModal, setShowPanelSizeModal] = useState(false);
  const [editingPanelSizeId, setEditingPanelSizeId] = useState(null);
  const [panelSizeForm, setPanelSizeForm] = useState({ panel_code: '', panel_size: '', ip_rating: '', comments: '' });
  const [panelSizeSearch, setPanelSizeSearch] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const canEditMasters = !user.role || ['admin', 'manager'].includes(user.role?.toLowerCase());
  const canEditPartMaster = !user.role || ['admin', 'manager', 'design', 'sales'].includes(user.role?.toLowerCase());
  const isDesignUser = (user.role || '').trim().toLowerCase() === 'design';
  const canViewRevisionHistory = !isDesignUser;

  const formatDateDMY = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return String(dateVal);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getDocUrl = (doc) => {
    if (!doc) return '#';
    let pathStr = typeof doc === 'string' ? doc : (doc.file_path || doc.filePath || doc.file_name || '');
    if (!pathStr) return '#';
    pathStr = pathStr.replace(/\\/g, '/');
    const uploadsIdx = pathStr.indexOf('uploads/');
    let relPath = uploadsIdx !== -1 ? pathStr.substring(uploadsIdx + 8) : pathStr.split('/').pop();
    relPath = relPath.replace(/^\/+/, '');
    const tokenParam = token ? `?token=${encodeURIComponent(token)}` : '';
    const baseUrl = window.API_BASE || '';
    return `${baseUrl}/uploads/${relPath}${tokenParam}`;
  };

  useEffect(() => {
    fetchCompanies();
    fetchTasks();
    fetchColumnMasters();
    fetchPartNumberMasters();
    fetchPanelSizes();
  }, []);

  const fetchPanelSizes = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/panel-size-masters", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPanelSizes(await res.json());
      }
    } catch (err) { console.error(err); }
  };

  const handleSavePanelSize = async (e) => {
    e.preventDefault();
    const sizeVal = (panelSizeForm.panel_size || '').trim();
    if (!sizeVal) return alert('Panel Size is required');
    try {
      const url = editingPanelSizeId
        ? `${window.API_BASE}/api/panel-size-masters/${editingPanelSizeId}`
        : `${window.API_BASE}/api/panel-size-masters`;
      const method = editingPanelSizeId ? 'PUT' : 'POST';
      const payload = {
        panel_code: (panelSizeForm.panel_code || '').trim(),
        panel_size: sizeVal,
        size_name: sizeVal,
        ip_rating: (panelSizeForm.ip_rating || '').trim(),
        comments: (panelSizeForm.comments || '').trim(),
        description: (panelSizeForm.comments || '').trim()
      };
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowPanelSizeModal(false);
        setEditingPanelSizeId(null);
        setPanelSizeForm({ panel_code: '', panel_size: '', ip_rating: '', comments: '' });
        fetchPanelSizes();
      } else {
        const errData = await safeJsonError(res);
        alert(errData.error || 'Failed to save Panel Size Master');
      }
    } catch (err) { console.error(err); alert('Network error'); }
  };

  const handleDeletePanelSize = async (id) => {
    if (!window.confirm('Delete this Panel Size Master?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/panel-size-masters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchPanelSizes();
      else alert('Failed to delete Panel Size Master');
    } catch (err) { console.error(err); }
  };

  const fetchPartNumberMasters = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/part-number-masters", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPartMasters(await res.json());
      }
    } catch (err) { console.error(err); }
  };

  const handleSavePartMaster = async (e) => {
    e.preventDefault();
    if (!partFormData.part_number.trim()) return alert('Part Number is required');
    try {
      const url = editingPartId 
        ? `${window.API_BASE}/api/part-number-masters/${editingPartId}`
        : `${window.API_BASE}/api/part-number-masters`;
      const method = editingPartId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(partFormData)
      });
      if (res.ok) {
        const savedPart = await res.json();
        
        // If initial Drawing PDF was chosen during creation
        if (!editingPartId && newPartDrawingFile) {
          const drawBody = new FormData();
          drawBody.append('file', newPartDrawingFile);
          drawBody.append('doc_type', 'Drawing');
          await fetch(`${window.API_BASE}/api/part-number-masters/${savedPart.id}/documents`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: drawBody
          });
        }

        // If initial BOM PDF was chosen during creation
        if (!editingPartId && newPartBomFile) {
          const bomBody = new FormData();
          bomBody.append('file', newPartBomFile);
          bomBody.append('doc_type', 'BOM');
          await fetch(`${window.API_BASE}/api/part-number-masters/${savedPart.id}/documents`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: bomBody
          });
        }

        setShowPartModal(false);
        setEditingPartId(null);
        setPartFormData({ part_number: '', client_name: '', project: '', description: '', category: 'Standard' });
        setNewPartDrawingFile(null);
        setNewPartBomFile(null);
        fetchPartNumberMasters();
      } else {
        const errMsg = await safeJsonError(res, 'Failed to save Part Number Master');
        alert(errMsg);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeletePartMaster = async (id) => {
    if (!window.confirm('Are you sure you want to delete this Part Number Master? All associated drawings and BOMs will also be deleted.')) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/part-number-masters/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchPartNumberMasters();
      else {
        const errMsg = await safeJsonError(res, 'Failed to delete Part Number Master');
        alert(errMsg);
      }
    } catch (err) { console.error(err); }
  };

  const handleUploadDocumentSubmit = async (e) => {
    e.preventDefault();
    if (!activeUploadTarget || !docUploadFile) return;

    if (!docUploadFile.name.toLowerCase().endsWith('.pdf') && docUploadFile.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append('file', docUploadFile);
    formData.append('doc_type', activeUploadTarget.docType);

    try {
      const res = await fetch(`${window.API_BASE}/api/part-number-masters/${activeUploadTarget.part.id}/documents`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setShowDocUploadModal(false);
        setDocUploadFile(null);
        setActiveUploadTarget(null);
        await fetchPartNumberMasters();
      } else {
        const errMsg = await safeJsonError(res, 'Failed to upload document');
        alert(errMsg);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while uploading document.');
    } finally {
      setUploadingDoc(false);
    }
  };

  const fetchColumnMasters = async () => {
    try {
      const res = await fetch(window.API_BASE + "/api/column-masters", {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setColumns(data.columns || []);
        setVisibilityByDept(data.visibilityByDept || {});
      }
    } catch (err) { console.error(err); }
  };

  const handleToggleVisibility = (deptId, colKey) => {
    setVisibilityByDept(prev => {
      const deptCols = prev[deptId] || {};
      const currentVal = deptCols[colKey] !== false;
      return {
        ...prev,
        [deptId]: {
          ...deptCols,
          [colKey]: !currentVal
        }
      };
    });
  };

  const handleSelectAllForDept = (deptId, val) => {
    setVisibilityByDept(prev => {
      const newDept = {};
      columns.forEach(c => {
        newDept[c.col_key] = val;
      });
      return {
        ...prev,
        [deptId]: newDept
      };
    });
  };

  const safeJsonError = async (res, defaultMsg) => {
    try {
      const err = await res.json();
      return err.error || defaultMsg;
    } catch (e) {
      return `${defaultMsg} (${res.status} ${res.statusText})`;
    }
  };

  const handleCreateColumn = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(window.API_BASE + "/api/column-masters", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(colFormData)
      });
      if (res.ok) {
        setShowColModal(false);
        setColFormData({ label: '', col_key: '', category: 'Order', field_type: 'Text' });
        fetchColumnMasters();
        window.dispatchEvent(new CustomEvent('columnMastersUpdated'));
      } else {
        const errMsg = await safeJsonError(res, 'Failed to create column master');
        alert(errMsg);
      }
    } catch (err) { console.error(err); }
  };

  const handleDeleteColumn = async (colId) => {
    if (!window.confirm('Delete this custom column master?')) return;
    try {
      const res = await fetch(`${window.API_BASE}/api/column-masters/${colId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchColumnMasters();
        window.dispatchEvent(new CustomEvent('columnMastersUpdated'));
      }
      else {
        const errMsg = await safeJsonError(res, 'Failed to delete column master');
        alert(errMsg);
      }
    } catch (err) { console.error(err); }
  };

  const handleSaveVisibility = async () => {
    setSavingVisibility(true);
    try {
      const res = await fetch(window.API_BASE + "/api/column-masters/visibility", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ visibilityByDept })
      });
      if (res.ok) {
        setColSaveSuccess('Department column visibility matrix saved!');
        window.dispatchEvent(new CustomEvent('columnMastersUpdated'));
        setTimeout(() => setColSaveSuccess(''), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingVisibility(false);
    }
  };

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
        } else if (activeTab === 'panel_sizes' && canEditMasters) {
          setEditingPanelSizeId(null);
          setPanelSizeForm({ panel_code: '', panel_size: '', ip_rating: '', comments: '' });
          setShowPanelSizeModal(true);
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
        <button className={`vbtn ${activeTab === 'part_masters' ? 'active' : ''}`} onClick={() => setActiveTab('part_masters')}>Part Number Masters</button>
        <button className={`vbtn ${activeTab === 'panel_sizes' ? 'active' : ''}`} onClick={() => setActiveTab('panel_sizes')}>Panel Size Masters</button>
        <button className={`vbtn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Task Masters</button>
        <button className={`vbtn ${activeTab === 'columns' ? 'active' : ''}`} onClick={() => setActiveTab('columns')}>Column Masters & Visibility</button>
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

      {activeTab === 'columns' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text)' }}>Column Master & Department Visibility</h2>
              <div style={{ color: 'var(--text3)', fontSize: '13px', marginTop: '4px' }}>
                Control which columns are visible to each department across Table View and Planning Module, and manage custom data columns.
              </div>
            </div>
            {canEditMasters && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="vbtn" onClick={() => {
                  setColFormData({ label: '', col_key: '', category: 'Order', field_type: 'Text' });
                  setColKeyManuallyEdited(false);
                  setShowColModal(true);
                }}>+ Add Custom Column</button>
                <button
                  className="vbtn"
                  style={{ background: 'var(--accent)', color: '#fff' }}
                  onClick={handleSaveVisibility}
                  disabled={savingVisibility}
                >
                  {savingVisibility ? 'Saving Matrix...' : 'Save Visibility Matrix'}
                </button>
              </div>
            )}
          </div>

          {colSaveSuccess && (
            <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', padding: '10px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
              ✓ {colSaveSuccess}
            </div>
          )}

          {/* Department Visibility Matrix Table */}
          <div style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px', marginBottom: '32px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: '16px' }}>Department Column Visibility Matrix</h3>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', textAlign: 'left', minWidth: '220px', color: 'var(--text2)' }}>Column Name / Key</th>
                    <th style={{ padding: '12px', textAlign: 'left', width: '100px', color: 'var(--text3)' }}>Category</th>
                    {DEPTS.map(dept => (
                      <th key={dept.id} style={{ padding: '12px 8px', textAlign: 'center', minWidth: '80px', color: dept.color }}>
                        {dept.label}
                        {canEditMasters && (
                          <div style={{ fontSize: '10px', fontWeight: 'normal', marginTop: '4px', display: 'flex', gap: '4px', justifyContent: 'center' }}>
                            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleSelectAllForDept(dept.id, true)}>All</span>
                            <span>/</span>
                            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleSelectAllForDept(dept.id, false)}>None</span>
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {columns.map(col => (
                    <tr key={col.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ fontWeight: '600', color: 'var(--text)' }}>{col.label}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'var(--font-mono)' }}>{col.col_key}</div>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--text3)', fontSize: '12px' }}>{col.category}</td>
                      {DEPTS.map(dept => {
                        const isVisible = (visibilityByDept[dept.id] && visibilityByDept[dept.id][col.col_key] !== undefined)
                          ? visibilityByDept[dept.id][col.col_key]
                          : true;
                        return (
                          <td
                            key={dept.id}
                            onClick={() => canEditMasters && handleToggleVisibility(dept.id, col.col_key)}
                            style={{ padding: '10px 8px', textAlign: 'center', cursor: canEditMasters ? 'pointer' : 'default' }}
                          >
                            <input
                              type="checkbox"
                              checked={isVisible}
                              disabled={!canEditMasters}
                              readOnly
                              style={{ width: '16px', height: '16px', cursor: canEditMasters ? 'pointer' : 'default', pointerEvents: 'none' }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Column Master Registry List */}
          <div style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', padding: '20px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: 'var(--text)', fontSize: '16px' }}>Column Registry & Custom Fields</h3>
            
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text2)' }}>Label</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text2)' }}>Column Key</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text2)' }}>Category</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text2)' }}>Type</th>
                  <th style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text2)' }}>System / Custom</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--text2)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {columns.map(col => (
                  <tr key={col.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: '500', color: 'var(--text)' }}>{col.label}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text2)', fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{col.col_key}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text3)' }}>{col.category}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text3)' }}>{col.field_type}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontSize: '10px', padding: '2px 6px', borderRadius: '4px',
                        background: col.is_system ? 'rgba(59,130,246,0.12)' : 'rgba(16,185,129,0.12)',
                        color: col.is_system ? '#3b82f6' : '#10b981',
                        border: `1px solid ${col.is_system ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.3)'}`
                      }}>
                        {col.is_system ? 'SYSTEM' : 'CUSTOM'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      {!col.is_system && canEditMasters && (
                        <button
                          onClick={() => handleDeleteColumn(col.id)}
                          style={{ background: 'transparent', border: '1px solid #ef444444', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', padding: '3px 8px', fontSize: '11px' }}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'part_masters' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ margin: '0 0 4px 0', color: 'var(--text)' }}>Part Number Masters</h2>
              <div style={{ color: 'var(--text3)', fontSize: '13px' }}>
                Store standardized part numbers with technical drawings and specifications for standard sales orders.
              </div>
            </div>
            {canEditPartMaster && (
              <button className="vbtn" onClick={() => {
                setEditingPartId(null);
                setPartFormData({ part_number: '', client_name: '', project: '', description: '', category: 'Standard' });
                setNewPartDrawingFile(null);
                setNewPartBomFile(null);
                setShowPartModal(true);
              }}>+ Add Master Part Number</button>
            )}
          </div>

          <div style={{ marginBottom: '16px', display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Search by Part No., Client Name, Project, Revision..."
              value={partSearch}
              onChange={(e) => setPartSearch(e.target.value)}
              style={{
                background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px',
                color: 'var(--text)', fontSize: '13px', padding: '8px 14px', width: '360px'
              }}
            />
          </div>

          <div style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text2)', width: '180px' }}>Part No.</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text2)', width: '220px' }}>Client Name</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text2)', width: '200px' }}>Project</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text2)', width: '240px' }}>Drawing</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text2)', width: '240px' }}>BOM</th>
                </tr>
              </thead>
              <tbody>
                {partMasters.filter(p => {
                  if (!partSearch.trim()) return true;
                  const q = partSearch.toLowerCase();
                  const matchPart = (p.part_number || '').toLowerCase().includes(q);
                  const matchClient = (p.client_name || '').toLowerCase().includes(q);
                  const matchProject = (p.project || '').toLowerCase().includes(q);
                  const matchDrawingRev = (p.drawing?.revision_label || '').toLowerCase().includes(q);
                  const matchBomRev = (p.bom?.revision_label || '').toLowerCase().includes(q);
                  return matchPart || matchClient || matchProject || matchDrawingRev || matchBomRev;
                }).map(part => (
                  <tr key={part.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>{part.part_number}</span>
                        {canEditPartMaster && (
                          <button
                            onClick={() => {
                              setEditingPartId(part.id);
                              setPartFormData({
                                part_number: part.part_number,
                                client_name: part.client_name || '',
                                project: part.project || '',
                                description: part.description || '',
                                category: part.category || 'Standard'
                              });
                              setShowPartModal(true);
                            }}
                            title="Edit Part Master"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: 'var(--text3)',
                              fontSize: '12px',
                              padding: '2px 4px',
                              borderRadius: '4px'
                            }}
                          >
                            ✏️
                          </button>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text)', fontWeight: '500' }}>
                      {part.client_name ? (
                        part.client_name
                      ) : (
                        <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text2)' }}>
                      {part.project ? (
                        part.project
                      ) : (
                        <span style={{ color: 'var(--text3)', fontStyle: 'italic' }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {part.drawing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: 'var(--text)',
                              fontFamily: 'var(--font-mono)'
                            }}>
                              {part.drawing.revision_label || ('R' + (part.drawing.revision_number ?? 0))} · {formatDateDMY(part.drawing.uploaded_at)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => {
                                setPdfViewerDoc({
                                  ...part.drawing,
                                  title: `Drawing (${part.drawing.revision_label || 'R0'}) - ${part.part_number}`
                                });
                              }}
                              style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                color: 'var(--blue)',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                padding: '3px 8px',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}
                            >
                              View PDF
                            </button>
                            {canEditPartMaster && (
                              <button
                                onClick={() => {
                                  setActiveUploadTarget({ part, docType: 'Drawing', currentDoc: part.drawing });
                                  setDocUploadFile(null);
                                  setShowDocUploadModal(true);
                                }}
                                style={{
                                  background: 'var(--bg3)',
                                  border: '1px solid var(--border)',
                                  color: 'var(--text2)',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  padding: '3px 8px',
                                  fontSize: '11px'
                                }}
                              >
                                Update
                              </button>
                            )}
                            {canViewRevisionHistory && (part.drawing_history?.length > 1 || part.drawing) && (
                              <button
                                onClick={() => {
                                  setActiveHistoryTarget({ part, docType: 'Drawing' });
                                  setActiveHistoryList(part.drawing_history || (part.drawing ? [part.drawing] : []));
                                  setShowDocHistoryModal(true);
                                }}
                                title="View Revision History"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--text3)',
                                  cursor: 'pointer',
                                  padding: '2px 4px',
                                  fontSize: '11px',
                                  textDecoration: 'underline'
                                }}
                              >
                                History ({part.drawing_history?.length || 1})
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text3)', fontStyle: 'italic' }}>
                            No Drawing
                          </span>
                          {canEditPartMaster && (
                            <button
                              onClick={() => {
                                setActiveUploadTarget({ part, docType: 'Drawing', currentDoc: null });
                                setDocUploadFile(null);
                                setShowDocUploadModal(true);
                              }}
                              style={{
                                background: 'var(--bg3)',
                                border: '1px solid var(--border)',
                                color: 'var(--blue)',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                padding: '3px 8px',
                                fontSize: '11px',
                                fontWeight: '500',
                                alignSelf: 'flex-start'
                              }}
                            >
                              Upload PDF
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {part.bom ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontSize: '12px',
                              fontWeight: '700',
                              color: 'var(--text)',
                              fontFamily: 'var(--font-mono)'
                            }}>
                              {part.bom.revision_label || ('R' + (part.bom.revision_number ?? 0))} · {formatDateDMY(part.bom.uploaded_at)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              onClick={() => {
                                setPdfViewerDoc({
                                  ...part.bom,
                                  title: `BOM (${part.bom.revision_label || 'R0'}) - ${part.part_number}`
                                });
                              }}
                              style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                color: 'var(--blue)',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                padding: '3px 8px',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}
                            >
                              View PDF
                            </button>
                            {canEditPartMaster && (
                              <button
                                onClick={() => {
                                  setActiveUploadTarget({ part, docType: 'BOM', currentDoc: part.bom });
                                  setDocUploadFile(null);
                                  setShowDocUploadModal(true);
                                }}
                                style={{
                                  background: 'var(--bg3)',
                                  border: '1px solid var(--border)',
                                  color: 'var(--text2)',
                                  borderRadius: '5px',
                                  cursor: 'pointer',
                                  padding: '3px 8px',
                                  fontSize: '11px'
                                }}
                              >
                                Update
                              </button>
                            )}
                            {canViewRevisionHistory && (part.bom_history?.length > 1 || part.bom) && (
                              <button
                                onClick={() => {
                                  setActiveHistoryTarget({ part, docType: 'BOM' });
                                  setActiveHistoryList(part.bom_history || (part.bom ? [part.bom] : []));
                                  setShowDocHistoryModal(true);
                                }}
                                title="View Revision History"
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'var(--text3)',
                                  cursor: 'pointer',
                                  padding: '2px 4px',
                                  fontSize: '11px',
                                  textDecoration: 'underline'
                                }}
                              >
                                History ({part.bom_history?.length || 1})
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--text3)', fontStyle: 'italic' }}>
                            No BOM
                          </span>
                          {canEditPartMaster && (
                            <button
                              onClick={() => {
                                setActiveUploadTarget({ part, docType: 'BOM', currentDoc: null });
                                setDocUploadFile(null);
                                setShowDocUploadModal(true);
                              }}
                              style={{
                                background: 'var(--bg3)',
                                border: '1px solid var(--border)',
                                color: 'var(--blue)',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                padding: '3px 8px',
                                fontSize: '11px',
                                fontWeight: '500',
                                alignSelf: 'flex-start'
                              }}
                            >
                              Upload PDF
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {partMasters.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
                      No Master Part Numbers registered yet. Click "+ Add Master Part Number" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'panel_sizes' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ margin: 0, color: 'var(--text)' }}>Panel Size Masters</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text3)' }}>
                Pre-defined standard panel dimensions for Design and Sales order entry.
              </p>
            </div>
            {canEditMasters && (
              <button
                className="vbtn"
                onClick={() => {
                  setEditingPanelSizeId(null);
                  setPanelSizeForm({ panel_code: '', panel_size: '', ip_rating: '', comments: '' });
                  setShowPanelSizeModal(true);
                }}
              >
                + Add Panel Size (Alt+N)
              </button>
            )}
          </div>

          <div style={{ marginBottom: '16px', maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search by panel code, size, IP rating, or comments..."
              className="form-input"
              value={panelSizeSearch}
              onChange={e => setPanelSizeSearch(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', background: 'var(--bg2)' }}
            />
          </div>

          <div style={{ background: 'var(--bg2)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ background: 'var(--bg3)', borderBottom: '1px solid var(--border)', color: 'var(--text3)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', width: '50px' }}>#</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '130px' }}>Panel Code</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '160px' }}>Panel Size</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '110px' }}>IP Rating</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', minWidth: '220px' }}>Comments</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right', width: '130px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {panelSizes
                  .filter(p => {
                    if (!panelSizeSearch) return true;
                    const q = panelSizeSearch.toLowerCase();
                    return (
                      (p.panel_code || '').toLowerCase().includes(q) ||
                      (p.panel_size || p.size_name || '').toLowerCase().includes(q) ||
                      (p.ip_rating || '').toLowerCase().includes(q) ||
                      (p.comments || p.description || '').toLowerCase().includes(q)
                    );
                  })
                  .map((ps, idx) => (
                    <tr key={ps.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '12px 16px', color: 'var(--text3)', width: '50px' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {ps.panel_code ? (
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#c084fc',
                            background: 'rgba(168, 85, 247, 0.12)',
                            border: '1px solid rgba(168, 85, 247, 0.28)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            letterSpacing: '0.3px',
                            display: 'inline-block'
                          }}>
                            {ps.panel_code}
                          </span>
                        ) : (
                          <span style={{ opacity: 0.4 }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 'bold', color: '#60a5fa', fontFamily: 'var(--font-mono)' }}>
                        {ps.panel_size || ps.size_name || <span style={{ opacity: 0.4 }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {ps.ip_rating ? (
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#10b981',
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.28)',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            display: 'inline-block'
                          }}>
                            {ps.ip_rating}
                          </span>
                        ) : (
                          <span style={{ opacity: 0.4 }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text2)' }}>
                        {ps.comments || ps.description || <span style={{ opacity: 0.4 }}>—</span>}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {canEditMasters && (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => {
                                setEditingPanelSizeId(ps.id);
                                setPanelSizeForm({
                                  panel_code: ps.panel_code || '',
                                  panel_size: ps.panel_size || ps.size_name || '',
                                  ip_rating: ps.ip_rating || '',
                                  comments: ps.comments || ps.description || ''
                                });
                                setShowPanelSizeModal(true);
                              }}
                              style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text2)', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '11px' }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeletePanelSize(ps.id)}
                              style={{ background: 'transparent', border: '1px solid #ef444444', color: '#ef4444', borderRadius: '4px', cursor: 'pointer', padding: '4px 8px', fontSize: '11px' }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                {panelSizes.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text3)' }}>
                      No Master Panel Sizes registered yet. Click "+ Add Panel Size" to create one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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

      {/* Add Custom Column Modal */}
      {showColModal && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setShowColModal(false); }}>
          <div className="modal" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <div className="modal-title">Add Custom Column Master</div>
              <button className="modal-close" onClick={() => setShowColModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateColumn}>
                <div className="modal-field">
                  <label>Column Display Label</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. Special Tag, Inspector Name"
                    value={colFormData.label}
                    onChange={(e) => {
                      const labelVal = e.target.value;
                      const autoKey = labelVal.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '');
                      setColFormData(p => ({
                        ...p,
                        label: labelVal,
                        col_key: colKeyManuallyEdited ? p.col_key : autoKey
                      }));
                    }}
                  />
                </div>
                <div className="modal-field">
                  <label>Column Key (unique database key)</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. special_tag"
                    value={colFormData.col_key}
                    onChange={(e) => {
                      setColKeyManuallyEdited(true);
                      setColFormData({ ...colFormData, col_key: e.target.value });
                    }}
                  />
                  {columns.some(c => c.col_key === colFormData.col_key.trim().toLowerCase()) && (
                    <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '4px' }}>
                      ⚠️ Column Key "{colFormData.col_key.trim().toLowerCase()}" already exists. Please enter a different key.
                    </div>
                  )}
                </div>
                <div className="modal-field">
                  <label>Category</label>
                  <select
                    className="form-select"
                    value={colFormData.category}
                    onChange={(e) => setColFormData({ ...colFormData, category: e.target.value })}
                  >
                    <option value="Order">Order</option>
                    <option value="LineItem">Line Item</option>
                    <option value="Unit">Unit</option>
                    <option value="Planning">Planning</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div className="modal-field">
                  <label>Field Type</label>
                  <select
                    className="form-select"
                    value={colFormData.field_type}
                    onChange={(e) => setColFormData({ ...colFormData, field_type: e.target.value })}
                  >
                    <option value="Text">Text</option>
                    <option value="Number">Number</option>
                    <option value="Date">Date</option>
                    <option value="Date & Time">Date & Time</option>
                    <option value="Dropdown">Dropdown</option>
                    <option value="Yes/No">Yes/No</option>
                  </select>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                  <button type="button" className="vbtn" style={{ background: '#333' }} onClick={() => setShowColModal(false)}>Cancel</button>
                  <button
                    type="submit"
                    className="vbtn"
                    disabled={columns.some(c => c.col_key === colFormData.col_key.trim().toLowerCase()) || !colFormData.col_key.trim()}
                    style={{
                      opacity: (columns.some(c => c.col_key === colFormData.col_key.trim().toLowerCase()) || !colFormData.col_key.trim()) ? 0.5 : 1,
                      cursor: (columns.some(c => c.col_key === colFormData.col_key.trim().toLowerCase()) || !colFormData.col_key.trim()) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Create Column
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Part Number Master Add / Edit Modal */}
      {showPartModal && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setShowPartModal(false); }}>
          <div className="modal" style={{ width: '520px', maxWidth: '95vw' }}>
            <div className="modal-header">
              <div className="modal-title">{editingPartId ? 'Edit Master Part Number' : 'Add Master Part Number'}</div>
              <button className="modal-close" onClick={() => setShowPartModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSavePartMaster}>
                <div className="modal-field" style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}>Part No. *</label>
                  <input
                    type="text"
                    className="form-input"
                    required
                    placeholder="e.g. PN-1001, PLC-1200, VFD-15KW"
                    value={partFormData.part_number}
                    onChange={(e) => setPartFormData({ ...partFormData, part_number: e.target.value })}
                  />
                </div>

                <div className="modal-field" style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}>Client Name</label>
                  <input
                    type="text"
                    list="company-list-suggestions"
                    className="form-input"
                    placeholder="e.g. ABC Industries, XYZ Manufacturing, Tata Projects"
                    value={partFormData.client_name || ''}
                    onChange={(e) => setPartFormData({ ...partFormData, client_name: e.target.value })}
                  />
                  <datalist id="company-list-suggestions">
                    {companies.map(c => (
                      <option key={c.id} value={c.name} />
                    ))}
                  </datalist>
                </div>

                <div className="modal-field" style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}>Project</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Project Alpha, Plant Expansion, Control Panel Upgrade"
                    value={partFormData.project || ''}
                    onChange={(e) => setPartFormData({ ...partFormData, project: e.target.value })}
                  />
                </div>

                {!editingPartId && (
                  <>
                    <div className="modal-field" style={{ marginBottom: '14px', padding: '12px', background: 'var(--bg3)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}>Drawing PDF (Optional - will be R0)</label>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
                              alert('Only PDF files are allowed.');
                              e.target.value = '';
                              setNewPartDrawingFile(null);
                              return;
                            }
                            setNewPartDrawingFile(file);
                          } else {
                            setNewPartDrawingFile(null);
                          }
                        }}
                        style={{ width: '100%', fontSize: '12px', color: 'var(--text)' }}
                      />
                    </div>

                    <div className="modal-field" style={{ marginBottom: '14px', padding: '12px', background: 'var(--bg3)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                      <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}>BOM PDF (Optional - will be R0)</label>
                      <input
                        type="file"
                        accept=".pdf,application/pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
                              alert('Only PDF files are allowed.');
                              e.target.value = '';
                              setNewPartBomFile(null);
                              return;
                            }
                            setNewPartBomFile(file);
                          } else {
                            setNewPartBomFile(null);
                          }
                        }}
                        style={{ width: '100%', fontSize: '12px', color: 'var(--text)' }}
                      />
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
                  {editingPartId ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeletePartMaster(editingPartId);
                        setShowPartModal(false);
                      }}
                      style={{ background: 'transparent', border: '1px solid #ef444444', color: '#ef4444', borderRadius: '6px', cursor: 'pointer', padding: '6px 12px', fontSize: '12px' }}
                    >
                      Delete Part
                    </button>
                  ) : <div />}

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" className="vbtn" style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }} onClick={() => setShowPartModal(false)}>Cancel</button>
                    <button type="submit" className="vbtn">{editingPartId ? 'Update Part' : 'Save Part Number'}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Upload / Update Document Modal */}
      {showDocUploadModal && activeUploadTarget && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setShowDocUploadModal(false); }}>
          <div className="modal" style={{ width: '480px', maxWidth: '95vw' }}>
            <div className="modal-header">
              <div className="modal-title">
                {activeUploadTarget.currentDoc ? `Update ${activeUploadTarget.docType}` : `Upload ${activeUploadTarget.docType}`}
              </div>
              <button className="modal-close" onClick={() => setShowDocUploadModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '16px', background: 'var(--bg3)', padding: '12px 14px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Part No:</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--blue)', fontFamily: 'var(--font-mono)' }}>{activeUploadTarget.part.part_number}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Document Type:</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text)' }}>{activeUploadTarget.docType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>Current Revision:</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text2)' }}>
                    {activeUploadTarget.currentDoc
                      ? `${activeUploadTarget.currentDoc.revision_label || ('R' + activeUploadTarget.currentDoc.revision_number)} : ${formatDateDMY(activeUploadTarget.currentDoc.uploaded_at)}`
                      : 'None (Initial upload)'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text3)' }}>New Revision:</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#10b981' }}>
                    {activeUploadTarget.currentDoc
                      ? `R${(activeUploadTarget.currentDoc.revision_number ?? 0) + 1}`
                      : 'R0'}
                  </span>
                </div>
              </div>

              {activeUploadTarget.currentDoc && (
                <div style={{ marginBottom: '16px', padding: '10px 12px', borderRadius: '6px', background: 'rgba(234, 179, 8, 0.1)', border: '1px solid rgba(234, 179, 8, 0.3)', color: 'var(--text2)', fontSize: '12px' }}>
                  ⚠️ Uploading a new PDF will create revision <strong>R{(activeUploadTarget.currentDoc.revision_number ?? 0) + 1}</strong>. The current revision will be preserved in Revision History.
                </div>
              )}

              <form onSubmit={handleUploadDocumentSubmit}>
                <div className="modal-field" style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '600' }}>Choose PDF File *</label>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
                          alert('Only PDF files are allowed.');
                          e.target.value = '';
                          setDocUploadFile(null);
                          return;
                        }
                        if (file.size > 20 * 1024 * 1024) {
                          alert('File size exceeds 20MB limit.');
                          e.target.value = '';
                          setDocUploadFile(null);
                          return;
                        }
                        setDocUploadFile(file);
                      } else {
                        setDocUploadFile(null);
                      }
                    }}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--bg3)',
                      color: 'var(--text)',
                      fontSize: '13px'
                    }}
                  />
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px' }}>
                    Only PDF files are allowed (Max 20MB)
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    className="vbtn"
                    style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
                    onClick={() => setShowDocUploadModal(false)}
                    disabled={uploadingDoc}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="vbtn"
                    disabled={!docUploadFile || uploadingDoc}
                    style={{ minWidth: '100px' }}
                  >
                    {uploadingDoc ? 'Uploading...' : (activeUploadTarget.currentDoc ? 'Upload' : 'Upload')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Revision History Modal */}
      {canViewRevisionHistory && showDocHistoryModal && activeHistoryTarget && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setShowDocHistoryModal(false); }}>
          <div className="modal" style={{ width: '680px', maxWidth: '95vw', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <div>
                <div className="modal-title">
                  {activeHistoryTarget.docType} Revision History
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
                  Part No: <span style={{ color: 'var(--blue)', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{activeHistoryTarget.part.part_number}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowDocHistoryModal(false)}>✕</button>
            </div>
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '10px 4px' }}>
              {activeHistoryList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text3)', fontSize: '13px', fontStyle: 'italic' }}>
                  No revisions found for this {activeHistoryTarget.docType}.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeHistoryList.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        background: 'var(--bg3)',
                        border: doc.is_current ? '1.5px solid var(--blue)' : '1px solid var(--border)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        minWidth: 0
                      }}
                    >
                      <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', minWidth: 0 }}>
                          <span style={{
                            fontWeight: '700',
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            flexShrink: 0,
                            background: doc.is_current ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg2)',
                            color: doc.is_current ? 'var(--blue)' : 'var(--text2)',
                            border: doc.is_current ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid var(--border)'
                          }}>
                            {doc.revision_label || ('R' + (doc.revision_number ?? 0))}
                            {doc.is_current ? ' (Current)' : ''}
                          </span>
                          <span
                            title={doc.file_name}
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: 'var(--text)',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              minWidth: 0,
                              flex: 1
                            }}
                          >
                            {doc.file_name}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span>📅 {formatDateDMY(doc.uploaded_at)}</span>
                          {doc.uploaded_by_name && <span>👤 {doc.uploaded_by_name}</span>}
                          {doc.file_size ? <span>💾 {(doc.file_size / 1024).toFixed(1)} KB</span> : null}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                        <button
                          type="button"
                          onClick={() => {
                            setPdfViewerDoc({
                              ...doc,
                              title: `${activeHistoryTarget.docType} (${doc.revision_label || 'R' + doc.revision_number}) - ${activeHistoryTarget.part.part_number}`
                            });
                          }}
                          style={{
                            background: 'rgba(59, 130, 246, 0.1)',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            color: 'var(--blue)',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '600'
                          }}
                        >
                          View PDF
                        </button>
                        <a
                          href={getDocUrl(doc)}
                          download={doc.file_name}
                          style={{
                            background: 'var(--bg2)',
                            border: '1px solid var(--border)',
                            color: 'var(--text2)',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            textDecoration: 'none',
                            fontWeight: '500'
                          }}
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="vbtn" onClick={() => setShowDocHistoryModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* In-App PDF Viewer Modal */}
      {pdfViewerDoc && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setPdfViewerDoc(null); }}>
          <div className="modal" style={{ maxWidth: '960px', width: '92vw', height: '88vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="modal-title" style={{ fontSize: '15px', fontWeight: '600' }}>
                  {pdfViewerDoc.title || 'PDF Document Viewer'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>
                  {pdfViewerDoc.file_name} · {pdfViewerDoc.revision_label || 'R0'} · {formatDateDMY(pdfViewerDoc.uploaded_at)}
                  {pdfViewerDoc.uploaded_by_name ? ` · by ${pdfViewerDoc.uploaded_by_name}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a
                  href={getDocUrl(pdfViewerDoc)}
                  target="_blank"
                  rel="noreferrer"
                  className="vbtn"
                  style={{ fontSize: '12px', padding: '5px 12px', textDecoration: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  Open in Tab ↗
                </a>
                <a
                  href={getDocUrl(pdfViewerDoc)}
                  download={pdfViewerDoc.file_name || 'document.pdf'}
                  className="vbtn"
                  style={{ fontSize: '12px', padding: '5px 12px', textDecoration: 'none', background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--text)' }}
                >
                  Download ↓
                </a>
                <button className="modal-close" onClick={() => setPdfViewerDoc(null)} style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>✕</button>
              </div>
            </div>
            <div className="modal-body" style={{ flex: 1, padding: 0, overflow: 'hidden', background: '#525659' }}>
              <iframe
                src={getDocUrl(pdfViewerDoc)}
                title={pdfViewerDoc.file_name}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Panel Size Master Modal */}
      {showPanelSizeModal && (
        <div className="modal-overlay open" onClick={(e) => { if(e.target.className === 'modal-overlay open') setShowPanelSizeModal(false); }}>
          <div className="modal" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div className="modal-title">{editingPanelSizeId ? 'Edit Panel Size Master' : 'New Panel Size Master'}</div>
              <button className="modal-close" onClick={() => setShowPanelSizeModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSavePanelSize}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Panel Code</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. PC-01"
                      value={panelSizeForm.panel_code}
                      onChange={e => setPanelSizeForm({ ...panelSizeForm, panel_code: e.target.value })}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>IP Rating</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. IP55, IP65"
                      value={panelSizeForm.ip_rating}
                      onChange={e => setPanelSizeForm({ ...panelSizeForm, ip_rating: e.target.value })}
                    />
                  </div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Panel Size / Dimensions *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 1200x800x400 mm"
                    value={panelSizeForm.panel_size}
                    onChange={e => setPanelSizeForm({ ...panelSizeForm, panel_size: e.target.value })}
                    required
                  />
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text3)', marginBottom: '4px' }}>Comments / Notes</label>
                  <textarea
                    className="form-input"
                    placeholder="e.g. Standard Wall Mount Single Door Enclosure"
                    value={panelSizeForm.comments}
                    onChange={e => setPanelSizeForm({ ...panelSizeForm, comments: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="vbtn" onClick={() => setShowPanelSizeModal(false)}>Cancel</button>
                <button type="submit" className="vbtn" style={{ background: '#3b82f6' }}>
                  {editingPanelSizeId ? 'Save Changes' : 'Create Panel Size'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

