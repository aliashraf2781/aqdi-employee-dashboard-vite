import { describe, expect, it } from 'vitest';
import { DEFAULT_BACK_URL, isClientFileRoute, resolveBackUrl } from './user-route';

describe('user route helpers', () => {
  it('detects client file routes', () => {
    expect(isClientFileRoute('c-5', DEFAULT_BACK_URL)).toBe(true);
    expect(isClientFileRoute('5', '/home/clients')).toBe(true);
    expect(isClientFileRoute('5', DEFAULT_BACK_URL)).toBe(false);
  });

  it('keeps paths and expands report segments', () => {
    expect(resolveBackUrl('/home/clients')).toBe('/home/clients');
    expect(resolveBackUrl('active')).toBe('/home/reports?tab=users&segment=active');
  });
});
