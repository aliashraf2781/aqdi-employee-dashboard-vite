import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

/** Column title that doubles as a sort toggle. */
export function SortableHeader({ label, active, direction, onClick }) {
  const Icon = !active ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown;

  return (
    <button
      type="button"
      onClick={onClick}
      title="ترتيب"
      className={cn('inline-flex items-center gap-1 transition-colors hover:text-primary', active && 'text-primary')}
    >
      <span>{label}</span>
      <Icon className={cn('size-3 shrink-0', active ? 'opacity-90' : 'opacity-50')} />
    </button>
  );
}
