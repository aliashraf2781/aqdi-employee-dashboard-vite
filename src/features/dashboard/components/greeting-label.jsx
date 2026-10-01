import { useLiveDate } from '@/features/dashboard/hooks/use-live-date';
import { getGreeting } from '@/features/dashboard/lib/dashboard-format';

export function GreetingLabel() {
  const now = useLiveDate();
  return <p className="mb-1 text-xs font-medium text-muted-foreground">{getGreeting(now)}</p>;
}
