/**
 * Normalizes GET /admin/employees responses.
 * The backend has shipped both `{ data: { items, pagination } }` and the Laravel
 * paginator shape `{ data: { data: [...], current_page, last_page } }`.
 */
export function normalizeEmployeesResponse(body) {
  const root = body?.data ?? body;

  return {
    items: pickItems(root, body),
    pagination: pickPagination(root, body),
  };
}

function pickItems(root, body) {
  const candidates = [root?.items, root?.data?.items, root?.data, root, body?.items];
  return candidates.find(Array.isArray) ?? [];
}

function pickPagination(root, body) {
  const nested = root?.pagination ?? body?.pagination ?? root?.meta ?? body?.meta;
  if (nested) return nested;

  const isLaravelPaginator = root && !Array.isArray(root) && (root.last_page != null || root.current_page != null);
  if (!isLaravelPaginator) return null;

  return {
    current_page: root.current_page ?? 1,
    last_page: root.last_page ?? 1,
    total: root.total ?? 0,
    per_page: root.per_page ?? 0,
  };
}
