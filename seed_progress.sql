-- ============================================================
-- SEED: Realistic order progress across departments
-- Uses actual column names: status, notes, updated (text)
-- ============================================================

-- ── ORDER 1 (ORD-2026-0001) : FULLY COMPLETE ────────────────
UPDATE order_steps SET status = 'done', notes = 'PO received and uploaded', updated = '15 Jan 2026' WHERE order_id = 1 AND dept = 'Sales' AND name = 'Upload PO';
UPDATE order_steps SET status = 'done', notes = 'Dispatch confirmed for 12 Jun 2026', updated = '10 Jun 2026' WHERE order_id = 1 AND dept = 'Sales' AND name = 'Confirm Dispatch Date';
UPDATE order_steps SET status = 'done', notes = 'Invoice raised, payment received', updated = '11 Jun 2026' WHERE order_id = 1 AND dept = 'Accounts';

UPDATE unit_steps SET status = 'done', notes = 'Standard classification', updated = '18 Jan 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'done', notes = 'BOM, layout & schematic docs released', updated = '20 Jan 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Design' AND name = 'Release Documents';
UPDATE unit_steps SET status = 'done', notes = 'Shortfall list received', updated = '25 Jan 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Purchase' AND name = 'Receive Shortfall';
UPDATE unit_steps SET status = 'done', notes = 'All materials procured', updated = '26 Jan 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Purchase' AND name = 'Procure Materials';
UPDATE unit_steps SET status = 'done', notes = 'Material availability verified', updated = '27 Jan 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Stores' AND name = 'Stock Check vs BOM';
UPDATE unit_steps SET status = 'done', notes = 'All materials allotted', updated = '28 Jan 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Stores' AND name = 'Material Status';
UPDATE unit_steps SET status = 'done', notes = 'Shortfall sent to procurement', updated = '02 Feb 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Stores' AND name = 'Inform Purchase';
UPDATE unit_steps SET status = 'done', notes = 'Daily plan scheduled', updated = '03 Feb 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Production' AND name = 'Production Plan';
UPDATE unit_steps SET status = 'done', notes = 'Panel manufactured and wired', updated = '15 Feb 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Production' AND name = 'Manufacture';
UPDATE unit_steps SET status = 'done', notes = 'All panels received for inspection', updated = '01 Mar 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'QC' AND name = 'Receive Panel';
UPDATE unit_steps SET status = 'done', notes = 'QC passed — all panels cleared', updated = '05 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'QC' AND name = 'QC Decision';
UPDATE unit_steps SET status = 'done', notes = 'Dispatched via Mahavir Transport', updated = '08 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 1) AND dept = 'Dispatch' AND name = 'Ready for Dispatch';

-- ── ORDER 5 (ORD-2026-0002) : QC STAGE ───────────────────────
UPDATE order_steps SET status = 'done', notes = 'PO uploaded', updated = '10 Apr 2026' WHERE order_id = 5 AND dept = 'Sales' AND name = 'Upload PO';

UPDATE unit_steps SET status = 'done', notes = 'Standard classification', updated = '12 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'done', notes = 'All design documents released', updated = '14 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Design' AND name = 'Release Documents';
UPDATE unit_steps SET status = 'done', notes = 'Shortfall list received', updated = '15 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Purchase' AND name = 'Receive Shortfall';
UPDATE unit_steps SET status = 'done', notes = 'All components procured', updated = '20 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Purchase' AND name = 'Procure Materials';
UPDATE unit_steps SET status = 'done', notes = 'BOM stock check completed', updated = '21 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Stores' AND name = 'Stock Check vs BOM';
UPDATE unit_steps SET status = 'done', notes = 'Material issued', updated = '22 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Stores' AND name = 'Material Status';
UPDATE unit_steps SET status = 'done', notes = 'No shortfall', updated = '23 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Stores' AND name = 'Inform Purchase';
UPDATE unit_steps SET status = 'done', notes = 'Plan scheduled', updated = '25 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Production' AND name = 'Production Plan';
UPDATE unit_steps SET status = 'done', notes = 'Assembly and wiring complete', updated = '30 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'Production' AND name = 'Manufacture';
UPDATE unit_steps SET status = 'inprogress', notes = 'QC in progress — minor rework on unit 3', updated = '08 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'QC' AND name = 'Receive Panel';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND dept = 'QC' AND name = 'QC Decision';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 5) AND name = 'Ready for Dispatch';

