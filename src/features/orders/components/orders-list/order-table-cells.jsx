import { Check, Copy, X } from 'lucide-react';
import greenRial from '@/assets/orders/green-rial.svg';
import { Badge } from '@/shared/components/badge';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { formatRelativeShort } from '../../lib/format-relative-time';

export function OrderNumberCell({ uuid }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-black tabular-nums text-primary">#{uuid}</span>
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          copyToClipboard(uuid, 'تم نسخ رقم الطلب');
        }}
        aria-label="نسخ"
        className="text-muted-foreground transition-colors hover:text-primary"
      >
        <Copy className="size-3.5" />
      </button>
    </div>
  );
}

export function PaymentCell({ order }) {
  const isPaid = order?.is_paid === true || order?.is_paid === 1;
  const amount = order?.amount_payment;
  const showAmount = isPaid && amount != null && amount !== '';

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {showAmount && (
        <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums text-success">
          {amount}
          <img src={greenRial} alt="ريال" className="size-3" />
        </span>
      )}
      {isPaid ? (
        <Badge tone="success" className="gap-1">
          <Check className="size-3" />
          مدفوع
        </Badge>
      ) : (
        <Badge tone="danger" className="gap-1">
          <X className="size-3" />
          غير مدفوع
        </Badge>
      )}
    </div>
  );
}

export function ReceivedSinceCell({ order }) {
  const label = order?.received_since || formatRelativeShort(order?.received_at);
  if (!label) return <span className="text-muted-foreground">—</span>;
  return <span className="whitespace-nowrap font-medium text-muted-foreground">{label}</span>;
}

export function ReceivedByCell({ order }) {
  return <span className="font-medium text-muted-foreground">{order?.employee_name || '—'}</span>;
}
