import { FileField } from '@/shared/components/ui/file-field';
import { DOCUMENT_ACCEPT } from '../../../lib/contract-fields/field-helpers';
import { FilePreview } from './file-preview';

/** Upload field that also previews the saved file or the newly picked one. */
export function FileInputField({ field, value, error, resetKey, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <FileField
        key={`${field.key}-${resetKey}`}
        label={field.required ? `${field.label} *` : field.label}
        accept={field.accept || DOCUMENT_ACCEPT}
        error={error}
        onFileChange={onChange}
      />
      <FilePreview value={value} />
      {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
    </div>
  );
}
