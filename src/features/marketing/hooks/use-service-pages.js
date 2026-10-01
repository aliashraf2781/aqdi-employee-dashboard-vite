import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { createServicePage, deleteServicePage, listServicePages, updateServicePage } from '@/features/marketing/api/service-pages-api';
import { retryUnlessClientError } from '@/features/marketing/lib/retry';

export const SERVICE_PAGES_QUERY_KEY = 'marketing-service-pages';
const STALE_TIME = 60_000;

export function useServicePages() {
  const query = useQuery({
    queryKey: [SERVICE_PAGES_QUERY_KEY],
    queryFn: listServicePages,
    staleTime: STALE_TIME,
    retry: retryUnlessClientError,
  });

  return {
    summary: query.data?.summary ?? null,
    items: query.data?.items ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

function useServicePageMutation(mutationFn, { successMessage, errorMessage, onDone }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: [SERVICE_PAGES_QUERY_KEY] });
      onDone?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, errorMessage)),
  });
}

export const useCreateServicePage = (onDone) =>
  useServicePageMutation(createServicePage, { successMessage: 'تمت إضافة الصفحة', errorMessage: 'تعذّر حفظ الصفحة', onDone });

export const useUpdateServicePage = (onDone) =>
  useServicePageMutation(updateServicePage, { successMessage: 'تم تحديث الصفحة', errorMessage: 'تعذّر حفظ الصفحة', onDone });

export const useDeleteServicePage = (onDone) =>
  useServicePageMutation(deleteServicePage, { successMessage: 'تم حذف الصفحة', errorMessage: 'تعذّر الحذف', onDone });
