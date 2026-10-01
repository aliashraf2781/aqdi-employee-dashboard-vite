import { z } from 'zod';

const optionalNonNegativeNumber = z.preprocess(
  (value) => (value === '' || value == null ? undefined : value),
  z.coerce.number({ invalid_type_error: 'يجب إدخال رقم' }).min(0, 'القيمة لا يمكن أن تكون سالبة').optional(),
);

export const financialSettingsSchema = z.object({
  moyasar_fee_percent: optionalNonNegativeNumber,
  meter_fee: optionalNonNegativeNumber,
  monthly_salaries: optionalNonNegativeNumber,
  operating_budget: optionalNonNegativeNumber,
  marketing_budget: optionalNonNegativeNumber,
});
