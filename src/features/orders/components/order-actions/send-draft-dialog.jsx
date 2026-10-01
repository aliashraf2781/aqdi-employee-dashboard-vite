import { FormDialog } from '@/shared/components/form-dialog';
import { ChoiceCards } from '@/shared/components/ui/choice-cards';
import { TextField } from '@/shared/components/ui/text-field';
import { useSendContractDraft } from '../../hooks/use-send-contract-draft';
import { getOrderTenantStep } from '../../lib/order-detail-steps';
import { sanitizeSaudiContactInput } from '../../lib/saudi-contact';
import { CONTACT_MODES, sendDraftDefaults, sendDraftSchema } from '../../schemas/send-draft-schema';

/** "إرسال مسودة العقد للعميل": the Ejar draft number and which phone number the customer used. */
export function SendDraftDialog({ open, onOpenChange, orderData, queryKey }) {
  const send = useSendContractDraft({ orderData, queryKey, onSuccess: () => onOpenChange(false) });
  const registeredMobile = orderData?.user?.mobile ?? getOrderTenantStep(orderData)?.tenant_mobile ?? orderData?.tenant_mobile ?? '';

  const contactOptions = [
    { value: CONTACT_MODES.SAME, label: `نفس رقم الطلب المسجل ${registeredMobile ? `(${registeredMobile})` : ''}` },
    { value: CONTACT_MODES.ANOTHER, label: 'تواصل معنا برقم آخر' },
  ];

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => !send.isPending && onOpenChange(next)}
      title="إرسال مسودة العقد للعميل"
      schema={sendDraftSchema}
      defaultValues={sendDraftDefaults}
      submitLabel="إرسال المسودة"
      onSubmit={send.mutateAsync}
    >
      {({ watch, setValue, register, formState: { errors } }) => (
        <>
          <TextField
            label="رقم مسودة العقد في إيجار *"
            placeholder="أدخل رقم المسودة (10 أرقام)"
            error={errors.draft_number?.message}
            {...register('draft_number')}
          />
          <ChoiceCards
            label="على أي رقم تواصل معكم العميل لإرسال المسودة؟"
            options={contactOptions}
            columns={2}
            value={watch('contact_mode')}
            onChange={(mode) => setValue('contact_mode', mode)}
          />
          {watch('contact_mode') === CONTACT_MODES.ANOTHER ? (
            <TextField
              dir="ltr"
              inputMode="numeric"
              maxLength={12}
              placeholder="05xxxxxxxx"
              error={errors.other_number?.message}
              {...register('other_number', { onChange: (event) => setValue('other_number', sanitizeSaudiContactInput('phone', event.target.value)) })}
            />
          ) : (
            <p className="text-xs leading-relaxed text-muted-foreground">
              بعض العملاء يتواصلون برقم مختلف عن رقم الطلب – سجل الرقم الفعلي الذي راسلكم منه ليُقيَّد في السجل.
            </p>
          )}
        </>
      )}
    </FormDialog>
  );
}
