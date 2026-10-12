---
name: Vyom ERP Design System
description: Industrial control room visual language for electrical panel manufacturing and engineering workflows
colors:
  primary: "#f97316"
  primary-hover: "#ea580c"
  bg-root: "#151821"
  bg-surface: "#1c202b"
  bg-elevated: "#242937"
  bg-highlight: "#2d3446"
  border-subtle: "#2e3547"
  border-strong: "#3f475c"
  text-primary: "#f1f5f9"
  text-secondary: "#cbd5e1"
  text-muted: "#94a3b8"
  status-done: "#10b981"
  status-done-dim: "rgba(16, 185, 129, 0.12)"
  status-inprogress: "#38bdf8"
  status-inprogress-dim: "rgba(56, 189, 248, 0.12)"
  status-blocked: "#f87171"
  status-blocked-dim: "rgba(248, 113, 113, 0.12)"
  status-hold: "#f97316"
  status-hold-dim: "rgba(249, 115, 22, 0.12)"
  status-planning: "#a855f7"
  status-planning-dim: "rgba(168, 85, 247, 0.12)"
  status-teal: "#14b8a6"
  status-teal-dim: "rgba(20, 184, 166, 0.12)"
typography:
  display:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "'Plus Jakarta Sans', sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'IBM Plex Mono', monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.04em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "14px"
  full: "9999px"
  xs: "4px"
  xl: "24px"
  xxl: "32px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.lg}"
    padding: "16px 20px"
---

# Design System: Vyom ERP

## Overview

**Creative North Star: "The Industrial Control Room"**

Vyom ERP delivers an authoritative, high-density industrial control room experience purpose-built for the rigorous fabrication of custom electrical control panels. The interface balances high-throughput technical scanning with uncompromising engineering safety gates. Rather than treating panel manufacturing as generic inventory rows, the design language communicates physical manufacturing status with clarity across busy shop floors and engineering desks.

The aesthetic is anchored by cool slate charcoal surfaces (`#151821` to `#2d3446`), establishing an ergonomic, high-contrast visual substrate where status indicators pierce through high-ambient shop-floor illumination without glare or halation. Semantic neon accents (electric flame orange, high-voltage sky blue, pass-rate emerald, and fault crimson) serve as unequivocal telemetry signals, allowing engineers and shop supervisors to diagnose bottlenecks, holds, and approvals at a glance.

**Key Characteristics:**
- **High-Density Data Instrumentation:** Dense, tightly aligned tabular and Gantt views that maximize visible serials and line items per viewport without nested navigation.
- **Uncompromising Visual Gates:** Blocked states, missing engineering documents (Drawing & BOM), and hold conditions are rendered with unmistakable high-visibility contrast.
- **Tonal Depth & Crisp Boundaries:** Layers are separated by subtle surface stepping and 1px technical borders (`#2e3547`), avoiding distracting heavy drop shadows.
- **Dual Type Personality:** Humanist precision typography (`Plus Jakarta Sans`) for operational text paired with technical monospaced telemetry (`IBM Plex Mono`) for all order numbers, serial IDs, part numbers, and timestamps.

---

## Colors

The palette is tuned for high-contrast industrial readability: deep carbon neutrals form the chassis, while vibrant functional accents provide instantaneous status recognition.

### Primary
- **Safety Flame Orange** (`#f97316` / hover `#ea580c`): The operational brand color and primary call-to-action. Used for active navigation selections, pending review badges, primary buttons, and critical workflow forward actions.

### Secondary
- **Instrumentation Sky Blue** (`#38bdf8` / dim `rgba(56, 189, 248, 0.12)`): Active in-progress states, selected table rows, active department highlights, and informative engineering telemetry.

### Tertiary & Semantic Statuses
- **QC Emerald Pass** (`#10b981` / dim `rgba(16, 185, 129, 0.12)`): Completed steps, verified drawings, passed inspections, and confirmed releases.
- **Fault Crimson** (`#f87171` / dim `rgba(248, 113, 113, 0.12)`): Blocked stages, cancelled panels, failed QC checks, and destructive action triggers.
- **Engineering Amethyst** (`#a855f7` / dim `rgba(168, 85, 247, 0.12)`): Planning department schedules, wiring Gantt bars, and capacity allocation slots.
- **Assembly Teal** (`#14b8a6` / dim `rgba(20, 184, 166, 0.12)`): Mechanical mounting, sub-assembly milestones, and auxiliary stage tags.

