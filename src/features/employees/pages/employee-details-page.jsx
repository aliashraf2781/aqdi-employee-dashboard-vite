import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { PageHeader } from '@/shared/components/page-header';
import { PageLoader } from '@/shared/components/page-loader';
import { EmployeeActions } from '@/features/employees/components/employee-actions';
import { EmployeeContractsTable } from '@/features/employees/components/employee-contracts-table';
import { EmployeeNotesTable, EmployeeSalariesTable } from '@/features/employees/components/employee-detail-tables';
import { EmployeeSummary } from '@/features/employees/components/employee-summary';
import { useEmployee } from '@/features/employees/hooks/use-employees';

const EMPLOYEES_TAB_URL = '/home/roles-and-employees?tab=employees';
const PROFILE_VIEW = 'profile';

/**
 * Employee page. With `?view=profile` it is the signed-in user's read-only profile:
 * no actions and no salary / note / contract history.
 */
export function EmployeeDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isProfileView = useSearchParams()[0].get('view') === PROFILE_VIEW;
  const { data: employee, isLoading } = useEmployee(id);

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <PageHeader
        title={isProfileView ? 'الملف الشخصي' : employee?.name || 'الموظفون'}
        description={isProfileView ? undefined : 'تفاصيل الموظف'}
        actions={
          !isProfileView && (
            <Link to={EMPLOYEES_TAB_URL} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
              <ChevronRight className="size-4" />
              الموظفون والأدوار
            </Link>
          )
        }
      />

      {!isProfileView && employee && <EmployeeActions employee={employee} onDeleted={() => navigate(EMPLOYEES_TAB_URL)} />}
      <div className={isProfileView ? '' : 'mt-4'}>
        <EmployeeSummary employee={employee} />
      </div>

      {!isProfileView && (
        <>
          <EmployeeSalariesTable salaries={employee?.salaries} />
          <EmployeeNotesTable notes={employee?.notes} />
          <EmployeeContractsTable receivedContracts={employee?.received_contracts} refundableContracts={employee?.refundable_contracts} />
        </>
      )}
    </div>
  );
}
