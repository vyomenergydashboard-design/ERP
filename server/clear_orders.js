import pool from './db.js';

async function clearOrders() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Clearing all orders, line items, order units, steps, and activity logs...');

    await client.query('TRUNCATE TABLE orders RESTART IDENTITY CASCADE;');
    await client.query('DELETE FROM activity_logs;');

    await client.query('COMMIT');
    console.log('All orders cleared successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to clear orders:', err);
  } finally {
    client.release();
    pool.end();
  }
}

if (process.argv[1] && process.argv[1].includes('clear_orders.js')) {
  clearOrders();
}
