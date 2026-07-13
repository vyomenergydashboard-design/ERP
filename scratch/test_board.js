import pool from '../server/db.js';

async function test() {
  try {
    const result = await pool.query(
      `SELECT o.id, o.order_number, 
              (SELECT COUNT(*) FROM order_units ou WHERE ou.order_id = o.id) AS unit_count,
              (SELECT COUNT(*) FROM order_line_items oli WHERE oli.order_id = o.id) AS line_item_count
       FROM orders o`
    );
    console.log(result.rows);
    let total = 0;
    result.rows.forEach(r => {
      total += parseInt(r.line_item_count);
    });
    console.log("Total line items:", total);
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

test();
