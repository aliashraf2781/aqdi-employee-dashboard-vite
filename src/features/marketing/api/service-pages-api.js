import { apiClient } from '@/shared/lib/api-client';

const SERVICE_PAGES_PATH = '/admin/marketing/service-pages';

export async function listServicePages() {
  const { data } = await apiClient.get(SERVICE_PAGES_PATH);
  return data?.data ?? null;
}

export const createServicePage = (body) => apiClient.post(SERVICE_PAGES_PATH, body).then((response) => response.data);

export const updateServicePage = ({ id, ...body }) => apiClient.put(`${SERVICE_PAGES_PATH}/${id}`, body).then((response) => response.data);

export const deleteServicePage = (id) => apiClient.delete(`${SERVICE_PAGES_PATH}/${id}`).then((response) => response.data);
