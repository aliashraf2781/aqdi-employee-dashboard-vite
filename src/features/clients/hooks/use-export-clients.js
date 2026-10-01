import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { exportClients } from '@/features/clients/api/clients-api';
import { saveExportResponse } from '@/features/clients/lib/export-file';

function buildFallbackFilename() {
  return `clients-${new Date().toISOString().slice(0, 10)}.csv`;
}

/** Downloads every client matching the given list filters. */
export function useExportClients() {
  return useMutation({
    mutationFn: async (filters) => {
      const response = await exportClients(filters);
      await saveExportResponse(response, buildFallbackFilename());
    },
    onSuccess: () => toast.success('تم تصدير العملاء'),
    onError: (error) => toast.error(getErrorMessage(error, 'تعذر تصدير العملاء')),
  });
}
