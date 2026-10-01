import { describe, expect, it } from 'vitest';
import { buildPeriodSearchParams, DEFAULT_PERIOD, resolvePeriod } from './period';

describe('resolvePeriod', () => {
  it('defaults to the last 30 days', () => {
    expect(resolvePeriod({}).queryParams).toEqual({ period: DEFAULT_PERIOD });
    expect(resolvePeriod({ rawPeriod: 'nonsense' }).period).toBe(DEFAULT_PERIOD);
  });

  it('accepts a known period', () => {
    expect(resolvePeriod({ rawPeriod: 'today' }).queryParams).toEqual({ period: 'today' });
  });

  it('sends the custom range only when both dates are valid and ordered', () => {
    const full = resolvePeriod({ rawPeriod: 'custom', rawFrom: '2025-01-01', rawTo: '2025-01-31' });
    expect(full.queryParams).toEqual({ period: 'custom', date_from: '2025-01-01', date_to: '2025-01-31' });

    const partial = resolvePeriod({ rawPeriod: 'custom', rawFrom: '2025-01-01' });
    expect(partial.isCustom).toBe(true);
    expect(partial.queryParams).toEqual({ period: DEFAULT_PERIOD });

    const reversed = resolvePeriod({ rawPeriod: 'custom', rawFrom: '2025-02-01', rawTo: '2025-01-01' });
    expect(reversed.queryParams).toEqual({ period: DEFAULT_PERIOD });
  });
});

describe('buildPeriodSearchParams', () => {
  it('keeps unrelated params and drops the default period', () => {
    const params = buildPeriodSearchParams('tab=seo&mkt_period=today&mkt_from=2025-01-01', { period: DEFAULT_PERIOD });
    expect(params.toString()).toBe('tab=seo');
  });

  it('writes the custom range', () => {
    const params = buildPeriodSearchParams('tab=seo', { period: 'custom', dateFrom: '2025-01-01', dateTo: null });
    expect(params.get('mkt_period')).toBe('custom');
    expect(params.get('mkt_from')).toBe('2025-01-01');
    expect(params.has('mkt_to')).toBe(false);
  });
});
