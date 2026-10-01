import { apiClient } from '@/shared/lib/api-client';

const REPORTS_PATH = '/admin/marketing/reports';
const JSON_TYPE = 'application/json';

/** `segment`: '' for the overview report, 'channels' for the paid-channel table. */
export async function getMarketingReport(segment, params) {
  const { data } = await apiClient.get(`${REPORTS_PATH}${segment ? `/${segment}` : ''}`, { params });
  return data?.data ?? null;
}

/**
 * Export the report. Resolves to one of:
 *   { kind: 'email', message }   the server mailed it
 *   { kind: 'url', url }         the server answered with a download link
 *   { kind: 'file', blob }       the file bytes
 */
export async function exportMarketingReport(payload) {
  if (payload.format === 'email') {
    const { data } = await apiClient.post(`${REPORTS_PATH}/export`, payload);
    return { kind: 'email', message: data?.message };
  }

  const response = await apiClient.post(`${REPORTS_PATH}/export`, payload, { responseType: 'blob' });
  if (!response.data?.type?.includes(JSON_TYPE)) return { kind: 'file', blob: response.data };

  const url = JSON.parse(await response.data.text())?.data?.url;
  if (!url) throw new Error('no file url');
  return { kind: 'url', url };
}
