/**
 * Seeds the minimum data the integration tests (server/test_*.js) expect on a FRESH database:
 *   - the default task_masters workflow (a fresh install only has 'Upload PO' by design)
 *   - company + company_location with id 1 (tests create orders against location 1)
 *   - one order with a few units, created through the real API (some tests reuse existing units)
 *
 * For CI / throwaway databases only. It refuses to run unless ALLOW_FIXTURE_SEED=1 and it does
 * nothing if the database already contains orders.
 *
 * Env: DATABASE_URL, API_BASE (backend must be running), ADMIN_LOGIN (default "admin"),
 *      ADMIN_PASSWORD (the INITIAL_ADMIN_PASSWORD the backend was started with).
 */
import pg from 'pg';
import { DEFAULT_STEPS } from '../data/defaultTaskMasters.js';

if (process.env.ALLOW_FIXTURE_SEED !== '1') {
  console.error('Refusing to seed: set ALLOW_FIXTURE_SEED=1 (CI / throwaway databases only).');
  process.exit(1);
}

const API_BASE = process.env.API_BASE || 'http://localhost:5000';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

try {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS c FROM orders');
  if (rows[0].c > 0) {
    console.log(`Database already has ${rows[0].c} orders — skipping fixture seed.`);
    process.exit(0);
  }

  // A fresh install intentionally starts with only 'Upload PO' (admins build their own
  // workflow). The tests need a full workflow, so add the default templates here — CI only.
  let addedTasks = 0;
  for (const step of DEFAULT_STEPS) {
    const res = await pool.query(
      `INSERT INTO task_masters (dept, name, sub, special, requires_upload, default_doc_type, is_mandatory, level, custom_fields)
       SELECT $1, $2, $3, $4, $5, $6, true, $7, $8
       WHERE NOT EXISTS (SELECT 1 FROM task_masters WHERE dept = $1 AND name = $2)`,
      [step.dept, step.name, step.sub, step.special, step.requires_upload, step.default_doc_type || 'General',
        step.level || 'unit', JSON.stringify(step.custom_fields || [])]
    );
    addedTasks += res.rowCount;
  }

  const company = await pool.query(
    `INSERT INTO companies (name) VALUES ('CI Test Company')
     ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`
  );
  await pool.query(
    `INSERT INTO company_locations (id, company_id, city, address) VALUES (1, $1, 'CI City', 'CI Address')
     ON CONFLICT (id) DO NOTHING`,
    [company.rows[0].id]
  );
  await pool.query(`SELECT setval(pg_get_serial_sequence('company_locations', 'id'), GREATEST((SELECT MAX(id) FROM company_locations), 1))`);

  // Several tests sign tokens for these fixed user ids; authorize() requires them to exist
  // with the matching role. The password is a random unusable value (nobody logs in as them).
  const unusableHash = `$2a$10$${'x'.repeat(53)}`;
  for (const [id, username, role] of [[27, 'sales', 'Sales'], [31, 'design', 'Design']]) {
    await pool.query(
      `INSERT INTO users (id, username, email, password, role) VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING`,
      [id, username, `${username}@ci.local`, unusableHash, role]
    );
  }
  await pool.query(`SELECT setval(pg_get_serial_sequence('users', 'id'), GREATEST((SELECT MAX(id) FROM users), 1))`);

  const login = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.ADMIN_LOGIN || 'admin', password: process.env.ADMIN_PASSWORD })
  });
  if (!login.ok) throw new Error(`Admin login failed (HTTP ${login.status}) — check ADMIN_PASSWORD.`);
  const { token } = await login.json();

  const order = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      company_location_id: 1,
      po_number: 'CI-FIXTURE-PO',
      lineItems: JSON.stringify([
        { material_description: 'CI fixture panel A', part_number: 'CI-PN-A', quantity: 2, unit: 'Nos', unit_price: 100, total_price: 200 },
        { material_description: 'CI fixture panel B', part_number: 'CI-PN-B', quantity: 1, unit: 'Nos', unit_price: 100, total_price: 100 }
      ])
    })
  });
  if (!order.ok) throw new Error(`Fixture order creation failed (HTTP ${order.status}): ${await order.text()}`);
  const { rows: [fixture] } = await pool.query(
    `SELECT o.order_number, COUNT(ou.id)::int AS units FROM orders o
     LEFT JOIN order_units ou ON ou.order_id = o.id GROUP BY o.id ORDER BY o.id DESC LIMIT 1`
  );
  console.log(`Seeded ${addedTasks} default task masters, company location 1, users 27/31, and fixture order ${fixture?.order_number} (${fixture?.units} units).`);
} catch (err) {
  console.error('Fixture seed failed:', err.message || err);
  process.exitCode = 1;
} finally {
  await pool.end();
}
