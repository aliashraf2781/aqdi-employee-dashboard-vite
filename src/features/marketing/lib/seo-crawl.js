const IN_PROGRESS_STATUSES = ['queued', 'running'];
const TERMINAL_STATUSES = ['completed', 'stopped', 'failed'];

export const CRAWL_POLL_INTERVAL_MS = 3000;
export const CRAWL_ISSUES_PER_PAGE = 20;
export const NEVER_RUN_STATUS = 'never_run';

export const CRAWL_STATUS_LABELS = {
  never_run: 'لم يتم الفحص بعد',
  queued: 'في الانتظار...',
  running: 'جارٍ الفحص...',
  completed: 'مكتمل',
  stopped: 'متوقف',
  failed: 'فشل',
};

export const SEVERITY_LABELS = { high: 'عالية', medium: 'متوسطة', low: 'منخفضة' };

export function isCrawlInProgress(status) {
  return IN_PROGRESS_STATUSES.includes(status);
}

export function isCrawlFinished(status) {
  return TERMINAL_STATUSES.includes(status);
}

/** Progress bar value (0-100) from the polled dashboard run. */
export function getCrawlPercent(dashboard) {
  const crawled = Number(dashboard?.pages_crawled) || 0;
  const total = Number(dashboard?.pages_total ?? dashboard?.progress_max) || 0;
  if (!total) return 0;
  return Math.min(100, Math.max(0, Math.round((crawled / total) * 100)));
}
