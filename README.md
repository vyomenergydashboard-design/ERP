# Vyom ERP

Manufacturing ERP and production planning for panel engineering. It follows each panel from the customer PO through Design, Purchase, Stores, Planning, Production, QC and Dispatch to Accounts.

**Stack:** React 18 + Vite (`src/`), Node.js/Express (`server/`), PostgreSQL. Runs in Docker.

## Quick start

Copy `.env.example` to `.env` and set `JWT_SECRET` (required) and `INITIAL_ADMIN_PASSWORD` (creates the first Admin when the users table is empty). Then:

```bash
docker-compose up erp-dev backend db
```

- App: http://localhost:5173 (Vite dev server)
- API health: http://localhost:5000/api/health
- Postgres: localhost:5433 (`erp_db`)

Production build: `docker-compose --profile prod up --build -d` (nginx on port 3001).

## Checks and tests

```bash
npm run check            # static check of src/ for undeclared identifiers
npm run build            # production build
cd server && npm test    # integration tests; they need a live backend and database and must never be pointed at production
```

## Where things are

| Path | What |
|---|---|
| `src/` | React app: components, hooks, API client, shared department/role data |
| `server/` | Express API: `index.js`, `routes/`, `services/`, `data/`, `init.sql`, integration tests |
| `scripts/` | `verify_codebase.js` and the headless-browser smoke tests in `e2e/` |
| `docs/` | `specs/` (feature specs and intent), backup and recovery guide, `design/` reference image, `samples/` import sample |
| `tasks/remaining-tasks.md` | refactor roadmap and handoff notes |
| `AGENTS.md`, `CLAUDE.md` | project rules and guidance for contributors and AI assistants |
| `PRODUCT.md`, `DESIGN.md` | product intent and UI design language |

Never commit `.env`, database dumps, `server/uploads/` contents or browser profiles. See `AGENTS.md`.
