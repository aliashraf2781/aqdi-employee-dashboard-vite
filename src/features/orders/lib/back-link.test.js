import { describe, expect, it } from 'vitest';
import { isLeaseRenewalOrder, resolveBackLink } from './back-link';

describe('resolveBackLink', () => {
  it('goes back to the list that opened the order', () => {
    expect(resolveBackLink('/home/realtime-orders?x=1')).toEqual({ href: '/home/realtime-orders', label: 'الطلبات مباشر' });
    expect(resolveBackLink('/home/clients/5')).toEqual({ href: '/home/clients/5', label: 'العملاء' });
    expect(resolveBackLink('/home/return-orders')).toEqual({ href: '/home/return-orders', label: 'رجوع' });
  });

  it('defaults to the all-orders list', () => {
    expect(resolveBackLink(null)).toEqual({ href: '/home/orders', label: 'جميع الطلبات' });
    expect(resolveBackLink('https://elsewhere.com')).toEqual({ href: '/home/orders', label: 'جميع الطلبات' });
  });
});

describe('isLeaseRenewalOrder', () => {
  it('looks in the summary, deed step and order', () => {
    expect(isLeaseRenewalOrder({ contract_summary: { instrument_type_key: 'lease_renewal' } })).toBe(true);
    expect(isLeaseRenewalOrder({ step1: { instrument_type_key: 'lease_renewal' } })).toBe(true);
    expect(isLeaseRenewalOrder({ instrument_type_key: 'electronic' })).toBe(false);
    expect(isLeaseRenewalOrder(undefined)).toBe(false);
  });
});
