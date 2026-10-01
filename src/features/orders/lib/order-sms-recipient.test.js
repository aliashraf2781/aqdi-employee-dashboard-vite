import { describe, expect, it } from 'vitest';
import { resolveOrderSmsPhone, resolveOrderSmsUserId, resolveSmsRecipient } from './order-sms-recipient';

describe('sms recipient', () => {
  it('finds the user id in nested shapes', () => {
    expect(resolveOrderSmsUserId({ user: { id: 5 } })).toBe(5);
    expect(resolveOrderSmsUserId({ contract_summary: { user_id: '8' } })).toBe(8);
    expect(resolveOrderSmsUserId({ user_id: 0 })).toBeNull();
    expect(resolveOrderSmsUserId(null)).toBeNull();
  });

  it('finds the phone', () => {
    expect(resolveOrderSmsPhone({ user: { mobile: ' 0500000000 ' } })).toBe('0500000000');
    expect(resolveOrderSmsPhone({})).toBe('');
  });

  it('prefers the user id over the phone', () => {
    expect(resolveSmsRecipient({ user_id: 3, user_mobile: '0500000000' })).toEqual({ user_id: 3 });
    expect(resolveSmsRecipient({ user_mobile: '0500000000' })).toEqual({ mobile: '0500000000' });
    expect(resolveSmsRecipient({})).toBeNull();
  });
});
