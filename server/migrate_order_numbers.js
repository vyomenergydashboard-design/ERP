import pool from './db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Determine starting global counter
    const settingRes = await client.query("SELECT value FROM system_settings WHERE key = 'order_number_start' LIMIT 1");
    let globalLineItemCounter = settingRes.rows.length > 0 ? parseInt(settingRes.rows[0].value) || 1 : 1;

    console.log(`Starting migration with global counter: ${globalLineItemCounter}`);

    // 2. Fetch all orders in order of creation
    const ordersRes = await client.query("SELECT id, order_number, order_date, created_at FROM orders ORDER BY id ASC");
    const orders = ordersRes.rows;
    console.log(`Found ${orders.length} orders to migrate.`);

    for (const order of orders) {
      // Extract year
      let year = new Date().getFullYear();
      if (order.order_number && order.order_number.startsWith('ORD-')) {
        const parts = order.order_number.split('-');
        if (parts.length >= 2 && parts[1].length === 4) {
          const yr = parseInt(parts[1]);
          if (!isNaN(yr)) year = yr;
        }
      } else if (order.order_date) {
        year = new Date(order.order_date).getFullYear();
      } else if (order.created_at) {
        year = new Date(order.created_at).getFullYear();
      }

      const firstSeqNum = globalLineItemCounter;
      const newOrderNumber = `ORD-${year}-${firstSeqNum.toString().padStart(4, '0')}`;

      console.log(`Migrating Order ID ${order.id}: "${order.order_number}" -> "${newOrderNumber}"`);

      // 3. Update Order Table
      await client.query("UPDATE orders SET order_number = $1 WHERE id = $2", [newOrderNumber, order.id]);

      // 4. Fetch and update line items
      const liRes = await client.query("SELECT id, quantity FROM order_line_items WHERE order_id = $1 ORDER BY id ASC", [order.id]);
      for (const li of liRes.rows) {
        const assignedLiNumber = `ORD-${year}-${globalLineItemCounter.toString().padStart(4, '0')}`;
        console.log(`  Line Item ID ${li.id}: -> "${assignedLiNumber}" (qty: ${li.quantity})`);
        
        await client.query(
          "UPDATE order_line_items SET line_item_number = $1 WHERE id = $2",
          [assignedLiNumber, li.id]
        );
        
        globalLineItemCounter += li.quantity;
      }

      // 5. Update Unit IDs (preserving short_serial)
      const unitsRes = await client.query("SELECT id, short_serial FROM order_units WHERE order_id = $1", [order.id]);
      for (const unit of unitsRes.rows) {
        const newUnitId = `${newOrderNumber}-${unit.short_serial}`;
        await client.query(
          "UPDATE order_units SET unit_id = $1 WHERE id = $2",
          [newUnitId, unit.id]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed, transaction rolled back:', err);
  } finally {
    client.release();
    pool.end();
  }
}

migrate();
