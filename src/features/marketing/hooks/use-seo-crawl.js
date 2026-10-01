import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query';
import { getCrawlDashboard, getCrawlIssueDetails, listCrawlIssues, startCrawl, stopCrawl } from '@/features/marketing/api/seo-crawl-api';
import { CRAWL_POLL_INTERVAL_MS, isCrawlInProgress } from '@/features/marketing/lib/seo-crawl';

export const SEO_CRAWL_QUERY_KEY = 'seo-crawl-dashboard';
export const SEO_CRAWL_ISSUES_QUERY_KEY = 'seo-crawl-issues';
export const SEO_CRAWL_ISSUE_DETAILS_QUERY_KEY = 'seo-crawl-issue-details';

const NOT_FOUND = 404;
const FORBIDDEN = 403;

/** Dashboard of the latest run. While a crawl is queued/running it is polled every few seconds. */
export function useSeoCrawlDashboard({ enabled = true } = {}) {
  return useQuery({
    queryKey: [SEO_CRAWL_QUERY_KEY, null],
    queryFn: () => getCrawlDashboard(),
    enabled,
    refetchInterval: (query) => (isCrawlInProgress(query.state.data?.status) ? CRAWL_POLL_INTERVAL_MS : false),
  });
}

export function useSeoCrawlIssues({ type, severity, search, page = 1, perPage = 20, enabled = true }) {
  return useQuery({
    queryKey: [SEO_CRAWL_ISSUES_QUERY_KEY, type ?? null, severity ?? null, search ?? '', page, perPage],
    queryFn: () => listCrawlIssues({ type, severity, search, page, perPage }),
    enabled,
    placeholderData: keepPreviousData,
    retry: (failureCount, error) => error?.response?.status !== NOT_FOUND && failureCount < 2,
  });
}

/** One issue's details. Enable it only while the row is expanded or the page needs it. */
export function useSeoCrawlIssueDetails(issueId, { enabled = true } = {}) {
  return useQuery({
    queryKey: [SEO_CRAWL_ISSUE_DETAILS_QUERY_KEY, issueId ?? null],
    queryFn: () => getCrawlIssueDetails(issueId),
    enabled: enabled && issueId != null,
    retry: (failureCount, error) => ![NOT_FOUND, FORBIDDEN].includes(error?.response?.status) && failureCount < 2,
  });
}

export const useStartSeoCrawl = () => useMutation({ mutationFn: startCrawl });
export const useStopSeoCrawl = () => useMutation({ mutationFn: stopCrawl });

/**
 * TODO(firebase): the Next.js app also subscribed to a Firebase Realtime Database node for smoother
 * live progress (percent, current url). Firebase is out of scope for this port, so this is a no-op:
 * the dashboard query above polls the REST endpoint every few seconds instead, which is the
 * source of truth for the status anyway. Replace the body when Firebase is added.
 */
// eslint-disable-next-line no-unused-vars
export function useSeoCrawlRealtime(path, { enabled = true } = {}) {
  return { liveStatus: null };
}
