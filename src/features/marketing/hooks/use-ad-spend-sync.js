import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { useSyncAdSpend } from '@/features/marketing/hooks/use-marketing-integrations';
import { buildSyncOutcome } from '@/features/marketing/lib/platforms';

const SYNC_DAYS = 30;

/** "Sync ad spend" mutation that toasts the outcome. `sync(platform?)` syncs one platform or all. */
export function useAdSpendSync() {
  const mutation = useSyncAdSpend();

  const sync = (platform) => {
    mutation.mutate(
      { days: SYNC_DAYS, ...(platform ? { platform } : {}) },
      {
        onSuccess: (results) => {
          const { type, message, description } = buildSyncOutcome(results);
          if (type === 'success') toast.success(message);
          else toast.message(message, { description });
        },
        onError: (error) => toast.error(getErrorMessage(error, 'تعذّرت مزامنة صرف الإعلانات')),
      },
    );
  };

  return { sync, isSyncing: mutation.isPending };
}
