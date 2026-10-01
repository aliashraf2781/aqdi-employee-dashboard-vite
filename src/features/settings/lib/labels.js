export const CONTRACT_TYPES = { housing: 'housing', commercial: 'commercial' };

export const CONTRACT_TYPE_OPTIONS = [
  { value: CONTRACT_TYPES.housing, label: 'سكني' },
  { value: CONTRACT_TYPES.commercial, label: 'تجاري' },
];

export const AUDIENCES = { client: 'client', employee: 'employee', property: 'property' };

export const AUDIENCE_OPTIONS = [
  { value: AUDIENCES.client, label: 'عميل' },
  { value: AUDIENCES.employee, label: 'موظف' },
  { value: AUDIENCES.property, label: 'عقار' },
];

function labelFor(options, value) {
  return options.find((option) => option.value === value)?.label || value || '—';
}

export function contractTypeLabel(value) {
  return labelFor(CONTRACT_TYPE_OPTIONS, value);
}

export function audienceLabel(value) {
  return labelFor(AUDIENCE_OPTIONS, value);
}

/** Arabic name first, then English, then a dash. */
export function arabicOrEnglishName(record) {
  return record?.name_ar || record?.name_en || record?.name || '—';
}
