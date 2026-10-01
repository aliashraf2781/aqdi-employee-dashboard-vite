import { apiClient } from '@/shared/lib/api-client';

/** Raises a return (refund) request. The backend moves the contract to "استرجاع" by itself. */
export async function createReturnRequest({ contractId, refundAmount, notes, contractFile }) {
  let body;
  if (contractFile) {
    body = new FormData();
    body.append('contract_id', contractId);
    body.append('refund_amount', String(refundAmount));
    if (notes) body.append('notes', notes);
    body.append('client_contract_file', contractFile);
  } else {
    body = { contract_id: contractId, refund_amount: refundAmount, notes: notes || null };
  }

  const { data } = await apiClient.post('/admin/refundable-contracts', body);
  return data;
}
