import { apiClient } from '@/shared/lib/api-client';

export const COUPONS_PATH = '/admin/coupons';
export const COUPONS_QUERY_KEY = 'coupons';

/** Switches a coupon on or off. */
export async function setCouponActive({ id, active }) {
  const action = active ? 'activate' : 'inactive';
  const { data } = await apiClient.post(`${COUPONS_PATH}/${id}/${action}`);
  return data;
}
