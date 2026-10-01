import { Badge } from '@/shared/components/badge';

/** A small round counter; zero is shown as plain muted text so non-zero counts stand out. */
export function CountBadge({ value, tone = 'neutral' }) {
  const count = Number(value) || 0;

  if (count === 0) return <span className="text-sm text-muted-foreground">0</span>;

  return (
    <Badge tone={tone} className="size-7 justify-center rounded-full font-bold tabular-nums">
      {count}
    </Badge>
  );
}
