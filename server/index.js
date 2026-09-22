import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import XLSX from 'xlsx';
import nodemailer from 'nodemailer';
import { runDeploymentMigrations } from './run_deployment_migrations.js';
import { realignUnitSerials } from './realign_unit_serials_to_orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hold validation helpers
const isOrderOnHold = async (orderId) => {
  if (!orderId || isNaN(Number(orderId))) return false;
  try {
    const res = await pool.query("SELECT hold_status FROM orders WHERE id = $1", [orderId]);
    return res.rows.length > 0 && res.rows[0].hold_status === 'Approved';
  } catch (err) {
    console.error('isOrderOnHold error:', err);
    return false;
  }
};

const isUnitOnHold = async (unitId) => {
  if (!unitId) return false;
  try {
    const numId = !isNaN(Number(unitId)) ? Number(unitId) : -1;
    const res = await pool.query(
      "SELECT o.hold_status as order_hold_status, ou.hold_status as unit_hold_status FROM orders o JOIN order_units ou ON ou.order_id = o.id WHERE ou.id = $1 OR ou.unit_id = $2",
      [numId, String(unitId)]
    );
    if (res.rows.length === 0) return false;
    return res.rows[0].order_hold_status === 'Approved' || res.rows[0].unit_hold_status === 'Hold';
  } catch (err) {
    console.error('isUnitOnHold error:', err);
    return false;
  }
};

const isLineItemOnHold = async (lineItemId) => {
  if (!lineItemId || isNaN(Number(lineItemId))) return false;
  try {
    const res = await pool.query(
      "SELECT o.hold_status FROM orders o JOIN order_line_items oli ON oli.order_id = o.id WHERE oli.id = $1",
      [lineItemId]
    );
    return res.rows.length > 0 && res.rows[0].hold_status === 'Approved';
  } catch (err) {
    console.error('isLineItemOnHold error:', err);
    return false;
  }
};

let isSystemSeeding = false;

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const DEFAULT_STEPS = [
  { dept: 'Sales', name: 'Upload PO', sub: 'Customer PO + specs', special: 'sales', requires_upload: true, default_doc_type: 'PO', level: 'order' },
  { dept: 'Sales', name: 'Confirm Dispatch Date', sub: 'Received from Planning', special: 'dispatch', requires_upload: false, default_doc_type: 'General', level: 'order' },
  { dept: 'Sales', name: 'Sales Clearance', sub: 'PO & Specs Clearance', special: 'sales', requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { 
    dept: 'Design', 
    name: 'Review & Classify', 
    sub: 'Standard / Non-Standard', 
    special: null, 
    requires_upload: false, 
    default_doc_type: 'General', 
    level: 'unit',
    custom_fields: [
      { id: 'classification', label: 'Classification', type: 'Dropdown', options: ['Standard', 'Non-Standard'], datakey: 'classification' }
    ]
  },
  { dept: 'Design', name: 'Release Documents', sub: 'Panel Layout + Electrical Design + BOM', special: 'design', requires_upload: true, default_doc_type: 'Drawing', level: 'unit' },
  { dept: 'Purchase', name: 'Receive Shortfall', sub: 'From Stores after BOM check', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Purchase', name: 'Procure Materials', sub: 'Raise PO to supplier', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Stores', name: 'Stock Check vs BOM', sub: 'Verify availability', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Stores', name: 'Material Status', sub: 'Allotted → Acceptance → Accept-complete', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Stores', name: 'Inform Purchase', sub: 'Send shortfall list', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Planning', name: 'Production Plan', sub: 'Per day capacity', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'Production', name: 'Manufacture', sub: 'Fitter (mechanical) + Wireman (electrical)', special: null, requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'QC', name: 'Receive Panel', sub: 'Test & inspect', special: 'qc', requires_upload: false, default_doc_type: 'General', level: 'unit' },
  { dept: 'QC', name: 'QC Decision', sub: 'Pass → Dispatch | Fail → Rework/Redesign', special: 'qc', requires_upload: true, default_doc_type: 'QC Report', level: 'unit' },
  { dept: 'Dispatch', name: 'Ready for Dispatch', sub: 'QC cleared panels', special: null, requires_upload: true, default_doc_type: 'Dispatch Document', level: 'unit' },
  { dept: 'Accounts', name: 'Invoice & Dispatch Note', sub: 'Billing & documentation', special: null, requires_upload: true, default_doc_type: 'Dispatch Document', level: 'unit' }
];

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass'
  }
});

const sendDepartmentHandoverEmail = async (unitIdStr, shortSerial, prevDept, nextDept) => {
  const emailSubject = `[Vyom ERP] Handover: ${prevDept} finished, ${nextDept} can start - Unit ${unitIdStr}`;
  
  let recipientEmails = [];
  try {
    const usersRes = await pool.query(
      `SELECT email, username FROM users WHERE role = $1 OR role = 'Admin' OR role = 'Manager'`,
      [nextDept]
    );
    recipientEmails = usersRes.rows.map(u => u.email).filter(Boolean);
  } catch (err) {
    console.error('Error fetching recipient emails:', err);
  }

  if (recipientEmails.length === 0) {
    recipientEmails.push(`${nextDept.toLowerCase()}@vyomerp.local`);
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e1e8ed; border-radius: 12px; background-color: #fafbfc;">
      <div style="text-align: center; border-bottom: 2px solid #f59e0b; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin: 0;">Vyom ERP Handover Alert</h2>
        <span style="color: #64748b; font-size: 13px;">Task Transfer Notification</span>
      </div>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Hello team <strong>${nextDept}</strong>,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        This is to notify you that the department <strong>${prevDept}</strong> has completed their assigned tasks for unit <strong>${unitIdStr}</strong> (Serial: <strong>${shortSerial}</strong>).
      </p>
      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 140px;"><strong>Unit ID:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-family: monospace;">${unitIdStr}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Serial No.:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;">${shortSerial}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Previous Dept:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-weight: 600; color: #0f766e;">${prevDept} (Completed)</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Next Active Dept:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-weight: 600; color: #b45309;">${nextDept} (Pending Your Action)</td>
          </tr>
        </table>
      </div>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        You can now log in to the ERP panel to begin working on the next steps for this unit.
      </p>
      <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
        <a href="http://localhost:5173" style="background-color: #f59e0b; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Go to Planning Board</a>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 20px;">
        Automated notification sent by Vyom ERP. Please do not reply directly to this mail.
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Vyom ERP System" <noreply@vyomerp.local>',
    to: recipientEmails.join(', '),
    subject: emailSubject,
    html: htmlContent
  };

  try {
    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) 
       VALUES ((SELECT id FROM users WHERE username = 'admin' LIMIT 1), 'System', $1)`,
      [`[Email Sent] ${emailSubject} to ${mailOptions.to}`]
    );
  } catch (err) {
    console.error('Error logging email activity:', err);
  }

  if (process.env.SMTP_USER && process.env.SMTP_USER !== 'mock_user') {
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully via SMTP');
    } catch (smtpErr) {
      console.warn('[SMTP Warning] Email delivery failed:', smtpErr.message || smtpErr.code);
    }
  }
};

const sendHoldRequestEmail = async (orderId, orderNumber, requestedByUsername) => {
  const emailSubject = `[Vyom ERP] Hold Requested for Order ${orderNumber}`;
  
  let recipientEmails = [];
  try {
    const usersRes = await pool.query(
      `SELECT email FROM users WHERE role = 'Admin' OR role = 'Manager'`
    );
    recipientEmails = usersRes.rows.map(u => u.email).filter(Boolean);
  } catch (err) {
    console.error('Error fetching admin/manager emails for hold:', err);
  }

  if (recipientEmails.length === 0) {
    recipientEmails.push(`admin@vyomerp.local`);
  }

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background-color: #fafbfc;">
      <div style="text-align: center; border-bottom: 2px solid #ef4444; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: #1e293b; margin: 0;">Vyom ERP Hold Request Alert</h2>
        <span style="color: #64748b; font-size: 13px;">Hold Approval Required</span>
      </div>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Hello Admin / Manager,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        The user <strong>${requestedByUsername}</strong> has requested to put Order <strong>${orderNumber}</strong> on hold.
      </p>
      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 140px;"><strong>Order Number:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-weight: bold;">${orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Requested By:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;">${requestedByUsername}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Requested At:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;">${new Date().toLocaleString('en-IN')}</td>
          </tr>
        </table>
      </div>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        Please log in to the ERP panel to review and Approve or Reject this hold request.
      </p>
      <div style="text-align: center; margin-top: 30px; margin-bottom: 20px;">
        <a href="http://localhost:5173" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">View Order Details</a>
      </div>
      <div style="text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 20px;">
        Automated notification sent by Vyom ERP. Please do not reply directly to this mail.
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM || '"Vyom ERP System" <noreply@vyomerp.local>',
    to: recipientEmails.join(', '),
    subject: emailSubject,
    html: htmlContent
  };

  try {
    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text, order_id) 
       VALUES ((SELECT id FROM users WHERE username = 'admin' LIMIT 1), 'System', $1, $2)`,
      [`[Email Sent] ${emailSubject} to ${mailOptions.to}`, orderId]
    );
  } catch (err) {
    console.error('Error logging email activity:', err);
  }

  if (process.env.SMTP_USER && process.env.SMTP_USER !== 'mock_user') {
    try {
      await transporter.sendMail(mailOptions);
      console.log('Hold alert email sent successfully via SMTP');
    } catch (smtpErr) {
      console.warn('[SMTP Warning] Hold alert email delivery failed:', smtpErr.message || smtpErr.code);
    }
  }
};

const syncLineItemStatusFromUnits = async (lineItemId, clientOrPool) => {
  try {
    const unitsRes = await clientOrPool.query(
      `SELECT current_dept, status FROM order_units WHERE line_item_id = $1`,
      [lineItemId]
    );
    const units = unitsRes.rows;
    if (units.length === 0) return;

    const allDispatched = units.every(u => u.status === 'Dispatched' || u.current_dept === 'Accounts');
    if (allDispatched) {
      await clientOrPool.query(
        `UPDATE order_line_items SET status = 'Completed' WHERE id = $1`,
        [lineItemId]
      );
      return;
    }

    const depts = units.map(u => u.current_dept);
    let mappedStatus = 'Not Started';
    
    if (depts.includes('Design')) {
      mappedStatus = 'In Progress';
    } else if (depts.includes('Purchase') || depts.includes('Stores')) {
      mappedStatus = 'Waiting for Material';
    } else if (depts.includes('Planning')) {
      mappedStatus = 'In Progress';
    } else if (depts.includes('Production')) {
      mappedStatus = 'In Progress';
    } else if (depts.includes('QC')) {
      mappedStatus = 'QC Testing';
    } else if (depts.includes('Dispatch') || depts.includes('Accounts')) {
      mappedStatus = 'Completed';
    }
    
    await clientOrPool.query(
      `UPDATE order_line_items SET status = $1 WHERE id = $2`,
      [mappedStatus, lineItemId]
    );
  } catch (err) {
    console.error('Error in syncLineItemStatusFromUnits:', err);
  }
};

const deriveUnitStatus = async (unitId, clientOrPool) => {
  const prevUnitRes = await clientOrPool.query(
    `SELECT ou.current_dept, ou.unit_id, ou.short_serial, ou.order_id, ou.hold_status, ou.hold_step_name, ou.hold_dept, ou.cancelled_step_name, ou.cancelled_dept, o.classification, o.hold_status as order_hold_status
     FROM order_units ou
     JOIN orders o ON ou.order_id = o.id
     WHERE ou.id = $1`,
    [unitId]
  );
  if (prevUnitRes.rows.length === 0) return;

  const row = prevUnitRes.rows[0];
  const oldDept = row.current_dept;
  const unit_id_str = row.unit_id || '';
  const short_serial = row.short_serial || '';
  const orderId = row.order_id;
  const unitHoldStatus = row.hold_status;
  const orderHoldStatus = row.order_hold_status;

  // 1. Check if unit is Cancelled
  if (unitHoldStatus === 'Cancelled') {
    const cancelDept = row.cancelled_dept || oldDept || 'Sales';
    await clientOrPool.query(
      `UPDATE order_units SET status = 'Cancelled', current_dept = $1 WHERE id = $2`,
      [cancelDept, unitId]
    );
    return;
  }

  // 2. Check if unit or order is On Hold
  if (unitHoldStatus === 'Hold' || orderHoldStatus === 'Approved') {
    const holdDept = row.hold_dept || oldDept || 'Sales';
    const statusText = row.hold_step_name ? `Hold @ ${row.hold_step_name}` : 'Hold';
    await clientOrPool.query(
      `UPDATE order_units SET status = $1, current_dept = $2 WHERE id = $3`,
      [statusText, holdDept, unitId]
    );
    return;
  }

  // Clean up any legacy bulk auto-completed notes and reset them back to pending
  await clientOrPool.query(
    `UPDATE unit_steps 
     SET status = 'pending', notes = NULL 
     WHERE order_unit_id = $1 AND notes = 'Auto-completed for Standard order'`,
    [unitId]
  );

  // Check if Sales order-level steps (like Upload PO) are completed (non-mandatory tasks do not block pipeline)
  const salesOrderStepsRes = await clientOrPool.query(
    `SELECT os.status, tm.is_mandatory 
     FROM order_steps os
     LEFT JOIN task_masters tm ON os.task_id = tm.id
     WHERE os.order_id = $1 AND os.dept = 'Sales'`,
    [orderId]
  );
  const isSalesDone = salesOrderStepsRes.rows.length === 0 || salesOrderStepsRes.rows.every(s => 
    s.status === 'done' || s.is_mandatory === false
  );

  let newStatus = 'Pending';
  let newDept = 'Sales';

  const stepsRes = await clientOrPool.query(
    `SELECT id, dept, name, status FROM unit_steps WHERE order_unit_id = $1 ORDER BY step_order ASC, id ASC`,
    [unitId]
  );

  // If unit has its own Sales Clearance step marked done, or order PO is done
  const hasUnitSalesDone = stepsRes.rows.some(s => s.dept === 'Sales' && s.status === 'done');

  if (!isSalesDone && !hasUnitSalesDone) {
    newDept = 'Sales';
    newStatus = 'Pending';
  } else {

    if (stepsRes.rows.length > 0) {
      const steps = stepsRes.rows;
      const blockedStep = steps.find(s => s.status === 'blocked');
      if (blockedStep) {
        if (blockedStep.dept === 'QC') {
          newDept = 'Production';
          newStatus = 'Rework';
        } else {
          newDept = blockedStep.dept;
          if (blockedStep.dept === 'Production') {
            newStatus = 'Rework';
          } else {
            newStatus = 'Blocked';
          }
        }
      } else {
        const allDone = steps.every(s => s.status === 'done');
        if (allDone) {
          newStatus = 'Dispatched';
          newDept = 'Accounts';
        } else {
          const firstIncomplete = steps.find(s => s.status !== 'done');
          if (firstIncomplete) {
            newDept = firstIncomplete.dept;
            
            const statusMap = {
              'Sales': 'Pending',
              'Design': 'Design',
              'Purchase': 'Material Waiting',
              'Stores': 'Material Waiting',
              'Planning': 'Planning',
              'Production': 'Production',
              'QC': 'QC Testing',
              'Dispatch': 'Ready for Dispatch',
              'Accounts': 'Dispatched'
            };
            
            newStatus = statusMap[firstIncomplete.dept] || 'Production';
          }
        }
      }
    }
  }

  await clientOrPool.query(
    `UPDATE order_units SET status = $1, current_dept = $2 WHERE id = $3`,
    [newStatus, newDept, unitId]
  );

  if (oldDept && oldDept !== newDept && newDept !== 'Planning' && !isSystemSeeding) {
    sendDepartmentHandoverEmail(unit_id_str, short_serial, oldDept, newDept).catch(console.error);
  }

  const lineItemRes = await clientOrPool.query(
    `SELECT line_item_id FROM order_units WHERE id = $1`,
    [unitId]
  );
  if (lineItemRes.rows.length > 0) {
    const lineItemId = lineItemRes.rows[0].line_item_id;
    if (lineItemId) {
      await syncLineItemStatusFromUnits(lineItemId, clientOrPool);
    }
  }
};

const updateOrderQCStatusFromSteps = async (orderId, clientOrPool) => {
  try {
    const orderQcRes = await clientOrPool.query(
      `SELECT name, status FROM order_steps WHERE order_id = $1 AND dept = 'QC'`,
      [orderId]
    );
    const unitQcRes = await clientOrPool.query(
      `SELECT us.name, us.status 
       FROM unit_steps us 
       JOIN order_units ou ON us.order_unit_id = ou.id 
       WHERE ou.order_id = $1 AND us.dept = 'QC'`,
      [orderId]
    );

    const allQcSteps = [...orderQcRes.rows, ...unitQcRes.rows];
    if (allQcSteps.length === 0) return;

    const decisionSteps = allQcSteps.filter(s => s.name.toLowerCase().includes('decision'));
    const targetSteps = decisionSteps.length > 0 ? decisionSteps : allQcSteps;

    let newQcStatus = 'Pending';
    let setQcDate = false;

    if (targetSteps.some(s => s.status === 'blocked')) {
      newQcStatus = 'Fail';
      setQcDate = true;
    } else if (targetSteps.every(s => s.status === 'done')) {
      newQcStatus = 'Pass';
      setQcDate = true;
    }

    if (setQcDate) {
      await clientOrPool.query(
        `UPDATE orders SET qc_status = $1, qc_date = CURRENT_DATE WHERE id = $2`,
        [newQcStatus, orderId]
      );
    } else {
      await clientOrPool.query(
        `UPDATE orders SET qc_status = $1, qc_date = NULL WHERE id = $2`,
        [newQcStatus, orderId]
      );
    }

    // Update each line item of this order individually based on its own units' QC steps
    const lineItemsRes = await clientOrPool.query(
      `SELECT id FROM order_line_items WHERE order_id = $1`,
      [orderId]
    );

    for (const li of lineItemsRes.rows) {
      const liQcRes = await clientOrPool.query(
        `SELECT us.name, us.status 
         FROM unit_steps us 
         JOIN order_units ou ON us.order_unit_id = ou.id 
         WHERE ou.line_item_id = $1 AND us.dept = 'QC'`,
        [li.id]
      );
      const liQcSteps = liQcRes.rows;
      if (liQcSteps.length === 0) continue;

      const liDecisionSteps = liQcSteps.filter(s => s.name.toLowerCase().includes('decision'));
      const liTargetSteps = liDecisionSteps.length > 0 ? liDecisionSteps : liQcSteps;

      let liQcStatus = 'Pending';
      let liSetQcDate = false;

      if (liTargetSteps.some(s => s.status === 'blocked')) {
        liQcStatus = 'Fail';
        liSetQcDate = true;
      } else if (liTargetSteps.every(s => s.status === 'done')) {
        liQcStatus = 'Pass';
        liSetQcDate = true;
      }

      if (liSetQcDate) {
        await clientOrPool.query(
          `UPDATE order_line_items SET qc_status = $1, qc_date = CURRENT_DATE WHERE id = $2`,
          [liQcStatus, li.id]
        );
      } else {
        await clientOrPool.query(
          `UPDATE order_line_items SET qc_status = $1, qc_date = NULL WHERE id = $2`,
          [liQcStatus, li.id]
        );
      }
    }
  } catch (err) {
    console.error('Error in updateOrderQCStatusFromSteps:', err);
  }
};

// Auto-initialize Database
const initDB = async () => {
  isSystemSeeding = true;
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database initialized successfully (Tables checked/created)');
  } catch (err) {
    console.error('Database initialization (init.sql) warning:', err.message || err);
  }

  try {
    await runDeploymentMigrations();
  } catch (err) {
    console.error('Deployment migrations error:', err.message || err);
  }

  try {
    // Force sync unit serial alignment
    await realignUnitSerials();
  } catch (err) {
    console.error('Realign unit serials error:', err.message || err);
  }

  try {

    // Synchronize default task_masters to match tasks
    const currentTasks = await pool.query('SELECT name, level FROM task_masters WHERE is_mandatory = true');
    const currentSignatures = currentTasks.rows.map(r => `${r.name}:${r.level}`).sort();
    const expectedSignatures = DEFAULT_STEPS.map(s => `${s.name}:${s.level}`).sort();
    const isMatching = JSON.stringify(currentSignatures) === JSON.stringify(expectedSignatures);
    
    // Force sync if the Design 'Review & Classify' step doesn't have the classification custom field template yet
    const reviewTask = await pool.query("SELECT custom_fields FROM task_masters WHERE dept = 'Design' AND name = 'Review & Classify'");
    const hasDropdown = reviewTask.rows.length > 0 && reviewTask.rows[0].custom_fields?.some(f => f.label === 'Classification' && f.datakey === 'classification');

    if (!isMatching || !hasDropdown) {
      console.log('Syncing task_masters to new defaults...');
      await pool.query('TRUNCATE TABLE task_masters RESTART IDENTITY CASCADE;');
      for (const step of DEFAULT_STEPS) {
        await pool.query(
          `INSERT INTO task_masters (dept, name, sub, special, requires_upload, default_doc_type, is_mandatory, level, custom_fields) 
           VALUES ($1, $2, $3, $4, $5, $6, true, $7, $8)`,
          [
            step.dept, 
            step.name, 
            step.sub, 
            step.special, 
            step.requires_upload, 
            step.default_doc_type || 'General', 
            step.level,
            JSON.stringify(step.custom_fields || [])
          ]
        );
      }
      console.log('task_masters updated successfully!');

      // Retroactively update existing 'Review & Classify' steps in unit_steps
      const designClassifyId = await pool.query("SELECT custom_fields FROM task_masters WHERE dept = 'Design' AND name = 'Review & Classify' LIMIT 1");
      if (designClassifyId.rows.length > 0) {
        const templateCf = designClassifyId.rows[0].custom_fields;
        const fieldDefsWithVal = templateCf.map(f => ({ ...f, value: 'Standard' }));
        await pool.query(
          "UPDATE unit_steps SET custom_fields = $1 WHERE name = 'Review & Classify' AND (custom_fields IS NULL OR custom_fields = '[]'::jsonb)",
          [JSON.stringify(fieldDefsWithVal)]
        );
      }
    }

    // Auto-restore steps for existing orders and units if they have 0 steps
    const ordersRes = await pool.query('SELECT id FROM orders');
    const dbTasks = await pool.query(`
      SELECT * FROM task_masters 
      WHERE is_mandatory = true 
      ORDER BY 
        CASE dept
          WHEN 'Sales' THEN 1
          WHEN 'Design' THEN 2
          WHEN 'Purchase' THEN 3
          WHEN 'Stores' THEN 4
          WHEN 'Planning' THEN 5
          WHEN 'Production' THEN 6
          WHEN 'QC' THEN 7
          WHEN 'Dispatch' THEN 8
          WHEN 'Accounts' THEN 9
          ELSE 10
        END ASC,
        id ASC
    `);
    const tasks = dbTasks.rows.length > 0 ? dbTasks.rows : DEFAULT_STEPS;
    
    let restoredCount = 0;
    for (const order of ordersRes.rows) {
      const stepsCount = await pool.query('SELECT COUNT(*) FROM order_steps WHERE order_id = $1', [order.id]);
      if (parseInt(stepsCount.rows[0].count) === 0) {
        restoredCount++;
        const orderTasks = tasks.filter(t => t.level === 'order');
        for (let i = 0; i < orderTasks.length; i++) {
          const task = orderTasks[i];
          let fieldDefs = [];
          if (task.id) {
            try {
              const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
              fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
            } catch { fieldDefs = []; }
          }
          await pool.query(
            `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [order.id, task.id || null, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
          );
        }
      }

      // Check unit steps
      const unitsRes = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [order.id]);
      for (const unit of unitsRes.rows) {
        const unitStepsCount = await pool.query('SELECT COUNT(*) FROM unit_steps WHERE order_unit_id = $1', [unit.id]);
        if (parseInt(unitStepsCount.rows[0].count) === 0) {
          const unitTasks = tasks.filter(t => t.level === 'unit');
          for (let i = 0; i < unitTasks.length; i++) {
            const task = unitTasks[i];
            let fieldDefs = [];
            if (task.id) {
              try {
                const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
                fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
              } catch { fieldDefs = []; }
            }
            await pool.query(
              `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order) 
               VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
              [unit.id, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
            );
          }
          // derive initial status
          await deriveUnitStatus(unit.id, pool);
        }
      }
    }
    if (restoredCount > 0) {
      console.log(`Auto-restored steps for ${restoredCount} orders.`);
    }

    // Sync QC status and date for all existing orders
    for (const order of ordersRes.rows) {
      await updateOrderQCStatusFromSteps(order.id, pool);
    }
    console.log('QC statuses synchronized for all orders.');
  } catch (err) {
    console.error('Database initialization failed:', err);
  } finally {
    isSystemSeeding = false;
  }
};

