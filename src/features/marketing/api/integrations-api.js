import { apiClient } from '@/shared/lib/api-client';

/** Ad accounts, UTM builder data and Search Console connection used by the tracking screens. */
const unwrap = (response) => response.data?.data ?? null;

export const getUtmTemplate = () => apiClient.get('/admin/reports/marketing/utm-template').then(unwrap);

/** `rows`: [{ spent_on, platform, campaign_id, campaign_name, spend, currency, impressions, clicks }] */
export const importAdSpend = (rows) => apiClient.post('/admin/reports/marketing/spend', { rows }).then(unwrap);

/** `payload`: { days, platform? } */
export const syncAdSpend = (payload = {}) => apiClient.post('/admin/reports/marketing/sync', payload).then(unwrap);

export const getGoogleSeoStatus = () => apiClient.get('/admin/seo-google/status').then(unwrap);

export const connectGoogleSeo = () => apiClient.post('/admin/seo-google/connect', {}).then(unwrap);

export const getSearchConsoleSites = () => apiClient.get('/admin/seo-google/search-console/sites').then(unwrap);

export const selectSearchConsoleSite = (siteUrl) =>
  apiClient.post('/admin/seo-google/search-console/sites', { site_url: siteUrl }).then(unwrap);
