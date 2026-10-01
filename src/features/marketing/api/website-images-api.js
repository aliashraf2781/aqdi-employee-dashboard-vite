import { apiClient } from '@/shared/lib/api-client';
import { buildWebsiteImageFormData, extractWebsiteImages, WEBSITE_IMAGES_ENDPOINT } from '@/features/marketing/lib/website-images';

/** `isActive` is true / false / null (all). */
export async function listWebsiteImages({ search, isActive }) {
  const params = {};
  if (search) params.search = search;
  if (isActive !== null) params.is_active = isActive ? 1 : 0;

  const { data } = await apiClient.get(WEBSITE_IMAGES_ENDPOINT, { params });
  return extractWebsiteImages(data);
}

/** Laravel does not parse multipart PUT bodies, so the update is a POST with `_method=PUT`. */
export async function updateWebsiteImage({ id, form, imageFile }) {
  const body = buildWebsiteImageFormData(form, { imageFile });
  body.append('_method', 'PUT');
  const { data } = await apiClient.post(`${WEBSITE_IMAGES_ENDPOINT}/${id}`, body);
  return data;
}

export async function deleteWebsiteImage(id) {
  const { data } = await apiClient.delete(`${WEBSITE_IMAGES_ENDPOINT}/${id}`);
  return data;
}

/** Creates the missing catalog rows for known site assets without touching existing text. */
export async function syncWebsiteImageDefaults() {
  const { data } = await apiClient.post(`${WEBSITE_IMAGES_ENDPOINT}/sync-defaults`);
  return data;
}
