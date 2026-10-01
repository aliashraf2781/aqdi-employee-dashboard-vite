import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useCreateServicePage, useUpdateServicePage } from '@/features/marketing/hooks/use-service-pages';
import {
  EMPTY_SERVICE_PAGE,
  SERVICE_PAGE_STATUS_OPTIONS,
  servicePageSchema,
  servicePageToForm,
} from '@/features/marketing/schemas/service-page-schema';

/** Add (no `page`) or edit (`page`) a service / static page of the public site. */
export function ServicePageFormDialog({ open, onOpenChange, page }) {
  const close = () => onOpenChange(false);
  const create = useCreateServicePage(close);
  const update = useUpdateServicePage(close);
  const isEdit = Boolean(page);
  // Stable reference: FormDialog resets the form whenever `defaultValues` changes.
  const defaultValues = useMemo(() => (page ? servicePageToForm(page) : EMPTY_SERVICE_PAGE), [page]);

  const handleSubmit = (values) => (isEdit ? update.mutateAsync({ id: page.id, ...values }) : create.mutateAsync(values)).catch(() => undefined);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'تحرير الصفحة' : 'صفحة جديدة'}
      schema={servicePageSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel={isEdit ? 'حفظ' : 'إضافة'}
      size="lg"
    >
      {({ register, formState: { errors } }) => (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField {...register('title')} label="العنوان" error={errors.title?.message} />
            <TextField {...register('path')} dir="ltr" label="الرابط (path)" placeholder="/residential" error={errors.path?.message} />
            <TextField {...register('target_keyword')} label="الكلمة المستهدفة" />
            <SelectField {...register('status')} label="الحالة" options={SERVICE_PAGE_STATUS_OPTIONS} />
          </div>
          <p className="border-t border-dashed border-border pt-3 text-xs font-extrabold text-primary">تحسين محركات البحث (SEO)</p>
          <TextField {...register('meta_title')} label="عنوان الميتا" placeholder="عنوان يظهر في نتائج البحث (~60 حرفًا)" />
          <TextareaField {...register('meta_description')} label="وصف الميتا" placeholder="وصف مختصر يظهر تحت العنوان في نتائج البحث (~160 حرفًا)" />
        </>
      )}
    </FormDialog>
  );
}
