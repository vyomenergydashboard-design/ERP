// Outgoing workflow emails (department handover, hold requests). Each send is also logged
// to activity_logs; SMTP delivery only happens when SMTP_USER is configured.
import nodemailer from 'nodemailer';
import pool from '../db.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'mock_user',
    pass: process.env.SMTP_PASS || 'mock_pass'
  }
});

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
));

export const sendDepartmentHandoverEmail = async (unitIdStr, shortSerial, prevDept, nextDept) => {
  const esc = escapeHtml;
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
        Hello team <strong>${esc(nextDept)}</strong>,
      </p>
      <p style="font-size: 15px; color: #334155; line-height: 1.6;">
        This is to notify you that the department <strong>${esc(prevDept)}</strong> has completed their assigned tasks for unit <strong>${esc(unitIdStr)}</strong> (Serial: <strong>${esc(shortSerial)}</strong>).
      </p>
      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; width: 140px;"><strong>Unit ID:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-family: monospace;">${esc(unitIdStr)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Serial No.:</strong></td>
            <td style="padding: 4px 0; color: #1e293b;">${esc(shortSerial)}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Previous Dept:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-weight: 600; color: #0f766e;">${esc(prevDept)} (Completed)</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b;"><strong>Next Active Dept:</strong></td>
            <td style="padding: 4px 0; color: #1e293b; font-weight: 600; color: #b45309;">${esc(nextDept)} (Pending Your Action)</td>
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

export const sendHoldRequestEmail = async (orderId, orderNumber, requestedByUsername) => {
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
