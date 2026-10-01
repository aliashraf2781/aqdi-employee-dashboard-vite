import { Card } from '@/shared/components/card';
import { cn } from '@/shared/lib/cn';

/** Number + label with a colored accent bar on the start edge. `accentClass` is a token class like `bg-success`. */
export function StatCard({ label, value, accentClass, className }) {
  return (
    <Card className={cn('relative overflow-hidden p-4 text-center', className)}>
      <span aria-hidden className={cn('absolute inset-y-2 end-0 w-1 rounded-full', accentClass)} />
      <div className="text-2xl font-bold leading-none tabular-nums text-foreground">{value}</div>
      <div className="mt-2 whitespace-nowrap text-xs font-medium text-muted-foreground">{label}</div>
    </Card>
  );
}
