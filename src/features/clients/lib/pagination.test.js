import { describe, expect, it } from 'vitest';
import { describeRange, paginate } from './pagination';

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, index) => index + 1);

  it('returns the requested window', () => {
    const result = paginate(items, 3, 10);
    expect(result.items).toEqual([21, 22, 23, 24, 25]);
    expect(result).toMatchObject({ currentPage: 3, lastPage: 3, start: 21, end: 25 });
  });

  it('clamps a page past the end back to the last page', () => {
    expect(paginate(items, 99, 10).currentPage).toBe(3);
  });

  it('handles an empty list', () => {
    expect(paginate([], 1, 10)).toMatchObject({ items: [], currentPage: 1, lastPage: 1, start: 0, end: 0 });
  });
});

describe('describeRange', () => {
  it('describes a full page and an empty list', () => {
    expect(describeRange(2, 25, 90)).toEqual({ start: 26, end: 50 });
    expect(describeRange(1, 25, 0)).toEqual({ start: 0, end: 0 });
  });
});
