import { apiClient } from '@/shared/lib/api-client';
import { pickItems } from '@/shared/lib/list-response';

const PAYMENT_MESSAGES_PATH = '/admin/payment-messages';

export async function fetchPaymentMessages() {
  const { data } = await apiClient.get(PAYMENT_MESSAGES_PATH);
  return pickItems(data);
}

export async function savePaymentMessage({ id, payload }) {
  const path = id ? `${PAYMENT_MESSAGES_PATH}/${id}` : PAYMENT_MESSAGES_PATH;
  const { data } = await apiClient.post(path, payload);
  return data;
}
