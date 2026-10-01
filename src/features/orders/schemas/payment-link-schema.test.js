import { describe, expect, it } from 'vitest';
import { buildPaymentLinkBody, paymentLinkDefaults, paymentLinkSchema } from './payment-link-schema';

const valid = { ...paymentLinkDefaults, mobile: '0512345678', amount: '349', period_id: '3' };

describe('paymentLinkSchema', () => {
  it('accepts valid values', () => {
    expect(paymentLinkSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a bad phone, amount and missing period', () => {
    const result = paymentLinkSchema.safeParse({ ...valid, mobile: '123', amount: '0', period_id: '' });
    expect(result.success).toBe(false);
    const fields = result.error.issues.map((issue) => issue.path[0]);
    expect(fields).toEqual(expect.arrayContaining(['mobile', 'amount', 'period_id']));
  });
});

describe('buildPaymentLinkBody', () => {
  it('adds the extra fee to the amount', () => {
    const body = buildPaymentLinkBody({ ...valid, extra_fee_id: '8', extra_fee_amount: 50, notes: ' hi ' });
    expect(body).toMatchObject({
      customer_mobile: '0512345678',
      contract_period_id: 3,
      amount: 399,
      payment_type_id: 8,
      notes: 'hi',
    });
  });

  it('leaves optional keys out without a fee or notes', () => {
    const body = buildPaymentLinkBody(valid);
    expect(body.amount).toBe(349);
    expect(body.payment_type_id).toBeUndefined();
    expect(body.notes).toBeUndefined();
  });
});
