import { toNumberOrNull } from '@/features/settings/schemas/common-schemas';

/** Form values -> request body. English name and price are only sent when filled. */
export function buildServicesPricingPayload(values) {
  const payload = { name_ar: values.name_ar.trim(), contract_type: values.contract_type };

  const nameEn = values.name_en.trim();
  if (nameEn) payload.name_en = nameEn;

  const price = toNumberOrNull(values.price);
  if (price != null) payload.price = price;

  return payload;
}
