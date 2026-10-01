import { apiClient } from '@/shared/lib/api-client';
import { pickItems, pickLastPage, pickTotal } from '@/features/settings/lib/list-response';

const PAYMENTS_PER_PAGE = 20;

/** One page of payments for a period filter (today / month / year). */
export async function fetchPayments({ page, period }) {
  const { data } = await apiClient.get('/admin/payments', {
    params: { per_page: PAYMENTS_PER_PAGE, page, filter: period },
  });
  return { rows: pickItems(data), lastPage: pickLastPage(data), total: pickTotal(data) };
}
