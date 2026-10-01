import { FileText, UserCheck, UserPlus, Users, XCircle } from 'lucide-react';
import { DataTable } from '@/shared/components/data-table';
import { KpiGrid } from '@/shared/components/kpi-card';
import { useReport } from '../../hooks/use-reports';
import { formatMoney } from '../../lib/report-format';
import { HorizontalBarChart } from '../horizontal-bar-chart';
import { ReportPanel } from '../report-panel';
import { ReportSection } from '../report-section';

const TOP_CUSTOMER_COLUMNS = [
  { key: 'name', header: 'العميل', cell: (row) => <span className="font-semibold">{row.name}</span> },
  { key: 'mobile', header: 'الجوال', cell: (row) => <span dir="ltr">{row.mobile}</span> },
  { key: 'contracts', header: 'العقود', cell: (row) => row.contracts_count },
  { key: 'paid', header: 'المدفوعة', cell: (row) => row.paid_count },
  { key: 'spending', header: 'إجمالي الإنفاق', cell: (row) => formatMoney(row.total_spending) },
];

function buildKpis(kpis = {}) {
  return [
    { key: 'total', label: 'إجمالي العملاء', value: kpis.total ?? 0, icon: Users },
    { key: 'new', label: 'عملاء جدد', value: kpis.new ?? 0, icon: UserPlus },
    { key: 'returning', label: 'عملاء عائدون', value: kpis.returning ?? 0, icon: UserCheck },
    { key: 'avg', label: 'متوسط العقود لكل عميل', value: kpis.avg_contracts_per_customer ?? 0, icon: FileText },
    { key: 'incomplete', label: 'لم يكملوا الطلب', value: kpis.incomplete ?? 0, icon: XCircle },
  ];
}

export function CustomersPanel({ filters }) {
  const query = useReport('customers', filters);

  return (
    <ReportPanel title="العملاء" query={query} errorFallback="تعذّر تحميل تقرير العملاء.">
      {(data) => (
        <>
          <KpiGrid items={buildKpis(data?.kpis)} className="lg:grid-cols-5 xl:grid-cols-5" />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <ReportSection title="أفضل العملاء من حيث القيمة">
              <DataTable
                columns={TOP_CUSTOMER_COLUMNS}
                rows={data?.top_customers ?? []}
                getRowKey={(row) => row.customer_id ?? row.mobile}
              />
            </ReportSection>
            <ReportSection title="العملاء الجدد مقابل العائدين">
              <HorizontalBarChart items={data?.segments ?? []} />
            </ReportSection>
          </div>
        </>
      )}
    </ReportPanel>
  );
}
