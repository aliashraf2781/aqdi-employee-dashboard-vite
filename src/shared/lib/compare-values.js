function isMissing(value) {
  return value == null || value === '' || Number.isNaN(value);
}

/**
 * Comparator used by sortable tables. Missing values sort first on purpose:
 * an order without a received date needs attention before the others.
 */
export function compareValues(a, b, direction = 'asc') {
  const aMissing = isMissing(a);
  const bMissing = isMissing(b);
  if (aMissing && bMissing) return 0;
  if (aMissing) return -1;
  if (bMissing) return 1;

  let result;
  if (typeof a === 'number' && typeof b === 'number') {
    result = a - b;
  } else {
    result = String(a).localeCompare(String(b), 'ar');
  }
  return direction === 'desc' ? -result : result;
}
