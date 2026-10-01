import { buildAdminOrdersParams, fetchAdminOrders } from '@/features/orders';

const NEW_ORDERS_PER_PAGE = 100;
// A safety net: the strip only needs the oldest waiting orders, not an endless history.
const MAX_PAGES = 5;

const fetchPage = (statusId, page) =>
  fetchAdminOrders(buildAdminOrdersParams({ page, perPage: NEW_ORDERS_PER_PAGE, contractStatusId: statusId }));

/** Every order in the "new" status (up to MAX_PAGES pages), with the summary the API sends on the first page. */
export async function fetchNewOrders(statusId) {
  const first = await fetchPage(statusId, 1);
  const lastPage = Math.min(first.pagination?.last_page ?? 1, MAX_PAGES);
  if (lastPage <= 1) return first;

  const otherPageNumbers = Array.from({ length: lastPage - 1 }, (_, index) => index + 2);
  const otherPages = await Promise.all(otherPageNumbers.map((page) => fetchPage(statusId, page)));

  const items = [first, ...otherPages].flatMap((page) => page.items);
  return { ...first, items, total: first.pagination?.total ?? items.length };
}
