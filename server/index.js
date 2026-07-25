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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hold validation helpers
const isOrderOnHold = async (orderId) => {
  const res = await pool.query("SELECT hold_status FROM orders WHERE id = $1", [orderId]);
  return res.rows.length > 0 && res.rows[0].hold_status === 'Approved';
};

const isUnitOnHold = async (unitId) => {
  const res = await pool.query(
    "SELECT o.hold_status FROM orders o JOIN order_units ou ON ou.order_id = o.id WHERE ou.id = $1",
    [unitId]
  );
  return res.rows.length > 0 && res.rows[0].hold_status === 'Approved';
};

const isLineItemOnHold = async (lineItemId) => {
  const res = await pool.query(
    "SELECT o.hold_status FROM orders o JOIN order_line_items oli ON oli.order_id = o.id WHERE oli.id = $1",
    [lineItemId]
  );
  return res.rows.length > 0 && res.rows[0].hold_status === 'Approved';
};

let isSystemSeeding = false;

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const DEFAULT_STEPS = [
  { dept: 'Sales', name: 'Upload PO', sub: 'Customer PO + specs', special: 'sales', requires_upload: true, default_doc_type: 'PO', level: 'order' },
  { dept: 'Sales', name: 'Confirm Dispatch Date', sub: 'Received from Planning', special: 'dispatch', requires_upload: false, default_doc_type: 'General', level: 'order' },
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
  { dept: 'Accounts', name: 'Invoice & Dispatch Note', sub: 'Billing & documentation', special: null, requires_upload: true, default_doc_type: 'Dispatch Document', level: 'order' }
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
            <td style="padding: 4px 0; color: #64748b;"><strong>Unit Serial:</strong></td>
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

  console.log('\n┌────────────────────────────────────────────────────────┐');
  console.log('│                  SIMULATED OUTGOING EMAIL              │');
  console.log('├────────────────────────────────────────────────────────┤');
  console.log(`│ From:    ${mailOptions.from}`);
  console.log(`│ To:      ${mailOptions.to}`);
  console.log(`│ Subject: ${mailOptions.subject}`);
  console.log('├────────────────────────────────────────────────────────┤');
  console.log(`│ handover: ${prevDept} -> ${nextDept} for unit ${unitIdStr}`);
  console.log('└────────────────────────────────────────────────────────┘\n');

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
      console.error('SMTP Delivery failed:', smtpErr);
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

  console.log('\n┌────────────────────────────────────────────────────────┐');
  console.log('│             SIMULATED OUTGOING HOLD EMAIL              │');
  console.log('├────────────────────────────────────────────────────────┤');
  console.log(`│ From:    ${mailOptions.from}`);
  console.log(`│ To:      ${mailOptions.to}`);
  console.log(`│ Subject: ${mailOptions.subject}`);
  console.log('├────────────────────────────────────────────────────────┤');
  console.log(`│ Hold requested for order ${orderNumber} by ${requestedByUsername}`);
  console.log('└────────────────────────────────────────────────────────┘\n');

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
      console.error('SMTP Delivery failed for hold alert:', smtpErr);
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
    `SELECT ou.current_dept, ou.unit_id, ou.short_serial, o.classification
     FROM order_units ou
     JOIN orders o ON ou.order_id = o.id
     WHERE ou.id = $1`,
    [unitId]
  );
  if (prevUnitRes.rows.length === 0) return;

  const oldDept = prevUnitRes.rows[0].current_dept;
  const unit_id_str = prevUnitRes.rows[0].unit_id || '';
  const short_serial = prevUnitRes.rows[0].short_serial || '';
  const classification = prevUnitRes.rows[0].classification || 'Standard';

  if (classification === 'Standard') {
    // Auto-complete Design, Purchase, and Stores steps for this unit
    await clientOrPool.query(
      `UPDATE unit_steps 
       SET status = 'done', notes = 'Auto-completed for Standard order' 
       WHERE order_unit_id = $1 AND dept IN ('Design', 'Purchase', 'Stores') AND status != 'done'`,
      [unitId]
    );
  } else {
    // Reset auto-completed steps back to pending/default state if changed to Non-Standard
    await clientOrPool.query(
      `UPDATE unit_steps 
       SET status = 'pending', notes = NULL 
       WHERE order_unit_id = $1 AND dept IN ('Design', 'Purchase', 'Stores') AND status = 'done' AND notes = 'Auto-completed for Standard order'`,
      [unitId]
    );
  }

  const stepsRes = await clientOrPool.query(
    `SELECT id, dept, name, status FROM unit_steps WHERE order_unit_id = $1 ORDER BY step_order ASC, id ASC`,
    [unitId]
  );
  if (stepsRes.rows.length === 0) return;

  const steps = stepsRes.rows;
  
  let newStatus = 'Pending';
  let newDept = 'Planning';

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

