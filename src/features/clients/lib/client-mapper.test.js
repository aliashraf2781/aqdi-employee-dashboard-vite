import { describe, expect, it } from 'vitest';
import { mapUserToClientRow, normalizeClientsListResponse } from './client-mapper';

describe('normalizeClientsListResponse', () => {
  it('reads items, pagination and summary labels from the envelope', () => {
    const response = {
      data: {
        data: {
          items: [{ id: 1 }],
          pagination: { current_page: 2, last_page: 5, total: 90, per_page: 25 },
          summary: { total_customers: 90, banned_label: 'محظورون' },
        },
      },
    };

    const result = normalizeClientsListResponse(response);

    expect(result.items).toEqual([{ id: 1 }]);
    expect(result.meta).toEqual({ currentPage: 2, lastPage: 5, total: 90, perPage: 25 });
    expect(result.summary.labels.banned).toBe('محظورون');
    expect(result.summary.labels.total_customers).toBe('إجمالي العملاء');
  });

  it('falls back to a single empty page when the payload is empty', () => {
    const result = normalizeClientsListResponse({ data: { data: {} } });

    expect(result.items).toEqual([]);
    expect(result.summary).toBeNull();
    expect(result.meta).toEqual({ currentPage: 1, lastPage: 1, total: 0, perPage: 0 });
  });
});

describe('mapUserToClientRow', () => {
  it('builds a client code from the id when there is no customer number', () => {
    expect(mapUserToClientRow({ id: 7 }).clientCode).toBe('C-7');
  });

  it('computes net as paid minus refunded when the API sends no net', () => {
    const row = mapUserToClientRow({ paid: '100', refunded: 30 });
    expect(row.net).toBe(70);
  });

  it('counts properties from a list when no count is sent', () => {
    expect(mapUserToClientRow({ real_estates: [{}, {}] }).properties).toBe(2);
  });

  it('treats a client as active unless the API says otherwise', () => {
    expect(mapUserToClientRow({}).isActive).toBe(true);
    expect(mapUserToClientRow({ is_active: 0 }).isActive).toBe(false);
  });
});
