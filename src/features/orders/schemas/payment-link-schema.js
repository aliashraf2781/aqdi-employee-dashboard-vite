import { z } from 'zod';
import { zodSaudiMobile } from '../lib/saudi-contact';

export const NO_EXTRA_FEE = 'none';

export const paymentLinkSchema = z.object({
  mobile: zodSaudiMobile(z),
  amount: z.string().refine((value) => Number(value) > 0, 'يرجى إدخال مبلغ صحيح'),
  contract_type: z.enum(['housing', 'commercial']),
  period_id: z.string().min(1, 'يرجى اختيار عدد سنوات العقد'),
  extra_fee_id: z.string(),
  // Filled by the form from the selected fee, so the amount can include it.
  extra_fee_amount: z.number(),
  notes: z.string().optional(),
});

export const paymentLinkDefaults = {
  mobile: '',
  amount: '',
  contract_type: 'housing',
  period_id: '',
  extra_fee_id: NO_EXTRA_FEE,
  extra_fee_amount: 0,
  notes: '',
};

/** Request body of POST /admin/contract-paid-by-employees. The extra fee is added to the amount. */
export function buildPaymentLinkBody(values) {
  const extraAmount = Number(values.extra_fee_amount) || 0;
  const hasExtraFee = values.extra_fee_id !== NO_EXTRA_FEE && values.extra_fee_id;

  return {
    customer_mobile: values.mobile.trim(),
    contract_type: values.contract_type,
    contract_period_id: Number(values.period_id),
    amount: Number(values.amount) + extraAmount,
    notes: values.notes?.trim() || undefined,
    payment_type_id: hasExtraFee ? Number(values.extra_fee_id) : undefined,
  };
}
