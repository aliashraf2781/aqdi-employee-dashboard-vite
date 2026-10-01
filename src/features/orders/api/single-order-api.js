import { apiClient } from '@/shared/lib/api-client';

const isFile = (value) => typeof File !== 'undefined' && value instanceof File;

/** Multipart body: files as they are, objects as JSON, empty values left out. */
export function toMultipartFormData(payload) {
  const formData = new FormData();
  Object.entries(payload ?? {}).forEach(([key, value]) => {
    if (value == null) return;
    if (isFile(value)) formData.append(key, value);
    else if (typeof value === 'object') formData.append(key, JSON.stringify(value));
    else formData.append(key, String(value));
  });
  return formData;
}

/** The order payload of GET /admin/orders/{id}, keeping the response wrapper (`{ data: order }`). */
export async function fetchSingleOrder(contractId) {
  const { data } = await apiClient.get(`/admin/orders/${contractId}`);
  return data;
}

/** POST /admin/orders/{id} with changed contract fields. Sends multipart when a file is attached. */
export async function updateContractFields(contractId, payload) {
  const hasFile = Object.values(payload ?? {}).some(isFile);
  const { data } = await apiClient.post(
    `/admin/orders/${contractId}`,
    hasFile ? toMultipartFormData(payload) : payload,
    hasFile ? { headers: { 'Content-Type': 'multipart/form-data' } } : undefined,
  );
  return data;
}

export async function updateOrderUnit(contractId, unitId, payload) {
  const { data } = await apiClient.post(`/admin/orders/${contractId}/units/${unitId}`, payload);
  return data;
}

export async function detachOrderUnit(contractId, unitId) {
  const { data } = await apiClient.post(`/admin/orders/${contractId}/units/${unitId}/delete`);
  return data;
}
