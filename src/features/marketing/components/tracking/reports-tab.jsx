import { useState } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { QueryState } from '@/shared/components/query-state';
import { StatCardRow } from '@/shared/components/stat-card';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { ReportExportBar } from '@/features/marketing/components/tracking/report-export-bar';
import { ReportHighlights } from '@/features/marketing/components/tracking/report-highlights';
import { ChannelRoiTable } from '@/features/marketing/components/shared/channel-roi-table';
import { PeriodFilterBar } from '@/features/marketing/components/shared/period-filter-bar';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { useExportMarketingReport, useMarketingReport, useMarketingReportChannels } from '@/features/marketing/hooks/use-marketing-reports';
import { DASH, DEFAULT_CURRENCY_LABEL, formatInt, formatMoney } from '@/features/marketing/lib/format';

const ALL_CHANNELS = 'all';
const MONEY_STAT_TONES = { total_revenue: 'success', revenue_per_riyal: 'success', marketing_cost: 'warning' };

function formatStatValue(item, currency) {
  if (item.value == null) return DASH;
  if (item.is_money) return formatMoney(item.value, currency);
  return `${formatInt(item.value)}${item.suffix || ''}`;
}

function toStatCard(stat, currency) {
  const change = stat.change_percent;
  return {
    value: formatStatValue(stat, currency),
    label: stat.label_ar,
    tone: MONEY_STAT_TONES[stat.key] ?? 'primary',
    trend: change == null ? undefined : { direction: change >= 0 ? 'up' : 'down', value: `${Math.abs(change)}%` },
  };
}

export function ReportsTab() {
  const { can } = usePermissions();
  const [channel, setChannel] = useState(ALL_CHANNELS);
  const report = useMarketingReport(channel);
  const channelsReport = useMarketingReportChannels(channel);
  const exportReport = useExportMarketingReport();

  const data = report.data;
  const currency = data?.currency_label_ar || DEFAULT_CURRENCY_LABEL;
  const rows = channelsReport.data?.rows ?? [];

  const handleExport = (format) => {
    exportReport.mutate(
      { format, channel },
      {
        onSuccess: (result) => toast.success(result.emailed ? result.message || 'أُرسل التقرير إلى بريدك' : 'تم تنزيل التقرير'),
        onError: (error) => toast.error(getErrorMessage(error, 'تعذّر تصدير التقرير')),
      },
    );
  };

  return (
    <div>
      <PeriodFilterBar periods={data?.periods} />
      <ReportExportBar
        channel={channel}
        onChannelChange={setChannel}
        onExport={handleExport}
        disabled={!can(PERMISSION_SECTIONS.analytics, 'view') || exportReport.isPending}
      />

      <QueryState isLoading={report.isLoading} error={report.error} isEmpty={!data} onRetry={report.refetch} errorFallback="تعذّر تحميل بيانات التسويق.">
        <ReportHighlights highlights={data?.highlights} comparison={data?.comparison} currency={currency} />

        {data?.stats?.length > 0 && <StatCardRow items={data.stats.map((stat) => toStatCard(stat, currency))} className="mt-4" />}

        <SectionCard title="تقرير القنوات المدفوعة" className="mt-4">
          <QueryState isLoading={channelsReport.isLoading} error={channelsReport.error} isEmpty={!rows.length} onRetry={channelsReport.refetch}>
            {channelsReport.data?.range_label_ar && <p className="mb-3 text-xs text-muted-foreground">{channelsReport.data.range_label_ar}</p>}
            <ChannelRoiTable rows={rows} total={channelsReport.data?.total} currency={currency} showLeads />
          </QueryState>
        </SectionCard>
      </QueryState>
    </div>
  );
}
