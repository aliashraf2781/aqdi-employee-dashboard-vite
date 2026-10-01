import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Search } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/shared/components/badge';
import { Card } from '@/shared/components/card';
import { Button } from '@/shared/components/ui/button';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useSaveContentPage } from '@/features/marketing/hooks/use-content-page';
import { buildPageMetaFormData, extractPageMeta } from '@/features/marketing/lib/content-pages';
import { META_DESCRIPTION_MAX, META_TITLE_MAX, pageSeoSchema } from '@/features/marketing/schemas/page-seo-schema';

/** Page-level meta title / description editor (Arabic only). Saves top-level keys, no section prefix. */
export function PageSeoForm({ pageKey, pageLabel, responseData, canEdit = true }) {
  const form = useForm({ resolver: zodResolver(pageSeoSchema), defaultValues: extractPageMeta(responseData) });
  const { register, handleSubmit, reset, formState } = form;
  const { mutate: saveSeo, isPending } = useSaveContentPage(pageKey, {
    successMessage: 'تم حفظ بيانات SEO',
    errorMessage: 'حدث خطأ أثناء حفظ بيانات SEO',
  });

  useEffect(() => {
    reset(extractPageMeta(responseData));
  }, [reset, responseData]);

  const onSubmit = (values) => {
    if (canEdit) saveSeo(buildPageMetaFormData(values));
  };

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-foreground">تحسين محركات البحث — {pageLabel}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
            عنوان ووصف الصفحة في نتائج البحث ومعاينات الروابط. اترك الحقل فارغًا لاستخدام القيمة الافتراضية في الموقع.
          </p>
        </div>
        <Badge tone="neutral" className="gap-1">
          <Search className="size-3.5" />
          SEO
        </Badge>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 flex flex-col gap-5">
        <fieldset disabled={!canEdit} className="flex flex-col gap-5 disabled:opacity-70">
          <TextField
            {...register('meta_title')}
            label="عنوان الصفحة (SEO)"
            placeholder="مثال: الأسئلة الشائعة — عقدي"
            error={formState.errors.meta_title?.message}
          />
          <p className="-mt-3 text-xs text-muted-foreground">يُفضّل ألا يتجاوز ~60 حرفًا (الحد الأقصى {META_TITLE_MAX}).</p>
          <TextareaField
            {...register('meta_description')}
            label="وصف الصفحة (SEO)"
            placeholder="وصف مختصر يظهر تحت العنوان في نتائج البحث"
            error={formState.errors.meta_description?.message}
          />
          <p className="-mt-3 text-xs text-muted-foreground">يُفضّل ألا يتجاوز ~160 حرفًا (الحد الأقصى {META_DESCRIPTION_MAX}).</p>
        </fieldset>

        {!canEdit && <p className="text-xs font-medium text-muted-foreground">ليس لديك صلاحية تعديل بيانات SEO لهذه الصفحة.</p>}

        <Button type="submit" size="lg" disabled={!canEdit || isPending} className="self-start">
          {isPending && <Loader2 className="size-4 animate-spin" />}
          حفظ بيانات SEO
        </Button>
      </form>
    </Card>
  );
}
