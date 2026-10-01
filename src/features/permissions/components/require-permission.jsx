import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { PageLoader } from '@/shared/components/page-loader';
import { usePermissions } from '@/features/permissions/hooks/use-permissions';

/**
 * Route guard. Wrap a page (or a layout route) and it renders only when the user
 * may `action` (default `view`) on `section`. `section` may be a key, an array of
 * keys (any-of), or null (any logged-in user).
 */
export function RequirePermission({ section = null, action = 'view', children }) {
  const { can, isReady } = usePermissions();
  const allowed = section === null || (isReady && can(section, action));
  const denied = isReady && !allowed;

  useEffect(() => {
    if (denied) toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة');
  }, [denied]);

  if (!isReady) return <PageLoader />;
  if (denied) return <Navigate to="/home" replace />;
  return children;
}
