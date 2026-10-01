import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchAppStatus, updateAppStatus } from '@/features/settings/api/app-status-api';
import { APP_STATUS_QUERY_KEY, extractAppStatus } from '@/features/settings/lib/app-status';

export function useAppStatus() {
  return useQuery({
    queryKey: [APP_STATUS_QUERY_KEY],
    queryFn: fetchAppStatus,
    select: extractAppStatus,
  });
}

/** Saves one block of the app status. `successMessage`/`failureMessage` are the fallback toasts. */
export function useSaveAppStatus({ successMessage, failureMessage }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAppStatus,
    onSuccess: (body) => {
      toast.success(body?.message || successMessage);
      queryClient.invalidateQueries({ queryKey: [APP_STATUS_QUERY_KEY] });
    },
    onError: (error) => toast.error(getErrorMessage(error, failureMessage)),
  });
}
