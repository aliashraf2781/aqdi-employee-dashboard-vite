import { useQuery } from '@tanstack/react-query';
import { fetchReportKpis, fetchUnreceivedOrdersTotal } from '@/features/dashboard/api/dashboard-api';
import { retryUnlessAuthError } from './retry-policy';

const STALE_TIME_MS = 60_000;
const UNRECEIVED_STALE_TIME_MS = 30_000;

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function useReportKpis(endpoint, period, enabled) {
  return useQuery({
    queryKey: ['dashboard', 'report', endpoint, period],
    queryFn: () => fetchReportKpis(endpoint, period),
    enabled,
    staleTime: STALE_TIME_MS,
    retry: retryUnlessAuthError,
  });
}

/**
 * Live counters for the KPI cards. The report figures need the analytics
 * permission, so they are only requested when `canAnalytics` is true; every
 * figure whose source is disabled stays `null` and renders as "—".
 */
export function useDashboardSummary({ canAnalytics, canSeeUnreceived }) {
  const ordersAll = useReportKpis('orders', 'all', canAnalytics);
  const ordersToday = useReportKpis('orders', 'today', canAnalytics);
  const salesToday = useReportKpis('sales', 'today', canAnalytics);
  const customersWeek = useReportKpis('customers', 'last_7_days', canAnalytics);

  const unreceived = useQuery({
    queryKey: ['dashboard', 'unreceived-total'],
    queryFn: fetchUnreceivedOrdersTotal,
    enabled: canSeeUnreceived,
    staleTime: UNRECEIVED_STALE_TIME_MS,
    retry: retryUnlessAuthError,
  });

  const reportQueries = [ordersAll, ordersToday, salesToday, customersWeek];
  const kpi = (query, key) => (canAnalytics ? toNumber(query.data?.[key]) : null);

  return {
    summary: {
      pendingOrders: kpi(ordersAll, 'incomplete'),
      completedToday: kpi(ordersToday, 'paid'),
      returnOrders: kpi(ordersAll, 'returned'),
      newClientsThisWeek: kpi(customersWeek, 'new'),
      revenueToday: kpi(salesToday, 'total_sales'),
      unreceivedOrders: canSeeUnreceived ? toNumber(unreceived.data) : null,
    },
    isLoading: (canAnalytics && reportQueries.some((query) => query.isLoading)) || (canSeeUnreceived && unreceived.isLoading),
  };
}
