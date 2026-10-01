import { Switch } from '@/shared/components/ui/switch';

/** A bordered row: label (+ optional hint) on one side, a Switch on the other. */
export function SwitchField({ label, description, checked, onCheckedChange, disabled }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-surface-muted px-4 py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} aria-label={label} />
    </div>
  );
}
