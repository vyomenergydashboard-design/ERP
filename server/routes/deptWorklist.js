import express from 'express';
import { PIPELINE_SQL_ARRAY } from '../data/workflow.js';

/**
 * Router for the department worklist (mounted at /api/dept-worklist): the units a department
 * (or 'all') should see, with their department steps. Read-only: Purchase auto-completion runs on
 * the write paths and once at startup (sweepPurchaseAutoCompletion), not when a list is opened.
 */
export default function createDeptWorklistRouter(pool, authorize) {
  const router = express.Router();

  router.get('/:dept', authorize(), async (req, res) => {
    const dept = req.params.dept;
    try {
      // Get all units currently in this department (or all units if Sales)
      const result = await pool.query(`
        SELECT
          ou.id          AS unit_id,
          ou.unit_id     AS unit_serial,
          ou.short_serial,
          ou.status      AS unit_status,
          ou.current_dept,
          ou.hold_status,
          ou.hold_step_id,
          ou.hold_step_name,
          ou.hold_dept,
          ou.hold_reason,
          ou.held_by_name,
          ou.held_at,
          ou.cancelled_step_id,
          ou.cancelled_step_name,
          ou.cancelled_dept,
          ou.cancelled_reason,
          ou.cancelled_by_name,
          ou.cancelled_at,
          o.id           AS order_id,
          o.order_number,
          CASE WHEN COALESCE(ou.po_override_unlinked, false) = true THEN ou.po_number ELSE COALESCE(ou.po_number, o.po_number) END AS po_number,
          ou.po_number   AS unit_po_number,
          o.po_number    AS order_po_number,
          ou.po_doc_id,
          ou.po_override_unlinked,
          ou.sales_cleared,
          ou.sales_cleared_at,
          ou.sales_cleared_by,
          CASE WHEN COALESCE(ou.po_override_unlinked, false) = true THEN podoc.file_path ELSE COALESCE(podoc.file_path, opodoc.file_path) END AS po_file_path,
          CASE WHEN COALESCE(ou.po_override_unlinked, false) = true THEN podoc.file_name ELSE COALESCE(podoc.file_name, opodoc.file_name) END AS po_file_name,
          o.reference_number,
          COALESCE(ou.tag, oli.tag) AS tag,
          oindentdoc.file_path AS indent_file_path,
          oindentdoc.file_name AS indent_file_name,
          oindentdoc.id AS indent_doc_id,
          o.end_client_name,
          o.priority,
          o.delivery_date,
          o.hold_status  AS order_hold_status,
          o.status       AS order_status,
          COALESCE(ou.classification, o.classification, 'Standard') AS classification,
          cl.city        AS company_city,
          co.name        AS company_name,
          oli.id         AS line_item_id,
          oli.line_item_number,
          oli.material_description,
          oli.part_number,
          COALESCE(oli.project_name, o.project_name) AS project_name,
          COALESCE(ou.panel_type_size, oli.panel_type_size) AS panel_type_size,
          psm.panel_code AS panel_code,
          psm.ip_rating  AS panel_ip_rating,
          COALESCE(psm.comments, psm.description) AS panel_comments,
          COALESCE(ou.custom_fields, '{}'::jsonb) AS custom_fields,
          COALESCE(ou.tray_status, 'Not Started') AS tray_status,
          ou.tray_start_date,
          ou.issued_date,
          ou.wiremen,
          ou.mounting_start_date,
          ou.mounting_complete_date,
          ou.wiring_start_date,
          ou.wiring_complete_date,
          ou.pending_material_complete_date,
          ou.handover_to_qc_date,
          ou.qc_receiving_date,
          ou.qc_start_date,
          ou.qc_complete_date,
          ou.qc_status,
          ou.dispatch_date,
          ou.invoice_number,
          ou.invoice_date,
          ou.design_confirmed,
          ou.design_confirmed_at,
          ou.design_confirmed_by,
          u_conf.username AS design_confirmed_by_name,
          oli.quantity   AS batch_qty,
          ou.updated_at,
          (
            SELECT json_agg(sub.step_obj)
            FROM (
              SELECT json_build_object(
                'id', s.id,
                'name', s.name,
                'status', s.status,
                'dept', s.dept,
                'notes', s.notes,
                'updated', s.updated,
                'hold_reason', s.hold_reason,
                'held_by', s.held_by,
                'hold_at', s.hold_at,
                'assigned_user_id', s.assigned_user_id,
                'updated_at', s.updated_at
              ) AS step_obj,
              s.step_order,
              s.id
              FROM (
                SELECT us.id, us.name, us.status, us.dept, us.notes, us.updated, us.hold_reason, us.held_by, us.hold_at, us.assigned_user_id, us.step_order, us.updated_at
                FROM unit_steps us
                WHERE us.order_unit_id = ou.id 
                  AND us.dept = (CASE WHEN $1 = 'all' THEN ou.current_dept ELSE $1 END)
                UNION ALL
                SELECT os.id, os.name, os.status, os.dept, os.notes, os.updated, NULL::text AS hold_reason, NULL::text AS held_by, NULL::timestamptz AS hold_at, NULL::integer AS assigned_user_id, os.step_order, NULL::timestamptz AS updated_at
                FROM order_steps os
                WHERE os.order_id = o.id 
                  AND os.dept = 'Sales'
                  AND ($1 = 'Sales' OR ($1 = 'all' AND ou.current_dept = 'Sales'))
              ) s
              ORDER BY s.step_order ASC NULLS LAST, s.id ASC
            ) sub
          ) AS dept_steps,
          (
            SELECT json_agg(
              json_build_object(
                'id', us.id,
                'name', us.name,
                'status', us.status,
                'dept', us.dept,
                'notes', us.notes,
                'updated', us.updated,
                'hold_reason', us.hold_reason,
                'held_by', us.held_by,
                'hold_at', us.hold_at,
                'assigned_user_id', us.assigned_user_id
              ) ORDER BY us.id
            )
            FROM unit_steps us
            WHERE us.order_unit_id = ou.id AND us.dept = 'Design'
          ) AS design_steps,
          (
            SELECT count(*)::int
            FROM unit_steps us
            WHERE us.order_unit_id = ou.id AND us.status = 'inprogress'
          ) AS inprogress_step_count,
          (
            SELECT count(*)::int
            FROM unit_steps us
            WHERE us.order_unit_id = ou.id AND us.status = 'done'
          ) AS done_step_count,
          (
            SELECT count(*)::int
            FROM order_steps os
            WHERE os.order_id = o.id AND os.status = 'inprogress'
          ) AS order_inprogress_step_count,
          (
            SELECT count(*)::int
            FROM order_steps os
            WHERE os.order_id = o.id AND os.status = 'done'
          ) AS order_done_step_count,
          CASE 
            WHEN $1 != 'all' AND (
              array_position(${PIPELINE_SQL_ARRAY}, ou.current_dept) >
              array_position(${PIPELINE_SQL_ARRAY}, $1)
              OR (ou.status IN ('Dispatched', 'Completed') AND $1 != 'Accounts')
            )
            THEN true 
            ELSE false 
          END AS is_downstream,
          CASE 
            WHEN $1 != 'all' AND (
              array_position(${PIPELINE_SQL_ARRAY}, ou.current_dept) >
              array_position(${PIPELINE_SQL_ARRAY}, $1)
              OR ou.status IN ('Dispatched', 'Completed')
              OR (
                ou.current_dept = $1 AND NOT EXISTS (
                  SELECT 1 FROM unit_steps us 
                  WHERE us.order_unit_id = ou.id AND us.dept = $1 AND us.status != 'done'
                ) AND (
                  $1 != 'Sales' OR NOT EXISTS (
                    SELECT 1 FROM order_steps os 
                    WHERE os.order_id = o.id AND os.dept = 'Sales' AND os.status != 'done'
                  )
                ) AND (
                  $1 != 'Stores' OR (ou.tray_start_date IS NOT NULL AND ou.issued_date IS NOT NULL)
                )
              )
            )
            THEN true
            ELSE false
          END AS is_dept_completed
        FROM order_units ou
        JOIN orders o         ON ou.order_id = o.id
        JOIN order_line_items oli ON ou.line_item_id = oli.id
        LEFT JOIN company_locations cl ON o.company_location_id = cl.id
        LEFT JOIN companies co ON cl.company_id = co.id
        LEFT JOIN users u_conf ON ou.design_confirmed_by = u_conf.id
        LEFT JOIN panel_size_masters psm ON (
          psm.size_name = COALESCE(ou.panel_type_size, oli.panel_type_size)
          OR psm.panel_size = COALESCE(ou.panel_type_size, oli.panel_type_size)
          OR psm.panel_code = COALESCE(ou.panel_type_size, oli.panel_type_size)
        )
        LEFT JOIN documents podoc ON podoc.id = ou.po_doc_id
        LEFT JOIN LATERAL (
          SELECT file_path, file_name 
          FROM documents 
          WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'PO' 
          ORDER BY uploaded_at DESC 
          LIMIT 1
        ) opodoc ON true
        LEFT JOIN LATERAL (
          SELECT id, file_path, file_name 
          FROM documents 
          WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'Indent' 
          ORDER BY uploaded_at DESC 
          LIMIT 1
        ) oindentdoc ON true
        WHERE $1 = 'all' 
           OR ou.current_dept = $1 
           OR (
             array_position(${PIPELINE_SQL_ARRAY}, ou.current_dept) >
             array_position(${PIPELINE_SQL_ARRAY}, $1)
           )
           OR ou.status IN ('Dispatched', 'Completed')
           OR ou.hold_status IN ('Hold', 'Cancelled')
           OR ou.status = 'Cancelled'
           OR ou.status ILIKE 'hold%'
           OR o.hold_status = 'Approved'
           OR o.status = 'Cancelled'
           OR o.status ILIKE 'hold%'
           OR ($1 = 'Production' AND (
             ou.current_dept = 'Production'
             OR ((ou.status = 'Completed' OR oli.status = 'Completed') AND ou.current_dept NOT IN ('QC', 'Dispatch', 'Accounts'))
             OR EXISTS (
               SELECT 1 FROM unit_steps us 
               WHERE us.order_unit_id = ou.id 
                 AND us.dept = 'Planning' 
                 AND (us.status = 'done' OR us.status = 'completed')
                 AND EXISTS (
                   SELECT 1 FROM unit_steps pus 
                   WHERE pus.order_unit_id = ou.id 
                     AND pus.dept = 'Production' 
                     AND pus.status != 'done'
                 )
             )
           ))
           OR ($1 IN ('QC', 'Dispatch', 'Accounts') AND (
             ou.current_dept IN ('QC', 'Dispatch', 'Accounts')
             OR ou.handover_to_qc_date IS NOT NULL
             OR ou.qc_receiving_date IS NOT NULL
             OR ou.qc_start_date IS NOT NULL
             OR ou.qc_complete_date IS NOT NULL
             OR (ou.qc_status IS NOT NULL AND ou.qc_status != 'Pending')
             OR ou.dispatch_date IS NOT NULL
             OR ou.invoice_number IS NOT NULL
             OR ou.invoice_date IS NOT NULL
             OR ou.status IN ('QC Testing', 'Ready for Dispatch', 'Dispatched', 'Completed')
             OR (
               EXISTS (SELECT 1 FROM unit_steps pus WHERE pus.order_unit_id = ou.id AND pus.dept = 'Production')
               AND NOT EXISTS (SELECT 1 FROM unit_steps pus WHERE pus.order_unit_id = ou.id AND pus.dept = 'Production' AND pus.status != 'done')
             )
           ))
        ORDER BY o.priority DESC, o.delivery_date ASC NULLS LAST, ou.unit_id ASC
      `, [dept]);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch dept worklist' });
    }
  });

  return router;
}
