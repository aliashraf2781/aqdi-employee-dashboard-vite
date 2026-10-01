import { lazy, Suspense, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/shared/components/page-header';
import { PageLoader } from '@/shared/components/page-loader';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { MarketingPeriodProvider } from '@/features/marketing/hooks/use-marketing-period';

const S = PERMISSION_SECTIONS;
const named = (importer, exportName) => lazy(() => importer().then((module) => ({ default: module[exportName] })));

/**
 * The tabs of /home/marketing-and-content. `section` may be one permission section or an
 * "any of" list; a tab is shown when the user may view at least one of them.
 */
const MARKETING_TABS = [
  { value: 'overview', label: 'نظرة عامة', section: S.analytics, Panel: named(() => import('@/features/marketing/components/tracking/overview-tab'), 'OverviewTab') },
  { value: 'campaigns', label: 'الحملات', section: S.analytics, Panel: named(() => import('@/features/marketing/components/tracking/campaigns-tab'), 'CampaignsTab') },
  { value: 'seo', label: 'SEO', section: S.seo_crawl, Panel: named(() => import('@/features/marketing/components/seo/seo-tab'), 'SeoTab') },
  {
    value: 'content',
    label: 'إدارة المحتوى',
    section: [S.analytics, S.blogs, S.app_content, S.website_images, S.faqs],
    Panel: named(() => import('@/features/marketing/components/content/content-tab'), 'ContentTab'),
  },
  { value: 'reports', label: 'التقارير', section: S.analytics, Panel: named(() => import('@/features/marketing/components/tracking/reports-tab'), 'ReportsTab') },
  { value: 'pixels', label: 'الربط والبكسلات', section: S.analytics, Panel: named(() => import('@/features/marketing/components/pixels/pixels-tab'), 'PixelsTab') },
];

const TAB_PARAM = 'tab';

export function MarketingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { can, isReady } = usePermissions();

  const visibleTabs = useMemo(() => (isReady ? MARKETING_TABS.filter((tab) => can(tab.section, 'view')) : []), [can, isReady]);
  const requested = searchParams.get(TAB_PARAM);
  const current = visibleTabs.find((tab) => tab.value === requested) ?? visibleTabs[0];

  const selectTab = (value) =>
    setSearchParams(
      (params) => {
        const next = new URLSearchParams(params);
        next.set(TAB_PARAM, value);
        return next;
      },
      { replace: true },
    );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="التسويق والمحتوى" description="ROI · الحملات · SEO · المحتوى · التقارير · البكسلات" />

      <Tabs value={current?.value} onValueChange={selectTab}>
        <TabsList>
          {visibleTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {current && (
        <MarketingPeriodProvider>
          <Suspense fallback={<PageLoader />}>
            <current.Panel />
          </Suspense>
        </MarketingPeriodProvider>
      )}
    </div>
  );
}
