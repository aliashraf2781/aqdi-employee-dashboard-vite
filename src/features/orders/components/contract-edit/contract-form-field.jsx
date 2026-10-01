import { cn } from '@/shared/lib/cn';
import { DateInputField } from './fields/date-input-field';
import { FileInputField } from './fields/file-input-field';
import { OtherConditionsField } from './fields/other-conditions-field';
import { SelectInputField } from './fields/select-input-field';
import {
  BooleanInputField,
  LockedField,
  SegmentedInputField,
  TextareaInputField,
  TextInputField,
} from './fields/simple-fields';
import { TenantRolesField } from './fields/tenant-roles-field';

const COL_SPAN_CLASS = { 2: 'md:col-span-2', 3: 'md:col-span-2 lg:col-span-3' };
const FULL_WIDTH_TYPES = ['tenant-roles', 'other-conditions'];

/**
 * One field of a contract editor. Picks the control by `field.type` and passes it the current value,
 * its error and the change handlers of the form.
 *   values: all form values, errors: react-hook-form errors, onChange(value), onPatch({...})
 */
export function ContractFormField({ field, values, errors, orderData, resetKey, onChange, onPatch }) {
  if (field.type === 'hidden') return null;

  const value = values[field.key];
  const error = errors[field.key]?.message;
  const common = { field, value, error, onChange };

  const controls = {
    locked: <LockedField field={field} value={value} />,
    'tenant-roles': <TenantRolesField values={values} errors={errors} onPatch={onPatch} />,
    'other-conditions': <OtherConditionsField values={values} errors={errors} onPatch={onPatch} />,
    textarea: <TextareaInputField {...common} />,
    segmented: <SegmentedInputField {...common} />,
    boolean: <BooleanInputField {...common} />,
    select: <SelectInputField {...common} values={values} orderData={orderData} />,
    date: <DateInputField {...common} values={values} resetKey={resetKey} />,
    file: <FileInputField {...common} resetKey={resetKey} />,
  };

  const spanClass = FULL_WIDTH_TYPES.includes(field.type) ? COL_SPAN_CLASS[3] : COL_SPAN_CLASS[field.colSpan];
  const control = field.locked ? controls.locked : (controls[field.type] ?? <TextInputField {...common} />);

  return <div className={cn(spanClass)}>{control}</div>;
}
