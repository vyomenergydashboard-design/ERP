import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
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
import createPrd03Router from './routes/prd03.js';
import createOrdersRouter from './routes/orders.js';
import createAuthRouter from './routes/auth.js';
import createDiagnosticsRouter from './routes/diagnostics.js';
import createBoardRouter from './routes/board.js';
import createDeptWorklistRouter from './routes/deptWorklist.js';
import createTemplateRouter from './routes/template.js';
import { initEventStream } from './services/eventStream.js';
import { installAfterCommitHooks } from './services/afterCommit.js';
import { DEFAULT_STEPS } from './data/defaultTaskMasters.js';
import { ALL_ROLES, PIPELINE_SQL_ARRAY, deptOrderSql } from './data/workflow.js';
import { publicErrorMessage } from './services/httpErrors.js';
import { setSystemSeeding, deriveUnitStatus, updateOrderQCStatusFromSteps } from './services/unitStatus.js';
import { cleanupUploadedFiles } from './services/uploads.js';
import { sweepPurchaseAutoCompletion } from './services/purchaseAutoCompletion.js';

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
app.use('/api/auth', createAuthRouter(pool, authorize, JWT_SECRET));

// Logs & Users
app.use('/api/logs', createLogsRouter(pool, authorize));

app.use('/api/users', createUsersRouter(pool, authorize));

// System Settings API
app.use('/api/system-settings', createSystemSettingsRouter(pool, authorize));

// Orders API
app.use('/api/orders', createOrdersRouter(pool, authorize));

app.use('/api/diagnostic-status', createDiagnosticsRouter(pool, authorize));

app.use('/api/board', createBoardRouter(pool, authorize));

app.use('/api/planning', createPlanningRouter(pool, authorize));

app.use('/api/units', createUnitsRouter(pool, authorize));
app.use('/api/units', createPrd03Router(pool, authorize));

app.use('/api/dept-worklist', createDeptWorklistRouter(pool, authorize));

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
app.use('/api/template', createTemplateRouter());

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
  // Purchase auto-completion catch-up. Reads no longer run it; the write paths do, and this
  // catches anything they could not (see services/purchaseAutoCompletion.js).
  await sweepPurchaseAutoCompletion(pool, deriveUnitStatus)
    .then((updated) => {
      if (updated.length > 0) console.log(`[startup] Purchase auto-completion completed ${updated.length} unit(s)`);
    })
    .catch((err) => console.error('[startup] Purchase auto-completion sweep failed:', err));
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
