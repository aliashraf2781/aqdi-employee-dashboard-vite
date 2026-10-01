import { describe, expect, it } from 'vitest';
import { pickItems, pickLastPage, pickTotal } from './list-response';

describe('pickItems', () => {
  it('reads data.items', () => {
    expect(pickItems({ data: { items: [1, 2] } })).toEqual([1, 2]);
  });

  it('reads items, data and bare arrays', () => {
    expect(pickItems({ items: [1] })).toEqual([1]);
    expect(pickItems({ data: [2] })).toEqual([2]);
    expect(pickItems([3])).toEqual([3]);
  });

  it('falls back to an empty array', () => {
    expect(pickItems(undefined)).toEqual([]);
    expect(pickItems({ data: { items: 'x' } })).toEqual([]);
  });
});

describe('pagination helpers', () => {
  it('reads last page and total', () => {
    const body = { data: { items: [], pagination: { last_page: 4, total: 31 } } };
    expect(pickLastPage(body)).toBe(4);
    expect(pickTotal(body)).toBe(31);
  });

  it('returns null without pagination', () => {
    expect(pickLastPage({ data: { items: [] } })).toBeNull();
    expect(pickTotal({})).toBeNull();
  });
});
