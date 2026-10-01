import { resolveCalendarType } from '../../../lib/contract-form/calendar';
import { ContractDatePicker } from './contract-date-picker';

/** Date field with the label showing which calendar (Hijri/Gregorian) is in use. */
export function DateInputField({ field, value, values, error, resetKey, onChange }) {
  const calendarType = resolveCalendarType(values?.[field.calendarTypeKey], value);
  const typeLabel = calendarType === 'hijri' ? 'هجري' : 'ميلادي';

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={field.key} className="text-sm font-medium">
        {field.label}
        {field.required && ' *'}
        <span className="ms-2 text-xs font-medium text-muted-foreground">({typeLabel})</span>
      </label>
      <ContractDatePicker key={`${field.key}-${resetKey}-${value ?? ''}`} id={field.key} value={value} calendarType={calendarType} onChange={onChange} />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
