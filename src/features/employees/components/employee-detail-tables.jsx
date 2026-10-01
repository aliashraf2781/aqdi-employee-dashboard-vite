import { formatDate } from '@/shared/lib/format';
import { PagedTableSection } from '@/features/employees/components/paged-table-section';
import { formatNumber } from '@/features/employees/lib/employee-display';

export function EmployeeSalariesTable({ salaries }) {
  const columns = [
    { key: 'addition_date', header: 'تاريخ الإضافة', cell: (salary) => formatDate(salary.addition_date) },
    { key: 'due_date', header: 'تاريخ الاستحقاق', cell: (salary) => formatDate(salary.due_date) },
    { key: 'basic_salary', header: 'الراتب الأساسي', cell: (salary) => <span className="font-bold text-primary">{formatNumber(salary.basic_salary)}</span> },
    { key: 'deduction', header: 'الخصم', cell: (salary) => <span className="font-bold text-danger">{formatNumber(salary.deduction)}</span> },
    { key: 'bonus', header: 'المكافأة', cell: (salary) => <span className="font-bold text-success">{formatNumber(salary.bonus)}</span> },
    { key: 'total', header: 'المجموع', cell: (salary) => <span className="font-bold">{formatNumber(salary.total)}</span> },
  ];

  return <PagedTableSection title="سجل الرواتب والمكافآت" rows={salaries} columns={columns} emptyMessage="لا يوجد سجل رواتب للموظف حاليًا." />;
}

export function EmployeeNotesTable({ notes }) {
  const columns = [
    { key: 'addition_date', header: 'تاريخ الإضافة', className: 'whitespace-nowrap align-top', cell: (note) => formatDate(note.addition_date) },
    { key: 'note', header: 'الملاحظة', cell: (note) => <span className="leading-relaxed">{note.note}</span> },
  ];

  return <PagedTableSection title="ملاحظات" rows={notes} columns={columns} emptyMessage="لا يوجد ملاحظات للموظف حاليًا." />;
}
