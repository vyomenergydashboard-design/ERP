import pool from './db.js';
import { formatOrderNumber } from './migrate_2627_order_numbers.js';

async function migrateUnitSerials() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Starting migration of unit serials to YY(YY+1)XXXX (e.g. 26270001, 26270002)...');

    // Temporarily prefix unit IDs to prevent unique constraint conflicts
    await client.query("UPDATE order_units SET unit_id = 'TEMP-' || unit_id");

    const unitsRes = await client.query(`
      SELECT ou.id, ou.order_id, o.order_date, o.created_at
      FROM order_units ou
      JOIN orders o ON ou.order_id = o.id
      ORDER BY ou.id ASC
    `);
    const units = unitsRes.rows;
    console.log(`Found ${units.length} order units to update.`);

    let currentUnitSeq = 1;
    let lastYear = null;

    for (const unit of units) {
      const year = unit.order_date 
        ? new Date(unit.order_date).getFullYear() 
        : (unit.created_at ? new Date(unit.created_at).getFullYear() : new Date().getFullYear());

      if (lastYear !== null && lastYear !== year) {
        currentUnitSeq = 1;
      }
      lastYear = year;

      const newUnitSerial = formatOrderNumber(year, currentUnitSeq);

      await client.query(
        "UPDATE order_units SET unit_id = $1, short_serial = $1 WHERE id = $2",
        [newUnitSerial, unit.id]
      );

      currentUnitSeq++;
    }

    await client.query('COMMIT');
    console.log('Unit serial migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Unit serial migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

if (process.argv[1] && process.argv[1].includes('migrate_unit_serials.js')) {
  migrateUnitSerials();
}