initDB();

app.use(cors({
  origin: '*',
  exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB total limit
});

// Helper for Order ID Generation (FY format: YY(YY+1)XXXX, e.g. 26270001)
const formatOrderNumber = (year, counter) => {
  const yr = year || new Date().getFullYear();
  const startYr = String(yr % 100).padStart(2, '0');
  const endYr = String((yr + 1) % 100).padStart(2, '0');
  return `${startYr}${endYr}${String(counter).padStart(4, '0')}`;
};

const parseOrderCounter = (numStr) => {
  if (!numStr) return 0;
  const clean = String(numStr).replace(/^TEMP-/, '');
  if (clean.startsWith('ORD-')) {
    const parts = clean.split('-');
    return parseInt(parts[parts.length - 1], 10) || 0;
  }
  if (/^\d{8,}$/.test(clean)) {
    return parseInt(clean.slice(-4), 10) || 0;
  }
  const digitsOnly = clean.replace(/\D/g, '');
  return parseInt(digitsOnly.slice(-4), 10) || 0;
};

const parseLiCounter = parseOrderCounter;

const generateOrderNumber = async (client) => {
  const year = new Date().getFullYear();
  const db = client || pool;

  const orderRes = await db.query("SELECT MAX(order_number) as max_ord FROM orders WHERE order_number NOT LIKE 'TEMP-%'");
  const unitRes = await db.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");

  const ordNum = parseOrderCounter(orderRes.rows[0]?.max_ord);
  const unitNum = parseOrderCounter(unitRes.rows[0]?.max_unit);

  const highest = Math.max(ordNum, unitNum);
  let nextNum = highest > 0 ? highest + 1 : 1;

  if (highest === 0) {
    const setting = await db.query("SELECT value FROM system_settings WHERE key = 'order_number_start' LIMIT 1");
    nextNum = setting.rows.length > 0 ? parseInt(setting.rows[0].value) || 1 : 1;
  }

  return formatOrderNumber(year, nextNum);
};

// Middleware for RBAC
const authorize = (roles = []) => {
  return (req, res, next) => {
    let token = null;
    if (req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
      token = req.query.token;
    }
    
    if (!token) return res.status(401).json({ error: 'No token provided' });
    
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ error: 'Unauthorized' });
      
      try {
        const userRes = await pool.query('SELECT id, role FROM users WHERE id = $1', [decoded.id]);
        if (userRes.rows.length === 0) {
          return res.status(401).json({ error: 'Unauthorized: User does not exist' });
        }
        
        const dbUser = userRes.rows[0];
        if (roles.length && !roles.includes(dbUser.role)) {
          return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        }
        
        req.user = { ...decoded, role: dbUser.role };
        next();
      } catch (dbErr) {
        console.error('Auth DB check failed:', dbErr);
        return res.status(500).json({ error: 'Internal server error during authorization' });
      }
    });
  };
};

