import { apiClient } from '@/shared/lib/api-client';
import { CLIENTS_API } from '@/features/clients/api/clients-api';
import { normalizeCouponListResponse } from '@/features/clients/lib/coupons';
import { buildAssignCouponPayload } from '@/features/clients/lib/client-discount';

export async function fetchClientCoupons(clientId) {
  const response = await apiClient.get(`${CLIENTS_API}/${clientId}/coupons`);
  return normalizeCouponListResponse(response);
}

/** Assigns a secret custom-discount coupon. `formValues` are the discount form's values. */
export function assignClientCoupon(clientId, formValues) {
  return apiClient.post(`${CLIENTS_API}/${clientId}/coupons`, buildAssignCouponPayload(formValues));
}

export function deactivateClientCoupon(clientId, couponId) {
  return apiClient.post(`${CLIENTS_API}/${clientId}/coupons/${couponId}/deactivate`);
}
