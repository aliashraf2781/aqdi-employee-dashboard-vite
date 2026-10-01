import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { useDeleteEmployee } from '@/features/employees/hooks/use-employee-mutations';

/** Asks before deleting; `onDeleted` lets the caller navigate away afterwards. */
export function DeleteEmployeeDialog({ employee, open, onOpenChange, onDeleted }) {
  const deleteEmployee = useDeleteEmployee();

  async function handleConfirm() {
    try {
      await deleteEmployee.mutateAsync(employee.id);
      onOpenChange(false);
      onDeleted?.();
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="هل أنت متأكد من حذف الموظف"
      description={`${employee?.name ?? ''} — هذا الإجراء لا يمكن التراجع عنه بعد الحذف! سيتم فقدان كافة البيانات المرتبطة بهذا الموظف.`}
      confirmLabel="تأكيـد الحـذف"
      destructive
      isLoading={deleteEmployee.isPending}
      onConfirm={handleConfirm}
    />
  );
}
