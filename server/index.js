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
import { evaluatePurchaseAutoCompletion } from './services/purchaseAutoCompletion.js';
import { initEventStream } from './services/eventStream.js';
import { safeEvaluateCondition } from './services/safeConditionEvaluator.js';
import { installAfterCommitHooks } from './services/afterCommit.js';
import { DEFAULT_STEPS } from './data/defaultTaskMasters.js';
import { PIPELINE, ALL_ROLES, OPERATOR_ROLES, PIPELINE_SQL_ARRAY, deptOrderSql } from './data/workflow.js';
import { publicErrorMessage } from './services/httpErrors.js';
import { isOrderOnHold } from './services/holds.js';
import { sendHoldRequestEmail } from './services/notifications.js';
import { setSystemSeeding, deriveUnitStatus, evaluateUnitDesignDocuments, updateOrderQCStatusFromSteps } from './services/unitStatus.js';
import { upload, cleanupUploadedFiles } from './services/uploads.js';
import { formatOrderNumber, parseOrderCounter, lockSerialAllocation, generateOrderNumber } from './services/orderNumbers.js';
import { resolveCustomFieldValues, propagateCustomFieldsToDB } from './services/customFields.js';

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

// Orders & Documents API
app.post('/api/orders', authorize(['Admin', 'Manager', 'Sales']), upload.any(), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { order_date, delivery_date, notes, company_location_id, lineItems, priority, po_number, packaging_type, end_client_name, gst_number, reference_number, classification, project_name } = req.body;
    let parsedLineItems = [];
    try {
      parsedLineItems = JSON.parse(lineItems);
    } catch (e) {
      // Ignore
    }

    // Validate line item price values to prevent Postgres numeric field overflow
    for (const li of parsedLineItems) {
      const qty = parseInt(li.quantity) || 1;
      const uPrice = parseFloat(li.unit_price) || 0;
      const tPrice = parseFloat(li.total_price) || (qty * uPrice);

      if (isNaN(uPrice) || uPrice < 0 || uPrice > 9999999999999.99) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: "Unit price must be a valid number between 0 and 9,999,999,999,999.99." });
      }
      if (isNaN(tPrice) || tPrice < 0 || tPrice > 9999999999999.99) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: "Total price must be a valid number between 0 and 9,999,999,999,999.99." });
      }
    }

    // 1. Generate Order Number
    const order_number = await generateOrderNumber(client);

    const resolved_order_date = order_date || new Date().toISOString().split('T')[0];
    const orderDateObj = new Date(resolved_order_date);
    const year = orderDateObj.getFullYear();
    const resolved_delivery_date = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim()) ? delivery_date.trim() : null;

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, company_location_id, order_date, delivery_date, notes, priority, po_number, packaging_type, created_by, end_client_name, gst_number, reference_number, classification, project_name) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [order_number, company_location_id || null, resolved_order_date, resolved_delivery_date, notes, priority || 'Medium', po_number || null, packaging_type || null, req.user.id, end_client_name || null, gst_number || null, reference_number || null, classification || 'Standard', project_name || null]
    );
    const order = orderResult.rows[0];

    // 2. Insert Line Items
    const maxUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
    let max_unit_seq = parseOrderCounter(maxUnitRes.rows[0]?.max_unit);
    let order_seq = parseOrderCounter(order_number);
    let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);
    let totalUnits = 0;
    const createdUnits = [];

    let itemIdx = 1;
    for (const li of parsedLineItems) {
      const qty = parseInt(li.quantity) || 1;
      const assigned_li_number = `${order_number}-${String(itemIdx).padStart(2, '0')}`;
      itemIdx++;

      const cleanTag = (li.tag && typeof li.tag === 'string' && li.tag.trim()) ? li.tag.trim() : null;
      const li_delivery_date = (li.delivery_date && typeof li.delivery_date === 'string' && li.delivery_date.trim()) ? li.delivery_date.trim() : resolved_delivery_date;
      const rawDesc = (li.material_description && typeof li.material_description === 'string' && li.material_description.trim()) ? li.material_description.trim() : null;
      const rawPart = (li.part_number && typeof li.part_number === 'string' && li.part_number.trim()) ? li.part_number.trim() : null;
      // Anti-duplicate rule: if description is identical to part number, do not duplicate
      const cleanDesc = (rawDesc && rawPart && rawDesc.toLowerCase() === rawPart.toLowerCase()) ? null : rawDesc;
      const liResult = await client.query(
        `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number, panel_type_size, delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [order.id, assigned_li_number, cleanDesc, rawPart, li.panel_type_size, li_delivery_date, qty, li.unit, li.unit_price, li.total_price, li.notes, li.project_name || order.project_name || null, cleanTag]
      );
      const lineItem = liResult.rows[0];
      totalUnits += qty;

      for (let i = 0; i < qty; i++) {
        const unit_id = formatOrderNumber(year, globalUnitCounter);
        const short_serial = unit_id;
        const unitResult = await client.query(
          `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanTag]
        );
        createdUnits.push(unitResult.rows[0].id);
        globalUnitCounter++;
      }
    }

    // 3. Auto-assign mandatory steps
    const tasksResult = await client.query(`
      SELECT * FROM task_masters 
      WHERE is_mandatory = true 
      ORDER BY 
        ${deptOrderSql('dept')} ASC,
        id ASC
    `);
    let tasks = tasksResult.rows;
    if (tasks.length === 0) {
      tasks = DEFAULT_STEPS;
    }

    const orderTasks = tasks.filter(t => t.level === 'order');
    const unitTasks = tasks.filter(t => t.level === 'unit');

    // Insert order-level milestones
    for (let i = 0; i < orderTasks.length; i++) {
      const task = orderTasks[i];
      let fieldDefs = [];
      if (task.id) {
        try {
          const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
          fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
        } catch { fieldDefs = []; }
      }

      await client.query(
        `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [order.id, task.id || null, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
      );
    }

    // Insert unit-level production steps for each unit
    for (const unitDbId of createdUnits) {
      for (let i = 0; i < unitTasks.length; i++) {
        const task = unitTasks[i];
        let fieldDefs = [];
        if (task.id) {
          try {
            const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
            fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
          } catch { fieldDefs = []; }
        }

        await client.query(
          `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order) 
           VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
          [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
        );
      }
      // Derive initial unit status
      await deriveUnitStatus(unitDbId, client);
    }

    // 4. Save Uploaded Documents
    let hasPO = false;
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let docType = 'General';
        const field = file.fieldname.toLowerCase();
        if (field.includes('po')) {
          docType = 'PO';
          hasPO = true;
        }
        else if (field.includes('quotation')) docType = 'Quotation';
        else if (field.includes('approved')) docType = 'Approved';
        else if (field.includes('indent')) docType = 'Indent';

        await client.query(
          `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          ['Order', order.id, docType, file.originalname, file.path, file.size, file.mimetype, req.user.id]
        );
      }
    }

    // Auto-inherit master technical drawings from Part Number Masters
    for (const item of parsedLineItems) {
      if (item.part_number && item.part_number.trim()) {
        const pCheck = await client.query('SELECT id FROM part_number_masters WHERE LOWER(part_number) = LOWER($1)', [item.part_number.trim()]);
        if (pCheck.rows.length > 0) {
          const masterId = pCheck.rows[0].id;
          const pDocs = await client.query('SELECT * FROM part_number_documents WHERE part_number_id = $1 AND is_current = true', [masterId]);
          for (const doc of pDocs.rows) {
            const masterDocType = doc.doc_type || 'Drawing';
            await client.query(
              `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
               VALUES ('Order', $1, $2, $3, $4, $5)`,
              [order.id, masterDocType, `[Master ${masterDocType}] ${doc.file_name}`, doc.file_path, req.user.id]
            );
          }
        }
      }
    }

    if (hasPO) {
      if ((!po_number || !po_number.trim()) && req.files) {
        const poFile = req.files.find(f => f.fieldname && f.fieldname.toLowerCase().includes('po'));
        if (poFile) {
          const derivedPo = poFile.originalname.replace(/\.[^/.]+$/, '').trim();
          await client.query('UPDATE orders SET po_number = $1 WHERE id = $2', [derivedPo, order.id]);
          order.po_number = derivedPo;
        }
      }

      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      await client.query(
        `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
        ['PO uploaded during order creation.', updatedStr, order.id]
      );
      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, order.id, 'Sales', 'Completed: Upload PO (System Auto-Check)']
      );
      // Re-derive unit status for all units in this order so they advance out of Sales gating
      for (const unitDbId of createdUnits) {
        await deriveUnitStatus(unitDbId, client);
      }
    }

    await client.query(
      `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, 'Sales', $3)`,
      [req.user.id, order.id, `Created order ${order_number} with ${totalUnits} units`]
    );

    await client.query('COMMIT');
    res.status(201).json({ order, message: `Order ${order_number} created with ${totalUnits} units.` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id/classification', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  try {
    const { classification } = req.body;
    if (!['Standard', 'Non-Standard'].includes(classification)) {
      return res.status(400).json({ error: 'Classification must be Standard or Non-Standard' });
    }

    const checkOrder = await pool.query('SELECT order_number, classification FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const oldClass = checkOrder.rows[0].classification || 'Standard';
    const order_number = checkOrder.rows[0].order_number;

    await pool.query('UPDATE orders SET classification = $1 WHERE id = $2', [classification, req.params.id]);

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Changed classification of order ${order_number} from "${oldClass}" to "${classification}"`, req.params.id]
    );

    res.json({ success: true, classification, message: `Order ${order_number} classification updated to ${classification}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order classification' });
  }
});

