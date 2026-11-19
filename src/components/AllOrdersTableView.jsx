import { useState, useEffect, useRef, useMemo, useCallback, useDeferredValue } from 'react';
import TechnicalDocsModal from './TechnicalDocsModal';
import DocumentPreviewModal from './DocumentPreviewModal';
import EditRefTagModal from './EditRefTagModal.jsx';
import PurchaseNewOrderModal from './PurchaseNewOrderModal.jsx';
import PurchaseOrderReceivedModal from './PurchaseOrderReceivedModal.jsx';
import {
  Search, X, ArrowUpDown, ChevronUp, ChevronDown, Pin, GripVertical, RotateCcw,
  Trash2, Plus, PackageCheck, Columns3
} from 'lucide-react';
import OrderDocumentsModal from './OrderDocumentsModal';
import ProductionBatchBar from './ProductionBatchBar';
import QcBatchBar from './QcBatchBar';
import { ToastContainer, useToast } from './Toast';
import { ConfirmModal } from './ConfirmModal';
import { DEFAULT_COL_WIDTHS, MIN_COL_WIDTHS, calculateOptimalColumnWidth } from './tableColumnSizing';
import TableHorizontalScrollbar from './TableHorizontalScrollbar';
import TableVerticalScrollbar from './TableVerticalScrollbar';
import { MODAL_OVERLAY_SELECTOR } from '../hooks/useGlobalModalEscape';
import { useStableCallback } from '../hooks/useStableCallback';
import { useSignedUploadUrl } from '../utils/protectedUploads';
import { hasRole, TABLE_EDIT_ROLES } from '../data/roles';
import { apiFetch } from '../api/client';
import { getOwningDept, PRODUCTION_AND_QC_COLS, BASE_COLUMNS, DEFAULT_COLUMN_KEYS } from './allOrdersTable/columns';
import { PRIORITY_ORDER } from './allOrdersTable/statusStyles';
import { isDateTimeType, isDateType } from './allOrdersTable/dates';
import { getDocUrl } from './allOrdersTable/uploads';
import { isStatusInProgress, calculateUnitStatus } from './allOrdersTable/status';
import TableRow from './allOrdersTable/TableRow.jsx';
import PoUploadBar from './allOrdersTable/PoUploadBar.jsx';
import StoresBatchTrayStatusBar from './allOrdersTable/StoresBatchTrayStatusBar.jsx';

// DEFAULT_COL_WIDTHS and MIN_COL_WIDTHS imported from ./tableColumnSizing

// TechnicalDocsModal has been modularized and extracted to src/components/TechnicalDocsModal.jsx

