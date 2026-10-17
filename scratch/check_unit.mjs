import pool from '../server/db.js';
async function test() {
  const u = await pool.query("SELECT * FROM order_units WHERE unit_id = '26270029' OR short_serial = '26270029'");
  console.log('Unit 26270029:', u.rows);
  if (u.rows.length > 0) {
    const o = await pool.query('SELECT * FROM orders WHERE id = $1', [u.rows[0].order_id]);
    console.log('Order:', o.rows[0]);
    const allUnits = await pool.query('SELECT id, unit_id, short_serial, status, hold_status FROM order_units WHERE order_id = $1', [u.rows[0].order_id]);
    console.log('All units for this order count:', allUnits.rows.length);
  }
  await pool.end();
}
test();
