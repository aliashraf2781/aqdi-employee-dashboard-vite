import { getOrderAdminApprovalStatus } from '@/features/orders';
import { ensureReturnOrderRefund } from './refund-lookup';

const isTrue = (value) => value === true || value === 1;
const isFalse = (value) => value === false || value === 0;
const KNOWN_REQUEST_STATUSES = ['pending', 'approved', 'rejected'];

/** Collapses the admin/customer refund flags into the pending / approved / rejected trio used by KPIs and badges. */
export function resolveReturnRequestStatus({ adminConfirmed, customerRefunded, existing }) {
  if (isTrue(customerRefunded) || isTrue(adminConfirmed)) return 'approved';
  if (isFalse(adminConfirmed)) return 'rejected';
  if (existing === 'refunded') return 'approved';
  if (KNOWN_REQUEST_STATUSES.includes(existing)) return existing;
  return 'pending';
}

/** Copies the approval data of the refund lookup onto an order row, so the table and the KPIs agree. */
export function enrichOrderWithRefundApproval(row, refundsLookup) {
  if (!row) return row;

  const refund = ensureReturnOrderRefund(row, refundsLookup);
  if (!refund) return row;

  const adminConfirmed = refund.adminConfirmed !== undefined ? refund.adminConfirmed : getOrderAdminApprovalStatus(row);
  const customerRefunded = refund.customerRefunded ?? row.customer_refunded ?? row.is_refunded ?? row.refunded;
  const existing = row.return_request_status ?? row.contract_summary?.return_request_status ?? null;
  const managementApproval =
    refund.raw?.management_approval ??
    row.management_approval ??
    (adminConfirmed !== undefined ? { approved: adminConfirmed } : row.management_approval);

  return {
    ...row,
    admin_confirmed: adminConfirmed,
    management_approval: managementApproval,
    is_refunded: customerRefunded,
    customer_refunded: customerRefunded,
    refunded: customerRefunded,
    return_request_status: resolveReturnRequestStatus({ adminConfirmed, customerRefunded, existing }),
  };
}
