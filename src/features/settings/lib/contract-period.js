import { toNumberOrNull } from '@/features/settings/schemas/common-schemas';

export const KNOWN_PERIODS = [
  { value: 'شهري', months: 1 },
  { value: 'ربع سنوي', months: 3 },
  { value: 'نصف سنوي', months: 6 },
  { value: 'سنوي', months: 12 },
];

/** Dropdown value meaning "type your own period name". */
export const CUSTOM_PERIOD = '__custom__';

export function getKnownPeriodMonths(period) {
  return KNOWN_PERIODS.find((item) => item.value === period)?.months ?? null;
}

/** The period name that will be saved, given the dropdown choice and the custom text. */
export function resolvePeriod({ periodChoice, customPeriod }) {
  return periodChoice === CUSTOM_PERIOD ? customPeriod.trim() : periodChoice;
}

/** Row from the API -> form values. Unknown period names open as "custom". */
export function contractPeriodToFormValues(row) {
  const isKnown = KNOWN_PERIODS.some((period) => period.value === row.period);
  return {
    periodChoice: isKnown ? row.period : CUSTOM_PERIOD,
    customPeriod: isKnown ? '' : row.period || '',
    note_ar: row.note_ar || row.note || '',
    note_en: row.note_en || '',
    contract_type: row.contract_type || 'housing',
    price: row.price == null || row.price === '' ? '' : String(row.price),
  };
}

/** Form values -> request body. When editing, cleared optional fields are sent as empty/null. */
export function buildContractPeriodPayload(values, { isEdit }) {
  const payload = {
    period: resolvePeriod(values),
    note_ar: values.note_ar.trim(),
    contract_type: values.contract_type,
  };

  const noteEn = values.note_en.trim();
  if (noteEn) payload.note_en = noteEn;
  else if (isEdit) payload.note_en = '';

  const price = toNumberOrNull(values.price);
  if (price != null) payload.price = price;
  else if (isEdit) payload.price = null;

  return payload;
}
