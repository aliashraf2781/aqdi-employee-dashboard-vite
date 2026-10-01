import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { COUPONS_QUERY_KEY, setCouponActive } from '@/features/settings/api/coupons-api';

export function useCouponStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCouponActive,
    onSuccess: (body) => {
      toast.success(body?.message || 'تم تحديث حالة الخصم بنجاح');
      queryClient.invalidateQueries({ queryKey: [COUPONS_QUERY_KEY] });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء تغيير حالة الخصم')),
  });
}
