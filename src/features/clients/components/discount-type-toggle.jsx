import { cn } from '@/shared/lib/cn';
import { DISCOUNT_TYPES } from '@/features/clients/lib/client-discount';

const OPTIONS = [
  { value: DISCOUNT_TYPES.PERCENTAGE, label: 'نسبة %' },
  { value: DISCOUNT_TYPES.FIXED, label: 'مبلغ ثابت (ر.س)' },
];

/** Two-way switch between a percentage and a fixed-amount discount. */
export function DiscountTypeToggle({ value, onChange }) {
  return (
    <div role="group" aria-label="نوع الخصم" className="inline-flex items-center rounded-full border border-border p-1">
      {OPTIONS.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              'h-8 flex-1 whitespace-nowrap rounded-full px-3 text-xs font-bold transition-colors',
              isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
