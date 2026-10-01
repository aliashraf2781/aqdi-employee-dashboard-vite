import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { InstrumentTypesPanel } from '@/features/contract-settings/components/instrument-types/instrument-types-panel';
import { PaymentMessagesPanel } from '@/features/contract-settings/components/payment-messages/payment-messages-panel';
import { PopupContractsPanel } from '@/features/contract-settings/components/popup-contracts/popup-contracts-panel';
import { RecordSettingsPanel } from '@/features/contract-settings/components/record-settings-panel';
import {
  meterFeeSettingsConfig,
  smsSettingsConfig,
  taxFeeSettingsConfig,
} from '@/features/contract-settings/configs/record-settings-configs';
import { CONTRACT_SETTINGS_TABS } from '@/features/contract-settings/lib/contract-settings-tabs';

const PANELS = {
  'popup-contracts': () => <PopupContractsPanel />,
  'instrument-types': () => <InstrumentTypesPanel />,
  'sms-settings': () => <RecordSettingsPanel config={smsSettingsConfig} />,
  'meter-fees': () => <RecordSettingsPanel config={meterFeeSettingsConfig} />,
  'tax-fees': () => <RecordSettingsPanel config={taxFeeSettingsConfig} />,
  'payment-messages': () => <PaymentMessagesPanel />,
};

/**
 * The contract settings tabs, controlled by the caller (`activeTab` / `onTabChange`).
 * Only tabs the user may view are shown. `useShortLabels` picks the hub wording.
 */
export function ContractSettingsPanels({ activeTab, onTabChange, useShortLabels = false }) {
  const { can, isReady } = usePermissions();

  const visibleTabs = isReady
    ? CONTRACT_SETTINGS_TABS.filter((tab) => can(tab.section ?? PERMISSION_SECTIONS.settings, 'view'))
    : [];
  const currentTab = visibleTabs.some((tab) => tab.id === activeTab) ? activeTab : visibleTabs[0]?.id;

  return (
    <Tabs value={currentTab} onValueChange={onTabChange}>
      <TabsList>
        {visibleTabs.map(({ id, label, shortLabel, icon: Icon }) => (
          <TabsTrigger key={id} value={id} className="inline-flex items-center gap-2">
            <Icon className="size-4" />
            {useShortLabels ? shortLabel : label}
          </TabsTrigger>
        ))}
      </TabsList>

      {visibleTabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {PANELS[tab.id]()}
        </TabsContent>
      ))}
    </Tabs>
  );
}
