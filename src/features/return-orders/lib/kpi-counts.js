import { countReturnOrdersByApproval } from '@/features/orders';
import { mapAnalyticsRefundContractToOrderRow } from './refund-normalize';
import { parseManagementApprovalCounts } from './refund-payload';

/**
 * Counts for the KPI row, best source first:
 * the global summary of the API, then every refund contract, then only the rows of the current page.
 */
export function resolveKpiCounts({ refundsSummary, refundContracts, tableOrders }) {
  if (refundsSummary) {
    const counts = parseManagementApprovalCounts(refundsSummary.summary ?? { management_approval: refundsSummary.managementApproval });
    if (counts.pending + counts.approved + counts.rejected > 0) return counts;
  }

  if (refundContracts.length > 0) {
    return countReturnOrdersByApproval(refundContracts.map(mapAnalyticsRefundContractToOrderRow).filter(Boolean));
  }
  if (tableOrders.length > 0) return countReturnOrdersByApproval(tableOrders);
  return null;
}
