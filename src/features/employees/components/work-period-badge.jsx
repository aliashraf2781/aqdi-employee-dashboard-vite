import { Badge } from '@/shared/components/badge';
import { getWorkPeriodLabel } from '@/features/employees/lib/employee-display';

export function WorkPeriodBadge({ workPeriod }) {
  const tone = workPeriod === 'evening' ? 'neutral' : 'warning';
  return (
    <Badge tone={tone} className="whitespace-nowrap">
      {getWorkPeriodLabel(workPeriod)}
    </Badge>
  );
}