app.delete('/api/orders/:id', authorize(['Admin']), async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Lock the order row (order numbers / unit serials are immutable: NEVER resequence on delete)
    const orderCheck = await client.query('SELECT id, order_number FROM orders WHERE id = $1 FOR UPDATE', [id]);
    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }
    const orderNumberToDelete = orderCheck.rows[0].order_number;

    // 2. Log action to activity logs
    await client.query(
      `INSERT INTO activity_logs (user_id, action_text, dept) VALUES ($1, $2, $3)`,
      [req.user.id, `Deleted order: ${orderNumberToDelete} (ID: ${id})`, 'Admin']
    );

    // 3. Remove polymorphic documents for the order, its units and its steps.
    //    'Step' entity ids are shared between order_steps and unit_steps, so a Step document is only
    //    removed when its id cannot belong to a step of another order.
    await client.query(
      `DELETE FROM documents d
        WHERE (d.entity_type = 'Order' AND d.entity_id = $1)
           OR (d.entity_type = 'Unit' AND d.entity_id IN (SELECT id FROM order_units WHERE order_id = $1))
           OR (d.entity_type = 'Step'
               AND (d.entity_id IN (SELECT id FROM order_steps WHERE order_id = $1)
                    OR d.entity_id IN (SELECT us.id FROM unit_steps us JOIN order_units ou ON us.order_unit_id = ou.id WHERE ou.order_id = $1))
               AND d.entity_id NOT IN (SELECT id FROM order_steps WHERE order_id <> $1)
               AND d.entity_id NOT IN (SELECT us.id FROM unit_steps us JOIN order_units ou ON us.order_unit_id = ou.id WHERE ou.order_id <> $1))`,
      [id]
    );

    // 4. Delete the order (FK cascades delete line items, units, unit steps, order steps)
    await client.query('DELETE FROM orders WHERE id = $1', [id]);

    await client.query('COMMIT');
    res.json({ message: `Order ${orderNumberToDelete} deleted successfully` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order deletion error:', err);
    res.status(500).json({ error: 'Failed to delete order' });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  const {
    company_location_id,
    order_date,
    delivery_date,
    notes,
    priority,
    po_number,
    packaging_type,
    end_client_name,
    gst_number,
    reference_number,
    classification,
    project_name
  } = req.body;

  try {
    const checkOrder = await pool.query('SELECT order_number, order_date FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const { order_number, order_date: existing_order_date } = checkOrder.rows[0];

    const resolved_order_date = order_date || (existing_order_date ? (existing_order_date instanceof Date ? existing_order_date.toISOString().split('T')[0] : String(existing_order_date).split('T')[0]) : new Date().toISOString().split('T')[0]);

    if (delivery_date !== undefined) {
      // Auto-update all line items' delivery dates if delivery_date was explicitly changed
      await pool.query(
        'UPDATE order_line_items SET delivery_date = $1 WHERE order_id = $2',
        [delivery_date || null, req.params.id]
      );
    }

    const result = await pool.query(
      `UPDATE orders 
       SET company_location_id = COALESCE($1, company_location_id), 
           order_date = COALESCE($2, order_date), 
           delivery_date = COALESCE($3, delivery_date), 
           notes = CASE WHEN $4::text IS NOT NULL THEN $4 ELSE notes END, 
           priority = COALESCE($5, priority), 
           po_number = CASE WHEN $6::text IS NOT NULL THEN $6 ELSE po_number END, 
           packaging_type = CASE WHEN $7::text IS NOT NULL THEN $7 ELSE packaging_type END, 
           end_client_name = CASE WHEN $8::text IS NOT NULL THEN $8 ELSE end_client_name END, 
           gst_number = CASE WHEN $9::text IS NOT NULL THEN $9 ELSE gst_number END, 
           reference_number = CASE WHEN $10::text IS NOT NULL THEN $10 ELSE reference_number END,
           classification = COALESCE($11, classification),
           project_name = CASE WHEN $12::text IS NOT NULL THEN $12 ELSE project_name END
       WHERE id = $13 
       RETURNING *`,
      [
        company_location_id ? parseInt(company_location_id) : null,
        order_date || null,
        delivery_date || null,
        notes !== undefined ? notes : null,
        priority || null,
        po_number !== undefined ? po_number : null,
        packaging_type !== undefined ? packaging_type : null,
        end_client_name !== undefined ? end_client_name : null,
        gst_number !== undefined ? gst_number : null,
        reference_number !== undefined ? reference_number : null,
        classification || null,
        project_name !== undefined ? project_name : null,
        req.params.id
      ]
    );

    // If project_name was updated, also sync line items
    if (project_name !== undefined) {
      await pool.query('UPDATE order_line_items SET project_name = $1 WHERE order_id = $2', [project_name || null, req.params.id]);
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [
        req.user.id,
        req.user.role,
        `Amended order details for ${order_number}`,
        req.params.id
      ]
    );

    // Sync units' deriveUnitStatus after order details change
    const unitsRes = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [req.params.id]);
    for (const unit of unitsRes.rows) {
      await deriveUnitStatus(unit.id, pool);
    }

    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error('Failed to amend order details:', err);
    res.status(500).json({ error: 'Failed to amend order details' });
  }
});

