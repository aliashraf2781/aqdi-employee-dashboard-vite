import { useMemo } from 'react';
import { FormDialog } from '@/shared/components/form-dialog';
import { FileField } from '@/shared/components/ui/file-field';
import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { getStatusCaseFields } from '../../lib/order-status-payload';
import {
  buildEmptyStatusValues,
  buildStatusFieldsSchema,
  getFieldLabel,
  getOptionLabel,
  isFieldRequired,
  isFieldVisible,
} from '../../lib/status-fields';

function StatusField({ field, form }) {
  const { register, watch, setValue, formState } = form;
  const values = watch();
  if (!isFieldVisible(field, values)) return null;

  const label = `${getFieldLabel(field)}${isFieldRequired(field, values) ? ' *' : ''}`;
  const error = formState.errors[field.name]?.message;

  if (field.type === 'select') {
    const options = (field.options ?? []).map((option) => ({ value: String(option.value), label: getOptionLabel(option) }));
    return <SelectField label={label} options={options} placeholder="اختر" error={error} {...register(field.name)} />;
  }
  if (field.type === 'file') {
    return <FileField label={label} error={error} onFileChange={(file) => setValue(field.name, file)} />;
  }
  if (field.type === 'text') {
    return <TextareaField label={label} rows={3} error={error} {...register(field.name)} />;
  }
  return <TextField label={label} error={error} {...register(field.name)} />;
}

/**
 * Asks for the extra inputs a status needs (deed number, Ejar number, attachment...)
 * before the status is applied. `onSubmit(values)` receives the filled values.
 */
export function ChangeOrderStatusFieldsDialog({ open, onOpenChange, status, isPending = false, onSubmit }) {
  const fields = useMemo(() => getStatusCaseFields(status), [status]);
  const schema = useMemo(() => buildStatusFieldsSchema(fields), [fields]);
  const defaultValues = useMemo(() => buildEmptyStatusValues(fields), [fields]);

  return (
    <FormDialog
      open={open}
      onOpenChange={(next) => !isPending && onOpenChange(next)}
      title={status?.name || status?.label || 'تغيير الحالة'}
      schema={schema}
      defaultValues={defaultValues}
      submitLabel={isPending ? 'جاري الحفظ...' : 'تأكيد تغيير الحالة'}
      onSubmit={onSubmit}
    >
      {(form) => fields.map((field) => <StatusField key={field.name} field={field} form={form} />)}
    </FormDialog>
  );
}
