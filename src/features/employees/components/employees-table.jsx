import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { DataTable } from '@/shared/components/data-table';
import { Switch } from '@/shared/components/ui/switch';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { EmployeeAvatar } from '@/features/employees/components/employee-avatar';
import { RoleBadge } from '@/features/employees/components/role-badge';
import { WorkPeriodBadge } from '@/features/employees/components/work-period-badge';
import { formatSalary } from '@/features/employees/lib/employee-display';

const SECTION = PERMISSION_SECTIONS.employees;

function SalaryCell({ value }) {
  const salary = formatSalary(value);
  if (!salary) return <span className="text-xs text-muted-foreground">غير محدد</span>;
  return <span className="font-semibold tabular-nums">{salary} ريال</span>;
}

/** Employees list. Row actions appear only for the actions the user may perform. */
export function EmployeesTable({ employees, isLoading, onEdit, onDelete, onToggleStatus, isTogglingStatus }) {
  const { can, canAny } = usePermissions();
  const showActions = canAny(SECTION, ['view', 'edit', 'delete']);

  const columns = [
    {
      key: 'name',
      header: 'الاسم',
      cell: (employee) => (
        <div className="flex items-center gap-2.5">
          <EmployeeAvatar name={employee.name} image={employee.profile_image} />
          <span className="font-medium">{employee.name || '---'}</span>
        </div>
      ),
    },
    { key: 'role', header: 'المسمى الوظيفي', cell: (employee) => <RoleBadge role={employee.role} /> },
    { key: 'work_period', header: 'فترة العمل', cell: (employee) => <WorkPeriodBadge workPeriod={employee.work_period} /> },
    { key: 'base_salary', header: 'الراتب الأساسي', cell: (employee) => <SalaryCell value={employee.base_salary} /> },
    { key: 'phone', header: 'رقم الجوال', cell: (employee) => <span dir="ltr">{employee.phone || '---'}</span> },
    { key: 'email', header: 'البريد الإلكتروني', cell: (employee) => employee.email || '---' },
    {
      key: 'status',
      header: 'الحالة',
      cell: (employee) => (
        <Switch
          checked={Boolean(employee.is_active)}
          disabled={!can(SECTION, 'edit') || isTogglingStatus}
          onCheckedChange={() => onToggleStatus(employee.id)}
          aria-label="تغيير حالة الموظف"
        />
      ),
    },
  ];

  if (showActions) {
    columns.push({
      key: 'actions',
      header: 'الإجراءات',
      cell: (employee) => (
        <div className="flex flex-wrap items-center gap-2">
          {can(SECTION, 'view') && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/home/roles-and-employees/employees/${employee.id}`}>عرض</Link>
            </Button>
          )}
          {can(SECTION, 'edit') && (
            <Button variant="outline" size="sm" onClick={() => onEdit(employee)}>تعديل</Button>
          )}
          {can(SECTION, 'delete') && (
            <Button variant="outline" size="sm" className="text-danger" onClick={() => onDelete(employee)}>حذف</Button>
          )}
        </div>
      ),
    });
  }

  return <DataTable columns={columns} rows={employees} isLoading={isLoading} emptyMessage="لا يوجد موظفين حالياً." />;
}
