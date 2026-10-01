import { useEffect, useMemo } from 'react';
import { useWatch } from 'react-hook-form';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextField } from '@/shared/components/ui/text-field';
import { useAddEmployeeSalary } from '@/features/employees/hooks/use-employee-mutations';
import { calculateSalaryTotal } from '@/features/employees/lib/salary-total';
import { salarySchema } from '@/features/employees/schemas/salary-schema';

/** Keeps the read-only total in sync with the three amount fields. */
function SalaryTotalField({ control, register, setValue, error }) {
  const [basicSalary, deduction, bonus] = useWatch({ control, name: ['basic_salary', 'deduction', 'bonus'] });

  useEffect(() => {
    setValue('total', calculateSalaryTotal({ basic_salary: basicSalary, deduction, bonus }));
  }, [basicSalary, deduction, bonus, setValue]);

  return <TextField label="المجموع (تلقائي)" type="number" step="0.01" readOnly error={error} {...register('total')} />;
}

function toPayload(values) {
  return {
    addition_date: values.addition_date,
    due_date: values.due_date,
    basic_salary: parseFloat(values.basic_salary || 0),
    deduction: parseFloat(values.deduction || 0),
    bonus: parseFloat(values.bonus || 0),
    total: parseFloat(values.total || 0),
  };
}

export function SalaryFormDialog({ employee, open, onOpenChange }) {
  const addSalary = useAddEmployeeSalary();
  const defaultValues = useMemo(
    () => ({
      addition_date: new Date().toISOString().split('T')[0],
      due_date: '',
      basic_salary: employee?.base_salary ? String(parseFloat(employee.base_salary)) : '',
      deduction: '0',
      bonus: '0',
      total: '',
    }),
    [employee?.base_salary],
  );

  async function handleSubmit(values) {
    try {
      await addSalary.mutateAsync({ id: employee.id, ...toPayload(values) });
      onOpenChange(false);
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="إضافة راتب جديد"
      size="lg"
      schema={salarySchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel="حفظ الراتب"
    >
      {({ register, control, setValue, formState: { errors } }) => (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="تـاريخ الاضــافة" type="date" error={errors.addition_date?.message} {...register('addition_date')} />
          <TextField label="تـاريخ الاستحقاق" type="date" error={errors.due_date?.message} {...register('due_date')} />
          <TextField label="الراتب الأساسي" type="number" step="0.01" placeholder="0.00" error={errors.basic_salary?.message} {...register('basic_salary')} />
          <TextField label="الخصم" type="number" step="0.01" placeholder="0.00" {...register('deduction')} />
          <TextField label="المكافأة" type="number" step="0.01" placeholder="0.00" {...register('bonus')} />
          <SalaryTotalField control={control} register={register} setValue={setValue} error={errors.total?.message} />
        </div>
      )}
    </FormDialog>
  );
}
