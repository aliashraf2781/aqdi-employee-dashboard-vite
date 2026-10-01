import { apiClient } from '@/shared/lib/api-client';
import { GENERAL_SETTINGS_PATH } from '@/features/settings/lib/general-settings';

export async function fetchGeneralSettings() {
  const { data } = await apiClient.get(GENERAL_SETTINGS_PATH);
  return data;
}

export async function setGeneralSetting({ key, enabled }) {
  const { data } = await apiClient.put(`${GENERAL_SETTINGS_PATH}/${key}`, { enabled });
  return data;
}
