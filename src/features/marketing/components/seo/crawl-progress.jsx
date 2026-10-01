import { decodeUriText } from '@/features/marketing/lib/format';
import { getCrawlPercent } from '@/features/marketing/lib/seo-crawl';

/** Progress bar of a queued / running crawl. The REST dashboard is polled for the numbers. */
export function CrawlProgress({ dashboard, status, liveStatus }) {
  const percent = getCrawlPercent(dashboard);
  const crawled = dashboard?.pages_crawled ?? 0;
  // `liveStatus` is always null until the Firebase live feed is ported (see useSeoCrawlRealtime).
  const currentUrl = liveStatus?.current_url ? ` — ${decodeUriText(liveStatus.current_url)}` : '';

  return (
    <div className="mt-4">
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        {status === 'queued' ? 'في الانتظار...' : `جاري الزحف… ${crawled}${currentUrl}`}
      </p>
    </div>
  );
}
