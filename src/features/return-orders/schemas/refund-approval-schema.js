import { z } from 'zod';

export const refundApprovalSchema = z.object({
  refund_amount: z
    .string()
    .trim()
    .min(1, 'يرجى إدخال قيمة المبلغ المسترجع')
    .refine((value) => Number.isFinite(Number(value)) && Number(value) > 0, 'قيمة المبلغ المسترجع غير صالحة'),
  notes: z.string().optional(),
});

export const DEFAULT_APPROVAL_NOTES = 'تم التحويل';

/** Form values of the approval dialog, prefilled from the refund request. */
export function buildApprovalDefaults(refund) {
  const amount = refund?.refundAmount;
  return {
    refund_amount: amount != null && amount !== '' ? String(amount) : '',
    notes: refund?.notes?.trim() || DEFAULT_APPROVAL_NOTES,
  };
}

/** The amount input is only shown when the request did not carry a usable amount. */
export function needsRefundAmountInput(refund) {
  return !(Number(refund?.refundAmount) > 0);
}
