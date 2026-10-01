import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Providers } from '@/app/providers';
import { router } from '@/app/router';
import { useAuthStore } from '@/features/auth';
import { configureApiAuth } from '@/shared/lib/api-client';
import { initTheme } from '@/shared/hooks/use-theme';
import '@/styles/index.css';

initTheme();

// Wire the API client to the auth store once, here, so shared code stays feature-free.
configureApiAuth({
  getToken: () => useAuthStore.getState().token,
  onUnauthorized: () => {
    useAuthStore.getState().clearSession();
    router.navigate('/login');
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
);
