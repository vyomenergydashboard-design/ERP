import pool from './db.js';

async function fixOrder53() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Fixing Order 53 order number to 26271472...');

    // Update order number
    await client.query("UPDATE orders SET order_number = '26271472' WHERE id = 53");

    // Update line items
    const liRes = await client.query("SELECT id FROM order_line_items WHERE order_id = 53 ORDER BY id ASC");
    let itemIdx = 1;
    for (const li of liRes.rows) {
      const assignedLiNumber = `26271472-${String(itemIdx).padStart(2, '0')}`;
      await client.query(
        "UPDATE order_line_items SET line_item_number = $1 WHERE id = $2",
        [assignedLiNumber, li.id]
      );
      itemIdx++;
    }

    await client.query('COMMIT');
    console.log('Order 53 successfully updated to 26271472!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to fix Order 53:', err);
  } finally {
    client.release();
    pool.end();
  }
}

if (process.argv[1] && process.argv[1].includes('fix_order_53_number.js')) {
  fixOrder53();
}