// Auth Routes
app.post('/api/auth/signup', authorize(['Admin']), async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
      [username, email, hashedPassword, role || 'Viewer']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(`[LOGIN TRY] Email: "${email}"`);
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $1', [email]);
    if (result.rows.length === 0) {
      console.log(`[LOGIN FAIL] User not found for email: "${email}"`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`[LOGIN FAIL] Password mismatch for email: "${email}"`);
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    console.log(`[LOGIN SUCCESS] Email: "${email}", Role: "${user.role}"`);
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/profile', authorize(), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role FROM users WHERE id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logs & Users
app.get('/api/logs', authorize(), async (req, res) => {
  try {
    const limit = req.query.limit || '1000';
    let queryText = `
      SELECT l.*, u.username, o.order_number 
      FROM activity_logs l 
      JOIN users u ON l.user_id = u.id 
      LEFT JOIN orders o ON l.order_id = o.id
      ORDER BY l.timestamp DESC
    `;
    const params = [];
    if (limit !== 'all') {
      queryText += ` LIMIT $1`;
      params.push(parseInt(limit) || 1000);
    }
    
    const result = await pool.query(queryText, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/logs', authorize(), async (req, res) => {
  const { dept, action_text, order_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, order_id || null, dept, action_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users', authorize(), async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/users/:id/role', authorize(['Admin']), async (req, res) => {
  const { role } = req.body;
  const VALID_ROLES = ['Admin', 'Manager', 'Sales', 'Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Viewer', 'Planning'];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  try {
    const result = await pool.query(
      'UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role',
      [role, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.patch('/api/users/:id/password', authorize(['Admin']), async (req, res) => {
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2 RETURNING id, username, email, role',
      [hashedPassword, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', authorize(['Admin']), async (req, res) => {
  const { username, email, role, password } = req.body;
  const { id } = req.params;
  
  if (!username || !email || !role) {
    return res.status(400).json({ error: 'Username, email, and role are required' });
  }
  
  const VALID_ROLES = ['Admin', 'Manager', 'Sales', 'Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Viewer', 'Planning'];
  if (!VALID_ROLES.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  
  try {
    let query = 'UPDATE users SET username = $1, email = $2, role = $3';
    const params = [username, email, role, id];
    
    if (password && password.length >= 6) {
      const hashedPassword = await bcrypt.hash(password, 10);
      query += ', password = $4 WHERE id = $5';
      params.splice(3, 0, hashedPassword);
    } else {
      query += ' WHERE id = $4';
    }
    
    query += ' RETURNING id, username, email, role, created_at';
    
    const result = await pool.query(query, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/users/:id', authorize(['Admin']), async (req, res) => {
  const { id } = req.params;
  
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own account' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query('UPDATE orders SET created_by = NULL WHERE created_by = $1', [id]);
    await client.query('UPDATE order_units SET assigned_user = NULL WHERE assigned_user = $1', [id]);
    await client.query('UPDATE documents SET uploaded_by = NULL WHERE uploaded_by = $1', [id]);
    await client.query('UPDATE unit_steps SET assigned_user_id = NULL WHERE assigned_user_id = $1', [id]);
    
    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id, username', [id]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'User not found' });
    }
    
    await client.query('COMMIT');
    res.json({ message: 'User deleted successfully', deletedUser: result.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
});

// System Settings API
app.get('/api/system-settings', authorize(['Admin']), async (req, res) => {
  try {
    const result = await pool.query('SELECT key, value FROM system_settings');
    const settings = {};
    result.rows.forEach(r => { settings[r.key] = r.value; });

    // Check if any orders exist (to lock the order_number_start field)
    const ordersCount = await pool.query('SELECT COUNT(*) as cnt FROM orders');
    settings._orders_exist = parseInt(ordersCount.rows[0].cnt) > 0;

    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch system settings' });
  }
});

app.put('/api/system-settings', authorize(['Admin']), async (req, res) => {
  const { order_number_start } = req.body;
  try {
    // Only allow changing order_number_start if no orders exist yet
    if (order_number_start !== undefined) {
      const ordersCount = await pool.query('SELECT COUNT(*) as cnt FROM orders');
      if (parseInt(ordersCount.rows[0].cnt) > 0) {
        return res.status(400).json({ error: 'Order number start cannot be changed after the first order has been created.' });
      }
      const num = parseInt(order_number_start);
      if (isNaN(num) || num < 1) {
        return res.status(400).json({ error: 'Order number start must be a positive integer.' });
      }
      await pool.query(
        "INSERT INTO system_settings (key, value, updated_at) VALUES ('order_number_start', $1, NOW()) ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = NOW()",
        [String(num)]
      );
    }
    res.json({ success: true, message: 'System settings updated.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update system settings' });
  }
});

// Orders & Documents API
app.post('/api/orders', authorize(['Admin', 'Manager', 'Sales']), upload.any(), async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { order_date, delivery_date, notes, company_location_id, lineItems, priority, po_number, packaging_type, end_client_name, gst_number, reference_number, classification, project_name } = req.body;
    let parsedLineItems = [];
    try {
      parsedLineItems = JSON.parse(lineItems);
    } catch (e) {
      // Ignore
    }

    // Validate line item price values to prevent Postgres numeric field overflow
    for (const li of parsedLineItems) {
      const qty = parseInt(li.quantity) || 1;
      const uPrice = parseFloat(li.unit_price) || 0;
      const tPrice = parseFloat(li.total_price) || (qty * uPrice);

      if (isNaN(uPrice) || uPrice < 0 || uPrice > 9999999999999.99) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(400).json({ error: "Unit price must be a valid number between 0 and 9,999,999,999,999.99." });
      }
      if (isNaN(tPrice) || tPrice < 0 || tPrice > 9999999999999.99) {
        await client.query('ROLLBACK');
        client.release();
        return res.status(400).json({ error: "Total price must be a valid number between 0 and 9,999,999,999,999.99." });
      }
    }

    // 1. Generate Order Number
    const order_number = await generateOrderNumber(client);

    const resolved_order_date = order_date || new Date().toISOString().split('T')[0];
    const orderDateObj = new Date(resolved_order_date);
    const year = orderDateObj.getFullYear();
    const resolved_delivery_date = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim()) ? delivery_date.trim() : null;

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, company_location_id, order_date, delivery_date, notes, priority, po_number, packaging_type, created_by, end_client_name, gst_number, reference_number, classification, project_name) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [order_number, company_location_id || null, resolved_order_date, resolved_delivery_date, notes, priority || 'Medium', po_number || null, packaging_type || null, req.user.id, end_client_name || null, gst_number || null, reference_number || null, classification || 'Standard', project_name || null]
    );
    const order = orderResult.rows[0];

    // 2. Insert Line Items
    const maxUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
    let max_unit_seq = parseOrderCounter(maxUnitRes.rows[0]?.max_unit);
    let order_seq = parseOrderCounter(order_number);
    let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);
    let totalUnits = 0;
    const createdUnits = [];

    let itemIdx = 1;
    for (const li of parsedLineItems) {
      const qty = parseInt(li.quantity) || 1;
      const assigned_li_number = `${order_number}-${String(itemIdx).padStart(2, '0')}`;
      itemIdx++;

      const cleanTag = (li.tag && typeof li.tag === 'string' && li.tag.trim()) ? li.tag.trim() : null;
      const li_delivery_date = (li.delivery_date && typeof li.delivery_date === 'string' && li.delivery_date.trim()) ? li.delivery_date.trim() : resolved_delivery_date;
      const liResult = await client.query(
        `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number, panel_type_size, delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [order.id, assigned_li_number, li.material_description, li.part_number, li.panel_type_size, li_delivery_date, qty, li.unit, li.unit_price, li.total_price, li.notes, li.project_name || order.project_name || null, cleanTag]
      );
      const lineItem = liResult.rows[0];
      totalUnits += qty;

      for (let i = 0; i < qty; i++) {
        const unit_id = formatOrderNumber(year, globalUnitCounter);
        const short_serial = unit_id;
        const unitResult = await client.query(
          `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanTag]
        );
        createdUnits.push(unitResult.rows[0].id);
        globalUnitCounter++;
      }
    }

    // 3. Auto-assign mandatory steps
    const tasksResult = await client.query(`
      SELECT * FROM task_masters 
      WHERE is_mandatory = true 
      ORDER BY 
        CASE dept
          WHEN 'Sales' THEN 1
          WHEN 'Design' THEN 2
          WHEN 'Purchase' THEN 3
          WHEN 'Stores' THEN 4
          WHEN 'Planning' THEN 5
          WHEN 'Production' THEN 6
          WHEN 'QC' THEN 7
          WHEN 'Dispatch' THEN 8
          WHEN 'Accounts' THEN 9
          ELSE 10
        END ASC,
        id ASC
    `);
    let tasks = tasksResult.rows;
    if (tasks.length === 0) {
      tasks = DEFAULT_STEPS;
    }

    const orderTasks = tasks.filter(t => t.level === 'order');
    const unitTasks = tasks.filter(t => t.level === 'unit');

    // Insert order-level milestones
    for (let i = 0; i < orderTasks.length; i++) {
      const task = orderTasks[i];
      let fieldDefs = [];
      if (task.id) {
        try {
          const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
          fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
        } catch { fieldDefs = []; }
      }

      await client.query(
        `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [order.id, task.id || null, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
      );
    }

    // Insert unit-level production steps for each unit
    for (const unitDbId of createdUnits) {
      for (let i = 0; i < unitTasks.length; i++) {
        const task = unitTasks[i];
        let fieldDefs = [];
        if (task.id) {
          try {
            const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
            fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
          } catch { fieldDefs = []; }
        }

        await client.query(
          `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order) 
           VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
          [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
        );
      }
      // Derive initial unit status
      await deriveUnitStatus(unitDbId, client);
    }

    // 4. Save Uploaded Documents
    let hasPO = false;
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        let docType = 'General';
        const field = file.fieldname.toLowerCase();
        if (field.includes('po')) {
          docType = 'PO';
          hasPO = true;
        }
        else if (field.includes('quotation')) docType = 'Quotation';
        else if (field.includes('approved')) docType = 'Approved';
        else if (field.includes('indent')) docType = 'Indent';
        
        await client.query(
          `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          ['Order', order.id, docType, file.originalname, file.path, file.size, file.mimetype, req.user.id]
        );
      }
    }

    // Auto-inherit master technical drawings from Part Number Masters
    for (const item of parsedLineItems) {
      if (item.part_number && item.part_number.trim()) {
        const pCheck = await client.query('SELECT id FROM part_number_masters WHERE LOWER(part_number) = LOWER($1)', [item.part_number.trim()]);
        if (pCheck.rows.length > 0) {
          const masterId = pCheck.rows[0].id;
          const pDocs = await client.query('SELECT * FROM part_number_documents WHERE part_number_id = $1 AND is_current = true', [masterId]);
          for (const doc of pDocs.rows) {
            const masterDocType = doc.doc_type || 'Drawing';
            await client.query(
              `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, uploaded_by)
               VALUES ('Order', $1, $2, $3, $4, $5)`,
              [order.id, masterDocType, `[Master ${masterDocType}] ${doc.file_name}`, doc.file_path, req.user.id]
            );
          }
        }
      }
    }

    if (hasPO) {
      if ((!po_number || !po_number.trim()) && req.files) {
        const poFile = req.files.find(f => f.fieldname && f.fieldname.toLowerCase().includes('po'));
        if (poFile) {
          const derivedPo = poFile.originalname.replace(/\.[^/.]+$/, '').trim();
          await client.query('UPDATE orders SET po_number = $1 WHERE id = $2', [derivedPo, order.id]);
          order.po_number = derivedPo;
        }
      }

      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      await client.query(
        `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
        ['PO uploaded during order creation.', updatedStr, order.id]
      );
      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, order.id, 'Sales', 'Completed: Upload PO (System Auto-Check)']
      );
      // Re-derive unit status for all units in this order so they advance out of Sales gating
      for (const unitDbId of createdUnits) {
        await deriveUnitStatus(unitDbId, client);
      }
    }

    await client.query(
      `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, 'Sales', $3)`,
      [req.user.id, order.id, `Created order ${order_number} with ${totalUnits} units`]
    );

    await client.query('COMMIT');
    res.status(201).json({ order, message: `Order ${order_number} created with ${totalUnits} units.` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order creation error:', err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id/classification', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  try {
    const { classification } = req.body;
    if (!['Standard', 'Non-Standard'].includes(classification)) {
      return res.status(400).json({ error: 'Classification must be Standard or Non-Standard' });
    }

    const checkOrder = await pool.query('SELECT order_number, classification FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const oldClass = checkOrder.rows[0].classification || 'Standard';
    const order_number = checkOrder.rows[0].order_number;

    await pool.query('UPDATE orders SET classification = $1 WHERE id = $2', [classification, req.params.id]);

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Changed classification of order ${order_number} from "${oldClass}" to "${classification}"`, req.params.id]
    );

    res.json({ success: true, classification, message: `Order ${order_number} classification updated to ${classification}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order classification' });
  }
});

app.delete('/api/orders/:id', authorize(['Admin']), async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Check if the order exists
    const orderCheck = await client.query('SELECT order_number FROM orders WHERE id = $1', [id]);
    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }
    const orderNumberToDelete = orderCheck.rows[0].order_number;

    // Log action to activity logs
    await client.query(
      `INSERT INTO activity_logs (user_id, action_text, dept) VALUES ($1, $2, $3)`,
      [req.user.id, `Deleted order: ${orderNumberToDelete} (ID: ${id})`, 'Admin']
    );

    // 2. Delete the order (Foreign key cascades delete line items, units, steps)
    await client.query('DELETE FROM orders WHERE id = $1', [id]);

    // 3. Resequence remaining orders
    // A. Temporarily prefix remaining orders and units to avoid unique key violations during sequential updates
    await client.query("UPDATE orders SET order_number = 'TEMP-' || order_number");
    await client.query("UPDATE order_units SET unit_id = 'TEMP-' || unit_id");

    // B. Determine starting counter from system settings
    const settingRes = await client.query("SELECT value FROM system_settings WHERE key = 'order_number_start' LIMIT 1");
    let globalLineItemCounter = settingRes.rows.length > 0 ? parseInt(settingRes.rows[0].value) || 1 : 1;
    let globalUnitCounter = globalLineItemCounter;

    // C. Get all remaining orders in ascending order of creation (by ID)
    const remainingOrdersRes = await client.query("SELECT id, order_number, order_date, created_at FROM orders ORDER BY id ASC");
    const remainingOrders = remainingOrdersRes.rows;

    let currentOrderSeq = 1;
    let lastFYYear = null;
    let globalUnitSeq = 1;

    for (const order of remainingOrders) {
      let year = new Date().getFullYear();
      let cleanNum = String(order.order_number).replace(/^TEMP-/, '');

      if (cleanNum.startsWith('ORD-')) {
        const parts = cleanNum.split('-');
        if (parts.length >= 2 && parts[1].length === 4) {
          const yr = parseInt(parts[1]);
          if (!isNaN(yr)) year = yr;
        }
      } else if (/^\d{8,}$/.test(cleanNum)) {
        const yy = parseInt(cleanNum.substring(0, 2), 10);
        if (!isNaN(yy)) year = 2000 + yy;
      } else if (order.order_date) {
        year = new Date(order.order_date).getFullYear();
      } else if (order.created_at) {
        year = new Date(order.created_at).getFullYear();
      }

      if (lastFYYear !== null && lastFYYear !== year) {
        currentOrderSeq = 1;
      }
      lastFYYear = year;

      const newOrderNumber = formatOrderNumber(year, currentOrderSeq);

      // Update Order Number
      await client.query("UPDATE orders SET order_number = $1 WHERE id = $2", [newOrderNumber, order.id]);

      // Update Line Items for this Order
      const liRes = await client.query("SELECT id, quantity FROM order_line_items WHERE order_id = $1 ORDER BY id ASC", [order.id]);
      let itemIdx = 1;
      for (const li of liRes.rows) {
        const assignedLiNumber = `${newOrderNumber}-${String(itemIdx).padStart(2, '0')}`;
        await client.query(
          "UPDATE order_line_items SET line_item_number = $1 WHERE id = $2",
          [assignedLiNumber, li.id]
        );
        itemIdx++;
      }

      // Update Units for this Order
      const unitsRes = await client.query("SELECT id FROM order_units WHERE order_id = $1 ORDER BY id ASC", [order.id]);
      for (const unit of unitsRes.rows) {
        const newUnitSerial = formatOrderNumber(year, globalUnitSeq);
        await client.query(
          "UPDATE order_units SET unit_id = $1, short_serial = $1 WHERE id = $2",
          [newUnitSerial, unit.id]
        );
        globalUnitSeq++;
      }

      currentOrderSeq++;
    }

    await client.query('COMMIT');
    res.json({ message: 'Order deleted and remaining orders resequenced successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order deletion/resequencing error:', err);
    res.status(500).json({ error: 'Failed to delete and resequence orders' });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  const { 
    company_location_id, 
    order_date, 
    delivery_date, 
    notes, 
    priority, 
    po_number, 
    packaging_type, 
    end_client_name, 
    gst_number, 
    reference_number,
    classification,
    project_name
  } = req.body;
  
  try {
    const checkOrder = await pool.query('SELECT order_number, order_date FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const { order_number, order_date: existing_order_date } = checkOrder.rows[0];

    const resolved_order_date = order_date || (existing_order_date ? (existing_order_date instanceof Date ? existing_order_date.toISOString().split('T')[0] : String(existing_order_date).split('T')[0]) : new Date().toISOString().split('T')[0]);

    if (delivery_date !== undefined) {
      // Auto-update all line items' delivery dates if delivery_date was explicitly changed
      await pool.query(
        'UPDATE order_line_items SET delivery_date = $1 WHERE order_id = $2',
        [delivery_date || null, req.params.id]
      );
    }

    const result = await pool.query(
      `UPDATE orders 
       SET company_location_id = COALESCE($1, company_location_id), 
           order_date = COALESCE($2, order_date), 
           delivery_date = COALESCE($3, delivery_date), 
           notes = CASE WHEN $4::text IS NOT NULL THEN $4 ELSE notes END, 
           priority = COALESCE($5, priority), 
           po_number = CASE WHEN $6::text IS NOT NULL THEN $6 ELSE po_number END, 
           packaging_type = CASE WHEN $7::text IS NOT NULL THEN $7 ELSE packaging_type END, 
           end_client_name = CASE WHEN $8::text IS NOT NULL THEN $8 ELSE end_client_name END, 
           gst_number = CASE WHEN $9::text IS NOT NULL THEN $9 ELSE gst_number END, 
           reference_number = CASE WHEN $10::text IS NOT NULL THEN $10 ELSE reference_number END,
           classification = COALESCE($11, classification),
           project_name = CASE WHEN $12::text IS NOT NULL THEN $12 ELSE project_name END
       WHERE id = $13 
       RETURNING *`,
      [
        company_location_id ? parseInt(company_location_id) : null, 
        order_date || null, 
        delivery_date || null, 
        notes !== undefined ? notes : null, 
        priority || null, 
        po_number !== undefined ? po_number : null, 
        packaging_type !== undefined ? packaging_type : null, 
        end_client_name !== undefined ? end_client_name : null, 
        gst_number !== undefined ? gst_number : null, 
        reference_number !== undefined ? reference_number : null,
        classification || null,
        project_name !== undefined ? project_name : null,
        req.params.id
      ]
    );

    // If project_name was updated, also sync line items
    if (project_name !== undefined) {
      await pool.query('UPDATE order_line_items SET project_name = $1 WHERE order_id = $2', [project_name || null, req.params.id]);
    }

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [
        req.user.id, 
        req.user.role, 
        `Amended order details for ${order_number}`, 
        req.params.id
      ]
    );

    // Sync units' deriveUnitStatus after order details change
    const unitsRes = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [req.params.id]);
    for (const unit of unitsRes.rows) {
      await deriveUnitStatus(unit.id, pool);
    }

    res.json({ success: true, order: result.rows[0] });
  } catch (err) {
    console.error('Failed to amend order details:', err);
    res.status(500).json({ error: 'Failed to amend order details' });
  }
});

// Amend a single line item's core details
app.put('/api/orders/:orderId/line-items/:liId', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  const { orderId, liId } = req.params;
  const {
    material_description,
    part_number,
    panel_type_size,
    quantity,
    unit,
    unit_price,
    delivery_date,
    notes,
    tag,
  } = req.body;

  try {
    // Verify the order exists and fetch order_date
    const orderCheck = await pool.query('SELECT order_number, hold_status, order_date FROM orders WHERE id = $1', [orderId]);
    if (orderCheck.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const { order_number, hold_status, order_date } = orderCheck.rows[0];
    if (hold_status === 'Approved') return res.status(403).json({ error: 'Order is on hold. Amendments are disabled.' });

    // Verify the line item belongs to this order
    const liCheck = await pool.query('SELECT id FROM order_line_items WHERE id = $1 AND order_id = $2', [liId, orderId]);
    if (liCheck.rows.length === 0) return res.status(404).json({ error: 'Line item not found for this order' });

    const updates = [];
    const values = [];
    let idx = 1;

    if (material_description !== undefined) {
      updates.push(`material_description = $${idx++}`);
      values.push(material_description || null);
    }
    if (part_number !== undefined) {
      updates.push(`part_number = $${idx++}`);
      values.push(part_number || null);
    }
    if (panel_type_size !== undefined) {
      updates.push(`panel_type_size = $${idx++}`);
      values.push(panel_type_size || null);
    }
    if (quantity !== undefined) {
      const qty = quantity ? parseInt(quantity) : null;
      updates.push(`quantity = $${idx++}`);
      values.push(qty);
    }
    if (unit !== undefined) {
      updates.push(`unit = $${idx++}`);
      values.push(unit || null);
    }
    if (unit_price !== undefined) {
      const price = unit_price ? parseFloat(unit_price) : null;
      if (price !== null && (isNaN(price) || price < 0 || price > 9999999999999.99)) {
        return res.status(400).json({ error: "Unit price must be a valid number between 0 and 9,999,999,999,999.99." });
      }
      updates.push(`unit_price = $${idx++}`);
      values.push(price);
    }
    if (req.body.total_price !== undefined || (quantity !== undefined && unit_price !== undefined)) {
      let total = null;
      if (req.body.total_price !== undefined) {
        total = parseFloat(req.body.total_price);
      } else if (quantity && unit_price) {
        total = parseInt(quantity) * parseFloat(unit_price);
      }
      if (total !== null && (isNaN(total) || total < 0 || total > 9999999999999.99)) {
        return res.status(400).json({ error: "Total price must be a valid number between 0 and 9,999,999,999,999.99." });
      }
      updates.push(`total_price = $${idx++}`);
      values.push(total);
    }
    if (delivery_date !== undefined) {
      const cleanDeliveryDate = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim()) ? delivery_date.trim() : null;
      updates.push(`delivery_date = $${idx++}`);
      values.push(cleanDeliveryDate);
    }
    if (tag !== undefined) {
      const cleanTag = (tag && typeof tag === 'string' && tag.trim()) ? tag.trim() : null;
      updates.push(`tag = $${idx++}`);
      values.push(cleanTag);
      // Synchronize tag to all units associated with this line item
      await pool.query('UPDATE order_units SET tag = $1 WHERE line_item_id = $2', [cleanTag, liId]);
    }
    if (notes !== undefined) {
      updates.push(`notes = $${idx++}`);
      values.push(notes || null);
    }

    if (updates.length === 0) {
      return res.json({ success: true, message: 'No changes provided' });
    }

    values.push(liId);
    const result = await pool.query(
      `UPDATE order_line_items
       SET ${updates.join(', ')}
       WHERE id = $${idx}
       RETURNING *`,
      values
    );

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Amended line item ${result.rows[0].line_item_number} on order ${order_number}`, orderId]
    );

    res.json({ success: true, line_item: result.rows[0] });
  } catch (err) {
    console.error('Failed to amend line item:', err);
    res.status(500).json({ error: 'Failed to amend line item' });
  }
});

// Add a new line item (and corresponding units & steps) to an existing order
app.post('/api/orders/:orderId/line-items', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  const { orderId } = req.params;
  const {
    material_description,
    part_number,
    panel_type_size,
    quantity,
    unit,
    unit_price,
    delivery_date,
    notes,
    tag,
  } = req.body;

  if (!material_description || typeof material_description !== 'string' || !material_description.trim()) {
    return res.status(400).json({ error: 'Material description is required.' });
  }

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 1) {
    return res.status(400).json({ error: 'Quantity must be at least 1.' });
  }

  const uPrice = parseFloat(unit_price) || 0;
  if (isNaN(uPrice) || uPrice < 0 || uPrice > 9999999999999.99) {
    return res.status(400).json({ error: 'Unit price must be a valid number between 0 and 9,999,999,999,999.99.' });
  }

  let tPrice = req.body.total_price !== undefined ? parseFloat(req.body.total_price) : (qty * uPrice);
  if (isNaN(tPrice) || tPrice < 0 || tPrice > 9999999999999.99) {
    return res.status(400).json({ error: 'Total price must be a valid number between 0 and 9,999,999,999,999.99.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Verify the order exists and is not on hold
    const orderCheck = await client.query(
      'SELECT id, order_number, hold_status, order_date, delivery_date, classification, project_name FROM orders WHERE id = $1',
      [orderId]
    );
    if (orderCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Order not found' });
    }
    const order = orderCheck.rows[0];
    if (order.hold_status === 'Approved') {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Order is on hold. Adding line items is disabled.' });
    }

    // 2. Determine next line item number suffix
    const existingLis = await client.query(
      'SELECT line_item_number FROM order_line_items WHERE order_id = $1',
      [order.id]
    );
    let maxItemIdx = 0;
    for (const row of existingLis.rows) {
      const match = String(row.line_item_number || '').match(/-(\d+)$/);
      if (match) {
        const parsed = parseInt(match[1], 10);
        if (parsed > maxItemIdx) maxItemIdx = parsed;
      }
    }
    const nextItemIdx = maxItemIdx > 0 ? maxItemIdx + 1 : (existingLis.rows.length + 1);
    const assigned_li_number = `${order.order_number}-${String(nextItemIdx).padStart(2, '0')}`;

    const cleanTag = (tag && typeof tag === 'string' && tag.trim()) ? tag.trim() : null;
    const resolvedDeliveryDate = (delivery_date && typeof delivery_date === 'string' && delivery_date.trim())
      ? delivery_date.trim()
      : (order.delivery_date ? new Date(order.delivery_date).toISOString().split('T')[0] : null);

    // 3. Insert line item
    const liResult = await client.query(
      `INSERT INTO order_line_items (
        order_id, line_item_number, material_description, part_number, panel_type_size,
        delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *`,
      [
        order.id,
        assigned_li_number,
        material_description.trim(),
        part_number ? part_number.trim() : null,
        panel_type_size ? panel_type_size.trim() : null,
        resolvedDeliveryDate,
        qty,
        unit || 'Nos',
        uPrice,
        tPrice,
        notes || null,
        order.project_name || null,
        cleanTag,
      ]
    );
    const lineItem = liResult.rows[0];

    // 4. Determine starting unit serial sequence
    let year = new Date().getFullYear();
    if (order.order_date) {
      const d = new Date(order.order_date);
      if (!isNaN(d.getFullYear())) year = d.getFullYear();
    } else if (order.order_number && /^\d{8,}$/.test(order.order_number)) {
      const yy = parseInt(order.order_number.substring(0, 2), 10);
      if (!isNaN(yy)) year = 2000 + yy;
    }

    const maxUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
    let max_unit_seq = parseOrderCounter(maxUnitRes.rows[0]?.max_unit);
    let order_seq = parseOrderCounter(order.order_number);
    let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);

    // 5. Create units
    const createdUnits = [];
    for (let i = 0; i < qty; i++) {
      const unit_id = formatOrderNumber(year, globalUnitCounter);
      const short_serial = unit_id;
      const unitResult = await client.query(
        `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanTag]
      );
      createdUnits.push(unitResult.rows[0].id);
      globalUnitCounter++;
    }

    // 6. Assign mandatory unit-level steps
    const tasksResult = await client.query(`
      SELECT * FROM task_masters 
      WHERE is_mandatory = true AND level = 'unit'
      ORDER BY 
        CASE dept
          WHEN 'Sales' THEN 1
          WHEN 'Design' THEN 2
          WHEN 'Purchase' THEN 3
          WHEN 'Stores' THEN 4
          WHEN 'Planning' THEN 5
          WHEN 'Production' THEN 6
          WHEN 'QC' THEN 7
          WHEN 'Dispatch' THEN 8
          WHEN 'Accounts' THEN 9
          ELSE 10
        END ASC,
        id ASC
    `);
    let unitTasks = tasksResult.rows;
    if (unitTasks.length === 0) {
      unitTasks = DEFAULT_STEPS.filter(t => t.level === 'unit');
    }

    for (const unitDbId of createdUnits) {
      for (let i = 0; i < unitTasks.length; i++) {
        const task = unitTasks[i];
        let fieldDefs = [];
        if (task.id) {
          try {
            const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
            fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
          } catch { fieldDefs = []; }
        }

        await client.query(
          `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order) 
           VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9)`,
          [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
        );
      }
      // Derive initial unit status
      await deriveUnitStatus(unitDbId, client);
    }

    // 7. Activity Log
    await client.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Added line item ${assigned_li_number} (${qty} units) to order ${order.order_number}`, order.id]
    );

    await client.query('COMMIT');
    res.status(201).json({ success: true, line_item: lineItem, units_created: createdUnits.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to add line item to order:', err);
    res.status(500).json({ error: err.message || 'Failed to add line item to order' });
  } finally {
    client.release();
  }
});

app.post('/api/orders/:id/hold/request', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order_number = checkOrder.rows[0].order_number;

    await pool.query("UPDATE orders SET hold_status = 'Requested' WHERE id = $1", [req.params.id]);
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Requested hold for order ${order_number}`, req.params.id]
    );

    const userRes = await pool.query('SELECT username FROM users WHERE id = $1', [req.user.id]);
    const requestedByUsername = userRes.rows[0]?.username || 'Sales User';
    sendHoldRequestEmail(req.params.id, order_number, requestedByUsername).catch(console.error);

    res.json({ success: true, message: 'Hold requested successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders/:id/hold/approve', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order_number = checkOrder.rows[0].order_number;

    await pool.query("UPDATE orders SET hold_status = 'Approved' WHERE id = $1", [req.params.id]);
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Approved hold for order ${order_number}`, req.params.id]
    );
    res.json({ success: true, message: 'Order put on hold.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders/:id/hold/reject', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order_number = checkOrder.rows[0].order_number;

    await pool.query("UPDATE orders SET hold_status = 'None' WHERE id = $1", [req.params.id]);
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Rejected hold request for order ${order_number}`, req.params.id]
    );
    res.json({ success: true, message: 'Hold request rejected.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/orders/:id/hold/resume', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const order_number = checkOrder.rows[0].order_number;

    await pool.query("UPDATE orders SET hold_status = 'None' WHERE id = $1", [req.params.id]);
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Resumed order ${order_number}`, req.params.id]
    );
    res.json({ success: true, message: 'Order resumed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── BULK IMPORT via Excel ─────────────────────────────────────────────────────
// Accepts a single .xlsx file whose "Import Template" sheet follows the
// column layout generated by the sample template tool.
app.post('/api/orders/import', authorize(['Sales', 'Admin', 'Manager']), upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  // 1. Parse the workbook — auto-detect which sheet and which row is the real header
  let rows;
  let detectedSheet = '';
  let detectedHeaders = [];
  try {
    const wb = XLSX.readFile(req.file.path);

    // Prefer "Import Template" sheet, otherwise try first sheet
    const sheetName = wb.SheetNames.includes('Import Template')
      ? 'Import Template'
      : wb.SheetNames[0];
    detectedSheet = sheetName;
    const ws = wb.Sheets[sheetName];

    // Convert to raw 2D array first so we can scan for the real header row
    const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    // Find the row index that contains 'po_number' — handles group-label rows above real headers
    let headerRowIdx = -1;
    for (let i = 0; i < Math.min(raw.length, 10); i++) {
      const rowStr = raw[i].map(c => String(c).toLowerCase().trim());
      if (rowStr.includes('po_number')) {
        headerRowIdx = i;
        break;
      }
    }

    if (headerRowIdx === -1) {
      fs.unlinkSync(req.file.path);
      const firstRowPreview = raw[0] ? raw[0].slice(0, 5).join(', ') : '(empty)';
      return res.status(400).json({
        error: `Column header "po_number" not found in the first 10 rows of sheet "${sheetName}". ` +
               `First row detected: [${firstRowPreview}]. ` +
               `Make sure you are filling the "Import Template" sheet from the downloaded template.`
      });
    }

    // Use that row as headers, parse data rows below it
    const headers = raw[headerRowIdx].map(h => String(h).trim());
    detectedHeaders = headers;
    rows = raw.slice(headerRowIdx + 1).map(rowArr => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = rowArr[i] !== undefined ? rowArr[i] : ''; });
      return obj;
    });
  } catch (err) {
    try { fs.unlinkSync(req.file.path); } catch (_) {}
    return res.status(400).json({ error: `Failed to read Excel file: ${err.message}` });
  }

  // Cleanup the temp upload
  try { fs.unlinkSync(req.file.path); } catch (_) {}

  // Filter to rows that have any content at all
  rows = rows.filter(r => Object.values(r).some(v => String(v).trim() !== ''));

  if (!rows || rows.length === 0) {
    return res.status(400).json({
      error: `The sheet "${detectedSheet}" appears to be empty or has no data rows below the header. ` +
             `Detected headers: [${detectedHeaders.slice(0, 6).join(', ')}...]`
    });
  }

  // 2. Group rows by po_number (one order per unique PO)
  const orderMap = new Map();
  for (const row of rows) {
    const po = String(row['po_number'] || '').trim();
    if (!po) continue; // skip blank rows

    if (!orderMap.has(po)) {
      orderMap.set(po, { header: row, lineItems: [] });
    }
    orderMap.get(po).lineItems.push(row);
  }

  if (orderMap.size === 0) {
    return res.status(400).json({
      error: `No rows with a po_number value found in sheet "${detectedSheet}". ` +
             `Make sure the po_number column is filled in for every data row. ` +
             `Detected columns: [${detectedHeaders.join(', ')}]`
    });
  }

  // 3. Resolve company_name + company_city → company_location_id (cached)
  const locationCache = new Map();
  const resolveLocation = async (client, name, city) => {
    const key = `${name}|||${city}`.toLowerCase();
    if (locationCache.has(key)) return locationCache.get(key);

    // 1. Find or create company
    let compRes = await client.query(
      `SELECT id FROM companies WHERE LOWER(name) = LOWER($1) LIMIT 1`,
      [name]
    );
    let companyId;
    if (compRes.rows.length > 0) {
      companyId = compRes.rows[0].id;
    } else {
      compRes = await client.query(
        `INSERT INTO companies (name) VALUES ($1)
         ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
         RETURNING id`,
        [name]
      );
      companyId = compRes.rows[0].id;
    }

    // 2. Find or create location under that company
    let locRes = await client.query(
      `SELECT id FROM company_locations 
       WHERE company_id = $1 AND LOWER(city) = LOWER($2) 
       LIMIT 1`,
      [companyId, city]
    );
    let locationId;
    if (locRes.rows.length > 0) {
      locationId = locRes.rows[0].id;
    } else {
      locRes = await client.query(
        `INSERT INTO company_locations (company_id, city) VALUES ($1, $2) RETURNING id`,
        [companyId, city]
      );
      locationId = locRes.rows[0].id;
    }

    locationCache.set(key, locationId);
    return locationId;
  };

  // 4. Create each order in a transaction
  const results = [];
  const errors = [];

  for (const [po_number, { header, lineItems }] of orderMap) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Resolve location
      const companyName = String(header['company_name'] || '').trim();
      const companyCity = String(header['company_city'] || '').trim();
      if (!companyName || !companyCity) {
        errors.push({ po_number, error: 'company_name or company_city is missing.' });
        await client.query('ROLLBACK');
        continue;
      }
      const company_location_id = await resolveLocation(client, companyName, companyCity);

      // Validate priority
      const VALID_PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
      const priority = VALID_PRIORITIES.includes(header['priority']) ? header['priority'] : 'Medium';

      // Validate packaging (accept any custom packaging type string entered in the sheet)
      const packaging_type = header['packaging_type'] ? String(header['packaging_type']).trim() : null;

      // Parse dates (handles both JS Date objects from xlsx and YYYY-MM-DD strings)
      const parseDate = (v) => {
        if (!v) return null;
        if (v instanceof Date) return v.toISOString().split('T')[0];
        const s = String(v).trim();
        // Handle Excel serial numbers
        if (/^\d+$/.test(s)) {
          const d = XLSX.SSF.parse_date_code(parseInt(s));
          return `${d.y}-${String(d.m).padStart(2,'0')}-${String(d.d).padStart(2,'0')}`;
        }
        return s || null;
      };

      const order_date    = parseDate(header['order_date']) || new Date().toISOString().split('T')[0];
      const orderDateObj  = new Date(order_date);
      const deliveryDateObj = new Date(orderDateObj);
      deliveryDateObj.setDate(orderDateObj.getDate() + 28); // 4 weeks
      const delivery_date = deliveryDateObj.toISOString().split('T')[0];

      // Check if order already exists with this po_number
      const existingOrderRes = await client.query(
        'SELECT * FROM orders WHERE po_number = $1 LIMIT 1',
        [po_number]
      );

      let order;
      let lineNum = 1;
      let isAppended = false;

      if (existingOrderRes.rows.length > 0) {
        order = existingOrderRes.rows[0];
        isAppended = true;
      } else {
        const order_number = await generateOrderNumber(client);
        const VALID_CLASSIFICATIONS = ['Standard', 'Non-Standard'];
        const classification = VALID_CLASSIFICATIONS.includes(header['classification']) ? header['classification'] : 'Standard';
        const orderResult = await client.query(
          `INSERT INTO orders (order_number, company_location_id, order_date, delivery_date, notes, priority, po_number, packaging_type, created_by, end_client_name, gst_number, reference_number, classification, project_name)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
          [order_number, company_location_id, order_date, delivery_date,
           header['order_notes'] || null, priority, po_number, packaging_type, req.user.id,
           header['end_client_name'] || header['end_client'] || null,
           header['gst_number'] || null,
           header['reference_number'] || null,
           classification,
           header['project_name'] || header['project'] || null]
        );
        order = orderResult.rows[0];
      }

      const order_number = order.order_number;
      const order_seq = parseOrderCounter(order_number);

      const maxGlobalUnitRes = await client.query("SELECT MAX(unit_id) as max_unit FROM order_units WHERE unit_id NOT LIKE 'TEMP-%'");
      let max_unit_seq = parseOrderCounter(maxGlobalUnitRes.rows[0]?.max_unit);
      let globalUnitCounter = Math.max(max_unit_seq > 0 ? max_unit_seq + 1 : 1, order_seq);

      const countRes = await client.query('SELECT COUNT(*) FROM order_line_items WHERE order_id = $1', [order.id]);
      let itemIdx = parseInt(countRes.rows[0].count, 10) + 1;

      // Insert line items & units
      let totalUnits = 0;
      const createdUnits = [];

      for (const li of lineItems) {
        const qty = parseInt(li['quantity']) || 1;
        const li_number = `${order_number}-${String(itemIdx).padStart(2, '0')}`;
        itemIdx++;

        // Smart Deduplication: Check if this line item already exists (by number OR by matching description)
        if (isAppended) {
          const checkLi = await client.query(
            `SELECT id FROM order_line_items 
             WHERE order_id = $1 AND (
               line_item_number = $2 OR 
               (LOWER(TRIM(material_description)) = LOWER(TRIM($3)) AND TRIM($3) != '')
             ) LIMIT 1`,
            [order.id, li_number, li['material_description'] || '']
          );
          if (checkLi.rows.length > 0) {
            // Already exists — skip to prevent stacking duplicate lines
            continue;
          }
        }
        const unit_price = parseFloat(li['unit_price']) || 0;
        const total_price = parseFloat(li['total_price']) || (qty * unit_price);

        if (isNaN(unit_price) || unit_price < 0 || unit_price > 9999999999999.99) {
          throw new Error(`Unit price for line item must be a valid number between 0 and 9,999,999,999,999.99.`);
        }
        if (isNaN(total_price) || total_price < 0 || total_price > 9999999999999.99) {
          throw new Error(`Total price for line item must be a valid number between 0 and 9,999,999,999,999.99.`);
        }

        const cleanLiTag = li['tag'] && typeof li['tag'] === 'string' && li['tag'].trim() ? li['tag'].trim() : null;
        const liResult = await client.query(
          `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number,
            panel_type_size, delivery_date, quantity, unit, unit_price, total_price, notes, project_name, tag)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
          [order.id, li_number, li['material_description'] || '', li['part_number'] || '',
           li['panel_type_size'] || '', delivery_date,
           qty, li['unit'] || 'Nos', unit_price, total_price, li['line_item_notes'] || null,
           li['project_name'] || li['project'] || order.project_name || null, cleanLiTag]
        );
        const lineItem = liResult.rows[0];
        totalUnits += qty;

        for (let i = 0; i < qty; i++) {
          const unit_id = formatOrderNumber(new Date().getFullYear(), globalUnitCounter);
          const short_serial = unit_id;
          const unitResult = await client.query(
            `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial, panel_type_size, classification, tag) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
            [order.id, lineItem.id, unit_id, short_serial, lineItem.panel_type_size || null, order.classification || 'Standard', cleanLiTag]
          );
          createdUnits.push(unitResult.rows[0].id);
          globalUnitCounter++;
        }
      }

      // Auto-assign steps
      const tasksResult = await client.query(`
        SELECT * FROM task_masters 
        WHERE is_mandatory = true 
        ORDER BY 
          CASE dept
            WHEN 'Sales' THEN 1
            WHEN 'Design' THEN 2
            WHEN 'Purchase' THEN 3
            WHEN 'Stores' THEN 4
            WHEN 'Planning' THEN 5
            WHEN 'Production' THEN 6
            WHEN 'QC' THEN 7
            WHEN 'Dispatch' THEN 8
            WHEN 'Accounts' THEN 9
            ELSE 10
          END ASC,
          id ASC
      `);
      let tasks = tasksResult.rows;
      if (tasks.length === 0) {
        tasks = DEFAULT_STEPS;
      }

      const orderTasks = tasks.filter(t => t.level === 'order');
      const unitTasks = tasks.filter(t => t.level === 'unit');

      if (!isAppended) {
        for (let i = 0; i < orderTasks.length; i++) {
          const task = orderTasks[i];
          let fieldDefs = [];
          if (task.id) {
            try {
              const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
              fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
            } catch { fieldDefs = []; }
          }

          await client.query(
            `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
            [order.id, task.id || null, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
          );
        }
      }

      for (const unitDbId of createdUnits) {
        for (let i = 0; i < unitTasks.length; i++) {
          const task = unitTasks[i];
          let fieldDefs = [];
          if (task.id) {
            try {
              const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
              fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
            } catch { fieldDefs = []; }
          }

          await client.query(
            `INSERT INTO unit_steps (order_unit_id, task_id, dept, name, sub, status, requires_upload, default_doc_type, custom_fields, step_order)
             VALUES ($1,$2,$3,$4,$5,'pending',$6,$7,$8,$9)`,
            [unitDbId, task.id || null, task.dept, task.name, task.sub, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs), i]
          );
        }
        await deriveUnitStatus(unitDbId, client);
      }

      await client.query('COMMIT');
      results.push({ po_number, order_number, units: totalUnits, is_appended: isAppended });
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(`Import error for PO ${po_number}:`, err);
      errors.push({ po_number, error: err.message });
    } finally {
      client.release();
    }
  }

  res.status(errors.length === orderMap.size ? 400 : 201).json({
    message: `Import complete. ${results.length} order(s) created, ${errors.length} failed.`,
    created: results,
    errors
  });
});

app.get('/api/orders', authorize(), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT o.*, COALESCE(u.username, 'System') as creator_name, 
       (SELECT count(*) FROM order_units WHERE order_id = o.id) as unit_count,
       (SELECT count(*) FROM order_units WHERE order_id = o.id AND status = 'Dispatched') as dispatched_unit_count,
       (SELECT count(*) FROM order_line_items WHERE order_id = o.id) as line_item_count,
       c.name as company_name, l.city as company_city,
       oindentdoc.file_path as indent_file_path, oindentdoc.file_name as indent_file_name
       FROM orders o 
       LEFT JOIN users u ON o.created_by = u.id 
       LEFT JOIN company_locations l ON o.company_location_id = l.id
       LEFT JOIN companies c ON l.company_id = c.id
       LEFT JOIN LATERAL (
         SELECT file_path, file_name 
         FROM documents 
         WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'Indent' 
         ORDER BY uploaded_at DESC 
         LIMIT 1
       ) oindentdoc ON true
       ORDER BY o.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/board', authorize(), async (req, res) => {
  try {
    const ordersResult = await pool.query(
      `SELECT o.id, o.order_number, o.po_number, o.delivery_date, o.priority, o.notes,
              o.reference_number, o.end_client_name, o.classification, o.hold_status, o.status as order_status,
              c.name AS company_name, l.city AS company_city,
              (SELECT COUNT(*) FROM order_units ou WHERE ou.order_id = o.id) AS unit_count,
              (SELECT COUNT(*) FROM order_line_items oli WHERE oli.order_id = o.id) AS line_item_count,
              COALESCE(
                (SELECT MAX(s.created_at) FROM order_steps s WHERE s.order_id = o.id),
                o.created_at
              ) AS updated_at
       FROM orders o
       LEFT JOIN company_locations l ON o.company_location_id = l.id
       LEFT JOIN companies c ON l.company_id = c.id
       ORDER BY o.created_at DESC`
    );

    // Fetch order-level steps
    const orderStepsRes = await pool.query(
      `SELECT s.id, s.order_id, s.dept, s.name, s.status, s.requires_upload, s.notes, s.step_order
       FROM order_steps s
       ORDER BY s.step_order ASC, s.id ASC`
    );

    // Fetch unit-level steps joined with order_units to get order_id
    const unitStepsRes = await pool.query(
      `SELECT s.id, u.order_id, s.dept, CONCAT(u.short_serial, ': ', s.name) as name, s.status, s.requires_upload, s.notes, s.step_order
       FROM unit_steps s
       JOIN order_units u ON s.order_unit_id = u.id
       ORDER BY s.step_order ASC, s.id ASC`
    );

    const orders = ordersResult.rows.map(o => {
      const oSteps = orderStepsRes.rows.filter(s => s.order_id === o.id).map(s => ({
        id: `o_${s.id}`,
        dept: s.dept,
        name: s.name,
        status: s.status,
        notes: s.notes
      }));
      
      const uSteps = unitStepsRes.rows.filter(s => s.order_id === o.id).map(s => ({
        id: `u_${s.id}`,
        dept: s.dept,
        name: s.name,
        status: s.status,
        notes: s.notes
      }));

      const allSteps = [...oSteps, ...uSteps];

      let status = 'incomplete';
      if (o.hold_status === 'Approved' || String(o.order_status || '').toLowerCase().startsWith('hold')) {
        status = 'hold';
      } else if (String(o.order_status || '').toLowerCase().startsWith('cancel')) {
        status = 'cancelled';
      } else if (allSteps.length === 0) {
        status = 'no_steps';
      } else if (allSteps.every(s => s.status === 'done')) {
        status = 'completed';
      }

      return {
        ...o,
        status,
        steps: allSteps
      };
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/orders/:id', authorize(), async (req, res) => {
  try {
    const order = await pool.query(`
      SELECT o.*, c.name as company_name, l.city as company_city, l.address as company_address, l.person_in_charge, l.contact_number, l.email as company_email
      FROM orders o
      LEFT JOIN company_locations l ON o.company_location_id = l.id
      LEFT JOIN companies c ON l.company_id = c.id
      WHERE o.id = $1
    `, [req.params.id]);
    if (order.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    
    const lineItems = await pool.query('SELECT * FROM order_line_items WHERE order_id = $1 ORDER BY id ASC', [req.params.id]);
    const units = await pool.query('SELECT * FROM order_units WHERE order_id = $1 ORDER BY id ASC', [req.params.id]);
    const docs = await pool.query(
      `SELECT * FROM documents 
       WHERE (entity_type = 'Order' AND entity_id = $1) 
          OR (entity_type = 'Unit' AND entity_id IN (SELECT id FROM order_units WHERE order_id = $1))`, 
      [req.params.id]
    );
    
    let docsList = docs.rows;
    const isSalesOrAccounts = ['Sales', 'Accounts', 'Admin', 'Manager'].includes(req.user.role);
    if (!isSalesOrAccounts) {
      docsList = docsList.filter(d => d.doc_type !== 'PO');
    }
    
    res.json({ ...order.rows[0], line_items: lineItems.rows, units: units.rows, documents: docsList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const resolveCustomFieldValues = async (customFields, orderId, unitId = null) => {
  if (!customFields || !Array.isArray(customFields) || customFields.length === 0) {
    return customFields;
  }

  let dbRow = null;
  if (unitId) {
    const res = await pool.query(
      `SELECT 
        o.order_number, o.po_number, o.delivery_date, o.order_date,
        o.notes as order_notes, o.priority, o.packaging_type,
        o.end_client_name, o.gst_number, o.reference_number, o.classification,
        o.hold_status, o.status as order_status, o.qc_status, o.qc_date,
        o.planned_dispatch_date, o.wiring_assigned_date, o.wiring_expected_date, o.expected_qc_date,
        c.name as company_name,
        cl.city as company_city, cl.person_in_charge, cl.contact_number, cl.email as company_email,
        li.material_description, li.part_number, COALESCE(u.panel_type_size, li.panel_type_size) as panel_type_size,
        li.delivery_date as line_item_delivery_date, li.quantity, li.unit,
        li.unit_price, li.total_price, li.notes as line_item_notes,
        u.unit_id as unit_serial, u.short_serial, u.current_dept, u.status as unit_status
      FROM order_units u
      JOIN orders o ON u.order_id = o.id
      LEFT JOIN company_locations cl ON o.company_location_id = cl.id
      LEFT JOIN companies c ON cl.company_id = c.id
      LEFT JOIN order_line_items li ON u.line_item_id = li.id
      WHERE u.id = $1`,
      [unitId]
    );
    if (res.rows.length > 0) dbRow = res.rows[0];
  } else if (orderId) {
    const res = await pool.query(
      `SELECT 
        o.order_number, o.po_number, o.delivery_date, o.order_date,
        o.notes as order_notes, o.priority, o.packaging_type,
        o.end_client_name, o.gst_number, o.reference_number, o.classification,
        o.hold_status, o.status as order_status, o.qc_status, o.qc_date,
        o.planned_dispatch_date, o.wiring_assigned_date, o.wiring_expected_date, o.expected_qc_date,
        c.name as company_name,
        cl.city as company_city, cl.person_in_charge, cl.contact_number, cl.email as company_email
      FROM orders o
      LEFT JOIN company_locations cl ON o.company_location_id = cl.id
      LEFT JOIN companies c ON cl.company_id = c.id
      WHERE o.id = $1`,
      [orderId]
    );
    if (res.rows.length > 0) dbRow = res.rows[0];
  }

  // Resolve each custom field
  const results = [];
  for (const f of customFields) {
    if (!f.datakey) { results.push(f); continue; }

    const rawKey = f.datakey.trim();

    // ── Document count datakeys (docs.any, docs.PO, docs.Drawing, etc.) ──
    if (rawKey.startsWith('docs.')) {
      const docType = rawKey.slice(5); // e.g. "PO", "any", "Drawing"
      try {
        let count = 0;
        
        // 1. Resolve order id from context
        let resolvedOrderId = orderId;
        if (!resolvedOrderId && unitId && dbRow) {
          const oRes = await pool.query(`SELECT order_id FROM order_units WHERE id = $1`, [unitId]);
          if (oRes.rows.length > 0) resolvedOrderId = oRes.rows[0].order_id;
        }

        // 2. Query order-level documents + order-step documents
        if (resolvedOrderId) {
          let docRes;
          if (docType === 'any') {
            docRes = await pool.query(
              `SELECT COUNT(*) as cnt FROM documents 
               WHERE (entity_type = 'Order' AND entity_id = $1)
                  OR (entity_type = 'Step' AND entity_id IN (SELECT id FROM order_steps WHERE order_id = $1))`,
              [resolvedOrderId]
            );
          } else {
            docRes = await pool.query(
              `SELECT COUNT(*) as cnt FROM documents 
               WHERE (entity_type = 'Order' AND entity_id = $1 AND doc_type = $2)
                  OR (entity_type = 'Step' AND entity_id IN (SELECT id FROM order_steps WHERE order_id = $1) AND doc_type = $2)`,
              [resolvedOrderId, docType]
            );
          }
          count += parseInt(docRes.rows[0]?.cnt || '0', 10);
        }

        // 3. Query unit-level documents + unit-step documents
        if (unitId) {
          let unitDocRes;
          if (docType === 'any') {
            unitDocRes = await pool.query(
              `SELECT COUNT(*) as cnt FROM documents 
               WHERE (entity_type = 'Unit' AND entity_id = $1)
                  OR (entity_type = 'Step' AND entity_id IN (SELECT id FROM unit_steps WHERE order_unit_id = $1))`,
              [unitId]
            );
          } else {
            unitDocRes = await pool.query(
              `SELECT COUNT(*) as cnt FROM documents 
               WHERE (entity_type = 'Unit' AND entity_id = $1 AND doc_type = $2)
                  OR (entity_type = 'Step' AND entity_id IN (SELECT id FROM unit_steps WHERE order_unit_id = $1) AND doc_type = $2)`,
              [unitId, docType]
            );
          }
          count += parseInt(unitDocRes.rows[0]?.cnt || '0', 10);
        }

        // Return count as value; 0 → empty string so "any non-empty" check correctly fails
        results.push({ ...f, value: count > 0 ? count : '' });
      } catch (err) {
        console.error('Failed resolving docs datakey:', rawKey, err);
        results.push(f);
      }
      continue;
    }

    // ── Regular DB column datakeys ──
    if (!dbRow) { results.push(f); continue; }
    const key = rawKey.includes('.') ? rawKey.split('.').slice(-1)[0] : rawKey;
    const matchedKey = Object.keys(dbRow).find(k => k.toLowerCase() === key.toLowerCase());
    if (matchedKey && dbRow[matchedKey] !== null && dbRow[matchedKey] !== undefined) {
      const val = dbRow[matchedKey];
      let resolvedValue = val;
      if (f.type === 'Date' || val instanceof Date) {
        try {
          const d = new Date(val);
          if (!isNaN(d.getTime())) resolvedValue = d.toISOString().split('T')[0];
        } catch {}
      } else if (f.type === 'Yes/No') {
        resolvedValue = val === true || String(val).toLowerCase() === 'yes';
      } else {
        resolvedValue = String(val);
      }
      results.push({ ...f, value: resolvedValue });
    } else {
      results.push(f);
    }
  }
  return results;
};

const propagateCustomFieldsToDB = async (customFields, orderId, unitId = null, client = pool) => {
  if (!customFields || !Array.isArray(customFields) || customFields.length === 0) {
    return;
  }
  
  // Get order_id if only unitId is provided
  let resolvedOrderId = orderId;
  let lineItemId = null;
  if (unitId) {
    const unitRes = await client.query(
      `SELECT order_id, line_item_id FROM order_units WHERE id = $1`,
      [unitId]
    );
    if (unitRes.rows.length > 0) {
      resolvedOrderId = unitRes.rows[0].order_id;
      lineItemId = unitRes.rows[0].line_item_id;
    }
  }

  for (const f of customFields) {
    if (!f.datakey || f.value === undefined || f.value === null) continue;
    const rawKey = f.datakey.trim();
    if (rawKey.startsWith('docs.')) continue;

    const key = rawKey.includes('.') ? rawKey.split('.').slice(-1)[0] : rawKey;
    const value = f.value;

    // Check if key is a column in orders table
    const orderColsRes = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'orders' AND column_name = $1`,
      [key.toLowerCase()]
    );
    if (orderColsRes.rows.length > 0 && resolvedOrderId) {
      let valToSave = value;
      if (f.type === 'Yes/No') {
        valToSave = value === true || String(value).toLowerCase() === 'yes';
      }
      await client.query(
        `UPDATE orders SET ${key.toLowerCase()} = $1 WHERE id = $2`,
        [valToSave, resolvedOrderId]
      );
      continue;
    }

    // Check if key is a column in order_line_items table
    const liColsRes = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'order_line_items' AND column_name = $1`,
      [key.toLowerCase()]
    );
    if (liColsRes.rows.length > 0 && lineItemId) {
      let valToSave = value;
      if (f.type === 'Yes/No') {
        valToSave = value === true || String(value).toLowerCase() === 'yes';
      }
      await client.query(
        `UPDATE order_line_items SET ${key.toLowerCase()} = $1 WHERE id = $2`,
        [valToSave, lineItemId]
      );
      continue;
    }

    // Check if key is a column in order_units table
    const unitColsRes = await client.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'order_units' AND column_name = $1`,
      [key.toLowerCase()]
    );
    if (unitColsRes.rows.length > 0 && unitId) {
      let valToSave = value;
      if (f.type === 'Yes/No') {
        valToSave = value === true || String(value).toLowerCase() === 'yes';
      }
      await client.query(
        `UPDATE order_units SET ${key.toLowerCase()} = $1 WHERE id = $2`,
        [valToSave, unitId]
      );
      continue;
    }
  }
};


