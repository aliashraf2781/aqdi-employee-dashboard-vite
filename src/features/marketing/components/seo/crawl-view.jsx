import { useMemo, useState } from 'react';
import { Card } from '@/shared/components/card';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { CrawlControlBar } from '@/features/marketing/components/seo/crawl-control-bar';
import { CrawlIssuesCard } from '@/features/marketing/components/seo/crawl-issues-card';
import { CrawlProgress } from '@/features/marketing/components/seo/crawl-progress';
import { CrawlCategories, CrawlSummaryCards } from '@/features/marketing/components/seo/crawl-summary';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { QueryState } from '@/shared/components/query-state';
import { useCrawlActions } from '@/features/marketing/hooks/use-crawl-actions';
import { useSeoCrawlDashboard, useSeoCrawlRealtime } from '@/features/marketing/hooks/use-seo-crawl';
import { isCrawlInProgress, NEVER_RUN_STATUS } from '@/features/marketing/lib/seo-crawl';

function FailedRunNotice({ message }) {
  return (
    <SectionCard title="ملخص الفحص" className="mt-4">
      <div className="rounded-lg border border-danger bg-danger-soft p-4">
        <p className="text-sm font-bold text-danger">فشل فحص الموقع. اضغط «إعادة الفحص».</p>
        {message && (
          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-bold text-danger">تفاصيل تقنية</summary>
            <pre dir="ltr" className="mt-2 whitespace-pre-wrap break-all text-xs text-muted-foreground">
              {message}
            </pre>
          </details>
        )}
      </div>
    </SectionCard>
  );
}

function getIssuesEmptyText({ isFailed }) {
  return isFailed
    ? 'لا توجد نتائج بسبب فشل الفحص السابق. اضغط «إعادة الفحص» لبدء فحص جديد.'
    : 'لم يتم إجراء أي فحص للموقع بعد. اضغط «بدء فحص الموقع» لعرض النتائج هنا.';
}

/** Site crawl screen: control bar, live progress, summary, categories and the issues list. */
export function CrawlView() {
  const { can } = usePermissions();
  const canView = can(PERMISSION_SECTIONS.seo_crawl, 'view');
  const canStart = can(PERMISSION_SECTIONS.seo_crawl, 'create');
  const [issueType, setIssueType] = useState(null);

  const { data: dashboard, isLoading, error, refetch } = useSeoCrawlDashboard({ enabled: canView });
  const { liveStatus } = useSeoCrawlRealtime(dashboard?.realtime?.path, { enabled: Boolean(dashboard?.realtime?.enabled) && canView });
  const actions = useCrawlActions({ runId: dashboard?.id, refresh: refetch });

  // The REST dashboard is the source of truth for the status.
  const status = dashboard?.status ?? NEVER_RUN_STATUS;
  const inProgress = isCrawlInProgress(status);
  const isFailed = status === 'failed' && !inProgress;
  const neverRun = !dashboard || dashboard.id == null;

  const categoryLabels = useMemo(
    () => Object.fromEntries((dashboard?.categories || []).map((category) => [category.type, category.label_ar || category.label])),
    [dashboard?.categories],
  );

  if (!canView) {
    return (
      <SectionCard title="زحف وفحص الموقع تقنيًا">
        <p className="text-sm text-muted-foreground">ليس لديك صلاحية للوصول إلى هذا القسم.</p>
      </SectionCard>
    );
  }

  return (
    <>
      <Card>
        <CrawlControlBar
          dashboard={dashboard}
          status={status}
          inProgress={inProgress}
          isFailed={isFailed}
          canStart={canStart}
          isStarting={actions.isStarting}
          isStopping={actions.isStopping}
          onStart={actions.start}
          onStop={actions.stop}
        />
        {inProgress && <CrawlProgress dashboard={dashboard} status={status} liveStatus={liveStatus} />}
      </Card>

      {isFailed ? (
        <FailedRunNotice message={dashboard?.error_message || liveStatus?.error_message} />
      ) : (
        <QueryState isLoading={isLoading && !dashboard} error={error} onRetry={refetch} errorFallback="تعذر تحميل بيانات فحص الموقع.">
          <CrawlSummaryCards summary={dashboard?.summary} />
          <CrawlCategories categories={dashboard?.categories} activeType={issueType} onSelect={setIssueType} />
        </QueryState>
      )}

      <CrawlIssuesCard
        enabled={!neverRun && !isFailed}
        emptyText={getIssuesEmptyText({ isFailed })}
        categoryLabels={categoryLabels}
        type={issueType}
        onClearType={() => setIssueType(null)}
      />
    </>
  );
}
