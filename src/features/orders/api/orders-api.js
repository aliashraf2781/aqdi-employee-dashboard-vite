import { apiClient } from '@/shared/lib/api-client';
import { extractOrdersPayload } from '../lib/admin-orders-query';

export const ADMIN_ORDERS_API = '/admin/orders';
export const RECEIVED_CONTRACTS_API = '/admin/received-contracts';
export const DEFAULT_RECEIVE_NOTES = 'تم الاستلام';

/** One page of GET /admin/orders. */
export async function fetchAdminOrders(params) {
  const { data } = await apiClient.get(ADMIN_ORDERS_API, { params });
  const { items, pagination, summary } = extractOrdersPayload(data);
  return { items, pagination, summary, total: pagination?.total ?? items.length };
}

/** Only the total of orders in a status (a one-row page is enough). */
export async function fetchOrdersTotalByStatus(statusId) {
  const { pagination } = await fetchAdminOrders({ status_id: statusId, per_page: 1, page: 1 });
  return pagination?.total ?? 0;
}

/** The full order payload used by the detail page, printing and dialogs. */
export async function fetchOrder(orderId) {
  const { data } = await apiClient.get(`${ADMIN_ORDERS_API}/${orderId}`);
  return data?.data ?? data;
}

/** POST /admin/orders/{id}: accepts any updatable order field. */
export async function updateOrder(orderId, body) {
  if (orderId == null || orderId === '') throw new Error('تعذر تحديد الطلب');
  const { data } = await apiClient.post(`${ADMIN_ORDERS_API}/${orderId}`, body);
  return data;
}

export function getReceiveContractId(order) {
  return order?.id ?? order?.contract_id ?? null;
}

export async function receiveContract(order, { notes = DEFAULT_RECEIVE_NOTES } = {}) {
  const contractId = getReceiveContractId(order);
  if (contractId == null || contractId === '') throw new Error('معرّف العقد غير موجود');
  const { data } = await apiClient.post(RECEIVED_CONTRACTS_API, { contract_id: contractId, notes });
  return data;
}

/**
 * Walks every page (100 rows each) of a list URL builder and returns all rows.
 * `extractPage(responseBody)` must return `{ items, lastPage }`.
 */
export async function fetchAllPages(buildUrl, extractPage = extractStandardPage) {
  const perPage = 100;
  const withPerPage = (url) => `${url}${url.includes('?') ? '&' : '?'}per_page=${perPage}`;

  const first = extractPage((await apiClient.get(withPerPage(buildUrl(1)))).data);
  const items = [...first.items];

  for (let page = 2; page <= first.lastPage; page += 1) {
    const next = extractPage((await apiClient.get(withPerPage(buildUrl(page)))).data);
    items.push(...next.items);
  }
  return items;
}

export function extractStandardPage(body) {
  return { items: body?.data?.items ?? [], lastPage: body?.data?.pagination?.last_page ?? 1 };
}

export function buildAdminOrdersUrl(params) {
  const search = new URLSearchParams();
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value != null && value !== '') search.set(key, String(value));
  });
  const query = search.toString();
  return query ? `${ADMIN_ORDERS_API}?${query}` : ADMIN_ORDERS_API;
}
