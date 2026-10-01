import { useQuery } from '@tanstack/react-query';
import { fetchEmployeesKpis, fetchReport } from '../api/reports-api';
import { hasValidDateRange } from '../lib/report-filters';

export const REPORTS_QUERY_KEY = 'reports';
const NO_RETRY_STATUSES = [401, 403];
const MAX_RETRIES = 2;

function retryUnlessForbidden(failureCount, error) {
  if (NO_RETRY_STATUSES.includes(error?.response?.status)) return false;
  return failureCount < MAX_RETRIES;
}

/** One hook for every analysis endpoint: useReport('sales', filters). */
export function useReport(endpoint, filters) {
  return useQuery({
    queryKey: [REPORTS_QUERY_KEY, endpoint, filters],
    queryFn: () => fetchReport(endpoint, filters),
    enabled: hasValidDateRange(filters),
    retry: retryUnlessForbidden,
  });
}

export function useEmployeesKpis(filters) {
  return useQuery({
    queryKey: ['employees-kpis', filters.period, filters.dateFrom, filters.dateTo],
    queryFn: () => fetchEmployeesKpis(filters),
    enabled: hasValidDateRange(filters),
  });
}
