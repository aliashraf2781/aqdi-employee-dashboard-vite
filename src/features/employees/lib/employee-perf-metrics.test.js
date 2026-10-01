import { describe, expect, it } from 'vitest';
import { computeEmployeePerfMetrics, findKpiCard, getPerfTone } from './employee-perf-metrics';

const card = (key, value) => ({ key, value });

describe('computeEmployeePerfMetrics', () => {
  it('scores zero when there was no activity', () => {
    const metrics = computeEmployeePerfMetrics({ cards: [] }, 10);
    expect(metrics.score).toBe(0);
    expect(metrics.pickPct).toBe(0);
    expect(metrics.procPct).toBe(0);
  });

  it('weights pick-up, processing and volume', () => {
    const item = {
      cards: [card('received', 10), card('open_now', 4), card('completed', 5), card('late_over_24h', 1)],
      receive_sla: { total: 10, within: 8 },
    };
    const metrics = computeEmployeePerfMetrics(item, 10);
    expect(metrics.pickPct).toBe(80);
    expect(metrics.procPct).toBe(75);
    expect(metrics.volPct).toBe(50);
    expect(metrics.score).toBe(72);
  });

  it('prefers a score sent by the server', () => {
    expect(computeEmployeePerfMetrics({ cards: [card('received', 1)], score: 91 }, 1).score).toBe(91);
  });

  it('finds cards by key', () => {
    expect(findKpiCard({ cards: [card('a', 1)] }, 'a')?.value).toBe(1);
  });
});

describe('getPerfTone', () => {
  it('maps thresholds', () => {
    expect(getPerfTone(80)).toBe('success');
    expect(getPerfTone(60)).toBe('warning');
    expect(getPerfTone(10)).toBe('danger');
  });
});
