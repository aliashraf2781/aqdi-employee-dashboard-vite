import { apiClient } from '@/shared/lib/api-client';

export async function fetchSettingsRecord(endpoint) {
  const { data } = await apiClient.get(endpoint);
  return data;
}

export async function saveSettingsRecord(endpoint, payload) {
  const { data } = await apiClient.post(endpoint, payload);
  return data;
}
