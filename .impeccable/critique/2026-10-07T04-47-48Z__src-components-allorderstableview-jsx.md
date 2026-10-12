---
target: AllOrdersTableView
total_score: 18
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\cerul\\Documents\\ERP\\src\\components\\AllOrdersTableView.jsx"
target_fingerprint: "sha256:8627078a014d74098946fd8b9bb785ad019a8d3c6dcd517009c55923462d7363"
target_path: "C:\\Users\\cerul\\Documents\\ERP\\src\\components\\AllOrdersTableView.jsx"
timestamp: 2026-10-07T04-47-48Z
slug: src-components-allorderstableview-jsx
---
### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Inline updates lack persistent success feedback; PO upload progress has minimal visual feedback; filter active states lack clear badge counts. |
| 2 | Match System / Real World | 3 | Solid domain vocabulary (panel codes, IP ratings, serials), but awkward column labels ("Type (Design)") and conflated status filters ("Incomplete" = Not Started + In Process). |
| 3 | User Control and Freedom | 2 | No "Undo" for accidental inline cell edits; destructive PO file deletion is immediate; batch deselect is buried in small inline counter chip. |
| 4 | Consistency and Standards | 2 | Fragmented click paradigms: Order # navigates, Paperclip opens docs modal, Serial # navigates, Part # opens technical docs modal, PO # opens PDF modal or inline input, Ref/Tag opens modal or inline input, Date opens picker, Panel size opens combobox portal, Priority and Classification are inline selects. |
| 5 | Error Prevention | 1 | Unlocked, live inline editing by default without an "Edit Mode" toggle; clicking table cells can inadvertently alter production classification or priority, immediately triggering backend PUT requests and unconfirming design sign-offs. |
| 6 | Recognition Rather Than Recall | 2 | Critical interactions are hidden: column auto-fit requires double-clicking invisible 10px boundary; canvas pan requires dragging empty background; no indicator shows which cells are clickable vs editable. |
| 7 | Flexibility and Efficiency | 3 | Rich power-user tools (drag-and-drop column reorder, column freeze/pinning, drag-selection across rows, multi-field search), but lacks keyboard grid navigation (arrows/Enter/Tab) and bulk editing. |
| 8 | Aesthetic and Minimalist Design | 1 | Severe visual over-saturation ("Christmas tree effect"): every row renders up to 7 distinct saturated neon accent colors simultaneously, violating the Design System's "Rarity of Flame" and "Flat-at-Rest" rules; cognitive overload from 17 dense columns. |
| 9 | Help Users Recognize, Diagnose, and Recover from Errors | 1 | 15 blocking native browser `alert()` popups for role permissions, missing selections, and validation errors instead of non-modal toasts or inline callouts. |
| 10 | Help and Documentation | 1 | Zero inline guidance, empty-state coaching, or keyboard help; tooltips are unformatted raw multi-line strings. |
| **Total** | | **18/40** | **Poor (Major UX overhaul required; core experience broken)** |

### Design Specificity Verdict

**LLM Assessment**:
While `AllOrdersTableView` possesses authentic industrial manufacturing DNA (order numbers in financial year format `YY(YY+1)XXXX`, continuous unit serials, panel IP ratings, and design classification gates), the execution currently suffers from "kitchen sink spreadsheet" degradation. Rather than functioning as a disciplined industrial control room cockpit, it packs 17+ simultaneous interactive widgets into every row. Crucially, the most critical manufacturing invariant in the system—the Drawing and BOM verification gate—is invisible on the row itself (hidden behind a clickable Part Number link that opens a modal), whereas secondary fields like arbitrary comments and description crowd the primary viewport. The interface confuses dense data visualization with unconstrained inline form controls.

**Deterministic Scan**:
The mechanical detector found **94 total findings** in `src/components/AllOrdersTableView.jsx`:
- **87 Color outside DESIGN.md (`design-system-color`)**: Extensive hardcoded palette leaks (`#ef4444`, `#f59e0b`, `rgba(59, 130, 246, ...)`, `#3b82f6`, `#818cf8`, `#fbbf24`, etc.) bypassing the calibrated obsidian/slate and semantic neon tokens.
- **2 Bounce or elastic easing (`bounce-easing`)**: Warning at lines 2326 & 2650 (`animate-bounce` on `UploadCloud` icon inside PO drag-and-drop zones). Industrial interfaces demand smooth exponential deceleration, not playful bouncing.
- **4 Font size outside DESIGN.md (`design-system-font-size`)**: Uncalibrated 11px and 13px font sizes off the type ramp.
- **1 Radius outside DESIGN.md (`design-system-radius`)**: 6px border-radius outside the standard 4px/8px/14px scale.

**Visual Overlays**:
Live browser presentation was not active in this session (dev server not running locally on ports 5173/5000); fallback deterministic static analysis used.

### Overall Impression
A powerful, feature-rich industrial workspace that has been overwhelmed by unmediated feature accumulation. It contains sophisticated spatial controls (drag reordering, column freezing, multi-row drag selection), but suffers from serious cognitive noise, 15 jarring browser `alert()` popups, and dangerous live-by-default inline editing that risks accidental production data changes.

