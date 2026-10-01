import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchPayments } from '@/features/settings/api/payments-api';

export function usePayments({ page, period }) {
  return useQuery({
    queryKey: ['payments', page, period],
    queryFn: () => fetchPayments({ page, period }),
    placeholderData: keepPreviousData,
  });
}
