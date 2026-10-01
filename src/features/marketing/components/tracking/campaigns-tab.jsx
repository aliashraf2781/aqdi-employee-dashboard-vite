import { QueryState } from '@/shared/components/query-state';
import { StatCardRow } from '@/shared/components/stat-card';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { AdAccountsBar } from '@/features/marketing/components/tracking/ad-accounts-bar';
import { TopCampaignsTable } from '@/features/marketing/components/tracking/top-campaigns-table';
import { ChannelRoiTable } from '@/features/marketing/components/shared/channel-roi-table';
import { HighlightCard } from '@/features/marketing/components/shared/highlight-card';
import { PeriodFilterBar } from '@/features/marketing/components/shared/period-filter-bar';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { useAdSpendSync } from '@/features/marketing/hooks/use-ad-spend-sync';
import { useUtmTemplate } from '@/features/marketing/hooks/use-marketing-integrations';
import { useMarketingChannels, useMarketingOverview } from '@/features/marketing/hooks/use-marketing-tracking';
import { DEFAULT_CURRENCY_LABEL, formatMoney, formatRoas, formatSignedMoney } from '@/features/marketing/lib/format';

function buildStats(summary, currency) {
  return [
    { value: formatMoney(summary.spend, currency), label: 'الصرف', tone: 'warning' },
    { value: formatMoney(summary.revenue, currency), label: 'الإيراد', tone: 'success' },
    { value: formatRoas(summary.roas), label: 'ROAS عام', tone: 'primary' },
    { value: formatSignedMoney(summary.profit, currency), label: 'ربح صافٍ', tone: 'success' },
  ];
}

export function CampaignsTab() {
  const { can } = usePermissions();
  const canSync = can(PERMISSION_SECTIONS.analytics, 'create');
  const overview = useMarketingOverview();
  const channels = useMarketingChannels();
  const utm = useUtmTemplate();
  const { sync, isSyncing } = useAdSpendSync();

  const data = overview.data;
  const currency = data?.currency_label_ar || DEFAULT_CURRENCY_LABEL;
  const channelRows = Array.isArray(channels.data?.channels) ? channels.data.channels : [];
  const topCampaigns = Array.isArray(data?.top_campaigns) ? data.top_campaigns : [];

  return (
    <div>
      <PeriodFilterBar periods={data?.periods} />
      <AdAccountsBar accounts={utm.accounts} canSync={canSync} isSyncing={isSyncing} onSync={sync} />
      <p className="mb-4 text-xs text-muted-foreground">
        الأرقام تُسحب من مصادر التسويق (UTM + بكسلات + صرف الإعلانات) — لإدارة الربط افتح تبويب «الربط والبكسلات».
      </p>

      <QueryState isLoading={overview.isLoading} error={overview.error} isEmpty={!data} onRetry={overview.refetch} errorFallback="تعذّر تحميل بيانات التسويق.">
        <StatCardRow items={buildStats(data?.summary || {}, currency)} />

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <HighlightCard data={data?.best_campaign} kind="good" title="أفضل حملة (ROAS)" currency={currency} />
          <HighlightCard data={data?.weakest_campaign} kind="bad" title="أضعف حملة (ROAS)" currency={currency} />
        </div>

        <SectionCard title="أداء القنوات المدفوعة — الصرف والإيراد وROAS" className="mt-4">
          <QueryState isLoading={channels.isLoading} error={channels.error} isEmpty={channelRows.length === 0} onRetry={channels.refetch}>
            <ChannelRoiTable rows={channelRows} currency={currency} />
          </QueryState>
        </SectionCard>

        <SectionCard title="أكثر الحملات تحقيقًا للطلبات" className="mt-4">
          <TopCampaignsTable rows={topCampaigns} />
        </SectionCard>
      </QueryState>
    </div>
  );
}
