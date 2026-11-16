import { useEffect, useState } from 'react';

/**
 * Helpers for opening / embedding files served from /uploads without putting the
 * user's JWT in the URL. Each URL carries a short-lived (60s) download ticket minted
 * by POST /api/documents/ticket, so tickets must always be fetched on demand.
 */

/**
 * Resolve the path relative to uploads/ from a string or a document-like object
 * (doc.file_path / doc.filePath / doc.file_name).
 */
export function resolveUploadPath(docOrPath) {
  if (!docOrPath) return '';
  let raw = '';
  if (typeof docOrPath === 'string') {
    raw = docOrPath;
  } else if (typeof docOrPath === 'object') {
    raw = docOrPath.file_path || docOrPath.filePath || docOrPath.file_name || '';
  }
  if (!raw || typeof raw !== 'string') return '';

  // Strip query string / hash and normalise separators
  let p = raw.split(/[?#]/)[0].replace(/\\/g, '/');

  // Absolute URL -> keep its pathname
  if (/^https?:\/\//i.test(p)) {
    try { p = new URL(p).pathname; } catch { /* ignore */ }
  }

  // Keep only what comes after the last "uploads/" segment, if any
  const idx = p.lastIndexOf('uploads/');
  if (idx !== -1) {
    p = p.slice(idx + 'uploads/'.length);
  } else {
    // Absolute disk path without an uploads/ segment: fall back to basename
    if (p.startsWith('/') || /^[a-zA-Z]:\//.test(p)) p = p.split('/').pop();
  }

  // Drop leading slashes and any traversal segments
  return p
    .split('/')
    .filter((seg) => seg && seg !== '.' && seg !== '..')
    .join('/');
}

function encodeRelPath(rel) {
  return rel.split('/').map((seg) => encodeURIComponent(seg)).join('/');
}

/**
 * Fetch a fresh download ticket and return a signed /uploads URL.
 * Throws if the path cannot be resolved or the ticket request fails.
 */
export async function getSignedUploadUrl(docOrPath) {
  const rel = resolveUploadPath(docOrPath);
  if (!rel) throw new Error('No file path to open');

  const token = localStorage.getItem('token');
  const res = await fetch(`${window.API_BASE}/api/documents/ticket`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ file: rel.split('/').pop() }),
  });
  if (!res.ok) throw new Error(`Failed to get download ticket (${res.status})`);
  const data = await res.json();
  if (!data?.ticket) throw new Error('Download ticket missing from response');

  return `${window.API_BASE}/uploads/${encodeRelPath(rel)}?ticket=${encodeURIComponent(data.ticket)}`;
}

/**
 * Open an uploaded file in a new tab. The window is opened synchronously (so popup
 * blockers treat it as user-initiated), detached from this page, then navigated to
 * the signed URL. On failure the blank window is closed.
 */
export async function openProtectedUpload(docOrPath) {
  const win = window.open('about:blank', '_blank');
  if (win) {
    try { win.opener = null; } catch { /* ignore */ }
  }
  try {
    const url = await getSignedUploadUrl(docOrPath);
    if (win && !win.closed) {
      win.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    return url;
  } catch (err) {
    if (win && !win.closed) win.close();
    console.error('Failed to open protected upload:', err);
    throw err;
  }
}

/**
 * Trigger a browser download of an uploaded file (same-origin, so the
 * `download` attribute is honoured) using a freshly signed URL.
 */
export async function downloadProtectedUpload(docOrPath, fileName) {
  const url = await getSignedUploadUrl(docOrPath);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName
    || (docOrPath && typeof docOrPath === 'object' && docOrPath.file_name)
    || resolveUploadPath(docOrPath).split('/').pop();
  a.rel = 'noopener noreferrer';
  document.body.appendChild(a);
  a.click();
  a.remove();
  return url;
}

/**
 * React hook returning { url, loading, error } for an uploaded file, suitable for
 * <iframe>, <img> or viewers. Re-fetches whenever the resolved path changes.
 */
export function useSignedUploadUrl(docOrPath) {
  const key = resolveUploadPath(docOrPath);
  const [state, setState] = useState({ url: null, loading: !!key, error: null });

  useEffect(() => {
    if (!key) {
      setState({ url: null, loading: false, error: null });
      return undefined;
    }
    let cancelled = false;
    setState({ url: null, loading: true, error: null });
    getSignedUploadUrl(key)
      .then((url) => { if (!cancelled) setState({ url, loading: false, error: null }); })
      .catch((error) => { if (!cancelled) setState({ url: null, loading: false, error }); });
    return () => { cancelled = true; };
  }, [key]);

  return state;
}
