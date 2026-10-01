import { forwardRef, useId } from 'react';
import { cn } from '@/shared/lib/cn';

/** Native checkbox with its label, same look in every form. Works with react-hook-form's `register`. */
export const CheckboxField = forwardRef(function CheckboxField({ label, className, id, ...inputProps }, ref) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className={cn('flex items-start gap-2', className)}>
      <input
        ref={ref}
        id={inputId}
        type="checkbox"
        className="mt-0.5 size-4 rounded-sm border-input accent-primary"
        {...inputProps}
      />
      <label htmlFor={inputId} className="cursor-pointer text-sm text-foreground">
        {label}
      </label>
    </div>
  );
});