app.get('/api/orders/:id/steps', authorize(), async (req, res) => {
  try {
    // Self-healing: check if a PO document exists for this order
    const poDocCheck = await pool.query(
      `SELECT id FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO' LIMIT 1`,
      [req.params.id]
    );

    // Join with task_masters to get the field definitions template
    const result = await pool.query(`
      SELECT s.*, tm.custom_fields as tm_custom_fields, tm.order_fields as tm_order_fields
      FROM order_steps s
      LEFT JOIN task_masters tm ON s.task_id = tm.id
      WHERE s.order_id = $1
      ORDER BY s.step_order ASC, s.id ASC
    `, [req.params.id]);

    const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // For each step, if its own custom_fields is empty, seed from task master definitions
    const steps = [];
    for (const step of result.rows) {
      if (step.name === 'Upload PO' && step.status !== 'done' && poDocCheck.rows.length > 0) {
        await pool.query(
          `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE id = $3`,
          ['PO uploaded (Auto-resolved).', updatedStr, step.id]
        );
        step.status = 'done';
        step.notes = 'PO uploaded (Auto-resolved).';
        step.updated = updatedStr;
      }

      let cf = [];
      try { cf = Array.isArray(step.custom_fields) ? step.custom_fields : JSON.parse(step.custom_fields || '[]'); } catch { cf = []; }
      
      if (cf.length === 0 && step.tm_custom_fields) {
        try {
          const tmCf = Array.isArray(step.tm_custom_fields) ? step.tm_custom_fields : JSON.parse(step.tm_custom_fields);
          cf = tmCf.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
        } catch { cf = []; }
      }

      // Resolve datakeys dynamically
      cf = await resolveCustomFieldValues(cf, req.params.id, null);

      let autoDone = false;
      if (step.status !== 'done') {
        const hasResolvedVal = cf.some(f => {
          if (!f.datakey) return false;
          const val = f.value;
          const isValPresent = val !== null && val !== undefined && val !== '' && val !== false;
          if (!isValPresent) return false;
          
          // Auto-complete ONLY IF explicitly marked for auto-complete OR has an IF statement (condition)
          if (f.auto_complete === true || f.auto_complete === 'true' || step.auto_complete === true) {
            return true;
          }

          if (f.condition && String(f.condition).trim() !== '') {
            try {
              const fn = new Function('$val', `return (${f.condition});`);
              return !!fn(val);
            } catch (err) {
              console.error('Failed evaluating condition:', f.condition, err);
              return false;
            }
          }
          return false;
        });

        if (hasResolvedVal) {
          autoDone = true;
        }
      }

      if (autoDone) {
        const deliveryField = cf.find(f => f.datakey && f.datakey.includes('delivery_date'));
        let dispatchDateVal = step.dispatch_date;
        if (deliveryField && deliveryField.value) {
          dispatchDateVal = deliveryField.value;
        }

        await pool.query(
          `UPDATE order_steps SET status = 'done', custom_fields = $1, dispatch_date = COALESCE($2, dispatch_date), updated = $3 WHERE id = $4`,
          [JSON.stringify(cf), dispatchDateVal || null, updatedStr, step.id]
        );
        step.status = 'done';
        step.dispatch_date = dispatchDateVal;
        step.updated = updatedStr;
      }

      // Pass order_fields config from task master to step
      let orderFields = [];
      try { orderFields = Array.isArray(step.tm_order_fields) ? step.tm_order_fields : JSON.parse(step.tm_order_fields || '[]'); } catch { orderFields = []; }

      const { tm_custom_fields, tm_order_fields, ...rest } = step;
      steps.push({ ...rest, custom_fields: cf, order_fields: orderFields });
    }

    res.json(steps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order steps' });
  }
});

app.post('/api/orders/:id/steps', authorize(), async (req, res) => {
  const { taskId } = req.body;
  try {
    const taskResult = await pool.query('SELECT * FROM task_masters WHERE id = $1', [taskId]);
    if (taskResult.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    const task = taskResult.rows[0];

    // Copy field definitions (without values) from task master
    let fieldDefs = [];
    try {
      const raw = Array.isArray(task.custom_fields) ? task.custom_fields : JSON.parse(task.custom_fields || '[]');
      fieldDefs = raw.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
    } catch { fieldDefs = []; }

    const result = await pool.query(
      `INSERT INTO order_steps (order_id, task_id, dept, name, sub, special, requires_upload, default_doc_type, custom_fields, step_order) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, (SELECT COALESCE(MAX(step_order), 0) + 1 FROM order_steps WHERE order_id = $1 AND dept = $3)) RETURNING *`,
      [req.params.id, task.id, task.dept, task.name, task.sub, task.special, task.requires_upload, task.default_doc_type || 'General', JSON.stringify(fieldDefs)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add step to order' });
  }
});

app.put('/api/orders/:orderId/steps/reorder', authorize(), async (req, res) => {
  const { orderedIds } = req.body; // Array of step IDs in the new order
  if (!orderedIds || !Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds array required' });
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < orderedIds.length; i++) {
      await client.query(
        'UPDATE order_steps SET step_order = $1 WHERE id = $2 AND order_id = $3',
        [i, orderedIds[i], req.params.orderId]
      );
    }
    await client.query('COMMIT');
    res.json({ message: 'Steps reordered successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to reorder steps' });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:orderId/steps/:stepId', authorize(), async (req, res) => {
  if (await isOrderOnHold(req.params.orderId)) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const { status, notes, dispatchDate, custom_fields } = req.body;
  const updated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  try {
    // Fetch step details to verify permissions
    const stepRes = await pool.query('SELECT dept FROM order_steps WHERE id = $1 AND order_id = $2', [req.params.stepId, req.params.orderId]);
    if (stepRes.rows.length === 0) return res.status(404).json({ error: 'Step not found' });
    const step = stepRes.rows[0];

    const canEdit = ['Admin', 'Manager'].includes(req.user.role) || step.dept === req.user.role;
    if (!canEdit) {
      return res.status(403).json({ error: 'Forbidden: You are not authorized to update this task.' });
    }

    // Upstream validation: block marking 'done' if upstream depts are incomplete
    if (status === 'done' && !['Admin', 'Manager'].includes(req.user.role)) {
      const PIPELINE = ['Sales', 'Design', 'Purchase', 'Stores', 'Planning', 'Production', 'QC', 'Dispatch', 'Accounts'];
      const myIndex = PIPELINE.indexOf(step.dept);
      if (myIndex > 0) {
        const upstreamDepts = PIPELINE.slice(0, myIndex);
        const blockingRes = await pool.query(
          `SELECT DISTINCT dept FROM order_steps WHERE order_id = $1 AND dept = ANY($2::text[]) AND status NOT IN ('done')`,
          [req.params.orderId, upstreamDepts]
        );
        if (blockingRes.rows.length > 0) {
          const blocking = blockingRes.rows.map(r => r.dept).join(', ');
          return res.status(409).json({ error: `Cannot complete: upstream departments not finished yet — ${blocking}.` });
        }
      }
    }

    if (custom_fields) {
      await propagateCustomFieldsToDB(custom_fields, req.params.orderId, null, pool);
    }

    let cfJson = null;
    if (custom_fields) {
      cfJson = JSON.stringify(custom_fields);
    }

    const result = await pool.query(
      'UPDATE order_steps SET status = $1, notes = $2, dispatch_date = $3, updated = $4, custom_fields = COALESCE($5, custom_fields) WHERE id = $6 AND order_id = $7 RETURNING *',
      [status, notes, dispatchDate || null, updated, cfJson, req.params.stepId, req.params.orderId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Step not found' });

    await pool.query(
      `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
      [req.user.id, req.params.orderId, step.dept, `Updated step "${result.rows[0].name}" (Status: ${status})`]
    );

    // Auto-complete Step 2 (Release Documents) on Order level when Step 1 (Review & Classify) is Standard and marked Done
    if (step.dept === 'Design' && (result.rows[0].name === 'Review & Classify' || result.rows[0].name.toLowerCase().includes('classify'))) {
      let resolvedClassification = null;
      if (Array.isArray(custom_fields)) {
        const classField = custom_fields.find(f => f.datakey === 'classification' || f.id === 'classification' || f.label?.toLowerCase() === 'classification');
        if (classField && classField.value) {
          resolvedClassification = String(classField.value).trim();
        }
      }
      if (!resolvedClassification) {
        const oCheck = await pool.query('SELECT classification FROM orders WHERE id = $1', [req.params.orderId]);
        if (oCheck.rows.length > 0) {
          resolvedClassification = oCheck.rows[0].classification;
        }
      }

      if (resolvedClassification && resolvedClassification.toLowerCase() === 'standard' && status === 'done') {
        const step2Res = await pool.query(
          `SELECT id, status, notes FROM order_steps 
           WHERE order_id = $1 AND dept = 'Design' 
             AND (name = 'Release Documents' OR special = 'design') 
           LIMIT 1`,
          [req.params.orderId]
        );
        if (step2Res.rows.length > 0) {
          const step2 = step2Res.rows[0];
          const autoNote = 'Auto-completed: Standard master drawings & BOM applied.';
          const finalNotes = step2.notes ? step2.notes : autoNote;
          await pool.query(
            `UPDATE order_steps 
             SET status = 'done', notes = $1, updated = $2 
             WHERE id = $3`,
            [finalNotes, updated, step2.id]
          );
          await pool.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) 
             VALUES ($1, $2, 'Design', $3)`,
            [req.user.id, req.params.orderId, `Order: Step "Release Documents" auto-completed (Standard Panel)`]
          );
        }
      }
    }
    
    if (step.dept === 'QC' && status === 'blocked') {
      const { qcFailTarget } = req.body;
      const target = qcFailTarget === 'design' ? 'Design' : 'Production';
      const remark = target === 'Design' ? 'Returned from QC — design re-check needed' : 'Returned from QC — rework required';
      
      await pool.query(
        `UPDATE order_steps 
         SET status = 'inprogress', notes = $1, updated = $2 
         WHERE order_id = $3 AND dept = $4`,
        [remark, updated, req.params.orderId, target]
      );
      
      await pool.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) 
         VALUES ($1, $2, 'QC', $3)`,
        [req.user.id, req.params.orderId, `QC FAIL → returned to ${target} for ${target === 'Design' ? 're-check' : 'rework'}`]
      );
    }

    await updateOrderQCStatusFromSteps(req.params.orderId, pool);

    // Re-evaluate unit statuses for all units in this order (e.g. when Sales completes Upload PO)
    const unitsForOrder = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [req.params.orderId]);
    for (const u of unitsForOrder.rows) {
      await deriveUnitStatus(u.id, pool);
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update step' });
  }
});


app.delete('/api/orders/:orderId/steps/:stepId', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM order_steps WHERE id = $1 AND order_id = $2 RETURNING *',
      [req.params.stepId, req.params.orderId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Step not found' });
    
    // Also log this deletion
    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, $2, $3)',
      [req.user.id, result.rows[0].dept, `Deleted task step: ${result.rows[0].name}`]
    );
    
    res.json({ message: 'Step deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete step' });
  }
});

app.get('/api/planning', authorize(), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          oli.id as line_item_id,
          o.id as order_id,
          o.order_number,
          COALESCE((SELECT ou.po_number FROM order_units ou WHERE ou.line_item_id = oli.id AND ou.po_number IS NOT NULL LIMIT 1), o.po_number) AS po_number,
          COALESCE(oli.delivery_date, o.delivery_date) AS delivery_date,
          o.priority,
          o.notes,
          o.end_client_name,
          o.reference_number,
          oli.tag,
          oindentdoc.file_path AS indent_file_path,
          oindentdoc.file_name AS indent_file_name,
          o.hold_status,
          oli.planned_dispatch_date,
          oli.wiring_assigned_date,
          oli.wiring_expected_date,
          oli.expected_qc_date,
          oli.status,
          oli.qc_status,
          oli.qc_date,
          oli.mounting_start_date,
          oli.mounting_complete_date,
          oli.part_number,
          oli.line_item_number,
          oli.quantity,
          oli.custom_fields,
          (
              SELECT STRING_AGG(ou.unit_id, ', ' ORDER BY ou.id ASC)
              FROM order_units ou
              WHERE ou.line_item_id = oli.id
          ) as unit_numbers,
          (
              SELECT MIN(ou.unit_id) || CASE WHEN COUNT(ou.id) > 1 THEN ' – ' || MAX(ou.unit_id) ELSE '' END
              FROM order_units ou
              WHERE ou.line_item_id = oli.id
          ) as unit_range,
          (
              SELECT json_agg(json_build_object(
                'id', ou.id, 
                'unit_id', ou.unit_id, 
                'short_serial', ou.short_serial, 
                'current_dept', ou.current_dept, 
                'status', COALESCE(ou.status, oli.status, 'Not Started'),
                'hold_status', ou.hold_status,
                'hold_step_name', ou.hold_step_name,
                'hold_dept', ou.hold_dept,
                'hold_reason', ou.hold_reason,
                'held_by_name', ou.held_by_name,
                'held_at', ou.held_at,
                'cancelled_step_name', ou.cancelled_step_name,
                'cancelled_dept', ou.cancelled_dept,
                'cancelled_reason', ou.cancelled_reason,
                'planned_dispatch_date', COALESCE(ou.planned_dispatch_date, oli.planned_dispatch_date),
                'wiring_assigned_date', COALESCE(ou.wiring_assigned_date, oli.wiring_assigned_date),
                'wiring_expected_date', COALESCE(ou.wiring_expected_date, oli.wiring_expected_date),
                'expected_qc_date', COALESCE(ou.expected_qc_date, oli.expected_qc_date),
                'qc_status', COALESCE(ou.qc_status, oli.qc_status, 'Pending'),
                'qc_date', COALESCE(ou.qc_date, oli.qc_date),
                'mounting_start_date', COALESCE(ou.mounting_start_date, oli.mounting_start_date),
                'mounting_complete_date', COALESCE(ou.mounting_complete_date, oli.mounting_complete_date),
                'custom_fields', COALESCE(ou.custom_fields, oli.custom_fields, '{}'::jsonb)
              ) ORDER BY ou.id ASC)
              FROM order_units ou
              WHERE ou.line_item_id = oli.id
          ) as units,
          c.name as company_name,
          l.city as company_city,
          (
              SELECT COUNT(*) 
              FROM order_steps os 
              WHERE os.order_id = o.id
          ) + (
              SELECT COUNT(*) 
              FROM unit_steps us
              JOIN order_units ou ON us.order_unit_id = ou.id
              WHERE ou.line_item_id = oli.id
          ) as total_steps,
          (
              SELECT COUNT(*) 
              FROM order_steps os 
              WHERE os.order_id = o.id AND os.status = 'done'
          ) + (
              SELECT COUNT(*) 
              FROM unit_steps us
              JOIN order_units ou ON us.order_unit_id = ou.id
              WHERE ou.line_item_id = oli.id AND us.status = 'done'
          ) as done_steps,
          (
              SELECT ou.current_dept
              FROM order_units ou
              WHERE ou.line_item_id = oli.id AND ou.status NOT IN ('Dispatched')
              ORDER BY ou.id ASC
              LIMIT 1
          ) as active_dept
      FROM order_line_items oli
      JOIN orders o ON oli.order_id = o.id
      LEFT JOIN company_locations l ON o.company_location_id = l.id
      LEFT JOIN companies c ON l.company_id = c.id
      LEFT JOIN LATERAL (
        SELECT file_path, file_name 
        FROM documents 
        WHERE entity_type = 'Order' AND entity_id = o.id AND doc_type = 'Indent' 
        ORDER BY uploaded_at DESC 
        LIMIT 1
      ) oindentdoc ON true
      ORDER BY o.created_at DESC, oli.id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch planning orders:', err);
    res.status(500).json({ error: 'Failed to fetch planning orders' });
  }
});

app.put('/api/planning/line-items/bulk', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
  const { lineItemIds, fields } = req.body;
  if (!lineItemIds || !Array.isArray(lineItemIds) || lineItemIds.length === 0) {
    return res.status(400).json({ error: 'lineItemIds array required' });
  }

  // Check if any order is on hold
  for (const lineItemId of lineItemIds) {
    if (await isLineItemOnHold(lineItemId)) {
      return res.status(400).json({ error: 'One or more of the selected orders are currently on hold. Updates are disabled.' });
    }
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const lineItemId of lineItemIds) {
      const checkLi = await client.query('SELECT order_id FROM order_line_items WHERE id = $1', [lineItemId]);
      if (checkLi.rows.length === 0) continue;
      const order_id = checkLi.rows[0].order_id;

      // 1. Update order level fields (only if provided in req.body.fields)
      const orderUpdates = [];
      const orderParams = [];
      let oIdx = 1;

      if (fields.hasOwnProperty('end_client_name')) {
        orderUpdates.push(`end_client_name = $${oIdx++}`);
        orderParams.push(fields.end_client_name || null);
      }
      if (fields.hasOwnProperty('priority')) {
        orderUpdates.push(`priority = $${oIdx++}`);
        orderParams.push(fields.priority || 'Medium');
      }

      if (orderUpdates.length > 0) {
        orderParams.push(order_id);
        await client.query(
          `UPDATE orders SET ${orderUpdates.join(', ')} WHERE id = $${oIdx}`,
          orderParams
        );
      }

      // 2. Update line item level fields
      const liUpdates = [];
      const liParams = [];
      let lIdx = 1;

      if (fields.hasOwnProperty('planned_dispatch_date')) {
        liUpdates.push(`planned_dispatch_date = $${lIdx++}`);
        liParams.push(fields.planned_dispatch_date || null);
      }
      if (fields.hasOwnProperty('wiring_assigned_date')) {
        liUpdates.push(`wiring_assigned_date = $${lIdx++}`);
        liParams.push(fields.wiring_assigned_date || null);
      }
      if (fields.hasOwnProperty('wiring_expected_date')) {
        liUpdates.push(`wiring_expected_date = $${lIdx++}`);
        liParams.push(fields.wiring_expected_date || null);
      }
      if (fields.hasOwnProperty('expected_qc_date')) {
        liUpdates.push(`expected_qc_date = $${lIdx++}`);
        liParams.push(fields.expected_qc_date || null);
      }
      if (fields.hasOwnProperty('status')) {
        liUpdates.push(`status = $${lIdx++}`);
        liParams.push(fields.status || 'Not Started');
      }
      if (fields.hasOwnProperty('qc_status')) {
        liUpdates.push(`qc_status = $${lIdx++}`);
        liParams.push(fields.qc_status || 'Pending');
      }
      if (fields.hasOwnProperty('qc_date')) {
        liUpdates.push(`qc_date = $${lIdx++}`);
        liParams.push(fields.qc_date || null);
      }
      if (fields.hasOwnProperty('mounting_start_date')) {
        liUpdates.push(`mounting_start_date = $${lIdx++}`);
        liParams.push(fields.mounting_start_date || null);
      }
      if (fields.hasOwnProperty('mounting_complete_date')) {
        liUpdates.push(`mounting_complete_date = $${lIdx++}`);
        liParams.push(fields.mounting_complete_date || null);
      }
      if (fields.hasOwnProperty('custom_fields') && fields.custom_fields) {
        liUpdates.push(`custom_fields = COALESCE(custom_fields, '{}'::jsonb) || $${lIdx++}::jsonb`);
        liParams.push(JSON.stringify(fields.custom_fields));
      }

      if (liUpdates.length > 0) {
        liParams.push(lineItemId);
        await client.query(
          `UPDATE order_line_items SET ${liUpdates.join(', ')} WHERE id = $${lIdx}`,
          liParams
        );
      }

      if (fields.custom_fields) {
        await client.query(
          `UPDATE order_units 
           SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) || $1::jsonb 
           WHERE line_item_id = $2`,
          [JSON.stringify(fields.custom_fields), lineItemId]
        );
      }

      if (fields.hasOwnProperty('status') && fields.status) {
        await client.query(
          `UPDATE order_units SET status = $1 WHERE line_item_id = $2`,
          [fields.status, lineItemId]
        );

        if (fields.status === 'Completed') {
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', updated = $1 
             WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept = 'Planning'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), lineItemId]
          );
          await client.query(
            `UPDATE unit_steps 
             SET status = 'done', updated = $1 
             WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept IN ('Sales', 'Design', 'Purchase', 'Stores') AND status = 'pending'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), lineItemId]
          );
        } else if (fields.status === 'Not Started' || fields.status === 'Pending') {
          await client.query(
            `UPDATE unit_steps 
             SET status = 'pending', updated = $1 
             WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept = 'Planning' AND status = 'done'`,
            [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), lineItemId]
          );
        }

        const unitsRes = await client.query('SELECT id FROM order_units WHERE line_item_id = $1', [lineItemId]);
        for (const u of unitsRes.rows) {
          await deriveUnitStatus(u.id, client);
        }
      }

      await client.query(
        'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
        [req.user.id, req.user.role, 'Updated planning details (bulk) for line item', order_id]
      );
    }

    await client.query('COMMIT');
    res.json({ success: true, message: `Bulk updated ${lineItemIds.length} line items` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to bulk update planning details:', err);
    res.status(500).json({ error: 'Failed to bulk update planning details' });
  } finally {
    client.release();
  }
});

