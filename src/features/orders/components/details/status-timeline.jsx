import { History } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { formatStamp } from '../../lib/format-date-time';

/** Status history of the order. Each status color comes from the API (set inline). */
export function StatusTimeline({ timeline = [] }) {
  if (!timeline.length) return null;

  return (
    <section className="rounded-2xl border border-dashed border-border bg-surface p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-violet-soft text-violet">
          <History className="size-4" />
        </span>
        <h3 className="text-sm font-black text-primary">مسار الحالة</h3>
      </div>

      <ol className="space-y-0">
        {timeline.map((entry, index) => {
          const isLast = index === timeline.length - 1;
          const isCurrent = entry.state === 'current';
          return (
            <li key={entry.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && <span className="absolute end-2.5 top-3 h-full w-px bg-border" />}
              <span
                className={cn('relative mt-0.5 size-6 shrink-0 rounded-full border-2 border-surface bg-neutral', isCurrent && 'ring-2 ring-offset-2 ring-offset-surface')}
                style={entry.color ? { backgroundColor: entry.color } : undefined}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="inline-flex items-center rounded-full bg-neutral px-2.5 py-0.5 text-xs font-bold text-primary-foreground"
                    style={entry.color ? { backgroundColor: entry.color } : undefined}
                  >
                    {entry.label}
                  </span>
                  {isCurrent && <span className="text-xs font-bold text-violet">الحالية</span>}
                  {entry.created_at && <span className="text-xs font-medium tabular-nums text-muted-foreground">{formatStamp(entry.created_at)}</span>}
                </div>
                {entry.description && <p className="mt-1 text-xs font-medium text-muted-foreground">{entry.description}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
