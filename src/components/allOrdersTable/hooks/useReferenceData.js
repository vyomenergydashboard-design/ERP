import { useState, useMemo } from 'react';
import { apiFetch } from '../../../api/client';

/**
 * Reference data the All Orders table loads alongside the units: part-number masters, panel-size
 * masters (+ panelSizeMap), wiremen (cached in sessionStorage) and vendor purchase orders
 * (+ purchaseOrdersBySerialAndCat), with their fetch functions.
 * Moved unchanged from AllOrdersTableView (Task D step 4) and called where these hooks used to be,
 * so React sees the same hooks on every render.
 */
export default function useReferenceData() {
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

  return {
    partMasters, panelSizeMasters, wiremenList, fetchVendorPurchaseOrders,
    purchaseOrdersBySerialAndCat, fetchPartMasters, fetchPanelSizeMasters, fetchWiremenMasters,
    panelSizeMap,
  };
}
