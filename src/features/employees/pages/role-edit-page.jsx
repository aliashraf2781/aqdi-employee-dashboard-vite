import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { PageLoader } from '@/shared/components/page-loader';
import { RoleForm } from '@/features/employees/components/role-form';
import { useUpdateRole } from '@/features/employees/hooks/use-role-mutations';
import { useEmployeeChoices, usePermissionModules, useRole } from '@/features/employees/hooks/use-roles';
import { buildUpdateRolePayload, roleToFormValues } from '@/features/employees/lib/role-form';
import { listPermissionNames } from '@/features/employees/lib/role-permissions';
import { editRoleSchema } from '@/features/employees/schemas/role-schema';

const ROLES_TAB_URL = '/home/roles-and-employees?tab=roles';

function BackToRoles({ message }) {
  return (
    <div className="p-6 text-center text-destructive">
      {message}
      <Button asChild variant="ghost" className="mx-auto mt-4 block w-fit text-primary">
        <Link to={ROLES_TAB_URL}>العودة للأدوار</Link>
      </Button>
    </div>
  );
}

/** Edit page: the role id comes from `?id=` (same URL shape as the old app). */
export function RoleEditPage() {
  const roleId = useSearchParams()[0].get('id');
  const navigate = useNavigate();
  const { data: role, isLoading: roleLoading, isError: roleError } = useRole(roleId);
  const { data: modules, isLoading: modulesLoading, isError: modulesError } = usePermissionModules({ enabled: Boolean(roleId) });
  const { data: employees } = useEmployeeChoices({ enabled: Boolean(roleId) });
  const updateRole = useUpdateRole();

  const defaultValues = useMemo(
    () => (role && modules ? roleToFormValues(role, listPermissionNames(modules)) : null),
    [role, modules],
  );

  async function handleSubmit(values, allPermissionNames) {
    try {
      await updateRole.mutateAsync({ id: roleId, ...buildUpdateRolePayload(values, allPermissionNames, role) });
      navigate(ROLES_TAB_URL);
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  if (!roleId) return <BackToRoles message="معرف الدور غير موجود." />;
  if (roleLoading || modulesLoading) return <PageLoader />;
  if (roleError || modulesError || !defaultValues) return <BackToRoles message="تعذر تحميل بيانات الدور." />;

  return (
    <RoleForm
      title="تعديل دور"
      isEdit
      schema={editRoleSchema}
      defaultValues={defaultValues}
      modules={modules}
      employees={employees}
      isSaving={updateRole.isPending}
      onSubmit={handleSubmit}
    />
  );
}
