import { apiClient } from '@/shared/lib/api-client';
import { normalizeEmployeesResponse } from '@/features/employees/lib/employees-response';

export async function fetchEmployees({ page = 1, search = '', perPage } = {}) {
  const params = { page };
  if (search) params.search = search;
  if (perPage) params.per_page = perPage;

  const { data } = await apiClient.get('/admin/employees', { params });
  return normalizeEmployeesResponse(data);
}

export async function fetchEmployee(id) {
  const { data } = await apiClient.get(`/admin/employees/${id}`);
  return data?.data ?? data;
}

/** `id` is omitted when creating. The body is FormData because of the profile image. */
export async function saveEmployee({ id, formData }) {
  const url = id ? `/admin/employees/${id}` : '/admin/employees';
  const { data } = await apiClient.post(url, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
}

export async function toggleEmployeeStatus(id) {
  const { data } = await apiClient.post(`/admin/employees/${id}/toggle-status`);
  return data;
}

export async function deleteEmployee(id) {
  const { data } = await apiClient.post(`/admin/employees/${id}/delete`);
  return data;
}

export async function blockEmployee({ id, reason_of_block, blocked_until }) {
  const { data } = await apiClient.post(`/admin/employees/${id}/block`, {
    reason_of_block,
    blocked_until: blocked_until || null,
  });
  return data;
}

export async function unblockEmployee(id) {
  const { data } = await apiClient.post(`/admin/employees/${id}/unblock`);
  return data;
}

export async function addEmployeeNote({ id, ...payload }) {
  const { data } = await apiClient.post(`/admin/employees/${id}/note`, payload);
  return data;
}

export async function addEmployeeSalary({ id, ...payload }) {
  const { data } = await apiClient.post(`/admin/employees/${id}/salary`, payload);
  return data;
}

export async function sendEmployeeSms({ employeeId, message }) {
  const { data } = await apiClient.post('/admin/sms/send', { employee_id: Number(employeeId), message });
  return data;
}
