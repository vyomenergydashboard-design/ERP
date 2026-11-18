// Helpers for code running inside a BEGIN/COMMIT transaction on a dedicated client.

// Runs a best-effort step inside a transaction. On failure only this step is rolled
// back (via a savepoint) and a warning is logged, so the surrounding transaction stays
// usable — matching the old "warn and continue" behaviour of non-transactional code.
// `name` must be a plain SQL identifier.
export const tryInSavepoint = async (client, name, fn) => {
  await client.query(`SAVEPOINT ${name}`);
  try {
    const result = await fn();
    await client.query(`RELEASE SAVEPOINT ${name}`);
    return result;
  } catch (err) {
    await client.query(`ROLLBACK TO SAVEPOINT ${name}`);
    console.warn(`[${name}] step failed and was rolled back:`, err.message || err);
    return undefined;
  }
};

// Takes row locks on the given parent orders (in id order) at the start of a transaction.
// Requests that touch units of the same order then queue instead of deadlocking on the
// shared orders / order_line_items rows (e.g. QC batch bar firing parallel unit updates).
export const lockOrders = async (client, orderIds) => {
  const ids = [...new Set(orderIds.map(Number).filter(Number.isInteger))].sort((a, b) => a - b);
  if (ids.length === 0) return;
  await client.query('SELECT id FROM orders WHERE id = ANY($1::int[]) ORDER BY id FOR UPDATE', [ids]);
};
