/*
 * The deed ("instrument") types are a fixed list owned by the backend.
 * Popups and the instrument settings table spell some of the names differently, so
 * there are two label lists over the same `value` keys.
 */

export const POPUP_INSTRUMENT_TYPES = [
  { value: 'electronic', label: 'صك ملكيه الكتروني' },
  { value: 'electronic_deed_from_the_ministry_of_justice', label: 'صك ملكيه الكتروني من وزارة العدل والسجل العيني' },
  { value: 'electronic_tax_register', label: 'صك ملكيه الكتروني من السجل العقاري' },
  { value: 'old_handwritten', label: 'صك ملكيه ورقي' },
  { value: 'property_ownership_owner_are_deceased', label: 'صك ملكيه والمالك متوفي' },
  { value: 'property_ownership_owner_are_deceased_endowment', label: 'صك ملكيه ووقف ورثة متوفين' },
  { value: 'property_ownership_owner_is_endowment', label: 'صك ملكيه والمالك وقف' },
  { value: 'property_ownership_owner_are_suspended', label: 'صك ملكيه والمالك معلق' },
  { value: 'sale_agreement', label: 'ورقة مبايعه' },
  { value: 'economic_cities_authority_suspended', label: 'وثيقة هيئة المدن الاقتصاديه' },
  { value: 'strong_argument', label: 'حجة استحكام' },
  { value: 'sublease_agreement', label: 'عقد ايجار من الباطن' },
  { value: 'lease_renewal', label: 'تجديد عقد ايجار' },
];

export const SETTING_INSTRUMENT_TYPES = [
  { value: 'electronic', label: 'صك ملكية إلكتروني من وزارة العدل' },
  { value: 'electronic_deed_from_the_ministry_of_justice', label: 'صك ملكية إلكتروني من وزارة العدل والسجل العيني' },
  { value: 'electronic_tax_register', label: 'صك ملكية إلكتروني من السجل العقاري' },
  { value: 'old_handwritten', label: 'صك ملكية ورقي' },
  { value: 'property_ownership_owner_are_deceased', label: 'صك ملكية والمالك متوفى' },
  { value: 'property_ownership_owner_are_deceased_endowment', label: 'صك ملكية ووقف ورثة متوفين' },
  { value: 'property_ownership_owner_is_endowment', label: 'صك ملكية والمالك وقف' },
  { value: 'property_ownership_owner_are_suspended', label: 'صك ملكية والمالك معلق' },
  { value: 'sale_agreement', label: 'ورقة مبايعة' },
  { value: 'economic_cities_authority_suspended', label: 'وثيقة هيئة المدن الاقتصادية' },
  { value: 'strong_argument', label: 'حجة استحكام' },
  { value: 'sublease_agreement', label: 'عقد إيجار من الباطن' },
  { value: 'lease_renewal', label: 'تجديد عقد إيجار' },
];

const labelOf = (list, type) => list.find((option) => option.value === type)?.label;

export function popupInstrumentTypeLabel(type) {
  if (!type) return '—';
  return labelOf(POPUP_INSTRUMENT_TYPES, type) || type;
}

export function settingInstrumentTypeLabel(type) {
  if (!type) return '—';
  return labelOf(SETTING_INSTRUMENT_TYPES, type) || popupInstrumentTypeLabel(type);
}
