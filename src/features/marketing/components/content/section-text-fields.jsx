import { get } from 'react-hook-form';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { TextField } from '@/shared/components/ui/text-field';
import { sanitizeSaudiMobileInput } from '@/features/marketing/lib/saudi-mobile';

const PHONE_MAX_LENGTH = 10;

const resolvePlaceholder = (placeholder, index) => (typeof placeholder === 'function' ? placeholder(index) : placeholder);

function PhoneField({ form, path, field, error }) {
  const registration = form.register(path);

  const handleChange = (event) => {
    event.target.value = sanitizeSaudiMobileInput(event.target.value);
    registration.onChange(event);
  };

  return (
    <TextField
      {...registration}
      onChange={handleChange}
      label={field.label}
      placeholder={field.placeholder}
      error={error}
      dir="ltr"
      inputMode="numeric"
      maxLength={PHONE_MAX_LENGTH}
    />
  );
}

/**
 * Renders the text inputs of a section config.
 * `prefix` nests the names (`mission.title`, `cards.0.title`); `index` feeds placeholder functions.
 */
export function SectionTextFields({ form, fields, prefix = '', index }) {
  return fields.map((field) => {
    const path = prefix ? `${prefix}.${field.name}` : field.name;
    const error = get(form.formState.errors, path)?.message;

    if (field.kind === 'phone') {
      return <PhoneField key={path} form={form} path={path} field={field} error={error} />;
    }

    const Input = field.multiline ? TextareaField : TextField;
    return (
      <div key={path} className="flex flex-col gap-1">
        <Input {...form.register(path)} label={field.label} placeholder={resolvePlaceholder(field.placeholder, index)} error={error} />
        {field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>}
      </div>
    );
  });
}
