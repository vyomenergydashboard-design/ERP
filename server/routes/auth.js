import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { maskLoginId } from '../services/logPrivacy.js';

// ---------------- In-Memory Rate Limiting for Auth ----------------
const loginAttempts = new Map();
const MAX_LOGIN_ATTEMPTS = 15;
const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const loginRateLimiter = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();

  const record = loginAttempts.get(ip);
  if (record) {
    if (now - record.firstAttemptTime > LOGIN_WINDOW_MS) {
      loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
    } else if (record.count >= MAX_LOGIN_ATTEMPTS) {
      const waitMinutes = Math.ceil((LOGIN_WINDOW_MS - (now - record.firstAttemptTime)) / 60000);
      return res.status(429).json({
        error: `Too many failed login attempts. Please try again after ${waitMinutes} minute(s).`
      });
    } else {
      record.count += 1;
    }
  } else {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
  }

  // Periodic pruning of expired rate limit entries
  if (loginAttempts.size > 2000) {
    for (const [k, v] of loginAttempts.entries()) {
      if (now - v.firstAttemptTime > LOGIN_WINDOW_MS) loginAttempts.delete(k);
    }
  }

  next();
};

/**
 * Router for authentication (mounted at /api/auth): admin-only user signup, login (rate limited
 * per client IP by loginRateLimiter) and the logged-in user's profile.
 * JWT_SECRET (passed in from index.js) signs the 12-hour login tokens.
 */
export default function createAuthRouter(pool, authorize, JWT_SECRET) {
  const router = express.Router();

  router.post('/signup', authorize(['Admin']), async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await pool.query(
        'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
        [username, email, hashedPassword, role || 'Viewer']
      );
      const newUser = result.rows[0];

      // Audit Log: User Creation
      try {
        await pool.query(
          `INSERT INTO activity_logs (user_id, dept, action_text, username_snapshot) 
           VALUES ($1, 'Admin', $2, $3)`,
          [
            req.user.id,
            `Created user "${newUser.username}" (Role: ${newUser.role}, Email: ${newUser.email || 'None'})`,
            req.user.username || 'Admin'
          ]
        );
      } catch (logErr) {
        console.warn('[Audit Log] Failed to log user creation:', logErr.message);
      }

      res.status(201).json(newUser);
    } catch (err) {
      console.error(err);
      if (err.code === '23505') {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.post('/login', loginRateLimiter, async (req, res) => {
    const { email, password } = req.body;
    // The log shows a masked login id (e.g. s***@gmail.com), never the full email or username.
    const loginId = maskLoginId(email);
    console.log(`[LOGIN TRY] Email: "${loginId}"`);
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [email]);
      if (result.rows.length === 0) {
        console.log(`[LOGIN FAIL] User not found for email: "${loginId}"`);
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`[LOGIN FAIL] Password mismatch for email: "${loginId}"`);
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      console.log(`[LOGIN SUCCESS] Email: "${loginId}", Role: "${user.role}"`);
      // Clear failed login tracking on successful authentication
      const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';
      loginAttempts.delete(clientIp);

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
      res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
    } catch (err) {
      console.error('[LOGIN ERROR]', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/profile', authorize(), async (req, res) => {
    try {
      const result = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [req.user.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  return router;
}
