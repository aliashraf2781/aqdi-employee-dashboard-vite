import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

/**
 * Label + input + error message in one piece, so every form looks and behaves the same.
 * Works with react-hook-form: <TextField label="..." error={errors.x?.message} {...register('x')} />
 */
export const TextField = forwardRef(function TextField(
  { label, error, className, id, ...inputProps },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        className={cn(
          'h-11 rounded-md border border-input bg-surface px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive',
          className,
        )}
        {...inputProps}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});
