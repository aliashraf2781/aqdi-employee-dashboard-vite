import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { DataTable } from '@/shared/components/data-table';
import { Pagination } from '@/shared/components/pagination';
import { EmployeeAvatar } from '@/features/employees/components/employee-avatar';
import { RoleBadge } from '@/features/employees/components/role-badge';
import { useEmployees } from '@/features/employees/hooks/use-employees';
import { formatSalary, formatShortDate } from '@/features/employees/lib/employee-display';

function SalaryAmount({ value, emptyLabel }) {
  const amount = formatSalary(value);
  if (!amount) return <span className="text-muted-foreground">{emptyLabel}</span>;
  return <span className="font-semibold tabular-nums">{amount} ريال</span>;
}

const COLUMNS = [
  {
    key: 'name',
    header: 'الاسم',
    cell: (employee) => (
      <Link to={`/home/roles-and-employees/employees/${employee.id}`} className="flex items-center gap-2.5 hover:text-primary">
        <EmployeeAvatar name={employee.name} image={employee.profile_image} />
        <span className="font-medium">{employee.name || '---'}</span>
      </Link>
    ),
  },
  { key: 'role', header: 'المسمى الوظيفي', cell: (employee) => <RoleBadge role={employee.role} /> },
  { key: 'base_salary', header: 'الراتب الأساسي', cell: (employee) => <SalaryAmount value={employee.base_salary} emptyLabel="—" /> },
  {
    key: 'last_payment',
    header: 'آخر دفعة',
    cell: (employee) => {
      const lastPayment = employee.last_salary_date || employee.last_payment_date;
      return <span className="tabular-nums text-muted-foreground">{lastPayment ? formatShortDate(lastPayment) : '—'}</span>;
    },
  },
  {
    key: 'total_paid',
    header: 'إجمالي المدفوع',
    cell: (employee) => <SalaryAmount value={employee.total_paid ?? employee.total_salaries_paid ?? 0} emptyLabel="0 ريال" />,
  },
  {
    key: 'open',
    header: '',
    cell: (employee) => (
      <Link to={`/home/roles-and-employees/employees/${employee.id}`} aria-label="عرض سجل الرواتب" className="text-muted-foreground hover:text-primary">
        <ChevronLeft className="size-4" />
      </Link>
    ),
  },
];

/** The "رواتب الموظفين" tab: one row per employee, click through to the salary history. */
export function SalariesTab() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useEmployees({ page, search: '' });

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm font-medium text-primary">رواتب الموظفين — انقر موظفًا لعرض سجل رواتبه</p>
      <DataTable columns={COLUMNS} rows={data?.items} isLoading={isLoading} emptyMessage="لا يوجد موظفون حالياً." />
      <Pagination page={page} lastPage={data?.pagination?.last_page} onPageChange={setPage} />
    </div>
  );
}