### Neutral
- **Slate Charcoal Root** (`#151821`): Ergonomic canvas layer beneath the workspace, eliminating halation and eye fatigue.
- **Surface Slate** (`#1c202b`): Card, sidebar, header, and primary table container background.
- **Elevated Slate** (`#242937`): Modals, dropdown panels, active row hover backgrounds (`#222735` to `#262c3b`), and secondary surfaces.
- **Highlight Slate** (`#2d3446`): Selected control backgrounds and active tab buttons.
- **Boundary Border** (`#2e3547`): 1px structural grid lines separating table columns, header borders, and card outlines.
- **Boundary Strong** (`#3f475c`): Focus rings, scrollbar handles, and high-visibility splitters.
- **Text Primary** (`#f1f5f9`): High-legibility crisp white for primary headers, serial identifiers, and active values.
- **Text Secondary** (`#cbd5e1`): Elevated slate gray for descriptions, metadata, and scannable column titles.
- **Text Muted** (`#94a3b8`): Legible slate for tertiary labels, timestamps, and column headers.

### Named Rules
- **The Rarity of Flame Rule:** The primary accent (`#f97316`) is strictly reserved for user focus and critical forward progress. It must never coat decorative surfaces or exceed 10% of any viewport.
- **The Unambiguous Status Rule:** Every operational status badge must combine distinct hue, a 12% opacity tint container, and an explicit text label (never rely on color alone).

---

## Typography

**Display & UI Font:** `Plus Jakarta Sans`, sans-serif  
**Technical Telemetry Font:** `IBM Plex Mono`, monospace  

**Character:** Modern geometric clarity meets industrial instrument precision. Clean letterforms ensure fast readability on shop-floor tablets and desktop monitors.

### Hierarchy
- **Display** (Bold 700, `1.75rem`, `line-height: 1.2`): Page titles, top-level KPI metrics, and primary modal headers.
- **Headline** (SemiBold 600, `1.25rem`, `line-height: 1.3`): Department card titles, section groupings, and inspector slide-out headings.
- **Title** (SemiBold 600, `1.0rem`, `line-height: 1.4`): Table column headers, tab labels, and card summary captions.
- **Body** (Regular 400, `0.875rem`, `line-height: 1.5`): General UI text, client names, specifications, notes, and task descriptions.
- **Label** (Medium 500, `0.75rem`, `line-height: 1.4`, `letter-spacing: 0.04em`): Status badges, department indicators, priority pills, and metadata keys.

### Named Rules
- **The Monospace Serial Rule:** All order numbers (`YY(YY+1)XXXX`), unit serial numbers, line item tags, part numbers, and financial-year identifiers must be rendered in `var(--font-mono)` (`IBM Plex Mono`) to guarantee column alignment and unmistakable character differentiation (e.g., distinguishing `0` from `O` and `1` from `I`).

---

## Layout

The layout follows an industrial console spatial model optimized for dense desktop data operations:

