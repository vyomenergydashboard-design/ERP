// Order number / unit serial allocation. Numbers are immutable once issued (see AGENTS.md):
// never renumber or resequence.
import pool from '../db.js';

// Helper for Order ID Generation (FY format: YY(YY+1)XXXX, e.g. 26270001)
export const formatOrderNumber = (year, counter) => {
  const yr = year || new Date().getFullYear();
  const startYr = String(yr % 100).padStart(2, '0');
  const endYr = String((yr + 1) % 100).padStart(2, '0');
  // The format has exactly 4 counter digits and parseOrderCounter reads the last 4.
  // Past 9999 numbers would wrap and collide with issued serials, so fail loudly instead.
  if (counter > 9999) {
    throw new Error(`Order/serial counter would exceed 9999 (next: ${counter}); the numbering format must be extended before more orders can be created.`);
  }
  return `${startYr}${endYr}${String(counter).padStart(4, '0')}`;
};

export const parseOrderCounter = (numStr) => {
  if (!numStr) return 0;
  const clean = String(numStr).replace(/^TEMP-/, '');
  if (clean.startsWith('ORD-')) {
    const parts = clean.split('-');
    return parseInt(parts[parts.length - 1], 10) || 0;
  }
  if (/^\d{8,}$/.test(clean)) {
    return parseInt(clean.slice(-4), 10) || 0;
  }
  const digitsOnly = clean.replace(/\D/g, '');
  return parseInt(digitsOnly.slice(-4), 10) || 0;
};

// Serialises order-number / unit-serial allocation across concurrent transactions.
// Must be called with a transaction client after BEGIN; the lock is released at COMMIT/ROLLBACK.
const ORDER_NUMBER_LOCK_KEY = 726270001;
export const lockSerialAllocation = async (client) => {
  await client.query('SELECT pg_advisory_xact_lock($1)', [ORDER_NUMBER_LOCK_KEY]);
};

// Computes the next order number without locking. Used directly only for read-only
// previews (e.g. Settings); allocation must go through generateOrderNumber.
export const computeNextOrderNumber = async (db) => {
  const year = new Date().getFullYear();
  const orderRes = await db.query("SELECT MAX(order_number) as max_ord FROM orders WHERE order_number NOT LIKE 'TEMP-%'");
  const unitRes = await db.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");

  const ordNum = parseOrderCounter(orderRes.rows[0]?.max_ord);
  const unitNum = parseOrderCounter(unitRes.rows[0]?.max_unit);

  const highest = Math.max(ordNum, unitNum);
  let nextNum = highest > 0 ? highest + 1 : 1;

  if (highest === 0) {
    const setting = await db.query("SELECT value FROM system_settings WHERE key = 'order_number_start' LIMIT 1");
    nextNum = setting.rows.length > 0 ? parseInt(setting.rows[0].value) || 1 : 1;
  }

  return formatOrderNumber(year, nextNum);
};

export const generateOrderNumber = async (client) => {
  if (!client || client === pool) {
    throw new Error('generateOrderNumber requires a transaction client');
  }
  await lockSerialAllocation(client);
  return computeNextOrderNumber(client);
};
