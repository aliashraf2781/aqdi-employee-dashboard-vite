import { apiClient } from '@/shared/lib/api-client';
import { assertPaymentLinkResult, normalizePaymentLinkPayload } from '../lib/payment-link';

const CONTRACT_PAID_API = '/admin/contract-paid-by-employees';

/** Creates a payment link for a WhatsApp customer (an order paid through a link, not the app). */
export async function createContractPaidLink(body) {
  const { data } = await apiClient.post(CONTRACT_PAID_API, body);
  return data;
}

/** Payment link of one contract, by its uuid. */
export async function fetchContractPaymentLink(uuid) {
  const response = await apiClient.get(`/admin/payment-gateway/${encodeURIComponent(uuid)}`);
  return assertPaymentLinkResult(normalizePaymentLinkPayload(response.data, { fallbackUuid: uuid }), response);
}

/**
 * The detail endpoint of a contract-paid record often has no payment_url, only the
 * contract uuid; the link then comes from the payment gateway.
 */
export async function fetchContractPaidPaymentLink(id, { contractUuid } = {}) {
  let uuid = contractUuid || null;

  if (!uuid) {
    const response = await apiClient.get(`${CONTRACT_PAID_API}/${encodeURIComponent(id)}`);
    const detail = normalizePaymentLinkPayload(response.data);
    if (detail.paymentUrl || detail.alreadyPaid) return assertPaymentLinkResult(detail, response);
    uuid = detail.contractUuid;
  }

  if (!uuid) throw new Error('رقم العقد غير متوفر لإنشاء رابط الدفع');
  return fetchContractPaymentLink(uuid);
}
