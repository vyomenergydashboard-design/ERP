import { useEffect, useRef } from 'react';

/**
 * useEventStream - Real-time Server-Sent Events hook
 * Connects to /api/events using a short-lived ticket to securely listen for multi-user updates.
 * Dispatches a global 'orderUpdated' event whenever any user mutates an order, unit, or step.
 */
export function useEventStream() {
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const retryDelayRef = useRef(1000);

  useEffect(() => {
    let isMounted = true;

    async function connect() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // Obtain a 60-second single-use ticket to avoid exposing JWT in URL query strings
        const ticketRes = await fetch(`${window.API_BASE}/api/events/ticket`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!ticketRes.ok) {
          throw new Error('Failed to obtain event ticket');
        }

        const { ticket } = await ticketRes.json();
        if (!isMounted) return;

        const es = new EventSource(`${window.API_BASE}/api/events?ticket=${encodeURIComponent(ticket)}`);
        eventSourceRef.current = es;

        es.onopen = () => {
          retryDelayRef.current = 1000; // Reset backoff on successful connection
        };

        es.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data.type === 'ORDER_UPDATED') {
              window.dispatchEvent(new CustomEvent('orderUpdated', { detail: data }));
            }
          } catch (err) {
            console.warn('[EventStream] Parse error:', err);
          }
        };

        es.onerror = () => {
          if (es.readyState === EventSource.CLOSED) {
            es.close();
            if (isMounted) {
              const delay = retryDelayRef.current;
              retryDelayRef.current = Math.min(delay * 1.5, 15000);
              reconnectTimeoutRef.current = setTimeout(connect, delay);
            }
          }
        };
      } catch (err) {
        if (isMounted) {
          const delay = retryDelayRef.current;
          retryDelayRef.current = Math.min(delay * 1.5, 15000);
          reconnectTimeoutRef.current = setTimeout(connect, delay);
        }
      }
    }

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);
}

