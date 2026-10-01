import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { FileUploadField } from '@/shared/components/file-upload-field';
import { FormDialog } from '@/shared/components/form-dialog';
import { CheckboxField } from '@/shared/components/checkbox-field';
import { TextField } from '@/shared/components/ui/text-field';
import { BilingualField } from '@/features/marketing/components/website-images/bilingual-field';
import { getFileTypeError } from '@/features/marketing/lib/file-types';
import { resolveImageUrl, websiteImageToForm, WEBSITE_IMAGE_TEXT_FIELDS } from '@/features/marketing/lib/website-images';
import { websiteImageSchema } from '@/features/marketing/schemas/website-image-schema';

/**
 * Edit alt / meta / label / flags of one catalog row, with an optional replacement image.
 * Without edit permission the fields are read-only.
 * Mount with `key={item.id}` so the picked file resets when another row is opened.
 */
export function WebsiteImageEditDialog({ open, onOpenChange, item, canEdit, onSubmit }) {
  const [imageFile, setImageFile] = useState(null);
  // Stable reference: FormDialog resets the form whenever `defaultValues` changes.
  const defaultValues = useMemo(() => websiteImageToForm(item), [item]);

  const handlePick = (file) => {
    const message = getFileTypeError(file, false);
    if (message) toast.error(message);
    else setImageFile(file);
  };

  const handleSubmit = (form) => {
    if (!canEdit) {
      onOpenChange(false);
      return undefined;
    }
    return onSubmit({ form, imageFile });
  };

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={`تحرير: ${item.label_ar || item.key}`}
      description={`المفتاح: ${item.key}`}
      schema={websiteImageSchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      submitLabel={canEdit ? 'حفظ' : 'إغلاق'}
      size="lg"
    >
      {({ register, formState: { errors } }) => (
        <fieldset disabled={!canEdit} className="flex flex-col gap-4">
          <FileUploadField
            label="الصورة"
            uploadTitle="استبدال الصورة"
            file={imageFile}
            existingUrl={resolveImageUrl(item)}
            allowRemove={Boolean(imageFile)}
            onPick={handlePick}
            onRemove={() => setImageFile(null)}
          />

          {WEBSITE_IMAGE_TEXT_FIELDS.map((field) => (
            <BilingualField key={field.key} register={register} base={field.key} label={field.label} hint={field.hint} multiline={field.multiline} />
          ))}

          <TextField
            {...register('static_path')}
            dir="ltr"
            label="مسار الملف الثابت (static_path)"
            placeholder="website/asset/images/logo.svg"
          />
          <p className="-mt-3 text-xs text-muted-foreground">اتركه فارغًا ما لم تكن الصورة ملفًا ثابتًا داخل الموقع.</p>

          <div className="flex flex-wrap items-end gap-4">
            <TextField {...register('sort_order')} inputMode="numeric" label="الترتيب" error={errors.sort_order?.message} />
            <CheckboxField label="مفعّلة على الموقع" className="h-11" {...register('is_active')} />
          </div>
        </fieldset>
      )}
    </FormDialog>
  );
}
