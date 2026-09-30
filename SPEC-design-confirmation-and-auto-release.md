# Spec: Design Department Confirmation Gate & Dynamic Release Documents Status

## 1. Objective

Enable the Design department to maintain full inspection control over panel workflows before units advance to downstream departments (Purchase, Stores, Planning, Production). 

Specifically:
1. **Design Confirmation Gate:** Provide an explicit `Confirm` button next to the Standard / Non-Standard dropdown in the **Type (Design)** column in Table View. Clicking this confirms the panel's classification and marks Step 1 ("Review & Classify") as **Done**.
2. **Dynamic "Release Documents" Status:** Step 2 status dynamically reflects actual document readiness:
   - **Auto Done:** When BOTH Technical Drawing and BOM are attached **AND** Design has confirmed the panel (releasing the panel downstream).
   - **Auto In Progress:** When exactly ONE of Drawing or BOM is attached (signaling to Design that one document is still missing).
   - **Pending:** When NEITHER document is attached.
3. **Universal Document Detection:** Operates seamlessly for both **Standard panels** (checking Master Catalog drawings & BOMs linked to the part number) and **Non-Standard panels** (checking unit-specific custom drawings & BOMs uploaded in the technical documents modal).
4. **Re-evaluation & Reversibility:** If an authorized user changes the classification dropdown on a confirmed panel, the confirmation resets to unconfirmed, re-opening the inspection window and preventing downstream progression until re-confirmed.

---

## 2. Tech Stack

- **Frontend:** React 18.3, Vite 5.4, `lucide-react` icons, Vanilla CSS tokens (`src/index.css`)
- **Backend:** Node.js (ESM), Express 4.19, PostgreSQL (`pg` pool, TCP 5432/5433)
- **Database Schema:** PostgreSQL (`order_units`, `unit_steps`, `documents`, `part_number_masters`)

---

## 3. Commands

- **Build Frontend:** `npm run build`
- **Lint / Syntax Check:** `npm run check`
- **Run Backend:** `cd server && node index.js`
- **Run Frontend Dev:** `npm run dev`
- **Run Verification Tests:** `node server/test_po_system.js`

---

## 4. Project Structure & Affected Modules

```
ERP/
├── docs/
│   └── intent/
│       └── design-confirmation.md      # Confirmed statement of intent
├── SPEC-design-confirmation-and-auto-release.md # This specification
├── server/
│   ├── run_deployment_migrations.js    # Additive migration for order_units design confirmation columns
│   └── index.js                        # Confirmation endpoint, document presence evaluator, query enrichments
└── src/
    ├── components/
    │   ├── AllOrdersTableView.jsx      # Confirmation button in Type (Design) column & real-time status reflection
    │   └── StepModal.jsx               # Display confirmed metadata and synced step statuses
    └── index.css                       # Styling tokens for confirmation badges and buttons
```

---

## 5. Detailed Technical Architecture

### 5.1 Database Schema (Additive & Non-Destructive)

