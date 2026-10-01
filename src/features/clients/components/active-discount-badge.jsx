import { Ban, Tag } from 'lucide-react';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { Spinner } from '@/shared/components/page-loader';
import { formatDiscountValue } from '@/features/clients/lib/coupons';

/** Header status: the active discount with a cancel button, or "no active discount". */
export function ActiveDiscountBadge({ activeCoupon, onDeactivate, isDeactivating }) {
  if (!activeCoupon) {
    return (
      <Badge tone="neutral" className="h-8 gap-1.5 px-3 font-bold">
        <Ban className="size-3.5 shrink-0" />
        لا خصم فعال
      </Badge>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Badge tone="success" className="h-8 gap-1.5 px-3 font-bold">
        <Tag className="size-3.5 shrink-0" />
        خصم فعال — {formatDiscountValue(activeCoupon)}
      </Badge>
      <Button variant="outline" size="sm" className="text-destructive" disabled={isDeactivating} onClick={() => onDeactivate(activeCoupon.id)}>
        {isDeactivating && <Spinner className="size-3.5" />}
        إلغاء الخصم
      </Button>
    </div>
  );
}
