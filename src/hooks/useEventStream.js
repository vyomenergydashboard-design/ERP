import { useEffect } from 'react';

const MIN_RETRY_MS = 1000;
const MAX_RETRY_MS = 15000;
const COALESCE_MS = 300;

/**
 * useEventStream - Real-time Server-Sent Events hook
 * Connects to /api/events using a short-lived ticket to securely listen for multi-user updates.
 * Dispatches a global 'orderUpdated' event whenever any user mutates an order, unit, or step.
 *
 * - Tickets are single-use, so every (re)connect fetches a fresh ticket. On any error the
 *   EventSource is closed (preventing the browser's built-in retry with a spent ticket) and a
 *   new connection is scheduled with exponential backoff (1s → 15s).
 * - After a successful reconnect, one `orderUpdated` with `{ type: 'RESYNC' }` (no orderId) is
 *   dispatched so views refetch anything missed while disconnected.
 * - ORDER_UPDATED bursts are coalesced over 300ms: a burst touching a single order keeps that
 *   event's detail; a burst touching several orders is dispatched with `orderId: undefined`.
 */
export function useEventStream() {
  useEffect(() => {
    let isMounted = true;
    let eventSource = null;
    let reconnectTimer = null;
    let coalesceTimer = null;
    let pending = [];
    let retryDelay = MIN_RETRY_MS;
    let hasConnectedBefore = false;
    let connectAttempt = 0;

    const flushPending = () => {
      coalesceTimer = null;
      if (!isMounted || pending.length === 0) return;
      const batch = pending;
      pending = [];
      const orderKeys = new Set(batch.map((d) => (d.orderId == null ? '' : String(d.orderId))));
      const detail = orderKeys.size === 1 && !orderKeys.has('')
        ? batch[batch.length - 1]
        : { type: 'ORDER_UPDATED', orderId: undefined, coalesced: batch.length };
      window.dispatchEvent(new CustomEvent('orderUpdated', { detail }));
    };

    const queueOrderUpdate = (data) => {
      pending.push(data);
      if (!coalesceTimer) coalesceTimer = setTimeout(flushPending, COALESCE_MS);
    };

    const closeSource = () => {
      if (eventSource) {
        eventSource.onopen = null;
        eventSource.onmessage = null;
        eventSource.onerror = null;
        eventSource.close();
        eventSource = null;
      }
    };

    const scheduleReconnect = () => {
      if (!isMounted || reconnectTimer) return;
      const delay = retryDelay;
      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_MS);
      reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        connect();
      }, delay);
    };

    async function connect() {
      const attempt = ++connectAttempt;
      closeSource();

      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Obtain a short-lived single-use ticket to avoid exposing the JWT in URL query strings
        const ticketRes = await fetch(`${window.API_BASE}/api/events/ticket`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!ticketRes.ok) throw new Error('Failed to obtain event ticket');

        const { ticket } = await ticketRes.json();
        if (!isMounted || attempt !== connectAttempt) return;

        const es = new EventSource(`${window.API_BASE}/api/events?ticket=${encodeURIComponent(ticket)}`);
        eventSource = es;

        es.onopen = () => {
          retryDelay = MIN_RETRY_MS; // Reset backoff on successful connection
          if (hasConnectedBefore) {
            window.dispatchEvent(new CustomEvent('orderUpdated', { detail: { type: 'RESYNC', orderId: undefined } }));
          }
          hasConnectedBefore = true;
        };

        es.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data && data.type === 'ORDER_UPDATED') queueOrderUpdate(data);
          } catch (err) {
            console.warn('[EventStream] Parse error:', err);
          }
        };

        es.onerror = () => {
          // The ticket is single-use: never let EventSource auto-retry with it.
          if (eventSource === es) closeSource();
          else es.close();
          scheduleReconnect();
        };
      } catch {
        scheduleReconnect();
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (coalesceTimer) clearTimeout(coalesceTimer);
      reconnectTimer = null;
      coalesceTimer = null;
      pending = [];
      closeSource();
    };
  }, []);
}
