import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { assignClientCoupon } from '@/features/clients/api/client-coupons-api';
import { unwrapData } from '@/features/clients/lib/unwrap-data';
import { clientsKeys } from '@/features/clients/hooks/query-keys';

function buildSuccessMessage(response) {
  const data = unwrapData(response);
  const secretCode = data?.secret_code ?? data?.code_coupon;
  if (secretCode) return `تم حفظ الخصم بنجاح — الرمز السري: ${secretCode}`;
  return response?.data?.message || 'تم حفظ الخصم بنجاح';
}

export function useAssignClientCoupon(clientId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formValues) => assignClientCoupon(clientId, formValues),
    onSuccess: (response) => {
      toast.success(buildSuccessMessage(response));
      queryClient.invalidateQueries({ queryKey: clientsKeys.coupons(clientId) });
      queryClient.invalidateQueries({ queryKey: clientsKeys.detail(clientId) });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء حفظ الخصم')),
  });
}