// Helper for Order ID Generation
// Helper: extract numeric counter from a line_item_number (stored as ORD-YYYY-NNNN or plain NNNN)
const parseLiCounter = (li_number) => {
  if (!li_number) return 0;
  const s = String(li_number);
  // Full format: ORD-2026-0001 → take the last segment
  const parts = s.split('-');
  return parseInt(parts[parts.length - 1]) || 0;
};

const generateOrderNumber = async (client) => {
  // The order number equals the global line-item sequence number of its FIRST line item.
  // line_item_numbers are stored as full ORD-YYYY-NNNN strings.
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}-`;

  const db = client || pool;
  const liResult = await db.query(
    "SELECT line_item_number FROM order_line_items ORDER BY id DESC LIMIT 1"
  );

  let nextNum;
  if (liResult.rows.length > 0) {
    nextNum = parseLiCounter(liResult.rows[0].line_item_number) + 1;
  } else {
    const setting = await db.query("SELECT value FROM system_settings WHERE key = 'order_number_start' LIMIT 1");
    nextNum = setting.rows.length > 0 ? parseInt(setting.rows[0].value) || 1 : 1;
  }

  return `${prefix}${nextNum.toString().padStart(4, '0')}`;
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
    const { order_date, delivery_date, notes, company_location_id, lineItems, priority, po_number, packaging_type, end_client_name, gst_number, reference_number, classification } = req.body;
    let parsedLineItems = [];
    try {
      parsedLineItems = JSON.parse(lineItems);
    } catch (e) {
      // Ignore
    }

    // 1. Determine the global line-item counter start.
    //    The order number = the global sequence number of its first line item.
    //    line_item_numbers are stored as full ORD-YYYY-NNNN strings.
    const liCountRes = await client.query(
      "SELECT line_item_number FROM order_line_items ORDER BY id DESC LIMIT 1"
    );
    let globalLineItemCounter;
    if (liCountRes.rows.length > 0) {
      globalLineItemCounter = parseLiCounter(liCountRes.rows[0].line_item_number) + 1;
    } else {
      const setting = await client.query("SELECT value FROM system_settings WHERE key = 'order_number_start' LIMIT 1");
      globalLineItemCounter = setting.rows.length > 0 ? parseInt(setting.rows[0].value) || 1 : 1;
    }

    // The order number is ORD-<year>-<firstLineItemGlobalNum>
    const year = new Date().getFullYear();
    const order_number = `ORD-${year}-${globalLineItemCounter.toString().padStart(4, '0')}`;

    // Automatically calculate delivery_date = order_date + 4 weeks (28 days)
    const resolved_order_date = order_date || new Date().toISOString().split('T')[0];
    const orderDateObj = new Date(resolved_order_date);
    const deliveryDateObj = new Date(orderDateObj);
    deliveryDateObj.setDate(orderDateObj.getDate() + 28);
    const calculated_delivery_date = deliveryDateObj.toISOString().split('T')[0];

    const orderResult = await client.query(
      `INSERT INTO orders (order_number, company_location_id, order_date, delivery_date, notes, priority, po_number, packaging_type, created_by, end_client_name, gst_number, reference_number, classification) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
      [order_number, company_location_id || null, resolved_order_date, calculated_delivery_date, notes, priority || 'Medium', po_number || null, packaging_type || null, req.user.id, end_client_name || null, gst_number || null, reference_number || null, classification || 'Standard']
    );
    const order = orderResult.rows[0];

    // 2. Insert Line Items — stored as full ORD-YYYY-NNNN format
    const maxSerialRes = await client.query('SELECT MAX(CAST(short_serial AS INTEGER)) as max_serial FROM order_units');
    let globalUnitCounter = (maxSerialRes.rows[0]?.max_serial || 0) + 1;
    let totalUnits = 0;
    const createdUnits = [];

    for (const li of parsedLineItems) {
      const qty = parseInt(li.quantity) || 1;
      // Full ORD-YYYY-NNNN format for line item number
      const assigned_li_number = `ORD-${year}-${globalLineItemCounter.toString().padStart(4, '0')}`;
      globalLineItemCounter += qty;

      const liResult = await client.query(
        `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number, panel_type_size, delivery_date, quantity, unit, unit_price, total_price, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [order.id, assigned_li_number, li.material_description, li.part_number, li.panel_type_size, calculated_delivery_date, qty, li.unit, li.unit_price, li.total_price, li.notes]
      );
      const lineItem = liResult.rows[0];
      totalUnits += qty;

      for (let i = 0; i < qty; i++) {
        const short_serial = globalUnitCounter.toString().padStart(4, '0');
        const unit_id = `${order_number}-${short_serial}`;
        const unitResult = await client.query(
          `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial) VALUES ($1, $2, $3, $4) RETURNING id`,
          [order.id, lineItem.id, unit_id, short_serial]
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
        
        await client.query(
          `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          ['Order', order.id, docType, file.originalname, file.path, file.size, file.mimetype, req.user.id]
        );
      }
    }

    if (hasPO) {
      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      await client.query(
        `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
        ['PO uploaded during order creation.', updatedStr, order.id]
      );
      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, order.id, 'Sales', 'Completed: Upload PO (System Auto-Check)']
      );
    }

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

app.put('/api/orders/:id', authorize(['Admin', 'Manager', 'Sales']), async (req, res) => {
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
    classification
  } = req.body;
  
  try {
    const checkOrder = await pool.query('SELECT order_number, order_date FROM orders WHERE id = $1', [req.params.id]);
    if (checkOrder.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const { order_number, order_date: existing_order_date } = checkOrder.rows[0];

    const resolved_order_date = order_date || (existing_order_date ? (existing_order_date instanceof Date ? existing_order_date.toISOString().split('T')[0] : String(existing_order_date).split('T')[0]) : new Date().toISOString().split('T')[0]);
    const orderDateObj = new Date(resolved_order_date);
    const deliveryDateObj = new Date(orderDateObj);
    deliveryDateObj.setDate(orderDateObj.getDate() + 28); // 4 weeks
    const calculated_delivery_date = deliveryDateObj.toISOString().split('T')[0];

    // Auto-update all line items' delivery dates to match
    await pool.query(
      'UPDATE order_line_items SET delivery_date = $1 WHERE order_id = $2',
      [calculated_delivery_date, req.params.id]
    );

    const result = await pool.query(
      `UPDATE orders 
       SET company_location_id = COALESCE($1, company_location_id), 
           order_date = $2, 
           delivery_date = $3, 
           notes = $4, 
           priority = COALESCE($5, priority), 
           po_number = $6, 
           packaging_type = $7, 
           end_client_name = $8, 
           gst_number = $9, 
           reference_number = $10,
           classification = COALESCE($11, classification)
       WHERE id = $12 
       RETURNING *`,
      [
        company_location_id ? parseInt(company_location_id) : null, 
        resolved_order_date, 
        calculated_delivery_date, 
        notes || null, 
        priority || 'Medium', 
        po_number || null, 
        packaging_type || null, 
        end_client_name || null, 
        gst_number || null, 
        reference_number || null,
        classification || null,
        req.params.id
      ]
    );

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

    // Calculate delivery_date as 4 weeks from the order's order_date
    const resolved_order_date = order_date ? (order_date instanceof Date ? order_date.toISOString().split('T')[0] : String(order_date).split('T')[0]) : new Date().toISOString().split('T')[0];
    const orderDateObj = new Date(resolved_order_date);
    const deliveryDateObj = new Date(orderDateObj);
    deliveryDateObj.setDate(orderDateObj.getDate() + 28); // 4 weeks
    const calculated_delivery_date = deliveryDateObj.toISOString().split('T')[0];

    const qty = quantity ? parseInt(quantity) : null;
    const price = unit_price ? parseFloat(unit_price) : null;
    const total = qty != null && price != null ? qty * price : null;

    const result = await pool.query(
      `UPDATE order_line_items
       SET material_description = COALESCE($1, material_description),
           part_number           = $2,
           panel_type_size       = $3,
           quantity              = COALESCE($4, quantity),
           unit                  = COALESCE($5, unit),
           unit_price            = COALESCE($6, unit_price),
           total_price           = COALESCE($7, total_price),
           delivery_date         = $8,
           notes                 = $9
       WHERE id = $10
       RETURNING *`,
      [
        material_description || null,
        part_number !== undefined ? (part_number || null) : undefined,
        panel_type_size !== undefined ? (panel_type_size || null) : undefined,
        qty,
        unit || null,
        price,
        total,
        calculated_delivery_date,
        notes !== undefined ? (notes || null) : undefined,
        liId,
      ]
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
      const maxGlobalSerialRes = await client.query('SELECT COALESCE(MAX(short_serial::integer), 0) as max_serial FROM order_units');
      let globalUnitCounter = parseInt(maxGlobalSerialRes.rows[0].max_serial) + 1;
      let lineNum = 1;
      let isAppended = false;

      if (existingOrderRes.rows.length > 0) {
        order = existingOrderRes.rows[0];
        isAppended = true;

        // Continue from the GLOBAL last line item number (global sequence across all orders)
        const maxLiRes = await client.query(
          "SELECT line_item_number FROM order_line_items ORDER BY id DESC LIMIT 1"
        );
        if (maxLiRes.rows.length > 0) {
          lineNum = parseLiCounter(maxLiRes.rows[0].line_item_number) + 1;
        }
      } else {
        // Create new order — determine global line item counter for this order
        const liCountRes = await client.query(
          "SELECT line_item_number FROM order_line_items ORDER BY id DESC LIMIT 1"
        );
        if (liCountRes.rows.length > 0) {
          lineNum = parseLiCounter(liCountRes.rows[0].line_item_number) + 1;
        } else {
          const setting = await client.query("SELECT value FROM system_settings WHERE key = 'order_number_start' LIMIT 1");
          lineNum = setting.rows.length > 0 ? parseInt(setting.rows[0].value) || 1 : 1;
        }

        // Order number = global sequence number of its first line item (full ORD-YYYY-NNNN)
        const importYear = new Date().getFullYear();
        const order_number = `ORD-${importYear}-${lineNum.toString().padStart(4, '0')}`;
        const VALID_CLASSIFICATIONS = ['Standard', 'Non-Standard'];
        const classification = VALID_CLASSIFICATIONS.includes(header['classification']) ? header['classification'] : 'Standard';
        const orderResult = await client.query(
          `INSERT INTO orders (order_number, company_location_id, order_date, delivery_date, notes, priority, po_number, packaging_type, created_by, end_client_name, gst_number, reference_number, classification)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
          [order_number, company_location_id, order_date, delivery_date,
           header['order_notes'] || null, priority, po_number, packaging_type, req.user.id,
           header['end_client_name'] || header['end_client'] || null,
           header['gst_number'] || null,
           header['reference_number'] || null,
           classification]
        );
        order = orderResult.rows[0];
      }

      const order_number = order.order_number;
      const importYear = new Date().getFullYear();

      // Insert line items & units (line_item_number stored as full ORD-YYYY-NNNN)
      let totalUnits = 0;
      const createdUnits = [];

      for (const li of lineItems) {
        const qty = parseInt(li['quantity']) || 1;
        // Full ORD-YYYY-NNNN format for line item number
        const li_number = `ORD-${importYear}-${lineNum.toString().padStart(4, '0')}`;
        lineNum += qty;

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

        const liResult = await client.query(
          `INSERT INTO order_line_items (order_id, line_item_number, material_description, part_number,
            panel_type_size, delivery_date, quantity, unit, unit_price, total_price, notes)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
          [order.id, li_number, li['material_description'] || '', li['part_number'] || '',
           li['panel_type_size'] || '', delivery_date,
           qty, li['unit'] || 'Nos', unit_price, total_price, li['line_item_notes'] || null]
        );
        const lineItem = liResult.rows[0];
        totalUnits += qty;

        for (let i = 0; i < qty; i++) {
          const short_serial = globalUnitCounter.toString().padStart(4, '0');
          const unit_id = `${order_number}-${short_serial}`;
          const unitResult = await client.query(
            `INSERT INTO order_units (order_id, line_item_id, unit_id, short_serial) VALUES ($1,$2,$3,$4) RETURNING id`,
            [order.id, lineItem.id, unit_id, short_serial]
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
       c.name as company_name, l.city as company_city
       FROM orders o 
       LEFT JOIN users u ON o.created_by = u.id 
       LEFT JOIN company_locations l ON o.company_location_id = l.id
       LEFT JOIN companies c ON l.company_id = c.id
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
              o.reference_number, o.end_client_name, o.classification, o.hold_status,
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
      if (allSteps.length === 0) {
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
        li.material_description, li.part_number, li.panel_type_size,
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
          
          if (f.condition) {
            try {
              const fn = new Function('$val', `return (${f.condition});`);
              return !!fn(val);
            } catch (err) {
              console.error('Failed evaluating condition:', f.condition, err);
              return false;
            }
          }
          return isValPresent;
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

app.get('/api/planning', authorize(['Admin', 'Manager', 'Planning']), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
          oli.id as line_item_id,
          o.id as order_id,
          o.order_number,
          o.po_number,
          o.delivery_date,
          o.priority,
          o.notes,
          o.end_client_name,
          o.reference_number,
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

      if (liUpdates.length > 0) {
        liParams.push(lineItemId);
        await client.query(
          `UPDATE order_line_items SET ${liUpdates.join(', ')} WHERE id = $${lIdx}`,
          liParams
        );
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
    mounting_complete_date
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
           mounting_complete_date = $9
       WHERE id = $10 
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
        req.params.lineItemId
      ]
    );

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
          
          if (f.condition) {
            try {
              const fn = new Function('$val', `return (${f.condition});`);
              return !!fn(val);
            } catch (err) {
              console.error('Failed evaluating condition:', f.condition, err);
              return false;
            }
          }
          return isValPresent;
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
  if (await isUnitOnHold(req.params.unitId)) {
    return res.status(400).json({ error: 'Order is currently on hold. Updates are disabled.' });
  }
  const { status, notes, dispatchDate, custom_fields, assigned_user_id } = req.body;
  const updated = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Fetch step details to verify permissions
    const stepRes = await client.query('SELECT dept, assigned_user_id FROM unit_steps WHERE id = $1 AND order_unit_id = $2', [req.params.stepId, req.params.unitId]);
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

    // Upstream validation: block marking 'done' if upstream depts are incomplete
    if (status === 'done' && !['Admin', 'Manager'].includes(req.user.role)) {
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
    
    if (custom_fields) {
      await propagateCustomFieldsToDB(custom_fields, null, req.params.unitId, client);
    }

    let cfJson = null;
    if (custom_fields) {
      cfJson = JSON.stringify(custom_fields);
    }

    const result = await client.query(
      `UPDATE unit_steps 
       SET status = $1, notes = $2, dispatch_date = $3, updated = $4, custom_fields = COALESCE($5, custom_fields), assigned_user_id = COALESCE($6, assigned_user_id) 
       WHERE id = $7 AND order_unit_id = $8 
       RETURNING *`,
      [status, notes, dispatchDate || null, updated, cfJson, assigned_user_id || null, req.params.stepId, req.params.unitId]
    );

    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Unit step not found' });
    }

    if (step.dept === 'QC' && status === 'blocked') {
      const { qcFailTarget } = req.body;
      const target = qcFailTarget === 'design' ? 'Design' : 'Production';
      const remark = target === 'Design' ? 'Returned from QC — design re-check needed' : 'Returned from QC — rework required';

      await client.query(
        `UPDATE unit_steps 
         SET status = 'inprogress', notes = $1, updated = $2 
         WHERE order_unit_id = $3 AND dept = $4`,
        [remark, updated, req.params.unitId, target]
      );

      const unitResForLog = await client.query('SELECT order_id FROM order_units WHERE id = $1', [req.params.unitId]);
      const orderIdForLog = unitResForLog.rows[0]?.order_id || null;
      await client.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) 
         VALUES ($1, $2, 'QC', $3)`,
        [req.user.id, orderIdForLog, `QC FAIL → returned to ${target} for ${target === 'Design' ? 're-check' : 'rework'}`]
      );
    }

    // Recalculate derived status
    await deriveUnitStatus(req.params.unitId, client);

    const unitRes = await client.query('SELECT order_id FROM order_units WHERE id = $1', [req.params.unitId]);
    if (unitRes.rows.length > 0) {
      await updateOrderQCStatusFromSteps(unitRes.rows[0].order_id, client);
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
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
        o.id           AS order_id,
        o.order_number,
        o.po_number,
        o.reference_number,
        o.end_client_name,
        o.priority,
        o.delivery_date,
        cl.city        AS company_city,
        co.name        AS company_name,
        oli.id         AS line_item_id,
        oli.line_item_number,
        oli.material_description,
        oli.part_number,
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
              'assigned_user_id', us.assigned_user_id
            ) ORDER BY us.id
          )
          FROM unit_steps us
          WHERE us.order_unit_id = ou.id AND us.dept = ou.current_dept
        ) AS dept_steps
      FROM order_units ou
      JOIN orders o         ON ou.order_id = o.id
      JOIN order_line_items oli ON ou.line_item_id = oli.id
      LEFT JOIN company_locations cl ON o.company_location_id = cl.id
      LEFT JOIN companies co ON cl.company_id = co.id
      WHERE $1 = 'Sales' OR ou.current_dept = $1
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

