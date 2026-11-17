// Shared way to call the backend.
//
// apiFetch(path, options) behaves exactly like fetch() and returns the same Response, so
// existing `res.ok` / `res.json()` handling keeps working. It only adds two things:
//   - the API base: '/api/...' and '/uploads/...' paths are prefixed with window.API_BASE
//     (absolute http(s) URLs are left alone), and
//   - the login token: `Authorization: Bearer <token>` from localStorage, read at call time,
//     unless the caller already set an Authorization header.
// 401 responses are still handled globally by the fetch interceptor in src/main.jsx.

const resolveUrl = (path) => {
  if (typeof path !== 'string' || /^https?:\/\//i.test(path) || !path.startsWith('/')) return path;
  const base = window.API_BASE || '';
  return base && path.startsWith(base) ? path : base + path;
};

export const apiFetch = (path, options = {}) => {
  const headers = new Headers(options.headers || {});
  const token = localStorage.getItem('token');
  if (token && !headers.has('Authorization')) headers.set('Authorization', `Bearer ${token}`);
  return fetch(resolveUrl(path), { ...options, headers });
};