app.put('/api/planning/units/:unitId', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
  const { unitId } = req.params;
  const { 
    end_client_name, 
    planned_dispatch_date, 
    wiring_assigned_date, 
    wiring_expected_date, 
    expected_qc_date, 
    priority, 
    status, 
    qc_status, 
    qc_date,
    mounting_start_date,
    mounting_complete_date,
    custom_fields
  } = req.body;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const checkUnit = await client.query('SELECT id, order_id, line_item_id, unit_id FROM order_units WHERE id = $1', [unitId]);
    if (checkUnit.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Unit not found' });
    }
    const unit = checkUnit.rows[0];

    if (await isLineItemOnHold(unit.line_item_id)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
    }

    // Update order level fields if provided
    if (end_client_name || priority) {
      await client.query(
        `UPDATE orders SET end_client_name = COALESCE($1, end_client_name), priority = COALESCE($2, priority) WHERE id = $3`,
        [end_client_name || null, priority, unit.order_id]
      );
    }

    // Update unit level planning fields directly
    const result = await client.query(
      `UPDATE order_units 
       SET planned_dispatch_date = $1, 
           wiring_assigned_date = $2, 
           wiring_expected_date = $3, 
           expected_qc_date = $4, 
           status = COALESCE($5, status), 
           qc_status = COALESCE($6, qc_status), 
           qc_date = $7,
           mounting_start_date = $8,
           mounting_complete_date = $9,
           custom_fields = CASE 
             WHEN $10::text IS NOT NULL THEN COALESCE(custom_fields, '{}'::jsonb) || $10::jsonb 
             ELSE custom_fields 
           END
       WHERE id = $11 
       RETURNING *`,
      [
        planned_dispatch_date || null, 
        wiring_assigned_date || null, 
        wiring_expected_date || null, 
        expected_qc_date || null, 
        status, 
        qc_status, 
        qc_date || null, 
        mounting_start_date || null,
        mounting_complete_date || null,
        custom_fields ? JSON.stringify(custom_fields) : null,
        unitId
      ]
    );

    // If status was updated, propagate to unit_steps and derive new department
    if (status) {
      if (status === 'Completed') {
        await client.query(
          `UPDATE unit_steps 
           SET status = 'done', updated = $1 
           WHERE order_unit_id = $2 AND dept = 'Planning'`,
          [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), unitId]
        );
        // Also ensure lingering pending upstream steps are marked done so unit is never blocked from Production
        await client.query(
          `UPDATE unit_steps 
           SET status = 'done', updated = $1 
           WHERE order_unit_id = $2 AND dept IN ('Sales', 'Design', 'Purchase', 'Stores') AND status = 'pending'`,
          [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), unitId]
        );
        await deriveUnitStatus(unitId, client);
      } else if (status === 'Not Started' || status === 'Pending') {
        await client.query(
          `UPDATE unit_steps 
           SET status = 'pending', updated = $1 
           WHERE order_unit_id = $2 AND dept = 'Planning' AND status = 'done'`,
          [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), unitId]
        );
        await deriveUnitStatus(unitId, client);
      }
    }

    await client.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Updated planning details for unit ${unit.unit_id}`, unit.order_id]
    );

    await client.query('COMMIT');
    const updatedUnitRes = await client.query('SELECT * FROM order_units WHERE id = $1', [unitId]);
    res.json(updatedUnitRes.rows[0] || result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to update unit planning details:', err);
    res.status(500).json({ error: 'Failed to update unit planning details' });
  } finally {
    client.release();
  }
});

app.put('/api/planning/line-items/:lineItemId', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
  if (await isLineItemOnHold(req.params.lineItemId)) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const { 
    end_client_name, 
    planned_dispatch_date, 
    wiring_assigned_date, 
    wiring_expected_date, 
    expected_qc_date, 
    priority, 
    status, 
    qc_status, 
    qc_date,
    mounting_start_date,
    mounting_complete_date,
    custom_fields
  } = req.body;
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const checkLi = await client.query('SELECT order_id FROM order_line_items WHERE id = $1', [req.params.lineItemId]);
    if (checkLi.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Line item not found' });
    }
    const order_id = checkLi.rows[0].order_id;

    // Update order level fields
    await client.query(
      `UPDATE orders SET end_client_name = COALESCE($1, end_client_name), priority = COALESCE($2, priority) WHERE id = $3`,
      [end_client_name || null, priority, order_id]
    );

    // Update line item level fields
    const result = await client.query(
      `UPDATE order_line_items 
       SET planned_dispatch_date = $1, 
           wiring_assigned_date = $2, 
           wiring_expected_date = $3, 
           expected_qc_date = $4, 
           status = COALESCE($5, status), 
           qc_status = COALESCE($6, qc_status), 
           qc_date = $7,
           mounting_start_date = $8,
           mounting_complete_date = $9,
           custom_fields = CASE 
             WHEN $10::text IS NOT NULL THEN COALESCE(custom_fields, '{}'::jsonb) || $10::jsonb 
             ELSE custom_fields 
           END
       WHERE id = $11 
       RETURNING *`,
      [
        planned_dispatch_date || null, 
        wiring_assigned_date || null, 
        wiring_expected_date || null, 
        expected_qc_date || null, 
        status, 
        qc_status, 
        qc_date || null, 
        mounting_start_date || null,
        mounting_complete_date || null,
        custom_fields ? JSON.stringify(custom_fields) : null,
        req.params.lineItemId
      ]
    );

    if (custom_fields) {
      await client.query(
        `UPDATE order_units 
         SET custom_fields = COALESCE(custom_fields, '{}'::jsonb) || $1::jsonb 
         WHERE line_item_id = $2`,
        [JSON.stringify(custom_fields), req.params.lineItemId]
      );
    }

    if (status) {
      await client.query(
        `UPDATE order_units SET status = $1 WHERE line_item_id = $2`,
        [status, req.params.lineItemId]
      );

      if (status === 'Completed') {
        await client.query(
          `UPDATE unit_steps 
           SET status = 'done', updated = $1 
           WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept = 'Planning'`,
          [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), req.params.lineItemId]
        );
        await client.query(
          `UPDATE unit_steps 
           SET status = 'done', updated = $1 
           WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept IN ('Sales', 'Design', 'Purchase', 'Stores') AND status = 'pending'`,
          [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), req.params.lineItemId]
        );
      } else if (status === 'Not Started' || status === 'Pending') {
        await client.query(
          `UPDATE unit_steps 
           SET status = 'pending', updated = $1 
           WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $2) AND dept = 'Planning' AND status = 'done'`,
          [new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), req.params.lineItemId]
        );
      }

      const unitsRes = await client.query('SELECT id FROM order_units WHERE line_item_id = $1', [req.params.lineItemId]);
      for (const u of unitsRes.rows) {
        await deriveUnitStatus(u.id, client);
      }
    }

    await client.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, `Updated planning details for line item`, order_id]
    );

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to update planning details:', err);
    res.status(500).json({ error: 'Failed to update planning details' });
  } finally {
    client.release();
  }
});

app.put('/api/orders/:id/planning', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
  if (await isOrderOnHold(req.params.id)) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const { 
    end_client_name, 
    planned_dispatch_date, 
    wiring_assigned_date, 
    wiring_expected_date, 
    expected_qc_date, 
    priority, 
    status, 
    qc_status, 
    qc_date 
  } = req.body;
  
  try {
    const checkOrder = await pool.query('SELECT order_number FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const order_number = checkOrder.rows[0].order_number;

    const result = await pool.query(
      `UPDATE orders 
       SET end_client_name = $1, 
           planned_dispatch_date = $2, 
           wiring_assigned_date = $3, 
           wiring_expected_date = $4, 
           expected_qc_date = $5, 
           priority = COALESCE($6, priority), 
           status = COALESCE($7, status), 
           qc_status = COALESCE($8, qc_status), 
           qc_date = $9 
       WHERE id = $10 
       RETURNING *`,
      [
        end_client_name || null, 
        planned_dispatch_date || null, 
        wiring_assigned_date || null, 
        wiring_expected_date || null, 
        expected_qc_date || null, 
        priority, 
        status, 
        qc_status, 
        qc_date || null, 
        req.params.id
      ]
    );

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [
        req.user.id, 
        req.user.role, 
        `Updated planning details for order ${order_number}`, 
        req.params.id
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to update planning details:', err);
    res.status(500).json({ error: 'Failed to update planning details' });
  }
});

app.get('/api/units/:unitId/steps', authorize(), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*, tm.custom_fields as tm_custom_fields, tm.order_fields as tm_order_fields
       FROM unit_steps s
       LEFT JOIN task_masters tm ON s.task_id = tm.id
       WHERE s.order_unit_id = $1
       ORDER BY s.step_order ASC, s.id ASC`,
      [req.params.unitId]
    );

    const steps = [];
    for (const step of result.rows) {
      let cf = [];
      try { cf = Array.isArray(step.custom_fields) ? step.custom_fields : JSON.parse(step.custom_fields || '[]'); } catch { cf = []; }
      
      if (cf.length === 0 && step.tm_custom_fields) {
        try {
          const tmCf = Array.isArray(step.tm_custom_fields) ? step.tm_custom_fields : JSON.parse(step.tm_custom_fields);
          cf = tmCf.map(f => ({ ...f, value: f.type === 'Yes/No' ? false : '' }));
        } catch { cf = []; }
      }
      
      // Resolve datakeys dynamically
      cf = await resolveCustomFieldValues(cf, null, req.params.unitId);
      
      let autoDone = false;
      if (step.status !== 'done') {
        const hasResolvedVal = cf.some(f => {
          if (!f.datakey) return false;
          const val = f.value;
          const isValPresent = val !== null && val !== undefined && val !== '' && val !== false;
          if (!isValPresent) return false;
          
          // Auto-complete ONLY IF explicitly marked for auto-complete OR has an IF statement (condition)
          if (f.auto_complete === true || f.auto_complete === 'true' || step.auto_complete === true) {
            return true;
          }

          if (f.condition && String(f.condition).trim() !== '') {
            try {
              const fn = new Function('$val', `return (${f.condition});`);
              return !!fn(val);
            } catch (err) {
              console.error('Failed evaluating condition:', f.condition, err);
              return false;
            }
          }
          return false;
        });

        if (hasResolvedVal) {
          autoDone = true;
        }
      }

      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

      if (autoDone) {
        const deliveryField = cf.find(f => f.datakey && f.datakey.includes('delivery_date'));
        let dispatchDateVal = step.dispatch_date;
        if (deliveryField && deliveryField.value) {
          dispatchDateVal = deliveryField.value;
        }

        await pool.query(
          `UPDATE unit_steps SET status = 'done', custom_fields = $1, dispatch_date = COALESCE($2, dispatch_date), updated = $3 WHERE id = $4`,
          [JSON.stringify(cf), dispatchDateVal || null, updatedStr, step.id]
        );
        step.status = 'done';
        step.dispatch_date = dispatchDateVal;
        step.updated = updatedStr;

        // Recalculate derived status and QC status
        await deriveUnitStatus(req.params.unitId, pool);
        const unitRes = await pool.query('SELECT order_id FROM order_units WHERE id = $1', [req.params.unitId]);
        if (unitRes.rows.length > 0) {
          await updateOrderQCStatusFromSteps(unitRes.rows[0].order_id, pool);
        }
      }

      let orderFields = [];
      try { orderFields = Array.isArray(step.tm_order_fields) ? step.tm_order_fields : JSON.parse(step.tm_order_fields || '[]'); } catch { orderFields = []; }

      const { tm_custom_fields, tm_order_fields, ...rest } = step;
      steps.push({ ...rest, custom_fields: cf, order_fields: orderFields });
    }

    res.json(steps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch unit steps' });
  }
});

