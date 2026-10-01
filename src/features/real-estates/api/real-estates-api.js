import { apiClient } from '@/shared/lib/api-client';

export async function getRealEstate(id) {
  const { data } = await apiClient.get(`/admin/real-estates/${id}`);
  return data?.data ?? null;
}
