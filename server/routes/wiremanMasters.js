import express from 'express';

/**
 * Router for Wireman Masters.
 * Manages wireman employee records (name, experience).
 * Read access: Admin, Manager, Production, Planning.
 * Write/Delete access: Admin only.
 * Output order: Alphabetical by name.
 */
export default function createWiremanMastersRouter(pool, authorize) {
  const router = express.Router();

  // GET /api/wireman-masters
  // List all wiremen ordered alphabetically by name
  router.get('/', authorize(['Admin', 'Manager', 'Production', 'Planning']), async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT * FROM wireman_masters ORDER BY LOWER(TRIM(name)) ASC, id ASC'
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching wireman masters:', err);
      res.status(500).json({ error: 'Failed to fetch wireman masters' });
    }
  });

  // POST /api/wireman-masters
  // Create a new wireman (Admin only)
  router.post('/', authorize(['Admin']), async (req, res) => {
    try {
      const { name, experience } = req.body;
      const trimmedName = (name || '').trim();
      const trimmedExp = (experience || '').trim();

      if (!trimmedName) {
        return res.status(400).json({ error: 'Wireman name is required' });
      }

      const result = await pool.query(
        `INSERT INTO wireman_masters (name, experience)
         VALUES ($1, $2)
         RETURNING *`,
        [trimmedName, trimmedExp]
      );

      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error('Error creating wireman master:', err);
      res.status(500).json({ error: 'Failed to create wireman master' });
    }
  });

  // PUT /api/wireman-masters/:id
  // Update wireman details (Admin only)
  router.put('/:id', authorize(['Admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, experience } = req.body;
      const trimmedName = (name || '').trim();
      const trimmedExp = (experience || '').trim();

      if (!trimmedName) {
        return res.status(400).json({ error: 'Wireman name is required' });
      }

      const result = await pool.query(
        `UPDATE wireman_masters
         SET name = $1, experience = $2, updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [trimmedName, trimmedExp, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Wireman not found' });
      }

      res.json(result.rows[0]);
    } catch (err) {
      console.error('Error updating wireman master:', err);
      res.status(500).json({ error: 'Failed to update wireman master' });
    }
  });

  // DELETE /api/wireman-masters/:id
  // Delete wireman (Admin only)
  router.delete('/:id', authorize(['Admin']), async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'DELETE FROM wireman_masters WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Wireman not found' });
      }

      res.json({ message: 'Wireman deleted successfully', wireman: result.rows[0] });
    } catch (err) {
      console.error('Error deleting wireman master:', err);
      res.status(500).json({ error: 'Failed to delete wireman master' });
    }
  });

  return router;
}
