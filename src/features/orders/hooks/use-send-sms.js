import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { sendSms } from '../api/sms-api';

/** Mutation: send an SMS. Variables: { message, recipient, endpoint? }. */
export function useSendSms({ onSuccess } = {}) {
  return useMutation({
    mutationFn: sendSms,
    onSuccess: (data) => {
      toast.success(data?.message || 'تم إرسال الرسالة بنجاح');
      onSuccess?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, error?.message || 'حدث خطأ أثناء إرسال الرسالة')),
  });
}
