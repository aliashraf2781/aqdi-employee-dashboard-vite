import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { SeverityBadge } from '@/features/marketing/components/shared/chips';
import { useSeoCrawlIssueDetails } from '@/features/marketing/hooks/use-seo-crawl';
import { decodeUriText } from '@/features/marketing/lib/format';

function IssueExtraDetails({ issueId }) {
  const { data, isLoading } = useSeoCrawlIssueDetails(issueId);
  const extra = data?.details && typeof data.details === 'object' ? Object.entries(data.details) : [];

  if (isLoading) return <p className="py-2 text-sm text-muted-foreground">جارٍ التحميل...</p>;
  if (extra.length === 0) return <p className="py-2 text-sm text-muted-foreground">لا توجد تفاصيل إضافية لهذه المشكلة.</p>;

  return (
    <dl className="divide-y divide-border rounded-lg border border-border">
      {extra.map(([key, value]) => (
        <div key={key} className="flex items-center justify-between gap-3 px-3 py-2">
          <dt className="text-xs text-muted-foreground">{key}</dt>
          <dd className="break-all text-sm font-medium text-foreground">
            {typeof value === 'object' ? JSON.stringify(value) : decodeUriText(String(value))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** One issue of a page. Its extra details are fetched only when the row is expanded. */
export function PageIssueItem({ issue, expanded, onToggle }) {
  return (
    <li className="py-2">
      <button type="button" onClick={onToggle} aria-expanded={expanded} className="flex w-full items-center gap-3 text-start">
        <span className="flex-1 text-sm text-foreground">{decodeUriText(issue.problem_ar || issue.problem || issue.problem_en)}</span>
        <span className="text-xs text-muted-foreground">{issue.type}</span>
        <SeverityBadge severity={issue.severity} />
        <ChevronDown className={cn('size-4 transition-transform', expanded && 'rotate-180')} />
      </button>
      {expanded && (
        <div className="mt-2">
          <IssueExtraDetails issueId={issue.id} />
        </div>
      )}
    </li>
  );
}
