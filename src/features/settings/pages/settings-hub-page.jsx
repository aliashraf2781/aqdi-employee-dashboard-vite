import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { ContractSettingsPanels, resolveContractTab } from '@/features/contract-settings';
import { GeneralSettingsTab } from '@/features/settings/components/general-settings-tab';

const PRIMARY_TABS = [
  { id: 'general', label: 'الإعدادات العامة' },
  { id: 'contracts', label: 'إعدادات العقود' },
];
const DEFAULT_TAB = 'general';

/** /home/settings — `?tab=general|contracts`, and `?sub=` picks the contract settings panel. */
export function SettingsHubPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab = PRIMARY_TABS.some((tab) => tab.id === tabParam) ? tabParam : DEFAULT_TAB;
  const contractTab = resolveContractTab(searchParams.get('sub'));

  const changeTab = (tab) => setSearchParams(tab === 'contracts' ? { tab, sub: contractTab } : { tab }, { replace: true });
  const changeContractTab = (sub) => setSearchParams({ tab: 'contracts', sub }, { replace: true });

  return (
    <div>
      <PageHeader title="إعدادات النظام" description="الموقع والتطبيق · الفئات · إعدادات العقود" />

      <Tabs value={activeTab} onValueChange={changeTab}>
        <TabsList>
          {PRIMARY_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general">
          <GeneralSettingsTab />
        </TabsContent>
        <TabsContent value="contracts">
          <ContractSettingsPanels activeTab={contractTab} onTabChange={changeContractTab} useShortLabels />
        </TabsContent>
      </Tabs>
    </div>
  );
}
