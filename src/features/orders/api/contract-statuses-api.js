import { apiClient } from '@/shared/lib/api-client';
import { extractContractStatusItems } from '../lib/contract-statuses';

const CONTRACT_STATUSES_API = '/admin/contract-statuses';
const ACTIVE_CONTRACT_STATUSES_API = '/admin/contract-statuses/active';

export async function fetchContractStatuses({ activeOnly = true } = {}) {
  const { data } = await apiClient.get(activeOnly ? ACTIVE_CONTRACT_STATUSES_API : CONTRACT_STATUSES_API);
  return extractContractStatusItems(data);
}

/** Creates a status, or updates it when `id` is given. */
export async function saveContractStatus({ id, payload }) {
  const url = id ? `${CONTRACT_STATUSES_API}/${id}` : CONTRACT_STATUSES_API;
  const { data } = await apiClient.post(url, payload);
  return data;
}
