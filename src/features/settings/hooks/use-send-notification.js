import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { sendNotification } from '@/features/settings/api/notifications-api';

export function useSendNotification({ onSuccess }) {
  return useMutation({
    mutationFn: sendNotification,
    onSuccess: (body) => {
      toast.success(body?.message || 'تم إرسال الإشعار بنجاح');
      onSuccess?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, 'فشل إرسال الإشعار')),
  });
}
