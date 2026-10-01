import { SelectField } from '@/shared/components/ui/select-field';
import { useSelectOptions } from '../../../hooks/use-select-options';
import { getCurrentOptionLabel, withCurrentOption } from '../../../lib/contract-form/select-options';

/** Select whose options may come from a reference list. Numeric option values are stored as numbers. */
export function SelectInputField({ field, value, values, orderData, error, onChange }) {
  const { options, isLoading } = useSelectOptions(field, orderData, values);
  const selected = value == null || value === '' ? '' : String(value);
  const allOptions = withCurrentOption(options, selected, getCurrentOptionLabel(field, orderData, values));
  const needsRegionFirst = field.key === 'property_city_id' && !values?.property_place_id && options.length === 0;

  let placeholder = '— اختر —';
  if (isLoading) placeholder = 'جاري التحميل...';
  else if (needsRegionFirst) placeholder = 'اختر المنطقة أولاً';

  return (
    <SelectField
      label={field.required ? `${field.label} *` : field.label}
      value={selected}
      options={allOptions}
      placeholder={placeholder}
      disabled={isLoading}
      error={error}
      onChange={(event) => {
        const next = event.target.value;
        if (next === '') onChange('');
        else onChange(/^\d+$/.test(next) ? Number(next) : next);
      }}
    />
  );
}
