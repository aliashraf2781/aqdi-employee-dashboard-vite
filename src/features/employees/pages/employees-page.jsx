import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { EmployeesTab } from '@/features/employees/components/employees-tab';
import { KpiBoardTab } from '@/features/employees/components/kpi-board-tab';
import { RolesTab } from '@/features/employees/components/roles-tab';
import { SalariesTab } from '@/features/employees/components/salaries-tab';

const TABS = [
  { value: 'roles', label: 'الأدوار', section: PERMISSION_SECTIONS.roles, Component: RolesTab },
  { value: 'employees', label: 'الموظفون', section: PERMISSION_SECTIONS.employees, Component: EmployeesTab },
  { value: 'salaries', label: 'رواتب الموظفين', section: PERMISSION_SECTIONS.employee_salaries, Component: SalariesTab },
  { value: 'performance', label: 'مؤشرات الموظفين', section: PERMISSION_SECTIONS.employee_kpis, Component: KpiBoardTab },
];

/** /home/roles-and-employees: one tab per section the user may view (`?tab=`). */
export function EmployeesPage() {
  const { can, isReady } = usePermissions();
  const [searchParams, setSearchParams] = useSearchParams();

  const visibleTabs = useMemo(() => (isReady ? TABS.filter((tab) => can(tab.section, 'view')) : []), [can, isReady]);
  const requestedTab = searchParams.get('tab');
  const activeTab = visibleTabs.some((tab) => tab.value === requestedTab) ? requestedTab : visibleTabs[0]?.value;

  function handleTabChange(value) {
    const next = new URLSearchParams(searchParams);
    next.set('tab', value);
    setSearchParams(next, { replace: true });
  }

  return (
    <div>
      <PageHeader title="الموظفون والأدوار" description="الأدوار والصلاحيات · الموظفون · الرواتب" />
      {visibleTabs.length > 0 && (
        <Tabs value={activeTab} onValueChange={handleTabChange}>
          <TabsList>
            {visibleTabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          {visibleTabs.map(({ value, Component }) => (
            <TabsContent key={value} value={value}>
              <Component />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
