import { describe, expect, it } from 'vitest';
import { returnRequestDefaults, returnRequestSchema } from './return-request-schema';

describe('returnRequestSchema', () => {
  it('requires an amount', () => {
    const result = returnRequestSchema.safeParse(returnRequestDefaults);
    expect(result.error.issues[0].message).toBe('يرجى إدخال قيمة المبلغ المسترجع');
  });

  it('requires a positive number', () => {
    const result = returnRequestSchema.safeParse({ ...returnRequestDefaults, refund_amount: '-5' });
    expect(result.error.issues[0].message).toBe('يرجى إدخال قيمة مبلغ مسترجع صحيحة');
    expect(returnRequestSchema.safeParse({ ...returnRequestDefaults, refund_amount: 'abc' }).success).toBe(false);
  });

  it('accepts a valid amount', () => {
    expect(returnRequestSchema.safeParse({ ...returnRequestDefaults, refund_amount: '120.5' }).success).toBe(true);
  });
});
