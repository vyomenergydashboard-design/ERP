import express from 'express';
import bcrypt from 'bcryptjs';
import { ALL_ROLES } from '../data/workflow.js';

/**
 * Router for user accounts (mounted at /api/users). Sign-up and login stay under /api/auth.
 * List: any logged-in user (emails only for Admin). Role, password, edit and delete: Admin.
 * Every change is written to activity_logs; an Admin cannot delete their own account.
 */
export default function createUsersRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
    try {
      // Non-admins only need names/roles (step assignment); emails stay Admin-only.
      const columns = req.user.role === 'Admin' ? 'id, username, email, role, created_at' : 'id, username, role';
      const result = await pool.query(`SELECT ${columns} FROM users ORDER BY created_at DESC`);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/:id/role', authorize(['Admin']), async (req, res) => {
    const { role } = req.body;
    const VALID_ROLES = ALL_ROLES;
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    try {
      const result = await pool.query(
        'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
        [role, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      const updatedUser = result.rows[0];

      // Audit Log: User Role Change
      try {
        await pool.query(
          `INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot) 
           VALUES ($1, 'Admin', $2, $3)`,
          [
            req.user.id,
            `Changed role for user "${updatedUser.username}" to "${role}"`,
            req.user.username || 'Admin'
          ]
        );
      } catch (logErr) {
        console.warn('[Audit Log] Failed to log role change:', logErr.message);
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.patch('/:id/password', authorize(['Admin']), async (req, res) => {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, email, role',
        [hashedPassword, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      const targetUser = result.rows[0];

      // Audit Log: Password Reset
      try {
        await pool.query(
          `INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot) 
           VALUES ($1, 'Admin', $2, $3)`,
          [
            req.user.id,
            `Reset password for user "${targetUser.username}"`,
            req.user.username || 'Admin'
          ]
        );
      } catch (logErr) {
        console.warn('[Audit Log] Failed to log password reset:', logErr.message);
      }

      res.json({ message: 'Password updated successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.put('/:id', authorize(['Admin']), async (req, res) => {
    const { username, email, role, password } = req.body;
    const { id } = req.params;

    if (!username || !email || !role) {
      return res.status(400).json({ error: 'Username, email, and role are required' });
    }

    const VALID_ROLES = ALL_ROLES;
    if (!VALID_ROLES.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    try {
      let query = 'UPDATE users SET username = $1, email = $2, role = $3';
      const params = [username, email, role, id];

      if (password && password.length >= 6) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = $4 WHERE id = $5';
        params.splice(3, 0, hashedPassword);
      } else {
        query += ' WHERE id = $4';
      }

      query += ' RETURNING id, username, email, role, created_at';

      const result = await pool.query(query, params);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
      const updatedUser = result.rows[0];

      // Audit Log: User Update
      try {
        await pool.query(
          `INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot) 
           VALUES ($1, 'Admin', $2, $3)`,
          [
            req.user.id,
            `Updated user "${updatedUser.username}" (Role: ${updatedUser.role}, Email: ${updatedUser.email})${password ? ' [Password Changed]' : ''}`,
            req.user.username || 'Admin'
          ]
        );
      } catch (logErr) {
        console.warn('[Audit Log] Failed to log user update:', logErr.message);
      }

      res.json(updatedUser);
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.delete('/:id', authorize(['Admin']), async (req, res) => {
    const { id } = req.params;

    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'You cannot delete your own account' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      await client.query('UPDATE orders SET created_by = NULL WHERE created_by = $1', [id]);
      await client.query('UPDATE order_units SET assigned_user = NULL WHERE assigned_user = $1', [id]);
      await client.query('UPDATE documents SET uploaded_by = NULL WHERE uploaded_by = $1', [id]);
      await client.query('UPDATE unit_steps SET assigned_user_id = NULL WHERE assigned_user_id = $1', [id]);

      const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id, username, email, role', [id]);

      if (result.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'User not found' });
      }

      const deletedUser = result.rows[0];

      // Audit Log: User Deletion (logged under the executing Admin's credentials)
      await client.query(
        `INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot) 
         VALUES ($1, 'Admin', $2, $3)`,
        [
          req.user.id,
          `Deleted user "${deletedUser.username}" (Role: ${deletedUser.role || 'Unknown'}, Email: ${deletedUser.email || 'None'})`,
          req.user.username || 'Admin'
        ]
      );

      await client.query('COMMIT');
      res.json({ message: 'User deleted successfully', deletedUser });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    } finally {
      client.release();
    }
  });

  return router;
}
