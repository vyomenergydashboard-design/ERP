CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Manager', 'Sales', 'Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Viewer', 'Planning')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Migration for existing users
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'Viewer' CHECK (role IN ('Admin', 'Manager', 'Sales', 'Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Viewer', 'Planning'));

CREATE TABLE IF NOT EXISTS activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    dept TEXT,
    action_text TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Masters System
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS company_locations (
    id SERIAL PRIMARY KEY,
    company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
    address TEXT,
    city TEXT NOT NULL,
    person_in_charge TEXT,
    contact_number TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Order and Document System
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    company_location_id INTEGER REFERENCES company_locations(id),
    order_date DATE,
    delivery_date DATE,
    po_number TEXT,
    packaging_type TEXT,
    notes TEXT,
    priority TEXT DEFAULT 'Medium',
    gst_number TEXT,
    reference_number TEXT,
    hold_status TEXT DEFAULT 'None',
    classification TEXT DEFAULT 'Standard',
    project_name TEXT,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_line_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    line_item_number TEXT NOT NULL,
    material_description TEXT,
    part_number TEXT,
    panel_type_size TEXT,
    project_name TEXT,
    delivery_date DATE,
    quantity INTEGER NOT NULL,
    unit TEXT,
    unit_price NUMERIC(15, 2) NOT NULL,
    total_price NUMERIC(15, 2) NOT NULL,
    notes TEXT
);

