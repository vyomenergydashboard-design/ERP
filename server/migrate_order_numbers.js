import pool from './db.js';

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Determine starting global counter
    const settingRes = await client.query("SELECT value FROM system_settings WHERE key = 'order_number_start' LIMIT 1");
    let globalLineItemCounter = settingRes.rows.length > 0 ? parseInt(settingRes.rows[0].value) || 1 : 1;
    let globalUnitCounter = 1;

    console.log(`Starting migration with global counter: ${globalLineItemCounter}`);

    // Temporarily prefix unit IDs to prevent unique constraint conflicts during migration
    await client.query("UPDATE order_units SET unit_id = 'TEMP-' || unit_id");

    // 2. Fetch all orders in order of creation
    const ordersRes = await client.query("SELECT id, order_number, order_date, created_at FROM orders ORDER BY id ASC");
    const orders = ordersRes.rows;
    console.log(`Found ${orders.length} orders to migrate.`);

    for (const order of orders) {
      // Extract year, handling potential TEMP- prefix
      let year = new Date().getFullYear();
      let cleanNum = order.order_number || '';
      if (cleanNum.startsWith('TEMP-')) {
        cleanNum = cleanNum.substring(5);
      }

      if (cleanNum.startsWith('ORD-')) {
        const parts = cleanNum.split('-');
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

      // 5. Update Unit IDs (resequencing short_serial globally)
      const unitsRes = await client.query("SELECT id FROM order_units WHERE order_id = $1 ORDER BY id ASC", [order.id]);
      for (const unit of unitsRes.rows) {
        const newShortSerial = globalUnitCounter.toString().padStart(4, '0');
        const newUnitId = `${newOrderNumber}-${newShortSerial}`;
        console.log(`  Unit ID ${unit.id}: short_serial -> "${newShortSerial}", unit_id -> "${newUnitId}"`);
        await client.query(
          "UPDATE order_units SET short_serial = $1, unit_id = $2 WHERE id = $3",
          [newShortSerial, newUnitId, unit.id]
        );
        globalUnitCounter += 1;
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
