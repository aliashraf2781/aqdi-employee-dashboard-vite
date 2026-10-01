import { apiClient } from '@/shared/lib/api-client';

const SEO_CRAWL_PATH = '/admin/seo-crawl';

export async function getCrawlDashboard(runId) {
  const { data } = await apiClient.get(SEO_CRAWL_PATH, { params: runId ? { run_id: runId } : undefined });
  return data?.data ?? null;
}

export async function listCrawlIssues({ runId, type, severity, search, page, perPage }) {
  const params = { page, per_page: perPage };
  if (runId) params.run_id = runId;
  if (type) params.type = type;
  if (severity) params.severity = severity;
  if (search) params.search = search;

  const { data } = await apiClient.get(`${SEO_CRAWL_PATH}/issues`, { params });
  return data?.data ?? { items: [], pagination: null };
}

export async function getCrawlIssueDetails(issueId) {
  const { data } = await apiClient.get(`${SEO_CRAWL_PATH}/issues/${issueId}`);
  return data?.data ?? null;
}

/** Resolves to the full response body: the message and the new run (`data.id`, `data.status`). */
export const startCrawl = (payload) => apiClient.post(`${SEO_CRAWL_PATH}/run`, payload || {}).then((response) => response.data);

export const stopCrawl = (runId) => apiClient.post(`${SEO_CRAWL_PATH}/stop`, runId ? { run_id: runId } : {}).then((response) => response.data);
