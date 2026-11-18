import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import XLSX from 'xlsx';
import { runDeploymentMigrations } from './run_deployment_migrations.js';
import createPurchaseOrdersRouter from './routes/purchaseOrders.js';
import createWiremanMastersRouter from './routes/wiremanMasters.js';
import createBackupRouter from './routes/backup.js';
import createMaintenanceRouter from './routes/maintenance.js';
import createCompaniesRouter from './routes/companies.js';
import createPartNumberMastersRouter from './routes/partNumberMasters.js';
import createPanelSizeMastersRouter from './routes/panelSizeMasters.js';
import createTaskMastersRouter from './routes/taskMasters.js';
import createColumnMastersRouter from './routes/columnMasters.js';
import createLogsRouter from './routes/logs.js';
import createUsersRouter from './routes/users.js';
import createSystemSettingsRouter from './routes/systemSettings.js';
import createDocumentsRouter from './routes/documents.js';
import createPlanningRouter from './routes/planning.js';
import createUnitsRouter from './routes/units.js';
import createOrdersRouter from './routes/orders.js';
import { evaluatePurchaseAutoCompletion } from './services/purchaseAutoCompletion.js';
import { initEventStream } from './services/eventStream.js';
import { installAfterCommitHooks } from './services/afterCommit.js';
import { DEFAULT_STEPS } from './data/defaultTaskMasters.js';
import { ALL_ROLES, PIPELINE_SQL_ARRAY, deptOrderSql } from './data/workflow.js';
import { publicErrorMessage } from './services/httpErrors.js';
import { setSystemSeeding, deriveUnitStatus, updateOrderQCStatusFromSteps } from './services/unitStatus.js';
import { cleanupUploadedFiles } from './services/uploads.js';

// Emails and other side effects queued inside a transaction run only after COMMIT.
installAfterCommitHooks(pool);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set. Refusing to start without it.');
  process.exit(1);
}

// Auto-initialize Database
const initDB = async () => {
  setSystemSeeding(true);
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database initialized successfully (Tables checked/created)');
  } catch (err) {
    console.error('Database initialization (init.sql) warning:', err.message || err);
  }

  // Guarantee critical order_units columns exist on boot
  for (const colDef of [
    'po_override_unlinked BOOLEAN DEFAULT FALSE',
    'sales_cleared BOOLEAN DEFAULT FALSE',
    'sales_cleared_at TIMESTAMP WITH TIME ZONE',
    'sales_cleared_by INTEGER',
    'design_confirmed BOOLEAN DEFAULT FALSE',
    'design_confirmed_at TIMESTAMP WITH TIME ZONE',
    'design_confirmed_by INTEGER'
  ]) {
    try {
      await pool.query(`ALTER TABLE order_units ADD COLUMN IF NOT EXISTS ${colDef}`);
    } catch (e) {
      console.warn(`[Bootstrap] order_units column check (${colDef}):`, e.message);
    }
  }

  try {
    await runDeploymentMigrations();
  } catch (err) {
    console.error('Deployment migrations error:', err.message || err);
  }


  try {

    // Ensure default task_masters exist only if table is empty
    const currentTasksCount = await pool.query('SELECT COUNT(*) FROM task_masters');
    if (parseInt(currentTasksCount.rows[0].count, 10) === 0) {
      console.log('Seeding initial default task_masters...');
      for (const step of DEFAULT_STEPS) {
        await pool.query(
          `INSERT INTO task_masters (dept, name, sub, special, requires_upload, default_doc_type, is_mandatory, level, custom_fields) 
           VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8)`,
          [
            step.dept,
            step.name,
            step.sub,
            step.special,
            step.requires_upload,
            step.default_doc_type || 'General',
            step.level || 'unit',
            JSON.stringify(step.custom_fields || [])
          ]
        );
      }
      console.log('Default task_masters seeded successfully!');
    }

    // Ensure Design 'Review & Classify' step has the classification custom field template
    const reviewTask = await pool.query("SELECT id, custom_fields FROM task_masters WHERE dept = 'Design' AND name = 'Review & Classify'");
    if (reviewTask.rows.length > 0) {
      const hasDropdown = reviewTask.rows[0].custom_fields?.some(f => f.label === 'Classification' && f.datakey === 'classification');
      if (!hasDropdown) {
        const defaultCf = [
          { id: 'classification', label: 'Classification', type: 'Dropdown', options: ['Standard', 'Non-Standard'], datakey: 'classification' }
        ];
        await pool.query("UPDATE task_masters SET custom_fields = $1 WHERE id = $2", [JSON.stringify(defaultCf), reviewTask.rows[0].id]);
        await pool.query(
          "UPDATE unit_steps SET custom_fields = $1 WHERE name = 'Review & Classify' AND (custom_fields IS NULL OR custom_fields = '[]'::jsonb)",
          [JSON.stringify(defaultCf.map(f => ({ ...f, value: 'Standard' })))]
        );
      }
    }

    // Auto-restore steps for existing orders and units if they have 0 steps
    const ordersRes = await pool.query('SELECT id FROM orders');
    const dbTasks = await pool.query(`
      SELECT * FROM task_masters 
      WHERE is_mandatory = true 
      ORDER BY 
        ${deptOrderSql('dept')} ASC,
        id ASC
    `);
    const tasks = dbTasks.rows.length > 0 ? dbTasks.rows : DEFAULT_STEPS;

    let restoredCount = 0;
    for (const order of ordersRes.rows) {
      const stepsCount = await pool.query('SELECT COUNT(*) FROM order_steps WHERE order_id = $1', [order.id]);
      if (parseInt(stepsCount.rows[0].count) === 0) {
        restoredCount++;
        const orderTasks = tasks.filter(t => t.level === 'order');
        for (let i = 0; i < orderTasks.length; i++) {
          const task = orderTasks[i];
          let fieldDefs = [];
          if (task.id) {
            try {
              const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
              fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
            } catch { fieldDefs = []; }
          }
          await pool.query(
            `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [order.id, task.id || null, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
          );
        }
      }

      // Check unit steps
      const unitsRes = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [order.id]);
      for (const unit of unitsRes.rows) {
        const unitStepsCount = await pool.query('SELECT COUNT(*) FROM unit_steps WHERE order_unit_id = $1', [unit.id]);
        if (parseInt(unitStepsCount.rows[0].count) === 0) {
          const unitTasks = tasks.filter(t => t.level === 'unit');
          for (let i = 0; i < unitTasks.length; i++) {
            const task = unitTasks[i];
            let fieldDefs = [];
            if (task.id) {
              try {
                const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
                fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
              } catch { fieldDefs = []; }
            }
            await pool.query(
              `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order) 
               VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
              [unit.id, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
            );
          }
          // derive initial status
          await deriveUnitStatus(unit.id, pool, true);
        }
      }
    }
    if (restoredCount > 0) {
      console.log(`Auto-restored steps for ${restoredCount} orders.`);
    }

    // Sync QC status and date for all existing orders
    for (const order of ordersRes.rows) {
      await updateOrderQCStatusFromSteps(order.id, pool);
    }
    console.log('QC statuses synchronized for all orders.');
  } catch (err) {
    console.error('Database initialization failed:', err);
  } finally {
    setSystemSeeding(false);
  }
};


