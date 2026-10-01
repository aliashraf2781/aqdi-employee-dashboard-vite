import { CalendarIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import {
  calendarParts,
  DATE_FORMAT,
  formatContractDate,
  parseContractDate,
  resolveCalendarType,
} from '../../../lib/contract-form/calendar';

/** Hijri or Gregorian date picker. Values are stored as DD-MM-YYYY strings. */
export function ContractDatePicker({ id, value, calendarType, onChange, disabled = false }) {
  const resolvedType = resolveCalendarType(calendarType, value);
  const isHijri = resolvedType === 'hijri';
  const [open, setOpen] = useState(false);
  const { calendar, locale } = calendarParts(resolvedType);
  const selected = useMemo(() => parseContractDate(value, resolvedType), [value, resolvedType]);

  const handleChange = (date) => {
    if (!date) {
      onChange('');
      return;
    }
    onChange(formatContractDate(Array.isArray(date) ? date[0] : date));
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <DatePicker
        key={resolvedType}
        id={id}
        value={selected}
        onChange={handleChange}
        calendar={calendar}
        locale={locale}
        format={DATE_FORMAT}
        calendarPosition="bottom-right"
        containerClassName="w-full"
        inputClass="h-11 w-full rounded-md border border-input bg-surface ps-3 pe-10 text-start text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
        placeholder={isHijri ? 'اختر تاريخ هجري' : 'اختر تاريخ ميلادي'}
        disabled={disabled}
        editable={false}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      />
      <CalendarIcon className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
    </div>
  );
}
