import { Badge } from '@/shared/components/badge';
import { getRoleBadgeTone } from '@/features/employees/lib/employee-display';

export function RoleBadge({ role, colorIndex = 0 }) {
  return (
    <Badge tone={getRoleBadgeTone(colorIndex)} className="whitespace-nowrap">
      {role || 'غير محدد'}
    </Badge>
  );
}
