import { apiClient } from '@/shared/lib/api-client';
import {
  ACCEPT_RETURN_CONTRACT_FIELD,
  buildOrderStatusPayload,
  collectOrderIdentifierCandidates,
} from '../lib/order-status-payload';

const orderStatusUrl = (orderId) => `/admin/orders/${orderId}/status`;
const returnContractStatusUrl = (orderId) => `/admin/orders/${orderId}/return-contract-status`;

/** POST /admin/orders/{id}/status. `fields` are the extra inputs of the status (status_case.fields). */
export async function postOrderStatus(orderId, { statusId, extraValues, fields = [] }) {
  if (orderId == null || orderId === '') throw new Error('تعذر تحديد الطلب لتغيير الحالة');

  const payload = fields.length > 0 ? buildOrderStatusPayload(statusId, fields, extraValues) : { status_id: statusId };
  const { data } = await apiClient.post(orderStatusUrl(orderId), payload);
  return data;
}

async function postReturnContractStatus(orderId, accept) {
  if (orderId == null || orderId === '') throw new Error('تعذر تحديد الطلب لتحديث حالة الاسترجاع');
  return apiClient.post(returnContractStatusUrl(orderId), { [ACCEPT_RETURN_CONTRACT_FIELD]: accept });
}

/**
 * Accept/reject a returned contract. The backend identifies the order by uuid or id
 * depending on the screen it came from, so every known identifier is tried in turn.
 */
export async function postReturnContractStatusForOrder(order, orderId, accept = true) {
  const candidates = collectOrderIdentifierCandidates(order, orderId);
  if (!candidates.length) throw new Error('تعذر تحديد الطلب لتحديث حالة الاسترجاع');

  let lastError = null;
  for (const candidate of candidates) {
    try {
      const response = await postReturnContractStatus(candidate, accept);
      if (response.data?.success === false) {
        throw new Error(response.data?.message || 'تعذر تحديث حالة الاسترجاع');
      }
      return response.data;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError ?? new Error('تعذر تحديث حالة الاسترجاع');
}
