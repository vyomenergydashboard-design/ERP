/**
 * SET clauses for the fields a request actually sent.
 *
 * A save that leaves a field out must not touch that column, while a field sent with an empty
 * value ('' or null) clears it on purpose. The Planning screen saves a custom-column edit by sending
 * only `custom_fields`; writing every column from the request used to empty the row's planning
 * dates.
 *
 * `fields` is a fixed list of column names written by the caller, never request input. Values are
 * parameterised, numbered from `$firstParamIndex`.
 *
 * @returns {{ clauses: string[], values: any[] }} e.g. clauses ['qc_date = $5'], values [null]
 */
export function sentFieldAssignments(body, fields, firstParamIndex) {
  const sent = body || {};
  const clauses = [];
  const values = [];
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(sent, field)) {
      clauses.push(`${field} = $${firstParamIndex + values.length}`);
      values.push(sent[field] || null);
    }
  }
  return { clauses, values };
}
