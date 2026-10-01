import { describe, expect, it } from 'vitest';
import { buildAdminOrdersParams, extractOrdersPayload } from './admin-orders-query';

describe('buildAdminOrdersParams', () => {
  it('defaults to page 1 with 20 rows', () => {
    expect(buildAdminOrdersParams()).toEqual({ page: 1, per_page: 20 });
  });

  it('maps completion and status filters', () => {
    expect(buildAdminOrdersParams({ isCompleted: 1, statusId: 4, search: 'x' })).toEqual({
      page: 1,
      per_page: 20,
      search: 'x',
      status_id: 4,
      complete: 1,
    });
    expect(buildAdminOrdersParams({ isCompleted: 0 }).incomplete).toBe(1);
  });

  it('falls back to contractStatusId', () => {
    expect(buildAdminOrdersParams({ contractStatusId: 7 }).status_id).toBe(7);
  });
});

describe('extractOrdersPayload', () => {
  it('reads items and pagination', () => {
    const body = { data: { items: [{ id: 1 }], pagination: { total: 1 } } };
    expect(extractOrdersPayload(body)).toEqual({ items: [{ id: 1 }], pagination: { total: 1 }, summary: null });
  });

  it('returns empty lists for unknown shapes', () => {
    expect(extractOrdersPayload(null).items).toEqual([]);
  });
});
