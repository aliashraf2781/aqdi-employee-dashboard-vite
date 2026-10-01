import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

/** Native checkbox with a label, styled with tokens. Works with `register('x')`. */
export const CheckboxField = forwardRef(function CheckboxField({ label, className, id, ...props }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <label htmlFor={inputId} className={cn('flex cursor-pointer items-center gap-2 text-sm font-medium text-foreground', className)}>
      <input ref={ref} id={inputId} type="checkbox" className="size-4 accent-primary" {...props} />
      {label}
    </label>
  );
});
