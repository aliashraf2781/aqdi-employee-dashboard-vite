import { apiClient } from '@/shared/lib/api-client';
import { pickItems } from '@/shared/lib/list-response';

const SETTING_CONTRACTS_PATH = '/admin/setting-contracts';

export async function fetchInstrumentSettings() {
  const { data } = await apiClient.get(SETTING_CONTRACTS_PATH);
  return pickItems(data);
}

/** Rows that were never saved have no id yet: those are created, the rest updated. */
export async function saveInstrumentSetting({ id, payload }) {
  const path = id ? `${SETTING_CONTRACTS_PATH}/${id}` : SETTING_CONTRACTS_PATH;
  const { data } = await apiClient.post(path, payload);
  return data;
}
