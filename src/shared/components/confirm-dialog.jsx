import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/modal';

/** Yes/no question. Use for deletes and other irreversible actions. */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'تأكيد',
  cancelLabel = 'إلغاء',
  destructive = false,
  isLoading = false,
  onConfirm,
}) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? 'destructive' : 'primary'} onClick={onConfirm} disabled={isLoading}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
