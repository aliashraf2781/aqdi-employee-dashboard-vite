import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { fetchEmployees } from '@/features/employees/api/employees-api';
import {
  fetchPermissionModules,
  fetchRole,
  fetchRoleOptions,
  fetchRoles,
} from '@/features/employees/api/roles-api';
import { employeeKeys, roleKeys } from '@/features/employees/hooks/query-keys';
import { withoutLegacyModules } from '@/features/employees/lib/role-permissions';

const EMPLOYEE_CHOICES_LIMIT = 200;

export function useRoles(page) {
  return useQuery({
    queryKey: roleKeys.list(page),
    queryFn: () => fetchRoles(page),
    placeholderData: keepPreviousData,
  });
}

/** Roles for the employee form dropdown. */
export function useRoleOptions() {
  return useQuery({ queryKey: employeeKeys.roleOptions, queryFn: fetchRoleOptions });
}

export function useRole(id) {
  return useQuery({ queryKey: roleKeys.detail(id), queryFn: () => fetchRole(id), enabled: Boolean(id) });
}

export function usePermissionModules({ enabled = true } = {}) {
  return useQuery({
    queryKey: roleKeys.modules,
    queryFn: async () => withoutLegacyModules(await fetchPermissionModules()),
    enabled,
  });
}

/** Employees that a role can be linked to (edit-role form). */
export function useEmployeeChoices({ enabled = true } = {}) {
  return useQuery({
    queryKey: roleKeys.employeeChoices,
    queryFn: async () => (await fetchEmployees({ perPage: EMPLOYEE_CHOICES_LIMIT })).items,
    enabled,
  });
}
