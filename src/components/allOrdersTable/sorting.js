// Row comparison for the All Orders table.
//
// - Blank values (empty text, missing dates, NaN) always sort last, in either direction.
// - Text compares "naturally" and case-insensitively, so "500 + 200 x 400" comes before
//   "1200 + 200 x 800" and "VT3+075" before "VT3+300".
// - Rows that tie on the sort column fall back to order number, then serial (both ascending, even
//   when the primary sort is descending) so equal values never appear in arbitrary order.

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

// Unit status in progress order; exceptions follow. Unknown labels sort after these.
const STATUS_SORT_ORDER = {
  Pending: 0,
  'In Progress': 1,
  Completed: 2,
  Blocked: 3,
  Hold: 4,
  Cancelled: 5
};

const isBlank = (v) => v === '' || v == null || v === Infinity || (typeof v === 'number' && Number.isNaN(v));

const compareSortValues = (av, bv, dir) => {
  const aBlank = isBlank(av);
  const bBlank = isBlank(bv);
  if (aBlank || bBlank) return aBlank === bBlank ? 0 : (aBlank ? 1 : -1);
  const c = (typeof av === 'number' && typeof bv === 'number') ? av - bv : collator.compare(String(av), String(bv));
  return dir === 'asc' ? c : -c;
};

const serialOf = (u) => u.unit_serial ?? u.short_serial ?? u.unit_id ?? '';

const compareRowIdentity = (a, b) =>
  collator.compare(String(a.order_number ?? ''), String(b.order_number ?? '')) ||
  collator.compare(String(serialOf(a)), String(serialOf(b)));

export { STATUS_SORT_ORDER, compareSortValues, compareRowIdentity };
