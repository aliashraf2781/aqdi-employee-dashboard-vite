import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useBlockEmployee, useUnblockEmployee } from '@/features/employees/hooks/use-employee-mutations';
import { blockEmployeeSchema } from '@/features/employees/schemas/block-schema';

const DEFAULT_VALUES = { reason_of_block: '', blocked_until: '' };

function todayIso() {
  return new Date().toISOString().split('T')[0];
}

/** Blocked employee: ask to unblock. Active employee: collect a reason and optional end date. */
export function BlockEmployeeDialog({ employee, open, onOpenChange }) {
  const blockEmployee = useBlockEmployee();
  const unblockEmployee = useUnblockEmployee();

  async function run(action) {
    try {
      await action();
      onOpenChange(false);
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  if (employee?.is_blocked) {
    return (
      <ConfirmDialog
        open={open}
        onOpenChange={onOpenChange}
        title="إلغاء حظر الموظف"
        description={`${employee.name} — هل أنت متأكد من إلغاء حظر هذا الموظف؟ سيتمكن من تسجيل الدخول واستئناف أنشطته بشكل طبيعي.`}
        confirmLabel="تأكيد إلغاء الحظر"
        isLoading={unblockEmployee.isPending}
        onConfirm={() => run(() => unblockEmployee.mutateAsync(employee.id))}
      />
    );
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title="حظر الموظف"
      description={employee?.name}
      schema={blockEmployeeSchema}
      defaultValues={DEFAULT_VALUES}
      onSubmit={(values) => run(() => blockEmployee.mutateAsync({ id: employee.id, ...values }))}
      submitLabel="تأكيـد الحـظر"
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextareaField label="سبب الحظر *" placeholder="أدخل سبب حظر الموظف هنا..." error={errors.reason_of_block?.message} {...register('reason_of_block')} />
          <TextField label="حظر حتى تاريخ (اختياري)" type="date" min={todayIso()} {...register('blocked_until')} />
          <p className="text-xs text-muted-foreground">اتركه فارغاً للحظر الدائم</p>
        </>
      )}
    </FormDialog>
  );
}
