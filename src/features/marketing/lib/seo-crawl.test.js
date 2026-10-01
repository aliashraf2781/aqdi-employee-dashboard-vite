import { describe, expect, it } from 'vitest';
import { getCrawlPercent, isCrawlFinished, isCrawlInProgress } from './seo-crawl';

describe('crawl status helpers', () => {
  it('knows which statuses are running or finished', () => {
    expect(isCrawlInProgress('queued')).toBe(true);
    expect(isCrawlInProgress('running')).toBe(true);
    expect(isCrawlInProgress('completed')).toBe(false);
    expect(isCrawlFinished('failed')).toBe(true);
    expect(isCrawlFinished('running')).toBe(false);
  });
});

describe('getCrawlPercent', () => {
  it('is zero without a total and capped at 100', () => {
    expect(getCrawlPercent(null)).toBe(0);
    expect(getCrawlPercent({ pages_crawled: 5 })).toBe(0);
    expect(getCrawlPercent({ pages_crawled: 5, pages_total: 20 })).toBe(25);
    expect(getCrawlPercent({ pages_crawled: 30, pages_total: 20 })).toBe(100);
  });
});
