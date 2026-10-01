import { describe, expect, it } from 'vitest';
import {
  buildRefundsLookup,
  canShowReturnOrderApproval,
  ensureReturnOrderRefund,
  findRefundInLookup,
  findRefundItemForOrder,
  resolveRefundActionKey,
  resolveRefundIdForAction,
} from './refund-lookup';

const REFUND_ITEM = {
  id: 55,
  contract_id: 7,
  refund_amount: 300,
  management_approval: { approved: null },
  contract: { id: 7, uuid: 'AQ-7', contract_type: 'سكني', user: { phone: '0501111111' } },
};

describe('refund lookup', () => {
  const lookup = buildRefundsLookup([REFUND_ITEM]);

  it('indexes a refund by uuid, contract id and mobile', () => {
    expect(lookup.get('AQ-7').id).toBe(55);
    expect(lookup.get(7).id).toBe(55);
    expect(lookup.get('0501111111').id).toBe(55);
  });

  it('skips items without an identifier', () => {
    expect(buildRefundsLookup([{}, null]).size).toBe(0);
  });

  it('finds the refund of an order by uuid or by contract id', () => {
    expect(findRefundInLookup({ uuid: 'AQ-7' }, lookup).id).toBe(55);
    expect(findRefundInLookup({ id: 7 }, lookup).id).toBe(55);
    expect(findRefundInLookup({ uuid: 'other' }, lookup)).toBeNull();
  });

  it('does not match two rows that both lack an identifier', () => {
    const noIds = buildRefundsLookup([{ id: 1, contract: { uuid: 'X' } }]);
    expect(findRefundInLookup({ uuid: 'Y' }, noIds)).toBeNull();
  });
});

describe('refund ids', () => {
  const lookup = buildRefundsLookup([REFUND_ITEM]);

  it('prefers the numeric refund record id', () => {
    expect(resolveRefundIdForAction({ uuid: 'AQ-7' }, null, lookup)).toBe('55');
  });

  it('falls back to the order uuid', () => {
    expect(resolveRefundIdForAction({ uuid: 'AQ-9' }, null, new Map())).toBe('AQ-9');
  });

  it('looks through raw refund items before using the uuid', () => {
    expect(resolveRefundActionKey({ id: 7 }, null, new Map(), [REFUND_ITEM])).toBe('55');
  });

  it('picks the pending item when several match', () => {
    const approved = { ...REFUND_ITEM, id: 1, admin_confirmed: true };
    const pending = { ...REFUND_ITEM, id: 2, admin_confirmed: null };
    expect(findRefundItemForOrder({ uuid: 'AQ-7' }, [approved, pending]).id).toBe(2);
  });
});

describe('ensureReturnOrderRefund', () => {
  it('returns a refund for a row the lookup does not know', () => {
    const refund = ensureReturnOrderRefund({ id: 3, uuid: 'AQ-3', refund_amount: 90 }, new Map());
    expect(refund.orderUuid).toBe('AQ-3');
    expect(refund.refundAmount).toBe(90);
  });

  it('is null without an order', () => {
    expect(ensureReturnOrderRefund(null, new Map())).toBeNull();
  });
});

describe('canShowReturnOrderApproval', () => {
  const order = { uuid: 'AQ-7', has_return_request: true, refund_amount: 10 };

  it('allows a pending return request', () => {
    expect(canShowReturnOrderApproval(order, { id: 55 })).toBe(true);
  });

  it('hides it once the customer is refunded', () => {
    expect(canShowReturnOrderApproval({ ...order, customer_refunded: true }, { id: 55 })).toBe(false);
  });
});
