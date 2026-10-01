import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { deactivateClientCoupon } from '@/features/clients/api/client-coupons-api';
import { clientsKeys } from '@/features/clients/hooks/query-keys';

export function useDeactivateClientCoupon(clientId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponId) => deactivateClientCoupon(clientId, couponId),
    onSuccess: (response) => {
      toast.success(response?.data?.message || 'تم إلغاء تفعيل الخصم');
      queryClient.invalidateQueries({ queryKey: clientsKeys.coupons(clientId) });
      queryClient.invalidateQueries({ queryKey: clientsKeys.detail(clientId) });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء إلغاء تفعيل الخصم')),
  });
}
