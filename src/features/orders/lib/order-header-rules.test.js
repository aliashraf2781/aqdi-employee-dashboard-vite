import { describe, expect, it } from 'vitest';
import {
  canOfferPaymentLink,
  getSelectableStatuses,
  getVisibleHeaderActions,
  hasPropertyUpdate,
  HEADER_ACTIONS,
  isDocumentedStatus,
  isEjarDocumentationStatus,
  isReturnRequestDecided,
} from './order-header-rules';

const paid = { is_paid: true, status_name: 'جديد' };
const unpaid = { is_paid: false, status_name: 'جديد' };

describe('status helpers', () => {
  it('recognises documented statuses', () => {
    expect(isDocumentedStatus({ name: 'تم التوثيق' })).toBe(true);
    expect(isDocumentedStatus({ name: 'جديد' })).toBe(false);
    expect(isEjarDocumentationStatus({ name: 'توثيق العقد في إيجار' })).toBe(true);
    expect(isEjarDocumentationStatus({})).toBe(false);
  });
});

describe('return request state', () => {
  it('treats approved, rejected and refunded as decided', () => {
    expect(isReturnRequestDecided({ return_request_status: 'approved' })).toBe(true);
    expect(isReturnRequestDecided({ customer_refunded: 1 })).toBe(true);
    expect(isReturnRequestDecided({ has_return_request: true, return_request_status: 'pending', management_approval: { approved: false } })).toBe(true);
    expect(isReturnRequestDecided({ has_return_request: true, return_request_status: 'pending' })).toBe(false);
    expect(isReturnRequestDecided(null)).toBe(false);
  });
});

describe('header actions', () => {
  it('offers a pay link only for unpaid, not yet documented orders', () => {
    expect(canOfferPaymentLink(unpaid)).toBe(true);
    expect(canOfferPaymentLink(paid)).toBe(false);
    expect(canOfferPaymentLink({ is_paid: false, status_name: 'تم التوثيق' })).toBe(false);
  });

  it('hides refund and ejar actions for unpaid orders', () => {
    const unpaidActions = getVisibleHeaderActions(unpaid, {});
    expect(unpaidActions).toContain(HEADER_ACTIONS.PAY_LINK);
    expect(unpaidActions).not.toContain(HEADER_ACTIONS.REFUND);
    expect(unpaidActions).not.toContain(HEADER_ACTIONS.EJAR_DOCUMENTATION);

    const paidActions = getVisibleHeaderActions(paid, { is_paid: true });
    expect(paidActions).toEqual(expect.arrayContaining([HEADER_ACTIONS.REFUND, HEADER_ACTIONS.EJAR_DOCUMENTATION]));
    expect(paidActions).not.toContain(HEADER_ACTIONS.PAY_LINK);
  });

  it('hides the refund action once decided', () => {
    const actions = getVisibleHeaderActions(paid, { is_paid: true, return_request_status: 'approved' });
    expect(actions).not.toContain(HEADER_ACTIONS.REFUND);
  });

  it('detects a property update', () => {
    expect(hasPropertyUpdate({ extras: { deed_addition_method: 'paper' } })).toBe(true);
    expect(hasPropertyUpdate({})).toBe(false);
  });
});

describe('getSelectableStatuses', () => {
  const statuses = [{ id: 1, name: 'جديد' }, { id: 2, name: 'استرجاع' }, { id: 9, name: 'تم التوثيق' }];

  it('removes return and documented statuses for unpaid orders', () => {
    expect(getSelectableStatuses(statuses, unpaid, {}).map((status) => status.id)).toEqual([1]);
  });

  it('keeps them for paid orders, except return once decided', () => {
    expect(getSelectableStatuses(statuses, paid, { is_paid: true })).toHaveLength(3);
    expect(getSelectableStatuses(statuses, paid, { is_paid: true, return_request_status: 'rejected' }).map((status) => status.id)).toEqual([1, 9]);
  });
});
