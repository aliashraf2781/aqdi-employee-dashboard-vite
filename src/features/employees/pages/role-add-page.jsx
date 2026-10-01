import { useNavigate } from 'react-router-dom';
import { PageLoader } from '@/shared/components/page-loader';
import { RoleForm } from '@/features/employees/components/role-form';
import { useCreateRole } from '@/features/employees/hooks/use-role-mutations';
import { usePermissionModules } from '@/features/employees/hooks/use-roles';
import { buildCreateRolePayload, EMPTY_ROLE_VALUES } from '@/features/employees/lib/role-form';
import { createRoleSchema } from '@/features/employees/schemas/role-schema';

const ROLES_TAB_URL = '/home/roles-and-employees?tab=roles';

export function RoleAddPage() {
  const navigate = useNavigate();
  const { data: modules, isLoading } = usePermissionModules();
  const createRole = useCreateRole();

  async function handleSubmit(values, allPermissionNames) {
    try {
      await createRole.mutateAsync(buildCreateRolePayload(values, allPermissionNames));
      navigate(ROLES_TAB_URL);
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  if (isLoading) return <PageLoader />;

  return (
    <RoleForm
      title="إضافة دور"
      schema={createRoleSchema}
      defaultValues={EMPTY_ROLE_VALUES}
      modules={modules ?? []}
      isSaving={createRole.isPending}
      onSubmit={handleSubmit}
    />
  );
}
