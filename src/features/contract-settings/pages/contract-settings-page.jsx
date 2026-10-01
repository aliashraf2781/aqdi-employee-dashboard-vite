import { useState } from 'react';
import { PageHeader } from '@/shared/components/page-header';
import { ContractSettingsPanels } from '@/features/contract-settings/components/contract-settings-panels';
import { DEFAULT_CONTRACT_TAB } from '@/features/contract-settings/lib/contract-settings-tabs';

export function ContractSettingsPage() {
  const [activeTab, setActiveTab] = useState(DEFAULT_CONTRACT_TAB);

  return (
    <div>
      <PageHeader title="إعدادات العقود" />
      <ContractSettingsPanels activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
