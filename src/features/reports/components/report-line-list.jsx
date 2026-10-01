import { cva } from 'class-variance-authority';
import { Fragment } from 'react';

const lineVariants = cva('text-sm', {
  variants: {
    tone: {
      default: 'text-foreground',
      green: 'text-success',
      red: 'text-danger',
      gold: 'text-warning',
      muted: 'text-muted-foreground',
    },
    bold: { true: 'font-bold', false: 'font-medium' },
  },
  defaultVariants: { tone: 'default', bold: false },
});

/** Label / value rows. `items`: [{ label, value, tone?, bold?, separator? }]. */
export function ReportLineList({ items }) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => {
        const lineClass = lineVariants({ tone: item.tone ?? 'default', bold: Boolean(item.bold) });

        return (
          <Fragment key={item.label}>
            {item.separator && index > 0 && <div className="my-2 border-t border-border" />}
            <div className="flex items-center justify-between gap-4 py-1.5">
              <span className={lineClass}>{item.label}</span>
              <span className={`${lineClass} shrink-0 tabular-nums`}>{item.value}</span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
