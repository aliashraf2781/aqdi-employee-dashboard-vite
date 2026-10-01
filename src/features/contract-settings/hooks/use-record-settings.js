import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { unwrapSettingsRecord } from '@/shared/lib/settings-record';
import { fetchSettingsRecord, saveSettingsRecord } from '@/features/contract-settings/api/settings-record-api';
import { buildRecordPayload, mapApiFieldErrors } from '@/features/contract-settings/lib/record-settings';

/** Loads the record behind a record-settings config (already unwrapped). */
export function useSettingsRecord(config) {
  return useQuery({
    queryKey: [config.queryKey],
    queryFn: () => fetchSettingsRecord(config.endpoint),
    select: unwrapSettingsRecord,
  });
}

/** Saves the record. `onFieldErrors` receives server validation errors keyed by field name. */
export function useSaveSettingsRecord(config, { onFieldErrors }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) => saveSettingsRecord(config.endpoint, buildRecordPayload(values, config.fields)),
    onSuccess: (body) => {
      toast.success(body?.message || config.messages.saved);
      return queryClient.invalidateQueries({ queryKey: [config.queryKey] });
    },
    onError: (error) => {
      onFieldErrors(mapApiFieldErrors(error?.response?.data?.errors));
      toast.error(getErrorMessage(error, config.messages.saveFailed));
    },
  });
}
