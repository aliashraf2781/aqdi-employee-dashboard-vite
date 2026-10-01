import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/page-loader';
import { PanelHeader } from '@/features/contract-settings/components/panel-header';
import { RecordSettingsForm } from '@/features/contract-settings/components/record-settings-form';
import { useSettingsRecord } from '@/features/contract-settings/hooks/use-record-settings';

/** Header + loading/error states + form for one record-settings config. */
export function RecordSettingsPanel({ config }) {
  const { data: record, isLoading, isError } = useSettingsRecord(config);

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title={config.title} description={config.description} />
      {isLoading && <PageLoader />}
      {isError && <EmptyState message={config.messages.loadFailed} />}
      {/* Remount when the saved record changes so the fields show what the server holds. */}
      {!isLoading && !isError && <RecordSettingsForm key={JSON.stringify(record)} config={config} record={record} />}
    </div>
  );
}
