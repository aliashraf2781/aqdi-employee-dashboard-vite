import { StatCardRow } from '@/shared/components/stat-card';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { AdAccountCards } from '@/features/marketing/components/pixels/ad-account-cards';
import { ManualSpendCard } from '@/features/marketing/components/pixels/manual-spend-card';
import { PixelInventoryCard } from '@/features/marketing/components/pixels/pixel-inventory-card';
import { TrackedEventsCard } from '@/features/marketing/components/pixels/tracked-events-card';
import { UtmBuilderCard } from '@/features/marketing/components/pixels/utm-builder-card';
import { useAdSpendSync } from '@/features/marketing/hooks/use-ad-spend-sync';
import { useUtmTemplate } from '@/features/marketing/hooks/use-marketing-integrations';
import { DASH } from '@/features/marketing/lib/format';

function buildAccountStats(utm) {
  const total = utm.accounts.length;
  const connected = utm.accounts.filter((account) => account.configured).length;

  return [
    { value: total ? `${connected} / ${total}` : DASH, label: 'حسابات إعلانية مربوطة', tone: 'success' },
    { value: String(utm.sources.length || DASH), label: 'مصادر UTM معتمدة', tone: 'primary' },
    { value: String(utm.clickIds.length || DASH), label: 'معرّفات نقر متتبَّعة', tone: 'success' },
  ];
}

export function PixelsTab() {
  const { can } = usePermissions();
  const canManage = can(PERMISSION_SECTIONS.analytics, 'create');
  const utm = useUtmTemplate();
  const { sync, isSyncing } = useAdSpendSync();

  return (
    <div>
      <StatCardRow items={buildAccountStats(utm)} className="md:grid-cols-3 xl:grid-cols-3" />
      <AdAccountCards utm={utm} canManage={canManage} isSyncing={isSyncing} onSync={sync} />
      {canManage && <ManualSpendCard />}
      <UtmBuilderCard utm={utm} />
      <PixelInventoryCard />
      <TrackedEventsCard />
    </div>
  );
}
