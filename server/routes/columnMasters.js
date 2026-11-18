import express from 'express';
import { PIPELINE } from '../data/workflow.js';

/**
 * Router for Column Masters and per-department column visibility (mounted at /api/column-masters).
 * Read: any logged-in user. Column create/update/delete: Admin (system columns cannot be deleted).
 * Visibility matrix: Admin, Manager.
 */
export default function createColumnMastersRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
    try {
      const colsResult = await pool.query('SELECT * FROM column_masters ORDER BY sort_order ASC, id ASC');
      const visResult = await pool.query('SELECT * FROM department_column_visibility');

      // Group visibility by department
      const visibilityByDept = {};
      for (const v of visResult.rows) {
        if (!visibilityByDept[v.dept]) visibilityByDept[v.dept] = {};
        visibilityByDept[v.dept][v.col_key] = v.is_visible;
      }

      res.json({
        columns: colsResult.rows,
        visibilityByDept
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch column masters' });
    }
  });

  router.post('/', authorize(['Admin']), async (req, res) => {
    try {
      const { label, col_key, category, field_type } = req.body;
      if (!label || !col_key) {
        return res.status(400).json({ error: 'Label and Column Key are required' });
      }

      const cleanKey = col_key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');

      // Get max sort_order
      const maxOrderRes = await pool.query('SELECT MAX(sort_order) as max_order FROM column_masters');
      const nextOrder = (maxOrderRes.rows[0]?.max_order || 0) + 1;

      const result = await pool.query(
        `INSERT INTO column_masters (col_key, label, category, field_type, is_system, sort_order)
         VALUES ($1, $2, $3, $4, false, $5) RETURNING *`,
        [cleanKey, label.trim(), category || 'Custom', field_type || 'Text', nextOrder]
      );

      const newCol = result.rows[0];

      // Seed default visibility (true) for all departments
      const depts = PIPELINE;
      for (const d of depts) {
        await pool.query(
          `INSERT INTO department_column_visibility (dept, col_key, is_visible) VALUES ($1, $2, true) ON CONFLICT DO NOTHING`,
          [d, cleanKey]
        );
      }

      await pool.query(
        `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
        [req.user.id, `Added custom column master "${label}" (${cleanKey})`]
      );

      res.status(201).json(newCol);
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Column Key already exists' });
      }
      res.status(500).json({ error: 'Failed to create column master' });
    }
  });

  router.put('/:id', authorize(['Admin']), async (req, res) => {
    try {
      const { label, category, field_type, sort_order } = req.body;
      const result = await pool.query(
        `UPDATE column_masters
         SET label = COALESCE($1, label),
             category = COALESCE($2, category),
             field_type = COALESCE($3, field_type),
             sort_order = COALESCE($4, sort_order)
         WHERE id = $5 RETURNING *`,
        [label, category, field_type, sort_order, req.params.id]
      );

      if (result.rows.length === 0) return res.status(404).json({ error: 'Column master not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update column master' });
    }
  });

  router.delete('/:id', authorize(['Admin']), async (req, res) => {
    try {
      const colCheck = await pool.query('SELECT * FROM column_masters WHERE id = $1', [req.params.id]);
      if (colCheck.rows.length === 0) return res.status(404).json({ error: 'Column master not found' });
      if (colCheck.rows[0].is_system) {
        return res.status(400).json({ error: 'System columns cannot be deleted. You can hide them in department visibility settings.' });
      }

      const deleted = await pool.query('DELETE FROM column_masters WHERE id = $1 RETURNING *', [req.params.id]);

      await pool.query(
        `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
        [req.user.id, `Deleted custom column master "${deleted.rows[0].label}"`]
      );

      res.json(deleted.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete column master' });
    }
  });

  router.post('/visibility', authorize(['Admin', 'Manager']), async (req, res) => {
    try {
      const { visibilityByDept } = req.body;
      if (!visibilityByDept || typeof visibilityByDept !== 'object') {
        return res.status(400).json({ error: 'Invalid visibility payload' });
      }

      for (const [dept, cols] of Object.entries(visibilityByDept)) {
        for (const [col_key, is_visible] of Object.entries(cols)) {
          await pool.query(
            `INSERT INTO department_column_visibility (dept, col_key, is_visible)
             VALUES ($1, $2, $3)
             ON CONFLICT (dept, col_key) DO UPDATE SET is_visible = $3`,
            [dept, col_key, !!is_visible]
          );
        }
      }

      await pool.query(
        `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
        [req.user.id, `Updated department column visibility matrix`]
      );

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to save column visibility' });
    }
  });

  return router;
}
