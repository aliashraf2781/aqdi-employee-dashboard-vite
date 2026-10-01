import { Badge } from '@/shared/components/badge';
import { formatMoneyWithDecimals } from '@/features/clients/lib/client-details-format';

export function MoneyPill({ value }) {
  if (!(Number(value) > 0)) {
    return <span className="text-sm tabular-nums text-muted-foreground">0.00</span>;
  }
  return (
    <Badge tone="success" className="whitespace-nowrap font-bold tabular-nums">
      {formatMoneyWithDecimals(value)}
    </Badge>
  );
}
