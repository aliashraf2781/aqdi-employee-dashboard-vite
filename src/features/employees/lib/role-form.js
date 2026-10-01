import { buildPermissionMatrix, permissionNamesFromMatrix } from '@/features/employees/lib/role-permissions';

export const EMPTY_ROLE_VALUES = {
  name: '',
  title_ar: '',
  description: '',
  activate_all: false,
  permissions: [],
};

/** Turns a role from the API into the values the edit form starts with. */
export function roleToFormValues(role, allPermissionNames) {
  const selected = permissionNamesFromMatrix(role.permission_matrix);
  const hasEveryPermission = allPermissionNames.length > 0 && allPermissionNames.every((name) => selected.has(name));

  return {
    name: role.name || '',
    title_ar: role.title_ar || role.title_trans || '',
    description: role.description || '',
    is_active: role.is_active ?? true,
    employee_id: role.employee_id ? String(role.employee_id) : '',
    activate_all: role.is_full_access === true || hasEveryPermission,
    permissions: [...selected],
  };
}

function buildSharedPayload(values, allPermissionNames) {
  const grantedNames = values.activate_all ? allPermissionNames : values.permissions;
  return {
    title_ar: values.title_ar.trim(),
    description: values.description?.trim() || null,
    activate_all_permissions: values.activate_all,
    permission_matrix: buildPermissionMatrix(grantedNames),
  };
}

export function buildCreateRolePayload(values, allPermissionNames) {
  return {
    ...buildSharedPayload(values, allPermissionNames),
    name: values.name.trim(),
    title_en: null,
    is_active: true,
    employee_id: null,
  };
}

export function buildUpdateRolePayload(values, allPermissionNames, role) {
  return {
    ...buildSharedPayload(values, allPermissionNames),
    title_en: role?.title_en || null,
    is_active: values.is_active,
    employee_id: values.employee_id ? Number(values.employee_id) : null,
  };
}
