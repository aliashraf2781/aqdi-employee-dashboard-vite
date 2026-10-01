import { describe, expect, it } from 'vitest';
import { pick } from './pick';

describe('pick', () => {
  it('skips null, undefined and empty strings but keeps 0 and false', () => {
    expect(pick(null, undefined, '', 0, 5)).toBe(0);
    expect(pick(null, false)).toBe(false);
  });

  it('returns null when nothing matches', () => {
    expect(pick()).toBeNull();
    expect(pick(null, '')).toBeNull();
  });
});
