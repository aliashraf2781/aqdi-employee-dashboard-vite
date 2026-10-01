import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { deleteClient } from '@/features/clients/api/clients-api';
import { clientsKeys } from '@/features/clients/hooks/query-keys';

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClient,
    onSuccess: (response, clientId) => {
      toast.success(response?.data?.message || 'تم حذف العميل بنجاح');
      queryClient.removeQueries({ queryKey: clientsKeys.detail(clientId) });
      queryClient.invalidateQueries({ queryKey: clientsKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء حذف العميل')),
  });
}
