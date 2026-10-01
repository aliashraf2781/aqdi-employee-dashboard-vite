import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import {
  POPUP_CONTRACTS_PER_PAGE,
  fetchAllPopupContracts,
  fetchPopupContracts,
  savePopupContract,
} from '@/features/contract-settings/api/popup-contracts-api';

const POPUP_CONTRACTS_QUERY_KEY = 'popup-contracts';

export function usePopupContracts(page) {
  return useQuery({
    queryKey: [POPUP_CONTRACTS_QUERY_KEY, page],
    queryFn: () => fetchPopupContracts({ page, perPage: POPUP_CONTRACTS_PER_PAGE }),
    placeholderData: keepPreviousData,
  });
}

/** Document types that already have a popup. */
export function useUsedPopupTypes() {
  const { data } = useQuery({
    queryKey: [POPUP_CONTRACTS_QUERY_KEY, 'used-types'],
    queryFn: fetchAllPopupContracts,
  });
  return (data ?? []).map((item) => item.instrument_type).filter(Boolean);
}

/** Add (no `id`) or edit (with `id`) a popup. */
export function useSavePopupContract({ onSaved }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePopupContract,
    onSuccess: (body, { id }) => {
      toast.success(body?.message || (id ? 'تم تعديل المحتوى الإرشادي بنجاح' : 'تم إضافة المحتوى الإرشادي بنجاح'));
      queryClient.invalidateQueries({ queryKey: [POPUP_CONTRACTS_QUERY_KEY] });
      onSaved?.();
    },
    onError: (error, { id }) => {
      toast.error(getErrorMessage(error, id ? 'حدث خطأ أثناء تعديل المحتوى' : 'حدث خطأ أثناء إضافة المحتوى'));
    },
  });
}
