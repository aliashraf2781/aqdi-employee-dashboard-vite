import { Card } from '@/shared/components/card';
import { cn } from '@/shared/lib/cn';

/** A titled card; every block of an analysis panel is one of these. */
export function ReportSection({ title, action, className, children }) {
  return (
    <Card className={cn('flex min-w-0 flex-col gap-4 p-5', className)}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3">
          {title ? <h3 className="text-sm font-bold text-foreground">{title}</h3> : <span />}
          {action}
        </div>
      )}
      {children}
    </Card>
  );
}
