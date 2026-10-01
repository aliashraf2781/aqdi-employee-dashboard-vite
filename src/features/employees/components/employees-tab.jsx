import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Pagination } from '@/shared/components/pagination';
import { TextField } from '@/shared/components/ui/text-field';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { DeleteEmployeeDialog } from '@/features/employees/components/delete-employee-dialog';
import { EmployeeFormDialog } from '@/features/employees/components/employee-form-dialog';
import { EmployeesTable } from '@/features/employees/components/employees-table';
import { useToggleEmployeeStatus } from '@/features/employees/hooks/use-employee-mutations';
import { useEmployees } from '@/features/employees/hooks/use-employees';

/** The "الموظفون" tab: search, paged table, add/edit/delete dialogs. */
export function EmployeesTab() {
  const { can } = usePermissions();
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [formState, setFormState] = useState({ open: false, employee: null });
  const [employeeToDelete, setEmployeeToDelete] = useState(null);

  const search = useDebouncedValue(searchText);
  const { data, isLoading, isError, error, refetch } = useEmployees({ page, search });
  const toggleStatus = useToggleEmployeeStatus();

  function handleSearchChange(event) {
    setSearchText(event.target.value);
    setPage(1);
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-muted-foreground">{error?.response?.data?.message || error?.message || 'تعذر تحميل الموظفين'}</p>
        <Button size="sm" onClick={() => refetch()}>إعادة المحاولة</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end gap-3">
        {can(PERMISSION_SECTIONS.employees, 'create') && (
          <Button variant="outline" onClick={() => setFormState({ open: true, employee: null })}>
            + إضافة موظف
          </Button>
        )}
        <div className="relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <TextField
            className="ps-10"
            placeholder="بحث بالاسم أو البريد أو الجوال..."
            value={searchText}
            onChange={handleSearchChange}
            aria-label="بحث"
          />
        </div>
      </div>

      <EmployeesTable
        employees={data?.items}
        isLoading={isLoading}
        onEdit={(employee) => setFormState({ open: true, employee })}
        onDelete={setEmployeeToDelete}
        onToggleStatus={toggleStatus.mutate}
        isTogglingStatus={toggleStatus.isPending}
      />
      <Pagination page={page} lastPage={data?.pagination?.last_page} onPageChange={setPage} />

      <EmployeeFormDialog
        open={formState.open}
        onOpenChange={(open) => setFormState((previous) => ({ ...previous, open }))}
        employee={formState.employee}
      />
      <DeleteEmployeeDialog
        open={Boolean(employeeToDelete)}
        onOpenChange={(open) => !open && setEmployeeToDelete(null)}
        employee={employeeToDelete}
      />
    </div>
  );
}
