import { Search } from 'lucide-react';
import { useState } from 'react';
import { EmptyState } from '@/shared/components/empty-state';
import { QueryState } from '@/shared/components/query-state';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { PageSeoForm } from '@/features/marketing/components/content/page-seo-form';
import { SectionForm } from '@/features/marketing/components/content/section-form';
import { useContentPage } from '@/features/marketing/hooks/use-content-page';
import { extractContentSections } from '@/features/marketing/lib/content-pages';

const SEO_TAB = 'seo';

/**
 * Editor of one public page (home or about): an SEO tab plus one tab per section.
 * `page` comes from schemas/home-sections.js or schemas/about-sections.js.
 */
export function ContentPageSections({ page }) {
  const [activeTab, setActiveTab] = useState(SEO_TAB);
  const { can } = usePermissions();
  const canEditSeo = can(PERMISSION_SECTIONS.app_content, 'edit');
  const { data, isLoading, isError, refetch } = useContentPage(page.pageKey);

  if (isError) {
    return <EmptyState message="تعذر تحميل محتوى الصفحة. يرجى إعادة المحاولة لاحقًا." />;
  }

  const sections = extractContentSections(data);

  return (
    <QueryState isLoading={isLoading} onRetry={refetch}>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value={SEO_TAB} className="gap-2">
            <Search className="size-4" />
            SEO
          </TabsTrigger>
          {page.tabs.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              <Icon className="size-4" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={SEO_TAB}>
          <PageSeoForm pageKey={page.pageKey} pageLabel={page.seoLabel} responseData={data} canEdit={canEditSeo} />
        </TabsContent>

        {page.tabs.map(({ value, section }) => (
          <TabsContent key={value} value={value}>
            <SectionForm config={section} pageKey={page.pageKey} initialData={sections[section.key]} />
          </TabsContent>
        ))}
      </Tabs>
    </QueryState>
  );
}