// Amend a single line item's core details
app.put('/api/orders/:orderId/line-items/:liId', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  const { orderId, liId } = req.params;
  const {
    material_description,
    part_number,
    panel_type_size,
    quantity,
    unit,
    unit_price,
    delivery_date,
    notes,
    tag,
  } = req.body;

  try {
    // Verify the order exists and fetch order_date
    const orderCheck = await pool.query('SELECT order_number, hold_status, order_date FROM orders WHERE id = $1', [orderId]);
    if (orderCheck.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const { order_number, hold_status, order_date } = orderCheck.rows[0];
    if (hold_status === 'Approved') return res.status(403).json({ error: 'Order is on hold. Amendments are disabled.' });

    // Verify the line item belongs to this order
    const liCheck = await pool.query('SELECT id FROM order_line_items WHERE id = $1 AND order_id = $2', [liId, orderId]);
    if (liCheck.rows.length === 0) return res.status(404).json({ error: 'Line item not found for this order' });

    const updates = [];
    const values = [];
    let idx = 1;

    if (material_description !== undefined) {
      updates.push(`material_description = $${idx++}`);
      values.push(material_description || null);
    }
    if (part_number !== undefined) {
      updates.push(`part_number = $${idx++}`);
      values.push(part_number || null);
    }
    if (panel_type_size !== undefined) {
      updates.push(`panel_type_size = $${idx++}`);
      values.push(panel_type_size || null);
    }
    if (quantity !== undefined) {
      const qty = quantity ? parseInt(quantity) : null;
      updates.push(`quantity = $${idx++}`);
      values.push(qty);
    }
    if (unit !== undefined) {
      updates.push(`unit = $${idx++}`);
      values.push(unit || null);
    }
    if (unit_price !== undefined) {
      const price = unit_price ? parseFloat(unit_price) : null;
      if (price !== null && (isNaN(price) || price < 0 || price > 9999999999999.99)) {
        return res.status(400).json({ error: "Unit price must be a valid number between 0 and 9,999,999,999,999.99." });
      }
      updates.push(`unit_price = $${idx++}`);
      values.push(price);
    }
    if (req.body.total_price !== undefined || (quantity !== undefined && unit_price !== undefined)) {
      let total = null;
      if (req.body.total_price !== undefined) {
        total = parseFloat(req.body.total_price);
      } else if (quantity && unit_price) {
        total = parseInt(quantity) * parseFloat(unit_price);
      }
      if (total !== null && (isNaN(total) || total < 0 || total > 9999999999999.99)) {
        return res.status(400).json({ error: "Total price must be a valid number between 0 and 9,999,999,999,999.99." });
      }
      updates.push(`total_price = $${idx++}`);
      values.push(total);
    }
    if (delivery_date !== undefined) {
      const cleanDeliveryDate = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim()) ? delivery_date.trim() : null;
      updates.push(`delivery_date = $${idx++}`);
      values.push(cleanDeliveryDate);
    }
    if (tag !== undefined) {
      const cleanTag = (tag && typeof tag === 'string' && tag.trim()) ? tag.trim() : null;
      updates.push(`tag = $${idx++}`);
      values.push(cleanTag);
      // Synchronize tag to all units associated with this line item
      await pool.query('UPDATE order_units SET tag = $1 WHERE line_item_id = $2', [cleanTag, liId]);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${idx++}`);
      values.push(notes || null);
    }

    if (updates.length === 0) {
      return res.json({ success: true, message: 'No changes provided' });
    }

    values.push(liId);
    const result = await pool.query(
      `UPDATE order_line_items
       SET ${updates.join(', ')}
       WHERE id = $${idx}
       RETURNING *`,
      values
    );

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Amended line item ${result.rows[0].line_item_number} on order ${order_number}`, orderId]
    );

    res.json({ success: true, line_item: result.rows[0] });
  } catch (err) {
    console.error('Failed to amend line item:', err);
    res.status(500).json({ error: 'Failed to amend line item' });
  }
});

// Add a new line item (and corresponding units & steps) to an existing order
app.post('/api/orders/:orderId/line-items', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  const { orderId } = req.params;
  const {
    material_description,
    part_number,
    panel_type_size,
    quantity,
    unit,
    unit_price,
    delivery_date,
    notes,
    tag,
  } = req.body;

  const rawDesc = (material_description && typeof material_description === 'string' && material_description.trim()) ? material_description.trim() : null;
  const rawPart = (part_number && typeof part_number === 'string' && part_number.trim()) ? part_number.trim() : null;

  if (!rawDesc && !rawPart) {
    return res.status(400).json({ error: 'Either Material description or Part number is required.' });
  }

  // Anti-duplicate rule: if description is identical to part number, do not duplicate
  const cleanDesc = (rawDesc && rawPart && rawDesc.toLowerCase() === rawPart.toLowerCase()) ? null : rawDesc;

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1.' });
  }

  const uPrice = parseFloat(unit_price) || 0;
  if (isNaN(uPrice) || uPrice < 0 || uPrice > 9999999999999.99) {
    return res.status(400).json({ error: 'Unit price must be a valid number between 0 and 9,999,999,999,999.99.' });
  }

  let tPrice = req.body.total_price !== undefined ? parseFloat(req.body.total_price) : (qty * uPrice);
  if (isNaN(tPrice) || tPrice < 0 || tPrice > 9999999999999.99) {
    return res.status(400).json({ error: 'Total price must be a valid number between 0 and 9,999,999,999,999.99.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify the order exists and is not on hold
    const orderCheck = await client.query(
      'SELECT id, order_number, hold_status, order_date, delivery_date, classification, project_name FROM orders WHERE id = $1',
      [orderId]
    );
    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = orderCheck.rows[0];
    if (order.hold_status === 'Approved') {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Order is on hold. Adding line items is disabled.' });
    }

    // 2. Determine next line item number suffix
    const existingLis = await client.query(
      'SELECT line_item_number FROM order_line_items WHERE order_id = $1',
      [order.id]
    );
    let maxItemIdx = 0;
    for (const row of existingLis.rows) {
      const match = String(row.line_item_number || '').match(/-(\d+)$/);
      if (match) {
        const parsed = parseInt(match[1], 10);
        if (parsed > maxItemIdx) maxItemIdx = parsed;
      }
    }
    const nextItemIdx = maxItemIdx > 0 ? maxItemIdx + 1 : (existingLis.rows.length + 1);
    const assigned_li_number = `${order.order_number}-${String(nextItemIdx).padStart(2, '0')}`;

    const cleanTag = (tag && typeof tag === 'string' && tag.trim()) ? tag.trim() : null;
    const resolvedDeliveryDate = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim())
      ? delivery_date.trim()
      : (order.delivery_date ? new Date(order.delivery_date).toISOString().split('T')[0] : null);

    // 3. Insert line item
    const liResult = await client.query(
      `INSERT INTO order_line_items (
        order_id, line_item_number, material_description, part_number, panel_type_size,
        delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        order.id,
        assigned_li_number,
        cleanDesc,
        rawPart,
        panel_type_size ? panel_type_size.trim() : null,
        resolvedDeliveryDate,
        qty,
        unit || 'Nos',
        uPrice,
        tPrice,
        notes || null,
        order.project_name || null,
        cleanTag,
      ]
    );
    const lineItem = liResult.rows[0];

    // 4. Determine starting unit serial sequence
    let year = new Date().getFullYear();
    if (order.order_date) {
      const d = new Date(order.order_date);
      if (!isNaN(d.getFullYear())) year = d.getFullYear();
    } else if (order.order_number && /^\d{8,}$/.test(order.order_number)) {
      const yy = parseInt(order.order_number.substring(0, 2), 10);
      if (!isNaN(yy)) year = 2000 + yy;
    }

    await lockSerialAllocation(client);
    const maxUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
    let max_unit_seq = parseOrderCounter(maxUnitRes.rows[0]?.max_unit);
    let order_seq = parseOrderCounter(order.order_number);
    let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);

    // 5. Create units
    const createdUnits = [];
    for (let i = 0; i < qty; i++) {
      const unit_id = formatOrderNumber(year, globalUnitCounter);
      const short_serial = unit_id;
      const unitResult = await client.query(
        `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanTag]
      );
      createdUnits.push(unitResult.rows[0].id);
      globalUnitCounter++;
    }

    // 6. Assign mandatory unit-level steps
    const tasksResult = await client.query(`
      SELECT * FROM task_masters 
      WHERE is_mandatory = true AND level = 'unit'
      ORDER BY 
        ${deptOrderSql('dept')} ASC,
        id ASC
    `);
    let unitTasks = tasksResult.rows;
    if (unitTasks.length === 0) {
      unitTasks = DEFAULT_STEPS.filter(t => t.level === 'unit');
    }

    for (const unitDbId of createdUnits) {
      for (let i = 0; i < unitTasks.length; i++) {
        const task = unitTasks[i];
        let fieldDefs = [];
        if (task.id) {
          try {
            const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
            fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
          } catch { fieldDefs = []; }
        }

        await client.query(
          `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order) 
           VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
          [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
        );
      }
      // Derive initial unit status
      await deriveUnitStatus(unitDbId, client);
    }

    // 7. Activity Log
    await client.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Added line item ${assigned_li_number} (${qty} units) to order ${order.order_number}`, order.id]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, line_item: lineItem, units_created: createdUnits.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to add line item to order:', err);
    res.status(500).json({ error: publicErrorMessage(err, 'Failed to add line item to order') });
  } finally {
    client.release();
  }
});

