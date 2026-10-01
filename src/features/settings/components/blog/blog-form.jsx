import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { RichTextEditor } from '@/shared/components/rich-text-editor';
import { Button } from '@/shared/components/ui/button';
import { ImageField } from '@/shared/components/ui/image-field';
import { SwitchField } from '@/shared/components/ui/switch-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { BlogPublishOptions } from '@/features/settings/components/blog/blog-publish-options';
import { useSaveBlog } from '@/features/settings/hooks/use-blogs';
import { EMPTY_BLOG_FORM, blogToFormValues } from '@/features/settings/lib/blog';
import { blogSchema } from '@/features/settings/schemas/blog-schema';

const BLOGS_PATH = '/home/settings/blogs';

/** Create (no `blog`) or edit (with `blog`) form. */
export function BlogForm({ blog = null }) {
  const isEdit = Boolean(blog);
  const save = useSaveBlog(blog?.id);
  const { register, control, setValue, handleSubmit, formState } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: blog ? blogToFormValues(blog) : EMPTY_BLOG_FORM,
  });
  const { errors } = formState;
  const [isActive, publishMode, image] = useWatch({ control, name: ['is_active', 'publishMode', 'image'] });
  const cancelPath = isEdit ? `${BLOGS_PATH}/${blog.id}` : BLOGS_PATH;

  return (
    <form onSubmit={handleSubmit((values) => save.mutate(values))} className="flex flex-col gap-6" noValidate>
      <TextField label="عنوان المقال" placeholder="أدخل عنوان المقال" error={errors.title?.message} {...register('title')} />

      {isEdit && blog.slug && (
        <div className="rounded-lg border border-border bg-surface-muted px-4 py-3">
          <p className="mb-1 text-xs text-muted-foreground">الرابط المختصر</p>
          <p dir="ltr" className="text-sm font-medium text-foreground">
            {blog.slug}
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">محتوى المقال</span>
        <RichTextEditor
          label="محتوى المقال"
          initialContent={blog?.description || ''}
          onChange={(html) => setValue('description', html, { shouldValidate: formState.isSubmitted })}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>

      <fieldset className="flex flex-col gap-4 rounded-card border border-border bg-surface-muted p-5">
        <legend className="px-1 text-sm font-bold text-foreground">تحسين محركات البحث (SEO)</legend>
        <p className="text-xs text-muted-foreground">
          عنوان ووصف الميتا لهذا المقال. اتركهما فارغين لاستخدام العنوان الافتراضي.
        </p>
        <TextField label="عنوان الميتا" placeholder="مثال: دليلك لتوثيق عقد الإيجار إلكترونيًا | عقدي" {...register('meta_title')} />
        <TextareaField label="وصف الميتا" placeholder="وصف مختصر يظهر تحت العنوان في نتائج البحث" {...register('meta_description')} />
      </fieldset>

      <ImageField
        label="صورة المقال"
        file={image}
        savedUrl={blog?.image}
        onFileChange={(file) => setValue('image', file)}
      />

      <SwitchField
        label="نشط"
        description="تحديد ما إذا كان المقال نشطاً في المدونة"
        checked={isActive}
        onCheckedChange={(checked) => setValue('is_active', checked)}
      />

      <BlogPublishOptions
        mode={publishMode}
        onModeChange={(mode) => setValue('publishMode', mode)}
        publishAtField={register('publish_at')}
        publishAtError={errors.publish_at?.message}
      />

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button asChild variant="outline">
          <Link to={cancelPath}>إلغاء</Link>
        </Button>
        <Button type="submit" disabled={save.isPending} className="min-w-40">
          {save.isPending ? 'جاري الحفظ...' : isEdit ? 'تحديث المقال' : 'حفظ المقال'}
        </Button>
      </div>
    </form>
  );
}
