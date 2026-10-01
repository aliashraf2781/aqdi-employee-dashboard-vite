import { describe, expect, it } from 'vitest';
import { buildApprovalDefaults, needsRefundAmountInput, refundApprovalSchema } from './refund-approval-schema';

describe('refundApprovalSchema', () => {
  it('accepts a positive amount', () => {
    expect(refundApprovalSchema.safeParse({ refund_amount: '150.5', notes: '' }).success).toBe(true);
  });

  it.each(['', '0', '-3', 'abc'])('rejects %j', (value) => {
    expect(refundApprovalSchema.safeParse({ refund_amount: value }).success).toBe(false);
  });
});

describe('buildApprovalDefaults', () => {
  it('prefills the amount and the default note', () => {
    expect(buildApprovalDefaults({ refundAmount: 300 })).toEqual({ refund_amount: '300', notes: 'تم التحويل' });
  });

  it('keeps the note of the request', () => {
    expect(buildApprovalDefaults({ notes: ' سبب ' }).notes).toBe('سبب');
  });
});

describe('needsRefundAmountInput', () => {
  it('asks for the amount only when it is missing or not positive', () => {
    expect(needsRefundAmountInput({ refundAmount: 100 })).toBe(false);
    expect(needsRefundAmountInput({ refundAmount: 0 })).toBe(true);
    expect(needsRefundAmountInput({})).toBe(true);
  });
});
