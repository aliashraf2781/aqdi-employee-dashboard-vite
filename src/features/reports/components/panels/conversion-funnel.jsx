import { chartBarClass } from '../../lib/chart-colors';
import { formatNumber } from '../../lib/report-format';
import { EmptyNote } from '../empty-note';

const MIN_VISIBLE_PERCENT = 3;

function conversionFromPrevious(stage, previous) {
  const given = stage.from_previous_pct ?? stage.conv_from_previous;
  if (given != null) return given;
  if (!previous?.value) return null;
  return Math.round((Number(stage.value) / Number(previous.value)) * 100);
}

/** Funnel of order stages with the share kept from the previous stage and the drop-off ("leakage"). */
export function ConversionFunnel({ stages, leakage }) {
  if (!stages.length) return <EmptyNote />;
  const peak = Math.max(...stages.map((stage) => Number(stage.value) || 0), 1);

  return (
    <div className="flex flex-col gap-3">
      {stages.map((stage, index) => {
        const value = Number(stage.value) || 0;
        const width = value > 0 ? Math.max((value / peak) * 100, MIN_VISIBLE_PERCENT) : 0;
        const fromPrevious = conversionFromPrevious(stage, stages[index - 1]);

        return (
          <div key={stage.label}>
            <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
              <span className="font-bold text-foreground">{stage.label}</span>
              <b className="tabular-nums text-foreground">
                {formatNumber(value)}
                {fromPrevious != null && (
                  <span className="ms-1 text-xs font-bold text-muted-foreground">{fromPrevious}% من السابق</span>
                )}
              </b>
            </div>
            <div className="h-3 overflow-hidden rounded-md bg-neutral-soft">
              <div
                className={`h-full rounded-md transition-all duration-500 ${chartBarClass(index)}`}
                style={{ width: `${width}%` }}
              />
            </div>
          </div>
        );
      })}

      {leakage && (
        <div className="mt-1 flex items-center justify-between gap-3 border-t border-dashed border-border pt-2 text-sm">
          <span className="font-bold text-muted-foreground">التسرّب — لم يكملوا الطلب</span>
          <b className="tabular-nums text-warning">
            {leakage.count} ({leakage.percent}%)
          </b>
        </div>
      )}
    </div>
  );
}
