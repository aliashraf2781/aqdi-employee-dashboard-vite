import { Banknote, CreditCard, Receipt, Tag, Undo2, Wallet } from 'lucide-react';
import { KpiGrid } from '@/shared/components/kpi-card';
import { useReport } from '../../hooks/use-reports';
import { formatMoney } from '../../lib/report-format';
import { EmptyNote } from '../empty-note';
import { HorizontalBarChart } from '../horizontal-bar-chart';
import { ReportLineList } from '../report-line-list';
import { ReportPanel } from '../report-panel';
import { ReportSection } from '../report-section';
import { VerticalBarChart } from '../vertical-bar-chart';

const KPI_FIELDS = [
  { key: 'total_sales', label: 'إجمالي المبيعات (ريال)', icon: Wallet },
  { key: 'payments_count', label: 'عدد عمليات الدفع', icon: Receipt },
  { key: 'avg_order_value', label: 'متوسط قيمة الطلب', icon: CreditCard },
  { key: 'discounts_used', label: 'الخصومات المستخدمة', icon: Tag },
  { key: 'refunds', label: 'المبالغ المسترجعة', icon: Undo2 },
  { key: 'net_revenue', label: 'صافي الإيرادات', icon: Banknote },
];

const DAILY_PAGE_SIZE = 7;

function buildSummaryLines(summary = {}) {
  return [
    { label: 'الخصومات الممنوحة', value: formatMoney(summary.discounts_granted), tone: 'gold' },
    { label: 'عدد الطلبات المخصومة', value: `${summary.discounted_orders_count ?? 0} طلب` },
    { label: 'المبالغ المسترجعة', value: formatMoney(summary.refunds_total) },
    { label: 'نسبة الاسترجاع من المبيعات', value: `${summary.refund_rate_percent ?? 0}%` },
    {
      label: 'صافي الإيرادات بعد الاسترجاع =',
      value: formatMoney(summary.net_revenue_after_refunds),
      tone: 'green',
      bold: true,
    },
  ];
}

export function SalesPanel({ filters }) {
  const query = useReport('sales', filters);

  return (
    <ReportPanel title="المبيعات والإيرادات" query={query} errorFallback="تعذّر تحميل تقرير المبيعات.">
      {(data) => {
        const kpis = KPI_FIELDS.map((field) => ({ ...field, value: data?.kpis?.[field.key] ?? 0 }));
        const periodLines = (data?.by_period ?? []).map((row) => ({ label: row.label, value: formatMoney(row.value) }));
        const daily = data?.daily ?? [];

        return (
          <>
            <KpiGrid items={kpis} />
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ReportSection title="المبيعات حسب الفترة">
                <ReportLineList items={periodLines} />
              </ReportSection>
              <ReportSection title="اتجاه المبيعات اليومي">
                {daily.length > 0 ? (
                  <VerticalBarChart items={daily} height={180} pageSize={DAILY_PAGE_SIZE} />
                ) : (
                  <EmptyNote>لا توجد بيانات لعرضها في هذه الفترة.</EmptyNote>
                )}
              </ReportSection>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <ReportSection title="الإيرادات حسب مدة العقد">
                <HorizontalBarChart items={data?.revenue_by_duration ?? []} />
              </ReportSection>
              <ReportSection title="الإيرادات حسب نوع العقد">
                <HorizontalBarChart items={data?.revenue_by_contract_type ?? []} />
              </ReportSection>
            </div>
            <ReportSection title="الخصومات والاسترجاعات وصافي الإيراد">
              <ReportLineList items={buildSummaryLines(data?.summary)} />
            </ReportSection>
          </>
        );
      }}
    </ReportPanel>
  );
}
