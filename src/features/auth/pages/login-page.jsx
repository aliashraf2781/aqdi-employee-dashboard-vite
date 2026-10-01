import { useNavigate } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/login-form';
import { useLogin } from '@/features/auth/hooks/use-login';

export function LoginPage() {
  const navigate = useNavigate();
  const { mutate: login, isPending } = useLogin({ onSuccess: () => navigate('/home') });

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-auth-card rounded-card border border-border bg-surface p-8 shadow-card">
        <h1 className="mb-8 text-center text-lg text-muted-foreground">لوحة تحكم الموظفين</h1>
        <LoginForm onSubmit={login} isLoading={isPending} />
      </div>
    </main>
  );
}
