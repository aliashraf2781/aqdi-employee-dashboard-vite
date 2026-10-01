import { useMemo, useState } from 'react';
import { PageLoader } from '@/shared/components/page-loader';
import { EmployeePerfCard } from '@/features/employees/components/employee-perf-card';
import { KpiFilters } from '@/features/employees/components/kpi-filters';
import { KpiError, KpiNotice } from '@/features/employees/components/kpi-states';
import { useKpiBoard } from '@/features/employees/hooks/use-employee-kpis';
import {
  CUSTOM_PERIOD,
  DEFAULT_KPI_PERIOD,
  FALLBACK_KPI_PERIODS,
  buildKpiParams,
  needsDateRange,
} from '@/features/employees/lib/kpi-periods';
import { findKpiCard } from '@/features/employees/lib/employee-perf-metrics';

function buildDetailsHref(employeeId, period, dateFrom, dateTo) {
  const params = new URLSearchParams(buildKpiParams(period, dateFrom, dateTo));
  return `/home/roles-and-employees/employees/${employeeId}/kpis?${params.toString()}`;
}

/** Cards are scored against the best "completed" count on the board. */
function withMaxCompleted(items) {
  const maxCompleted = Math.max(1, ...items.map((item) => findKpiCard(item, 'completed')?.value ?? 0));
  return items.map((item) => ({ ...item, _maxCompleted: maxCompleted }));
}

function BoardSummary({ summary }) {
  return (
    <p className="mt-1 text-xs text-muted-foreground">
      {summary.employees_count} موظف · استلم {summary.received_total} · منجز {summary.completed_total} · متأخر {summary.late_over_24h_total}
    </p>
  );
}

function BoardBody({ query, items, period, periodLabel, dateFrom, dateTo, awaitingRange }) {
  if (awaitingRange) return <KpiNotice>اختر تاريخ البداية والنهاية لعرض المؤشرات.</KpiNotice>;
  if (query.isLoading) return <PageLoader />;

  if (query.isError) {
    const isForbidden = query.error?.response?.status === 403;
    return (
      <KpiError onRetry={isForbidden ? undefined : () => query.refetch()} retryLabel="إعادة المحاولة">
        {isForbidden ? 'ليس لديك صلاحية عرض مؤشرات الموظفين.' : 'تعذّر تحميل مؤشرات الموظفين.'}
      </KpiError>
    );
  }

  if (items.length === 0) return <KpiNotice>لا يوجد موظفون لعرضهم في هذه الفترة.</KpiNotice>;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <EmployeePerfCard
          key={item.employee?.id}
          item={item}
          periodLabel={periodLabel}
          detailsHref={buildDetailsHref(item.employee?.id, period, dateFrom, dateTo)}
        />
      ))}
    </div>
  );
}

/** The "مؤشرات الموظفين" tab. */
export function KpiBoardTab() {
  const [period, setPeriod] = useState(DEFAULT_KPI_PERIOD);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const query = useKpiBoard({ period, dateFrom, dateTo });
  const periods = query.data?.periods?.length ? query.data.periods : FALLBACK_KPI_PERIODS;
  const periodLabel = periods.find((item) => item.key === period)?.label_ar ?? 'اليوم';
  const awaitingRange = needsDateRange(period, dateFrom, dateTo);
  const items = useMemo(() => withMaxCompleted(query.data?.items ?? []), [query.data]);

  function handlePeriodChange(value) {
    setPeriod(value);
    if (value !== CUSTOM_PERIOD) {
      setDateFrom('');
      setDateTo('');
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="font-bold text-foreground">مؤشرات الموظفين</h2>
        {query.data?.summary && !awaitingRange && <BoardSummary summary={query.data.summary} />}
      </div>

      <KpiFilters
        periods={periods}
        period={period}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onPeriodChange={handlePeriodChange}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />
      <BoardBody query={query} items={items} period={period} periodLabel={periodLabel} dateFrom={dateFrom} dateTo={dateTo} awaitingRange={awaitingRange} />
    </div>
  );
}
