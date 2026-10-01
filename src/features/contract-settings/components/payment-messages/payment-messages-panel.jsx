import { useState } from 'react';
import { PageLoader } from '@/shared/components/page-loader';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { PanelHeader } from '@/features/contract-settings/components/panel-header';
import { PaymentMessageCard } from '@/features/contract-settings/components/payment-messages/payment-message-card';
import { PaymentMessageDialog } from '@/features/contract-settings/components/payment-messages/payment-message-dialog';
import { usePaymentMessages } from '@/features/contract-settings/hooks/use-payment-messages';
import { PAYMENT_MESSAGE_TYPES, getPaymentMessageByType } from '@/features/contract-settings/lib/payment-messages';

/** The two fixed messages shown to customers after a payment succeeds or fails. */
export function PaymentMessagesPanel() {
  const { can } = usePermissions();
  const [editedType, setEditedType] = useState(null);
  const { data: items = [], isLoading } = usePaymentMessages();
  const canEdit = can(PERMISSION_SECTIONS.payment_messages, 'edit');

  if (isLoading) return <PageLoader />;

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader
        title="إعدادات رسائل الدفع"
        description="رسالتان ثابتتان: واحدة لنجاح الدفع وأخرى لفشله. يمكنك إضافتهما أو تعديلهما فقط، بدون إمكانية الحذف."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {Object.values(PAYMENT_MESSAGE_TYPES).map((type) => (
          <PaymentMessageCard
            key={type}
            type={type}
            item={getPaymentMessageByType(items, type)}
            canEdit={canEdit}
            onEdit={() => setEditedType(type)}
          />
        ))}
      </div>

      {editedType && (
        <PaymentMessageDialog
          type={editedType}
          item={getPaymentMessageByType(items, editedType)}
          onClose={() => setEditedType(null)}
        />
      )}
    </div>
  );
}
