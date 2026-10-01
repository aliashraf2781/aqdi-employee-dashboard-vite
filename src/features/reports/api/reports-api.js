import { apiClient } from '@/shared/lib/api-client';
import { buildPeriodParams, buildReportParams, extractListItems } from '../lib/report-filters';

const REPORTS_URL = '/admin/reports';
const FILTER_EMPLOYEES_PER_PAGE = 200;

/** GET /admin/reports/<endpoint> where endpoint is orders | sales | profits | customers | performance. */
export async function fetchReport(endpoint, filters) {
  const { data } = await apiClient.get(`${REPORTS_URL}/${endpoint}`, { params: buildReportParams(filters) });
  return data?.data;
}

export async function fetchProfitSettings() {
  const { data } = await apiClient.get(`${REPORTS_URL}/profit-settings`);
  return data?.data;
}

export function updateProfitSettings(payload) {
  return apiClient.put(`${REPORTS_URL}/profit-settings`, payload);
}

/** Employees shown in the filter bar. */
export async function fetchFilterEmployees() {
  const { data } = await apiClient.get('/admin/employees', { params: { per_page: FILTER_EMPLOYEES_PER_PAGE } });
  return extractListItems(data);
}

/** GET /admin/employees/kpis: KPI cards for every employee in the period. */
export async function fetchEmployeesKpis(filters) {
  const { data } = await apiClient.get('/admin/employees/kpis', { params: buildPeriodParams(filters) });
  return data?.data;
}
