import { describe, expect, it } from 'vitest';
import { normalizeEmployeesResponse } from './employees-response';

describe('normalizeEmployeesResponse', () => {
  it('reads the items + pagination shape', () => {
    const body = { data: { items: [{ id: 1 }], pagination: { last_page: 3 } } };
    expect(normalizeEmployeesResponse(body)).toEqual({ items: [{ id: 1 }], pagination: { last_page: 3 } });
  });

  it('reads the laravel paginator shape', () => {
    const body = { data: { data: [{ id: 2 }], current_page: 2, last_page: 4, total: 30, per_page: 10 } };
    const result = normalizeEmployeesResponse(body);
    expect(result.items).toEqual([{ id: 2 }]);
    expect(result.pagination).toEqual({ current_page: 2, last_page: 4, total: 30, per_page: 10 });
  });

  it('returns empty values for unknown bodies', () => {
    expect(normalizeEmployeesResponse({})).toEqual({ items: [], pagination: null });
  });
});
