import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { upload } from '../services/uploads.js';
import { syncUnitDesignDocumentStatus } from '../services/unitStatus.js';

const SERVER_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Router for Part Number Masters (mounted at /api/part-number-masters): the part list plus
 * its revisioned Drawing / BOM documents. Uploading or deleting a document re-syncs the
 * Design 'Release Documents' step of every unit with that part number.
 * Read: any logged-in user. Create/update/upload: Admin, Manager, Design, Sales.
 * Delete part: Admin, Manager, Design.
 */
export default function createPartNumberMastersRouter(pool, authorize) {
  const router = express.Router();

  router.get('/', authorize(), async (req, res) => {
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

  router.post('/', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
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

  router.put('/:id', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
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

  router.delete('/:id', authorize(['Admin', 'Manager', 'Design']), async (req, res) => {
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

  router.post('/:id/documents', authorize(['Admin', 'Manager', 'Design', 'Sales']), upload.any(), async (req, res) => {
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
            try { fs.unlinkSync(file.path); } catch (e) { }
            return res.status(400).json({ error: 'For BOM, only Excel (.xlsx, .xls, .csv) and PDF files are allowed.' });
          }
        } else {
          const isPdfExt = ext === '.pdf';
          if (!isPdfExt) {
            // Cleanup uploaded files
            try { fs.unlinkSync(file.path); } catch (e) { }
            return res.status(400).json({ error: 'Only PDF files are allowed for Drawings.' });
          }
        }
      }

      const insertedDocs = [];
      for (const file of files) {
        const relPath = path.relative(path.join(SERVER_DIR, 'uploads'), file.path);

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

      try {
        const uRes = await pool.query(
          `SELECT ou.id FROM order_units ou 
           JOIN order_line_items oli ON ou.line_item_id = oli.id 
           WHERE LOWER(TRIM(oli.part_number)) = LOWER(TRIM($1))`,
          [partCheck.rows[0].part_number]
        );
        for (const u of uRes.rows) {
          await syncUnitDesignDocumentStatus(pool, u.id, req.user.id);
        }
      } catch (sErr) {
        console.warn('syncUnitDesignDocumentStatus warn in part master upload:', sErr);
      }

      res.json(insertedDocs.length === 1 ? insertedDocs[0] : insertedDocs);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to upload Part Number document' });
    }
  });

  router.get('/:id/documents/:docType/history', authorize(), async (req, res) => {
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

  router.delete('/:id/documents/:docId', authorize(['Admin', 'Manager', 'Design', 'Sales']), async (req, res) => {
    try {
      const deleted = await pool.query('DELETE FROM part_number_documents WHERE id = $1 AND part_number_id = $2 RETURNING *', [req.params.docId, req.params.id]);
      if (deleted.rows.length === 0) return res.status(404).json({ error: 'Document not found' });

      const doc = deleted.rows[0];

      // Remove the uploaded file too, unless another row still points at it (matched by file name,
      // like cleanup_orphan_uploads.js). part_number_documents.file_path is relative to uploads/.
      // A failure here must not turn the (already committed) row delete into an error.
      if (doc.file_path) {
        try {
          const uploadsDir = path.resolve(SERVER_DIR, 'uploads');
          const target = path.resolve(uploadsDir, doc.file_path);
          const baseName = path.basename(String(doc.file_path).replace(/\\/g, '/'));
          const stillUsed = await pool.query(
            `SELECT 1 FROM part_number_documents WHERE right(file_path, length($1)) = $1
             UNION ALL
             SELECT 1 FROM documents WHERE right(file_path, length($1)) = $1
             LIMIT 1`,
            [baseName]
          );
          if (stillUsed.rows.length === 0 && target.startsWith(uploadsDir + path.sep) && fs.existsSync(target)) {
            fs.unlinkSync(target);
          }
        } catch (fErr) {
          console.warn('Could not remove part-number document file:', fErr);
        }
      }

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

      try {
        const partCheck = await pool.query('SELECT part_number FROM part_number_masters WHERE id = $1', [req.params.id]);
        if (partCheck.rows.length > 0) {
          const uRes = await pool.query(
            `SELECT ou.id FROM order_units ou 
             JOIN order_line_items oli ON ou.line_item_id = oli.id 
             WHERE LOWER(TRIM(oli.part_number)) = LOWER(TRIM($1))`,
            [partCheck.rows[0].part_number]
          );
          for (const u of uRes.rows) {
            await syncUnitDesignDocumentStatus(pool, u.id, req.user.id);
          }
        }
      } catch (sErr) {
        console.warn('syncUnitDesignDocumentStatus warn in part master delete:', sErr);
      }

      res.json(deleted.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete document' });
    }
  });

  return router;
}
