import { apiClient } from '@/shared/lib/api-client';
import { normalizeListResponse, extractTenantRoles } from '../lib/reference-options';
import { normalizeContractPeriods } from '../lib/contract-periods';

/** GET a list endpoint and return its rows whatever the response shape is. */
export async function fetchReferenceList(endpoint, params) {
  const { data } = await apiClient.get(endpoint, { params });
  return normalizeListResponse(data);
}

export async function fetchContractPeriods(contractType) {
  const { data } = await apiClient.get('/admin/contract-periods', { params: { contract_type: contractType } });
  return normalizeContractPeriods(data).map((period) => ({ ...period, contract_type: period?.contract_type || contractType }));
}

export async function fetchTenantRoles() {
  const { data } = await apiClient.get('/v2/tenant-roles');
  return extractTenantRoles(data);
}
