import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextField } from '@/shared/components/ui/text-field';
import { useCreateOperatingExpense, useUpdateOperatingExpense } from '../hooks/use-operating-expenses';
import { EMPTY_EXPENSE, operatingExpenseSchema } from '../schemas/operating-expense-schema';

/** Add (expense = null) or edit one operating expense. */
export function OperatingExpenseDialog({ open, onOpenChange, expense }) {
  const { mutateAsync: createExpense } = useCreateOperatingExpense();
  const { mutateAsync: updateExpense } = useUpdateOperatingExpense();
  const isEditing = Boolean(expense?.id);

  const defaultValues = useMemo(
    () => (expense ? { expense: expense.expense ?? '', amount: expense.amount ?? '' } : EMPTY_EXPENSE),
    [expense],
  );

  const save = async (values) => {
    try {
      if (isEditing) await updateExpense({ id: expense.id, ...values });
      else await createExpense(values);
      onOpenChange(false);
    } catch {
      // The mutation hook already showed the error toast; keep the dialog open to retry.
    }
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'تعديل مصروف تشغيلي' : 'إضافة مصروف تشغيلي'}
      schema={operatingExpenseSchema}
      defaultValues={defaultValues}
      onSubmit={save}
      submitLabel={isEditing ? 'حفظ التعديلات' : 'إضافة المصروف'}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField
            label="اسم المصروف"
            placeholder="مثال: إيجار المكتب"
            error={errors.expense?.message}
            {...register('expense')}
          />
          <TextField
            label="المبلغ (ريال)"
            type="number"
            step="any"
            inputMode="decimal"
            placeholder="0.00"
            error={errors.amount?.message}
            {...register('amount')}
          />
        </>
      )}
    </FormDialog>
  );
}
