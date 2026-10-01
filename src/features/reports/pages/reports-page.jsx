import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { Badge } from '@/shared/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ReportExportMenu } from '../components/report-export-menu';
import { ReportFilterBar } from '../components/report-filter-bar';
import { ReportTabPanel } from '../components/report-tab-panels';
import { useReportFilterOptions } from '../hooks/use-report-filter-options';
import { useReportFilters } from '../hooks/use-report-filters';
import { resolveFilterValue } from '../lib/report-filters';
import { REPORT_TABS, resolveReportTab } from '../lib/report-tabs';

const TAB_PARAM = 'tab';

function formatLastUpdated(date) {
  return `${date.toLocaleDateString('en-GB')} ${date.toLocaleTimeString('en-GB', { hour12: false })}`;
}

export function ReportsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = resolveReportTab(searchParams.get(TAB_PARAM));
  const activeTabLabel = REPORT_TABS.find((tab) => tab.id === activeTab).label;

  const { filters: urlFilters, setFilter } = useReportFilters();
  const { contractTypeOptions, employeeOptions, isLoadingEmployees } = useReportFilterOptions();
  const printAreaRef = useRef(null);
  const [lastUpdated] = useState(() => formatLastUpdated(new Date()));

  // Stale URL values (a removed employee, a typo) fall back to "all" once the options are known.
  const filters = useMemo(
    () => ({
      ...urlFilters,
      contractType: resolveFilterValue(urlFilters.contractType, contractTypeOptions),
      employee: isLoadingEmployees ? urlFilters.employee : resolveFilterValue(urlFilters.employee, employeeOptions),
    }),
    [urlFilters, contractTypeOptions, employeeOptions, isLoadingEmployees],
  );

  const changeTab = (tabId) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set(TAB_PARAM, tabId);
        return next;
      },
      { replace: true },
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="التقارير"
        description={`آخر تحديث للبيانات: ${lastUpdated}`}
        actions={<ReportExportMenu getPanel={() => printAreaRef.current} reportName={activeTabLabel} />}
      />

      <Tabs value={activeTab} onValueChange={changeTab}>
        <TabsList>
          {REPORT_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.label}
              {tab.badge && <Badge tone="warning">{tab.badge}</Badge>}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-4">
          <ReportFilterBar
            filters={filters}
            onChange={setFilter}
            contractTypeOptions={contractTypeOptions}
            employeeOptions={employeeOptions}
            isLoadingEmployees={isLoadingEmployees}
          />
        </div>

        <div ref={printAreaRef}>
          <TabsContent value={activeTab}>
            <ReportTabPanel tabId={activeTab} filters={filters} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
