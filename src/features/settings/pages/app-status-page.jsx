import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/page-loader';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { MobileStatusSection } from '@/features/settings/components/app-status/mobile-status-section';
import { PlatformVersionSection } from '@/features/settings/components/app-status/platform-version-section';
import { WebsiteStatusSection } from '@/features/settings/components/app-status/website-status-section';
import { SettingsPageHeader } from '@/features/settings/components/settings-page-header';
import { useAppStatus } from '@/features/settings/hooks/use-app-status';
import { PLATFORMS } from '@/features/settings/lib/app-status';

export function AppStatusPage() {
  const { can } = usePermissions();
  const { data: status, isLoading, isError } = useAppStatus();
  const canEdit = can(PERMISSION_SECTIONS.settings, 'edit');

  // Each section keeps its own form; the key re-creates it with fresh values after a save.
  return (
    <div>
      <SettingsPageHeader
        title="حالة التطبيق والإصدارات"
        description="تشغيل/إيقاف الموقع والتطبيق وإدارة إصدارات الجوال"
      />

      {isLoading && <PageLoader />}
      {isError && <EmptyState message="تعذر تحميل حالة التطبيق" />}

      {status && (
        <div className="flex flex-col gap-6">
          <WebsiteStatusSection key={JSON.stringify(status.website)} website={status.website} canEdit={canEdit} />
          <MobileStatusSection mobile={status.mobile} canEdit={canEdit} />
          {PLATFORMS.map((platform) => (
            <PlatformVersionSection
              key={`${platform.key}-${JSON.stringify(status[platform.key])}`}
              platform={platform.key}
              label={platform.label}
              values={status[platform.key]}
              canEdit={canEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