// ---------------- Security Headers Middleware ----------------
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.removeHeader('X-Powered-By');
  next();
});

// ---------------- CORS Configuration with Flexible Origin Support ----------------
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000'
];
const envAllowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim())
  : [];
const allowedOrigins = [...defaultAllowedOrigins, ...envAllowedOrigins];

// Behind a single reverse proxy (nginx): take the client IP from X-Forwarded-For
// so the login rate limiter counts per user, not per proxy.
app.set('trust proxy', 1);

app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow non-browser requests (tools, curl, server-to-server)
    if (!origin) return callback(null, true);

    // 2. Allow wildcard or explicit allowedOrigins list
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 3. Unknown origin: omit CORS headers (no error). Same-origin traffic through
    //    nginx / the Vite proxy is unaffected; add extra origins via ALLOWED_ORIGINS.
    callback(null, false);
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}));

app.use(express.json());

// Unauthenticated liveness check for Docker / load balancers. Registered before the
// request logger so frequent probes don't flood the logs. Reveals nothing but up/down.
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

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

// Middleware for RBAC
const authorize = (roles = []) => {
  return (req, res, next) => {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) return res.status(401).json({ error: 'No token provided in Authorization header' });

    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Unauthorized' });

      try {
        const userRes = await pool.query('SELECT id, role FROM users WHERE id = $1', [decoded.id]);
        if (userRes.rows.length === 0) {
          return res.status(401).json({ error: 'Unauthorized: User does not exist' });
        }

        const dbUser = userRes.rows[0];
        if (roles.length && !roles.includes(dbUser.role)) {
          return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }

        req.user = { ...decoded, role: dbUser.role };
        next();
      } catch (dbErr) {
        console.error('Auth DB check failed:', dbErr);
        return res.status(500).json({ error: 'Internal server error during authorization' });
      }
    });
  };
};

// Vendor Purchase Orders API
app.use('/api/purchase-orders', createPurchaseOrdersRouter(pool, authorize, deriveUnitStatus));

// Wireman Masters API
app.use('/api/wireman-masters', createWiremanMastersRouter(pool, authorize));

// Database Backup API (Admin only)
app.use('/api/admin/backup', createBackupRouter(pool, authorize));

// Maintenance API (Admin only)
app.use('/api/admin/maintenance', createMaintenanceRouter(pool, authorize));

// Real-time Server-Sent Events stream for multi-user synchronization
initEventStream(app, authorize, JWT_SECRET);

