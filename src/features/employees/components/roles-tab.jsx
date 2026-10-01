import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/badge';
import { Button } from '@/shared/components/ui/button';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';
import { DataTable } from '@/shared/components/data-table';
import { Pagination } from '@/shared/components/pagination';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { RoleBadge } from '@/features/employees/components/role-badge';
import { useDeleteRole } from '@/features/employees/hooks/use-role-mutations';
import { useRoles } from '@/features/employees/hooks/use-roles';
import { formatShortDate } from '@/features/employees/lib/employee-display';

const SECTION = PERMISSION_SECTIONS.roles;
const NO_EMPLOYEES_LABEL = 'لا يوجد موظفون مسجلون';

function getRoleTitle(role) {
  return role.title_trans || role.title_ar || role.name;
}

function formatEmployeeNames(employees) {
  if (!employees?.length) return NO_EMPLOYEES_LABEL;
  return employees.map((employee) => employee.name).join('، ');
}

/** The "الأدوار" tab: roles list with add / edit / delete. */
export function RolesTab() {
  const { can, canAny } = usePermissions();
  const [page, setPage] = useState(1);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const { data, isLoading } = useRoles(page);
  const deleteRole = useDeleteRole();

  async function confirmDelete() {
    try {
      await deleteRole.mutateAsync({ id: roleToDelete.id });
      setRoleToDelete(null);
    } catch {
      // The mutation hook already showed the error toast.
    }
  }

  const columns = [
    { key: 'title', header: 'اللقب', cell: (role) => <RoleBadge role={getRoleTitle(role)} colorIndex={role.id} /> },
    { key: 'employees', header: 'الموظفون المشتركون', cell: (role) => formatEmployeeNames(role.employees) },
    {
      key: 'permissions',
      header: 'عدد الصلاحيات',
      cell: (role) => <Badge tone="success">{role.permissions_count || 0} صلاحية</Badge>,
    },
    {
      key: 'updated',
      header: 'تاريخ التحديث',
      cell: (role) => <span className="tabular-nums text-muted-foreground">{role.created_at_label || formatShortDate(role.updated_at)}</span>,
    },
  ];

  if (canAny(SECTION, ['edit', 'delete'])) {
    columns.push({
      key: 'actions',
      header: 'الإجراءات',
      cell: (role) => (
        <div className="flex items-center gap-2">
          {can(SECTION, 'edit') && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/home/roles-and-employees/roles/edit?id=${role.id}`}>تعديل</Link>
            </Button>
          )}
          {can(SECTION, 'delete') && (
            <Button variant="outline" size="sm" className="text-danger" onClick={() => setRoleToDelete(role)}>حذف</Button>
          )}
        </div>
      ),
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-foreground">إدارة الأدوار</h2>
        {can(SECTION, 'create') && (
          <Button asChild variant="outline">
            <Link to="/home/roles-and-employees/roles/add">+ إضافة دور جديد</Link>
          </Button>
        )}
      </div>

      <DataTable columns={columns} rows={data?.items} isLoading={isLoading} emptyMessage="لا يوجد أدوار مسجلة حالياً." />
      <Pagination page={page} lastPage={data?.pagination?.last_page} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(roleToDelete)}
        onOpenChange={(open) => !open && setRoleToDelete(null)}
        title="هل أنت متأكد من حذف الدور؟"
        description={`${roleToDelete ? getRoleTitle(roleToDelete) : ''} — هذا الإجراء لا يمكن التراجع عنه بعد الحذف! سيتم فقدان كافة الصلاحيات المرتبطة بهذا الدور.`}
        confirmLabel="تأكيـد الحـذف"
        destructive
        isLoading={deleteRole.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
