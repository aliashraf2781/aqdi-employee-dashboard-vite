import { Button } from '@/shared/components/ui/button';

/** A labelled row of exclusive choice buttons. `options`: [{ value, label }]. */
export function FilterButtonGroup({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value || 'all'}
            size="sm"
            variant={value === option.value ? 'primary' : 'outline'}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
