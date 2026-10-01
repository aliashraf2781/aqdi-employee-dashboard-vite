import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { deleteUser, sendUserSms, toggleUserBlock } from '@/features/users/api/users-api';
import { userKeys } from '@/features/users/hooks/use-user';

function useUserMutation(mutationFn, { success, failure }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (response, userId) => {
      toast.success(response?.message || success);
      queryClient.invalidateQueries({ queryKey: userKeys.detail(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.analysis });
    },
    onError: (error) => toast.error(getErrorMessage(error, failure)),
  });
}

export function useToggleUserBlock() {
  return useUserMutation(toggleUserBlock, {
    success: 'تم تحديث حالة المستخدم بنجاح',
    failure: 'حدث خطأ أثناء تحديث حالة المستخدم',
  });
}

export function useDeleteUser() {
  return useUserMutation(deleteUser, { success: 'تم حذف المستخدم بنجاح', failure: 'حدث خطأ أثناء حذف المستخدم' });
}

export function useSendUserSms() {
  return useMutation({
    mutationFn: sendUserSms,
    onSuccess: (response) => toast.success(response?.message || 'تم إرسال الرسالة بنجاح'),
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء إرسال الرسالة')),
  });
}
