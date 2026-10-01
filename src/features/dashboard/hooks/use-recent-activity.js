import { useQuery } from '@tanstack/react-query';
import { fetchUnreceivedOrders } from '@/features/dashboard/api/dashboard-api';
import { mapOrderToActivity } from '@/features/dashboard/lib/map-order-to-activity';
import { retryUnlessAuthError } from './retry-policy';

const ACTIVITY_LIMIT = 6;
const STALE_TIME_MS = 30_000;

/** "Recent activity" = the newest orders still waiting to be received. */
export function useRecentActivity({ enabled, hrefBase }) {
  const query = useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: () => fetchUnreceivedOrders({ perPage: ACTIVITY_LIMIT }),
    enabled,
    staleTime: STALE_TIME_MS,
    retry: retryUnlessAuthError,
  });

  const result = query.data;
  const orders = result?.items ?? (Array.isArray(result) ? result : []);

  return {
    activity: orders.map((order) => mapOrderToActivity(order, hrefBase)),
    total: result?.pagination?.total ?? orders.length,
    isLoading: enabled && query.isLoading,
    isError: query.isError,
  };
}
