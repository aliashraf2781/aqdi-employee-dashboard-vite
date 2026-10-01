import { describe, expect, it } from 'vitest';
import { formatWaiting, getReceivedUrgency, getWaitingSeverity } from './waiting-time';

describe('formatWaiting', () => {
  it('says now for less than a minute', () => {
    expect(formatWaiting(0)).toBe('الآن');
  });

  it('joins days, hours and minutes', () => {
    expect(formatWaiting(1440 + 120 + 5)).toBe('1 يوم و 2 ساعات و 5 دقيقة');
  });

  it('uses the singular forms', () => {
    expect(formatWaiting(61)).toBe('1 ساعة و دقيقة واحدة');
  });
});

describe('getWaitingSeverity', () => {
  it('grows from ok to warning to critical', () => {
    expect(getWaitingSeverity(14)).toBe('ok');
    expect(getWaitingSeverity(15)).toBe('warning');
    expect(getWaitingSeverity(30)).toBe('critical');
  });
});

describe('getReceivedUrgency', () => {
  const now = new Date('2026-01-10T12:00:00Z').getTime();
  it('is ok under 3 hours, warning under a day, critical after', () => {
    expect(getReceivedUrgency('2026-01-10T11:00:00Z', now)).toBe('ok');
    expect(getReceivedUrgency('2026-01-10T08:00:00Z', now)).toBe('warning');
    expect(getReceivedUrgency('2026-01-09T08:00:00Z', now)).toBe('critical');
  });
});
