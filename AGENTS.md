
# AGENTS.md — Vyom ERP Developer & Agent Context Rules

Welcome to the **Vyom ERP** codebase. This document is the persistent operational context and rules contract for human developers and AI agents working on this project.

---

## 1. Project Overview & Architecture

Vyom ERP is a full-stack manufacturing ERP and production planning system designed to manage panel engineering workflows from Purchase Order (PO) intake to Dispatch and Accounts.

### System Architecture
```
┌────────────────────────────────────────────────────────┐
│                   Vite + React SPA                     │
│    (Port 5173 / Production served via Nginx on 80/3001) │
└──────────────────────────┬─────────────────────────────┘
                           │ HTTP / JSON API + /uploads
┌──────────────────────────▼─────────────────────────────┐
│                 Node.js Express Server                 │
│                      (Port 5000)                       │
└──────────────────────────┬─────────────────────────────┘
                           │ pg Pool (TCP 5432 / 5433)
┌──────────────────────────▼─────────────────────────────┐
│                   PostgreSQL Database                  │
│                      ("erp_db")                        │
└────────────────────────────────────────────────────────┘
```

### Core Business Workflow
1. **Sales:** Uploads customer PO & specs, creates order with line items, sets target dates. Panels remain in `Sales` until unit-level Sales Clearance is completed.
2. **Design:** Reviews classification (Standard vs Non-Standard), releases BOM, layout, and electrical drawings. **STRICT INVARIANT: Without BOTH Drawing and BOM uploaded and Design confirmed, NO panel can advance to Purchase or any subsequent department.**
3. **Purchase & Stores:** Checks BOM stock against inventory, flags shortfalls, raises purchase POs, confirms material acceptance.
4. **Planning:** Allocates daily production capacity, schedules wiring and mounting, sets dispatch commitments.
5. **Production:** Manufactures physical panels (mechanical fitters + electrical wiremen).
6. **QC:** Panel testing, inspection checklists, pass/fail and rework loop.
7. **Dispatch & Accounts:** Ready for dispatch document verification, customer invoicing, delivery note generation.

---

## 2. Directory Map & Key Files

```
ERP/
├── package.json              # Frontend dependencies and Vite scripts
├── vite.config.js            # Vite build and reverse proxy configuration
├── docker-compose.yml        # Multi-container orchestration (frontend, backend, postgres)
├── Dockerfile                # Production multi-stage build (Node build -> Nginx)
├── nginx.conf                # Production reverse proxy routing for API and uploads
├── .env.example              # Template environment configuration (DO NOT commit secrets)
├── server/
│   ├── package.json          # Backend dependencies and node scripts
│   ├── index.js              # Primary Express monolith (API routes, migrations, auth, email)
│   ├── db.js                 # PostgreSQL connection pool configuration
│   ├── init.sql              # Core schema definition, default tables, constraints, seed
│   ├── run_deployment_migrations.js # Dynamic schema updates executed during startup
│   ├── realign_unit_serials_to_orders.js # Serial numbering script (Caution: see Risky Areas)
│   ├── test_po_system.js     # Integration test suite for PO hierarchy
│   └── uploads/              # Local disk storage for uploaded documents
└── src/
    ├── main.jsx              # React DOM entry point, window.API_BASE, fetch interceptor
    ├── App.jsx               # Client router, view tabs, session sync, ProtectedRoute
    ├── index.css             # Global dark/neon styling tokens, utilities, and theme variables
    ├── hooks/
    │   └── useGlobalModalEscape.js # Accessibility hook for closing modals via Escape key
    ├── data/
    │   └── planningData.js   # Department definitions, status badges, priority configs
    └── components/
        ├── AllOrdersTableView.jsx   # Master multi-column table view for orders and units
        ├── PlanningModule.jsx       # Production scheduling, wiring/mounting Gantt grid
        ├── OrderCreationFlow.jsx    # Multi-step order creation wizard with file uploads
        ├── OrderDocumentsModal.jsx  # Multi-format document manager (PDF, Excel, Images)
        ├── StepModal.jsx            # Department workflow task execution modal
        ├── DeptWorklist.jsx         # Department-specific queue of actionable units
        ├── Masters.jsx              # Admin masters (Part Numbers, Panel Sizes, Task Masters)
        ├── UserManagement.jsx       # User accounts, passwords, and role management
        ├── Login.jsx                # Authentication login screen
        ├── ExcelSheetViewer.jsx     # In-browser spreadsheet renderer
        ├── Header.jsx & Sidenav.jsx # Navigation layout components
        ├── BoardView.jsx & FlowView.jsx # Visual Kanban and pipeline flow views
        ├── RightPanel.jsx           # Slide-out unit detail and metadata inspector
        └── StatsRow.jsx             # Top KPI metric cards
```