### What's Working
- **Spatial Control Mechanics**: Column pinning/freezing on the left edge with sticky offset math, live drag-and-drop column reordering with drop indicators, and double-click auto-fit boundaries provide genuine spreadsheet flexibility for power users.
- **Batch Selection Ergonomics**: Multi-row selection supporting Shift-clicks and click-drag selection sweeps across checkbox cells, persisted cleanly in `localStorage`.
- **Industrial Telemetry Styling Foundation**: Monospaced typography for order numbers and serial badges with tabular numerals, paired with dark obsidian/slate row alternation.

### Priority Issues

- **[P0] Accidental Production Data Mutation via Unlocked Inline Editing**
  - **Why it matters**: Users clicking rows to inspect them or select them can inadvertently click inline `<select>` or `<input>` elements (Classification, Priority, Delivery Date, Panel Size). Changing classification immediately resets Design confirmation in the backend and triggers a network PUT request with no confirmation or undo, corrupting the production pipeline.
  - **Fix**: Implement an explicit "Edit Mode" toggle (or double-click to edit) with a draft state and "Save / Cancel" confirmation bar, rather than having live edit inputs permanently active on rest.
  - **Suggested command**: `/impeccable harden`

- **[P1] 15 Disruptive Native Browser alert() Dialogs**
  - **Why it matters**: Native browser modal dialogs (`alert("Only Sales, Admin, and Manager roles can upload PO documents")`, `alert("Please select the serial numbers... first")`) freeze the browser thread, look amateurish, and break keyboard flow.
  - **Fix**: Replace all native `alert()` calls with inline banner alerts or accessible toast notifications.
  - **Suggested command**: `/impeccable polish`

- **[P1] Interaction Model Chaos Across Table Columns**
  - **Why it matters**: Almost every cell in a single row has an inconsistent, unpredictable click behavior (Order # opens drawer, Paperclip opens docs modal, Serial # opens drawer, Part # opens technical docs modal, PO # opens PDF viewer or text input, Ref/Tag opens indent PDF or modal, Delivery Date opens datepicker, Panel Size opens a 380px combobox portal). Users cannot form a coherent mental model of what a click will do.
  - **Fix**: Standardize row interactions: clicking anywhere on the row selects it or opens the Inspector Drawer (`RightPanel`); reserve dedicated, clearly afforded icon buttons (with consistent visual styling) for opening modals and attachments.
  - **Suggested command**: `/impeccable layout`

- **[P2] Visual Over-Saturation & "Christmas Tree" Telemetry**
  - **Why it matters**: Every row displays a riot of competing neon colors (blue serial, purple panel code, emerald IP rating, amber ref/tag, red overdue/urgent, blue project link, multicolored status pills), violating the Design System's "Rarity of Flame" rule and creating severe cognitive fatigue.
  - **Fix**: Mute secondary technical metadata (render panel codes, IP ratings, ref/tags in calm neutral slate tones `#94a3b8` / `#64748b`), reserving vivid neon status accents strictly for primary state (Status, Urgent Priority, Blocking Gates).
  - **Suggested command**: `/impeccable quieter`

- **[P2] Missing DOM Virtualization & Sluggish High-Volume Performance**
  - **Why it matters**: When selecting 250 or "All" on plants with hundreds of panels, rendering full DOM trees with inline comboboxes, SVGs, and event handlers causes notable scroll lag and input latency.
  - **Fix**: Integrate lightweight windowing/virtualization (e.g. `@tanstack/react-virtual` or CSS content-visibility) to render only visible viewport rows.
  - **Suggested command**: `/impeccable optimize`

### Persona Red Flags
- **Alex (Power User / Production Head)**: Cannot navigate the table via keyboard (no Arrow key navigation between cells, no Tab/Enter shortcuts). When filtering to "All" records, the unvirtualized table stutters. No batch actions exist to bulk-update Priority or Delivery Dates (only PO upload can be batched).
- **Jordan (First-Time Sales Coordinator)**: Startled by thread-blocking browser `alert()` popups when attempting to upload a PO before checking boxes. Terrified of misclicking because dropdowns edit live database values immediately without an "Are you sure?" confirmation.
- **Sam (Accessibility / Screen Reader User)**: Table lacks ARIA grid semantics (`role="grid"`, `aria-sort`, `aria-selected="true"`). Interactive cells use unstyled `<div>` and `<span>` elements with click handlers without `tabIndex={0}` or `role="button"`. Contrast on resize handles and muted borders is too low (`rgba(255,255,255,0.035)`). Overdue status is conveyed solely via red text.
- **Riley (Quality & Compliance Head)**: Notices that the signature engineering gate (Engineering Drawing & BOM upload verification) is completely missing from the table rows! It is buried inside the Part Number modal, forcing Riley to click into every single part to verify if mandatory design drawings are present before release.

### Minor Observations
- "Reset Layout" button is always present in the toolbar even when the layout has not been customized or altered.
- Column header label "Type (Design)" is ambiguous compared to "Design Classification (Std / Non-Std)".
- Bounce animation (`animate-bounce`) on the PO upload cloud icon is visually inconsistent with an industrial control room.
- In-table tooltip strings are unformatted multi-line strings (`\n`) that render in default OS tooltip styling.

### Questions to Consider
- What if the table had an explicit "View Mode" vs "Edit Mode", making data scanning clean and 100% safe from accidental edits?
- What if the signature "Drawing & BOM Gate Indicator" was displayed directly in each row as a visual telemetry lock, making engineering readiness scannable at a glance?
- What if cell interactions were consolidated into a single standard: row click opens the inspector drawer, and explicit action buttons handle documents and sign-offs?
