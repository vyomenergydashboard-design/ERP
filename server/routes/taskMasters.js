import express from 'express';
import { PIPELINE } from '../data/workflow.js';

/**
 * Router for Task Masters (mounted at /api/task_masters): the department task templates.
 * Read: any logged-in user. Create/update/delete: Admin.
 * Rules (AGENTS.md): a new template is added only to active orders/units currently in its
 * department or upstream; deleting one removes its steps but never re-derives or advances units.
 */
export default function createTaskMastersRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
    try {
      // Unknown departments sort last (array_position returns NULL; NULLS LAST is the ASC default)
      const result = await pool.query(
        `SELECT * FROM task_masters ORDER BY array_position($1::text[], dept) ASC, id ASC`,
        [[...PIPELINE]]
      );
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch task masters' });
    }
  });

  router.post('/', authorize(['Admin']), async (req, res) => {
    const { dept, name, sub, special, is_mandatory, requires_upload, default_doc_type, custom_fields, order_fields, level } = req.body;
    try {
      const taskLevel = level === 'order' ? 'order' : 'unit';
      const result = await pool.query(
        `INSERT INTO task_masters (dept, name, sub, special, is_mandatory, requires_upload, default_doc_type, custom_fields, order_fields, level) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [
          dept,
          name,
          sub,
          special || null,
          is_mandatory !== false,
          requires_upload === true,
          default_doc_type || 'General',
          JSON.stringify(custom_fields || []),
          JSON.stringify(order_fields || []),
          taskLevel
        ]
      );
      const newTask = result.rows[0];

      // SELECTIVE TASK ADDITION:
      // Only apply the new task to active orders/units currently in this department or upstream.
      // NEVER apply retroactively to orders that have already passed this department or completed/cancelled!
      const deptIdx = PIPELINE.indexOf(dept);
      const eligibleDepts = deptIdx >= 0 ? PIPELINE.slice(0, deptIdx + 1) : [dept];

      let fieldDefs = [];
      try {
        const raw = Array.isArray(custom_fields) ? custom_fields : JSON.parse(custom_fields || '[]');
        fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
      } catch { fieldDefs = []; }

      if (taskLevel === 'order') {
        const eligibleOrders = await pool.query(
          `SELECT DISTINCT o.id 
           FROM orders o
           JOIN order_units ou ON ou.order_id = o.id
           WHERE ou.current_dept = ANY($1::text[])
             AND ou.status NOT IN ('Cancelled', 'Dispatched', 'Completed')
             AND NOT EXISTS (
               SELECT 1 FROM order_steps os WHERE os.order_id = o.id AND (os.task_id = $2 OR (os.dept = $3 AND os.name = $4))
             )`,
          [eligibleDepts, newTask.id, dept, name]
        );

        for (const ord of eligibleOrders.rows) {
          const maxOrderRes = await pool.query(
            'SELECT COALESCE(MAX(step_order), 0) + 1 AS next_order FROM order_steps WHERE order_id = $1',
            [ord.id]
          );
          const nextOrder = maxOrderRes.rows[0].next_order;
          await pool.query(
            `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')`,
            [
              ord.id,
              newTask.id,
              dept,
              name,
              sub,
              special || null,
              requires_upload === true,
              default_doc_type || 'General',
              JSON.stringify(fieldDefs),
              nextOrder
            ]
          );
        }
      } else {
        const eligibleUnits = await pool.query(
          `SELECT ou.id 
           FROM order_units ou
           WHERE ou.current_dept = ANY($1::text[])
             AND ou.status NOT IN ('Cancelled', 'Dispatched', 'Completed')
             AND NOT EXISTS (
               SELECT 1 FROM unit_steps us WHERE us.order_unit_id = ou.id AND (us.task_id = $2 OR (us.dept = $3 AND us.name = $4))
             )`,
          [eligibleDepts, newTask.id, dept, name]
        );

        for (const u of eligibleUnits.rows) {
          const maxOrderRes = await pool.query(
            'SELECT COALESCE(MAX(step_order), 0) + 1 AS next_order FROM unit_steps WHERE order_unit_id = $1',
            [u.id]
          );
          const nextOrder = maxOrderRes.rows[0].next_order;
          await pool.query(
            `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order)
             VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
            [
              u.id,
              newTask.id,
              dept,
              name,
              sub,
              requires_upload === true,
              default_doc_type || 'General',
              JSON.stringify(fieldDefs),
              nextOrder
            ]
          );
        }
      }

      await pool.query(
        `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
        [req.user.id, `Created task master "${newTask.name}" for department "${newTask.dept}" (${taskLevel}-level)`]
      );
      res.status(201).json(newTask);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create task master' });
    }
  });

  router.put('/:id', authorize(['Admin']), async (req, res) => {
    const { dept, name, sub, special, is_mandatory, requires_upload, default_doc_type, custom_fields, order_fields, level } = req.body;
    try {
      const taskLevel = level === 'order' ? 'order' : 'unit';
      const result = await pool.query(
        `UPDATE task_masters SET dept = $1, name = $2, sub = $3, special = $4, is_mandatory = $5, requires_upload = $6, default_doc_type = $7, custom_fields = $8, order_fields = $9, level = $10
         WHERE id = $11 RETURNING *`,
        [dept, name, sub, special || null, is_mandatory !== false, requires_upload === true, default_doc_type || 'General', JSON.stringify(custom_fields || []), JSON.stringify(order_fields || []), taskLevel, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });

      // Sync updated properties to existing order_steps and unit_steps
      await pool.query(
        `UPDATE order_steps 
         SET dept = $1, name = $2, sub = $3, special = $4, requires_upload = $5, default_doc_type = $6 
         WHERE task_id = $7`,
        [dept, name, sub, special || null, requires_upload === true, default_doc_type || 'General', req.params.id]
      );

      await pool.query(
        `UPDATE unit_steps 
         SET dept = $1, name = $2, sub = $3, requires_upload = $4, default_doc_type = $5 
         WHERE task_id = $6`,
        [dept, name, sub, requires_upload === true, default_doc_type || 'General', req.params.id]
      );

      await pool.query(
        `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
        [req.user.id, `Updated task master "${result.rows[0].name}" (Department: ${result.rows[0].dept})`]
      );
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update task master' });
    }
  });

  router.delete('/:id', authorize(['Admin']), async (req, res) => {
    try {
      const taskId = parseInt(req.params.id, 10);
      // 1. Delete step instances linked to this task master from active flows
      await pool.query('DELETE FROM order_steps WHERE task_id = $1', [taskId]);
      await pool.query('DELETE FROM unit_steps WHERE task_id = $1', [taskId]);

      // 2. Delete the template from task_masters
      const result = await pool.query('DELETE FROM task_masters WHERE id = $1 RETURNING *', [taskId]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });

      // CRITICAL GUARD: Deleting a task template must NEVER automatically advance or re-derive
      // unit departments across all active orders! Existing orders simply no longer require this step.

      await pool.query(
        `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
        [req.user.id, `Deleted task master "${result.rows[0].name}" (Department: ${result.rows[0].dept})`]
      );
      res.json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete task master' });
    }
  });

  return router;
}
