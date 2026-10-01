import { describe, expect, it } from 'vitest';
import {
  getQuoteDetails,
  getServiceQuote,
  isHiddenAmount,
  isQuotePaid,
  paymentMethodLabel,
  paymentStatusLabel,
  roleInputLabel,
} from './financial-display';

describe('financial display helpers', () => {
  it('translates payment methods and statuses', () => {
    expect(paymentMethodLabel('MADA')).toBe('مدى');
    expect(paymentMethodLabel('other')).toBe('other');
    expect(paymentMethodLabel(null)).toBeNull();
    expect(paymentStatusLabel('success')).toBe('ناجح');
    expect(paymentStatusLabel('weird')).toBe('weird');
  });

  it('normalizes the daily fine label', () => {
    expect(roleInputLabel('مبلغ الغرامه  اليومي')).toBe('مبلغ الغرامة اليومية');
    expect(roleInputLabel('  نص ')).toBe('نص');
  });

  it('hides empty and zero amounts', () => {
    expect(isHiddenAmount(0)).toBe(true);
    expect(isHiddenAmount('0')).toBe(true);
    expect(isHiddenAmount('')).toBe(true);
    expect(isHiddenAmount('1,200')).toBe(false);
  });

  it('reads the quote from the financial step', () => {
    const order = { step6: { financial: { is_paid: 1, details: [{ key: 'a', amount: 5 }, { key: 'b', amount: 0 }] } } };
    const quote = getServiceQuote(order);
    expect(isQuotePaid(quote)).toBe(true);
    expect(getQuoteDetails(quote)).toEqual([{ key: 'a', amount: 5 }]);
    expect(getServiceQuote({})).toBeNull();
  });
});
