import { z } from 'zod';

export const DEED_ADDITION_METHODS = [
  { value: 'electronic', label: 'إلكتروني' },
  { value: 'paper', label: 'ورقي' },
  { value: 'other', label: 'أخرى' },
];

export const propertyUpdateSchema = z.object({
  method: z.enum(['electronic', 'paper', 'other'], { errorMap: () => ({ message: 'الرجاء تحديد طريقة الإضافة' }) }),
  deed_number: z.string().trim().min(1, 'الرجاء إدخال رقم الصك'),
});

const firstText = (...values) => values.map((value) => (value == null ? '' : String(value).trim())).find(Boolean) ?? '';

/** The deed number already saved for the order, offered as the starting value. */
export function resolveDeedNumber(orderData) {
  return firstText(
    orderData?.status_case?.deed_number,
    orderData?.deed_number,
    orderData?.real_estate?.instrument_number,
    orderData?.real_estate?.deed_number,
    orderData?.instrument_number,
    orderData?.contract_summary?.instrument_number,
    orderData?.contract_summary?.deed_number,
  );
}
