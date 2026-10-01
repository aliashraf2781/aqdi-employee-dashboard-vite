import { Badge } from '@/shared/components/badge';
import { Switch } from '@/shared/components/ui/switch';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { useCouponStatus } from '@/features/settings/hooks/use-coupon-status';
import { isCouponActive } from '@/features/settings/lib/coupon';

/** Status badge plus an on/off switch (the switch is disabled without `coupons.edit`). */
export function CouponStatusCell({ coupon }) {
  const { can } = usePermissions();
  const { mutate, isPending } = useCouponStatus();
  const active = isCouponActive(coupon);

  return (
    <div className="inline-flex items-center gap-2">
      <Badge tone={active ? 'success' : 'neutral'}>{active ? 'مفعل' : 'غير مفعل'}</Badge>
      <Switch
        checked={active}
        disabled={isPending || !can(PERMISSION_SECTIONS.coupons, 'edit')}
        onCheckedChange={(checked) => mutate({ id: coupon.id, active: checked })}
        aria-label="تفعيل الخصم"
      />
    </div>
  );
}
