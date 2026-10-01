import { apiClient } from '@/shared/lib/api-client';
import { unwrapData } from '@/features/clients/lib/unwrap-data';
import { normalizeClientsListResponse } from '@/features/clients/lib/client-mapper';
import { buildClientsQueryParams, buildExportQueryParams } from '@/features/clients/lib/clients-query';

export const CLIENTS_API = '/admin/users';

export async function fetchClients(filters) {
  const response = await apiClient.get(CLIENTS_API, { params: buildClientsQueryParams(filters) });
  return normalizeClientsListResponse(response);
}

/** `GET /admin/users/{id}` returns `{ data: { user: { ...fields, contracts: [...] } } }`. */
export async function fetchClient(clientId) {
  const response = await apiClient.get(`${CLIENTS_API}/${clientId}`);
  const payload = unwrapData(response);
  return payload?.user ?? payload;
}

/** Returns the raw response: it is either a file stream or a JSON link (see `saveExportResponse`). */
export function exportClients(filters) {
  return apiClient.get(`${CLIENTS_API}/export`, {
    params: buildExportQueryParams(filters),
    responseType: 'blob',
  });
}

export function deleteClient(clientId) {
  return apiClient.post(`${CLIENTS_API}/${clientId}/delete`);
}

export function toggleClientBlock(clientId) {
  return apiClient.post(`${CLIENTS_API}/${clientId}/block`);
}
