import { Percent, Wallet } from 'lucide-react';
import { KpiGrid } from '@/shared/components/kpi-card';
import { useReport } from '../../hooks/use-reports';
import { formatMoney, formatNumber } from '../../lib/report-format';
import { HorizontalBarChart } from '../horizontal-bar-chart';
import { ReportLineList } from '../report-line-list';
import { ReportPanel } from '../report-panel';
import { ReportSection } from '../report-section';
import { FinancialSettingsCard } from './financial-settings-card';

const SETTINGS_FIELD_NAMES = ['moyasar_fee_percent', 'monthly_salaries', 'operating_budget', 'marketing_budget'];
const SETTINGS_COLUMNS = 'grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4';

const KPI_FIELDS = [
  { key: 'customer_income', label: 'دخل العملاء', icon: Wallet },
  { key: 'gross_profit', label: 'إجمالي الربح', icon: Wallet },
  { key: 'net_profit', label: 'صافي الربح', icon: Wallet, tone: 'danger' },
  { key: 'margin_percent', label: 'هامش الربح', icon: Percent, isPercent: true },
  { key: 'profit_per_order', label: 'ربح لكل طلب', icon: Wallet },
  { key: 'ad_spend', label: 'مصاريف الإعلانات', icon: Wallet, tone: 'danger' },
];

function buildKpis(kpis = {}) {
  return KPI_FIELDS.map(({ isPercent, ...field }) => {
    const value = kpis[field.key] ?? 0;
    return { ...field, value: isPercent ? `${value}%` : formatNumber(value) };
  });
}

function buildProfitAndLossLines(rows = []) {
  return rows.map((row) => ({
    label: row.label,
    value: formatMoney(row.value),
    tone: row.value < 0 ? 'red' : 'green',
    bold: row.is_total || row.is_subtotal,
    separator: row.is_subtotal,
  }));
}

function buildServiceBars(rows = []) {
  return rows.map((item) => ({
    label: `${item.label} — ${item.margin_percent ?? 0}%`,
    value: Number(item.profit ?? 0),
  }));
}

export function ProfitsPanel({ filters }) {
  const query = useReport('profits', filters);

  return (
    <ReportPanel title="الأرباح والتكاليف" query={query} errorFallback="تعذّر تحميل تقرير الأرباح.">
      {(data) => (
        <>
          <KpiGrid items={buildKpis(data?.kpis)} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ReportSection title="أكثر و أقل الخدمات ربحاً">
              <HorizontalBarChart items={buildServiceBars(data?.service_profitability)} />
            </ReportSection>
            <ReportSection title="قائمة الأرباح والخسائر – كل الفترات">
              <ReportLineList items={buildProfitAndLossLines(data?.pnl)} />
            </ReportSection>
          </div>
          <FinancialSettingsCard fieldNames={SETTINGS_FIELD_NAMES} columnsClassName={SETTINGS_COLUMNS} />
        </>
      )}
    </ReportPanel>
  );
}
