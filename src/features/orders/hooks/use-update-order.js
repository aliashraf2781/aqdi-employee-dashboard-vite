import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { updateOrder } from '../api/orders-api';
import { invalidateOrdersCaches } from '../lib/order-query-keys';

/** Mutation: POST /admin/orders/{id} with any updatable fields. Variables: { orderId, body }. */
export function useUpdateOrder({ queryKey, successMessage, onSuccess, onError } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, body }) => updateOrder(orderId, body),
    onSuccess: (data, variables) => {
      invalidateOrdersCaches(queryClient, { queryKey, orderId: variables.orderId });
      toast.success(data?.message || successMessage || 'تم الحفظ بنجاح');
      onSuccess?.(data, variables);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'حدث خطأ أثناء الحفظ'));
      onError?.(error);
    },
  });
}
