# Spec & Implementation Plan: Premium Dark Mode & UI/UX Modernization

## 1. Objective
Transform the ERP dark mode from a harsh, high-glare, pitch-black aesthetic with neon borders into a refined, cohesive, and modern enterprise design system (inspired by Linear, Vercel, and GitHub Dark Dimmed). Elevate readability, typography, component contrast, and data density across the application (Tables, Stat Cards, Header, Sidenav, and Right Panel).

---

## 2. Requirements & Visual Standards (Adhering to `/frontend-ui-engineering`)

### A. Core Dark Mode Token Overhaul (`src/index.css`)
- **Backgrounds:** Replace pitch black (`#07080c`) with rich slate-navy (`--bg: #0b0f19`).
- **Surfaces/Cards:** Clean, distinct surface (`--bg2: #111827`) and elevated surfaces (`--bg3: #1a2234`, `--bg4: #243048`).
- **Borders:** Crisp, subtle borders (`--border: #1f293d`, `--border2: #2e3b52`) eliminating blurry shadows and harsh edges.
- **Typography:**
  - Primary text: Soft off-white (`--text: #f1f5f9`), eliminating eye strain and glare.
  - Secondary text: Slate (`--text2: #94a3b8`).
  - Muted text: Subtle slate (`--text3: #64748b`).
- **Semantic Colors:**
  - Modern sky blue (`--blue: #38bdf8`), emerald green (`--green: #10b981`), warm amber (`--amber: #fbbf24`), coral red (`--red: #f87171`), vyom orange (`--accent: #f97316`).

### B. Stat Cards Redesign (`StatsRow.jsx` & `src/index.css`)
- Eliminate the dated 4px thick neon colored top strips.
- Implement subtle 2px top gradient hairlines and refined active ring states.
- Fix broken number wrapping: Ensure `{data.totalLineItems}` and `({data.total} Orders)` stay on a single line with `flex-wrap: nowrap`.
- Refine typography: Tracking from `1.5px` to clean `0.8px` uppercase.

### C. Master Table View Modernization (`AllOrdersTableView.jsx` & `src/index.css`)
- **Serial Numbers:** Replace raw blue underlined hyperlink text with a sleek, tech-styled serial tag (`rgba(56, 189, 248, 0.1)` bg, border, rounded, mono).
- **Order Numbers:** Styled pill with integrated document paperclip icon.
- **Row Highlight States:** Replace dark muddy "blood-red" cancelled row background with soft, semi-transparent coral tint (`rgba(239, 68, 68, 0.08)`) and amber tint for holds.
- **Search & Filters:** Modern command-style search input with smooth focus ring, crisp filter selects, and segmented view toggle (`Board` / `Flow` / `Table`).

### D. Header & Sidenav Refinement (`Header.jsx`, `Sidenav.jsx`, `src/index.css`)
- **Header:** Cohesive 54px top bar with clean typography, search box, user avatar pill, and smooth dark/light toggle.
- **Sidenav:** Crisp slate rail with modern hover transitions, subtle active indicator pill, and balanced contrast.

### E. Right Inspector Panel (`RightPanel.jsx` & `src/index.css`)
- Clean elevated section cards for "Selected Step" and "Order Overview".
- Activity Log entries with readable timestamps, department badges, and high-contrast text.
- Minimal toggle button that sits flush against the panel border.

---

## 3. Implementation Steps

1. **Step 1:** Revise color tokens in `src/index.css` for dark mode and light mode harmony.
2. **Step 2:** Refine `.stat-card` styling in `src/index.css` and fix layout wrapping in `src/components/StatsRow.jsx`.
3. **Step 3:** Modernize table cells, serial number badges, and row highlight styling in `src/components/AllOrdersTableView.jsx` and `src/index.css`.
4. **Step 4:** Polish Header, Sidenav, and RightPanel visual hierarchy and typography.
5. **Step 5:** Validate production build (`cmd /c npm run build`) and PO test suite.
