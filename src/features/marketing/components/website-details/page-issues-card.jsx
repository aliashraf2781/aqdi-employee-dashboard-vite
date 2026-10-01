import { useState } from 'react';
import { Pagination } from '@/shared/components/pagination';
import { QueryState } from '@/shared/components/query-state';
import { PageIssueItem } from '@/features/marketing/components/website-details/page-issue-item';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { useSeoCrawlIssues } from '@/features/marketing/hooks/use-seo-crawl';
import { CRAWL_ISSUES_PER_PAGE } from '@/features/marketing/lib/seo-crawl';

/** All issues the crawl found on one page path (paginated). */
export function PageIssuesCard({ pagePath }) {
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState(null);
  const { data, isLoading, error, refetch } = useSeoCrawlIssues({
    search: pagePath,
    page,
    perPage: CRAWL_ISSUES_PER_PAGE,
    enabled: Boolean(pagePath),
  });
  const issues = data?.items ?? [];

  return (
    <SectionCard title="قائمة المشاكل">
      {!pagePath ? (
        <p className="text-sm text-muted-foreground">لم يتم تحديد صفحة لعرض مشاكلها.</p>
      ) : (
        <QueryState
          isLoading={isLoading}
          error={error}
          isEmpty={issues.length === 0}
          emptyMessage="لا توجد مشاكل مسجلة لهذه الصفحة."
          onRetry={refetch}
          errorFallback="تعذر تحميل قائمة المشاكل."
        >
          <ul className="divide-y divide-border">
            {issues.map((issue) => (
              <PageIssueItem
                key={issue.id}
                issue={issue}
                expanded={expandedId === issue.id}
                onToggle={() => setExpandedId((current) => (current === issue.id ? null : issue.id))}
              />
            ))}
          </ul>
          <Pagination page={page} lastPage={data?.pagination?.last_page} onPageChange={setPage} />
        </QueryState>
      )}
    </SectionCard>
  );
}
