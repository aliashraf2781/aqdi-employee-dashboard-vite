import { apiClient } from '@/shared/lib/api-client';
import { buildKpiParams } from '@/features/employees/lib/kpi-periods';

export async function fetchKpiBoard({ period, dateFrom, dateTo }) {
  const { data } = await apiClient.get('/admin/employees/kpis', { params: buildKpiParams(period, dateFrom, dateTo) });
  return data?.data;
}

export async function fetchEmployeeKpis({ employeeId, period, dateFrom, dateTo }) {
  const { data } = await apiClient.get(`/admin/employees/${employeeId}/kpis`, {
    params: buildKpiParams(period, dateFrom, dateTo),
  });
  return data?.data;
}