app.put('/api/units/:unitId/steps/:stepId', authorize(), async (req, res) => {
  const { 
    action, 
    status, 
    notes, 
    dispatchDate, 
    custom_fields, 
    assigned_user_id, 
    holdReason, 
    scope = 'unit', 
    targetUnitIds, 
    resumeTarget 
  } = req.body;

  const isSpecialAction = ['hold', 'resume', 'cancel'].includes(action);
  if (!isSpecialAction && (await isUnitOnHold(req.params.unitId))) {
    return res.status(400).json({ error: 'This unit is currently on hold. Resume the panel to make updates.' });
  }

  const updated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch step details to verify permissions
    const stepRes = await client.query(
      `SELECT s.id, s.name, s.dept, s.assigned_user_id, ou.order_id, ou.short_serial, ou.unit_id 
       FROM unit_steps s 
       JOIN order_units ou ON s.order_unit_id = ou.id 
       WHERE s.id = $1 AND s.order_unit_id = $2`,
      [req.params.stepId, req.params.unitId]
    );
    if (stepRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Unit step not found' });
    }
    const step = stepRes.rows[0];

    const canEdit = ['Admin', 'Manager'].includes(req.user.role) || step.dept === req.user.role || step.assigned_user_id === req.user.id;
    if (!canEdit) {
      await client.query('ROLLBACK');
      return res.status(403).json({ error: 'Forbidden: You are not authorized to update this task.' });
    }

    // Determine target units
    let targetUnits = [];
    if (scope === 'order') {
      const orderUnitsRes = await client.query('SELECT id, short_serial FROM order_units WHERE order_id = $1', [step.order_id]);
      targetUnits = orderUnitsRes.rows;
    } else if (scope === 'selected' && Array.isArray(targetUnitIds) && targetUnitIds.length > 0) {
      const selectedRes = await client.query('SELECT id, short_serial FROM order_units WHERE id = ANY($1::int[])', [targetUnitIds]);
      targetUnits = selectedRes.rows;
    } else {
      targetUnits = [{ id: parseInt(req.params.unitId), short_serial: step.short_serial }];
    }

    let lastResult = null;
    const userName = req.user.name || req.user.username || 'User';

    if (action === 'hold') {
      const reason = (holdReason || notes || 'On hold').trim();
      for (const tu of targetUnits) {
        const matchingStep = await client.query(
          'SELECT id FROM unit_steps WHERE order_unit_id = $1 AND name = $2 AND dept = $3 LIMIT 1',
          [tu.id, step.name, step.dept]
        );
        const sId = matchingStep.rows.length > 0 ? matchingStep.rows[0].id : null;
        if (sId) {
          const upd = await client.query(
            `UPDATE unit_steps 
             SET status = 'hold', hold_reason = $1, held_by = $2, hold_at = NOW(), updated = $3 
             WHERE id = $4 RETURNING *`,
            [reason, userName, updated, sId]
          );
          if (tu.id === parseInt(req.params.unitId)) lastResult = upd.rows[0];
        }

        await client.query(
          `UPDATE order_units 
           SET hold_status = 'Hold', hold_step_id = $1, hold_step_name = $2, hold_dept = $3, 
               hold_reason = $4, held_by_name = $5, held_at = NOW(), status = $6 
           WHERE id = $7`,
          [sId, step.name, step.dept, reason, userName, `Hold @ ${step.name}`, tu.id]
        );

        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, step.order_id, step.dept, `Unit ${tu.short_serial}: Put on HOLD @ ${step.name} (${step.dept}) — Reason: ${reason}`]
        );

        await deriveUnitStatus(tu.id, client);
      }
    } else if (action === 'resume') {
      for (const tu of targetUnits) {
        const matchingStep = await client.query(
          'SELECT id FROM unit_steps WHERE order_unit_id = $1 AND name = $2 AND dept = $3 LIMIT 1',
          [tu.id, step.name, step.dept]
        );
        const sId = matchingStep.rows.length > 0 ? matchingStep.rows[0].id : null;
        if (sId) {
          const upd = await client.query(
            `UPDATE unit_steps 
             SET status = 'inprogress', hold_reason = NULL, held_by = NULL, hold_at = NULL, updated = $1 
             WHERE id = $2 RETURNING *`,
            [updated, sId]
          );
          if (tu.id === parseInt(req.params.unitId)) lastResult = upd.rows[0];
        }

        await client.query(
          `UPDATE order_units 
           SET hold_status = 'None', 
               hold_step_id = NULL, hold_step_name = NULL, hold_dept = NULL, 
               hold_reason = NULL, held_by_name = NULL, held_at = NULL,
               cancelled_step_id = NULL, cancelled_step_name = NULL, cancelled_dept = NULL,
               cancelled_reason = NULL, cancelled_by_name = NULL, cancelled_at = NULL
           WHERE id = $1`,
          [tu.id]
        );

        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, step.order_id, step.dept, `Unit ${tu.short_serial}: RESUMED @ ${step.name} (${step.dept})`]
        );

        await deriveUnitStatus(tu.id, client);
      }
    } else if (action === 'cancel') {
      const reason = (holdReason || notes || 'Cancelled').trim();
      for (const tu of targetUnits) {
        const matchingStep = await client.query(
          'SELECT id FROM unit_steps WHERE order_unit_id = $1 AND name = $2 AND dept = $3 LIMIT 1',
          [tu.id, step.name, step.dept]
        );
        const sId = matchingStep.rows.length > 0 ? matchingStep.rows[0].id : null;
        if (sId) {
          const upd = await client.query(
            `UPDATE unit_steps 
             SET status = 'cancelled', hold_reason = $1, held_by = $2, hold_at = NOW(), updated = $3 
             WHERE id = $4 RETURNING *`,
            [reason, userName, updated, sId]
          );
          if (tu.id === parseInt(req.params.unitId)) lastResult = upd.rows[0];
        }

        await client.query(
          `UPDATE order_units 
           SET hold_status = 'Cancelled', cancelled_step_id = $1, cancelled_step_name = $2, cancelled_dept = $3, 
               cancelled_reason = $4, cancelled_by_name = $5, cancelled_at = NOW(), status = 'Cancelled' 
           WHERE id = $6`,
          [sId, step.name, step.dept, reason, userName, tu.id]
        );

        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, step.order_id, step.dept, `Unit ${tu.short_serial}: CANCELLED @ ${step.name} (${step.dept}) — Reason: ${reason}`]
        );

        await deriveUnitStatus(tu.id, client);
      }
    } else {
      // Regular step update (done, inprogress, blocked, etc.)
      const newStatus = status || 'pending';

      // Upstream validation: block marking 'done' if upstream depts are incomplete
      if (newStatus === 'done' && !['Admin', 'Manager'].includes(req.user.role)) {
        const PIPELINE = ['Sales', 'Design', 'Purchase', 'Stores', 'Planning', 'Production', 'QC', 'Dispatch', 'Accounts'];
        const myIndex = PIPELINE.indexOf(step.dept);
        if (myIndex > 0) {
          const upstreamDepts = PIPELINE.slice(0, myIndex);
          const blockingRes = await client.query(
            `SELECT DISTINCT dept FROM unit_steps WHERE order_unit_id = $1 AND dept = ANY($2::text[]) AND status NOT IN ('done')`,
            [req.params.unitId, upstreamDepts]
          );
          if (blockingRes.rows.length > 0) {
            const blocking = blockingRes.rows.map(r => r.dept).join(', ');
            await client.query('ROLLBACK');
            return res.status(409).json({ error: `Cannot complete: upstream departments not finished yet — ${blocking}.` });
          }
        }
      }

      for (const tu of targetUnits) {
        const matchingStep = await client.query(
          'SELECT id FROM unit_steps WHERE order_unit_id = $1 AND name = $2 AND dept = $3 LIMIT 1',
          [tu.id, step.name, step.dept]
        );
        const sId = matchingStep.rows.length > 0 ? matchingStep.rows[0].id : null;
        if (!sId) continue;

        if (custom_fields) {
          await propagateCustomFieldsToDB(custom_fields, null, tu.id, client);
        }

        let cfJson = custom_fields ? JSON.stringify(custom_fields) : null;

        const upd = await client.query(
          `UPDATE unit_steps 
           SET status = $1, notes = $2, dispatch_date = $3, updated = $4, custom_fields = COALESCE($5, custom_fields), assigned_user_id = COALESCE($6, assigned_user_id) 
           WHERE id = $7 AND order_unit_id = $8 
           RETURNING *`,
          [newStatus, notes, dispatchDate || null, updated, cfJson, assigned_user_id || null, sId, tu.id]
        );

        if (tu.id === parseInt(req.params.unitId)) {
          lastResult = upd.rows[0];
        }

        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, step.order_id, step.dept, `Unit ${tu.short_serial}: Updated step "${step.name}" (Status: ${newStatus})`]
        );

        // Auto-complete Step 2 (Release Documents) when Step 1 (Review & Classify) is Standard and marked Done
        if (step.dept === 'Design' && (step.name === 'Review & Classify' || step.name.toLowerCase().includes('classify'))) {
          let resolvedClassification = null;
          if (Array.isArray(custom_fields)) {
            const classField = custom_fields.find(f => f.datakey === 'classification' || f.id === 'classification' || f.label?.toLowerCase() === 'classification');
            if (classField && classField.value) {
              resolvedClassification = String(classField.value).trim();
            }
          }
          if (!resolvedClassification) {
            const uCheck = await client.query('SELECT classification FROM order_units WHERE id = $1', [tu.id]);
            if (uCheck.rows.length > 0) {
              resolvedClassification = uCheck.rows[0].classification;
            }
          }

          if (resolvedClassification && resolvedClassification.toLowerCase() === 'standard' && newStatus === 'done') {
            const step2Res = await client.query(
              `SELECT id, status, notes FROM unit_steps 
               WHERE order_unit_id = $1 AND dept = 'Design' 
                 AND (name = 'Release Documents' OR name ILIKE '%release%') 
               LIMIT 1`,
              [tu.id]
            );
            if (step2Res.rows.length > 0) {
              const step2 = step2Res.rows[0];
              const autoNote = 'Auto-completed: Standard master drawings & BOM applied.';
              const finalNotes = step2.notes ? step2.notes : autoNote;
              await client.query(
                `UPDATE unit_steps 
                 SET status = 'done', notes = $1, updated = $2 
                 WHERE id = $3`,
                [finalNotes, updated, step2.id]
              );
              await client.query(
                `INSERT INTO activity_logs (user_id, order_id, dept, action_text) 
                 VALUES ($1, $2, 'Design', $3)`,
                [req.user.id, step.order_id, `Unit ${tu.short_serial}: Step "Release Documents" auto-completed (Standard Panel)`]
              );
            }
          } else if (resolvedClassification && resolvedClassification.toLowerCase() === 'non-standard') {
            // If classification changed to Non-Standard, revert auto-completed Release Documents step back to pending
            const step2Res = await client.query(
              `SELECT id, status, notes FROM unit_steps 
               WHERE order_unit_id = $1 AND dept = 'Design' 
                 AND (name = 'Release Documents' OR name ILIKE '%release%') 
               LIMIT 1`,
              [tu.id]
            );
            if (step2Res.rows.length > 0) {
              const step2 = step2Res.rows[0];
              const s2Docs = await client.query(
                `SELECT COUNT(*) as count FROM documents WHERE entity_type = 'UnitStep' AND entity_id = $1`,
                [step2.id]
              );
              const hasStepDocs = parseInt(s2Docs.rows[0]?.count || '0') > 0;
              if (step2.notes && step2.notes.includes('Standard master') && !hasStepDocs) {
                await client.query(
                  `UPDATE unit_steps 
                   SET status = 'pending', notes = 'Non-Standard classified: custom drawings and BOM required.', updated = $1 
                   WHERE id = $2`,
                  [updated, step2.id]
                );
                await client.query(
                  `INSERT INTO activity_logs (user_id, order_id, dept, action_text) 
                   VALUES ($1, $2, 'Design', $3)`,
                  [req.user.id, step.order_id, `Unit ${tu.short_serial}: Step "Release Documents" reverted to Pending (Non-Standard)`]
                );
              }
            }
          }
        }

        if (step.dept === 'QC' && newStatus === 'blocked') {
          const { qcFailTarget } = req.body;
          const target = qcFailTarget === 'design' ? 'Design' : 'Production';
          const remark = target === 'Design' ? 'Returned from QC — design re-check needed' : 'Returned from QC — rework required';

          await client.query(
            `UPDATE unit_steps 
             SET status = 'inprogress', notes = $1, updated = $2 
             WHERE order_unit_id = $3 AND dept = $4`,
            [remark, updated, tu.id, target]
          );

          await client.query(
            `INSERT INTO activity_logs (user_id, order_id, dept, action_text) 
             VALUES ($1, $2, 'QC', $3)`,
            [req.user.id, step.order_id, `QC FAIL → returned to ${target} for ${target === 'Design' ? 're-check' : 'rework'}`]
          );
        }

        await deriveUnitStatus(tu.id, client);
      }

      await updateOrderQCStatusFromSteps(step.order_id, client);
    }

    await client.query('COMMIT');
    res.json(lastResult || { success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to update unit step' });
  } finally {
    client.release();
  }
});


app.put('/api/units/:id/status', authorize(), async (req, res) => {
  if (await isUnitOnHold(req.params.id)) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE order_units SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Unit not found' });

    const lineItemId = result.rows[0].line_item_id;
    if (lineItemId) {
      await syncLineItemStatusFromUnits(lineItemId, pool);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update unit status' });
  }
});

app.put('/api/units/:id', authorize(['Admin', 'Manager', 'Design', 'Sales', 'Planning']), async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'Valid unit ID is required' });
  }
  if (await isUnitOnHold(id) && req.body.po_number === undefined && req.body.reference_number === undefined && req.body.tag === undefined) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const { panel_type_size, classification, custom_fields, po_number, tag, reference_number } = req.body;

  try {
    const numId = !isNaN(Number(id)) ? Number(id) : -1;
    const checkUnit = await pool.query(
      'SELECT id, order_id, line_item_id, unit_id FROM order_units WHERE id = $1 OR unit_id = $2',
      [numId, String(id)]
    );
    if (checkUnit.rows.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }
    const unit = checkUnit.rows[0];
    const realId = unit.id;

    const updates = [];
    const values = [];
    let idx = 1;

    // Admin/Manager update of Customer Reference Number on parent order (without touching serial numbers)
    if (reference_number !== undefined) {
      const cleanRef = (reference_number && typeof reference_number === 'string' && reference_number.trim()) ? reference_number.trim() : null;
      await pool.query('UPDATE orders SET reference_number = $1 WHERE id = $2', [cleanRef, unit.order_id]);
    }

    if (panel_type_size !== undefined) {
      updates.push(`panel_type_size = $${idx++}`);
      values.push(panel_type_size || null);

      // Also keep line item in sync if unit is linked to a line item
      if (unit.line_item_id) {
        await pool.query('UPDATE order_line_items SET panel_type_size = $1 WHERE id = $2', [panel_type_size || null, unit.line_item_id]);
      }
    }

    if (classification !== undefined) {
      updates.push(`classification = $${idx++}`);
      values.push(classification || 'Standard');
    }

    if (po_number !== undefined) {
      const cleanPo = (po_number && typeof po_number === 'string' && po_number.trim()) ? po_number.trim() : null;
      updates.push(`po_number = $${idx++}`);
      values.push(cleanPo);
      if (!cleanPo) {
        updates.push(`po_doc_id = $${idx++}`);
        values.push(null);
      }
    }

    // Admin/Manager update of Tag Number on unit and parent line item (without touching serial numbers)
    if (tag !== undefined) {
      const cleanTag = (tag && typeof tag === 'string' && tag.trim()) ? tag.trim() : null;
      updates.push(`tag = $${idx++}`);
      values.push(cleanTag);

      // Keep line item in sync if unit is linked to a line item
      if (unit.line_item_id) {
        await pool.query('UPDATE order_line_items SET tag = $1 WHERE id = $2', [cleanTag, unit.line_item_id]);
      }
    }

    if (custom_fields !== undefined) {
      updates.push(`custom_fields = $${idx++}`);
      values.push(typeof custom_fields === 'string' ? custom_fields : JSON.stringify(custom_fields));
    }

    if (updates.length === 0 && reference_number === undefined) {
      return res.json({ success: true, message: 'No changes provided' });
    }

    let updatedUnit;
    if (updates.length > 0) {
      values.push(realId);
      const result = await pool.query(
        `UPDATE order_units SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
        values
      );
      updatedUnit = result.rows[0];
    } else {
      const refreshedUnit = await pool.query('SELECT * FROM order_units WHERE id = $1', [realId]);
      updatedUnit = refreshedUnit.rows[0];
    }

    let logAction = `Updated unit ${unit.unit_id}`;
    if (panel_type_size !== undefined) logAction += ` panel size: "${panel_type_size}"`;
    if (classification !== undefined) logAction += ` classification: "${classification}"`;
    if (po_number !== undefined) logAction += ` po_number: "${po_number}"`;
    if (reference_number !== undefined) logAction += ` ref: "${reference_number}"`;
    if (tag !== undefined) logAction += ` tag: "${tag}"`;

    await pool.query(
      'INSERT INTO activity_logs (user_id, dept, action_text, order_id) VALUES ($1, $2, $3, $4)',
      [req.user.id, req.user.role, logAction, unit.order_id]
    );

    res.json({ success: true, unit: updatedUnit });
  } catch (err) {
    console.error('Failed to update unit:', err);
    res.status(500).json({ error: 'Failed to update unit' });
  }
});

app.put('/api/planning/line-items/:lineItemId/bulk-units-status', authorize(['Admin', 'Manager', 'Production']), async (req, res) => {
  if (await isLineItemOnHold(req.params.lineItemId)) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const { dept, status } = req.body;
  if (!dept || !status) return res.status(400).json({ error: 'dept and status are required' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Update all unit steps for this line item and department
    await client.query(
      `UPDATE unit_steps 
       SET status = $1, updated = $2
       WHERE order_unit_id IN (SELECT id FROM order_units WHERE line_item_id = $3) AND dept = $4`,
      [status, new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), req.params.lineItemId, dept]
    );

    // 2. Derive unit status for all units of this line item to propagate departments & statuses
    const unitsRes = await client.query(
      'SELECT id FROM order_units WHERE line_item_id = $1',
      [req.params.lineItemId]
    );
    for (const unit of unitsRes.rows) {
      await deriveUnitStatus(unit.id, client);
    }

    // 3. Update QC calculations for this order if the updated steps were in QC
    const checkLi = await client.query('SELECT order_id FROM order_line_items WHERE id = $1', [req.params.lineItemId]);
    if (checkLi.rows.length > 0) {
      await updateOrderQCStatusFromSteps(checkLi.rows[0].order_id, client);
      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, checkLi.rows[0].order_id, dept, `Bulk updated all unit steps in ${dept} to ${status}`]
      );
    }

    await client.query('COMMIT');
    res.json({ message: `Successfully updated all ${dept} steps to ${status} for this batch.` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to bulk update unit steps' });
  } finally {
    client.release();
  }
});

app.get('/api/dept-worklist/:dept', authorize(), async (req, res) => {
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
        COALESCE(ou.po_number, o.po_number) AS po_number,
        ou.po_number   AS unit_po_number,
        o.po_number    AS order_po_number,
        ou.po_doc_id,
        COALESCE(podoc.file_path, opodoc.file_path) AS po_file_path,
        COALESCE(podoc.file_name, opodoc.file_name) AS po_file_name,
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
        oli.quantity   AS batch_qty,
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
          WHERE us.order_unit_id = ou.id AND us.dept = (CASE WHEN $1 = 'Sales' THEN ou.current_dept ELSE $1 END)
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
        ) AS order_done_step_count
      FROM order_units ou
      JOIN orders o         ON ou.order_id = o.id
      JOIN order_line_items oli ON ou.line_item_id = oli.id
      LEFT JOIN company_locations cl ON o.company_location_id = cl.id
      LEFT JOIN companies co ON cl.company_id = co.id
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
      WHERE $1 = 'Sales' 
         OR ou.current_dept = $1 
         OR ou.hold_status IN ('Hold', 'Cancelled')
         OR ou.status = 'Cancelled'
         OR ou.status ILIKE 'hold%'
         OR o.hold_status = 'Approved'
         OR o.status = 'Cancelled'
         OR o.status ILIKE 'hold%'
         OR ($1 = 'Design' AND EXISTS (SELECT 1 FROM unit_steps us WHERE us.order_unit_id = ou.id AND us.dept = 'Design' AND (us.status = 'done' OR us.status = 'completed')))
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
      ORDER BY o.priority DESC, o.delivery_date ASC NULLS LAST, ou.unit_id ASC
    `, [dept]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dept worklist' });
  }
});

// Masters API
app.get('/api/companies', authorize(), async (req, res) => {
  try {
    const companies = await pool.query('SELECT * FROM companies ORDER BY name ASC');
    const locations = await pool.query('SELECT * FROM company_locations');
    
    const result = companies.rows.map(comp => ({
      ...comp,
      locations: locations.rows.filter(l => l.company_id === comp.id)
    }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

app.post('/api/companies', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  const { name, gst_number, locations } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cleanGst = (typeof gst_number === 'string' && gst_number.trim()) ? gst_number.trim() : null;
    const compRes = await client.query(
      'INSERT INTO companies (name, gst_number) VALUES ($1, $2) RETURNING *', 
      [name ? name.trim() : '', cleanGst]
    );
    const company = compRes.rows[0];
    const savedLocations = [];
    
    if (locations && locations.length > 0) {
      for (const loc of locations) {
        if (!loc.city || !loc.city.trim()) continue;
        const locRes = await client.query(
          `INSERT INTO company_locations (company_id, address, city, person_in_charge, contact_number, email) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [company.id, loc.address || null, loc.city.trim(), loc.person_in_charge || null, loc.contact_number || null, loc.email || null]
        );
        savedLocations.push(locRes.rows[0]);
      }
    }
    await client.query('COMMIT');
    res.status(201).json({ ...company, locations: savedLocations });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create company: ' + (err.message || err) });
  } finally {
    client.release();
  }
});

app.put('/api/companies/:id', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
  const { name, gst_number, locations } = req.body;
  const companyId = req.params.id;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const cleanGst = (typeof gst_number === 'string' && gst_number.trim()) ? gst_number.trim() : null;
    const compRes = await client.query(
      `UPDATE companies 
       SET name = COALESCE($1, name), 
           gst_number = $2 
       WHERE id = $3 
       RETURNING *`,
      [name ? name.trim() : null, cleanGst, companyId]
    );
    if (compRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Company not found' });
    }
    const company = compRes.rows[0];

    if (locations && Array.isArray(locations)) {
      const existingLocs = await client.query('SELECT id FROM company_locations WHERE company_id = $1', [companyId]);
      const incomingIds = locations.map(l => l.id).filter(Boolean);

      for (const ex of existingLocs.rows) {
        if (!incomingIds.includes(ex.id)) {
          const orderRef = await client.query('SELECT id FROM orders WHERE company_location_id = $1 LIMIT 1', [ex.id]);
          if (orderRef.rows.length === 0) {
            await client.query('DELETE FROM company_locations WHERE id = $1', [ex.id]);
          }
        }
      }

      const savedLocations = [];
      for (const loc of locations) {
        if (!loc.city || !loc.city.trim()) continue;
        if (loc.id) {
          const locRes = await client.query(
            `UPDATE company_locations 
             SET address = $1, city = $2, person_in_charge = $3, contact_number = $4, email = $5 
             WHERE id = $6 AND company_id = $7 
             RETURNING *`,
            [loc.address || null, loc.city.trim(), loc.person_in_charge || null, loc.contact_number || null, loc.email || null, loc.id, companyId]
          );
          if (locRes.rows.length > 0) {
            savedLocations.push(locRes.rows[0]);
          }
        } else {
          const locRes = await client.query(
            `INSERT INTO company_locations (company_id, address, city, person_in_charge, contact_number, email) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [companyId, loc.address || null, loc.city.trim(), loc.person_in_charge || null, loc.contact_number || null, loc.email || null]
          );
          savedLocations.push(locRes.rows[0]);
        }
      }
      company.locations = savedLocations;
    } else {
      const locRes = await client.query('SELECT * FROM company_locations WHERE company_id = $1', [companyId]);
      company.locations = locRes.rows;
    }

    await client.query('COMMIT');
    res.json(company);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Failed to update company:', err);
    res.status(500).json({ error: 'Failed to update company: ' + (err.message || err) });
  } finally {
    client.release();
  }
});

app.post('/api/documents/upload', authorize(), upload.array('files', 20), async (req, res) => {
  const { entity_type, entity_id, doc_type } = req.body;
  try {
    if (entity_type === 'Order') {
      if (await isOrderOnHold(entity_id)) {
        return res.status(400).json({ error: 'Order is currently on hold. Document uploads are disabled.' });
      }
    } else if (entity_type === 'Unit') {
      if (await isUnitOnHold(entity_id)) {
        return res.status(400).json({ error: 'Order is currently on hold. Document uploads are disabled.' });
      }
    }
    if (doc_type === 'PO') {
      const isSalesOrAccounts = ['Sales', 'Accounts', 'Admin', 'Manager'].includes(req.user.role);
      if (!isSalesOrAccounts) {
        return res.status(403).json({ error: 'Forbidden: Only Sales and Accounts roles can upload PO documents.' });
      }
    }
    if (doc_type === 'PO' || doc_type === 'Quotation') {
      if (req.files.length > 1) {
        return res.status(400).json({ error: `${doc_type} can only be a single file.` });
      }
      const existing = await pool.query(
        'SELECT id FROM documents WHERE entity_type = $1 AND entity_id = $2 AND doc_type = $3 LIMIT 1',
        [entity_type, entity_id, doc_type]
      );
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: `A ${doc_type} already exists. Delete it first.` });
      }
    }

    const savedDocs = [];
    let hasPO = false;
    let orderIdForLog = null;
    if (entity_type === 'Order') {
      orderIdForLog = entity_id;
    } else if (entity_type === 'Unit') {
      const unitRes = await pool.query('SELECT order_id FROM order_units WHERE id = $1', [entity_id]);
      orderIdForLog = unitRes.rows[0]?.order_id || null;
    }

    for (const file of req.files) {
      const result = await pool.query(
        `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [entity_type, entity_id, doc_type || 'General', file.originalname, file.path, file.size, file.mimetype, req.user.id]
      );
      savedDocs.push(result.rows[0]);
      if (doc_type === 'PO') {
        hasPO = true;
      }
      await pool.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, orderIdForLog, req.user.role, `Uploaded document "${file.originalname}" (${doc_type || 'General'})`]
      );
    }

    if (hasPO && entity_type === 'Order') {
      const poNum = req.body.po_number;
      if (poNum && poNum.trim()) {
        await pool.query('UPDATE orders SET po_number = $1 WHERE id = $2', [poNum.trim(), entity_id]);
      } else if (req.files && req.files.length > 0) {
        const defaultName = req.files[0].originalname.replace(/\.[^/.]+$/, '').trim();
        await pool.query(
          `UPDATE orders SET po_number = $1 WHERE id = $2 AND (po_number IS NULL OR po_number = '')`,
          [defaultName, entity_id]
        );
      }

      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      await pool.query(
        `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
        ['PO uploaded via Documents.', updatedStr, entity_id]
      );
      await pool.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, entity_id, 'Sales', 'Completed: Upload PO (System Auto-Check on Upload)']
      );
      const uRes = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [entity_id]);
      for (const u of uRes.rows) {
        try {
          await deriveUnitStatus(u.id, pool);
        } catch (dErr) {
          console.warn('deriveUnitStatus warn in upload doc PO:', dErr);
        }
      }
    }
    res.status(201).json(savedDocs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload documents' });
  }
});

