import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/shared/lib/api-client';
import { login } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/store/auth-store';

/** Splits the login envelope into the session we keep. */
function toSession(payload) {
  const user = payload?.user && typeof payload.user === 'object' ? payload.user : payload;
  const token = payload?.token ?? payload?.access_token ?? null;
  return { user, token };
}

export function useLogin({ onSuccess }) {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: login,
    retry: false,
    onSuccess: (response) => {
      const session = toSession(response?.data);
      if (!response?.success || !session.token) {
        toast.error(response?.message || 'بيانات الدخول غير صحيحة');
        return;
      }
      setSession(session);
      toast.success(response.message || 'تم تسجيل الدخول بنجاح');
      onSuccess();
    },
    onError: (error) => toast.error(getErrorMessage(error, 'حدث خطأ أثناء تسجيل الدخول')),
  });
}
