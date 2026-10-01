import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from '@/shared/components/pagination';
import { Button } from '@/shared/components/ui/button';
import { PERMISSION_SECTIONS, usePermissions } from '@/features/permissions';
import { BlogsTable } from '@/features/settings/components/blog/blogs-table';
import { SettingsPageHeader } from '@/features/settings/components/settings-page-header';
import { useBlogs } from '@/features/settings/hooks/use-blogs';

const FIRST_PAGE = 1;

export function BlogsPage() {
  const { can } = usePermissions();
  const [page, setPage] = useState(FIRST_PAGE);
  const { data, isLoading } = useBlogs(page);

  return (
    <div>
      <SettingsPageHeader
        title="المدونة"
        actions={
          can(PERMISSION_SECTIONS.blogs, 'create') && (
            <Button asChild>
              <Link to="/home/settings/blogs/create">
                <Plus className="size-4" />
                إضافة
              </Link>
            </Button>
          )
        }
      />
      <BlogsTable blogs={data?.rows} isLoading={isLoading} />
      <Pagination page={page} lastPage={data?.lastPage} onPageChange={setPage} />
    </div>
  );
}
