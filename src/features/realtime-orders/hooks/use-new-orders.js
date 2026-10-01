import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { REALTIME_NEW_ORDERS_QUERY_KEY } from '@/features/orders';
import { fetchNewOrders } from '../api/new-orders-api';

const REFRESH_INTERVAL_MS = 15_000;

/** The orders waiting to be received. Refreshes by itself while `autoRefresh` is on. */
export function useNewOrders({ statusId, enabled, autoRefresh }) {
  const query = useQuery({
    queryKey: [REALTIME_NEW_ORDERS_QUERY_KEY, statusId],
    queryFn: () => fetchNewOrders(statusId),
    enabled: enabled && statusId != null && statusId !== '',
    refetchInterval: autoRefresh ? REFRESH_INTERVAL_MS : false,
    refetchIntervalInBackground: autoRefresh,
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items ?? [];

  return {
    items,
    total: query.data?.total ?? items.length,
    summary: query.data?.summary ?? null,
    isLoading: query.isLoading,
  };
}
