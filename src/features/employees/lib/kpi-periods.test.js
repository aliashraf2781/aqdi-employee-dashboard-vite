import { describe, expect, it } from 'vitest';
import { buildKpiParams, needsDateRange } from './kpi-periods';

describe('kpi periods', () => {
  it('only sends dates for a valid custom range', () => {
    expect(buildKpiParams('today', '2024-01-01', '2024-01-02')).toEqual({ period: 'today' });
    expect(buildKpiParams('custom', '2024-01-01', '2024-01-02')).toEqual({
      period: 'custom',
      date_from: '2024-01-01',
      date_to: '2024-01-02',
    });
  });

  it('asks for a range when custom is incomplete or reversed', () => {
    expect(needsDateRange('custom', '', '')).toBe(true);
    expect(needsDateRange('custom', '2024-02-01', '2024-01-01')).toBe(true);
    expect(needsDateRange('custom', '2024-01-01', '2024-01-02')).toBe(false);
    expect(needsDateRange('today', '', '')).toBe(false);
  });
});
