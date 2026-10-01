import { apiClient } from '@/shared/lib/api-client';

/** Responses come as `{ data: { items, pagination } }` or `{ items, pagination }`. */
function toPagedList(body) {
  return {
    items: body?.data?.items ?? body?.items ?? [],
    pagination: body?.data?.pagination ?? body?.pagination ?? null,
  };
}

export async function fetchRoles(page = 1) {
  const { data } = await apiClient.get('/admin/roles', { params: { page } });
  return toPagedList(data);
}

/** First page only: used to fill the "role" dropdown of the employee form. */
export async function fetchRoleOptions() {
  const { data } = await apiClient.get('/admin/roles');
  return toPagedList(data).items;
}

export async function fetchRole(id) {
  const { data } = await apiClient.get(`/admin/roles/${id}`);
  return data?.data ?? data;
}

/** The catalogue of permission modules a role can be given. */
export async function fetchPermissionModules() {
  const { data } = await apiClient.get('/admin/roles/create');
  return data?.data?.permission_modules ?? [];
}

export async function createRole(payload) {
  const { data } = await apiClient.post('/admin/roles', payload);
  return data;
}

export async function updateRole({ id, ...payload }) {
  const { data } = await apiClient.post(`/admin/roles/${id}`, payload);
  return data;
}

export async function deleteRole(id) {
  const { data } = await apiClient.post(`/admin/roles/${id}/delete`);
  return data;
}
