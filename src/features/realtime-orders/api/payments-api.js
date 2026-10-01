import { apiClient } from '@/shared/lib/api-client';

const PAYMENTS_URL = '/admin/payments';
export const PAYMENTS_PER_PAGE = 20;

/** One page of today's payments. */
export async function fetchTodayPayments(page) {
  const { data } = await apiClient.get(PAYMENTS_URL, { params: { page, per_page: PAYMENTS_PER_PAGE, filter: 'today' } });
  const payload = data?.data ?? data;
  return {
    items: Array.isArray(payload?.items) ? payload.items : [],
    pagination: payload?.pagination ?? null,
  };
}
