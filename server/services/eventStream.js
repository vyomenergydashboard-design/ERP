import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const clients = new Set();
const ticketStore = new Map(); // ticket -> { user, expiresAt }

// Clean up expired tickets every 60s
setInterval(() => {
  const now = Date.now();
  for (const [ticket, data] of ticketStore.entries()) {
    if (data.expiresAt < now) ticketStore.delete(ticket);
  }
}, 60000).unref();

export function broadcastEvent(eventData) {
  if (clients.size === 0) return;
  const payload = `data: ${JSON.stringify(eventData)}\n\n`;
  for (const client of clients) {
    try {
      client.res.write(payload);
    } catch (err) {
      clients.delete(client);
    }
  }
}

export function initEventStream(app, authorize, jwtSecret = process.env.JWT_SECRET) {
  // No hard-coded fallback: if neither is set, header-token auth is simply unavailable
  // (tickets issued via authorize() still work).
  const JWT_SECRET = jwtSecret || process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.warn('[eventStream] JWT_SECRET is not configured; Bearer-token auth for /api/events is disabled (tickets only).');
  }

  // 1. Ticket generation endpoint (passes auth token in header, receives short-lived ticket)
  app.post('/api/events/ticket', authorize(), (req, res) => {
    const ticket = crypto.randomBytes(24).toString('hex');
    ticketStore.set(ticket, {
      user: req.user,
      expiresAt: Date.now() + 60000 // Valid for 60 seconds
    });
    res.json({ ticket });
  });

  // 2. SSE Stream endpoint
  app.get('/api/events', (req, res) => {
    let authenticatedUser = null;

    // Check single-use ticket first (prevents JWT exposure in logs)
    const ticket = req.query.ticket;
    if (ticket && ticketStore.has(ticket)) {
      const ticketData = ticketStore.get(ticket);
      if (ticketData.expiresAt >= Date.now()) {
        authenticatedUser = ticketData.user;
      }
      ticketStore.delete(ticket); // Single use
    }

    // Fallback: Authorization: Bearer <jwt> header only (never a token in the URL)
    if (!authenticatedUser && JWT_SECRET) {
      const authHeader = req.headers['authorization'];
      const match = typeof authHeader === 'string' ? authHeader.match(/^Bearer\s+(\S+)$/i) : null;
      if (match) {
        try {
          authenticatedUser = jwt.verify(match[1], JWT_SECRET);
        } catch (_) {}
      }
    }

    if (!authenticatedUser) {
      return res.status(401).json({ error: 'Unauthorized: Valid ticket or token required for event stream.' });
    }

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no'
    });

    res.flushHeaders?.();

    const clientObj = { id: crypto.randomUUID(), res, user: authenticatedUser };
    clients.add(clientObj);

    // Initial handshake
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', clientCount: clients.size })}\n\n`);

    // Keep-alive heartbeat every 25 seconds
    const heartbeat = setInterval(() => {
      try {
        res.write(': keep-alive\n\n');
      } catch (_) {
        clearInterval(heartbeat);
      }
    }, 25000);

    req.on('close', () => {
      clearInterval(heartbeat);
      clients.delete(clientObj);
    });
  });
}


// Tell open views that an order changed (they refetch). Call it after the change is committed.
// `entity` is a short label ('order', 'unit', 'step', 'planning', 'document', 'po', ...).
export function broadcastOrderUpdated(orderId, entity, user, extra = {}) {
  broadcastEvent({
    type: 'ORDER_UPDATED',
    entity,
    orderId: orderId == null ? undefined : orderId,
    ...extra,
    updatedBy: user?.username || 'User',
    timestamp: Date.now()
  });
}
