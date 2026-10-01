import { getOrderAdminApprovalStatus } from '@/features/orders';

/** Label and Badge tone of the admin decision on a return request. */
const APPROVAL_META = {
  approved: { key: 'approved', label: 'تمت الموافقة', tone: 'success' },
  rejected: { key: 'rejected', label: 'مرفوض', tone: 'danger' },
  pending: { key: 'pending', label: 'بانتظار', tone: 'warning' },
};

/** The refund lookup wins over the row so the badge matches the KPI counters. */
export function getApprovalMeta(row, refund) {
  const status = refund != null ? (refund.adminConfirmed ?? getOrderAdminApprovalStatus(row)) : getOrderAdminApprovalStatus(row);

  if (status === true || status === 1) return APPROVAL_META.approved;
  if (status === false || status === 0) return APPROVAL_META.rejected;
  return APPROVAL_META.pending;
}
