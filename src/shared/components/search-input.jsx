import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

/** Text box with a magnifier icon, controlled by the caller. */
export function SearchInput({ value, onChange, placeholder = 'بحث...', className }) {
  return (
    <div className={cn('relative min-w-56 max-w-md flex-1', className)}>
      <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-input bg-surface ps-10 pe-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
