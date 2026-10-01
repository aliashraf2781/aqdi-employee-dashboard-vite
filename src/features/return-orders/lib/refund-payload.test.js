import { describe, expect, it } from 'vitest';
import { extractRefundItemsFromApi, extractRefundsContractsPayload, parseManagementApprovalCounts } from './refund-payload';

describe('extractRefundItemsFromApi', () => {
  it('reads every known response shape', () => {
    const list = [{ id: 1 }];
    expect(extractRefundItemsFromApi(list)).toEqual(list);
    expect(extractRefundItemsFromApi({ data: list })).toEqual(list);
    expect(extractRefundItemsFromApi({ data: { contracts: list } })).toEqual(list);
    expect(extractRefundItemsFromApi({ data: { items: list } })).toEqual(list);
    expect(extractRefundItemsFromApi({ contracts: list })).toEqual(list);
  });

  it('returns an empty list for nothing usable', () => {
    expect(extractRefundItemsFromApi(null)).toEqual([]);
    expect(extractRefundItemsFromApi({ data: {} })).toEqual([]);
  });
});

describe('extractRefundsContractsPayload', () => {
  it('returns items, pagination and summary', () => {
    const payload = extractRefundsContractsPayload({
      data: { contracts: [{ id: 1 }], pagination: { last_page: 3 }, summary: { management_approval: { pending: 2 } } },
    });
    expect(payload.contracts).toHaveLength(1);
    expect(payload.pagination.last_page).toBe(3);
    expect(payload.managementApproval).toEqual({ pending: 2 });
  });
});

describe('parseManagementApprovalCounts', () => {
  it('reads the three counters', () => {
    expect(parseManagementApprovalCounts({ management_approval: { pending: 1, approved: 2, rejected: '3' } })).toEqual({
      pending: 1,
      approved: 2,
      rejected: 3,
    });
  });

  it('folds legacy refunded and processing counts into approved', () => {
    expect(parseManagementApprovalCounts({ approved: 1, refunded: 2, processing: 3 }).approved).toBe(6);
  });

  it('is zero for an empty summary', () => {
    expect(parseManagementApprovalCounts(undefined)).toEqual({ pending: 0, approved: 0, rejected: 0 });
  });
});
