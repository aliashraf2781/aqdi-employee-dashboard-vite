import { Link } from 'react-router-dom';
import { QueryState } from '@/shared/components/query-state';
import { FunnelBars } from '@/features/marketing/components/tracking/funnel-bars';
import { OverviewKpis } from '@/features/marketing/components/tracking/overview-kpis';
import { RoasHero } from '@/features/marketing/components/tracking/roas-hero';
import { SpendRevenueChart } from '@/features/marketing/components/tracking/spend-revenue-chart';
import { OverviewTopLists } from '@/features/marketing/components/tracking/top-lists';
import { ChannelRoiTable } from '@/features/marketing/components/shared/channel-roi-table';
import { HighlightCard } from '@/features/marketing/components/shared/highlight-card';
import { PeriodFilterBar } from '@/features/marketing/components/shared/period-filter-bar';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { useMarketingChannels, useMarketingOverview } from '@/features/marketing/hooks/use-marketing-tracking';
import { DEFAULT_CURRENCY_LABEL } from '@/features/marketing/lib/format';

const NO_CHART_DATA = 'لا توجد بيانات صرف/إيراد لهذه الفترة.';
const CAMPAIGNS_TAB_LINK = '?tab=campaigns';

const toChartItems = (rows) =>
  rows.map((row) => ({ label: row.label_ar || row.source, spend: Number(row.spend) || 0, revenue: Number(row.revenue) || 0 }));

const hasAnyAmount = (rows) => Array.isArray(rows) && rows.some((row) => Number(row.spend) || Number(row.revenue));

function CampaignDetailsLink() {
  return (
    <Link to={CAMPAIGNS_TAB_LINK} className="mt-2 inline-block text-xs font-bold text-primary hover:underline">
      التفاصيل ←
    </Link>
  );
}

export function OverviewTab() {
  const overview = useMarketingOverview();
  const channels = useMarketingChannels();
  const data = overview.data;
  const currency = data?.currency_label_ar || DEFAULT_CURRENCY_LABEL;
  const funnel = channels.data?.funnel;
  const channelRows = channels.data?.channels;

  return (
    <div>
      <PeriodFilterBar periods={data?.periods} />

      <QueryState isLoading={overview.isLoading} error={overview.error} isEmpty={!data} onRetry={overview.refetch} errorFallback="تعذّر تحميل بيانات التسويق.">
        <RoasHero summary={data?.summary || {}} currency={currency} />
        <OverviewKpis kpis={data?.kpis || {}} currency={currency} />

        <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <SectionCard title="الصرف مقابل الإيراد — حسب القناة">
            {hasAnyAmount(data?.chart) ? <SpendRevenueChart items={toChartItems(data.chart)} /> : <p className="text-sm text-muted-foreground">{NO_CHART_DATA}</p>}
          </SectionCard>

          <SectionCard title="القمع التسويقي الكامل">
            <QueryState isLoading={channels.isLoading} error={channels.error} isEmpty={!funnel?.length} onRetry={channels.refetch}>
              <FunnelBars steps={funnel} />
            </QueryState>
          </SectionCard>
        </div>

        <SectionCard title="أداء القنوات المدفوعة (ROI)" className="mb-4">
          <QueryState isLoading={channels.isLoading} error={channels.error} isEmpty={!channelRows?.length} onRetry={channels.refetch}>
            <ChannelRoiTable rows={channelRows} currency={currency} />
          </QueryState>
        </SectionCard>

        <OverviewTopLists data={data} />

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <HighlightCard data={data?.best_campaign} kind="good" title="أفضل حملة (ROAS)" currency={currency}>
            <CampaignDetailsLink />
          </HighlightCard>
          <HighlightCard data={data?.weakest_campaign} kind="bad" title="أضعف حملة (ROAS)" currency={currency}>
            <CampaignDetailsLink />
          </HighlightCard>
        </div>
      </QueryState>
    </div>
  );
}
