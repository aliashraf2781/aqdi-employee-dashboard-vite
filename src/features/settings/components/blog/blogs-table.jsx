import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/badge';
import { DataTable } from '@/shared/components/data-table';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/lib/format';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { BLOG_STATUS, isBlogActive } from '@/features/settings/lib/blog';
import { stripHtml } from '@/shared/lib/html';

/** List of blog posts with view/edit links (edit needs `blogs.edit`). */
export function BlogsTable({ blogs, isLoading }) {
  const { can } = usePermissions();
  const canEdit = can(PERMISSION_SECTIONS.blogs, 'edit');

  const columns = [
    {
      key: 'title',
      header: 'العنوان',
      cell: (blog) => (
        <div>
          <p className="font-bold">{blog.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{blog.slug}</p>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'الوصف',
      cell: (blog) => <p className="line-clamp-2 max-w-xs text-muted-foreground">{stripHtml(blog.description) || '—'}</p>,
    },
    {
      key: 'status',
      header: 'الحالة',
      cell: (blog) => <Badge tone={BLOG_STATUS[blog.status]?.tone}>{BLOG_STATUS[blog.status]?.label || blog.status || '—'}</Badge>,
    },
    { key: 'publishedAt', header: 'تاريخ النشر', cell: (blog) => formatDate(blog.timePublish) },
    {
      key: 'active',
      header: 'نشط',
      cell: (blog) => <Badge tone={isBlogActive(blog) ? 'success' : 'neutral'}>{isBlogActive(blog) ? 'نشط' : 'غير نشط'}</Badge>,
    },
    {
      key: 'actions',
      header: 'الإجراءات',
      cell: (blog) => (
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/home/settings/blogs/${blog.id}`}>عرض</Link>
          </Button>
          {canEdit && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/home/settings/blogs/${blog.id}/edit`}>تعديل</Link>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} rows={blogs} isLoading={isLoading} />;
}
