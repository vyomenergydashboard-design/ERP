import express from 'express';

/**
 * Router for the activity log (mounted at /api/logs).
 * Read and append: any logged-in user; non-admins get at most 1,000 rows. Clear: Admin.
 */
export default function createLogsRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
    try {
      const limit = req.query.limit || '1000';
      let queryText = `
        SELECT l.*, 
               COALESCE(u.username, l.username_snapshot, 'Deleted User') AS username, 
               o.order_number 
        FROM activity_logs l 
        LEFT JOIN users u ON l.user_id = u.id 
        LEFT JOIN orders o ON l.order_id = o.id
        ORDER BY l.timestamp DESC
      `;
      const params = [];
      // Only Admin may fetch the full log or more than 1000 rows.
      const isAdmin = req.user.role === 'Admin';
      if (!(limit === 'all' && isAdmin)) {
        const parsed = parseInt(limit, 10);
        const requested = parsed > 0 ? parsed : 1000;
        queryText += ` LIMIT $1`;
        params.push(isAdmin ? requested : Math.min(requested, 1000));
      }

      const result = await pool.query(queryText, params);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/', authorize(), async (req, res) => {
    const { dept, action_text, order_id } = req.body;
    try {
      const result = await pool.query(
        'INSERT INTO activity_logs (user_id, order_id, dept, action_text, username_snapshot) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.user.id, order_id || null, dept, action_text, req.user.username || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/', authorize(['Admin']), async (req, res) => {
    try {
      const countRes = await pool.query('SELECT COUNT(*) as cnt FROM activity_logs');
      const totalLogs = parseInt(countRes.rows[0]?.cnt, 10) || 0;

      await pool.query('TRUNCATE TABLE activity_logs RESTART IDENTITY');

      // Record initial audit entry documenting the wipe
      await pool.query(
        `INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot) 
         VALUES ($1, 'Admin', $2, $3)`,
        [
          req.user.id,
          `Cleared system activity logs (${totalLogs} previous records purged)`,
          req.user.username || 'Admin'
        ]
      );

      res.json({ message: 'Activity logs cleared successfully', purgedCount: totalLogs });
    } catch (err) {
      console.error('Failed to clear activity logs:', err);
      res.status(500).json({ error: 'Failed to clear activity logs' });
    }
  });

  return router;
}
