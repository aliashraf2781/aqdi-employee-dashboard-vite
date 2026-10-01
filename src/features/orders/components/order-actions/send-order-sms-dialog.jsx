import { Phone, Sparkles, UserRound } from 'lucide-react';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { cn } from '@/shared/lib/cn';
import { useSendSms } from '../../hooks/use-send-sms';
import { getOrderContractUuid } from '../../lib/order-contact';
import { getOrderSmsTemplates } from '../../lib/order-sms-templates';
import { resolveOrderSmsPhone, resolveOrderSmsUserId, resolveSmsRecipient } from '../../lib/order-sms-recipient';
import { countSmsSegments, smsSchema } from '../../schemas/sms-schema';

const SMS_DEFAULTS = { message: '' };

function RecipientChips({ phone, userId, orderUuid }) {
  return (
    <div className="flex flex-wrap gap-2">
      {phone && (
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-3 text-xs font-bold text-accent-foreground">
          <Phone className="size-3.5" />
          <span dir="ltr">{phone}</span>
        </span>
      )}
      {userId != null && (
        <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-muted px-3 text-xs font-bold text-muted-foreground">
          <UserRound className="size-3.5" />
          معرّف المستخدم: <span dir="ltr">{userId}</span>
        </span>
      )}
      {orderUuid && <span className="inline-flex h-8 items-center rounded-full bg-info-soft px-3 text-xs font-bold text-info">#{orderUuid}</span>}
    </div>
  );
}

/** "إرسال رسالة SMS" to the customer of an order, with ready-made templates. */
export function SendOrderSmsDialog({ open, onOpenChange, order }) {
  const sms = useSendSms({ onSuccess: () => onOpenChange(false) });
  const recipient = useMemo(() => resolveSmsRecipient(order), [order]);
  const orderUuid = getOrderContractUuid(order) || order?.uuid || '';
  const templates = getOrderSmsTemplates(orderUuid);

  const submit = ({ message }) => {
    if (!recipient) {
      toast.error('تعذر تحديد المستخدم أو رقم الجوال لإرسال الرسالة');
      return undefined;
    }
    return sms.mutateAsync({ message, recipient });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="إرسال رسالة SMS"
      description="أرسل رسالة مباشرة للعميل أو استخدم قالبًا جاهزًا"
      schema={smsSchema}
      defaultValues={SMS_DEFAULTS}
      submitLabel="إرسال الرسالة"
      onSubmit={submit}
    >
      {({ register, watch, setValue, formState: { errors } }) => {
        const message = watch('message') ?? '';
        return (
          <>
            <RecipientChips phone={resolveOrderSmsPhone(order)} userId={resolveOrderSmsUserId(order)} orderUuid={orderUuid} />

            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                <Sparkles className="size-3.5" />
                قوالب جاهزة
              </div>
              <div className="flex flex-wrap gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setValue('message', template.body, { shouldValidate: true })}
                    className={cn(
                      'h-8 rounded-full border px-3 text-xs font-bold transition-colors',
                      message === template.body ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-accent',
                    )}
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold tabular-nums text-muted-foreground">
                {message.length} حرف{message.length > 0 ? ` · ≈ ${countSmsSegments(message)} رسالة` : ''}
              </p>
              <TextareaField
                label="نص الرسالة"
                rows={6}
                placeholder="اكتب نص الرسالة هنا أو اختر قالبًا جاهزًا..."
                error={errors.message?.message}
                {...register('message')}
              />
            </div>
          </>
        );
      }}
    </FormDialog>
  );
}
