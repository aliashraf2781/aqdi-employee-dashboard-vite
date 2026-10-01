import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchAdminOrders } from '../api/orders-api';
import { REALTIME_ORDERS_QUERY_KEY } from '../lib/order-query-keys';

const AUTO_REFRESH_INTERVAL_MS = 15_000;

/**
 * One page of GET /admin/orders. `queryKey` is the cache root of the screen
 * (all-orders, realtime-orders, ...) so each screen can be invalidated on its own.
 */
export function useOrdersList({
  params,
  queryKey = REALTIME_ORDERS_QUERY_KEY,
  enabled = true,
  autoRefresh = false,
  refetchInterval = AUTO_REFRESH_INTERVAL_MS,
}) {
  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => fetchAdminOrders(params),
    enabled,
    refetchInterval: autoRefresh ? refetchInterval : false,
    refetchIntervalInBackground: autoRefresh,
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items ?? [];

  return {
    items,
    total: query.data?.total ?? items.length,
    pagination: query.data?.pagination,
    summary: query.data?.summary ?? null,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
