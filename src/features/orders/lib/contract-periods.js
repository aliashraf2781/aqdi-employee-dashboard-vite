import { getInstrumentTypeLabel, INSTRUMENT_TYPES } from './instrument-types';

const CONTRACT_TYPES = ['housing', 'commercial'];

export function getContractTypeLabel(type) {
  if (type === 'commercial') return 'تجاري';
  if (type === 'housing') return 'سكني';
  return type || '—';
}

/** The periods endpoint answers in several shapes; this finds the array. */
export function normalizeContractPeriods(response) {
  if (!response) return [];
  if (Array.isArray(response)) return response;

  const payload = response.data ?? response;
  const candidates = [
    payload?.items,
    payload?.data?.items,
    payload?.data?.data?.data,
    payload?.data?.data,
    payload?.data,
    payload,
  ];
  return candidates.find(Array.isArray) ?? [];
}

export function getContractPeriodLabel(period) {
  return period?.period || period?.note_trans || period?.note_ar || '—';
}

export function formatContractPeriodPrice(price) {
  if (price == null || price === '') return null;
  const value = Number(price);
  return Number.isFinite(value) ? `${value.toLocaleString('ar-SA')} ر.س` : String(price);
}

export function getPeriodContractType(period, fallback = 'housing') {
  return CONTRACT_TYPES.includes(period?.contract_type) ? period.contract_type : fallback;
}

export function groupContractPeriodsByInstrumentType(periods = []) {
  const grouped = new Map();
  periods.forEach((period) => {
    const key = period?.instrument_type || 'other';
    grouped.set(key, [...(grouped.get(key) ?? []), period]);
  });

  const knownKeys = INSTRUMENT_TYPES.filter((type) => grouped.has(type));
  const otherKeys = [...grouped.keys()].filter((key) => !INSTRUMENT_TYPES.includes(key));

  return [...knownKeys, ...otherKeys].map((instrumentType) => ({
    id: instrumentType,
    name: getInstrumentTypeLabel(instrumentType),
    items: grouped.get(instrumentType),
  }));
}

export function groupContractPeriodsByContractType(periods = []) {
  return CONTRACT_TYPES.map((type) => ({
    id: type,
    name: getContractTypeLabel(type),
    sections: groupContractPeriodsByInstrumentType(periods.filter((period) => getPeriodContractType(period) === type)),
  }));
}

/** Select options (value/label) for a list of periods. */
export function mapContractPeriodsToOptions(periods = []) {
  return periods
    .filter((period) => period?.id != null)
    .map((period) => {
      const label = getContractPeriodLabel(period);
      return {
        value: String(period.id),
        label: formatContractPeriodPrice(period?.price) ? `${label} (اجمالي الرسوم ${period.price})` : label,
      };
    });
}
