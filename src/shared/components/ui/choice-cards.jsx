import { cn } from '@/shared/lib/cn';

/**
 * A row of selectable cards (radio buttons look). With `multiple`, `value` is an array of selected values
 * and several cards can be on; otherwise `value` is the one selected value.
 * `options`: [{ value, label, icon? }]
 */
export function ChoiceCards({ label, error, options, value, onChange, multiple = false, columns = 3, disabled = false }) {
  const isSelected = (optionValue) => (multiple ? value.includes(optionValue) : value === optionValue);

  const toggle = (optionValue) => {
    if (!multiple) {
      onChange(optionValue);
      return;
    }
    onChange(value.includes(optionValue) ? value.filter((item) => item !== optionValue) : [...value, optionValue]);
  };

  const gridClass = columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <div className="flex flex-col gap-2">
      {label && <span className="text-sm font-medium text-foreground">{label}</span>}
      <div className={cn('grid gap-2', gridClass)} role={multiple ? 'group' : 'radiogroup'} aria-label={label}>
        {options.map((option) => {
          const selected = isSelected(option.value);
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              type="button"
              role={multiple ? 'checkbox' : 'radio'}
              aria-checked={selected}
              disabled={disabled}
              onClick={() => toggle(option.value)}
              className={cn(
                'flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl border px-2 text-center text-sm font-bold transition-colors disabled:opacity-60',
                selected ? 'border-primary bg-accent text-accent-foreground' : 'border-input bg-surface text-muted-foreground hover:border-primary',
              )}
            >
              {Icon && <Icon className="size-5" />}
              {option.label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
