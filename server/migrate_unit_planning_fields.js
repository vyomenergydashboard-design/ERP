import pool from './db.js';

async function migrateUnitPlanningFields() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Adding planning columns to order_units table...');

    await client.query(`
      ALTER TABLE order_units 
      ADD COLUMN IF NOT EXISTS planned_dispatch_date DATE,
      ADD COLUMN IF NOT EXISTS wiring_assigned_date DATE,
      ADD COLUMN IF NOT EXISTS wiring_expected_date DATE,
      ADD COLUMN IF NOT EXISTS expected_qc_date DATE,
      ADD COLUMN IF NOT EXISTS qc_status TEXT DEFAULT 'Pending',
      ADD COLUMN IF NOT EXISTS qc_date DATE,
      ADD COLUMN IF NOT EXISTS mounting_start_date DATE,
      ADD COLUMN IF NOT EXISTS mounting_complete_date DATE;
    `);

    console.log('Backfilling unit-level planning columns from order_line_items...');

    await client.query(`
      UPDATE order_units ou
      SET 
        planned_dispatch_date = COALESCE(ou.planned_dispatch_date, oli.planned_dispatch_date),
        wiring_assigned_date = COALESCE(ou.wiring_assigned_date, oli.wiring_assigned_date),
        wiring_expected_date = COALESCE(ou.wiring_expected_date, oli.wiring_expected_date),
        expected_qc_date = COALESCE(ou.expected_qc_date, oli.expected_qc_date),
        qc_status = COALESCE(ou.qc_status, oli.qc_status),
        qc_date = COALESCE(ou.qc_date, oli.qc_date),
        mounting_start_date = COALESCE(ou.mounting_start_date, oli.mounting_start_date),
        mounting_complete_date = COALESCE(ou.mounting_complete_date, oli.mounting_complete_date)
      FROM order_line_items oli
      WHERE ou.line_item_id = oli.id;
    `);

    await client.query('COMMIT');
    console.log('Unit planning fields migration completed successfully!');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

if (process.argv[1] && process.argv[1].includes('migrate_unit_planning_fields.js')) {
  migrateUnitPlanningFields();
}
