import { SelectField } from '@/shared/components/ui/select-field';
import { TextField } from '@/shared/components/ui/text-field';
import { TextareaField } from '@/shared/components/ui/textarea-field';
import { cn } from '@/shared/lib/cn';
import { getSaudiContactFieldKind, sanitizeSaudiContactInput } from '../../../lib/saudi-contact';

const YES_NO_OPTIONS = [
  { value: '1', label: 'نعم' },
  { value: '0', label: 'لا' },
];

const CONTACT_PLACEHOLDERS = { national_id: '1xxxxxxxxx أو 2xxxxxxxxx', phone: '05xxxxxxxx' };
const CONTACT_MAX_LENGTH = 10;

const requiredLabel = (field) => (field.required ? `${field.label} *` : field.label);

export function TextInputField({ field, value, error, onChange }) {
  const contactKind = getSaudiContactFieldKind(field);
  const isLtr = contactKind || field.key.includes('mobile') || field.key.includes('id_num');

  return (
    <TextField
      label={requiredLabel(field)}
      value={value ?? ''}
      onChange={(event) => onChange(contactKind ? sanitizeSaudiContactInput(field, event.target.value) : event.target.value)}
      inputMode={contactKind ? 'numeric' : undefined}
      maxLength={contactKind ? CONTACT_MAX_LENGTH : undefined}
      placeholder={field.hint || CONTACT_PLACEHOLDERS[contactKind] || ''}
      dir={isLtr ? 'ltr' : 'rtl'}
      autoComplete="off"
      error={error}
    />
  );
}

export function TextareaInputField({ field, value, error, onChange }) {
  return (
    <TextareaField
      label={requiredLabel(field)}
      rows={3}
      value={value ?? ''}
      onChange={(event) => onChange(event.target.value)}
      placeholder={field.hint || ''}
      error={error}
    />
  );
}

export function BooleanInputField({ field, value, error, onChange }) {
  const selected = value === 1 || value === '1' ? '1' : '0';
  return (
    <SelectField
      label={requiredLabel(field)}
      value={selected}
      options={YES_NO_OPTIONS}
      onChange={(event) => onChange(event.target.value === '1' ? 1 : 0)}
      error={error}
    />
  );
}

/** Radio-like buttons for a short list of choices (e.g. listed vs custom duration). */
export function SegmentedInputField({ field, value, onChange }) {
  const selected = value == null || value === '' ? field.options?.[0]?.value : value;

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium">{field.label}</span>
      <div role="radiogroup" aria-label={field.label} className="flex h-11 items-center gap-1 rounded-md border border-input bg-surface p-1">
        {(field.options ?? []).map((option) => {
          const isActive = String(selected) === String(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => onChange(option.value)}
              className={cn(
                'flex h-full flex-1 items-center justify-center rounded-sm px-2 text-xs font-bold transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent',
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** A value the editor shows but does not allow to change (e.g. the document type). */
export function LockedField({ field, value }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-medium">{field.label}</span>
        <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-muted-foreground">مقفل</span>
      </div>
      <div className="flex h-11 items-center rounded-md border border-input bg-muted px-3 text-sm text-muted-foreground">
        {field.displayValue ?? value ?? '—'}
      </div>
    </div>
  );
}
