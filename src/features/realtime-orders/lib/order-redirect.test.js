import { describe, expect, it } from 'vitest';
import { buildOrderRedirectPath } from './order-redirect';

describe('buildOrderRedirectPath', () => {
  it('adds the realtime screen as the back link', () => {
    expect(buildOrderRedirectPath('12', '')).toBe('/home/orders/12?from=%2Fhome%2Frealtime-orders');
  });

  it('keeps an existing from and other params', () => {
    expect(buildOrderRedirectPath('12', 'from=/home/clients&tab=2')).toBe('/home/orders/12?from=%2Fhome%2Fclients&tab=2');
  });
});
