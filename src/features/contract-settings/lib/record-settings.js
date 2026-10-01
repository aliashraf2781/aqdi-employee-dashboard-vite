import { z } from 'zod';
import { toNumberOrNull } from '@/shared/lib/numbers';

const NEGATIVE_NUMBER_MESSAGE = 'القيمة يجب أن تكون رقماً أكبر من أو يساوي صفر';

const isNumberField = (field) => field.type === 'number';

/** Record from the API -> form values (every field becomes a string; missing ones are empty). */
export function recordToFormValues(record, fields) {
  return Object.fromEntries(
    fields.map((field) => {
      const value = record?.[field.name];
      return [field.name, value == null ? '' : String(value)];
    }),
  );
}

/** Form values -> request body. Number fields become numbers (or null when left empty). */
export function buildRecordPayload(values, fields) {
  return Object.fromEntries(
    fields.map((field) => {
      const raw = values[field.name] ?? '';
      if (!isNumberField(field)) return [field.name, raw.trim()];
      // Keep unparsable text as is so the server can report it.
      const number = toNumberOrNull(raw);
      return [field.name, number ?? (raw.trim() === '' ? null : raw)];
    }),
  );
}

/** Zod schema for a record form: free text, or optional numbers that cannot be negative. */
export function buildRecordSchema(fields) {
  const shape = Object.fromEntries(
    fields.map((field) => [
      field.name,
      isNumberField(field)
        ? z
            .string()
            .trim()
            .refine((value) => value === '' || (Number.isFinite(Number(value)) && Number(value) >= 0), NEGATIVE_NUMBER_MESSAGE)
        : z.string(),
    ]),
  );
  return z.object(shape);
}

/** Laravel validation errors `{ field: ['msg'] }` -> `{ field: 'msg' }`. */
export function mapApiFieldErrors(errors) {
  if (!errors || typeof errors !== 'object') return {};
  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, Array.isArray(messages) ? messages[0] : String(messages)]),
  );
}
