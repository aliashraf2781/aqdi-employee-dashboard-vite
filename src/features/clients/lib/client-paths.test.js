import { describe, expect, it } from 'vitest';
import { clientPath, resolveBackPath, withFrom } from './client-paths';

describe('withFrom', () => {
  it('encodes the origin path into the query string', () => {
    expect(withFrom('/home/clients/5/discount', '/home/clients/5?from=%2Fhome%2Fclients')).toBe(
      '/home/clients/5/discount?from=%2Fhome%2Fclients%2F5%3Ffrom%3D%252Fhome%252Fclients',
    );
  });
});

describe('resolveBackPath', () => {
  it('accepts an in-app path', () => {
    expect(resolveBackPath('/home/orders', clientPath(1))).toBe('/home/orders');
  });

  it('falls back for missing, external or protocol-relative values', () => {
    expect(resolveBackPath(null, '/x')).toBe('/x');
    expect(resolveBackPath('https://evil.test', '/x')).toBe('/x');
    expect(resolveBackPath('//evil.test', '/x')).toBe('/x');
  });
});
