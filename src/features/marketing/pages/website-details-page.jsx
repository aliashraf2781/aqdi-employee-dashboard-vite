import { ChevronRight, ExternalLink } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { PageHeader } from '@/shared/components/page-header';
import { PageIssuesCard } from '@/features/marketing/components/website-details/page-issues-card';
import { PageInfoCard } from '@/features/marketing/components/website-details/page-info-card';
import { useSeoCrawlIssueDetails } from '@/features/marketing/hooks/use-seo-crawl';
import { decodeUriText } from '@/features/marketing/lib/format';
import { marketingTabPath } from '@/features/marketing/lib/routes';

/** SEO problems found on one crawled url (opened from the crawl issues list). */
export function WebsiteDetailsPage() {
  const [searchParams] = useSearchParams();
  const pagePath = searchParams.get('page') || '';
  const issueId = searchParams.get('issueId');
  const { data: seed, isLoading } = useSeoCrawlIssueDetails(issueId, { enabled: Boolean(issueId) });
  const pageMeta = seed?.page_details;

  return (
    <div className="flex flex-col gap-4">
      <Link to={marketingTabPath('seo')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary">
        <ChevronRight className="size-4" />
        رجوع
      </Link>

      <PageHeader
        title={<span dir="ltr">{decodeUriText(pagePath) || 'تفاصيل الصفحة'}</span>}
        description="مشاكل السيو المكتشفة لهذه الصفحة"
        actions={
          pageMeta?.url && (
            <Button asChild variant="outline" size="sm">
              <a href={pageMeta.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-3.5" />
                فتح الصفحة
              </a>
            </Button>
          )
        }
      />

      <PageInfoCard pageMeta={pageMeta} isLoading={isLoading} />
      <PageIssuesCard pagePath={pagePath} />
    </div>
  );
}
