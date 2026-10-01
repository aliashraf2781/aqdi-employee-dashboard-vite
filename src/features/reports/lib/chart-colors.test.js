import { describe, expect, it } from 'vitest';
import { chartBarClass } from './chart-colors';

describe('chartBarClass', () => {
  it('cycles through the palette', () => {
    expect(chartBarClass(0)).toBe('bg-chart-1');
    expect(chartBarClass(6)).toBe('bg-chart-1');
  });

  it('uses the danger color for negative values', () => {
    expect(chartBarClass(2, -5)).toBe('bg-danger');
  });
});
