import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { postOrderStatus } from '../api/order-status-api';
import { updateOrder } from '../api/orders-api';
import { invalidateOrdersCaches } from '../lib/order-query-keys';
import { findDocumentedStatus, resolveCurrentStatusId } from '../lib/ejar-documentation';
import { useContractStatuses } from './use-contract-statuses';

/**
 * Mutation: record the Ejar contract number on the order and move it to the "documented" status
 * (when it is not there yet). Variables: { ejarNumber, notes }.
 */
export function useDocumentInEjar({ orderData, queryKey, onSuccess }) {
  const queryClient = useQueryClient();
  const { activeItems: statuses } = useContractStatuses();
  const documentedStatus = findDocumentedStatus(statuses);

  return useMutation({
    mutationFn: async ({ ejarNumber, notes }) => {
      const orderId = orderData?.id;
      await updateOrder(orderId, { ejar_contract_number: ejarNumber.trim(), ejar_status_notes: notes?.trim() || null });

      const alreadyDocumented = String(documentedStatus?.id) === String(resolveCurrentStatusId(orderData));
      if (documentedStatus?.id != null && !alreadyDocumented) await postOrderStatus(orderId, { statusId: documentedStatus.id });
    },
    onSuccess: () => {
      invalidateOrdersCaches(queryClient, { queryKey, orderId: orderData?.id });
      toast.success('تم توثيق الطلب في إيجار بنجاح');
      onSuccess?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, error?.message || 'حدث خطأ أثناء الحفظ')),
  });
}
