import { PageLoader } from '@/shared/components/page-loader';
import { usePermissions } from '@/features/permissions';
import { PageSeoForm } from '@/features/marketing/components/content/page-seo-form';
import { useContentPage } from '@/features/marketing/hooks/use-content-page';
import { CONTENT_PAGE_ENDPOINTS } from '@/features/marketing/lib/content-pages';

/**
 * Loads and edits the page-level SEO of an index page (blogs / services / faqs).
 * Hidden without `{section}.view`; saving needs `{section}.edit`.
 */
export function ContentPageSeoPanel({ pageKey, pageLabel, permissionSection }) {
  const { can, isReady } = usePermissions();
  const canView = !permissionSection || can(permissionSection, 'view');
  const canEdit = !permissionSection || can(permissionSection, 'edit');
  const { data, isLoading, isError } = useContentPage(pageKey, { enabled: isReady && canView });

  if (!CONTENT_PAGE_ENDPOINTS[pageKey] || !canView) return null;
  if (!isReady || isLoading) return <PageLoader />;

  if (isError) {
    return (
      <div className="rounded-lg border border-danger bg-danger-soft p-4 text-sm font-bold text-danger">
        تعذر تحميل بيانات SEO لهذه الصفحة. تأكد أن الـ API يدعم <code dir="ltr">{CONTENT_PAGE_ENDPOINTS[pageKey]}</code>.
      </div>
    );
  }

  return <PageSeoForm pageKey={pageKey} pageLabel={pageLabel} responseData={data} canEdit={canEdit} />;
}
