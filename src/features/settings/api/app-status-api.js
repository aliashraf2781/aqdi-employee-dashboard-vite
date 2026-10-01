import { apiClient } from '@/shared/lib/api-client';
import { APP_STATUS_PATH } from '@/features/settings/lib/app-status';

export async function fetchAppStatus() {
  const { data } = await apiClient.get(APP_STATUS_PATH);
  return data;
}

/** The endpoint takes a partial body: send only the block being changed. */
export async function updateAppStatus(partialBody) {
  const { data } = await apiClient.put(APP_STATUS_PATH, partialBody);
  return data;
}
