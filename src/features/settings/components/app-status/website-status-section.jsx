import { useForm, useWatch } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { SwitchField } from '@/shared/components/ui/switch-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { SettingsSection } from '@/features/settings/components/settings-section';
import { useSaveAppStatus } from '@/features/settings/hooks/use-app-status';
import { WEBSITE_MESSAGE_FIELDS, buildWebsitePayload } from '@/features/settings/lib/app-status';

/** Opens/closes the public website and edits the maintenance message shown while it is closed. */
export function WebsiteStatusSection({ website, canEdit }) {
  const { register, control, setValue, handleSubmit, formState } = useForm({ defaultValues: website });
  const save = useSaveAppStatus({ successMessage: 'تم تحديث حالة الموقع', failureMessage: 'تعذر تحديث حالة الموقع' });
  const isOpen = useWatch({ control, name: 'is_open' });

  return (
    <SettingsSection
      title="حالة الموقع الإلكتروني"
      description="عند الإيقاف يعرض الموقع صفحة صيانة كاملة برسالة الإغلاق أدناه بحسب لغة الزائر."
    >
      <form onSubmit={handleSubmit((values) => save.mutate(buildWebsitePayload(values)))} className="flex flex-col gap-5">
        <SwitchField
          label="تشغيل الموقع"
          description={isOpen ? 'الموقع يعمل' : 'الموقع مغلق'}
          checked={isOpen}
          disabled={!canEdit}
          onCheckedChange={(checked) => setValue('is_open', checked, { shouldDirty: true })}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          {WEBSITE_MESSAGE_FIELDS.map((field) => (
            <TextareaField
              key={field.name}
              label={field.label}
              placeholder={field.placeholder}
              dir={field.dir}
              rows={2}
              disabled={!canEdit}
              {...register(field.name)}
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={!canEdit || save.isPending || !formState.isDirty}>
            {save.isPending ? 'جاري الحفظ...' : 'حفظ حالة الموقع'}
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
