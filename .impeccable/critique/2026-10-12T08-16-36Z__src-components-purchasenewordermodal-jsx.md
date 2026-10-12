---
target_identity: "file:C:\\Users\\cerul\\Documents\\ERP\\src-components-purchasenewordermodal-jsx"
timestamp: 2026-10-12T08-16-36Z
slug: src-components-purchasenewordermodal-jsx
---
# Design Critique: New Purchase Order Modal (`PurchaseNewOrderModal.jsx`)

**Target:** `src/components/PurchaseNewOrderModal.jsx`  
**Method:** ⚠️ DEGRADED: single-context (no sub-agent tool exposed in harness)  
**Surface Role:** Procurement & Buying Operational Interface (Operate Mode)  

---

## 1. Design Health Score (Nielsen Heuristics)

| Heuristic | Score (0–4) | Key Finding |
|---|---|---|
| **1. Visibility of System Status** | 3/4 | Green toast confirms save; auto-date badge clearly shows operation creation date. Missing line-item totals or draft status indicators. |
| **2. Match Between System & Real World** | 2/4 | Four technical panel categories (Panel, Automation, Low Voltage, Wires) match shop-floor realities, but lacks vendor name, quote ref, payment terms, or bill-to/ship-to entities. |
| **3. User Control & Freedom** | 3/4 | Users can add/remove multiple PO numbers and cancel without data corruption; however, accidental modal dismissal during complex drafting lacks unsaved changes warning. |
| **4. Consistency & Standards** | 2/4 | Save button sits inline inside the top filter bar instead of standard modal bottom-right action bar; "Cancel" and "Close" duplicate the modal exit affordance. |
| **5. Error Prevention** | 2/4 | Empty PO numbers auto-fallback to generated IDs, but no duplicate PO number validation against existing purchase records; no vendor selection validation. |
| **6. Recognition Rather than Recall** | 2/4 | Top category icons are communicative, but the workspace canvas is an empty dashed placeholder rather than displaying vendor catalogs or panel order links. |
| **7. Flexibility & Efficiency of Use** | 3/4 | Segmented PO controls auto-expand snuggly to input length; keyboard navigation works, but lacks batch item pasting, CSV import, or BOM auto-fill. |
| **8. Aesthetic & Minimalist Design** | 3/4 | Top control bar is tight and aligned; however, the lower 65% of the modal is dominated by a giant decorative dashed placeholder box. |
| **9. Help Users Recognize Errors** | 3/4 | Input focus rings provide clear active states; missing inline error feedback if storage fails. |
| **10. Help & Documentation** | 3/4 | Category descriptions are descriptive; subtitle clearly sets the scope for procurement. |

**Overall Heuristic Health Index: 2.6 / 4.0** *(Functional base, but currently an incomplete creation wizard).*

---

## 2. Design Specificity & Domain Fit
- **Domain Alignment:** Vyom ERP is an industrial control room for custom electrical switchboards. While the four procurement categories (`Panel`, `Automation`, `Low voltage`, `Wires & Accessories`) accurately reflect panel engineering supply chains, the interface currently stops at the header level.
- **The "Placeholder Void":** 65% of the modal's viewport area is consumed by a dashed empty canvas box with a center icon and text saying *"Ready for Fields"*. In an industrial ERP, a purchase order creation modal must allow buyers to enter actual vendor commitments, line items, unit rates, quantities, and delivery targets.

---

## 3. Cognitive Load & Information Architecture
1. **Mislocated Primary Action:** The primary `Save` button is currently housed inside the top filter strip next to `+ Add PO`. Standard mental models for modal dialogs place primary confirmation (`Create PO` / `Save Order`) in the bottom footer.
2. **Double Exit Paradox:** The bottom footer has both `Cancel` and `Close` buttons sitting side-by-side performing the identical `onClose` function.
3. **Missing Critical Purchase Order Schema:** A real procurement transaction requires:
   - Vendor / Supplier Selection
   - Buyer / Issued By
   - Linked Panel Order (linking purchase to a client's panel serial)
   - Line Items Table (Part Number, Description, Qty, Unit, Estimated Rate, Amount)
   - Total Order Value & Tax Summary

---

## 4. Priority Issues (P0–P2)

### 🔴 P0 — Critical Functional Deficit
- **Empty Canvas:** The modal does not yet provide line items, vendor fields, or financial totals, leaving buyers unable to complete a real purchase transaction.

### 🟡 P1 — Structural & Ergonomic Misalignments
- **Action Hierarchy Inversion:** Moving `Save` to the modal footer creates a predictable form flow (Inputs Top → Line Items Center → Summary & Confirm Bottom-Right).
- **Redundant Footer Buttons:** Eliminate the redundant `Close` button; replace with a clean `Cancel` (ghost) and `Create Purchase Order` (solid green/accent) footer pair.
- **Unsaved Changes Safety:** Add confirmation before closing if the user entered line items or PO numbers.

### 🟢 P2 — Visual Polish & System Tokens
- Replace literal font-size steps (`11px`, `13px`, `18px`) and radii with documented tokens from `DESIGN.md`.
- Ensure vendor dropdown and category selector share matching input dimensions and focus rings.

---

## 5. Architectural Redesign Blueprint

A high-grade industrial purchase order creation interface structured into 3 functional zones:

1. **Header & Context Bar (Top):**
   - Category selector with icon badges.
   - Primary PO Number + Auto-Date badge + `+ Add PO` for multi-PO split shipments.
   - Vendor / Supplier Selector with GSTIN/Contact summary.
   - Target Delivery Date & Linked Panel / Job reference.

2. **Purchasing Line Items Grid (Center):**
   - High-density table: Item #, Part / Component Description, HSN/SAC, Qty, Unit (Nos, Mtrs, Sets), Unit Rate (₹), Subtotal.
   - `+ Add Line Item` button and quick-delete row actions.
   - Live auto-calculating total amount & GST summary card.

3. **Control & Confirmation Action Bar (Bottom Footer):**
   - Left: Quick summary pill (e.g. `3 Items · Total: ₹1,42,800 · Vendor: Siemens India`).
   - Right: Secondary `Cancel` button + Primary `Save Purchase Order` button.
