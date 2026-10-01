import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { SEO_CRAWL_QUERY_KEY, useStartSeoCrawl, useStopSeoCrawl } from '@/features/marketing/hooks/use-seo-crawl';

const CONFLICT = 409;

/** Start / stop handlers of the crawl screen: they toast the outcome and refresh the data. */
export function useCrawlActions({ runId, refresh }) {
  const queryClient = useQueryClient();
  const startMutation = useStartSeoCrawl();
  const stopMutation = useStopSeoCrawl();

  const start = () => {
    startMutation.mutate(undefined, {
      onSuccess: (response) => {
        toast.success(response?.message || 'بدأ فحص الموقع');
        const started = response?.data;
        if (started?.id != null) {
          // Show the new run as queued right away; the dashboard still holds the previous run until the next fetch.
          queryClient.setQueryData([SEO_CRAWL_QUERY_KEY, null], (old) => ({
            ...old,
            id: started.id,
            status: started.status || 'queued',
            error_message: null,
          }));
        }
        refresh();
      },
      onError: (error) => {
        const message = error?.response?.data?.message;
        const isConflict = error?.response?.status === CONFLICT;
        toast.error(isConflict ? message || 'يوجد فحص للموقع قيد التشغيل حالياً' : getErrorMessage(error, 'تعذر بدء فحص الموقع'));
        refresh();
      },
    });
  };

  const stop = () => {
    stopMutation.mutate(runId, {
      onSuccess: (response) => {
        toast.success(response?.message || 'تم إيقاف الفحص');
        refresh();
      },
      onError: (error) => {
        toast.error(getErrorMessage(error, 'تعذر إيقاف الفحص'));
        refresh();
      },
    });
  };

  return { start, stop, isStarting: startMutation.isPending, isStopping: stopMutation.isPending };
}
