import { openProtectedUpload } from '../../utils/protectedUploads';

// Unsigned /uploads path for a document. It carries NO credentials: to open or
// embed a file use openProtectedUpload / useSignedUploadUrl, which add a
// short-lived download ticket.
export const getDocUrl = (doc) => {
  if (!doc) return '#';
  let pathStr = typeof doc === 'string' ? doc : (doc.file_path || doc.filePath || doc.file_name || '');
  if (!pathStr) return '#';

  pathStr = pathStr.replace(/\\/g, '/');
  const uploadsIdx = pathStr.indexOf('uploads/');
  let relPath = '';
  if (uploadsIdx !== -1) {
    relPath = pathStr.substring(uploadsIdx + 8);
  } else {
    relPath = pathStr.split('/').pop();
  }
  relPath = relPath.replace(/^\/+/, '');

  const baseUrl = window.API_BASE || '';

  return `${baseUrl}/uploads/${relPath}`;
};

const openUploadSafely = (doc) => {
  openProtectedUpload(doc).catch(() => { /* already logged by openProtectedUpload */ });
};

export { openUploadSafely };
