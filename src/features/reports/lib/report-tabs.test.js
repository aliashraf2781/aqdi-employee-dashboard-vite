import { describe, expect, it } from 'vitest';
import { resolveReportTab } from './report-tabs';

describe('resolveReportTab', () => {
  it('keeps known tabs', () => expect(resolveReportTab('sales')).toBe('sales'));
  it('maps legacy names', () => expect(resolveReportTab('staff')).toBe('employees'));
  it('falls back to orders', () => {
    expect(resolveReportTab('nope')).toBe('orders');
    expect(resolveReportTab(null)).toBe('orders');
  });
});
