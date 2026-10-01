import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchPaymentMessages, savePaymentMessage } from '@/features/contract-settings/api/payment-messages-api';

const PAYMENT_MESSAGES_QUERY_KEY = 'payment-messages';

export function usePaymentMessages() {
  return useQuery({ queryKey: [PAYMENT_MESSAGES_QUERY_KEY], queryFn: fetchPaymentMessages });
}

export function useSavePaymentMessage({ onSaved }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePaymentMessage,
    onSuccess: (body, { id }) => {
      toast.success(body?.message || (id ? 'تم تحديث رسالة الدفع بنجاح' : 'تم إضافة رسالة الدفع بنجاح'));
      queryClient.invalidateQueries({ queryKey: [PAYMENT_MESSAGES_QUERY_KEY] });
      onSaved?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء حفظ رسالة الدفع')),
  });
}
