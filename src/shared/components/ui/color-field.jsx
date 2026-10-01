import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

/**
 * Hex color text input with a native color picker beside it.
 * Works with react-hook-form through `register` (text value) and `onPick` for the picker.
 */
export const ColorField = forwardRef(function ColorField({ label, error, value, onPick, className, id, ...inputProps }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          dir="ltr"
          aria-invalid={Boolean(error)}
          className={cn(
            'h-11 w-full rounded-md border border-input bg-surface pe-14 ps-3 text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive',
            className,
          )}
          {...inputProps}
        />
        <input
          type="color"
          aria-label={label}
          value={value}
          onChange={(event) => onPick(event.target.value)}
          className="absolute end-2 top-1/2 size-8 -translate-y-1/2 cursor-pointer rounded-full border border-border bg-transparent p-0"
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});
