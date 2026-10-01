import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/page-loader';
import { usePermissions } from '@/features/permissions';
import { CategoryGrid } from '@/features/settings/components/category-grid';
import { SiteTogglesSection } from '@/features/settings/components/site-toggles-section';
import { useCategoryCounts } from '@/features/settings/hooks/use-category-counts';
import { useGeneralSettings, useToggleGeneralSetting } from '@/features/settings/hooks/use-general-settings';
import { SYSTEM_CATEGORIES } from '@/features/settings/lib/system-categories';

/** "General settings" tab: site toggles + a card for every settings page the user may open. */
export function GeneralSettingsTab() {
  const { can, isReady } = usePermissions();
  const { data: settings, isLoading, isError } = useGeneralSettings();
  const toggle = useToggleGeneralSetting();

  const visibleCategories = isReady ? SYSTEM_CATEGORIES.filter((category) => can(category.section, 'view')) : [];
  const counts = useCategoryCounts(visibleCategories.map((category) => category.id));

  if (isLoading) return <PageLoader />;
  if (isError) return <EmptyState message="تعذر تحميل الإعدادات العامة" />;

  return (
    <div className="flex flex-col gap-8">
      <SiteTogglesSection
        settings={settings}
        savingKey={toggle.isPending ? toggle.variables?.key : null}
        isBusy={toggle.isPending}
        onToggle={(key, enabled) => toggle.mutate({ key, enabled })}
      />
      <CategoryGrid categories={visibleCategories} counts={counts} />
    </div>
  );
}

