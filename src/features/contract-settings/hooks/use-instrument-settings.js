import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchInstrumentSettings, saveInstrumentSetting } from '@/features/contract-settings/api/instrument-settings-api';
import { buildInstrumentSettingPayload, mergeInstrumentSettings } from '@/features/contract-settings/lib/instrument-settings';

const INSTRUMENT_SETTINGS_QUERY_KEY = 'setting-contracts';

export function useInstrumentSettings() {
  return useQuery({
    queryKey: [INSTRUMENT_SETTINGS_QUERY_KEY],
    queryFn: fetchInstrumentSettings,
    select: mergeInstrumentSettings,
  });
}

/** Changes one property (`realestate`, `contract` or `label`) of one instrument row. */
export function useUpdateInstrumentSetting({ successMessage, failureMessage, onSaved }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ item, changes }) => {
      const updated = { ...item, ...changes };
      return saveInstrumentSetting({ id: item.id, payload: buildInstrumentSettingPayload(updated) });
    },
    onSuccess: (body) => {
      toast.success(body?.message || successMessage);
      queryClient.invalidateQueries({ queryKey: [INSTRUMENT_SETTINGS_QUERY_KEY] });
      onSaved?.();
    },
    onError: (error) => toast.error(getErrorMessage(error, failureMessage)),
  });
}
