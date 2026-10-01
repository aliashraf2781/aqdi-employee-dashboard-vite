import { ConfirmDialog } from '@/shared/components/confirm-dialog';

/** "Are you sure you want to change the status of order #X to «Y»?" */
export function ConfirmOrderStatusChangeDialog({
  open,
  onOpenChange,
  statusName,
  orderLabel,
  isPending = false,
  onConfirm,
  title = 'تأكيد تغيير الحالة',
  confirmLabel = 'تأكيد التغيير',
}) {
  const orderText = orderLabel ? `#${orderLabel}` : 'هذا الطلب';
  const statusText = statusName || 'الحالة المحددة';

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
      title={title}
      description={`هل أنت متأكد من تغيير حالة الطلب ${orderText} إلى «${statusText}»؟`}
      confirmLabel={confirmLabel}
      isLoading={isPending}
      onConfirm={onConfirm}
    />
  );
}
