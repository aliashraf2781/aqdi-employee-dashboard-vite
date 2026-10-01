import { describe, expect, it } from 'vitest';
import { filterByStatus } from './payment-filters';

const payments = [{ id: 1, status: 'success' }, { id: 2, status: 'failed' }];

describe('filterByStatus', () => {
  it('keeps everything for an empty status', () => {
    expect(filterByStatus(payments, '')).toHaveLength(2);
  });

  it('keeps only matching payments', () => {
    expect(filterByStatus(payments, 'failed')).toEqual([{ id: 2, status: 'failed' }]);
  });
});
