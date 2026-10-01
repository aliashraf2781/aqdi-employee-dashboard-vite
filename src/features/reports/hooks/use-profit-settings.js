import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { fetchProfitSettings, updateProfitSettings } from '../api/reports-api';
import { REPORTS_QUERY_KEY } from './use-reports';

const PROFIT_SETTINGS_KEY = ['profit-settings'];

export function useProfitSettings() {
  return useQuery({ queryKey: PROFIT_SETTINGS_KEY, queryFn: fetchProfitSettings });
}

export function useUpdateProfitSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfitSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFIT_SETTINGS_KEY });
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
    },
    onError: (error) => toast.error(getErrorMessage(error, 'تعذر حفظ الإعدادات المالية')),
  });
}
