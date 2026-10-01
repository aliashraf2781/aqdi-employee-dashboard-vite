import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { createRole, deleteRole, updateRole } from '@/features/employees/api/roles-api';
import { employeeKeys, roleKeys } from '@/features/employees/hooks/query-keys';

function useRoleMutation(mutationFn, { success, failure }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (response, variables) => {
      toast.success(response?.message || success);
      queryClient.invalidateQueries({ queryKey: roleKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.roleOptions });
      queryClient.invalidateQueries({ queryKey: roleKeys.modules });
      if (variables?.id) queryClient.invalidateQueries({ queryKey: roleKeys.detail(variables.id) });
    },
    onError: (error) => toast.error(getErrorMessage(error, failure)),
  });
}

export function useCreateRole() {
  return useRoleMutation(createRole, { success: 'تم إضافة الدور بنجاح', failure: 'حدث خطأ أثناء إضافة الدور' });
}

export function useUpdateRole() {
  return useRoleMutation(updateRole, { success: 'تم تعديل الدور بنجاح', failure: 'حدث خطأ أثناء تعديل الدور' });
}

export function useDeleteRole() {
  return useRoleMutation(deleteRole, { success: 'تم حذف الدور بنجاح', failure: 'حدث خطأ أثناء حذف الدور' });
}
