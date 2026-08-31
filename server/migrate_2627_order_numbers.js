import pool from './db.js';

export function formatOrderNumber(year, counter) {
  const yr = year || new Date().getFullYear();
  const startYr = String(yr % 100).padStart(2, '0');
  const endYr = String((yr + 1) % 100).padStart(2, '0');
  return `${startYr}${endYr}${String(counter).padStart(4, '0')}`;
}

export function parseOrderCounter(numStr) {
  if (!numStr) return 1;
  const clean = String(numStr).replace(/^TEMP-/, '');
  if (clean.startsWith('ORD-')) {
    const parts = clean.split('-');
    const lastPart = parts[parts.length - 1];
    const parsed = parseInt(lastPart, 10);
    return isNaN(parsed) ? 1 : parsed;
  }
  if (/^\d{8,}$/.test(clean)) {
    const parsed = parseInt(clean.slice(-4), 10);
    return isNaN(parsed) ? 1 : parsed;
  }
  const digitsOnly = clean.replace(/\D/g, '');
  const parsed = parseInt(digitsOnly.slice(-4), 10);
  return isNaN(parsed) ? 1 : parsed;
}

export function extractYearFromOrder(order) {
  let cleanNum = String(order.order_number || '').replace(/^TEMP-/, '');
  if (cleanNum.startsWith('ORD-')) {
    const parts = cleanNum.split('-');
    if (parts.length >= 2 && parts[1].length === 4) {
      const yr = parseInt(parts[1], 10);
      if (!isNaN(yr)) return yr;
    }
  } else if (/^\d{8,}$/.test(cleanNum)) {
    const yy = parseInt(cleanNum.substring(0, 2), 10);
    if (!isNaN(yy)) {
      return 2000 + yy;
    }
  }
  
  if (order.order_date) {
    return new Date(order.order_date).getFullYear();
  }
  if (order.created_at) {
    return new Date(order.created_at).getFullYear();
  }
  return new Date().getFullYear();
}

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Starting migration to FY Order Numbering (YY(YY+1)XXXX)...');

    await client.query("UPDATE order_units SET unit_id = 'TEMP-' || unit_id");
    await client.query("UPDATE orders SET order_number = 'TEMP-' || order_number");

    const ordersRes = await client.query("SELECT id, order_number, order_date, created_at FROM orders ORDER BY id ASC");
    const orders = ordersRes.rows;
    console.log(`Found ${orders.length} orders to migrate.`);

    let currentOrderSeq = 1;
    let lastFYYear = null;

    for (const order of orders) {
      const year = extractYearFromOrder(order);
      
      if (lastFYYear !== null && lastFYYear !== year) {
        currentOrderSeq = 1;
      }
      lastFYYear = year;

      let seqNum = currentOrderSeq;
      let cleanOld = String(order.order_number).replace(/^TEMP-/, '');
      if (cleanOld.startsWith('ORD-')) {
        const parts = cleanOld.split('-');
        if (parts.length >= 3) {
          const parsed = parseInt(parts[2], 10);
          if (!isNaN(parsed) && parsed > 0) seqNum = parsed;
        }
      }

      const newOrderNumber = formatOrderNumber(year, seqNum);
      console.log(`Migrating Order ID ${order.id}: "${order.order_number}" -> "${newOrderNumber}"`);

      await client.query("UPDATE orders SET order_number = $1 WHERE id = $2", [newOrderNumber, order.id]);

      const liRes = await client.query("SELECT id, quantity FROM order_line_items WHERE order_id = $1 ORDER BY id ASC", [order.id]);
      let itemIdx = 1;
      for (const li of liRes.rows) {
        const assignedLiNumber = `${newOrderNumber}-${String(itemIdx).padStart(2, '0')}`;
        console.log(`  Line Item ID ${li.id}: -> "${assignedLiNumber}" (qty: ${li.quantity})`);
        
        await client.query(
          "UPDATE order_line_items SET line_item_number = $1 WHERE id = $2",
          [assignedLiNumber, li.id]
        );
        itemIdx++;
      }

      const unitsRes = await client.query("SELECT id, short_serial FROM order_units WHERE order_id = $1 ORDER BY id ASC", [order.id]);
      for (const unit of unitsRes.rows) {
        const newUnitId = `${newOrderNumber}-${unit.short_serial}`;
        await client.query(
          "UPDATE order_units SET unit_id = $1 WHERE id = $2",
          [newUnitId, unit.id]
        );
      }

      currentOrderSeq = seqNum + 1;
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

if (process.argv[1] && process.argv[1].includes('migrate_2627_order_numbers.js')) {
  migrate();
}
