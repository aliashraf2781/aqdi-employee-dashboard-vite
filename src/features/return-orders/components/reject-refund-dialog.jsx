import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { useRejectRefund } from '../hooks/use-reject-refund';

/** "Are you sure you want to reject this return request?" */
export function RejectRefundDialog({ open, onOpenChange, order, refund, refundsLookup, refundItems, queryKey }) {
  const reject = useRejectRefund({
    order,
    refund,
    refundsLookup,
    refundItems,
    queryKey,
    onRejected: () => onOpenChange(false),
  });

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => !reject.isPending && onOpenChange(next)}
      title="رفض طلب الاسترجاع"
      description={`هل أنت متأكد من رفض استرجاع الطلب #${order?.uuid}؟`}
      confirmLabel={reject.isPending ? 'جاري التنفيذ...' : 'تأكيد الرفض'}
      destructive
      isLoading={reject.isPending}
      onConfirm={() => reject.mutate()}
    />
  );
}