export default function AllOrdersTableView({ currentFilter, userRole: propUserRole, onSetView, statCardFilter, onClearStatFilter }) {
  const [units, setUnits] = useState([]);
  const tableContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const { toasts, addToast, dismissToast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'warning',
    confirmText: 'Confirm',
    onConfirm: null
  });

  // Prevent browser from navigating away if a user drops a file outside the dropzone
  useEffect(() => {
    const handleDragOverWindow = (e) => {
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault();
      }
    };
    const handleDropWindow = (e) => {
      if (e.dataTransfer && e.dataTransfer.types && Array.from(e.dataTransfer.types).includes('Files')) {
        e.preventDefault();
      }
    };
    window.addEventListener('dragover', handleDragOverWindow);
    window.addEventListener('drop', handleDropWindow);
    return () => {
      window.removeEventListener('dragover', handleDragOverWindow);
      window.removeEventListener('drop', handleDropWindow);
    };
  }, []);

  // Canvas Mouse Drag Scroll
  useEffect(() => {
    const slider = tableContainerRef.current;
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      if (e.button !== 0) return; // Only primary left-click for canvas drag
      if (
        ['INPUT', 'SELECT', 'OPTION', 'BUTTON', 'A', 'TH'].includes(e.target.tagName) ||
        e.target.closest('th') ||
        e.target.closest('button') ||
        e.target.closest('.no-canvas-drag')
      ) {
        return;
      }
      isDown = true;
      slider.classList.add('active-drag');
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      slider.classList.remove('active-drag');
    };

    const handleMouseUp = () => {
      isDown = false;
      slider.classList.remove('active-drag');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    slider.addEventListener('mousedown', handleMouseDown);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('mouseup', handleMouseUp);
    slider.addEventListener('mousemove', handleMouseMove);

    return () => {
      slider.removeEventListener('mousedown', handleMouseDown);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('mouseup', handleMouseUp);
      slider.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Mouse Wheel on Table Header scrolls horizontally
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // If cursor is hovering over table header (thead / th), convert wheel to horizontal scroll
      const isHeader = e.target.closest('thead') || e.target.closest('.erp-th');
      if (isHeader && e.deltaY && !e.shiftKey) {
        e.preventDefault();
        container.scrollLeft += e.deltaY * 1.3;
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('erp_all_activeTab') || 'all');
  const [priorityFilter, setPriorityFilter] = useState(() => localStorage.getItem('erp_all_priorityFilter') || 'all');
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem('erp_all_statusFilter') || 'incomplete');
  const [sortKey, setSortKey] = useState(() => localStorage.getItem('erp_all_sortKey') || 'order_number');
  const [sortDir, setSortDir] = useState(() => localStorage.getItem('erp_all_sortDir') || 'asc');

  useEffect(() => {
    localStorage.setItem('erp_all_activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('erp_all_priorityFilter', priorityFilter);
  }, [priorityFilter]);

  useEffect(() => {
    localStorage.setItem('erp_all_statusFilter', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem('erp_all_sortKey', sortKey);
  }, [sortKey]);

  useEffect(() => {
    localStorage.setItem('erp_all_sortDir', sortDir);
  }, [sortDir]);

  // Excel-style multi-row selection state (persisted across browser refresh)
  // Active / focused row highlight (clicked row inspection without batch selection)
  const [activeRowId, setActiveRowId] = useState(null);

  const [selectedUnitIds, setSelectedUnitIds] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_selectedUnitIds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return new Set(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to load erp_all_selectedUnitIds', e);
    }
    return new Set();
  });

  useEffect(() => {
    try {
      if (selectedUnitIds.size > 0) {
        localStorage.setItem('erp_all_selectedUnitIds', JSON.stringify(Array.from(selectedUnitIds)));
      } else {
        localStorage.removeItem('erp_all_selectedUnitIds');
      }
    } catch (e) {
      console.warn('Failed to save erp_all_selectedUnitIds', e);
    }
  }, [selectedUnitIds]);

  const isIdSelected = useCallback((id) => {
    if (id === undefined || id === null) return false;
    return selectedUnitIds.has(id) || selectedUnitIds.has(String(id)) || (typeof id === 'string' && !isNaN(id) && selectedUnitIds.has(Number(id)));
  }, [selectedUnitIds]);

  const lastSelectedIndexRef = useRef(null);
  const isDraggingSelectRef = useRef(false);
  const dragStartIdxRef = useRef(null);
  const dragSelectTargetStateRef = useRef(true);
  const lastEscPressRef = useRef(0);

  // PO upload state
  const [externalPoNumber, setExternalPoNumber] = useState('');
  const [isUploadingPo, setIsUploadingPo] = useState(false);
  const [poSuccessMsg, setPoSuccessMsg] = useState('');

  // Pagination state
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem('erp_all_pageSize');
    if (saved === 'all') return 'all';
    const num = Number(saved);
    return num && num > 0 ? num : 100;
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    localStorage.setItem('erp_all_pageSize', String(pageSize));
  }, [pageSize]);

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab, priorityFilter, statusFilter, statCardFilter]);

  // In-app PDF viewer modal for PO document
  const [poPdfViewer, setPoPdfViewer] = useState(null);

  // Reset drag-select on mouseup anywhere
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      isDraggingSelectRef.current = false;
      dragStartIdxRef.current = null;
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Column Definitions (Merged BASE_COLUMNS + Custom columns from column-masters)
  const [allColumns, setAllColumns] = useState(BASE_COLUMNS);
  const [customColumnDefs, setCustomColumnDefs] = useState([]);

  // Column Keys Order (Drag & Drop Reordering)
  const [columnKeys, setColumnKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_column_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        const valid = parsed.filter(k => DEFAULT_COLUMN_KEYS.includes(k));
        const missing = DEFAULT_COLUMN_KEYS.filter(k => !valid.includes(k));
        if (missing.length > 0) {
          const result = [...valid];
          const ptsIdx = result.indexOf('panel_type_size');
          if (ptsIdx !== -1) {
            const panelMissing = missing.filter(k => ['panel_code', 'panel_ip_rating', 'panel_comments'].includes(k));
            const otherMissing = missing.filter(k => !panelMissing.includes(k));
            if (panelMissing.includes('panel_code')) {
              result.splice(ptsIdx, 0, 'panel_code');
            }
            const newPtsIdx = result.indexOf('panel_type_size');
            if (panelMissing.includes('panel_ip_rating')) {
              result.splice(newPtsIdx + 1, 0, 'panel_ip_rating');
            }
            const ipIdx = result.indexOf('panel_ip_rating');
            if (panelMissing.includes('panel_comments')) {
              result.splice((ipIdx !== -1 ? ipIdx : newPtsIdx) + 1, 0, 'panel_comments');
            }
            return [...result, ...otherMissing];
          }
          return [...valid, ...missing];
        }
        return valid;
      }
    } catch (e) { }
    return DEFAULT_COLUMN_KEYS;
  });

  // Whenever allColumns changes, sync any newly added custom columns into columnKeys
  useEffect(() => {
    const availableKeys = allColumns.map(c => c.key);
    setColumnKeys(prev => {
      const valid = prev.filter(k => availableKeys.includes(k));
      const missing = availableKeys.filter(k => !valid.includes(k));
      if (missing.length === 0 && valid.length === prev.length) return prev;
      return [...valid, ...missing];
    });
  }, [allColumns]);

  useEffect(() => {
    localStorage.setItem('erp_all_column_order', JSON.stringify(columnKeys));
  }, [columnKeys]);

  // Pinned / Frozen Columns (Frozen on left)
  const [pinnedKeys, setPinnedKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_all_pinned_keys');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return ['order_number', 'short_serial'];
  });

  useEffect(() => {
    localStorage.setItem('erp_all_pinned_keys', JSON.stringify(pinnedKeys));
  }, [pinnedKeys]);

  // Column Widths (Resizing)
  const [columnWidths, setColumnWidths] = useState(() => {
    try {
      const savedV16 = localStorage.getItem('erp_all_colWidths_v16');
      if (savedV16) {
        const parsed = JSON.parse(savedV16);
        const merged = { ...DEFAULT_COL_WIDTHS };
        for (const k of Object.keys(DEFAULT_COL_WIDTHS)) {
          if (parsed[k] !== undefined) {
            const minSafe = MIN_COL_WIDTHS[k] || 85;
            merged[k] = Math.max(Number(parsed[k]) || minSafe, minSafe);
          }
        }
        for (const [k, v] of Object.entries(parsed)) {
          if (merged[k] === undefined && typeof v === 'number') {
            merged[k] = Math.max(v, MIN_COL_WIDTHS[k] || 85);
          }
        }
        return merged;
      }
      // Migrate from v15 if available, but clamp strictly to new safe MIN_COL_WIDTHS
      const savedV15 = localStorage.getItem('erp_all_colWidths_v15');
      if (savedV15) {
        const parsed = JSON.parse(savedV15);
        const merged = { ...DEFAULT_COL_WIDTHS };
        for (const k of Object.keys(DEFAULT_COL_WIDTHS)) {
          const minSafe = MIN_COL_WIDTHS[k] || 85;
          if (parsed[k] !== undefined) {
            merged[k] = Math.max(Number(parsed[k]) || (DEFAULT_COL_WIDTHS[k] || minSafe), minSafe);
          }
        }
        return merged;
      }
      return { ...DEFAULT_COL_WIDTHS };
    } catch (e) {
      return { ...DEFAULT_COL_WIDTHS };
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem('erp_all_colWidths_v16', JSON.stringify(columnWidths));
      } catch (err) {
        console.error('Failed to save colWidths', err);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [columnWidths]);

  // Header Drag & Drop state
  const [draggedColKey, setDraggedColKey] = useState(null);
  const [dragOverColKey, setDragOverColKey] = useState(null);

  const handleHeaderDragStart = (e, colKey) => {
    setDraggedColKey(colKey);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', colKey);
  };

  const handleHeaderDragOver = (e, colKey) => {
    e.preventDefault();
    if (draggedColKey === colKey) return;
    if (dragOverColKey !== colKey) {
      setDragOverColKey(colKey);
    }
  };

  const handleHeaderDragLeave = (e, colKey) => {
    if (dragOverColKey === colKey) {
      setDragOverColKey(null);
    }
  };

  const handleHeaderDrop = (e, targetColKey) => {
    e.preventDefault();
    if (!draggedColKey || draggedColKey === targetColKey) {
      setDraggedColKey(null);
      setDragOverColKey(null);
      return;
    }

    const visibleKeys = visibleCols.map(c => c.key);
    const sourceIdx = visibleKeys.indexOf(draggedColKey);
    const targetIdx = visibleKeys.indexOf(targetColKey);

    if (sourceIdx !== -1 && targetIdx !== -1) {
      const newKeys = [...columnKeys];
      const realSource = newKeys.indexOf(draggedColKey);
      const realTarget = newKeys.indexOf(targetColKey);
      if (realSource !== -1 && realTarget !== -1) {
        newKeys.splice(realSource, 1);
        newKeys.splice(realTarget, 0, draggedColKey);
        setColumnKeys(newKeys);
        localStorage.setItem('erp_all_column_order', JSON.stringify(newKeys));
      }
    }

    setDraggedColKey(null);
    setDragOverColKey(null);
  };

  const handleHeaderDragEnd = () => {
    setDraggedColKey(null);
    setDragOverColKey(null);
  };

  const togglePin = (colKey, e) => {
    e?.stopPropagation();
    setPinnedKeys(prev =>
      prev.includes(colKey)
        ? prev.filter(k => k !== colKey)
        : [...prev, colKey]
    );
  };

  const handleResetLayout = () => {
    setColumnKeys(allColumns.map(c => c.key));
    setColumnWidths(DEFAULT_COL_WIDTHS);
    setPinnedKeys(['order_number', 'short_serial']);
    setUserHiddenColumns(new Set());
    localStorage.removeItem('erp_user_hidden_columns');
    localStorage.removeItem('erp_all_column_order');
    localStorage.removeItem('erp_all_colWidths');
    localStorage.removeItem('erp_all_colWidths_v2');
    localStorage.removeItem('erp_all_colWidths_v3');
    localStorage.removeItem('erp_all_colWidths_v4');
    localStorage.removeItem('erp_all_colWidths_v5');
    localStorage.removeItem('erp_all_colWidths_v6');
    localStorage.removeItem('erp_all_colWidths_v7');
    localStorage.removeItem('erp_all_colWidths_v9');
    localStorage.removeItem('erp_all_colWidths_v10');
    localStorage.removeItem('erp_all_colWidths_v15');
    localStorage.removeItem('erp_all_colWidths_v16');
    localStorage.removeItem('erp_all_pinned_keys');
  };

  const rafResizeRef = useRef(null);

  const handleResizeStart = (e, colKey) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.pageX;
    const startWidth = columnWidths[colKey] || DEFAULT_COL_WIDTHS[colKey] || 120;
    const colDef = allColumns?.find(c => c.key === colKey);
    const minSafe = MIN_COL_WIDTHS[colKey] || (isDateTimeType(colDef?.fieldType) ? 165 : 80);

    document.body.classList.add('resizing-active');
    let latestWidth = startWidth;

    const onMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      latestWidth = Math.max(minSafe, startWidth + (moveEvent.pageX - startX));

      if (!rafResizeRef.current) {
        rafResizeRef.current = requestAnimationFrame(() => {
          setColumnWidths(prev => {
            if (prev[colKey] === latestWidth) return prev;
            return {
              ...prev,
              [colKey]: latestWidth
            };
          });
          rafResizeRef.current = null;
        });
      }
    };

    const onMouseUp = () => {
      if (rafResizeRef.current) {
        cancelAnimationFrame(rafResizeRef.current);
        rafResizeRef.current = null;
      }
      document.body.classList.remove('resizing-active');
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      setColumnWidths(prev => {
        const finalMap = { ...prev, [colKey]: latestWidth };
        try {
          localStorage.setItem('erp_all_colWidths_v16', JSON.stringify(finalMap));
        } catch (err) {
          console.error('Failed to save colWidths', err);
        }
        return finalMap;
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const token = localStorage.getItem('token');
  const userRole = (() => {
    if (propUserRole) return propUserRole;
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}');
      if (u && u.role) return u.role;
    } catch (e) { }
    return localStorage.getItem('userRole') || 'Sales';
  })();
  const roleUpper = (userRole || '').trim().toUpperCase();
  const canEdit = hasRole(userRole, TABLE_EDIT_ROLES); // Planning intentionally read-only here
  const canEditPurchaseNA = ['ADMIN', 'MANAGER', 'PURCHASE', 'STORES', 'DESIGN', 'SALES'].includes(roleUpper);
  const canEditPanelSize = ['ADMIN', 'MANAGER', 'DESIGN'].includes(roleUpper);
  const canManageDocs = ['ADMIN', 'MANAGER', 'DESIGN'].includes(roleUpper);
  const canUploadPo = ['ADMIN', 'MANAGER', 'SALES'].includes(roleUpper);
  const canConfirmDesign = ['ADMIN', 'MANAGER', 'DESIGN'].includes(roleUpper);
  const isPurchaseView = (currentFilter || '').toLowerCase() === 'purchase' || (roleUpper === 'PURCHASE' && (currentFilter === 'all' || (currentFilter || '').toLowerCase() === 'purchase'));
  const isStoresView = (currentFilter || '').toLowerCase() === 'stores' || (roleUpper === 'STORES' && (currentFilter === 'all' || (currentFilter || '').toLowerCase() === 'stores'));
  const isSalesView = (currentFilter || '').toLowerCase() === 'sales' || (roleUpper === 'SALES' && (currentFilter === 'all' || (currentFilter || '').toLowerCase() === 'sales'));
  const isProductionView = (currentFilter || '').toLowerCase() === 'production' || (roleUpper === 'PRODUCTION' && (currentFilter === 'all' || (currentFilter || '').toLowerCase() === 'production'));
  const isQcView = (currentFilter || '').toLowerCase() === 'qc' || (roleUpper === 'QC' && (currentFilter === 'all' || (currentFilter || '').toLowerCase() === 'qc'));
  const isDispatchView = (currentFilter || '').toLowerCase() === 'dispatch' || (roleUpper === 'DISPATCH' && (currentFilter === 'all' || (currentFilter || '').toLowerCase() === 'dispatch'));
  const isAccountsView = (currentFilter || '').toLowerCase() === 'accounts' || (roleUpper === 'ACCOUNTS' && (currentFilter === 'all' || (currentFilter || '').toLowerCase() === 'accounts'));

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      return {};
    }
  })();

  const [colVisibility, setColVisibility] = useState({});
  const [userHiddenColumns, setUserHiddenColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('erp_user_hidden_columns');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch (e) {
      return new Set();
    }
  });
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [colSearchQuery, setColSearchQuery] = useState('');
  const columnMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (columnMenuRef.current && !columnMenuRef.current.contains(e.target)) {
        setIsColumnMenuOpen(false);
      }
    };
    if (isColumnMenuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isColumnMenuOpen]);

  const toggleColumnVisibility = (key) => {
    setUserHiddenColumns(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      try {
        localStorage.setItem('erp_user_hidden_columns', JSON.stringify([...next]));
      } catch (e) { }
      return next;
    });
  };

  const showAllColumns = () => {
    setUserHiddenColumns(new Set());
    try {
      localStorage.removeItem('erp_user_hidden_columns');
    } catch (e) { }
  };

  const [editingCell, setEditingCell] = useState(null);
  const [partMasters, setPartMasters] = useState([]);
  const [panelSizeMasters, setPanelSizeMasters] = useState([]);
  const [wiremenList, setWiremenList] = useState(() => {
    try {
      const cached = sessionStorage.getItem('erp_cache_wiremen');
      return cached ? JSON.parse(cached) : [];
    } catch (e) {
      return [];
    }
  });
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [selectedPartForDocs, setSelectedPartForDocs] = useState(null);
  const [editingRefTagUnit, setEditingRefTagUnit] = useState(null);
  const [orderDocsModalData, setOrderDocsModalData] = useState(null);
  const [isPurchaseNewOrderOpen, setIsPurchaseNewOrderOpen] = useState(false);
  const [isPurchaseOrderReceivedOpen, setIsPurchaseOrderReceivedOpen] = useState(false);
  const [vendorPurchaseOrders, setVendorPurchaseOrders] = useState([]);

  const fetchVendorPurchaseOrders = async () => {
    try {
      const res = await apiFetch(`/api/purchase-orders`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setVendorPurchaseOrders(data);
          try {
            localStorage.setItem('vyom_purchase_orders', JSON.stringify(data));
          } catch (e) { }
          return;
        }
      }
    } catch (err) {
      console.warn('Failed to fetch vendor purchase orders:', err);
    }
    try {
      const cached = localStorage.getItem('vyom_purchase_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setVendorPurchaseOrders(parsed);
      }
    } catch (e) { }
  };

  const purchaseOrdersBySerialAndCat = useMemo(() => {
    const map = new Map();
    (vendorPurchaseOrders || []).forEach(order => {
      const cat = String(order.category || '').trim();
      const posList = Array.isArray(order.pos) && order.pos.length > 0
        ? order.pos
        : [{ poNumber: order.poNumber || order.order_uid || 'PO', status: order.status || 'Pending' }];
      const serials = Array.isArray(order.serials) ? order.serials : [];

      serials.forEach(s => {
        const sn = String(s?.serialNumber || s?.unit_serial || s?.serial_number || s?.serial || s || '').trim();
        if (!sn) return;

        posList.forEach(p => {
          const entry = {
            poNumber: p.poNumber || order.poNumber || order.order_uid || 'PO',
            status: p.status || order.status || 'Pending',
            category: cat,
            orderId: order.id,
            createdDate: p.date || (order.created_at ? String(order.created_at).slice(0, 10) : null),
            receivedDate: p.dateReceived || (order.received_at ? String(order.received_at).slice(0, 10) : null)
          };

          const key = `${sn}__${cat}`.toLowerCase();
          const shortKey = `${sn.slice(-4)}__${cat}`.toLowerCase();

          if (!map.has(key)) map.set(key, []);
          map.get(key).push(entry);

          if (!map.has(shortKey)) map.set(shortKey, []);
          map.get(shortKey).push(entry);
        });
      });
    });
    return map;
  }, [vendorPurchaseOrders]);

  const fetchPartMasters = async () => {
    try {
      const res = await apiFetch(`/api/part-number-masters`);
      if (res.ok) {
        setPartMasters(await res.json());
      }
    } catch (err) { console.error(err); }
  };

  const fetchPanelSizeMasters = async () => {
    try {
      const res = await apiFetch(`/api/panel-size-masters`);
      if (res.ok) {
        setPanelSizeMasters(await res.json());
      }
    } catch (err) { console.error(err); }
  };

  const fetchWiremenMasters = async () => {
    try {
      const res = await apiFetch(`/api/wireman-masters`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setWiremenList(data);
          try {
            sessionStorage.setItem('erp_cache_wiremen', JSON.stringify(data));
          } catch (e) { }
        }
      }
    } catch (err) { console.error('Failed to fetch wireman masters:', err); }
  };

  const panelSizeMap = useMemo(() => {
    const map = new Map();
    (panelSizeMasters || []).forEach(m => {
      if (m.panel_size) map.set(m.panel_size, m);
      if (m.size_name) map.set(m.size_name, m);
      if (m.panel_code) map.set(m.panel_code, m);
    });
    return map;
  }, [panelSizeMasters]);

  const customColumnMap = useMemo(() => {
    const map = new Map();
    (customColumnDefs || []).forEach(c => {
      map.set(c.col_key, c);
    });
    return map;
  }, [customColumnDefs]);

  // Signed (ticketed) URL for the in-app PO / details document viewer.
  const { url: poPdfViewerUrl, error: poPdfViewerUrlError } = useSignedUploadUrl(poPdfViewer);
  useEffect(() => {
    if (!poPdfViewerUrlError) return;
    addToast(poPdfViewerUrlError.message || 'Unable to open document', 'error');
    setPoPdfViewer(null);
  }, [poPdfViewerUrlError, addToast]);


  const handlePartNumberClick = useStableCallback(async (unit) => {
    const pNum = unit.part_number;
    const match = partMasters.find(p =>
      p.part_number && pNum && p.part_number.trim().toLowerCase() === pNum.trim().toLowerCase()
    ) || partMasters.find(p => p.part_number === pNum);
    let masterDocs = match?.documents || [];
    let orderDocs = [];
    const targetUnitId = unit.unit_id || unit.id;

    try {
      if (targetUnitId) {
        const resUnit = await apiFetch(`/api/documents/Unit/${targetUnitId}`);
        if (resUnit.ok) {
          const uDocs = await resUnit.json();
          orderDocs = [...orderDocs, ...(Array.isArray(uDocs) ? uDocs : [uDocs])];
        }
      }
      if (unit.order_id) {
        const res = await apiFetch(`/api/documents/Order/${unit.order_id}`);
        if (res.ok) {
          const oDocs = await res.json();
          orderDocs = [...orderDocs, ...(Array.isArray(oDocs) ? oDocs : [oDocs])];
        }
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }

    const drawings = masterDocs.filter(d => (d.doc_type || 'Drawing').toLowerCase() === 'drawing');
    const boms = masterDocs.filter(d => (d.doc_type || '').toLowerCase() === 'bom');
    const currentDrawing = match?.drawing || drawings.find(d => d.is_current) || (drawings.length > 0 ? drawings[drawings.length - 1] : null);
    const currentBOM = match?.bom || boms.find(d => d.is_current) || (boms.length > 0 ? boms[boms.length - 1] : null);

    setSelectedPartForDocs({
      partId: match?.id || null,
      partNumber: pNum || 'Unspecified',
      clientName: match?.client_name || '',
      project: match?.project || '',
      orderId: unit.order_id,
      orderNumber: unit.order_number || '',
      unitId: targetUnitId,
      unitSerial: unit.unit_serial || unit.short_serial || '',
      description: unit.material_description || '',
      classification: unit.classification || 'Standard',
      drawing: currentDrawing,
      bom: currentBOM,
      drawingHistory: match?.drawing_history || [...drawings].reverse(),
      bomHistory: match?.bom_history || [...boms].reverse(),
      masterDocs,
      orderDocs
    });
    setShowDocsModal(true);
  });

  const handleConfirmDesignClassification = useStableCallback(async (unit) => {
    const targetUnitId = unit.unit_id || unit.id;
    if (!targetUnitId) return;

    // Optimistic UI update: mark design_confirmed = true immediately
    setUnits(prevUnits => prevUnits.map(u => {
      const uId = u.unit_id || u.id;
      if (uId === targetUnitId) {
        const updatedDesignSteps = (u.design_steps || []).map(s => {
          if (s.name === 'Review & Classify' || (s.name || '').toLowerCase().includes('classify')) {
            return { ...s, status: 'done', notes: 'Classification confirmed by Design.' };
          }
          return s;
        });
        const updatedDeptSteps = (u.dept_steps || []).map(s => {
          if (s.name === 'Review & Classify' || (s.name || '').toLowerCase().includes('classify')) {
            return { ...s, status: 'done', notes: 'Classification confirmed by Design.' };
          }
          return s;
        });
        return {
          ...u,
          design_confirmed: true,
          design_confirmed_at: new Date().toISOString(),
          design_confirmed_by_name: currentUser?.name || currentUser?.username || 'Design',
          design_steps: updatedDesignSteps,
          dept_steps: updatedDeptSteps
        };
      }
      return u;
    }));

    try {
      const res = await apiFetch(`/api/units/${targetUnitId}/design-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.unit) {
          setUnits(prevUnits => prevUnits.map(u => {
            const uId = u.unit_id || u.id;
            if (uId === targetUnitId) {
              const updatedDesignSteps = (u.design_steps || []).map(s => {
                if (s.name === 'Review & Classify' || (s.name || '').toLowerCase().includes('classify')) {
                  return { ...s, status: 'done', notes: 'Classification confirmed by Design.' };
                }
                if (s.name === 'Release Documents' || (s.name || '').toLowerCase().includes('release')) {
                  return { ...s, status: data.step2Status || s.status, notes: data.notes || s.notes };
                }
                return s;
              });
              const updatedDeptSteps = (u.dept_steps || []).map(s => {
                if (s.name === 'Review & Classify' || (s.name || '').toLowerCase().includes('classify')) {
                  return { ...s, status: 'done', notes: 'Classification confirmed by Design.' };
                }
                if (s.name === 'Release Documents' || (s.name || '').toLowerCase().includes('release')) {
                  return { ...s, status: data.step2Status || s.status, notes: data.notes || s.notes };
                }
                return s;
              });
              return {
                ...u,
                ...data.unit,
                unit_id: u.unit_id,
                unit_status: data.unit.status || u.unit_status,
                current_dept: data.unit.current_dept || u.current_dept,
                design_steps: updatedDesignSteps,
                dept_steps: updatedDeptSteps
              };
            }
            return u;
          }));
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Failed to confirm design classification:', errData.error || res.status);
        addToast(errData.error || 'Failed to confirm design classification', 'error');
        fetchUnits(true);
      }
    } catch (err) {
      console.error('Error confirming design classification:', err);
      addToast(err.message || 'Failed to confirm design classification', 'error');
      fetchUnits(true);
    }
  });

  const handleUnconfirmDesignClassification = useStableCallback(async (unit) => {
    const targetUnitId = unit.unit_id || unit.id;
    if (!targetUnitId) return;

    setUnits(prevUnits => prevUnits.map(u => {
      const uId = u.unit_id || u.id;
      if (uId === targetUnitId) {
        return {
          ...u,
          design_confirmed: false,
          design_confirmed_at: null,
          design_confirmed_by: null,
          design_confirmed_by_name: null
        };
      }
      return u;
    }));

    try {
      const res = await apiFetch(`/api/units/${targetUnitId}/design-unconfirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.unit) {
          setUnits(prevUnits => prevUnits.map(u => {
            const uId = u.unit_id || u.id;
            if (uId === targetUnitId) {
              return {
                ...u,
                ...data.unit,
                unit_id: u.unit_id,
                unit_status: data.unit.status || u.unit_status,
                current_dept: data.unit.current_dept || u.current_dept
              };
            }
            return u;
          }));
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error('Failed to reset design confirmation:', errData.error || res.status);
        addToast(errData.error || 'Failed to reset design confirmation', 'error');
        fetchUnits(true);
      }
    } catch (err) {
      console.error('Error unconfirming design:', err);
      addToast(err.message || 'Failed to reset design confirmation', 'error');
      fetchUnits(true);
    }
  });

  const handleRequestUnconfirmDesign = useCallback((unit) => {
    const serial = unit.short_serial || unit.unit_serial || unit.unit_id;
    setConfirmDialog({
      isOpen: true,
      title: 'Reset Design Sign-Off',
      message: `Reset Design confirmation for Unit ${serial} to re-evaluate? This will return the panel classification to unconfirmed status.`,
      variant: 'warning',
      confirmText: 'Reset Sign-Off',
      onConfirm: () => handleUnconfirmDesignClassification(unit)
    });
  }, [handleUnconfirmDesignClassification]); // stable identity (useStableCallback)

  const handleTogglePurchaseCatNA = useStableCallback(async (unit, colKey) => {
    const catLabels = {
      purchase_cat_panel: 'Panel',
      purchase_cat_automation: 'Automation',
      purchase_cat_low_voltage: 'Low Voltage',
      purchase_cat_wires: 'Wires & Accessories'
    };
    const catLabel = catLabels[colKey] || 'Purchase Category';

    // 1. Determine target units (all selected units if any selected, otherwise clicked unit)
    const selectedList = units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
    let targetUnits = [];
    if (selectedList.length > 0) {
      const clickedId = unit ? (unit.unit_id || unit.id) : null;
      const hasClicked = clickedId && selectedList.some(u => (u.unit_id || u.id) === clickedId);
      targetUnits = hasClicked || !unit ? selectedList : [...selectedList, unit];
    } else if (unit) {
      targetUnits = [unit];
    }

    if (targetUnits.length === 0) {
      if (addToast) addToast(`Please select serial numbers on the left first to mark ${catLabel} as N/A.`, 'warning');
      return;
    }

    // 2. If multiple units: if ANY unit is not NA, set all to 'NA'. If all are already 'NA', revert them.
    // If single unit: toggle current state.
    const shouldSetNA = targetUnits.length > 1
      ? targetUnits.some(u => u.custom_fields?.[colKey] !== 'NA')
      : targetUnits[0].custom_fields?.[colKey] !== 'NA';

    const nextVal = shouldSetNA ? 'NA' : null;
    const targetIdsSet = new Set(targetUnits.map(u => String(u.unit_id || u.id)));

    // 3. Optimistic UI update across all target units instantly (0ms)
    setUnits(prevUnits => prevUnits.map(u => {
      const uId = String(u.unit_id || u.id);
      if (targetIdsSet.has(uId)) {
        const cf = { ...(u.custom_fields || {}) };
        if (nextVal === 'NA') {
          cf[colKey] = 'NA';
        } else {
          delete cf[colKey];
        }
        return { ...u, custom_fields: cf };
      }
      return u;
    }));

    // 4. Persist to backend via batch endpoint
    try {
      const targetIdsList = targetUnits.map(u => u.unit_id || u.id);
      const res = await apiFetch(`/api/units/batch-purchase-na`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          unit_ids: targetIdsList,
          colKey,
          value: nextVal
        })
      });

      if (!res.ok) {
        console.warn('Batch endpoint failed, falling back to individual updates:', res.statusText);
        await Promise.all(targetUnits.map(async (tu) => {
          const tuId = tu.unit_id || tu.id;
          const cf = { ...(tu.custom_fields || {}) };
          if (nextVal === 'NA') cf[colKey] = 'NA';
          else delete cf[colKey];
          return apiFetch(`/api/units/${tuId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ custom_fields: cf })
          });
        }));
      }

      if (addToast) {
        addToast(
          `${shouldSetNA ? 'Marked' : 'Reverted'} ${targetUnits.length} serial${targetUnits.length > 1 ? 's' : ''} ${shouldSetNA ? 'as N/A' : 'to Pending'} for ${catLabel}`,
          'success'
        );
      }
      fetchUnits(true);
    } catch (err) {
      console.error('Error saving purchase category N/A status:', err);
      if (addToast) {
        addToast(err.message || 'Failed to update category status', 'error');
      }
      fetchUnits(true);
    }
  });

  // PUT JSON and throw (with the server's error message) on a non-OK response.
  const putJson = async (url, body, fallbackError = 'Update failed') => {
    const res = await apiFetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || data.message || `${fallbackError} (${res.status})`);
    }
    return res;
  };

  // PUT /api/units/:id accepts either order_units.id or the unit_id serial; this
  // view keys every row by `unit.unit_id || unit.id`, so use that everywhere.
  const getUnitApiId = (u) => (u ? (u.unit_id || u.id) : null);

  const handleSaveInlineCell = useStableCallback(async (unit, colKey, newValue) => {
    const targetUnitId = getUnitApiId(unit);
    const customDef = customColumnDefs.find(c => c.col_key === colKey);

    // Handle dedicated Production / QC / Dispatch / Accounts columns
    if (PRODUCTION_AND_QC_COLS.has(colKey)) {
      const selectedList = units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
      const finalVal = newValue || null;

      if (selectedList.length > 0) {
        // Collect all target units: all selected units plus the edited unit (if not already in selectedList)
        const targetMap = new Map();
        selectedList.forEach(u => targetMap.set(u.unit_id || u.id, u));
        if (unit && (unit.unit_id || unit.id)) {
          targetMap.set(unit.unit_id || unit.id, unit);
        }
        const targetIds = Array.from(targetMap.keys());

        setUnits(prev => prev.map(u => {
          const uId = u.unit_id || u.id;
          if (targetMap.has(uId)) {
            return { ...u, [colKey]: finalVal };
          }
          return u;
        }));
        setEditingCell(null);

        try {
          await Promise.all(targetIds.map(uId =>
            putJson(`${window.API_BASE}/api/units/${uId}`, { [colKey]: finalVal }, `Failed to update ${colKey}`)
          ));
          if (addToast) {
            const colLabel = allColumns.find(c => c.key === colKey)?.label || colKey.replace(/_/g, ' ');
            addToast(`Updated ${colLabel} for ${targetIds.length} serial${targetIds.length > 1 ? 's' : ''}`, 'success');
          }
        } catch (err) {
          console.error(`Failed to batch update ${colKey}:`, err);
          if (addToast) addToast(`Failed to update some serials: ${err.message}`, 'error');
        } finally {
          fetchUnits(true);
        }
        return;
      }

      setUnits(prev => prev.map(u => {
        const currentId = u.unit_id || u.id;
        if (currentId === targetUnitId) {
          return { ...u, [colKey]: finalVal };
        }
        return u;
      }));
      setEditingCell(null);

      try {
        if (targetUnitId) {
          await putJson(`${window.API_BASE}/api/units/${targetUnitId}`, { [colKey]: finalVal }, `Failed to update ${colKey}`);
        }
      } catch (err) {
        console.error(`Failed to save ${colKey}:`, err);
        if (addToast) {
          addToast(err.message || `Failed to save ${colKey}`, 'error');
        }
      } finally {
        fetchUnits(true);
      }
      return;
    }

    // Handle dedicated Stores columns
    if (['tray_status', 'tray_start_date', 'issued_date'].includes(colKey)) {
      const currentCF = unit.custom_fields || {};
      const updatedCF = { ...currentCF, [colKey]: newValue };
      const extraUpdates = {};

      if (colKey === 'tray_status') {
        const selectedList = units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
        const clickedId = unit ? (unit.unit_id || unit.id) : null;
        const isClickedSelected = clickedId && selectedList.some(u => (u.unit_id || u.id) === clickedId);

        if (selectedList.length > 1 && isClickedSelected) {
          await handleBatchTrayStatus(newValue, selectedList);
          return;
        }

        const prevStatus = unit.tray_status || unit.custom_fields?.tray_status || 'Not Started';
        const startedStatuses = ['In Process', 'Partial Ready', 'Full Ready'];
        const issuedStatuses = ['Partial Issued', 'All Issued'];
        const hasStartDate = !!(unit.tray_start_date || unit.custom_fields?.tray_start_date);
        const wasStarted = ['In Process', 'Partial Ready', 'Full Ready', 'Partial Issued', 'All Issued'].includes(prevStatus);

        // Constraint: Cannot issue tray unless it was started first
        if (issuedStatuses.includes(newValue)) {
          if (!hasStartDate && !wasStarted) {
            if (addToast) {
              addToast('Tray must be started (In Process / Ready) before an issue date can be assigned.', 'warning');
            }
            return;
          }
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayDateStr = `${year}-${month}-${day}`;

        // 1st time status change date (only if transitioning from Not Started or no start date yet)
        if ((prevStatus === 'Not Started' || !unit.tray_start_date) && startedStatuses.includes(newValue)) {
          extraUpdates.tray_start_date = todayDateStr;
          updatedCF.tray_start_date = todayDateStr;
        }

        // Issued date when status changes to Partial Issued or All Issued; reset to null otherwise
        if (issuedStatuses.includes(newValue)) {
          extraUpdates.issued_date = todayDateStr;
          updatedCF.issued_date = todayDateStr;
        } else {
          extraUpdates.issued_date = null;
          updatedCF.issued_date = null;
        }
      }

      const normalizeDateStr = (val) => {
        if (!val) return '';
        if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
          return val.substring(0, 10);
        }
        const d = new Date(val);
        if (isNaN(d.getTime())) return String(val).trim();
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };

      if (colKey === 'issued_date') {
        const startDate = unit.tray_start_date || unit.custom_fields?.tray_start_date;
        if (!startDate) {
          if (addToast) {
            addToast('Tray Start Date must be set before an Issued Date can be set.', 'warning');
          }
          setEditingCell(null);
          return;
        }
        if (newValue) {
          const sDateStr = normalizeDateStr(startDate);
          const iDateStr = normalizeDateStr(newValue);
          if (iDateStr < sDateStr) {
            if (addToast) {
              addToast(`Issued Date (${iDateStr}) cannot be earlier than Tray Start Date (${sDateStr}).`, 'warning');
            }
            setEditingCell(null);
            return;
          }
        }
      }

      if (colKey === 'tray_start_date' && newValue) {
        const issuedDate = unit.issued_date || unit.custom_fields?.issued_date;
        if (issuedDate) {
          const sDateStr = normalizeDateStr(newValue);
          const iDateStr = normalizeDateStr(issuedDate);
          if (sDateStr > iDateStr) {
            if (addToast) {
              addToast(`Tray Start Date (${sDateStr}) cannot be after Issued Date (${iDateStr}).`, 'warning');
            }
            setEditingCell(null);
            return;
          }
        }
      }

      setUnits(prevUnits => prevUnits.map(u => {
        const currentId = u.unit_id || u.id;
        if (currentId === targetUnitId) {
          return { ...u, [colKey]: newValue, ...extraUpdates, custom_fields: updatedCF };
        }
        return u;
      }));
      setEditingCell(null);

      try {
        if (targetUnitId) {
          await putJson(
            `${window.API_BASE}/api/units/${targetUnitId}`,
            { [colKey]: newValue, ...extraUpdates, custom_fields: updatedCF },
            `Failed to update ${colKey}`
          );
        }
      } catch (err) {
        console.error(`Failed to save ${colKey}:`, err);
        if (addToast) {
          addToast(err.message || `Failed to save ${colKey}`, 'error');
        }
      } finally {
        fetchUnits(true);
      }
      return;
    }

    // If this is a custom field from column-masters, save into custom_fields jsonb
    if (customDef) {
      const selectedList = units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));

      if (selectedList.length > 0) {
        const targetMap = new Map();
        selectedList.forEach(u => targetMap.set(u.unit_id || u.id, u));
        if (unit && (unit.unit_id || unit.id)) {
          targetMap.set(unit.unit_id || unit.id, unit);
        }
        const targetsToUpdate = Array.from(targetMap.values());
        const targetIds = Array.from(targetMap.keys());

        setUnits(prevUnits => prevUnits.map(u => {
          const uId = u.unit_id || u.id;
          if (targetMap.has(uId)) {
            const currentCF = u.custom_fields || {};
            return { ...u, custom_fields: { ...currentCF, [colKey]: newValue } };
          }
          return u;
        }));
        setEditingCell(null);

        try {
          await Promise.all(targetsToUpdate.map(tUnit => {
            const uId = getUnitApiId(tUnit);
            const currentCF = tUnit.custom_fields || {};
            const updatedCF = { ...currentCF, [colKey]: newValue };
            return putJson(`${window.API_BASE}/api/units/${uId}`, { custom_fields: updatedCF }, `Failed to update ${customDef.label || colKey}`);
          }));
          if (addToast) {
            addToast(`Updated ${customDef.label || colKey} for ${targetIds.length} serials`, 'success');
          }
        } catch (err) {
          console.error('Failed to batch save custom field:', err);
          if (addToast) addToast(`Failed to update some custom fields: ${err.message}`, 'error');
        } finally {
          fetchUnits(true);
        }
        return;
      }

      const currentCF = unit.custom_fields || {};
      const updatedCF = { ...currentCF, [colKey]: newValue };

      setUnits(prevUnits => prevUnits.map(u => {
        const currentId = u.unit_id || u.id;
        if (currentId === targetUnitId) {
          return { ...u, custom_fields: updatedCF };
        }
        return u;
      }));
      setEditingCell(null);

      try {
        if (targetUnitId) {
          await putJson(`${window.API_BASE}/api/units/${targetUnitId}`, { custom_fields: updatedCF }, `Failed to update ${customDef.label || colKey}`);
        }
      } catch (err) {
        console.error('Failed to save custom field:', err);
        if (addToast) addToast(err.message || `Failed to save ${customDef.label || colKey}`, 'error');
      } finally {
        fetchUnits(true);
      }
      return;
    }

    // Batch update delivery_date if multiple rows selected
    const selectedListForGeneral = units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
    if (selectedListForGeneral.length > 0 && colKey === 'delivery_date') {
      const targetMap = new Map();
      selectedListForGeneral.forEach(u => targetMap.set(u.unit_id || u.id, u));
      if (unit && (unit.unit_id || unit.id)) {
        targetMap.set(unit.unit_id || unit.id, unit);
      }
      const targetIds = Array.from(targetMap.keys());

      setUnits(prevUnits => prevUnits.map(u => {
        const uId = u.unit_id || u.id;
        if (targetMap.has(uId)) {
          return { ...u, delivery_date: newValue };
        }
        return u;
      }));
      setEditingCell(null);

      try {
        await Promise.all(targetIds.map(uId =>
          putJson(`${window.API_BASE}/api/units/${uId}`, { delivery_date: newValue }, 'Failed to update delivery date')
        ));
        if (addToast) {
          addToast(`Updated delivery date for ${targetIds.length} serials`, 'success');
        }
      } catch (err) {
        console.error('Failed to batch update delivery_date:', err);
        if (addToast) addToast(`Failed to update delivery date: ${err.message}`, 'error');
      } finally {
        fetchUnits(true);
      }
      return;
    }

    // 1. Optimistic UI update - changes value instantly without unmounting or resetting scroll!
    setUnits(prevUnits => prevUnits.map(u => {
      const currentId = u.unit_id || u.id;
      if (currentId === targetUnitId) {
        const updated = { ...u, [colKey]: newValue };
        if (colKey === 'classification') {
          updated.design_confirmed = false;
          updated.design_confirmed_at = null;
          updated.design_confirmed_by = null;
          updated.design_confirmed_by_name = null;
        }
        if (colKey === 'panel_type_size') {
          const matched = panelSizeMasters.find(m => (m.panel_size || m.size_name) === newValue || m.panel_code === newValue);
          updated.panel_code = matched?.panel_code || '';
          updated.panel_ip_rating = matched?.ip_rating || '';
          updated.panel_comments = matched?.comments || matched?.description || '';
        }
        return updated;
      }
      return u;
    }));
    setEditingCell(null);

    try {
      if (colKey === 'classification' || colKey === 'panel_type_size' || colKey === 'po_number') {
        if (targetUnitId) {
          await putJson(`${window.API_BASE}/api/units/${targetUnitId}`, { [colKey]: newValue }, `Failed to update ${colKey}`);
        }
      } else if (colKey === 'material_description') {
        const liId = unit.line_item_id;
        const ordId = unit.order_id;
        if (liId && ordId) {
          await putJson(`${window.API_BASE}/api/orders/${ordId}/line-items/${liId}`, { material_description: newValue }, 'Failed to update description');
        }
      } else {
        await putJson(`${window.API_BASE}/api/orders/${unit.order_id}`, { [colKey]: newValue }, `Failed to update ${colKey}`);
      }
    } catch (err) {
      console.error('Failed to update inline cell:', err);
      if (addToast) addToast(err.message || `Failed to save ${colKey}`, 'error');
    } finally {
      // Silent refresh in background (also reverts the optimistic update on failure)
      fetchUnits(true);
    }
  });

  useEffect(() => {
    fetchColumnVisibility();
    fetchUnits();
    fetchPartMasters();
    fetchPanelSizeMasters();
    fetchVendorPurchaseOrders();
    fetchWiremenMasters();

    // Coalesce bursts of update events (SSE + local dispatches) into one silent
    // units refresh. Part / panel-size masters are not refetched here: this view
    // unmounts while Masters or OrderCreationFlow is open and refetches them on
    // remount, and TechnicalDocsModal refreshes part masters via its own callback.
    let refreshTimer = null;
    let refreshVendorPOs = false;
    const scheduleRefresh = ({ vendorPOs = false } = {}) => {
      if (vendorPOs) refreshVendorPOs = true;
      if (refreshTimer) clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        refreshTimer = null;
        fetchUnits(true);
        if (refreshVendorPOs) {
          refreshVendorPOs = false;
          fetchVendorPurchaseOrders();
        }
      }, 250);
    };

    const isPurchaseRelated = (detail) => {
      if (!detail || typeof detail !== 'object') return false;
      if (String(detail.type || '').toLowerCase() === 'purchase') return true;
      if (detail.dept === 'Purchase') return true;
      return /purchase/i.test(String(detail.entity || '')) || /purchase/i.test(String(detail.action || ''));
    };

    const handleOrderUpdated = (e) => {
      scheduleRefresh({ vendorPOs: isPurchaseRelated(e?.detail) });
    };
    const handleColumnMastersUpdated = () => {
      fetchColumnVisibility();
      scheduleRefresh();
    };
    const handlePurchaseOrderEvent = () => {
      scheduleRefresh({ vendorPOs: true });
    };
    const handleWiremenUpdated = () => {
      fetchWiremenMasters();
    };

    window.addEventListener('orderUpdated', handleOrderUpdated);
    window.addEventListener('columnMastersUpdated', handleColumnMastersUpdated);
    window.addEventListener('purchaseOrderStatusChanged', handlePurchaseOrderEvent);
    window.addEventListener('purchaseOrderSaved', handlePurchaseOrderEvent);
    window.addEventListener('wiremenUpdated', handleWiremenUpdated);
    return () => {
      if (refreshTimer) clearTimeout(refreshTimer);
      window.removeEventListener('orderUpdated', handleOrderUpdated);
      window.removeEventListener('columnMastersUpdated', handleColumnMastersUpdated);
      window.removeEventListener('purchaseOrderStatusChanged', handlePurchaseOrderEvent);
      window.removeEventListener('purchaseOrderSaved', handlePurchaseOrderEvent);
      window.removeEventListener('wiremenUpdated', handleWiremenUpdated);
    };
  }, [currentFilter]);

  // Double-press Escape key to uncheck all selected rows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key !== 'Escape') return;
      setActiveRowId(null);

      // If any modal overlay is active, let the modal's Escape handler take precedence
      const hasOpenModal = Boolean(
        document.querySelector(`${MODAL_OVERLAY_SELECTOR}, .ord-docs-modal-overlay`)
      );
      if (hasOpenModal) return;

      // If currently editing an inline table cell, let Escape cancel the cell edit
      if (editingCell) return;

      // If a dropdown or search picker is open, let Escape close the dropdown and reset timer
      const hasOpenDropdown = Boolean(
        document.querySelector('.picker-dropdown, .search-select-dropdown, .dropdown-menu.show')
      );
      if (hasOpenDropdown) {
        lastEscPressRef.current = 0;
        return;
      }

      const now = Date.now();
      const timeDiff = now - lastEscPressRef.current;

      // Double-press threshold: 500ms
      if (timeDiff <= 500 && timeDiff > 0) {
        lastEscPressRef.current = 0;
        if (selectedUnitIds.size > 0) {
          setSelectedUnitIds(new Set());
          lastSelectedIndexRef.current = null;
          isDraggingSelectRef.current = false;
          dragStartIdxRef.current = null;
        }
      } else {
        lastEscPressRef.current = now;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedUnitIds, editingCell]);

  const fetchColumnVisibility = async () => {
    try {
      const res = await apiFetch(`/api/column-masters`);
      if (res.ok) {
        const data = await res.json();
        setColVisibility(data.visibilityByDept || {});

        const customCols = (data.columns || []).filter(c => !c.is_system);
        setCustomColumnDefs(customCols);

        const customMapped = customCols.map(c => ({
          key: c.col_key,
          label: c.label,
          align: (isDateType(c.field_type) || isDateTimeType(c.field_type) || c.field_type === 'Number' || c.field_type === 'Yes/No') ? 'center' : 'left',
          isCustom: true,
          fieldType: c.field_type,
          category: c.category
        }));

        const baseKeys = new Set(BASE_COLUMNS.map(c => c.key));
        const merged = [
          ...BASE_COLUMNS,
          ...customMapped.filter(c => !baseKeys.has(c.key))
        ];
        setAllColumns(merged);
      }
    } catch (err) { console.error(err); }
  };

  const isColVisible = useCallback((colKey) => {
    if (userHiddenColumns.has(colKey)) return false;

    // Department-owned columns: shown by default in the owning dept's view and in
    // 'all' (unless explicitly hidden there); hidden in every other view unless
    // explicitly enabled for it.
    const owningDept = getOwningDept(colKey);
    if (owningDept) {
      const deptMap = colVisibility[currentFilter];
      if (currentFilter === owningDept || currentFilter === 'all') {
        return deptMap ? deptMap[colKey] !== false : true;
      }
      return deptMap ? deptMap[colKey] === true : false;
    }

    if (currentFilter === 'all') return true;
    const deptMap = colVisibility[currentFilter];
    if (!deptMap) return true;
    const key = colKey === 'unit_serial' ? 'short_serial' : colKey;
    return deptMap[key] !== false;
  }, [userHiddenColumns, colVisibility, currentFilter]);

  // Only the most recent fetchUnits call may write to state, so a slow response
  // for an older filter / earlier refresh can never overwrite newer data.
  const fetchUnitsRequestIdRef = useRef(0);
  const fetchUnits = async (silent = false) => {
    const requestId = ++fetchUnitsRequestIdRef.current;
    if (!silent) setIsLoading(true);
    try {
      const deptParam = currentFilter;
      const res = await apiFetch(`/api/dept-worklist/${encodeURIComponent(deptParam)}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to load units (${res.status})`);
      }
      const data = await res.json();
      if (requestId === fetchUnitsRequestIdRef.current) {
        setUnits(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (requestId === fetchUnitsRequestIdRef.current) setIsLoading(false);
    }
  };

  const handleRowClick = useCallback((orderId, unitId) => {
    window.dispatchEvent(new CustomEvent('setView', {
      detail: { view: 'flow', orderId: parseInt(orderId), unitId: parseInt(unitId) }
    }));
  }, []);

  const handleSort = useCallback((key) => {
    setSortKey(prevKey => {
      if (prevKey === key) {
        setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        return prevKey;
      } else {
        setSortDir('asc');
        return key;
      }
    });
  }, []);

  const unitStatusMap = useMemo(() => {
    const map = new Map();
    for (let i = 0; i < units.length; i++) {
      const u = units[i];
      const id = u.unit_id || u.id;
      map.set(id, calculateUnitStatus(u, currentFilter, userRole));
    }
    return map;
  }, [units, currentFilter, userRole]);

  const getUnitStatus = useCallback((unit) => {
    if (!unit) return 'Pending';
    const id = unit.unit_id || unit.id;
    return unitStatusMap.get(id) || 'Pending';
  }, [unitStatusMap]);

  const { holdCount, cancelledCount } = useMemo(() => {
    let hold = 0;
    let cancelled = 0;
    for (let i = 0; i < units.length; i++) {
      const s = getUnitStatus(units[i]);
      if (s === 'Hold' || s === 'On Hold') hold++;
      else if (s === 'Cancelled') cancelled++;
    }
    return { holdCount: hold, cancelledCount: cancelled };
  }, [units, getUnitStatus]);

  // Keep typing responsive on large tables: the filter re-runs at lower priority.
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const filtered = useMemo(() => {
    return units.filter(u => {
      const status = getUnitStatus(u);

      // Tab-level filtering
      if (activeTab === 'hold' && status !== 'Hold' && status !== 'On Hold') return false;
      if (activeTab === 'cancelled' && status !== 'Cancelled') return false;

      // Apply Stat Card Filter if active
      if (statCardFilter === 'priority') {
        const p = (u.priority || 'Medium').toLowerCase();
        if (p !== 'urgent' && p !== 'high') return false;
      } else if (statCardFilter === 'inprogress') {
        const isUnitInProgress =
          status === 'In Progress' ||
          status === 'In Process' ||
          Number(u.inprogress_step_count || 0) > 0 ||
          Number(u.order_inprogress_step_count || 0) > 0 ||
          u.dept_steps?.some(s => isStatusInProgress(s.status)) ||
          u.design_steps?.some(s => isStatusInProgress(s.status)) ||
          u.steps?.some(s => isStatusInProgress(s.status)) ||
          isStatusInProgress(u.unit_status) ||
          isStatusInProgress(u.status) ||
          isStatusInProgress(u.order_status);
        if (!isUnitInProgress) return false;
      } else if (statCardFilter === 'blocked') {
        const isUnitBlocked =
          status === 'Blocked' ||
          String(u.unit_status || '').toLowerCase() === 'blocked' ||
          String(u.status || '').toLowerCase() === 'blocked' ||
          u.dept_steps?.some(s => String(s.status || '').toLowerCase() === 'blocked') ||
          u.steps?.some(s => String(s.status || '').toLowerCase() === 'blocked');
        if (!isUnitBlocked) return false;
      } else if (statCardFilter === 'due') {
        if (!u.delivery_date) return false;
        const today = new Date();
        const in7 = new Date(today);
        in7.setDate(today.getDate() + 7);
        const d = new Date(u.delivery_date);
        if (d < today || d > in7) return false;
      }

      if (priorityFilter !== 'all' && (u.priority || 'Medium').toLowerCase() !== priorityFilter) return false;

      // Status filter dropdown (when in All Orders tab)
      if (activeTab === 'all') {
        if ((statusFilter === 'incomplete' || statusFilter === 'active') && (status === 'Completed' || status === 'Cancelled')) return false;
        if (statusFilter === 'completed' && status !== 'Completed') return false;
        if ((statusFilter === 'pending' || statusFilter === 'not_started') && status !== 'Pending' && status !== 'Not Started') return false;
        if (statusFilter === 'inprogress' || statusFilter === 'in_process') {
          const isUnitInProgress =
            status === 'In Progress' ||
            status === 'In Process' ||
            Number(u.inprogress_step_count || 0) > 0 ||
            Number(u.order_inprogress_step_count || 0) > 0 ||
            u.dept_steps?.some(s => isStatusInProgress(s.status)) ||
            u.design_steps?.some(s => isStatusInProgress(s.status)) ||
            u.steps?.some(s => isStatusInProgress(s.status)) ||
            isStatusInProgress(u.unit_status) ||
            isStatusInProgress(u.status) ||
            isStatusInProgress(u.order_status);
          if (!isUnitInProgress) return false;
        }
        if (statusFilter === 'blocked') {
          const isUnitBlocked =
            status === 'Blocked' ||
            String(u.unit_status || '').toLowerCase() === 'blocked' ||
            String(u.status || '').toLowerCase() === 'blocked' ||
            u.dept_steps?.some(s => String(s.status || '').toLowerCase() === 'blocked') ||
            u.steps?.some(s => String(s.status || '').toLowerCase() === 'blocked');
          if (!isUnitBlocked) return false;
        }
        if (statusFilter === 'hold' && status !== 'Hold' && status !== 'On Hold') return false;
        if (statusFilter === 'cancelled' && status !== 'Cancelled') return false;
      }

      if (deferredSearchTerm) {
        const q = deferredSearchTerm.toLowerCase();
        const customMatches = Object.values(u.custom_fields || {}).some(
          val => val != null && String(val).toLowerCase().includes(q)
        );
        return (
          customMatches ||
          (u.unit_serial || '').toLowerCase().includes(q) ||
          (u.short_serial || '').toLowerCase().includes(q) ||
          (u.po_number || '').toLowerCase().includes(q) ||
          (u.company_name || '').toLowerCase().includes(q) ||
          (u.end_client_name || '').toLowerCase().includes(q) ||
          (u.reference_number || '').toLowerCase().includes(q) ||
          (u.tag || '').toLowerCase().includes(q) ||
          ((u.reference_number && u.tag) ? `${u.reference_number}/${u.tag}`.toLowerCase().includes(q) : false) ||
          (u.material_description || '').toLowerCase().includes(q) ||
          (u.part_number || '').toLowerCase().includes(q) ||
          (u.panel_type_size || '').toLowerCase().includes(q) ||
          (u.panel_code || '').toLowerCase().includes(q) ||
          (u.panel_ip_rating || '').toLowerCase().includes(q) ||
          (u.panel_comments || '').toLowerCase().includes(q) ||
          (u.wiremen || '').toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [units, activeTab, statCardFilter, priorityFilter, statusFilter, deferredSearchTerm, getUnitStatus]);

  const sorted = useMemo(() => {
    const customDef = customColumnMap.get(sortKey);
    return [...filtered].sort((a, b) => {
      let av, bv;
      if (customDef) {
        const aVal = a.custom_fields?.[sortKey] ?? '';
        const bVal = b.custom_fields?.[sortKey] ?? '';
        if (isDateType(customDef.field_type) || isDateTimeType(customDef.field_type)) {
          av = aVal ? new Date(aVal).getTime() : Infinity;
          bv = bVal ? new Date(bVal).getTime() : Infinity;
        } else if (customDef.field_type === 'Number') {
          av = aVal !== '' ? Number(aVal) : Infinity;
          bv = bVal !== '' ? Number(bVal) : Infinity;
        } else {
          av = String(aVal).toLowerCase();
          bv = String(bVal).toLowerCase();
        }
      } else if (sortKey === 'priority') {
        av = PRIORITY_ORDER[a.priority || 'Medium'] ?? 2;
        bv = PRIORITY_ORDER[b.priority || 'Medium'] ?? 2;
      } else if (sortKey === 'delivery_date' || [
        'tray_start_date', 'issued_date',
        'mounting_start_date', 'mounting_complete_date',
        'wiring_start_date', 'wiring_complete_date',
        'pending_material_complete_date', 'handover_to_qc_date',
        'qc_receiving_date', 'qc_start_date', 'qc_complete_date',
        'dispatch_date', 'invoice_date'
      ].includes(sortKey)) {
        av = a[sortKey] ? new Date(a[sortKey]).getTime() : Infinity;
        bv = b[sortKey] ? new Date(b[sortKey]).getTime() : Infinity;
      } else if (sortKey === 'unit_status') {
        av = getUnitStatus(a);
        bv = getUnitStatus(b);
      } else {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        if (sortKey === 'reference_number') {
          aVal = (a.reference_number && a.tag) ? `${a.reference_number}/${a.tag}` : (a.reference_number || a.tag || '');
          bVal = (b.reference_number && b.tag) ? `${b.reference_number}/${b.tag}` : (b.reference_number || b.tag || '');
        } else if (['panel_code', 'panel_ip_rating', 'panel_comments'].includes(sortKey)) {
          if (!aVal) {
            const masterA = panelSizeMap.get(a.panel_type_size);
            aVal = sortKey === 'panel_code' ? masterA?.panel_code : sortKey === 'panel_ip_rating' ? masterA?.ip_rating : (masterA?.comments || masterA?.description);
          }
          if (!bVal) {
            const masterB = panelSizeMap.get(b.panel_type_size);
            bVal = sortKey === 'panel_code' ? masterB?.panel_code : sortKey === 'panel_ip_rating' ? masterB?.ip_rating : (masterB?.comments || masterB?.description);
          }
        }
        av = (aVal || '').toString().toLowerCase();
        bv = (bVal || '').toString().toLowerCase();
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortKey, sortDir, customColumnMap, panelSizeMap, getUnitStatus]);

  const totalPages = pageSize === 'all' ? 1 : Math.max(1, Math.ceil(sorted.length / pageSize));

  const displayedUnits = useMemo(() => {
    if (pageSize === 'all') return sorted;
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, pageSize, currentPage]);

  const handleRowClickHighlight = useCallback((unitId, e) => {
    if (!e || !e.target) return;
    if (e.target.closest('button, select, input, a, textarea, .modal-overlay, [data-interactive], .interactive-cell')) return;
    setActiveRowId(prev => (prev === unitId || String(prev) === String(unitId)) ? null : unitId);
  }, []);

  // Stable identity (useStableCallback): TableRow's memo comparator ignores callback props, so a row
  // that doesn't re-render after a sort/filter would otherwise keep a handler whose closure still
  // has the old displayedUnits, and Shift/drag selection would pick rows by their old positions.
  const handleRowMouseDown = useStableCallback((unitId, idx, e) => {
    if (e.target.tagName === 'INPUT' && e.target.type !== 'checkbox') return;
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('a') || e.target.closest('.modal-overlay')) return;

    if (e.shiftKey && lastSelectedIndexRef.current !== null) {
      e.preventDefault();
      const start = Math.min(lastSelectedIndexRef.current, idx);
      const end = Math.max(lastSelectedIndexRef.current, idx);
      setSelectedUnitIds(prev => {
        const next = new Set(prev);
        for (let i = start; i <= end; i++) {
          if (displayedUnits[i]) next.add(displayedUnits[i].unit_id);
        }
        return next;
      });
      lastSelectedIndexRef.current = idx;
      return;
    }

    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setSelectedUnitIds(prev => {
        const next = new Set(prev);
        if (next.has(unitId)) next.delete(unitId);
        else next.add(unitId);
        return next;
      });
      lastSelectedIndexRef.current = idx;
      return;
    }

    isDraggingSelectRef.current = true;
    dragStartIdxRef.current = idx;
    lastSelectedIndexRef.current = idx;

    const willSelect = !isIdSelected(unitId);
    dragSelectTargetStateRef.current = willSelect;

    setSelectedUnitIds(prev => {
      const next = new Set(prev);
      if (willSelect) next.add(unitId);
      else next.delete(unitId);
      return next;
    });
  });

  const handleRowMouseEnter = useStableCallback((unitId, idx, e) => {
    if (!isDraggingSelectRef.current || dragStartIdxRef.current === null) return;

    const start = Math.min(dragStartIdxRef.current, idx);
    const end = Math.max(dragStartIdxRef.current, idx);
    const targetState = dragSelectTargetStateRef.current;

    setSelectedUnitIds(prev => {
      const next = new Set(prev);
      for (let i = start; i <= end; i++) {
        if (displayedUnits[i]) {
          if (targetState) next.add(displayedUnits[i].unit_id);
          else next.delete(displayedUnits[i].unit_id);
        }
      }
      return next;
    });
  });

  const handleToggleSelectAll = useCallback(() => {
    const displayedIds = displayedUnits.map(u => u.unit_id);
    const allSelected = displayedIds.length > 0 && displayedIds.every(id => isIdSelected(id));

    setSelectedUnitIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        displayedIds.forEach(id => {
          next.delete(id);
          next.delete(String(id));
          if (!isNaN(id)) next.delete(Number(id));
        });
      } else {
        displayedIds.forEach(id => next.add(id));
      }
      return next;
    });
  }, [displayedUnits, isIdSelected]);

  const handleBatchPoUpload = useCallback(async (poNumber, file) => {
    const isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
    if (!isPdf) {
      addToast('Only PDF files are allowed for PO document upload.', 'warning');
      return;
    }

    setIsUploadingPo(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('po_number', poNumber);
      formData.append('unit_ids', JSON.stringify(Array.from(selectedUnitIds)));

      const res = await apiFetch(`/api/units/batch-po`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload PO');
      }

      setPoSuccessMsg(`✓ PO #${data.po_number} attached to ${selectedUnitIds.size} serial numbers!`);
      addToast(`PO #${data.po_number} attached to ${selectedUnitIds.size} serial numbers!`, 'success');
      setTimeout(() => setPoSuccessMsg(''), 4500);

      setExternalPoNumber('');
      setSelectedUnitIds(new Set());
      try {
        localStorage.removeItem('erp_all_selectedUnitIds');
        localStorage.removeItem('erp_all_poNumber');
      } catch (e) { }
      await fetchUnits(true);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to upload PO.', 'error');
    } finally {
      setIsUploadingPo(false);
    }
  }, [selectedUnitIds, token, addToast, fetchUnits]);

  const handleSingleUnitPoClick = useCallback((unit) => {
    if (!canUploadPo) {
      addToast("Only Sales, Admin, and Manager roles can upload PO documents.", 'warning');
      return;
    }
    setSelectedUnitIds(new Set([unit.unit_id]));
    setExternalPoNumber(unit.po_number || '');
  }, [canUploadPo, addToast]);

  const handleDeleteUnitPoDoc = useCallback((unit) => {
    if (!canUploadPo) {
      addToast("Only Sales, Admin, and Manager roles can remove PO documents.", 'warning');
      return;
    }
    const serial = unit.short_serial || unit.unit_serial || unit.unit_id;
    setConfirmDialog({
      isOpen: true,
      title: 'Remove PO Document',
      message: `Are you sure you want to remove the attached PO PDF for serial ${serial}? This will return the panel to Sales.`,
      variant: 'danger',
      confirmText: 'Remove Document',
      onConfirm: async () => {
        const uId = unit.id || unit.unit_id;
        try {
          const res = await apiFetch(`/api/units/${uId}/po-document`, {
            method: 'DELETE'
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to remove PO document');
          }

          setPoSuccessMsg(`✓ PO PDF removed for serial ${serial}`);
          addToast(`PO PDF removed for serial ${serial}`, 'success');
          setTimeout(() => setPoSuccessMsg(''), 4000);
          await fetchUnits(true);
        } catch (err) {
          console.error('Error removing PO PDF:', err);
          addToast(err.message || 'Failed to remove PO PDF document.', 'error');
        }
      }
    });
  }, [canUploadPo, token, fetchUnits, addToast]);

  const handleBatchTrayStatus = useCallback(async (newStatus, explicitUnits = null) => {
    const targetUnits = explicitUnits || units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
    if (targetUnits.length === 0) {
      if (addToast) addToast('Please select serial numbers to update Tray Status.', 'warning');
      return;
    }

    const startedStatuses = ['In Process', 'Partial Ready', 'Full Ready'];
    const issuedStatuses = ['Partial Issued', 'All Issued'];

    // Constraint check: cannot issue tray unless started
    let validUnits = targetUnits;
    if (issuedStatuses.includes(newStatus)) {
      const unstarted = targetUnits.filter(u => {
        const prevStatus = u.tray_status || u.custom_fields?.tray_status || 'Not Started';
        const hasStartDate = !!(u.tray_start_date || u.custom_fields?.tray_start_date);
        const wasStarted = ['In Process', 'Partial Ready', 'Full Ready', 'Partial Issued', 'All Issued'].includes(prevStatus);
        return !hasStartDate && !wasStarted;
      });

      if (unstarted.length === targetUnits.length) {
        if (addToast) addToast('Tray must be started (In Process / Ready) before an issue date can be assigned.', 'warning');
        return;
      }

      if (unstarted.length > 0) {
        if (addToast) addToast(`Skipping ${unstarted.length} panel(s) because tray must be started before being issued.`, 'warning');
        const unstartedIds = new Set(unstarted.map(u => String(u.unit_id || u.id)));
        validUnits = targetUnits.filter(u => !unstartedIds.has(String(u.unit_id || u.id)));
      }
    }

    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayDateStr = `${y}-${m}-${d}`;

    const updatesByUnitId = {};

    validUnits.forEach(u => {
      const uId = String(u.unit_id || u.id);
      const prevStatus = u.tray_status || u.custom_fields?.tray_status || 'Not Started';
      const cf = { ...(u.custom_fields || {}), tray_status: newStatus };
      const extra = {};

      if ((prevStatus === 'Not Started' || !u.tray_start_date) && startedStatuses.includes(newStatus)) {
        extra.tray_start_date = todayDateStr;
        cf.tray_start_date = todayDateStr;
      }
      if (issuedStatuses.includes(newStatus)) {
        extra.issued_date = todayDateStr;
        cf.issued_date = todayDateStr;
      } else {
        extra.issued_date = null;
        cf.issued_date = null;
      }

      updatesByUnitId[uId] = {
        tray_status: newStatus,
        ...extra,
        custom_fields: cf
      };
    });

    // 1. Optimistic UI update immediately (0ms)
    setUnits(prevUnits => prevUnits.map(u => {
      const uId = String(u.unit_id || u.id);
      if (updatesByUnitId[uId]) {
        return { ...u, ...updatesByUnitId[uId] };
      }
      return u;
    }));

    // 2. Persist each unit to backend in parallel
    try {
      const promises = validUnits.map(u => {
        const targetId = u.unit_id || u.id;
        const uId = String(targetId);
        const payload = updatesByUnitId[uId];
        return apiFetch(`/api/units/${targetId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      });

      await Promise.allSettled(promises);
      if (addToast) addToast(`Updated Tray Status to "${newStatus}" for ${validUnits.length} panel(s).`, 'success');
    } catch (err) {
      console.error('Failed to batch update tray status:', err);
      if (addToast) addToast('Error saving some tray status updates.', 'error');
    }
  }, [units, isIdSelected, token, addToast]);

  const handleBatchProductionDate = useCallback(async (colKey, dateValue) => {
    const targetUnits = units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
    if (targetUnits.length === 0) {
      if (addToast) addToast('Please select serial numbers to update date.', 'warning');
      return;
    }

    const finalVal = dateValue || null;
    const targetIds = targetUnits.map(u => u.unit_id || u.id);

    setUnits(prev => prev.map(u => {
      const uId = u.unit_id || u.id;
      if (targetIds.includes(uId)) {
        return { ...u, [colKey]: finalVal };
      }
      return u;
    }));

    try {
      const promises = targetIds.map(uId => {
        return apiFetch(`/api/units/${uId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ [colKey]: finalVal })
        });
      });

      await Promise.allSettled(promises);
      const colLabel = allColumns.find(c => c.key === colKey)?.label || colKey.replace(/_/g, ' ');
      if (addToast) {
        addToast(`Updated ${colLabel} for ${targetIds.length} serial${targetIds.length > 1 ? 's' : ''}.`, 'success');
      }
      fetchUnits(true);
    } catch (err) {
      console.error(`Failed to batch update ${colKey}:`, err);
      if (addToast) addToast(`Failed to update some serials: ${err.message}`, 'error');
      fetchUnits(true);
    }
  }, [units, isIdSelected, token, addToast, fetchUnits, allColumns]);

  const handleBatchQcStatus = useCallback(async (newStatus) => {
    const targetUnits = units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
    if (targetUnits.length === 0) {
      if (addToast) addToast('Please select serial numbers to update QC status.', 'warning');
      return;
    }

    const finalVal = newStatus || null;
    const targetIds = targetUnits.map(u => u.unit_id || u.id);

    setUnits(prev => prev.map(u => {
      const uId = u.unit_id || u.id;
      if (targetIds.includes(uId)) {
        return { ...u, qc_status: finalVal };
      }
      return u;
    }));

    try {
      const promises = targetIds.map(uId => {
        return apiFetch(`/api/units/${uId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ qc_status: finalVal })
        });
      });

      await Promise.allSettled(promises);
      if (addToast) {
        addToast(`Updated QC Status to "${finalVal}" for ${targetIds.length} serial${targetIds.length > 1 ? 's' : ''}.`, 'success');
      }
      fetchUnits(true);
    } catch (err) {
      console.error('Failed to batch update qc_status:', err);
      if (addToast) addToast(`Failed to update some serials: ${err.message}`, 'error');
      fetchUnits(true);
    }
  }, [units, isIdSelected, token, addToast, fetchUnits]);

  const handleDeletePanelSize = useCallback((unit) => {
    if (!canEditPanelSize) {
      addToast("Only Design, Admin, and Manager roles can modify panel sizes.", 'warning');
      return;
    }
    const serial = unit.short_serial || unit.unit_serial || unit.unit_id;
    const currentSize = unit.panel_type_size || 'assigned size';
    setConfirmDialog({
      isOpen: true,
      title: 'Remove Panel Size',
      message: `Are you sure you want to remove the panel size ("${currentSize}"), code, and IP rating for serial ${serial}?`,
      variant: 'danger',
      confirmText: 'Remove Panel Size',
      onConfirm: async () => {
        const uId = unit.id || unit.unit_id;
        try {
          // Optimistic local update so UI reflects immediately
          setUnits(prev => prev.map(u => {
            const currentId = u.unit_id || u.id;
            if (currentId === uId) {
              return {
                ...u,
                panel_type_size: null,
                panel_code: '',
                panel_ip_rating: '',
                panel_comments: ''
              };
            }
            return u;
          }));

          const res = await apiFetch(`/api/units/${uId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ panel_type_size: null })
          });

          if (!res.ok) {
            throw new Error('Failed to remove panel size on server');
          }

          addToast(`Panel size cleared for serial ${serial}`, 'success');
          await fetchUnits(true);
        } catch (err) {
          console.error('Error removing panel size:', err);
          addToast(err.message || 'Failed to remove panel size.', 'error');
          await fetchUnits(true);
        }
      }
    });
  }, [canEditPanelSize, token, fetchUnits, addToast]);

  const SortIcon = ({ col }) => {
    if (sortKey !== col) return <ArrowUpDown size={11} className="sort-icon-idle" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="sort-icon-active" />
      : <ChevronDown size={12} className="sort-icon-active" />;
  };

  // Active columns filtered by department visibility
  const activeCols = useMemo(() => {
    return columnKeys
      .filter(key => isColVisible(key))
      .map(key => allColumns.find(c => c.key === key))
      .filter(Boolean);
  }, [columnKeys, allColumns, isColVisible, userHiddenColumns]);

  // Partition active columns into Pinned (frozen on left) and Unpinned
  const pinnedCols = useMemo(() => activeCols.filter(c => pinnedKeys.includes(c.key)), [activeCols, pinnedKeys]);
  const unpinnedCols = useMemo(() => activeCols.filter(c => !pinnedKeys.includes(c.key)), [activeCols, pinnedKeys]);
  const visibleCols = useMemo(() => [...pinnedCols, ...unpinnedCols], [pinnedCols, unpinnedCols]);

  // Calculate cumulative left offsets for pinned columns (offset by selection column width in Sales, Purchase, Stores, Production, QC, Dispatch, Accounts views)
  const showRowSelection = isSalesView || isPurchaseView || isStoresView || isProductionView || isQcView || isDispatchView || isAccountsView;
  const INDEX_COL_WIDTH = showRowSelection ? 68 : 58;
  const stickyLeftMap = useMemo(() => {
    const map = {};
    let currentLeft = INDEX_COL_WIDTH;
    pinnedCols.forEach((c) => {
      const defaultWidth = DEFAULT_COL_WIDTHS[c.key] || (isDateTimeType(c.fieldType) ? 175 : 120);
      const width = columnWidths[c.key] || defaultWidth;
      map[c.key] = currentLeft;
      currentLeft += width;
    });
    return map;
  }, [pinnedCols, columnWidths, INDEX_COL_WIDTH]);

  const isPinned = (colKey) => pinnedKeys.includes(colKey);
  const isLastPinned = (colKey) => pinnedCols.length > 0 && pinnedCols[pinnedCols.length - 1].key === colKey;

  const getColStyle = (colKey, isHeader = false) => {
    const colDef = allColumns.find(c => c.key === colKey);
    const defaultWidth = DEFAULT_COL_WIDTHS[colKey] || (isDateTimeType(colDef?.fieldType) ? 175 : 120);
    const width = columnWidths[colKey] || defaultWidth;
    const pinned = isPinned(colKey);
    const lastPin = isLastPinned(colKey);

    return {
      width,
      minWidth: width,
      maxWidth: width,
      boxSizing: 'border-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: isHeader ? 'normal' : 'nowrap',
      verticalAlign: 'middle',
      position: pinned ? 'sticky' : 'relative',
      left: pinned ? `${stickyLeftMap[colKey]}px` : undefined,
      zIndex: pinned ? (isHeader ? 24 : 3) : (isHeader ? 20 : 1),
      background: isHeader ? 'var(--table-header-bg, var(--bg2))' : undefined,
      willChange: pinned ? 'transform' : undefined,
      borderRight: lastPin ? '2px solid var(--blue, #3b82f6)' : '1px solid var(--border-grid, var(--border))',
      borderBottom: isHeader ? '2px solid var(--border-grid, var(--border))' : '1px solid var(--border-grid, var(--border))'
    };
  };



  const selectedUnitSerials = useMemo(() => {
    if (selectedUnitIds.size === 0) return [];
    return units
      .filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id))
      .map(u => u.short_serial || u.unit_serial || u.serial_number || u.unit_id)
      .filter(Boolean);
  }, [units, selectedUnitIds, isIdSelected]);

  const selectedUnitsList = useMemo(() => {
    if (selectedUnitIds.size === 0) return [];
    return units.filter(u => isIdSelected(u.unit_id) || isIdSelected(u.id));
  }, [units, selectedUnitIds, isIdSelected]);

  const handleAutoFitColumn = useCallback((colKey, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const finalWidth = calculateOptimalColumnWidth(colKey, displayedUnits, allColumns, panelSizeMap, getUnitStatus);
    setColumnWidths(prev => {
      const updated = { ...prev, [colKey]: finalWidth };
      try {
        localStorage.setItem('erp_all_colWidths_v16', JSON.stringify(updated));
      } catch (err) { }
      return updated;
    });
  }, [displayedUnits, allColumns, panelSizeMap, getUnitStatus]);

  if (isLoading) return (
    <div style={{ padding: 60, textAlign: 'center', color: 'var(--text3)' }}>
      <div style={{ fontSize: 13 }}>Loading units...</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, minHeight: 0, height: '100%', overflow: 'hidden', minWidth: 0, maxWidth: '100%' }}>

      {/* ── Tabs Bar (All Orders, Hold, Cancelled) ─────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)',
        padding: '0 16px',
        gap: 6,
        flexShrink: 0,
        overflowX: 'auto',
        minWidth: 0
      }}>
        {/* All Orders Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'all' ? '2px solid var(--blue)' : '2px solid transparent',
            color: activeTab === 'all' ? 'var(--text)' : 'var(--text3)',
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: activeTab === 'all' ? 600 : 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: '-1px',
            transition: 'all 0.15s'
          }}
        >
          <span>All Orders</span>
          <span style={{
            background: activeTab === 'all' ? 'var(--blue-dim)' : 'var(--bg3)',
            color: activeTab === 'all' ? 'var(--blue)' : 'var(--text3)',
            borderRadius: 10,
            padding: '1px 7px',
            fontSize: 11,
            fontWeight: 700
          }}>
            {units.length}
          </span>
        </button>

        {/* Hold Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('hold')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'hold' ? '2px solid var(--orange)' : '2px solid transparent',
            color: activeTab === 'hold' ? 'var(--orange)' : 'var(--text3)',
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: activeTab === 'hold' ? 600 : 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: '-1px',
            transition: 'all 0.15s'
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--orange)', display: 'inline-block'
          }} />
          <span>Hold</span>
          <span style={{
            background: activeTab === 'hold' ? 'var(--orange-dim)' : 'var(--bg3)',
            color: activeTab === 'hold' ? 'var(--orange)' : 'var(--text3)',
            borderRadius: 10,
            padding: '1px 7px',
            fontSize: 11,
            fontWeight: 700
          }}>
            {holdCount}
          </span>
        </button>

        {/* Cancelled Tab */}
        <button
          type="button"
          onClick={() => setActiveTab('cancelled')}
          style={{
            background: 'transparent',
            border: 'none',
            borderBottom: activeTab === 'cancelled' ? '2px solid var(--red)' : '2px solid transparent',
            color: activeTab === 'cancelled' ? 'var(--red)' : 'var(--text3)',
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: activeTab === 'cancelled' ? 600 : 500,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: '-1px',
            transition: 'all 0.15s'
          }}
        >
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: 'var(--red)', display: 'inline-block'
          }} />
          <span>Cancelled</span>
          <span style={{
            background: activeTab === 'cancelled' ? 'var(--red-dim)' : 'var(--bg3)',
            color: activeTab === 'cancelled' ? 'var(--red)' : 'var(--text3)',
            borderRadius: 10,
            padding: '1px 7px',
            fontSize: 11,
            fontWeight: 700
          }}>
            {cancelledCount}
          </span>
        </button>

        {/* ── Right side: Purchase Department Action Buttons ── */}
        {isPurchaseView && (
          <div style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '4px 0'
          }}>
            {/* Order Recieved Button */}
            <button
              type="button"
              onClick={() => {
                setIsPurchaseOrderReceivedOpen(true);
              }}
              title="Purchase: Order Recieved"
              style={{
                height: 34,
                padding: '0 15px',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.01em',
                borderRadius: 7,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(16, 185, 129, 0.1)',
                color: 'var(--green, #10b981)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.18)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.6)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)';
                e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.35)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <PackageCheck size={15} style={{ flexShrink: 0 }} />
              <span>Order Recieved</span>
            </button>

            {/* New Order Button */}
            <button
              type="button"
              onClick={() => {
                setIsPurchaseNewOrderOpen(true);
              }}
              title="Purchase: New Order"
              style={{
                height: 34,
                padding: '0 15px',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.01em',
                borderRadius: 7,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'rgba(56, 189, 248, 0.12)',
                color: 'var(--blue, #38bdf8)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.22)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.65)';
                e.currentTarget.style.boxShadow = '0 0 10px rgba(56, 189, 248, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(56, 189, 248, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Plus size={15} style={{ flexShrink: 0 }} />
              <span>New Order</span>
            </button>
          </div>
        )}

        {/* ── Right side: PO Controls (Enter PO No. + Upload PO button) — Sales Only ── */}
        {isSalesView && (
          <PoUploadBar
            selectedCount={selectedUnitIds.size}
            selectedUnitSerials={selectedUnitSerials}
            canUploadPo={canUploadPo}
            isUploadingPo={isUploadingPo}
            poSuccessMsg={poSuccessMsg}
            onClearSelection={() => setSelectedUnitIds(new Set())}
            onUploadPo={handleBatchPoUpload}
            externalPoNumber={externalPoNumber}
            setExternalPoNumber={setExternalPoNumber}
            addToast={addToast}
          />
        )}

        {/* ── Right side: Stores Department Batch Tray Status Bar ── */}
        {isStoresView && selectedUnitIds.size > 0 && (
          <StoresBatchTrayStatusBar
            selectedCount={selectedUnitIds.size}
            onClearSelection={() => setSelectedUnitIds(new Set())}
            onBatchTrayStatus={handleBatchTrayStatus}
          />
        )}

        {/* ── Right side: Production Department Batch Bar ── */}
        {isProductionView && selectedUnitIds.size > 0 && (
          <ProductionBatchBar
            selectedCount={selectedUnitIds.size}
            onClearSelection={() => setSelectedUnitIds(new Set())}
            onBatchSetDate={handleBatchProductionDate}
          />
        )}

        {/* ── Right side: QC Department Batch Bar ── */}
        {isQcView && selectedUnitIds.size > 0 && (
          <QcBatchBar
            selectedCount={selectedUnitIds.size}
            onClearSelection={() => setSelectedUnitIds(new Set())}
            onBatchSetDate={handleBatchProductionDate}
            onBatchSetStatus={handleBatchQcStatus}
          />
        )}

      </div>

      {/* ── Modern Enterprise Toolbar ─────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 12, padding: '8px 16px',
        background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap', flexShrink: 0
      }}>
        {/* Left: Search input */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 8, padding: '0 12px', height: 36,
          flex: '1 1 240px', maxWidth: 360, minWidth: 200,
          transition: 'all 0.15s ease'
        }}>
          <Search size={14} style={{ color: 'var(--text3)', flexShrink: 0 }} />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search serial no., PO, client, desc..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: 'none', border: 'none', outline: 'none',
              color: 'var(--text)', fontSize: 13, width: '100%',
              fontFamily: 'inherit'
            }}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', display: 'flex', padding: 0 }}
              title="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Center/Right Controls Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              height: 36,
              background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
              color: 'var(--text)', fontSize: 12.5, fontWeight: 500, padding: '0 12px',
              cursor: 'pointer', outline: 'none', fontFamily: 'inherit'
            }}
          >
            <option value="all">All Status</option>
            <option value="incomplete">Not Started + In Process</option>
            <option value="pending">Not Started</option>
            <option value="inprogress">In Process</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
            <option value="hold">On Hold</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            style={{
              height: 36,
              background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8,
              color: 'var(--text)', fontSize: 12.5, fontWeight: 500, padding: '0 12px',
              cursor: 'pointer', outline: 'none', fontFamily: 'inherit'
            }}
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Column Visibility Popover Button */}
          <div style={{ position: 'relative' }} ref={columnMenuRef}>
            <button
              type="button"
              onClick={() => setIsColumnMenuOpen(prev => !prev)}
              title="Toggle column visibility"
              style={{
                height: 36,
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: isColumnMenuOpen ? 'var(--bg4, #e2e8f0)' : 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 8, padding: '0 12px', fontSize: 12.5, fontWeight: 500,
                color: 'var(--text)', cursor: 'pointer', outline: 'none'
              }}
            >
              <Columns3 size={14} style={{ color: 'var(--text3)' }} />
              <span>Columns</span>
              <span style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 6, padding: '1px 5px', fontSize: 11, fontWeight: 600,
                color: 'var(--text2)'
              }}>
                {visibleCols.length}
              </span>
            </button>

            {isColumnMenuOpen && (
              <div style={{
                position: 'absolute', top: 42, right: 0, width: 280,
                background: 'var(--bg2)', border: '1px solid var(--border2, #cbd5e1)',
                borderRadius: 10, boxShadow: '0 12px 28px rgba(0, 0, 0, 0.18)',
                padding: '10px', zIndex: 120, display: 'flex', flexDirection: 'column', gap: 8
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>Column Visibility</span>
                  <button
                    type="button"
                    onClick={showAllColumns}
                    style={{
                      background: 'none', border: 'none', color: 'var(--accent, #f97316)',
                      fontSize: 11.5, fontWeight: 600, cursor: 'pointer', padding: 0
                    }}
                  >
                    Show All
                  </button>
                </div>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'var(--bg3)', border: '1px solid var(--border)',
                  borderRadius: 6, padding: '4px 8px'
                }}>
                  <Search size={12} style={{ color: 'var(--text3)' }} />
                  <input
                    type="text"
                    placeholder="Search columns..."
                    value={colSearchQuery}
                    onChange={e => setColSearchQuery(e.target.value)}
                    style={{
                      background: 'none', border: 'none', outline: 'none',
                      color: 'var(--text)', fontSize: 12, width: '100%'
                    }}
                  />
                  {colSearchQuery && (
                    <button
                      onClick={() => setColSearchQuery('')}
                      style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 0 }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {allColumns
                    .filter(c => !colSearchQuery || c.label.toLowerCase().includes(colSearchQuery.toLowerCase()))
                    .map(c => {
                      const isVisible = isColVisible(c.key);
                      const isPinned = pinnedKeys.includes(c.key);
                      return (
                        <label
                          key={c.key}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px',
                            borderRadius: 6, cursor: 'pointer', fontSize: 12, color: 'var(--text)',
                            background: isVisible ? 'transparent' : 'rgba(148, 163, 184, 0.06)'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isVisible}
                            onChange={() => toggleColumnVisibility(c.key)}
                            style={{ accentColor: 'var(--accent, #f97316)', cursor: 'pointer' }}
                          />
                          <span style={{ flex: 1, opacity: isVisible ? 1 : 0.6 }}>{c.label}</span>
                          {isPinned && (
                            <span style={{ fontSize: 10, color: 'var(--blue, #38bdf8)', fontWeight: 600 }}>pinned</span>
                          )}
                        </label>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Reset Layout button */}
          <button
            onClick={handleResetLayout}
            title="Reset column positions, sizes, and freeze states to default"
            style={{
              height: 36,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--bg3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '0 12px', fontSize: 12, fontWeight: 500,
              color: 'var(--text2)', cursor: 'pointer', outline: 'none'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset Layout</span>
          </button>
        </div>

        {statCardFilter && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: statCardFilter === 'priority' ? 'var(--orange-dim)' :
              statCardFilter === 'inprogress' ? 'var(--blue-dim)' :
                statCardFilter === 'blocked' ? 'var(--red-dim)' :
                  statCardFilter === 'due' ? 'var(--purple-dim)' : 'var(--orange-dim)',
            color: statCardFilter === 'priority' ? 'var(--orange)' :
              statCardFilter === 'inprogress' ? 'var(--blue)' :
                statCardFilter === 'blocked' ? 'var(--red)' :
                  statCardFilter === 'due' ? 'var(--purple)' : 'var(--orange)',
            border: `1px solid ${statCardFilter === 'priority' ? 'rgba(249, 115, 22, 0.35)' :
              statCardFilter === 'inprogress' ? 'rgba(56, 189, 248, 0.35)' :
                statCardFilter === 'blocked' ? 'rgba(248, 113, 113, 0.35)' :
                  statCardFilter === 'due' ? 'rgba(168, 85, 247, 0.35)' : 'rgba(249, 115, 22, 0.35)'
              }`,
            borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600,
            whiteSpace: 'nowrap'
          }}>
            <span>
              Card Filter: {
                statCardFilter === 'priority' ? 'Urgent / High' :
                  statCardFilter === 'inprogress' ? 'In Progress' :
                    statCardFilter === 'blocked' ? 'Blocked' :
                      statCardFilter === 'due' ? 'Due This Week' : 'All Active'
              }
            </span>
            <button
              onClick={onClearStatFilter}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, marginLeft: 2, display: 'flex', alignItems: 'center',
                color: 'inherit'
              }}
              title="Clear card filter"
            >
              <X size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── Table ───────────────────────────────────────────────── */}
      {/* ── Table Area with Custom Scrollbars ─────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, position: 'relative', minWidth: 0, maxWidth: '100%' }}>
        <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative', minWidth: 0, maxWidth: '100%' }}>
      <div
        ref={tableContainerRef}
        className="table-responsive-scroll"
        style={{ overflowX: 'auto', overflowY: 'auto', flex: 1, minHeight: 0, minWidth: 0, maxWidth: '100%' }}
      >
        <table className="erp-master-table">
          <thead>
            <tr>
              {/* Row Index / Selection Header — Spreadsheet Values Column */}
              <th
                className="erp-th erp-th-idx"
                style={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 26,
                  width: INDEX_COL_WIDTH,
                  minWidth: INDEX_COL_WIDTH,
                  maxWidth: INDEX_COL_WIDTH,
                  padding: '6px 4px',
                  textAlign: 'center',
                  verticalAlign: 'middle',
                  userSelect: 'none'
                }}
              >
                {showRowSelection ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <input
                      type="checkbox"
                      checked={displayedUnits.length > 0 && displayedUnits.every(u => isIdSelected(u.unit_id))}
                      ref={el => {
                        if (el) {
                          const hasSome = displayedUnits.some(u => isIdSelected(u.unit_id));
                          const hasAll = displayedUnits.length > 0 && displayedUnits.every(u => isIdSelected(u.unit_id));
                          el.indeterminate = hasSome && !hasAll;
                        }
                      }}
                      onChange={handleToggleSelectAll}
                      style={{ cursor: 'pointer', accentColor: 'var(--blue)', width: 14, height: 14 }}
                      title="Select / Deselect visible serial numbers"
                    />
                    <span style={{ fontSize: 11, fontWeight: 700 }}>Sr.</span>
                  </div>
                ) : (
                  <span style={{ fontSize: 11.5, fontWeight: 700 }}>Sr.</span>
                )}
              </th>
              {visibleCols.map(({ key: colKey, label, align }) => {
                const isPinned = pinnedKeys.includes(colKey);
                const isOver = dragOverColKey === colKey;
                const visibleKeys = visibleCols.map(c => c.key);
                const draggedIdx = visibleKeys.indexOf(draggedColKey);
                const targetIdx = visibleKeys.indexOf(colKey);

                let dragOverClass = '';
                if (isOver && draggedIdx !== -1 && draggedIdx !== targetIdx) {
                  dragOverClass = draggedIdx < targetIdx ? ' drag-over-right' : ' drag-over-left';
                }

                const baseStyle = getColStyle(colKey, true);
                const isDragging = draggedColKey === colKey;
                const isSorted = sortKey === colKey;
                const lastPin = isLastPinned(colKey);
                const thClass = `erp-th${isDragging ? ' dragging' : ''}${dragOverClass}${isSorted ? ' is-sorted' : ''}${isPinned ? ' is-pinned' : ''}${lastPin ? ' last-pinned' : ''}`.trim();

                return (
                  <th
                    key={colKey}
                    data-col-key={colKey}
                    className={thClass}
                    draggable
                    onDragStart={(e) => handleHeaderDragStart(e, colKey)}
                    onDragOver={(e) => handleHeaderDragOver(e, colKey)}
                    onDragLeave={(e) => handleHeaderDragLeave(e, colKey)}
                    onDragEnd={handleHeaderDragEnd}
                    onDrop={(e) => handleHeaderDrop(e, colKey)}
                    style={{
                      ...baseStyle,
                      cursor: 'grab',
                      textAlign: align,
                      verticalAlign: 'middle'
                    }}
                  >
                    <div className="erp-th-content" style={{ justifyContent: align === 'center' ? 'center' : 'space-between' }}>
                      <div
                        onClick={(e) => {
                          if (selectedUnitIds.size > 0 && colKey.startsWith('purchase_cat_')) {
                            e.stopPropagation();
                            handleTogglePurchaseCatNA(null, colKey);
                          } else {
                            handleSort(colKey);
                          }
                        }}
                        className="erp-th-label-zone"
                        style={{
                          cursor: 'pointer'
                        }}
                        title={
                          (selectedUnitIds.size > 0 && colKey.startsWith('purchase_cat_'))
                            ? `Click to toggle N/A for all ${selectedUnitIds.size} selected serial numbers`
                            : label
                        }
                      >
                        <GripVertical size={12} className="erp-th-drag-handle" />
                        <span className="erp-th-title" title={label}>{label}</span>

                        <div
                          className="erp-th-sort-icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSort(colKey);
                          }}
                        >
                          <SortIcon col={colKey} />
                        </div>
                      </div>

                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0 }}>
                        {colKey.startsWith('purchase_cat_') && selectedUnitsList.length > 0 && (() => {
                          const isCatAllNA = selectedUnitsList.every(u => u.custom_fields?.[colKey] === 'NA');
                          const isCatSomeNA = !isCatAllNA && selectedUnitsList.some(u => u.custom_fields?.[colKey] === 'NA');

                          return (
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isCatAllNA}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTogglePurchaseCatNA(null, colKey);
                              }}
                              title={
                                isCatAllNA
                                  ? `All ${selectedUnitsList.length} selected marked N/A for ${label}. Click to revert.`
                                  : `Click to mark ${label} as N/A for ${selectedUnitsList.length} selected serial${selectedUnitsList.length > 1 ? 's' : ''}`
                              }
                              style={{
                                position: 'relative',
                                width: 26,
                                height: 14,
                                borderRadius: 7,
                                background: isCatAllNA
                                  ? 'var(--blue, #3b82f6)'
                                  : (isCatSomeNA ? 'rgba(59, 130, 246, 0.25)' : 'rgba(148, 163, 184, 0.2)'),
                                border: isCatAllNA
                                  ? '1px solid var(--blue, #3b82f6)'
                                  : (isCatSomeNA ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(148, 163, 184, 0.35)'),
                                cursor: 'pointer',
                                padding: 0,
                                outline: 'none',
                                flexShrink: 0,
                                display: 'inline-flex',
                                alignItems: 'center',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isCatAllNA ? '0 0 6px rgba(59, 130, 246, 0.5)' : 'none'
                              }}
                            >
                              <span
                                style={{
                                  position: 'absolute',
                                  top: 1,
                                  left: 1,
                                  width: 10,
                                  height: 10,
                                  borderRadius: '50%',
                                  background: isCatAllNA
                                    ? '#ffffff'
                                    : (isCatSomeNA ? 'var(--blue, #3b82f6)' : '#94a3b8'),
                                  transform: isCatAllNA
                                    ? 'translateX(12px)'
                                    : (isCatSomeNA ? 'translateX(6px)' : 'translateX(0px)'),
                                  transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.35)'
                                }}
                              />
                            </button>
                          );
                        })()}

                        <button
                          type="button"
                          onClick={(e) => togglePin(colKey, e)}
                          title={isPinned ? "Unfreeze Column" : "Freeze Column to left"}
                          className={`erp-th-pin-btn${isPinned ? ' is-pinned' : ''}`}
                        >
                          <Pin size={11} style={{ transform: isPinned ? 'rotate(-45deg)' : 'none', transition: 'transform 0.15s' }} />
                        </button>
                      </div>
                    </div>

                    {/* Column Resize Handle */}
                    <div
                      onMouseDown={(e) => handleResizeStart(e, colKey)}
                      onDoubleClick={(e) => handleAutoFitColumn(colKey, e)}
                      onClick={(e) => e.stopPropagation()}
                      title="Drag to resize. Double-click to auto-fit to content."
                      className="erp-resize-handle"
                    />
                  </th>
                );
              })}
              <th className="erp-th erp-th-filler" />
            </tr>
          </thead>
          <tbody>
            {displayedUnits.map((unit, idx) => (
              <TableRow
                key={unit.unit_id}
                unit={unit}
                idx={idx}
                currentFilter={currentFilter}
                showSelection={showRowSelection}
                isActiveRow={activeRowId === unit.unit_id || String(activeRowId) === String(unit.unit_id)}
                onRowClickHighlight={handleRowClickHighlight}
                isSelected={isIdSelected(unit.unit_id)}
                status={getUnitStatus(unit)}
                visibleCols={visibleCols}
                columnWidths={columnWidths}
                pinnedKeys={pinnedKeys}
                stickyLeftMap={stickyLeftMap}
                canEdit={canEdit}
                canEditPanelSize={canEditPanelSize}
                canUploadPo={canUploadPo}
                canConfirmDesign={canConfirmDesign}
                onConfirmDesignClassification={handleConfirmDesignClassification}
                onUnconfirmDesignClassification={handleUnconfirmDesignClassification}
                onRequestUnconfirmDesign={handleRequestUnconfirmDesign}
                panelSizeMasters={panelSizeMasters}
                panelSizeMap={panelSizeMap}
                customColumnDefs={customColumnDefs}
                editingCell={editingCell && editingCell.unitId === (unit.unit_id || unit.id) ? editingCell : null}
                setEditingCell={setEditingCell}
                onRowMouseDown={handleRowMouseDown}
                onRowMouseEnter={handleRowMouseEnter}
                onRowClick={handleRowClick}
                onSaveInlineCell={handleSaveInlineCell}
                onSingleUnitPoClick={handleSingleUnitPoClick}
                onDeleteUnitPoDoc={handleDeleteUnitPoDoc}
                onPartNumberClick={handlePartNumberClick}
                setPoPdfViewer={setPoPdfViewer}
                onEditRefTag={setEditingRefTagUnit}
                onOpenOrderDocs={setOrderDocsModalData}
                onDeletePanelSize={handleDeletePanelSize}
                purchaseOrdersBySerialAndCat={purchaseOrdersBySerialAndCat}
                canEditPurchaseNA={canEditPurchaseNA}
                onTogglePurchaseCatNA={handleTogglePurchaseCatNA}
                wiremenList={wiremenList}
              />
            ))}

            {sorted.length === 0 && (
              <tr>
                <td colSpan={(visibleCols.length || 12) + (showRowSelection ? 1 : 0) + 1} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text3)' }}>
                  <Search size={28} style={{ opacity: 0.3, marginBottom: 8, display: 'block', margin: '0 auto 8px' }} />
                  <div style={{ fontSize: 14 }}>
                    {activeTab === 'hold'
                      ? 'No orders are currently on hold'
                      : activeTab === 'cancelled'
                        ? 'No cancelled orders found'
                        : 'No units match the current filters'}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
          <TableVerticalScrollbar containerRef={tableContainerRef} />
        </div>

      {/* ── High-Precision Custom Horizontal Scrollbar (Compact Dragger & Thick Track) ── */}
      <TableHorizontalScrollbar containerRef={tableContainerRef} />
      </div>

      {/* ── Table Footer & Pagination ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        fontSize: '12px',
        color: 'var(--text2)',
        flexWrap: 'wrap',
        gap: 8,
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>
            Showing <strong>{sorted.length === 0 ? 0 : (pageSize === 'all' ? 1 : (currentPage - 1) * pageSize + 1)}</strong>–
            <strong>{pageSize === 'all' ? sorted.length : Math.min(currentPage * pageSize, sorted.length)}</strong> of <strong>{sorted.length}</strong> serials
          </span>
          {selectedUnitIds.size > 0 && (
            <span
              onClick={() => setSelectedUnitIds(new Set())}
              style={{
                color: 'var(--blue)',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm, 4px)',
                background: 'var(--blue-dim)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                fontSize: 12
              }}
              title="Click or double-press Esc to deselect all"
            >
              <span>{selectedUnitIds.size} selected</span>
              <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>✕</span>
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const val = e.target.value === 'all' ? 'all' : Number(e.target.value);
                setPageSize(val);
                setCurrentPage(1);
              }}
              style={{
                background: 'var(--bg3)',
                border: '1px solid var(--border)',
                borderRadius: 6,
                padding: '3px 8px',
                fontSize: '12px',
                color: 'var(--text)',
                cursor: 'pointer'
              }}
            >
              <option value={50}>50</option>
              <option value={100}>100 (Default)</option>
              <option value={250}>250</option>
              <option value="all">All ({sorted.length})</option>
            </select>
          </div>

          {pageSize !== 'all' && totalPages > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: currentPage <= 1 ? 'var(--text3)' : 'var(--text)',
                  cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: currentPage <= 1 ? 0.4 : 1
                }}
              >
                ‹ Prev
              </button>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                style={{
                  padding: '3px 10px',
                  borderRadius: 6,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  color: currentPage >= totalPages ? 'var(--text3)' : 'var(--text)',
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '12px',
                  opacity: currentPage >= totalPages ? 0.4 : 1
                }}
              >
                Next ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── In-App Viewer for PO Document ── */}
      {poPdfViewer && poPdfViewerUrl && (
        <DocumentPreviewModal
          doc={poPdfViewer}
          url={poPdfViewerUrl}
          onClose={() => setPoPdfViewer(null)}
          extraActions={
            canUploadPo && poPdfViewer.unit ? (
              <button
                type="button"
                className="vbtn"
                onClick={() => {
                  const u = poPdfViewer.unit;
                  setPoPdfViewer(null);
                  handleDeleteUnitPoDoc(u);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: 12,
                  padding: '6px 12px',
                  color: 'var(--red)',
                  background: 'var(--red-dim)',
                  border: '1px solid rgba(248, 113, 113, 0.35)',
                  borderRadius: 'var(--radius-sm, 4px)',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                title="Delete attached PO document"
              >
                <Trash2 size={13} color="var(--red)" />
                <span>Delete File</span>
              </button>
            ) : null
          }
        />
      )}

      {/* ── Technical Drawings & Standard Documents Modal ── */}
      {showDocsModal && selectedPartForDocs && (
        <TechnicalDocsModal
          selectedPart={selectedPartForDocs}
          onClose={() => setShowDocsModal(false)}
          canManageDocs={canManageDocs}
          userRole={userRole}
          token={token}
          getDocUrl={getDocUrl}
          onUpdatePartMasters={fetchPartMasters}
          onUpdateSelectedPart={setSelectedPartForDocs}
          onDocumentChange={() => fetchUnits(true)}
        />
      )}

      {/* ── Edit Reference & Tag Number Modal (Admin / Manager / Sales) ── */}
      {editingRefTagUnit && (
        <EditRefTagModal
          isOpen={true}
          unit={editingRefTagUnit}
          onClose={() => setEditingRefTagUnit(null)}
          onSave={async ({ reference_number, tag }) => {
            // Optimistic UI update so table view reflects changes immediately
            setUnits(prev => prev.map(u => {
              let updated = u;
              if (u.unit_id === editingRefTagUnit.unit_id || u.id === editingRefTagUnit.id) {
                updated = { ...updated, tag };
              }
              if (u.order_id === editingRefTagUnit.order_id) {
                updated = { ...updated, reference_number };
              }
              return updated;
            }));

            // Persist to backend without touching unit serial numbers
            const uId = editingRefTagUnit.id || editingRefTagUnit.unit_id;
            const res = await apiFetch(`/api/units/${uId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ reference_number, tag })
            });

            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              throw new Error(errData.error || 'Failed to save Reference & Tag');
            }

            window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { orderId: editingRefTagUnit.order_id } }));
            fetchUnits(true);
          }}
        />
      )}

      {/* ── Order Documents Modal (Quotation, Details, Approved Documents) ── */}
      {orderDocsModalData && (
        <OrderDocumentsModal
          isOpen={true}
          orderId={orderDocsModalData.orderId}
          orderNumber={orderDocsModalData.orderNumber}
          clientName={orderDocsModalData.clientName}
          projectName={orderDocsModalData.projectName}
          onClose={() => setOrderDocsModalData(null)}
          onDocumentsUpdated={() => {
            fetchUnits(true);
          }}
        />
      )}

      {/* ── Purchase New Order Modal (Buying from Vendors) ── */}
      <PurchaseNewOrderModal
        isOpen={isPurchaseNewOrderOpen}
        onClose={() => setIsPurchaseNewOrderOpen(false)}
        existingUnits={units}
        addToast={addToast}
        onOrderSaved={() => {
          fetchUnits(true);
          fetchVendorPurchaseOrders();
        }}
      />

      {/* ── Purchase Order Received Modal (Goods Receipt / Incoming from Vendors) ── */}
      <PurchaseOrderReceivedModal
        isOpen={isPurchaseOrderReceivedOpen}
        onClose={() => setIsPurchaseOrderReceivedOpen(false)}
        onStatusUpdated={() => {
          fetchUnits(true);
          fetchVendorPurchaseOrders();
        }}
      />

      {/* ── Toast Notifications & Confirmation Dialog ── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        variant={confirmDialog.variant}
        confirmText={confirmDialog.confirmText}
        cancelText={confirmDialog.cancelText}
        onConfirm={confirmDialog.onConfirm}
        onClose={() => setConfirmDialog(d => ({ ...d, isOpen: false }))}
      />
    </div>
  );
}