- **Fixed Sidenav Layout:** Collapsible 240px dark sidebar (`#0d131f`) providing direct access to the 9-stage manufacturing pipeline (`Sales`, `Design`, `Purchase`, `Stores`, `Planning`, `Production`, `QC`, `Dispatch`, `Accounts`).
- **Master Header Bar:** 56px sticky top bar (`#111827`) housing plant status telemetry, active user role badge, quick search, and global actions.
- **KPI Stats Row:** 4-to-5 metric cards across the top displaying immediate operational volume: active pipeline count, urgent orders, in-progress tasks, hold counts, and weekly dispatch targets.
- **Data Workspace:**
  - **Master Multi-Column Table View (`AllOrdersTableView.jsx`):** Sticky frozen columns (Order #, Serial #), sortable headers, pinned filters, and dense 36px table rows for scanning hundreds of units.
  - **Planning Gantt Grid (`PlanningModule.jsx`):** Daily capacity buckets for mounting and wiring schedules.
  - **Board & Flow Pipeline (`BoardView.jsx`, `FlowView.jsx`):** Department-by-department stage lanes.
- **Spacing Scale:** Micro-steps (`4px`, `8px`, `12px`, `16px`, `24px`, `32px`) enforcing rhythmic visual compactness.

---

## Elevation & Depth

Vyom ERP relies primarily on **tonal layering and crisp boundary borders** rather than diffuse drop shadows. Because the software operates in high-ambient manufacturing environments, tonal stepping guarantees visible boundaries across monitors of varying contrast.

### Surface Stepping Vocabulary
- **Level 0 (Root Canvas):** `#0b0f19` (Canvas background)
- **Level 1 (Card & Sidenav):** `#111827` with 1px border `var(--border)` (`#1e293b`)
- **Level 2 (Active/Hover/Table Row Hover):** `#162032` to `#1a2234`
- **Level 3 (Modals & Overlays):** `#1a2234` with `0 8px 32px rgba(0, 0, 0, 0.45)` and 1px border `var(--border2)` (`#334155`)

### Named Rules
- **The Flat-at-Rest Rule:** Cards and table rows are flat at rest. Elevation and subtle ambient glows (`rgba(56, 189, 248, 0.15)`) appear strictly as interactive feedback during hover, selection, or modal focus.

---

## Shapes

The form language is disciplined, technical, and durable:

- **Corner Radius:**
  - `sm` (`4px`): Table cell badges, input fields, checkboxes, and inline code tags.
  - `md` (`8px`): Action buttons, dropdown panels, and task master step pills.
  - `lg` (`14px`): Workspace cards, metric stats widgets, and modal dialogue containers.
  - `full` (`9999px`): Department pills, priority pills, and user avatar chips.
- **Border Treatment:** High-contrast 1px solid borders (`var(--border): #1e293b`) frame every card, header, and input container.

---

## Components

### Buttons
- **Primary:** High-visibility safety flame (`#f97316`) background, white text, 8px radius, semi-bold typography, subtle hover shift to `#ea580c`.
- **Secondary / Ghost:** Transparent background with 1px slate border (`#334155`), slate-gray text (`#94a3b8`), shifting to crisp white text and `#243048` background on hover.
- **Destructive:** Crimson border and tint (`#f87171`), reserved strictly for hold requests, order cancellations, and item deletions.

### Status Chips & Badges
- **Format:** Compact pill (`rounded: full` or `rounded: 4px`), uppercase 11px monospaced or bold label, colored icon indicator.
- **Semantics:** 12% opacity tint container paired with 100% solid text and icon (e.g., Done: `#10b981` text over `rgba(16, 185, 129, 0.12)`).

### Cards & Metrics
- **Container:** Dark slate `#111827`, 14px radius, 1px border `#1e293b`.
- **Top Accent Line:** Subtle gradient bar along the top edge reflecting stage priority or status (orange, sky blue, emerald, amber).

### Inputs & Filters
- **Form Controls:** Dark background `#0b0f19`, 1px border `#334155`, 8px radius, placeholder in `#64748b`.
- **Focus State:** 1px border transition to primary `#f97316` or sky blue `#38bdf8` with a 2px ambient focus ring (`rgba(249, 115, 22, 0.2)`).

### Navigation
- **Sidebar Links:** 12px padding, 8px radius, muted text `#94a3b8`.
- **Active Navigation State:** Left-hand 3px solid flame border (`#f97316`), warm tint background (`rgba(249, 115, 22, 0.12)`), text `#fb923c`.

### Signature Component: The Engineering Gate Indicator
- In [StepModal.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/StepModal.jsx) and [AllOrdersTableView.jsx](file:///c:/Users/cerul/Documents/ERP/src/components/AllOrdersTableView.jsx), technical documents (Customer PO, Engineering Drawing, BOM) and design confirmation gates are rendered with dedicated lock/check icons:
  - **Locked/Missing:** Amber or red outlined pill indicating mandatory upload required.
  - **Unlocked/Verified:** Emerald pill with clickable document preview link and auditor timestamp.

---

## Do's and Don'ts

### Do:
- **Do** use `IBM Plex Mono` for all serial numbers, order numbers, part numbers, and timestamps.
- **Do** enforce high contrast for all status badges (pair icon + color + text label).
- **Do** preserve 1px technical borders between dark layers to maintain clarity on low-end shop-floor displays.
- **Do** display mandatory gates (PO upload, Drawing & BOM presence, Design confirmation) prominently before action buttons.
- **Do** support keyboard `Escape` closing behavior across all modals and slide-out drawers via `useGlobalModalEscape`.

### Don't:
- **Don't** use diffuse multi-colored drop shadows that muddy dark industrial interfaces.
- **Don't** use generic un-scoped colors (plain red, plain blue, neon yellow) outside the calibrated CSS token system (`--accent`, `--blue`, `--green`, `--red`, `--purple`, `--teal`).
- **Don't** hide critical order identifiers or manufacturing statuses behind multi-level hover tooltips; prioritize scannable inline chips.
- **Don't** allow UI actions that bypass upstream engineering gates (e.g., advancing a panel past Design without verified drawings and BOM).
