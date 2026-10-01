import { ArrowRight, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/shared/components/badge';
import { RichContent } from '@/shared/components/rich-content';
import { Button } from '@/shared/components/ui/button';
import { formatDate } from '@/shared/lib/format';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { BLOG_STATUS, isBlogActive } from '@/features/settings/lib/blog';

function InfoBox({ label, children, className }) {
  return (
    <div className={`rounded-lg border border-border bg-surface-muted p-4 ${className ?? ''}`}>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <div className="text-sm font-medium text-foreground">{children}</div>
    </div>
  );
}

/** Read-only view of one blog post. */
export function BlogDetails({ blog }) {
  const { can } = usePermissions();
  const status = BLOG_STATUS[blog.status];
  const metaTitle = blog.meta_title || blog.metaTitle;
  const metaDescription = blog.meta_description || blog.metaDescription;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={status?.tone}>{status?.label || blog.status || '---'}</Badge>
            <Badge tone={isBlogActive(blog) ? 'success' : 'neutral'}>{isBlogActive(blog) ? 'نشط' : 'غير نشط'}</Badge>
          </div>
          <h2 className="text-2xl font-black text-foreground">{blog.title}</h2>
          {blog.slug && (
            <p dir="ltr" className="text-sm text-muted-foreground">
              {blog.slug}
            </p>
          )}
        </div>

        {can(PERMISSION_SECTIONS.blogs, 'edit') && (
          <Button asChild>
            <Link to={`/home/settings/blogs/${blog.id}/edit`}>
              <Pencil className="size-4" />
              تعديل المقال
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <InfoBox label="تاريخ النشر">{formatDate(blog.publish_at || blog.timePublish)}</InfoBox>
        {metaTitle && <InfoBox label="عنوان SEO" className="md:col-span-2">{metaTitle}</InfoBox>}
      </div>
      {metaDescription && <InfoBox label="وصف SEO">{metaDescription}</InfoBox>}

      {blog.image && <img src={blog.image} alt={blog.title} className="max-h-96 w-full rounded-card border border-border object-cover" />}

      <section className="rounded-card border border-border bg-surface p-6">
        <p className="mb-4 text-sm font-bold text-foreground">محتوى المقال</p>
        <RichContent html={blog.description} />
      </section>

      <Button asChild variant="outline" className="w-fit">
        <Link to="/home/settings/blogs">
          <ArrowRight className="size-4" />
          العودة للمدونة
        </Link>
      </Button>
    </div>
  );
}
