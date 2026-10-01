import { cn } from '@/shared/lib/cn';
import { getInitials } from '@/features/employees/lib/employee-display';

const SIZE_CLASSES = { sm: 'size-8 text-xs', md: 'size-10 text-sm' };

/** Profile photo, or the employee's initials when there is none. */
export function EmployeeAvatar({ name, image, size = 'sm' }) {
  const sizeClass = SIZE_CLASSES[size];

  if (image) {
    return <img src={image} alt={name || ''} className={cn('shrink-0 rounded-full border border-border object-cover', sizeClass)} />;
  }

  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-full bg-success-soft font-bold text-success', sizeClass)}>
      {getInitials(name)}
    </div>
  );
}
