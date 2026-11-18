import express from 'express';

/**
 * Router for Panel Size Masters (mounted at /api/panel-size-masters).
 * Read access for every logged-in user (reference data shown in the Table View).
 * Create/update: Admin, Manager, Design, Sales. Delete: Admin, Manager, Design.
 */
export default function createPanelSizeMastersRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM panel_size_masters ORDER BY id ASC');
      const rows = result.rows.map(r => ({
        ...r,
        panel_size: r.panel_size || r.size_name || '',
        comments: r.comments || r.description || ''
      }));
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch Panel Size Masters' });
    }
  });

  router.post('/', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
    const { panel_code, panel_size, size_name, ip_rating, comments, description } = req.body;
    const finalSize = (panel_size || size_name || '').trim();
    if (!finalSize) {
      return res.status(400).json({ error: 'Panel size is required' });
    }
    const finalCode = (panel_code || '').trim();
    const finalIp = (ip_rating || '').trim();
    const finalComments = (comments || description || '').trim();

    try {
      const result = await pool.query(
        `INSERT INTO panel_size_masters (panel_code, panel_size, size_name, ip_rating, comments, description) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [finalCode, finalSize, finalSize, finalIp, finalComments, finalComments]
      );
      const row = result.rows[0];
      res.json({
        ...row,
        panel_size: row.panel_size || row.size_name,
        comments: row.comments || row.description
      });
    } catch (err) {
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Panel size already exists' });
      }
      console.error(err);
      res.status(500).json({ error: 'Failed to create Panel Size Master' });
    }
  });

  router.put('/:id', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
    const { panel_code, panel_size, size_name, ip_rating, comments, description } = req.body;
    const finalSize = (panel_size || size_name || '').trim();
    if (!finalSize) {
      return res.status(400).json({ error: 'Panel size is required' });
    }
    const finalCode = (panel_code || '').trim();
    const finalIp = (ip_rating || '').trim();
    const finalComments = (comments || description || '').trim();

    try {
      const result = await pool.query(
        `UPDATE panel_size_masters 
         SET panel_code = $1, panel_size = $2, size_name = $3, ip_rating = $4, comments = $5, description = $6 
         WHERE id = $7 RETURNING *`,
        [finalCode, finalSize, finalSize, finalIp, finalComments, finalComments, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'Panel Size Master not found' });
      const row = result.rows[0];
      res.json({
        ...row,
        panel_size: row.panel_size || row.size_name,
        comments: row.comments || row.description
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update Panel Size Master' });
    }
  });

  router.delete('/:id', authorize(['Admin', 'Manager', 'Design']), async (req, res) => {
    try {
      const deleted = await pool.query('DELETE FROM panel_size_masters WHERE id = $1 RETURNING *', [req.params.id]);
      if (deleted.rows.length === 0) return res.status(404).json({ error: 'Panel Size Master not found' });
      res.json(deleted.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete Panel Size Master' });
    }
  });

  return router;
}
