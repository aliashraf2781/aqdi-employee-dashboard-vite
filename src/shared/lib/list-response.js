/**
 * The backend wraps lists in a few different envelopes depending on the endpoint.
 * These helpers hide that so the rest of the code always works with plain arrays.
 */
export function pickItems(body) {
  if (Array.isArray(body?.data?.items)) return body.data.items;
  if (Array.isArray(body?.items)) return body.items;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body)) return body;
  return [];
}

/** Last page number of a paginated response, or null when the list is not paginated. */
export function pickLastPage(body) {
  return body?.data?.pagination?.last_page ?? body?.pagination?.last_page ?? null;
}

/** Total row count of a paginated response, or null. */
export function pickTotal(body) {
  return body?.data?.pagination?.total ?? body?.pagination?.total ?? null;
}
