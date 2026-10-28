import express from 'express';
import http from 'http';
import jwt from 'jsonwebtoken';
import { initEventStream, broadcastEvent } from './services/eventStream.js';

async function runEventStreamTest() {
  console.log('====================================================');
  console.log('  TEST SUITE: SLICE 3 - SERVER-SENT EVENTS (SSE)');
  console.log('====================================================\n');

  const app = express();
  app.use(express.json());

  const JWT_SECRET = 'test_secret_for_sse';
  process.env.JWT_SECRET = JWT_SECRET;

  const mockAuthorize = () => (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        req.user = jwt.verify(token, JWT_SECRET);
        return next();
      } catch (e) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    res.status(401).json({ error: 'Unauthorized' });
  };

  initEventStream(app, mockAuthorize);

  const server = app.listen(5099);
  console.log('[SETUP] Started test event server on port 5099');

  try {
    const token = jwt.sign({ id: 1, username: 'admin', role: 'Admin' }, JWT_SECRET, { expiresIn: '1h' });

    console.log('\n[TEST 1] Requesting single-use ticket from POST /api/events/ticket...');
    const ticketRes = await fetch('http://localhost:5099/api/events/ticket', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!ticketRes.ok) {
      throw new Error(`Failed to obtain ticket: ${ticketRes.status}`);
    }

    const { ticket } = await ticketRes.json();
    console.log(`  ✓ Received ticket: ${ticket.slice(0, 10)}...`);

    console.log('\n[TEST 2] Connecting to SSE stream with ticket at GET /api/events?ticket=...');
    const receivedPackets = [];

    const streamPromise = new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:5099/api/events?ticket=${ticket}`, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`Expected 200 OK, got ${res.statusCode}`));
        }

        const contentType = res.headers['content-type'];
        if (!contentType || !contentType.includes('text/event-stream')) {
          return reject(new Error(`Expected text/event-stream, got ${contentType}`));
        }
        console.log(`  ✓ Connected to SSE stream (Content-Type: ${contentType})`);

        res.on('data', (chunk) => {
          const str = chunk.toString();
          receivedPackets.push(str);

          if (str.includes('ORDER_UPDATED')) {
            req.destroy();
            resolve(receivedPackets);
          }
        });

        res.on('error', reject);
      });

      req.on('error', reject);

      // Broadcast an event after client connects
      setTimeout(() => {
        console.log('\n[TEST 3] Broadcasting simulated ORDER_UPDATED event...');
        broadcastEvent({
          type: 'ORDER_UPDATED',
          unitId: 9999,
          orderId: 8888,
          dept: 'Production',
          status: 'done',
          updatedBy: 'tester',
          timestamp: Date.now()
        });
      }, 300);

      setTimeout(() => {
        req.destroy();
        reject(new Error('Timeout waiting for SSE packets'));
      }, 4000);
    });

    const packets = await streamPromise;
    console.log('  ✓ Received packets:');
    packets.forEach((p, idx) => console.log(`    Packet ${idx + 1}: ${p.trim()}`));

    const hasConnected = packets.some(p => p.includes('CONNECTED'));
    const hasOrderUpdated = packets.some(p => p.includes('ORDER_UPDATED'));

    if (!hasConnected || !hasOrderUpdated) {
      throw new Error('Missing expected CONNECTED or ORDER_UPDATED event in stream');
    }

    console.log('\n  ✓ PASSED: Real-time SSE synchronization stream verified end-to-end!');

  } catch (err) {
    console.error('  ✕ FAILED:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runEventStreamTest();
