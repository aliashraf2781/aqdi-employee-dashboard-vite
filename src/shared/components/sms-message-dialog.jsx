import { z } from 'zod';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextareaField } from '@/shared/components/ui/textarea-field';

const SMS_SEGMENT_LENGTH = 70;

const smsSchema = z.object({
  message: z.string().trim().min(1, 'يرجى كتابة نص الرسالة'),
});

const DEFAULT_VALUES = { message: '' };

function countSegments(text) {
  return Math.max(1, Math.ceil(text.length / SMS_SEGMENT_LENGTH));
}

/**
 * Compose-and-send dialog for one SMS. It does not know who the recipient is or
 * which endpoint is used: the caller passes `recipientLabel` and `onSend(message)`.
 */
export function SmsMessageDialog({ open, onOpenChange, recipientLabel, onSend }) {
  async function handleSend({ message }) {
    try {
      await onSend(message);
      onOpenChange(false);
    } catch {
      // The caller's mutation already showed the error toast; keep the dialog open.
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="إرسال رسالة SMS"
      description={recipientLabel}
      schema={smsSchema}
      defaultValues={DEFAULT_VALUES}
      onSubmit={handleSend}
      submitLabel="إرسال الرسالة"
    >
      {({ register, watch, formState: { errors } }) => {
        const text = watch('message') ?? '';
        return (
          <>
            <TextareaField
              label="نص الرسالة"
              rows={6}
              placeholder="اكتب نص الرسالة هنا..."
              error={errors.message?.message}
              {...register('message')}
            />
            <p className="text-xs text-muted-foreground">
              {text.length} حرف{text.length > 0 ? ` · ≈ ${countSegments(text)} رسالة` : ''}
            </p>
          </>
        );
      }}
    </FormDialog>
  );
}
