// Multer upload handling: file-type allowlist, sanitised disk names in server/uploads, and
// best-effort cleanup of files written for a rejected request.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const SERVER_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

// Best-effort removal of multer-written files for a rejected upload request.
export const cleanupUploadedFiles = (files) => {
  let list = [];
  if (Array.isArray(files)) list = files;
  else if (files && typeof files.path === 'string') list = [files]; // req.file (single)
  else if (files && typeof files === 'object') list = Object.values(files).flat(); // upload.fields map
  for (const f of list) {
    if (!f || !f.path) continue;
    fs.unlink(f.path, (err) => {
      if (err && err.code !== 'ENOENT') console.warn('Failed to remove rejected upload:', f.path, err.message);
    });
  }
};

const sanitizeOriginalFileName = (originalName) => {
  if (!originalName) return 'unnamed_file';
  // Strip null bytes, path traversal, and hazardous characters
  const base = path.basename(originalName).replace(/\0/g, '');
  return base.replace(/[^a-zA-Z0-9._-]/g, '_');
};

// Upload allowlist: extension -> accepted MIME types. Anything not listed is rejected.
// HTML/SVG/scripts/executables are intentionally absent.
const OCTET = 'application/octet-stream';
const ZIP_MIMES = ['application/zip', 'application/x-zip-compressed', 'application/x-zip', 'multipart/x-zip'];
const ALLOWED_UPLOAD_TYPES = Object.freeze({
  '.pdf': ['application/pdf', 'application/x-pdf', OCTET],
  '.xlsx': ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', ...ZIP_MIMES, OCTET],
  '.xls': ['application/vnd.ms-excel', 'application/msexcel', 'application/x-msexcel', 'application/x-excel', OCTET],
  '.csv': ['text/csv', 'application/csv', 'text/plain', 'text/comma-separated-values', 'application/vnd.ms-excel', OCTET],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', ...ZIP_MIMES, OCTET],
  '.doc': ['application/msword', OCTET],
  '.txt': ['text/plain', OCTET],
  '.png': ['image/png'],
  '.jpg': ['image/jpeg', 'image/pjpeg'],
  '.jpeg': ['image/jpeg', 'image/pjpeg'],
  '.webp': ['image/webp'],
  '.dwg': ['image/vnd.dwg', 'image/x-dwg', 'application/acad', 'application/x-acad', 'application/autocad_dwg', 'application/dwg', 'application/x-dwg', 'drawing/dwg', OCTET],
  '.dxf': ['image/vnd.dxf', 'image/x-dxf', 'application/dxf', 'application/x-dxf', 'text/plain', OCTET],
  '.step': ['application/step', 'model/step', 'application/x-step', 'text/plain', OCTET],
  '.stp': ['application/step', 'model/step', 'application/x-step', 'text/plain', OCTET],
  '.zip': [...ZIP_MIMES, OCTET],
});

const uploadRejection = (message) => {
  const err = new Error(message);
  err.code = 'UPLOAD_TYPE_REJECTED';
  return err;
};

const uploadFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname || '').toLowerCase();
  const allowedMimes = ALLOWED_UPLOAD_TYPES[ext];
  if (!allowedMimes) {
    return cb(uploadRejection(`File type '${ext || 'unknown'}' is not permitted. Allowed: ${Object.keys(ALLOWED_UPLOAD_TYPES).join(', ')}`));
  }
  const mime = String(file.mimetype || '').toLowerCase();
  if (!allowedMimes.includes(mime)) {
    return cb(uploadRejection(`MIME type '${mime || 'unknown'}' does not match file extension '${ext}'.`));
  }
  cb(null, true);
};

// Multer Configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(SERVER_DIR, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeName = sanitizeOriginalFileName(file.originalname);
    cb(null, uniqueSuffix + '-' + safeName);
  }
});

export const upload = multer({
  storage: storage,
  fileFilter: uploadFileFilter,
  // Browsers send file names as UTF-8; multer's default (latin1) garbles e.g. "ñ" or Hindi names.
  defParamCharset: 'utf8',
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB total limit
});
