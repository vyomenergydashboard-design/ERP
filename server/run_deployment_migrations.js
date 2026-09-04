import pool from './db.js';
import { realignUnitSerials } from './realign_unit_serials_to_orders.js';

export async function runDeploymentMigrations(clientParam) {
  const client = clientParam || await pool.connect();
  const shouldRelease = !clientParam;

  try {
    // 1. Ensure columns exist on order_units
    await client.query(`
      ALTER TABLE order_units 
      ADD COLUMN IF NOT EXISTS planned_dispatch_date DATE,
      ADD COLUMN IF NOT EXISTS wiring_assigned_date DATE,
      ADD COLUMN IF NOT EXISTS wiring_expected_date DATE,
      ADD COLUMN IF NOT EXISTS expected_qc_date DATE,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Not Started',
      ADD COLUMN IF NOT EXISTS qc_status TEXT DEFAULT 'Pending',
      ADD COLUMN IF NOT EXISTS qc_date DATE,
      ADD COLUMN IF NOT EXISTS mounting_start_date DATE,
      ADD COLUMN IF NOT EXISTS mounting_complete_date DATE,
      ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'Standard',
      ADD COLUMN IF NOT EXISTS panel_type_size TEXT,
      ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

      ALTER TABLE order_line_items
      ADD COLUMN IF NOT EXISTS panel_type_size TEXT,
      ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'Standard',
      ADD COLUMN IF NOT EXISTS hold_status TEXT DEFAULT 'None';
    `);

    // Backfill unit planning fields if null
    await client.query(`
      UPDATE order_units ou
      SET 
        planned_dispatch_date = COALESCE(ou.planned_dispatch_date, oli.planned_dispatch_date),
        wiring_assigned_date = COALESCE(ou.wiring_assigned_date, oli.wiring_assigned_date),
        wiring_expected_date = COALESCE(ou.wiring_expected_date, oli.wiring_expected_date),
        expected_qc_date = COALESCE(ou.expected_qc_date, oli.expected_qc_date),
        qc_status = COALESCE(ou.qc_status, oli.qc_status, 'Pending'),
        qc_date = COALESCE(ou.qc_date, oli.qc_date),
        mounting_start_date = COALESCE(ou.mounting_start_date, oli.mounting_start_date),
        mounting_complete_date = COALESCE(ou.mounting_complete_date, oli.mounting_complete_date)
      FROM order_line_items oli
      WHERE ou.line_item_id = oli.id 
        AND ou.planned_dispatch_date IS NULL;
    `);

    // 2. Re-align orders and unit serials so Order Number = Starting Unit Serial
    await realignUnitSerials(client);

    // 2. Check if old ORD- order numbers exist
    const oldOrdersRes = await client.query("SELECT COUNT(*) FROM orders WHERE order_number LIKE 'ORD-%'");
    const oldOrdersCount = parseInt(oldOrdersRes.rows[0].count, 10);

    if (oldOrdersCount > 0) {
      console.log(`[Deployment Migration] Found ${oldOrdersCount} old ORD- orders to migrate...`);
      await client.query('BEGIN');

      await client.query("UPDATE orders SET order_number = 'TEMP-' || order_number WHERE order_number LIKE 'ORD-%'");
      const ordersToMigrate = await client.query("SELECT id, order_number, order_date, created_at FROM orders WHERE order_number LIKE 'TEMP-ORD-%' ORDER BY id ASC");

      for (const order of ordersToMigrate.rows) {
        const yr = order.order_date ? new Date(order.order_date).getFullYear() : (order.created_at ? new Date(order.created_at).getFullYear() : new Date().getFullYear());
        const startYr = String(yr % 100).padStart(2, '0');
        const endYr = String((yr + 1) % 100).padStart(2, '0');
        
        let seq = 1;
        const parts = order.order_number.replace(/^TEMP-ORD-/, '').split('-');
        if (parts.length >= 2) {
          seq = parseInt(parts[1], 10) || 1;
        } else {
          seq = parseInt(parts[0], 10) || 1;
        }

        const newOrdNum = `${startYr}${endYr}${String(seq).padStart(4, '0')}`;
        await client.query("UPDATE orders SET order_number = $1 WHERE id = $2", [newOrdNum, order.id]);

        // Update line item numbers
        const lineItems = await client.query("SELECT id FROM order_line_items WHERE order_id = $1 ORDER BY id ASC", [order.id]);
        let liIdx = 1;
        for (const li of lineItems.rows) {
          const newLiNum = `${newOrdNum}-${String(liIdx).padStart(2, '0')}`;
          await client.query("UPDATE order_line_items SET line_item_number = $1 WHERE id = $2", [newLiNum, li.id]);
          liIdx++;
        }
      }

      await client.query('COMMIT');
      console.log('[Deployment Migration] Order number migration completed.');
    }

    // 3. Align Unit Serials with Starting Order Number Counter
    const minOrderRes = await client.query("SELECT MIN(order_number) as min_ord FROM orders WHERE order_number NOT LIKE 'TEMP-%'");
    let targetStartSeq = 1;
    if (minOrderRes.rows.length > 0 && minOrderRes.rows[0].min_ord) {
      const cleanMin = minOrderRes.rows[0].min_ord.replace(/\D/g, '');
      const parsedMin = parseInt(cleanMin.slice(-4), 10);
      if (!isNaN(parsedMin) && parsedMin > 0) {
        targetStartSeq = parsedMin;
      }
    }

    const minUnitRes = await client.query("SELECT MIN(unit_id) as min_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
    let currentMinUnitSeq = 0;
    if (minUnitRes.rows.length > 0 && minUnitRes.rows[0].min_unit) {
      const cleanMinU = minUnitRes.rows[0].min_unit.replace(/\D/g, '');
      currentMinUnitSeq = parseInt(cleanMinU.slice(-4), 10) || 0;
    }

    const hasHyphenatedUnits = await client.query("SELECT COUNT(*) FROM order_units WHERE unit_id LIKE '%-%'");
    const hyphenatedCount = parseInt(hasHyphenatedUnits.rows[0].count, 10);

    if (hyphenatedCount > 0 || (currentMinUnitSeq > 0 && currentMinUnitSeq !== targetStartSeq)) {
      console.log(`[Deployment Migration] Re-aligning unit serials starting from FY counter ${targetStartSeq}...`);
      await client.query('BEGIN');

      await client.query("UPDATE order_units SET unit_id = 'TEMP-' || unit_id");
      const unitsToMigrate = await client.query(`
        SELECT ou.id, o.order_date, o.created_at 
        FROM order_units ou 
        JOIN orders o ON ou.order_id = o.id 
        ORDER BY ou.id ASC
      `);

      let uSeq = targetStartSeq;
      let lastYr = null;

      for (const unit of unitsToMigrate.rows) {
        const yr = unit.order_date ? new Date(unit.order_date).getFullYear() : (unit.created_at ? new Date(unit.created_at).getFullYear() : new Date().getFullYear());
        if (lastYr !== null && lastYr !== yr) {
          uSeq = targetStartSeq;
        }
        lastYr = yr;

        const startYr = String(yr % 100).padStart(2, '0');
        const endYr = String((yr + 1) % 100).padStart(2, '0');
        const newUnitSerial = `${startYr}${endYr}${String(uSeq).padStart(4, '0')}`;

        await client.query("UPDATE order_units SET unit_id = $1, short_serial = $1 WHERE id = $2", [newUnitSerial, unit.id]);
        uSeq++;
      }

      await client.query('COMMIT');
      console.log('[Deployment Migration] Unit serials re-aligned successfully.');
    }

  } catch (err) {
    console.error('[Deployment Migration Error]:', err);
  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}
