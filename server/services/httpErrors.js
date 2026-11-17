/**
 * Decide what error text is safe to send to the browser.
 *
 * Deliberate application errors — `throw new Error('Human readable reason')` — are shown as-is.
 * Database (pg) errors, Node system errors and programming errors (TypeError etc.) can expose
 * SQL, constraint/table names or file paths, so the caller's generic fallback is used instead.
 * The full error should still be logged server-side by the caller.
 */
const PROGRAMMING_ERRORS = [TypeError, ReferenceError, SyntaxError, RangeError];

export const publicErrorMessage = (err, fallback = 'Internal server error') => {
  if (!err || typeof err.message !== 'string' || err.message.length === 0) return fallback;

  const isDatabaseError = err.severity !== undefined || /^[0-9A-Z]{5}$/.test(String(err.code || ''));
  if (isDatabaseError) {
    // Unique violation: useful to the user, and safe without the constraint details.
    return err.code === '23505' ? `${fallback}: a record with this value already exists.` : fallback;
  }

  const isSystemError = err.errno !== undefined || err.syscall !== undefined;
  const isProgrammingError = PROGRAMMING_ERRORS.some((Type) => err instanceof Type);
  return isSystemError || isProgrammingError ? fallback : err.message;
};
