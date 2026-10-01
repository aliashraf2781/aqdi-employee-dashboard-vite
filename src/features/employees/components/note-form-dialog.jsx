import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useAddEmployeeNote } from '@/features/employees/hooks/use-employee-mutations';
import { noteSchema } from '@/features/employees/schemas/note-schema';

export function NoteFormDialog({ employee, open, onOpenChange }) {
  const addNote = useAddEmployeeNote();
  const defaultValues = useMemo(() => ({ addition_date: new Date().toISOString().split('T')[0], note: '' }), []);

  async function handleSubmit(values) {
    try {
      await addNote.mutateAsync({ id: employee.id, ...values });
      onOpenChange(false);
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="إضافة ملاحظة جديدة"
      schema={noteSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel="حفظ الملاحظة"
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField label="التاريخ" type="date" error={errors.addition_date?.message} {...register('addition_date')} />
          <TextareaField label="الملاحظة" rows={6} placeholder="أكتب ملاحظتك عن الموظف هنا..." error={errors.note?.message} {...register('note')} />
        </>
      )}
    </FormDialog>
  );
}
