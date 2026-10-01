import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchGeneralSettings, setGeneralSetting } from '@/features/settings/api/general-settings-api';
import { GENERAL_SETTINGS_QUERY_KEY, extractGeneralSettings } from '@/features/settings/lib/general-settings';

export function useGeneralSettings() {
  return useQuery({
    queryKey: [GENERAL_SETTINGS_QUERY_KEY],
    queryFn: fetchGeneralSettings,
    select: extractGeneralSettings,
  });
}

/** Switches one site/app toggle. The mutation stays pending until the list is refreshed. */
export function useToggleGeneralSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setGeneralSetting,
    onSuccess: (body) => {
      toast.success(body?.message || 'تم حفظ الإعداد بنجاح');
      return queryClient.invalidateQueries({ queryKey: [GENERAL_SETTINGS_QUERY_KEY] });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'تعذر حفظ الإعداد')),
  });
}
