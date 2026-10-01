import { Card } from '@/shared/components/card';
import { cn } from '@/shared/lib/cn';

/** Titled card used by every block of the marketing screens. */
export function SectionCard({ title, subtitle, action, className, children }) {
  return (
    <Card className={cn('p-5', className)}>
      {(title || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-foreground">{title}</h3>
            {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </Card>
  );
}
