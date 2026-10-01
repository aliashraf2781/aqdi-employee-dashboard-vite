import { z } from 'zod';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextField } from '@/shared/components/ui/text-field';
import { useUpdateInstrumentSetting } from '@/features/contract-settings/hooks/use-instrument-settings';

const schema = z.object({ label: z.string().trim().min(1, 'الاسم الظاهر مطلوب') });

/** Rename how an instrument type is shown to users. */
export function EditLabelDialog({ item, onClose }) {
  const update = useUpdateInstrumentSetting({
    successMessage: 'تم تحديث النص الظاهر بنجاح',
    failureMessage: 'تعذر تحديث النص الظاهر',
    onSaved: onClose,
  });

  const submit = async ({ label }) => {
    try {
      await update.mutateAsync({ item, changes: { label } });
    } catch {
      // Error toast already shown by the mutation.
    }
  };

  return (
    <FormDialog
      open
      onOpenChange={(open) => !open && onClose()}
      title="تعديل الاسم الظاهر"
      description={item.type_name}
      schema={schema}
      defaultValues={{ label: item.label }}
      onSubmit={submit}
    >
      {({ register, formState: { errors } }) => (
        <TextField
          label="الاسم الظاهر (label)"
          placeholder="الاسم الظاهر مع نوع الصك"
          error={errors.label?.message}
          {...register('label')}
        />
      )}
    </FormDialog>
  );
}
