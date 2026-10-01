export const EMPTY_VALUE = '---';

/** Text shown for a missing value in the details cards. */
export function displayValue(value) {
  if (value === null || value === undefined || value === '') return EMPTY_VALUE;
  return String(value);
}

export function getInstrumentTypeLabel(type) {
  if (type === 'electronic') return 'صك إلكتروني';
  if (type === 'paper' || type === 'handwritten') return 'صك ورقي';
  return displayValue(type);
}
