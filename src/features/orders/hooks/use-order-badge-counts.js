import { useQuery } from '@tanstack/react-query';
import { useAuthStore, selectIsAuthenticated } from '@/features/auth';
import { fetchOrdersTotalByStatus } from '../api/orders-api';
import { NEW_CONTRACT_STATUS_ID, RETURN_CONTRACT_STATUS_ID } from '../lib/contract-statuses';
import { RETURNED_ORDERS_TOTAL_QUERY_KEY, UNRECEIVED_ORDERS_TOTAL_QUERY_KEY } from '../lib/order-query-keys';
import { useContractStatuses } from './use-contract-statuses';

const UNRECEIVED_POLL_MS = 30_000;
const RETURNED_POLL_MS = 60_000;

/** Sidebar badge: how many orders are still "new" (not yet received by an employee). */
export function useUnreceivedOrdersCount() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  const { data } = useQuery({
    queryKey: [UNRECEIVED_ORDERS_TOTAL_QUERY_KEY],
    queryFn: () => fetchOrdersTotalByStatus(NEW_CONTRACT_STATUS_ID),
    enabled: isAuthenticated,
    refetchInterval: isAuthenticated ? UNRECEIVED_POLL_MS : false,
    refetchIntervalInBackground: true,
  });

  return data ?? 0;
}

/** Sidebar badge: how many contracts are in the returned (استرجاع) status. */
export function useReturnedOrdersCount() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const { returnedStatusId } = useContractStatuses({ enabled: isAuthenticated });
  const statusId = returnedStatusId ?? RETURN_CONTRACT_STATUS_ID;

  const { data } = useQuery({
    queryKey: [RETURNED_ORDERS_TOTAL_QUERY_KEY, statusId],
    queryFn: () => fetchOrdersTotalByStatus(statusId),
    enabled: isAuthenticated && statusId != null && statusId !== '',
    refetchInterval: isAuthenticated ? RETURNED_POLL_MS : false,
    refetchIntervalInBackground: true,
    staleTime: 30_000,
  });

  return data ?? 0;
}