app.post('/api/orders/:id/hold/request', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order_number = checkOrder.rows[0].order_number;

    await pool.query("UPDATE orders SET hold_status = 'Requested' WHERE id = $1", [req.params.id]);
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Requested hold for order ${order_number}`, req.params.id]
    );

    const userRes = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.id]);
    const requestedByUsername = userRes.rows[0]?.username || 'Sales User';
    sendHoldRequestEmail(req.params.id, order_number, requestedByUsername).catch(console.error);

    res.json({ success: true, message: 'Hold requested successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders/:id/hold/approve', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order_number = checkOrder.rows[0].order_number;

    await pool.query("UPDATE orders SET hold_status = 'Approved' WHERE id = $1", [req.params.id]);
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Approved hold for order ${order_number}`, req.params.id]
    );
    res.json({ success: true, message: 'Order put on hold.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders/:id/hold/reject', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order_number = checkOrder.rows[0].order_number;

    await pool.query("UPDATE orders SET hold_status = 'None' WHERE id = $1", [req.params.id]);
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Rejected hold request for order ${order_number}`, req.params.id]
    );
    res.json({ success: true, message: 'Hold request rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders/:id/hold/resume', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  try {
    const numId = !isNaN(Number(req.params.id)) ? Number(req.params.id) : -1;
    const checkOrder = await pool.query('SELECT id, order_number FROM orders WHERE id = $1 OR order_number = $2', [numId, String(req.params.id)]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order = checkOrder.rows[0];
    const order_number = order.order_number;
    const orderId = order.id;

    await pool.query("UPDATE orders SET hold_status = 'None' WHERE id = $1", [orderId]);
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Resumed order ${order_number}`, orderId]
    );

    // Sync all units belonging to this order so their statuses update from Hold to active pipeline
    const uRes = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [orderId]);
    for (const u of uRes.rows) {
      await deriveUnitStatus(u.id, pool);
    }

    res.json({ success: true, message: 'Order resumed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

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

app.post('/api/orders/realign-pipeline', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    for (const colDef of [
      'po_override_unlinked BOOLEAN DEFAULT FALSE',
      'sales_cleared BOOLEAN DEFAULT FALSE',
      'sales_cleared_at TIMESTAMP WITH TIME ZONE',
      'sales_cleared_by INTEGER'
    ]) {
      try {
        await pool.query(`ALTER TABLE order_units ADD COLUMN IF NOT EXISTS ${colDef}`);
      } catch (colErr) {
        console.warn(`[Realign Pipeline] Column check notice (${colDef}):`, colErr.message);
      }
    }
    await runDeploymentMigrations();
    const allUnits = await pool.query('SELECT id FROM order_units');
    for (const u of allUnits.rows) {
      await deriveUnitStatus(u.id, pool, true);
    }
    res.json({ success: true, message: 'Pipeline successfully realigned. Units without PO restored to Sales.' });
  } catch (err) {
    console.error('Failed to realign pipeline:', err);
    res.status(500).json({ error: publicErrorMessage(err, 'Failed to realign pipeline') });
  }
});

