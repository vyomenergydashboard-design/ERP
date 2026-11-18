import express from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { OPERATOR_ROLES } from '../data/workflow.js';
import { upload, cleanupUploadedFiles } from '../services/uploads.js';
import { isOrderOnHold, isUnitOnHold } from '../services/holds.js';
import { tryInSavepoint, lockOrders } from '../services/transactions.js';
import { deriveUnitStatus, syncUnitDesignDocumentStatus } from '../services/unitStatus.js';

/**
 * Router for order / unit / step documents (mounted at /api/documents): upload, the document
 * directory, per-entity lists, short-lived download tickets for /uploads, and delete.
 * PO documents are hidden from roles other than Sales, Accounts, Admin and Manager, and only
 * Sales, Admin and Manager may upload them. Uploading a PO marks 'Upload PO' done and re-derives
 * the units; Drawing / BOM uploads and deletes re-sync the Design 'Release Documents' step.
 * JWT_SECRET (passed in from index.js) signs the 60-second download tickets.
 */
export default function createDocumentsRouter(pool, authorize, JWT_SECRET) {
  const router = express.Router();

  router.post('/upload', authorize(OPERATOR_ROLES), upload.array('files', 20), async (req, res) => {
    const { entity_type, entity_id, doc_type } = req.body;
    const savedDocs = [];
    // Remove files multer already wrote to disk when the request is rejected before any DB row references them
    const rejectUpload = (statusCode, error) => {
      cleanupUploadedFiles(req.files);
      return res.status(statusCode).json({ error });
    };
    let client = null;
    let committed = false;
    try {
      if (!req.files || req.files.length === 0) {
        return rejectUpload(400, 'No files uploaded.');
      }
      if (entity_type === 'Order') {
        if (await isOrderOnHold(entity_id)) {
          return rejectUpload(400, 'Order is currently on hold. Document uploads are disabled.');
        }
      } else if (entity_type === 'Unit') {
        if (await isUnitOnHold(entity_id)) {
          return rejectUpload(400, 'Order is currently on hold. Document uploads are disabled.');
        }
      }
      if (doc_type === 'PO') {
        const canUploadPo = ['Sales', 'Admin', 'Manager'].includes(req.user.role);
        if (!canUploadPo) {
          return rejectUpload(403, 'Forbidden: Only Sales, Admin, and Manager roles can upload PO documents.');
        }
      }
      if (doc_type === 'PO' || doc_type === 'Quotation') {
        if (req.files.length > 1) {
          return rejectUpload(400, `${doc_type} can only be a single file.`);
        }
        const existing = await pool.query(
          'SELECT id FROM documents WHERE entity_type = $1 AND entity_id = $2 AND doc_type = $3 LIMIT 1',
          [entity_type, entity_id, doc_type]
        );
        if (existing.rows.length > 0) {
          return rejectUpload(400, `A ${doc_type} already exists. Delete it first.`);
        }
      }

      client = await pool.connect();
      await client.query('BEGIN');

      let hasPO = false;
      let orderIdForLog = null;
      if (entity_type === 'Order') {
        orderIdForLog = entity_id;
      } else if (entity_type === 'Unit') {
        const unitRes = await client.query('SELECT order_id FROM order_units WHERE id = $1', [entity_id]);
        orderIdForLog = unitRes.rows[0]?.order_id || null;
      }
      if (orderIdForLog) await lockOrders(client, [orderIdForLog]);

      for (const file of req.files) {
        const result = await client.query(
          `INSERT INTO documents (entity_type, entity_id, doc_type, file_name, file_path, file_size, mime_type, uploaded_by) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
          [entity_type, entity_id, doc_type || 'General', file.originalname, file.path, file.size, file.mimetype, req.user.id]
        );
        savedDocs.push(result.rows[0]);
        if (doc_type === 'PO') {
          hasPO = true;
        }
        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, orderIdForLog, req.user.role, `Uploaded document "${file.originalname}" (${doc_type || 'General'})`]
        );
      }

      if (hasPO && entity_type === 'Order') {
        const poNum = req.body.po_number;
        if (poNum && poNum.trim()) {
          await client.query('UPDATE orders SET po_number = $1 WHERE id = $2', [poNum.trim(), entity_id]);
        } else if (req.files && req.files.length > 0) {
          const defaultName = req.files[0].originalname.replace(/\.[^/.]+$/, '').trim();
          await client.query(
            `UPDATE orders SET po_number = $1 WHERE id = $2 AND (po_number IS NULL OR po_number = '')`,
            [defaultName, entity_id]
          );
        }

        const updatedStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        await client.query(
          `UPDATE order_steps SET status = 'done', notes = $1, updated = $2 WHERE order_id = $3 AND name = 'Upload PO'`,
          ['PO uploaded via Documents.', updatedStr, entity_id]
        );
        await client.query(
          `INSERT INTO activity_logs (user_id, order_id, dept, action_text) VALUES ($1, $2, $3, $4)`,
          [req.user.id, entity_id, 'Sales', 'Completed: Upload PO (System Auto-Check on Upload)']
        );
        const uRes = await client.query('SELECT id FROM order_units WHERE order_id = $1', [entity_id]);
        for (const u of uRes.rows) {
          await tryInSavepoint(client, 'upload_order_po_derive', () => deriveUnitStatus(u.id, client));
        }
      }

      if (hasPO && entity_type === 'Unit' && savedDocs.length > 0) {
        const poDoc = savedDocs[0];
        const poNum = req.body.po_number;
        if (poNum && poNum.trim()) {
          await client.query(
            'UPDATE order_units SET po_doc_id = $1, po_number = $2, po_override_unlinked = false WHERE id = $3',
            [poDoc.id, poNum.trim(), entity_id]
          );
        } else {
          await client.query(
            'UPDATE order_units SET po_doc_id = $1, po_override_unlinked = false WHERE id = $2',
            [poDoc.id, entity_id]
          );
        }
        await tryInSavepoint(client, 'upload_unit_po_derive', () => deriveUnitStatus(entity_id, client));
      }

      const isDesignDoc = ['drawing', 'bom', 'bill of materials'].includes(String(doc_type || '').toLowerCase());
      if (isDesignDoc) {
        if (entity_type === 'Unit') {
          await syncUnitDesignDocumentStatus(client, entity_id, req.user.id);
        } else if (entity_type === 'Order') {
          const uList = await client.query('SELECT id FROM order_units WHERE order_id = $1', [entity_id]);
          for (const u of uList.rows) {
            await syncUnitDesignDocumentStatus(client, u.id, req.user.id);
          }
        }
      }

      await client.query('COMMIT');
      committed = true;

      res.status(201).json(savedDocs);
    } catch (err) {
      console.error(err);
      // Nothing was committed, so no document row references these files.
      if (!committed) cleanupUploadedFiles(req.files);
      res.status(500).json({ error: 'Failed to upload documents' });
    } finally {
      if (client) {
        if (!committed) await client.query('ROLLBACK').catch(() => {});
        client.release();
      }
    }
  });

  router.get('/directory', authorize(), async (req, res) => {
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

  router.get('/:entityType/:entityId', authorize(), async (req, res) => {
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

  router.post('/ticket', authorize(), async (req, res) => {
    const { file } = req.body;
    if (!file || typeof file !== 'string') {
      return res.status(400).json({ error: 'File name is required' });
    }
    const safeName = path.basename(file).replace(/\0/g, '');
    const ticket = jwt.sign(
      { sub: 'download', file: safeName, userId: req.user.id },
      JWT_SECRET,
      { expiresIn: '60s' }
    );
    res.json({ ticket });
  });

  router.delete('/:id', authorize(), async (req, res) => {
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

      const isDesignDoc = ['drawing', 'bom', 'bill of materials'].includes(String(doc.doc_type || '').toLowerCase());
      if (isDesignDoc) {
        if (doc.entity_type === 'Unit') {
          await syncUnitDesignDocumentStatus(pool, doc.entity_id, req.user.id);
        } else if (doc.entity_type === 'Order') {
          const uList = await pool.query('SELECT id FROM order_units WHERE order_id = $1', [doc.entity_id]);
          for (const u of uList.rows) {
            await syncUnitDesignDocumentStatus(pool, u.id, req.user.id);
          }
        }
      }

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  });

  return router;
}
