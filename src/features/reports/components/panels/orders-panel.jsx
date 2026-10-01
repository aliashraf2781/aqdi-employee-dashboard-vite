import { Ban, CreditCard, FileEdit, FilePlus, FileText, Clock, Undo2, XCircle } from 'lucide-react';
import { KpiGrid } from '@/shared/components/kpi-card';
import { useReport } from '../../hooks/use-reports';
import { formatHoursAndMinutes, toChartItems } from '../../lib/report-format';
import { HorizontalBarChart } from '../horizontal-bar-chart';
import { ReportPanel } from '../report-panel';
import { ReportSection } from '../report-section';

const KPI_FIELDS = [
  { key: 'total', label: 'إجمالي الطلبات', icon: FileText },
  { key: 'new', label: 'طلبات جديدة', icon: FilePlus, tone: 'danger' },
  { key: 'paid', label: 'مدفوعة', icon: CreditCard },
  { key: 'draft', label: 'مسودة عقد', icon: FileEdit, tone: 'warning' },
  { key: 'incomplete', label: 'غير مكتمل', icon: XCircle, tone: 'warning' },
  { key: 'canceled', label: 'ملغية', icon: Ban, tone: 'danger' },
  { key: 'returned', label: 'مسترجعة', icon: Undo2, tone: 'muted' },
];

function buildKpis(kpis = {}) {
  const items = KPI_FIELDS.map((field) => ({ ...field, value: kpis[field.key] ?? 0 }));
  items.push({
    key: 'avgTime',
    label: 'متوسط مدة الإنجاز',
    value: formatHoursAndMinutes(kpis.avg_completion_minutes),
    icon: Clock,
  });
  return items;
}

export function OrdersPanel({ filters }) {
  const query = useReport('orders', filters);

  return (
    <ReportPanel title="الطلبات" query={query} errorFallback="تعذّر تحميل تقرير الطلبات.">
      {(data) => (
        <>
          <KpiGrid items={buildKpis(data?.kpis)} className="xl:grid-cols-4" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ReportSection title="الطلبات حسب الموظف">
              <HorizontalBarChart items={toChartItems(data?.by_employee)} />
            </ReportSection>
            <ReportSection title="الطلبات حسب نوع العقد">
              <HorizontalBarChart items={toChartItems(data?.by_contract_type)} />
            </ReportSection>
          </div>
          <ReportSection title="الطلبات حسب المرحلة">
            <HorizontalBarChart items={toChartItems(data?.by_stage)} />
          </ReportSection>
        </>
      )}
    </ReportPanel>
  );
}
