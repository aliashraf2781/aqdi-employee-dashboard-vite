import { describe, expect, it } from 'vitest';
import { buildCouponPayload, couponToFormValues, isCouponActive, isPercentageCoupon } from './coupon';

describe('coupon helpers', () => {
  it('recognises percentage coupons from either API spelling', () => {
    expect(isPercentageCoupon({ type_coupon: 'ratio' })).toBe(true);
    expect(isPercentageCoupon({ type: 'percentage' })).toBe(true);
    expect(isPercentageCoupon({ type_coupon: 'value' })).toBe(false);
  });

  it('reads the active flag in all its shapes', () => {
    expect(isCouponActive({ is_active: 1 })).toBe(true);
    expect(isCouponActive({ is_active: '1' })).toBe(true);
    expect(isCouponActive({ is_active: 0 })).toBe(false);
  });

  it('maps a coupon to form values with date-only inputs', () => {
    const values = couponToFormValues({
      name: 'خصم',
      code_coupon: 'ABC',
      type_coupon: 'ratio',
      value_coupon: 10,
      date_start: '2026-01-01 00:00:00',
      date_end: '2026-02-01',
      usage: 50,
      usage_of_user: 2,
    });
    expect(values).toMatchObject({ type: 'percentage', value: '10', start_date: '2026-01-01', use_limit: '50' });
  });

  it('builds the API payload', () => {
    expect(
      buildCouponPayload({
        name: 'خصم',
        code: 'ABC',
        type: 'fixed',
        value: '25.5',
        start_date: '2026-01-01',
        end_date: '2026-02-01',
        use_limit: '100',
        user_use_limit: '1',
      }),
    ).toEqual({
      name: 'خصم',
      code_coupon: 'ABC',
      type_coupon: 'value',
      value_coupon: 25.5,
      date_start: '2026-01-01',
      date_end: '2026-02-01',
      usage: 100,
      usage_of_user: 1,
      is_review: true,
    });
  });
});
