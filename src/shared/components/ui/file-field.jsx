import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

/** Label + file input + error. `onFileChange` receives the chosen File (or null). */
export const FileField = forwardRef(function FileField({ label, error, accept, onFileChange, className, id, ...inputProps }, ref) {
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
        type="file"
        accept={accept}
        aria-invalid={Boolean(error)}
        onChange={(event) => onFileChange(event.target.files?.[0] ?? null)}
        className={cn(
          'rounded-md border border-input bg-surface p-2 text-sm file:me-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-accent-foreground aria-[invalid=true]:border-destructive',
          className,
        )}
        {...inputProps}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
});
