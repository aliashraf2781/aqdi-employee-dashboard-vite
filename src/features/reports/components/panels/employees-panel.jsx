import { CheckCircle2, Clock, CreditCard, FileText, Users, XCircle } from 'lucide-react';
import { useMemo } from 'react';
import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { KpiGrid } from '@/shared/components/kpi-card';
import { useEmployeesKpis } from '../../hooks/use-reports';
import { cardValue, summarizeEmployees } from '../../lib/employee-kpis';
import { formatMoneyOrDash } from '../../lib/report-format';
import { HorizontalBarChart } from '../horizontal-bar-chart';
import { ReportPanel } from '../report-panel';
import { ReportSection } from '../report-section';

const toMinutesLabel = (minutes) => (minutes != null ? `${minutes.toFixed(1)} د` : '—');

function buildKpis(summary) {
  return [
    { key: 'count', label: 'عدد الموظفين', value: summary.count, icon: Users },
    { key: 'received', label: 'استلم بالفترة', value: summary.received, icon: FileText },
    { key: 'completed', label: 'منجز بالفترة', value: summary.completed, icon: CheckCircle2 },
    { key: 'assigned', label: 'طلبات مسندة', value: summary.assigned, icon: FileText },
    {
      key: 'returned',
      label: 'مسترجع',
      value: summary.returned,
      icon: XCircle,
      tone: summary.returned > 0 ? 'warning' : 'default',
    },
    {
      key: 'late',
      label: 'متأخر > 24 س',
      value: summary.late,
      icon: Clock,
      tone: summary.late > 0 ? 'danger' : 'default',
    },
    {
      key: 'avgReceive',
      label: 'متوسط الاستلام (د عمل)',
      value: toMinutesLabel(summary.avgReceiveMinutes),
      icon: Clock,
    },
    { key: 'avgProcess', label: 'متوسط المعالجة', value: toMinutesLabel(summary.avgProcessMinutes), icon: Clock },
    { key: 'revenue', label: 'إيراد محقق', value: formatMoneyOrDash(summary.revenue), icon: CreditCard },
  ];
}

function avgReceiveLabel(item) {
  const label = item.avg_receive?.value_label ?? '—';
  const unit = item.avg_receive?.value != null ? ` ${item.avg_receive.unit ?? ''}` : '';
  return `${label}${unit}`;
}

const EMPLOYEE_COLUMNS = [
  {
    key: 'name',
    header: 'الموظف',
    cell: (item) => <span className="font-semibold">{item.employee?.name_label ?? item.employee?.name}</span>,
  },
  { key: 'shift', header: 'الوردية', cell: (item) => item.shift?.label_ar ?? '—' },
  {
    key: 'status',
    header: 'الحالة',
    cell: (item) => (
      <Badge tone={item.shift?.is_on_duty ? 'success' : 'neutral'}>
        {item.shift?.duty_status_label_ar ?? (item.shift?.is_on_duty ? 'في الخدمة' : 'خارج الخدمة')}
      </Badge>
    ),
  },
  { key: 'received', header: 'مستلم', cell: (item) => cardValue(item, 'received') },
  { key: 'assigned', header: 'مسند', cell: (item) => cardValue(item, 'assigned') },
  { key: 'returned', header: 'مسترجع', cell: (item) => cardValue(item, 'returned') },
  {
    key: 'open',
    header: 'مفتوح',
    cell: (item) => {
      const open = cardValue(item, 'open_now');
      return <span className={open > 0 ? 'font-semibold text-danger' : undefined}>{open}</span>;
    },
  },
  { key: 'late', header: 'متأخر (+24 س)', cell: (item) => cardValue(item, 'late_over_24h') },
  { key: 'completed', header: 'منجز', cell: (item) => cardValue(item, 'completed') },
  { key: 'avgReceive', header: 'متوسط الاستلام', cell: avgReceiveLabel },
  {
    key: 'sla',
    header: 'التزام الاستلام',
    cell: (item) => (item.receive_sla?.percent != null ? `${item.receive_sla.percent}%` : '—'),
  },
  { key: 'avgProcess', header: 'متوسط المعالجة', cell: (item) => item.avg_process?.value_label ?? '—' },
  { key: 'revenue', header: 'الإيراد', cell: (item) => formatMoneyOrDash(item.revenue?.value) },
];

export function EmployeesPanel({ filters }) {
  const query = useEmployeesKpis(filters);
  const items = useMemo(() => query.data?.items ?? [], [query.data]);
  const summary = useMemo(() => summarizeEmployees(items, query.data?.summary), [items, query.data]);

  const completedByEmployee = items.map((item) => ({
    label: item.employee?.name ?? '—',
    value: cardValue(item, 'completed'),
  }));

  return (
    <ReportPanel title="الموظفون" query={query} errorFallback="تعذّر تحميل بيانات أداء الموظفين من الخادم.">
      {() => (
        <>
          <KpiGrid items={buildKpis(summary)} className="lg:grid-cols-5 xl:grid-cols-5" />
          <ReportSection title="ملخص الورديات والأداء – SLA استلام 5 دقائق">
            <DataTable columns={EMPLOYEE_COLUMNS} rows={items} getRowKey={(item) => item.employee?.id} />
            <p className="text-xs text-muted-foreground">
              * يُحسب SLA الاستلام من لحظة وصول الطلب حتى أول إجراء من الموظف.
            </p>
          </ReportSection>
          <ReportSection title="العقود المكتملة حسب الموظف" className="max-w-dialog-lg">
            <HorizontalBarChart items={completedByEmployee} />
          </ReportSection>
        </>
      )}
    </ReportPanel>
  );
}
