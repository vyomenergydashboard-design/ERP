# Confirmed Statement of Intent: Design Department Confirmation & Auto Release Documents

## Metadata
- **Initiative:** Design Confirmation Gate & Dynamic Release Documents Status
- **Date:** 2026-09-30
- **Status:** Confirmed by User

## Core Intent
- **Outcome:** Provide an explicit Design Confirmation gate in Table View (`Type (Design)` column) and drive the Design **"Release Documents"** step status automatically based on actual Technical Drawing & BOM presence.
- **User:** `Design` department engineers and `Admin` users, providing them with a dedicated inspection window and clear visual cues before panels advance downstream.
- **Why Now:** Panels must have a deliberate inspection window so they never prematurely advance downstream. Design needs instant visibility into document readiness (what action is required) and must explicitly confirm the panel before it releases to Purchase, Stores, and Planning.
- **Success Criteria:**
  1. **Table View Confirmation Button:** A `Confirm` button appears beside the Standard / Non-Standard dropdown in the **Type (Design)** column in `AllOrdersTableView.jsx`.
  2. **Step 1 Auto-Completion:** Clicking `Confirm` marks Design classification as confirmed and completes **Step 1 ("Review & Classify")**.
  3. **Step 2 Dynamic Auto-Status ("Release Documents"):**
     - **Done:** Both Technical Drawing and BOM are present **AND** Design has confirmed the panel (clearing it to advance downstream).
     - **In Progress:** Exactly one document (only Drawing OR only BOM) is present (indicating to Design which document is still needed).
     - **Pending:** Neither document is present.
  4. **Confirmed State & Re-evaluation:** A confirmed panel displays a green `✓ Confirmed` badge. If an authorized user alters the dropdown classification, the confirmation status resets, allowing re-inspection and re-confirmation.
  5. **Universal Support:** Document detection works seamlessly for both Standard panels (Master Catalog drawings & BOMs) and Non-Standard panels (unit-specific custom uploads).
  6. **Security & RBAC:** Only `Design` and `Admin` roles can change classification or confirm.
- **Constraint:** Strict RBAC enforcement; order numbers and unit serials remain immutable; additive and non-destructive database updates.
- **Out of Scope:** Modifications to downstream department workflows (Purchase/Stores/Planning); redesigning master catalog schemas; altering the internal structure of document upload modals.
