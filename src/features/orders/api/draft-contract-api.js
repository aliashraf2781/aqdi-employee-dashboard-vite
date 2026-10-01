import { apiClient } from '@/shared/lib/api-client';
import { extractDraftStatusItems } from '../lib/draft-order';

export async function fetchActiveDraftStatuses() {
  const { data } = await apiClient.get('/admin/draft-contract-statuses/active');
  return extractDraftStatusItems(data);
}

/** Sets the draft status and/or the draft contract number of an order. */
export async function updateDraftContract(orderId, body) {
  const { data } = await apiClient.post(`/admin/orders/${orderId}/draft-contract-status`, body);
  return data;
}
