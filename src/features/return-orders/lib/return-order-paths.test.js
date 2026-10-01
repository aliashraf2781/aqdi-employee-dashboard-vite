import { describe, expect, it } from 'vitest';
import { orderDetailsPath } from './return-order-paths';

describe('orderDetailsPath', () => {
  it('opens the orders details page with a back link', () => {
    expect(orderDetailsPath({ id: 9 })).toBe('/home/orders/9?from=%2Fhome%2Freturn-orders');
  });

  it('falls back to the uuid', () => {
    expect(orderDetailsPath({ uuid: 'AQ-1' })).toContain('/home/orders/AQ-1');
  });
});
