import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getTrackingSnapshot } from '@/features/marketing/api/tracking-api';
import { useMarketingPeriod } from '@/features/marketing/hooks/use-marketing-period';
import { retryUnlessClientError } from '@/features/marketing/lib/retry';

export const MARKETING_TRACKING_QUERY_KEY = 'marketing-tracking';
const STALE_TIME = 60_000;

function useTrackingSnapshot(segment, { enabled = true } = {}) {
  const { queryParams } = useMarketingPeriod();

  return useQuery({
    queryKey: [MARKETING_TRACKING_QUERY_KEY, segment, queryParams],
    queryFn: () => getTrackingSnapshot(segment, queryParams),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: STALE_TIME,
    retry: retryUnlessClientError,
  });
}

/** Overview tab: ROAS header, KPIs, chart, top lists. */
export const useMarketingOverview = (options) => useTrackingSnapshot('', options);

/** Keyword ranking cards + table. */
export const useMarketingKeywords = (options) => useTrackingSnapshot('keywords', options);

/** Marketing funnel + paid-channel ROI. */
export const useMarketingChannels = (options) => useTrackingSnapshot('channels', options);
