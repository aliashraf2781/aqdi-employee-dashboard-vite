import { forwardRef } from 'react';
import { cn } from '@/shared/lib/cn';

/** Square bordered button holding one icon. `label` is required for accessibility. */
export const IconButton = forwardRef(function IconButton({ label, active = false, className, children, ...props }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50',
        active && 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover hover:text-primary-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
