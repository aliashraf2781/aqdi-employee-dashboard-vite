import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QueryState } from '@/shared/components/query-state';
import { StatCardRow } from '@/shared/components/stat-card';
import { Button } from '@/shared/components/ui/button';
import { SelectField } from '@/shared/components/ui/select-field';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { ArticlesTable } from '@/features/marketing/components/articles/articles-table';
import { EditorialQueue } from '@/features/marketing/components/articles/editorial-queue';
import { ContentPageSeoPanel } from '@/features/marketing/components/content/content-page-seo-panel';
import { PeriodFilterBar } from '@/features/marketing/components/shared/period-filter-bar';
import { PillButtons } from '@/features/marketing/components/shared/pill-buttons';
import { useMarketingArticles } from '@/features/marketing/hooks/use-marketing-articles';
import { formatInt, formatMoney } from '@/features/marketing/lib/format';

const SECTION = PERMISSION_SECTIONS.blogs;
const CREATE_ARTICLE_PATH = '/home/settings/blogs/create';
const ALL_CATEGORIES = { value: 'all', label: 'الكل' };
const STATUS_OPTIONS = [
  { value: 'published', label: 'منشور' },
  { value: 'scheduled', label: 'مجدول' },
  { value: 'draft', label: 'مسودة' },
  { value: 'archived', label: 'مؤرشف' },
];

function buildSummaryCards(summary, currency) {
  return [
    { value: formatInt(summary?.total ?? 0), label: 'إجمالي المقالات', tone: 'primary' },
    { value: formatInt(summary?.published ?? 0), label: 'منشورة', tone: 'success' },
    { value: formatInt(summary?.scheduled ?? 0), label: 'مجدولة', tone: 'warning' },
    { value: formatInt(summary?.archived ?? 0), label: 'مؤرشفة' },
    { value: formatInt(summary?.views ?? 0), label: 'مشاهدات' },
    { value: formatMoney(summary?.attributed_revenue ?? 0, currency), label: 'إيراد مُسنَد', tone: 'success' },
  ];
}

/** Articles tab of the content area: blogs page SEO, counters, filters, list and editorial queue. */
export function ArticlesView() {
  const { can } = usePermissions();
  const [category, setCategory] = useState(ALL_CATEGORIES.value);
  const [status, setStatus] = useState('');
  const articles = useMarketingArticles({ category, status });

  const categoryOptions = articles.categories.length
    ? articles.categories.map((item) => ({ value: item.key, label: item.label_ar }))
    : [ALL_CATEGORIES];

  return (
    <div className="flex flex-col gap-4">
      <ContentPageSeoPanel pageKey="blogs" pageLabel="صفحة قائمة المقالات" permissionSection={SECTION} />

      <div>
        <PeriodFilterBar periods={articles.periods} />
        <StatCardRow items={buildSummaryCards(articles.summary, articles.currencyLabel)} />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <PillButtons options={categoryOptions} value={category} onChange={setCategory} label="التصنيف" />
        <div className="flex items-end gap-2">
          <SelectField value={status} onChange={(event) => setStatus(event.target.value)} options={STATUS_OPTIONS} placeholder="كل الحالات" aria-label="الحالة" />
          {can(SECTION, 'create') && (
            <Button asChild>
              <Link to={CREATE_ARTICLE_PATH}>
                <Plus className="size-4" />
                مقال جديد
              </Link>
            </Button>
          )}
        </div>
      </div>

      <QueryState
        isLoading={articles.isLoading}
        error={articles.error}
        isEmpty={articles.items.length === 0}
        emptyMessage="لا توجد مقالات مطابقة."
        onRetry={articles.refetch}
        errorFallback="تعذّر تحميل بيانات التسويق."
      >
        <ArticlesTable items={articles.items} currency={articles.currencyLabel} canEdit={can(SECTION, 'edit')} />
      </QueryState>

      <EditorialQueue items={articles.editorialQueue} />
    </div>
  );
}
