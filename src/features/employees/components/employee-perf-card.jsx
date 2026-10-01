import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/card';
import { cn } from '@/shared/lib/cn';
import { computeEmployeePerfMetrics, findKpiCard, getPerfTone } from '@/features/employees/lib/employee-perf-metrics';

const TONE_BAR = { success: 'bg-success', warning: 'bg-warning', danger: 'bg-danger' };
const TONE_SCORE = {
  success: 'border-success bg-success-soft text-success',
  warning: 'border-warning bg-warning-soft text-warning',
  danger: 'border-danger bg-danger-soft text-danger',
};

function PerfBar({ label, percent }) {
  const value = Math.max(0, Math.min(100, percent ?? 0));
  return (
    <div className="my-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
      <span className="w-40 shrink-0 sm:w-52">{label}</span>
      <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <span className={cn('block h-full rounded-full', TONE_BAR[getPerfTone(value)])} style={{ width: `${value}%` }} />
      </span>
      <b className="w-10 shrink-0 text-end">{value}%</b>
    </div>
  );
}

function PerfNumber({ label, value, danger }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted p-2 text-center">
      <b className={cn('block text-base', danger ? 'text-danger' : 'text-foreground')}>{value}</b>
      <small className="text-xs text-muted-foreground">{label}</small>
    </div>
  );
}

/** One employee on the KPI board: score circle, four numbers, three progress bars. */
export function EmployeePerfCard({ item, periodLabel, detailsHref }) {
  const employee = item.employee ?? {};
  const shift = item.shift ?? {};
  const isOnDuty = shift.is_on_duty ?? shift.duty_status === 'inside';
  const maxCompleted = item._maxCompleted ?? findKpiCard(item, 'completed')?.value ?? 0;
  const metrics = computeEmployeePerfMetrics(item, maxCompleted);
  const labelOf = (key, fallback) => findKpiCard(item, key)?.label_ar ?? fallback;

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <b className="block text-foreground">{employee.name_label ?? employee.name ?? '—'}</b>
          <small className="text-xs text-muted-foreground">{shift.label_ar ?? '—'}</small>
        </div>
        <Badge tone={isOnDuty ? 'success' : 'neutral'} className="shrink-0 whitespace-nowrap">
          {isOnDuty ? '● داخل الدوام الآن' : 'خارج الدوام'}
        </Badge>
      </div>

      <div className="mb-3 flex items-center gap-4">
        <div className={cn('flex size-20 shrink-0 flex-col items-center justify-center rounded-full border-4', TONE_SCORE[getPerfTone(metrics.score)])}>
          <b className="text-2xl leading-none">{metrics.score}</b>
          <small className="text-xs">من 100</small>
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-2 gap-2">
          <PerfNumber label={labelOf('received', `استلم (${periodLabel})`)} value={metrics.received} />
          <PerfNumber label={labelOf('open_now', 'مفتوح الآن')} value={metrics.openNow} />
          <PerfNumber label={labelOf('late_over_24h', 'متأخر >24س')} value={metrics.late} danger={metrics.late > 0} />
          <PerfNumber label={labelOf('completed', 'منجَز بالفترة')} value={metrics.completed} />
        </div>
      </div>

      <PerfBar label={metrics.pickLabel} percent={metrics.pickPct} />
      <PerfBar label="التزام المعالجة (بلا تأخر >24س)" percent={metrics.procPct} />
      <PerfBar label="حجم الإنجاز مقارنةً بالأعلى" percent={metrics.volPct} />

      {detailsHref && (
        <Button asChild className="mt-3 w-full">
          <Link to={detailsHref}>التفاصيل الكاملة ←</Link>
        </Button>
      )}
    </Card>
  );
}