CREATE TABLE IF NOT EXISTS order_units (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    line_item_id INTEGER REFERENCES order_line_items(id) ON DELETE CASCADE,
    unit_id TEXT UNIQUE NOT NULL,
    short_serial TEXT NOT NULL,
    current_dept TEXT DEFAULT 'Planning',
    status TEXT DEFAULT 'Pending',
    assigned_user INTEGER REFERENCES users(id),
    barcode TEXT,
    panel_type_size TEXT,
    classification TEXT DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    entity_type TEXT NOT NULL, -- 'Order', 'Unit', 'Step', etc.
    entity_id INTEGER NOT NULL,
    doc_type TEXT NOT NULL, -- 'PO', 'Quotation', 'BOM', 'Drawing', 'QC', 'Dispatch', 'Photo', 'TaskUpload'
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_by INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS task_masters (
    id SERIAL PRIMARY KEY,
    dept TEXT NOT NULL,
    name TEXT NOT NULL,
    sub TEXT,
    is_mandatory BOOLEAN DEFAULT true,
    requires_upload BOOLEAN DEFAULT false,
    default_doc_type TEXT DEFAULT 'General',
    special TEXT,
    custom_fields JSONB DEFAULT '[]'::jsonb,
    order_fields JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_steps (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES task_masters(id) ON DELETE SET NULL,
    dept TEXT NOT NULL,
    name TEXT NOT NULL,
    sub TEXT,
    status TEXT DEFAULT 'pending',
    notes TEXT,
    updated TEXT,
    special TEXT,
    dispatch_date DATE,
    requires_upload BOOLEAN DEFAULT false,
    default_doc_type TEXT DEFAULT 'General',
    step_order INTEGER DEFAULT 0,
    custom_fields JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE activity_logs ADD COLUMN IF NOT EXISTS order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL;
ALTER TABLE task_masters ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '[]'::jsonb;
ALTER TABLE task_masters ADD COLUMN IF NOT EXISTS order_fields JSONB DEFAULT '[]'::jsonb;
ALTER TABLE task_masters ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'unit' CHECK (level IN ('order', 'unit'));
ALTER TABLE task_masters ADD COLUMN IF NOT EXISTS default_doc_type TEXT DEFAULT 'General';
ALTER TABLE order_steps ADD COLUMN IF NOT EXISTS default_doc_type TEXT DEFAULT 'General';

CREATE TABLE IF NOT EXISTS unit_steps (
    id SERIAL PRIMARY KEY,
    order_unit_id INTEGER NOT NULL REFERENCES order_units(id) ON DELETE CASCADE,
    task_id INTEGER REFERENCES task_masters(id) ON DELETE SET NULL,
    dept TEXT NOT NULL,
    name TEXT NOT NULL,
    sub TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'inprogress', 'done', 'blocked', 'review', 'hold', 'cancelled')),
    notes TEXT,
    updated TEXT,
    dispatch_date DATE,
    requires_upload BOOLEAN DEFAULT false,
    default_doc_type TEXT DEFAULT 'General',
    step_order INTEGER DEFAULT 0,
    custom_fields JSONB DEFAULT '[]'::jsonb,
    assigned_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE unit_steps ADD COLUMN IF NOT EXISTS default_doc_type TEXT DEFAULT 'General';

-- Seed default Admin user if not exists (password: admin123)
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@absolutemotion.in', '$2a$10$pM5q2/qZtJkKoLjQ3McavedSnylKyzJqHsQSPyhWFN.WKYluU8vSK', 'Admin')
ON CONFLICT (username) DO NOTHING;

-- Planning Module columns for orders
ALTER TABLE orders ADD COLUMN IF NOT EXISTS end_client_name TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS planned_dispatch_date DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS wiring_assigned_date DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS wiring_expected_date DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_qc_date DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Not Started';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS qc_status TEXT DEFAULT 'Pending' CHECK (qc_status IN ('Pending', 'Pass', 'Fail'));
ALTER TABLE orders ADD COLUMN IF NOT EXISTS qc_date DATE;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS gst_number TEXT;

-- Planning Module columns for order_line_items (Line Item Planning)
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS planned_dispatch_date DATE;
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS wiring_assigned_date DATE;
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS wiring_expected_date DATE;
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS expected_qc_date DATE;
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Not Started';
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS qc_status TEXT DEFAULT 'Pending' CHECK (qc_status IN ('Pending', 'Pass', 'Fail'));
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS qc_date DATE;
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS mounting_start_date DATE;
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS mounting_complete_date DATE;
ALTER TABLE order_line_items ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

-- Planning Module columns for order_units (Unit Planning)
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS planned_dispatch_date DATE;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS wiring_assigned_date DATE;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS wiring_expected_date DATE;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS expected_qc_date DATE;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Not Started';
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS qc_status TEXT DEFAULT 'Pending' CHECK (qc_status IN ('Pending', 'Pass', 'Fail'));
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS qc_date DATE;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS mounting_start_date DATE;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS mounting_complete_date DATE;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS po_number TEXT;
ALTER TABLE order_units ADD COLUMN IF NOT EXISTS po_doc_id INTEGER REFERENCES documents(id) ON DELETE SET NULL;

-- System Settings (key-value store for admin-configurable DB-backed settings)
CREATE TABLE IF NOT EXISTS system_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Seed default order number start
INSERT INTO system_settings (key, value) VALUES ('order_number_start', '1') ON CONFLICT (key) DO NOTHING;
INSERT INTO system_settings (key, value) VALUES ('unit_number_start', '1') ON CONFLICT (key) DO NOTHING;

-- Column Master & Department Column Visibility System
CREATE TABLE IF NOT EXISTS column_masters (
    id SERIAL PRIMARY KEY,
    col_key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    field_type TEXT NOT NULL DEFAULT 'Text',
    is_system BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_column_visibility (
    id SERIAL PRIMARY KEY,
    dept TEXT NOT NULL,
    col_key TEXT NOT NULL REFERENCES column_masters(col_key) ON DELETE CASCADE,
    is_visible BOOLEAN DEFAULT true,
    UNIQUE(dept, col_key)
);

-- Seed System Columns
INSERT INTO column_masters (col_key, label, category, field_type, is_system, sort_order) VALUES
  ('order_number',           'Order Number',          'Order',    'Text',     true, 1),
  ('short_serial',           'Serial No.',            'Unit',     'Text',     true, 2),
  ('company_name',           'Customer Name',         'Order',    'Text',     true, 3),
  ('po_number',              'PO Number',             'Order',    'Text',     true, 4),
  ('reference_number',       'Reference Number',      'Order',    'Text',     true, 5),
  ('end_client_name',        'End Client Name',       'Order',    'Text',     true, 6),
  ('material_description',   'Material Description',  'LineItem', 'Text',     true, 7),
  ('part_number',            'Part Number',          'LineItem', 'Text',     true, 8),
  ('panel_code',             'Panel Code',            'LineItem', 'Text',     true, 9),
  ('panel_type_size',        'Panel Size',            'LineItem', 'Text',     true, 10),
  ('panel_ip_rating',        'IP Rating',             'LineItem', 'Text',     true, 11),
  ('panel_comments',         'Comments (Panel)',      'LineItem', 'Text',     true, 12),
  ('delivery_date',          'Delivery Date',         'Order',    'Date',     true, 13),
  ('planned_dispatch_date',  'Planned Dispatch',      'Planning', 'Date',     true, 14),
  ('priority',               'Priority',              'Order',    'Dropdown', true, 15),
  ('unit_status',            'Status',                'Unit',     'Dropdown', true, 16),
  ('mounting_start_date',    'Mounting Start',        'Planning', 'Date',     true, 17),
  ('mounting_complete_date', 'Mounting Complete',     'Planning', 'Date',     true, 18),
  ('wiring_assigned_date',   'Wiring Assigned',       'Planning', 'Date',     true, 19),
  ('wiring_expected_date',   'Wiring Expected',       'Planning', 'Date',     true, 20),
  ('expected_qc_date',       'Expected QC',           'Planning', 'Date',     true, 21),
  ('qc_status',              'QC Status',             'Planning', 'Dropdown', true, 22),
  ('qc_date',                'QC Date',               'Planning', 'Date',     true, 23),
  ('classification',         'Classification',        'Order',    'Dropdown', true, 24)
ON CONFLICT (col_key) DO NOTHING;

-- Seed default visibility (all visible for all departments)
INSERT INTO department_column_visibility (dept, col_key, is_visible)
SELECT d.dept, c.col_key, true
FROM (VALUES ('Sales'), ('Design'), ('Purchase'), ('Stores'), ('Production'), ('QC'), ('Dispatch'), ('Accounts'), ('Planning')) AS d(dept)
CROSS JOIN column_masters c
ON CONFLICT (dept, col_key) DO NOTHING;

-- Part Number Masters & Documents System
CREATE TABLE IF NOT EXISTS part_number_masters (
    id SERIAL PRIMARY KEY,
    part_number TEXT UNIQUE NOT NULL,
    client_name TEXT,
    project TEXT,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'Standard',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE part_number_masters ADD COLUMN IF NOT EXISTS client_name TEXT;
ALTER TABLE part_number_masters ADD COLUMN IF NOT EXISTS project TEXT;

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

ALTER TABLE part_number_documents ADD COLUMN IF NOT EXISTS doc_type TEXT DEFAULT 'Drawing';
ALTER TABLE part_number_documents ADD COLUMN IF NOT EXISTS revision_number INTEGER DEFAULT 0;
ALTER TABLE part_number_documents ADD COLUMN IF NOT EXISTS revision_label TEXT DEFAULT 'R0';
ALTER TABLE part_number_documents ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT true;
ALTER TABLE part_number_documents ADD COLUMN IF NOT EXISTS uploaded_by_id INTEGER REFERENCES users(id);
ALTER TABLE part_number_documents ADD COLUMN IF NOT EXISTS uploaded_by_name TEXT;
ALTER TABLE part_number_documents ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0;
UPDATE part_number_documents SET doc_type = 'Drawing' WHERE doc_type IS NULL OR doc_type = '';
UPDATE part_number_documents SET revision_label = 'R' || COALESCE(revision_number, 0) WHERE revision_label IS NULL OR revision_label = '';
UPDATE part_number_documents SET is_current = true WHERE is_current IS NULL;


CREATE TABLE IF NOT EXISTS panel_size_masters (
    id SERIAL PRIMARY KEY,
    panel_code VARCHAR(100),
    panel_size VARCHAR(100),
    size_name VARCHAR(100) UNIQUE NOT NULL,
    ip_rating VARCHAR(50),
    comments TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE panel_size_masters ADD COLUMN IF NOT EXISTS panel_code TEXT;
ALTER TABLE panel_size_masters ADD COLUMN IF NOT EXISTS panel_size TEXT;
ALTER TABLE panel_size_masters ADD COLUMN IF NOT EXISTS ip_rating TEXT;
ALTER TABLE panel_size_masters ADD COLUMN IF NOT EXISTS comments TEXT;
UPDATE panel_size_masters SET panel_size = COALESCE(panel_size, size_name) WHERE panel_size IS NULL;
UPDATE panel_size_masters SET comments = COALESCE(comments, description) WHERE comments IS NULL;

INSERT INTO panel_size_masters (panel_code, panel_size, size_name, ip_rating, comments, description) VALUES
  ('PC-01', '800x600x300 mm', '800x600x300 mm', 'IP55', 'Standard Wall Mount Control Panel', 'Standard Wall Mount Control Panel'),
  ('PC-02', '1000x800x300 mm', '1000x800x300 mm', 'IP55', 'Medium Wall Mount Control Panel', 'Medium Wall Mount Control Panel'),
  ('PC-03', '1200x800x400 mm', '1200x800x400 mm', 'IP55', 'Large Wall Mount / Small Floor Standing Panel', 'Large Wall Mount / Small Floor Standing Panel'),
  ('PC-04', '1600x800x400 mm', '1600x800x400 mm', 'IP55', 'Floor Standing Single Door Panel', 'Floor Standing Single Door Panel'),
  ('PC-05', '2000x800x600 mm', '2000x800x600 mm', 'IP54', 'Floor Standing Standard PCC/MCC Panel', 'Floor Standing Standard PCC/MCC Panel'),
  ('PC-06', '2000x1000x800 mm', '2000x1000x800 mm', 'IP54', 'Heavy Duty Floor Standing Double Door Panel', 'Heavy Duty Floor Standing Double Door Panel'),
  ('PC-07', 'Custom', 'Custom', 'IP55', 'Customized Non-Standard Panel Dimensions', 'Customized Non-Standard Panel Dimensions')
ON CONFLICT (size_name) DO UPDATE SET
  panel_code = COALESCE(panel_size_masters.panel_code, EXCLUDED.panel_code),
  panel_size = COALESCE(panel_size_masters.panel_size, EXCLUDED.panel_size),
  ip_rating = COALESCE(panel_size_masters.ip_rating, EXCLUDED.ip_rating),
  comments = COALESCE(panel_size_masters.comments, EXCLUDED.comments);

ALTER TABLE order_units 
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
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE unit_steps 
  ADD COLUMN IF NOT EXISTS hold_reason TEXT,
  ADD COLUMN IF NOT EXISTS held_by TEXT,
  ADD COLUMN IF NOT EXISTS hold_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE order_line_items 
  ADD COLUMN IF NOT EXISTS panel_type_size TEXT,
  ADD COLUMN IF NOT EXISTS project_name TEXT,
  ADD COLUMN IF NOT EXISTS custom_fields JSONB DEFAULT '{}'::jsonb;

ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'Standard',
  ADD COLUMN IF NOT EXISTS hold_status TEXT DEFAULT 'None',
  ADD COLUMN IF NOT EXISTS project_name TEXT;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_unit_steps_order_unit_id ON unit_steps(order_unit_id);
CREATE INDEX IF NOT EXISTS idx_unit_steps_order_unit_dept ON unit_steps(order_unit_id, dept);
CREATE INDEX IF NOT EXISTS idx_unit_steps_status ON unit_steps(status);
CREATE INDEX IF NOT EXISTS idx_order_units_order_id ON order_units(order_id);
CREATE INDEX IF NOT EXISTS idx_order_units_line_item_id ON order_units(line_item_id);
CREATE INDEX IF NOT EXISTS idx_order_steps_order_id ON order_steps(order_id);
CREATE INDEX IF NOT EXISTS idx_order_units_hold_status ON order_units(hold_status);



