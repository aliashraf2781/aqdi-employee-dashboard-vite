import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/shared/components/card';
import { Button } from '@/shared/components/ui/button';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { cn } from '@/shared/lib/cn';
import { usePermissions } from '@/features/permissions';
import { useSaveSettingsRecord } from '@/features/contract-settings/hooks/use-record-settings';
import { buildRecordSchema, recordToFormValues } from '@/features/contract-settings/lib/record-settings';

/** The form of a record-settings config, filled from `record`. */
export function RecordSettingsForm({ config, record }) {
  const { can } = usePermissions();
  const schema = useMemo(() => buildRecordSchema(config.fields), [config.fields]);
  const { register, handleSubmit, setError, formState } = useForm({
    resolver: zodResolver(schema),
    defaultValues: recordToFormValues(record, config.fields),
  });
  const save = useSaveSettingsRecord(config, {
    onFieldErrors: (errors) => Object.entries(errors).forEach(([name, message]) => setError(name, { message })),
  });

  const canSave = !config.editSection || can(config.editSection, 'edit');

  return (
    <Card className="mx-auto max-w-3xl">
      <form onSubmit={handleSubmit((values) => save.mutate(values))} className="flex flex-col gap-5" noValidate>
        <div className={cn('grid gap-5', config.columns === 2 && 'sm:grid-cols-2')}>
          {config.fields.map((field) => {
            const Field = field.type === 'textarea' ? TextareaField : TextField;
            return (
              <div key={field.name} className="flex flex-col gap-1">
                <Field
                  label={field.label}
                  error={formState.errors[field.name]?.message}
                  {...(field.type === 'number' ? { type: 'number', min: 0, step: 'any', inputMode: 'decimal', placeholder: '0' } : {})}
                  {...register(field.name)}
                />
                {field.description && <p className="text-xs text-muted-foreground">{field.description}</p>}
              </div>
            );
          })}
        </div>

        {canSave && (
          <div className="flex justify-end">
            <Button type="submit" disabled={save.isPending} className="min-w-40">
              {save.isPending ? 'جاري الحفظ...' : config.saveLabel}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}
