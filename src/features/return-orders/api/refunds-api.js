import { apiClient } from '@/shared/lib/api-client';
import { extractRefundsContractsPayload } from '../lib/refund-payload';

export const REFUNDS_CONTRACTS_API = '/admin/analytics/refunds/contracts';

const ALL_PERIODS = 'all';
const MAX_REFUND_PAGES = 50;

const fetchRefundsPage = async (page) => {
  const { data } = await apiClient.get(REFUNDS_CONTRACTS_API, { params: { created_at: ALL_PERIODS, page } });
  return extractRefundsContractsPayload(data);
};

/** Every refund contract, page by page. A failing page ends the walk and keeps what was loaded. */
export async function fetchAllRefundContracts() {
  const contracts = [];
  let page = 1;
  let lastPage = 1;

  try {
    do {
      const result = await fetchRefundsPage(page);
      contracts.push(...result.contracts);
      lastPage = result.pagination?.last_page ?? page;
      page += 1;
    } while (page <= lastPage && page <= MAX_REFUND_PAGES);
  } catch {
    return contracts;
  }

  return contracts;
}

/** Global KPIs: the `summary` of the first page does not depend on the table page. Null when the request fails. */
export async function fetchRefundContractsSummary() {
  try {
    return await fetchRefundsPage(1);
  } catch {
    return null;
  }
}

/** Approve or reject a refund. The backend moves the contract to the return status by itself on approval. */
export async function updateRefundContract(refundKey, { adminConfirmed, refundAmount, notes }) {
  const { data } = await apiClient.post(`${REFUNDS_CONTRACTS_API}/${refundKey}`, {
    admin_confirmed: adminConfirmed,
    refund_amount: refundAmount,
    notes: notes ?? null,
  });
  return data;
}
