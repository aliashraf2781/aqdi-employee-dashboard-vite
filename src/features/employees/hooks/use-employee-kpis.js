import { useQuery } from '@tanstack/react-query';
import { fetchEmployeeKpis, fetchKpiBoard } from '@/features/employees/api/kpis-api';
import { kpiKeys } from '@/features/employees/hooks/query-keys';
import { CUSTOM_PERIOD, hasValidDateRange } from '@/features/employees/lib/kpi-periods';

const NO_RETRY_STATUSES = [401, 403, 404, 422];
const MAX_RETRIES = 2;

function retryUnlessClientError(failureCount, error) {
  if (NO_RETRY_STATUSES.includes(error?.response?.status)) return false;
  return failureCount < MAX_RETRIES;
}

/** A custom period must have a valid date range before we hit the API. */
function isRangeReady(period, dateFrom, dateTo) {
  return period !== CUSTOM_PERIOD || hasValidDateRange(dateFrom, dateTo);
}

/** KPI cards for every employee (the "مؤشرات الموظفين" tab). */
export function useKpiBoard({ period, dateFrom, dateTo }) {
  return useQuery({
    queryKey: kpiKeys.board(period, dateFrom, dateTo),
    queryFn: () => fetchKpiBoard({ period, dateFrom, dateTo }),
    enabled: isRangeReady(period, dateFrom, dateTo),
    retry: retryUnlessClientError,
  });
}

/** Full KPI details (cards, received orders, activity) for one employee. */
export function useEmployeeKpis({ employeeId, period, dateFrom, dateTo }) {
  return useQuery({
    queryKey: kpiKeys.employee(employeeId, period, dateFrom, dateTo),
    queryFn: () => fetchEmployeeKpis({ employeeId, period, dateFrom, dateTo }),
    enabled: Boolean(employeeId) && isRangeReady(period, dateFrom, dateTo),
    retry: retryUnlessClientError,
  });
}
