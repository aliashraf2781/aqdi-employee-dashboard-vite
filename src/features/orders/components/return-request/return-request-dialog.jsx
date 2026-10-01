import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/modal';
import { useReturnRequest } from '../../hooks/use-return-request';
import { isOrderPaid, UNPAID_ORDER_RETURN_MESSAGE } from '../../lib/refund-status';
import { ReturnRequestFormDialog } from './return-request-form-dialog';
import { ReturnRequestWhatsappDialog } from './return-request-whatsapp-dialog';

const STEP = { FORM: 'form', WHATSAPP: 'whatsapp', SUCCESS: 'success' };

/**
 * Whole "raise a return request" flow: form, then the message to send to the customer, then a confirmation.
 * `order` must already be normalized (see normalizeOrderForReturnRequest).
 */
export function ReturnRequestDialog({ open, onOpenChange, order, orderId, orderUuid, queryKey, onReturnSuccess }) {
  const [step, setStep] = useState(STEP.FORM);
  const [wasOpen, setWasOpen] = useState(false);
  const returnRequest = useReturnRequest({ order, orderId, orderUuid, queryKey, onReturnSuccess });

  // Every time the flow opens it starts again from the form.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setStep(STEP.FORM);
  }

  const finish = () => {
    onOpenChange(false);
    returnRequest.invalidateAfterClose();
  };

  const submit = async (values) => {
    if (!isOrderPaid(order)) {
      toast.error(UNPAID_ORDER_RETURN_MESSAGE);
      return;
    }
    await returnRequest.mutateAsync({
      refundAmount: Number(values.refund_amount),
      notes: values.notes?.trim(),
      contractFile: values.contract_file,
    });
    setStep(STEP.WHATSAPP);
  };

  return (
    <>
      <ReturnRequestFormDialog
        open={open && step === STEP.FORM}
        onOpenChange={onOpenChange}
        order={order}
        isPending={returnRequest.isPending}
        onSubmit={submit}
      />

      <ReturnRequestWhatsappDialog
        open={open && step === STEP.WHATSAPP}
        onOpenChange={onOpenChange}
        order={order}
        onContinue={() => setStep(STEP.SUCCESS)}
      />

      <Modal
        open={open && step === STEP.SUCCESS}
        onOpenChange={(next) => !next && finish()}
        title={`تم تصنيف الطلب رقم ${order?.uuid ?? ''} الى مسترجع بنجاح!`}
        size="sm"
        footer={
          <Button
            onClick={() => {
              finish();
              toast.success('تم تحديث حالة الطلب بنجاح');
            }}
          >
            تم
          </Button>
        }
      />
    </>
  );
}
