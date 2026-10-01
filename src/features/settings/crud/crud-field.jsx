import { RichTextEditor } from '@/shared/components/rich-text-editor';
import { ImageField } from '@/shared/components/ui/image-field';
import { SelectField } from '@/shared/components/ui/select-field';
import { SwitchField } from '@/shared/components/ui/switch-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';

const NO_OPTIONS = [];
const useNoOptions = () => NO_OPTIONS;

/** A select whose options are static (`field.options`) or loaded by a hook (`field.useOptions`). */
/**
 * A select whose options are static (`field.options`) or loaded by a hook (`field.useOptions`).
 * It is controlled: options often arrive after the form was filled, and an uncontrolled
 * <select> would not pick the stored value up again once they appear.
 */
function ConfiguredSelect({ field, form, error }) {
  const values = form.watch();
  const useOptions = field.useOptions ?? useNoOptions;
  const loadedOptions = useOptions(values);
  const options = field.options ?? loadedOptions;

  const handleChange = (event) => {
    form.setValue(field.name, event.target.value, { shouldDirty: true });
    (field.clears ?? []).forEach((name) => form.setValue(name, ''));
  };

  return (
    <SelectField
      label={field.label}
      placeholder={field.placeholder}
      options={options}
      error={error}
      value={values[field.name] ?? ''}
      onChange={handleChange}
    />
  );
}

function ConfiguredImage({ field, form, row }) {
  const file = form.watch(field.name);
  const isMarkedForRemoval = field.removeFlag ? form.watch(field.removeFlag) : false;
  const savedUrl = isMarkedForRemoval ? null : row?.[field.savedUrlKey];

  return (
    <ImageField
      label={field.label}
      file={file}
      savedUrl={savedUrl}
      onFileChange={(next) => form.setValue(field.name, next)}
      onRemove={field.removeFlag ? () => form.setValue(field.removeFlag, true) : undefined}
    />
  );
}

/**
 * Renders one form field from its config.
 * field: { name, label, type?, placeholder?, dir?, options?, useOptions?, clears?, visibleWhen?,
 *          hint?, fullWidth?, step?, min? }
 * type: 'text' (default) | 'number' | 'date' | 'datetime-local' | 'textarea' | 'select'
 *       | 'switch' | 'richtext' | 'image'
 */
export function CrudField({ field, form, row }) {
  const values = form.watch();
  if (field.visibleWhen && !field.visibleWhen(values)) return null;

  const error = form.formState.errors[field.name]?.message;
  const type = field.type ?? 'text';

  if (type === 'select') return <ConfiguredSelect field={field} form={form} error={error} />;
  if (type === 'image') return <ConfiguredImage field={field} form={form} row={row} />;

  if (type === 'switch') {
    return (
      <SwitchField
        label={field.label}
        description={field.description}
        checked={Boolean(values[field.name])}
        onCheckedChange={(checked) => form.setValue(field.name, checked)}
      />
    );
  }

  if (type === 'richtext') {
    return (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground">{field.label}</span>
        <RichTextEditor
          label={field.label}
          placeholder={field.placeholder}
          initialContent={values[field.name]}
          onChange={(html) => form.setValue(field.name, html)}
        />
      </div>
    );
  }

  if (type === 'hint') {
    return <p className="text-xs text-muted-foreground">{field.text(values)}</p>;
  }

  if (type === 'textarea') {
    return (
      <TextareaField label={field.label} placeholder={field.placeholder} error={error} {...form.register(field.name)} />
    );
  }

  return (
    <TextField
      label={field.label}
      type={type}
      dir={field.dir}
      placeholder={field.placeholder}
      step={field.step}
      min={field.min}
      error={error}
      {...form.register(field.name)}
    />
  );
}
