import { Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ALL_ORDERS_QUERY_KEY } from '@/features/orders';
import { Badge } from '@/shared/components/badge';
import { IconButton } from '@/shared/components/icon-button';
import { getApprovalMeta } from '../lib/approval-status';
import { canShowReturnOrderApproval, ensureReturnOrderRefund } from '../lib/refund-lookup';
import { RefundReviewDialog } from './refund-review-dialog';
import { RejectRefundDialog } from './reject-refund-dialog';

/** "موافقة الإدارة" cell: refund amount, decision badge and, while pending, approve / reject buttons. */
export function AdminApprovalCell({ row, refundsLookup, refundItems, onApproved }) {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const refund = useMemo(() => ensureReturnOrderRefund(row, refundsLookup), [row, refundsLookup]);
  const approval = getApprovalMeta(row, refund);
  const canDecide = canShowReturnOrderApproval(row, refund) && approval.key === 'pending';
  const amount = row?.refund_amount ?? refund?.refundAmount;
  const hasAmount = amount != null && amount !== '';

  if (!refund && row?.admin_confirmed == null && !row?.refund_amount) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className="flex min-w-36 flex-col items-start gap-1.5">
      {hasAmount && <span className="text-xs font-bold tabular-nums text-warning">استرجاع {amount} ريال</span>}

      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={approval.tone}>{approval.label}</Badge>

        {canDecide && (
          <>
            <IconButton label="اعتماد الاسترجاع" className="size-7 rounded-lg" onClick={() => setReviewOpen(true)}>
              <Check className="size-3.5" />
            </IconButton>
            <IconButton label="رفض" className="size-7 rounded-lg" onClick={() => setRejectOpen(true)}>
              <X className="size-3.5" />
            </IconButton>
          </>
        )}
      </div>

      {refund && (
        <RefundReviewDialog
          open={reviewOpen}
          onOpenChange={setReviewOpen}
          refund={refund}
          order={row}
          refundsLookup={refundsLookup}
          refundItems={refundItems}
          onApproved={onApproved}
        />
      )}
      <RejectRefundDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        order={row}
        refund={refund}
        refundsLookup={refundsLookup}
        refundItems={refundItems}
        queryKey={[ALL_ORDERS_QUERY_KEY]}
      />
    </div>
  );
}
