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
  const digitsOnly = clean.replace(/\D/g, '');
  const parsed = parseInt(digitsOnly.slice(-4), 10);
  return isNaN(parsed) ? 1 : parsed;
}

export async function realignUnitSerials(clientParam) {
  const client = clientParam || await pool.connect();
  const shouldRelease = !clientParam;

  try {
    console.log('[Re-align System] Aligning order numbers and unit serials so Order Number = Starting Unit Serial...');

    // Find starting FY counter from the lowest order number
    const minOrderRes = await client.query("SELECT MIN(order_number) as min_ord FROM orders WHERE order_number NOT LIKE 'TEMP-%'");
    let targetStartSeq = 529; // Default fallback to 529 if non-standard

    if (minOrderRes.rows.length > 0 && minOrderRes.rows[0].min_ord) {
      const parsedMin = parseOrderCounter(minOrderRes.rows[0].min_ord);
      if (parsedMin > 0) {
        targetStartSeq = parsedMin;
      }
    }

    await client.query('BEGIN');

    // Temporarily prefix to prevent unique constraint violations during update
    await client.query("UPDATE order_units SET unit_id = 'TEMP-' || unit_id");
    await client.query("UPDATE orders SET order_number = 'TEMP-' || order_number");

    const ordersRes = await client.query("SELECT id, order_number, order_date, created_at FROM orders ORDER BY id ASC");
    const orders = ordersRes.rows;

    let globalUnitSeq = targetStartSeq;

    for (const order of orders) {
      const yr = order.order_date 
        ? new Date(order.order_date).getFullYear() 
        : (order.created_at ? new Date(order.created_at).getFullYear() : new Date().getFullYear());

      // Order Number is set to the starting unit serial for this order
      const newOrderNumber = formatOrderNumber(yr, globalUnitSeq);

      await client.query("UPDATE orders SET order_number = $1 WHERE id = $2", [newOrderNumber, order.id]);

      // Update line items
      const lineItemsRes = await client.query("SELECT id FROM order_line_items WHERE order_id = $1 ORDER BY id ASC", [order.id]);
      let itemIdx = 1;
      for (const li of lineItemsRes.rows) {
        const assignedLiNumber = `${newOrderNumber}-${String(itemIdx).padStart(2, '0')}`;
        await client.query("UPDATE order_line_items SET line_item_number = $1 WHERE id = $2", [assignedLiNumber, li.id]);
        itemIdx++;
      }

      // Update unit serials under this order sequentially
      const unitsRes = await client.query("SELECT id FROM order_units WHERE order_id = $1 ORDER BY id ASC", [order.id]);
      for (const unit of unitsRes.rows) {
        const newUnitSerial = formatOrderNumber(yr, globalUnitSeq);
        await client.query(
          "UPDATE order_units SET unit_id = $1, short_serial = $1 WHERE id = $2",
          [newUnitSerial, unit.id]
        );
        globalUnitSeq++;
      }
    }

    await client.query('COMMIT');
    console.log(`[Re-align System] Successfully re-aligned orders and unit serials starting from counter ${targetStartSeq}!`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Re-align System Error]:', err);
  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}

if (process.argv[1] && process.argv[1].includes('realign_unit_serials_to_orders.js')) {
  realignUnitSerials().then(() => pool.end());
}