---

## 3. Technology Stack & Dependencies

### Frontend
- **Runtime & Bundler:** React 18.3, Vite 5.4
- **Routing & State:** `react-router-dom` (v6.26), local state + `zustand` (v5.0)
- **UI Components & Icons:** `lucide-react` (v0.436)
- **Spreadsheet Parsing:** `xlsx` (v0.18.5)
- **Styles:** Vanilla CSS with scoped CSS variables and dark-mode tokens (`src/index.css`)

### Backend
- **Runtime:** Node.js (v20+ recommended, ES Modules enabled: `"type": "module"`)
- **Web Framework:** Express 4.19
- **Database Driver:** `pg` (v8.11.5) with `Pool`
- **Security & Auth:** `bcryptjs` (v2.4.3), `jsonwebtoken` (v9.0.2), `cors` (v2.8.5)
- **File Handling:** `multer` (v1.4.5-lts.1)
- **Notifications:** `nodemailer` (v6.9.13)

---

## 4. Build, Development, and Test Commands

### Development Setup

#### Running with Docker (Recommended for complete environment)
```bash
# Start Postgres, Backend, and Vite Dev server in parallel
docker-compose up erp-dev backend db

# Or start in detached mode
docker-compose up -d
```

#### Running Locally (Native Node & Postgres)
1. **Database:** Ensure PostgreSQL is running on port `5432` or `5433` with database `erp_db`.
2. **Backend:**
   ```bash
   cd server
   npm install
   node index.js
   # Server listens on http://localhost:5000
   ```
3. **Frontend:**
   ```bash
   # In project root
   npm install
   npm run dev
   # Vite dev server runs on http://localhost:5173
   ```

### Production Build
```bash
# Build frontend bundle
npm run build

# Preview production frontend locally
npm run preview

# Build and run production container
docker-compose --profile prod up --build -d
```

### Testing Commands
```bash
# Run backend PO hierarchy and integration test suite
node server/test_po_system.js
```

---

## 5. Authentication & Authorization (RBAC)

### User Roles
The system enforces 12 distinct functional roles:
- `Admin`: Full system control (user management, settings, deletions, masters).
- `Manager`: High-level oversight, hold approvals, planning overrides.
- `Sales`, `Design`, `Purchase`, `Stores`, `Planning`, `Production`, `QC`, `Dispatch`, `Accounts`: Department-specific operators.
- `Viewer`: Read-only access across views.

### Auth Flow
1. **Login:** User submits credentials to `POST /api/auth/login`. On success, the server responds with a signed JWT (`token`) containing `{ id, username, role }`.
2. **Client Storage:** Token and user profile are saved in `localStorage`:
   - `localStorage.getItem('token')`
   - `localStorage.getItem('user')`
   - `localStorage.getItem('userRole')`
3. **API Authorization:**
   - Every protected API route passes through `authorize(roles = [])` in `server/index.js`.
   - The token is passed via `Authorization: Bearer <token>`.
4. **401 Handling:** A global `window.fetch` interceptor in `src/main.jsx` detects `401 Unauthorized` responses and automatically clears `localStorage` and routes the user to `/`.

---

## 6. Database Schema & Conventions

The database schema is defined in `server/init.sql` and updated via `server/run_deployment_migrations.js`.

### Core Entities & Relationships
- **`companies`** (1) ── (N) **`company_locations`** (1) ── (N) **`orders`**
- **`orders`** (1) ── (N) **`order_line_items`** (1) ── (N) **`order_units`**
- **`order_units`** (1) ── (N) **`unit_steps`**
- **`orders`** (1) ── (N) **`order_steps`**
- **`documents`**: Polymorphic table linked via `(entity_type, entity_id)` where `entity_type` is `'Order'`, `'Unit'`, or `'Step'`.

