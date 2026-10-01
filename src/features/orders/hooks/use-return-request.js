import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { createReturnRequest } from '../api/return-request-api';
import { invalidateRefundCaches } from '../lib/order-query-keys';
import { resolveRefundableContractId } from '../lib/refund-ids';

/**
 * Mutation: raise a return request for `order`.
 * Call `mutate({ refundAmount, notes, contractFile })`; `invalidateAfterClose` refreshes lists when the flow ends.
 */
export function useReturnRequest({ order, orderId, orderUuid, queryKey, onReturnSuccess }) {
  const queryClient = useQueryClient();
  const contractId = resolveRefundableContractId(order, orderId ?? orderUuid);
  const resolvedOrderId = orderId ?? order?.id ?? orderUuid;

  const invalidateAfterClose = () => invalidateRefundCaches(queryClient, { queryKey, orderId: resolvedOrderId });

  const mutation = useMutation({
    mutationFn: ({ refundAmount, notes, contractFile }) => {
      if (!contractId) throw new Error('تعذر تحديد العقد المرتبط بالطلب');
      return createReturnRequest({ contractId, refundAmount, notes, contractFile });
    },
    onSuccess: (data) => {
      toast.success(data?.message || 'تم رفع طلب الاسترجاع بنجاح');
      invalidateAfterClose();
      onReturnSuccess?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, error?.message || 'حدث خطأ أثناء إرسال طلب الاسترجاع')),
  });

  return { ...mutation, invalidateAfterClose };
}
