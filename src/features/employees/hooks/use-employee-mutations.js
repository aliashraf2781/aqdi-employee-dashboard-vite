import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import {
  addEmployeeNote,
  addEmployeeSalary,
  blockEmployee,
  deleteEmployee,
  saveEmployee,
  sendEmployeeSms,
  toggleEmployeeStatus,
  unblockEmployee,
} from '@/features/employees/api/employees-api';
import { employeeKeys } from '@/features/employees/hooks/query-keys';

/**
 * Builds a mutation hook that toasts the server message (or a fallback) and
 * refreshes the employee lists plus, when the call has an `id`, that employee.
 */
function createEmployeeMutationHook(mutationFn, { success, failure, refreshAnalytics = false }) {
  return function useEmployeeMutation() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn,
      onSuccess: (response, variables) => {
        toast.success(response?.message || success);
        queryClient.invalidateQueries({ queryKey: employeeKeys.all });
        if (refreshAnalytics) queryClient.invalidateQueries({ queryKey: ['employeeAnalytics'] });

        const employeeId = variables?.id ?? variables;
        if (typeof employeeId === 'string' || typeof employeeId === 'number') {
          queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employeeId) });
        }
      },
      onError: (error) => toast.error(getErrorMessage(error, failure)),
    });
  };
}

export const useToggleEmployeeStatus = createEmployeeMutationHook(toggleEmployeeStatus, {
  success: 'تم تغيير حالة الموظف',
  failure: 'حدث خطأ أثناء تغيير حالة الموظف',
  refreshAnalytics: true,
});

export const useDeleteEmployee = createEmployeeMutationHook(deleteEmployee, {
  success: 'تم حذف الموظف بنجاح',
  failure: 'حدث خطأ أثناء حذف الموظف',
});

export const useBlockEmployee = createEmployeeMutationHook(blockEmployee, {
  success: 'تم حظر الموظف بنجاح',
  failure: 'حدث خطأ أثناء حظر الموظف',
});

export const useUnblockEmployee = createEmployeeMutationHook(unblockEmployee, {
  success: 'تم إلغاء حظر الموظف بنجاح',
  failure: 'حدث خطأ أثناء إلغاء الحظر',
});

export const useSaveEmployee = createEmployeeMutationHook(saveEmployee, {
  success: 'تم حفظ بيانات الموظف بنجاح',
  failure: 'حدث خطأ أثناء حفظ بيانات الموظف',
});

export const useAddEmployeeNote = createEmployeeMutationHook(addEmployeeNote, {
  success: 'تم إضافة الملاحظة بنجاح',
  failure: 'حدث خطأ أثناء إضافة الملاحظة',
});

export const useAddEmployeeSalary = createEmployeeMutationHook(addEmployeeSalary, {
  success: 'تم إضافة الراتب بنجاح',
  failure: 'حدث خطأ أثناء إضافة الراتب',
});

export function useSendEmployeeSms() {
  return useMutation({
    mutationFn: sendEmployeeSms,
    onSuccess: (response) => toast.success(response?.message || 'تم إرسال الرسالة بنجاح'),
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء إرسال الرسالة')),
  });
}
