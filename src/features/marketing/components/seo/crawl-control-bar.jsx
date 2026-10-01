import { Button } from '@/shared/components/ui/button';
import { CRAWL_STATUS_LABELS } from '@/features/marketing/lib/seo-crawl';

function getStartLabel({ isStarting, isFailed }) {
  if (isStarting) return isFailed ? 'جارٍ إعادة الفحص...' : 'جارٍ البدء...';
  return isFailed ? 'إعادة الفحص' : 'بدء فحص الموقع';
}

/** Title, current status and the start / stop button of the site crawl. */
export function CrawlControlBar({ dashboard, status, inProgress, isFailed, canStart, isStarting, isStopping, onStart, onStop }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h3 className="text-base font-bold text-foreground">{dashboard?.title || 'زحف وفحص الموقع تقنيًا'}</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {dashboard?.description || 'يفحص كل صفحات الموقع ويكتشف الأخطاء التقنية التي تضرّ بترتيبك في Google.'}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {CRAWL_STATUS_LABELS[status] || status}
          {dashboard?.last_scanned_at ? ` — آخر فحص: ${dashboard.last_scanned_at}` : ''}
        </span>
        {inProgress ? (
          <Button size="sm" onClick={onStop} disabled={isStopping}>
            {isStopping ? 'جارٍ الإيقاف...' : 'إيقاف الفحص'}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onStart}
            disabled={!canStart || isStarting}
            title={!canStart ? 'ليس لديك صلاحية بدء الفحص' : undefined}
          >
            {getStartLabel({ isStarting, isFailed })}
          </Button>
        )}
      </div>
    </div>
  );
}
