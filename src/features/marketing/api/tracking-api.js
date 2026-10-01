import { apiClient } from '@/shared/lib/api-client';

/**
 * Read-only snapshots under `/admin/marketing-tracking`:
 *   ''          overview (ROAS header, KPIs, chart, top lists, best/weakest campaign)
 *   'keywords'  keyword ranking cards + table
 *   'channels'  marketing funnel + paid-channel ROI
 */
export async function getTrackingSnapshot(segment, params) {
  const { data } = await apiClient.get(`/admin/marketing-tracking${segment ? `/${segment}` : ''}`, { params });
  return data?.data ?? null;
}
