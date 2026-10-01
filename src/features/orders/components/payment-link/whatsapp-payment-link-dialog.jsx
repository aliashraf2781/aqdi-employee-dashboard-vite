import { useState } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { useCreatePaymentLink } from '../../hooks/use-create-payment-link';
import { buildPaymentLinkBody, paymentLinkDefaults, paymentLinkSchema } from '../../schemas/payment-link-schema';
import { PaymentLinkFields } from './payment-link-fields';
import { PaymentLinkResultDialog } from './payment-link-result-dialog';

/** "توليد رابط دفع – طلب واتساب": form that creates a link, then shows it in a result dialog. */
export function WhatsAppPaymentLinkDialog({ open, onOpenChange }) {
  const createLink = useCreatePaymentLink();
  const [result, setResult] = useState(null);

  const submit = async (values) => {
    const payment = await createLink.mutateAsync(buildPaymentLinkBody(values));
    if (!payment) return;
    onOpenChange(false);
    setResult({ ...payment, cartAmount: payment.cartAmount ?? Number(values.amount), notes: values.notes?.trim() ?? '' });
  };

  return (
    <>
      <FormDialog
        open={open}
        onOpenChange={onOpenChange}
        title="توليد رابط دفع – طلب واتساب"
        schema={paymentLinkSchema}
        defaultValues={paymentLinkDefaults}
        onSubmit={submit}
        submitLabel="توليد رابط الدفع"
        cancelLabel="إغلاق"
        size="lg"
      >
        {(form) => <PaymentLinkFields form={form} />}
      </FormDialog>

      {result && <PaymentLinkResultDialog open onOpenChange={() => setResult(null)} link={result} />}
    </>
  );
}
