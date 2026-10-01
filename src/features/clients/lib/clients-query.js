export const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 100;

function isFlagSet(value) {
  return value === true || value === 1 || value === '1';
}

function isActiveFlag(value) {
  return value === 0 || value === 1 || value === '0' || value === '1';
}

/**
 * Query string for `GET /admin/users` and `GET /admin/users/export`.
 * `platform=website` includes website signups and rows with an empty platform.
 */
export function buildClientsQueryParams({
  page,
  perPage,
  search = '',
  platform = '',
  createdAt = '',
  isActive,
  banned,
} = {}) {
  const params = {};
  if (page != null) params.page = page;
  if (perPage != null) params.per_page = Math.min(MAX_PAGE_SIZE, Number(perPage) || DEFAULT_PAGE_SIZE);
  if (search) params.search = search;
  if (platform && platform !== 'all') params.platform = platform;
  if (createdAt && createdAt !== 'all') params.created_at = createdAt;
  if (isActiveFlag(isActive)) params.is_active = isActive;
  if (isFlagSet(banned)) params.banned = 1;
  return params;
}

/** Same filters as the list, minus pagination: the export always covers every match. */
export function buildExportQueryParams(filters = {}) {
  return buildClientsQueryParams({ ...filters, page: undefined, perPage: undefined });
}

/** Maps the status dropdown value to the API's `is_active` / `banned` filters. */
export function statusFilterToParams(status) {
  if (status === 'active') return { isActive: 1 };
  if (status === 'inactive') return { isActive: 0 };
  if (status === 'banned') return { banned: 1 };
  return {};
}
