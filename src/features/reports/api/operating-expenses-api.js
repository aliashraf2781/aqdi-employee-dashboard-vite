import { apiClient } from '@/shared/lib/api-client';

const OPERATING_EXPENSES_URL = '/admin/operating-expenses';
const ALL = 'all';

export async function fetchOperatingExpenses({ search, createdAt, page, perPage }) {
  const params = { page, per_page: perPage };
  if (search) params.search = search;
  if (createdAt && createdAt !== ALL) params.created_at = createdAt;

  const { data } = await apiClient.get(OPERATING_EXPENSES_URL, { params });
  return data?.data;
}

/** Body: { expense, amount }. */
export function createOperatingExpense(payload) {
  return apiClient.post(OPERATING_EXPENSES_URL, payload);
}

export function updateOperatingExpense({ id, ...payload }) {
  return apiClient.put(`${OPERATING_EXPENSES_URL}/${id}`, payload);
}

export function deleteOperatingExpense(id) {
  return apiClient.delete(`${OPERATING_EXPENSES_URL}/${id}`);
}
