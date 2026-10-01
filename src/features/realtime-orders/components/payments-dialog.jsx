import { Modal } from '@/shared/components/modal';
import { PaymentNotificationList } from './payment-notification-list';

/** Today's payments, opened from the toolbar. */
export function PaymentsDialog({ open, onOpenChange }) {
  return (
    <Modal open={open} onOpenChange={onOpenChange} title="إشعارات الدفع" description="مدفوعات اليوم">
      <PaymentNotificationList onNavigate={() => onOpenChange(false)} />
    </Modal>
  );
}
