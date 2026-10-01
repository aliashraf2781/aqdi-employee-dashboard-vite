import { CalendarDays, Clock3 } from 'lucide-react';
import { useLiveDate } from '@/features/dashboard/hooks/use-live-date';
import { formatClock, formatDay } from '@/features/dashboard/lib/dashboard-format';

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-4 py-3.5">
      <div className="mb-2 flex items-center gap-1.5 text-muted-foreground">
        <Icon className="size-3.5" strokeWidth={2} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-base font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

/** Own component so the ticking clock re-renders only itself. */
export function ClockCards() {
  const now = useLiveDate();

  return (
    <div className="mb-7 grid grid-cols-2 gap-3">
      <InfoTile icon={Clock3} label="الوقت الآن" value={formatClock(now)} />
      <InfoTile icon={CalendarDays} label="التاريخ" value={formatDay(now)} />
    </div>
  );
}