// Auth Routes
app.post('/api/auth/signup', authorize(['Admin']), async (req, res) => {
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

app.post('/api/auth/login', loginRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN TRY] Email: "${email}"`);
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [email]);
    if (result.rows.length === 0) {
      console.log(`[LOGIN FAIL] User not found for email: "${email}"`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[LOGIN FAIL] Password mismatch for email: "${email}"`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    console.log(`[LOGIN SUCCESS] Email: "${email}", Role: "${user.role}"`);
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

app.get('/api/auth/profile', authorize(), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logs & Users
app.use('/api/logs', createLogsRouter(pool, authorize));

app.use('/api/users', createUsersRouter(pool, authorize));

// System Settings API
app.use('/api/system-settings', createSystemSettingsRouter(pool, authorize));

// Orders API
app.use('/api/orders', createOrdersRouter(pool, authorize));

app.get('/api/diagnostic-status', authorize(['Admin']), async (req, res) => {
  try {
    const colRes = await pool.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'order_units' 
        AND column_name IN ('sales_cleared', 'sales_cleared_at', 'sales_cleared_by', 'po_override_unlinked')
    `);
    const ordersCount = await pool.query('SELECT count(*) FROM orders');
    const unitsCount = await pool.query('SELECT count(*) FROM order_units');
    res.json({
      serverTime: new Date().toISOString(),
      columnsFound: colRes.rows.map(r => r.column_name),
      ordersCount: ordersCount.rows[0].count,
      unitsCount: unitsCount.rows[0].count,
    });
  } catch (err) {
    console.error('Realign pipeline stats failed:', err);
    res.status(500).json({ error: publicErrorMessage(err, 'Failed to load pipeline counts') });
  }
});

app.get('/api/board', authorize(), async (req, res) => {
  try {
    const ordersResult = await pool.query(
      `SELECT o.id, o.order_number, o.po_number, o.delivery_date, o.priority, o.notes,
              o.reference_number, o.end_client_name, o.classification, o.hold_status, o.status as order_status,
              c.name AS company_name, l.city AS company_city,
              (SELECT COUNT(*) FROM order_units ou WHERE ou.order_id = o.id) AS unit_count,
              (SELECT COUNT(*) FROM order_line_items oli WHERE oli.order_id = o.id) AS line_item_count,
              COALESCE(
                (SELECT MAX(s.created_at) FROM order_steps s WHERE s.order_id = o.id),
                o.created_at
              ) AS updated_at
       FROM orders o
       LEFT JOIN company_locations l ON o.company_location_id = l.id
       LEFT JOIN companies c ON l.company_id = c.id
       ORDER BY o.created_at DESC`
    );

    // Fetch order-level steps
    const orderStepsRes = await pool.query(
      `SELECT s.id, s.order_id, s.dept, s.name, s.status, s.requires_upload, s.notes, s.step_order
       FROM order_steps s
       ORDER BY s.step_order ASC, s.id ASC`
    );

    // Fetch unit-level steps joined with order_units to get order_id
    const unitStepsRes = await pool.query(
      `SELECT s.id, u.order_id, s.dept, CONCAT(u.short_serial, ': ', s.name) as name, s.status, s.requires_upload, s.notes, s.step_order
       FROM unit_steps s
       JOIN order_units u ON s.order_unit_id = u.id
       ORDER BY s.step_order ASC, s.id ASC`
    );

    const orderStepsByOrderId = new Map();
    for (const s of orderStepsRes.rows) {
      let list = orderStepsByOrderId.get(s.order_id);
      if (!list) {
        list = [];
        orderStepsByOrderId.set(s.order_id, list);
      }
      list.push({
        id: `o_${s.id}`,
        dept: s.dept,
        name: s.name,
        status: s.status,
        notes: s.notes
      });
    }

    const unitStepsByOrderId = new Map();
    for (const s of unitStepsRes.rows) {
      let list = unitStepsByOrderId.get(s.order_id);
      if (!list) {
        list = [];
        unitStepsByOrderId.set(s.order_id, list);
      }
      list.push({
        id: `u_${s.id}`,
        dept: s.dept,
        name: s.name,
        status: s.status,
        notes: s.notes
      });
    }

    const orders = ordersResult.rows.map(o => {
      const oSteps = orderStepsByOrderId.get(o.id) || [];
      const uSteps = unitStepsByOrderId.get(o.id) || [];
      const allSteps = [...oSteps, ...uSteps];

      let status = 'incomplete';
      if (o.hold_status === 'Approved' || String(o.order_status || '').toLowerCase().startsWith('hold')) {
        status = 'hold';
      } else if (String(o.order_status || '').toLowerCase().startsWith('cancel')) {
        status = 'cancelled';
      } else if (allSteps.length === 0) {
        status = 'no_steps';
      } else if (allSteps.every(s => s.status === 'done')) {
        status = 'completed';
      }

      return {
        ...o,
        status,
        steps: allSteps
      };
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/api/planning', createPlanningRouter(pool, authorize));

app.use('/api/units', createUnitsRouter(pool, authorize));

app.get('/api/dept-worklist/:dept', authorize(), async (req, res) => {
  const dept = req.params.dept;
  try {
    if (dept === 'Purchase' || dept === 'all') {
      try {
        const pUnits = await pool.query("SELECT id FROM order_units WHERE current_dept = 'Purchase'");
        if (pUnits.rows.length > 0) {
          await evaluatePurchaseAutoCompletion(pUnits.rows.map(r => r.id), pool, deriveUnitStatus, { by: 'id' });
        }
      } catch (evalErr) {
        console.warn('evaluatePurchaseAutoCompletion warn in dept-worklist:', evalErr);
      }
    }

    // Get all units currently in this department (or all units if Sales)
    const result = await pool.query(`
      SELECT
        ou.id          AS unit_id,
        ou.unit_id     AS unit_serial,
        ou.short_serial,
        ou.status      AS unit_status,
        ou.current_dept,
        ou.hold_status,
        ou.hold_step_id,
        ou.hold_step_name,
        ou.hold_dept,
        ou.hold_reason,
        ou.held_by_name,
        ou.held_at,
        ou.cancelled_step_id,
        ou.cancelled_step_name,
        ou.cancelled_dept,
        ou.cancelled_reason,
        ou.cancelled_by_name,
        ou.cancelled_at,
        o.id           AS order_id,
        o.order_number,
        CASE WHEN COALESCE(ou.po_override_unlinked, false) = true THEN ou.po_number ELSE COALESCE(ou.po_number, o.po_number) END AS po_number,
        ou.po_number   AS unit_po_number,
        o.po_number    AS order_po_number,
        ou.po_doc_id,
        ou.po_override_unlinked,
        ou.sales_cleared,
        ou.sales_cleared_at,
        ou.sales_cleared_by,
        CASE WHEN COALESCE(ou.po_override_unlinked, false) = true THEN podoc.file_path ELSE COALESCE(podoc.file_path, opodoc.file_path) END AS po_file_path,
        CASE WHEN COALESCE(ou.po_override_unlinked, false) = true THEN podoc.file_name ELSE COALESCE(podoc.file_name, opodoc.file_name) END AS po_file_name,
        o.reference_number,
        COALESCE(ou.tag, oli.tag) AS tag,
        oindentdoc.file_path AS indent_file_path,
        oindentdoc.file_name AS indent_file_name,
        oindentdoc.id AS indent_doc_id,
        o.end_client_name,
        o.priority,
        o.delivery_date,
        o.hold_status  AS order_hold_status,
        o.status       AS order_status,
        COALESCE(ou.classification, o.classification, 'Standard') AS classification,
        cl.city        AS company_city,
        co.name        AS company_name,
        oli.id         AS line_item_id,
        oli.line_item_number,
        oli.material_description,
        oli.part_number,
        COALESCE(oli.project_name, o.project_name) AS project_name,
        COALESCE(ou.panel_type_size, oli.panel_type_size) AS panel_type_size,
        psm.panel_code AS panel_code,
        psm.ip_rating  AS panel_ip_rating,
        COALESCE(psm.comments, psm.description) AS panel_comments,
        COALESCE(ou.custom_fields, '{}'::jsonb) AS custom_fields,
        COALESCE(ou.tray_status, 'Not Started') AS tray_status,
        ou.tray_start_date,
        ou.issued_date,
        ou.wiremen,
        ou.mounting_start_date,
        ou.mounting_complete_date,
        ou.wiring_start_date,
        ou.wiring_complete_date,
        ou.pending_material_complete_date,
        ou.handover_to_qc_date,
        ou.qc_receiving_date,
        ou.qc_start_date,
        ou.qc_complete_date,
        ou.qc_status,
        ou.dispatch_date,
        ou.invoice_number,
        ou.invoice_date,
        ou.design_confirmed,
        ou.design_confirmed_at,
        ou.design_confirmed_by,
        u_conf.username AS design_confirmed_by_name,
        oli.quantity   AS batch_qty,
        ou.updated_at,
        (
          SELECT json_agg(sub.step_obj)
          FROM (
            SELECT json_build_object(
              'id', s.id,
              'name', s.name,
              'status', s.status,
              'dept', s.dept,
              'notes', s.notes,
              'updated', s.updated,
              'hold_reason', s.hold_reason,
              'held_by', s.held_by,
              'hold_at', s.hold_at,
              'assigned_user_id', s.assigned_user_id,
              'updated_at', s.updated_at
            ) AS step_obj,
            s.step_order,
            s.id
            FROM (
              SELECT us.id, us.name, us.status, us.dept, us.notes, us.updated, us.hold_reason, us.held_by, us.hold_at, us.assigned_user_id, us.step_order, us.updated_at
              FROM unit_steps us
              WHERE us.order_unit_id = ou.id 
                AND us.dept = (CASE WHEN $1 = 'all' THEN ou.current_dept ELSE $1 END)
              UNION ALL
              SELECT os.id, os.name, os.status, os.dept, os.notes, os.updated, NULL::text AS hold_reason, NULL::text AS held_by, NULL::timestamptz AS hold_at, NULL::integer AS assigned_user_id, os.step_order, NULL::timestamptz AS updated_at
              FROM order_steps os
              WHERE os.order_id = o.id 
                AND os.dept = 'Sales'
                AND ($1 = 'Sales' OR ($1 = 'all' AND ou.current_dept = 'Sales'))
            ) s
            ORDER BY s.step_order ASC NULLS LAST, s.id ASC
          ) sub
        ) AS dept_steps,
        (
          SELECT json_agg(
            json_build_object(
              'id', us.id,
              'name', us.name,
              'status', us.status,
              'dept', us.dept,
              'notes', us.notes,
              'updated', us.updated,
              'hold_reason', us.hold_reason,
              'held_by', us.held_by,
              'hold_at', us.hold_at,
              'assigned_user_id', us.assigned_user_id
            ) ORDER BY us.id
          )
          FROM unit_steps us
          WHERE us.order_unit_id = ou.id AND us.dept = 'Design'
        ) AS design_steps,
        (
          SELECT count(*)::int
          FROM unit_steps us
          WHERE us.order_unit_id = ou.id AND us.status = 'inprogress'
        ) AS inprogress_step_count,
        (
          SELECT count(*)::int
          FROM unit_steps us
          WHERE us.order_unit_id = ou.id AND us.status = 'done'
        ) AS done_step_count,
        (
          SELECT count(*)::int
          FROM order_steps os
          WHERE os.order_id = o.id AND os.status = 'inprogress'
        ) AS order_inprogress_step_count,
        (
          SELECT count(*)::int
          FROM order_steps os
          WHERE os.order_id = o.id AND os.status = 'done'
        ) AS order_done_step_count,
        CASE 
          WHEN $1 != 'all' AND (
            array_position(${PIPELINE_SQL_ARRAY}, ou.current_dept) >
            array_position(${PIPELINE_SQL_ARRAY}, $1)
            OR (ou.status IN ('Dispatched', 'Completed') AND $1 != 'Accounts')
          )
          THEN true 
          ELSE false 
        END AS is_downstream,
        CASE 
          WHEN $1 != 'all' AND (
            array_position(${PIPELINE_SQL_ARRAY}, ou.current_dept) >
            array_position(${PIPELINE_SQL_ARRAY}, $1)
            OR ou.status IN ('Dispatched', 'Completed')
            OR (
              ou.current_dept = $1 AND NOT EXISTS (
                SELECT 1 FROM unit_steps us 
                WHERE us.order_unit_id = ou.id AND us.dept = $1 AND us.status != 'done'
              ) AND (
                $1 != 'Sales' OR NOT EXISTS (
                  SELECT 1 FROM order_steps os 
                  WHERE os.order_id = o.id AND os.dept = 'Sales' AND os.status != 'done'
                )
              ) AND (
                $1 != 'Stores' OR (ou.tray_start_date IS NOT NULL AND ou.issued_date IS NOT NULL)
              )
            )
          )
          THEN true
          ELSE false
        END AS is_dept_completed
      FROM order_units ou
      JOIN orders o         ON ou.order_id = o.id
      JOIN order_line_items oli ON ou.line_item_id = oli.id
      LEFT JOIN company_locations cl ON o.company_location_id = cl.id
      LEFT JOIN companies co ON cl.company_id = co.id
      LEFT JOIN users u_conf ON ou.design_confirmed_by = u_conf.id
      LEFT JOIN panel_size_masters psm ON (
        psm.size_name = COALESCE(ou.panel_type_size, oli.panel_type_size)
        OR psm.panel_size = COALESCE(ou.panel_type_size, oli.panel_type_size)
        OR psm.panel_code = COALESCE(ou.panel_type_size, oli.panel_type_size)
      )
      LEFT JOIN documents podoc ON podoc.id = ou.po_doc_id
      LEFT JOIN LATERAL (
        SELECT file_path, file_name 
        FROM documents 
        WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'PO' 
        ORDER BY uploaded_at DESC 
        LIMIT 1
      ) opodoc ON true
      LEFT JOIN LATERAL (
        SELECT id, file_path, file_name 
        FROM documents 
        WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'Indent' 
        ORDER BY uploaded_at DESC 
        LIMIT 1
      ) oindentdoc ON true
      WHERE $1 = 'all' 
         OR ou.current_dept = $1 
         OR (
           array_position(${PIPELINE_SQL_ARRAY}, ou.current_dept) >
           array_position(${PIPELINE_SQL_ARRAY}, $1)
         )
         OR ou.status IN ('Dispatched', 'Completed')
         OR ou.hold_status IN ('Hold', 'Cancelled')
         OR ou.status = 'Cancelled'
         OR ou.status ILIKE 'hold%'
         OR o.hold_status = 'Approved'
         OR o.status = 'Cancelled'
         OR o.status ILIKE 'hold%'
         OR ($1 = 'Production' AND (
           ou.current_dept = 'Production'
           OR ((ou.status = 'Completed' OR oli.status = 'Completed') AND ou.current_dept NOT IN ('QC', 'Dispatch', 'Accounts'))
           OR EXISTS (
             SELECT 1 FROM unit_steps us 
             WHERE us.order_unit_id = ou.id 
               AND us.dept = 'Planning' 
               AND (us.status = 'done' OR us.status = 'completed')
               AND EXISTS (
                 SELECT 1 FROM unit_steps pus 
                 WHERE pus.order_unit_id = ou.id 
                   AND pus.dept = 'Production' 
                   AND pus.status != 'done'
               )
           )
         ))
         OR ($1 IN ('QC', 'Dispatch', 'Accounts') AND (
           ou.current_dept IN ('QC', 'Dispatch', 'Accounts')
           OR ou.handover_to_qc_date IS NOT NULL
           OR ou.qc_receiving_date IS NOT NULL
           OR ou.qc_start_date IS NOT NULL
           OR ou.qc_complete_date IS NOT NULL
           OR (ou.qc_status IS NOT NULL AND ou.qc_status != 'Pending')
           OR ou.dispatch_date IS NOT NULL
           OR ou.invoice_number IS NOT NULL
           OR ou.invoice_date IS NOT NULL
           OR ou.status IN ('QC Testing', 'Ready for Dispatch', 'Dispatched', 'Completed')
           OR (
             EXISTS (SELECT 1 FROM unit_steps pus WHERE pus.order_unit_id = ou.id AND pus.dept = 'Production')
             AND NOT EXISTS (SELECT 1 FROM unit_steps pus WHERE pus.order_unit_id = ou.id AND pus.dept = 'Production' AND pus.status != 'done')
           )
         ))
      ORDER BY o.priority DESC, o.delivery_date ASC NULLS LAST, ou.unit_id ASC
    `, [dept]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dept worklist' });
  }
});

// Masters API
app.use('/api/companies', createCompaniesRouter(pool, authorize));

app.use('/api/documents', createDocumentsRouter(pool, authorize, JWT_SECRET));

app.use('/api/task_masters', createTaskMastersRouter(pool, authorize));

// ── Column Masters & Department Column Visibility Endpoints ──────────
app.use('/api/column-masters', createColumnMastersRouter(pool, authorize));

// ── Part Number Masters Endpoints ─────────────────────────────────────────────
app.use('/api/part-number-masters', createPartNumberMastersRouter(pool, authorize));

// ── PANEL SIZE MASTERS API ──
app.use('/api/panel-size-masters', createPanelSizeMastersRouter(pool, authorize));

// ── Template Download ─────────────────────────────────────────────────────────
const templateHandler = (req, res) => {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Field Reference ─────────────────────────────────────────────
  const ref = [
    ['SECTION', 'FIELD', 'EXAMPLE / ALLOWED VALUES', 'REQUIRED?', 'NOTES'],
    ['── ORDER HEADER ──', '', '', '', ''],
    ['Company & Location', 'company_name', 'Acme Corp', 'YES', 'Must match Masters. Case-insensitive.'],
    ['Company & Location', 'company_city', 'Mumbai', 'YES', 'Must match Masters location city.'],
    ['Dates', 'order_date', '2026-05-19', 'YES', 'Format: YYYY-MM-DD'],
    ['Dates', 'delivery_date', '2026-07-31', 'YES', 'Overall delivery date. YYYY-MM-DD'],
    ['PO Details', 'po_number', 'PO-2026-1234', 'YES', 'Groups rows into one order. Same PO = same order.'],
    ['PO Details', 'priority', 'Medium', 'YES', 'Low | Medium | High | Urgent'],
    ['PO Details', 'packaging_type', 'Wooden Packaging', 'NO', 'Wooden Packaging | Foam Packaging'],
    ['PO Details', 'end_client_name', 'Basavanakolla site', 'NO', 'End client name / site location'],
    ['PO Details', 'project_name', 'Mooviboost Project', 'NO', 'Project / System Name'],
    ['PO Details', 'order_notes', 'Handle with care.', 'NO', 'Overall order notes'],
    ['PO Details', 'gst_number', '27AAAAA1111A1Z1', 'NO', 'GST Number of client'],
    ['PO Details', 'reference_number', 'REF-2026-99', 'NO', 'Customer Reference Number'],
    ['PO Details', 'classification', 'Standard', 'NO', 'Standard | Non-Standard (Defaults to Standard)'],
    ['── LINE ITEMS ──', '', '', '', 'One row per line item; repeat po_number to group into one order'],
    ['Line Item', 'line_item_number', '0001', 'YES', '0001, 0002, 0003 etc.'],
    ['Line Item', 'material_description', 'VFD Control Panel 22kW', 'YES', 'Full description'],
    ['Line Item', 'part_number', 'VFD-22K-STD', 'NO', 'Internal / customer part number'],
    ['Line Item', 'panel_type_size', 'VFD Panel 800x600', 'NO', 'Physical type/size'],
    ['Line Item', 'quantity', '3', 'YES', 'Positive integer'],
    ['Line Item', 'unit', 'Nos', 'YES', 'e.g. Nos, Sets, Pcs'],
    ['Line Item', 'unit_price', '45000', 'YES', 'Numeric only, no Rs.'],
    ['Line Item', 'total_price', '135000', 'AUTO', 'quantity x unit_price (leave blank — auto-calculated)'],
    ['Line Item', 'line_item_delivery_date', '2026-06-30', 'NO', 'YYYY-MM-DD; defaults to delivery_date'],
    ['Line Item', 'line_item_notes', 'FAT required before dispatch', 'NO', 'Item-level notes'],
    ['Line Item', 'tag', 'TG-01', 'NO', 'Line item tag (combined with reference_number as Ref/Tag)'],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(ref);
  ws1['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 42 }, { wch: 12 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Field Reference');

  // ── Sheet 2: Import Template — 2000 blank rows ready for bulk paste ──────
  const COLS = [
    'company_name', 'company_city', 'order_date', 'delivery_date',
    'po_number', 'priority', 'packaging_type', 'end_client_name', 'project_name', 'order_notes',
    'gst_number', 'reference_number', 'classification',
    'line_item_number', 'material_description', 'part_number', 'panel_type_size',
    'quantity', 'unit', 'unit_price', 'total_price',
    'line_item_delivery_date', 'line_item_notes', 'tag'
  ];

  // Visual group-label row so users understand which columns are order-level vs item-level
  const groupRow = [
    '<-- ORDER LEVEL: repeat these 13 columns on every row of the same PO -->',
    '', '', '', '', '', '', '', '', '', '', '', '',
    '<-- LINE ITEM LEVEL: one row = one item in the order -->',
    '', '', '', '', '', '', '', '', '', ''
  ];

  const exampleRows = [
    // ORDER 1 — PO-2026-1001 — 3 line items (same PO groups them into 1 order)
    ['Acme Corp', 'Mumbai', '2026-05-20', '2026-07-31', 'PO-2026-1001', 'High', 'Wooden Packaging', 'Basavanakolla site', 'Mooviboost Line 1', 'Rush order — deliver before monsoon', '27AAAAA1111A1Z1', 'REF-2026-99', 'Standard', '00010', 'VFD Control Panel 22kW', 'VFD-22K-STD', '800x600x300 mm', 3, 'Nos', 45000, 135000, '2026-06-30', 'FAT required before dispatch', 'TG-01'],
    ['Acme Corp', 'Mumbai', '2026-05-20', '2026-07-31', 'PO-2026-1001', 'High', 'Wooden Packaging', 'Basavanakolla site', 'Mooviboost Line 1', '', '27AAAAA1111A1Z1', 'REF-2026-99', 'Standard', '00020', 'Motor Control Centre 8 Way', 'MCC-400A-8W', '1600x800x400 mm', 2, 'Nos', 72000, 144000, '2026-07-15', '', 'TG-02'],
    ['Acme Corp', 'Mumbai', '2026-05-20', '2026-07-31', 'PO-2026-1001', 'High', 'Wooden Packaging', 'Basavanakolla site', 'Mooviboost Line 1', '', '27AAAAA1111A1Z1', 'REF-2026-99', 'Standard', '00030', 'Power Factor Correction Panel', 'PFCP-100K', '1000x800x300 mm', 1, 'Nos', 38000, 38000, '2026-07-20', 'Include capacitor bank', 'TG-03'],
    // ORDER 2 — PO-2026-1002 — 1 line item
    ['Beta Industries', 'Pune', '2026-05-22', '2026-08-15', 'PO-2026-1002', 'Medium', 'Foam Packaging', 'Pune Site', 'Solar Grid System', '', '27BBBBB2222B2Z2', 'REF-2026-100', 'Non-Standard', '00010', 'PLC Automation Panel', 'PLC-S7-300', '600x400x300 mm', 1, 'Nos', 90000, 90000, '2026-08-15', 'Include Siemens S7-300', 'PLC-01'],
    // ORDER 3 — PO-2026-1003 — 2 line items
    ['Gamma Systems', 'Chennai', '2026-05-25', '2026-09-01', 'PO-2026-1003', 'Low', 'Wooden Packaging', '', 'Warehouse Expansion', 'Standard delivery', '', '', 'Standard', '00010', 'Distribution Board 8 Way', 'DB-8W-63A', '500x400x200 mm', 5, 'Nos', 12000, 60000, '2026-09-01', '', ''],
    ['Gamma Systems', 'Chennai', '2026-05-25', '2026-09-01', 'PO-2026-1003', 'Low', 'Wooden Packaging', '', 'Warehouse Expansion', '', '', '', 'Standard', '00020', 'Surge Protection Device', 'SPD-40KA', '', 5, 'Nos', 4500, 22500, '2026-09-01', '', ''],
  ];

  // Pre-allocate 2000 blank rows so the sheet is bulk-paste ready
  const blankRows = Array.from({ length: 2000 }, () => COLS.map(() => ''));

  const tmpl = [groupRow, COLS, ...exampleRows, ...blankRows];
  const ws2 = XLSX.utils.aoa_to_sheet(tmpl);
  ws2['!cols'] = [20, 15, 13, 15, 20, 10, 18, 22, 38, 22, 22, 16, 18, 32, 18, 22, 10, 8, 12, 12, 24, 38].map(w => ({ wch: w }));
  // Freeze top 2 rows — headers stay visible scrolling through thousands of rows
  ws2['!freeze'] = { xSplit: 0, ySplit: 2, topLeftCell: 'A3', activePane: 'bottomLeft' };
  XLSX.utils.book_append_sheet(wb, ws2, 'Import Template');

  // ── Sheet 3: How It Works — explicit multi-order walkthrough ─────────────
  const howto = [
    ['HOW THIS SHEET WORKS — MULTI-ORDER BULK IMPORT', '', ''],
    ['', '', ''],
    ['KEY RULE:', 'Each ROW = one Line Item.', ''],
    ['', 'Rows with the SAME po_number are grouped into ONE order.', ''],
    ['', 'A DIFFERENT po_number = a NEW separate order.', ''],
    ['', 'No limit on rows. Import hundreds or thousands of orders at once.', ''],
    ['', '', ''],
    ['EXAMPLE — 3 orders, 6 rows:', '', ''],
    ['', '', ''],
    ['Row', 'po_number', 'RESULT'],
    ['1', 'PO-2026-1001 (item 1)', 'Part of ORDER 1'],
    ['2', 'PO-2026-1001 (item 2)', 'Part of ORDER 1'],
    ['3', 'PO-2026-1001 (item 3)', 'Part of ORDER 1  <-- 3 rows = 1 order with 3 line items'],
    ['4', 'PO-2026-1002 (item 1)', 'ORDER 2  <-- different PO = new order'],
    ['5', 'PO-2026-1003 (item 1)', 'Part of ORDER 3'],
    ['6', 'PO-2026-1003 (item 2)', 'Part of ORDER 3  <-- 2 rows = 1 order with 2 line items'],
    ['', '', ''],
    ['RESULT:', '3 orders created. ORDER 1 has 3 line items, ORDER 2 has 1, ORDER 3 has 2.', ''],
    ['', '', ''],
    ['SCALE:', 'The Import Template sheet has 2000 blank rows pre-loaded.', ''],
    ['', 'Excel supports ~1,048,576 rows — you can paste as many as you need.', ''],
    ['', 'Each order processes in its own DB transaction.', ''],
    ['', 'If one PO fails (e.g. company not found), the others still succeed.', ''],
    ['', 'The upload result screen shows a per-PO success/error breakdown.', ''],
    ['', '', ''],
    ['TIPS:', '', ''],
    ['', '1. Keep rows for the same order together (sort by po_number) — not required but cleaner.', ''],
    ['', '2. company_name + company_city must match Masters exactly (case-insensitive).', ''],
    ['', '3. Dates: type as YYYY-MM-DD. Format the column as Text in Excel first to avoid auto-conversion.', ''],
    ['', '4. Leave total_price blank — always recalculated as quantity x unit_price on the server.', ''],
    ['', '5. Documents (PO copy, Quotation) cannot be included here. Attach them after import.', ''],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(howto);
  ws3['!cols'] = [{ wch: 12 }, { wch: 78 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'How It Works');

  // ── Sheet 4: Validation Rules ─────────────────────────────────────────────
  const rules = [
    ['FIELD', 'TYPE', 'REQUIRED', 'ALLOWED VALUES / FORMAT', 'IF WRONG'],
    ['company_name', 'Text', 'YES', 'Exact name in Masters (case-insensitive)', 'Order fails — company not found'],
    ['company_city', 'Text', 'YES', 'Exact city in Masters (case-insensitive)', 'Order fails — location not found'],
    ['order_date', 'Date', 'YES', 'YYYY-MM-DD', 'Rejected if invalid'],
    ['delivery_date', 'Date', 'YES', 'YYYY-MM-DD', 'Rejected if invalid'],
    ['po_number', 'Text', 'YES', 'Any alphanumeric string', 'Row skipped if blank'],
    ['priority', 'Enum', 'YES', 'Low | Medium | High | Urgent', 'Defaults to Medium'],
    ['packaging_type', 'Enum', 'NO', 'Wooden Packaging | Foam Packaging', 'Left blank if invalid'],
    ['end_client_name', 'Text', 'NO', 'End client name / site location', 'Left blank if missing'],
    ['quantity', 'Integer', 'YES', 'Positive whole number', 'Defaults to 1'],
    ['unit', 'Text', 'YES', 'Nos, Sets, Pcs ...', 'Defaults to Nos'],
    ['unit_price', 'Decimal', 'YES', 'Numeric, no Rs.', 'Defaults to 0'],
    ['total_price', 'Decimal', 'AUTO', 'quantity x unit_price', 'Always recalculated server-side'],
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(rules);
  ws4['!cols'] = [{ wch: 26 }, { wch: 10 }, { wch: 12 }, { wch: 48 }, { wch: 42 }];
  XLSX.utils.book_append_sheet(wb, ws4, 'Validation Rules');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Disposition', 'attachment; filename="order_import_template.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
};

app.get('/api/template/download', templateHandler);
app.get('/api/template/order_import_template.xlsx', templateHandler);

// Static files with Security Sandboxing & Scoped Download Tickets
const authorizeUploadDownload = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox");
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  // 1. Authorization: Bearer header (the user must still exist)
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err || !decoded || decoded.sub === 'download' || !decoded.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      try {
        const userRes = await pool.query('SELECT id, role FROM users WHERE id = $1', [decoded.id]);
        if (userRes.rows.length === 0) {
          return res.status(401).json({ error: 'Unauthorized: User does not exist' });
        }
        req.user = { ...decoded, role: userRes.rows[0].role };
        return next();
      } catch (dbErr) {
        console.error('Upload download auth DB check failed:', dbErr);
        return res.status(500).json({ error: 'Internal server error during authorization' });
      }
    });
    return;
  }

  // 2. Short-lived scoped download ticket: ?ticket=...
  if (req.query.ticket) {
    const ticket = req.query.ticket;
    jwt.verify(ticket, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: 'Unauthorized: Download ticket expired or invalid' });
      }
      if (decoded.sub !== 'download') {
        return res.status(403).json({ error: 'Forbidden: Invalid ticket type' });
      }
      const reqFile = path.basename(req.path);
      if (decoded.file && decoded.file !== reqFile) {
        return res.status(403).json({ error: 'Forbidden: Ticket does not match requested file' });
      }
      req.user = decoded;
      return next();
    });
    return;
  }

  return res.status(401).json({ error: 'Unauthorized: No authorization header or valid download ticket provided' });
};

app.use('/uploads', authorizeUploadDownload, express.static(path.join(__dirname, 'uploads'), {
  dotfiles: 'ignore',
  index: false
}));

// Error handling
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  if (err instanceof multer.MulterError) {
    cleanupUploadedFiles(req.files || req.file);
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  if (err && err.code === 'UPLOAD_TYPE_REJECTED') {
    // Multer may already have written earlier files of a multi-file request
    cleanupUploadedFiles(req.files || req.file);
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: publicErrorMessage(err, 'Internal server error') });
});

// Auto-seed Admin User 'Saya' if not present
const seedSayaUser = async () => {
  try {
    // Auto-migrate tables at boot to support Reference Number and Hold Status
    await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS reference_number TEXT');
    await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS hold_status TEXT DEFAULT 'None'");
    await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'Standard'");

    // Ensure panel_size_masters columns exist and are backfilled
    await pool.query(`
      ALTER TABLE panel_size_masters 
      ADD COLUMN IF NOT EXISTS panel_code TEXT,
      ADD COLUMN IF NOT EXISTS panel_size TEXT,
      ADD COLUMN IF NOT EXISTS ip_rating TEXT,
      ADD COLUMN IF NOT EXISTS comments TEXT;

      UPDATE panel_size_masters 
      SET panel_size = COALESCE(panel_size, size_name),
          comments = COALESCE(comments, description)
      WHERE panel_size IS NULL OR comments IS NULL;


      INSERT INTO column_masters (col_key, label, category, field_type, is_system, sort_order) VALUES
        ('panel_code',      'Panel Code',        'LineItem', 'Text', true, 9),
        ('panel_ip_rating', 'IP Rating',         'LineItem', 'Text', true, 11),
        ('panel_comments',  'Comments',          'LineItem', 'Text', true, 12)
      ON CONFLICT (col_key) DO NOTHING;

      INSERT INTO department_column_visibility (dept, col_key, is_visible)
      SELECT d.dept, c.col_key, true
      FROM unnest(${PIPELINE_SQL_ARRAY}) AS d(dept)
      CROSS JOIN (SELECT col_key FROM column_masters WHERE col_key IN ('panel_code', 'panel_ip_rating', 'panel_comments')) c
      ON CONFLICT (dept, col_key) DO NOTHING;

      CREATE TABLE IF NOT EXISTS part_number_masters (
        id SERIAL PRIMARY KEY,
        part_number TEXT UNIQUE NOT NULL,
        client_name TEXT,
        project TEXT,
        description TEXT,
        category TEXT NOT NULL DEFAULT 'Standard',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS part_number_documents (
        id SERIAL PRIMARY KEY,
        part_number_id INTEGER NOT NULL REFERENCES part_number_masters(id) ON DELETE CASCADE,
        doc_type TEXT NOT NULL DEFAULT 'Drawing',
        revision_number INTEGER NOT NULL DEFAULT 0,
        revision_label TEXT NOT NULL DEFAULT 'R0',
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT,
        file_size BIGINT DEFAULT 0,
        is_current BOOLEAN NOT NULL DEFAULT true,
        uploaded_by_id INTEGER REFERENCES users(id),
        uploaded_by_name TEXT,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE part_number_masters 
      ADD COLUMN IF NOT EXISTS client_name TEXT,
      ADD COLUMN IF NOT EXISTS project TEXT,
      ADD COLUMN IF NOT EXISTS panel_code TEXT;

      ALTER TABLE part_number_documents 
      ADD COLUMN IF NOT EXISTS doc_type TEXT DEFAULT 'Drawing',
      ADD COLUMN IF NOT EXISTS revision_number INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS revision_label TEXT DEFAULT 'R0',
      ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS uploaded_by_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS uploaded_by_name TEXT,
      ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0;

      UPDATE part_number_documents 
      SET doc_type = COALESCE(doc_type, 'Drawing'),
          revision_number = COALESCE(revision_number, 0),
          revision_label = COALESCE(revision_label, 'R0'),
          is_current = COALESCE(is_current, true)
      WHERE doc_type IS NULL OR revision_number IS NULL OR revision_label IS NULL OR is_current IS NULL;
    `);

    // Auto-migrate role constraints at boot to revert Planning default
    // One statement, so there is no window without the constraint.
    await pool.query(`
      ALTER TABLE users
        DROP CONSTRAINT IF EXISTS users_role_check,
        ADD CONSTRAINT users_role_check CHECK (role IN (${ALL_ROLES.map(r => `'${r}'`).join(', ')}))
    `);
    await pool.query("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'Viewer'");

    // Seed default Admin user ONLY if the users table is completely empty (0 users exist)
    const userCountRes = await pool.query('SELECT COUNT(*) FROM users');
    const userCount = parseInt(userCountRes.rows[0].count, 10);
    // The password comes from INITIAL_ADMIN_PASSWORD; there is no hardcoded default.
    if (userCount === 0) {
      const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;
      if (!initialPassword) {
        console.warn('No users found and INITIAL_ADMIN_PASSWORD is not set — skipping Admin seed. Set it and restart to create the first Admin.');
      } else {
        console.log('No users found in database. Seeding initial Admin user from INITIAL_ADMIN_PASSWORD...');
        const hashed = await bcrypt.hash(initialPassword, 10);
        await pool.query(
          `INSERT INTO users (username, email, password, role)
           VALUES ($1, $2, $3, $4)`,
          [
            'admin',
            process.env.INITIAL_ADMIN_EMAIL || 'admin@absolutemotion.in',
            hashed,
            'Admin'
          ]
        );
        console.log('Initial Admin user successfully seeded.');
      }
    }
  } catch (err) {
    console.warn('Could not auto-seed user Saya (database may still be starting up):', err.message);
  }
};

// Finish schema setup and migrations before accepting requests, so no request
// runs against a half-migrated database. Both steps log and continue on error.
const startServer = async () => {
  await initDB();
  await seedSayaUser().catch(console.error);
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