app.post('/api/units/batch-po', authorize(['Sales', 'Accounts', 'Admin', 'Manager']), upload.single('file'), async (req, res) => {
  const { po_number } = req.body;
  let unit_ids = req.body.unit_ids;

  if (!po_number || !po_number.trim()) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(400).json({ error: 'PO Number is required.' });
  }

  if (!unit_ids) {
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    return res.status(400).json({ error: 'At least one serial number must be selected.' });
  }

  try {
    if (typeof unit_ids === 'string') {
      try {
        unit_ids = JSON.parse(unit_ids);
      } catch (e) {
        unit_ids = unit_ids.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
      }
    }
    if (!Array.isArray(unit_ids) || unit_ids.length === 0) {
      if (req.file && fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({ error: 'Invalid or empty unit_ids array.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'PO PDF file is required.' });
    }

    const isPdf = req.file.mimetype === 'application/pdf' || req.file.originalname.toLowerCase().endsWith('.pdf');
    if (!isPdf) {
      if (fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(400).json({ error: 'Only PDF files are allowed for PO document upload.' });
    }

    // Verify units exist
    const unitRes = await pool.query(
      'SELECT ou.id, ou.order_id, ou.unit_id FROM order_units ou WHERE ou.id = ANY($1::int[])',
      [unit_ids]
    );

    if (unitRes.rows.length === 0) {
      if (fs.existsSync(req.file.path)) {
        try { fs.unlinkSync(req.file.path); } catch (e) {}
      }
      return res.status(404).json({ error: 'No matching units found.' });
    }

    const firstUnit = unitRes.rows[0];
    const cleanPo = po_number.trim();

    // 1. Insert into documents table (linked to the first unit or entity_type = 'Unit')
    const docRes = await pool.query(
      `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      ['Unit', firstUnit.id, 'PO', req.file.originalname, req.file.path, req.file.size, req.file.mimetype, req.user.id]
    );
    const savedDoc = docRes.rows[0];

    // 2. Update order_units table for all selected unit IDs
    await pool.query(
      `UPDATE order_units
       SET po_number = $1, po_doc_id = $2
       WHERE id = ANY($3::int[])`,
      [cleanPo, savedDoc.id, unit_ids]
    );

    // 3. Update orders table po_number if not already set AND all units in this order are included
    const orderIds = [...new Set(unitRes.rows.map(u => u.order_id).filter(Boolean))];
    if (orderIds.length > 0) {
      for (const ordId of orderIds) {
        const totalUnitsRes = await pool.query('SELECT COUNT(*) as total FROM order_units WHERE order_id = $1', [ordId]);
        const totalUnits = parseInt(totalUnitsRes.rows[0]?.total || 0);
        const selectedUnitsInOrder = unitRes.rows.filter(u => u.order_id === ordId).length;

        // Only update order-level PO if all units of this order are included
        if (selectedUnitsInOrder >= totalUnits) {
          await pool.query(
            `UPDATE orders SET po_number = $1 WHERE id = $2 AND (po_number IS NULL OR po_number = '')`,
            [cleanPo, ordId]
          );

          // Ensure Order-level document entry exists so order documents list shows PO copy
          const checkOrdDoc = await pool.query("SELECT id FROM documents WHERE entity_type = 'Order' AND entity_id = $1 AND doc_type = 'PO' LIMIT 1", [ordId]);
          if (checkOrdDoc.rows.length === 0) {
            await pool.query(
              `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by)
               VALUES ('Order', $1, 'PO', $2, $3, $4, $5, $6)`,
              [ordId, req.file.originalname, req.file.path, req.file.size, req.file.mimetype, req.user.id]
            );
          }
        }

        // Auto-resolve 'Upload PO' milestone in order_steps
        const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        await pool.query(
          `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
          [`PO #${cleanPo} uploaded.`, updatedStr, ordId]
        );
      }
    }

    // 4. Re-derive unit status for all affected units so they transition out of Sales gating
    for (const uId of unit_ids) {
      try {
        await deriveUnitStatus(uId, pool);
      } catch (dErr) {
        console.warn('deriveUnitStatus warn in batch-po:', dErr);
      }
    }

    // 5. Activity log for affected orders
    const serialList = unitRes.rows.map(u => u.unit_id).join(', ');
    for (const ordId of orderIds) {
      await pool.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, ordId, 'Sales', `Attached PO #${cleanPo} (${req.file.originalname}) to serials: ${serialList}`]
      );
    }

    res.status(200).json({
      success: true,
      message: `PO #${cleanPo} attached to ${unitRes.rows.length} serials.`,
      po_number: cleanPo,
      po_doc_id: savedDoc.id,
      po_file_path: savedDoc.file_path,
      po_file_name: savedDoc.file_name,
      updated_unit_ids: unit_ids
    });
  } catch (err) {
    console.error('Error in batch-po upload:', err);
    if (req.file && fs.existsSync(req.file.path)) {
      try { fs.unlinkSync(req.file.path); } catch (e) {}
    }
    res.status(500).json({ error: 'Failed to upload PO for selected serials: ' + (err.message || err) });
  }
});

app.get('/api/documents/directory', authorize(), async (req, res) => {
  try {
    const ordersRes = await pool.query(`
      SELECT 
        o.id, 
        o.order_number, 
        o.po_number, 
        o.order_date,
        o.delivery_date,
        o.end_client_name,
        c.name AS company_name
      FROM orders o
      LEFT JOIN company_locations cl ON o.company_location_id = cl.id
      LEFT JOIN companies c ON cl.company_id = c.id
      ORDER BY o.created_at DESC
    `);
    
    const docsRes = await pool.query(`
      SELECT 
        d.id,
        d.entity_type,
        d.entity_id,
        d.doc_type,
        d.file_name,
        d.file_path,
        d.file_size,
        d.mime_type,
        d.uploaded_at,
        u.username AS uploader_username,
        u.role AS uploader_role,
        COALESCE(
          CASE WHEN d.entity_type = 'Order' THEN d.entity_id END,
          CASE WHEN d.entity_type = 'Unit' THEN (SELECT order_id FROM order_units WHERE id = d.entity_id) END,
          CASE WHEN d.entity_type = 'Step' THEN (
            COALESCE(
              (SELECT order_id FROM order_steps WHERE id = d.entity_id),
              (SELECT ou.order_id FROM unit_steps us JOIN order_units ou ON us.order_unit_id = ou.id WHERE us.id = d.entity_id)
            )
          ) END
        ) AS order_id,
        CASE 
          WHEN d.entity_type = 'Unit' THEN (SELECT unit_id FROM order_units WHERE id = d.entity_id)
          WHEN d.entity_type = 'Step' THEN (
            COALESCE(
              (SELECT 'Order Step: ' || name FROM order_steps WHERE id = d.entity_id),
              (SELECT 'Unit Step (' || ou.unit_id || '): ' || us.name FROM unit_steps us JOIN order_units ou ON us.order_unit_id = ou.id WHERE us.id = d.entity_id)
            )
          )
          ELSE 'Order Level'
        END AS source_details
      FROM documents d
      LEFT JOIN users u ON d.uploaded_by = u.id
      ORDER BY d.uploaded_at DESC
    `);

    let docs = docsRes.rows;
    const isSalesOrAccounts = ['Sales', 'Accounts', 'Admin', 'Manager'].includes(req.user.role);
    if (!isSalesOrAccounts) {
      docs = docs.filter(d => d.doc_type !== 'PO');
    }

    res.json({
      orders: ordersRes.rows,
      documents: docs
    });
  } catch (err) {
    console.error('Error fetching document directory:', err);
    res.status(500).json({ error: 'Failed to fetch document directory' });
  }
});

app.get('/api/documents/:entityType/:entityId', authorize(), async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM documents WHERE entity_type = $1 AND entity_id = $2 ORDER BY uploaded_at DESC',
      [req.params.entityType, req.params.entityId]
    );
    let docs = result.rows;
    const isSalesOrAccounts = ['Sales', 'Accounts', 'Admin', 'Manager'].includes(req.user.role);
    if (!isSalesOrAccounts) {
      docs = docs.filter(d => d.doc_type !== 'PO');
    }
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// Reference documents for a unit (Part Number Master Drawings & BOM + Order Attachments)
app.get('/api/units/:unitId/reference-documents', authorize(), async (req, res) => {
  try {
    const { unitId } = req.params;
    const unitRes = await pool.query(
      `SELECT ou.id, ou.order_id, ou.short_serial, ou.unit_id, ou.classification,
              oli.part_number, oli.material_description,
              o.order_number, o.po_number
       FROM order_units ou
       LEFT JOIN order_line_items oli ON ou.line_item_id = oli.id
       LEFT JOIN orders o ON ou.order_id = o.id
       WHERE ou.id = $1`,
      [unitId]
    );

    if (unitRes.rows.length === 0) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    const unit = unitRes.rows[0];
    let masterPart = null;
    let masterDocs = [];

    if (unit.part_number && unit.part_number.trim()) {
      const partRes = await pool.query(
        `SELECT id, part_number, client_name, project, description, category, panel_code
         FROM part_number_masters
         WHERE LOWER(TRIM(part_number)) = LOWER(TRIM($1)) LIMIT 1`,
        [unit.part_number.trim()]
      );

      if (partRes.rows.length > 0) {
        masterPart = partRes.rows[0];
        const pDocsRes = await pool.query(
          `SELECT d.id, d.part_number_id, d.doc_type, d.revision_number, d.revision_label,
                  d.file_name, d.file_path, d.file_size, d.is_current, d.uploaded_at,
                  COALESCE(d.uploaded_by_name, u.username, 'System') as uploaded_by_name
           FROM part_number_documents d
           LEFT JOIN users u ON d.uploaded_by_id = u.id
           WHERE d.part_number_id = $1
           ORDER BY d.is_current DESC, d.revision_number DESC, d.id DESC`,
          [masterPart.id]
        );
        masterDocs = pDocsRes.rows;
      }
    }

    // Fetch order-level and unit-level documents
    const docsRes = await pool.query(
      `SELECT id, entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_at
       FROM documents
       WHERE (entity_type = 'Order' AND entity_id = $1)
          OR (entity_type = 'Unit' AND entity_id = $2)
       ORDER BY uploaded_at DESC`,
      [unit.order_id, unit.id]
    );

    let orderDocs = docsRes.rows;
    const isSalesOrAccounts = ['Sales', 'Accounts', 'Admin', 'Manager'].includes(req.user.role);
    if (!isSalesOrAccounts) {
      orderDocs = orderDocs.filter(d => d.doc_type !== 'PO');
    }

    res.json({
      unit_id: unit.unit_id,
      short_serial: unit.short_serial,
      part_number: unit.part_number,
      material_description: unit.material_description,
      classification: unit.classification,
      order_number: unit.order_number,
      master_part: masterPart,
      master_documents: masterDocs,
      order_documents: orderDocs
    });
  } catch (err) {
    console.error('Error fetching reference documents:', err);
    res.status(500).json({ error: 'Failed to fetch reference documents' });
  }
});

app.delete('/api/documents/:id', authorize(), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' });
    
    const doc = result.rows[0];
    
    // Only allow the uploader, Admin, Manager, Design, Sales, or Accounts to delete
    if (doc.uploaded_by !== req.user.id && !['Admin', 'Manager', 'Design', 'Sales', 'Accounts'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete the file from the filesystem if it exists
    if (fs.existsSync(doc.file_path)) {
      fs.unlinkSync(doc.file_path);
    }
    
    await pool.query('DELETE FROM documents WHERE id = $1', [req.params.id]);

    let orderIdForLog = null;
    if (doc.entity_type === 'Order') {
      orderIdForLog = doc.entity_id;
    } else if (doc.entity_type === 'Unit') {
      const unitRes = await pool.query('SELECT order_id FROM order_units WHERE id = $1', [doc.entity_id]);
      orderIdForLog = unitRes.rows[0]?.order_id || null;
    }

    await pool.query(
      `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
      [req.user.id, orderIdForLog, req.user.role, `Deleted document "${doc.file_name}"`]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

app.get('/api/task_masters', authorize(), async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM task_masters 
      ORDER BY 
        CASE dept
          WHEN 'Sales' THEN 1
          WHEN 'Design' THEN 2
          WHEN 'Purchase' THEN 3
          WHEN 'Stores' THEN 4
          WHEN 'Production' THEN 5
          WHEN 'QC' THEN 6
          WHEN 'Dispatch' THEN 7
          WHEN 'Accounts' THEN 8
          ELSE 9
        END ASC,
        id ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch task masters' });
  }
});

app.post('/api/task_masters', authorize(['Admin']), async (req, res) => {
  const { dept, name, sub, special, is_mandatory, requires_upload, default_doc_type, custom_fields, order_fields } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO task_masters (dept, name, sub, special, is_mandatory, requires_upload, default_doc_type, custom_fields, order_fields) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [dept, name, sub, special || null, is_mandatory !== false, requires_upload === true, default_doc_type || 'General', JSON.stringify(custom_fields || []), JSON.stringify(order_fields || [])]
    );
    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
      [req.user.id, `Created task master "${result.rows[0].name}" for department "${result.rows[0].dept}"`]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task master' });
  }
});

app.put('/api/task_masters/:id', authorize(['Admin']), async (req, res) => {
  const { dept, name, sub, special, is_mandatory, requires_upload, default_doc_type, custom_fields, order_fields } = req.body;
  try {
    const result = await pool.query(
      `UPDATE task_masters SET dept = $1, name = $2, sub = $3, special = $4, is_mandatory = $5, requires_upload = $6, default_doc_type = $7, custom_fields = $8, order_fields = $9
       WHERE id = $10 RETURNING *`,
      [dept, name, sub, special || null, is_mandatory !== false, requires_upload === true, default_doc_type || 'General', JSON.stringify(custom_fields || []), JSON.stringify(order_fields || []), req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });

    // Sync updated properties to existing order_steps and unit_steps
    await pool.query(
      `UPDATE order_steps 
       SET dept = $1, name = $2, sub = $3, special = $4, requires_upload = $5, default_doc_type = $6 
       WHERE task_id = $7`,
      [dept, name, sub, special || null, requires_upload === true, default_doc_type || 'General', req.params.id]
    );

    await pool.query(
      `UPDATE unit_steps 
       SET dept = $1, name = $2, sub = $3, requires_upload = $4, default_doc_type = $5 
       WHERE task_id = $6`,
      [dept, name, sub, requires_upload === true, default_doc_type || 'General', req.params.id]
    );

    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
      [req.user.id, `Updated task master "${result.rows[0].name}" (Department: ${result.rows[0].dept})`]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task master' });
  }
});

app.delete('/api/task_masters/:id', authorize(['Admin']), async (req, res) => {
  try {
    // Delete step instances linked to this task master from active flows
    await pool.query('DELETE FROM order_steps WHERE task_id = $1', [req.params.id]);
    await pool.query('DELETE FROM unit_steps WHERE task_id = $1', [req.params.id]);

    const result = await pool.query('DELETE FROM task_masters WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });

    // Clean up orphaned steps whose master task was deleted previously
    await pool.query('DELETE FROM order_steps WHERE task_id IS NULL');
    await pool.query('DELETE FROM unit_steps WHERE task_id IS NULL');

    // Re-derive unit status for all units
    const units = await pool.query('SELECT id FROM order_units');
    for (const u of units.rows) {
      await deriveUnitStatus(u.id, pool);
    }

    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
      [req.user.id, `Deleted task master "${result.rows[0].name}" (Department: ${result.rows[0].dept})`]
    );
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task master' });
  }
});

// ── Column Masters & Department Column Visibility Endpoints ──────────

app.get('/api/column-masters', authorize(), async (req, res) => {
  try {
    const colsResult = await pool.query('SELECT * FROM column_masters ORDER BY sort_order ASC, id ASC');
    const visResult = await pool.query('SELECT * FROM department_column_visibility');
    
    // Group visibility by department
    const visibilityByDept = {};
    for (const v of visResult.rows) {
      if (!visibilityByDept[v.dept]) visibilityByDept[v.dept] = {};
      visibilityByDept[v.dept][v.col_key] = v.is_visible;
    }

    res.json({
      columns: colsResult.rows,
      visibilityByDept
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch column masters' });
  }
});

app.post('/api/column-masters', authorize(['Admin']), async (req, res) => {
  try {
    const { label, col_key, category, field_type } = req.body;
    if (!label || !col_key) {
      return res.status(400).json({ error: 'Label and Column Key are required' });
    }

    const cleanKey = col_key.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
    
    // Get max sort_order
    const maxOrderRes = await pool.query('SELECT MAX(sort_order) as max_order FROM column_masters');
    const nextOrder = (maxOrderRes.rows[0]?.max_order || 0) + 1;

    const result = await pool.query(
      `INSERT INTO column_masters (col_key, label, category, field_type, is_system, sort_order)
       VALUES ($1, $2, $3, $4, false, $5) RETURNING *`,
      [cleanKey, label.trim(), category || 'Custom', field_type || 'Text', nextOrder]
    );

    const newCol = result.rows[0];

    // Seed default visibility (true) for all departments
    const depts = ['Sales', 'Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Planning'];
    for (const d of depts) {
      await pool.query(
        `INSERT INTO department_column_visibility (dept, col_key, is_visible) VALUES ($1, $2, true) ON CONFLICT DO NOTHING`,
        [d, cleanKey]
      );
    }

    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
      [req.user.id, `Added custom column master "${label}" (${cleanKey})`]
    );

    res.status(201).json(newCol);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Column Key already exists' });
    }
    res.status(500).json({ error: 'Failed to create column master' });
  }
});

app.put('/api/column-masters/:id', authorize(['Admin']), async (req, res) => {
  try {
    const { label, category, field_type, sort_order } = req.body;
    const result = await pool.query(
      `UPDATE column_masters
       SET label = COALESCE($1, label),
           category = COALESCE($2, category),
           field_type = COALESCE($3, field_type),
           sort_order = COALESCE($4, sort_order)
       WHERE id = $5 RETURNING *`,
      [label, category, field_type, sort_order, req.params.id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Column master not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update column master' });
  }
});

app.delete('/api/column-masters/:id', authorize(['Admin']), async (req, res) => {
  try {
    const colCheck = await pool.query('SELECT * FROM column_masters WHERE id = $1', [req.params.id]);
    if (colCheck.rows.length === 0) return res.status(404).json({ error: 'Column master not found' });
    if (colCheck.rows[0].is_system) {
      return res.status(400).json({ error: 'System columns cannot be deleted. You can hide them in department visibility settings.' });
    }

    const deleted = await pool.query('DELETE FROM column_masters WHERE id = $1 RETURNING *', [req.params.id]);
    
    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
      [req.user.id, `Deleted custom column master "${deleted.rows[0].label}"`]
    );

    res.json(deleted.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete column master' });
  }
});

app.post('/api/column-masters/visibility', authorize(['Admin', 'Manager']), async (req, res) => {
  try {
    const { visibilityByDept } = req.body;
    if (!visibilityByDept || typeof visibilityByDept !== 'object') {
      return res.status(400).json({ error: 'Invalid visibility payload' });
    }

    for (const [dept, cols] of Object.entries(visibilityByDept)) {
      for (const [col_key, is_visible] of Object.entries(cols)) {
        await pool.query(
          `INSERT INTO department_column_visibility (dept, col_key, is_visible)
           VALUES ($1, $2, $3)
           ON CONFLICT (dept, col_key) DO UPDATE SET is_visible = $3`,
          [dept, col_key, !!is_visible]
        );
      }
    }

    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
      [req.user.id, `Updated department column visibility matrix`]
    );

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save column visibility' });
  }
});

// ── Part Number Masters Endpoints ─────────────────────────────────────────────
app.get('/api/part-number-masters', authorize(), async (req, res) => {
  try {
    const mastersRes = await pool.query('SELECT * FROM part_number_masters ORDER BY part_number ASC');
    const docsRes = await pool.query(`
      SELECT d.*, u.username as uploader_username, u.email as uploader_email
      FROM part_number_documents d
      LEFT JOIN users u ON d.uploaded_by_id = u.id
      ORDER BY d.revision_number ASC, d.uploaded_at ASC
    `);

    const docsByPart = {};
    for (const doc of docsRes.rows) {
      if (!docsByPart[doc.part_number_id]) docsByPart[doc.part_number_id] = [];
      const normalizedDoc = {
        ...doc,
        uploaded_by_name: doc.uploaded_by_name || doc.uploader_username || 'User',
        doc_type: (doc.doc_type || 'Drawing').trim()
      };
      docsByPart[doc.part_number_id].push(normalizedDoc);
    }

    const masters = mastersRes.rows.map(m => {
      const allDocs = docsByPart[m.id] || [];
      const drawings = allDocs.filter(d => (d.doc_type || 'Drawing').toLowerCase() === 'drawing');
      const boms = allDocs.filter(d => (d.doc_type || '').toLowerCase() === 'bom');

      const currentDrawing = drawings.find(d => d.is_current) || (drawings.length > 0 ? drawings[drawings.length - 1] : null);
      const currentBOM = boms.find(d => d.is_current) || (boms.length > 0 ? boms[boms.length - 1] : null);

      return {
        ...m,
        client_name: m.client_name || '',
        project: m.project || '',
        panel_code: m.panel_code || '',
        drawing: currentDrawing,
        bom: currentBOM,
        drawing_history: [...drawings].reverse(),
        bom_history: [...boms].reverse(),
        documents: allDocs
      };
    });

    res.json(masters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Part Number Masters' });
  }
});

app.post('/api/part-number-masters', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  try {
    const { part_number, client_name, project, description, category, panel_code } = req.body;
    if (!part_number || !part_number.trim()) {
      return res.status(400).json({ error: 'Part Number is required' });
    }

    const check = await pool.query('SELECT id FROM part_number_masters WHERE LOWER(part_number) = LOWER($1)', [part_number.trim()]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: `Part Number "${part_number.trim()}" already exists` });
    }

    const newPart = await pool.query(
      `INSERT INTO part_number_masters (part_number, client_name, project, description, category, panel_code)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [part_number.trim(), (client_name || '').trim(), (project || '').trim(), (description || '').trim(), category || 'Standard', (panel_code || '').trim() || null]
    );

    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, $2, $3)`,
      [req.user.id, req.user.role, `Created Part Number Master "${part_number.trim()}"`]
    );

    res.status(201).json({
      ...newPart.rows[0],
      client_name: newPart.rows[0].client_name || '',
      project: newPart.rows[0].project || '',
      panel_code: newPart.rows[0].panel_code || '',
      drawing: null,
      bom: null,
      drawing_history: [],
      bom_history: [],
      documents: []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create Part Number Master' });
  }
});

app.put('/api/part-number-masters/:id', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  try {
    const { part_number, client_name, project, description, category, panel_code } = req.body;
    if (!part_number || !part_number.trim()) {
      return res.status(400).json({ error: 'Part Number is required' });
    }

    const check = await pool.query('SELECT id FROM part_number_masters WHERE LOWER(part_number) = LOWER($1) AND id != $2', [part_number.trim(), req.params.id]);
    if (check.rows.length > 0) {
      return res.status(400).json({ error: `Part Number "${part_number.trim()}" already exists` });
    }

    const updated = await pool.query(
      `UPDATE part_number_masters
       SET part_number = $1, client_name = $2, project = $3, description = $4, category = $5, panel_code = $6
       WHERE id = $7 RETURNING *`,
      [part_number.trim(), (client_name || '').trim(), (project || '').trim(), (description || '').trim(), category || 'Standard', (panel_code || '').trim() || null, req.params.id]
    );

    if (updated.rows.length === 0) return res.status(404).json({ error: 'Part Number Master not found' });
    res.json({
      ...updated.rows[0],
      client_name: updated.rows[0].client_name || '',
      project: updated.rows[0].project || '',
      panel_code: updated.rows[0].panel_code || ''
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update Part Number Master' });
  }
});

app.delete('/api/part-number-masters/:id', authorize(['Admin', 'Manager', 'Design']), async (req, res) => {
  try {
    const deleted = await pool.query('DELETE FROM part_number_masters WHERE id = $1 RETURNING *', [req.params.id]);
    if (deleted.rows.length === 0) return res.status(404).json({ error: 'Part Number Master not found' });
    
    await pool.query(
      `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, 'Admin', $2)`,
      [req.user.id, `Deleted Part Number Master "${deleted.rows[0].part_number}"`]
    );

    res.json(deleted.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete Part Number Master' });
  }
});

// ── PANEL SIZE MASTERS API ──
app.get('/api/panel-size-masters', authorize(['Admin', 'Manager', 'Design', 'Sales', 'Production', 'Planning', 'Viewer']), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM panel_size_masters ORDER BY id ASC');
    const rows = result.rows.map(r => ({
      ...r,
      panel_size: r.panel_size || r.size_name || '',
      comments: r.comments || r.description || ''
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch Panel Size Masters' });
  }
});

app.post('/api/panel-size-masters', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  const { panel_code, panel_size, size_name, ip_rating, comments, description } = req.body;
  const finalSize = (panel_size || size_name || '').trim();
  if (!finalSize) {
    return res.status(400).json({ error: 'Panel size is required' });
  }
  const finalCode = (panel_code || '').trim();
  const finalIp = (ip_rating || '').trim();
  const finalComments = (comments || description || '').trim();

  try {
    const result = await pool.query(
      `INSERT INTO panel_size_masters (panel_code, panel_size, size_name, ip_rating, comments, description) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [finalCode, finalSize, finalSize, finalIp, finalComments, finalComments]
    );
    const row = result.rows[0];
    res.json({
      ...row,
      panel_size: row.panel_size || row.size_name,
      comments: row.comments || row.description
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Panel size already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to create Panel Size Master' });
  }
});

