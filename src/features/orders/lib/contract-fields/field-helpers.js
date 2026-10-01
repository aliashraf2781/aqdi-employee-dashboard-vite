/**
 * The contract editors are driven by field definitions:
 * { key, label, type, options?, optionsSource?, displayKey?, calendarTypeKey?, inputKind?,
 *   step?, colSpan?, showWhen?, entity?, hint?, required?, locked? }
 * `key` is the API field name, so definitions double as documentation of what each section edits.
 */

export const DOCUMENT_ACCEPT = 'image/*,application/pdf';

export const CALENDAR_TYPE_OPTIONS = [
  { value: 'hijri', label: 'هجري' },
  { value: 'gregorian', label: 'ميلادي' },
];

export const METER_OWNERSHIP_OPTIONS = [
  { value: 'owner', label: 'المالك' },
  { value: 'tenant', label: 'المستأجر' },
];

export const calendarTypeField = (key, label, extra = {}) => ({
  key,
  label,
  type: 'select',
  options: CALENDAR_TYPE_OPTIONS,
  ...extra,
});

/** Upload field. Spans the full grid width because it also shows a preview. */
export const fileField = (key, label, extra = {}) => ({
  key,
  label,
  type: 'file',
  accept: DOCUMENT_ACCEPT,
  colSpan: 3,
  ...extra,
});

export const textField = (key, label, extra = {}) => ({ key, label, type: 'text', ...extra });
export const booleanField = (key, label, extra = {}) => ({ key, label, type: 'boolean', ...extra });
