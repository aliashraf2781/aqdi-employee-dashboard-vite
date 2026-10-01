import { Clock, Copy } from 'lucide-react';
import whatsappIcon from '@/assets/return-orders/whatsapp.svg';
import { OrderStatusBadge, formatRelativeTimeAr } from '@/features/orders';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { cn } from '@/shared/lib/cn';

const HOUSING_LABELS = ['سكنـي', 'سكني'];

function SummaryRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-0">
      <span className="shrink-0 text-sm text-muted-foreground">{label}</span>
      <div className="flex min-w-0 items-center gap-2 text-sm font-bold">{children}</div>
    </div>
  );
}

function isHousingRefund(refund) {
  return refund?.contractTypeKey === 'housing' || HOUSING_LABELS.includes(refund?.contractType);
}

function PaymentValue({ refund }) {
  if (!refund.isPaid) return <span className="text-danger">{refund.paymentLabelAr || 'لم يتم الدفع'}</span>;
  return <span className="text-success">{refund.amountPayment}</span>;
}

/** Read-only facts of a return request, shown above the approval form. */
export function RefundSummary({ refund }) {
  const receivedSince = formatRelativeTimeAr(refund.updatedAt || refund.createdAt);
  const contractTypeClass = isHousingRefund(refund) ? 'bg-info-soft text-info' : 'bg-accent text-accent-foreground';

  return (
    <div className="rounded-xl border border-border bg-muted px-4 py-2">
      <div className="flex items-start justify-between gap-3 border-b border-border py-3">
        <div>
          <p className="text-sm text-muted-foreground">رقم الطلب</p>
          <p className="font-bold">{refund.orderUuid}</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" />
          {receivedSince}
        </span>
      </div>

      {refund.userMobile && (
        <SummaryRow label="رقم جوال العميل">
          <span dir="ltr">{refund.userMobile}</span>
          <button type="button" aria-label="نسخ" onClick={() => copyToClipboard(refund.userMobile, 'تم نسخ رقم الجوال')}>
            <Copy className="size-3.5 text-muted-foreground" />
          </button>
          <a href={`https://wa.me/${refund.userMobile}`} target="_blank" rel="noreferrer" aria-label="واتساب">
            <img src={whatsappIcon} alt="" className="size-5" />
          </a>
        </SummaryRow>
      )}

      <SummaryRow label="نوع العقد">
        <span className={cn('rounded px-3 py-1 text-xs', contractTypeClass)}>{refund.contractType}</span>
      </SummaryRow>

      <SummaryRow label="الدفع">
        <PaymentValue refund={refund} />
      </SummaryRow>

      <SummaryRow label="مستلم منذ">
        <span className="text-warning">{receivedSince}</span>
      </SummaryRow>

      {refund.statusName && (
        <SummaryRow label="حالة الطلب">
          <OrderStatusBadge name={refund.statusName} color={refund.statusColor} />
        </SummaryRow>
      )}

      <SummaryRow label="الاستلام">{refund.employeeName}</SummaryRow>

      {refund.draftContractNumber && <SummaryRow label="رقم مسودة العقد">{refund.draftContractNumber}</SummaryRow>}
    </div>
  );
}
