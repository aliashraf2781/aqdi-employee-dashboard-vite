import { apiClient } from '@/shared/lib/api-client';

export async function fetchContentPage(endpoint) {
  const { data } = await apiClient.get(endpoint);
  return data?.data ?? null;
}

export async function saveContentPage(endpoint, descriptionHtml) {
  const { data } = await apiClient.post(endpoint, { description_ar: descriptionHtml });
  return data;
}
