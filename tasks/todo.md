# Tasks: Premium Dark Mode & UI/UX Modernization

- [x] **Task 1: Core Design Tokens Overhaul in `src/index.css`**
  - **Description:** Replace harsh pitch-black backgrounds and high-glare white text with modern slate-navy dark mode tokens (`--bg: #0b0f19`, `--bg2: #111827`, `--bg3: #1a2234`, `--border: #1f293d`, `--text: #f1f5f9`, `--text2: #94a3b8`).
  - **Files:** `src/index.css`

- [x] **Task 2: Stat Cards Refinement & Wrapping Fix**
  - **Description:** Remove thick 4px neon top borders in `.stat-card`, replace with sleek subtle top gradients, and fix awkward text wrapping in `StatsRow.jsx` (`{data.totalLineItems} ({data.total} Orders)`).
  - **Files:** `src/components/StatsRow.jsx`, `src/index.css`

- [x] **Task 3: Modern Table Row & Cell Aesthetics in `AllOrdersTableView.jsx`**
  - **Description:** Replace 1990s blue underlined serial links with sleek industrial asset badges, refine cancelled/hold row background tints, and polish table search & filter controls.
  - **Files:** `src/components/AllOrdersTableView.jsx`, `src/index.css`

- [x] **Task 4: Polish Header, Sidenav, and Right Inspector Panel**
  - **Description:** Modernize header search bar, theme toggle, user badge, sidebar active states, and right inspector panel activity log readability.
  - **Files:** `src/components/Header.jsx`, `src/components/RightPanel.jsx`, `src/index.css`

- [x] **Task 5: Production Build & Validation**
  - **Description:** Run `npm run build` and backend test suite to guarantee 0 regressions and verify visual quality.
  - **Files:** `dist/`, `server/test_po_system.js`
