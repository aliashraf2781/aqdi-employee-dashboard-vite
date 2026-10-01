import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/lib/format';
import {
  formatDiscountValue,
  getAppliesToLabel,
  isCouponActive,
  sortCouponsForDisplay,
} from '@/features/clients/lib/coupons';

function buildColumns({ onDeactivate, isDeactivating }) {
  return [
    { key: 'value', header: 'القيمة', cell: (coupon) => <span className="font-bold tabular-nums">{formatDiscountValue(coupon)}</span> },
    { key: 'appliesTo', header: 'ينطبق على', cell: (coupon) => getAppliesToLabel(coupon) },
    { key: 'reason', header: 'السبب', cell: (coupon) => coupon.reason || '—' },
    { key: 'createdAt', header: 'تاريخ الإنشاء', cell: (coupon) => formatDate(coupon.created_at) },
    { key: 'expiresAt', header: 'ساري حتى', cell: (coupon) => formatDate(coupon.expires_at) },
    {
      key: 'status',
      header: 'الحالة',
      cell: (coupon) => (
        <Badge tone={isCouponActive(coupon) ? 'success' : 'neutral'}>{isCouponActive(coupon) ? 'فعال' : 'غير فعال'}</Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      cell: (coupon) =>
        isCouponActive(coupon) && (
          <Button variant="ghost" size="sm" className="text-destructive" disabled={isDeactivating} onClick={() => onDeactivate(coupon.id)}>
            إلغاء
          </Button>
        ),
    },
  ];
}

export function DiscountHistoryTable({ coupons, isLoading, onDeactivate, isDeactivating }) {
  return (
    <DataTable
      columns={buildColumns({ onDeactivate, isDeactivating })}
      rows={sortCouponsForDisplay(coupons)}
      isLoading={isLoading}
      emptyMessage="لا توجد خصومات مسجّلة لهذا العميل"
    />
  );
}
