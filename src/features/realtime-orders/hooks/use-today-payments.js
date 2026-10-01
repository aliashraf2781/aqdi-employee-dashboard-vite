import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchTodayPayments } from '../api/payments-api';

const PAYMENTS_QUERY_KEY = 'payment-notifications';

export function useTodayPayments(page) {
  const query = useQuery({
    queryKey: [PAYMENTS_QUERY_KEY, page],
    queryFn: () => fetchTodayPayments(page),
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items ?? [];

  return {
    payments: items,
    pagination: query.data?.pagination ?? null,
    total: query.data?.pagination?.total ?? items.length,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
