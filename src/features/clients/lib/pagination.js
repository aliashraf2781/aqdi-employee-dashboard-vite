/** Page window for an in-memory list. `page` is 1-based and is clamped into range. */
export function paginate(items, page, pageSize) {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(Math.max(1, page), lastPage);
  const startIndex = (currentPage - 1) * pageSize;

  return {
    items: items.slice(startIndex, startIndex + pageSize),
    currentPage,
    lastPage,
    ...describeRange(currentPage, pageSize, total),
  };
}

/** The "showing start-end of total" numbers (both 0 for an empty list). */
export function describeRange(page, pageSize, total) {
  if (total === 0) return { start: 0, end: 0 };
  return { start: (page - 1) * pageSize + 1, end: Math.min(page * pageSize, total) };
}
