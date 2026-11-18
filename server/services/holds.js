// Hold checks shared by the order, unit, line-item, planning and document routes.
import pool from '../db.js';

export const isOrderOnHold = async (orderId) => {
  if (!orderId || isNaN(Number(orderId))) return false;
  try {
    const res = await pool.query("SELECT hold_status FROM orders WHERE id = $1", [orderId]);
    return res.rows.length > 0 && res.rows[0].hold_status === 'Approved';
  } catch (err) {
    console.error('isOrderOnHold error:', err);
    return false;
  }
};

export const isUnitOnHold = async (unitId) => {
  if (!unitId) return false;
  try {
    const numId = !isNaN(Number(unitId)) ? Number(unitId) : -1;
    const res = await pool.query(
      "SELECT o.hold_status as order_hold_status, ou.hold_status as unit_hold_status FROM orders o JOIN order_units ou ON ou.order_id = o.id WHERE ou.id = $1 OR ou.unit_id = $2",
      [numId, String(unitId)]
    );
    if (res.rows.length === 0) return false;
    return res.rows[0].order_hold_status === 'Approved' || res.rows[0].unit_hold_status === 'Hold';
  } catch (err) {
    console.error('isUnitOnHold error:', err);
    return false;
  }
};

export const isLineItemOnHold = async (lineItemId) => {
  if (!lineItemId || isNaN(Number(lineItemId))) return false;
  try {
    const res = await pool.query(
      "SELECT o.hold_status FROM orders o JOIN order_line_items oli ON oli.order_id = o.id WHERE oli.id = $1",
      [lineItemId]
    );
    return res.rows.length > 0 && res.rows[0].hold_status === 'Approved';
  } catch (err) {
    console.error('isLineItemOnHold error:', err);
    return false;
  }
};
