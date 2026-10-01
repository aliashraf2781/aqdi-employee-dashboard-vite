import { Link, useParams, useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { PageLoader } from '@/shared/components/page-loader';
import { KpiActivity } from '@/features/employees/components/kpi-activity';
import { KpiFilters } from '@/features/employees/components/kpi-filters';
import { KpiOverview } from '@/features/employees/components/kpi-overview';
import { KpiReceivedOrders } from '@/features/employees/components/kpi-received-orders';
import { KpiError, KpiNotice } from '@/features/employees/components/kpi-states';
import { useEmployeeKpis } from '@/features/employees/hooks/use-employee-kpis';
import { CUSTOM_PERIOD, DEFAULT_KPI_PERIOD, FALLBACK_KPI_PERIODS, needsDateRange } from '@/features/employees/lib/kpi-periods';

const PERFORMANCE_TAB_URL = '/home/roles-and-employees?tab=performance';

function KpiBody({ query, awaitingRange }) {
  if (awaitingRange) return <KpiNotice>اختر تاريخ البداية والنهاية لعرض المؤشرات.</KpiNotice>;
  if (query.isLoading) return <PageLoader />;

  const status = query.error?.response?.status;
  if (status === 404) return <KpiError>الموظف غير موجود.</KpiError>;
  if (status === 403) return <KpiError>ليس لديك صلاحية عرض مؤشرات هذا الموظف.</KpiError>;
  if (query.isError) {
    return (
      <KpiError onRetry={() => query.refetch()} retryLabel="إعادة المحاولة">
        تعذّر تحميل مؤشرات الموظف.
      </KpiError>
    );
  }

  const data = query.data;
  if (!data) return null;

  return (
    <>
      <KpiOverview data={data} />
      <KpiReceivedOrders orders={data.received_orders?.items ?? []} />
      <KpiActivity activity={data.activity} />
    </>
  );
}

/** One employee's KPIs. The period and dates live in the URL so the page can be shared. */
export function EmployeeKpisPage() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const period = searchParams.get('period') || DEFAULT_KPI_PERIOD;
  const dateFrom = searchParams.get('date_from') || '';
  const dateTo = searchParams.get('date_to') || '';

  const query = useEmployeeKpis({ employeeId: id, period, dateFrom, dateTo });
  const periods = query.data?.periods?.length ? query.data.periods : FALLBACK_KPI_PERIODS;

  function updateParams(changes) {
    const next = new URLSearchParams(searchParams);
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    setSearchParams(next, { replace: true });
  }

  function handlePeriodChange(value) {
    updateParams(value === CUSTOM_PERIOD ? { period: value } : { period: value, date_from: '', date_to: '' });
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="مؤشرات الموظف"
        description="الموظفون والأدوار"
        actions={<Link to={PERFORMANCE_TAB_URL} className="text-sm text-muted-foreground hover:text-primary">رجوع إلى المؤشرات</Link>}
      />
      <KpiFilters
        periods={periods}
        period={period}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onPeriodChange={handlePeriodChange}
        onDateFromChange={(value) => updateParams({ period: CUSTOM_PERIOD, date_from: value })}
        onDateToChange={(value) => updateParams({ period: CUSTOM_PERIOD, date_to: value })}
      />
      <KpiBody query={query} awaitingRange={needsDateRange(period, dateFrom, dateTo)} />
    </div>
  );
}
