import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/shared/components/data-table';
import { Pagination } from '@/shared/components/pagination';
import { QueryState } from '@/shared/components/query-state';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';
import { SeverityBadge } from '@/features/marketing/components/shared/chips';
import { SectionCard } from '@/features/marketing/components/shared/section-card';
import { useSeoCrawlIssues } from '@/features/marketing/hooks/use-seo-crawl';
import { decodeUriText } from '@/features/marketing/lib/format';
import { websiteDetailsPath } from '@/features/marketing/lib/routes';
import { CRAWL_ISSUES_PER_PAGE, SEVERITY_LABELS } from '@/features/marketing/lib/seo-crawl';

const SEARCH_DEBOUNCE_MS = 400;
const SEVERITY_OPTIONS = Object.entries(SEVERITY_LABELS).map(([value, label]) => ({ value, label }));

function buildColumns({ categoryLabels, onOpen }) {
  return [
    { key: 'page', header: 'الصفحة', cell: (row) => <span dir="ltr">{decodeUriText(row.page)}</span> },
    { key: 'problem', header: 'المشكلة', cell: (row) => decodeUriText(row.problem_ar || row.problem || row.problem_en) },
    { key: 'type', header: 'النوع', cell: (row) => categoryLabels[row.type] || row.type },
    { key: 'severity', header: 'الخطورة', cell: (row) => <SeverityBadge severity={row.severity} /> },
    {
      key: 'actions',
      header: '',
      cell: (row) => (
        <Button variant="outline" size="sm" onClick={() => onOpen(row)}>
          عرض التفاصيل
        </Button>
      ),
    },
  ];
}

/** Filterable, paginated list of the issues found by the last crawl. */
export function CrawlIssuesCard({ enabled, emptyText, categoryLabels, type, onClearType }) {
  const navigate = useNavigate();
  const [severity, setSeverity] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

  // A different category means a different result set: start again from page 1.
  const [previousType, setPreviousType] = useState(type);
  if (type !== previousType) {
    setPreviousType(type);
    setPage(1);
  }

  const { data, isLoading, error, refetch } = useSeoCrawlIssues({
    type,
    severity: severity || null,
    search,
    page,
    perPage: CRAWL_ISSUES_PER_PAGE,
    enabled,
  });

  const openDetails = (row) => navigate(websiteDetailsPath({ page: row.page, issueId: row.id }));

  const filters = enabled && (
    <div className="flex flex-wrap items-center gap-2">
      {type && (
        <Button variant="outline" size="sm" onClick={onClearType}>
          {categoryLabels[type] || type} ×
        </Button>
      )}
      <SelectField
        value={severity}
        onChange={(event) => {
          setSeverity(event.target.value);
          setPage(1);
        }}
        options={SEVERITY_OPTIONS}
        placeholder="كل الخطورة"
        aria-label="الخطورة"
      />
      <TextField
        value={searchInput}
        onChange={(event) => {
          setSearchInput(event.target.value);
          setPage(1);
        }}
        placeholder="بحث عن صفحة..."
        aria-label="بحث"
      />
    </div>
  );

  return (
    <SectionCard title="قائمة المشاكل حسب الصفحة" action={filters} className="mt-4">
      {!enabled ? (
        <p className="text-sm text-muted-foreground">{emptyText}</p>
      ) : (
        <QueryState isLoading={isLoading} error={error} onRetry={refetch} errorFallback="تعذر تحميل قائمة المشاكل.">
          <DataTable columns={buildColumns({ categoryLabels, onOpen: openDetails })} rows={data?.items ?? []} emptyMessage="لا توجد مشاكل مطابقة." />
          <Pagination page={page} lastPage={data?.pagination?.last_page} onPageChange={setPage} />
        </QueryState>
      )}
    </SectionCard>
  );
}
