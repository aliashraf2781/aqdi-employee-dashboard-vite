import { apiClient } from '@/shared/lib/api-client';

const UNRECEIVED_STATUS_ID = 1;

export async function fetchReportKpis(endpoint, period) {
  const { data } = await apiClient.get(`/admin/reports/${endpoint}`, { params: { period } });
  return data?.data?.kpis ?? {};
}

/** Orders waiting to be received by an employee (status 1). */
export async function fetchUnreceivedOrders({ perPage, page = 1 }) {
  const { data } = await apiClient.get('/admin/orders', {
    params: { status_id: UNRECEIVED_STATUS_ID, per_page: perPage, page },
  });
  return data?.data ?? {};
}

export async function fetchUnreceivedOrdersTotal() {
  const result = await fetchUnreceivedOrders({ perPage: 1 });
  return result?.pagination?.total ?? 0;
}
