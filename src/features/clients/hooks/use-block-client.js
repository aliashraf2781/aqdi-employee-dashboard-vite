import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { toggleClientBlock } from '@/features/clients/api/clients-api';
import { clientsKeys } from '@/features/clients/hooks/query-keys';

/** Blocks the client, or unblocks them if they are already blocked (the API toggles). */
export function useBlockClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleClientBlock,
    onSuccess: (response) => {
      toast.success(response?.data?.message || 'تم تحديث حالة العميل');
      queryClient.invalidateQueries({ queryKey: clientsKeys.all });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء تحديث حالة العميل')),
  });
}
