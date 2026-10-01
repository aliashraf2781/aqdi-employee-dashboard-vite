import { QueryState } from '@/shared/components/query-state';
import { StatCardRow } from '@/shared/components/stat-card';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { GoogleConnectionCard } from '@/features/marketing/components/seo/google-connection-card';
import { KeywordsTable } from '@/features/marketing/components/seo/keywords-table';
import { PeriodFilterBar } from '@/features/marketing/components/shared/period-filter-bar';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { useMarketingKeywords } from '@/features/marketing/hooks/use-marketing-tracking';
import { DASH, DEFAULT_CURRENCY_LABEL, formatInt, formatMoney } from '@/features/marketing/lib/format';

function buildSummaryCards(summary, currency) {
  return [
    { value: formatMoney(summary.organic_revenue, currency), label: 'إيراد عضوي', tone: 'success' },
    { value: formatInt(summary.organic_clicks), label: 'نقرات عضوية' },
    { value: formatInt(summary.decreased), label: 'انخفضت', tone: 'danger' },
    { value: formatInt(summary.increased), label: 'ارتفعت', tone: 'success' },
    { value: summary.average_rank == null ? DASH : summary.average_rank, label: 'متوسط الترتيب', tone: 'primary' },
    { value: formatInt(summary.target_keywords), label: 'كلمات مستهدفة', tone: 'primary' },
  ];
}

export function KeywordsView() {
  const { can } = usePermissions();
  const canView = can(PERMISSION_SECTIONS.analytics, 'view');
  const { data, isLoading, error, refetch } = useMarketingKeywords({ enabled: canView });

  if (!canView) {
    return (
      <SectionCard title="الكلمات المفتاحية">
        <p className="text-sm text-muted-foreground">ليس لديك صلاحية للوصول إلى هذا القسم.</p>
      </SectionCard>
    );
  }

  const currency = data?.currency_label_ar || DEFAULT_CURRENCY_LABEL;
  const items = Array.isArray(data?.items) ? data.items : [];
  const ranksMissing = items.length > 0 && items.every((row) => row.current_rank == null);

  return (
    <>
      <PeriodFilterBar periods={data?.periods} />
      <GoogleConnectionCard canConnect={can(PERMISSION_SECTIONS.seo_crawl, 'create')} />

      <QueryState isLoading={isLoading} error={error} isEmpty={!data} onRetry={refetch} errorFallback="تعذّر تحميل بيانات التسويق.">
        <StatCardRow items={buildSummaryCards(data?.summary || {}, currency)} />

        {ranksMissing && (
          <p className="mt-2 text-xs text-muted-foreground">ربط Search Console من صفحة السيو لعرض ترتيب الكلمات — الإيرادات معروضة رغم غياب الترتيب.</p>
        )}

        <SectionCard title="الكلمات المفتاحية — الترتيب والمنافسة والحالة" className="mt-3">
          <KeywordsTable items={items} currency={currency} />
        </SectionCard>
      </QueryState>
    </>
  );
}
