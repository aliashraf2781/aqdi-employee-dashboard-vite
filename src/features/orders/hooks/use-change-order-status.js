import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { postOrderStatus } from '../api/order-status-api';
import { invalidateOrdersCaches } from '../lib/order-query-keys';

/** Mutation: change an order's contract status. Variables: { orderId, statusId, extraValues?, fields? }. */
export function useChangeOrderStatus({ queryKey, onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, statusId, extraValues, fields }) =>
      postOrderStatus(orderId, { statusId, extraValues, fields }),
    onSuccess: (data, variables) => {
      invalidateOrdersCaches(queryClient, { queryKey, orderId: variables.orderId });
      toast.success(data?.message || 'تم تغيير حالة الطلب');
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'حدث خطأ أثناء تغيير حالة الطلب'));
      onError?.(error);
    },
  });
}