// ── BULK IMPORT via Excel ─────────────────────────────────────────────────────
// Accepts a single .xlsx file whose "Import Template" sheet follows the
// column layout generated by the sample template tool.
app.post('/api/orders/import', authorize(['Sales', 'Admin', 'Manager']), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  // 1. Parse the workbook — auto-detect which sheet and which row is the real header
  let rows;
  let detectedSheet = '';
  let detectedHeaders = [];
  try {
    const wb = XLSX.read(fs.readFileSync(req.file.path)); // xlsx 0.20 ESM build has no fs, so read the buffer here

    // Prefer "Import Template" sheet, otherwise try first sheet
    const sheetName = wb.SheetNames.includes('Import Template')
      ? 'Import Template'
      : wb.SheetNames[0];
    detectedSheet = sheetName;
    const ws = wb.Sheets[sheetName];

    // Convert to raw 2D array first so we can scan for the real header row
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    // Find the row index that contains 'po_number' — handles group-label rows above real headers
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(raw.length, 10); i++) {
      const rowStr = raw[i].map(c => String(c).toLowerCase().trim());
      if (rowStr.includes('po_number')) {
        headerRowIdx = i;
        break;
      }
    }

    if (headerRowIdx === -1) {
      fs.unlinkSync(req.file.path);
      const firstRowPreview = raw[0] ? raw[0].slice(0, 5).join(', ') : '(empty)';
      return res.status(400).json({
        error: `Column header "po_number" not found in the first 10 rows of sheet "${sheetName}". ` +
          `First row detected: [${firstRowPreview}]. ` +
          `Make sure you are filling the "Import Template" sheet from the downloaded template.`
      });
    }

    // Use that row as headers, parse data rows below it
    const headers = raw[headerRowIdx].map(h => String(h).trim());
    detectedHeaders = headers;
    rows = raw.slice(headerRowIdx + 1).map(rowArr => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = rowArr[i] !== undefined ? rowArr[i] : ''; });
      return obj;
    });
  } catch (err) {
    try { fs.unlinkSync(req.file.path); } catch (_) { }
    return res.status(400).json({ error: `Failed to read Excel file: ${err.message}` });
  }

  // Cleanup the temp upload
  try { fs.unlinkSync(req.file.path); } catch (_) { }

  // Filter to rows that have any content at all
  rows = rows.filter(r => Object.values(r).some(v => String(v).trim() !== ''));

  if (!rows || rows.length === 0) {
    return res.status(400).json({
      error: `The sheet "${detectedSheet}" appears to be empty or has no data rows below the header. ` +
        `Detected headers: [${detectedHeaders.slice(0, 6).join(', ')}...]`
    });
  }

  // 2. Group rows by po_number (one order per unique PO)
  const orderMap = new Map();
  for (const row of rows) {
    const po = String(row['po_number'] || '').trim();
    if (!po) continue; // skip blank rows

    if (!orderMap.has(po)) {
      orderMap.set(po, { header: row, lineItems: [] });
    }
    orderMap.get(po).lineItems.push(row);
  }

  if (orderMap.size === 0) {
    return res.status(400).json({
      error: `No rows with a po_number value found in sheet "${detectedSheet}". ` +
        `Make sure the po_number column is filled in for every data row. ` +
        `Detected columns: [${detectedHeaders.join(', ')}]`
    });
  }

  // 3. Resolve company_name + company_city → company_location_id (cached)
  const locationCache = new Map();
  const resolveLocation = async (client, name, city) => {
    const key = `${name}|||${city}`.toLowerCase();
    if (locationCache.has(key)) return locationCache.get(key);

    // 1. Find or create company
    let compRes = await client.query(
      `SELECT id FROM companies WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [name]
    );
    let companyId;
    if (compRes.rows.length > 0) {
      companyId = compRes.rows[0].id;
    } else {
      compRes = await client.query(
        `INSERT INTO companies (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [name]
      );
      companyId = compRes.rows[0].id;
    }

    // 2. Find or create location under that company
    let locRes = await client.query(
      `SELECT id FROM company_locations 
       WHERE company_id = $1 AND LOWER(city) = LOWER($2) 
       LIMIT 1`,
      [companyId, city]
    );
    let locationId;
    if (locRes.rows.length > 0) {
      locationId = locRes.rows[0].id;
    } else {
      locRes = await client.query(
        `INSERT INTO company_locations (company_id, city) VALUES ($1, $2) RETURNING id`,
        [companyId, city]
      );
      locationId = locRes.rows[0].id;
    }

    locationCache.set(key, locationId);
    return locationId;
  };

  // 4. Create each order in a transaction
  const results = [];
  const errors = [];

  for (const [po_number, { header, lineItems }] of orderMap) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Resolve location
      const companyName = String(header['company_name'] || '').trim();
      const companyCity = String(header['company_city'] || '').trim();
      if (!companyName || !companyCity) {
        errors.push({ po_number, error: 'company_name or company_city is missing.' });
        await client.query('ROLLBACK');
        continue;
      }
      const company_location_id = await resolveLocation(client, companyName, companyCity);

      // Validate priority
      const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
      const priority = VALID_PRIORITIES.includes(header['priority']) ? header['priority'] : 'Medium';

      // Validate packaging (accept any custom packaging type string entered in the sheet)
      const packaging_type = header['packaging_type'] ? String(header['packaging_type']).trim() : null;

      // Parse dates (handles both JS Date objects from xlsx and YYYY-MM-DD strings)
      const parseDate = (v) => {
        if (!v) return null;
        if (v instanceof Date) return v.toISOString().split('T')[0];
        const s = String(v).trim();
        // Handle Excel serial numbers
        if (/^\d+$/.test(s)) {
          const d = XLSX.SSF.parse_date_code(parseInt(s));
          return `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}`;
        }
        return s || null;
      };

      const order_date = parseDate(header['order_date']) || new Date().toISOString().split('T')[0];
      const orderDateObj = new Date(order_date);
      const deliveryDateObj = new Date(orderDateObj);
      deliveryDateObj.setDate(orderDateObj.getDate() + 28); // 4 weeks
      const delivery_date = deliveryDateObj.toISOString().split('T')[0];

      // Check if order already exists with this po_number
      const existingOrderRes = await client.query(
        'SELECT * FROM orders WHERE po_number = $1 LIMIT 1',
        [po_number]
      );

      let order;
      let lineNum = 1;
      let isAppended = false;

      if (existingOrderRes.rows.length > 0) {
        order = existingOrderRes.rows[0];
        isAppended = true;
      } else {
        const order_number = await generateOrderNumber(client);
        const VALID_CLASSIFICATIONS = ['Standard', 'Non-Standard'];
        const classification = VALID_CLASSIFICATIONS.includes(header['classification']) ? header['classification'] : 'Standard';
        const orderResult = await client.query(
          `INSERT INTO orders (order_number, company_location_id, order_date, delivery_date, notes, priority, po_number, packaging_type, created_by, end_client_name, gst_number, reference_number, classification, project_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
          [order_number, company_location_id, order_date, delivery_date,
            header['order_notes'] || null, priority, po_number, packaging_type, req.user.id,
            header['end_client_name'] || header['end_client'] || null,
            header['gst_number'] || null,
            header['reference_number'] || null,
            classification,
            header['project_name'] || header['project'] || null]
        );
        order = orderResult.rows[0];
      }

      const order_number = order.order_number;
      const order_seq = parseOrderCounter(order_number);

      await lockSerialAllocation(client);
      const maxGlobalUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
      let max_unit_seq = parseOrderCounter(maxGlobalUnitRes.rows[0]?.max_unit);
      let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);

      const countRes = await client.query('SELECT COUNT(*) FROM order_line_items WHERE order_id = $1', [order.id]);
      let itemIdx = parseInt(countRes.rows[0].count, 10) + 1;

      // Insert line items & units
      let totalUnits = 0;
      const createdUnits = [];

      for (const li of lineItems) {
        const qty = parseInt(li['quantity']) || 1;
        const li_number = `${order_number}-${String(itemIdx).padStart(2, '0')}`;
        itemIdx++;

        // Smart Deduplication: Check if this line item already exists (by number OR by matching description)
        if (isAppended) {
          const checkLi = await client.query(
            `SELECT id FROM order_line_items 
             WHERE order_id = $1 AND (
               line_item_number = $2 OR 
               (LOWER(TRIM(material_description)) = LOWER(TRIM($3)) AND TRIM($3) != '')
             ) LIMIT 1`,
            [order.id, li_number, li['material_description'] || '']
          );
          if (checkLi.rows.length > 0) {
            // Already exists — skip to prevent stacking duplicate lines
            continue;
          }
        }
        const unit_price = parseFloat(li['unit_price']) || 0;
        const total_price = parseFloat(li['total_price']) || (qty * unit_price);

        if (isNaN(unit_price) || unit_price < 0 || unit_price > 9999999999999.99) {
          throw new Error(`Unit price for line item must be a valid number between 0 and 9,999,999,999,999.99.`);
        }
        if (isNaN(total_price) || total_price < 0 || total_price > 9999999999999.99) {
          throw new Error(`Total price for line item must be a valid number between 0 and 9,999,999,999,999.99.`);
        }

        const cleanLiTag = li['tag'] && typeof li['tag'] === 'string' && li['tag'].trim() ? li['tag'].trim() : null;
        const impDesc = (li['material_description'] && typeof li['material_description'] === 'string' && li['material_description'].trim()) ? li['material_description'].trim() : null;
        const impPart = (li['part_number'] && typeof li['part_number'] === 'string' && li['part_number'].trim()) ? li['part_number'].trim() : null;
        const finalImpDesc = (impDesc && impPart && impDesc.toLowerCase() === impPart.toLowerCase()) ? null : impDesc;
        const liResult = await client.query(
          `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number,
            panel_type_size, delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
          [order.id, li_number, finalImpDesc, impPart || '',
          li['panel_type_size'] || '', delivery_date,
            qty, li['unit'] || 'Nos', unit_price, total_price, li['line_item_notes'] || null,
          li['project_name'] || li['project'] || order.project_name || null, cleanLiTag]
        );
        const lineItem = liResult.rows[0];
        totalUnits += qty;

        for (let i = 0; i < qty; i++) {
          const unit_id = formatOrderNumber(new Date().getFullYear(), globalUnitCounter);
          const short_serial = unit_id;
          const unitResult = await client.query(
            `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanLiTag]
          );
          createdUnits.push(unitResult.rows[0].id);
          globalUnitCounter++;
        }
      }

      // Auto-assign steps
      const tasksResult = await client.query(`
        SELECT * FROM task_masters 
        WHERE is_mandatory = true 
        ORDER BY 
          ${deptOrderSql('dept')} ASC,
          id ASC
      `);
      let tasks = tasksResult.rows;
      if (tasks.length === 0) {
        tasks = DEFAULT_STEPS;
      }

      const orderTasks = tasks.filter(t => t.level === 'order');
      const unitTasks = tasks.filter(t => t.level === 'unit');

      if (!isAppended) {
        for (let i = 0; i < orderTasks.length; i++) {
          const task = orderTasks[i];
          let fieldDefs = [];
          if (task.id) {
            try {
              const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
              fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
            } catch { fieldDefs = []; }
          }

          await client.query(
            `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [order.id, task.id || null, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
          );
        }
      }

      for (const unitDbId of createdUnits) {
        for (let i = 0; i < unitTasks.length; i++) {
          const task = unitTasks[i];
          let fieldDefs = [];
          if (task.id) {
            try {
              const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
              fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
            } catch { fieldDefs = []; }
          }

          await client.query(
            `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order)
             VALUES ($1,$2,$3,$4,$5,'pending',$6,$7,$8,$9)`,
            [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
          );
        }
        await deriveUnitStatus(unitDbId, client);
      }

      await client.query('COMMIT');
      results.push({ po_number, order_number, units: totalUnits, is_appended: isAppended });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`Import error for PO ${po_number}:`, err);
      errors.push({ po_number, error: publicErrorMessage(err, 'Server error while importing this order') });
    } finally {
      client.release();
    }
  }

  res.status(errors.length === orderMap.size ? 400 : 201).json({
    message: `Import complete. ${results.length} order(s) created, ${errors.length} failed.`,
    created: results,
    errors
  });
});

