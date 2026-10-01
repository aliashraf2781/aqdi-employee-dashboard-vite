import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Modal } from '@/shared/components/modal';

/**
 * Modal + react-hook-form + zod. Add/edit dialogs only describe their fields:
 *
 *   <FormDialog schema={schema} defaultValues={...} onSubmit={save} ...>
 *     {({ register, formState: { errors } }) => <TextField {...register('name')} />}
 *   </FormDialog>
 *
 * `onSubmit` receives validated values and may return a promise; the dialog shows
 * a loading state while it runs and resets the form each time it opens.
 */
export function FormDialog({
  open,
  onOpenChange,
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  submitLabel = 'حفظ',
  cancelLabel = 'إلغاء',
  size,
  children,
}) {
  const form = useForm({ resolver: zodResolver(schema), defaultValues });
  const { handleSubmit, reset, formState } = form;

  useEffect(() => {
    if (open) reset(defaultValues);
  }, [open, defaultValues, reset]);

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description} size={size}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {children(form)}
        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button type="submit" disabled={formState.isSubmitting}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