### Key Identifier Conventions
- **Order Number Format:** Financial-Year prefix followed by a 4-digit sequential counter: `YY(YY+1)XXXX` (e.g. `26270001` for FY 2026–2027).
- **Line Item Number:** `${order_number}-${index}` (e.g. `26270001-01`).
- **Unit / Serial ID:** Matches the continuous unit counter in FY format (e.g. `26270001`).

---

## 7. Coding Conventions & Best Practices

### Frontend Conventions
- **Components:** Functional components with React hooks exclusively. No class components.
- **Styling:** Use existing CSS tokens in `src/index.css` (`var(--bg)`, `var(--bg2)`, `var(--border)`, `var(--text)`, `var(--blue)`, `var(--green)`, `var(--amber)`, `var(--red)`). Maintain dark-mode visual harmony.
- **Icons:** Always import icons from `lucide-react`.
- **API Requests:** Always use `window.API_BASE` for backend URLs so proxies and ports resolve correctly in both local and containerized setups.
- **Accessibility:** Ensure any new modal or overlay integrates with `useGlobalModalEscape` or includes keyboard `Escape` closing logic.

### Backend Conventions
- **Transactions:** When performing operations spanning multiple tables, always acquire a dedicated connection (`const client = await pool.connect()`), wrap operations in `BEGIN` / `COMMIT`, and guarantee `client.release()` in a `finally` block:
  ```javascript
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // operations
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
  ```
- **Never Release Twice:** Do NOT call `client.release()` inside the `try` block before returning if a `finally` block also calls `client.release()`.
- **Parameterization:** NEVER concatenate user input into SQL queries. Always use parameterized queries (`$1, $2, ...`).

---

## 8. Known Risky Areas & Guardrails for Agents

> [!CAUTION]
> Agents working on this codebase MUST review and adhere to these guardrails before modifying code.

1. **Order Number Immutability (DO NOT Resequence):**
   - Historical order numbers and unit serials are shared on external customer invoices, vendor POs, and physical metal labels.
   - Deleting an order must NEVER renumber, resequence, or update existing order numbers or unit serials.
   - Avoid executing `realign_unit_serials_to_orders.js` against active production databases.

2. **Database Truncation Guardrail:**
   - In `server/index.js`, ensure `TRUNCATE TABLE task_masters` is never invoked automatically on boot. All migrations must be additive and non-destructive.

3. **Secrets & Environment Variables:**
   - NEVER commit `.env` or hardcode sensitive tokens or passwords into git.
   - Ensure `JWT_SECRET` is configured via environment variables and does not fall back to insecure defaults in production.

4. **File Upload Security:**
   - Any endpoint accepting file uploads (via `multer`) must validate MIME types and file extensions.
   - Do not allow uploaded HTML, SVG, or executable scripts to be served inline with active script execution.

5. **Token Query Parameters:**
   - Avoid passing JWTs in URL query parameters (`?token=...`). Use Authorization headers or short-lived download tickets to prevent token exposure in logs and browser history.

6. **Monolithic Code Decomposition:**
   - `server/index.js` (~6,000 lines) and `AllOrdersTableView.jsx` (~6,000 lines) are high-risk files.
   - When adding new capabilities, do NOT continue appending to these monoliths. Extract new logic into separate modular files (e.g. `server/routes/...` or focused subcomponents in `src/components/...`).

7. **Drawing and BOM Mandatory Gate for Department Advancement:**
   - Without BOTH Drawing and BOM, NO panel may advance past Design to Purchase or any subsequent department.
   - The `Release Documents` step can only transition to `done` when `hasDrawing && hasBom && designConfirmed` are all true.
   - In `deriveUnitStatus`, an unbreakable hard gate blocks advancing `current_dept` beyond `Design` if either Drawing or BOM is missing.

8. **Sales Clearance to Design Gate:**
   - A panel only comes to Design after Sales has completed unit-level Sales clearance (`unit.current_dept === 'Sales'` until Sales clearance is done).
   - Design confirmation (`POST /api/units/:id/design-confirm`) is strictly blocked with HTTP 400 if Sales clearance is pending.
