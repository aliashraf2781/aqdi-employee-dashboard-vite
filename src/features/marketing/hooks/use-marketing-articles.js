import { useQuery } from '@tanstack/react-query';
import { listMarketingArticles } from '@/features/marketing/api/articles-api';
import { useMarketingPeriod } from '@/features/marketing/hooks/use-marketing-period';
import { DEFAULT_CURRENCY_LABEL } from '@/features/marketing/lib/format';
import { retryUnlessClientError } from '@/features/marketing/lib/retry';

export const MARKETING_ARTICLES_QUERY_KEY = 'marketing-articles';
const STALE_TIME = 60_000;
const ALL_CATEGORIES = 'all';

export function useMarketingArticles({ category, status }) {
  const { queryParams } = useMarketingPeriod();
  const params = { ...queryParams };
  if (category && category !== ALL_CATEGORIES) params.category = category;
  if (status) params.status = status;

  const query = useQuery({
    queryKey: [MARKETING_ARTICLES_QUERY_KEY, params],
    queryFn: () => listMarketingArticles(params),
    staleTime: STALE_TIME,
    retry: retryUnlessClientError,
  });
  const data = query.data;

  return {
    summary: data?.summary ?? null,
    categories: data?.categories ?? [],
    items: data?.items ?? [],
    editorialQueue: data?.editorial_queue ?? [],
    periods: data?.periods ?? null,
    currencyLabel: data?.currency_label_ar ?? DEFAULT_CURRENCY_LABEL,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
