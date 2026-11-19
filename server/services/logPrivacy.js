/**
 * Masks a login identifier (email or username) for the server log. It keeps the first character and
 * the email domain, so an account stays recognisable without writing the address in full:
 * "someone@gmail.com" -> "s***@gmail.com", "admin" -> "a***", nothing -> "(none)".
 *
 * The value comes straight from the login request, so anything other than visible ASCII (spaces,
 * line breaks, control characters) becomes "?" and the domain is cut to 100 characters: a crafted
 * login name cannot add fake lines to the log.
 */
export function maskLoginId(value) {
  if (typeof value !== 'string' || value === '') return '(none)';
  const visible = (s) => s.replace(/[^\x21-\x7E]/g, '?');
  const at = value.indexOf('@');
  if (at === -1) return `${visible(value[0])}***`;
  const first = at > 0 ? visible(value[0]) : '';
  return `${first}***@${visible(value.slice(at + 1)).slice(0, 100)}`;
}
