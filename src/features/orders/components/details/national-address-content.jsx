import { useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { getAvailableAddressTabs } from '../../lib/national-address-tabs';
import { ImageAddressPanel, MapAddressPanel, TextAddressPanel } from './national-address-panels';

const PANELS = { text: TextAddressPanel, map: MapAddressPanel, image: ImageAddressPanel };

/** National address of the property as text, map link or address card image, whichever the client provided. */
export function NationalAddressContent({ address }) {
  const tabs = useMemo(() => getAvailableAddressTabs(address), [address]);
  const [selectedTab, setSelectedTab] = useState(null);

  if (tabs.length === 0) return <p className="text-xs font-medium text-muted-foreground">لم يُدخل العنوان بعد</p>;

  // Fall back to the first tab when the chosen one has no data for this order.
  const activeTab = tabs.some((tab) => tab.id === selectedTab) ? selectedTab : tabs[0].id;

  return (
    <Tabs value={activeTab} onValueChange={setSelectedTab}>
      <TabsList aria-label="أنواع العنوان الوطني">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => {
        const Panel = PANELS[tab.id];
        return (
          <TabsContent key={tab.id} value={tab.id}>
            <Panel address={address} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
