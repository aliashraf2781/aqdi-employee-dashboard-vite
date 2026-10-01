import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  connectGoogleSeo,
  getGoogleSeoStatus,
  getSearchConsoleSites,
  getUtmTemplate,
  importAdSpend,
  selectSearchConsoleSite,
  syncAdSpend,
} from '@/features/marketing/api/integrations-api';
import { MARKETING_TRACKING_QUERY_KEY } from '@/features/marketing/hooks/use-marketing-tracking';

export const UTM_TEMPLATE_QUERY_KEY = 'marketing-utm-template';
export const GOOGLE_SEO_STATUS_QUERY_KEY = 'google-seo-status';
export const SEARCH_CONSOLE_SITES_QUERY_KEY = 'search-console-sites';

const UTM_STALE_TIME = 10 * 60 * 1000;
const GOOGLE_STATUS_STALE_TIME = 5 * 60 * 1000;
const NO_RETRY_STATUSES = [401, 403, 404, 422, 500];
// The server answers 500/422 until Google OAuth is provisioned: that is "not available yet", not a glitch.
const NOT_PROVISIONED_STATUSES = [500, 422];

const retryUnlessServerRefused = (failureCount, error) =>
  !NO_RETRY_STATUSES.includes(error?.response?.status) && failureCount < 2;

/** Canonical utm_source values, the tagged-URL template and the ad-account status per platform. */
export function useUtmTemplate() {
  const query = useQuery({
    queryKey: [UTM_TEMPLATE_QUERY_KEY],
    queryFn: getUtmTemplate,
    staleTime: UTM_STALE_TIME,
    retry: retryUnlessServerRefused,
  });
  const data = query.data;

  return {
    template: data?.template ?? null,
    example: data?.example ?? null,
    clickIds: data?.click_ids ?? [],
    sources: data?.sources ?? [],
    accounts: data?.accounts ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

function useRefreshTrackingOnSuccess(mutationFn) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [MARKETING_TRACKING_QUERY_KEY] }),
  });
}

export const useImportAdSpend = () => useRefreshTrackingOnSuccess(importAdSpend);
export const useSyncAdSpend = () => useRefreshTrackingOnSuccess(syncAdSpend);

/** Google Search Console connection state. */
export function useGoogleSeoStatus() {
  const query = useQuery({
    queryKey: [GOOGLE_SEO_STATUS_QUERY_KEY],
    queryFn: getGoogleSeoStatus,
    staleTime: GOOGLE_STATUS_STALE_TIME,
    retry: retryUnlessServerRefused,
  });

  return {
    status: query.data ?? null,
    connected: Boolean(query.data?.connected),
    isLoading: query.isLoading,
    unavailable: NOT_PROVISIONED_STATUSES.includes(query.error?.response?.status),
    refetch: query.refetch,
  };
}

export const useConnectGoogleSeo = () => useMutation({ mutationFn: connectGoogleSeo });

export function useSearchConsoleSites({ enabled = false } = {}) {
  const query = useQuery({
    queryKey: [SEARCH_CONSOLE_SITES_QUERY_KEY],
    queryFn: getSearchConsoleSites,
    enabled,
    retry: retryUnlessServerRefused,
  });

  return { sites: query.data?.sites ?? query.data ?? [], isLoading: query.isLoading, error: query.error, refetch: query.refetch };
}

export function useSelectSearchConsoleSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: selectSearchConsoleSite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [GOOGLE_SEO_STATUS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MARKETING_TRACKING_QUERY_KEY] });
    },
  });
}
