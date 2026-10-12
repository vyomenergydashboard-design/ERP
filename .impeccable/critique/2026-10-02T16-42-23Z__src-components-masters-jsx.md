---
target_identity: "file:C:\\Users\\cerul\\Documents\\ERP\\src\\components\\Masters.jsx"
target_fingerprint: "sha256:a6ab760fd449bfae0fbc4062cb8d48868163f13bc4e83b2a7fbe617c5cd993b4"
target_path: "C:\\Users\\cerul\\Documents\\ERP\\src\\components\\Masters.jsx"
timestamp: 2026-10-02T16-42-23Z
slug: src-components-masters-jsx
closed: true
---
# Design Critique: Task Masters & Modal Interface (`src/components/Masters.jsx`)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Department groupings are clear, but modal lacks explicit feedback on unsaved changes. |
| 2 | Match System / Real World | 3 | "Unit Level (Per Panel / Serial)" terminology maps well to electrical fabrication. |
| 3 | User Control and Freedom | 2 | Cancel button has severe contrast breakdown (`#333` fill in light mode); no discard guard. |
| 4 | Consistency and Standards | 2 | Heavy design token drift: hardcoded `#333`, `#fff`, `6px` radii, and non-canonical blues. |
| 5 | Error Prevention | 2 | Auto-Done trigger builder permits custom SQL/column entry without schema validation. |
| 6 | Recognition Rather Than Recall | 3 | Order field tags are selectable chips, but custom datakeys demand recall of DB columns. |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcut for quick modal submission (`Cmd/Ctrl+Enter`), tab traps in chips. |
| 8 | Aesthetic and Minimalist Design | 2 | Visual cramming: modal exceeds standard viewport height, awkward button placement. |
| 9 | Error Recovery | 2 | Only native browser tooltip validation; no clear recovery for malformed conditions. |
| 10 | Help and Documentation | 2 | Microcopy is present for Notes, but complex IF-statement triggers lack tooltips or examples. |
| **Total** | | **23/40** | **Needs Work (Drift & Contrast Issues)** |

## Design Specificity Verdict

**LLM Assessment:** The high-level page information architecture is well-grounded in manufacturing realities (departmental task hierarchies, order vs. unit scopes, mandatory PO gates). However, the modal execution suffers from **severe visual drift and theme dissonance**. Hardcoded inline styles (`color: '#fff'`, `background: '#333'`, `borderRadius: '6px'`) bypass the CSS variable system defined in `DESIGN.md`, causing broken contrast when viewing the system in Light mode. The "Cancel" button in particular renders as a black rectangle with nearly invisible dark text inside a white modal.

**Deterministic Scan:** Automated inspection detected 16 advisory drift violations across `src/components/Masters.jsx`:
- **Color Drift:** Hardcoded `#ef4444`, `rgba(234, 179, 8, 0.1)`, `rgba(59, 130, 246, 0.15)`, `#3b82f6` rather than using semantic design tokens (`var(--red)`, `var(--amber)`, `var(--blue)`).
- **Radius Drift:** Pervasive use of `6px` border radii instead of the design system scale (`4px`, `8px`, `14px`).
- **Typography Drift:** Off-scale font sizes (`11px`, `13px`) applied inline instead of typography tokens.

## Overall Impression
The task master engine is functionally potent and directly tailored to custom electrical control panel workflows. However, the modal UI feels unpolished and fragile: hardcoded dark-mode styles break under light theme, the modal vertically overflows dense displays, and the primary/secondary button hierarchy is visually inverted.

## What's Working
1. **Clear Domain Scoping:** The explicit choice between "Unit Level (Per Panel / Serial)" and "Order Level" perfectly matches the real-world manufacturing model where some tasks apply per panel and others per order.
2. **Order Field Chips:** The selectable tag cloud for "Order Fields to Show" provides clean, click-to-toggle affordances with checkmarks rather than a tedious multi-select menu.
3. **Department Color Anchors:** Sidenav department tags with distinct semantic color badges reinforce pipeline position.

## Priority Issues

### [P0] What: Broken Contrast on Action Buttons in Light Theme
- **Why it matters:** The "Cancel" button has an inline style `style={{ background: '#333' }}`. In light mode, the modal background is white (`#ffffff`), producing an aggressive black block with illegible text. The "Update Task" primary button lacks the canonical safety flame orange (`#f97316`), confusing visual hierarchy.
- **Fix:** Replace inline `#333` with `var(--border2)` or transparent ghost styling (`.vbtn-ghost`). Apply `var(--accent)` (`#f97316`) with white text to the primary submit button.
- **Suggested command:** `/impeccable polish`

### [P1] What: Theme Inversion on Section Dividers and Headings
- **Why it matters:** Section labels and borders use hardcoded dark colors like `color: '#fff'` and `borderTop: '1px solid #333'`. In light mode, white labels disappear against the white card, and `#333` lines create jarring harsh cuts.
- **Fix:** Replace all hardcoded `#fff` with `var(--text)` and `#333` with `var(--border)`.
- **Suggested command:** `/impeccable colorize`

### [P2] What: Modal Height Cramming and Overflow
- **Why it matters:** With Department, Scope, Task Name, Description, Checkboxes, Order Fields, and Form Fields all expanded simultaneously, the modal exceeds 80vh on laptop screens. The footer buttons get shoved against the bottom edge without proper visual padding.
- **Fix:** Structure the modal with a fixed header, scrollable `max-height: calc(85vh - 120px)` body with smooth overflow, and a sticky pinned footer.
- **Suggested command:** `/impeccable layout`

### [P3] What: Unvalidated Auto-Done Trigger Entry
- **Why it matters:** Administrators configuring custom datakeys can enter arbitrary strings like `table.column_name` without feedback on whether the column exists in PostgreSQL, risking silent failure during task automation.
- **Fix:** Add inline validation or restrict to discovered schema keys, with clear example helper text.
- **Suggested command:** `/impeccable clarify`

## Persona Red Flags

- **Elena (Plant Operations Admin / Power User):** Cannot rapidly create tasks using keyboard navigation alone. When pressing `Enter` in the "Task Name" input, the form might submit before she can configure custom fields or checkboxes. No `Esc` key visual hint.
- **Marcus (Manufacturing Engineer):** In high-ambient factory light using a laptop in light mode, the "Cancel" button and light-colored chips blend into the modal surface or appear inverted, leading to accidental misclicks.

## Minor Observations
- The "✕" modal close button lacks an explicit `aria-label="Close modal"` and has minimal hit area (less than 32px).
- Checkboxes use native unstyled browser inputs rather than custom branded checkboxes matching the 8px/4px radius language.
- The "+ Add Field" button uses an un-tokenized blue (`rgba(59,130,246,0.15)`) instead of the system's secondary blue (`var(--blue-dim)`).

## Questions to Consider
- Does the Form Field / Auto-Done builder need to be open inside this primary creation modal, or would an accordion or separate configuration drawer feel calmer and less overwhelming?
- Should the "Cancel" button be styled as a clear ghost/outline button to ensure seamless contrast across both light and dark themes?