-- ── ORDER 6 (ORD-2026-0003) : PRODUCTION IN PROGRESS ─────────
UPDATE order_steps SET status = 'done', notes = 'PO received', updated = '15 May 2026' WHERE order_id = 6 AND dept = 'Sales' AND name = 'Upload PO';

UPDATE unit_steps SET status = 'done', notes = 'Standard classification', updated = '17 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'done', notes = 'Drawings released', updated = '19 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Design' AND name = 'Release Documents';
UPDATE unit_steps SET status = 'done', notes = 'Shortfall list checked', updated = '20 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Purchase' AND name = 'Receive Shortfall';
UPDATE unit_steps SET status = 'done', notes = 'All materials procured', updated = '25 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Purchase' AND name = 'Procure Materials';
UPDATE unit_steps SET status = 'done', notes = 'Stock availability checked', updated = '26 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Stores' AND name = 'Stock Check vs BOM';
UPDATE unit_steps SET status = 'done', notes = 'Material issued', updated = '27 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Stores' AND name = 'Material Status';
UPDATE unit_steps SET status = 'done', notes = 'No shortfall', updated = '27 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Stores' AND name = 'Inform Purchase';
UPDATE unit_steps SET status = 'done', notes = 'Daily plan scheduled', updated = '28 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Production' AND name = 'Production Plan';
UPDATE unit_steps SET status = 'inprogress', notes = 'Assembly 60% complete', updated = '08 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Production' AND name = 'Manufacture';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'QC';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 6) AND dept = 'Dispatch';

-- ── ORDER 7 (ORD-2026-0004) : PURCHASE BLOCKED ───────────────
UPDATE order_steps SET status = 'done', notes = 'PO received', updated = '22 May 2026' WHERE order_id = 7 AND dept = 'Sales' AND name = 'Upload PO';

UPDATE unit_steps SET status = 'done', notes = 'Classification done', updated = '24 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 7) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'done', notes = 'Drawings and layout released', updated = '25 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 7) AND dept = 'Design' AND name = 'Release Documents';
UPDATE unit_steps SET status = 'done', notes = 'Shortfall list generated', updated = '26 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 7) AND dept = 'Purchase' AND name = 'Receive Shortfall';
UPDATE unit_steps SET status = 'blocked', notes = 'ABB breaker discontinued — alternate being sourced', updated = '06 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 7) AND dept = 'Purchase' AND name = 'Procure Materials';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 7) AND dept = 'Stores';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 7) AND dept = 'Production';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 7) AND dept = 'QC';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 7) AND dept = 'Dispatch';

-- ── ORDER 8 (ORD-2026-0005) : DESIGN IN PROGRESS ─────────────
UPDATE order_steps SET status = 'done', notes = 'PO received', updated = '30 May 2026' WHERE order_id = 8 AND dept = 'Sales' AND name = 'Upload PO';

UPDATE unit_steps SET status = 'done', notes = 'Standard classification complete', updated = '01 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 8) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'inprogress', notes = 'Electrical schematics 70% done', updated = '07 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 8) AND dept = 'Design' AND name = 'Release Documents';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 8) AND dept = 'Purchase';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 8) AND dept = 'Stores';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 8) AND dept = 'Production';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 8) AND dept = 'QC';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 8) AND dept = 'Dispatch';

-- ── ORDER 9 (ORD-2026-0006) : STORES STAGE ───────────────────
UPDATE order_steps SET status = 'done', notes = 'PO received', updated = '20 May 2026' WHERE order_id = 9 AND dept = 'Sales' AND name = 'Upload PO';

UPDATE unit_steps SET status = 'done', notes = 'Classification done', updated = '22 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'done', notes = 'All drawings & layouts released', updated = '22 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Design' AND name = 'Release Documents';
UPDATE unit_steps SET status = 'done', notes = 'Shortfall list checked', updated = '25 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Purchase' AND name = 'Receive Shortfall';
UPDATE unit_steps SET status = 'done', notes = 'All components procured', updated = '28 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Purchase' AND name = 'Procure Materials';
UPDATE unit_steps SET status = 'done', notes = 'Stock allocation in progress, 2 items short', updated = '08 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Stores' AND name = 'Stock Check vs BOM';
UPDATE unit_steps SET status = 'inprogress', notes = 'Allocated partial', updated = '08 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Stores' AND name = 'Material Status';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Stores' AND name = 'Inform Purchase';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Production';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'QC';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 9) AND dept = 'Dispatch';

