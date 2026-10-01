import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { SwitchField } from '@/shared/components/ui/switch-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { SettingsSection } from '@/features/settings/components/settings-section';
import { useSaveAppStatus } from '@/features/settings/hooks/use-app-status';
import { PLATFORM_VERSION_FIELDS, buildPlatformPayload } from '@/features/settings/lib/app-status';

/** Latest/minimum version, store link and "force update" switch for one mobile platform. */
export function PlatformVersionSection({ platform, label, values, canEdit }) {
  const { register, control, setValue, handleSubmit } = useForm({ defaultValues: values });
  const forceUpdate = useWatch({ control, name: 'force_update' });
  const save = useSaveAppStatus({ successMessage: 'تم حفظ إعدادات الإصدار', failureMessage: 'تعذر حفظ إعدادات الإصدار' });

  return (
    <SettingsSection title={label}>
      <form onSubmit={handleSubmit((form) => save.mutate(buildPlatformPayload(platform, form)))} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          {PLATFORM_VERSION_FIELDS[platform].map((field) => {
            const Field = field.type === 'textarea' ? TextareaField : TextField;
            return (
              <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : undefined}>
                <Field
                  label={field.label}
                  placeholder={field.placeholder}
                  dir={field.dir ?? (field.type === 'textarea' ? undefined : 'ltr')}
                  disabled={!canEdit}
                  {...register(field.name)}
                />
              </div>
            );
          })}
        </div>
        <SwitchField
          label="إلزام التحديث"
          checked={forceUpdate}
          disabled={!canEdit}
          onCheckedChange={(checked) => setValue('force_update', checked, { shouldDirty: true })}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={!canEdit || save.isPending}>
            {save.isPending ? 'جاري الحفظ...' : 'حفظ الإصدار'}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
