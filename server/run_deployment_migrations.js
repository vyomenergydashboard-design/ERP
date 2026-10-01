import pool from './db.js';

export async function runDeploymentMigrations(clientParam) {
  const client = clientParam || await pool.connect();
  const shouldRelease = !clientParam;

  try {
    // 1. Ensure columns exist on order_units
    await client.query(`
      ALTER TABLE order_units 
      ADD COLUMN IF NOT EXISTS planned_dispatch_date DATE,
      ADD COLUMN IF NOT EXISTS wiring_assigned_date DATE,
      ADD COLUMN IF NOT EXISTS wiring_expected_date DATE,
      ADD COLUMN IF NOT EXISTS expected_qc_date DATE,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Not Started',
      ADD COLUMN IF NOT EXISTS qc_status TEXT DEFAULT 'Pending',
      ADD COLUMN IF NOT EXISTS qc_date DATE,
      ADD COLUMN IF NOT EXISTS mounting_start_date DATE,
      ADD COLUMN IF NOT EXISTS mounting_complete_date DATE,
      ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'Standard',
      ADD COLUMN IF NOT EXISTS panel_type_size TEXT,
      ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb,
      ADD COLUMN IF NOT EXISTS hold_status TEXT DEFAULT 'None',
      ADD COLUMN IF NOT EXISTS hold_step_id INTEGER,
      ADD COLUMN IF NOT EXISTS hold_step_name TEXT,
      ADD COLUMN IF NOT EXISTS hold_dept TEXT,
      ADD COLUMN IF NOT EXISTS hold_reason TEXT,
      ADD COLUMN IF NOT EXISTS held_by_name TEXT,
      ADD COLUMN IF NOT EXISTS held_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS cancelled_step_id INTEGER,
      ADD COLUMN IF NOT EXISTS cancelled_step_name TEXT,
      ADD COLUMN IF NOT EXISTS cancelled_dept TEXT,
      ADD COLUMN IF NOT EXISTS cancelled_reason TEXT,
      ADD COLUMN IF NOT EXISTS cancelled_by_name TEXT,
      ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS po_number TEXT,
      ADD COLUMN IF NOT EXISTS po_doc_id INTEGER REFERENCES documents(id) ON DELETE SET NULL,
      ADD COLUMN IF NOT EXISTS tag TEXT,
      ADD COLUMN IF NOT EXISTS design_confirmed BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS design_confirmed_at TIMESTAMP WITH TIME ZONE,
      ADD COLUMN IF NOT EXISTS design_confirmed_by INTEGER REFERENCES users(id);

      ALTER TABLE unit_steps
      ADD COLUMN IF NOT EXISTS hold_reason TEXT,
      ADD COLUMN IF NOT EXISTS held_by TEXT,
      ADD COLUMN IF NOT EXISTS hold_at TIMESTAMP WITH TIME ZONE;

      DO $$ 
      BEGIN 
        ALTER TABLE unit_steps DROP CONSTRAINT IF EXISTS unit_steps_status_check;
        ALTER TABLE unit_steps ADD CONSTRAINT unit_steps_status_check CHECK (status IN ('pending', 'inprogress', 'done', 'blocked', 'review', 'hold', 'cancelled'));
      EXCEPTION WHEN OTHERS THEN 
        NULL;
      END $$;

      ALTER TABLE order_line_items
      ADD COLUMN IF NOT EXISTS panel_type_size TEXT,
      ADD COLUMN IF NOT EXISTS project_name TEXT,
      ADD COLUMN IF NOT EXISTS tag TEXT,
      ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'Standard',
      ADD COLUMN IF NOT EXISTS hold_status TEXT DEFAULT 'None',
      ADD COLUMN IF NOT EXISTS project_name TEXT;

      ALTER TABLE companies
      ADD COLUMN IF NOT EXISTS gst_number TEXT;

      ALTER TABLE panel_size_masters
      ADD COLUMN IF NOT EXISTS panel_code TEXT,
      ADD COLUMN IF NOT EXISTS panel_size TEXT,
      ADD COLUMN IF NOT EXISTS ip_rating TEXT,
      ADD COLUMN IF NOT EXISTS comments TEXT;

      UPDATE panel_size_masters
      SET panel_size = COALESCE(panel_size, size_name),
          comments = COALESCE(comments, description)
      WHERE panel_size IS NULL OR comments IS NULL;


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

      CREATE INDEX IF NOT EXISTS idx_unit_steps_order_unit_id ON unit_steps(order_unit_id);
      CREATE INDEX IF NOT EXISTS idx_unit_steps_order_unit_dept ON unit_steps(order_unit_id, dept);
      CREATE INDEX IF NOT EXISTS idx_unit_steps_status ON unit_steps(status);
      CREATE INDEX IF NOT EXISTS idx_order_units_order_id ON order_units(order_id);
      CREATE INDEX IF NOT EXISTS idx_order_units_line_item_id ON order_units(line_item_id);
      CREATE INDEX IF NOT EXISTS idx_order_steps_order_id ON order_steps(order_id);
      CREATE INDEX IF NOT EXISTS idx_order_units_hold_status ON order_units(hold_status);
      CREATE INDEX IF NOT EXISTS idx_documents_entity_po ON documents (entity_type, entity_id, doc_type);
      CREATE INDEX IF NOT EXISTS idx_order_units_po_doc_id ON order_units (po_doc_id);
    `);


    // Backfill unit planning fields if null
    await client.query(`
      UPDATE order_units ou
      SET 
        planned_dispatch_date = COALESCE(ou.planned_dispatch_date, oli.planned_dispatch_date),
        wiring_assigned_date = COALESCE(ou.wiring_assigned_date, oli.wiring_assigned_date),
        wiring_expected_date = COALESCE(ou.wiring_expected_date, oli.wiring_expected_date),
        expected_qc_date = COALESCE(ou.expected_qc_date, oli.expected_qc_date),
        qc_status = COALESCE(ou.qc_status, oli.qc_status, 'Pending'),
        qc_date = COALESCE(ou.qc_date, oli.qc_date),
        mounting_start_date = COALESCE(ou.mounting_start_date, oli.mounting_start_date),
        mounting_complete_date = COALESCE(ou.mounting_complete_date, oli.mounting_complete_date)
      FROM order_line_items oli
      WHERE ou.line_item_id = oli.id 
        AND ou.planned_dispatch_date IS NULL;
    `);


    // Ensure column_masters label for short_serial is 'Serial No.'
    await client.query(`
      UPDATE column_masters 
      SET label = 'Serial No.' 
      WHERE col_key = 'short_serial' AND label IN ('Unit Serial', 'Serial Number');

      INSERT INTO column_masters (col_key, label, category, field_type, is_system, sort_order) VALUES
        ('panel_code',      'Panel Code',        'LineItem', 'Text', true, 9),
        ('panel_ip_rating', 'IP Rating',         'LineItem', 'Text', true, 11),
        ('panel_comments',  'Comments',          'LineItem', 'Text', true, 12)
      ON CONFLICT (col_key) DO NOTHING;

      INSERT INTO department_column_visibility (dept, col_key, is_visible)
      SELECT d.dept, c.col_key, true
      FROM (VALUES ('Sales'), ('Design'), ('Purchase'), ('Stores'), ('Production'), ('QC'), ('Dispatch'), ('Accounts'), ('Planning')) AS d(dept)
      CROSS JOIN (SELECT col_key FROM column_masters WHERE col_key IN ('panel_code', 'panel_ip_rating', 'panel_comments')) c
      ON CONFLICT (dept, col_key) DO NOTHING;
    `);

    // 2. Check if old ORD- order numbers exist
    const oldOrdersRes = await client.query("SELECT COUNT(*) FROM orders WHERE order_number LIKE 'ORD-%'");
    const oldOrdersCount = parseInt(oldOrdersRes.rows[0].count, 10);

    if (oldOrdersCount > 0) {
      console.log(`[Deployment Migration] Found ${oldOrdersCount} old ORD- orders to migrate...`);
      await client.query('BEGIN');

      await client.query("UPDATE orders SET order_number = 'TEMP-' || order_number WHERE order_number LIKE 'ORD-%'");
      const ordersToMigrate = await client.query("SELECT id, order_number, order_date, created_at FROM orders WHERE order_number LIKE 'TEMP-ORD-%' ORDER BY id ASC");

      for (const order of ordersToMigrate.rows) {
        const yr = order.order_date ? new Date(order.order_date).getFullYear() : (order.created_at ? new Date(order.created_at).getFullYear() : new Date().getFullYear());
        const startYr = String(yr % 100).padStart(2, '0');
        const endYr = String((yr + 1) % 100).padStart(2, '0');

        let seq = 1;
        const parts = order.order_number.replace(/^TEMP-ORD-/, '').split('-');
        if (parts.length >= 2) {
          seq = parseInt(parts[1], 10) || 1;
        } else {
          seq = parseInt(parts[0], 10) || 1;
        }

        const newOrdNum = `${startYr}${endYr}${String(seq).padStart(4, '0')}`;
        await client.query("UPDATE orders SET order_number = $1 WHERE id = $2", [newOrdNum, order.id]);

        // Update line item numbers
        const lineItems = await client.query("SELECT id FROM order_line_items WHERE order_id = $1 ORDER BY id ASC", [order.id]);
        let liIdx = 1;
        for (const li of lineItems.rows) {
          const newLiNum = `${newOrdNum}-${String(liIdx).padStart(2, '0')}`;
          await client.query("UPDATE order_line_items SET line_item_number = $1 WHERE id = $2", [newLiNum, li.id]);
          liIdx++;
        }
      }

      await client.query('COMMIT');
      console.log('[Deployment Migration] Order number migration completed.');
    }



    // ── High-Performance B-Tree Database Indexes ─────────────────────────
    try {
      console.log('[Deployment Migration] Creating high-performance database indexes...');
      await client.query(`
        CREATE INDEX IF NOT EXISTS idx_order_units_order_id ON order_units(order_id);
        CREATE INDEX IF NOT EXISTS idx_order_units_line_item_id ON order_units(line_item_id);
        CREATE INDEX IF NOT EXISTS idx_order_units_current_dept ON order_units(current_dept);
        CREATE INDEX IF NOT EXISTS idx_order_units_status ON order_units(status);
        CREATE INDEX IF NOT EXISTS idx_order_units_hold_status ON order_units(hold_status);
        CREATE INDEX IF NOT EXISTS idx_unit_steps_order_unit_id ON unit_steps(order_unit_id);
        CREATE INDEX IF NOT EXISTS idx_unit_steps_dept_status ON unit_steps(dept, status);
        CREATE INDEX IF NOT EXISTS idx_order_steps_order_id ON order_steps(order_id);
        CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
        CREATE INDEX IF NOT EXISTS idx_part_number_masters_part_number ON part_number_masters(part_number);
        CREATE INDEX IF NOT EXISTS idx_part_number_documents_part_id ON part_number_documents(part_number_id);
        CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
        CREATE INDEX IF NOT EXISTS idx_orders_priority ON orders(priority);
      `);
      console.log('[Deployment Migration] High-performance indexes verified & active.');
    } catch (idxErr) {
      console.error('[Deployment Migration] Index creation warning:', idxErr.message || idxErr);
    }

    // ── Safe Cleanup of Unused Dummy Panel Sizes (PC-01 to PC-06) ────────
    try {
      const deletedDummySizes = await client.query(`
        DELETE FROM panel_size_masters 
        WHERE panel_code IN ('PC-01', 'PC-02', 'PC-03', 'PC-04', 'PC-05', 'PC-06') 
          AND NOT EXISTS (
            SELECT 1 FROM order_units ou WHERE ou.panel_type_size = panel_size_masters.size_name
          )
          AND NOT EXISTS (
            SELECT 1 FROM order_line_items oli WHERE oli.panel_type_size = panel_size_masters.size_name
          )
        RETURNING panel_code, size_name;
      `);
      if (deletedDummySizes.rows.length > 0) {
        console.log(`[Deployment Migration] Cleaned up ${deletedDummySizes.rows.length} unused dummy panel sizes:`, deletedDummySizes.rows.map(r => r.panel_code).join(', '));
      }
    } catch (dummyErr) {
      console.error('[Deployment Migration] Dummy panel size cleanup warning:', dummyErr.message || dummyErr);
    }

    // ── Resilient Task Cleanup & Sales Department Realignment ──
    try {
      console.log('[Deployment Migration] Cleaning up removed Sales tasks (Confirm Dispatch Date, Sales Clearance)...');

      // 1. Delete Confirm Dispatch Date and Sales Clearance from task_masters and step tables
      const deletedMasters = await client.query(`
        DELETE FROM task_masters 
        WHERE dept = 'Sales' AND name IN ('Confirm Dispatch Date', 'Sales Clearance')
        RETURNING id, name;
      `);

      if (deletedMasters.rows.length > 0) {
        const deletedIds = deletedMasters.rows.map(r => r.id);
        await client.query('DELETE FROM order_steps WHERE task_id = ANY($1::int[])', [deletedIds]);
        await client.query('DELETE FROM unit_steps WHERE task_id = ANY($1::int[])', [deletedIds]);
        console.log(`[Deployment Migration] Removed ${deletedMasters.rows.length} unused Sales task templates and steps.`);
      }

      // Also clean up by name in case step existed without task_id
      await client.query("DELETE FROM order_steps WHERE dept = 'Sales' AND name IN ('Confirm Dispatch Date', 'Sales Clearance')");
      await client.query("DELETE FROM unit_steps WHERE dept = 'Sales' AND name IN ('Confirm Dispatch Date', 'Sales Clearance')");

      // 2. Ensure 'Upload PO' task master exists in Sales
      const uploadPoMaster = await client.query("SELECT id FROM task_masters WHERE dept = 'Sales' AND name = 'Upload PO'");
      if (uploadPoMaster.rows.length === 0) {
        await client.query(`
          INSERT INTO task_masters (dept, name, sub, special, requires_upload, default_doc_type, is_mandatory, level, custom_fields)
          VALUES ('Sales', 'Upload PO', 'Customer PO + specs', 'sales', true, 'PO', true, 'order', '[]'::jsonb)
        `);
        console.log('[Deployment Migration] Ensured Upload PO task master exists.');
      }

      // 3. Ensure 'Upload PO' order step exists for every order
      await client.query(`
        INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, step_order, status)
        SELECT o.id, tm.id, tm.dept, tm.name, tm.sub, tm.special, tm.requires_upload, tm.default_doc_type, 0, 
               CASE WHEN EXISTS (SELECT 1 FROM documents d WHERE d.entity_type = 'Order' AND d.entity_id = o.id AND d.doc_type = 'PO') THEN 'done' ELSE 'pending' END
        FROM orders o
        CROSS JOIN (SELECT * FROM task_masters WHERE dept = 'Sales' AND name = 'Upload PO' LIMIT 1) tm
        WHERE NOT EXISTS (
          SELECT 1 FROM order_steps os WHERE os.order_id = o.id AND os.name = 'Upload PO'
        )
      `);

      // 4. Any order with NO PO document uploaded must have its Upload PO milestone set to pending
      await client.query(`
        UPDATE order_steps os
        SET status = 'pending', notes = 'Awaiting PO upload.'
        FROM orders o
        WHERE os.order_id = o.id
          AND os.name = 'Upload PO'
          AND NOT EXISTS (
            SELECT 1 FROM documents d WHERE d.entity_type = 'Order' AND d.entity_id = o.id AND d.doc_type = 'PO'
          )
      `);

      // 5. Re-align orders and units: An order stays in Sales until Upload PO document is uploaded
      // Any unit belonging to an order without a PO document must be in Sales
      const misalignedUnits = await client.query(`
        UPDATE order_units ou
        SET current_dept = 'Sales', status = 'Pending', design_confirmed = false, design_confirmed_at = NULL, design_confirmed_by = NULL
        FROM orders o
        WHERE ou.order_id = o.id
          AND ou.hold_status NOT IN ('Hold', 'Cancelled')
          AND ou.status NOT IN ('Cancelled', 'Hold', 'On Hold')
          AND (
            NOT EXISTS (
              SELECT 1 FROM documents d 
              WHERE d.entity_type = 'Order' AND d.entity_id = o.id AND d.doc_type = 'PO'
            )
            OR EXISTS (
              SELECT 1 FROM order_steps os 
              WHERE os.order_id = o.id AND os.dept = 'Sales' AND os.name = 'Upload PO' AND os.status != 'done'
            )
          )
        RETURNING ou.id;
      `);

      if (misalignedUnits.rows.length > 0) {
        console.log(`[Deployment Migration] Realignment complete: ${misalignedUnits.rows.length} units with pending POs restored to Sales.`);
      }

    } catch (cleanupErr) {
      console.error('[Deployment Migration] Resilient task cleanup warning:', cleanupErr);
    }

  } catch (err) {
    console.error('[Deployment Migration Error]:', err);
  } finally {
    if (shouldRelease && client) {
      client.release();
    }
  }
}

if (process.argv[1] && process.argv[1].endsWith('run_deployment_migrations.js')) {
  runDeploymentMigrations()
    .then(() => {
      console.log('Migrations executed successfully.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Migration failed:', err);
      process.exit(1);
    });
}