-- ── ORDER 10 (ORD-2026-0007) : FULLY COMPLETE ────────────────
UPDATE order_steps SET status = 'done', notes = 'PO received', updated = '01 Mar 2026' WHERE order_id = 10 AND dept = 'Sales' AND name = 'Upload PO';
UPDATE order_steps SET status = 'done', notes = 'Dispatched 02 Jun 2026', updated = '02 Jun 2026' WHERE order_id = 10 AND dept = 'Sales' AND name = 'Confirm Dispatch Date';
UPDATE order_steps SET status = 'done', notes = 'Invoice cleared, payment received', updated = '04 Jun 2026' WHERE order_id = 10 AND dept = 'Accounts';

UPDATE unit_steps SET status = 'done', notes = 'Design done', updated = '05 Mar 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 10) AND dept = 'Design';
UPDATE unit_steps SET status = 'done', notes = 'Procured', updated = '12 Mar 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 10) AND dept = 'Purchase';
UPDATE unit_steps SET status = 'done', notes = 'Material issued', updated = '15 Mar 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 10) AND dept = 'Stores';
UPDATE unit_steps SET status = 'done', notes = 'Production complete', updated = '01 Apr 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 10) AND dept = 'Production';
UPDATE unit_steps SET status = 'done', notes = 'QC passed', updated = '20 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 10) AND dept = 'QC';
UPDATE unit_steps SET status = 'done', notes = 'Dispatched', updated = '02 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 10) AND dept = 'Dispatch';

-- ── ORDER 11 (ORD-2026-0008) : WIRING IN PROGRESS ────────────
UPDATE order_steps SET status = 'done', notes = 'PO received', updated = '18 May 2026' WHERE order_id = 11 AND dept = 'Sales' AND name = 'Upload PO';

UPDATE unit_steps SET status = 'done', notes = 'Classification done', updated = '20 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'done', notes = 'Design released', updated = '20 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Design' AND name = 'Release Documents';
UPDATE unit_steps SET status = 'done', notes = 'Shortfall list checked', updated = '22 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Purchase' AND name = 'Receive Shortfall';
UPDATE unit_steps SET status = 'done', notes = 'Materials procured', updated = '26 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Purchase' AND name = 'Procure Materials';
UPDATE unit_steps SET status = 'done', notes = 'BOM stock check completed', updated = '27 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Stores' AND name = 'Stock Check vs BOM';
UPDATE unit_steps SET status = 'done', notes = 'Material issued to floor', updated = '28 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Stores' AND name = 'Material Status';
UPDATE unit_steps SET status = 'done', notes = 'No shortfall', updated = '28 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Stores' AND name = 'Inform Purchase';
UPDATE unit_steps SET status = 'done', notes = 'Daily plan scheduled', updated = '29 May 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Production' AND name = 'Production Plan';
UPDATE unit_steps SET status = 'inprogress', notes = 'Wiring 40% complete', updated = '08 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Production' AND name = 'Manufacture';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'QC';
UPDATE unit_steps SET status = 'pending', notes = '' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 11) AND dept = 'Dispatch';

-- ── ORDER 12 (ORD-2026-0009) : JUST STARTED ──────────────────
UPDATE order_steps SET status = 'done', notes = 'PO received', updated = '06 Jun 2026' WHERE order_id = 12 AND dept = 'Sales' AND name = 'Upload PO';
UPDATE unit_steps SET status = 'done', notes = 'Classification done', updated = '07 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 12) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'inprogress', notes = 'BOM and drawings being prepared', updated = '08 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 12) AND dept = 'Design' AND name = 'Release Documents';

-- ── ORDER 13 (ORD-2026-0010) : REVIEW STAGE ──────────────────
UPDATE order_steps SET status = 'done', notes = 'PO uploaded', updated = '05 Jun 2026' WHERE order_id = 13 AND dept = 'Sales' AND name = 'Upload PO';
UPDATE unit_steps SET status = 'done', notes = 'Classification done', updated = '06 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 13) AND dept = 'Design' AND name = 'Review & Classify';
UPDATE unit_steps SET status = 'review', notes = 'Drawings ready, pending approval from client', updated = '08 Jun 2026' WHERE order_unit_id IN (SELECT id FROM order_units WHERE order_id = 13) AND dept = 'Design' AND name = 'Release Documents';
