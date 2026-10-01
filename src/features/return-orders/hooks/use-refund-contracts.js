import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { fetchAllRefundContracts, fetchRefundContractsSummary } from '../api/refunds-api';
import { buildRefundsLookup } from '../lib/refund-lookup';
import { REFUNDS_LOOKUP_QUERY_KEY, REFUNDS_SUMMARY_QUERY_KEY } from './query-keys';

const STALE_TIME_MS = 60_000;

/** All refund contracts (with an identifier lookup) and the global approval summary. */
export function useRefundContracts() {
  const contractsQuery = useQuery({
    queryKey: [REFUNDS_LOOKUP_QUERY_KEY],
    queryFn: fetchAllRefundContracts,
    staleTime: STALE_TIME_MS,
  });
  const summaryQuery = useQuery({
    queryKey: [REFUNDS_SUMMARY_QUERY_KEY],
    queryFn: fetchRefundContractsSummary,
    staleTime: STALE_TIME_MS,
  });

  const refundContracts = useMemo(() => contractsQuery.data ?? [], [contractsQuery.data]);
  const refundsLookup = useMemo(() => buildRefundsLookup(refundContracts), [refundContracts]);

  return { refundContracts, refundsLookup, refundsSummary: summaryQuery.data ?? null };
}
