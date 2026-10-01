import { Card } from '@/shared/components/card';
import { EmptyState } from '@/shared/components/empty-state';
import { PageLoader } from '@/shared/components/page-loader';
import { SettingsPageHeader } from '@/features/settings/components/settings-page-header';
import { useBlog } from '@/features/settings/hooks/use-blogs';

const BLOGS_PATH = '/home/settings/blogs';

/**
 * Header + card for a page about one existing blog. Loads the blog by `blogId`
 * and hands it to `children(blog)` once it is available.
 */
export function BlogScreen({ blogId, title, description, children }) {
  const { data: blog, isLoading, isError } = useBlog(blogId);

  return (
    <div>
      <SettingsPageHeader title={title} description={description} backTo={BLOGS_PATH} />
      <Card>
        {isLoading && <PageLoader />}
        {(isError || (!isLoading && !blog)) && <EmptyState message="تعذر تحميل المقال." />}
        {blog && children(blog)}
      </Card>
    </div>
  );
}
