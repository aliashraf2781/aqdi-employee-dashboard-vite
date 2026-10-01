import { apiClient } from '@/shared/lib/api-client';
import { extractPayments, mapPaymentToInvoice } from '../lib/invoice-mapper';

const PAYMENTS_URL = '/admin/payments';
// The whole list is loaded once so search and filters work across every record;
// paging happens in the browser over the filtered rows.
const PAYMENTS_FETCH_LIMIT = 500;

export async function fetchInvoices() {
  const { data } = await apiClient.get(PAYMENTS_URL, { params: { page: 1, per_page: PAYMENTS_FETCH_LIMIT } });
  return extractPayments(data).map(mapPaymentToInvoice);
}