In [server/run_deployment_migrations.js](file:///c:/Users/cerul/Documents/ERP/server/run_deployment_migrations.js):
```sql
ALTER TABLE order_units
ADD COLUMN IF NOT EXISTS design_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS design_confirmed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS design_confirmed_by INTEGER REFERENCES users(id);
```

### 5.2 Backend API & Workflow Logic

In [server/index.js](file:///c:/Users/cerul/Documents/ERP/server/index.js):

1. **`GET /api/orders` & `GET /api/units` Query Enrichment:**
   - Include `ou.design_confirmed`, `ou.design_confirmed_at`, `ou.design_confirmed_by`, and `u_conf.name as design_confirmed_by_name` (via LEFT JOIN on `users u_conf ON ou.design_confirmed_by = u_conf.id`).

2. **Dedicated Confirmation Endpoint: `POST /api/units/:id/design-confirm`:**
   - **Authorization:** `authorize(['Admin', 'Manager', 'Design'])`.
   - **Actions in a dedicated transaction:**
     1. Update `order_units`:
        ```sql
        UPDATE order_units 
        SET design_confirmed = true, 
            design_confirmed_at = NOW(), 
            design_confirmed_by = $1 
        WHERE id = $2 RETURNING *;
        ```
     2. Complete Step 1 ("Review & Classify"):
        ```sql
        UPDATE unit_steps 
        SET status = 'done', 
            notes = 'Classification confirmed by Design team.', 
            updated = NOW() 
        WHERE order_unit_id = $1 AND dept = 'Design' 
          AND (name = 'Review & Classify' OR name ILIKE '%classify%');
        ```
     3. Evaluate Step 2 ("Release Documents") document presence:
        - Check Drawing presence (`hasDrawing`) and BOM presence (`hasBom`).
        - If `hasDrawing && hasBom`:
          - Mark Step 2 as `done` (`notes = 'Auto-completed: Drawing and BOM released.'`).
          - Log activity in `activity_logs`.
        - If `hasDrawing || hasBom`:
          - Mark Step 2 as `inprogress` (`notes = 'Partial documents attached (Drawing or BOM pending).'`).
        - If neither:
          - Mark Step 2 as `pending` (`notes = 'Awaiting Drawing and BOM upload.'`).
     4. Log action in `activity_logs`.

3. **Classification Reset on Change (`PUT /api/units/:id`):**
   - When `classification` is updated (e.g. Standard ↔ Non-Standard):
     - Reset `design_confirmed = false`, `design_confirmed_at = null`, `design_confirmed_by = null`.
     - Step 1 ("Review & Classify") reverts to `pending` or `inprogress`.
     - If Step 2 was `done`, revert Step 2 to `inprogress` (if docs exist) or `pending`.

4. **Document Hook (`POST /api/documents` and `DELETE /api/documents/:id`):**
   - When a Drawing or BOM is uploaded or deleted for a unit, trigger `syncUnitDesignDocumentStatus(unitId)`:
     - Check `design_confirmed`:
       - If `design_confirmed === true`:
         - Both exist → Step 2 `done`.
         - Only 1 exists → Step 2 `inprogress`.
         - 0 exist → Step 2 `pending`.
       - If `design_confirmed === false`:
         - If 1 or 2 exist → Step 2 `inprogress` (visible progress indicator for Design, but not released to next dept).
         - If 0 exist → Step 2 `pending`.

### 5.3 Frontend UI/UX in `AllOrdersTableView.jsx`

In the table cell for `case 'classification':`:

1. **Rendering `Type (Design)` Cell:**
   - Display the Standard / Non-Standard select dropdown (or text tag if read-only).
   - Beside the dropdown:
     - If `design_confirmed`:
       - Display a badge: `<span className="badge-confirmed">✓ Confirmed</span>`
       - Tooltip: `"Confirmed by {design_confirmed_by_name} on {formatFastDateTime(design_confirmed_at)}"`
       - If user is `Design` or `Admin`, clicking or hovering shows an option to "Unconfirm / Re-check" if revision is needed.
     - If `!design_confirmed`:
       - Display an actionable button: `<button className="btn-confirm-design" onClick={...}>Confirm</button>` (enabled for `Design` and `Admin`).
       - For other roles (e.g. Sales, Production), display a muted badge: `<span className="badge-unconfirmed">Unconfirmed</span>`.

2. **Optimistic Updates:**
   - Clicking `Confirm` immediately flips `design_confirmed = true` in state, updates Step 1 to `done`, and recalculates Step 2 status without full table re-render or loss of scroll position.

---

## 6. Code Style & Example

### Example: Transactional Confirmation Handler in Backend
```javascript
app.post('/api/units/:id/design-confirm', authorize(['Admin', 'Manager', 'Design']), async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Mark unit confirmed
    const uRes = await client.query(
      `UPDATE order_units 
       SET design_confirmed = true, design_confirmed_at = NOW(), design_confirmed_by = $1 
       WHERE id = $2 RETURNING *`,
      [req.user.id, id]
    );
    if (uRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Unit not found' });
    }
    const unit = uRes.rows[0];

    // 2. Mark Step 1 Done
    await client.query(
      `UPDATE unit_steps 
       SET status = 'done', notes = 'Classification confirmed by Design', updated = NOW() 
       WHERE order_unit_id = $1 AND dept = 'Design' 
         AND (name = 'Review & Classify' OR name ILIKE '%classify%')`,
      [id]
    );

    // 3. Evaluate documents presence
    const docStatus = await evaluateUnitDocumentsPresence(client, unit);
    let step2Status = 'pending';
    let step2Notes = 'Awaiting Drawing and BOM';

    if (docStatus.hasDrawing && docStatus.hasBom) {
      step2Status = 'done';
      step2Notes = 'Auto-completed: Drawing and BOM confirmed & released';
    } else if (docStatus.hasDrawing || docStatus.hasBom) {
      step2Status = 'inprogress';
      step2Notes = `Partial documents: ${docStatus.hasDrawing ? 'Drawing attached, BOM pending' : 'BOM attached, Drawing pending'}`;
    }

    await client.query(
      `UPDATE unit_steps 
       SET status = $1, notes = $2, updated = NOW() 
       WHERE order_unit_id = $3 AND dept = 'Design' 
         AND (name = 'Release Documents' OR name ILIKE '%release%')`,
      [step2Status, step2Notes, id]
    );

    await client.query('COMMIT');
    res.json({ success: true, unit, step2Status });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: 'Failed to confirm design' });
  } finally {
    client.release();
  }
});
```

---

## 7. Testing Strategy

1. **Unit & Syntax Validation:**
   - Execute `npm run check` to ensure 0 undeclared variables or syntax errors in React components.
2. **Schema & Migration Test:**
   - Verify that `server/run_deployment_migrations.js` adds columns idempotently without affecting active orders or serial counters.
3. **Automated PO Hierarchy & Workflow Suite:**
   - Run `node server/test_po_system.js` to ensure core order ingestion and step assignment remain healthy.
4. **End-to-End Workflow Verification:**
   - **Test Case 1 (Standard Panel with Full Docs):** Part number has both Drawing & BOM. Click `Confirm` → Step 1 becomes `done`, Step 2 becomes `done`.
   - **Test Case 2 (Standard Panel with Partial Docs):** Part number has Drawing but no BOM. Click `Confirm` → Step 1 becomes `done`, Step 2 becomes `inprogress`. Upload BOM → Step 2 flips to `done`.
   - **Test Case 3 (Non-Standard Panel):** Unit is marked Non-Standard. Click `Confirm` without custom docs → Step 1 `done`, Step 2 `pending`. Upload custom Drawing → Step 2 `inprogress`. Upload custom BOM → Step 2 `done`.
   - **Test Case 4 (Re-evaluation on Dropdown Change):** Change confirmed unit from Standard to Non-Standard → confirmation resets to `unconfirmed`, Step 2 resets according to custom docs.

---

## 8. Boundaries

- **Always:**
  - Wrap multi-table updates in PostgreSQL transactions with `BEGIN` / `COMMIT` / `ROLLBACK` and guaranteed `client.release()` in a `finally` block.
  - Enforce role-based access control (`Admin`, `Manager`, `Design`).
  - Maintain optimistic UI updates for instant responsiveness without table re-scrolling.
- **Ask First:**
  - If downstream steps in Purchase or Stores need to be blocked by hard database foreign keys rather than current department queue filtering.
- **Never:**
  - Never alter, resequence, or recalculate existing order numbers or unit serials.
  - Never drop existing columns or execute destructive DDL commands (`TRUNCATE`, `DROP TABLE`).
  - Never allow non-Design / non-Admin users to trigger Design confirmation.

---

## 9. Success Criteria

- [ ] `order_units` schema includes `design_confirmed`, `design_confirmed_at`, and `design_confirmed_by`.
- [ ] Table View displays an actionable `Confirm` button next to the classification dropdown for `Design` and `Admin` users.
- [ ] Clicking `Confirm` marks Step 1 ("Review & Classify") as **Done**.
- [ ] If both Technical Drawing and BOM are attached, Step 2 ("Release Documents") automatically updates to **Done** upon confirmation.
- [ ] If only one document is attached, Step 2 updates to **In Progress** with clear notes stating which document is missing.
- [ ] If neither document is attached, Step 2 remains **Pending**.
- [ ] Changing the classification dropdown resets confirmation to unconfirmed.
- [ ] Document uploads and deletions in the Part Number modal trigger real-time status re-evaluation.
- [ ] All linting (`npm run check`) and production build (`npm run build`) pass cleanly.

---

## 10. Open Questions

*(All critical requirements were clarified during the interview phase; no blocking open questions remain).*
