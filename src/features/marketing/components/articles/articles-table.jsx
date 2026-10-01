import { Link } from 'react-router-dom';
import { DataTable } from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { PublishStatusBadge } from '@/features/marketing/components/shared/chips';
import { formatInt, formatMoney } from '@/features/marketing/lib/format';

const DASH = '—';

const articleEditPath = (id) => `/home/settings/blogs/${id}/edit`;

function buildColumns({ currency, canEdit }) {
  const columns = [
    { key: 'title', header: 'العنوان', cell: (row) => <b>{row.title}</b> },
    { key: 'meta', header: 'عنوان الميتا', className: 'max-w-40 truncate', cell: (row) => row.meta_title || DASH },
    { key: 'category', header: 'التصنيف', cell: (row) => row.category_label_ar || DASH },
    { key: 'author', header: 'الكاتب', cell: (row) => row.author || DASH },
    { key: 'status', header: 'الحالة', cell: (row) => <PublishStatusBadge status={row.status_label_ar || row.status} /> },
    { key: 'date', header: 'التاريخ', cell: (row) => row.published_at || row.scheduled_at || DASH },
    { key: 'words', header: 'كلمات', cell: (row) => formatInt(row.words) },
    { key: 'views', header: 'مشاهدات', cell: (row) => formatInt(row.views) },
    { key: 'leads', header: 'Leads', cell: (row) => formatInt(row.leads) },
    { key: 'revenue', header: 'إيراد', cell: (row) => formatMoney(row.attributed_revenue, currency) },
  ];

  if (canEdit) {
    columns.push({
      key: 'actions',
      header: '',
      cell: (row) => (
        <Button asChild variant="outline" size="sm">
          <Link to={articleEditPath(row.id)}>تحرير</Link>
        </Button>
      ),
    });
  }
  return columns;
}

export function ArticlesTable({ items, currency, canEdit }) {
  return <DataTable columns={buildColumns({ currency, canEdit })} rows={items} emptyMessage="لا توجد مقالات مطابقة." />;
}
