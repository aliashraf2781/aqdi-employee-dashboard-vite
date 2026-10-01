import { apiClient } from '@/shared/lib/api-client';

const FAQS_PATH = '/admin/faqs';

export async function listFaqs({ page, perPage }) {
  const { data } = await apiClient.get(FAQS_PATH, { params: { per_page: perPage, page } });
  return { items: data?.data?.items ?? [], pagination: data?.data?.pagination ?? null };
}

export const createFaq = (body) => apiClient.post(FAQS_PATH, body).then((response) => response.data);

export const updateFaq = ({ id, ...body }) => apiClient.post(`${FAQS_PATH}/${id}`, body).then((response) => response.data);

export const deleteFaq = (id) => apiClient.post(`${FAQS_PATH}/${id}/delete`).then((response) => response.data);
