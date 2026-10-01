import { apiClient } from '@/shared/lib/api-client';

/** Marketing view of the blogs: attribution per article plus the editorial queue. */
export async function listMarketingArticles(params) {
  const { data } = await apiClient.get('/admin/marketing/articles', { params });
  return data?.data ?? null;
}
