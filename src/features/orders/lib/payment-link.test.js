import { describe, expect, it } from 'vitest';
import { assertPaymentLinkResult, normalizePaymentLinkPayload } from './payment-link';

describe('normalizePaymentLinkPayload', () => {
  it('finds the url at any level', () => {
    expect(normalizePaymentLinkPayload({ data: { record: { payment_url: 'u' } } }).paymentUrl).toBe('u');
    expect(normalizePaymentLinkPayload({ Payment_url: 'v' }).paymentUrl).toBe('v');
  });

  it('flags already paid contracts', () => {
    expect(normalizePaymentLinkPayload({ data: { is_paid: 1 } }).alreadyPaid).toBe(true);
    expect(normalizePaymentLinkPayload({}).alreadyPaid).toBe(false);
  });

  it('falls back to the given uuid', () => {
    expect(normalizePaymentLinkPayload({}, { fallbackUuid: 'abc' }).contractUuid).toBe('abc');
  });
});

describe('assertPaymentLinkResult', () => {
  it('throws without a link', () => {
    expect(() => assertPaymentLinkResult({ paymentUrl: null, alreadyPaid: false }, {})).toThrow();
  });

  it('passes a link through', () => {
    const result = { paymentUrl: 'u', alreadyPaid: false };
    expect(assertPaymentLinkResult(result, {})).toBe(result);
  });
});
