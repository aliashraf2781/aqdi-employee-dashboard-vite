import { describe, expect, it } from 'vitest';
import { buildConversionRateItems, buildOperationalItems, buildPerformanceView } from './performance-view-model';

describe('performance view model', () => {
  it('reads renamed kpi fields', () => {
    const view = buildPerformanceView({ kpis: { documented_count: 4, revenue_total: 1200 } }, 'all');
    expect(view.kpis.find((kpi) => kpi.key === 'done').value).toBe('4');
    expect(view.kpis.find((kpi) => kpi.key === 'revenue').value).toBe('1,200');
  });

  it('builds conversion rates from a map when no rows are given', () => {
    const items = buildConversionRateItems({ rates: { cancel_percent: 3 } });
    expect(items).toHaveLength(6);
    expect(items.find((item) => item.label === 'معدّل الإلغاء').value).toBe('3%');
  });

  it('highlights slow queues', () => {
    const items = buildOperationalItems({ longest_wait_seconds: 3600, sla_percent: 50 });
    expect(items.find((item) => item.label === 'أطول انتظار حالي').tone).toBe('red');
    expect(items.find((item) => item.label.startsWith('نسبة الالتزام')).tone).toBe('gold');
  });

  it('chooses the title length for the daily chart', () => {
    expect(buildPerformanceView({}, 'today').dailyTitleDays).toBe(3);
    expect(buildPerformanceView({}, 'last_7_days').dailyTitleDays).toBe(7);
    expect(buildPerformanceView({ daily_orders: [{}, {}] }, 'all').dailyTitleDays).toBe(2);
  });

  it('falls back to the period label', () => {
    expect(buildPerformanceView({}, 'today').periodLabel).toBe('اليوم');
  });
});
