import { describe, expect, it } from 'vitest';
import {
  buildEmployeeOptions,
  buildReportParams,
  extractListItems,
  hasValidDateRange,
  resolveFilterValue,
  toApiPeriod,
} from './report-filters';

describe('report filters', () => {
  it('falls back to "all" for unknown periods', () => {
    expect(toApiPeriod('weird')).toBe('all');
    expect(toApiPeriod('today')).toBe('today');
  });

  it('only sends filters that are set', () => {
    expect(buildReportParams({ period: 'all', contractType: 'all', employee: 'all' })).toEqual({ period: 'all' });
    expect(
      buildReportParams({
        period: 'custom',
        dateFrom: '2026-01-01',
        dateTo: '2026-01-31',
        contractType: 'housing',
        employee: '4',
      }),
    ).toEqual({
      period: 'custom',
      date_from: '2026-01-01',
      date_to: '2026-01-31',
      contract_type: 'housing',
      employee_id: '4',
    });
  });

  it('validates custom ranges', () => {
    expect(hasValidDateRange({ period: 'today' })).toBe(true);
    expect(hasValidDateRange({ period: 'custom', dateFrom: '2026-02-01', dateTo: '2026-01-01' })).toBe(false);
    expect(hasValidDateRange({ period: 'custom', dateFrom: '2026-01-01', dateTo: '2026-02-01' })).toBe(true);
  });

  it('resolves stale values', () => {
    const options = [{ id: 'all' }, { id: '5' }];
    expect(resolveFilterValue('5', options)).toBe('5');
    expect(resolveFilterValue('9', options)).toBe('all');
    expect(resolveFilterValue('', options)).toBe('all');
  });

  it('builds employee options with a fallback label', () => {
    const options = buildEmployeeOptions([{ id: 1, name: ' سعد ' }, { id: 2 }, { name: 'x' }]);
    expect(options.map((option) => option.label)).toEqual(['كل الموظفين', 'سعد', 'موظف #2']);
  });

  it('extracts list items from every known shape', () => {
    expect(extractListItems({ data: { items: [1] } })).toEqual([1]);
    expect(extractListItems({ data: [2] })).toEqual([2]);
    expect(extractListItems({ items: [3] })).toEqual([3]);
    expect(extractListItems(null)).toEqual([]);
  });
});
