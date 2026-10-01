import { Search, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

/** Text search box with a magnifier and a clear button. Controlled by the parent. */
export function SearchInput({ value, onChange, placeholder = 'بحث...', className }) {
  return (
    <div className={cn('relative min-w-48 flex-1', className)}>
      <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-input bg-surface pe-9 ps-10 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="مسح البحث"
          className="absolute end-3 top-1/2 flex size-5 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