app.post('/api/companies', authorize(['Admin']), async (req, res) => {
  const { name, locations } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const compRes = await client.query('INSERT INTO companies (name) VALUES ($1) RETURNING *', [name]);
    const company = compRes.rows[0];
    const savedLocations = [];
    
    if (locations && locations.length > 0) {
      for (const loc of locations) {
        const locRes = await client.query(
          `INSERT INTO company_locations (company_id, address, city, person_in_charge, contact_number, email) 
           VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [company.id, loc.address, loc.city, loc.person_in_charge, loc.contact_number, loc.email]
        );
        savedLocations.push(locRes.rows[0]);
      }
    }
    await client.query('COMMIT');
    res.status(201).json({ ...company, locations: savedLocations });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create company' });
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
    }

    if (hasPO && entity_type === 'Order') {
      const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      await pool.query(
        `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
        ['PO uploaded via Documents.', updatedStr, entity_id]
      );
      await pool.query(
        `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
        [req.user.id, entity_id, 'Sales', 'Completed: Upload PO (System Auto-Check on Upload)']
      );
    }
    res.status(201).json(savedDocs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload documents' });
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

app.delete('/api/documents/:id', authorize(), async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM documents WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found' });
    
    const doc = result.rows[0];
    
    // Optional: Only allow the uploader, Admin, or Manager to delete
    if (doc.uploaded_by !== req.user.id && req.user.role !== 'Admin' && req.user.role !== 'Manager') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Delete the file from the filesystem if it exists
    if (fs.existsSync(doc.file_path)) {
      fs.unlinkSync(doc.file_path);
    }
    
    await pool.query('DELETE FROM documents WHERE id = $1', [req.params.id]);
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
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task master' });
  }
});

app.delete('/api/task_masters/:id', authorize(['Admin']), async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM task_masters WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task master' });
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
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(ref);
  ws1['!cols'] = [{ wch: 22 }, { wch: 28 }, { wch: 42 }, { wch: 12 }, { wch: 60 }];
  XLSX.utils.book_append_sheet(wb, ws1, 'Field Reference');

  // ── Sheet 2: Import Template — 2000 blank rows ready for bulk paste ──────
  const COLS = [
    'company_name','company_city','order_date','delivery_date',
    'po_number','priority','packaging_type','end_client_name','order_notes',
    'gst_number','reference_number','classification',
    'line_item_number','material_description','part_number','panel_type_size',
    'quantity','unit','unit_price','total_price',
    'line_item_delivery_date','line_item_notes'
  ];

  // Visual group-label row so users understand which columns are order-level vs item-level
  const groupRow = [
    '<-- ORDER LEVEL: repeat these 12 columns on every row of the same PO -->',
    '','','','','','','','','','','',
    '<-- LINE ITEM LEVEL: one row = one item in the order -->',
    '','','','','','','','',''
  ];

  const exampleRows = [
    // ORDER 1 — PO-2026-1001 — 3 line items (same PO groups them into 1 order)
    ['Acme Corp','Mumbai','2026-05-20','2026-07-31','PO-2026-1001','High','Wooden Packaging','Basavanakolla site','Rush order — deliver before monsoon','27AAAAA1111A1Z1','REF-2026-99','Standard','00010','VFD Control Panel 22kW','VFD-22K-STD','VFD Panel 800x600',3,'Nos',45000,135000,'2026-06-30','FAT required before dispatch'],
    ['Acme Corp','Mumbai','2026-05-20','2026-07-31','PO-2026-1001','High','Wooden Packaging','Basavanakolla site','','27AAAAA1111A1Z1','REF-2026-99','Standard','00020','Motor Control Centre 8 Way','MCC-400A-8W','MCC Panel 1800x800',2,'Nos',72000,144000,'2026-07-15',''],
    ['Acme Corp','Mumbai','2026-05-20','2026-07-31','PO-2026-1001','High','Wooden Packaging','Basavanakolla site','','27AAAAA1111A1Z1','REF-2026-99','Standard','00030','Power Factor Correction Panel','PFCP-100K','PFCP 600x500',1,'Nos',38000,38000,'2026-07-20','Include capacitor bank'],
    // ORDER 2 — PO-2026-1002 — 1 line item
    ['Beta Industries','Pune','2026-05-22','2026-08-15','PO-2026-1002','Medium','Foam Packaging','Pune Site','','27BBBBB2222B2Z2','REF-2026-100','Non-Standard','00010','PLC Automation Panel','PLC-S7-300','600x400',1,'Nos',90000,90000,'2026-08-15','Include Siemens S7-300'],
    // ORDER 3 — PO-2026-1003 — 2 line items
    ['Gamma Systems','Chennai','2026-05-25','2026-09-01','PO-2026-1003','Low','Wooden Packaging','','Standard delivery','','','Standard','00010','Distribution Board 8 Way','DB-8W-63A','DB 400x300',5,'Nos',12000,60000,'2026-09-01',''],
    ['Gamma Systems','Chennai','2026-05-25','2026-09-01','PO-2026-1003','Low','Wooden Packaging','','','','','Standard','00020','Surge Protection Device','SPD-40KA','',5,'Nos',4500,22500,'2026-09-01',''],
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
  } catch (err) {
    console.warn('Could not auto-seed user Saya (database may still be starting up):', err.message);
  }
};

seedSayaUser().catch(console.error);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
