import { apiClient } from '@/shared/lib/api-client';
import { CONTENT_PAGE_ENDPOINTS } from '@/features/marketing/lib/content-pages';

/** Raw response body of a content page (sections + page-level SEO). */
export async function getContentPage(pageKey) {
  const { data } = await apiClient.get(CONTENT_PAGE_ENDPOINTS[pageKey]);
  return data;
}

/** Saves one section (or the page SEO) as multipart; axios sets the boundary itself. */
export async function saveContentPage(pageKey, formData) {
  const { data } = await apiClient.post(CONTENT_PAGE_ENDPOINTS[pageKey], formData);
  return data;
}
