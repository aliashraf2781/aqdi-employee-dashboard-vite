import { useMutation, useQuery } from '@tanstack/react-query';
import { exportMarketingReport, getMarketingReport } from '@/features/marketing/api/reports-api';
import { useMarketingPeriod } from '@/features/marketing/hooks/use-marketing-period';
import { retryUnlessClientError } from '@/features/marketing/lib/retry';
import { downloadBlob } from '@/shared/lib/download-blob';

export const MARKETING_REPORTS_QUERY_KEY = 'marketing-reports';
const STALE_TIME = 60_000;
const ALL_CHANNELS = 'all';
const FILE_EXTENSIONS = { pdf: 'pdf', xlsx: 'xlsx', csv: 'csv' };

function useReportQuery(segment, channel) {
  const { queryParams } = useMarketingPeriod();
  const params = channel && channel !== ALL_CHANNELS ? { ...queryParams, channel } : queryParams;

  return useQuery({
    queryKey: [MARKETING_REPORTS_QUERY_KEY, segment, params],
    queryFn: () => getMarketingReport(segment, params),
    staleTime: STALE_TIME,
    retry: retryUnlessClientError,
  });
}

export const useMarketingReport = (channel) => useReportQuery('', channel);
export const useMarketingReportChannels = (channel) => useReportQuery('channels', channel);

/** Exports the report in the selected period. PDF/Excel/CSV are downloaded, "email" is sent by the server. */
export function useExportMarketingReport() {
  const { queryParams } = useMarketingPeriod();

  return useMutation({
    mutationFn: async ({ format, channel }) => {
      const result = await exportMarketingReport({
        format,
        period: queryParams.period,
        date_from: queryParams.date_from ?? null,
        date_to: queryParams.date_to ?? null,
        channel: channel || ALL_CHANNELS,
      });

      if (result.kind === 'url') window.open(result.url, '_blank', 'noopener,noreferrer');
      if (result.kind === 'file') {
        const day = new Date().toISOString().slice(0, 10);
        downloadBlob(result.blob, `marketing-report-${day}.${FILE_EXTENSIONS[format] || 'bin'}`);
      }
      return { emailed: result.kind === 'email', message: result.message };
    },
  });
}
