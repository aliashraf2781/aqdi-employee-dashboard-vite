import { SETTING_INSTRUMENT_TYPES, settingInstrumentTypeLabel } from '@/features/contract-settings/lib/instrument-types';

/** One backend row (or a missing one) -> the shape the table works with. */
function normalizeSetting(item = {}) {
  const typeName = settingInstrumentTypeLabel(item.instrument_type);
  return {
    id: item.id ?? null,
    instrument_type: item.instrument_type ?? '',
    type_name: typeName,
    label: item.label?.trim() ? item.label : typeName,
    realestate: Boolean(item.realestate),
    contract: Boolean(item.contract),
    sms_user: item.sms_user ?? '',
    sms_owner: item.sms_owner ?? '',
    sms_employee: item.sms_employee ?? '',
  };
}

/**
 * The list of deed types is fixed and never deleted. Saved rows only overlay
 * visibility/label on top of it; types without a saved row start switched off.
 */
export function mergeInstrumentSettings(savedItems = []) {
  const saved = new Map(
    savedItems
      .map(normalizeSetting)
      .filter((item) => item.instrument_type)
      .map((item) => [item.instrument_type, item]),
  );

  return SETTING_INSTRUMENT_TYPES.map((option) => {
    const existing = saved.get(option.value);
    if (existing) return { ...existing, type_name: option.label };
    return normalizeSetting({ instrument_type: option.value });
  });
}

/** Row -> request body (create when the row has no id yet, update otherwise). */
export function buildInstrumentSettingPayload(item) {
  return {
    instrument_type: item.instrument_type,
    realestate: Boolean(item.realestate),
    contract: Boolean(item.contract),
    label: item.label?.trim() || settingInstrumentTypeLabel(item.instrument_type),
    sms_user: item.sms_user ?? '',
    sms_owner: item.sms_owner ?? '',
    sms_employee: item.sms_employee ?? '',
  };
}
