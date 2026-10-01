import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { saveContractStatus } from '../api/contract-statuses-api';
import { invalidateContractStatusCaches } from '../lib/order-query-keys';

/** Mutation: create or update a contract status. Variables: { id?, payload }. */
export function useSaveContractStatus({ onSuccess } = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveContractStatus,
    onSuccess: (data, variables) => {
      toast.success(data?.message || (variables.id ? 'تم تحديث الحالة' : 'تم إضافة الحالة'));
      invalidateContractStatusCaches(queryClient);
      onSuccess?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, 'تعذر حفظ الحالة')),
  });
}
