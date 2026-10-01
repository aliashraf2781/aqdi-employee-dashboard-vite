import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchActiveDraftStatuses, updateDraftContract } from '../api/draft-contract-api';
import { DRAFT_STATUSES_QUERY_KEY, invalidateDraftOrdersCaches, SINGLE_ORDER_QUERY_KEY } from '../lib/order-query-keys';

const DRAFT_STATUSES_STALE_TIME = 5 * 60_000;

export function useActiveDraftStatuses() {
  const query = useQuery({ queryKey: [DRAFT_STATUSES_QUERY_KEY], queryFn: fetchActiveDraftStatuses, staleTime: DRAFT_STATUSES_STALE_TIME });
  return { statuses: query.data ?? [], isLoading: query.isLoading };
}

/**
 * Mutation: update the draft status and/or draft contract number of a lease renewal order.
 * Variables: the request body ({ draft_contract_status_id?, draft_contract_number? }).
 */
export function useUpdateDraftContract({ orderId, successMessage, errorMessage, onSuccess }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body) => updateDraftContract(orderId, body),
    onSuccess: (data) => {
      toast.success(data?.message || successMessage);
      invalidateDraftOrdersCaches(queryClient, { queryKey: [SINGLE_ORDER_QUERY_KEY, orderId], orderId });
      onSuccess?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, errorMessage)),
  });
}
