import { z } from 'zod';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useSavePaymentMessage } from '@/features/contract-settings/hooks/use-payment-messages';
import {
  EMPTY_PAYMENT_MESSAGE_FORM,
  PAYMENT_MESSAGE_META,
  buildPaymentMessagePayload,
  paymentMessageToFormValues,
} from '@/features/contract-settings/lib/payment-messages';

const REQUIRED_MESSAGE = 'يرجى تعبئة جميع الحقول المطلوبة';
const required = z.string().trim().min(1, REQUIRED_MESSAGE);

const schema = z.object({
  message: required,
  button_text: required,
  button_link: required,
  button_text_2: required,
  button_link_2: required,
});

/** Create (`item` is null) or edit the payment message of one `type` (success / failed). */
export function PaymentMessageDialog({ item, type, onClose }) {
  const save = useSavePaymentMessage({ onSaved: onClose });
  const meta = PAYMENT_MESSAGE_META[type];

  const submit = async (values) => {
    try {
      await save.mutateAsync({ id: item?.id, payload: buildPaymentMessagePayload(values, type) });
    } catch {
      // Error toast already shown by the mutation.
    }
  };

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title={item ? `تعديل ${meta.label}` : `إضافة ${meta.label}`}
      description={meta.description}
      schema={schema}
      defaultValues={item ? paymentMessageToFormValues(item) : EMPTY_PAYMENT_MESSAGE_FORM}
      onSubmit={submit}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextareaField label="نص الرسالة" placeholder="اكتب رسالة الدفع هنا..." error={errors.message?.message} {...register('message')} />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField label="نص الزر الأول" placeholder="مثال: عرض العقد" error={errors.button_text?.message} {...register('button_text')} />
            <TextField label="رابط الزر الأول" dir="ltr" placeholder="https://example.com" error={errors.button_link?.message} {...register('button_link')} />
            <TextField label="نص الزر الثاني" placeholder="مثال: الصفحة الرئيسية" error={errors.button_text_2?.message} {...register('button_text_2')} />
            <TextField label="رابط الزر الثاني" dir="ltr" placeholder="https://example.com" error={errors.button_link_2?.message} {...register('button_link_2')} />
          </div>
        </>
      )}
    </FormDialog>
  );
}
