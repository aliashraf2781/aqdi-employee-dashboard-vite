import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { getReceiveContractId, receiveContract } from '../api/orders-api';
import { invalidateOrdersCaches } from '../lib/order-query-keys';

/** Mutation: the logged-in employee receives (takes) an order. Variable: the order row. */
export function useReceiveContract({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (order) => receiveContract(order),
    onSuccess: (data, order) => {
      invalidateOrdersCaches(queryClient, { orderId: getReceiveContractId(order) });
      toast.success(data?.message || 'تم استلام الطلب');
      onSuccess?.(data, order);
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء استلام الطلب')),
  });
}
