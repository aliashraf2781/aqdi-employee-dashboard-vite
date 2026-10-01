import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { useCreateFaq, useUpdateFaq } from '@/features/marketing/hooks/use-faqs';
import { EMPTY_FAQ, faqSchema, faqToForm } from '@/features/marketing/schemas/faq-schema';

/** Add (no `faq`) or edit (`faq`) one question. */
export function FaqFormDialog({ open, onOpenChange, faq }) {
  const close = () => onOpenChange(false);
  const create = useCreateFaq(close);
  const update = useUpdateFaq(close);
  const isEdit = Boolean(faq);
  // Stable reference: FormDialog resets the form whenever `defaultValues` changes.
  const defaultValues = useMemo(() => (faq ? faqToForm(faq) : EMPTY_FAQ), [faq]);

  const handleSubmit = (values) => (isEdit ? update.mutateAsync({ id: faq.id, ...values }) : create.mutateAsync(values)).catch(() => undefined);

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'تعديل العنصر' : 'عنصر جديد'}
      schema={faqSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
    >
      {({ register, formState: { errors } }) => (
        <>
          <TextField {...register('title_ar')} label="السؤال" placeholder="اكتب السؤال هنا ..." error={errors.title_ar?.message} />
          <TextareaField {...register('answer_ar')} label="الجواب" placeholder="اكتب الجواب هنا ..." rows={5} error={errors.answer_ar?.message} />
        </>
      )}
    </FormDialog>
  );
}
