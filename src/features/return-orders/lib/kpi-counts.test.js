import { describe, expect, it } from 'vitest';
import { resolveKpiCounts } from './kpi-counts';

describe('resolveKpiCounts', () => {
  it('prefers the global summary', () => {
    const refundsSummary = { summary: { management_approval: { pending: 4, approved: 1, rejected: 0 } } };
    expect(resolveKpiCounts({ refundsSummary, refundContracts: [], tableOrders: [] })).toEqual({ pending: 4, approved: 1, rejected: 0 });
  });

  it('counts every refund contract when the summary is empty', () => {
    const refundContracts = [{ id: 1, management_approval: { approved: true } }, { id: 2, management_approval: { approved: null } }];
    const counts = resolveKpiCounts({ refundsSummary: { summary: {} }, refundContracts, tableOrders: [] });
    expect(counts).toEqual({ pending: 1, approved: 1, rejected: 0 });
  });

  it('counts the page rows as the last resort', () => {
    const tableOrders = [{ return_request_status: 'rejected' }];
    expect(resolveKpiCounts({ refundsSummary: null, refundContracts: [], tableOrders }).rejected).toBe(1);
  });

  it('is null with no data at all', () => {
    expect(resolveKpiCounts({ refundsSummary: null, refundContracts: [], tableOrders: [] })).toBeNull();
  });
});
