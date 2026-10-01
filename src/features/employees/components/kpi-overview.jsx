import { Badge } from '@/shared/components/badge';
import { Card } from '@/shared/components/card';
import { cn } from '@/shared/lib/cn';
import { EmployeeAvatar } from '@/features/employees/components/employee-avatar';
import { findKpiCard } from '@/features/employees/lib/employee-perf-metrics';

function StatTile({ label, value, danger }) {
  return (
    <div className="rounded-lg bg-surface-muted p-3 text-center">
      <p className={cn('text-lg font-black', danger ? 'text-danger' : 'text-foreground')}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function MiniMetric({ label, value }) {
  return (
    <div className="min-w-0 text-center">
      <p className="truncate text-sm font-bold text-foreground">{value ?? '—'}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function ExtraMetrics({ data }) {
  const receivePercent = data.receive_sla?.percent;
  return (
    <div className="grid grid-cols-2 gap-3 border-t border-dashed border-border pt-4 sm:grid-cols-4">
      {data.avg_receive && <MiniMetric label="متوسط الاستلام (د عمل)" value={data.avg_receive.value_label} />}
      {data.avg_process && <MiniMetric label="متوسط المعالجة" value={data.avg_process.value_label} />}
      {data.revenue && <MiniMetric label="إيراد محقق" value={data.revenue.value_label} />}
      {data.receive_sla && <MiniMetric label="التزام الاستلام ≤ 5د" value={receivePercent != null ? `${receivePercent}%` : '—'} />}
    </div>
  );
}

/** Employee header, the four main numbers and the optional average / revenue metrics. */
export function KpiOverview({ data }) {
  const employee = data.employee ?? {};
  const shift = data.shift ?? {};
  const isOnDuty = shift.is_on_duty ?? shift.duty_status === 'inside';
  const openNow = findKpiCard(data, 'open_now');
  const received = findKpiCard(data, 'received');
  const completed = findKpiCard(data, 'completed');
  const late = findKpiCard(data, 'late_over_24h');
  const isLateDanger = late?.tone === 'danger' && (late?.value ?? 0) > 0;
  const hasExtraMetrics = data.avg_receive || data.avg_process || data.revenue || data.receive_sla;

  return (
    <Card className="flex flex-col gap-5 p-5">
      <div className="flex min-w-0 items-start gap-3">
        <EmployeeAvatar name={employee.name} image={employee.profile_image} size="md" />
        <div className="min-w-0">
          <h3 className="font-bold text-foreground">{employee.name_label ?? employee.name ?? '—'}</h3>
          {employee.role_title && <p className="mt-0.5 text-xs text-muted-foreground">{employee.role_title}</p>}
          <p className="mt-1 text-xs text-muted-foreground">{shift.label_ar ?? '—'}</p>
          <Badge tone={isOnDuty ? 'success' : 'neutral'} className="mt-2">
            {shift.duty_status_label_ar ?? (isOnDuty ? 'داخل الدوام الآن' : 'خارج الدوام')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label={openNow?.label_ar ?? 'مفتوح الآن'} value={openNow?.value ?? 0} />
        <StatTile label={received?.label_ar ?? 'استلم'} value={received?.value ?? 0} />
        <StatTile label={completed?.label_ar ?? 'منجز بالفترة'} value={completed?.value ?? 0} />
        <StatTile label={late?.label_ar ?? 'متأخر > 24 س'} value={late?.value ?? 0} danger={isLateDanger} />
      </div>

      {hasExtraMetrics && <ExtraMetrics data={data} />}
    </Card>
  );
}
