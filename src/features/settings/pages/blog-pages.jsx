import { useParams } from 'react-router-dom';
import { Card } from '@/shared/components/card';
import { BlogDetails } from '@/features/settings/components/blog/blog-details';
import { BlogForm } from '@/features/settings/components/blog/blog-form';
import { BlogScreen } from '@/features/settings/components/blog/blog-screen';
import { SettingsPageHeader } from '@/features/settings/components/settings-page-header';

const BLOGS_PATH = '/home/settings/blogs';

export function BlogDetailsPage() {
  const { id } = useParams();
  return (
    <BlogScreen blogId={id} title="عرض المقال" description="تفاصيل المقال وحالته">
      {(blog) => <BlogDetails blog={blog} />}
    </BlogScreen>
  );
}

/** Route is guarded by `blogs.edit` in the manifest. */
export function BlogEditPage() {
  const { id } = useParams();
  return (
    <BlogScreen blogId={id} title="تعديل المقال" description="تحديث بيانات المقال وخيارات النشر">
      {(blog) => <BlogForm blog={blog} />}
    </BlogScreen>
  );
}

/** Route is guarded by `blogs.create` in the manifest. */
export function BlogCreatePage() {
  return (
    <div>
      <SettingsPageHeader
        title="إضافة مقال جديد"
        description="أنشئ مقالاً جديداً وحدد وقت النشر أو احفظه كمسودة"
        backTo={BLOGS_PATH}
      />
      <Card>
        <BlogForm />
      </Card>
    </div>
  );
}
