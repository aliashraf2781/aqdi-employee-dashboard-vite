import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { selectIsAuthenticated, useAuthStore } from '@/features/auth/store/auth-store';

/** Renders child routes only for logged-in users; others go to /login. */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}