app.put('/api/panel-size-masters/:id', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  const { panel_code, panel_size, size_name, ip_rating, comments, description } = req.body;
  const finalSize = (panel_size || size_name || '').trim();
  if (!finalSize) {
    return res.status(400).json({ error: 'Panel size is required' });
  }
  const finalCode = (panel_code || '').trim();
  const finalIp = (ip_rating || '').trim();
  const finalComments = (comments || description || '').trim();

  try {
    const result = await pool.query(
      `UPDATE panel_size_masters 
       SET panel_code = $1, panel_size = $2, size_name = $3, ip_rating = $4, comments = $5, description = $6 
       WHERE id = $7 RETURNING *`,
      [finalCode, finalSize, finalSize, finalIp, finalComments, finalComments, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Panel Size Master not found' });
    const row = result.rows[0];
    res.json({
      ...row,
      panel_size: row.panel_size || row.size_name,
      comments: row.comments || row.description
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update Panel Size Master' });
  }
});

app.delete('/api/panel-size-masters/:id', authorize(['Admin', 'Manager', 'Design']), async (req, res) => {
  try {
    const deleted = await pool.query('DELETE FROM panel_size_masters WHERE id = $1 RETURNING *', [req.params.id]);
    if (deleted.rows.length === 0) return res.status(404).json({ error: 'Panel Size Master not found' });
    res.json(deleted.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete Panel Size Master' });
  }
});

app.post('/api/part-number-masters/:id/documents', authorize(['Admin', 'Manager', 'Design', 'Sales']), upload.any(), async (req, res) => {
  try {
    const partId = req.params.id;
    const partCheck = await pool.query('SELECT * FROM part_number_masters WHERE id = $1', [partId]);
    if (partCheck.rows.length === 0) return res.status(404).json({ error: 'Part Number Master not found' });

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Determine target doc_type: 'Drawing' or 'BOM'
    let targetDocType = 'Drawing';
    if (req.body.doc_type && String(req.body.doc_type).trim().toUpperCase() === 'BOM') {
      targetDocType = 'BOM';
    }

    // Validate file extensions: Drawing must be PDF; BOM can be Excel or PDF
    for (const file of files) {
      const ext = path.extname(file.originalname).toLowerCase();
      if (targetDocType === 'BOM') {
        const allowedBOMExts = ['.pdf', '.xlsx', '.xls', '.csv'];
        if (!allowedBOMExts.includes(ext)) {
          // Cleanup uploaded files
          try { fs.unlinkSync(file.path); } catch (e) {}
          return res.status(400).json({ error: 'For BOM, only Excel (.xlsx, .xls, .csv) and PDF files are allowed.' });
        }
      } else {
        const isPdfExt = ext === '.pdf';
        if (!isPdfExt) {
          // Cleanup uploaded files
          try { fs.unlinkSync(file.path); } catch (e) {}
          return res.status(400).json({ error: 'Only PDF files are allowed for Drawings.' });
        }
      }
    }

    const insertedDocs = [];
    for (const file of files) {
      const relPath = path.relative(path.join(__dirname, 'uploads'), file.path);
      
      // Revision calculation: deterministic & backend-controlled
      const maxRevRes = await pool.query(
        `SELECT COALESCE(MAX(revision_number), -1) AS max_rev 
         FROM part_number_documents 
         WHERE part_number_id = $1 AND UPPER(doc_type) = UPPER($2)`,
        [partId, targetDocType]
      );
      const nextRevNumber = parseInt(maxRevRes.rows[0].max_rev, 10) + 1;
      const revisionLabel = `R${nextRevNumber}`;

      // Mark previous documents of this type as is_current = false
      await pool.query(
        `UPDATE part_number_documents 
         SET is_current = false 
         WHERE part_number_id = $1 AND UPPER(doc_type) = UPPER($2)`,
        [partId, targetDocType]
      );

      const uploaderName = req.user.name || req.user.username || req.user.email || 'User';

      const inserted = await pool.query(
        `INSERT INTO part_number_documents 
          (part_number_id, file_name, file_path, file_type, doc_type, revision_number, revision_label, is_current, uploaded_by_id, uploaded_by_name, file_size)
         VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, $9, $10) 
         RETURNING *`,
        [partId, file.originalname, relPath, file.mimetype, targetDocType, nextRevNumber, revisionLabel, req.user.id, uploaderName, file.size]
      );

      await pool.query(
        `INSERT INTO activity_logs (user_id, dept, action_text) VALUES ($1, $2, $3)`,
        [req.user.id, req.user.role, `Uploaded ${targetDocType} ${revisionLabel} for Part Number "${partCheck.rows[0].part_number}"`]
      );

      insertedDocs.push(inserted.rows[0]);
    }

    res.json(insertedDocs.length === 1 ? insertedDocs[0] : insertedDocs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload Part Number document' });
  }
});

app.get('/api/part-number-masters/:id/documents/:docType/history', authorize(), async (req, res) => {
  try {
    const { id, docType } = req.params;
    const historyRes = await pool.query(
      `SELECT d.*, u.username as uploader_username, u.email as uploader_email
       FROM part_number_documents d
       LEFT JOIN users u ON d.uploaded_by_id = u.id
       WHERE d.part_number_id = $1 AND UPPER(d.doc_type) = UPPER($2)
       ORDER BY d.revision_number DESC, d.uploaded_at DESC`,
      [id, docType]
    );
    const rows = historyRes.rows.map(r => ({
      ...r,
      uploaded_by_name: r.uploaded_by_name || r.uploader_username || 'User'
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch revision history' });
  }
});

app.delete('/api/part-number-masters/:id/documents/:docId', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
  try {
    const deleted = await pool.query('DELETE FROM part_number_documents WHERE id = $1 AND part_number_id = $2 RETURNING *', [req.params.docId, req.params.id]);
    if (deleted.rows.length === 0) return res.status(404).json({ error: 'Document not found' });
    
    const doc = deleted.rows[0];
    if (doc.is_current) {
      await pool.query(
        `UPDATE part_number_documents
         SET is_current = true
         WHERE id = (
           SELECT id FROM part_number_documents
           WHERE part_number_id = $1 AND UPPER(doc_type) = UPPER($2)
           ORDER BY revision_number DESC LIMIT 1
         )`,
        [req.params.id, doc.doc_type]
      );
    }

    res.json(deleted.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// ── Template Download ─────────────────────────────────────────────────────────
const templateHandler = (req, res) => {
  const wb = XLSX.utils.book_new();

  // ── Sheet 1: Field Reference ─────────────────────────────────────────────
  const ref = [
    ['SECTION', 'FIELD', 'EXAMPLE / ALLOWED VALUES', 'REQUIRED?', 'NOTES'],
    ['── ORDER HEADER ──','','','',''],
    ['Company & Location','company_name','Acme Corp','YES','Must match Masters. Case-insensitive.'],
    ['Company & Location','company_city','Mumbai','YES','Must match Masters location city.'],
    ['Dates','order_date','2026-05-19','YES','Format: YYYY-MM-DD'],
    ['Dates','delivery_date','2026-07-31','YES','Overall delivery date. YYYY-MM-DD'],
    ['PO Details','po_number','PO-2026-1234','YES','Groups rows into one order. Same PO = same order.'],
    ['PO Details','priority','Medium','YES','Low | Medium | High | Urgent'],
    ['PO Details','packaging_type','Wooden Packaging','NO','Wooden Packaging | Foam Packaging'],
    ['PO Details','end_client_name','Basavanakolla site','NO','End client name / site location'],
    ['PO Details','project_name','Mooviboost Project','NO','Project / System Name'],
    ['PO Details','order_notes','Handle with care.','NO','Overall order notes'],
    ['PO Details','gst_number','27AAAAA1111A1Z1','NO','GST Number of client'],
    ['PO Details','reference_number','REF-2026-99','NO','Customer Reference Number'],
    ['PO Details','classification','Standard','NO','Standard | Non-Standard (Defaults to Standard)'],
    ['── LINE ITEMS ──','','','','One row per line item; repeat po_number to group into one order'],
    ['Line Item','line_item_number','0001','YES','0001, 0002, 0003 etc.'],
    ['Line Item','material_description','VFD Control Panel 22kW','YES','Full description'],
    ['Line Item','part_number','VFD-22K-STD','NO','Internal / customer part number'],
    ['Line Item','panel_type_size','VFD Panel 800x600','NO','Physical type/size'],
    ['Line Item','quantity','3','YES','Positive integer'],
    ['Line Item','unit','Nos','YES','e.g. Nos, Sets, Pcs'],
    ['Line Item','unit_price','45000','YES','Numeric only, no Rs.'],
    ['Line Item','total_price','135000','AUTO','quantity x unit_price (leave blank — auto-calculated)'],
    ['Line Item','line_item_delivery_date','2026-06-30','NO','YYYY-MM-DD; defaults to delivery_date'],
    ['Line Item','line_item_notes','FAT required before dispatch','NO','Item-level notes'],
    ['Line Item','tag','TG-01','NO','Line item tag (combined with reference_number as Ref/Tag)'],
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(ref);
  ws1['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 42 }, { wch: 12 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Field Reference');

  // ── Sheet 2: Import Template — 2000 blank rows ready for bulk paste ──────
  const COLS = [
    'company_name','company_city','order_date','delivery_date',
    'po_number','priority','packaging_type','end_client_name','project_name','order_notes',
    'gst_number','reference_number','classification',
    'line_item_number','material_description','part_number','panel_type_size',
    'quantity','unit','unit_price','total_price',
    'line_item_delivery_date','line_item_notes','tag'
  ];

  // Visual group-label row so users understand which columns are order-level vs item-level
  const groupRow = [
    '<-- ORDER LEVEL: repeat these 13 columns on every row of the same PO -->',
    '','','','','','','','','','','','',
    '<-- LINE ITEM LEVEL: one row = one item in the order -->',
    '','','','','','','','','',''
  ];

  const exampleRows = [
    // ORDER 1 — PO-2026-1001 — 3 line items (same PO groups them into 1 order)
    ['Acme Corp','Mumbai','2026-05-20','2026-07-31','PO-2026-1001','High','Wooden Packaging','Basavanakolla site','Mooviboost Line 1','Rush order — deliver before monsoon','27AAAAA1111A1Z1','REF-2026-99','Standard','00010','VFD Control Panel 22kW','VFD-22K-STD','800x600x300 mm',3,'Nos',45000,135000,'2026-06-30','FAT required before dispatch','TG-01'],
    ['Acme Corp','Mumbai','2026-05-20','2026-07-31','PO-2026-1001','High','Wooden Packaging','Basavanakolla site','Mooviboost Line 1','','27AAAAA1111A1Z1','REF-2026-99','Standard','00020','Motor Control Centre 8 Way','MCC-400A-8W','1600x800x400 mm',2,'Nos',72000,144000,'2026-07-15','','TG-02'],
    ['Acme Corp','Mumbai','2026-05-20','2026-07-31','PO-2026-1001','High','Wooden Packaging','Basavanakolla site','Mooviboost Line 1','','27AAAAA1111A1Z1','REF-2026-99','Standard','00030','Power Factor Correction Panel','PFCP-100K','1000x800x300 mm',1,'Nos',38000,38000,'2026-07-20','Include capacitor bank','TG-03'],
    // ORDER 2 — PO-2026-1002 — 1 line item
    ['Beta Industries','Pune','2026-05-22','2026-08-15','PO-2026-1002','Medium','Foam Packaging','Pune Site','Solar Grid System','','27BBBBB2222B2Z2','REF-2026-100','Non-Standard','00010','PLC Automation Panel','PLC-S7-300','600x400x300 mm',1,'Nos',90000,90000,'2026-08-15','Include Siemens S7-300','PLC-01'],
    // ORDER 3 — PO-2026-1003 — 2 line items
    ['Gamma Systems','Chennai','2026-05-25','2026-09-01','PO-2026-1003','Low','Wooden Packaging','','Warehouse Expansion','Standard delivery','','','Standard','00010','Distribution Board 8 Way','DB-8W-63A','500x400x200 mm',5,'Nos',12000,60000,'2026-09-01','',''],
    ['Gamma Systems','Chennai','2026-05-25','2026-09-01','PO-2026-1003','Low','Wooden Packaging','','Warehouse Expansion','','','','Standard','00020','Surge Protection Device','SPD-40KA','',5,'Nos',4500,22500,'2026-09-01','',''],
  ];

  // Pre-allocate 2000 blank rows so the sheet is bulk-paste ready
  const blankRows = Array.from({ length: 2000 }, () => COLS.map(() => ''));

  const tmpl = [groupRow, COLS, ...exampleRows, ...blankRows];
  const ws2 = XLSX.utils.aoa_to_sheet(tmpl);
  ws2['!cols'] = [20,15,13,15,20,10,18,22,38,22,22,16,18,32,18,22,10,8,12,12,24,38].map(w => ({ wch: w }));
  // Freeze top 2 rows — headers stay visible scrolling through thousands of rows
  ws2['!freeze'] = { xSplit: 0, ySplit: 2, topLeftCell: 'A3', activePane: 'bottomLeft' };
  XLSX.utils.book_append_sheet(wb, ws2, 'Import Template');

  // ── Sheet 3: How It Works — explicit multi-order walkthrough ─────────────
  const howto = [
    ['HOW THIS SHEET WORKS — MULTI-ORDER BULK IMPORT', '', ''],
    ['', '', ''],
    ['KEY RULE:', 'Each ROW = one Line Item.', ''],
    ['', 'Rows with the SAME po_number are grouped into ONE order.', ''],
    ['', 'A DIFFERENT po_number = a NEW separate order.', ''],
    ['', 'No limit on rows. Import hundreds or thousands of orders at once.', ''],
    ['', '', ''],
    ['EXAMPLE — 3 orders, 6 rows:', '', ''],
    ['', '', ''],
    ['Row', 'po_number', 'RESULT'],
    ['1', 'PO-2026-1001 (item 1)', 'Part of ORDER 1'],
    ['2', 'PO-2026-1001 (item 2)', 'Part of ORDER 1'],
    ['3', 'PO-2026-1001 (item 3)', 'Part of ORDER 1  <-- 3 rows = 1 order with 3 line items'],
    ['4', 'PO-2026-1002 (item 1)', 'ORDER 2  <-- different PO = new order'],
    ['5', 'PO-2026-1003 (item 1)', 'Part of ORDER 3'],
    ['6', 'PO-2026-1003 (item 2)', 'Part of ORDER 3  <-- 2 rows = 1 order with 2 line items'],
    ['', '', ''],
    ['RESULT:', '3 orders created. ORDER 1 has 3 line items, ORDER 2 has 1, ORDER 3 has 2.', ''],
    ['', '', ''],
    ['SCALE:', 'The Import Template sheet has 2000 blank rows pre-loaded.', ''],
    ['', 'Excel supports ~1,048,576 rows — you can paste as many as you need.', ''],
    ['', 'Each order processes in its own DB transaction.', ''],
    ['', 'If one PO fails (e.g. company not found), the others still succeed.', ''],
    ['', 'The upload result screen shows a per-PO success/error breakdown.', ''],
    ['', '', ''],
    ['TIPS:', '', ''],
    ['', '1. Keep rows for the same order together (sort by po_number) — not required but cleaner.', ''],
    ['', '2. company_name + company_city must match Masters exactly (case-insensitive).', ''],
    ['', '3. Dates: type as YYYY-MM-DD. Format the column as Text in Excel first to avoid auto-conversion.', ''],
    ['', '4. Leave total_price blank — always recalculated as quantity x unit_price on the server.', ''],
    ['', '5. Documents (PO copy, Quotation) cannot be included here. Attach them after import.', ''],
  ];
  const ws3 = XLSX.utils.aoa_to_sheet(howto);
  ws3['!cols'] = [{ wch: 12 }, { wch: 78 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(wb, ws3, 'How It Works');

  // ── Sheet 4: Validation Rules ─────────────────────────────────────────────
  const rules = [
    ['FIELD','TYPE','REQUIRED','ALLOWED VALUES / FORMAT','IF WRONG'],
    ['company_name','Text','YES','Exact name in Masters (case-insensitive)','Order fails — company not found'],
    ['company_city','Text','YES','Exact city in Masters (case-insensitive)','Order fails — location not found'],
    ['order_date','Date','YES','YYYY-MM-DD','Rejected if invalid'],
    ['delivery_date','Date','YES','YYYY-MM-DD','Rejected if invalid'],
    ['po_number','Text','YES','Any alphanumeric string','Row skipped if blank'],
    ['priority','Enum','YES','Low | Medium | High | Urgent','Defaults to Medium'],
    ['packaging_type','Enum','NO','Wooden Packaging | Foam Packaging','Left blank if invalid'],
    ['end_client_name','Text','NO','End client name / site location','Left blank if missing'],
    ['quantity','Integer','YES','Positive whole number','Defaults to 1'],
    ['unit','Text','YES','Nos, Sets, Pcs ...','Defaults to Nos'],
    ['unit_price','Decimal','YES','Numeric, no Rs.','Defaults to 0'],
    ['total_price','Decimal','AUTO','quantity x unit_price','Always recalculated server-side'],
  ];
  const ws4 = XLSX.utils.aoa_to_sheet(rules);
  ws4['!cols'] = [{ wch: 26 }, { wch: 10 }, { wch: 12 }, { wch: 48 }, { wch: 42 }];
  XLSX.utils.book_append_sheet(wb, ws4, 'Validation Rules');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Content-Disposition', 'attachment; filename="order_import_template.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
};

app.get('/api/template/download', templateHandler);
app.get('/api/template/order_import_template.xlsx', templateHandler);

// Static files
app.use('/uploads', authorize(), express.static(path.join(__dirname, 'uploads')));

// Error handling
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `Upload error: ${err.message}` });
  }
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Auto-seed Admin User 'Saya' if not present
const seedSayaUser = async () => {
  try {
    // Auto-migrate tables at boot to support Reference Number and Hold Status
    await pool.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS reference_number TEXT');
    await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS hold_status TEXT DEFAULT 'None'");
    await pool.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS classification TEXT DEFAULT 'Standard'");

    // Ensure panel_size_masters columns exist and are backfilled
    await pool.query(`
      ALTER TABLE panel_size_masters 
      ADD COLUMN IF NOT EXISTS panel_code TEXT,
      ADD COLUMN IF NOT EXISTS panel_size TEXT,
      ADD COLUMN IF NOT EXISTS ip_rating TEXT,
      ADD COLUMN IF NOT EXISTS comments TEXT;

      UPDATE panel_size_masters 
      SET panel_size = COALESCE(panel_size, size_name),
          comments = COALESCE(comments, description)
      WHERE panel_size IS NULL OR comments IS NULL;

      UPDATE panel_size_masters 
      SET panel_code = 'PC-' || LPAD(id::text, 2, '0') 
      WHERE panel_code IS NULL OR panel_code = '';

      UPDATE panel_size_masters 
      SET ip_rating = 'IP55' 
      WHERE ip_rating IS NULL OR ip_rating = '';

      INSERT INTO column_masters (col_key, label, category, field_type, is_system, sort_order) VALUES
        ('panel_code',      'Panel Code',        'LineItem', 'Text', true, 9),
        ('panel_ip_rating', 'IP Rating',         'LineItem', 'Text', true, 11),
        ('panel_comments',  'Comments',          'LineItem', 'Text', true, 12)
      ON CONFLICT (col_key) DO NOTHING;

      INSERT INTO department_column_visibility (dept, col_key, is_visible)
      SELECT d.dept, c.col_key, true
      FROM (VALUES ('Sales'), ('Design'), ('Purchase'), ('Stores'), ('Production'), ('QC'), ('Dispatch'), ('Accounts'), ('Planning')) AS d(dept)
      CROSS JOIN (SELECT col_key FROM column_masters WHERE col_key IN ('panel_code', 'panel_ip_rating', 'panel_comments')) c
      ON CONFLICT (dept, col_key) DO NOTHING;

      CREATE TABLE IF NOT EXISTS part_number_masters (
        id SERIAL PRIMARY KEY,
        part_number TEXT UNIQUE NOT NULL,
        client_name TEXT,
        project TEXT,
        description TEXT,
        category TEXT NOT NULL DEFAULT 'Standard',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS part_number_documents (
        id SERIAL PRIMARY KEY,
        part_number_id INTEGER NOT NULL REFERENCES part_number_masters(id) ON DELETE CASCADE,
        doc_type TEXT NOT NULL DEFAULT 'Drawing',
        revision_number INTEGER NOT NULL DEFAULT 0,
        revision_label TEXT NOT NULL DEFAULT 'R0',
        file_name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        file_type TEXT,
        file_size BIGINT DEFAULT 0,
        is_current BOOLEAN NOT NULL DEFAULT true,
        uploaded_by_id INTEGER REFERENCES users(id),
        uploaded_by_name TEXT,
        uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      ALTER TABLE part_number_masters 
      ADD COLUMN IF NOT EXISTS client_name TEXT,
      ADD COLUMN IF NOT EXISTS project TEXT,
      ADD COLUMN IF NOT EXISTS panel_code TEXT;

      ALTER TABLE part_number_documents 
      ADD COLUMN IF NOT EXISTS doc_type TEXT DEFAULT 'Drawing',
      ADD COLUMN IF NOT EXISTS revision_number INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS revision_label TEXT DEFAULT 'R0',
      ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS uploaded_by_id INTEGER REFERENCES users(id),
      ADD COLUMN IF NOT EXISTS uploaded_by_name TEXT,
      ADD COLUMN IF NOT EXISTS file_size BIGINT DEFAULT 0;

      UPDATE part_number_documents 
      SET doc_type = COALESCE(doc_type, 'Drawing'),
          revision_number = COALESCE(revision_number, 0),
          revision_label = COALESCE(revision_label, 'R0'),
          is_current = COALESCE(is_current, true)
      WHERE doc_type IS NULL OR revision_number IS NULL OR revision_label IS NULL OR is_current IS NULL;
    `);

    // Auto-migrate role constraints at boot to revert Planning default
    await pool.query('ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check');
    await pool.query(`
      ALTER TABLE users ADD CONSTRAINT users_role_check 
      CHECK (role IN ('Admin', 'Manager', 'Sales', 'Design', 'Purchase', 'Stores', 'Production', 'QC', 'Dispatch', 'Accounts', 'Viewer', 'Planning'))
    `);
    await pool.query("ALTER TABLE users ALTER COLUMN role SET DEFAULT 'Viewer'");

    const userRes = await pool.query("SELECT id FROM users WHERE username = 'Saya' OR email = 'sayamumbaikar26@gmail.com' LIMIT 1");
    if (userRes.rows.length === 0) {
      console.log('Seeding user Saya as Admin...');
      await pool.query(
        `INSERT INTO users (username, email, password, role) 
         VALUES ($1, $2, $3, $4)`,
        [
          'Saya', 
          'sayamumbaikar26@gmail.com', 
          '$2a$10$dTMz2obf/OXXRbCa.K.Jxeoj9/NTWRR4CjXohpCQzp.MBIl3keQ22', 
          'Admin'
        ]
      );
      console.log('User Saya successfully seeded.');
    }

    // Sync task_masters changes to existing order_steps and unit_steps
    await pool.query(`
      UPDATE order_steps s
      SET dept = tm.dept,
          name = tm.name,
          sub = tm.sub,
          special = tm.special,
          requires_upload = tm.requires_upload,
          default_doc_type = tm.default_doc_type
      FROM task_masters tm
      WHERE s.task_id = tm.id
    `);
    await pool.query(`
      UPDATE unit_steps s
      SET dept = tm.dept,
          name = tm.name,
          sub = tm.sub,
          requires_upload = tm.requires_upload,
          default_doc_type = tm.default_doc_type
      FROM task_masters tm
      WHERE s.task_id = tm.id
    `);

    // Clean up any orphaned steps from previously deleted task masters
    await pool.query('DELETE FROM order_steps WHERE task_id IS NULL');
    await pool.query('DELETE FROM unit_steps WHERE task_id IS NULL');

    // Re-derive unit status for all units so upstream gating (Sales Upload PO) is strictly enforced
    const allUnits = await pool.query('SELECT id FROM order_units');
    for (const u of allUnits.rows) {
      await deriveUnitStatus(u.id, pool);
    }
  } catch (err) {
    console.warn('Could not auto-seed user Saya (database may still be starting up):', err.message);
  }
};

seedSayaUser().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
