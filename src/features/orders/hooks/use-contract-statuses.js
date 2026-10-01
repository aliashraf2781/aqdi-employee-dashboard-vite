import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchContractStatuses } from '../api/contract-statuses-api';
import {
  resolveCanceledContractStatusId,
  resolveNewContractStatusId,
  resolveReceivedContractStatusId,
  resolveReturnedContractStatusId,
} from '../lib/contract-statuses';
import { CONTRACT_STATUSES_ACTIVE_QUERY_KEY, CONTRACT_STATUSES_QUERY_KEY } from '../lib/order-query-keys';

const STATUSES_STALE_TIME = 60_000;

const isActive = (status) => status?.is_active !== false && status?.is_active !== 0;

/** Contract statuses plus the ids of the well-known ones (new, received, returned, canceled). */
export function useContractStatuses({ enabled = true, activeOnly = true } = {}) {
  const query = useQuery({
    queryKey: [activeOnly ? CONTRACT_STATUSES_ACTIVE_QUERY_KEY : CONTRACT_STATUSES_QUERY_KEY],
    queryFn: () => fetchContractStatuses({ activeOnly }),
    enabled,
    staleTime: STATUSES_STALE_TIME,
  });

  const items = useMemo(() => query.data ?? [], [query.data]);
  const activeItems = useMemo(() => items.filter(isActive), [items]);

  return {
    items,
    activeItems,
    newStatusId: resolveNewContractStatusId(items),
    receivedStatusId: resolveReceivedContractStatusId(items),
    returnedStatusId: resolveReturnedContractStatusId(items),
    canceledStatusId: resolveCanceledContractStatusId(items),
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
