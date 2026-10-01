import { TextField } from '@/shared/components/ui/text-field';
import { cn } from '@/shared/lib/cn';
import { PUBLISH_MODES, PUBLISH_MODE_OPTIONS } from '@/features/settings/lib/blog';

/** "Publish now / schedule / draft" choice cards, plus the date picker when scheduling. */
export function BlogPublishOptions({ mode, onModeChange, publishAtField, publishAtError }) {
  return (
    <fieldset className="flex flex-col gap-4 rounded-card border border-border bg-surface-muted p-5">
      <legend className="px-1 text-sm font-bold text-foreground">خيارات النشر</legend>

      <div className="grid gap-3 md:grid-cols-3">
        {PUBLISH_MODE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex cursor-pointer flex-col gap-1 rounded-lg border-2 bg-surface p-4',
              mode === option.value ? 'border-primary bg-accent' : 'border-border',
            )}
          >
            <input
              type="radio"
              className="sr-only"
              checked={mode === option.value}
              onChange={() => onModeChange(option.value)}
            />
            <span className="text-sm font-bold text-foreground">{option.label}</span>
            <span className="text-xs text-muted-foreground">{option.description}</span>
          </label>
        ))}
      </div>

      {mode === PUBLISH_MODES.schedule && (
        <TextField label="تاريخ ووقت النشر" type="datetime-local" error={publishAtError} {...publishAtField} />
      )}
      {mode === PUBLISH_MODES.draft && (
        <p className="text-sm text-muted-foreground">سيتم حفظ المقال كمسودة بدون تاريخ نشر.</p>
      )}
      {mode === PUBLISH_MODES.now && (
        <p className="text-sm text-muted-foreground">سيتم نشر المقال فوراً عند الحفظ.</p>
      )}
    </fieldset>
  );
}
