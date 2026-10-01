import { describe, expect, it } from 'vitest';
import {
  canRequestOrderReturn,
  countReturnOrdersByApproval,
  getReturnRequestExistsMessage,
  isOrderPaid,
  isReturnContractStatus,
} from './refund-status';
import { normalizeOrderForReturnRequest } from './return-request-order';

describe('refund status helpers', () => {
  it('detects paid orders from several fields', () => {
    expect(isOrderPaid({ is_paid: 1 })).toBe(true);
    expect(isOrderPaid({ contract_summary: { payment_status: 'paid' } })).toBe(true);
    expect(isOrderPaid({ is_paid: false })).toBe(false);
  });

  it('allows a return only for paid orders without a request', () => {
    expect(canRequestOrderReturn({ is_paid: true })).toBe(true);
    expect(canRequestOrderReturn({ is_paid: true, has_return_request: true })).toBe(false);
    expect(canRequestOrderReturn({ is_paid: false })).toBe(false);
  });

  it('recognises the return status by id or name', () => {
    expect(isReturnContractStatus({ id: 2 })).toBe(true);
    expect(isReturnContractStatus({ id: 9, name: 'مسترجع' })).toBe(true);
    expect(isReturnContractStatus({ id: 9, name: 'جديد' })).toBe(false);
  });

  it('picks the message by request status', () => {
    expect(getReturnRequestExistsMessage({ return_request_status: 'rejected' })).toContain('مرفوض');
  });

  it('counts approval buckets', () => {
    const counts = countReturnOrdersByApproval([
      { return_request_status: 'approved' },
      { return_request_status: 'rejected' },
      {},
    ]);
    expect(counts).toEqual({ pending: 1, approved: 1, rejected: 1 });
  });
});

describe('normalizeOrderForReturnRequest', () => {
  it('copies summary payment info onto a table row', () => {
    const order = normalizeOrderForReturnRequest({ id: 5, uuid: 'u', contract_summary: { is_paid: true } }, 5);
    expect(order.is_paid).toBe(true);
    expect(order.contract_id).toBe(5);
  });
});
