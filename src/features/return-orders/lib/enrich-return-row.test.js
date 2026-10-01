import { describe, expect, it } from 'vitest';
import { enrichOrderWithRefundApproval, resolveReturnRequestStatus } from './enrich-return-row';

describe('resolveReturnRequestStatus', () => {
  it('is approved when the customer was refunded or the admin approved', () => {
    expect(resolveReturnRequestStatus({ customerRefunded: 1 })).toBe('approved');
    expect(resolveReturnRequestStatus({ adminConfirmed: true })).toBe('approved');
  });

  it('is rejected when the admin declined', () => {
    expect(resolveReturnRequestStatus({ adminConfirmed: false })).toBe('rejected');
  });

  it('keeps a known existing status and maps refunded to approved', () => {
    expect(resolveReturnRequestStatus({ adminConfirmed: null, existing: 'rejected' })).toBe('rejected');
    expect(resolveReturnRequestStatus({ adminConfirmed: null, existing: 'refunded' })).toBe('approved');
  });

  it('defaults to pending', () => {
    expect(resolveReturnRequestStatus({ adminConfirmed: null, existing: 'weird' })).toBe('pending');
  });
});

describe('enrichOrderWithRefundApproval', () => {
  it('writes the approval of the row onto the row', () => {
    const row = enrichOrderWithRefundApproval({ id: 1, uuid: 'AQ-1', admin_confirmed: true, refund_amount: 5 }, new Map());
    expect(row.return_request_status).toBe('approved');
    expect(row.admin_confirmed).toBe(true);
  });

  it('passes an empty row through', () => {
    expect(enrichOrderWithRefundApproval(null, new Map())).toBeNull();
  });
});
