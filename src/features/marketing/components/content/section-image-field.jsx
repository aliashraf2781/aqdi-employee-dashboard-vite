import { useController } from 'react-hook-form';
import { toast } from 'sonner';
import { FileUploadField } from '@/shared/components/ui/file-upload-field';
import { getFileTypeError } from '@/features/marketing/lib/file-types';

/**
 * Image/PDF field bound to a form value shaped `{ url, file, removed }`
 * (see buildImageValue in lib/section-form.js).
 */
export function SectionImageField({ control, name, label, uploadTitle, hint, allowPdf = false }) {
  const { field } = useController({ control, name });
  const value = field.value;

  const handlePick = (file) => {
    const message = getFileTypeError(file, allowPdf);
    if (message) {
      toast.error(message);
      return;
    }
    field.onChange({ ...value, file, removed: false });
  };

  const handleRemove = () => field.onChange({ ...value, file: null, removed: true });

  return (
    <FileUploadField
      label={label}
      uploadTitle={uploadTitle}
      hint={hint}
      allowPdf={allowPdf}
      file={value.file}
      existingUrl={value.url}
      removed={value.removed}
      onPick={handlePick}
      onRemove={handleRemove}
    />
  );
}