app.get('/api/orders', authorize(), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, COALESCE(u.username, 'System') as creator_name, 
       (SELECT count(*) FROM order_units WHERE order_id = o.id) as unit_count,
       (SELECT count(*) FROM order_units WHERE order_id = o.id AND status = 'Dispatched') as dispatched_unit_count,
       (SELECT count(*) FROM order_line_items WHERE order_id = o.id) as line_item_count,
       c.name as company_name, l.city as company_city,
       oindentdoc.file_path as indent_file_path, oindentdoc.file_name as indent_file_name
       FROM orders o 
       LEFT JOIN users u ON o.created_by = u.id 
       LEFT JOIN company_locations l ON o.company_location_id = l.id
       LEFT JOIN companies c ON l.company_id = c.id
       LEFT JOIN LATERAL (
         SELECT file_path, file_name 
         FROM documents 
         WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'Indent' 
         ORDER BY uploaded_at DESC 
         LIMIT 1
       ) oindentdoc ON true
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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

app.get('/api/orders/:id', authorize(), async (req, res) => {
  try {
    const order = await pool.query(`
      SELECT o.*, c.name as company_name, l.city as company_city, l.address as company_address, l.person_in_charge, l.contact_number, l.email as company_email
      FROM orders o
      LEFT JOIN company_locations l ON o.company_location_id = l.id
      LEFT JOIN companies c ON l.company_id = c.id
      WHERE o.id = $1
    `, [req.params.id]);
    if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' });

    const lineItems = await pool.query('SELECT * FROM order_line_items WHERE order_id = $1 ORDER BY id ASC', [req.params.id]);
    const units = await pool.query('SELECT * FROM order_units WHERE order_id = $1 ORDER BY id ASC', [req.params.id]);
    const docs = await pool.query(
      `SELECT * FROM documents 
       WHERE (entity_type = 'Order' AND entity_id = $1) 
          OR (entity_type = 'Unit' AND entity_id IN (SELECT id FROM order_units WHERE order_id = $1))`,
      [req.params.id]
    );

    let docsList = docs.rows;
    const isSalesOrAccounts = ['Sales', 'Accounts', 'Admin', 'Manager'].includes(req.user.role);
    if (!isSalesOrAccounts) {
      docsList = docsList.filter(d => d.doc_type !== 'PO');
    }

    res.json({ ...order.rows[0], line_items: lineItems.rows, units: units.rows, documents: docsList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:id/steps', authorize(), async (req, res) => {
  try {
    // Self-healing: check if a PO document exists for this order
    const poDocCheck = await pool.query(
      `SELECT id FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO' LIMIT 1`,
      [req.params.id]
    );

    // Join with task_masters to get the field definitions template
    const result = await pool.query(`
      SELECT s.*, tm.custom_fields as tm_custom_fields, tm.order_fields as tm_order_fields
      FROM order_steps s
      LEFT JOIN task_masters tm ON s.task_id = tm.id
      WHERE s.order_id = $1
      ORDER BY s.step_order ASC, s.id ASC
    `, [req.params.id]);

    const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Check if any step has custom fields requiring datakey resolution
    let preloadedOrderRow = null;
    const hasAnyCustomFields = result.rows.some(s => s.custom_fields || s.tm_custom_fields);
    if (hasAnyCustomFields) {
      const ordRes = await pool.query(
        `SELECT 
          o.order_number, o.po_number, o.delivery_date, o.order_date,
          o.notes as order_notes, o.priority, o.packaging_type,
          o.end_client_name, o.gst_number, o.reference_number, o.classification,
          o.hold_status, o.status as order_status, o.qc_status, o.qc_date,
          o.planned_dispatch_date, o.wiring_assigned_date, o.wiring_expected_date, o.expected_qc_date,
          c.name as company_name,
          cl.city as company_city, cl.person_in_charge, cl.contact_number, cl.email as company_email
        FROM orders o
        LEFT JOIN company_locations cl ON o.company_location_id = cl.id
        LEFT JOIN companies c ON cl.company_id = c.id
        WHERE o.id = $1`,
        [req.params.id]
      );
      if (ordRes.rows.length > 0) preloadedOrderRow = ordRes.rows[0];
    }

    // For each step, if its own custom_fields is empty, seed from task master definitions
    const steps = [];
    for (const step of result.rows) {
      if (step.name === 'Upload PO' && step.status !== 'done' && poDocCheck.rows.length > 0) {
        await pool.query(
          `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE id = $3`,
          ['PO uploaded (Auto-resolved).', updatedStr, step.id]
        );
        step.status = 'done';
        step.notes = 'PO uploaded (Auto-resolved).';
        step.updated = updatedStr;
      }

      let cf = [];
      try { cf = Array.isArray(step.custom_fields) ? step.custom_fields : JSON.parse(step.custom_fields || '[]'); } catch { cf = []; }

      if (cf.length === 0 && step.tm_custom_fields) {
        try {
          const tmCf = Array.isArray(step.tm_custom_fields) ? step.tm_custom_fields : JSON.parse(step.tm_custom_fields);
          cf = tmCf.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
        } catch { cf = []; }
      }

      // Resolve datakeys dynamically with preloadedOrderRow
      if (cf.length > 0) {
        cf = await resolveCustomFieldValues(cf, req.params.id, null, preloadedOrderRow);
      }

      let autoDone = false;
      if (step.status !== 'done') {
        const hasResolvedVal = cf.some(f => {
          if (!f.datakey) return false;
          const val = f.value;
          const isValPresent = val !== null && val !== undefined && val !== '' && val !== false;
          if (!isValPresent) return false;

          // Auto-complete ONLY IF explicitly marked for auto-complete OR has an IF statement (condition)
          if (f.auto_complete === true || f.auto_complete === 'true' || step.auto_complete === true) {
            return true;
          }

          if (f.condition && String(f.condition).trim() !== '') {
            try {
              return safeEvaluateCondition(f.condition, val);
            } catch (err) {
              console.error('Failed evaluating condition:', f.condition, err);
              return false;
            }
          }
          return false;
        });

        if (hasResolvedVal) {
          autoDone = true;
        }
      }

      if (autoDone) {
        const deliveryField = cf.find(f => f.datakey && f.datakey.includes('delivery_date'));
        let dispatchDateVal = step.dispatch_date;
        if (deliveryField && deliveryField.value) {
          dispatchDateVal = deliveryField.value;
        }

        await pool.query(
          `UPDATE order_steps SET status = 'done', custom_fields = $1, dispatch_date = COALESCE($2, dispatch_date), updated = $3 WHERE id = $4`,
          [JSON.stringify(cf), dispatchDateVal || null, updatedStr, step.id]
        );
        step.status = 'done';
        step.dispatch_date = dispatchDateVal;
        step.updated = updatedStr;
      }

      // Pass order_fields config from task master to step
      let orderFields = [];
      try { orderFields = Array.isArray(step.tm_order_fields) ? step.tm_order_fields : JSON.parse(step.tm_order_fields || '[]'); } catch { orderFields = []; }

      const { tm_custom_fields, tm_order_fields, ...rest } = step;
      steps.push({ ...rest, custom_fields: cf, order_fields: orderFields });
    }

    res.json(steps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order steps' });
  }
});

app.post('/api/orders/:id/steps', authorize(OPERATOR_ROLES), async (req, res) => {
  const { taskId } = req.body;
  try {
    const taskResult = await pool.query('SELECT * FROM task_masters WHERE id = $1', [taskId]);
    if (taskResult.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    const task = taskResult.rows[0];

    // Department operators may only add tasks for their own department (mirrors FlowView UI gating)
    if (!['Admin', 'Manager'].includes(req.user.role) && task.dept !== req.user.role) {
      return res.status(403).json({ error: 'Forbidden: You can only add tasks for your own department.' });
    }

    // Copy field definitions (without values) from task master
    let fieldDefs = [];
    try {
      const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
      fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
    } catch { fieldDefs = []; }

    const result = await pool.query(
      `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (SELECT COALESCE(MAX(step_order), 0) + 1 FROM order_steps WHERE order_id = $1 AND dept = $3)) RETURNING *`,
      [req.params.id, task.id, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add step to order' });
  }
});

app.put('/api/orders/:orderId/steps/reorder', authorize(OPERATOR_ROLES), async (req, res) => {
  const { orderedIds } = req.body; // Array of step IDs in the new order
  if (!orderedIds || !Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds array required' });
  const ids = orderedIds.map(v => Number(v));
  if (ids.some(v => !Number.isInteger(v) || v <= 0)) {
    return res.status(400).json({ error: 'orderedIds must contain positive integer step IDs' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // step_order is 0-based to match the previous per-step loop
    await client.query(
      `UPDATE order_steps s
          SET step_order = v.ord - 1
         FROM unnest($1::int[]) WITH ORDINALITY AS v(id, ord)
        WHERE s.id = v.id AND s.order_id = $2`,
      [ids, req.params.orderId]
    );
    await client.query('COMMIT');
    res.json({ message: 'Steps reordered successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder steps' });
  } finally {
    client.release();
  }
});

// Order-level Design gate: every active (non-cancelled) panel of the order must have Drawing AND BOM AND
// Design confirmation before an order-level Release Documents step may be marked done.
const evaluateOrderDesignGate = async (clientOrPool, orderId) => {
  const unitsRes = await clientOrPool.query(
    `SELECT id, unit_id FROM order_units WHERE order_id = $1 AND COALESCE(hold_status, '') <> 'Cancelled' ORDER BY id`,
    [orderId]
  );
  const failing = [];
  for (const u of unitsRes.rows) {
    const info = await evaluateUnitDesignDocuments(clientOrPool, u.id);
    if (!info.hasDrawing || !info.hasBom || !info.designConfirmed) {
      const missing = [];
      if (!info.hasDrawing) missing.push('Drawing');
      if (!info.hasBom) missing.push('BOM');
      if (!info.designConfirmed) missing.push('Design confirmation');
      failing.push({ unitId: u.id, unit: u.unit_id, missing });
    }
  }
  return { ok: failing.length === 0, failing };
};

const isReleaseDocumentsStep = (s) =>
  Boolean(s) && s.dept === 'Design' && (s.name === 'Release Documents' || s.special === 'design');

app.put('/api/orders/:orderId/steps/:stepId', authorize(), async (req, res) => {
  if (await isOrderOnHold(req.params.orderId)) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const { status, notes, dispatchDate, custom_fields } = req.body;
  const updated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch step details to verify permissions
    const stepRes = await client.query(
      'SELECT dept, name, special FROM order_steps WHERE id = $1 AND order_id = $2 FOR UPDATE',
      [req.params.stepId, req.params.orderId]
    );
    if (stepRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Step not found' });
    }
    const step = stepRes.rows[0];

    const canEdit = ['Admin', 'Manager'].includes(req.user.role) || step.dept === req.user.role;
    if (!canEdit) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Forbidden: You are not authorized to update this task.' });
    }

    // Upstream validation: block marking 'done' if upstream depts are incomplete
    if (status === 'done' && !['Admin', 'Manager'].includes(req.user.role)) {
      const myIndex = PIPELINE.indexOf(step.dept);
      if (myIndex > 0) {
        const upstreamDepts = PIPELINE.slice(0, myIndex);
        const blockingRes = await client.query(
          `SELECT DISTINCT dept FROM order_steps WHERE order_id = $1 AND dept = ANY($2::text[]) AND status NOT IN ('done')`,
          [req.params.orderId, upstreamDepts]
        );
        if (blockingRes.rows.length > 0) {
          const blocking = blockingRes.rows.map(r => r.dept).join(', ');
          await client.query('ROLLBACK');
          return res.status(409).json({ error: `Cannot complete: upstream departments not finished yet — ${blocking}.` });
        }
      }
    }

    // Mandatory Design gate on an order-level Release Documents step
    if (status === 'done' && isReleaseDocumentsStep(step)) {
      const gate = await evaluateOrderDesignGate(client, req.params.orderId);
      if (!gate.ok) {
        const detail = gate.failing.slice(0, 5).map(f => `${f.unit || f.unitId}: ${f.missing.join(', ')}`).join('; ');
        await client.query('ROLLBACK');
        return res.status(400).json({
          error: `Cannot complete Release Documents: Drawing, BOM and Design confirmation are required for every panel (${detail}${gate.failing.length > 5 ? '; …' : ''}).`
        });
      }
    }

    if (custom_fields) {
      await propagateCustomFieldsToDB(custom_fields, req.params.orderId, null, client);
    }

    let cfJson = null;
    if (custom_fields) {
      cfJson = JSON.stringify(custom_fields);
    }

    const result = await client.query(
      'UPDATE order_steps SET status = $1, notes = $2, dispatch_date = $3, updated = $4, custom_fields = COALESCE($5, custom_fields) WHERE id = $6 AND order_id = $7 RETURNING *',
      [status, notes, dispatchDate || null, updated, cfJson, req.params.stepId, req.params.orderId]
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Step not found' });
    }

    await client.query(
      `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
      [req.user.id, req.params.orderId, step.dept, `Updated step "${result.rows[0].name}" (Status: ${status})`]
    );

    // Auto-complete Step 2 (Release Documents) on Order level when Step 1 (Review & Classify) is Standard and marked Done
    if (step.dept === 'Design' && (result.rows[0].name === 'Review & Classify' || result.rows[0].name.toLowerCase().includes('classify'))) {
      let resolvedClassification = null;
      if (Array.isArray(custom_fields)) {
        const classField = custom_fields.find(f => f.datakey === 'classification' || f.id === 'classification' || f.label?.toLowerCase() === 'classification');
        if (classField && classField.value) {
          resolvedClassification = String(classField.value).trim();
        }
      }
      if (!resolvedClassification) {
        const oCheck = await client.query('SELECT classification FROM orders WHERE id = $1', [req.params.orderId]);
        if (oCheck.rows.length > 0) {
          resolvedClassification = oCheck.rows[0].classification;
        }
      }

      if (resolvedClassification && resolvedClassification.toLowerCase() === 'standard' && status === 'done') {
        const step2Res = await client.query(
          `SELECT id, status, notes FROM order_steps
           WHERE order_id = $1 AND dept = 'Design'
             AND (name = 'Release Documents' OR special = 'design')
           LIMIT 1`,
          [req.params.orderId]
        );
        if (step2Res.rows.length > 0 && step2Res.rows[0].status !== 'done') {
          // Same mandatory gate as a manual completion: Drawing + BOM + Design confirmation for every panel
          const gate = await evaluateOrderDesignGate(client, req.params.orderId);
          if (gate.ok) {
            const step2 = step2Res.rows[0];
            const autoNote = 'Auto-completed: Standard master drawings & BOM applied.';
            const finalNotes = step2.notes ? step2.notes : autoNote;
            await client.query(
              `UPDATE order_steps
               SET status = 'done', notes = $1, updated = $2
               WHERE id = $3`,
              [finalNotes, updated, step2.id]
            );
            await client.query(
              `INSERT INTO activity_logs (user_id, order_id, dept, action_text)
               VALUES ($1, $2, 'Design', $3)`,
              [req.user.id, req.params.orderId, `Order: Step "Release Documents" auto-completed (Standard Panel)`]
            );
          }
        }
      }
    }

    if (step.dept === 'QC' && status === 'blocked') {
      const { qcFailTarget } = req.body;
      const target = qcFailTarget === 'design' ? 'Design' : 'Production';
      const remark = target === 'Design' ? 'Returned from QC — design re-check needed' : 'Returned from QC — rework required';

      await client.query(
        `UPDATE order_steps
         SET status = 'inprogress', notes = $1, updated = $2
         WHERE order_id = $3 AND dept = $4`,
        [remark, updated, req.params.orderId, target]
      );

      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text)
         VALUES ($1, $2, 'QC', $3)`,
        [req.user.id, req.params.orderId, `QC FAIL → returned to ${target} for ${target === 'Design' ? 're-check' : 'rework'}`]
      );
    }

    await updateOrderQCStatusFromSteps(req.params.orderId, client);

    // Re-evaluate unit statuses for all units in this order (e.g. when Sales completes Upload PO)
    const unitsForOrder = await client.query('SELECT id FROM order_units WHERE order_id = $1', [req.params.orderId]);
    for (const u of unitsForOrder.rows) {
      await deriveUnitStatus(u.id, client);
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    console.error(err);
    res.status(500).json({ error: 'Failed to update step' });
  } finally {
    client.release();
  }
});


app.delete('/api/orders/:orderId/steps/:stepId', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM order_steps WHERE id = $1 AND order_id = $2 RETURNING *',
      [req.params.stepId, req.params.orderId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Step not found' });

    // Also log this deletion
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, $2, $3)',
      [req.user.id, result.rows[0].dept, `Deleted task step: ${result.rows[0].name}`]
    );

    res.json({ message: 'Step deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete step' });
  }
});

app.use('/api/planning', createPlanningRouter(pool, authorize));

app.put('/api/orders/:id/planning', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
  if (await isOrderOnHold(req.params.id)) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const {
    end_client_name,
    planned_dispatch_date,
    wiring_assigned_date,
    wiring_expected_date,
    expected_qc_date,
    priority,
    status,
    qc_status,
    qc_date
  } = req.body;

  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order_number = checkOrder.rows[0].order_number;

    const result = await pool.query(
      `UPDATE orders 
       SET end_client_name = $1, 
           planned_dispatch_date = $2, 
           wiring_assigned_date = $3, 
           wiring_expected_date = $4, 
           expected_qc_date = $5, 
           priority = COALESCE($6, priority), 
           status = COALESCE($7, status), 
           qc_status = COALESCE($8, qc_status), 
           qc_date = $9 
       WHERE id = $10 
       RETURNING *`,
      [
        end_client_name || null,
        planned_dispatch_date || null,
        wiring_assigned_date || null,
        wiring_expected_date || null,
        expected_qc_date || null,
        priority,
        status,
        qc_status,
        qc_date || null,
        req.params.id
      ]
    );

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [
        req.user.id,
        req.user.role,
        `Updated planning details for order ${order_number}`,
        req.params.id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to update planning details:', err);
    res.status(500).json({ error: 'Failed to update planning details' });
  }
});

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
