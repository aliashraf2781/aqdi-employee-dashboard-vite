import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { postOrderStatusBody } from '../api/order-status-api';
import { invalidateOrdersCaches } from '../lib/order-query-keys';
import { isSendContractDraftStatus, SEND_CONTRACT_DRAFT_STATUS_ID } from '../lib/order-status-payload';
import { buildSendDraftBody } from '../schemas/send-draft-schema';
import { useContractStatuses } from './use-contract-statuses';

/** Mutation: send the contract draft to the customer (a status change with the draft number and contact number). */
export function useSendContractDraft({ orderData, queryKey, onSuccess }) {
  const queryClient = useQueryClient();
  const { activeItems: statuses } = useContractStatuses();
  const statusId = statuses.find(isSendContractDraftStatus)?.id ?? SEND_CONTRACT_DRAFT_STATUS_ID;

  return useMutation({
    mutationFn: (values) => postOrderStatusBody(orderData?.id, buildSendDraftBody(statusId, values)),
    onSuccess: (data) => {
      invalidateOrdersCaches(queryClient, { queryKey, orderId: orderData?.id });
      toast.success(data?.message || 'تم إرسال مسودة العقد للعميل');
      onSuccess?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, error?.message || 'حدث خطأ أثناء الإرسال')),
  });
}
