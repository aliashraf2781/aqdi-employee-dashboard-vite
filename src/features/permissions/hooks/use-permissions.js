import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiClient } from '@/shared/lib/api-client';
import { useAuthStore } from '@/features/auth';
import {
  canAccess,
  canAccessAny,
  extractPermissionsFromRole,
  isSuperAdmin,
  normalizeUserPermissions,
  resolveAuthUser,
} from '@/features/permissions/lib/permissions';

const ROLE_STALE_TIME = 10 * 60 * 1000;

async function fetchRole(roleId) {
  const { data } = await apiClient.get(`/admin/roles/${roleId}`);
  return data;
}

/**
 * Single entry point for "what may the current user do?".
 * If the login payload had no permissions we load them from the user's role.
 *
 *   const { can, isReady } = usePermissions();
 *   if (isReady && can('orders', 'edit')) ...
 */
export function usePermissions() {
  const user = useAuthStore((state) => state.user);
  const authUser = useMemo(() => resolveAuthUser(user), [user]);
  const storedPermissions = useMemo(() => normalizeUserPermissions(user), [user]);

  const roleId = authUser?.role_id ?? null;
  const needsRole = Boolean(roleId) && storedPermissions.length === 0 && !isSuperAdmin(user);

  const role = useQuery({
    queryKey: ['my-role-permissions', roleId],
    queryFn: () => fetchRole(roleId),
    enabled: needsRole,
    staleTime: ROLE_STALE_TIME,
    retry: 1,
  });

  const permissions = useMemo(() => {
    if (storedPermissions.length > 0) return storedPermissions;
    return role.data ? extractPermissionsFromRole(role.data) : [];
  }, [storedPermissions, role.data]);

  // Not ready while the role is still loading. On error we settle with [] (fail closed).
  const isReady = !(needsRole && role.isLoading);

  return {
    user: authUser ?? user,
    permissions,
    isAdmin: isSuperAdmin(user),
    isReady,
    can: (section, action = 'view') => canAccess(permissions, user, section, action),
    canAny: (section, actions) => canAccessAny(permissions, user, section, actions),
  };
}
