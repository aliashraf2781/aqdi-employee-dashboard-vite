import { Card } from '@/shared/components/card';
import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/page-loader';
import { ContentPageForm } from '@/features/settings/components/content-page-form';
import { SettingsPageHeader } from '@/features/settings/components/settings-page-header';
import { useContentPage } from '@/features/settings/hooks/use-content-page';

/** Full page (header + loading/error states + editor) for one static content page. */
export function ContentPageScreen({ title, subtitle, endpoint, queryKey }) {
  const { page, save } = useContentPage({ endpoint, queryKey });

  return (
    <div>
      <SettingsPageHeader title={title} description={subtitle} />
      <Card>
        {page.isLoading && <PageLoader />}
        {page.isError && <EmptyState message="تعذر تحميل المحتوى." />}
        {page.isSuccess && (
          <ContentPageForm
            // Remount when new content arrives so the editor starts from the saved text.
            key={page.data?.updated_at ?? 'content'}
            content={page.data}
            isSaving={save.isPending}
            onSave={save.mutate}
          />
        )}
      </Card>
    </div>
  );
}
