import { apiClient } from '@/shared/lib/api-client';
import { pickItems, pickLastPage } from '@/shared/lib/list-response';

const BLOGS_PATH = '/admin/blogs';
export const BLOGS_PER_PAGE = 10;

export async function fetchBlogs({ page }) {
  const { data } = await apiClient.get(BLOGS_PATH, { params: { per_page: BLOGS_PER_PAGE, page } });
  return { rows: pickItems(data), lastPage: pickLastPage(data) };
}

export async function fetchBlog(id) {
  const { data } = await apiClient.get(`${BLOGS_PATH}/${id}`);
  return data?.data ?? null;
}

export async function createBlog(formData) {
  const { data } = await apiClient.post(BLOGS_PATH, formData);
  return data;
}

export async function updateBlog({ id, formData }) {
  const { data } = await apiClient.put(`${BLOGS_PATH}/${id}`, formData);
  return data;
}
