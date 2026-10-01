import { lazy, Suspense, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageLoader } from '@/shared/components/page-loader';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { PillButtons } from '@/features/marketing/components/shared/pill-buttons';

const S = PERMISSION_SECTIONS;
const named = (importer, exportName) => lazy(() => importer().then((module) => ({ default: module[exportName] })));

/** The sub-views of the content tab, each gated by its own permission section and loaded on demand. */
const CONTENT_VIEWS = [
  { value: 'home', label: 'الصفحة الرئيسية', section: S.app_content, Panel: named(() => import('@/features/marketing/components/content/home-content-sections'), 'HomeContentSections') },
  { value: 'about', label: 'صفحة من نحن', section: S.app_content, Panel: named(() => import('@/features/marketing/components/content/about-content-sections'), 'AboutContentSections') },
  { value: 'images', label: 'صور الموقع (SEO)', section: S.website_images, Panel: named(() => import('@/features/marketing/components/website-images/website-images-section'), 'WebsiteImagesSection') },
  { value: 'articles', label: 'المقالات', section: S.blogs, Panel: named(() => import('@/features/marketing/components/articles/articles-view'), 'ArticlesView') },
  { value: 'services', label: 'صفحات الخدمات', section: S.analytics, Panel: named(() => import('@/features/marketing/components/services/service-pages-view'), 'ServicePagesView') },
  { value: 'faqs', label: 'الأسئلة الشائعة', section: S.faqs, Panel: named(() => import('@/features/marketing/components/faqs/faqs-content-view'), 'FaqsContentView') },
];

const VIEW_PARAM = 'view';

export function ContentTab() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { can, isReady } = usePermissions();

  const visibleViews = useMemo(() => (isReady ? CONTENT_VIEWS.filter((view) => can(view.section, 'view')) : []), [can, isReady]);
  const requested = searchParams.get(VIEW_PARAM);
  const current = visibleViews.find((view) => view.value === requested) ?? visibleViews[0];

  const selectView = (value) =>
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params);
        next.set(VIEW_PARAM, value);
        return next;
      },
      { replace: true },
    );

  return (
    <div className="flex flex-col gap-4">
      <PillButtons options={visibleViews} value={current?.value} onChange={selectView} label="إدارة المحتوى" />
      {current && (
        <Suspense fallback={<PageLoader />}>
          <current.Panel />
        </Suspense>
      )}
    </div>
  );
}
